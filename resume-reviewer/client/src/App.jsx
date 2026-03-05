import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { Toaster } from '@/components/ui/sonner';

// Layout & Shared
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/shared/ProtectedRoute';

// Pages
import Home from './pages/Home';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import GeneratorPage from './pages/GeneratorPage';
import ReviewerPage from './pages/ReviewerPage';
import ReviewResultsPage from './pages/ReviewResultsPage';
import HistoryPage from './pages/HistoryPage';
import PricingPage from './pages/PricingPage';

// Ensure this key is in your client/.env file
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Router>
        <Toaster />
        <Routes>
          {/* Public marketing pages */}
          <Route path="/" element={<Home />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/pricing" element={<PricingPage />} />

          {/* Authenticated Application Routes wrapped in AppLayout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />

              <Route path="/review" element={<ReviewerPage />} />
              <Route path="/review/results" element={<ReviewResultsPage />} />

              {/* Existing Generator Page mapped to new layout */}
              <Route path="/generate" element={<GeneratorPage />} />

              <Route path="/history" element={<HistoryPage />} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ClerkProvider>
  );
}

export default App;
