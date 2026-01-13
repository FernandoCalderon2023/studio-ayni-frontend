import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/studio-ayni-frontend/', // ← Cambiar por el nombre de tu repo
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
})
