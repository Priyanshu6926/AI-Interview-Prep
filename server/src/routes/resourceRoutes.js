import { Router } from "express";
import { getLectures } from "../controllers/resourceController.js";

const router = Router();

router.get("/lectures", getLectures);

export default router;
