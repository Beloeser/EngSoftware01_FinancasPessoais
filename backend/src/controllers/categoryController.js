import { categoryService } from "../services/categoryService.js";

export const categoryController = {
  async create(req, res, next) {
    try {
      const category = await categoryService.create({
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
      const categories = await categoryService.findAllByUser(req.userId);
      res.json(categories);
    } catch (error) {
      next(error);
    }
  },
};
