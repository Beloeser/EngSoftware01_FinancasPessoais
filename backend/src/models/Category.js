import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

class Category extends Model {}

Category.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      defaultValue: "#CCCCCC",
    },
    userId: {
      type: DataTypes.INTEGER, // Ajuste para DataTypes.UUID se o seu User usar UUID
      allowNull: false,
      references: { model: "Users", key: "id" },
    },
  },
  {
    sequelize,
    modelName: "Category",
    tableName: "categories",
  },
);

export default Category;
