import { requestResumeAnalysis } from './utils/gemini.js';

async function test() {
    try {
        console.log("Starting analysis test with a weak resume snippet...");
        const result = await requestResumeAnalysis(
            "John Doe. Experience: Helped the team with some tasks. Responsible for coding. Education: Some College.",
            "Senior Software Engineer"
        );
        console.log("Analysis Result:");
        console.log(JSON.stringify(result, null, 2));
        
        if (result.overallScore < 80) {
            console.log("\n✅ SUCCESS: Realistic low score given for weak resume.");
        } else {
            console.log("\n❌ FAILURE: Score is still too high for a weak resume.");
        }

        if (result.detailedBreakdown) {
            console.log("✅ SUCCESS: Detailed breakdown found in response.");
        } else {
            console.log("❌ FAILURE: Detailed breakdown missing.");
        }

    } catch (error) {
        console.error("Caught error:", error.stack || error);
    }
}
test();
