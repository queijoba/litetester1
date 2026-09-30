import { readFile, writeFile } from 'node:fs/promises';

const path = 'src/PJLiteApp.jsx';
let source = await readFile(path, 'utf8');

const startMarker = "{showSystemModal && ReactDOM.createPortal(";
const endMarker = "{show3DetModelModal && ReactDOM.createPortal(";
const start = source.indexOf(startMarker);
const end = source.indexOf(endMarker, start);

if (start < 0 || end < 0 || end <= start) {
  throw new Error('Não foi possível localizar o modal de seleção de sistema.');
}

let block = source.slice(start, end);

const replacements = [
  [
    'bg-white rounded-sm shadow-2xl w-full max-w-md border-2 border-dragon-dark overflow-hidden animate-fade-in-up',
    'bg-white rounded-sm shadow-2xl w-full max-w-3xl max-h-[88vh] border-2 border-dragon-dark overflow-hidden animate-fade-in-up flex flex-col'
  ],
  [
    'p-6 bg-gray-100 flex flex-col gap-4',
    'p-4 bg-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto min-h-0'
  ],
  [
    'rounded p-4 cursor-pointer hover:shadow-lg transition-all flex items-center gap-4 group',
    'rounded p-3 cursor-pointer hover:shadow-md transition-all flex items-center gap-3 group min-h-[82px]'
  ],
  [
    'w-14 h-14',
    'w-12 h-12'
  ],
];

for (const [from, to] of replacements) {
  if (!block.includes(from)) {
    throw new Error(`Trecho esperado não encontrado no seletor: ${from}`);
  }
  block = block.split(from).join(to);
}

source = source.slice(0, start) + block + source.slice(end);
await writeFile(path, source, 'utf8');
console.log('Seletor de sistemas reorganizado em grade compacta responsiva.');
