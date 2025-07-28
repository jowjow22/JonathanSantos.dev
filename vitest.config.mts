// <reference types="vitest" />
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    watch: false,
    coverage: {
      provider: 'istanbul',
      reporter: ['html'],
    },
  },
})