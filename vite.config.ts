import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { tanstackRouter } from '@tanstack/router-plugin/vite'


const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ['react-hook-form', '@hookform/resolvers/zod'],
  },
  build: {
    rollupOptions: {
      external: [],
    }
  },
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      '/dev-api': {
        target: 'https://dev.to/articles/me/published',
        changeOrigin: true,
      },
    },
  },
})
