import express from 'express';
import { upload } from '../middleware/upload.js';
import { uploadResume, analyzeResume, getUserResumes, deleteResume } from '../controllers/resumeController.js';

const router = express.Router();

// Upload a resume
router.post('/upload', upload.single('resume'), uploadResume);

// Analyze an uploaded resume
router.post('/analyze/:id', analyzeResume);

// Get all resumes for user
router.get('/all', getUserResumes);

// Delete a resume
router.delete('/:id', deleteResume);

export default router;
