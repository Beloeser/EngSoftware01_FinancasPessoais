import { verifyToken } from '../utils/jwt.js'

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Token não fornecido' })
  try {
    const { id } = verifyToken(token)
    req.userId = id
    next()
  } catch {
    res.status(401).json({ message: 'Token inválido' })
  }
}
