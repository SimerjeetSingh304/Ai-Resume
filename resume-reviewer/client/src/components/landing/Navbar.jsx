import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Menu, X, Star, Wrench, DollarSign, BarChart3, User } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { label: "Features", href: "#features", icon: Star },
        { label: "How it Works", href: "#how-it-works", icon: Wrench },
        { label: "Pricing", href: "#pricing", icon: DollarSign },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-lg shadow-sm">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity group">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
                        <span className="text-xl font-bold leading-none text-white">R</span>
                    </div>
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-xl font-bold text-transparent">
                        Resume AI
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200"
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </a>
                    ))}
                </nav>

                {/* Desktop User Actions */}
                <div className="hidden md:flex items-center gap-3">
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
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
                        <Link to="/dashboard" className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
                            Dashboard
                        </Link>
                        <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-9 h-9 border-2 border-slate-200 shadow-sm hover:shadow-md transition-shadow" } }} />
                    </SignedIn>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-100 transition-colors"
                >
                    {mobileMenuOpen ? (
                        <X className="w-5 h-5 text-slate-600" />
                    ) : (
                        <Menu className="w-5 h-5 text-slate-600" />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-lg">
                    <div className="px-4 py-3 space-y-1">
                        {navItems.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200"
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </a>
                        ))}
                        
                        <div className="pt-3 mt-3 border-t border-slate-200 space-y-2">
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <button 
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="w-full px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                                    >
                                        Log in
                                    </button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <button 
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="w-full rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
                                    >
                                        Start for free
                                    </button>
                                </SignUpButton>
                            </SignedOut>
                            <SignedIn>
                                <Link
                                    to="/dashboard"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-all duration-200"
                                >
                                    <BarChart3 className="w-4 h-4" />
                                    Dashboard
                                </Link>
                                <div className="flex items-center gap-3 px-3 py-2.5">
                                    <User className="w-4 h-4" />
                                    <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-8 h-8 border-2 border-slate-200" } }} />
                                </div>
                            </SignedIn>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
