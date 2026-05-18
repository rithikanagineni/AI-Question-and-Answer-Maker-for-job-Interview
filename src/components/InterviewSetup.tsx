import React, { useState } from 'react';
import { Sliders, BarChart3, Users, ArrowRight, UserCheck, ArrowLeft } from 'lucide-react';
import { COMPANY_PROFILES } from '../data/companyProfiles';

export interface InterviewConfig {
  interviewType: 'mixed' | 'technical' | 'hr';
  numQuestions: number;
  difficulty: 'intern' | 'intermediate' | 'senior';
  selectedCompanyId: string;
}

interface Props {
  config: InterviewConfig;
  setConfig: React.Dispatch<React.SetStateAction<InterviewConfig>>;
  onStart: () => void;
  roleName: string;
  totalGeneratedQuestions: number;
}

export const InterviewSetup: React.FC<Props> = ({ config, setConfig, onStart, roleName, totalGeneratedQuestions }) => {
  // Step 1: 'select_company', Step 2: 'configure_interview'
  const [step, setStep] = useState<'select_company' | 'configure_interview'>('select_company');

  const maxQuestions = Math.min(12, Math.max(totalGeneratedQuestions, 10));
  const selectedCompany = COMPANY_PROFILES.find(c => c.id === config.selectedCompanyId) || COMPANY_PROFILES[0];

  const handleSelectCompany = (companyId: string) => {
    setConfig(prev => ({ ...prev, selectedCompanyId: companyId }));
    setStep('configure_interview');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xl p-4 sm:p-6 overflow-y-auto animate-fade-in text-slate-800">
      <div className="w-full max-w-4xl bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl relative my-auto">
        
        {/* Header */}
        <div className="text-center space-y-3 border-b border-slate-100 pb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold uppercase tracking-wider shadow-sm">
            <UserCheck className="w-4 h-4 text-indigo-600" />
            <span>Live Interview Session</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {step === 'select_company' ? 'Select Target Company' : 'Interview Setup'}
          </h1>
          <p className="text-sm text-slate-600 font-medium max-w-xl mx-auto">
            {step === 'select_company' 
              ? `Choose the company whose interview style and expectations you want to practice for ${roleName}.`
              : `Configure your practice session parameters for ${selectedCompany.name}.`}
          </p>
        </div>

        {/* STEP 1: COMPANY SELECTION GRID (COLUMN-WISE) */}
        {step === 'select_company' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto p-1 custom-scrollbar">
              {COMPANY_PROFILES.map(company => {
                const isSelected = config.selectedCompanyId === company.id;
                const initials = company.name.split(' ').map(w => w[0]).join('').slice(0, 2);

                return (
                  <button
                    key={company.id}
                    onClick={() => handleSelectCompany(company.id)}
                    className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-4 group ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-200 text-white'
                        : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm border ${
                        isSelected ? 'bg-white border-indigo-500' : 'bg-slate-50 border-slate-100'
                      }`}>
                        {company.logoUrl ? (
                          <img
                            src={company.logoUrl}
                            alt={`${company.name} logo`}
                            className="w-8 h-8 object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              const parent = (e.target as HTMLImageElement).parentElement;
                              if (parent) parent.innerHTML = `<span class="text-xs font-black ${isSelected ? 'text-indigo-600' : 'text-slate-700'}">${initials}</span>`;
                            }}
                          />
                        ) : (
                          <span className={`text-xs font-black ${isSelected ? 'text-indigo-600' : 'text-slate-700'}`}>JD</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className={`text-base font-extrabold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                          {company.name}
                        </div>
                        <div className={`text-xs truncate font-medium ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                          {company.domain}
                        </div>
                      </div>
                    </div>

                    <p className={`text-xs font-medium line-clamp-2 ${isSelected ? 'text-indigo-100' : 'text-slate-600'}`}>
                      {company.tagline}
                    </p>

                    <div className={`w-full pt-3 border-t text-xs font-bold flex items-center justify-between ${
                      isSelected ? 'border-indigo-500 text-white' : 'border-slate-100 text-indigo-600 group-hover:text-indigo-700'
                    }`}>
                      <span>Select Company</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: INTERVIEW CONFIGURATION FOR SELECTED COMPANY */}
        {step === 'configure_interview' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Top Bar: Back button & Selected Company Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-indigo-50 border border-indigo-100 shadow-inner">
              <div>
                <span className="text-sm font-black text-indigo-950 block">Selected: {selectedCompany.name}</span>
                <p className="text-xs text-slate-700 mt-0.5 font-medium italic">
                  Questions will focus on {selectedCompany.questionFocus.join(', ')}.
                </p>
              </div>

              <button
                onClick={() => setStep('select_company')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-100/50 transition-all text-xs font-bold shadow-sm flex-shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Company</span>
              </button>
            </div>

            {/* Interview Type */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                <span>Interview Type</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { value: 'mixed', label: 'Mixed HR + Technical', icon: '🔄' },
                  { value: 'technical', label: 'Technical Only', icon: '💻' },
                  { value: 'hr', label: 'HR / Behavioral', icon: '🤝' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setConfig(prev => ({ ...prev, interviewType: opt.value as any }))}
                    className={`p-5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                      config.interviewType === opt.value
                        ? 'bg-indigo-50 border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                        : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm'
                    }`}
                  >
                    <div className="text-3xl">{opt.icon}</div>
                    <span className="text-xs font-black text-slate-900 block">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Questions */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <span>Number of Questions</span>
              </label>
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/60 shadow-inner">
                <input
                  type="range"
                  min={2}
                  max={maxQuestions}
                  value={config.numQuestions}
                  onChange={(e) => setConfig(prev => ({ ...prev, numQuestions: Math.min(parseInt(e.target.value), maxQuestions) }))}
                  className="flex-1 h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-indigo-600"
                />
                <span className="w-12 h-12 rounded-xl bg-indigo-600 border border-indigo-600 flex items-center justify-center font-black text-xl text-white shadow-md">
                  {config.numQuestions}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-bold px-1">
                Maximum available: {maxQuestions} questions including company-specific questions
              </p>
            </div>

            {/* Difficulty */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>Difficulty</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { value: 'intern', label: 'Intern/Fresher', icon: '🌱' },
                  { value: 'intermediate', label: 'Intermediate', icon: '⚡' },
                  { value: 'senior', label: 'Senior/Lead', icon: '👑' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setConfig(prev => ({ ...prev, difficulty: opt.value as any }))}
                    className={`p-5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                      config.difficulty === opt.value
                        ? 'bg-indigo-50 border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                        : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm'
                    }`}
                  >
                    <div className="text-3xl">{opt.icon}</div>
                    <span className="text-xs font-black text-slate-900 block">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={onStart}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white font-extrabold text-base shadow-xl shadow-indigo-500/25 hover:from-indigo-500 hover:to-purple-600 transition-all flex items-center justify-center gap-2 scale-102 mt-4"
            >
              <UserCheck className="w-5 h-5" />
              <span>Start Mock Interview with Human Interviewer</span>
              <ArrowRight className="w-5 h-5 animate-pulse" />
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
