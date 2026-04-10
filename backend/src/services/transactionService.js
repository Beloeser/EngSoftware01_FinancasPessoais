import { Transaction } from "../models/index.js";

export const transactionService = {
  findAllByUser: (userId) => Transaction.findAll({ where: { userId } }),

  async create(data) {
    if (!data.amount || data.amount <= 0) {
      throw new Error("O valor da transação deve ser maior que zero.");
    }
    return Transaction.create(data);
  },

  delete: (id, userId) => Transaction.destroy({ where: { id, userId } }),
};
