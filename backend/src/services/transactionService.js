import { Transaction } from "../models/index.js";

export const transactionService = {
  async findAllByUser(userId) {
    return await Transaction.findAll({ where: { userId } });
  },

  async create(data) {
    return await Transaction.create(data);
  },

  async delete(id, userId) {
    const transaction = await Transaction.findOne({ where: { id, userId } });
    if (!transaction) throw new Error("NOT_FOUND");
    await transaction.destroy();
  },

  async update(id, userId, data) {
    const transaction = await Transaction.findOne({ where: { id, userId } });
    if (!transaction) throw new Error("NOT_FOUND");
    await transaction.update(data);
    return transaction;
  },
};
