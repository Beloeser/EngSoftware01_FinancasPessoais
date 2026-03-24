import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'
import User from './User.js'

const Transaction = sequelize.define('Transaction', {
  description: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  type: { type: DataTypes.ENUM('income', 'expense'), allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
})

Transaction.belongsTo(User, { foreignKey: 'userId' })
User.hasMany(Transaction, { foreignKey: 'userId' })

export default Transaction
