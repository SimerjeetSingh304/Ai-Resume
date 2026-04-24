import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, User, LogOut, LayoutDashboard, FileSearch, Sparkles, History } from "lucide-react";

const navItems = [
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: "Review", to: "/review", icon: FileSearch },
    { label: "Generate", to: "/generate", icon: Sparkles },
    { label: "History", to: "/history", icon: History },
];

export default function AppNavbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <NavLink to="/" className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-200">
                        <span className="text-lg font-bold text-white">R</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">
                        Resume<span className="text-blue-600">AI</span>
                    </span>
                </NavLink>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    isActive
                                        ? "text-blue-600 bg-blue-50"
                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                }`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Desktop User Actions */}
                <div className="hidden md:flex items-center gap-3">
                    <button className="flex items-center rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                        Sign out (Disabled)
                    </button>
                    <div className="w-9 h-9 border-2 border-slate-200 shadow-sm rounded-full bg-slate-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-slate-400" />
                    </div>
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
                            <button 
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign out (Disabled)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
