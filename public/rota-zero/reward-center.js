const EMP='pjlite_rz_employee_v1',UNLOCK='pjlite_rz_theme_unlocked_v1';
const root=document.getElementById('root');
if(localStorage.getItem(UNLOCK)!=='1'){
  root.innerHTML='<div class="panel locked"><h1>ACESSO NEGADO</h1><p class="muted">Benefícios disponíveis apenas para colaboradores registrados.</p><a class="btn" href="/">VOLTAR AO LITE</a></div>';
}else{
  let p={},mail={};
  try{p=JSON.parse(localStorage.getItem(EMP)||'{}')||{}}catch{}
  try{mail=JSON.parse(localStorage.getItem('pjlite_rz_mail_preview_v1')||'{}')||{}}catch{}
  const emailStatus=mail.sent?'TRANSMITIDO':'CANAL DE E-MAIL PENDENTE';
  root.innerHTML=`
  <div class="top"><div class="mark">✦ ROTA ZERO // EMPLOYEE BENEFITS</div><div class="badge">RZ-088 · COLABORADOR ATIVO</div></div>
  <section class="hero">
    <h1>Bem-vindo, ${p.username||'colaborador'}.</h1>
    <p>Seu acesso interno foi aprovado. Os benefícios agora fazem parte do próprio PJ Lite, não de uma ficha separada.</p>
  </section>
  <div class="grid">
    <section class="panel">
      <h2>Benefícios liberados</h2>
      <div class="mail">
        <div class="mailhead">
          <span>TEMA</span><b>Rota Zero — disponível na barra de temas</b>
          <span>SISTEMA</span><b>Rota Zero — Novo Personagem</b>
          <span>FICHA</span><b>Funcionário RZ-01 + Veículo RZ-02 opcional</b>
          <span>E-MAIL</span><b>${emailStatus}</b>
        </div>
        <div class="mailbody">
          Ao criar ou abrir sua ficha Rota Zero, ela aparece junto das outras fichas do PJ Lite.
          O veículo fica dentro da ficha e pode ser ativado ou desativado como recurso opcional.
          A aba Contratação mostra Créditos restantes, Perícias, Vantagens e Defeitos com seus custos.
        </div>
      </div>
      <div class="actions">
        <a class="btn" href="/">ABRIR PJ LITE</a>
        <a class="btn drive" href="https://drive.google.com/drive/folders/1MVLTsPPATBGd910JWD5j1zYd3A779ytu?usp=drive_link" target="_blank" rel="noopener noreferrer">ABRIR ARQUIVO DO PROJETO ↗</a>
      </div>
    </section>
    <aside class="panel">
      <h2>Mensagem de integração</h2>
      <p class="muted">Prévia da comunicação corporativa associada à sua Conta Lite.</p>
      <div class="mail">
        <div class="mailhead">
          <span>DE</span><b>Rota Zero · Recursos Humanos</b>
          <span>PARA</span><b>${p.email||'contato Lite'}</b>
          <span>ASSUNTO</span><b>Integração de novo colaborador</b>
        </div>
        <div class="mailbody">
          Olá, <b>${p.username||'colaborador'}</b>.<br><br>
          É um prazer informar que você agora faz parte da Rota Zero.
          A família cresce sempre, e cada novo colaborador faz a diferença em nossas rotas.<br><br>
          Sua credencial RZ-088 e os benefícios internos foram vinculados à sua Conta Lite.<br><br>
          Evite responder transmissões não identificadas durante o turno.<br><br>
          — Recursos Humanos / Rota Zero Delivery Co.
        </div>
      </div>
    </aside>
  </div>`;
}