import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base relativa + HashRouter: o build funciona em qualquer subpasta (ex: GitHub Pages)
export default defineConfig({
  base: './',
  plugins: [react()],
  server: { host: true, port: 5173 },
});
