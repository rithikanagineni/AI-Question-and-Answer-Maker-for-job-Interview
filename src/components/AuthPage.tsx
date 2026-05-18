import React, { useState } from 'react';
import { Bot, Eye, EyeOff, Lock, Mail, User, UserPlus, LogIn, Sparkles, Check, X } from 'lucide-react';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  provider: 'email' | 'google';
  avatar?: string;
  createdAt: string;
}

interface AuthPageProps {
  onAuthenticated: (user: AppUser) => void;
}

const USERS_STORAGE_KEY = 'aiprep_registered_users';

function getStoredUsers(): AppUser[] {
  try { return JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]'); }
  catch { return []; }
}
function saveStoredUsers(users: AppUser[]) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

// Realistic demo Google accounts shown in the account picker
const DEMO_GOOGLE_ACCOUNTS = [
  { name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', avatar: 'RS' },
  { name: 'Priya Patel', email: 'priya.patel.dev@gmail.com', avatar: 'PP' },
  { name: 'Alex Johnson', email: 'alex.johnson97@gmail.com', avatar: 'AJ' },
];

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthenticated }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Google sign-in modal state
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [selectedGoogleAcct, setSelectedGoogleAcct] = useState<typeof DEMO_GOOGLE_ACCOUNTS[0] | null>(null);
  const [googleCustomEmail, setGoogleCustomEmail] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const resetMessages = () => { setError(''); setSuccess(''); };

  const handleRegister = () => {
    resetMessages();
    const cleanedEmail = email.trim().toLowerCase();
    const cleanedName = name.trim();
    if (!cleanedName || !cleanedEmail || !password) { setError('Please enter name, email and password to register.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedEmail)) { setError('Please enter a valid email address.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters long.'); return; }

    const users = getStoredUsers();
    if (users.find(u => u.email.toLowerCase() === cleanedEmail)) { setError('This email is already registered. Please login instead.'); return; }

    const newUser: AppUser = { id: `user_${Date.now()}`, name: cleanedName, email: cleanedEmail, password, provider: 'email', createdAt: new Date().toISOString() };
    saveStoredUsers([newUser, ...users]);
    setSuccess('Registration successful! You can now login.');
    setMode('login');
    setPassword('');
  };

  const handleLogin = () => {
    resetMessages();
    const cleanedEmail = email.trim().toLowerCase();
    if (!cleanedEmail || !password) { setError('Please enter email and password to login.'); return; }
    const users = getStoredUsers();
    const user = users.find(u => u.email.toLowerCase() === cleanedEmail);
    if (!user) { setError('No user found, register first.'); return; }
    if (user.provider === 'email' && user.password !== password) { setError('Incorrect password. Please try again.'); return; }
    onAuthenticated(user);
  };

  // Google sign-in handlers
  const openGoogleModal = () => {
    resetMessages();
    setSelectedGoogleAcct(null);
    setGoogleCustomEmail('');
    setShowCustomInput(false);
    setShowGoogleModal(true);
  };

  const handleGoogleAccountSelect = (acct: typeof DEMO_GOOGLE_ACCOUNTS[0]) => {
    setSelectedGoogleAcct(acct);
    setShowCustomInput(false);
  };

  const handleGoogleConfirm = () => {
    const targetEmail = selectedGoogleAcct?.email || googleCustomEmail.trim();
    const targetName = selectedGoogleAcct?.name || googleCustomEmail.split('@')[0]?.replace(/[._-]/g, ' ') || 'Google User';

    if (!targetEmail) { setError('Please select or enter an email.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(targetEmail)) { setError('Please enter a valid email address.'); return; }

    const users = getStoredUsers();
    let existing = users.find(u => u.email.toLowerCase() === targetEmail.toLowerCase());
    if (existing) { onAuthenticated(existing); setShowGoogleModal(false); return; }

    const googleUser: AppUser = {
      id: `google_${Date.now()}`,
      name: targetName.replace(/\b\w/g, c => c.toUpperCase()),
      email: targetEmail.toLowerCase(),
      provider: 'google',
      createdAt: new Date().toISOString()
    };
    saveStoredUsers([googleUser, ...users]);
    onAuthenticated(googleUser);
    setShowGoogleModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/70 to-purple-50/70 flex items-center justify-center p-4 text-slate-800">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Brand Panel */}
        <div className="hidden lg:block space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-indigo-100 text-indigo-700 text-xs font-black uppercase tracking-wider shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span>AI Interview Preparation System</span>
          </div>
          <h1 className="text-5xl font-black text-slate-950 leading-tight">Prepare smarter for every interview.</h1>
          <p className="text-slate-600 text-base leading-relaxed font-medium max-w-md">
            Upload your resume, match it with the job description, practice with a human-style interviewer, and get clear scorecards before the real interview.
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            {['Resume + JD Matching', 'Human Interviewer', 'Company Questions', 'AI Scorecard'].map(item => (
              <div key={item} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm text-xs font-bold text-slate-700">{item}</div>
            ))}
          </div>
        </div>

        {/* Right Auth Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/25">
              <Bot className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-950">{mode === 'login' ? 'Welcome Back' : 'Create Your Account'}</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {mode === 'login' ? 'Sign in to continue your interview preparation.' : 'Register to save your interview kits and scorecards.'}
              </p>
            </div>
          </div>

          {/* Login/Register Toggle */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl">
            <button onClick={() => { setMode('login'); resetMessages(); }}
              className={`py-2.5 rounded-xl text-xs font-black transition-all ${mode === 'login' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500'}`}>Login</button>
            <button onClick={() => { setMode('register'); resetMessages(); }}
              className={`py-2.5 rounded-xl text-xs font-black transition-all ${mode === 'register' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500'}`}>Register</button>
          </div>

          {error && <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">{error}</div>}
          {success && <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">{success}</div>}

          {/* Email/Password Fields */}
          <div className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-500">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-11 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button onClick={mode === 'login' ? handleLogin : handleRegister}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-black text-sm shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-purple-600 transition-all flex items-center justify-center gap-2">
              {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
            </button>
          </div>

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
            <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-slate-400 font-bold">or</span></div>
          </div>

          {/* Continue with Google Button */}
          <button onClick={openGoogleModal}
            className="w-full py-3.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-black text-sm shadow-sm hover:bg-slate-50 hover:border-slate-400 transition-all flex items-center justify-center gap-3 group">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            <span>Continue with Google</span>
          </button>

          <p className="text-[10px] text-slate-400 font-medium text-center">
            By continuing, you agree to AIPrep Pro's terms and privacy policy.
          </p>
        </div>
      </div>

      {/* ====== GOOGLE ACCOUNT PICKER MODAL (REALISTIC) ====== */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Google Header */}
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Sign in with Google</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Choose an account to continue to AIPrep Pro</p>
                </div>
              </div>
              <button onClick={() => setShowGoogleModal(false)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Account List */}
            <div className="px-4 py-3 space-y-1 max-h-[340px] overflow-y-auto">
              {DEMO_GOOGLE_ACCOUNTS.map((acct, i) => (
                <button
                  key={i}
                  onClick={() => handleGoogleAccountSelect(acct)}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all border-2 ${
                    selectedGoogleAcct?.email === acct.email
                      ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                      : 'border-transparent hover:bg-slate-50 hover:border-slate-200'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm text-white shadow-sm ${
                    i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-emerald-500' : 'bg-purple-500'
                  }`}>{acct.avatar}</div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="text-sm font-bold text-slate-900 truncate">{acct.name}</div>
                    <div className="text-xs text-slate-500 font-medium truncate">{acct.email}</div>
                  </div>
                  {selectedGoogleAcct?.email === acct.email && (
                    <Check className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                  )}
                </button>
              ))}

              {/* Use Another Account */}
              <button
                onClick={() => { setShowCustomInput(!showCustomInput); setSelectedGoogleAcct(null); }}
                className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all border-2 ${
                  showCustomInput ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-transparent hover:bg-slate-50 hover:border-slate-200'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-black text-sm shadow-sm">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-slate-900">Use another account</div>
                  <div className="text-xs text-slate-500 font-medium">Enter your Google email manually</div>
                </div>
                {showCustomInput && <Check className="w-5 h-5 text-indigo-600 flex-shrink-0" />}
              </button>

              {showCustomInput && (
                <div className="px-1 pt-3 space-y-2 animate-fade-in">
                  <input
                    value={googleCustomEmail}
                    onChange={e => setGoogleCustomEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <p className="text-[10px] text-slate-400 font-medium max-w-[200px] leading-tight">
                AIPrep Pro will receive your name, email and profile picture.
              </p>
              <button
                onClick={handleGoogleConfirm}
                disabled={!selectedGoogleAcct && !googleCustomEmail.trim()}
                className="px-6 py-2.5 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
