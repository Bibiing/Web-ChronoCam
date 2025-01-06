import express from "express";
import { uploadMedia } from "./imagekit.controller.js";
import multer from "multer";
import authenticateToken from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1 * 1024 * 1024 * 1024 },
});

router.post("/", authenticateToken, upload.array("foto"), uploadMedia);

export default router;
