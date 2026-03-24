import { User } from '../models/index.js'

export const userService = {
  create: (data) => User.create(data),
  findByEmail: (email) => User.findOne({ where: { email } }),
  findById: (id) => User.findByPk(id),
}
