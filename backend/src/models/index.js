import sequelize from "../config/database.js";
import User from "./User.js";
import Transaction from "./Transaction.js";
import Category from "./Category.js";

User.hasMany(Transaction, { foreignKey: "userId" });
Transaction.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Category, { foreignKey: "userId" });
Category.belongsTo(User, { foreignKey: "userId" });

export { sequelize, User, Transaction, Category };
