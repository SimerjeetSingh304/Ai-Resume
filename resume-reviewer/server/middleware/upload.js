import multer from 'multer';
import path from 'path';

// Set up local storage as an intermediate step or final destination
// Memory storage is better for direct parsing without saving to disk, 
// but local storage makes debugging and potential Cloudinary uploads easier later.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.pdf' || ext === '.docx') {
        cb(null, true);
    } else {
        cb(new Error('Only .pdf and .docx files are supported'), false);
    }
};

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
    },
    fileFilter: fileFilter,
});
