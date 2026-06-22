import sequelize from "../config/database.js";
import User from "./User.js";
import Transaction from "./Transaction.js";
import Category from "./Category.js";

User.hasMany(Transaction, { foreignKey: "userId" });
Transaction.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Category, { foreignKey: "userId" });
Category.belongsTo(User, { foreignKey: "userId" });

Category.hasMany(Transaction, {
  foreignKey: "categoryId",
  as: "transactions",
  onDelete: "SET NULL",
});
Transaction.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "category",
  onDelete: "SET NULL",
});

export { sequelize, User, Transaction, Category };
