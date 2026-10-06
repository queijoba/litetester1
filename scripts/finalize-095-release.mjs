import { readFile, writeFile } from 'node:fs/promises';

const APP = 'src/PJLiteApp.jsx';
const INDEX = 'index.html';
const VERIFY = 'scripts/verify-project.mjs';
const MARKER = 'PJ LITE 0.9.5 RELEASE';

let app = await readFile(APP, 'utf8');

if (!app.includes(MARKER)) {
  const logAnchor = '        const UPDATE_LOG = [\n';
  const logEntry = "            { versao: '0.9.5v Alpha', descricao: 'Conta Lite entra na fase real de uso: login e sincronização em nuvem, grupos com códigos de convite, compartilhamento de fichas, nova Home mais ampla e polida, além da integração experimental Rota Zero (#088) com recrutamento, ficha de funcionário, veículo, Hora Extra e exportação PDF.' },\n";
  if (!app.includes("versao: '0.9.5v Alpha'")) {
    if (!app.includes(logAnchor)) throw new Error('0.9.5: UPDATE_LOG não localizado.');
    app = app.replace(logAnchor, logAnchor + logEntry);
  }

  app = app.replaceAll("version: '0.9.1v Alpha'", "version: '0.9.5v Alpha'");
  app = app.replaceAll('✨ 0.9.1v Alpha — nova base oficial do PJ Lite', '✨ 0.9.5v Alpha — Conta Lite e grupos em nuvem');
  app = app.replaceAll('0.9.1v • alpha', '0.9.5v • alpha');
  app = app.replaceAll('base 0.9.1', 'base 0.9.5');

  const newsPattern = /<div className="text-xs text-gray-700 space-y-1\.5"><p><strong>0\.9\.1v Alpha<\/strong>[\s\S]*?<\/div>/;
  const news = '<div className="text-xs text-gray-700 space-y-1.5"><p><strong>0.9.5v Alpha</strong> consolida a nova fase conectada do PJ Lite.</p><p><strong>Conta Lite:</strong> login e sincronização em nuvem passam a fazer parte do fluxo principal, preservando os saves locais e a importação/exportação.</p><p><strong>Grupos:</strong> criação de grupos, código de convite, entrada de membros e compartilhamento de fichas foram integrados ao painel da conta.</p><div aria-label="Interferência visual Rota Zero" className="my-2 border-l-2 border-red-800 bg-black px-3 py-2 font-mono text-[10px] leading-relaxed text-red-300 shadow-inner"><strong className="tracking-widest text-red-400">#088 FALHO</strong><br/><span className="opacity-80">RZ-HR-12 // colab_███ // RETORNO: NÃO CONFIRMADO // rota: 88/██ // sinal...</span><br/><span className="text-red-500/70">[dados parcialmente recuperados] [não responda se o rádio usar seu nome]</span></div><p><strong>Rota Zero:</strong> o protocolo #088 agora integra recrutamento, ficha de funcionário, veículo/turno, Hora Extra para campanhas e exportação PDF, mantendo o conteúdo escondido até o desbloqueio.</p><p><strong>Interface:</strong> a Home recebeu mais espaço, melhor leitura no desktop e refinamentos visuais no painel de conta e grupos.</p><p><strong>Estabilidade:</strong> o backend de convites e grupos foi revisado, incluindo a correção da entrada por código e ajustes de segurança/RLS.</p></div>';
  if (newsPattern.test(app)) app = app.replace(newsPattern, news);

  app = `/* ${MARKER} */\n${app}`;
  await writeFile(APP, app, 'utf8');
}

let html = await readFile(INDEX, 'utf8');
html = html.replaceAll('0.9.1v Alpha', '0.9.5v Alpha').replaceAll('0.9.1v', '0.9.5v');
await writeFile(INDEX, html, 'utf8');

let verify = await readFile(VERIFY, 'utf8');
verify = verify.replaceAll('0.9.1v Alpha', '0.9.5v Alpha').replaceAll('base 0.9.1', 'base 0.9.5');
await writeFile(VERIFY, verify, 'utf8');

console.log('✓ PJ Lite 0.9.5v Alpha aplicado ao build final.');
