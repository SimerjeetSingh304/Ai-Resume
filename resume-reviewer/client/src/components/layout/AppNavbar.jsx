import { SignedIn, SignedOut, UserButton, SignOutButton } from "@clerk/clerk-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, BarChart3, FileText, Sparkles, History, Home, LogOut, User } from "lucide-react";
import { useState } from "react";

const navItems = [
    { label: "Dashboard", to: "/dashboard", icon: BarChart3 },
    { label: "Review Resume", to: "/review", icon: FileText },
    { label: "Generate Resume", to: "/generate", icon: Sparkles },
    { label: "History", to: "/history", icon: History },
];

export default function AppNavbar() {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-lg shadow-sm">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 focus:outline-none group"
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
                        <span className="text-xl font-bold leading-none text-white">R</span>
                    </div>
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-xl font-bold text-transparent">
                        Resume AI
                    </span>
                </button>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    isActive 
                                        ? "bg-blue-50 text-blue-700 shadow-sm" 
                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                }`
                            }
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Desktop User Actions */}
                <div className="hidden md:flex items-center gap-3">
                    <SignedOut>
                        <button
                            onClick={() => navigate("/")}
                            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
                        >
                            Back to Landing
                        </button>
                    </SignedOut>
                    <SignedIn>
                        <SignOutButton>
                            <button className="flex items-center rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                                Sign out
                            </button>
                        </SignOutButton>
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "w-9 h-9 border-2 border-slate-200 shadow-sm hover:shadow-md transition-shadow",
                                },
                            }}
                        />
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
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        isActive 
                                            ? "bg-blue-50 text-blue-700" 
                                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                    }`
                                }
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </NavLink>
                        ))}
                        
                        <div className="pt-3 mt-3 border-t border-slate-200">
                            <SignedOut>
                                <button
                                    onClick={() => {
                                        navigate("/");
                                        setMobileMenuOpen(false);
                                    }}
                                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                                >
                                    <Home className="w-4 h-4" />
                                    Back to Landing
                                </button>
                            </SignedOut>
                            <SignedIn>
                                <SignOutButton>
                                    <button 
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign out
                                    </button>
                                </SignOutButton>
                                <div className="flex items-center gap-3 px-3 py-2.5">
                                    <User className="w-4 h-4" />
                                    <UserButton
                                        appearance={{
                                            elements: {
                                                avatarBox: "w-8 h-8 border-2 border-slate-200",
                                            },
                                        }}
                                    />
                                </div>
                            </SignedIn>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

