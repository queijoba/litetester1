import p11 from './bg/p1_1.js';
import p12 from './bg/p1_2.js';
import p13 from './bg/p1_3.js';
import p21 from './bg/p2_1.js';
import p22 from './bg/p2_2.js';
import p23 from './bg/p2_3.js';
import p24 from './bg/p2_4.js';
import f1 from './dragonbaneFields1.js';
import f2 from './dragonbaneFields2.js';
import f3 from './dragonbaneFields3.js';
import f4 from './dragonbaneFields4.js';
import f5 from './dragonbaneFields5.js';
import f6 from './dragonbaneFields6.js';
import f7 from './dragonbaneFields7.js';
import f8 from './dragonbaneFields8.js';

export const DRAGONBANE_PDF_PAGE = { width: 595.2756, height: 841.8898 };
export const DRAGONBANE_PDF_BACKGROUNDS = [p11 + p12 + p13, p21 + p22 + p23 + p24];
export const DRAGONBANE_PDF_FIELDS = [...f1, ...f2, ...f3, ...f4, ...f5, ...f6, ...f7, ...f8];
