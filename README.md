# AIPrep Pro — AI Question & Answer Maker for Job Interviews
We built this platform to solve a massive, real-world problem faced by almost every college student, fresher, and job seeker today: The Interview Preparation Gap

## 🎯 Problem Statement

Every year, millions of students and job seekers attend interviews unprepared — not because they don't study, but because they study the **wrong things** in the **wrong way**:

| Problem | Impact |
|---------|--------|
| ❌ Don't know what questions a specific company will ask | 73% attend blind |
| ❌ Prepare using generic top-100 question lists | 81% study wrong content |
| ❌ Never practice answering aloud or under timed conditions | 68% lack confidence |
| ❌ Fail to match their skills with the Job Description | 60% miss keyword alignment |

Most existing platforms offer **fixed static question banks** that have no connection to the candidate's actual resume or the target company's requirements.

---

## 💡 Our Solution

**AIPrep Pro** is an AI-powered Interview Preparation System that generates **everything from scratch** by combining:

- 📄 The candidate's **actual resume** (PDF/TXT)
- 📋 The employer's **Job Description** (pasted text)

This produces personalized questions, answers, mock interviews, and feedback that are **uniquely tailored to each individual**.

---

## ✨ Features

### 🔍 Smart Resume Parser
- Handles PDF binary extraction and plain text files
- Detects 100+ technical skills across 25 categories
- Extracts project titles, descriptions, and technologies
- Auto-detects target role (Full Stack, Data Science, DevOps, etc.)
- Parses education, experience, and soft strengths

### 🎯 JD-Resume Match Engine
- Extracts 70+ required skills from JD text
- Matches against resume skills in real-time
- Calculates Overall Fit %, Skill Coverage %, Interview Risk %
- Identifies missing JD keywords and strengths
- Generates a Recruiter-facing Summary

### 🧠 Personalized Q&A Generator
- Creates 14+ questions across Technical, HR/Behavioral, and Role-Based categories
- Each question includes personalized answers using actual project data
- STAR Method breakdowns (Situation, Task, Action, Result)
- Expert tips for each question
- Text-to-speech for listening to answers

### 💬 Untimed Practice Section
- Safe practice zone with all questions as selectable tabs
- Type answers at your own pace
- Instant scoring across 4 dimensions:
  - **Overall** — combined weighted percentage
  - **Structure** — STAR method compliance
  - **Keywords** — JD keyword coverage
  - **Clarity** — tone, length, and professionalism
- Strengths and improvement suggestions
- Side-by-side comparison with AI ideal answer

### 🎥 1-on-1 Human Interviewer Simulator
- Split-screen layout with human interviewer and candidate
- **Live webcam feed** using WebRTC for realistic eye contact
- **Microphone voice recording** using Web Speech Recognition
- **Animated interviewer** with mouth-open/closed crossfade when speaking
- Countdown timer and question progress tracking
- Instant 4-dimension scoring after each answer

### 🏢 Company-Specific Questions
- 11 company presets with real logos:
  - Google, Microsoft, Amazon, Meta, Netflix, Adobe, Flipkart, TCS, Infosys, Zoho
  - Plus "Use My JD Company" for custom JDs
- Each company has unique question focus areas, required skills, and culture signals
- Questions are generated specifically for the selected company's expectations

### 🤖 AI Career Assistant
- Full interactive chat covering 8 topics:
  - Internships, Job Hunting, Resume Tips, Networking
  - Salary Advice, Career Paths, Tech Skills, Company Research
- Voice input support for hands-free interaction
- 8 quick prompt chips for instant answers
- Formatted markdown responses with step-by-step guidance

### 📊 AI Scorecard Reports
- Interview Practice Score with 4-dimension breakdown
- Missing JD keywords highlighted for improvement
- Question-by-question detailed analysis
- Side-by-side answer comparison (your answer vs AI ideal)
- Printable summary for offline review

### 🔐 User Authentication & Persistence
- Login/Register with email and password
- Realistic Google Account Picker modal
- Per-user localStorage data persistence
- Profile, JD, questions, and saved kits restored on login

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        AIPrep Pro Architecture                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐     │
│  │  Resume  │───▶│  Match   │───▶│    AI    │───▶│   Q&A   │     │
│  │  Parser  │    │ Insights │    │ Generator│    │   Bank  │     │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘     │
│                                                                      │
│       │              │               │                │              │
│       ▼              ▼               ▼                ▼              │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐     │
│  │  PDF/    │    │  Skill   │    │ Company  │    │ Practice │     │
│  │  TXT     │    │  Matching│    │ Profiles │    │ & Score  │     │
│  │  Binary  │    │  Engine  │    │ (11 Co.) │    │ Reporter │     │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘     │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │              1-on-1 Mock Interview Simulator                  │   │
│  │  ┌─────────────────┐        ┌──────────────────────────┐    │   │
│  │  │   Human         │        │     Candidate            │    │   │
│  │  │   Interviewer   │  ◀──▶  │     Camera + Mic +       │    │   │
│  │  │   (Animated)    │  Voice │     Answer Input         │    │   │
│  │  └─────────────────┘  Sync  └──────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │              Per-User localStorage Persistence               │   │
│  │  profile | jd | questions | savedKits | currentSession      │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | UI Framework with hooks and components |
| **TypeScript 5.9** | Full type safety across all modules |
| **Vite 7** | Fast build tooling and development server |
| **Tailwind CSS 4** | Utility-first styling and responsive design |
| **Web Speech API** | Voice input (SpeechRecognition) and text-to-speech (SpeechSynthesis) |
| **WebRTC (getUserMedia)** | Live camera feed for mock interview simulation |
| **Canvas Confetti** | Celebration effects on mock interview completion |
| **Lucide React** | Beautiful, consistent UI icons |
| **PDF Binary Parser** | Client-side PDF text extraction without external APIs |
| **localStorage** | Per-user data persistence for profiles, questions, and history |
| **Clearbit Logo API** | Real company logos for the company selection grid |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **npm** or **yarn** or **pnpm**

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/aiprep-pro.git

# Navigate to the project
cd aiprep-pro

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be running at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── AuthPage.tsx           # Login / Register with Google Picker
│   ├── Navbar.tsx             # Left-side hamburger navigation
│   ├── ExplanationReviewer.tsx # About page (reviewer presentation)
│   ├── ResumeUploadStep.tsx   # Step 1: Resume upload & parser
│   ├── JDUploadStep.tsx       # Step 2: Job Description upload
│   ├── MatchInsights.tsx      # Step 3: Fit/Skills/Risk analysis
│   ├── QuestionBankStep.tsx   # Step 4: Personalized Q&A bank
│   ├── PracticeSection.tsx    # Step 5: Untimed practice with scoring
│   ├── InterviewSetup.tsx     # Company selection & config modal
│   ├── MockPracticeModal.tsx  # Step 6: 1-on-1 interview simulator
│   ├── FeedbackReport.tsx     # Step 7: Final scorecard report
│   ├── SavedKits.tsx          # Saved interview preparation history
│   └── AIAssistant.tsx        # AI Career guidance chat
│
├── data/
│   ├── samplePresets.ts       # Type definitions (CandidateProfile, etc.)
│   └── companyProfiles.ts     # 11 company presets with logos & focus
│
├── utils/
│   ├── aiGenerator.ts         # Question/answer generation engine
│   ├── matchInsights.ts       # Skill matching & scoring algorithms
│   └── resumeParser.ts        # PDF binary & text resume extraction
│
├── App.tsx                    # Main app with routing & state
├── main.tsx                   # Entry point
└── index.css                  # Global styles & animations
```

---

## 🔄 How It Works

### Step 1: Resume Upload
User uploads a PDF or TXT resume. The multi-pass parser extracts skills, projects, education, experience, and auto-detects the target role.

### Step 2: Job Description Match
User pastes the target JD. The parser identifies 70+ required skills, responsibilities, and company details. Real-time skill matching is displayed.

### Step 3: Match Insights
The system generates Overall Fit %, Skill Coverage %, Interview Risk %, Detected Strengths, Missing Keywords, and a Recruiter Summary.

### Step 4: Question & Answer Bank
AI generates 14+ personalized questions with STAR-structured answers, expert tips, and text-to-speech support.

### Step 5: Untimed Practice
Candidates practice answering freely and receive instant 4-dimension scoring (Overall, Structure, Keywords, Clarity).

### Step 6: Company-Specific Mock Interview
Select a company (Google, Amazon, TCS, etc.), configure interview type and difficulty, then face a human interviewer with live webcam, voice recognition, and real-time scoring.

### Step 7: AI Scorecard Report
Final comprehensive report with per-question analysis, side-by-side comparison, missing keywords, and printable summary.

---

## 🏢 Supported Companies

| Company | Focus Areas |
|---------|------------|
| 🔵 Google | Algorithmic thinking, system design, scalability |
| 🟢 Microsoft | Cloud/Azure, enterprise reliability, customer obsession |
| 🟠 Amazon | Leadership principles, ownership, high-scale architecture |
| 🔷 Meta | Product metrics, React, performance optimization |
| 🔴 Netflix | Microservices, resilience, incident response |
| 🔴 Adobe | Frontend quality, design collaboration, accessibility |
| 🟡 Flipkart | E-commerce scale, database optimization, peak traffic |
| 🔵 TCS | OOPS/DBMS fundamentals, client communication, aptitude |
| 🔵 Infosys | Programming basics, project explanation, client readiness |
| 🟡 Zoho | Hands-on coding logic, database design, product thinking |
| ⚪ Custom | Questions based on your pasted job description |

---

## 📊 MVP Scope — 100% Completed

| # | Feature | Status |
|---|---------|--------|
| 1 | PDF/TXT Resume Parsing Engine | ✅ Completed |
| 2 | Job Description Parsing & Matching | ✅ Completed |
| 3 | Match Insights Dashboard | ✅ Completed |
| 4 | Dynamic 14+ Question Bank Generator | ✅ Completed |
| 5 | Personalized AI Answer Suggestions | ✅ Completed |
| 6 | Untimed Practice Section | ✅ Completed |
| 7 | Company-Specific Mock Interviews (11 Companies) | ✅ Completed |
| 8 | 1-on-1 Human Interviewer Simulator | ✅ Completed |
| 9 | AI Feedback & Scorecard Reports | ✅ Completed |
| 10 | AI Career Assistant Chat | ✅ Completed |
| 11 | User Auth & Per-User Data Persistence | ✅ Completed |

---

## 🎯 Key Differentiators

| Feature | AIPrep Pro | Generic Platforms |
|---------|-----------|-------------------|
| Resume-specific questions | ✅ Generated from YOUR projects | ❌ Fixed question banks |
| JD keyword matching | ✅ 70+ skills in real-time | ❌ No JD analysis |
| STAR method answers | ✅ Personalized with YOUR data | ❌ Generic templates |
| Live interview simulation | ✅ Webcam + Voice + Timer | ❌ Text-only quizzes |
| Company-specific questions | ✅ 11 companies with logos | ❌ Generic advice |
| Instant scoring | ✅ 4-dimension percentages | ❌ Basic pass/fail |
| AI career assistant | ✅ Full chat with voice | ❌ No career guidance |
| User data persistence | ✅ Per-user localStorage | ❌ Session-only |
| No external API calls | ✅ Runs 100% in browser | ❌ Requires server |

---

## 📱 Responsive Design

The application is fully responsive and works on:
- 🖥️ Desktop (1200px+)
- 💻 Laptop (768px - 1199px)
- 📱 Mobile (320px - 767px)

---

## 🔧 Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
```

---

## 🙏 Acknowledgments

- [React](https://react.dev/) — UI framework
- [Vite](https://vitejs.dev/) — Build tool
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS
- [Lucide Icons](https://lucide.dev/) — Icon library
- [Clearbit](https://clearbit.com/) — Company logos
- [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) — Celebration effects

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---
