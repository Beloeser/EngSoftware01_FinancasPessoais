import { transactionService } from '../services/transactionService.js'

export const transactionController = {
  async getAll(req, res) {
    const transactions = await transactionService.findAllByUser(req.userId)
    res.json(transactions)
  },

  async create(req, res) {
    const transaction = await transactionService.create({ ...req.body, userId: req.userId })
    res.status(201).json(transaction)
  },

  async remove(req, res) {
    await transactionService.delete(req.params.id, req.userId)
    res.status(204).send()
  },
}
