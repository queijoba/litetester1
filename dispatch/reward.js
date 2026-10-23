(async () => {
  const EMP='pjlite_rz_employee_v1';
  const UNLOCK='pjlite_rz_theme_unlocked_v1';
  const SUPABASE_URL='https://jkwlsfkuxaelqjqrirdd.supabase.co';
  const SUPABASE_KEY='sb_publishable_3p5Jio7t415Lv75rjEVFCg_rlG3ryfJ';

  const liteSession=()=>{
    try{return JSON.parse(localStorage.getItem('sb-jkwlsfkuxaelqjqrirdd-auth-token')||'null')}catch{return null}
  };
  const syncCloudReward=async()=>{
    const session=liteSession();
    const token=session?.access_token||session?.currentSession?.access_token||session?.session?.access_token||'';
    if(!token)return;
    try{
      const response=await fetch(SUPABASE_URL+'/rest/v1/rota_zero_collaborators?select=email,username,application&limit=1',{
        headers:{apikey:SUPABASE_KEY,Authorization:'Bearer '+token}
      });
      if(!response.ok)return;
      const rows=await response.json();
      const row=Array.isArray(rows)?rows[0]:null;
      if(!row)return;
      const prev=JSON.parse(localStorage.getItem(EMP)||'{}')||{};
      localStorage.setItem(EMP,JSON.stringify({...prev,...(row.application||{}),email:row.email,username:row.username,cloud:true}));
      localStorage.setItem(UNLOCK,'1');
    }catch{}
  };
  await syncCloudReward();
  if(localStorage.getItem(UNLOCK)!=='1') return;

  let profile={};
  try{profile=JSON.parse(localStorage.getItem(EMP)||'{}')||{};}catch{}
  const email=String(profile.email||'');
  const session=liteSession()||{};
  const user=session?.user||session?.currentSession?.user||session?.session?.user||{};
  const meta=user?.user_metadata||{};
  const gmailUser=(email.split('@')[0]||profile.username||'colaborador').trim();
  const displayName=String(profile.accountName||meta.full_name||meta.name||profile.username||gmailUser||'colaborador').trim();
  const shortName=(displayName.split(/\s+/)[0]||gmailUser).slice(0,24);

  const omens=[
    ['You','data:image/webp;base64,UklGRqgFAABXRUJQVlA4WAoAAAAQAAAARwAARwAAQUxQSJwCAAABoGvbliLJuQE5zGK0mGWxZDEzMzMzy5P+gbzhqSWTZcqXx8zMnBHxrlGREZH5+gMiYgKwkPsJeDeJdzaPZYCNt7vx/Iz9/zBjdOeT//yB8S17CtGNcB5J9rf60cCeTHeiuT8vJpLh4tH87YEkQ2rlL42JWYxtfmNW/odp0Z3P4V3tOGal5ChE1+A8Dst/MKPYgzgc70S1Oz+kgl/GMeYVGWKIVZfGxFKM6wJLpYcp6PAny+NsnBOkiCSG3XG/pgpysx/jlVghhMv44yWyNn5o27lHfpEKhvuQ/zqyuidGmCVWS4QB8Fdkw3Chbwb2dRTC4efEtmjtrwtsKXL415GNtzetLm9DfsHme9lGYOvUTH5HW7t3szFdGzOTyaUnbRPXc/r/WN8C1IiugXsrKvj/XtR7+6MoIC/2dasTNaY/TZV9uNdB1Nr9X4sqhCtthT83Uqf8hVomJRRXZpdTtKSTbZF5Rqi1f7krwhd6SNMVCfXK9r6Iivs7TYG9Pmm6FoV+S1BEnusGOghV32sHcPP/qkSQd2dSt3C1yeDzqG3njFkkou2kDH5OVJ4+QZb6/8tFfbSZz5I6OcQsEGG9n/t4Adg4Zw6gqFuf2UlfvM9hXtTRYt7elpSlb5A75hNR9ksOuL7XJc8NuAOSKuFOJtdZKnMY9FuDLhS8qesNMwRQ9Zmu5BvRE55aikIzU9TfZkrsHpJ0iCQe5op2I0WmJ0LybdgSYNfdZ9+RYUKR5Fez3XdFtTUAbnuJDP0EIsnZ0wBgbF3Weux56x2U+WYiwmfPAbybG9EDOI3ZlBqkRJKnAV2HKTpg7fY7bfrkMzKGMBACyW8+um/n7eEMpmuMwfyLmzaSIQRy44bHMG8MVHrvgeuvvRrw3mVUe+8xQVZQOCDmAgAAMBAAnQEqSABIAD5tLpNGpCKhoS4S62iADYlnDbflebtI8A8gDrPPKAzCWVQOROVOwI30DxYZgH865NyYATI+89zF5+IapkwR51C7vE4hpQszQeeQTACtJgI/vdb5Sfo/Dzg2ZOsJ0z4CpcT2kG50HODQRDb7odAkaBEvMJEm3m9Ix7mb4IycqrCAAP77k//+s68tJBOCiSJkAP7MtGpbG7/lSgiGcuhe4feiPPfI9zp22KPEZNQ1jdQPHVwisEfKAMeILJjqNJ0OtV3WDuwGdkVhtln2R9As0jfT7pJuJqxt5ctrRo4gLi+scNGqsc0lfyw0DBZlw5tlrNEVwtodSqFv/asLOKdmyVGLt3I93+9oDsz2tt8pq0yedliAL0NzcuW+9TaPqXd6bcK7LgWEA+suNvQhe0PCuSWb1Aw1JzYtQuvv7h///VIc6/Mzo/g2zlTImmmoVnA+KQE5xPcJ6guPbgeuGlimK7pEzdXIfuSIpX959PlbDSMhO3N3XVLLERcAGf/2+3inW5EMMX8spRLHvqBaufOykiSB1HYG4MHz+QLZfJNEnusdhomeIiJ+DSTjB0PT9Sak22dCW+v9S37yupc+LqAlkmsEj8C+mR1VwJ5bb39FIAWZyZTAYUtb8irwqTHA5hqlSTF5KfkYT/RBNLdWQL3T/XOncANNHx+BtNX3xNKj/7/5WHW8o2h+qaZzbhJz9CfUrEVdsGJ2CbC25GhCv0I/aK/xT6J019Dt7Jb8o8KSx59f28IWIy3DBI0XLkiHpeiDChKJTHJAFPc4R7r4dmVfR7or+2NZfIMdlfvQbs/QR6rMhBZVOFLq6646A4PuX//Zo69CbtHtMLVlZiSeubHzlsLCYv3jx3620l5HvBfjKqBBXcYBPbqbNdPDIKGWvVd6u4EPH0WVfQ/Qwh7msg3DaOSieKpe43Y+voZivspyNf6QE3XRHEuY7gXrfIgbtxBAkTA56R1XPKi/9AAAAA=='],
    ['MK','data:image/webp;base64,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'],
    ['Theo','data:image/webp;base64,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'],
    ['Cici','data:image/webp;base64,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'],
    ['Fortino','data:image/webp;base64,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'],
    ['Ellie','data:image/webp;base64,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'],
    ['Fit','data:image/webp;base64,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'],
    ['Tooey','data:image/webp;base64,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']
  ];
  const chosen=omens[Math.floor(Math.random()*omens.length)];

  const style=document.createElement('style');
  style.textContent=`
    #rz-achievement{position:fixed;left:16px;bottom:16px;z-index:99999;display:flex;align-items:center;gap:8px;background:#101714;color:#dbe4dc;border:1px solid #566c5d;border-radius:999px;padding:8px 12px;font:700 11px/1.2 ui-monospace,monospace;box-shadow:0 10px 30px #0004;text-decoration:none}
    #rz-welcome{position:fixed;right:14px;top:14px;z-index:99998;background:#101714ee;color:#dbe4dc;border:1px solid #566c5d;border-radius:10px;padding:7px 10px;font:700 10px/1.35 ui-monospace,monospace;box-shadow:0 10px 28px #0004;max-width:310px;display:flex;align-items:center;gap:8px;transition:max-width .35s ease,padding .35s ease,opacity .25s ease,transform .35s ease}
    #rz-welcome-text{min-width:0}
    #rz-omen{position:static;flex:0 0 auto;width:36px;height:36px;object-fit:contain;opacity:.72;filter:grayscale(.08) contrast(1.05) drop-shadow(0 0 8px #0008);image-rendering:pixelated;animation:rzflicker 5s infinite;pointer-events:auto;cursor:help;transition:width .35s ease,height .35s ease}
    #rz-welcome.rz-compact{max-width:185px;padding:5px 8px;border-radius:999px;opacity:.88;transform:translateY(0)}
    #rz-welcome.rz-compact #rz-omen{width:25px;height:25px}
    #rz-welcome.rz-compact #rz-welcome-text{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:9px}
    #rz-welcome.rz-hidden{opacity:0;pointer-events:none;transform:translateY(-10px)}\n    #rz-scan{position:absolute;right:calc(100% + 10px);top:0;width:300px;display:grid;gap:5px;opacity:0;transform:translateX(8px);transition:.18s;pointer-events:none}\n    #rz-welcome.rz-scan-open #rz-scan{opacity:1;transform:translateX(0)}\n    .rz-scan-line{background:#0b110eee;border:1px solid #52665a;color:#becbc1;border-radius:4px;padding:5px 7px;box-shadow:0 6px 18px #0006;font:700 9px/1.35 ui-monospace,monospace;text-align:left}\n
    @keyframes rzflicker{0%,92%,100%{opacity:.62;transform:translate(0,0)}93%{opacity:.18;transform:translate(1px,-1px)}94%{opacity:.8;transform:translate(-1px,1px)}}
    @media(max-width:640px){#rz-welcome{top:8px;right:8px;max-width:245px}#rz-welcome.rz-compact{max-width:155px}#rz-achievement{left:8px;bottom:8px}#rz-omen{width:32px;height:32px}#rz-scan{right:0;top:calc(100% + 7px);width:min(300px,calc(100vw - 16px))}.rz-scan-line{font-size:10px}}
  `;
  document.head.appendChild(style);

  const original=document.getElementById('lite-signal-preview');
  if(original){original.style.display='none';}

  const badge=document.createElement('a');
  badge.id='rz-achievement'; badge.href='/rota-zero/'; badge.title='Conquista RZ-088';
  badge.innerHTML='<span style="color:#9ab99d">✦</span><span>RZ-088 · COLABORADOR</span>';
  document.body.appendChild(badge);

  const welcome=document.createElement('div');
  welcome.id='rz-welcome';

  const omen=document.createElement('img');
  omen.id='rz-omen'; omen.src=chosen[1]; omen.alt=''; omen.title='registro: '+chosen[0];

  const welcomeText=document.createElement('span');
  welcomeText.id='rz-welcome-text';
  const fullWelcome='Bem-vindo de volta, '+displayName+'. Estamos felizes em te ver aqui :>';
  welcomeText.textContent=fullWelcome;

  const scan=document.createElement('div');
  scan.id='rz-scan';
  const rawBirth=String(meta.birthdate||meta.birthday||meta.date_of_birth||'').trim();
  const birthText=(()=>{
    if(!rawBirth)return '';
    const d=new Date(rawBirth);
    if(Number.isNaN(d.getTime()))return rawBirth;
    return new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric'}).format(d);
  })();
  const scanLines=[
    'NOME NA CONTA // '+displayName,
    email?'CONTATO RECONHECIDO // '+email:'',
    birthText?'Seu aniversário é '+birthText+', né? Vamos rever seu bônus salarial.':(profile.age?'Então você tem '+profile.age+' anos. RH anotou isso.':'IDADE // esse campo não foi exposto pela conta.'),
    profile.role?'FUNÇÃO PREVISTA // '+profile.role:'',
    profile.shift?'TURNO PREFERIDO // '+profile.shift:''
  ].filter(Boolean);
  scanLines.forEach(line=>{const s=document.createElement('span');s.className='rz-scan-line';s.textContent=line;scan.appendChild(s);});

  welcome.appendChild(omen);
  welcome.appendChild(welcomeText);
  welcome.appendChild(scan);
  document.body.appendChild(welcome);

  omen.tabIndex=0;
  omen.setAttribute('role','button');
  omen.addEventListener('mouseenter',()=>welcome.classList.add('rz-scan-open'));
  omen.addEventListener('mouseleave',()=>welcome.classList.remove('rz-scan-open'));
  omen.addEventListener('focus',()=>welcome.classList.add('rz-scan-open'));
  omen.addEventListener('blur',()=>welcome.classList.remove('rz-scan-open'));
  omen.addEventListener('click',e=>{e.stopPropagation();welcome.classList.toggle('rz-scan-open');});
  document.addEventListener('click',e=>{if(!welcome.contains(e.target))welcome.classList.remove('rz-scan-open');});

  let collapsed=false;
  const collapseWelcome=()=>{
    collapsed=true;
    welcome.classList.add('rz-compact');
    welcomeText.textContent='RZ-088 · '+shortName;
  };
  const editorIsOpen=()=>{
    if(document.querySelector('.rz-sheet')) return true;
    return Array.from(document.querySelectorAll('button')).some(btn=>{
      const txt=(btn.textContent||'').trim().toLowerCase();
      if(!txt.startsWith('voltar')) return false;
      const rect=btn.getBoundingClientRect();
      const st=getComputedStyle(btn);
      return rect.width>0&&rect.height>0&&st.display!=='none'&&st.visibility!=='hidden';
    });
  };
  const syncWelcomeVisibility=()=>{
    const editing=editorIsOpen();
    welcome.classList.toggle('rz-hidden',editing);
    if(!editing&&collapsed){
      welcome.classList.add('rz-compact');
      welcomeText.textContent='RZ-088 · '+shortName;
    }
  };
  setTimeout(collapseWelcome,4200);
  const observer=new MutationObserver(syncWelcomeVisibility);
  observer.observe(document.getElementById('root')||document.body,{childList:true,subtree:true});
  syncWelcomeVisibility();

})();