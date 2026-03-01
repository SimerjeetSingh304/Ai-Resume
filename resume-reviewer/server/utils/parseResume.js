import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Extracts raw text from a PDF or DOCX buffer.
 * @param {Buffer} fileBuffer - The memory buffer of the uploaded file
 * @param {string} mimeType - The file's MIME type
 * @returns {Promise<string>} The extracted plain text
 */
export const parseResumeText = async (fileBuffer, mimeType) => {
    try {
        if (mimeType === 'application/pdf') {
            const data = await pdfParse(fileBuffer);
            return data.text;
        }

        if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const result = await mammoth.extractRawText({ buffer: fileBuffer });
            return result.value;
        }

        throw new Error('Unsupported file type for parsing');
    } catch (error) {
        console.error('Error parsing file:', error);
        throw new Error('Failed to parse file text');
    }
};
