import express from 'express';
import { uploadVideo } from '../controllers/upload.controller.js';

const router = express.Router();

router.post("/upload-video",uploadVideo)
export default router;