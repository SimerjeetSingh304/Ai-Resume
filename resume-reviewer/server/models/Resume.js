import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
    userId: {
        type: String, // Clerk ID
        required: true,
    },
    originalFileName: {
        type: String,
        required: true,
    },
    fileUrl: {
        type: String, // Path or Cloudinary URL
    },
    extractedText: {
        type: String,
        required: true,
    },
    fileType: {
        type: String,
        enum: ['pdf', 'docx'],
        required: true,
    },
    analyses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Analysis'
    }],
}, { timestamps: true });

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
