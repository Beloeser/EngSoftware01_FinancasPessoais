import { Category } from "../models/index.js";

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
      const categories = await Category.findAll({ where: { userId: req.userId } });
      res.json(categories);
    } catch (error) {
      next(error);
    }
  },
};
