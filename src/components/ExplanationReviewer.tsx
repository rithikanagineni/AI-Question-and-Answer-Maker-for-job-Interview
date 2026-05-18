import React from 'react';
import { Lightbulb, Target, Cpu, CheckCircle2, Award, Zap, HelpCircle, Users, ArrowRight, ShieldCheck, FileText, Briefcase } from 'lucide-react';

interface Props {
  onStartDemo: () => void;
}

export const ExplanationReviewer: React.FC<Props> = ({ onStartDemo }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 text-slate-800">
      
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-indigo-200 bg-gradient-to-br from-indigo-900 via-indigo-950 to-purple-950 p-8 sm:p-14 shadow-2xl text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/50 text-xs font-black uppercase tracking-wider shadow-sm">
            <Award className="w-4 h-4 text-indigo-300" />
            <span>Academic & Reviewer Presentation</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            AI Question & Answer Maker <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-indigo-300 via-purple-200 to-pink-300 bg-clip-text text-transparent">
              for Job Interviews
            </span>
          </h1>

          <p className="text-lg text-slate-200 leading-relaxed font-medium">
            Our project is an AI-powered Interview Preparation System that helps students and job seekers prepare for interviews in a smarter and more personalized way by bridging the gap between their Resume and the target Job Description.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={onStartDemo}
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-indigo-950 font-extrabold shadow-xl hover:bg-indigo-50 transition-all scale-105"
            >
              <span>Launch AI Studio Demo</span>
              <ArrowRight className="w-5 h-5 text-indigo-600 animate-pulse" />
            </button>
            <a
              href="#architecture"
              className="px-6 py-4 rounded-xl bg-white/10 text-white border border-white/20 font-semibold hover:bg-white/20 transition-all text-sm backdrop-blur-sm"
            >
              Explore Architecture & Workflow ↓
            </a>
          </div>
        </div>
      </div>

      {/* Problem We Identified */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-1 space-y-4 sticky top-24">
          <div className="flex items-center gap-2 text-rose-600 font-extrabold tracking-wider text-sm uppercase">
            <Target className="w-5 h-5 text-rose-500" />
            <span>Problem Statement</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
            Why Traditional Prep Fails Candidates
          </h2>
          <p className="text-slate-600 font-medium leading-relaxed">
            Most platforms offer generic top-100 interview questions. They fail to address the specific candidate's actual projects or the exact expectations of the target company.
          </p>
        </div>

        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            {
              title: "What questions will be asked",
              desc: "Candidates attend interviews blind, unaware of what technical depth or HR questions the company prioritizes."
            },
            {
              title: "How to answer based on Resume",
              desc: "Generic advice doesn't teach candidates how to weave their own projects and extracted skills into compelling answers."
            },
            {
              title: "Matching Skills with JD",
              desc: "Candidates struggle to highlight the exact overlap between their past experience and the Job Description."
            },
            {
              title: "Confidence Deficit",
              desc: "Without realistic simulation and instantaneous feedback, candidates enter the actual interview room nervous and unpolished."
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-200/80 p-8 rounded-3xl space-y-3 shadow-sm hover:shadow-md hover:border-rose-300 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 font-black text-sm shadow-sm mb-4">
                0{idx + 1}
              </div>
              <h3 className="font-extrabold text-xl text-slate-900">{item.title}</h3>
              <p className="text-slate-600 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Solution & Uniqueness */}
      <section className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100 rounded-3xl p-8 sm:p-14 space-y-10 relative overflow-hidden shadow-sm">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-extrabold uppercase tracking-wider">
            <Lightbulb className="w-4 h-4 text-indigo-600" />
            <span>Our Solution</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
            Personalized AI Interview Engine
          </h2>
          <p className="text-slate-700 font-medium leading-relaxed">
            Unlike normal interview preparation websites that rely on fixed static databases, our system synthesizes both the candidate's exact resume profile and the employer's job description.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {[
            {
              title: "Personalized",
              desc: "Questions are dynamically generated specifically for that user's projects and experience.",
              icon: Users,
              color: "text-blue-600 bg-blue-50 border-blue-200"
            },
            {
              title: "AI-Based Answers",
              desc: "Smart answer suggestions instead of fixed templates, framed using the STAR method.",
              icon: Cpu,
              color: "text-purple-600 bg-purple-50 border-purple-200"
            },
            {
              title: "Resume + JD Matching",
              desc: "Strong role-specific preparation ensuring perfect keyword alignment with company demands.",
              icon: Target,
              color: "text-emerald-600 bg-emerald-50 border-emerald-200"
            },
            {
              title: "Practice & Feedback",
              desc: "Complete interview prep in one platform with real-time confidence and quality grading.",
              icon: Zap,
              color: "text-amber-600 bg-amber-50 border-amber-200"
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-3xl space-y-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                <div className="space-y-4">
                  <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shadow-sm ${item.color}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">{item.title}</h3>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">{item.desc}</p>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-extrabold text-indigo-600">
                  <span>Core Pillar</span>
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Workflow */}
      <section id="architecture" className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-black text-slate-900">How It Works: The 6-Step Pipeline</h2>
          <p className="text-slate-600 text-sm font-medium">An end-to-end overview of the candidate journey within our system</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              step: "Step 1",
              name: "Resume Upload & Parser",
              desc: "Candidate uploads PDF/DOC. NLP algorithms extract skills, projects, education, certifications, experience, and technical strengths.",
              icon: FileText
            },
            {
              step: "Step 2",
              name: "Job Description Input",
              desc: "Candidate pastes JD text. System identifies required skills, role responsibilities, expected experience, and company expectations.",
              icon: Briefcase
            },
            {
              step: "Step 3",
              name: "AI Question Generation",
              desc: "Synthesizing Resume + JD, AI generates Technical Questions ('Explain final year project'), HR Questions ('Why hire you?'), and Role-Based Questions.",
              icon: HelpCircle
            },
            {
              step: "Step 4",
              name: "Personalized Answer Suggestions",
              desc: "Instead of generic answers, AI suggests strong personalized responses utilizing the candidate's exact CRUD web application or ML pipeline.",
              icon: Lightbulb
            },
            {
              step: "Step 5",
              name: "Interactive Practice Mode",
              desc: "User practices mock interviews answering questions one by one. Improves confidence, verbal communication, and pacing under timer pressure.",
              icon: Zap
            },
            {
              step: "Step 6",
              name: "Feedback & Scorecard Report",
              desc: "System provides instant feedback on answer quality, missing keywords, confidence level, and actionable improvement suggestions.",
              icon: Award
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white border border-slate-200/80 p-8 rounded-3xl space-y-4 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm">
                    {item.step}
                  </span>
                  <Icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-black text-slate-900">{item.name}</h3>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Expected Impact & MVP Scope */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-purple-950 border border-indigo-800 rounded-3xl p-8 sm:p-12 space-y-6 text-white shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-300 border border-indigo-500/30">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black">Expected Impact</h3>
          </div>
          <p className="text-indigo-100 text-sm sm:text-base leading-relaxed font-medium">
            This project solves a real problem faced by almost every student and fresher. Instead of preparing blindly for interviews, candidates prepare intelligently using AI-powered personalized guidance.
          </p>

          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-indigo-300">Target Audiences</h4>
            <div className="flex flex-wrap gap-2">
              {["🎓 Students for Placements", "🌱 Freshers for Internships", "💼 Job Seekers in Tech", "🏢 Career Counselors"].map((tag, i) => (
                <span key={i} className="px-3.5 py-2 rounded-xl bg-white/10 text-xs font-bold text-white border border-white/10 shadow-sm backdrop-blur-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400">Measurable Improvements</h4>
            <ul className="space-y-2.5 text-sm text-indigo-100 font-medium">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>Increases selection chances through role-tailored framing</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>Boosts confidence by eliminating fear of the unknown</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>Refines verbal communication and concise storytelling</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-12 space-y-6 shadow-xl text-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900">MVP Scope Checklist</h3>
            <span className="text-xs font-black px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-sm">
              100% Completed
            </span>
          </div>

          <p className="text-slate-600 text-sm font-medium">
            Our Minimum Viable Product successfully implements all core operational modules specified in the project requirements:
          </p>

          <div className="space-y-3">
            {[
              { name: "Resume Parsing Engine", desc: "Extracts Skills, Projects, Experience & Education" },
              { name: "Job Description (JD) Parsing", desc: "Identifies required tools, role scope, and expectations" },
              { name: "Dynamic Question Bank Generation", desc: "Technical, HR, and custom Role-based questions" },
              { name: "Personalized Answer Suggestions", desc: "Incorporates candidate's actual resume background" },
              { name: "1-on-1 Mock Interview Simulator", desc: "Webcam live feed, voice mic, and AI Mock Interview Bot" },
              { name: "AI Feedback & Scorecard Report", desc: "Actionable keyword and percentage score evaluation" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
                <div className="w-6 h-6 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">{item.name}</h4>
                  <p className="text-xs font-medium text-slate-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onStartDemo}
            className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-base transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 scale-102"
          >
            <span>Test the Fully Working MVP Now</span>
            <ArrowRight className="w-5 h-5 animate-pulse" />
          </button>
        </div>
      </section>
      
    </div>
  );
};
