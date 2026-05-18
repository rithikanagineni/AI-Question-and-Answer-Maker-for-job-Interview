import { CandidateProfile, GeneratedQuestion, JobDescriptionData } from './samplePresets';

export interface CompanyProfile {
  id: string;
  name: string;
  domain: string;
  logoUrl: string;
  tagline: string;
  expectations: string[];
  requiredSkills: string[];
  questionFocus: string[];
  cultureSignals: string[];
}

export const COMPANY_PROFILES: CompanyProfile[] = [
  {
    id: 'custom',
    name: 'Use My JD Company',
    domain: 'custom.local',
    logoUrl: '',
    tagline: 'Questions based on the company and JD you pasted',
    expectations: ['Resume-to-JD match', 'Role responsibilities', 'Project depth', 'Communication'],
    requiredSkills: [],
    questionFocus: ['Your pasted job description', 'Your resume projects', 'Skill coverage', 'Missing keywords'],
    cultureSignals: ['Adaptability', 'Ownership', 'Learning mindset']
  },
  {
    id: 'google',
    name: 'Google',
    domain: 'google.com',
    logoUrl: 'https://logo.clearbit.com/google.com',
    tagline: 'Large-scale systems, clarity, problem solving',
    expectations: ['Algorithmic thinking', 'Scalable system design', 'Data-driven decisions', 'Clear communication'],
    requiredSkills: ['Data Structures', 'Algorithms', 'System Design', 'Distributed Systems', 'Testing', 'Communication'],
    questionFocus: ['Complexity analysis', 'Reliability at scale', 'Trade-off decisions', 'User impact'],
    cultureSignals: ['Googleyness', 'Collaboration', 'Humility', 'Bias for users']
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    domain: 'microsoft.com',
    logoUrl: 'https://logo.clearbit.com/microsoft.com',
    tagline: 'Cloud, enterprise engineering, customer obsession',
    expectations: ['Azure/cloud mindset', 'Enterprise reliability', 'Team collaboration', 'Customer empathy'],
    requiredSkills: ['Cloud', 'Azure', 'C#', '.NET', 'System Design', 'Problem Solving', 'Communication'],
    questionFocus: ['Enterprise scenarios', 'Reliability', 'Cross-team work', 'Product thinking'],
    cultureSignals: ['Growth mindset', 'Customer obsession', 'Diversity', 'One Microsoft']
  },
  {
    id: 'amazon',
    name: 'Amazon',
    domain: 'amazon.com',
    logoUrl: 'https://logo.clearbit.com/amazon.com',
    tagline: 'Leadership principles, ownership, scale',
    expectations: ['Ownership', 'Customer obsession', 'Bias for action', 'Scalable backend design'],
    requiredSkills: ['Data Structures', 'System Design', 'AWS', 'Distributed Systems', 'APIs', 'Leadership'],
    questionFocus: ['Leadership Principles', 'High-scale architecture', 'Operational excellence', 'Failure handling'],
    cultureSignals: ['Customer Obsession', 'Ownership', 'Dive Deep', 'Deliver Results']
  },
  {
    id: 'meta',
    name: 'Meta',
    domain: 'meta.com',
    logoUrl: 'https://logo.clearbit.com/meta.com',
    tagline: 'Product impact, speed, social-scale engineering',
    expectations: ['Product sense', 'Fast iteration', 'Frontend/backend performance', 'Large-scale architecture'],
    requiredSkills: ['React', 'JavaScript', 'GraphQL', 'System Design', 'Performance', 'Data Structures'],
    questionFocus: ['Product metrics', 'Experimentation', 'Performance optimization', 'Rapid delivery'],
    cultureSignals: ['Move fast', 'Impact', 'Openness', 'Long-term thinking']
  },
  {
    id: 'netflix',
    name: 'Netflix',
    domain: 'netflix.com',
    logoUrl: 'https://logo.clearbit.com/netflix.com',
    tagline: 'Streaming reliability, autonomy, high ownership',
    expectations: ['Microservices', 'Resilience', 'Observability', 'Independent decision making'],
    requiredSkills: ['Microservices', 'AWS', 'Java', 'Node.js', 'System Design', 'Observability'],
    questionFocus: ['Fault tolerance', 'Monitoring', 'Incident response', 'Trade-off ownership'],
    cultureSignals: ['Freedom and responsibility', 'High performance', 'Context not control']
  },
  {
    id: 'adobe',
    name: 'Adobe',
    domain: 'adobe.com',
    logoUrl: 'https://logo.clearbit.com/adobe.com',
    tagline: 'Creative products, UX quality, cloud platforms',
    expectations: ['User experience', 'Frontend quality', 'Cloud services', 'Design collaboration'],
    requiredSkills: ['React', 'JavaScript', 'TypeScript', 'UX', 'APIs', 'Cloud'],
    questionFocus: ['Design-engineering collaboration', 'Performance', 'Accessibility', 'Product polish'],
    cultureSignals: ['Creativity', 'Customer value', 'Craft quality', 'Collaboration']
  },
  {
    id: 'flipkart',
    name: 'Flipkart',
    domain: 'flipkart.com',
    logoUrl: 'https://logo.clearbit.com/flipkart.com',
    tagline: 'E-commerce scale, supply chain, fast releases',
    expectations: ['High-volume systems', 'Database optimization', 'Checkout reliability', 'Fast problem solving'],
    requiredSkills: ['Java', 'Spring Boot', 'React', 'SQL', 'System Design', 'Microservices'],
    questionFocus: ['Cart/checkout scale', 'Inventory consistency', 'Latency optimization', 'Peak traffic'],
    cultureSignals: ['Customer first', 'Speed', 'Ownership', 'Execution']
  },
  {
    id: 'tcs',
    name: 'TCS',
    domain: 'tcs.com',
    logoUrl: 'https://logo.clearbit.com/tcs.com',
    tagline: 'Client delivery, fundamentals, service mindset',
    expectations: ['Core CS basics', 'Client communication', 'Adaptability', 'Process discipline'],
    requiredSkills: ['Java', 'SQL', 'OOPS', 'DBMS', 'Communication', 'Problem Solving'],
    questionFocus: ['OOPS/DBMS fundamentals', 'Scenario-based communication', 'Learning new domains', 'Team work'],
    cultureSignals: ['Client focus', 'Reliability', 'Process adherence', 'Learning agility']
  },
  {
    id: 'infosys',
    name: 'Infosys',
    domain: 'infosys.com',
    logoUrl: 'https://logo.clearbit.com/infosys.com',
    tagline: 'Training, client projects, fundamentals',
    expectations: ['Programming basics', 'SQL', 'Analytical ability', 'Professional communication'],
    requiredSkills: ['Java', 'Python', 'SQL', 'OOPS', 'Problem Solving', 'Communication'],
    questionFocus: ['Programming fundamentals', 'Project explanation', 'Aptitude-style reasoning', 'Client readiness'],
    cultureSignals: ['Learnability', 'Integrity', 'Professionalism', 'Client service']
  },
  {
    id: 'zoho',
    name: 'Zoho',
    domain: 'zoho.com',
    logoUrl: 'https://logo.clearbit.com/zoho.com',
    tagline: 'Problem solving, product thinking, fundamentals',
    expectations: ['Strong coding basics', 'Practical problem solving', 'Product ownership', 'Database fundamentals'],
    requiredSkills: ['C', 'C++', 'Java', 'SQL', 'Data Structures', 'Algorithms'],
    questionFocus: ['Hands-on coding logic', 'Database design', 'Product improvements', 'Practical debugging'],
    cultureSignals: ['Self-learning', 'Frugality', 'Long-term ownership', 'Customer care']
  }
];

function pickProject(profile: CandidateProfile) {
  return profile.projects[0] || {
    title: 'my strongest technical project',
    description: 'building a scalable software solution with clean architecture and measurable business impact'
  };
}

export function getCompanyById(id?: string): CompanyProfile {
  return COMPANY_PROFILES.find(c => c.id === id) || COMPANY_PROFILES[0];
}

export function generateCompanySpecificQuestions(profile: CandidateProfile, jd: JobDescriptionData, company: CompanyProfile): GeneratedQuestion[] {
  const role = jd.jobTitle || profile.targetRole || 'Software Engineer';
  const project = pickProject(profile);
  const companyName = company.id === 'custom' ? (jd.companyName || 'the target company') : company.name;
  const reqSkills = company.id === 'custom'
    ? (jd.requiredSkills.length ? jd.requiredSkills : profile.skills.slice(0, 5))
    : company.requiredSkills;
  const focus = company.questionFocus.join(', ');
  const culture = company.cultureSignals.slice(0, 3).join(', ');
  const primarySkill = reqSkills[0] || profile.skills[0] || 'problem solving';

  return [
    {
      id: `company_${company.id}_tech_scale_${Date.now()}`,
      category: 'technical',
      question: `${companyName} cares about ${company.expectations[0] || 'engineering excellence'}. How would you use ${primarySkill} to design a reliable feature for a high-scale ${role} environment?`,
      whyAsked: `${companyName} interviewers often evaluate whether you can translate fundamentals into the company's expected engineering environment: ${focus}.`,
      personalizedAnswer: `For ${companyName}, I would start by clarifying the expected traffic, failure modes, and user impact. In ${project.title}, I worked on ${project.description}, which taught me to separate core logic, validate inputs, and design for maintainability. I would apply the same mindset with ${primarySkill}: create a modular design, add observability, cover critical paths with tests, and document trade-offs so the team can scale the feature confidently.`,
      tips: [`Mention ${companyName}'s expectation: ${company.expectations[0]}.`, `Explain trade-offs, not just tools.`, `Tie your answer to ${project.title}.`]
    },
    {
      id: `company_${company.id}_debug_${Date.now() + 1}`,
      category: 'technical',
      question: `At ${companyName}, production issues must be handled carefully. If a key ${role} feature suddenly becomes slow, what exact steps would you take to debug and fix it?`,
      whyAsked: `This tests operational maturity and whether you can handle incidents using structured investigation instead of guessing.`,
      personalizedAnswer: `I would first reproduce the issue and check whether it affects all users or only a segment. Then I would inspect logs, metrics, recent deployments, API latency, and database query times. Once I isolate the bottleneck, I would implement the minimal safe fix, validate in staging, and add regression monitoring. This matches ${companyName}'s expectations around ${company.expectations.slice(0, 2).join(' and ')}.`,
      tips: ['Use a step-by-step debugging framework.', 'Mention logs, metrics, profiling and rollback strategy.', 'End with prevention: tests and monitoring.']
    },
    {
      id: `company_${company.id}_culture_${Date.now() + 2}`,
      category: 'hr',
      question: `${companyName} values ${culture}. Tell me about a time you demonstrated one of these values in a project or team situation.`,
      whyAsked: `Company-specific behavioral rounds assess whether your working style matches the culture, not just whether you can code.`,
      personalizedAnswer: `In ${project.title}, I demonstrated ${company.cultureSignals[0] || 'ownership'} by taking responsibility for both technical delivery and team alignment. When we faced uncertainty, I broke the problem into smaller deliverables, communicated progress transparently, and made sure the final solution addressed user needs rather than only technical requirements. This shows I can operate in a culture like ${companyName}'s, where ${culture} are important.`,
      tips: [`Use one of ${companyName}'s values explicitly.`, 'Answer with STAR structure.', 'Show measurable impact or a clear learning outcome.']
    },
    {
      id: `company_${company.id}_role_fit_${Date.now() + 3}`,
      category: 'role_based',
      question: `Why are you a strong fit for ${companyName}'s ${role} role compared with other candidates who may have similar technical skills?`,
      whyAsked: `This question checks differentiation: your unique mix of skills, projects, motivation and company alignment.`,
      personalizedAnswer: `I bring a combination of practical project experience, fast learning ability, and awareness of ${companyName}'s expectations. My work on ${project.title} shows I can move from requirements to implementation, handle technical decisions, and communicate results. Beyond matching skills like ${reqSkills.slice(0, 3).join(', ')}, I can add value through ownership, clear communication, and a willingness to learn the company-specific systems quickly.`,
      tips: ['Avoid generic claims like “I am hardworking”.', `Reference ${companyName}'s requirements.`, 'Use your best project as proof.']
    },
    {
      id: `company_${company.id}_gap_${Date.now() + 4}`,
      category: 'role_based',
      question: `${companyName}'s requirements include ${reqSkills.slice(0, 4).join(', ')}. Which of these areas are strongest for you, and which would you ramp up on first?`,
      whyAsked: `The interviewer is checking self-awareness and whether you can honestly identify strengths and gaps against company expectations.`,
      personalizedAnswer: `My strongest alignment is with ${profile.skills.slice(0, 3).join(', ') || primarySkill}, because I have applied these in hands-on projects. If I needed to ramp up, I would start with ${reqSkills.find(s => !profile.skills.some(ps => ps.toLowerCase().includes(s.toLowerCase()))) || reqSkills[0] || 'the company-specific stack'} by building a focused proof-of-concept, reading internal documentation, and seeking review from senior engineers.`,
      tips: ['Be honest about gaps.', 'Show a concrete ramp-up plan.', 'Connect strengths to evidence from your resume.']
    },
    {
      id: `company_${company.id}_product_${Date.now() + 5}`,
      category: 'technical',
      question: `How would you improve one product or user experience area at ${companyName} using your technical background?`,
      whyAsked: `Many top companies expect engineers to think beyond code and understand product impact.`,
      personalizedAnswer: `I would first identify a user pain point, validate it with data, and then propose a small but measurable technical improvement. Based on my background, I would look for opportunities around performance, reliability, accessibility, or workflow friction. For example, if a core user flow has latency, I would profile the bottleneck, add caching where appropriate, and measure improvement using user-facing metrics.`,
      tips: ['Pick a realistic product area.', 'Connect improvement to metrics.', 'Show humility: validate before proposing.']
    }
  ];
}