import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  createSession,
  evaluateQuestion,
  explainQuestion,
  generateMoreQuestions,
  getSessionById,
  getSessions,
  togglePin
} from "../controllers/sessionController.js";

const router = Router();

router.use(protect);

router.get("/", getSessions);
router.post("/", upload.single("resume"), createSession);
router.get("/:sessionId", getSessionById);
router.post("/:sessionId/questions/generate-more", generateMoreQuestions);
router.patch("/:sessionId/questions/:questionId/pin", togglePin);
router.post("/:sessionId/questions/:questionId/explain", explainQuestion);
router.post("/:sessionId/questions/:questionId/evaluate", evaluateQuestion);

export default router;
