import {supabase} from './supabaseCloud.js';

const client=()=>{if(!supabase)throw new Error('Nuvem indisponível');return supabase;};
const check=({data,error})=>{if(error)throw error;return data;};
const user=async()=>{const {data,error}=await client().auth.getUser();if(error)throw error;if(!data.user)throw new Error('Entre na Conta Lite para usar Jornadas.');return data.user;};
const safeUrl=url=>{let parsed;try{parsed=new URL(String(url||''))}catch{throw new Error('Informe um endereço HTTPS válido.')}if(parsed.protocol!=='https:')throw new Error('Use apenas links HTTPS.');return parsed.href;};

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
 return check(await client().from('campaign_messages').select('id,campaign_id,author_id,kind,body,url,created_at').eq('campaign_id',campaignId).order('created_at',{ascending:true}).limit(250))||[];
}
export async function sendJourneyMessage(campaignId,kind,body='',url=''){
 const actor=await user();
 const type=['text','image','video','youtube','link'].includes(kind)?kind:'text';
 const href=type==='text'?'':safeUrl(url);
 const text=String(body||'').trim().slice(0,8000);
 if(!text&&!href)throw new Error('Escreva uma mensagem ou informe o link.');
 return check(await client().from('campaign_messages').insert({campaign_id:campaignId,author_id:actor.id,kind:type,body:text,url:href}).select().single());
}
export async function listJourneyResources(campaignId){
 await user();
 return check(await client().from('campaign_resources').select('id,campaign_id,owner_id,title,kind,url,created_at').eq('campaign_id',campaignId).order('created_at',{ascending:false}))||[];
}
export async function addJourneyResource(campaignId,title,kind,url){
 const actor=await user();
 const clean=String(title||'').trim().slice(0,160);
 if(!clean)throw new Error('Dê um título ao material.');
 return check(await client().from('campaign_resources').insert({campaign_id:campaignId,owner_id:actor.id,title:clean,kind:kind||'link',url:safeUrl(url)}).select().single());
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
 // Identidade e propriedade nunca são alteradas; RLS exige consentimento do jogador para edição pelo DM.
 return check(await client().from('sheets').update({name,payload,client_updated_at:new Date().toISOString()}).eq('id',sheetId).select('id,name,updated_at').single());
}
