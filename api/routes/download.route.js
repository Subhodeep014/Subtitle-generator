import express from 'express'
import { downloadTranscribeFile } from '../controllers/download.controller.js';
const router = express.Router();

router.get("/transcribe-file", downloadTranscribeFile);
export default router;