import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Gemini ONLY extracts facts, never scores.
 * Uses the prompt logic provided by the user.
 */
export async function extractResumeFactsWithGemini(resumeText) {
  const prompt = `
You are a resume parser. Extract ONLY the following facts from this resume.
Do NOT score anything. Return ONLY valid JSON, no markdown, no explanation.

RESUME:
${resumeText}

Return this exact JSON structure:
{
  "spellingErrors": ["list each typo or grammar error found, e.g. 'recieved', 'teh'"],
  "missingSections": ["list any of these that are MISSING: Summary, Experience, Education, Skills"],
  "hasEmail": true or false (is there an email address in the resume?),
  "hasLinkedIn": true or false (is there a LinkedIn URL or portfolio link?),
  "hasDesignIssues": true or false (does the text suggest tables, columns, or complex formatting?),
  "atsParseConcerns": ["list any specific ATS parse concerns like headers/footers, text boxes, images"]
}

Rules:
- spellingErrors: only real typos, not technical terms
- missingSections: check for Summary/Profile/Objective, Experience/Work History, Education, Skills/Technologies
- hasDesignIssues: true if text has pipe characters |, unusual spacing, or garbled column text
- atsParseConcerns: be specific, e.g. "Content appears to use pipe-separated columns"
`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean potential markdown formatting
    const cleaned = responseText.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    // Safe fallback if Gemini returns bad JSON
    return {
      spellingErrors: [],
      missingSections: [],
      hasEmail: true,
      hasLinkedIn: false,
      hasDesignIssues: false,
      atsParseConcerns: [],
    };
  }
}
