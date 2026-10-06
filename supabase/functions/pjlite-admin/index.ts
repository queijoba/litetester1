import { createClient } from 'npm:@supabase/supabase-js@2.95.0'

const ADMIN_EMAIL = 'nickreisgg55@gmail.com'
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' },
  })

const readNamedKey = (envName: string) => {
  const raw = Deno.env.get(envName)
  if (!raw) return ''
  try {
    const parsed = JSON.parse(raw)
    return String(parsed?.default || Object.values(parsed || {})[0] || '')
  } catch {
    return raw
  }
}

const ms = (value?: string | null) => {
  const parsed = Date.parse(String(value || ''))
  return Number.isFinite(parsed) ? parsed : 0
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405)

  try {
    const authHeader = req.headers.get('Authorization') || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
    if (!token) return json({ error: 'not_authenticated' }, 401)

    const url = Deno.env.get('SUPABASE_URL') || ''
    const rawSecrets = Deno.env.get('SUPABASE_SECRET_KEYS') || ''
    let secretKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    if (rawSecrets) {
      try {
        const parsed = JSON.parse(rawSecrets)
        secretKey = String(parsed?.default || Object.values(parsed || {})[0] || secretKey)
      } catch {}
    }
    if (!url || !secretKey) return json({ error: 'server_not_configured' }, 500)

    const admin = createClient(url, secretKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    const { data: userData, error: userError } = await admin.auth.getUser(token)
    if (userError || !userData?.user) return json({ error: 'invalid_session' }, 401)

    const requesterEmail = String(userData.user.email || '').trim().toLowerCase()
    if (requesterEmail !== ADMIN_EMAIL) return json({ error: 'forbidden' }, 403)

    const users: any[] = []
    let page = 1
    const perPage = 1000
    while (page <= 20) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage })
      if (error) throw error
      const batch = data?.users || []
      users.push(...batch)
      if (batch.length < perPage) break
      page += 1
    }

    const [
      { data: profiles, error: profilesError },
      { data: sheetOwners, error: sheetsError },
      { data: memberships, error: membershipsError },
      { count: sheetCount, error: sheetCountError },
      { count: groupCount, error: groupCountError },
      { count: shareCount, error: shareCountError },
    ] = await Promise.all([
      admin.from('profiles').select('id,email,display_name,avatar_url,created_at,updated_at'),
      admin.from('sheets').select('owner_id'),
      admin.from('group_members').select('user_id'),
      admin.from('sheets').select('*', { count: 'exact', head: true }),
      admin.from('groups').select('*', { count: 'exact', head: true }),
      admin.from('sheet_shares').select('*', { count: 'exact', head: true }),
    ])

    for (const err of [profilesError, sheetsError, membershipsError, sheetCountError, groupCountError, shareCountError]) {
      if (err) throw err
    }

    const profileMap = new Map((profiles || []).map((profile: any) => [profile.id, profile]))
    const sheetsByUser = new Map<string, number>()
    for (const row of sheetOwners || []) {
      if (!row?.owner_id) continue
      sheetsByUser.set(row.owner_id, (sheetsByUser.get(row.owner_id) || 0) + 1)
    }
    const groupsByUser = new Map<string, number>()
    for (const row of memberships || []) {
      if (!row?.user_id) continue
      groupsByUser.set(row.user_id, (groupsByUser.get(row.user_id) || 0) + 1)
    }

    const now = Date.now()
    const day = 24 * 60 * 60 * 1000
    const mappedUsers = users.map((user: any) => {
      const profile: any = profileMap.get(user.id) || {}
      const last = ms(user.last_sign_in_at)
      const age = last ? now - last : Number.POSITIVE_INFINITY
      const activity =
        age <= day ? '24h' :
        age <= 7 * day ? '7d' :
        age <= 30 * day ? '30d' : 'inactive'

      return {
        id: user.id,
        email: user.email || profile.email || '',
        name:
          profile.display_name ||
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          String(user.email || '').split('@')[0] ||
          'Usuário',
        avatar: profile.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
        provider: user.app_metadata?.provider || (Array.isArray(user.app_metadata?.providers) ? user.app_metadata.providers[0] : '') || 'email',
        createdAt: user.created_at || null,
        lastSignInAt: user.last_sign_in_at || null,
        emailConfirmedAt: user.email_confirmed_at || null,
        activity,
        sheetCount: sheetsByUser.get(user.id) || 0,
        groupCount: groupsByUser.get(user.id) || 0,
      }
    }).sort((a: any, b: any) => ms(b.lastSignInAt) - ms(a.lastSignInAt))

    const overview = {
      totalAccounts: mappedUsers.length,
      signedIn24h: mappedUsers.filter((user: any) => user.activity === '24h').length,
      signedIn7d: mappedUsers.filter((user: any) => ['24h', '7d'].includes(user.activity)).length,
      signedIn30d: mappedUsers.filter((user: any) => ['24h', '7d', '30d'].includes(user.activity)).length,
      totalSheets: sheetCount || 0,
      totalGroups: groupCount || 0,
      totalShares: shareCount || 0,
    }

    return json({
      overview,
      users: mappedUsers,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('PJ Lite admin dashboard error', error)
    return json({ error: 'admin_dashboard_failed' }, 500)
  }
})
