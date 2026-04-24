import { SignUpButton, SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { FileSearch, Sparkles, Loader2 } from "lucide-react";

export default function HeroSection() {
    const { isLoaded } = useUser();

    return (
        <section className="relative overflow-hidden pt-24 pb-32">
            {/* Background gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 blur-[100px] rounded-full mix-blend-multiply" />
            </div>

            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-8">
                    <Sparkles className="w-4 h-4" />
                    <span>Gemini 2.5 Flash Powered</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-8">
                    Land your dream job with <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                        AI-powered intelligence
                    </span>
                </h1>

                <p className="max-w-2xl mx-auto text-xl text-slate-600 mb-10 leading-relaxed">
                    Upload your resume for an instant ATS compatibility score, or let our AI generate a perfectly tailored, recruiter-ready resume from scratch in seconds.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 min-h-[64px]">
                    {!isLoaded ? (
                        <div className="flex items-center gap-2 text-slate-400 animate-pulse font-medium">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Initializing...</span>
                        </div>
                    ) : (
                        <>
                            <SignedOut>
                                <SignUpButton mode="modal">
                                    <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5">
                                        <FileSearch className="w-5 h-5" />
                                        Analyze My Resume
                                    </button>
                                </SignUpButton>
                                <SignUpButton mode="modal">
                                    <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-slate-700 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl transition-all">
                                        <Sparkles className="w-5 h-5 text-indigo-600" />
                                        Build from Scratch
                                    </button>
                                </SignUpButton>
                            </SignedOut>

                            <SignedIn>
                                <Link to="/review" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5">
                                    <FileSearch className="w-5 h-5" />
                                    Review Resume
                                </Link>
                                <Link to="/generate" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-slate-700 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl transition-all">
                                    <Sparkles className="w-5 h-5 text-indigo-600" />
                                    Generate Resume
                                </Link>
                            </SignedIn>
                        </>
                    )}
                </div>

                <p className="mt-6 text-sm text-slate-400 font-medium">
                    Free forever for basic use. No credit card required.
                </p>
            </div>
        </section>
    );
}
