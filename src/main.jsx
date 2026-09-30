import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
const isDmRoute = window.location.pathname === '/dm' || window.location.pathname.startsWith('/dm/');

if (isDmRoute) {
  Promise.all([
    import('./dm/dmlite.css'),
    import('./dm/DMLiteApp.jsx'),
  ]).then(([, module]) => {
    const DMLiteApp = module.default;
    root.render(<DMLiteApp />);
  });
} else {
  Promise.all([
    import('./pjlite.css'),
    import('./PJLiteApp.jsx'),
    import('./mobile-polish.css'),
    import('./mobile-systems-v8.css'),
    import('./mobile-attrs-v9.css'),
    import('./systems/3det/integration.js'),
    import('./theme-polish.css'),
    import('./systems/dragonbane/index.js'),
    import('./systems/dnd5e/index.js'),
    import('./systems/fabulaUltima/index.js'),
    import('./systems/somDasSeis/index.js'),
    import('./systems/3det/index.js'),
  ]).then(([
    ,
    appModule,
    ,
    ,
    ,
    ,
    ,
    dragonbane,
    dnd,
    fabula,
    som6,
    det,
  ]) => {
    const PJLiteApp = appModule.default;
    root.render(<PJLiteApp />);
    dragonbane.installDragonbanePdfExport();
    dnd.installDndPdfExport();
    fabula.installFabulaPdfExport();
    som6.installSom6PdfExport();
    det.install3DetPdfExport();
  });
}
