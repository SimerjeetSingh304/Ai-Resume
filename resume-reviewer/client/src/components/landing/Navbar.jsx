import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-sm">
                        <span className="text-xl font-bold leading-none text-white">R</span>
                    </div>
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-xl font-bold text-transparent">
                        Resume AI
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                    <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Features</a>
                    <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">How it Works</a>
                    <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Pricing</a>
                </nav>

                <div className="flex items-center gap-4">
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="hidden sm:block px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                                Log in
                            </button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                            <button className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-all hover:scale-105 active:scale-95">
                                Start for free
                            </button>
                        </SignUpButton>
                    </SignedOut>
                    <SignedIn>
                        <Link to="/dashboard" className="hidden sm:block px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
                            Dashboard
                        </Link>
                        <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-9 h-9 border border-slate-200" } }} />
                    </SignedIn>
                </div>
            </div>
        </header>
    );
}
