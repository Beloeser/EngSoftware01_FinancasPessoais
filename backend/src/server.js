import app from './app.js'
import { sequelize } from './models/index.js'
import { env } from './config/env.js'

sequelize.sync().then(() => {
  app.listen(env.port, () => console.log(`Servidor rodando na porta ${env.port}`))
})
