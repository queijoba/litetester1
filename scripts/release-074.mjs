import { readFile, writeFile } from 'node:fs/promises';

const read = (path) => readFile(path, 'utf8');
const write = (path, content) => writeFile(path, content, 'utf8');

function mustReplace(source, from, to, label) {
  if (!source.includes(from)) throw new Error(`Trecho não encontrado para ${label}`);
  return source.replace(from, to);
}

const appPath = 'src/PJLiteApp.jsx';
let app = await read(appPath);

app = mustReplace(
  app,
  "        const UPDATE_LOG = [\n            { versao: '0.7.0v Alpha'",
  "        const UPDATE_LOG = [\n            { versao: '0.7.4v Alpha', descricao: 'Prévia React pronta para homologação: D&D 5.5e recebeu polimento mobile completo, navegação por abas mais confortável, painel separado de classe/subclasse e grimório por círculos; Guias e Tutoriais foram ampliados com um fluxo rápido para iniciantes, explicações mais claras de salvamento e compartilhamento e instruções atualizadas por sistema; além de revisão estrutural, limpeza de scripts temporários e melhorias de estabilidade antes da avaliação para migração definitiva.' },\n            { versao: '0.7.0v Alpha'",
  'novo log 0.7.4v'
);

app = mustReplace(app, "version: '0.7.0v Alpha'", "version: '0.7.4v Alpha'", 'versão do backup');

app = mustReplace(
  app,
  '<span>✨ v0.7.0 Alpha — uma nova fase para o PJ Lite</span>',
  '<span>✨ 0.7.4v Alpha — prévia pronta para homologação</span>',
  'título das novidades'
);

app = mustReplace(
  app,
  '<div className="text-xs text-gray-700 space-y-1.5"><p>A <strong>v0.7.0 Alpha</strong> marca a consolidação das grandes melhorias visuais e de experiência do PJ Lite, mantendo a proposta leve.</p><p><strong>Guias:</strong> conteúdo ampliado e reorganizado para iniciantes. <strong>Fabula Ultima:</strong> materiais modulares por suplemento, extras liberados apenas quando necessários e revisão geral dos recursos. <strong>O Som das Seis:</strong> ficha revisada, habilidades mais compactas e organizáveis, melhor leitura e integração consolidada. <strong>Dragonbane e D&amp;D 5e:</strong> preservam os layouts refinados e os recursos adicionados na linha 0.6.</p></div>',
  '<div className="text-xs text-gray-700 space-y-1.5"><p>A <strong>0.7.4v Alpha</strong> reúne o polimento final desta prévia React antes de avaliarmos a migração para o projeto definitivo.</p><p><strong>D&amp;D 5.5e:</strong> ficha mobile refinada, navegação por abas mais confortável, recursos de classe/subclasse separados e grimório organizado por círculos. <strong>Guias e Tutoriais:</strong> fluxo inicial mais direto, explicações de salvamento e compartilhamento mais claras e instruções atualizadas de cada sistema.</p><p><strong>Projeto:</strong> revisão estrutural, CI/build reforçados e limpeza de ferramentas temporárias usadas durante a migração.</p></div>',
  'texto das novidades'
);

app = mustReplace(app, '>v0.7.0 • alpha</span>', '>0.7.4v • alpha</span>', 'selo das novidades');

const oldOpenSource = `                                        <div className="bg-gray-50 border border-gray-200 rounded p-4">\n                                            <h3 className="font-title font-bold text-gray-800 mb-2">Projeto de Código Aberto 🔓</h3>\n                                            <p className="text-sm text-gray-700 leading-relaxed mb-2">\n                                                Esta ferramenta é 100% gratuita, sem coleta de dados e sem fins lucrativos. Todo o armazenamento é feito localmente no seu navegador.\n                                            </p>\n                                            <p className="text-sm text-gray-700 leading-relaxed">\n                                                Para ver como funciona ou salvar no seu PC, basta clicar com o botão direito na página e selecionar <strong>"Exibir código-fonte da página"</strong> (ou Ctrl+U), copiar tudo e salvar como um arquivo <code>.html</code>.\n                                            </p>\n                                        </div>`;
const newOpenSource = `                                        <div className="bg-gray-50 border border-gray-200 rounded p-4">\n                                            <h3 className="font-title font-bold text-gray-800 mb-2">Projeto de Código Aberto 🔓</h3>\n                                            <p className="text-sm text-gray-700 leading-relaxed mb-2">\n                                                O PJ Lite é gratuito, sem fins lucrativos e mantém seus dados localmente no navegador. O projeto continua com código aberto para estudo, adaptação e colaboração.\n                                            </p>\n                                            <p className="text-sm text-gray-700 leading-relaxed">\n                                                Se quiser acessar o código, estudar a implementação, adaptar algo ou colaborar, <strong>basta entrar em contato comigo</strong>. Telegram: <strong>@ralseibaiano</strong> • Discord: <strong>inabakaoru</strong>. Assim eu posso indicar o repositório e o caminho correto da versão atual.\n                                            </p>\n                                        </div>`;
app = mustReplace(app, oldOpenSource, newOpenSource, 'orientação de código aberto');

app = mustReplace(app, 'PJ Lite v0.7.0 Alpha</div>', 'PJ Lite 0.7.4v Alpha</div>', 'versão do cabeçalho dos guias');

const simplePath = '<div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4"><h3 className="font-bold text-emerald-900 mb-2">🧭 Caminho mais simples</h3><p className="text-xs"><strong>Novo Personagem → escolha o sistema → identidade → números principais → habilidades/equipamentos → Salvar.</strong> O restante pode ser preenchido quando realmente aparecer em jogo.</p></div>';
const quickTutorial = `${simplePath}\n                                                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 space-y-3"><div><h3 className="font-bold text-indigo-950">⚡ Tutorial de 3 minutos</h3><p className="text-xs text-indigo-900 mt-1">Se você só quer criar a primeira ficha e testar o PJ Lite, faça exatamente nesta ordem:</p></div><div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-[11px]"><div className="bg-white border rounded p-2"><strong>1. Criar</strong><br/>Novo Personagem → escolha o sistema → ficha em branco ou modelo.</div><div className="bg-white border rounded p-2"><strong>2. Essencial</strong><br/>Nome, conceito, atributos e recursos principais primeiro.</div><div className="bg-white border rounded p-2"><strong>3. Salvar</strong><br/>Clique em Salvar e volte ao painel para confirmar que a ficha apareceu.</div><div className="bg-white border rounded p-2"><strong>4. Testar</strong><br/>Abra novamente, altere um campo e experimente a Ficha Chat.</div><div className="bg-white border rounded p-2"><strong>5. Proteger</strong><br/>Exporte um backup antes de depender da ficha em uma sessão importante.</div></div></div>`;
app = mustReplace(app, simplePath, quickTutorial, 'tutorial rápido');

const shareIntro = '<div className="bg-blue-50 border border-blue-200 rounded p-4"><h3 className="font-title font-bold text-blue-900 mb-2">💾 Salvar, fazer backup e compartilhar</h3><p className="text-xs">Existem formas diferentes de guardar a mesma ficha. Para quem está começando, a regra mais simples é: <strong>Salvar</strong> para o uso diário, <strong>ZIP/JSON</strong> para backup e <strong>Código</strong> para mandar rapidamente uma ficha para outra pessoa.</p></div>';
const shareChooser = `${shareIntro}\n                                                <div className="bg-white border rounded p-4"><h3 className="font-bold text-gray-900 mb-3">🧭 Qual opção eu uso?</h3><div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs"><div className="border rounded p-3"><strong>Salvar</strong><br/>Uso diário neste navegador. É a opção mais rápida durante a sessão.</div><div className="border rounded p-3"><strong>Backup geral</strong><br/>Guarda todas as fichas de uma vez. Faça antes de limpar dados ou mudar de dispositivo.</div><div className="border rounded p-3"><strong>ZIP/JSON</strong><br/>Boa escolha para guardar ou enviar uma ficha específica em arquivo.</div><div className="border rounded p-3"><strong>Código</strong><br/>Compartilhamento rápido por texto. O retrato não vai junto para manter o código compacto.</div><div className="border rounded p-3 sm:col-span-2"><strong>Ficha Chat</strong><br/>Cria um resumo legível para o grupo. Serve para consulta; não restaura nem importa a ficha.</div></div></div>`;
app = mustReplace(app, shareIntro, shareChooser, 'guia de salvamento e compartilhamento');

app = mustReplace(
  app,
  '<div className="bg-white border rounded p-4"><strong>4. Características</strong><p className="text-xs mt-1">Cadastre talentos, habilidades de classe e traços de espécie separadamente para ficar fácil consultar durante o jogo.</p></div>',
  '<div className="bg-white border rounded p-4"><strong>4. Classe & Subclasse</strong><p className="text-xs mt-1">Escolha a Classe em <strong>Ficha & Combate</strong>. Depois use a aba <strong>Classe</strong> para selecionar a subclasse, acompanhar recursos próprios e separar habilidades da classe das habilidades da subclasse.</p></div>',
  'guia D&D classe/subclasse'
);

app = mustReplace(
  app,
  '<div className="bg-white border rounded p-4"><strong>5. Magias</strong><p className="text-xs mt-1">Se o personagem conjura, registre Habilidade Chave, CD do TR e Bônus de Ataque de Magia. Depois configure os espaços de 1º a 9º nível e adicione as magias com nome, nível e descrição.</p></div>',
  '<div className="bg-white border rounded p-4"><strong>5. Magias</strong><p className="text-xs mt-1">Na aba <strong>Magias</strong>, registre Habilidade de Conjuração, CD e Ataque de Magia no topo. Cada magia é criada diretamente dentro do círculo correto, pode ser marcada como preparada e possui detalhes de componentes, alcance, duração, salvaguarda e efeito. Os espaços ficam junto do respectivo círculo.</p></div>',
  'guia D&D magias'
);

app = mustReplace(
  app,
  '<div className="bg-white border rounded p-4"><h3 className="font-bold text-gray-900 mb-2">🧭 Ordem prática para jogar rápido</h3><p className="text-xs"><strong>Identidade → Atributos → Perícias/Salvaguardas → CA/PV → Ataques → Recursos de classe → Magias (se houver) → Equipamento.</strong> Você não precisa preencher uma área de magia para um personagem que não conjura.</p></div>',
  '<div className="bg-white border rounded p-4"><h3 className="font-bold text-gray-900 mb-2">🧭 Ordem prática para jogar rápido</h3><p className="text-xs"><strong>Identidade → Atributos → Perícias/Salvaguardas → CA/PV → Ataques → Classe/Subclasse → Magias (se houver) → Equipamento.</strong> Você não precisa preencher uma área de magia para um personagem que não conjura.</p></div>\n                                                <div className="bg-slate-50 border border-slate-300 rounded p-4"><h3 className="font-bold text-slate-900 mb-2">📱 D&D no celular</h3><p className="text-xs">As abas principais ficam fixas e podem ser deslizadas horizontalmente. Atributos usam uma grade compacta, perícias continuam lado a lado quando houver espaço e os painéis de Classe e Magias viram uma coluna confortável para toque. No grimório, cada magia ocupa um cartão por linha para evitar campos espremidos.</p></div>',
  'guia D&D mobile'
);

app = mustReplace(app, 'v0.7.0 Alpha • recursos modulares', '0.7.4v Alpha • recursos modulares', 'selo Fabula do guia');
app = mustReplace(app, 'v0.7.0 Alpha • integração consolidada', '0.7.4v Alpha • integração consolidada', 'selo Som das Seis do guia');
app = mustReplace(app, 'Integrado 0.7.0</span>', 'Integrado 0.7.4v</span>', 'selo Som das Seis na criação');

await write(appPath, app);

const indexPath = 'index.html';
let index = await read(indexPath);
index = index.replaceAll('v0.7.0v Alpha', '0.7.4v Alpha');
index = index.replaceAll('D&amp;D 5e', 'D&amp;D 5.5e');
await write(indexPath, index);

const packagePath = 'package.json';
const pkg = JSON.parse(await read(packagePath));
pkg.version = '0.7.4-alpha.1';
await write(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);

const lockPath = 'package-lock.json';
const lock = JSON.parse(await read(lockPath));
lock.version = '0.7.4-alpha.1';
if (lock.packages?.['']) lock.packages[''].version = '0.7.4-alpha.1';
await write(lockPath, `${JSON.stringify(lock, null, 2)}\n`);

const readmePath = 'README.md';
let readme = await read(readmePath);
readme = mustReplace(
  readme,
  '# LiteTester1 — PJ Lite React Preview\n\n',
  '# LiteTester1 — PJ Lite React Preview\n\n**Versão atual da prévia:** 0.7.4v Alpha\n\n',
  'versão do README'
);
readme = mustReplace(
  readme,
  '- O CI executa verificação estrutural e build em cada push/PR para `main`.\n',
  '- O CI executa verificação estrutural e build em cada push/PR para `main`.\n- Guias e Tutoriais foram atualizados para a 0.7.4v Alpha, com tutorial rápido, orientação de backup/compartilhamento e instruções mais atuais para D&D 5.5e no celular.\n',
  'estado dos guias no README'
);
readme += `\n## Código aberto e contato\n\nO PJ Lite continua sendo um projeto gratuito e de código aberto. Para acessar o código, estudar a implementação, adaptar algo ou colaborar, entre em contato com Nick Queijo pelo **Telegram @ralseibaiano** ou **Discord inabakaoru** para receber a orientação e o repositório corretos da versão atual.\n`;
await write(readmePath, readme);

const verifyPath = 'scripts/verify-project.mjs';
let verify = await read(verifyPath);
verify = mustReplace(
  verify,
  "const app = await readFile('src/PJLiteApp.jsx', 'utf8');\n",
  "const app = await readFile('src/PJLiteApp.jsx', 'utf8');\nif (!app.includes(\"versao: '0.7.4v Alpha'\")) {\n  throw new Error('PJLiteApp.jsx não anuncia a versão 0.7.4v Alpha.');\n}\nif (!app.includes('Tutorial de 3 minutos')) {\n  throw new Error('Guias e Tutoriais não contêm o tutorial rápido da 0.7.4v.');\n}\nif (app.includes('Exibir código-fonte da página')) {\n  throw new Error('A orientação antiga de copiar o HTML ainda está presente.');\n}\nif (!app.includes('@ralseibaiano') || !app.includes('inabakaoru')) {\n  throw new Error('A orientação de contato para o código aberto está incompleta.');\n}\n\nconst indexHtml = await readFile('index.html', 'utf8');\nif (!indexHtml.includes('0.7.4v Alpha')) {\n  throw new Error('index.html não anuncia a versão 0.7.4v Alpha.');\n}\n",
  'verificações da 0.7.4v'
);
await write(verifyPath, verify);

console.log('PJ Lite: atualização 0.7.4v Alpha aplicada à prévia.');
