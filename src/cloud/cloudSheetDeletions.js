// Exclusões pendentes na Conta Lite. Grava ANTES de atualizar o estado para
// impedir que a mesclagem automática ressuscite fichas removidas. Armazenamento
// segregado por usuário; nunca exclui uma ficha de outro proprietário.
const CURRENT_OWNER_KEY='pjlite_cloud_last_owner_v1';
const PREFIX='pjlite_cloud_pending_deletions_v1:';
const store=()=>typeof localStorage==='undefined'?null:localStorage;
const clean=v=>String(v??'').trim();
const key=userId=>PREFIX+clean(userId);
export function getLastCloudOwner(){
 try{return clean(store()?.getItem(CURRENT_OWNER_KEY))}catch{return ''}
}
export function rememberCloudOwner(userId){
 if(!clean(userId))return;
 try{store()?.setItem(CURRENT_OWNER_KEY,clean(userId))}catch{}
}
export function getPendingSheetDeletions(userId=getLastCloudOwner()){
 if(!clean(userId))return [];
 try{
  const value=JSON.parse(store()?.getItem(key(userId))||'[]');
  return Array.isArray(value)?[...new Set(value.map(clean).filter(Boolean))]:[];
 }catch{return []}
}
export function markSheetDeleted(id,userId=getLastCloudOwner()){
 const localId=clean(id);
 if(!localId||!clean(userId))return false;
 try{
  store()?.setItem(key(userId),JSON.stringify([...new Set([...getPendingSheetDeletions(userId),localId])]));
  return true;
 }catch{return false}
}
export function clearPendingSheetDeletions(userId,removedIds=[]){
 if(!clean(userId))return;
 const removed=new Set(removedIds.map(clean));
 try{store()?.setItem(key(userId),JSON.stringify(getPendingSheetDeletions(userId).filter(id=>!removed.has(id))))}catch{}
}
export function unmarkSheetDeleted(id,userId=getLastCloudOwner()){
 clearPendingSheetDeletions(userId,[id]);
}
export function withoutPendingDeletions(list,userId=getLastCloudOwner()){
 const pending=new Set(getPendingSheetDeletions(userId));
 return (Array.isArray(list)?list:[]).filter(row=>!pending.has(clean(row?.local_id||row?.id||row?.payload?.id)));
}
