import { Category } from "../models/index.js";

export const categoryService = {
  async create(data) {
    const existing = await Category.findOne({
      where: { name: data.name, userId: data.userId },
    });
    if (existing) throw new Error("Categoria já existe");
    return Category.create(data);
  },

  findAllByUser: (userId) => Category.findAll({ where: { userId } }),
};
