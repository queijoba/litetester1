import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
 DRAGONBANE_ABILITY_KINDS,DRAGONBANE_INNATE_CATALOG,dragonbaneAncestryKey,
 dragonbaneInnateSuggestions,createDragonbaneAbility,dragonbaneAbilityKind,
 dragonbaneAbilityList,dragonbanePdfAbilityOrder,dragonbanePdfAbilityName,dragonbaneMagicSchool,renameDragonbaneAbility
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
assert.equal(Object.values(DRAGONBANE_INNATE_CATALOG).reduce((n,a)=>n+a.length,0),7);
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

// Rollback visual solicitado em 22/10: conservar o editor clássico anterior às três abas.
assert.ok(editor.includes('HABILIDADES E MAGIAS'), 'O editor clássico deve exibir uma única área de habilidades e magias');
assert.ok(editor.includes("addToArray('habilidadesFeiticos'"), 'Adicionar recursos à lista antiga');
assert.ok(editor.includes("updateArrayField('habilidadesFeiticos'"), 'Editar recursos antigos na própria ficha');
assert.ok(editor.includes("removeFromArray('habilidadesFeiticos'"), 'Remover recursos manualmente');
assert.ok(editor.includes('db-ability-list')&&editor.includes('db-ability-card'), 'Recuperar cartões clássicos');
assert.ok(editor.includes('mobileTab === tab.id'), 'Recuperar navegação mobile clássica');
assert.ok(editor.includes('db-paper db-sheet'), 'Preservar pergaminho e estrutura original');
assert.ok(!editor.includes('db-primary-tabs')&&!editor.includes('dbPage'), 'Não mostrar a reorganização recente em três abas');
assert.ok(!editor.includes('<DragonbaneAbilityPanels'), 'Não substituir os cartões originais por novos painéis');
assert.ok(app.includes('DRAGONBANE_ABILITY_KINDS.forEach'), 'Manter utilitários atuais usados em PDF e chat');
assert.ok(css.includes('#2e786a')&&css.includes('#f5edd4'), 'Manter paleta e recursos de compatibilidade');

console.log('✓ Dragonbane: editor clássico restaurado, cartões editáveis, chat e PDF legado preservados.');


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
