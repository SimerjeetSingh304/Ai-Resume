import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, ArrowRight, Star, Target, Code, FileText, Check, X } from 'lucide-react';

export default function ResultsDashboard({ analysis }) {
    if (!analysis) return null;

    const {
        overallScore = 0,
        grade = "N/A",
        scores = {
            ats: 0,
            content: 0,
            alignment: 0,
            format: 0,
            language: 0
        },
        detailedBreakdown = {
            atsEssentials: { score: 0, issues: [] },
            content: { score: 0, issues: [] },
            sections: { score: 0, issues: [] }
        },
        missingKeywords = [],
        suggestions = [],
        summary = { strengths: [], improvements: [] }
    } = analysis || {};

    const getScoreColor = (score) => {
        if (score >= 80) return "text-emerald-500";
        if (score >= 60) return "text-amber-500";
        return "text-rose-500";
    };

    const getScoreBg = (score) => {
        if (score >= 80) return "bg-emerald-500";
        if (score >= 60) return "bg-amber-500";
        return "bg-rose-500";
    };

    return (
        <div className="w-full max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Top Overview Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Overall Score Card */}
                <Card className="lg:col-span-4 shadow-xl border-none bg-white rounded-3xl overflow-hidden">
                    <CardHeader className="text-center pb-2 pt-10">
                        <CardTitle className="text-xl font-bold text-slate-500 tracking-tight">Your Score</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center pb-10">
                        <div className="relative w-48 h-48 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full border-[12px] border-slate-50 shadow-inner"></div>
                            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                <circle cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="12" fill="transparent"
                                    strokeDasharray={527.7}
                                    strokeDashoffset={527.7 - (527.7 * overallScore) / 100}
                                    className={`${getScoreColor(overallScore)} transition-all duration-1000 ease-out`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="z-10 flex flex-col items-center">
                                <span className="text-6xl font-black text-slate-900 tracking-tighter">{overallScore}</span>
                                <span className="text-lg font-bold text-slate-400">/ 100</span>
                            </div>
                        </div>
                        
                        <div className="mt-8 flex items-center gap-3 bg-slate-50 px-6 py-2 rounded-2xl border border-slate-100">
                            <span className="text-sm font-semibold text-slate-500">AI Grade:</span>
                            <span className={`text-2xl font-black ${getScoreColor(overallScore)}`}>
                                {grade}
                            </span>
                        </div>

                        <p className="mt-6 text-sm font-medium text-slate-400">
                            {detailedBreakdown.atsEssentials.issues.filter(i => i.status === 'Issue').length + 
                             detailedBreakdown.content.issues.filter(i => i.status === 'Issue').length + 
                             detailedBreakdown.sections.issues.filter(i => i.status === 'Issue').length} Issues Identified
                        </p>
                    </CardContent>
                </Card>

                {/* Detailed Sections (Premium Style) */}
                <div className="lg:col-span-8 space-y-6">
                    <PremiumSection 
                        title="CONTENT" 
                        score={detailedBreakdown.content.score} 
                        issues={detailedBreakdown.content.issues}
                        icon={<FileText className="w-5 h-5 text-indigo-500" />}
                    />
                    <PremiumSection 
                        title="SECTIONS" 
                        score={detailedBreakdown.sections.score} 
                        issues={detailedBreakdown.sections.issues}
                        icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                    />
                    <PremiumSection 
                        title="ATS ESSENTIALS" 
                        score={detailedBreakdown.atsEssentials.score} 
                        issues={detailedBreakdown.atsEssentials.issues}
                        icon={<Target className="w-5 h-5 text-rose-500" />}
                    />
                </div>
            </div>

            {/* Missing Keywords & Actionable Suggestions below... */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Keywords Card */}
                {missingKeywords.length > 0 && (
                    <Card className="shadow-lg border-none bg-white rounded-3xl p-8">
                        <CardHeader className="p-0 mb-6">
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <Code className="w-6 h-6 text-indigo-500" /> Missing Keywords
                            </CardTitle>
                        </CardHeader>
                        <div className="flex flex-wrap gap-2">
                            {missingKeywords.map((kw, idx) => (
                                <Badge key={idx} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-none px-3 py-1.5 rounded-lg text-sm font-medium">
                                    + {kw}
                                </Badge>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Quick Improvements Card */}
                <Card className="shadow-lg border-none bg-white rounded-3xl p-8">
                    <CardHeader className="p-0 mb-6">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <AlertTriangle className="w-6 h-6 text-amber-500" /> Focus Areas
                        </CardTitle>
                    </CardHeader>
                    <div className="space-y-4">
                        {summary.improvements.slice(0, 3).map((imp, idx) => (
                            <div key={idx} className="flex gap-3 text-sm font-medium text-slate-600">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></div>
                                {imp}
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Actionable Suggestions (Rewrites) */}
            <div className="space-y-6">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">AI Content Optimizer</h3>
                <div className="grid grid-cols-1 gap-6">
                    {suggestions.map((sug, idx) => (
                        <Card key={idx} className="shadow-xl border-none bg-white rounded-3xl overflow-hidden group">
                            <div className="flex flex-col md:flex-row relative">
                                <div className="flex-1 p-8 bg-slate-50/50">
                                    <div className="flex items-center text-rose-500 text-xs font-black uppercase tracking-widest mb-4">
                                        <X className="w-4 h-4 mr-2" /> Original Snippet
                                    </div>
                                    <p className="text-slate-600 italic leading-relaxed">"{sug.original}"</p>
                                </div>
                                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full items-center justify-center text-slate-300 z-10 shadow-lg border border-slate-50">
                                    <ArrowRight className="w-6 h-6" />
                                </div>
                                <div className="flex-1 p-8 bg-emerald-50/30">
                                    <div className="flex items-center text-emerald-600 text-xs font-black uppercase tracking-widest mb-4">
                                        <Check className="w-4 h-4 mr-2" /> AI Improved Version
                                    </div>
                                    <p className="text-slate-900 font-bold leading-relaxed mb-4">"{sug.improved}"</p>
                                    <div className="bg-white/60 p-4 rounded-2xl text-xs text-slate-500 border border-emerald-100 flex gap-2">
                                        <span className="font-black text-emerald-700 shrink-0">WHY:</span>
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

function PremiumSection({ title, score, issues, icon }) {
    const isSuccess = score >= 80;
    const isWarning = score >= 50 && score < 80;
    
    return (
        <Card className="shadow-sm border border-slate-100 bg-white rounded-2xl overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-50">
                <div className="flex items-center gap-3">
                    {icon}
                    <h4 className="font-black text-slate-800 tracking-tight text-sm uppercase">{title}</h4>
                </div>
                <div className="flex items-center gap-4">
                    <Badge className={`${isSuccess ? 'bg-emerald-50 text-emerald-600' : isWarning ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'} border-none font-bold`}>
                        {score}%
                    </Badge>
                </div>
            </div>
            <CardContent className="px-6 py-4 space-y-4">
                {issues.map((issue, idx) => (
                    <div key={idx} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            {issue.status === 'Pass' ? (
                                <Check className="w-4 h-4 text-emerald-500" />
                            ) : (
                                <X className="w-4 h-4 text-rose-500" />
                            )}
                            <span className={`text-sm font-medium ${issue.status === 'Pass' ? 'text-slate-600' : 'text-slate-900'}`}>
                                {issue.name}
                            </span>
                        </div>
                        <Badge variant="outline" className={`rounded-full px-3 py-0.5 text-[10px] font-bold ${issue.status === 'Pass' ? 'text-slate-400 border-slate-100' : 'text-rose-500 border-rose-100 bg-rose-50/50'}`}>
                            {issue.status === 'Pass' ? 'No issues' : '1 issue'}
                        </Badge>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
