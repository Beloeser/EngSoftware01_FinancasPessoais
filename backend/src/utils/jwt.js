import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export const generateToken = (id) => jwt.sign({ id }, env.jwtSecret, { expiresIn: '7d' })
export const verifyToken = (token) => jwt.verify(token, env.jwtSecret)
