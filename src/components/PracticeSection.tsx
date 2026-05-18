import React, { useState } from 'react';
import { CandidateProfile, JobDescriptionData, GeneratedQuestion } from '../data/samplePresets';
import { computeFeedbackMetrics } from '../utils/matchInsights';
import { Sparkles, CheckCircle2, Award, ArrowRight, Lightbulb, MessageSquare } from 'lucide-react';

interface Props {
  profile: CandidateProfile;
  jd: JobDescriptionData;
  questions: GeneratedQuestion[];
  onStartMockInterview: () => void;
}

export const PracticeSection: React.FC<Props> = ({ jd, questions, onStartMockInterview }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedbackData, setFeedbackData] = useState<Record<string, any>>({});
  const [activeQId, setActiveQId] = useState<string>(questions[0]?.id || '');

  const handleGetFeedback = (qId: string) => {
    const userAns = answers[qId] || '';
    const q = questions.find(item => item.id === qId);
    if (!q) return;

    const keywords = [...jd.requiredSkills, 'react', 'node', 'database', 'scalable', 'agile', 'team', 'api'];
    const metrics = computeFeedbackMetrics(userAns, keywords);

    // Generate strengths and improvements based on metrics
    const strengths: string[] = [];
    const improvements: string[] = [];

    if (metrics.structure >= 60) strengths.push("Good use of structured storytelling (Situation/Task/Action/Result).");
    else improvements.push("Structure your answer clearly using the STAR method.");

    if (metrics.keywords >= 60) strengths.push("Strong alignment with Job Description keywords.");
    else improvements.push("Incorporate more relevant technical keywords from the Job Description.");

    if (metrics.clarity >= 60) strengths.push("Clear, confident, and professional tone.");
    else improvements.push("Avoid hesitant language and provide more descriptive depth.");

    setFeedbackData(prev => ({
      ...prev,
      [qId]: {
        metrics,
        strengths,
        improvements
      }
    }));
  };

  const currentQIndex = questions.findIndex(q => q.id === activeQId);
  const currentQ = questions[currentQIndex];

  if (!currentQ) return null;

  const currentFeedback = feedbackData[activeQId];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in text-slate-800">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold uppercase tracking-wider shadow-sm">
          <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
          <span>Step 5: Practice Section</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Practice Questions to Gain Confidence
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-medium">
          Take your time to craft and refine your answers. Answer the question below, then click <span className="font-bold text-indigo-600">Get Feedback</span> to receive your instant scorecard.
        </p>
      </div>

      {/* Question Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {questions.map((q, idx) => {
          const isAnswered = !!feedbackData[q.id];
          return (
            <button
              key={q.id}
              onClick={() => setActiveQId(q.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                activeQId === q.id
                  ? 'bg-indigo-600 text-white font-black shadow-md shadow-indigo-500/20'
                  : isAnswered
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {isAnswered && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              <span>Q{idx + 1}: {q.category === 'technical' ? 'Technical' : q.category === 'role_based' ? 'Role' : 'HR'}</span>
            </button>
          );
        })}
      </div>

      {/* Active Question Box */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-slate-900 text-white font-black text-sm flex items-center justify-center shadow-sm">
              Q{currentQIndex + 1}
            </span>
            <span className="text-xs uppercase font-extrabold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              {currentQ.category === 'technical' ? '💻 Technical Question' : currentQ.category === 'role_based' ? '🎯 Role Alignment' : '🌱 HR / Behavioral'}
            </span>
          </div>
          <span className="text-xs text-slate-500 font-semibold">Practice Mode • Untimed</span>
        </div>

        {/* Question & Context */}
        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
            {currentQ.question}
          </h2>
          <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-slate-700 shadow-sm font-medium">
            <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-amber-900 uppercase tracking-wider text-[11px] block mb-0.5">Why Interviewers Ask This: </span>
              <span className="leading-relaxed">{currentQ.whyAsked}</span>
            </div>
          </div>
        </div>

        {/* Answer Input Area */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
            Your Practice Answer
          </label>
          <textarea
            rows={6}
            value={answers[activeQId] || ''}
            onChange={(e) => setAnswers(e.target.value ? { ...answers, [activeQId]: e.target.value } : { ...answers, [activeQId]: '' })}
            placeholder="Type your complete answer here. Use the STAR method (Situation, Task, Action, Result) and include specific details from your resume..."
            className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-4 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 font-medium leading-relaxed resize-none shadow-sm"
          />
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Words: {(answers[activeQId] || '').trim().split(/\s+/).filter(Boolean).length}</span>
            <span>Answer the question, then click Get Feedback.</span>
          </div>

          <button
            onClick={() => handleGetFeedback(activeQId)}
            className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Get Feedback</span>
          </button>
        </div>

        {/* Instant Feedback Scorecard */}
        {currentFeedback && (
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-6 shadow-inner animate-fade-in">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
              <Award className="w-6 h-6 text-indigo-600" />
              <h3 className="text-xl font-black text-slate-900">Feedback Scorecard</h3>
            </div>

            {/* Scores Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-indigo-200 shadow-sm text-center space-y-1">
                <div className="text-xs font-extrabold text-indigo-800 uppercase tracking-wider">Overall</div>
                <div className="text-3xl font-black text-slate-900">{currentFeedback.metrics.overall}%</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-purple-200 shadow-sm text-center space-y-1">
                <div className="text-xs font-extrabold text-purple-800 uppercase tracking-wider">Structure</div>
                <div className="text-3xl font-black text-slate-900">{currentFeedback.metrics.structure}%</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-sm text-center space-y-1">
                <div className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">Keywords</div>
                <div className="text-3xl font-black text-slate-900">{currentFeedback.metrics.keywords}%</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-sm text-center space-y-1">
                <div className="text-xs font-extrabold text-amber-800 uppercase tracking-wider">Clarity</div>
                <div className="text-3xl font-black text-slate-900">{currentFeedback.metrics.clarity}%</div>
              </div>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-sm space-y-2">
                <span className="font-black text-emerald-900 block uppercase tracking-wider text-[11px] mb-1">✨ Strengths</span>
                <ul className="text-slate-700 list-disc list-inside font-medium space-y-1">
                  {currentFeedback.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-sm space-y-2">
                <span className="font-black text-amber-900 block uppercase tracking-wider text-[11px] mb-1">⚡ Improvements</span>
                <ul className="text-slate-700 list-disc list-inside font-medium space-y-1">
                  {currentFeedback.improvements.map((imp: string, i: number) => <li key={i}>{imp}</li>)}
                </ul>
              </div>
            </div>

            {/* Ideal AI Answer comparison */}
            <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200 shadow-sm space-y-2">
              <span className="text-xs font-black text-indigo-900 block uppercase tracking-wider">AI Ideal Personalized Answer</span>
              <p className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed italic">
                "{currentQ.personalizedAnswer}"
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
          <button
            onClick={() => {
              if (currentQIndex < questions.length - 1) {
                setActiveQId(questions[currentQIndex + 1].id);
              } else {
                setActiveQId(questions[0].id);
              }
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-all font-bold text-xs"
          >
            <span>Next Practice Question</span>
          </button>

          <button
            onClick={onStartMockInterview}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white font-extrabold shadow-lg shadow-purple-500/25 hover:from-purple-500 hover:to-indigo-600 transition-all scale-102 text-sm"
          >
            <span>Start 1-on-1 Mock Interview</span>
            <ArrowRight className="w-5 h-5 animate-pulse" />
          </button>
        </div>

      </div>

    </div>
  );
};
