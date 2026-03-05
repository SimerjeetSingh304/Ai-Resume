import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, History, Star, Briefcase, Calendar, Download, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ResultsDashboard from "../components/ResultsDashboard";
import PageHeader from "../components/shared/PageHeader";

export default function ReviewResultsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isShortlisted, setIsShortlisted] = useState(false);
    const [isInterviewReady, setIsInterviewReady] = useState(false);

    // The analysis data should be passed via router state from the ReviewerPage
    const analysis = location.state?.analysis;

    if (!analysis) {
        // If no analysis exists in state (e.g. user navigated here directly), redirect back to review
        return <Navigate to="/review" replace />;
    }

    const handleShortlist = () => {
        setIsShortlisted(!isShortlisted);
        toast.success(isShortlisted ? "Removed from shortlist" : "Added to shortlist");
    };

    const handleInterviewReady = () => {
        setIsInterviewReady(!isInterviewReady);
        toast.success(isInterviewReady ? "Removed from interview list" : "Marked as interview-ready");
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: "Resume Analysis Results",
                text: `Check out my resume analysis: Score ${analysis.overallScore}/100 - Grade ${analysis.grade}`,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard");
        }
    };

    const handleDownload = () => {
        // Create a simple text report
        const report = `
Resume Analysis Report
=====================

Overall Score: ${analysis.overallScore}/100
Grade: ${analysis.grade}

Key Insights:
${analysis.keyInsights?.join('\n') || 'No key insights available'}

Strengths:
${analysis.strengths?.join('\n') || 'No strengths identified'}

Areas for Improvement:
${analysis.improvements?.join('\n') || 'No improvements needed'}

Generated on: ${new Date().toLocaleDateString()}
        `.trim();

        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resume-analysis-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast.success("Analysis report downloaded");
    };

    return (
        <div className="max-w-6xl mx-auto pb-12 animate-in fade-in duration-500">
            {/* Header with Actions */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1">
                        <PageHeader
                            title="Analysis Results"
                            subtitle={`Score: ${analysis.overallScore}/100 - Grade: ${analysis.grade}`}
                            breadcrumbs={[
                                { label: "Dashboard", href: "/dashboard" },
                                { label: "Review Resume", href: "/review" },
                                { label: "Results" }
                            ]}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={() => navigate("/review")}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                        >
                            <RefreshCw className="w-4 h-4" /> Analyze Another
                        </button>
                        
                        <button
                            onClick={handleShortlist}
                            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors shadow-sm ${
                                isShortlisted 
                                    ? "bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-200" 
                                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                            }`}
                        >
                            <Star className={`w-4 h-4 ${isShortlisted ? 'fill-current' : ''}`} /> 
                            {isShortlisted ? "Shortlisted" : "Shortlist"}
                        </button>

                        <button
                            onClick={handleInterviewReady}
                            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors shadow-sm ${
                                isInterviewReady 
                                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200" 
                                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                            }`}
                        >
                            <Briefcase className={`w-4 h-4 ${isInterviewReady ? 'fill-current' : ''}`} /> 
                            {isInterviewReady ? "Interview Ready" : "Mark for Interview"}
                        </button>

                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                        >
                            <Share2 className="w-4 h-4" /> Share
                        </button>

                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                        >
                            <Download className="w-4 h-4" /> Download
                        </button>

                        <button
                            onClick={() => navigate("/history")}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
                        >
                            <History className="w-4 h-4" /> View History
                        </button>
                    </div>
                </div>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className={`rounded-xl border p-4 text-center transition-all ${
                    isShortlisted 
                        ? "border-amber-200 bg-amber-50 shadow-sm" 
                        : "border-slate-200 bg-white"
                }`}>
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Star className={`w-5 h-5 ${isShortlisted ? 'text-amber-600 fill-current' : 'text-slate-400'}`} />
                        <span className="font-semibold text-slate-900">Shortlist Status</span>
                    </div>
                    <p className={`text-sm ${isShortlisted ? 'text-amber-700' : 'text-slate-500'}`}>
                        {isShortlisted ? "Added to shortlist" : "Not shortlisted"}
                    </p>
                </div>

                <div className={`rounded-xl border p-4 text-center transition-all ${
                    isInterviewReady 
                        ? "border-emerald-200 bg-emerald-50 shadow-sm" 
                        : "border-slate-200 bg-white"
                }`}>
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Briefcase className={`w-5 h-5 ${isInterviewReady ? 'text-emerald-600 fill-current' : 'text-slate-400'}`} />
                        <span className="font-semibold text-slate-900">Interview Ready</span>
                    </div>
                    <p className={`text-sm ${isInterviewReady ? 'text-emerald-700' : 'text-slate-500'}`}>
                        {isInterviewReady ? "Ready for interviews" : "Not marked for interview"}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-slate-900">Analysis Date</span>
                    </div>
                    <p className="text-sm text-slate-500">{new Date().toLocaleDateString()}</p>
                </div>
            </div>

            {/* Results Dashboard */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <ResultsDashboard analysis={analysis} />
            </div>
        </div>
    );
}
