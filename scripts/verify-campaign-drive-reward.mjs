import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {isGoogleDriveResourceUrl} from '../src/cloud/driveResourceLinks.js';

const project='https://drive.google.com/drive/folders/1MVLTsPPATBGd910JWD5j1zYd3A779ytu?usp=drive_link';
for(const address of [
 project,
 'https://drive.google.com/file/d/1tjgf89WnMgOWPct7WK4ca7O__7ZOWFHS/view?usp=drivesdk',
 'https://drive.google.com/open?id=1aBcDeFg123',
 'https://drive.google.com/drive/u/0/folders/1abc123',
 'https://docs.google.com/document/d/abc_def123/edit'
]){
 assert.equal(isGoogleDriveResourceUrl(address),true,'Deve aceitar link Drive: '+address);
}
for(const address of [
 'javascript:alert(1)', 'http://drive.google.com/file/d/123/view',
 'https://drive.google.com.evil.example/file/d/123/view',
 'https://example.com/file.pdf','https://drive.google.com/',
 'https://docs.google.com.evil.com/document/d/123/edit',
 'https://drive.google.com/open?id='
]){
 assert.equal(isGoogleDriveResourceUrl(address),false,'Recusar endereço não Drive ou sem recurso: '+address);
}
const account=readFileSync('src/cloud/RealCloudPanel.jsx','utf8');
assert.ok(account.includes("const ROTA_ZERO_DRIVE_URL='"+project+"'"),'Usar a pasta Rota Zero fornecida pelo usuário');
assert.ok(account.includes('{argUnlocked&&<div className="pjlite-cloud-settings__group pjlite-cloud-arg-material">'),
 'Exibir recompensa apenas a quem tem RZ-88');
assert.ok(account.includes('Recompensa — Rota Zero'),'Mostrar o nome do projeto no cartão');
assert.ok(account.includes('href={ROTA_ZERO_DRIVE_URL} target="_blank" rel="noopener noreferrer"'),
 'Link deve abrir diretamente a pasta no Drive com noopener');
assert.ok(!account.includes('const openArgMaterial=()=>'),'Não disparar evento antigo em lugar de abrir a pasta');
const library=readFileSync('src/cloud/CampaignWorkspace.jsx','utf8');
assert.ok(library.includes("if(kind==='pdf'&&!driveLink(url.trim()))"),'Exigir Drive ao compartilhar PDF');
assert.ok(library.includes("kind==='pdf'?url.trim():(file?await uploadJourneyMedia"),'Nunca enviar PDF ao Supabase Storage');
assert.ok(!library.includes('accept="application/pdf,'),'Não oferecer upload de PDF no formulário');
assert.ok(library.includes("kind!=='pdf'&&<label>Arquivo opcional"),'Permitir imagens e vídeos, mas não anexar PDF');
assert.ok(library.includes('📁 Compartilhar link do Drive'),'Botão de link explícito');
assert.ok(library.includes('target="_blank" rel="noopener noreferrer" className="campaign-library-card__external"'),
 'Abrir PDF no Drive sem tentar iframe');
assert.ok(!library.includes('<iframe'),'Não embutir páginas do Drive em iframes');
assert.ok(library.includes("setJourneyResourceVisibility("),'Preservar controle de divulgação de material');
assert.ok(library.includes('Os jogadores precisarão de permissão no Drive'),'Avisar sobre permissão externa');
const css=readFileSync('src/cloud/campaign-workspace.css','utf8');
assert.ok(css.includes('.campaign-library-card__external'),'Botão externo legível');
const rewardCss=readFileSync('src/cloud/account-achievements.css','utf8');
assert.ok(rewardCss.includes('.pjlite-cloud-arg-material a.pjlite-cloud-primary'),'Card da recompensa deve funcionar com link');
console.log('✓ Campanhas: PDF por links do Drive, sem upload/iframe; recompensa Rota Zero direta e restrita.');
