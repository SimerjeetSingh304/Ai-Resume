import { requestResumeAnalysis } from './utils/gemini.js';

async function test() {
    try {
        await requestResumeAnalysis("This is a test resume.");
        console.log("Success");
    } catch (error) {
        console.error("Caught error:", error);
    }
}
test();
