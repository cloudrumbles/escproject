import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { configDefaults } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    exclude: [...configDefaults.exclude, 'e2e/*'],
    css: true,
    reporters: ['html', 'default'],
    coverage: {
      exclude: ['src/setupTests.ts'],
      provider: 'v8',
      enabled: true,
      reporter: ['text-summary', 'html'],
      reportOnFailure: true,
    },
  },
})