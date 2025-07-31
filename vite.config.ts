import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
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
      '@': path.resolve(process.cwd(), 'src'),
    },
  },
  build: {
    rollupOptions: {
      // Explicitly ensure these packages are NOT external
      external: () => {
        // Don't externalize any npm packages
        return false
      },
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
