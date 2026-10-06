import { createClient } from 'npm:@supabase/supabase-js@2.95.0'

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

const readSecretKey = () => {
  const raw = Deno.env.get('SUPABASE_SECRET_KEYS') || ''
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      const key = String(parsed?.default || Object.values(parsed || {})[0] || '')
      if (key) return key
    } catch {}
  }
  return Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405)

  try {
    const authHeader = req.headers.get('Authorization') || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
    if (!token) return json({ error: 'not_authenticated' }, 401)

    const url = Deno.env.get('SUPABASE_URL') || ''
    const secretKey = readSecretKey()
    if (!url || !secretKey) return json({ error: 'server_not_configured' }, 500)

    const admin = createClient(url, secretKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    const { data: userData, error: userError } = await admin.auth.getUser(token)
    if (userError || !userData?.user) return json({ error: 'invalid_session' }, 401)
    const userId = userData.user.id
    const body = await req.json().catch(() => ({}))

    const { data: mine, error: mineError } = await admin
      .from('group_members')
      .select('group_id')
      .eq('user_id', userId)
    if (mineError) throw mineError

    const allowed = new Set((mine || []).map((row: any) => row.group_id))
    const requested = Array.isArray(body?.groupIds) ? body.groupIds : []
    const groupIds = (requested.length ? requested : Array.from(allowed))
      .map((id: unknown) => String(id || ''))
      .filter((id: string) => allowed.has(id))

    if (!groupIds.length) return json({ members: [] })

    const { data: memberships, error: membershipsError } = await admin
      .from('group_members')
      .select('group_id,user_id,role,joined_at')
      .in('group_id', groupIds)
    if (membershipsError) throw membershipsError

    const userIds = [...new Set((memberships || []).map((row: any) => row.user_id).filter(Boolean))]
    if (!userIds.length) return json({ members: [] })

    const [
      { data: profiles, error: profilesError },
      { data: achievements, error: achievementsError },
    ] = await Promise.all([
      admin.from('profiles').select('id,display_name,avatar_url').in('id', userIds),
      admin.from('account_achievements').select('user_id,achievement_id,label,name,category,unlocked_at,is_public').in('user_id', userIds).eq('is_public', true),
    ])
    if (profilesError) throw profilesError
    if (achievementsError) throw achievementsError

    const profileMap = new Map((profiles || []).map((profile: any) => [profile.id, profile]))
    const achievementsByUser = new Map<string, any[]>()
    for (const entry of achievements || []) {
      if (!entry?.user_id) continue
      const list = achievementsByUser.get(entry.user_id) || []
      list.push(entry)
      achievementsByUser.set(entry.user_id, list)
    }

    const members = (memberships || []).map((member: any) => {
      const profile: any = profileMap.get(member.user_id) || {}
      const userAchievements = achievementsByUser.get(member.user_id) || []
      return {
        groupId: member.group_id,
        userId: member.user_id,
        role: member.role || 'member',
        joinedAt: member.joined_at || null,
        name: profile.display_name || 'Jogador',
        avatar: profile.avatar_url || '',
        achievementTags: userAchievements.map((entry: any) => ({
          id: entry.achievement_id,
          label: entry.label,
          name: entry.name,
          category: entry.category,
          unlockedAt: entry.unlocked_at || null,
        })),
      }
    })

    return json({ members })
  } catch (error) {
    console.error('PJ Lite group profiles error', error)
    return json({ error: 'group_profiles_failed' }, 500)
  }
})
