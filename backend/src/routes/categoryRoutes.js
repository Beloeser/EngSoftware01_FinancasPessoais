import { Router } from "express";
import { categoryController } from "../controllers/categoryController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authMiddleware);
router.post("/", categoryController.create);
router.get("/", categoryController.getAll);
router.delete("/:id", categoryController.remove);

export default router;
