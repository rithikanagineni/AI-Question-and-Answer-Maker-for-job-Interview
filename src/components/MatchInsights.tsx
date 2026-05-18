import React from 'react';
import { MatchInsightsData } from '../utils/matchInsights';
import { ArrowRight, CheckCircle2, AlertCircle, Target, FileText, Sparkles } from 'lucide-react';

interface Props {
  insights: MatchInsightsData;
  onOpenQABank: () => void;
  onEditInputs: () => void;
}

export const MatchInsights: React.FC<Props> = ({ insights, onOpenQABank, onEditInputs }) => {
  const getFitColor = (val: number) => {
    if (val >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-300';
    if (val >= 60) return 'text-amber-600 bg-amber-50 border-amber-300';
    return 'text-rose-600 bg-rose-50 border-rose-300';
  };

  const getRiskColor = (val: number) => {
    if (val <= 30) return 'text-emerald-600 bg-emerald-50 border-emerald-300';
    if (val <= 50) return 'text-amber-600 bg-amber-50 border-amber-300';
    return 'text-rose-600 bg-rose-50 border-rose-300';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in text-slate-800">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold uppercase tracking-wider shadow-sm">
          <Target className="w-3.5 h-3.5 text-indigo-600" />
          <span>Match Insights: Resume vs Job Description</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Explainable Resume-to-JD Analysis
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-medium">
          Understand your strengths, gaps and interview risk before you start practicing.
        </p>
      </div>

      {/* Score Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Fit */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center border-2 ${getFitColor(insights.overallFit)}`}>
              <span className="text-3xl font-black">{insights.overallFit}%</span>
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Overall Fit</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {insights.overallFit >= 80 ? 'Strong match. Well aligned with the role.' :
                 insights.overallFit >= 60 ? 'Moderate match. Address missing keywords confidently.' :
                 'Low match. Focus on bridging critical skill gaps.'}
              </p>
            </div>
          </div>
        </div>

        {/* Skill Coverage */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center border-2 ${getFitColor(insights.skillCoverage)}`}>
              <span className="text-3xl font-black">{insights.skillCoverage}%</span>
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Skill Coverage</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Based on required skills found in your resume.</p>
            </div>
          </div>
        </div>

        {/* Interview Risk */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center border-2 ${getRiskColor(insights.interviewRisk)}`}>
              <span className="text-3xl font-black">{insights.interviewRisk}%</span>
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Interview Risk</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {insights.interviewRisk <= 30 ? 'Low risk. You are well prepared.' :
                 insights.interviewRisk <= 50 ? 'Moderate risk. Prepare for missing areas.' :
                 'Higher risk means more missing JD keywords to prepare for.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Strengths & Missing Keywords */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Detected Strengths */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-black text-slate-900">Detected Resume Strengths</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {insights.detectedStrengths.map((s, i) => (
              <span key={i} className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-sm">
                {s}
              </span>
            ))}
            {insights.detectedStrengths.length === 0 && (
              <p className="text-xs text-slate-400 font-medium">No specific strengths detected from JD alignment.</p>
            )}
          </div>
        </div>

        {/* Missing / Weak JD Keywords */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-black text-slate-900">Missing / Weak JD Keywords</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {insights.missingKeywords.map((k, i) => (
              <span key={i} className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold shadow-sm">
                {k}
              </span>
            ))}
            {insights.missingKeywords.length === 0 && (
              <p className="text-xs text-emerald-600 font-bold">✅ All JD keywords covered!</p>
            )}
          </div>
        </div>
      </div>

      {/* Recruiter-facing Summary */}
      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center gap-2.5 pb-3 border-b border-indigo-100">
          <FileText className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-black text-slate-900">Recruiter-facing Summary</h3>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed font-medium">
          {insights.recruiterSummary}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={onOpenQABank}
          className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white font-extrabold shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-purple-600 transition-all scale-102"
        >
          <Sparkles className="w-5 h-5" />
          <span>Open Q&A Bank</span>
        </button>
        <button
          onClick={onEditInputs}
          className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-all font-bold text-xs"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span>Edit Inputs</span>
        </button>
      </div>

    </div>
  );
};
