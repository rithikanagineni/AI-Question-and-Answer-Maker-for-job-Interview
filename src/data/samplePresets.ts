export interface CandidateProfile {
  name: string;
  targetRole: string;
  skills: string[];
  projects: { title: string; description: string; technologies: string[] }[];
  experience: string;
  education: string;
  strengths: string[];
}

export interface JobDescriptionData {
  jobTitle: string;
  companyName: string;
  description: string;
  requiredSkills: string[];
  responsibilities: string[];
  expectedExperience: string;
}

export interface GeneratedQuestion {
  id: string;
  category: 'technical' | 'hr' | 'role_based';
  question: string;
  whyAsked: string;
  personalizedAnswer: string;
  starBreakdown?: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  tips: string[];
  userPracticeAnswer?: string;
  feedback?: {
    score: number; // 0-100
    strengths: string[];
    improvements: string[];
    missingKeywords: string[];
  };
}

export interface PrepKit {
  id: string;
  createdAt: string;
  title: string;
  candidateProfile: CandidateProfile;
  jobDescription: JobDescriptionData;
  questions: GeneratedQuestion[];
  overallScore?: number;
}

export const SAMPLE_PROFILES: Record<string, CandidateProfile> = {
  fullstack: {
    name: "Alex Sharma",
    targetRole: "Full Stack Web Developer",
    skills: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "PostgreSQL", "Tailwind CSS", "Docker", "Git"],
    projects: [
      {
        title: "E-Commerce Micro-Marketplace",
        description: "Built a fully functional multi-vendor e-commerce platform with real-time inventory sync, secure Stripe payments, and JWT authentication.",
        technologies: ["React", "Node.js", "MongoDB", "Tailwind", "Stripe API"]
      },
      {
        title: "AI Resume Scanner & Job Matcher",
        description: "Developed a web application that parses resume PDFs and compares them against job descriptions using vector embeddings.",
        technologies: ["TypeScript", "Next.js", "OpenAI API", "PostgreSQL"]
      }
    ],
    experience: "2 years internship + freelance web development experience",
    education: "B.Tech in Computer Science & Engineering (GPA: 3.8/4.0)",
    strengths: ["Clean code architecture", "Fast learner", "Strong debugging", "REST & GraphQL APIs"]
  },
  datascience: {
    name: "Priya Patel",
    targetRole: "Data Scientist / Machine Learning Engineer",
    skills: ["Python", "PyTorch", "scikit-learn", "SQL", "Pandas", "NLP", "FastAPI", "AWS SageMaker", "Docker"],
    projects: [
      {
        title: "Customer Churn Prediction Engine",
        description: "Engineered an end-to-end ML pipeline predicting telecom churn with 91% accuracy using XGBoost and SHAP values for explainability.",
        technologies: ["Python", "XGBoost", "FastAPI", "Docker"]
      },
      {
        title: "Financial Sentiment Analyzer",
        description: "Fine-tuned a BERT transformer model on financial news headlines to forecast intraday stock market sentiment shifts.",
        technologies: ["PyTorch", "HuggingFace", "Pandas", "AWS"]
      }
    ],
    experience: "1.5 years as Junior Data Analyst at FinTech Lab",
    education: "Master of Science in Data Science",
    strengths: ["Statistical modeling", "Explainable AI", "Data storytelling", "Feature engineering"]
  },
  uiux: {
    name: "Liam O'Connor",
    targetRole: "Senior UI/UX Designer",
    skills: ["Figma", "Design Systems", "User Research", "Wireframing", "Prototyping", "Usability Testing", "HTML/CSS"],
    projects: [
      {
        title: "SaaS Dashboard Redesign",
        description: "Led the complete UX overhaul of a complex B2B analytics dashboard, reducing user time-on-task by 38% and boosting NPS score.",
        technologies: ["Figma", "Design Tokens", "User Testing"]
      },
      {
        title: "Mobile FinTech Wallet",
        description: "Designed an intuitive crypto and fiat mobile wallet with accessibility-first color contrast and seamless biometric onboarding.",
        technologies: ["Figma", "Framer", "Illustrator"]
      }
    ],
    experience: "4 years product design experience in agile startup environments",
    education: "B.A. in Interaction Design",
    strengths: ["Design system scalability", "User empathy", "High-fidelity interactive prototyping"]
  }
};

export const SAMPLE_JDS: Record<string, JobDescriptionData> = {
  fullstack: {
    jobTitle: "Software Engineer - Full Stack",
    companyName: "InnovateTech Global",
    description: "We are seeking a passionate Full Stack Software Engineer to join our core product team. You will be responsible for designing robust backend APIs, building responsive frontend interfaces, and collaborating closely with our product managers to launch scalable cloud features.",
    requiredSkills: ["React.js", "Node.js", "TypeScript", "SQL/NoSQL", "Git", "REST APIs"],
    responsibilities: [
      "Architect and maintain scalable web applications using React and Node.js",
      "Optimize database queries for high-frequency trading data",
      "Collaborate in code reviews and advocate for clean code standards",
      "Integrate secure third-party payment gateways and webhook systems"
    ],
    expectedExperience: "1-3 years of professional or demonstrated project experience"
  },
  datascience: {
    jobTitle: "Machine Learning Engineer",
    companyName: "Aethel AI Analytics",
    description: "Aethel AI is looking for an ML Engineer to develop predictive models and deploy NLP solutions at scale. You will work on massive proprietary datasets to improve our automated customer recommendation engine.",
    requiredSkills: ["Python", "Machine Learning", "PyTorch or TensorFlow", "SQL", "Model Deployment (FastAPI/Docker)"],
    responsibilities: [
      "Build, train, and validate predictive machine learning models",
      "Deploy models into production containerized environments",
      "Conduct exploratory data analysis and feature engineering on dirty data",
      "Present technical findings to non-technical executive stakeholders"
    ],
    expectedExperience: "2+ years in Data Science or Applied ML"
  },
  uiux: {
    jobTitle: "Product Designer (UI/UX)",
    companyName: "Elevate Design Studios",
    description: "Elevate is looking for an exceptional Product Designer who thrives at the intersection of beautiful UI and functional UX. You will own the end-to-end design lifecycle for our upcoming enterprise SaaS suite.",
    requiredSkills: ["Figma", "Design Systems", "Usability Testing", "Prototyping", "Collaboration"],
    responsibilities: [
      "Create user flows, wireframes, and pixel-perfect Figma prototypes",
      "Maintain and evolve our global multi-brand design system",
      "Conduct user interviews and synthesize feedback into actionable iterations",
      "Partner closely with frontend engineering to ensure design integrity during rollout"
    ],
    expectedExperience: "3+ years of UX/UI design experience with strong portfolio"
  }
};

export const SAMPLE_PREP_KITS: Record<string, PrepKit> = {
  demo1: {
    id: "kit_demo_1",
    createdAt: new Date().toISOString(),
    title: "InnovateTech Full Stack Interview Kit",
    candidateProfile: SAMPLE_PROFILES.fullstack,
    jobDescription: SAMPLE_JDS.fullstack,
    questions: [
      {
        id: "q_1",
        category: "technical",
        question: "How did you manage state and optimize re-renders in your E-Commerce Micro-Marketplace project?",
        whyAsked: "The JD requires robust React frontend development. Interviewers want to test if you understand advanced React concepts beyond basic component rendering.",
        personalizedAnswer: "In my E-Commerce Micro-Marketplace project, I managed global state using React Context combined with custom hooks for authentication and shopping cart status. To optimize re-renders during frequent cart updates, I memoized complex catalog filter calculations using useMemo and encapsulated component callback functions with useCallback. This prevented unnecessary child re-renders and kept the UI buttery smooth even under heavy item loads.",
        starBreakdown: {
          situation: "While building the E-Commerce Micro-Marketplace, complex nested components needed access to user cart data and filtering states.",
          task: "I needed to implement state management without prop-drilling or causing noticeable UI lag when users rapidly added items or changed price filters.",
          action: "I structured state into specialized modular Context providers (Auth, Cart, Filters). I applied React.memo on product item cards and useMemo for the expensive multi-category filtering algorithm.",
          result: "This reduced wasteful DOM re-renders by 60%, maintaining a flawless 60 FPS scroll performance across both desktop and mobile views."
        },
        tips: [
          "Explicitly name the hooks you used (useMemo, useCallback).",
          "Connect the technical optimization back to user experience.",
          "Be ready to contrast Context API with Redux or Zustand if asked."
        ],
        userPracticeAnswer: "In my e-commerce project I used React context and hooks like useMemo to make sure the app didn't re-render too much when adding items to the cart.",
        feedback: {
          score: 85,
          strengths: ["Correctly identified React Context and useMemo", "Clear concise explanation"],
          improvements: ["Mention specific metrics or impact on performance", "Elaborate slightly on how useCallback was used with child components"],
          missingKeywords: ["useCallback", "prop-drilling", "DOM"]
        }
      },
      {
        id: "q_2",
        category: "role_based",
        question: "The job description highlights backend API design and third-party integrations. Can you explain your experience integrating REST APIs and handling database connections?",
        whyAsked: "Direct alignment check between your skills (Node.js/MongoDB/PostgreSQL) and the JD's requirement for secure backend architecture.",
        personalizedAnswer: "I have substantial experience building secure backend architectures. Specifically in my AI Resume Scanner application, I built a modular REST API using TypeScript and Node.js/Express. I integrated third-party OpenAI endpoints while handling robust error boundaries and rate limiting. For persistence, I utilized PostgreSQL for relational user transactions and MongoDB for unstructured parsed resume documents, ensuring optimal indexing and fast retrieval.",
        starBreakdown: {
          situation: "The AI Resume Scanner required connecting user input to external AI models while storing complex nested JSON resume structures alongside secure user account details.",
          task: "I had to design an efficient API structure that handled both asynchronous AI processing and multi-database persistence securely.",
          action: "I separated concerns using a layered service architecture in Express. I used PostgreSQL with Prisma ORM for ACID-compliant user billing and MongoDB for high-speed document storage. I also implemented JWT authentication and helmet security headers.",
          result: "The API successfully handled concurrent PDF processing queues with sub-second response times on cached results and zero data leakage."
        },
        tips: [
          "Highlight your dual database experience (SQL and NoSQL).",
          "Emphasize security practices like JWT and input validation.",
          "Mention handling async third-party webhooks gracefully."
        ],
        userPracticeAnswer: "I built backend APIs with Node.js and Express in my resume scanner project. I connected to PostgreSQL and MongoDB databases and called external APIs.",
        feedback: {
          score: 75,
          strengths: ["Mentioned core technologies: Node.js, Express, PostgreSQL, MongoDB"],
          improvements: ["Add details about security (JWT, validation)", "Describe the architecture pattern used (layered services/controllers)"],
          missingKeywords: ["ACID", "indexing", "rate limiting", "asynchronous"]
        }
      },
      {
        id: "q_3",
        category: "hr",
        question: "Why should InnovateTech hire you for this Full Stack Engineer role over other candidates?",
        whyAsked: "Standard HR question testing self-awareness, confidence, and how well you researched the company's specific needs.",
        personalizedAnswer: "You should hire me because my technical stack and hands-on project experience perfectly mirror InnovateTech's core mission. Having built full-stack applications with React, TypeScript, and Node.js, I don't just write code; I understand how to architect systems for scalability and business impact—as demonstrated when I integrated secure payment gateways and AI scanners. Furthermore, my clean code principles and enthusiasm for collaborative problem-solving mean I can hit the ground running and contribute immediately to your agile product team.",
        starBreakdown: {
          situation: "InnovateTech needs a developer who can work across both frontend and backend without a long ramp-up period.",
          task: "I need to prove my readiness and cultural fit by connecting my past successes to their current engineering goals.",
          action: "I highlight my exact match in technology (React/Node/TS), my proven track record building full features from scratch, and my commitment to high code quality and teamwork.",
          result: "This demonstrates low onboarding risk and high immediate value addition to the engineering squad."
        },
        tips: [
          "Speak with enthusiasm and genuine interest in the company.",
          "Frame your lack of 10 years experience as an advantage: you are agile, hungry to learn, and trained on the latest modern standards.",
          "End on a collaborative note."
        ]
      }
    ],
    overallScore: 80
  }
};
