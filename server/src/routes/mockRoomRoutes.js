import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addRoomEvent,
  createMockRoom,
  getMockRoom,
  joinMockRoom,
  saveIceCandidate,
  saveRoomSignal
} from "../controllers/mockRoomController.js";

const router = Router();

router.use(protect);

router.post("/", createMockRoom);
router.get("/:roomCode", getMockRoom);
router.post("/:roomCode/join", joinMockRoom);
router.post("/:roomCode/signal", saveRoomSignal);
router.post("/:roomCode/candidate", saveIceCandidate);
router.post("/:roomCode/events", addRoomEvent);

export default router;
