import express from 'express';
import { speakText } from '../controllers/tts.controllers.js';

const router = express.Router();

// POST /api/tts/speak - Generate speech from text
router.post('/speak', speakText);

export default router;
