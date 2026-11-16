import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@shared': fileURLToPath(new URL('../shared', import.meta.url)),
    },
  },
  server: {
    // /api vai para o backend: front e API ficam no mesmo endereço e o cookie
    // de sessão é do próprio site. Para testar no celular (mesma rede Wi-Fi):
    // npm run dev -- --host, e abra no celular o endereço "Network" exibido.
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        rewrite: (caminho) => caminho.replace(/^\/api/, ''),
      },
    },
    fs: {
      allow: [fileURLToPath(new URL('../shared', import.meta.url))],
    },
  },
})
