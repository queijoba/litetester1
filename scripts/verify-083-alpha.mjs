import { readFile } from 'node:fs/promises';

const sky=await readFile('src/systems/skyfall/components/CharacterEditor.jsx','utf8');
const skyCss=await readFile('src/systems/skyfall/skyfall-theme.css','utf8');
const ordem=await readFile('src/systems/ordemParanormal/components/CharacterEditor.jsx','utf8');
const ordemDataText=await readFile('src/systems/ordemParanormal/data.js','utf8');
const ordemCss=await readFile('src/systems/ordemParanormal/ordem-theme.css','utf8');
const ordemChat=await readFile('src/systems/ordemParanormal/chat.js','utf8');
const app=await readFile('src/PJLiteApp.jsx','utf8');

const need=(text,tokens,label)=>{for(const token of tokens)if(!text.includes(token))throw new Error(`${label}: ausente ${token}`);};
need(sky,['PJ LITE 0.8.3 SKYFALL PROFILE ATTRS','skyfall-profile-aside','skyfall-profile-attributes','moveMagic','sortMagicLayer'],'Skyfall 0.8.3');
if(sky.includes('skyfall-card skyfall-attributes-top'))throw new Error('Skyfall: atributos ainda estão no topo global.');
need(skyCss,['PJ LITE 0.8.3 SKYFALL THEME','.skyfall-profile-attributes','.skyfall-profile-aside'],'Tema Skyfall');
need(ordem,["['rituais','Rituais']",'PODERES PARANORMAIS',"sortByName('poderesParanormais')","move('poderesParanormais'","tab==='rituais'"],'Ordem 0.8.3');
need(ordemDataText,['poderesParanormais:[]','migrados','/paranormal/i'],'Dados Ordem');
need(ordemCss,['PJ LITE 0.8.3 ORDEM THEME','.ordem-paranormal-entry','.ordem-ritual-entry'],'Tema Ordem');
need(ordemChat,['PODERES PARANORMAIS','RITUAIS','HABILIDADES & PODERES'],'Ficha Chat Ordem');
need(app,['PJ LITE 0.8.3 ALPHA FINAL','PJ LITE 0.9.1 RELEASE BASE','PJ LITE 0.9.5 RELEASE',"versao: '0.9.1v Alpha'","versao: '0.9.5v Alpha'",'✨ 0.9.5v Alpha — Conta Lite e grupos em nuvem','Poderes Paranormais','Truques, Camada Superficial'],'App 0.9.5');
if(!app.includes('const SCHEMA_VERSION = 7;'))throw new Error('Schema não atualizado para 7.');

const ordemData=await import('../src/systems/ordemParanormal/data.js');
const migrated=ordemData.normalizeOrdemPcData({system:'ordemParanormal',type:'pc',habilidades:[{nome:'Visão do Oculto',tipo:'Poder Paranormal',desc:'legado'}]});
if(migrated.habilidades.length!==0||migrated.poderesParanormais.length!==1||migrated.poderesParanormais[0].nome!=='Visão do Oculto')throw new Error('Migração de Poder Paranormal antigo falhou.');

console.log('✓ Base 0.9.5v Alpha: UX, migração, temas, guias e novidades verificados.');
