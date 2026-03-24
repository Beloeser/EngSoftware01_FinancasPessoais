import { userService } from '../services/userService.js'

export const userController = {
  async getProfile(req, res) {
    const user = await userService.findById(req.userId)
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' })
    res.json({ id: user.id, name: user.name, email: user.email })
  },
}
