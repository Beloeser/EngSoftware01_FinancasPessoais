import { Transaction, Category } from "../models/index.js";
import { Op } from "sequelize";
import { pdfService } from "../services/pdfService.js";

async function ensureUserCategory(categoryId, userId) {
  if (!categoryId) return null;

  const category = await Category.findOne({
    where: { id: categoryId, userId },
  });

  if (!category) {
    const error = new Error("Categoria não encontrada.");
    error.status = 404;
    throw error;
  }

  return category.id;
}

async function buildTransactionPayload(body, userId) {
  const payload = {
    description: body.description,
    amount: body.amount,
    type: body.type,
    date: body.date,
  };

  if (Object.prototype.hasOwnProperty.call(body, "categoryId")) {
    payload.categoryId = await ensureUserCategory(body.categoryId, userId);
  }

  return payload;
}

export const transactionController = {
  async getAll(req, res, next) {
    try {
      const whereClause = { userId: req.userId };

      const filters = req.query;
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

      const transactions = await Transaction.findAll({
        where: whereClause,
        include: [{ model: Category, as: "category" }],
        order: [["date", "DESC"]],
      });
      res.json(transactions);
    } catch (err) {
      next(err);
    }
  },

  async getSummary(req, res, next) {
    try {
      const transactions = await Transaction.findAll({ where: { userId: req.userId } });

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

      res.json(summary);
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const payload = await buildTransactionPayload(req.body, req.userId);
      const transaction = await Transaction.create({
        ...payload,
        userId: req.userId,
      });
      const created = await Transaction.findByPk(transaction.id, {
        include: [{ model: Category, as: "category" }],
      });
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      const transaction = await Transaction.findOne({ where: { id: req.params.id, userId: req.userId } });
      if (!transaction) throw new Error("NOT_FOUND");
      await transaction.destroy();
      res.status(204).send();
    } catch (err) {
      if (err.message === "NOT_FOUND") {
        return res.status(404).json({ message: "Transação não encontrada." });
      }
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const transaction = await Transaction.findOne({ where: { id: req.params.id, userId: req.userId } });
      if (!transaction) throw new Error("NOT_FOUND");
      const payload = await buildTransactionPayload(req.body, req.userId);
      await transaction.update(payload);
      const updated = await Transaction.findByPk(transaction.id, {
        include: [{ model: Category, as: "category" }],
      });
      res.status(200).json(updated);
    } catch (err) {
      if (err.message === "NOT_FOUND") {
        return res.status(404).json({
          message: "Transação não encontrada ou não pertence a você.",
        });
      }
      next(err);
    }
  },

  async exportPDF(req, res, next) {
    try {
      const whereClause = { userId: req.userId };

      const filters = req.query;
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

      const transactions = await Transaction.findAll({
        where: whereClause,
        include: [{ model: Category, as: "category" }],
        order: [["date", "DESC"]],
      });

      const pdfBuffer =
        await pdfService.generateTransactionReport(transactions);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=relatorio-transacoes.pdf",
      );

      res.send(pdfBuffer);
    } catch (err) {
      next(err);
    }
  },
};
