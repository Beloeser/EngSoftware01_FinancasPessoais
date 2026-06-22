import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'html'],
      reportsDirectory: './coverage',
      all: true,
      include: ['src/**/*.{js,jsx}'],
      exclude: [
        'src/**/Styles.js',
        'src/styles/GlobalStyles.js',
        'src/**/index.js',
        'src/main.jsx',
        'src/test/**',
        'src/**/*.test.{js,jsx}',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
})
