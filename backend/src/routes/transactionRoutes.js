import { Router } from "express";
import { transactionController } from "../controllers/transactionController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

// A rota /summary precisa obrigatoriamente vir antes do /:id
router.get("/summary", transactionController.getSummary);

router.get("/", transactionController.getAll);
router.post("/", transactionController.create);
router.delete("/:id", transactionController.remove);
router.put("/:id", transactionController.update);

export default router;
