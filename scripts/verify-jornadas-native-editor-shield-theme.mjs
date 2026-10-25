import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const editor=readFileSync('src/PJLiteApp.jsx','utf8');
const hub=readFileSync('src/cloud/JornadasHub.jsx','utf8');
const panel=readFileSync('src/cloud/JornadasPanel.jsx','utf8');
const modal=readFileSync('src/cloud/SheetQuickView.jsx','utf8');
const cloud=readFileSync('src/cloud/jornadasCloud.js','utf8');
const workspace=readFileSync('src/cloud/CampaignWorkspace.jsx','utf8');
const css=readFileSync('src/cloud/jornadas-cris.css','utf8');
// Editor de verdade: route/Cloud id, isolamento de autosave, RLS + botão no editor original.
assert.ok(panel.includes("window.location.assign('/?'+params.toString())"));
assert.ok(panel.includes('new URLSearchParams({editSheet:row.sheet_id,campaignId:current.id})'));
assert.ok(modal.includes('✎ Editar no PJLite'));
assert.ok(editor.includes("const sheetId=params.get('editSheet'),campaignId=params.get('campaignId')"));
assert.ok(editor.includes('getJourneyEditableSheet(sheetId,campaignId)'));
assert.ok(editor.includes("setView('editor')"));
assert.ok(editor.includes('if (view !== \'editor\' || !data || cloudEditing || cloudEditorLoading) return;'),
 'Edição compartilhada não deve ser salva silenciosamente na biblioteca local do mestre');
assert.ok(editor.includes('await saveJourneySheet(cloudEditing.sheetId,updated)'));
assert.ok(editor.includes("cloudLastSavedRef.current=JSON.stringify(imported)"),'Registrar estado inicial antes de editar ficha de campanha');
assert.ok(editor.includes("if(snapshot!==cloudLastSavedRef.current)"),'Marcar mudanças pendentes no editor original');
assert.ok(editor.includes("cloudLastSavedRef.current=savedSnapshot"),'Só marcar ficha salva após retorno da nuvem');
assert.ok(editor.includes("cloudLatestSnapshotRef.current===savedSnapshot?'saved':'pending'"),'Não declarar salvo se usuário alterou a ficha durante upload');
assert.ok(editor.includes("const hasChanges=cloudEditing&&data&&JSON.stringify(data)!==cloudLastSavedRef.current"),'Avisar antes de sair com mudanças não salvas');
assert.ok(editor.includes("cloudEditing?'Salvar na campanha':'Salvar'"));
assert.ok(cloud.includes("sheet.owner_id===actor.id"));
assert.ok(cloud.includes("!link?.dm_can_edit"),'Não editar personagem de terceiro sem consentimento');
assert.ok(cloud.includes(".eq('campaign_id',campaignId).eq('sheet_id',sheetId)"));
assert.ok(editor.includes("if(cloudEditing){leaveCloudEditor();return;}"));
// Remover vínculo só pelo dono, sem apagar ficha em sheets.
assert.ok(panel.includes("row?.owner_id!==account.id"));
assert.ok(panel.includes("window.confirm("));
assert.ok(panel.includes("unlinkMySheet(current.id,row.sheet_id)"));
assert.ok(modal.includes('Desvincular da campanha'));
const unlink=cloud.slice(cloud.indexOf('export async function unlinkMySheet'),cloud.indexOf('export async function getJourneyEditableSheet'));
assert.ok(unlink.includes(".eq('owner_id',actor.id)"));
assert.ok(!unlink.includes(".from('sheets')"));
// Escudo robusto: sem hooks condicionais, personagem e NPCs e fallback local de render.
assert.ok(workspace.includes('export class CampaignSectionBoundary'));
assert.ok(workspace.includes('componentDidCatch(error,info)'));
const shield=workspace.slice(workspace.indexOf('export function CampaignShield'));
assert.ok(shield.indexOf('React.useState')<shield.indexOf('if(!isDm)return null'));
assert.ok(shield.includes("const playerRows=Array.isArray(links)?links:[]"));
assert.ok(shield.includes("const dmRows=Array.isArray(dmLinks)?dmLinks:[]"));
assert.ok(shield.includes("onOpenSheet?.(row)"));
assert.ok(panel.includes('<CampaignSectionBoundary'));
assert.ok(panel.includes('dmLinks={dmLinks}'));
// Navegação aberta em duas linhas: sem dropdown de recursos.
const nightCss=readFileSync('src/cloud/jornadas-night.css','utf8');
assert.ok(panel.includes('className="pjlite-jornadas-tabs pjlite-jornadas-tabs--compact jornadas-tools-two-rows"'));
assert.ok(!panel.includes('className={\'jornadas-more-select'),'Todos os recursos devem ficar visíveis');
assert.ok(panel.includes('allTabs.map(([key,title])'),'Todos os recursos acessíveis em botões');
assert.ok(nightCss.includes('grid-template-columns:repeat(7,minmax(0,1fr))'));
assert.ok(nightCss.includes('overflow:visible!important'));
// Temas com mesma chave/opções da Home, e alteração do botão.
assert.ok(hub.includes("const THEME_KEY='dragonbane_theme_prefs'"));
for(const label of ['Padrão','Clássico DB','Dungeons & Dragons','Fábula Última','O Som das Seis','Modo Escuro','Personalizado']){
 assert.ok(hub.includes(label),'Tema faltando '+label);
}
assert.ok(hub.includes("theme==='custom'?homeBackground"));
assert.ok(editor.includes('🗂 Campanha'));
console.log('✓ Editor visual cloud seguro, desvincular pelo dono, Escudo robusto, barra compacta e temas da Home.');
