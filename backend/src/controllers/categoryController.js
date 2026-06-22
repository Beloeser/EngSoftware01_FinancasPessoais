import { Category, Transaction } from "../models/index.js";

export const categoryController = {
  async create(req, res, next) {
    try {
      const existing = await Category.findOne({
        where: { name: req.body.name, userId: req.userId },
      });
      if (existing) throw new Error("Categoria já existe");
      const category = await Category.create({
        ...req.body,
        userId: req.userId,
      });
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  },

  async getAll(req, res, next) {
    try {
      const categories = await Category.findAll({
        where: { userId: req.userId },
        order: [["name", "ASC"]],
      });
      res.json(categories);
    } catch (error) {
      next(error);
    }
  },

  async remove(req, res, next) {
    try {
      const category = await Category.findOne({
        where: { id: req.params.id, userId: req.userId },
      });

      if (!category) {
        return res.status(404).json({ message: "Categoria não encontrada." });
      }

      await Transaction.update(
        { categoryId: null },
        { where: { categoryId: category.id, userId: req.userId } },
      );
      await category.destroy();

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
