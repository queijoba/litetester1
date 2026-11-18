// Reconciliador compartilhado entre TODOS os sistemas do PJLite.
// Não transforma as fichas: preserva o JSON integral, inclusive campos extras.
const str=x=>String(x??'').trim();
export const getSheetTime=item=>{
 const source=item?.payload&&typeof item.payload==='object'?item.payload:item;
 const raw=source?.meta?.updatedAt||source?.updatedAt||item?.client_updated_at||source?.meta?.createdAt||source?.createdAt||'';
 const value=Date.parse(raw);
 return Number.isFinite(value)?value:0;
};
const identifier=row=>str(row?.local_id||row?.id||row?.payload?.id);
export function mergeSheetVersions(local=[],remote=[]){
 const map=new Map();
 for(const item of Array.isArray(local)?local:[]){
  if(item?.id)map.set(str(item.id),item);
 }
 for(const row of Array.isArray(remote)?remote:[]){
  const item=row?.payload&&typeof row.payload==='object'?row.payload:row;
  const id=identifier(row)||str(item?.id);
  if(!id)continue;
  const normalized=item?.id?item:{...item,id};
  const previous=map.get(id);
  // Em caso de carimbo igual, a versão confirmada no servidor prevalece.
  // Assim um envio descartado por ser antigo nunca parece sincronizado.
  if(!previous||getSheetTime(row)>=getSheetTime(previous))map.set(id,normalized);
 }
 return [...map.values()];
}
export function reconcileSheetCollections(chars=[],threats=[],remoteRows=[],seenRemoteIds=[],pendingDeleteIds=[]){
 const rows=Array.isArray(remoteRows)?remoteRows:[];
 const remoteIds=new Set(rows.map(identifier).filter(Boolean));
 const previouslySeen=new Set((Array.isArray(seenRemoteIds)?seenRemoteIds:[]).map(str).filter(Boolean));
 const pending=new Set((Array.isArray(pendingDeleteIds)?pendingDeleteIds:[]).map(str).filter(Boolean));
 // Uma ficha que existia em uma consulta remota bem-sucedida e sumiu dela
 // foi excluída em outro dispositivo: não a recriar por upload antigo.
 const remotelyRemoved=new Set([...previouslySeen].filter(id=>!remoteIds.has(id)));
 const excluded=new Set([...remotelyRemoved,...pending]);
 const removedLocal=[...(Array.isArray(chars)?chars:[]),...(Array.isArray(threats)?threats:[])]
    .filter(item=>item?.id&&remotelyRemoved.has(str(item.id)));
 const keep=items=>(Array.isArray(items)?items:[]).filter(item=>!excluded.has(str(item?.id)));
 const remoteChars=rows.filter(row=>row?.sheet_type==='pc'&&!excluded.has(identifier(row)));
 const remoteThreats=rows.filter(row=>row?.sheet_type!=='pc'&&!excluded.has(identifier(row)));
 return {
  characters:mergeSheetVersions(keep(chars),remoteChars),
  threats:mergeSheetVersions(keep(threats),remoteThreats),
  removedLocal,
  remotelyRemovedIds:[...remotelyRemoved],
  remoteIds:[...remoteIds]
 };
}
const PREFIX='pjlite_cloud_seen_ids_v1:';
const BACKUPS='pjlite_cloud_removed_backups_v1:';
const storage=()=>typeof localStorage==='undefined'?null:localStorage;
const key=(prefix,uid)=>prefix+str(uid);
export function getKnownRemoteSheetIds(userId){
 if(!str(userId))return [];
 try{
  const found=JSON.parse(storage()?.getItem(key(PREFIX,userId))||'[]');
  return Array.isArray(found)?[...new Set(found.map(str).filter(Boolean))]:[];
 }catch{return []}
}
export function saveKnownRemoteSheetIds(userId,ids){
 if(!str(userId))return;
 // Propagar erros de armazenamento: sem snapshot, a exclusão remota poderia
 // ser revertida quando outro navegador voltasse a sincronizar.
 storage()?.setItem(key(PREFIX,userId),JSON.stringify([...new Set(ids.map(str).filter(Boolean))]));
}
export function getRemovedSheetBackups(userId){
 try{
  const rows=JSON.parse(storage()?.getItem(key(BACKUPS,userId))||'[]');
  return Array.isArray(rows)?rows:[];
 }catch{return []}
}
export function backupRemotelyDeletedSheets(userId,items=[]){
 const source=(Array.isArray(items)?items:[]).filter(item=>item?.id);
 if(!source.length)return 0;
 const saved=getRemovedSheetBackups(userId);
 const map=new Map(saved.filter(x=>x?.item?.id).map(x=>[str(x.item.id),x]));
 const date=new Date().toISOString();
 for(const item of source)map.set(str(item.id),{at:date,item});
 // Quota exceeded -> throw, preservando as fichas visíveis no dispositivo.
 storage()?.setItem(key(BACKUPS,userId),JSON.stringify([...map.values()]));
 return source.length;
}
