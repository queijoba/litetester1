import f1 from './dragonbaneFields1.js';
import f2 from './dragonbaneFields2.js';
import f3 from './dragonbaneFields3.js';
import f4 from './dragonbaneFields4.js';
import f5 from './dragonbaneFields5.js';
import f6 from './dragonbaneFields6.js';
import f7 from './dragonbaneFields7.js';
import f8 from './dragonbaneFields8.js';

export const DRAGONBANE_PDF_PAGE = { width: 595.2756, height: 841.8898 };

// Os fundos agora são reconstruídos no build da Vercel e servidos como JPGs
// estáticos. Isso evita atob/Base64 no navegador, especialmente no mobile.
export const DRAGONBANE_PDF_BACKGROUNDS = [
  '/generated/dragonbane-page1.jpg',
  '/generated/dragonbane-page2.jpg'
];

export const DRAGONBANE_PDF_FIELDS = [...f1, ...f2, ...f3, ...f4, ...f5, ...f6, ...f7, ...f8];
