import { upload } from '../middleware/upload.js';
import { parseResumeText } from '../utils/parseResume.js';
import Resume from '../models/Resume.js';
import Analysis from '../models/Analysis.js';
import { requestResumeAnalysis } from '../utils/gemini.js';

export const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Please upload a file' });
        }

        const userId = req.headers['x-user-id'] || 'anonymous';
        const fileType = req.file.mimetype === 'application/pdf' ? 'pdf' : 'docx';

        // Parse Text
        const extractedText = await parseResumeText(req.file.buffer, req.file.mimetype);

        // Save initial resume record (can add file storage like Cloudinary here later)
        const newResume = new Resume({
            userId,
            originalFileName: req.file.originalname,
            extractedText,
            fileType,
            // fileUrl: 'link_to_s3_or_cloudinary'
        });

        const savedResume = await newResume.save();

        res.status(201).json({
            message: 'Resume uploaded and parsed successfully',
            resumeId: savedResume._id,
            fileName: savedResume.originalFileName
        });

    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ error: 'Failed to upload and parse resume' });
    }
};

export const analyzeResume = async (req, res) => {
    try {
        const { id } = req.params;
        const { jobDescription } = req.body;
        const userId = req.headers['x-user-id'] || 'anonymous';

        const resume = await Resume.findOne({ _id: id, userId });
        if (!resume) {
            return res.status(404).json({ error: 'Resume not found' });
        }

        // Call Gemini API
        const aiResult = await requestResumeAnalysis(resume.extractedText, jobDescription);

        // Save Analysis Result
        const analysisRecord = new Analysis({
            resumeId: resume._id,
            userId,
            jobDescription: jobDescription || '',
            ...aiResult // Spread overallScore, grade, scores, missingKeywords, suggestions, summary
        });

        const savedAnalysis = await analysisRecord.save();

        // Update the resume to reference this analysis
        resume.analyses.push(savedAnalysis._id);
        await resume.save();

        res.status(200).json({
            message: 'Analysis complete',
            analysis: savedAnalysis
        });

    } catch (error) {
        console.error('Analysis Error:', error);
        res.status(500).json({ error: 'AI analysis failed. Please try again later.' });
    }
};

export const getUserResumes = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'] || 'anonymous';
        // Populate the analyses field to return history properly
        const resumes = await Resume.find({ userId }).populate('analyses').sort({ createdAt: -1 });
        res.status(200).json(resumes);
    } catch (error) {
        console.error('Fetch Error:', error);
        res.status(500).json({ error: 'Failed to retrieve resumes' });
    }
};

export const deleteResume = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.headers['x-user-id'] || 'anonymous';

        const resume = await Resume.findOneAndDelete({ _id: id, userId });

        if (!resume) {
            return res.status(404).json({ error: 'Resume not found' });
        }

        // Delete associated analyses
        await Analysis.deleteMany({ resumeId: resume._id });

        res.status(200).json({ message: 'Resume deleted successfully' });
    } catch (error) {
        console.error('Delete Error:', error);
        res.status(500).json({ error: 'Failed to delete resume' });
    }
};
