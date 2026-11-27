import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
 DRAGONBANE_ABILITY_KINDS,DRAGONBANE_INNATE_CATALOG,dragonbaneAncestryKey,
 dragonbaneInnateSuggestions,createDragonbaneAbility,dragonbaneAbilityKind,
 dragonbaneAbilityList,dragonbaneMagicTabEnabled,dragonbanePdfAbilityOrder,dragonbanePdfAbilityName,dragonbaneMagicSchool,renameDragonbaneAbility
} from '../src/systems/dragonbane/abilities.js';
import {fillDragonbanePdf} from '../src/systems/dragonbane/pdf/map.js';
import {
 DRAGONBANE_ATTRIBUTE_ORDER,DRAGONBANE_ATTRIBUTE_NAMES,
 dragonbaneAttributeValue,dragonbaneAttributeCondition,orderedDragonbaneAttributes
} from '../src/systems/dragonbane/attributes.js';

assert.deepEqual(DRAGONBANE_ABILITY_KINDS.map(x=>x.id),['inata','heroica','magia','truque','outro']);
for(const [ancestry,key] of Object.entries({
 'Humano':'humano','Anão':'anao','Elfo':'elfo','Halfling':'halfling','Lupino':'lupino','Marreco':'marreco'
}))assert.equal(dragonbaneAncestryKey(ancestry),key);
assert.equal(Object.values(DRAGONBANE_INNATE_CATALOG).reduce((n,a)=>n+a.length,0),16);
assert.equal(dragonbaneInnateSuggestions('Marreco',[]).length,2);
assert.equal(dragonbaneInnateSuggestions('Humano',[{nome:'Adaptativo'}]).length,0);
assert.equal(dragonbaneInnateSuggestions('Elfo',[{nome:'Paz Interior'}]).length,0);

const oldRecords=[
 {nome:'Paz Interior',fv_nvl:'—'},
 {nome:'Tiro Duplo',fv_nvl:'3 PD'},
 {nome:'Bola de Fogo',fv_nvl:'2 PD'},
 {nome:'Ignição',fv_nvl:'1 PD'},
 {nome:'Minha habilidade caseira\nAnotações originais',fv_nvl:'2 PD',desc:'Não apagar'}
];
const untouched=structuredClone(oldRecords);
assert.deepEqual(oldRecords.map(dragonbaneAbilityKind),['inata','heroica','magia','truque','outro']);
assert.equal(dragonbaneMagicSchool(oldRecords[2]),'Elementalismo');
assert.equal(dragonbaneMagicSchool(oldRecords[3]),'Elementalismo');
assert.equal(dragonbanePdfAbilityName(oldRecords[0]),'[Inata] Paz Interior');
assert.equal(dragonbanePdfAbilityName(oldRecords[3]),'[Truque] Ignição');
const data={habilidadesFeiticos:oldRecords};
assert.equal(dragonbaneAbilityList(data,'outro').length,1);
assert.equal(dragonbaneAbilityList(data,'magia')[0].index,2);
assert.equal(dragonbaneAbilityList({habilidadesFeiticos:[null,undefined,'anotação',{},...oldRecords]},'outro').length,2,'Registros inválidos não podem derrubar o painel de habilidades');
const made=createDragonbaneAbility('magia',{nome:'Magia teste',grau:2,escola:'Mentalismo',preparada:true});
assert.equal(dragonbaneAbilityKind(made),'magia');
assert.equal(made.preparada,true);
assert.equal(made.grau,2);
assert.equal(createDragonbaneAbility('truque').fv_nvl,'1 PD');
assert.equal(createDragonbaneAbility('inata').preparada,false);
assert.equal(dragonbaneAbilityKind({...oldRecords[2],tipo:'heroica'}),'heroica','A categoria manual tem prioridade sobre inferência');
assert.equal(dragonbaneAbilityKind({...oldRecords[2],tipo:'outro'}),'outro','Permitir classificar em Outros');
assert.deepEqual(dragonbanePdfAbilityOrder(oldRecords),oldRecords,'Ordem de categorias reconhecidas deve ser estável');
assert.deepEqual(oldRecords,untouched,'Não alterar entradas antigas automaticamente');
const renameOld=renameDragonbaneAbility({habilidadesFeiticos:oldRecords},2,'Minha Bola de Fogo');
assert.equal(renameOld.habilidadesFeiticos[2].tipo,'magia','Manter a categoria durante edição de nome legado');
assert.equal(renameOld.habilidadesFeiticos[2].nome,'Minha Bola de Fogo');
assert.deepEqual(oldRecords,untouched,'Não mutar objetos de fichas antigas durante edição');
assert.equal(renameDragonbaneAbility({habilidadesFeiticos:oldRecords},999,'X').habilidadesFeiticos,oldRecords);


const formData={};
const form={
 getTextField(name){return{setText(value){formData[name]=value;}}},
 getCheckBox(name){return{check(){formData[name]=true;},uncheck(){formData[name]=false;}}}
};
fillDragonbanePdf(form,{bio:{nome:'Teste'},habilidadesFeiticos:[oldRecords[4],...oldRecords.slice(0,4),made]});
assert.equal(formData.cartao_01_nome,'[Inata] Paz Interior');
assert.equal(formData.cartao_02_nome,'[Heroica] Tiro Duplo');
assert.equal(formData.cartao_03_magia,true);
assert.equal(formData.cartao_04_nome,'[Feitiço] Magia teste');
assert.equal(formData.cartao_05_nome,'[Truque] Ignição');
assert.equal(formData.cartao_05_fv_nivel,'1 PD');
assert.equal(formData.cartao_06_nome,'Minha habilidade caseira');
assert.equal(formData.cartao_06_habilidade,true);
const legacyWithDescription={nome:'Registro antigo',descricao:'Descrição anterior',fv_nvl:'3 PD'};
const last={};
const legacyForm={
 getTextField(name){return{setText(v){last[name]=v;}}},
 getCheckBox(){return{check(){},uncheck(){}}}
};
fillDragonbanePdf(legacyForm,{bio:{nome:'Teste 2'},habilidadesFeiticos:[legacyWithDescription]});
assert.equal(last.cartao_01_descricao_1,'Descrição anterior','Preservar conteúdo do campo legado descricao');


const panel=readFileSync('src/systems/dragonbane/components/AbilityPanels.jsx','utf8');
const editor=readFileSync('src/systems/dragonbane/components/Editor.jsx','utf8');
const app=readFileSync('src/PJLiteApp.jsx','utf8');
const css=readFileSync('src/systems/dragonbane/components/abilityPanels.css','utf8');
assert.ok(panel.includes('dragonbaneInnateSuggestions'));
assert.ok(panel.includes('DRAGONBANE_MAGIC_SCHOOLS'));
assert.ok(panel.includes('preparada'));
assert.ok(!panel.includes('rows={legacy||'), 'Editor não pode usar variável legacy inexistente na renderização dos cartões');
assert.ok(panel.includes("rows={n(entry.nome).includes('\\n')?2:1}"), 'Nome deve acomodar texto antigo de múltiplas linhas');
assert.ok(panel.includes('counted>MAX_PDF_CARDS&&'), 'Aviso do limite PDF deve aparecer em Habilidades e Magias');
assert.ok(panel.includes('grau'));
assert.ok(panel.includes('habilidadesFeiticos'));
assert.ok(panel.includes('Categoria'));
assert.ok(panel.includes("entry.desc!==undefined?entry.desc"),'Preservar desc e descricao no editor');
assert.ok(app.includes("h.desc !== undefined ? h.desc : h.descricao"),'Ficha Chat deve manter prioridade consistente de descrições');

// Em 20/11 a reorganização experimental é apresentada primeiro no LiteTester.
// Mantém o formato de dados e os recursos do editor clássico, sem migração destrutiva.
const preview=readFileSync('src/systems/dragonbane/components/AbilitiesPanel.jsx','utf8');
assert.ok(editor.includes('db-paper db-sheet')&&editor.includes('db-brand'), 'Preservar pergaminho, identidade e moldura originais');
assert.ok(editor.includes("dragonbanePage==='status'")&&editor.includes("dragonbanePage==='habilidades'")&&editor.includes("dragonbanePage==='magias'"),'Abas navegáveis');
assert.ok(editor.includes('Status e atributos')&&editor.includes('Feitiços e truques'),'Rótulos de navegação claros');
assert.ok(editor.includes('db-skills-pair')&&editor.includes('db-combat-mobile-slot')&&editor.includes("dragonbanePage==='inventario'"), 'Combate e inventário devem continuar acessíveis');
assert.ok(editor.includes('updateField(\'inventario\'')&&editor.includes('updateField(\'moedas.ouro\''), 'Inventário da ficha continua editável');
assert.ok(preview.includes('dragonbaneAbilityList')&&preview.includes('DRAGONBANE_MAGIC_SCHOOLS'),'Habilidades e magias devem ser separadas pelo tipo');
assert.ok(preview.includes("createDragonbaneAbility('inata'")&&preview.includes('dragonbaneInnateSuggestions'),'Habilidades inatas opcionais mantidas');
assert.ok(preview.includes("addToArray('habilidadesFeiticos'")&&preview.includes("updateArrayField('habilidadesFeiticos'")&&preview.includes("removeFromArray('habilidadesFeiticos'"),'Reusar a lista salva original');
assert.ok(preview.includes('renameDragonbaneAbility'),'Não perder classificação de habilidades antigas quando seu nome muda');
assert.ok(preview.includes('item.desc!==undefined?item.desc:(item.descricao'), 'Descrições antigas não devem desaparecer');
assert.ok(preview.includes("includes('\\n')?3:1"), 'Nomes antigos com múltiplas linhas permanecem visíveis');
assert.ok(preview.includes('preparada')&&preview.includes('grau')&&preview.includes('fonte'),'Manter as propriedades de feitiços');
assert.ok(preview.includes('pdfCount>24')&&preview.includes('24 cartões'),'Alertar que o PDF editável só tem 24 cartões');
assert.ok(editor.includes('db-rework-portrait-upload')&&editor.includes('updateDragonbanePortrait'),'Retrato deve ser acessível em dispositivos sem hover');
assert.ok(editor.includes('db-unified-tabs')&&!editor.includes('Mobile Tabs for PC')&&!editor.includes('mobileTab === tab.id'),'Uma navegação em PC e celular');
assert.ok(['status','pericias','equipamento','habilidades','inventario','magias'].every(id=>editor.includes("id:'"+id+"'")),'Todas as seis seções disponíveis');
assert.ok(app.includes('aria-label="Biblioteca de Dragonbane"')&&app.includes('setDragonbaneLibraryFilter({})')&&!editor.includes('▤ Biblioteca de Dragonbane'),'Biblioteca principal na barra do editor');
assert.ok(css.includes('.db-sheet .db-unified-inactive{display:none!important}'),'Painéis inativos ocultos inclusive no desktop');
assert.ok(!editor.includes('db-combat-desktop-slot'),'Não duplicar combate/inventário no DOM');
assert.ok(app.includes('DRAGONBANE_ABILITY_KINDS.forEach'), 'Manter utilitários atuais usados em PDF e chat');
assert.ok(css.includes('#2e786a')&&css.includes('#f5edd4'), 'Manter paleta e recursos de compatibilidade');

console.log('✓ Dragonbane: prévia com magia opcional, estética clássica, edição, chat e PDF legado preservados.');


// Ordem oficial consultada no Livro de Regras v1.1 e na ficha editável PT-BR do Drive.
// Cada atributo possui um valor diferente para detectar troca silenciosa de posições.
assert.deepEqual(DRAGONBANE_ATTRIBUTE_ORDER,['for','con','agl','int','von','car']);
assert.deepEqual(Object.values(DRAGONBANE_ATTRIBUTE_NAMES),[
 'Força','Constituição','Agilidade','Inteligência','Vontade','Carisma'
]);
const reversedAttributes={
 car:{valor:6,condicao:true},von:{valor:7,condicao:false},
 int:{valor:8,condicao:true},agl:{valor:9,condicao:false},
 con:{valor:10,condicao:true},for:{valor:11,condicao:false}
};
const reversedBefore=JSON.parse(JSON.stringify(reversedAttributes));
const reordered=orderedDragonbaneAttributes(reversedAttributes);
assert.deepEqual(Object.keys(reordered),DRAGONBANE_ATTRIBUTE_ORDER);
assert.deepEqual(DRAGONBANE_ATTRIBUTE_ORDER.map(k=>dragonbaneAttributeValue(reordered,k)),[11,10,9,8,7,6]);
assert.deepEqual(DRAGONBANE_ATTRIBUTE_ORDER.map(k=>dragonbaneAttributeCondition(reordered,k)),[false,true,false,true,false,true]);
assert.deepEqual(reversedAttributes,reversedBefore,'Não modificar dados originais de fichas antigas.');
assert.notEqual(reordered.for,reversedAttributes.for,'Normalização retorna cópias, sem alterar registros antigos.');
const missing=orderedDragonbaneAttributes({von:{valor:17,condicao:true}});
assert.equal(missing.von.valor,17);
assert.equal(missing.con.valor,10);
assert.equal(missing.for.valor,10);
assert.equal(missing.von.condicao,true);
assert.deepEqual(Object.keys(missing),DRAGONBANE_ATTRIBUTE_ORDER);
assert.deepEqual(Object.keys(orderedDragonbaneAttributes({car:{valor:12},notaLegada:'não perder'})),[...DRAGONBANE_ATTRIBUTE_ORDER,'notaLegada']);

for (const [kind,attrs] of Object.entries({
 'ficha nova':Object.fromEntries(DRAGONBANE_ATTRIBUTE_ORDER.map((key,i)=>[key,{valor:12+i,condicao:false}])),
 'ficha importada':reversedAttributes,
 'ficha antiga incompleta':missing,
 'modelo pronto':{...reversedAttributes},
 'ficha sincronizada':{...reversedAttributes},
})){
 const pdfData={};
 const pdfForm={
  getTextField(name){return {setText(value){pdfData[name]=value}}},
  getCheckBox(name){return {check(){pdfData[name]=true},uncheck(){pdfData[name]=false}}}
 };
 fillDragonbanePdf(pdfForm,{bio:{nome:kind},atributos:attrs});
 for(const key of DRAGONBANE_ATTRIBUTE_ORDER){
  assert.equal(Number(pdfData[key]),dragonbaneAttributeValue(attrs,key),'Campo PDF trocado: '+kind+' / '+key);
  assert.equal(pdfData['condicao_'+key],dragonbaneAttributeCondition(attrs,key),'Condição PDF trocada: '+kind+' / '+key);
 }
}
const dragonbaneUi=readFileSync('src/systems/dragonbane/components/Editor.jsx','utf8');
assert.equal(dragonbaneUi.split('DRAGONBANE_ATTRIBUTE_ORDER.map(attr => (').length-1,2,
 'A faixa desktop/mobile e o quadro de atributos devem seguir a mesma ordem');
assert.ok(!dragonbaneUi.includes('Object.keys(data.atributos'),'A ordem não pode depender do JSON importado');
const fullApp=readFileSync('src/PJLiteApp.jsx','utf8');
assert.ok(fullApp.includes('const normalizeDragonbanePcData ='),'Fichas antigas precisam normalização específica');
assert.ok(fullApp.includes('.map(item => normalizeDragonbanePcData(normalizeMetaItem('),'Fichas já salvas normalizadas na leitura');
assert.ok(fullApp.includes('savingData = normalizeDragonbanePcData(savingData)'),'Fichas novas normalizadas ao salvar');
assert.ok(fullApp.includes('normalized = normalizeDragonbanePcData(normalized)'),'Fichas salvas normalizadas ao abrir');
assert.ok(fullApp.includes('normalizedData = normalizeDragonbanePcData(normalizedData)'),'Fichas importadas normalizadas');
assert.ok(fullApp.includes('newData.atributos = orderedDragonbaneAttributes(newData.atributos)'),'Campos antigos editáveis');
assert.ok(fullApp.includes("item?.system === 'dragonbane' && item?.type === 'pc'"),'Outros sistemas/ameaças não podem ser afetados');
console.log('✓ Dragonbane: FOR, CON, AGL, INT, VON, CAR em fichas novas, salvas, importadas, modelos e PDF (valores/condições preservados).');

assert.equal(dragonbaneMagicTabEnabled({habilidadesFeiticos:[]}),false);
assert.equal(dragonbaneMagicTabEnabled({bio:{profissao:'Mago'},habilidadesFeiticos:[]}),true);
assert.equal(dragonbaneMagicTabEnabled(data),true);
const hiddenMagic={...data,dragonbaneShowMagic:false};
assert.equal(dragonbaneMagicTabEnabled(hiddenMagic),false);
assert.deepEqual(hiddenMagic.habilidadesFeiticos,untouched);
assert.equal(dragonbaneMagicTabEnabled({...hiddenMagic,dragonbaneShowMagic:true}),true);
assert.ok(editor.includes("updateField('dragonbaneShowMagic',!showDragonbaneMagic)"));
assert.ok(editor.includes("showDragonbaneMagic&&dragonbanePage==='magias'"));
assert.ok(editor.includes('db-skills-pair')&&editor.includes('md:grid-cols-2'));
assert.ok(editor.includes("dragonbanePage==='inventario'"));
assert.equal(editor.split("updateField('inventario'").length-1,1);

const {DRAGONBANE_LIBRARY,dragonbaneSpellGrade,dragonbaneSpellGroups,dragonbanePreparedLimit,insertDragonbaneLibraryEntry}=await import('../src/systems/dragonbane/abilities.js');
assert.equal(DRAGONBANE_LIBRARY.filter(x=>x.tipo==='heroica').length,46);
assert.equal(DRAGONBANE_LIBRARY.filter(x=>x.tipo==='magia').length,49);
assert.equal(DRAGONBANE_LIBRARY.filter(x=>x.tipo==='truque').length,17);
assert.equal(DRAGONBANE_LIBRARY.filter(x=>x.tipo==='inata').length,16);
assert.equal(new Set(DRAGONBANE_LIBRARY.map(x=>x.id)).size,DRAGONBANE_LIBRARY.length);
const permanent=DRAGONBANE_LIBRARY.find(x=>x.nome==='Permanência');
assert.equal(permanent.grau,5);assert.equal(permanent.pagina,'62');
assert.equal(dragonbaneSpellGrade({nome:'Carga'}),4);
assert.equal(dragonbaneSpellGrade({nome:'Personalizada',tipo:'magia',grau:5}),5);
assert.equal(dragonbanePreparedLimit(13),6);
const newBook=insertDragonbaneLibraryEntry({dragonbaneShowMagic:false,habilidadesFeiticos:[]},permanent);
assert.equal(newBook.dragonbaneShowMagic,true);assert.equal(newBook.habilidadesFeiticos[0].grau,5);
assert.equal(newBook.habilidadesFeiticos[0].requisito,'Selo Mágico');
assert.equal(insertDragonbaneLibraryEntry(newBook,permanent),newBook);
assert.equal(dragonbaneSpellGroups(newBook).find(g=>g.grade===5).items.length,1);
assert.equal(dragonbaneSpellGroups(newBook,'Animismo').find(g=>g.grade===5).items.length,0);
assert.equal(dragonbaneSpellGroups(newBook,'Todas',true).find(g=>g.grade===5).items.length,0);
assert.ok(editor.includes('DragonbaneLibrary')&&preview.includes('dragonbaneSpellGroups')&&preview.includes('DRAGONBANE_SPELL_GRADES'));
console.log('✓ Dragonbane: 128 referências, graus 1–5, níveis 1–3, filtros, preparação e inserção preservada.');

const {syncDragonbaneInnates,dragonbaneLoad,DRAGONBANE_ANCESTRIES}=await import('../src/systems/dragonbane/abilities.js');
assert.equal(DRAGONBANE_ANCESTRIES.length,15);
const cat=syncDragonbaneInnates({bio:{ancestralidade:'Felídeo'},habilidadesFeiticos:[]});
assert.equal(cat.habilidadesFeiticos[0].nome,'Sete Vidas');assert.equal(cat.habilidadesFeiticos[0].pagina,'26');assert.equal(syncDragonbaneInnates(cat),cat);
const duck=syncDragonbaneInnates(cat,'Marreco');assert.equal(duck.habilidadesFeiticos.length,2);assert.ok(duck.habilidadesFeiticos.every(x=>x.autoAncestralidade==='marreco'));
assert.equal(syncDragonbaneInnates({...cat,habilidadesFeiticos:[{...cat.habilidadesFeiticos[0],desc:'Personalizada'}]},'Marreco').habilidadesFeiticos.length,3);
assert.deepEqual(dragonbaneLoad({atributos:{for:{valor:13}},dragonbaneBackpack:true,dragonbaneRations:5,dragonbaneInventory:[{nome:'Corda',peso:2,quantidade:2}],dragonbaneLegacyWeight:1}),{base:9,limit:9,current:7,over:false});
assert.ok(editor.includes('Feitiços')&&editor.includes('dbPreparedMax')&&editor.includes('db-load-panel')&&editor.includes('db-threat-tabs'));

assert.equal(dragonbaneLoad({atributos:{for:{valor:10}},moedas:{ouro:50,prata:49,cobre:1}}).current,1);
assert.equal(dragonbaneLoad({atributos:{for:{valor:10}},moedas:{ouro:50,prata:49,cobre:0}}).current,0);
assert.equal(dragonbaneLoad({atributos:{for:{valor:10}},dragonbaneCarryingPerson:true}).over,true);
assert.equal(dragonbaneLoad({atributos:{for:{valor:10}},status:{manterDerivados:true},derivados:{limiteSobrecarga:''}}).limit,5);
assert.ok(editor.includes('onSelectAncestry')&&editor.includes('dragonbaneCarryingPerson'));
