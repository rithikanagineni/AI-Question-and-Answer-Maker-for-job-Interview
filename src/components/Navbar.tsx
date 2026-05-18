import React, { useState } from 'react';
import { Bot, Sparkles, Bookmark, Info, Volume2, VolumeX, Menu, X, MessageCircle, LogOut, UserCircle } from 'lucide-react';
import type { AppUser } from './AuthPage';

interface NavbarProps {
  activeTab: 'studio' | 'saved' | 'about' | 'assistant';
  setActiveTab: (tab: 'studio' | 'saved' | 'about' | 'assistant') => void;
  audioSpeechEnabled: boolean;
  setAudioSpeechEnabled: (val: boolean) => void;
  currentUser: AppUser;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, audioSpeechEnabled, setAudioSpeechEnabled, currentUser, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { id: 'about', label: 'About', icon: <Info className="w-4 h-4" />, badge: false },
    { id: 'studio', label: 'AI Prep Studio', icon: <Sparkles className="w-4 h-4" />, badge: false },
    { id: 'assistant', label: 'AI Assistant', icon: <MessageCircle className="w-4 h-4" />, badge: true },
    { id: 'saved', label: 'Saved Kits', icon: <Bookmark className="w-4 h-4" />, badge: false },
  ] as const;

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Hamburger + Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all border border-slate-200 shadow-sm"
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setActiveTab('studio'); setMenuOpen(false); }}>
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                <Bot className="w-6 h-6 text-white animate-pulse" />
                <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-900 to-purple-900 bg-clip-text text-transparent">
                    AIPrep Pro
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200">v2.5</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">AI Interview & Career Prep</p>
              </div>
            </div>
          </div>

          {/* Right: Current Tab Indicator + Voice Toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-bold text-slate-700">
              <UserCircle className="w-4 h-4 text-indigo-600" />
              <span className="max-w-[120px] truncate">{currentUser.name}</span>
            </div>
            <span className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600">
              {navItems.find(n => n.id === activeTab)?.icon}
              {navItems.find(n => n.id === activeTab)?.label}
            </span>
            <button
              onClick={() => setAudioSpeechEnabled(!audioSpeechEnabled)}
              className={`p-2.5 rounded-xl border transition-all shadow-sm ${
                audioSpeechEnabled ? 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100' : 'bg-slate-100 text-slate-400 border-slate-200 hover:text-slate-600'
              }`}
            >
              {audioSpeechEnabled ? <Volume2 className="w-4 h-4 animate-bounce" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Left Slide-in Menu */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-slate-200 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Menu Header */}
          <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-extrabold text-base text-slate-900">AIPrep Pro</h2>
                <p className="text-[10px] text-slate-500 font-medium">Navigation</p>
              </div>
            </div>
            <button onClick={() => setMenuOpen(false)} className="p-2 rounded-xl bg-white text-slate-500 hover:text-slate-900 border border-slate-200 hover:bg-slate-100 transition-all shadow-sm">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 p-5 space-y-2 overflow-y-auto">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id as any); setMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                    : 'bg-slate-50 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200'
                }`}
              >
                <span className={activeTab === item.id ? 'text-white' : 'text-indigo-500'}>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto flex items-center gap-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                    </span>
                    <span className="text-[10px] font-extrabold text-purple-500">NEW</span>
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-2">
            <div className="p-3 rounded-2xl bg-white border border-slate-200 text-xs shadow-sm">
              <div className="font-black text-slate-900 truncate">{currentUser.name}</div>
              <div className="text-slate-500 font-medium truncate">{currentUser.email}</div>
            </div>
            <button
              onClick={() => setAudioSpeechEnabled(!audioSpeechEnabled)}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all font-bold text-xs ${
                audioSpeechEnabled ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-slate-500 border-slate-200'
              }`}
            >
              {audioSpeechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{audioSpeechEnabled ? 'Voice Assistant: ON' : 'Voice Assistant: OFF'}</span>
            </button>
            <button
              onClick={() => { onLogout(); setMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-all font-bold text-xs"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
            <p className="text-[10px] text-slate-400 font-medium text-center">AIPrep Pro v2.5 • AI Powered</p>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40" onClick={() => setMenuOpen(false)}></div>
      )}
    </>
  );
};
