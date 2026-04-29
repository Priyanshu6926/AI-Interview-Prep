import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getExercises } from "../controllers/codingController.js";

const router = Router();

router.use(protect);
router.get("/exercises", getExercises);

export default router;
