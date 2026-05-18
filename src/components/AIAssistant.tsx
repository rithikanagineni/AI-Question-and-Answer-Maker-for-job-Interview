import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, Mic, User, RefreshCw } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  { icon: '🎓', label: 'Internship tips', prompt: 'How do I find and land a good software internship as a fresher?' },
  { icon: '💼', label: 'Job hunting', prompt: 'What is the best strategy to get my first tech job with no experience?' },
  { icon: '📄', label: 'Resume help', prompt: 'How should I improve my resume as a fresher with only college projects?' },
  { icon: '🤝', label: 'Networking', prompt: 'How do I build a professional network on LinkedIn as a student?' },
  { icon: '💰', label: 'Salary advice', prompt: 'What salary should I expect for a fresher software engineer in India?' },
  { icon: '🚀', label: 'Career path', prompt: 'What is the best career path to become a Full Stack Developer?' },
  { icon: '📊', label: 'Tech trends', prompt: 'What are the most in-demand tech skills in 2025 for jobs?' },
  { icon: '🏢', label: 'Top companies', prompt: 'Which companies hire freshers and interns the most in tech?' },
];

function generateAssistantResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();

  // Internship-related
  if (msg.includes('internship') || msg.includes('intern')) {
    return `**Finding & Landing Internships 🎓**

Here's a proven strategy to land a great internship:

**Where to Search:**
- **LinkedIn** — Set up job alerts for "Software Intern" in your target city or remote
- **Internshala** — India's largest internship platform for students
- **AngelList / Wellfound** — Great for startup internships
- **Company Career Pages** — Check Google, Microsoft, Amazon, Flipkart, Razorpay directly
- **College Placement Cell** — Don't ignore this! Many top companies recruit exclusively through colleges

**How to Stand Out:**
1. 🛠️ **Build 2-3 solid GitHub projects** — Recruiters scroll LinkedIn & GitHub together
2. 📝 **Tailor your resume** to each company's tech stack (this app helps you with that!)
3. 🌐 **Write a clear LinkedIn headline** like: "Final Year CS Student | React & Node.js Developer | Seeking Internship"
4. ✉️ **Apply early** — Internship cycles for big companies open 3-4 months ahead
5. 🤝 **Reach out to alumni** from your college working at target companies

**Tip:** Apply to 20-30 places at once. Internship hunting is a numbers game — quality applications + quantity = success!

What specific type of internship are you looking for? (Frontend, Backend, ML, Design, etc.) I can give more targeted advice!`;
  }

  // First job / job hunting
  if (msg.includes('first job') || msg.includes('job hunt') || msg.includes('no experience') || msg.includes('fresher job')) {
    return `**Getting Your First Tech Job as a Fresher 🚀**

Landing your first job without experience feels hard — but here's the secret: **companies hire based on potential, not just experience**.

**Step-by-Step Action Plan:**

**1. Build a Portfolio (Most Important)**
- 2-3 full projects on GitHub with clean code
- Deploy them live (Netlify / Vercel / Railway — all free)
- Write a README that explains what the project does and why you built it

**2. Optimise Your Resume**
- Keep it 1 page maximum
- Put your strongest skills and projects at the top
- Use action verbs: "Built", "Developed", "Improved", "Deployed", "Reduced"
- Include your GitHub link and LinkedIn URL

**3. Target the Right Companies**
- **Startups** (50-500 employees) hire freshers fastest
- Product companies (Razorpay, Swiggy, CRED, etc.) offer great learning
- Service companies (TCS, Infosys, Wipro) offer volume hiring through off-campus drives

**4. Interview Prep (Use this platform!)**
- Practice DSA on LeetCode (Easy + Medium) 
- Revise core CS subjects: DBMS, OS, Networks, OOPS
- System design basics for roles paying > ₹8 LPA

**5. Job Portals to Use**
- LinkedIn, Naukri, Instahyre, Cutshort, Hapramp, FoundIt

You've got this! Want me to help you with any specific part — like your resume bullets or how to prepare for technical rounds?`;
  }

  // Resume help
  if (msg.includes('resume') || msg.includes('cv')) {
    return `**Building a Winning Fresher Resume 📄**

Your resume is your first impression — make it count!

**Key Sections (in order):**
1. **Contact Info** — Name, Phone, Email, LinkedIn, GitHub (no photo needed)
2. **Summary** — 2-3 lines: "Final year B.Tech CS student with hands-on experience in React and Node.js, seeking a Full Stack Developer role"
3. **Skills** — Group by category: Frontend, Backend, Database, Tools
4. **Projects** — Most important for freshers! Use this format:
   - **Project Name** | Tech Stack used
   - "Built a [what it does] that [impact/outcome]"
   - Include GitHub link + Live Demo link
5. **Education** — Degree, University, Year, CGPA (if > 7.5)
6. **Internships** (if any)
7. **Certifications** — AWS, Google, Coursera (relevant ones only)
8. **Achievements** — Hackathons, coding contest rankings, open source

**Common Mistakes to Avoid:**
- ❌ Objective statements ("I want to work at a reputed company...")
- ❌ Listing skills you barely know (interviewers WILL ask!)
- ❌ Adding a photo, marital status, references
- ❌ Using tables in resume (ATS systems can't parse them)

**Best Free Tools:**
- Overleaf (LaTeX resume templates) — looks professional
- Resume.io — Clean modern template
- Canva — Visually appealing but avoid heavy designs for ATS

Want me to review specific resume bullet points you've written?`;
  }

  // Salary / compensation
  if (msg.includes('salary') || msg.includes('pay') || msg.includes('compensation') || msg.includes('ctc') || msg.includes('package')) {
    return `**Fresher Software Engineer Salary Guide 💰**

Salaries vary a lot based on company type, role, and location. Here's a realistic breakdown:

**India (2025 estimates):**
| Company Type | Annual CTC (₹) |
|---|---|
| Top Product (Google, MS, Amazon) | 15-50 LPA |
| Tier 1 Product (Razorpay, Swiggy, Zepto) | 10-25 LPA |
| Tier 2 Product (Startups, funded) | 6-15 LPA |
| IT Services (TCS, Infosys, Wipro) | 3-5 LPA |
| Mid-size Services | 4-8 LPA |

**Global / Remote (USD):**
- US/Canada: $80K - $140K+
- Europe: €40K - €80K
- Remote-first startups: $20K - $70K

**Tips to Negotiate:**
1. Always wait for them to name a number first
2. Research role + city on Glassdoor, Levels.fyi, AmbitionBox
3. Counter 15-20% above their offer
4. Ask about: joining bonus, stock options (ESOP), health insurance
5. Never accept verbally immediately — take 24-48 hours to "discuss with family"

**Skill Premium Skills (higher salary):**
- Machine Learning / AI: +30-50%
- System Design expertise: +20-30%
- Cloud certifications (AWS/Azure): +15-25%

What's your current profile? I can give more tailored salary expectations!`;
  }

  // Career path
  if (msg.includes('career path') || msg.includes('career') || msg.includes('roadmap') || msg.includes('full stack') || msg.includes('data science') || msg.includes('machine learning')) {
    return `**Tech Career Roadmap Guide 🗺️**

Here are the most popular and in-demand paths in 2025:

**1. Full Stack Web Developer**
- Frontend: HTML/CSS → JavaScript → React or Vue
- Backend: Node.js → Express → REST APIs → Databases (PostgreSQL, MongoDB)
- Tools: Git, Docker, basic AWS/Vercel
- ⏱️ Timeline: 6-12 months to job-ready
- 💰 Fresher salary: ₹5-18 LPA

**2. Data Scientist / ML Engineer**
- Python → NumPy/Pandas → Scikit-learn → PyTorch/TensorFlow
- Mathematics: Statistics, Linear Algebra, Probability
- Deploy: FastAPI → Docker → Cloud (AWS SageMaker)
- ⏱️ Timeline: 8-15 months to job-ready
- 💰 Fresher salary: ₹6-20 LPA

**3. DevOps / Cloud Engineer**
- Linux basics → Docker → Kubernetes → CI/CD (GitHub Actions, Jenkins)
- Cloud: AWS/Azure certification
- ⏱️ Timeline: 8-12 months
- 💰 Fresher salary: ₹6-15 LPA

**4. Competitive Programming → SDE at FAANG**
- LeetCode (500+ problems) → Codeforces / CodeChef
- System Design (after 1-2 years)
- ⏱️ Timeline: 12-18 months serious prep
- 💰 Salary: ₹20-50 LPA (FAANG India)

Which path interests you most? I can create a week-by-week learning plan for you!`;
  }

  // LinkedIn / networking
  if (msg.includes('linkedin') || msg.includes('network') || msg.includes('connection')) {
    return `**LinkedIn & Professional Networking Guide 🤝**

LinkedIn is the most powerful tool for getting hired — especially for referrals!

**Setting Up a Strong Profile:**
1. **Professional photo** — Clear face, light background, business casual
2. **Compelling headline** (not just "Student at XYZ") — Try: "Full Stack Developer | Building scalable web apps with React & Node.js | Open to opportunities"
3. **About section** — Your story in 3-4 sentences: who you are, what you build, what you're looking for
4. **Featured section** — Add your best projects, GitHub, or portfolio website
5. **Skills section** — Add top 5-10 relevant skills and ask friends to endorse them

**Content Strategy:**
- Post once a week about what you're learning or building
- Share projects with screenshots and brief writeups
- Comment genuinely on posts by engineers at your target companies
- React and repost interesting technical content

**Reaching Out for Referrals:**
Message template:
> "Hi [Name], I'm a [Year] CS student passionate about [Area]. I noticed you work at [Company] as a [Role] — I admire [specific thing]. I'd love to hear about your journey and any tips for someone looking to join. Would you have 15 minutes for a quick call?"

**Key Groups & Hashtags:**
- #TechJobs #HiringFreshers #OpenToWork
- Join: "CSE Placement Group", "Tech Interview Prep", "Remote Jobs India"

Want a personalized LinkedIn headline or message template based on your specific role?`;
  }

  // Tech skills / trends
  if (msg.includes('skill') || msg.includes('trend') || msg.includes('learn') || msg.includes('technology') || msg.includes('demand')) {
    return `**Most In-Demand Tech Skills in 2025 📊**

Based on job market data across LinkedIn, Glassdoor, and job boards:

**🔥 Hottest Right Now:**
1. **AI / ML Engineering** — LLM fine-tuning, RAG systems, LangChain — highest salary premium
2. **Full Stack (React + Node/Python)** — Still the #1 volume hiring category
3. **Cloud & DevOps** — AWS + Kubernetes expertise is gold
4. **Cybersecurity** — Massive shortage of qualified engineers globally
5. **Mobile (Flutter, React Native)** — Cross-platform is winning

**Emerging & High-Growth:**
- **Prompt Engineering / AI Product** — New role, fast-growing
- **Blockchain / Web3** — Volatile but high paying during bull markets
- **Computer Vision + IoT** — Manufacturing and automotive sectors booming
- **Data Engineering** (Spark, Kafka, dbt) — Often undiscovered, very high pay

**Skills by ROI (Learning Time vs Salary Impact):**
| Skill | Learn Time | Salary Impact |
|---|---|---|
| React + TypeScript | 3 months | High |
| Python + ML basics | 4 months | Very High |
| AWS Certified | 2 months | High |
| Docker + Kubernetes | 2 months | Medium-High |
| System Design | Ongoing | Very High |

**Free Learning Resources:**
- freeCodeCamp, The Odin Project (Web Dev)
- fast.ai, Andrew Ng's Coursera (AI/ML)
- TechWorld with Nana (DevOps)
- NeetCode, Striver (DSA)

What skill are you looking to build? I can give you a specific 30-day learning plan!`;
  }

  // Top companies / where to apply
  if (msg.includes('compan') || msg.includes('where to apply') || msg.includes('best company') || msg.includes('top company')) {
    return `**Best Companies to Apply as a Fresher / Intern 🏢**

**Tier 1 — Dream Companies (Competitive, High Pay)**
- Google, Microsoft, Amazon, Meta, Apple (FAANG)
- Apply: 6-12 months of serious DSA prep + projects

**Tier 2 — Great Product Companies (India)**
- Razorpay, Swiggy, Zomato, CRED, Zepto, Meesho, Juspay
- Groww, Slice, PhonePe, Navi, Ola, Uber India
- Requires strong projects + basic DSA

**Tier 3 — Fast Growing Startups (Great Learning)**
- Find on AngelList, LinkedIn, YC's Work at a Startup
- Equity (ESOPs) can be very valuable
- Faster promotions and more responsibility

**Large IT Services (Volume Hiring)**
- TCS, Infosys, Wipro, HCL, Cognizant, Capgemini
- Apply off-campus through company portals and Naukri

**Mass Hiring Programs:**
- **TCS NQT** — National Qualifier Test (apply at tcs.com/careers)
- **Infosys InfyTQ** — Apply at infytq.infosys.com
- **Wipro NLTH** — National Level Test for Hiring
- **Cognizant GenC** — cognizant.com/careers

**Startup Job Boards:**
- Instahyre, Cutshort, AngelList, WorkIndia, Hapramp

**Upcoming Hackathons (Win = Fast Track Interview):**
- Smart India Hackathon (govt. organized, huge prize)
- HackWithInfy, TCS HackQuest
- Flipkart Grid, Amazon Hackon

Want help preparing for any specific company's interview process?`;
  }

  // Interview tips generic
  if (msg.includes('interview') || msg.includes('prepare') || msg.includes('how to answer') || msg.includes('dsa') || msg.includes('coding round')) {
    return `**Comprehensive Interview Preparation Guide 🎯**

**Phase 1: Technical Rounds**

**Coding / DSA Round:**
- Practice on LeetCode: 50 Easy + 100 Medium is enough for most companies
- Focus topics: Arrays, Strings, Linked Lists, Trees, Dynamic Programming, Graphs
- Resources: Striver's SDE Sheet, NeetCode 150

**Core CS Concepts (must know):**
- **DBMS**: Normalization, Joins, Indexing, Transactions, ACID
- **OS**: Processes, Threads, Deadlock, Memory Management, Scheduling
- **OOPS**: Inheritance, Polymorphism, Encapsulation, Abstraction
- **Networks**: TCP/IP, HTTP/HTTPS, DNS, REST vs GraphQL

**Phase 2: Project-Based Questions**
Use this app! Upload your resume → it generates questions specifically about your projects like:
- "Explain the architecture of your CRUD app"
- "How did you handle authentication in your project?"
- "What was the biggest challenge you faced and how did you resolve it?"

**Phase 3: HR Round**
Key questions to prepare:
1. "Tell me about yourself" — 60-second elevator pitch
2. "Why this company?" — Research their product, values, recent news
3. "Where do you see yourself in 5 years?" — Align with company growth
4. "What are your weaknesses?" — Genuine weakness + what you're doing to improve

**During the Interview:**
- Think aloud — interviewers want to hear your reasoning
- Ask clarifying questions before coding
- Test your solution with 2-3 examples before submitting
- It's OK to say "I'm not sure, but here's how I would approach this..."

Use the Practice Section in this app to drill answers and get instant scoring! Want tips for a specific type of interview?`;
  }

  // Default helpful response
  return `**Hi! I'm your AI Career Assistant 🤖✨**

I'm here to help you with everything related to your career journey! Here's what I can guide you on:

🎓 **Internships** — Finding, applying, acing interviews for internships
💼 **Job Hunting** — Strategies, portals, off-campus drives, referrals  
📄 **Resume Building** — Writing strong bullet points, choosing the right format
🤝 **Networking** — LinkedIn strategy, reaching out to professionals, cold messaging
💰 **Salary Negotiation** — Market rates, how to counter-offer, equity basics
🚀 **Career Paths** — Full Stack, ML, DevOps, Mobile — roadmaps for each
📊 **Tech Skills** — What to learn in 2025, best resources, learning timelines
🏢 **Company Research** — Which companies hire freshers, application tips, culture

**Just ask me anything like:**
- *"How do I get an internship at a startup?"*
- *"What should I put on my resume with no experience?"*
- *"How do I prepare for a Google interview?"*
- *"What salary should I negotiate for?"*

What would you like help with today?`;
}

export const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: generateAssistantResponse('welcome'),
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: `u_${Date.now()}`, role: 'user', content: text.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAssistantResponse(text);
      const botMsg: Message = { id: `b_${Date.now()}`, role: 'assistant', content: response, timestamp: new Date() };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputText);
    }
  };

  const toggleListening = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert('Voice input is not supported in this browser.'); return; }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      const rec = new SR();
      rec.lang = 'en-US';
      rec.interimResults = false;
      rec.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setInputText(prev => (prev ? prev + ' ' + transcript : transcript));
      };
      rec.onend = () => setIsListening(false);
      rec.onerror = () => setIsListening(false);
      rec.start();
      recognitionRef.current = rec;
      setIsListening(true);
    }
  };

  // Format markdown-like content
  const formatContent = (content: string) => {
    return content
      .split('\n')
      .map((line, i) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return <h4 key={i} className="font-black text-slate-900 text-sm mt-2 mb-1">{line.slice(2, -2)}</h4>;
        }
        if (line.startsWith('- ')) {
          const text = line.slice(2).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
          return <li key={i} className="ml-3 text-xs text-slate-700 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: text }} />;
        }
        if (line.startsWith('> ')) {
          return <blockquote key={i} className="border-l-4 border-indigo-300 pl-3 my-2 text-xs italic text-slate-600 bg-indigo-50 py-2 rounded-r-xl">{line.slice(2)}</blockquote>;
        }
        const formatted = line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code class="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-700 font-mono text-[10px]">$1</code>');
        if (!formatted.trim()) return <div key={i} className="h-2" />;
        return <p key={i} className="text-xs text-slate-700 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: formatted }} />;
      });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 animate-fade-in text-slate-800">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold uppercase tracking-wider shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>AI Career Assistant</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Your Personal Career Guide</h1>
        <p className="text-slate-600 max-w-xl mx-auto text-sm leading-relaxed font-medium">
          Ask anything about internships, jobs, career paths, resume tips, networking, salary, or interview prep.
        </p>
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex flex-wrap gap-2 justify-center">
        {QUICK_PROMPTS.map((p, i) => (
          <button key={i} onClick={() => sendMessage(p.prompt)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-all shadow-sm"
          >
            <span>{p.icon}</span>
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {/* Chat Window */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xl overflow-hidden">
        {/* Messages Area */}
        <div className="h-[500px] overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-slate-50/50 to-white">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ${
                msg.role === 'assistant'
                  ? 'bg-gradient-to-tr from-indigo-600 to-purple-600'
                  : 'bg-gradient-to-tr from-emerald-500 to-teal-600'
              }`}>
                {msg.role === 'assistant' ? <Bot className="w-5 h-5 text-white animate-pulse" /> : <User className="w-5 h-5 text-white" />}
              </div>
              <div className={`max-w-[80%] space-y-1 ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className={`px-4 py-3.5 rounded-2xl shadow-sm ${
                  msg.role === 'assistant'
                    ? 'bg-white border border-slate-200 rounded-tl-none'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none'
                }`}>
                  {msg.role === 'user' ? (
                    <p className="text-xs font-medium leading-relaxed text-white">{msg.content}</p>
                  ) : (
                    <div className="space-y-1">
                      {formatContent(msg.content)}
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 px-2 font-mono">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div className="bg-white border border-slate-200 px-5 py-3.5 rounded-2xl rounded-tl-none shadow-sm">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  <span className="text-xs text-slate-400 ml-1 font-medium">AI is composing a response...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-200 p-4 bg-white space-y-3">
          <div className="flex items-end gap-3">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              placeholder="Ask me about internships, jobs, resume, salary, career paths, interviews... (Enter to send)"
              className="flex-1 bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 font-medium leading-relaxed resize-none shadow-sm"
            />
            <div className="flex flex-col gap-2">
              <button
                onClick={toggleListening}
                className={`p-3 rounded-xl transition-all border shadow-sm ${isListening ? 'bg-rose-600 text-white border-rose-500 animate-pulse' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200'}`}
                title={isListening ? "Stop voice input" : "Start voice input"}
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                onClick={() => sendMessage(inputText)}
                disabled={!inputText.trim()}
                className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 transition-all shadow-md shadow-indigo-500/20"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium px-1">
            <span>Press <kbd className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-[10px] font-mono">Enter</kbd> to send • <kbd className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-[10px] font-mono">Shift+Enter</kbd> for new line</span>
            <button onClick={() => setMessages([{ id: 'welcome', role: 'assistant', content: generateAssistantResponse('welcome'), timestamp: new Date() }])} className="flex items-center gap-1 hover:text-slate-600 transition-all">
              <RefreshCw className="w-3 h-3" />
              <span>Clear chat</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
