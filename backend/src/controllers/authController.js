import { userService } from "../services/userService.js";
import { generateToken } from "../utils/jwt.js";
import { hashPassword, comparePassword } from "../utils/crypto.js";

export const authController = {
  async register(req, res, next) {
    try {
      const name = req.body?.name?.trim();
      const email = req.body?.email?.trim()?.toLowerCase();
      const { password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: "Nome, e-mail e senha são obrigatórios" });
      }

      const existingUser = await userService.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: "Já existe uma conta com esse e-mail" });
      }

      const hashed = await hashPassword(password);
      const user = await userService.create({
        name,
        email,
        password: hashed,
      });

      res.status(201).json({
        token: generateToken(user.id),
        user: { id: user.id, name: user.name, email: user.email },
      });
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const email = req.body?.email?.trim()?.toLowerCase();
      const { password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "E-mail e senha são obrigatórios" });
      }

      const user = await userService.findByEmail(email);
      if (!user || !(await comparePassword(password, user.password))) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      res.json({
        token: generateToken(user.id),
        user: { id: user.id, name: user.name, email: user.email },
      });
    } catch (err) {
      next(err);
    }
  },
};
