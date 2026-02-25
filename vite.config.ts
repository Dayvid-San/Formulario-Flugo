import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/ 
export default defineConfig({
  plugins: [react()],
  build: {
    // Aumentamos o limite para 1000kb para o aviso de tamanho sumir
    chunkSizeWarningLimit: 1000, 
    rollupOptions: {
      onwarn(warning, warn) {
        // Remove os avisos amarelos de "use client" do Material UI no terminal
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes('use client')) {
          return;
        }
        warn(warning);
      },
    },
  },
})