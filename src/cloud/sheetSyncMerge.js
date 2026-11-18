// Mesclagem consistente para TODOS os tipos de ficha (PJ, NPC e ameaça).
// Prefere a versão que foi explicitamente salva por último, não a que chegou
// por último pela rede. Timestamps inválidos não ganham de versões válidas.
export const sheetId=value=>String(value?.id??value?.local_id??value?.payload?.id??'').trim();
const toMs=value=>{const time=Date.parse(value||'');return Number.isFinite(time)?time:0};
export const localSheetStamp=item=>toMs(item?.meta?.updatedAt||item?.updatedAt||item?.meta?.createdAt||item?.createdAt);
export const cloudSheetStamp=row=>
 toMs(row?.client_updated_at)||localSheetStamp(row?.payload)||toMs(row?.updated_at);
export function mergeSheetsByRevision(local=[],rows=[],deletedIds=[]){
 const excluded=new Set([...deletedIds].map(String));
 const map=new Map();
 for(const value of Array.isArray(local)?local:[]){
  const id=sheetId(value);if(id&&!excluded.has(id))map.set(id,value);
 }
 for(const row of Array.isArray(rows)?rows:[]){
  const id=String(row?.local_id||sheetId(row?.payload)||'').trim();
  if(!id||excluded.has(id))continue;
  const payload=row?.payload&&typeof row.payload==='object'?row.payload:null;
  if(!payload)continue;
  const item=payload.id?payload:{...payload,id};
  const current=map.get(id);
  // Em empate mantenha os dados deste dispositivo. Não sobrescreva edições
  // locais somente porque uma resposta da rede chegou mais tarde.
  if(!current||cloudSheetStamp(row)>localSheetStamp(current))map.set(id,item);
 }
 return [...map.values()];
}
export function filterSheetsByIds(items=[],removed=[]){
 const excluded=new Set(removed.map(String));
 return (Array.isArray(items)?items:[]).filter(x=>{
  const id=sheetId(x);return id&&!excluded.has(id);
 });
}
export const sameSheetList=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
