import { readFile, writeFile } from 'node:fs/promises';

const path='src/systems/skyfall/skyfall-theme.css';
let css=await readFile(path,'utf8');
const marker='PJ LITE SKYFALL PDF COLORS PREVIEW V2';
if(css.includes(marker)){
  console.log('Skyfall PDF colors preview: already applied.');
  process.exit(0);
}

css+=`\n/* ${marker}\n * Ajuste de paleta e contraste seguindo a ficha PDF de referência.
 * Remove roxos excessivamente escuros no tema claro e reforça legibilidade.
 */
body.theme-skyfall{
  background:#d8e0e7!important;
  color:#2e3f55!important;
}
body.theme-skyfall .max-w-6xl,
body.theme-skyfall .max-w-5xl{
  background:#edf1f4!important;
  border-color:#7e8da0!important;
}
.skyfall-sheet{
  background:#f4f6f7!important;
  color:#2f4057!important;
  border-color:#728398!important;
  box-shadow:0 12px 30px rgba(38,54,74,.18)!important;
}
.skyfall-hero{
  background:#fbfcfd!important;
  color:#33465f!important;
  border-color:#6f8197!important;
  border-bottom-color:#bcc8d3!important;
}
.skyfall-hero:before{background:#52657d!important;color:#fff!important}
.skyfall-kicker,.skyfall-hero p{color:#627389!important}
.skyfall-hero h2{color:#31445e!important}
.skyfall-level{background:#fff!important;color:#31445e!important;border-color:#6f8197!important}
.skyfall-level input{color:#263b56!important}

.skyfall-tabs{border-color:#93a3b4!important}
.skyfall-tabs button{
  background:#e0e6ec!important;
  color:#3e526b!important;
  border-color:#96a5b5!important;
}
.skyfall-tabs button:hover{background:#d2dbe4!important;color:#263b56!important}
.skyfall-tabs button.active{
  background:#52657d!important;
  color:#fff!important;
  border-color:#52657d!important;
}

.skyfall-card{
  background:#fff!important;
  color:#2e4057!important;
  border-color:#8392a4!important;
  box-shadow:6px 6px 0 #dbe2e8!important;
}
.skyfall-card h3{color:#31455f!important;border-color:#8f9eae!important}
.skyfall-card label>span,.skyfall-label{color:#506278!important}
.skyfall-help{color:#68798c!important}
.skyfall-card input,.skyfall-card select,.skyfall-card textarea,
.skyfall-entry input,.skyfall-entry select,.skyfall-entry textarea{
  background:#fff!important;
  color:#24364d!important;
  border-color:#a4b1bf!important;
}
.skyfall-card input::placeholder,.skyfall-entry input::placeholder,
.skyfall-card textarea::placeholder,.skyfall-entry textarea::placeholder{
  color:#8290a0!important;
  opacity:1!important;
}
.skyfall-card input:focus,.skyfall-card textarea:focus,.skyfall-card select:focus{
  border-color:#60758e!important;
  box-shadow:0 0 0 2px rgba(96,117,142,.14)!important;
}

/* Atributos no estilo impresso: painel azul-cinza e campos brancos. */
.skyfall-card:has(> .skyfall-attributes){
  background:#d5dde5!important;
  border-color:#7f8fa2!important;
}
.skyfall-card:has(> .skyfall-attributes) h3{color:#30445e!important}
.skyfall-attr>span{color:#30445e!important}
.skyfall-attr>input[type=number]{
  background:#fff!important;
  color:#1d3049!important;
  border-color:#62758c!important;
}
.skyfall-attr>small{
  background:#f8fafb!important;
  color:#344b67!important;
  border-color:#8393a5!important;
}
.skyfall-attr>em{color:#5e7085!important}

.skyfall-resource,.skyfall-combat-grid>label,.skyfall-caster-panel{
  background:#dbe2e8!important;
  border-color:#8393a5!important;
  color:#2f435c!important;
}
.skyfall-resource>span:first-child{color:#405772!important}
.skyfall-pair>span{color:#607186!important}

.skyfall-entry{
  background:#fff!important;
  color:#2d4058!important;
  border-color:#8595a7!important;
  box-shadow:3px 3px 0 #dce3e9!important;
}
.skyfall-entry button,.skyfall-sort button{
  background:#e1e7ec!important;
  color:#344b66!important;
  border:1px solid #a0adba!important;
}
.skyfall-entry button:hover,.skyfall-sort button:hover{background:#d2dbe3!important;color:#263b56!important}
.skyfall-sort .danger,.skyfall-entry button.danger{background:#f0e0e2!important;color:#7f3540!important;border-color:#d7aeb4!important}

.skyfall-skill{
  background:#fff!important;
  color:#2d4058!important;
  border-color:#8595a7!important;
  box-shadow:3px 3px 0 #dce3e9!important;
}
.skyfall-skill strong{color:#2d425d!important}
.skyfall-skill small{color:#718195!important}
.skyfall-skill label{color:#344b66!important}
.skyfall-skill input[type=checkbox]{accent-color:#52657d!important}
.skyfall-skill>input:not([type=checkbox]){
  background:#fdfefe!important;
  color:#30465f!important;
  border-color:#a6b3c0!important;
}

/* Corrige os círculos/placas de total que estavam escuro sobre escuro. */
.skyfall-skill-total,
.skyfall-total-pill,
.skyfall-value-pill{
  background:#dfe6ec!important;
  color:#2c435e!important;
  border:1px solid #92a2b3!important;
  box-shadow:none!important;
  font-weight:900!important;
}
.skyfall-skill-total.active,
.skyfall-total-pill.active,
.skyfall-value-pill.active{
  background:#52657d!important;
  color:#fff!important;
  border-color:#52657d!important;
}

.skyfall-caster-summary span{
  background:#52657d!important;
  color:#fff!important;
  border:1px solid #43566e!important;
}
.skyfall-magic-section{background:#fff!important;border-left-color:#728398!important}
.skyfall-add,.skyfall-sort-alpha{
  background:#52657d!important;
  color:#fff!important;
  border-color:#43566e!important;
}
.skyfall-add:hover,.skyfall-sort-alpha:hover{background:#43566e!important;color:#fff!important}

/* Dark mode com contraste explícito; evita texto escuro sobre blocos escuros. */
body.theme-dark .skyfall-sheet{background:#1d2835!important;color:#e8eef4!important;border-color:#718399!important}
body.theme-dark .skyfall-hero{background:#263443!important;color:#f0f4f8!important;border-color:#8292a5!important}
body.theme-dark .skyfall-hero h2,body.theme-dark .skyfall-kicker,body.theme-dark .skyfall-hero p{color:#e2e9f0!important}
body.theme-dark .skyfall-card{background:#253241!important;color:#eef3f7!important;border-color:#75869a!important;box-shadow:6px 6px 0 #131b24!important}
body.theme-dark .skyfall-card h3,body.theme-dark .skyfall-card label>span,body.theme-dark .skyfall-label,body.theme-dark .skyfall-help{color:#dce5ed!important}
body.theme-dark .skyfall-card input,body.theme-dark .skyfall-card textarea,body.theme-dark .skyfall-card select,body.theme-dark .skyfall-entry input,body.theme-dark .skyfall-entry textarea,body.theme-dark .skyfall-entry select{background:#121b25!important;color:#f1f5f8!important;border-color:#718398!important}
body.theme-dark .skyfall-card input::placeholder,body.theme-dark .skyfall-entry input::placeholder,body.theme-dark .skyfall-card textarea::placeholder,body.theme-dark .skyfall-entry textarea::placeholder{color:#9eacba!important}
body.theme-dark .skyfall-card:has(> .skyfall-attributes),body.theme-dark .skyfall-resource,body.theme-dark .skyfall-combat-grid>label,body.theme-dark .skyfall-caster-panel{background:#334356!important;color:#f0f4f8!important}
body.theme-dark .skyfall-attr>span,body.theme-dark .skyfall-attr>em{color:#dce5ed!important}
body.theme-dark .skyfall-attr>small{background:#223040!important;color:#f1f5f8!important;border-color:#718398!important}
body.theme-dark .skyfall-skill,body.theme-dark .skyfall-entry{background:#243141!important;color:#eef3f7!important;border-color:#718398!important;box-shadow:3px 3px 0 #121922!important}
body.theme-dark .skyfall-skill strong,body.theme-dark .skyfall-skill label{color:#eef3f7!important}
body.theme-dark .skyfall-skill small{color:#b8c5d1!important}
body.theme-dark .skyfall-skill-total,body.theme-dark .skyfall-total-pill,body.theme-dark .skyfall-value-pill{background:#52657d!important;color:#fff!important;border-color:#91a0b1!important}
body.theme-dark .skyfall-entry button,body.theme-dark .skyfall-sort button{background:#3d4d60!important;color:#fff!important;border-color:#718398!important}

@media(max-width:860px){.skyfall-card{box-shadow:4px 4px 0 #dbe2e8!important}}
@media(max-width:640px){.skyfall-card{box-shadow:3px 3px 0 #dbe2e8!important}}
`;

await writeFile(path,css,'utf8');
console.log('✓ Preview Skyfall: paleta e contraste refinados conforme a ficha PDF.');
