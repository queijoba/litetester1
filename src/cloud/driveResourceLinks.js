// Reconhece apenas links HTTPS de recursos hospedados no Google Drive.
// Não altera as permissões do arquivo; o proprietário controla o acesso no Drive.
export function isGoogleDriveResourceUrl(value){
 try{
  const url=new URL(String(value||'').trim());
  if(url.protocol!=='https:')return false;
  const host=url.hostname.toLowerCase();
  const path=url.pathname;
  if(host==='drive.google.com'){
   if(/^\/file\/d\/[a-zA-Z0-9_-]+(?:\/|$)/.test(path))return true;
   if(/^\/drive\/(?:u\/\d+\/)?folders\/[a-zA-Z0-9_-]+(?:\/|$)/.test(path))return true;
   if((path==='/open'||path==='/uc')&&/^[a-zA-Z0-9_-]+$/.test(url.searchParams.get('id')||''))return true;
  }
  if(host==='docs.google.com'){
   return /^\/(?:document|spreadsheets|presentation|forms)\/d\/[a-zA-Z0-9_-]+(?:\/|$)/.test(path);
  }
  return false;
 }catch{return false}
}
