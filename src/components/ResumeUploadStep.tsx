import React, { useState } from 'react';
import { CandidateProfile } from '../data/samplePresets';
import { parseResumeFile } from '../utils/resumeParser';
import { FileText, Upload, User, Briefcase, Code, GraduationCap, ArrowRight, RefreshCw, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  profile: CandidateProfile;
  setProfile: React.Dispatch<React.SetStateAction<CandidateProfile>>;
  onNext: () => void;
}

export const ResumeUploadStep: React.FC<Props> = ({ profile, setProfile, onNext }) => {
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [parseError, setParseError] = useState('');
  const hasContent = !!profile.name && profile.name !== '' && profile.skills.length > 0;

  const processFile = (file: File) => {
    setLoading(true);
    setParseError('');
    setUploadedFileName(file.name);

    const ext = file.name.split('.').pop()?.toLowerCase();
    const isPDF = ext === 'pdf';

    const reader = new FileReader();

    if (isPDF) {
      // Read PDFs as ArrayBuffer for binary text extraction
      reader.onload = (evt) => {
        const content = evt.target?.result as ArrayBuffer;
        setTimeout(() => {
          try {
            const parsed = parseResumeFile(content, file.name, true);
            setProfile(parsed);
          } catch (e) {
            setParseError('Could not fully parse this PDF. Please fill in your details manually below.');
          }
          setLoading(false);
        }, 600);
      };
      reader.readAsArrayBuffer(file);
    } else {
      // TXT / DOC / DOCX → read as text
      reader.onload = (evt) => {
        const content = evt.target?.result as string;
        setTimeout(() => {
          try {
            const parsed = parseResumeFile(content, file.name, false);
            setProfile(parsed);
          } catch (e) {
            setParseError('Could not parse this file. Please fill in your details manually below.');
          }
          setLoading(false);
        }, 600);
      };
      reader.readAsText(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !profile.skills.includes(trimmed)) {
      setProfile({ ...profile, skills: [...profile.skills, trimmed] });
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setProfile({ ...profile, skills: profile.skills.filter(s => s !== skill) });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in text-slate-800">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold uppercase tracking-wider shadow-sm">
          <FileText className="w-3.5 h-3.5" />
          <span>Step 1 of 6: Upload Your Resume</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Upload Your Resume</h1>
        <p className="text-slate-600 max-w-xl mx-auto text-sm leading-relaxed font-medium">
          Upload your PDF or TXT resume. Our AI deeply scans your skills, projects, experience and education to generate personalized interview questions.
        </p>
      </div>

      {/* Upload Zone */}
      <div
        className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all relative shadow-sm cursor-pointer ${
          dragOver ? 'border-indigo-500 bg-indigo-50/80 ring-4 ring-indigo-500/10' : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-indigo-50/30'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) processFile(file);
        }}
      >
        <input type="file" id="resume-upload" accept=".pdf,.txt,.doc,.docx" className="hidden" onChange={handleFileInput} />
        <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center gap-4">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-md transition-all ${uploadedFileName ? 'bg-emerald-50 border-2 border-emerald-300' : 'bg-indigo-50 border-2 border-indigo-200'}`}>
            {loading ? (
              <RefreshCw className="w-9 h-9 text-indigo-600 animate-spin" />
            ) : uploadedFileName ? (
              <CheckCircle2 className="w-9 h-9 text-emerald-600" />
            ) : (
              <Upload className="w-9 h-9 text-indigo-600 animate-bounce" />
            )}
          </div>

          {loading ? (
            <div className="space-y-2">
              <p className="text-lg font-extrabold text-indigo-700">🔍 Parsing Resume...</p>
              <p className="text-sm text-slate-500">Extracting skills, projects, education and experience</p>
              <div className="flex justify-center gap-1 mt-2">
                {['Scanning text...', 'Detecting skills...', 'Extracting projects...'].map((s, i) => (
                  <span key={i} className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full animate-pulse">{s}</span>
                ))}
              </div>
            </div>
          ) : uploadedFileName ? (
            <div className="space-y-1">
              <p className="text-lg font-extrabold text-emerald-700">✅ {uploadedFileName}</p>
              <p className="text-sm text-slate-500">Successfully parsed! Review extracted data below.</p>
              <p className="text-xs text-indigo-600 font-semibold mt-1">Click or drag to upload a different file</p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-lg font-extrabold text-slate-900">Drag & Drop Resume here</p>
              <p className="text-sm text-slate-500">or click to browse — PDF, TXT, DOC supported</p>
            </div>
          )}

          {!loading && (
            <div className={`px-6 py-2.5 rounded-xl font-extrabold text-xs shadow-md transition-all ${uploadedFileName ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}>
              {uploadedFileName ? 'Upload Different File' : 'Select Resume File'}
            </div>
          )}
        </label>
      </div>

      {/* Parse Error Banner */}
      {parseError && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium shadow-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span>{parseError} You can still fill in all details manually in the form below.</span>
        </div>
      )}

      {/* Extracted Profile Editor */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              <span>{uploadedFileName ? 'Extracted Profile — Please Review' : 'Fill Your Profile Manually'}</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {uploadedFileName
                ? 'Our AI extracted this data from your resume. Review, edit and add any missing details.'
                : 'No file uploaded yet. You can manually enter your profile information below.'}
            </p>
          </div>
          {hasContent && (
            <button onClick={onNext} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-extrabold shadow-md hover:from-indigo-500 hover:to-purple-600 transition-all text-sm">
              <span>Continue to JD →</span>
            </button>
          )}
        </div>

        {/* Name + Role */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600">Full Name *</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="e.g., Rahul Sharma"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600">Target Role *</label>
            <input
              type="text"
              value={profile.targetRole}
              onChange={(e) => setProfile({ ...profile, targetRole: e.target.value })}
              placeholder="e.g., Full Stack Developer, Data Scientist"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-indigo-600 shadow-sm"
            />
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-2">
              <Code className="w-4 h-4 text-emerald-600" />
              <span>Technical Skills *</span>
            </label>
            <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${profile.skills.length > 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
              {profile.skills.length} extracted
            </span>
          </div>
          {profile.skills.length === 0 && (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 font-medium">
              ⚠️ No skills detected yet. Upload a resume or add skills manually below.
            </p>
          )}
          <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-slate-50 rounded-2xl border border-slate-200">
            {profile.skills.map((skill) => (
              <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 shadow-sm">
                {skill}
                <button onClick={() => removeSkill(skill)} className="text-slate-400 hover:text-rose-500 transition-all ml-0.5">
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
            {profile.skills.length === 0 && (
              <span className="text-xs text-slate-400 italic px-1 py-1.5">Skills will appear here after upload or manual entry...</span>
            )}
          </div>
          <div className="flex items-center gap-2 max-w-lg">
            <input
              type="text"
              placeholder="Type a skill and press Enter or click Add (e.g., React, Python, Docker)"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSkill()}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 shadow-sm font-semibold"
            />
            <button onClick={addSkill} className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center gap-1 shadow-sm flex-shrink-0">
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Projects */}
        {profile.projects.length > 0 && (
          <div className="space-y-4">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-600" />
              <span>Projects ({profile.projects.length} extracted)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.projects.map((proj, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2 shadow-sm hover:border-indigo-200 transition-all">
                  <input
                    type="text"
                    value={proj.title}
                    onChange={(e) => {
                      const p = [...profile.projects];
                      p[idx] = { ...p[idx], title: e.target.value };
                      setProfile({ ...profile, projects: p });
                    }}
                    className="w-full bg-transparent font-black text-sm text-indigo-900 border-b border-slate-200 focus:border-indigo-600 focus:outline-none pb-1"
                  />
                  <textarea
                    value={proj.description}
                    rows={2}
                    onChange={(e) => {
                      const p = [...profile.projects];
                      p[idx] = { ...p[idx], description: e.target.value };
                      setProfile({ ...profile, projects: p });
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700 focus:outline-none focus:border-indigo-500 font-medium leading-relaxed resize-none shadow-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience + Education */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-amber-600" />
              <span>Experience</span>
            </label>
            <input
              type="text"
              value={profile.experience}
              onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
              placeholder="e.g., 2 years as Software Engineer / Fresher"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600 shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-rose-600" />
              <span>Education</span>
            </label>
            <input
              type="text"
              value={profile.education}
              onChange={(e) => setProfile({ ...profile, education: e.target.value })}
              placeholder="e.g., B.Tech Computer Science, XYZ University 2024"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600 shadow-sm"
            />
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
          <div className="text-xs text-slate-500 font-medium">
            {hasContent ? (
              <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                Profile ready! Click Continue to match with your target JD.
              </span>
            ) : (
              <span className="text-amber-600 font-bold">⚠️ Please enter your name and at least one skill to continue.</span>
            )}
          </div>
          <button
            onClick={onNext}
            disabled={!hasContent}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white font-extrabold shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-purple-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
          >
            <span>Confirm Profile & Continue to JD Match</span>
            <ArrowRight className="w-5 h-5 animate-pulse" />
          </button>
        </div>
      </div>
    </div>
  );
};
