import React from 'react';
import { PrepKit } from '../data/samplePresets';
import { Bookmark, Calendar, Building2, User, Sparkles, Trash2, Play, Award } from 'lucide-react';

interface Props {
  savedKits: PrepKit[];
  onLoadKit: (kit: PrepKit) => void;
  onDeleteKit: (id: string) => void;
  onExploreDemo: () => void;
}

export const SavedKits: React.FC<Props> = ({ savedKits, onLoadKit, onDeleteKit, onExploreDemo }) => {
  if (savedKits.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6 animate-fade-in text-slate-800">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mx-auto shadow-sm">
          <Bookmark className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-black text-slate-900">No Saved Interview Kits Yet</h2>
        <p className="text-slate-600 max-w-md mx-auto text-sm font-medium">
          Generate custom questions using your resume and job description, then click "Save Prep Kit" to bookmark them here for easy practice anytime.
        </p>

        <button
          onClick={onExploreDemo}
          className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white font-extrabold shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-purple-600 transition-all scale-102"
        >
          Generate First Interview Kit
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8 animate-fade-in text-slate-800">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2.5">
            <Bookmark className="w-7 h-7 text-indigo-600" />
            <span>Saved Interview Kits</span>
          </h1>
          <p className="text-xs text-slate-500 font-semibold">Review your past interview questions, practice answers, and scorecards</p>
        </div>
        <span className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-slate-700 shadow-sm">
          {savedKits.length} Kits Available
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {savedKits.map((kit) => (
          <div
            key={kit.id}
            className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden group hover:border-indigo-400 transition-all flex flex-col justify-between shadow-xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>

            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-indigo-700 transition-colors">
                    {kit.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold pt-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(kit.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); onDeleteKit(kit.id); }}
                  className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition-all shadow-sm"
                  title="Delete kit"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Kit Details */}
              <div className="space-y-2 text-xs font-semibold">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 shadow-sm">
                  <User className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span className="truncate"><span className="text-slate-500 font-bold">Candidate:</span> {kit.candidateProfile.name} ({kit.candidateProfile.targetRole})</span>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 shadow-sm">
                  <Building2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span className="truncate"><span className="text-slate-500 font-bold">Company Target:</span> {kit.jobDescription.companyName}</span>
                </div>
              </div>

              {/* Stats pill */}
              <div className="flex items-center justify-between text-xs pt-2">
                <div className="flex items-center gap-2 text-slate-600 font-extrabold">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>{kit.questions.length} Questions Generated</span>
                </div>

                {kit.overallScore && (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 font-black flex items-center gap-1.5 shadow-sm font-mono">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>Score: {kit.overallScore}%</span>
                  </span>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => onLoadKit(kit)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs transition-all shadow-md shadow-indigo-500/20"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Load & Practice Kit</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
