import {supabase} from './supabaseCloud.js';

const client=()=>{if(!supabase)throw new Error('Nuvem indisponível');return supabase;};
const check=({data,error})=>{if(error)throw error;return data;};
const user=async()=>{const {data,error}=await client().auth.getUser();if(error)throw error;if(!data.user)throw new Error('Entre na Conta Lite para usar Jornadas.');return data.user;};
const BUCKET='pjlite-journeys';
const safeUrl=url=>{let parsed;try{parsed=new URL(String(url||''))}catch{throw new Error('Informe um endereço HTTPS válido.')}if(parsed.protocol!=='https:')throw new Error('Use apenas links HTTPS.');return parsed.href;};
const safeMediaUrl=url=>{
 const raw=String(url||'');
 if(raw.startsWith('storage:')&&/^storage:[0-9a-f-]{36}\/[0-9a-f-]{36}\.(?:png|jpg|jpeg|webp|gif|mp4|webm|pdf)$/i.test(raw))return raw;
 return safeUrl(raw);
};
export async function uploadJourneyMedia(campaignId,file){
 await user();
 if(!file||!file.size)throw new Error('Selecione um arquivo para enviar.');
 if(file.size>25*1024*1024)throw new Error('O arquivo deve ter no máximo 25 MB.');
 const extensions={'image/png':'png','image/jpeg':'jpg','image/webp':'webp','image/gif':'gif','video/mp4':'mp4','video/webm':'webm','application/pdf':'pdf'};
 const extension=extensions[file.type];
 if(!extension)throw new Error('Formatos aceitos: PNG, JPG, WEBP, GIF, MP4, WEBM ou PDF.');
 const path=campaignId+'/'+crypto.randomUUID()+'.'+extension;
 const {error}=await client().storage.from(BUCKET).upload(path,file,{contentType:file.type,upsert:false});
 if(error)throw error;
 return 'storage:'+path;
}
const signedRow=async row=>{
 if(!row.url?.startsWith('storage:'))return {...row,displayUrl:row.url||''};
 const path=row.url.slice(8);
 const {data,error}=await client().storage.from(BUCKET).createSignedUrl(path,60*30);
 return {...row,displayUrl:error?'':(data?.signedUrl||'')};
};

export async function setGroupMaster(groupId,enabled){
 await user();
 return check(await client().from('groups').update({is_dm:!!enabled}).eq('id',groupId).select('id,is_dm').single());
}
export async function listJourneys(){
 await user();
 return check(await client().from('campaigns').select('id,group_id,owner_id,name,system,description,notes,board,created_at,updated_at').order('created_at',{ascending:false}))||[];
}
export async function createJourney(groupId,name,system='Livre'){
 const actor=await user();const clean=String(name||'').trim().slice(0,120);
 if(!clean)throw new Error('Informe um nome para a campanha.');
 return check(await client().from('campaigns').insert({group_id:groupId,owner_id:actor.id,name:clean,system:String(system||'Livre').slice(0,70)}).select().single());
}
export async function saveJourney(journey,patch){
 await user();
 const valid={};
 for(const key of ['name','system','description','notes','board'])if(Object.prototype.hasOwnProperty.call(patch,key))valid[key]=patch[key];
 valid.updated_at=new Date().toISOString();
 return check(await client().from('campaigns').update(valid).eq('id',journey.id).select().single());
}
export async function listJourneyMessages(campaignId){
 await user();
 const rows=check(await client().from('campaign_messages').select('id,campaign_id,author_id,kind,body,url,created_at').eq('campaign_id',campaignId).order('created_at',{ascending:true}).limit(250))||[];return Promise.all(rows.map(signedRow));
}
export async function sendJourneyMessage(campaignId,kind,body='',url=''){
 const actor=await user();
 const type=['text','image','video','youtube','link'].includes(kind)?kind:'text';
 const href=type==='text'?'':safeMediaUrl(url);
 const text=String(body||'').trim().slice(0,8000);
 if(!text&&!href)throw new Error('Escreva uma mensagem ou informe o link.');
 return check(await client().from('campaign_messages').insert({campaign_id:campaignId,author_id:actor.id,kind:type,body:text,url:href}).select().single());
}
export async function listJourneyResources(campaignId){
 await user();
 const rows=check(await client().from('campaign_resources').select('id,campaign_id,owner_id,title,kind,url,visible_to_players,description,category,created_at').eq('campaign_id',campaignId).order('created_at',{ascending:false}))||[];return Promise.all(rows.map(signedRow));
}
export async function addJourneyResource(campaignId,title,kind,url,opts={}){
 const actor=await user();
 const clean=String(title||'').trim().slice(0,160);
 if(!clean)throw new Error('Dê um título ao material.');
 return check(await client().from('campaign_resources').insert({campaign_id:campaignId,owner_id:actor.id,title:clean,kind:kind||'link',url:safeMediaUrl(url),visible_to_players:opts.visible_to_players!==false,category:String(opts.category||'documento').slice(0,60),description:String(opts.description||'').slice(0,650)}).select().single());
}
export async function removeJourneyResource(resourceId){
 await user();
 return check(await client().from('campaign_resources').delete().eq('id',resourceId));
}
export async function getMyCloudSheets(){
 const actor=await user();
 return check(await client().from('sheets').select('id,local_id,name,sheet_type,system,owner_id').eq('owner_id',actor.id).order('updated_at',{ascending:false}))||[];
}
export async function listJourneySheets(campaignId){
 await user();
 return check(await client().from('campaign_sheet_links').select('campaign_id,sheet_id,owner_id,dm_can_edit,sheets(id,local_id,name,sheet_type,system,payload,client_updated_at)').eq('campaign_id',campaignId))||[];
}
export async function linkMySheet(campaignId,sheetId){
 const actor=await user();
 return check(await client().from('campaign_sheet_links').upsert({campaign_id:campaignId,sheet_id:sheetId,owner_id:actor.id},{onConflict:'campaign_id,sheet_id'}).select().single());
}
export async function setMasterSheetEdit(campaignId,sheetId,enabled){
 const actor=await user();
 return check(await client().from('campaign_sheet_links').update({dm_can_edit:!!enabled}).eq('campaign_id',campaignId).eq('sheet_id',sheetId).eq('owner_id',actor.id).select().single());
}
export async function unlinkMySheet(campaignId,sheetId){
 const actor=await user();
 return check(await client().from('campaign_sheet_links').delete().eq('campaign_id',campaignId).eq('sheet_id',sheetId).eq('owner_id',actor.id));
}
export async function saveJourneySheet(sheetId,payload){
 await user();
 const name=String(payload?.bio?.nome||payload?.nome||'Ficha de RPG').slice(0,120);
 const now=new Date().toISOString();
 const safePayload={...payload,meta:{...(payload.meta||{}),updatedAt:now}};
 // Identidade e propriedade nunca são alteradas; RLS exige consentimento do jogador para edição pelo DM.
 return check(await client().from('sheets').update({name,payload:safePayload,client_updated_at:now}).eq('id',sheetId).select('id,name,updated_at').single());
}

export async function setJourneyResourceVisibility(resourceId,visible){
 const actor=await user();
 return check(await client().from('campaign_resources')
  .update({visible_to_players:!!visible}).eq('id',resourceId).eq('owner_id',actor.id).select('id,visible_to_players').single());
}
export async function getDmMindmap(campaignId){
 const actor=await user();
 const {data,error}=await client().from('campaign_dm_mindmaps')
  .select('campaign_id,owner_id,nodes,links,updated_at').eq('campaign_id',campaignId).maybeSingle();
 if(error)throw error;
 return data||{campaign_id:campaignId,owner_id:actor.id,nodes:[],links:[]};
}
export async function saveDmMindmap(campaignId,nodes,links){
 const actor=await user();
 if(!Array.isArray(nodes)||nodes.length>200||!Array.isArray(links)||links.length>400)
  throw new Error('O mapa mental aceita até 200 cartões e 400 ligações.');
 return check(await client().from('campaign_dm_mindmaps').upsert({
  campaign_id:campaignId,owner_id:actor.id,nodes,links,updated_at:new Date().toISOString()
 },{onConflict:'campaign_id'}).select('campaign_id,owner_id,nodes,links,updated_at').single());
}
