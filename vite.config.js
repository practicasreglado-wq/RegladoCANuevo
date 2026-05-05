import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@media': fileURLToPath(new URL('./media', import.meta.url))
    }
  },
  server: {
    proxy: {
      // Proxy a XAMPP local: el endpoint PHP vive en /api/contact.php.
      // Ajustar `target` al alias real de Apache (htdocs/RegladoCA o similar).
      '/api': {
        target: 'http://localhost/RegladoCA/RegladoCA',
        changeOrigin: true
      }
    }
  }
})
