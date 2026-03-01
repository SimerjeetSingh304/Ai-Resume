import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, ArrowRight, Star, Target, Code, FileText, Check, X } from 'lucide-react';

export default function ResultsDashboard({ analysis }) {
    if (!analysis) return null;

    const {
        overallScore,
        grade,
        scores,
        missingKeywords,
        suggestions,
        summary
    } = analysis;

    // Helper to determine color based on score
    const getScoreColor = (score) => {
        if (score >= 80) return "text-green-500";
        if (score >= 60) return "text-yellow-500";
        return "text-red-500";
    };

    const getScoreBg = (score) => {
        if (score >= 80) return "bg-green-500";
        if (score >= 60) return "bg-yellow-500";
        return "bg-red-500";
    };

    return (
        <div className="w-full max-w-5xl mx-auto mt-10 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Top Overview Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Overall Score Card */}
                <Card className="md:col-span-1 shadow-lg border-none bg-white/60 backdrop-blur text-center flex flex-col justify-center items-center p-8">
                    <h3 className="text-xl font-bold text-muted-foreground mb-4">Overall ATS Score</h3>
                    <div className="relative w-40 h-40 flex items-center justify-center rounded-full bg-slate-50 shadow-inner">
                        {/* CSS Circle Progress would go here, simulating with Tailwind for now */}
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-200" />
                            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent"
                                strokeDasharray={440}
                                strokeDashoffset={440 - (440 * overallScore) / 100}
                                className={`${getScoreColor(overallScore)} transition-all duration-1000 ease-out`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="z-10 flex flex-col items-center">
                            <span className="text-5xl font-extrabold text-foreground">{overallScore}</span>
                            <span className="text-sm font-medium text-muted-foreground mt-1">/ 100</span>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">AI Grade:</span>
                        <Badge variant="outline" className={`text-lg font-bold px-3 py-1 ${getScoreColor(overallScore)} border-current`}>
                            {grade}
                        </Badge>
                    </div>
                </Card>

                {/* Score Breakdown Card */}
                <Card className="md:col-span-2 shadow-lg border-none bg-white/60 backdrop-blur p-6">
                    <CardHeader className="p-0 pb-6">
                        <CardTitle className="text-xl">Evaluation Breakdown</CardTitle>
                        <CardDescription>How your resume performs across key dimensions</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 space-y-5">
                        <ScoreBar label="ATS Compatibility" score={scores.ats} icon={<Target className="w-4 h-4" />} />
                        <ScoreBar label="Content & Impact" score={scores.content} icon={<FileText className="w-4 h-4" />} />
                        <ScoreBar label="Job Alignment" score={scores.alignment} icon={<CheckCircle2 className="w-4 h-4" />} />
                        <ScoreBar label="Format & Readability" score={scores.format} icon={<FileText className="w-4 h-4" />} />
                        <ScoreBar label="Language & Grammar" score={scores.language} icon={<Target className="w-4 h-4" />} />
                    </CardContent>
                </Card>
            </div>

            {/* Quick Insights (Strengths & Improvements) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-md border-none bg-green-50/50">
                    <CardHeader>
                        <CardTitle className="flex items-center text-green-700 text-lg">
                            <Star className="w-5 h-5 mr-2" /> Top Strengths
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {summary.strengths.map((str, idx) => (
                                <li key={idx} className="flex items-start text-sm text-green-800">
                                    <Check className="w-4 h-4 mr-2 mt-0.5 shrink-0 text-green-600" />
                                    <span>{str}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card className="shadow-md border-none bg-amber-50/50">
                    <CardHeader>
                        <CardTitle className="flex items-center text-amber-700 text-lg">
                            <AlertTriangle className="w-5 h-5 mr-2" /> Needs Improvement
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {summary.improvements.map((imp, idx) => (
                                <li key={idx} className="flex items-start text-sm text-amber-800">
                                    <X className="w-4 h-4 mr-2 mt-0.5 shrink-0 text-amber-600" />
                                    <span>{imp}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* Missing Keywords */}
            {missingKeywords && missingKeywords.length > 0 && (
                <Card className="shadow-md border-none bg-white/60 backdrop-blur">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                            <Code className="w-5 h-5 mr-2 text-primary" />
                            Missing Keywords / Skills
                        </CardTitle>
                        <CardDescription>Consider naturally weaving these into your experience section.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {missingKeywords.map((kw, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200">
                                + {kw}
                            </Badge>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Actionable Suggestions (Before / After) */}
            <div className="space-y-4 pt-4">
                <h3 className="text-2xl font-bold flex items-center">
                    <Target className="w-6 h-6 mr-2 text-primary" />
                    Actionable Improvements
                </h3>
                <p className="text-muted-foreground text-sm pb-2">Our AI has rewritten your weak bullet points to maximize impact.</p>

                <div className="grid grid-cols-1 gap-6">
                    {suggestions.map((sug, idx) => (
                        <Card key={idx} className="shadow-sm border border-slate-200 overflow-hidden">
                            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{sug.section}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 relative">

                                {/* Original */}
                                <div className="p-5 bg-red-50/30">
                                    <div className="flex items-center text-red-600 text-sm font-semibold mb-3">
                                        <X className="w-4 h-4 mr-1" /> Original
                                    </div>
                                    <p className="text-sm text-slate-700 leading-relaxed italic">"{sug.original}"</p>
                                </div>

                                {/* Arrow connector for desktop */}
                                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-slate-200 rounded-full items-center justify-center text-slate-400 z-10 shadow-sm">
                                    <ArrowRight className="w-4 h-4" />
                                </div>

                                {/* Improved */}
                                <div className="p-5 bg-green-50/30">
                                    <div className="flex items-center text-green-600 text-sm font-semibold mb-3">
                                        <CheckCircle2 className="w-4 h-4 mr-1" /> AI Suggestion
                                    </div>
                                    <p className="text-sm font-medium text-slate-900 leading-relaxed bg-green-100/50 p-3 rounded-md border border-green-200">
                                        "{sug.improved}"
                                    </p>
                                    <div className="mt-4 text-xs text-slate-500 flex items-start">
                                        <span className="font-semibold text-slate-700 mr-1">Why:</span>
                                        {sug.reason}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Helper component for the score bars
function ScoreBar({ label, score, icon }) {
    const colorClass = score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500';

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-medium">
                <span className="flex items-center text-slate-700">
                    <span className="mr-2 text-slate-400">{icon}</span>
                    {label}
                </span>
                <span className="font-bold text-slate-900">{score}/100</span>
            </div>
            {/* Custom Progress Bar to inject dynamic Tailwind colors */}
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-1000 ${colorClass}`}
                    style={{ width: `${score}%` }}
                />
            </div>
        </div>
    );
}
