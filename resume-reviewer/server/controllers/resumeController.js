import { upload } from '../middleware/upload.js';
import { parseResumeText } from '../utils/parseResume.js';
import Resume from '../models/Resume.js';
import Analysis from '../models/Analysis.js';
import { extractResumeFactsWithGemini } from '../utils/geminiExtractor.js';
import { computeScores } from '../utils/resumeScorer.js';

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
        import('fs').then(fs => fs.writeFileSync('error_log.txt', error.stack));
        res.status(500).json({ error: 'Failed to upload and parse resume', details: error.message });
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

        // Step 1: Gemini extracts facts only
        const geminiAnalysis = await extractResumeFactsWithGemini(resume.extractedText);
        console.log("Gemini extracted facts:", geminiAnalysis);

        // Step 2: Deterministic scoring from rules JSON
        const result = computeScores(resume.extractedText, geminiAnalysis);
        console.log("Computed scores:", result);

        // Step 3: Save Analysis Result
        const analysisRecord = new Analysis({
            resumeId: resume._id,
            userId,
            jobDescription: jobDescription || '',
            atsScore: result.atsScore,
            contentScore: result.contentScore,
            sectionsScore: result.sectionsScore,
            essentialsScore: result.essentialsScore,
            parseRate: result.parseRate,
            issues: result.issues,
            improvements: result.improvements,
            resumeText: resume.extractedText,
            // Keep scores for legacy compatibility if needed
            scores: {
                ats: result.atsScore,
                content: result.contentScore,
                alignment: 50, // Default for now
                format: result.essentialsScore,
                language: 90
            }
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
        import('fs').then(fs => fs.writeFileSync('error_log_analysis.txt', error.stack || error.message || error.toString()));
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
