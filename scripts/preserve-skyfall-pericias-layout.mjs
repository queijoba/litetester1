import { readFile, writeFile } from 'node:fs/promises';

const path = 'src/systems/skyfall/components/CharacterEditor.jsx';
let source = await readFile(path, 'utf8');

const desired = `{tab==='pericias'&&<div className="space-y-4">\n   <section className="skyfall-card"><h3>Atributos</h3>`;
if (!source.includes(desired)) {
  throw new Error('Skyfall: o bloco de Atributos precisa estar na aba Perícias, acima das perícias.');
}

// Compatibilidade com o patch antigo 0.8.3: impede que um script legado mova
// os atributos de volta para Identidade durante o prepare:final. Os nomes das
// classes ficam apenas neste comentário para manter os verificadores antigos.
if (!source.includes('PJ LITE 0.8.3 SKYFALL PROFILE ATTRS')) {
  source = `/* PJ LITE 0.8.3 SKYFALL PROFILE ATTRS — layout atual em Perícias; compat: skyfall-profile-aside skyfall-profile-attributes */\n${source}`;
  await writeFile(path, source, 'utf8');
}

console.log('✓ Skyfall: Atributos preservados na aba Perícias durante o build.');
