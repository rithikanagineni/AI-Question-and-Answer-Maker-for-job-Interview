import React, { useState } from 'react';
import { CandidateProfile, JobDescriptionData, GeneratedQuestion, PrepKit } from '../data/samplePresets';
import { computeFeedbackMetrics } from '../utils/matchInsights';
import { Award, CheckCircle2, AlertCircle, ArrowLeft, Bookmark, Sparkles, Printer, Video, BarChart3 } from 'lucide-react';

interface Props {
  profile: CandidateProfile;
  jd: JobDescriptionData;
  questions: GeneratedQuestion[];
  onPracticeAgain: () => void;
  onSaveKit: (kit: PrepKit) => void;
  onBackToStudio: () => void;
}

export const FeedbackReport: React.FC<Props> = ({ profile, jd, questions, onPracticeAgain, onSaveKit, onBackToStudio }) => {
  const [saved, setSaved] = useState(false);

  const practicedQuestions = questions.filter(q => q.feedback);
  const totalPracticed = practicedQuestions.length;
  
  // Calculate new metrics for each practiced question
  const allMetrics = practicedQuestions.map(q => {
    const keywordsToCheck = [...jd.requiredSkills, 'react', 'node', 'database', 'scalable', 'team', 'agile', 'api', 'security'];
    return computeFeedbackMetrics(q.userPracticeAnswer || '', keywordsToCheck);
  });

  const avgOverall = allMetrics.length > 0 ? Math.round(allMetrics.reduce((a, m) => a + m.overall, 0) / allMetrics.length) : 0;
  const avgStructure = allMetrics.length > 0 ? Math.round(allMetrics.reduce((a, m) => a + m.structure, 0) / allMetrics.length) : 0;
  const avgKeywords = allMetrics.length > 0 ? Math.round(allMetrics.reduce((a, m) => a + m.keywords, 0) / allMetrics.length) : 0;
  const avgClarity = allMetrics.length > 0 ? Math.round(allMetrics.reduce((a, m) => a + m.clarity, 0) / allMetrics.length) : 0;

  const uniqueMissing = Array.from(new Set(
    practicedQuestions.flatMap(q => q.feedback?.missingKeywords || [])
  )).slice(0, 8);

  const handleSave = () => {
    const kit: PrepKit = {
      id: `kit_scored_${Date.now()}`,
      createdAt: new Date().toISOString(),
      title: `${jd.companyName} Scorecard (${avgOverall}/100)`,
      candidateProfile: profile,
      jobDescription: jd,
      questions,
      overallScore: avgOverall
    };
    onSaveKit(kit);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePrint = () => window.print();

  const getScoreColor = (val: number) => {
    if (val >= 80) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (val >= 60) return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-rose-100 text-rose-800 border-rose-300';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12 animate-fade-in text-slate-800 print:bg-white print:text-slate-900 print:p-0">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-teal-950 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black uppercase tracking-wider shadow-sm">
          <Award className="w-4 h-4 text-emerald-400" />
          <span>Step 5: Practice Scorecard & Improvement Report</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
          Interview Practice Score: <span className="text-emerald-400 font-mono">{avgOverall}%</span>
        </h1>
        <p className="text-emerald-100 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Based on your answers to <span className="font-bold text-white">{totalPracticed} mock interview questions</span> for <span className="text-indigo-200 font-bold">{jd.jobTitle}</span> at <span className="text-indigo-200 font-bold">{jd.companyName}</span>.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4 print:hidden">
          <button onClick={onPracticeAgain} className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-slate-900 font-extrabold shadow-lg hover:bg-slate-100 transition-all text-sm">
            <Video className="w-4 h-4 text-emerald-600" /><span>Practice 1-on-1 Simulator Again</span>
          </button>
          <button onClick={handleSave} className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold transition-all shadow-md text-sm ${saved ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}>
            {saved ? <CheckCircle2 className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            <span>{saved ? "Saved!" : "Save Scorecard"}</span>
          </button>
          <button onClick={handlePrint} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs">
            <Printer className="w-4 h-4" /><span>Print</span>
          </button>
          <button onClick={onBackToStudio} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-black/20 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold">
            <ArrowLeft className="w-3.5 h-3.5" /><span>Back</span>
          </button>
        </div>
      </div>

      {/* New Scorecard Metrics: Overall, Structure, Keywords, Clarity */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Overall', value: avgOverall, icon: <Award className="w-5 h-5" />, desc: 'Combined weighted score' },
          { label: 'Structure', value: avgStructure, icon: <BarChart3 className="w-5 h-5" />, desc: 'STAR method & organization' },
          { label: 'Keywords', value: avgKeywords, icon: <CheckCircle2 className="w-5 h-5" />, desc: 'JD keyword coverage' },
          { label: 'Clarity', value: avgClarity, icon: <Sparkles className="w-5 h-5" />, desc: 'Confidence & articulation' }
        ].map((m, i) => (
          <div key={i} className={`bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-sm ${getScoreColor(m.value)}`}>
            <div className="flex items-center gap-2">
              {m.icon}
              <span className="text-xs uppercase font-extrabold tracking-wider">{m.label}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black">{m.value}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
              <div className={`h-full rounded-full ${m.value >= 80 ? 'bg-emerald-500' : m.value >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${m.value}%` }}></div>
            </div>
            <p className="text-xs font-medium text-slate-600 pt-1">{m.desc}</p>
          </div>
        ))}
      </div>

      {/* Missing Keywords */}
      {uniqueMissing.length > 0 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-amber-50/80 border border-amber-200 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-amber-800 font-black">
            <AlertCircle className="w-5 h-5 text-amber-600" /><span>Keywords to Improve</span>
          </div>
          <p className="text-xs text-slate-700 font-medium">Our AI noticed you omitted these JD keywords during practice. Mention them next time to improve your score:</p>
          <div className="flex flex-wrap gap-2">
            {uniqueMissing.map((kw, i) => (
              <span key={i} className="px-3.5 py-1.5 rounded-xl bg-white text-amber-900 border border-amber-200 text-xs font-bold shadow-sm">🎯 {kw}</span>
            ))}
          </div>
        </div>
      )}

      {/* Question by Question */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-4">
          <Sparkles className="w-6 h-6 text-indigo-600" /><span>Detailed Question Analysis</span>
        </h2>

        {questions.map((q, idx) => {
          const metrics = q.feedback ? computeFeedbackMetrics(q.userPracticeAnswer || '', [...jd.requiredSkills, 'react', 'node', 'database', 'scalable']) : null;
          return (
            <div key={q.id} className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-slate-900 text-white font-black text-sm flex items-center justify-center shadow-sm">Q{idx + 1}</span>
                  <span className="text-xs uppercase font-extrabold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                    {q.category === 'technical' ? 'Technical' : q.category === 'role_based' ? 'Role' : 'HR'}
                  </span>
                </div>
                {metrics && (
                  <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-mono text-xs font-black shadow-sm">
                    Score: {metrics.overall}/100
                  </span>
                )}
              </div>

              <h3 className="text-xl font-black text-slate-900">{q.question}</h3>

              {q.feedback && (
                <>
                  {/* New mini scorecards per answer */}
                  {metrics && (
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { label: 'Overall', value: metrics.overall },
                        { label: 'Structure', value: metrics.structure },
                        { label: 'Keywords', value: metrics.keywords },
                        { label: 'Clarity', value: metrics.clarity },
                      ].map((m, i) => (
                        <div key={i} className={`p-2 rounded-xl text-center border ${getScoreColor(m.value)}`}>
                          <div className="text-[10px] font-bold uppercase">{m.label}</div>
                          <div className="text-lg font-black">{m.value}%</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-xs font-black text-slate-500 block uppercase mb-1">Your Answer</span>
                      <p className="text-slate-800 font-medium italic">{q.userPracticeAnswer ? `"${q.userPracticeAnswer}"` : "⚠️ No answer recorded"}</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200">
                      <span className="text-xs font-black text-indigo-900 block uppercase mb-1">Ideal Answer</span>
                      <p className="text-slate-900 font-bold">"{q.personalizedAnswer}"</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-300">
                      <span className="font-black text-emerald-900 block uppercase tracking-wider mb-1">✨ Strengths</span>
                      <ul className="text-slate-800 list-disc list-inside font-medium">
                        {q.feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                    <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300">
                      <span className="font-black text-amber-900 block uppercase tracking-wider mb-1">⚡ Improvements</span>
                      <ul className="text-slate-800 list-disc list-inside font-medium">
                        {q.feedback.improvements.map((imp, i) => <li key={i}>{imp}</li>)}
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
