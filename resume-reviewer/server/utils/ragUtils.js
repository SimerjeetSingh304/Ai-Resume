import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const KNOWLEDGE_PATH = path.join(__dirname, '../data/ats_knowledge.json');

/**
 * Simulates a RAG retrieval system.
 * In a production app, this would use embeddings and a vector DB.
 * For this project, it retrieves relevant ATS rules from a structured knowledge base.
 */
export const getATSKnowledge = async (resumeText = "") => {
    try {
        const rawData = fs.readFileSync(KNOWLEDGE_PATH, 'utf-8');
        const knowledge = JSON.parse(rawData);

        // Simple 'retrieval' logic: return all rules but highlight certain ones if they appear in text
        // (e.g., if 'table' is mentioned, prioritize design rules)
        
        let retrievedContext = "ATS EVALUATION KNOWLEDGE BASE:\n";
        
        knowledge.categories.forEach(cat => {
            retrievedContext += `\n### ${cat.name} Rules:\n`;
            cat.rules.forEach(rule => {
                retrievedContext += `- ${rule.name}: ${rule.description} (Impact: ${rule.impact || rule.deduction_per_missing || 'High'})\n`;
            });
        });

        retrievedContext += `\n### Preferred Action Verbs:\n${knowledge.gold_standards.action_verbs.join(', ')}\n`;
        retrievedContext += `### Weak Verbs to Avoid:\n${knowledge.gold_standards.weak_verbs.join(', ')}\n`;

        return retrievedContext;
    } catch (error) {
        console.error('RAG Retrieval Error:', error);
        return "Standard ATS rules apply.";
    }
};
