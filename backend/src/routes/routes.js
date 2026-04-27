import { Router } from "express";
import authRoutes from "./authRoutes.js"; // Adicionada a importação de auth
import transactionRoutes from "./transactionRoutes.js";
import categoryRoutes from "./categoryRoutes.js";

const router = Router();

router.use("/auth", authRoutes); // Adicionada a rota de auth
router.use("/transactions", transactionRoutes);
router.use("/categories", categoryRoutes);

export default router;
