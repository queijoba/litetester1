import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const dragonbanePdfCompatibility = {
  name: 'dragonbane-pdf-compatibility',
  enforce: 'pre',
  transform(code, id) {
    if (!id.endsWith('/src/pdf/dragonbanePdfExport.js')) return null;

    // pdf-lib exige uma /DA (default appearance) antes de setFontSize().
    // Nossos campos são criados do zero e ainda não possuem /DA nesse ponto.
    // Removemos apenas essa chamada prematura; o tamanho/aparência é gerado
    // normalmente por form.updateFieldAppearances() depois que os valores
    // da ficha já foram preenchidos.
    const problematicCall = '    field.setFontSize(def.fontSize || 8);\n';
    if (!code.includes(problematicCall)) return null;

    return {
      code: code.replace(problematicCall, ''),
      map: null,
    };
  },
};

export default defineConfig({
  plugins: [dragonbanePdfCompatibility, react()],
});
