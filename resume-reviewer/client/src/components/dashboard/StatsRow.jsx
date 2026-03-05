import { useEffect, useState } from "react";
import { FileText, Sparkles, Target } from "lucide-react";

const METRICS_KEY = "resume_ai_metrics";

export default function StatsRow({ data }) {
    // History-based metric
    const reviewCount = data?.filter(r => r.analyses?.length > 0).length || 0;

    // Client-side metrics for generator usage
    const [generatorMetrics, setGeneratorMetrics] = useState({
        resumesGenerated: 0,
        coverLettersDrafted: 0,
    });

    useEffect(() => {
        try {
            const stored = localStorage.getItem(METRICS_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                setGeneratorMetrics({
                    resumesGenerated: parsed.resumesGenerated || 0,
                    coverLettersDrafted: parsed.coverLettersDrafted || 0,
                });
            }
        } catch {
            // If localStorage is unavailable or corrupted, just fall back to zeros
        }
    }, []);

    const generateCount = generatorMetrics.resumesGenerated || 0;
    const coverLetterCount = generatorMetrics.coverLettersDrafted || 0;

    const stats = [
        {
            label: "Resumes Reviewed",
            value: reviewCount,
            icon: Target,
            color: "text-blue-600",
            bg: "bg-blue-100",
        },
        {
            label: "Resumes Generated",
            value: generateCount,
            icon: Sparkles,
            color: "text-indigo-600",
            bg: "bg-indigo-100",
        },
        {
            label: "Cover Letters Drafted",
            value: coverLetterCount,
            icon: FileText,
            color: "text-violet-600",
            bg: "bg-violet-100",
        }
    ];

    return (
        <div className="grid sm:grid-cols-3 gap-6 mb-10">
            {stats.map((s, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${s.bg}`}>
                        <s.icon className={`w-6 h-6 ${s.color}`} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">{s.label}</p>
                        <p className="text-2xl font-bold text-slate-900 leading-none mt-1">{s.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
