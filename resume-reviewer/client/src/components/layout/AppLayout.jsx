import { Outlet } from "react-router-dom";
import ErrorBoundary from "../shared/ErrorBoundary";
import AppNavbar from "./AppNavbar";

export default function AppLayout() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100 font-sans text-slate-900">
            <AppNavbar />
            <main className="py-8">
                <ErrorBoundary>
                    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                        <div className="rounded-3xl bg-white/80 shadow-sm border border-slate-100/80 backdrop-blur p-6 sm:p-8">
                            <Outlet />
                        </div>
                    </div>
                </ErrorBoundary>
            </main>
        </div>
    );
}
