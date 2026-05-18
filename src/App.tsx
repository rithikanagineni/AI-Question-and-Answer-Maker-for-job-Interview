import { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { ExplanationReviewer } from './components/ExplanationReviewer';
import { ResumeUploadStep } from './components/ResumeUploadStep';
import { JDUploadStep } from './components/JDUploadStep';
import { MatchInsights } from './components/MatchInsights';
import { QuestionBankStep } from './components/QuestionBankStep';
import { PracticeSection } from './components/PracticeSection';
import { InterviewSetup, InterviewConfig } from './components/InterviewSetup';
import { MockPracticeModal } from './components/MockPracticeModal';
import { FeedbackReport } from './components/FeedbackReport';
import { SavedKits } from './components/SavedKits';
import { AIAssistant } from './components/AIAssistant';
import { AppUser, AuthPage } from './components/AuthPage';
import { generateCompanySpecificQuestions, getCompanyById } from './data/companyProfiles';
import { CandidateProfile, JobDescriptionData, GeneratedQuestion, PrepKit } from './data/samplePresets';
import { generateAIQuestions } from './utils/aiGenerator';
import { computeMatchInsights } from './utils/matchInsights';
import { Bot, ShieldCheck, Video } from 'lucide-react';

const EMPTY_PROFILE: CandidateProfile = { name: '', targetRole: '', skills: [], projects: [], experience: '', education: '', strengths: [] };
const EMPTY_JD: JobDescriptionData = { jobTitle: '', companyName: '', description: '', requiredSkills: [], responsibilities: [], expectedExperience: '' };

type ActiveTab = 'studio' | 'saved' | 'about' | 'assistant';

// ─── Per-user localStorage helpers ───
function getUserStorageKey(userId: string, key: string) {
  return `aiprep_user_${userId}_${key}`;
}

function loadUserData<T>(userId: string, key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(getUserStorageKey(userId, key));
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveUserData(userId: string, key: string, data: any) {
  try {
    localStorage.setItem(getUserStorageKey(userId, key), JSON.stringify(data));
  } catch { /* quota exceeded — silently skip */ }
}

export default function App() {
  // ─── Auth state ───
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    try {
      return JSON.parse(localStorage.getItem('aiprep_current_user') || 'null');
    } catch {
      return null;
    }
  });

  const uid = currentUser?.id || '';

  // ─── App state (loaded from user storage on mount) ───
  const [activeTab, setActiveTab] = useState<ActiveTab>('about');
  const [studioStep, setStudioStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  const [profile, setProfile] = useState<CandidateProfile>(() => loadUserData(uid, 'profile', EMPTY_PROFILE));
  const [jd, setJd] = useState<JobDescriptionData>(() => loadUserData(uid, 'jd', EMPTY_JD));
  const [questions, setQuestions] = useState<GeneratedQuestion[]>(() => loadUserData(uid, 'questions', []));
  const [savedKits, setSavedKits] = useState<PrepKit[]>(() => loadUserData(uid, 'savedKits', []));
  const [audioSpeechEnabled, setAudioSpeechEnabled] = useState<boolean>(true);

  const matchInsights = profile?.name ? computeMatchInsights(profile, jd) : null;

  const [practiceOpen, setPracticeOpen] = useState(false);
  const [practiceInitialIndex, setPracticeInitialIndex] = useState(0);
  const [showSetup, setShowSetup] = useState(false);

  const [interviewConfig, setInterviewConfig] = useState<InterviewConfig>({
    interviewType: 'mixed',
    numQuestions: 5,
    difficulty: 'intern',
    selectedCompanyId: 'custom'
  });

  // ─── Auto-save user data whenever core state changes ───
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (!uid) return;
    // skip the very first render (already loaded from storage)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    saveUserData(uid, 'profile', profile);
    saveUserData(uid, 'jd', jd);
    saveUserData(uid, 'questions', questions);
    saveUserData(uid, 'savedKits', savedKits);
  }, [uid, profile, jd, questions, savedKits]);

  // ─── Auth handlers ───
  const handleAuthenticated = (user: AppUser) => {
    localStorage.setItem('aiprep_current_user', JSON.stringify(user));

    // Restore this user's saved data from localStorage
    const restoredProfile = loadUserData(user.id, 'profile', EMPTY_PROFILE);
    const restoredJd = loadUserData(user.id, 'jd', EMPTY_JD);
    const restoredQuestions = loadUserData(user.id, 'questions', []);
    const restoredKits = loadUserData(user.id, 'savedKits', []);

    setCurrentUser(user);
    setProfile(restoredProfile);
    setJd(restoredJd);
    setQuestions(restoredQuestions);
    setSavedKits(restoredKits);
    setActiveTab('about');
    setStudioStep(1);
    isFirstRender.current = true; // skip the first auto-save after restore
  };

  const handleLogout = () => {
    // Save final state before clearing
    if (uid) {
      saveUserData(uid, 'profile', profile);
      saveUserData(uid, 'jd', jd);
      saveUserData(uid, 'questions', questions);
      saveUserData(uid, 'savedKits', savedKits);
    }
    localStorage.removeItem('aiprep_current_user');
    setCurrentUser(null);
    setActiveTab('about');
  };

  // ─── Business logic ───
  const handleRegenerateQuestions = () => {
    if (!profile.name) return;
    const generated = generateAIQuestions(profile, jd);
    setQuestions(generated);
  };

  const handleSaveKit = (newKit: PrepKit) => {
    setSavedKits(prev => [newKit, ...prev.filter(k => k.id !== newKit.id)]);
  };

  const handleDeleteKit = (id: string) => {
    setSavedKits(prev => prev.filter(k => k.id !== id));
  };

  const handleLoadSavedKit = (kit: PrepKit) => {
    setProfile(kit.candidateProfile);
    setJd(kit.jobDescription);
    setQuestions(kit.questions);
    setActiveTab('studio');
    setStudioStep(kit.overallScore !== undefined ? 6 : 4);
  };

  const getFilteredAndSlicedQuestions = (): GeneratedQuestion[] => {
    const selectedCompany = getCompanyById(interviewConfig.selectedCompanyId);
    const companySpecificQuestions = generateCompanySpecificQuestions(profile, jd, selectedCompany);
    const combinedQuestions = selectedCompany.id === 'custom'
      ? [...questions]
      : [...companySpecificQuestions, ...questions.filter(q => !companySpecificQuestions.some(cq => cq.question === q.question))];

    let pool: GeneratedQuestion[];
    if (interviewConfig.interviewType === 'technical') {
      pool = combinedQuestions.filter(q => q.category === 'technical');
    } else if (interviewConfig.interviewType === 'hr') {
      pool = combinedQuestions.filter(q => q.category === 'hr' || q.category === 'role_based');
    } else {
      const technical = combinedQuestions.filter(q => q.category === 'technical');
      const hr = combinedQuestions.filter(q => q.category === 'hr');
      const role = combinedQuestions.filter(q => q.category === 'role_based');
      pool = [];
      const maxLen = Math.max(technical.length, hr.length, role.length);
      for (let i = 0; i < maxLen; i++) {
        if (technical[i]) pool.push(technical[i]);
        if (hr[i]) pool.push(hr[i]);
        if (role[i]) pool.push(role[i]);
      }
    }

    if (pool.length < interviewConfig.numQuestions && combinedQuestions.length >= interviewConfig.numQuestions) {
      const remaining = combinedQuestions.filter(q => !pool.find(p => p.id === q.id));
      pool = [...pool, ...remaining];
    }

    return pool.slice(0, interviewConfig.numQuestions);
  };

  const hasProfile = !!profile.name;

  // ─── Render ───
  if (!currentUser) {
    return <AuthPage onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-indigo-50/60 to-purple-50/60 text-slate-800 selection:bg-indigo-500 selection:text-white">
      
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        audioSpeechEnabled={audioSpeechEnabled}
        setAudioSpeechEnabled={setAudioSpeechEnabled}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <main className="flex-1 pb-20">
        {activeTab === 'about' && (
          <ExplanationReviewer onStartDemo={() => { setActiveTab('studio'); setStudioStep(1); }} />
        )}

        {activeTab === 'assistant' && <AIAssistant />}

        {activeTab === 'saved' && (
          <SavedKits
            savedKits={savedKits}
            onLoadKit={handleLoadSavedKit}
            onDeleteKit={handleDeleteKit}
            onExploreDemo={() => { setActiveTab('studio'); setStudioStep(1); }}
          />
        )}

        {activeTab === 'studio' && (
          <div className="space-y-4">

            {/* Stepper */}
            <div className="max-w-5xl mx-auto px-4 pt-8">
              <div className="flex items-center justify-between relative bg-white p-2 sm:p-3 rounded-2xl border border-slate-200/80 shadow-sm overflow-x-auto gap-1">
                {[
                  { step: 1, label: '1. Resume' },
                  { step: 2, label: '2. JD Match' },
                  { step: 3, label: '3. Insights' },
                  { step: 4, label: '4. Q&A Bank' },
                  { step: 5, label: '5. Practice' },
                  { step: 6, label: '6. Scorecard' },
                ].map(item => (
                  <button
                    key={item.step}
                    onClick={() => { if (item.step <= studioStep) setStudioStep(item.step as any); }}
                    disabled={item.step > studioStep}
                    className={`flex-shrink-0 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all z-10 ${
                      studioStep === item.step
                        ? 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white shadow-md shadow-indigo-500/25'
                        : studioStep > item.step
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'
                        : 'bg-slate-100 text-slate-500 border border-slate-200 cursor-not-allowed'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {hasProfile && (
              <div className="max-w-5xl mx-auto px-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Active Target</span>
                      <span className="text-sm font-extrabold text-slate-900">{jd?.jobTitle || 'Role'} at <span className="text-indigo-600">{jd?.companyName || 'Company'}</span></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold hidden sm:block">
                      👤 Human Interviewer Ready
                    </span>
                    <button
                      onClick={() => setShowSetup(true)}
                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs shadow-md hover:from-emerald-500 hover:to-teal-500 transition-all flex items-center gap-1.5"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Start Mock Interview</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {studioStep === 1 && (
              <ResumeUploadStep profile={profile} setProfile={setProfile} onNext={() => setStudioStep(2)} />
            )}

            {studioStep === 2 && (
              <JDUploadStep jd={jd} setJd={setJd} candidateSkills={profile.skills} onBack={() => setStudioStep(1)} onNext={() => setStudioStep(3)} />
            )}

            {studioStep === 3 && matchInsights && hasProfile && (
              <MatchInsights insights={matchInsights} onOpenQABank={() => { handleRegenerateQuestions(); setStudioStep(4); }} onEditInputs={() => setStudioStep(2)} />
            )}

            {studioStep === 4 && hasProfile && (
              <QuestionBankStep
                profile={profile} jd={jd} questions={questions}
                onBack={() => setStudioStep(3)}
                onRegenerate={handleRegenerateQuestions}
                onSaveKit={handleSaveKit}
                onGoToPractice={() => setStudioStep(5)}
                onGoToMockInterview={() => { setPracticeInitialIndex(0); setShowSetup(true); }}
              />
            )}

            {studioStep === 5 && hasProfile && (
              <PracticeSection profile={profile} jd={jd} questions={questions} onStartMockInterview={() => { setPracticeInitialIndex(0); setShowSetup(true); }} />
            )}

            {studioStep === 6 && hasProfile && (
              <FeedbackReport
                profile={profile} jd={jd} questions={questions}
                onPracticeAgain={() => { setPracticeInitialIndex(0); setShowSetup(true); }}
                onSaveKit={handleSaveKit}
                onBackToStudio={() => setStudioStep(4)}
              />
            )}

          </div>
        )}
      </main>

      {showSetup && hasProfile && (
        <InterviewSetup
          config={interviewConfig} setConfig={setInterviewConfig}
          onStart={() => { setShowSetup(false); setPracticeOpen(true); }}
          roleName={jd.jobTitle}
          totalGeneratedQuestions={questions.length}
        />
      )}

      {practiceOpen && hasProfile && (
        <MockPracticeModal
          questions={getFilteredAndSlicedQuestions()}
          initialIndex={practiceInitialIndex}
          jdSkills={jd.requiredSkills}
          roleName={jd.jobTitle}
          interviewConfig={interviewConfig}
          onClose={() => setPracticeOpen(false)}
          onComplete={(updatedQuestions) => {
            const companyOnly = updatedQuestions.filter(u => !questions.some(q => q.id === u.id));
            setQuestions([...companyOnly, ...questions.map(q => updatedQuestions.find(u => u.id === q.id) || q)]);
            setPracticeOpen(false);
            setStudioStep(6);
          }}
        />
      )}

      <footer className="border-t border-slate-200 bg-white/80 py-6 text-center text-xs text-slate-500 space-y-1 mt-12 shadow-sm">
        <div className="flex items-center justify-center gap-2">
          <Bot className="w-4 h-4 text-indigo-600 animate-bounce" />
          <span className="font-bold text-slate-800">AIPrep Pro</span>
          <span>— AI Interview Prep & Career Assistant</span>
        </div>
        <p>© 2026 AIPrep Pro. Upload your resume, match with JD, practice & ace your interview.</p>
      </footer>
    </div>
  );
}
