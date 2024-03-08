import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@pages': resolve(__dirname, '/src/pages'),
      '@redux': resolve(__dirname, '/src/redux'),
      '@services': resolve(__dirname, '/src/services'),
      '@shared': resolve(__dirname, '/src/shared'),
      '@api': resolve(__dirname, '/src/api'),
    },
  },
  build: {
    rollupOptions: {
      external: ['@redux', '@pages', '@services', '@shared', '@api'],
    },
  },
})
