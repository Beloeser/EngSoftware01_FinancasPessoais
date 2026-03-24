import { Transaction } from '../models/index.js'

export const transactionService = {
  findAllByUser: (userId) => Transaction.findAll({ where: { userId } }),
  create: (data) => Transaction.create(data),
  delete: (id, userId) => Transaction.destroy({ where: { id, userId } }),
}
