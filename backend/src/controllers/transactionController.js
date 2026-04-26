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
      if (err.message === "NOT_FOUND") {
        return res.status(404).json({ message: "Transação não encontrada." });
      }
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const updatedTransaction = await transactionService.update(
        req.params.id,
        req.userId,
        req.body,
      );
      res.status(200).json(updatedTransaction);
    } catch (err) {
      if (err.message === "NOT_FOUND") {
        return res
          .status(404)
          .json({
            message: "Transação não encontrada ou não pertence a você.",
          });
      }
      next(err);
    }
  },
};
