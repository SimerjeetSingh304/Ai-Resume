import { SignedIn, SignedOut, UserButton, SignOutButton } from "@clerk/clerk-react";
import { NavLink, useNavigate } from "react-router-dom";

const navItems = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Review Resume", to: "/review" },
    { label: "Generate Resume", to: "/generate" },
    { label: "History", to: "/history" },
];

export default function AppNavbar() {
    const navigate = useNavigate();

    return (
        <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center gap-2 focus:outline-none"
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-sm">
                        <span className="text-xl font-bold leading-none text-white">R</span>
                    </div>
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-xl font-bold text-transparent">
                        Resume AI
                    </span>
                </button>

                <nav className="hidden md:flex items-center gap-6">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `text-sm font-medium transition-colors ${
                                    isActive ? "text-blue-600" : "text-slate-600 hover:text-slate-900"
                                }`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    <SignedOut>
                        {/* Should almost never show because app routes are protected, but keep graceful fallback */}
                        <button
                            onClick={() => navigate("/")}
                            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
                        >
                            Back to Landing
                        </button>
                    </SignedOut>
                    <SignedIn>
                        <SignOutButton>
                            <button className="hidden sm:inline-flex items-center rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
                                Sign out
                            </button>
                        </SignOutButton>
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "w-9 h-9 border border-slate-200 shadow-sm",
                                },
                            }}
                        />
                    </SignedIn>
                </div>
            </div>
        </header>
    );
}

