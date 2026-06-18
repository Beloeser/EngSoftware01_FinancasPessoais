import { beforeAll, beforeEach, afterAll } from 'vitest'
import { sequelize } from '../src/models/index.js'

// Prepara o banco de teste para um arquivo de testes de integração:
// cria o schema uma vez e limpa as tabelas antes de cada teste (isolamento - FIRST).
export function useTestDatabase() {
  beforeAll(async () => {
    await sequelize.sync({ force: true })
  })

  beforeEach(async () => {
    await sequelize.truncate({ cascade: true, restartIdentity: true })
  })

  afterAll(async () => {
    await sequelize.close()
  })
}
