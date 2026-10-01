import { readFile, writeFile } from 'node:fs/promises';

const appPath='src/PJLiteApp.jsx';
const indexPath='index.html';
const RELEASE='0.9.1v Alpha';

let app=await readFile(appPath,'utf8');
if(!app.includes('PJ LITE 0.9.1 RELEASE BASE')){
  const logAnchor='        const UPDATE_LOG = [\n';
  const logEntry="            { versao: '0.9.1v Alpha', descricao: 'Nova base oficial da linha Alpha. Skyfall RPG e Ordem Paranormal RPG passam a integrar o PJ Lite ao lado de Dragonbane, D&D 5.5e (2024), Fabula Ultima, 3DeT Victory e O Som das Seis. Skyfall recebe ficha inspirada no modelo oficial, Proteções por atributo, Status & Combate, magias por Camadas com ordenação e PDF integrado. Ordem recebe modo clássico ou Sobrevivendo ao Horror, SAN/PE ou Determinação (PD), regra opcional NEX & Experiência, automações de Defesa e Perícias, Poderes Paranormais, Rituais em aba própria, Evolução opcional e PDF integrado. Temas, mobile, Ficha Chat, saves, importação, Guias e Tutoriais foram revisados para esta ser a base atual do Alpha.' },\n";
  if(!app.includes("versao: '0.9.1v Alpha'")){
    if(!app.includes(logAnchor)) throw new Error('0.9.1: UPDATE_LOG não localizado.');
    app=app.replace(logAnchor,logAnchor+logEntry);
  }

  app=app.replace("version: '0.8.3v Alpha'","version: '0.9.1v Alpha'");
  app=app.replace('✨ 0.8.3v Alpha — Skyfall + Ordem refinados','✨ 0.9.1v Alpha — nova base oficial do PJ Lite');
  app=app.replace('✨ 0.8.3v Alpha — nova base oficial do PJ Lite','✨ 0.9.1v Alpha — nova base oficial do PJ Lite');
  app=app.replace('0.8.3v • alpha','0.9.1v • alpha');

  const newsPattern=/<div className=\"text-xs text-gray-700 space-y-1\.5\"><p>(?:A )?<strong>0\.8\.3v Alpha<\/strong>[\s\S]*?<\/div>/;
  const news=`<div className="text-xs text-gray-700 space-y-1.5"><p><strong>0.9.1v Alpha</strong> é a <strong>nova base atual da linha Alpha</strong> do PJ Lite e substitui a antiga base 0.8.x para os próximos desenvolvimentos.</p><p><strong>Novos sistemas:</strong> Skyfall RPG e Ordem Paranormal RPG entram oficialmente no conjunto principal, ao lado de Dragonbane, D&amp;D 5.5e (2024), Fabula Ultima, 3DeT Victory e O Som das Seis.</p><p><strong>Skyfall RPG:</strong> identidade baseada na ficha oficial, atributos e Proteções em destaque, Status &amp; Combate, perícias, habilidades, inventário e Magias separadas em Truques, Camada Superficial, Rasa e Profunda, com A–Z e setas para reorganização.</p><p><strong>Ordem Paranormal RPG:</strong> suporte ao Livro de Regras e às opções de Sobrevivendo ao Horror, incluindo PV + PE + SAN ou Determinação (PD), NEX &amp; Experiência opcional, Defesa e Perícias automatizadas, Poderes Paranormais, Rituais separados e Evolução opcional.</p><p><strong>Base 0.9.1:</strong> PDFs integrados, temas e mobile revisados, saves/importação preservados, Ficha Chat atualizada e Guias &amp; Tutoriais reescritos para refletir o estado atual do projeto.</p></div>`;
  if(newsPattern.test(app)) app=app.replace(newsPattern,news);

  const skyGuide=`                                        {guideTab === 'skyfall' && (<div className="space-y-4"><div className="bg-violet-950 text-white rounded p-4"><h3 className="font-title font-bold text-lg">☄️ Skyfall RPG — Guia da Ficha</h3><p className="text-xs text-violet-100 mt-1">Guia atualizado para a base 0.9.1, usando o Livro Básico e a ficha editável integrada como referência.</p></div><div className="grid sm:grid-cols-2 gap-3"><div className="bg-white border rounded p-4"><strong>1. Identidade e Atributos</strong><p className="text-xs mt-1">Preencha Nome, Jogador, Pronomes, Legado, Herança, Antecedente, Maldição, Classe, Trilha e Melancolia. FOR, CON, DES, SAB, INT e CAR aparecem próximos das Proteções para consulta rápida.</p></div><div className="bg-white border rounded p-4"><strong>2. Status &amp; Combate</strong><p className="text-xs mt-1">PV, Catarse, Ênfase, Pontos de Sombra, Fragmentos Arcanos, Volume, PV Temporários, Dados de Vida, Testes de Morte, RD, iniciativa, deslocamento e ataques ficam reunidos para diminuir troca de abas.</p></div><div className="bg-white border rounded p-4"><strong>3. Perícias</strong><p className="text-xs mt-1">Use proficiência, Ênfase e bônus extras conforme a mesa. O PJ Lite organiza a consulta, mas custos, exceções e regras continuam seguindo o material oficial.</p></div><div className="bg-white border rounded p-4"><strong>4. Habilidades &amp; Inventário</strong><p className="text-xs mt-1">Registre habilidades, custos e descritores. Itens podem guardar Volume, Fragmentos e observações; ataques aceitam descrição e podem ser reorganizados.</p></div><div className="bg-white border rounded p-4"><strong>5. Magias</strong><p className="text-xs mt-1">A aba de Magias segue a organização do grimório: Truques, Camada Superficial, Camada Rasa e Camada Profunda. Use A–Z ou ↑/↓ para ordenar; cada magia pode guardar alcance, duração, custo, descritores e descrição.</p></div><div className="bg-white border rounded p-4"><strong>6. PDF, Ficha Chat e Saves</strong><p className="text-xs mt-1">Baixar PDF preenche o modelo editável integrado. Ficha Chat cria um resumo para compartilhar, e salvar/importar mantém a ficha no padrão geral do PJ Lite.</p></div></div><div className="bg-amber-50 border border-amber-300 rounded p-4 text-xs"><strong>Mestre:</strong> a área de ameaças/PNJs usa Hierarquia, Arquétipo, Tipo, Tamanho, ND/XP, Recarga, ataques e habilidades para consulta rápida. O PJ Lite não substitui o Livro Básico.</div></div>)}

`;
  const ordemGuide=`                                        {guideTab === 'ordem' && (<div className="space-y-4"><div className="bg-[#180909] text-white rounded p-4"><h3 className="font-title font-bold text-lg">🔻 Ordem Paranormal RPG — Guia da Ficha</h3><p className="text-xs text-red-100 mt-1">Guia atualizado para a base 0.9.1, combinando o Livro de Regras v1.3 com opções de Sobrevivendo ao Horror.</p></div><div className="grid sm:grid-cols-2 gap-3"><div className="bg-white border rounded p-4"><strong>1. Agente, NEX e Nível</strong><p className="text-xs mt-1">Preencha Nome, Jogador, Origem, Classe, Trilha e Patente. NEX continua representando exposição paranormal; a regra opcional NEX &amp; Experiência permite registrar também o Nível de Experiência.</p></div><div className="bg-white border rounded p-4"><strong>2. Recursos: SAN/PE ou PD</strong><p className="text-xs mt-1">No modo clássico use PV + PE + SAN. Ao ativar Determinação (PD), PE e SAN são ocultados e PD passa a representar esse recurso combinado, preservando os valores antigos caso você volte ao modo clássico.</p></div><div className="bg-white border rounded p-4"><strong>3. Atributos, Perícias e Automação</strong><p className="text-xs mt-1">AGI, FOR, INT, PRE e VIG alimentam a ficha. Cada perícia permite trocar o atributo-base, definir treinamento e Outros. O PJ Lite mostra Dados e Bônus automaticamente e também pode calcular Defesa = 10 + AGI + Equipamento + Outros.</p></div><div className="bg-white border rounded p-4"><strong>4. Combate &amp; Equipamento</strong><p className="text-xs mt-1">Defesa, Bloqueio, Esquiva, deslocamento, proteção, resistências, ataques e inventário ficam organizados para consulta durante a sessão.</p></div><div className="bg-white border rounded p-4"><strong>5. Poderes, Poderes Paranormais e Rituais</strong><p className="text-xs mt-1">Habilidades/Poderes e Poderes Paranormais são áreas separadas e organizáveis. Rituais têm aba própria com Círculo, Elemento, execução, alcance, duração, resistência, custo, página e descrição, além de A–Z e ↑/↓.</p></div><div className="bg-white border rounded p-4"><strong>6. Evolução, PDF e Ficha Chat</strong><p className="text-xs mt-1">Evolução por Patentes é opcional e só aparece quando ativada. Baixar PDF usa a ficha editável de Sobrevivendo ao Horror integrada. A Ficha Chat respeita o modo SAN/PE ou PD escolhido.</p></div></div><div className="bg-red-50 border border-red-200 rounded p-4 text-xs"><strong>Regras opcionais:</strong> NEX &amp; Experiência e Evolução por Patentes são controles separados para você usar apenas quando a campanha adotar essas variantes.</div></div>)}

`;

  app=app.replace(/\s*\{guideTab === 'skyfall' && \([\s\S]*?(?=\s*\{guideTab === 'ordem' && \()/, '\n'+skyGuide);
  app=app.replace(/\s*\{guideTab === 'ordem' && \([\s\S]*?(?=\s*\{guideTab === 'som6' && \()/, '\n'+ordemGuide);

  app=app.replace('PJ Lite 0.8.3v Alpha','PJ Lite 0.9.1v Alpha');
  app=`/* PJ LITE 0.9.1 RELEASE BASE */\n${app}`;
  await writeFile(appPath,app,'utf8');
}

let html=await readFile(indexPath,'utf8');
html=html.replaceAll('0.8.0v Alpha','0.9.1v Alpha').replaceAll('0.8.3v Alpha','0.9.1v Alpha').replaceAll('0.8.0v','0.9.1v').replaceAll('0.8.3v','0.9.1v');
html=html.replace(/Dragonbane, D&amp;D 5\.5e, Fabula Ultima, O Som das Seis e 3DeT Victory/g,'Dragonbane, D&amp;D 5.5e, Fabula Ultima, 3DeT Victory, O Som das Seis, Skyfall RPG e Ordem Paranormal');
await writeFile(indexPath,html,'utf8');

const verifyPath='scripts/verify-project.mjs';
let verify=await readFile(verifyPath,'utf8');
verify=verify.replaceAll('0.8.0v Alpha','0.9.1v Alpha').replaceAll('0.8.3v Alpha','0.9.1v Alpha').replaceAll('prévia 0.8.0','base 0.9.1').replaceAll('base 0.8.3','base 0.9.1');
await writeFile(verifyPath,verify,'utf8');

console.log(`✓ ${RELEASE} definida como nova base oficial; Novidades, Guias e metadados atualizados.`);
