import { createRoot } from 'react-dom/client';
import './pjlite.css';
import PJLiteApp from './PJLiteApp.jsx';
import { installDragonbanePdfExport } from './features/pdf/dragonbane/export.js';

createRoot(document.getElementById('root')).render(<PJLiteApp />);
installDragonbanePdfExport();
