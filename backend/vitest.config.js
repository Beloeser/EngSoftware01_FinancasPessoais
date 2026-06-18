import { defineConfig } from 'vitest/config'
import dotenv from 'dotenv'

// Carrega as variáveis do banco de teste e injeta no process.env dos testes,
// antes de qualquer módulo do app (config/env.js) ser avaliado.
const testEnv = dotenv.config({ path: '.env.test' }).parsed || {}

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    fileParallelism: false,
    env: testEnv,
    include: ['test/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.js'],
      exclude: [
        'src/server.js',
        'src/routes/userRoutes.js',
        'src/controllers/userController.js',
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
