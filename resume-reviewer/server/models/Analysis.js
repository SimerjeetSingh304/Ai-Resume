import mongoose from 'mongoose';

const suggestionSchema = new mongoose.Schema({
    section: String,
    original: String,
    improved: String,
    reason: String
}, { _id: false });

const analysisSchema = new mongoose.Schema({
    resumeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resume',
        required: true,
    },
    userId: {
        type: String, // Clerk ID
        required: true,
    },
    jobDescription: {
        type: String,
    },
    overallScore: {
        type: Number,
        required: true,
    },
    grade: {
        type: String,
    },
    scores: {
        ats: Number,
        content: Number,
        alignment: Number,
        format: Number,
        language: Number
    },
    detailedBreakdown: {
        atsEssentials: {
            score: Number,
            issues: [{
                name: String,
                status: { type: String, enum: ['Pass', 'Issue'] },
                detail: String
            }]
        },
        content: {
            score: Number,
            issues: [{
                name: String,
                status: { type: String, enum: ['Pass', 'Issue'] },
                detail: String
            }]
        },
        sections: {
            score: Number,
            issues: [{
                name: String,
                status: { type: String, enum: ['Pass', 'Issue'] },
                detail: String
            }]
        }
    },
    missingKeywords: [String],
    suggestions: [suggestionSchema],
    summary: {
        strengths: [String],
        improvements: [String]
    }
}, { timestamps: true });

const Analysis = mongoose.model('Analysis', analysisSchema);

export default Analysis;
