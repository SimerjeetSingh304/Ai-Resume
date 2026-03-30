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
    atsScore: Number,
    contentScore: Number,
    sectionsScore: Number,
    essentialsScore: Number,
    parseRate: {
        type: Number,
        default: 100
    },
    issues: {
        content: [mongoose.Schema.Types.Mixed],
        sections: [mongoose.Schema.Types.Mixed],
        essentials: [mongoose.Schema.Types.Mixed]
    },
    improvements: {
        type: [String],
        default: []
    },
    missingKeywords: [String],
    suggestions: [suggestionSchema],
    summary: {
        strengths: [String],
        improvements: [String]
    },
    resumeText: String
}, { timestamps: true });

const Analysis = mongoose.model('Analysis', analysisSchema);

export default Analysis;
