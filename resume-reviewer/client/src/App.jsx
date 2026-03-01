import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { Toaster } from '@/components/ui/sonner';
import ResumeUploader from './components/ResumeUploader';
import ResultsDashboard from './components/ResultsDashboard';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import './App.css';

function Home() {
  const [analysisResult, setAnalysisResult] = useState(null);

  const resetAnalysis = () => {
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b px-8 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl leading-none">R</span>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Resume AI
          </h1>
        </div>
        <div>
          <SignedOut>
            <div className="space-x-3">
              <SignInButton mode="modal">
                <button className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-all hover:shadow">Sign Up Free</button>
              </SignUpButton>
            </div>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-10 h-10" } }} />
          </SignedIn>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center pt-10 px-4 pb-20 overflow-x-hidden">
        <SignedOut>
          <div className="text-center max-w-3xl mt-10">
            <h2 className="text-5xl font-extrabold mb-6 tracking-tight text-gray-900">
              Land your dream job with <span className="text-blue-600">AI-powered feedback</span>
            </h2>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Upload your resume and get instant, actionable feedback based on advanced ATS algorithms and expert recruiter insights.
            </p>
            <SignUpButton mode="modal">
              <button className="px-8 py-4 text-lg bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                Analyze My Resume Now
              </button>
            </SignUpButton>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="w-full text-center">
            {!analysisResult ? (
              <div className="max-w-4xl mx-auto mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">Upload Your Resume</h2>
                <p className="text-gray-600 mb-8">Get deep insights and a complete breakdown of how to improve your chances.</p>
                <ResumeUploader onUploadSuccess={setAnalysisResult} />
              </div>
            ) : (
              <div className="w-full">
                <div className="max-w-5xl mx-auto flex justify-start mb-4">
                  <Button variant="ghost" onClick={resetAnalysis} className="text-muted-foreground hover:text-foreground">
                    <ChevronLeft className="w-4 h-4 mr-2" /> Back to Upload
                  </Button>
                </div>
                <ResultsDashboard analysis={analysisResult} />
              </div>
            )}
          </div>
        </SignedIn>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
