import { Transaction } from "../models/index.js";
import { Op } from "sequelize";

export const transactionService = {
  async findAllByUser(userId, filters = {}) {
    const whereClause = { userId };

    if (filters.type) {
      whereClause.type = filters.type;
    }
    if (filters.categoryId) {
      whereClause.categoryId = filters.categoryId;
    }
    if (filters.startDate || filters.endDate) {
      whereClause.date = {};
      if (filters.startDate) whereClause.date[Op.gte] = filters.startDate;
      if (filters.endDate) whereClause.date[Op.lte] = filters.endDate;
    }

    return await Transaction.findAll({
      where: whereClause,
      order: [["date", "DESC"]],
    });
  },



  async getByPrice(priceMin, priceMax) {
  return Transaction.findAll({
    where: {
      amount: {
        [Op.between]: [priceMin, priceMax]
      }
    }
  });
  },

  async getSummary(userId) {
    const transactions = await Transaction.findAll({ where: { userId } });

    const summary = transactions.reduce(
      (acc, curr) => {
        const amount = parseFloat(curr.amount);
        if (curr.type === "income") {
          acc.incomes += amount;
        } else if (curr.type === "expense") {
          acc.expenses += amount;
        }
        return acc;
      },
      { incomes: 0, expenses: 0 },
    );

    summary.balance = summary.incomes - summary.expenses;

    return summary;
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
