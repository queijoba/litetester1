import { createRoot } from 'react-dom/client';
import './pjlite.css';
import PJLiteApp from './PJLiteApp.jsx';
import './mobile-polish.css';
import { installDragonbanePdfExport } from './systems/dragonbane/index.js';

createRoot(document.getElementById('root')).render(<PJLiteApp />);
installDragonbanePdfExport();
