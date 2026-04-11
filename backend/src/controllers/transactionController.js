import { transactionService } from "../services/transactionService.js";

export const transactionController = {
  async getAll(req, res, next) {
    try {
      const transactions = await transactionService.findAllByUser(req.userId);
      res.json(transactions);
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const transaction = await transactionService.create({
        ...req.body,
        userId: req.userId,
      });
      res.status(201).json(transaction);
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      await transactionService.delete(req.params.id, req.userId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
