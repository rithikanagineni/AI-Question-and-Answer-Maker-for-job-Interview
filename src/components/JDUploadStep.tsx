import React, { useState } from 'react';
import { JobDescriptionData } from '../data/samplePresets';
import { simulateJDParsing } from '../utils/aiGenerator';
import { Briefcase, FileText, Sparkles, CheckCircle2, Building2, Code, ArrowRight, ArrowLeft, RefreshCw, Layers } from 'lucide-react';

interface Props {
  jd: JobDescriptionData;
  setJd: React.Dispatch<React.SetStateAction<JobDescriptionData>>;
  onNext: () => void;
  onBack: () => void;
  candidateSkills: string[];
}

export const JDUploadStep: React.FC<Props> = ({ jd, setJd, onNext, onBack, candidateSkills }) => {
  const [loading, setLoading] = useState(false);
  const [rawText, setRawText] = useState(jd.description);
  const hasContent = !!jd.jobTitle && jd.requiredSkills.length > 0;

  const handlePasteAnalyze = () => {
    if (!rawText.trim()) return;
    setLoading(true);
    setTimeout(() => { setJd(simulateJDParsing(rawText)); setLoading(false); }, 600);
  };

  const jdSkillsLower = jd.requiredSkills.map(s => s.toLowerCase());
  const matchCount = candidateSkills.filter(cs => jdSkillsLower.some(js => js.includes(cs.toLowerCase()) || cs.toLowerCase().includes(js))).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10 animate-fade-in text-slate-800">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold uppercase tracking-wider shadow-sm">
          <Briefcase className="w-3.5 h-3.5 text-purple-600" />
          <span>Step 2 of 5: Paste Job Description</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Paste Target Job Description (JD)</h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-medium">
          We match your resume against the company expectations to generate role-specific questions and identify your skill coverage.
        </p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl">
        <div className="space-y-2">
          <label className="text-sm font-extrabold text-slate-900 flex items-center justify-between">
            <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-purple-600" /><span>Paste Job Description Text</span></span>
            <span className="text-xs text-slate-500 font-mono font-semibold">Include duties and required skills</span>
          </label>
          <textarea rows={5} value={rawText} onChange={(e) => setRawText(e.target.value)}
            placeholder="Paste the full job posting here (e.g., Responsibilities, Qualifications, Experience required)..."
            className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-4 text-sm text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 font-medium leading-relaxed resize-none shadow-sm" />
        </div>

        <div className="flex justify-end">
          <button onClick={handlePasteAnalyze} disabled={loading || !rawText.trim()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-extrabold text-xs transition-all shadow-md shadow-purple-500/20">
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
            <span>Analyze JD & Extract Metrics</span>
          </button>
        </div>

        <div className="border-t border-slate-200 pt-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2"><Building2 className="w-5 h-5 text-purple-600" /><span>Extracted Job Target</span></h3>
              <p className="text-xs text-slate-500 font-medium">Used to formulate match insights and role-specific questions</p>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold flex items-center gap-2 shadow-sm">
              <Layers className="w-4 h-4 text-indigo-600" /><span>~{matchCount} Skills Match Your Resume</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600">Job Title</label>
              <input type="text" value={jd.jobTitle} onChange={(e) => setJd({ ...jd, jobTitle: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-purple-600 font-extrabold shadow-sm" placeholder="e.g., Software Engineer" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600">Company Name</label>
              <input type="text" value={jd.companyName} onChange={(e) => setJd({ ...jd, companyName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-purple-600 font-extrabold shadow-sm" placeholder="e.g., Google, Microsoft" />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-2"><Code className="w-4 h-4 text-emerald-600" /><span>Required Skills Identified</span></label>
            <div className="flex flex-wrap gap-2">
              {jd.requiredSkills.map((req, idx) => {
                const isMatched = candidateSkills.some(cs => cs.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(cs.toLowerCase()));
                return (
                  <span key={idx} className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border shadow-sm ${
                    isMatched ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-500/20' : 'bg-slate-100 text-slate-700 border-slate-200 font-medium'
                  }`}>
                    {isMatched && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    <span>{req}</span>
                  </span>
                );
              })}
              {jd.requiredSkills.length === 0 && <p className="text-xs text-slate-400 font-medium">Paste a JD above to extract required skills</p>}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
            <button onClick={onBack} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 font-bold text-xs">
              <ArrowLeft className="w-4 h-4" /><span>Back to Resume</span>
            </button>
            <button onClick={onNext} disabled={!hasContent}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white font-extrabold shadow-lg shadow-purple-500/25 hover:from-purple-500 hover:to-indigo-600 transition-all scale-102 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              <span>View Match Insights</span>
              <ArrowRight className="w-5 h-5 animate-pulse" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
