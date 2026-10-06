const EMP='pjlite_rz_employee_v1',UNLOCK='pjlite_rz_theme_unlocked_v1';
const root=document.getElementById('root');
if(localStorage.getItem(UNLOCK)!=='1'){
  root.innerHTML='<div class="panel locked"><h1>ACESSO NEGADO</h1><p class="muted">Benefícios disponíveis apenas para colaboradores registrados.</p><a class="btn" href="/">VOLTAR AO LITE</a></div>';
}else{
  let p={};try{p=JSON.parse(localStorage.getItem(EMP)||'{}')||{}}catch{}
  root.innerHTML=`
  <div class="top"><div class="mark">✦ ROTA ZERO // EMPLOYEE BENEFITS</div><div class="badge">RZ-088 · COLABORADOR ATIVO</div></div>
  <section class="hero"><h1>Bem-vindo, ${p.username||'colaborador'}.</h1><p>Seu acesso interno foi aprovado. Esta área guarda os benefícios liberados pela candidatura: tema exclusivo, modelos operacionais e acesso temporário ao arquivo do projeto.</p></section>
  <div class="grid">
   <section class="panel">
    <h2>Ficha Rota Zero Lite</h2><p class="muted">Protótipo de recompensa baseado na estrutura 3DeT Victory e adaptado para estrada, entregas e operações.</p>
    <div class="tabs"><button data-tab="operator" class="active">OPERADOR</button><button data-tab="vehicle">VEÍCULO</button></div>
    <div id="operator" class="section active">
      <div class="preset">
       <button data-preset="driver"><b>Motorista de Linha</b><small>P 2 · H 3 · R 2</small></button>
       <button data-preset="nav"><b>Navegador de Rota</b><small>P 1 · H 4 · R 2</small></button>
       <button data-preset="tech"><b>Técnico de Oficina</b><small>P 2 · H 2 · R 3</small></button>
      </div>
      <label>NOME DO OPERADOR</label><input id="opName" value="${p.username||''}">
      <div class="stat"><div><label>PODER</label><input id="opP" type="number" value="2"></div><div><label>HABILIDADE</label><input id="opH" type="number" value="3"></div><div><label>RESISTÊNCIA</label><input id="opR" type="number" value="2"></div></div>
      <div class="formgrid">
       <div><label>FUNÇÃO</label><input id="opRole" value="${p.role||'Motorista'}"></div>
       <div><label>CANAL DE RÁDIO</label><input id="opRadio" value="CH-04"></div>
       <div><label>TURNO</label><input id="opShift" value="${p.shift||'Noturno'}"></div>
       <div class="wide"><label>PERÍCIAS / ESPECIALIDADES</label><textarea id="opSkills">Pilotagem; Navegação; Percepção; Manutenção</textarea></div>
       <div class="wide"><label>VANTAGEM / QUALIDADE</label><input id="opTrait" value="${p.trait||''}"></div>
       <div class="wide"><label>ITEM DE ROTA</label><input id="opItem" value="${p.item||''}"></div>
       <div class="wide"><label>LIMITE / MEDO</label><textarea id="opLimit">${p.limit||''}</textarea></div>
       <div class="wide"><label>PROTOCOLO DIANTE DO IMPOSSÍVEL</label><textarea id="opChoice">${p.choice||''}</textarea></div>
      </div>
      <div class="actions"><button id="saveOperator">SALVAR FICHA LOCAL</button></div><div id="opStatus" class="status"></div>
    </div>
    <div id="vehicle" class="section">
      <div class="preset">
       <button data-vehicle="van"><b>Furgão RZ-04</b><small>Entrega · resistente</small></button>
       <button data-vehicle="pickup"><b>Picape RZ-17</b><small>Resgate · rápida</small></button>
       <button data-vehicle="wagon"><b>Perua RZ-31</b><small>Discreta · econômica</small></button>
      </div>
      <div class="formgrid">
       <div><label>IDENTIFICAÇÃO</label><input id="vhName" value="Furgão RZ-04"></div>
       <div><label>PLACA / PREFIXO</label><input id="vhCode" value="RZ-088"></div>
       <div><label>CANAL GPS</label><input id="vhGps" value="ROTA-04"></div>
       <div><label>ESTRUTURA</label><input id="vhStr" type="number" value="3"></div>
       <div><label>CONTROLE</label><input id="vhCtl" type="number" value="2"></div>
       <div><label>CARGA</label><input id="vhCargo" value="1 volume lacrado"></div>
       <div class="wide"><label>MODIFICAÇÕES / OFICINA</label><textarea id="vhMods">Rádio reforçado; compartimento de emergência</textarea></div>
       <div class="wide"><label>ANOTAÇÕES DE ROTA</label><textarea id="vhNotes">Não retornar pela mesma rota.</textarea></div>
      </div>
      <div class="actions"><button id="saveVehicle">SALVAR VEÍCULO LOCAL</button></div><div id="vhStatus" class="status"></div>
    </div>
   </section>
   <aside class="panel">
    <h2>Pacote de boas-vindas</h2>
    <p class="muted">Conquista RZ-088 ativa no PJ Lite desta origem. Um dos registros visuais enviados aparece a cada atualização como “mau presságio”.</p>
    <div class="mail">
      <div class="mailhead"><span>DE</span><b>Rota Zero · Recursos Humanos</b><span>PARA</span><b>${p.email||'contato Lite'}</b><span>ASSUNTO</span><b>Integração de novo colaborador</b></div>
      <div class="mailbody">Olá, <b>${p.username||'colaborador'}</b>.<br><br>É um prazer informar que você agora faz parte da Rota Zero. A família cresce sempre, e cada novo colaborador faz a diferença em nossas rotas.<br><br>Seus benefícios internos já foram liberados. Evite responder transmissões não identificadas durante o turno.<br><br>— Recursos Humanos / Rota Zero Delivery Co.</div>
    </div>
    <div class="actions"><a class="btn drive" href="https://drive.google.com/drive/u/1/home" target="_blank" rel="noopener noreferrer">ABRIR ARQUIVO DO PROJETO ↗</a><a class="btn" href="/">VOLTAR AO PJ LITE</a></div>
    <p class="muted" style="margin-top:14px">Prévia: o e-mail acima representa a mensagem que será enviada quando o envio transacional estiver conectado.</p>
   </aside>
  </div>`;

  document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{
    document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x===b));
    document.querySelectorAll('.section').forEach(x=>x.classList.remove('active'));
    document.getElementById(b.dataset.tab).classList.add('active');
  });

  const presets={
    driver:{p:2,h:3,r:2,role:'Motorista',skills:'Pilotagem; Navegação; Percepção; Sobrevivência'},
    nav:{p:1,h:4,r:2,role:'Navegador',skills:'Navegação; Percepção; Investigação; Rádio'},
    tech:{p:2,h:2,r:3,role:'Técnico de Oficina',skills:'Manutenção; Eletrônica; Improviso; Condução'}
  };
  document.querySelectorAll('[data-preset]').forEach(b=>b.onclick=()=>{const q=presets[b.dataset.preset];opP.value=q.p;opH.value=q.h;opR.value=q.r;opRole.value=q.role;opSkills.value=q.skills;});

  const vehicles={
    van:{name:'Furgão RZ-04',code:'RZ-088',gps:'ROTA-04',str:3,ctl:2,cargo:'1 volume lacrado',mods:'Rádio reforçado; compartimento de emergência'},
    pickup:{name:'Picape RZ-17',code:'RZ-117',gps:'ROTA-17',str:2,ctl:4,cargo:'kit de resgate',mods:'Guincho; pneus mistos; rádio de longo alcance'},
    wagon:{name:'Perua RZ-31',code:'RZ-231',gps:'ROTA-31',str:2,ctl:3,cargo:'carga leve',mods:'Compartimento oculto; consumo reduzido'}
  };
  document.querySelectorAll('[data-vehicle]').forEach(b=>b.onclick=()=>{const q=vehicles[b.dataset.vehicle];vhName.value=q.name;vhCode.value=q.code;vhGps.value=q.gps;vhStr.value=q.str;vhCtl.value=q.ctl;vhCargo.value=q.cargo;vhMods.value=q.mods;});

  saveOperator.onclick=()=>{
    localStorage.setItem('pjlite_rz_operator_sheet_v1',JSON.stringify({name:opName.value,p:+opP.value,h:+opH.value,r:+opR.value,role:opRole.value,radio:opRadio.value,shift:opShift.value,skills:opSkills.value,trait:opTrait.value,item:opItem.value,limit:opLimit.value,choice:opChoice.value,updatedAt:new Date().toISOString()}));
    opStatus.textContent='Ficha de operador salva localmente.';
  };
  saveVehicle.onclick=()=>{
    localStorage.setItem('pjlite_rz_vehicle_sheet_v1',JSON.stringify({name:vhName.value,code:vhCode.value,gps:vhGps.value,structure:+vhStr.value,control:+vhCtl.value,cargo:vhCargo.value,mods:vhMods.value,notes:vhNotes.value,updatedAt:new Date().toISOString()}));
    vhStatus.textContent='Ficha de veículo salva localmente.';
  };
}