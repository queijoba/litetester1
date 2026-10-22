import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const jsx=readFileSync('src/systems/ordemParanormal/OrdemLibraryModal.jsx','utf8');
const css=readFileSync('src/systems/ordemParanormal/ordem-library.css','utf8');
const catalog=readFileSync('src/systems/ordemParanormal/libraryCatalog.js','utf8');
assert.ok(jsx.includes("sourceSet.add('Arquivos Secretos #02')"),'O pacote #02 precisa aparecer no filtro');
assert.ok(jsx.includes("Hexatombe — Parte 1 (HQ Kemi)"),'Título da pasta #02 no Drive');
assert.ok(jsx.includes('archive02Reference')&&jsx.includes('Consultar HQ Kemi no Google Drive'),'Indicar que o pacote #02 é HQ de referência e oferecer leitura');
for(const title of ['Agatha','Hexatombe — Parte 2','A Produção','Alheios','Panaceia','Vampiros','Hell Hunters'])
 assert.ok(jsx.includes(title),'Título do Arquivos Secretos não exibido: '+title);
assert.ok(!catalog.includes("'Arquivos Secretos #02'"),'Não inventar ficha/regras para a HQ Kemi');

for(const label of ['Origens','Trilhas','Poderes de Classe','Poderes Paranormais','Rituais']){
 assert.ok(jsx.includes("'"+label+"'"),"Categoria ausente: "+label);
}
assert.ok(jsx.includes('aria-current={tab===id'), 'Indicação acessível da categoria ativa');
assert.ok(jsx.includes('aria-pressed={tab===id}'), 'Botões de categoria devem anunciar seu estado');
assert.ok(jsx.includes('entries.find(x=>x.id===selected)||entries[0]'), 'Detalhes devem mostrar primeiro resultado automaticamente');
assert.ok(jsx.includes("setSelected('');setSelectedRitualElement('');"), 'Troca de categoria deve limpar detalhes e opção de elemento');
assert.ok(jsx.includes('ordem-library-body--has-selection'), 'No celular deve poder alternar entre resultados e detalhes');
assert.ok(jsx.includes('ordem-library-back'), 'Botão de retorno da visualização móvel ausente');
assert.ok(jsx.includes('resultado{entries.length===1'), 'Contador contextual ausente');

assert.match(css,/\.ordem-library-tabs\{[^}]*grid-template-columns:repeat\(5,minmax\(0,1fr\)\)/, 'As abas devem ser grade e não rolagem horizontal');
assert.match(css,/\.ordem-library-tabs\{[^}]*flex:0 0 auto/, 'A barra de categorias não deve encolher');
assert.match(css,/\.ordem-library-tabs button\{[^}]*color:#2d2826!important/, 'O texto das categorias precisa contrastar');
assert.match(css,/\.ordem-library-tabs button\.active[^}]*color:#fff!important/, 'Categoria ativa deve ter letras legíveis');
assert.ok(css.includes('.ordem-library-modal>.ordem-library-body'), 'Área de resultados precisa ter o espaço flexível');
assert.ok(css.includes('overscroll-behavior:contain'), 'Rolagem não deve vazar do modal');
assert.ok(css.includes('@media(max-height:600px)'), 'Janela baixa deve ter estilos específicos');
assert.ok(css.includes('@media(max-width:420px)'), 'Em tela estreita, categorias devem quebrar em duas colunas');
assert.ok(css.includes('.ordem-library-back{display:block'), 'A navegação móvel precisa do retorno');

const start=css.indexOf('.ordem-library-tabs{');
const rules=css.slice(start,css.indexOf('}',start));
assert.ok(!rules.includes('overflow-x:auto'), 'Remover rolagem horizontal da barra');
console.log('✓ Biblioteca Paranormal: cinco abas legíveis, ajuste em altura baixa e navegação móvel sem corte.');
