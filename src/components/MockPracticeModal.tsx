import React, { useState, useEffect, useRef } from 'react';
import { GeneratedQuestion } from '../data/samplePresets';
import { evaluatePracticeAnswer } from '../utils/aiGenerator';
import { computeFeedbackMetrics } from '../utils/matchInsights';
import type { InterviewConfig } from './InterviewSetup';
import { Mic, MicOff, Clock, ArrowRight, X, Video, VideoOff, Volume2, Award, CheckCircle2, AlertCircle, BarChart3, MessageSquare, UserCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  questions: GeneratedQuestion[];
  initialIndex?: number;
  onClose: () => void;
  onComplete: (updatedQuestions: GeneratedQuestion[]) => void;
  jdSkills: string[];
  roleName: string;
  interviewConfig: InterviewConfig;
}

export const MockPracticeModal: React.FC<Props> = ({ questions, initialIndex = 0, onClose, onComplete, jdSkills, roleName, interviewConfig }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [answerText, setAnswerText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [currentQuestionsState, setCurrentQuestionsState] = useState<GeneratedQuestion[]>(questions);

  const [isCamActive, setIsCamActive] = useState(false);
  const [isInterviewerSpeaking, setIsInterviewerSpeaking] = useState(false);
  const [scoreModalData, setScoreModalData] = useState<any | null>(null);

  const recognitionRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const lastTranscriptRef = useRef<string>('');

  const displayQuestions = currentQuestionsState.length > 0 ? currentQuestionsState : questions;

  // Timer
  useEffect(() => {
    const interval = setInterval(() => { setTimerSeconds(prev => prev + 1); }, 1000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  // Reset & Interviewer auto-reads the question aloud
  useEffect(() => {
    setTimerSeconds(0);
    const userPrev = displayQuestions[currentIndex]?.userPracticeAnswer || '';
    setAnswerText(userPrev);
    lastTranscriptRef.current = userPrev;

    const q = displayQuestions[currentIndex];
    if (q && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(q.question);
      utterance.onstart = () => setIsInterviewerSpeaking(true);
      utterance.onend = () => setIsInterviewerSpeaking(false);
      utterance.onerror = () => setIsInterviewerSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  }, [currentIndex, displayQuestions]);

  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  // Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
        if (finalTranscript.trim()) {
          setAnswerText(prev => {
            lastTranscriptRef.current = (prev + finalTranscript).trim();
            return (prev + finalTranscript).trim();
          });
        }
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => { if (isRecording) { try { recognition.start(); } catch(e) {} } };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleCam = async () => {
    if (isCamActive) {
      if (streamRef.current) { streamRef.current.getTracks().forEach(track => track.stop()); streamRef.current = null; }
      if (videoRef.current) videoRef.current.srcObject = null;
      setIsCamActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setIsCamActive(true);
      } catch (err) { alert("Unable to access camera. Please check permissions."); }
    }
  };

  const toggleRecording = () => {
    if (isRecording) { if (recognitionRef.current) recognitionRef.current.stop(); setIsRecording(false); }
    else {
      if (recognitionRef.current) { try { recognitionRef.current.start(); setIsRecording(true); } catch(e) {} }
      else {
        setIsRecording(true);
        const simPhrases = ["In my previous project, I implemented a robust backend structure.", "I used React and Tailwind CSS for the frontend.", "We faced tight deadlines but used agile sprints.", "I am highly motivated to join your engineering team."];
        let step = 0;
        const interval = setInterval(() => {
          if (step < simPhrases.length) { setAnswerText(prev => (prev + " " + simPhrases[step]).trim()); step++; }
          else { clearInterval(interval); setIsRecording(false); }
        }, 2500);
      }
    }
  };

  const handleNextSubmit = () => {
    if (isRecording && recognitionRef.current) recognitionRef.current.stop();
    setIsRecording(false);

    const keywordsToCheck = [...jdSkills, 'react', 'node', 'database', 'scalable', 'team', 'lead', 'agile', 'api', 'security', 'optimized'];
    const feedback = evaluatePracticeAnswer(answerText, displayQuestions[currentIndex].personalizedAnswer, keywordsToCheck);
    const metrics = computeFeedbackMetrics(answerText, keywordsToCheck);

    const updated = [...displayQuestions];
    updated[currentIndex] = {
      ...displayQuestions[currentIndex],
      userPracticeAnswer: answerText,
      feedback: { ...feedback, score: metrics.overall }
    };
    setCurrentQuestionsState(updated);
    setScoreModalData({ feedback, metrics });
  };

  const proceedToNextAfterScore = () => {
    setScoreModalData(null);
    if (currentIndex < displayQuestions.length - 1) { setCurrentIndex(currentIndex + 1); }
    else {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
      onComplete(currentQuestionsState);
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!displayQuestions[currentIndex]) return null;
  const q = displayQuestions[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xl p-4 sm:p-6 overflow-y-auto animate-fade-in text-slate-800">

      <div className="w-full max-w-6xl bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative my-auto">

        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
              Q{currentIndex + 1}
            </div>
            <div>
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-xs uppercase tracking-wider inline-block mb-1">
                {roleName} • {interviewConfig.difficulty === 'intern' ? 'Intern/Fresher' : interviewConfig.difficulty === 'intermediate' ? 'Intermediate' : 'Senior'}
              </span>
              <p className="text-xs text-slate-500 font-medium">Question {currentIndex + 1} of {displayQuestions.length} • Live 1-on-1 Interview</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 font-mono text-xs text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border font-bold">
              <Clock className="w-4 h-4 text-indigo-600 animate-spin" />
              <span>{formatTime(timerSeconds)}</span>
            </div>
            <button onClick={onClose} className="p-2.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-all border border-slate-200">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Split Screen: Human Interviewer (Left) vs Candidate (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Human Interviewer Panel (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-700/50 flex flex-col justify-between relative overflow-hidden space-y-6">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center justify-between relative z-10 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                {/* Interviewer Avatar - Human Image */}
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-lg border-2 border-white/20 flex-shrink-0 bg-slate-700">
                  <img
                    src="/interviewer-human.png"
                    alt="Human Interviewer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to a colored placeholder if image fails to load
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>';
                    }}
                  />
                  {/* Live status indicator */}
                  <span className="absolute bottom-0 right-0 flex h-3.5 w-3.5">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isInterviewerSpeaking ? 'bg-amber-400 opacity-75' : 'bg-emerald-400 opacity-75'}`}></span>
                    <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${isInterviewerSpeaking ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-white flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    Human Interviewer
                  </h3>
                  <p className="text-xs text-slate-300 flex items-center gap-1.5 font-mono mt-0.5">
                    <span className={`w-2 h-2 rounded-full ${isInterviewerSpeaking ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`}></span>
                    <span>{isInterviewerSpeaking ? "Interviewer is asking the question..." : "Interviewer is listening to your response..."}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  if ('speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                    const u = new SpeechSynthesisUtterance(q.question);
                    u.onstart = () => setIsInterviewerSpeaking(true);
                    u.onend = () => setIsInterviewerSpeaking(false);
                    u.onerror = () => setIsInterviewerSpeaking(false);
                    window.speechSynthesis.speak(u);
                  }
                }}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-semibold border border-white/10 flex items-center gap-1 flex-shrink-0 shadow-sm"
                title="Repeat Question Audio"
              >
                <Volume2 className="w-4 h-4" />
                <span>Repeat</span>
              </button>
            </div>

            {/* Human Interviewer Photo Display Box - Crossfades between idle & speaking images */}
            <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden relative shadow-inner flex flex-col items-center justify-center min-h-[200px]">
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 via-transparent to-slate-900/30 pointer-events-none"></div>

              {/* Speaking Image (mouth open) - always mounted for smooth crossfade */}
              <img
                src="/interviewer-speaking.png"
                alt="Interviewer Speaking"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                  isInterviewerSpeaking ? 'opacity-100' : 'opacity-0'
                }`}
                onError={(e) => { (e.target as HTMLImageElement).src = '/interviewer-human.png'; }}
              />

              {/* Idle Image (mouth closed) - base layer */}
              <img
                src="/interviewer-human.png"
                alt="Human Interviewer"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                  isInterviewerSpeaking ? 'opacity-0' : 'opacity-100'
                }`}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent && !parent.querySelector('.fallback-avatar')) {
                    const div = document.createElement('div');
                    div.className = 'fallback-avatar flex flex-col items-center justify-center h-full w-full bg-gradient-to-b from-slate-800 to-slate-900 p-6';
                    div.innerHTML = '<div class="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg mb-4 border-2 border-white/20"><svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div><span class="text-sm font-bold text-slate-300">Interviewer</span>';
                    parent.appendChild(div);
                  }
                }}
              />

              {/* Speaking animation overlay */}
              {isInterviewerSpeaking && (
                <div className="absolute inset-0 flex items-end justify-center pb-3 pointer-events-none">
                  <div className="flex items-center gap-1 px-4 py-2 rounded-full bg-black/70 backdrop-blur-md shadow-lg">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
                      <span key={i} className={`w-[3px] rounded-full ${i % 2 === 0 ? 'bg-amber-400 h-5 animate-[pulse_0.8s_ease-in-out_infinite]' : 'bg-amber-300 h-2.5 animate-[bounce_0.6s_ease-in-out_infinite]'}`}
                        style={{ animationDelay: `${i * 60}ms` }}></span>
                    ))}
                  </div>
                </div>
              )}

              {/* Idle standby indicator */}
              {!isInterviewerSpeaking && (
                <div className="absolute bottom-3 left-3 right-3 flex justify-center pointer-events-none">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[10px] text-slate-300 font-bold">Ready — Listening</span>
                  </div>
                </div>
              )}

              {/* Interviewer Name Tag */}
              <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Live Interview Session</span>
              </div>
            </div>

            {/* Question Display */}
            <div className="space-y-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-black uppercase tracking-wider">
                <BarChart3 className="w-3.5 h-3.5" />
                {q.category === 'technical' ? '💻 Technical Question' : q.category === 'role_based' ? '🎯 Role Alignment' : '🌱 HR / Behavioral'}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
                "{q.question}"
              </h2>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 leading-relaxed font-medium">
                <span className="font-bold text-indigo-300">💡 Why the interviewer is asking: </span>
                <span>{q.whyAsked}</span>
              </div>
            </div>

            <div className="text-xs text-slate-400 border-t border-white/10 pt-4 flex items-center justify-between font-medium">
              <span>🎯 STAR Method Recommended</span>
              <span>Type: {interviewConfig.interviewType === 'mixed' ? 'Mixed HR + Technical' : interviewConfig.interviewType === 'technical' ? 'Technical' : 'HR/Behavioral'}</span>
            </div>
          </div>

          {/* Candidate Camera & Answer Panel (7 cols) */}
          <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">

            {/* Live Camera View Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-4 shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                  <h4 className="font-extrabold text-sm text-slate-900">Your Live Feed & Eye Contact</h4>
                </div>
                <button
                  onClick={toggleCam}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all ${
                    isCamActive ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-indigo-600 text-white hover:bg-indigo-500'
                  }`}
                >
                  {isCamActive ? <Video className="w-3.5 h-3.5 animate-pulse text-emerald-600" /> : <VideoOff className="w-3.5 h-3.5" />}
                  <span>{isCamActive ? "Camera Active" : "Open Camera"}</span>
                </button>
              </div>

              <div className="relative w-full h-48 sm:h-60 rounded-2xl bg-slate-900 overflow-hidden border border-slate-800 flex items-center justify-center shadow-inner">
                <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${isCamActive ? 'block' : 'hidden'}`} />
                {!isCamActive && (
                  <div className="text-center p-6 space-y-2">
                    <div className="w-14 h-14 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto border border-slate-700 shadow-sm">
                      <VideoOff className="w-7 h-7 text-slate-500" />
                    </div>
                    <p className="text-xs text-slate-300 font-extrabold">Camera is currently inactive</p>
                    <p className="text-[11px] text-slate-500 max-w-xs mx-auto">Click "Open Camera" above to enable live video feed and practice realistic interview eye contact with the interviewer.</p>
                  </div>
                )}
                {isCamActive && (
                  <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-2 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Candidate Live Stream</span>
                  </div>
                )}
              </div>
            </div>

            {/* Answer & Mic Dictation Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-4 shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-indigo-600" />
                  <span>Your Answer to the Interviewer</span>
                  {isRecording && (
                    <span className="flex items-center gap-1.5 text-rose-600 text-xs animate-pulse font-bold">
                      <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                      <span>Recording...</span>
                    </span>
                  )}
                </label>

                <button
                  onClick={toggleRecording}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-extrabold text-xs shadow-sm transition-all ${
                    isRecording ? 'bg-rose-600 text-white animate-pulse shadow-rose-500/20' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/20'
                  }`}
                >
                  {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 animate-bounce" />}
                  <span>{isRecording ? "Stop Microphone" : "🎙️ Speak Answer"}</span>
                </button>
              </div>

              <textarea
                rows={4}
                value={answerText}
                onChange={(e) => { setAnswerText(e.target.value); lastTranscriptRef.current = e.target.value; }}
                placeholder="Click '🎙️ Speak Answer' above to dictate or type your response here directly. Use specific project metrics and the STAR method..."
                className="w-full bg-white border border-slate-300 rounded-xl p-4 text-xs text-slate-800 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 font-medium leading-relaxed resize-none shadow-sm"
              />

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pt-1">
                <span>Words: {answerText ? answerText.trim().split(/\s+/).filter(Boolean).length : 0}</span>
                <span>Target: ~40+ words with STAR structure</span>
              </div>

              <button
                onClick={handleNextSubmit}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-purple-600 transition-all flex items-center justify-center gap-2 scale-102 mt-2"
              >
                <span>{currentIndex < displayQuestions.length - 1 ? "Submit Answer & Next Question →" : "Submit Interview & Get Scorecard"}</span>
                <ArrowRight className="w-4 h-4 animate-pulse" />
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Score Modal with Overall, Structure, Keywords, Clarity */}
      {scoreModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="max-w-lg w-full bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-md">
              <Award className="w-8 h-8 animate-bounce" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                Interviewer Feedback & Grading
              </span>

              {/* Score Breakdown: Overall, Structure, Keywords, Clarity */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                {[
                  { label: 'Overall', value: scoreModalData.metrics.overall, color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
                  { label: 'Structure', value: scoreModalData.metrics.structure, color: 'bg-purple-100 text-purple-800 border-purple-200' },
                  { label: 'Keywords', value: scoreModalData.metrics.keywords, color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
                  { label: 'Clarity', value: scoreModalData.metrics.clarity, color: 'bg-amber-100 text-amber-800 border-amber-200' }
                ].map((m, i) => (
                  <div key={i} className={`p-3 rounded-xl border ${m.color} space-y-1 shadow-sm`}>
                    <div className="text-xs font-bold uppercase">{m.label}</div>
                    <div className="text-2xl font-black">{m.value}%</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-xs pt-2">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5 shadow-sm">
                <span className="font-black text-emerald-800 flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Strengths Found</span>
                </span>
                <ul className="text-slate-700 list-disc list-inside font-medium space-y-1">
                  {scoreModalData.feedback.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5 shadow-sm">
                <span className="font-black text-amber-800 flex items-center gap-1.5 mb-1">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Areas for Polish</span>
                </span>
                <ul className="text-slate-700 list-disc list-inside font-medium space-y-1">
                  {scoreModalData.feedback.improvements.map((imp: string, i: number) => <li key={i}>{imp}</li>)}
                </ul>
              </div>
            </div>

            <button
              onClick={proceedToNextAfterScore}
              className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 scale-102 mt-2"
            >
              <span>{currentIndex < displayQuestions.length - 1 ? `Next Question (${currentIndex + 2}/${displayQuestions.length})` : "Complete Interview & View Final Scorecard"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
