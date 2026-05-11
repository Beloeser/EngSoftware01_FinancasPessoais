import { User } from '../models/index.js'

export const userController = {
  async getProfile(req, res) {
    const user = await User.findByPk(req.userId)
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' })
    res.json({ id: user.id, name: user.name, email: user.email })
  },
}
