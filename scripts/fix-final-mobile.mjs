import { readFile, writeFile } from 'node:fs/promises';

const path = 'src/PJLiteApp.jsx';
let s = await readFile(path, 'utf8');
if (s.includes('PJ LITE 0.9 MOBILE FIXES')) {
  console.log('Final mobile fixes: already applied.');
  process.exit(0);
}

const replaceIf = (from, to) => {
  if (s.includes(from)) s = s.replace(from, to);
};

// Cards dos novos sistemas no seletor: títulos menores e conteúdo sem estourar no celular.
replaceIf(
  'className="bg-white border-2 border-gray-300 hover:border-violet-700 rounded p-3 cursor-pointer hover:shadow-md transition-all flex items-center gap-3 group min-h-[82px]"',
  'className="bg-white border-2 border-gray-300 hover:border-violet-700 rounded p-3 cursor-pointer hover:shadow-md transition-all flex items-center gap-3 group min-h-[82px] overflow-hidden"'
);
replaceIf(
  'className="bg-white border-2 border-gray-300 hover:border-red-800 rounded p-3 cursor-pointer hover:shadow-md transition-all flex items-center gap-3 group min-h-[82px]"',
  'className="bg-white border-2 border-gray-300 hover:border-red-800 rounded p-3 cursor-pointer hover:shadow-md transition-all flex items-center gap-3 group min-h-[82px] overflow-hidden"'
);
replaceIf(
  '<div className="flex-1"><div className="flex items-center gap-2"><h3 className="font-title font-bold text-gray-900 group-hover:text-violet-800 text-lg">Skyfall RPG</h3><span className="bg-violet-100 text-violet-900 text-[9px] font-bold uppercase px-2 py-0.5 rounded">1.25</span></div><p className="text-xs text-gray-500">',
  '<div className="flex-1 min-w-0"><div className="flex flex-wrap items-center gap-x-2 gap-y-1"><h3 className="font-title font-bold text-gray-900 group-hover:text-violet-800 text-[15px] sm:text-lg leading-tight">Skyfall RPG</h3><span className="shrink-0 bg-violet-100 text-violet-900 text-[9px] font-bold uppercase px-2 py-0.5 rounded">1.25</span></div><p className="text-[11px] sm:text-xs leading-snug text-gray-500 mt-1">'
);
replaceIf(
  '<div className="flex-1"><div className="flex items-center gap-2"><h3 className="font-title font-bold text-gray-900 group-hover:text-red-900 text-lg">Ordem Paranormal RPG</h3><span className="bg-red-100 text-red-900 text-[9px] font-bold uppercase px-2 py-0.5 rounded">v1.3</span></div><p className="text-xs text-gray-500">',
  '<div className="flex-1 min-w-0"><div className="flex flex-wrap items-center gap-x-2 gap-y-1"><h3 className="font-title font-bold text-gray-900 group-hover:text-red-900 text-[14px] sm:text-lg leading-[1.05]">Ordem Paranormal</h3><span className="shrink-0 bg-red-100 text-red-900 text-[9px] font-bold uppercase px-2 py-0.5 rounded">v1.3</span></div><p className="text-[11px] sm:text-xs leading-snug text-gray-500 mt-1">'
);

// Barra superior: nomes longos não dominam a largura no celular.
replaceIf(
  'text-lg md:text-xl tracking-wider uppercase',
  'text-base sm:text-lg md:text-xl tracking-wide sm:tracking-wider uppercase leading-tight break-words'
);

s = `/* PJ LITE 0.9 MOBILE FIXES */\n${s}`;
await writeFile(path, s, 'utf8');
console.log('✓ Final mobile fixes applied.');
