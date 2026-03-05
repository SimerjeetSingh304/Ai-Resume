import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { FileSearch } from "lucide-react";

import PageHeader from "../components/shared/PageHeader";
import FileUploadZone from "../components/reviewer/FileUploadZone";
import JobDescriptionInput from "../components/reviewer/JobDescriptionInput";
import LoadingOverlay from "../components/reviewer/LoadingOverlay";

export default function ReviewerPage() {
    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const navigate = useNavigate();
    const { getToken, userId } = useAuth();

    const handleAnalyze = async () => {
        if (!file) {
            toast.error("Please upload a resume first.");
            return;
        }

        setIsAnalyzing(true);

        try {
            const token = await getToken();
            const headers = { "x-user-id": userId };
            if (token) headers.Authorization = `Bearer ${token}`;

            // 1. Upload File
            const formData = new FormData();
            formData.append("resume", file);

            const uploadRes = await fetch("http://localhost:5000/api/resume/upload", {
                method: "POST",
                headers, // Do NOT set Content-Type for FormData, browser does it automatically with boundary
                body: formData,
            });

            if (!uploadRes.ok) throw new Error("File upload failed");
            const { resumeId } = await uploadRes.json();

            // 2. Analyze File against Job Description
            const analyzeRes = await fetch(`http://localhost:5000/api/resume/analyze/${resumeId}`, {
                method: "POST",
                headers: {
                    ...headers,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ jobDescription }),
            });

            if (!analyzeRes.ok) {
                const errorData = await analyzeRes.json().catch(() => ({}));
                throw new Error(errorData.error || "Analysis failed due to a server error. Please try again.");
            }
            const analysisData = await analyzeRes.json();

            // 3. Navigate to Results with state (use the nested analysis object)
            navigate("/review/results", {
                state: { analysis: analysisData.analysis },
                replace: true // Don't build up massive browser history if they rethink multiple times
            });

        } catch (error) {
            console.error(error);
            toast.error(error.message || "An error occurred during analysis.");
            setIsAnalyzing(false); // only toggle off if error, otherwise component unmounts
        }
    };

    return (
        <div className="mx-auto max-w-5xl animate-in fade-in duration-500 space-y-8">
            <LoadingOverlay isOpen={isAnalyzing} />

            <PageHeader
                title="Resume Reviewer"
                subtitle="Upload your resume, paste a target role, and let our AI run a full ATS-style analysis."
            />

            <div className="grid gap-8 xl:gap-10 lg:grid-cols-[1.35fr_minmax(0,1fr)] items-start">
                {/* Left Column: Form */}
                <div className="space-y-6">
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-6">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-1">
                            Step 1
                        </h3>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Upload your resume file</h2>
                        <p className="text-xs text-slate-500 mb-4">
                            We support PDF and DOCX. Your file stays private and is used only to generate this analysis.
                        </p>
                        <FileUploadZone onFileSelect={setFile} selectedFile={file} />
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-1">
                            Step 2
                        </h3>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Paste the job description</h2>
                        <p className="text-xs text-slate-500 mb-4">
                            Add the role you are targeting so we can score alignment, missing keywords, and impact.
                        </p>
                        <JobDescriptionInput value={jobDescription} onChange={setJobDescription} />
                    </div>
                </div>

                {/* Right Column: Action & Info */}
                <div className="space-y-6">
                    <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-8 text-white shadow-lg shadow-blue-900/20">
                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-5">
                            <FileSearch className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Run your ATS analysis</h3>
                        <p className="text-blue-100 mb-7 text-sm leading-relaxed">
                            We will parse your resume, compare it against the role, and generate a detailed scorecard
                            with strengths, gaps, and bullet-point rewrites.
                        </p>
                        <button
                            onClick={handleAnalyze}
                            disabled={!file || isAnalyzing}
                            className="w-full py-3.5 px-6 rounded-xl bg-white text-blue-700 text-sm sm:text-base font-semibold shadow-lg shadow-blue-900/20 hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                        >
                            {isAnalyzing ? "Analyzing your resume…" : "Analyze my resume"}
                        </button>
                        <p className="mt-3 text-[11px] text-blue-100/90">
                            You will be taken to a results dashboard with your ATS score and improvement suggestions.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 text-xs text-slate-600 space-y-2">
                        <h4 className="text-sm font-semibold text-slate-900 mb-1">Privacy & Security</h4>
                        <p>
                            Your documents are stored securely and never sold or shared with third parties. You can delete
                            any resume and its analysis at any time from your History tab.
                        </p>
                        <p className="text-slate-500">
                            For best results, upload a clean, text-based PDF or DOCX rather than a scanned image.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
