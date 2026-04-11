import { userService } from "../services/userService.js";
import { generateToken } from "../utils/jwt.js";
import { hashPassword, comparePassword } from "../utils/crypto.js";

export const authController = {
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const hashed = await hashPassword(password);
      const user = await userService.create({ name, email, password: hashed });
      res.status(201).json({ id: user.id, email: user.email });
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await userService.findByEmail(email);
      if (!user || !(await comparePassword(password, user.password))) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }
      res.json({ token: generateToken(user.id) });
    } catch (err) {
      next(err);
    }
  },
};
