import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const atsRules = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/ats-rules.json'), 'utf8'));

// ─── HELPERS ────────────────────────────────────────────────────────────────

function extractBulletPoints(text) {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => /^[-•*]/.test(l) || /^\d+\./.test(l))
    .map((l) => l.replace(/^[-•*\d.]\s*/, "").trim())
    .filter((l) => l.length > 5);
}

function hasMetric(bullet) {
  return /\d+\s*[%xX]|\$\s*\d+|\d+\s*(percent|million|billion|k\b|users|clients|projects|hours|days|weeks)/i.test(
    bullet
  );
}

function detectRepetition(bullets) {
  const issues = [];
  const weakVerbs = atsRules.gold_standards.weak_verbs;

  // Consecutive same starting verb
  const startingVerbs = bullets.map((b) => b.split(" ")[0]?.toLowerCase());
  startingVerbs.forEach((verb, i) => {
    if (i > 0 && verb === startingVerbs[i - 1]) {
      issues.push(`"${verb}" used consecutively`);
    }
  });

  // Weak verbs
  bullets.forEach((bullet) => {
    const matched = weakVerbs.find((w) =>
      bullet.toLowerCase().startsWith(w.toLowerCase())
    );
    if (matched) issues.push(`Weak verb: "${matched}"`);
  });

  return [...new Set(issues)];
}

// ─── CONTENT SCORE ──────────────────────────────────────────────────────────

function scoreContent(resumeText, geminiAnalysis) {
  const bullets = extractBulletPoints(resumeText);
  const issues = [];
  let score = 100;

  const contentRules = atsRules.categories.find((c) => c.name === "Content").rules;

  // 1. Quantifying Impact
  const quantRule = contentRules.find((r) => r.id === "quantifying_impact");
  const unquantified = bullets.filter((b) => !hasMetric(b));
  const qDeduction = Math.min(
    unquantified.length * (quantRule.deduction_per_missing ?? 5),
    quantRule.max_deduction ?? 20
  );
  score -= qDeduction;
  if (unquantified.length > 0) {
    issues.push({
      id: "quantifying_impact",
      name: "Quantifying Impact",
      status: "Issue",
      detail: `${unquantified.length} bullet(s) missing metrics or numbers`,
      count: unquantified.length,
    });
  } else {
    issues.push({ id: "quantifying_impact", name: "Quantifying Impact", status: "Pass", detail: "Metrics found in bullet points" });
  }

  // 2. Repetition & weak verbs
  const repRule = contentRules.find((r) => r.id === "repetition");
  const repeated = detectRepetition(bullets);
  if (repeated.length > 0) {
    score -= repRule.deduction ?? 5;
    issues.push({
      id: "repetition",
      name: "Repetition",
      status: "Issue",
      detail: repeated.slice(0, 3).join("; "),
    });
  } else {
    issues.push({ id: "repetition", name: "Repetition", status: "Pass", detail: "Good variety of action verbs" });
  }

  // 3. Spelling & Grammar (from Gemini)
  const grammarRule = contentRules.find((r) => r.id === "spelling_grammar");
  const grammarDeduction = Math.min(
    geminiAnalysis.spellingErrors.length * (grammarRule.deduction_per_error ?? 5),
    grammarRule.max_deduction ?? 25
  );
  score -= grammarDeduction;
  if (geminiAnalysis.spellingErrors.length > 0) {
    issues.push({
      id: "spelling_grammar",
      name: "Spelling & Grammar",
      status: "Issue",
      detail: `${geminiAnalysis.spellingErrors.length} error(s): ${geminiAnalysis.spellingErrors.slice(0, 3).join(", ")}`,
      count: geminiAnalysis.spellingErrors.length,
    });
  } else {
    issues.push({ id: "spelling_grammar", name: "Spelling & Grammar", status: "Pass", detail: "No typos found" });
  }

  return { score: Math.max(0, score), issues };
}

// ─── SECTIONS SCORE ─────────────────────────────────────────────────────────

function scoreSections(geminiAnalysis) {
  const issues = [];
  let score = 100;

  const sectionRule = atsRules.categories
    .find((c) => c.name === "Sections")
    .rules.find((r) => r.id === "missing_sections");

  const essentialSections = ["Summary", "Experience", "Education", "Skills"];
  
  essentialSections.forEach(section => {
    if (geminiAnalysis.missingSections.includes(section)) {
        score -= (sectionRule.impact ?? 15);
        issues.push({
            id: "missing_sections",
            name: section,
            status: "Issue",
            detail: `Missing section: ${section}`,
        });
    } else {
        issues.push({ id: "missing_sections", name: section, status: "Pass", detail: `${section} section found` });
    }
  });

  return { score: Math.max(0, score), issues };
}

// ─── ESSENTIALS SCORE ───────────────────────────────────────────────────────

function scoreEssentials(geminiAnalysis) {
  const issues = [];
  let score = 100;

  const essentialRules = atsRules.categories.find(
    (c) => c.name === "ATS Essentials"
  ).rules;

  // Email
  const emailRule = essentialRules.find((r) => r.id === "email_address");
  if (!geminiAnalysis.hasEmail) {
    score -= emailRule.impact ?? 5;
    issues.push({
      id: "email_address",
      name: "Email Address",
      status: "Issue",
      detail: "No professional email found in contact section",
    });
  } else {
    issues.push({ id: "email_address", name: "Email Address", status: "Pass", detail: "Email found" });
  }

  // LinkedIn / hyperlink
  const linkRule = essentialRules.find((r) => r.id === "hyperlink_header");
  if (!geminiAnalysis.hasLinkedIn) {
    score -= linkRule.impact ?? 5;
    issues.push({
      id: "hyperlink_header",
      name: "Hyperlink in Header",
      status: "Issue",
      detail: "No LinkedIn or portfolio URL found",
    });
  } else {
    issues.push({ id: "hyperlink_header", name: "Hyperlink in Header", status: "Pass", detail: "LinkedIn/Portfolio link found" });
  }

  // Design pitfalls
  const designRule = essentialRules.find((r) => r.id === "design_pitfalls");
  if (geminiAnalysis.hasDesignIssues) {
    score -= designRule.impact ?? 15;
    issues.push({
      id: "design_pitfalls",
      name: "Design",
      status: "Issue",
      detail: "Possible multi-column layout or table detected — may break ATS parsing",
    });
  } else {
    issues.push({ id: "design_pitfalls", name: "Design", status: "Pass", detail: "Clean, ATS-friendly layout" });
  }

  return { score: Math.max(0, score), issues };
}

// ─── PARSE RATE ─────────────────────────────────────────────────────────────

function calculateParseRate(geminiAnalysis, essentialsIssues) {
  let rate = 100;
  if (geminiAnalysis.hasDesignIssues) rate -= 25;
  if (geminiAnalysis.atsParseConcerns.length > 0) rate -= geminiAnalysis.atsParseConcerns.length * 10;
  essentialsIssues.forEach((i) => {
    if (i.id === "design_pitfalls" && i.status === "Issue") rate -= 10;
  });
  return Math.max(0, Math.min(100, rate));
}

// ─── IMPROVEMENTS ───────────────────────────────────────────────────────────

function buildImprovements(contentIssues, sectionIssues, essentialsIssues) {
  const tips = [];

  if (contentIssues.find((i) => i.id === "quantifying_impact" && i.status === "Issue")) {
    tips.push("Add numbers, percentages, or metrics to your bullet points (e.g. 'Increased sales by 30%')");
  }
  if (contentIssues.find((i) => i.id === "repetition" && i.status === "Issue")) {
    tips.push("Vary your action verbs — use words like Spearheaded, Architected, Optimized, Streamlined");
  }
  if (contentIssues.find((i) => i.id === "spelling_grammar" && i.status === "Issue")) {
    tips.push("Fix spelling and grammar errors — run Grammarly or Hemingway before submitting");
  }
  if (sectionIssues.some(i => i.status === "Issue")) {
    tips.push("Add missing sections: " + sectionIssues.filter(i => i.status === "Issue").map((i) => i.name).join(", "));
  }
  if (essentialsIssues.find((i) => i.id === "email_address" && i.status === "Issue")) {
    tips.push("Add a professional email address to your contact section");
  }
  if (essentialsIssues.find((i) => i.id === "hyperlink_header" && i.status === "Issue")) {
    tips.push("Add your LinkedIn URL to the contact/header section");
  }
  if (essentialsIssues.find((i) => i.id === "design_pitfalls" && i.status === "Issue")) {
    tips.push("Switch to a single-column layout — avoid tables and text boxes for ATS compatibility");
  }

  return tips;
}

// ─── MAIN EXPORT ────────────────────────────────────────────────────────────

export function computeScores(resumeText, geminiAnalysis) {
  const { score: contentScore, issues: contentIssues } = scoreContent(resumeText, geminiAnalysis);
  const { score: sectionsScore, issues: sectionIssues } = scoreSections(geminiAnalysis);
  const { score: essentialsScore, issues: essentialsIssues } = scoreEssentials(geminiAnalysis);

  const atsScore = Math.round(
    contentScore * 0.4 + sectionsScore * 0.3 + essentialsScore * 0.3
  );

  const parseRate = calculateParseRate(geminiAnalysis, essentialsIssues);
  const improvements = buildImprovements(contentIssues, sectionIssues, essentialsIssues);

  // Return a structure compatible with the Mongoose schema
  return {
    atsScore,
    contentScore: Math.round(contentScore),
    sectionsScore: Math.round(sectionsScore),
    essentialsScore: Math.round(essentialsScore),
    parseRate,
    issues: {
      content: contentIssues,
      sections: sectionIssues,
      essentials: essentialsIssues,
    },
    improvements,
  };
}
