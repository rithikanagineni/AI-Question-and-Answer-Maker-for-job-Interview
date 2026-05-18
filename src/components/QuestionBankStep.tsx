import React, { useState } from 'react';
import { CandidateProfile, JobDescriptionData, GeneratedQuestion, PrepKit } from '../data/samplePresets';
import { Sparkles, Volume2, VolumeX, Lightbulb, Target, Bookmark, CheckCircle2, ChevronDown, ChevronUp, ArrowLeft, RefreshCw, MessageSquare, Video } from 'lucide-react';

interface Props {
  profile: CandidateProfile;
  jd: JobDescriptionData;
  questions: GeneratedQuestion[];
  onRegenerate: () => void;
  onGoToPractice: () => void;
  onGoToMockInterview: () => void;
  onSaveKit: (kit: PrepKit) => void;
  onBack: () => void;
}

export const QuestionBankStep: React.FC<Props> = ({
  profile,
  jd,
  questions,
  onRegenerate,
  onGoToPractice,
  onGoToMockInterview,
  onSaveKit,
  onBack
}) => {
  const [filterCat, setFilterCat] = useState<'all' | 'technical' | 'hr' | 'role_based'>('all');
  const [openStarId, setOpenStarId] = useState<string | null>(null);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
  const [savedStatus, setSavedStatus] = useState(false);

  const filteredQuestions = filterCat === 'all' ? questions : questions.filter(q => q.category === filterCat);

  const handleSpeak = (text: string, id: string) => {
    if (!('speechSynthesis' in window)) {
      alert("Text to speech is not supported in this browser.");
      return;
    }

    if (currentlySpeakingId === id) {
      window.speechSynthesis.cancel();
      setCurrentlySpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    utterance.onend = () => setCurrentlySpeakingId(null);
    utterance.onerror = () => setCurrentlySpeakingId(null);

    setCurrentlySpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleSave = () => {
    const newKit: PrepKit = {
      id: `kit_${Date.now()}`,
      createdAt: new Date().toISOString(),
      title: `${jd.companyName} - ${jd.jobTitle} Prep Kit`,
      candidateProfile: profile,
      jobDescription: jd,
      questions: questions,
      overallScore: questions.some(q => q.feedback) ? Math.round(questions.reduce((acc, q) => acc + (q.feedback?.score || 0), 0) / questions.length) : undefined
    };
    onSaveKit(newKit);
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 animate-fade-in text-slate-800">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Step 4: AI Question & Answer Maker</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Personalized Q&A Bank
            </h1>
            <p className="text-slate-600 text-sm max-w-2xl leading-relaxed font-medium">
              Synthesized from <span className="text-slate-900 font-extrabold">"{profile.name}"</span> and the <span className="text-indigo-600 font-extrabold">{jd.companyName}</span> job description.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onBack}
              className="px-4 py-3 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-all text-xs font-extrabold flex items-center gap-1.5 shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              onClick={onRegenerate}
              className="px-4 py-3 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-all text-xs font-extrabold flex items-center gap-1.5 shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
              <span>Regenerate Answers</span>
            </button>

            <button
              onClick={handleSave}
              className={`px-5 py-3 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shadow-md ${
                savedStatus
                  ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'
              }`}
            >
              {savedStatus ? <CheckCircle2 className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              <span>{savedStatus ? "Kit Saved to History!" : "Save Prep Kit"}</span>
            </button>

            <button
              onClick={onGoToPractice}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-xs transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-purple-500 scale-105"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Practice Section (Untimed)</span>
            </button>
          </div>
        </div>

        {/* Quick Summary Pillbox */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-200">
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center gap-3.5 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-md">
              {questions.filter(q => q.category === 'technical').length}
            </div>
            <div>
              <p className="text-xs text-indigo-700 uppercase font-bold tracking-wider">Technical Questions</p>
              <p className="text-xs text-slate-900 font-extrabold truncate">Architecture & Projects</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center gap-3.5 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black shadow-md">
              {questions.filter(q => q.category === 'role_based').length}
            </div>
            <div>
              <p className="text-xs text-purple-700 uppercase font-bold tracking-wider">Role Alignment</p>
              <p className="text-xs text-slate-900 font-extrabold truncate">Resume + JD Mapping</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-3.5 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-md">
              {questions.filter(q => q.category === 'hr').length}
            </div>
            <div>
              <p className="text-xs text-emerald-700 uppercase font-bold tracking-wider">HR & Behavioral</p>
              <p className="text-xs text-slate-900 font-extrabold truncate">Culture & Deadlines</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-4 overflow-x-auto">
        <button
          onClick={() => setFilterCat('all')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
            filterCat === 'all'
              ? 'bg-slate-900 text-white font-extrabold'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          All Questions ({questions.length})
        </button>
        <button
          onClick={() => setFilterCat('technical')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 shadow-sm ${
            filterCat === 'technical'
              ? 'bg-indigo-600 text-white font-extrabold shadow-md shadow-indigo-500/20'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
          <span>Technical ({questions.filter(q => q.category === 'technical').length})</span>
        </button>
        <button
          onClick={() => setFilterCat('role_based')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 shadow-sm ${
            filterCat === 'role_based'
              ? 'bg-purple-600 text-white font-extrabold shadow-md shadow-purple-500/20'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
          <span>Role Matching ({questions.filter(q => q.category === 'role_based').length})</span>
        </button>
        <button
          onClick={() => setFilterCat('hr')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 shadow-sm ${
            filterCat === 'hr'
              ? 'bg-emerald-600 text-white font-extrabold shadow-md shadow-emerald-500/20'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <span>HR / Behavioral ({questions.filter(q => q.category === 'hr').length})</span>
        </button>
      </div>

      {/* Questions Grid */}
      <div className="space-y-6">
        {filteredQuestions.map((q, index) => {
          const isStarOpen = openStarId === q.id;
          const isSpeaking = currentlySpeakingId === q.id;

          let badgeColor = "bg-indigo-50 text-indigo-700 border-indigo-200";
          let badgeText = "Technical Question";
          if (q.category === 'role_based') {
            badgeColor = "bg-purple-50 text-purple-700 border-purple-200";
            badgeText = "Role Alignment";
          } else if (q.category === 'hr') {
            badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
            badgeText = "HR / Behavioral";
          }

          return (
            <div
              key={q.id}
              className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden group hover:border-indigo-300 transition-all"
            >
              {/* Card top bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-slate-900 text-white font-black text-sm flex items-center justify-center flex-shrink-0 shadow-md">
                    Q{index + 1}
                  </span>
                  <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${badgeColor}`}>
                    {badgeText}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSpeak(q.personalizedAnswer, q.id)}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${
                      isSpeaking
                        ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse font-black'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4 text-indigo-600" />}
                    <span>{isSpeaking ? "Stop Voice" : "Listen to AI Answer"}</span>
                  </button>

                  <button
                    onClick={onGoToPractice}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition-all"
                  >
                    <MessageSquare className="w-4 h-4 fill-current" />
                    <span>Practice This</span>
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {q.question}
                </h3>
                <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 text-xs text-slate-700 shadow-sm font-medium">
                  <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-amber-900 uppercase tracking-wider text-[11px] block mb-0.5">Why Interviewers Ask This: </span>
                    <span className="leading-relaxed">{q.whyAsked}</span>
                  </div>
                </div>
              </div>

              {/* Personalized Answer Box */}
              <div className="bg-indigo-50/50 border border-indigo-200/80 rounded-2xl p-6 space-y-4 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>
                
                <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                  <span className="text-xs font-black text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Personalized AI Answer Suggestion</span>
                  </span>
                  <span className="text-[11px] text-indigo-700 font-bold bg-white/80 py-0.5 px-2 rounded-lg border border-indigo-100 shadow-sm">Tailored to your resume</span>
                </div>

                <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-semibold italic">
                  "{q.personalizedAnswer}"
                </p>

                {/* Expert Tips */}
                {q.tips && q.tips.length > 0 && (
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Key Tips:</span>
                    {q.tips.map((tip, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 font-bold shadow-sm">
                        💡 {tip}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* STAR Method Dropdown */}
              {q.starBreakdown && (
                <div className="space-y-2">
                  <button
                    onClick={() => setOpenStarId(isStarOpen ? null : q.id)}
                    className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left flex items-center justify-between text-xs font-extrabold text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 transition-all shadow-sm"
                  >
                    <span className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-purple-600" />
                      <span>View STAR Method Breakdown (Situation, Task, Action, Result)</span>
                    </span>
                    {isStarOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isStarOpen && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 border border-purple-200 text-xs shadow-inner animate-fade-in">
                      <div className="space-y-1 p-3.5 rounded-xl bg-white border border-purple-100 shadow-sm">
                        <span className="font-extrabold text-purple-700 block uppercase tracking-wider text-[11px] mb-1">Situation</span>
                        <p className="text-slate-700 font-medium leading-relaxed">{q.starBreakdown.situation}</p>
                      </div>
                      <div className="space-y-1 p-3.5 rounded-xl bg-white border border-blue-100 shadow-sm">
                        <span className="font-extrabold text-blue-700 block uppercase tracking-wider text-[11px] mb-1">Task</span>
                        <p className="text-slate-700 font-medium leading-relaxed">{q.starBreakdown.task}</p>
                      </div>
                      <div className="space-y-1 p-3.5 rounded-xl bg-white border border-amber-100 shadow-sm">
                        <span className="font-extrabold text-amber-700 block uppercase tracking-wider text-[11px] mb-1">Action</span>
                        <p className="text-slate-700 font-medium leading-relaxed">{q.starBreakdown.action}</p>
                      </div>
                      <div className="space-y-1 p-3.5 rounded-xl bg-white border border-emerald-100 shadow-sm">
                        <span className="font-extrabold text-emerald-700 block uppercase tracking-wider text-[11px] mb-1">Result</span>
                        <p className="text-slate-700 font-medium leading-relaxed">{q.starBreakdown.result}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Bottom Practice Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-purple-950 border border-indigo-500/30 p-8 sm:p-12 text-center space-y-6 shadow-2xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Ready for the 1-on-1 AI Mock Interview Simulator?
        </h2>
        <p className="text-slate-300 max-w-2xl mx-auto text-sm leading-relaxed">
          Configure your interview type, difficulty, and question count, then open your webcam and microphone to answer questions sequentially with our AI Mock Interview Bot.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={onGoToPractice}
            className="px-8 py-4 rounded-xl bg-white text-slate-900 font-extrabold text-sm shadow-xl hover:bg-slate-100 transition-all scale-102 inline-flex items-center gap-2"
          >
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            <span>Practice Section (Untimed)</span>
          </button>
          
          <button
            onClick={onGoToMockInterview}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/30 hover:from-emerald-400 hover:to-teal-400 transition-all scale-105 inline-flex items-center gap-2"
          >
            <Video className="w-5 h-5 fill-current" />
            <span>Start 1-on-1 Mock Interview</span>
          </button>
        </div>
      </div>

    </div>
  );
};
