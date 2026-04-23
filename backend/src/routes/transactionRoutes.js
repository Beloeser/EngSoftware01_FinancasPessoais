import { Router } from "express";
import { transactionController } from "../controllers/transactionController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();
router.use(authMiddleware);
router.get("/", transactionController.getAll);
router.post("/", transactionController.create);
router.delete("/:id", transactionController.remove);

export default router;
