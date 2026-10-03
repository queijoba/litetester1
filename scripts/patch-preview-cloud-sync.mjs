import { readFile, writeFile } from 'node:fs/promises';
const path='scripts/preview-cloud-sync.mjs';
let text=await readFile(path,'utf8');
const old=`app=replaceOnce(
  app,
  "        const SCHEMA_VERSION = 6;",
  "        const SCHEMA_VERSION = 6;\\n        // PJ LITE CLOUD SYNC PREVIEW V1\\n        const CLOUD_PREVIEW_ACCOUNT_KEY = 'pjlite_cloud_preview_account_v1';\\n        const CLOUD_PREVIEW_REMOTE_PREFIX = 'pjlite_cloud_preview_remote_v1:';",
  'constantes'
);`;
const replacement=`const cloudConstAnchor="        const NEWS_COLLAPSED_KEY = 'pjlite_news_collapsed_v1';";
app=replaceOnce(
  app,
  cloudConstAnchor,
  cloudConstAnchor + "\\n        // PJ LITE CLOUD SYNC PREVIEW V1\\n        const CLOUD_PREVIEW_ACCOUNT_KEY = 'pjlite_cloud_preview_account_v1';\\n        const CLOUD_PREVIEW_REMOTE_PREFIX = 'pjlite_cloud_preview_remote_v1:';",
  'constantes'
);`;
if(text.includes(old)){
  text=text.replace(old,replacement);
  await writeFile(path,text,'utf8');
  console.log('✓ Âncora da prévia Cloud Sync adaptada ao pipeline.');
}else if(text.includes('const cloudConstAnchor=')){
  console.log('Cloud Sync anchor: already patched.');
}else{
  throw new Error('Não encontrei o bloco de âncora do Cloud Sync para corrigir.');
}
