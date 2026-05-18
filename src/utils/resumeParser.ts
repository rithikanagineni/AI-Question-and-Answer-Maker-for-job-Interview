import { CandidateProfile } from '../data/samplePresets';

/**
 * Checks if a string looks like clean, readable English text.
 */
function isCleanEnglish(text: string): boolean {
  if (!text || text.length < 3) return false;
  const printableCount = text.replace(/\s/g, '').split('').filter(c => {
    const code = c.charCodeAt(0);
    return code >= 32 && code <= 126;
  }).length;
  const totalChars = text.replace(/\s/g, '').length;
  if (totalChars === 0) return false;
  if (printableCount / totalChars < 0.85) return false;
  if (/[^\w\s]{5,}/.test(text)) return false;
  if (/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(text)) return false;
  if (!/[aeiouAEIOU]/.test(text)) return false;
  return true;
}

function cleanText(text: string): string {
  return text
    .replace(/[^\x20-\x7E\n\t\r]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\(\s*\)/g, '')
    .replace(/\[\s*\]/g, '')
    .trim();
}

function extractTextFromPDF(raw: string): string {
  const chunks: string[] = [];

  const parenMatches = raw.match(/\(([^)]{3,})\)/g) || [];
  for (const m of parenMatches) {
    const inner = m.slice(1, -1).replace(/\\n/g, '\n').replace(/\\r/g, ' ').replace(/\\([()\\])/g, '$1');
    const clean = cleanText(inner);
    if (isCleanEnglish(clean) && clean.length > 2) chunks.push(clean);
  }

  const btBlocks = raw.match(/BT[\s\S]{5,300}?ET/g) || [];
  for (const block of btBlocks) {
    const tjMatches = block.match(/<([0-9a-fA-F]+)>\s*Tj/g) || [];
    for (const tj of tjMatches) {
      const hexStr = tj.match(/<([0-9a-fA-F]+)>/)?.[1] || '';
      let decoded = '';
      for (let i = 0; i < hexStr.length; i += 2) {
        const code = parseInt(hexStr.substr(i, 2), 16);
        if (code >= 32 && code <= 126) decoded += String.fromCharCode(code);
      }
      if (isCleanEnglish(decoded) && decoded.length > 3) chunks.push(decoded);
    }
  }

  const wordSequences = raw.match(/\b[A-Za-z]{3,}(?:\s+[A-Za-z]{2,}){1,}\b/g) || [];
  for (const seq of wordSequences) {
    const clean = cleanText(seq);
    if (isCleanEnglish(clean) && clean.length > 8) chunks.push(clean);
  }

  const allWords = raw.match(/\b[A-Za-z]{4,}\b/g) || [];
  const wordFreq: Record<string, number> = {};
  allWords.forEach(w => {
    const lw = w.toLowerCase();
    if (lw.length >= 4) wordFreq[lw] = (wordFreq[lw] || 0) + 1;
  });

  const meaningfulWords = Object.entries(wordFreq)
    .filter(([word, count]) => count >= 2 && /[aeiou]/i.test(word))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 80)
    .map(([word]) => word);

  return [...chunks, meaningfulWords.join(' ')].join(' ').trim();
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function titleCase(s: string): string {
  return s.replace(/\b\w/g, c => c.toUpperCase());
}

function detectRoleDomain(lowerText: string): string {
  if (/data\s*sci|machine\s*learning|ml\s*engineer|ai\s*engineer|deep\s*learning|nlp|pytorch|tensorflow|pandas|scikit/.test(lowerText)) return 'data-science';
  if (/full\s*stack|fullstack|frontend|react|vue|angular|javascript|typescript|web\s*dev/.test(lowerText)) return 'web-development';
  if (/devops|cloud|aws|azure|docker|kubernetes|terraform|jenkins|ci\/cd/.test(lowerText)) return 'devops';
  if (/mobile|flutter|react\s*native|android|ios|kotlin|swift/.test(lowerText)) return 'mobile';
  if (/ui\s*\/?\s*ux|product\s*design|figma|sketch|user\s*research/.test(lowerText)) return 'design';
  if (/java\s*developer|spring\s*boot|hibernate|j2ee/.test(lowerText)) return 'java-backend';
  if (/python\s*developer|django|flask|fastapi/.test(lowerText)) return 'python';
  return 'software-engineering';
}

function getRoleRelevantSkills(domain: string, allSkills: string[]): string[] {
  const domainSkills: Record<string, string[]> = {
    'data-science': ['Python', 'Machine Learning', 'PyTorch', 'TensorFlow', 'Pandas', 'NumPy', 'Scikit-learn', 'Deep Learning', 'NLP', 'Computer Vision', 'Data Science', 'AI', 'FastAPI', 'SQL', 'AWS'],
    'web-development': ['React', 'ReactJS', 'React.js', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'HTML5', 'CSS3', 'Node.js', 'Node', 'Express', 'Express.js', 'Next.js', 'Vue', 'Angular', 'Tailwind', 'REST API', 'GraphQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase', 'Git', 'Docker'],
    'devops': ['Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Jenkins', 'CI/CD', 'GitHub Actions', 'GitLab CI', 'AWS', 'Azure', 'GCP', 'Google Cloud', 'Linux', 'Bash', 'Shell Scripting', 'Nginx', 'Apache', 'Docker', 'Git', 'Microservices'],
    'mobile': ['Flutter', 'React Native', 'Kotlin', 'Swift', 'Dart', 'Android', 'iOS', 'Firebase', 'Git', 'REST API'],
    'design': ['Figma', 'Adobe XD', 'Sketch', 'InVision', 'Zeplin', 'HTML', 'CSS', 'JavaScript', 'UI/UX', 'User Research', 'Prototyping'],
    'java-backend': ['Java', 'Spring Boot', 'Spring', 'Hibernate', 'Maven', 'Gradle', 'SQL', 'MySQL', 'PostgreSQL', 'Docker', 'Git', 'REST API', 'Microservices'],
    'python': ['Python', 'Django', 'Flask', 'FastAPI', 'SQL', 'PostgreSQL', 'MySQL', 'Docker', 'Git', 'REST API', 'Linux'],
    'software-engineering': []
  };
  const relevant = domainSkills[domain] || [];
  if (relevant.length === 0) return allSkills;
  const matched = allSkills.filter(s => relevant.some(r => s.toLowerCase().includes(r.toLowerCase()) || r.toLowerCase().includes(s.toLowerCase())));
  const remaining = allSkills.filter(s => !matched.includes(s));
  return [...matched, ...remaining];
}

/**
 * Deeply parses resume text and returns a CandidateProfile with clean, meaningful data.
 */
export function deepParseResume(rawText: string, fileName: string): CandidateProfile {
  const text = rawText || '';
  const lower = text.toLowerCase();
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0 && isCleanEnglish(l)).slice(0, 150);

  // NAME
  let name = '';
  for (const line of lines.slice(0, 8)) {
    if (line.length >= 5 && line.length <= 45 && /^[A-Za-z\s.\-'']+$/.test(line) && !line.includes('@') && !line.includes('http')) {
      const words = line.split(/\s+/);
      if (words.length >= 1 && words.length <= 5) { name = titleCase(line); break; }
    }
  }
  if (!name) {
    name = fileName.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).trim();
    if (!name || name.length < 2) name = 'Candidate';
  }

  // SKILLS
  const allTechSkills = [
    'React', 'ReactJS', 'React.js', 'Vue', 'Angular', 'Next.js', 'Nuxt.js', 'Svelte',
    'JavaScript', 'TypeScript', 'HTML', 'CSS', 'HTML5', 'CSS3', 'SASS', 'SCSS', 'Bootstrap', 'Tailwind',
    'Node.js', 'Node', 'Express', 'Express.js', 'NestJS', 'Fastify', 'Koa',
    'Python', 'Django', 'Flask', 'FastAPI', 'Pandas', 'NumPy', 'Scikit-learn', 'PyTorch', 'TensorFlow', 'Keras',
    'Java', 'Spring Boot', 'Spring', 'Hibernate', 'Maven', 'Gradle',
    'C', 'C++', 'C#', '.NET', 'ASP.NET',
    'PHP', 'Laravel', 'CodeIgniter', 'Symfony',
    'Ruby', 'Ruby on Rails', 'Go', 'Golang', 'Rust', 'Kotlin', 'Swift',
    'SQL', 'MySQL', 'PostgreSQL', 'SQLite', 'Oracle', 'MSSQL',
    'MongoDB', 'Firebase', 'Firestore', 'DynamoDB', 'Cassandra', 'Redis', 'ElasticSearch',
    'GraphQL', 'REST API', 'RESTful', 'REST', 'SOAP', 'gRPC', 'WebSocket',
    'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Jenkins', 'CI/CD', 'GitHub Actions', 'GitLab CI',
    'AWS', 'Azure', 'GCP', 'Google Cloud', 'Heroku', 'Netlify', 'Vercel',
    'Git', 'GitHub', 'GitLab', 'Bitbucket', 'SVN',
    'Figma', 'Adobe XD', 'Sketch', 'InVision', 'Zeplin',
    'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'AI', 'Data Science',
    'Agile', 'Scrum', 'Kanban', 'JIRA', 'Confluence', 'Trello',
    'Linux', 'Unix', 'Bash', 'Shell Scripting', 'PowerShell',
    'Nginx', 'Apache', 'Microservices', 'Serverless', 'WebSockets',
    'Redux', 'MobX', 'Zustand', 'React Query', 'GraphQL Apollo',
    'MATLAB', 'R', 'Scala', 'Haskell', 'Dart', 'Flutter',
    'React Native', 'Ionic', 'Electron',
    'Problem Solving', 'Communication', 'Teamwork', 'Leadership',
    'Data Structures', 'Algorithms', 'System Design', 'OOPS', 'OOP',
  ];

  const detectedSkills = allTechSkills.filter(skill => lower.includes(skill.toLowerCase()));
  const seen = new Set<string>();
  const skills = detectedSkills.filter(s => { const key = s.toLowerCase(); if (seen.has(key)) return false; seen.add(key); return true; });

  if (skills.length === 0) {
    const skillSectionIdx = lines.findIndex(l => /technical\s*skills|skills\s*:/i.test(l));
    if (skillSectionIdx >= 0) {
      const skillSection = lines.slice(skillSectionIdx + 1, skillSectionIdx + 8).join(', ');
      const found = allTechSkills.filter(s => skillSection.toLowerCase().includes(s.toLowerCase()));
      const fSeen = new Set<string>();
      skills.push(...found.filter(s => { const key = s.toLowerCase(); if (fSeen.has(key)) return false; fSeen.add(key); return true; }));
    }
  }

  // DOMAIN & ROLE
  const domain = detectRoleDomain(lower);
  const roleRelevantSkills = getRoleRelevantSkills(domain, skills);
  const roleMap: Record<string, string> = { 'data-science': 'Data Scientist / ML Engineer', 'web-development': 'Full Stack / Web Developer', 'devops': 'DevOps / Cloud Engineer', 'mobile': 'Mobile App Developer', 'design': 'UI/UX Product Designer', 'java-backend': 'Java Backend Developer', 'python': 'Python Developer', 'software-engineering': 'Software Engineer' };
  let targetRole = roleMap[domain] || 'Software Engineer';
  if (/intern|fresher|student/i.test(lower)) targetRole = targetRole + ' (Fresher)';

  // EDUCATION
  const eduKeywords = ['b.tech', 'b.e', 'btech', 'bachelor', 'b.sc', 'bsc', 'm.tech', 'm.e', 'mtech', 'master', 'm.sc', 'msc', 'phd', 'diploma', 'degree', 'university', 'college', 'institute'];
  const eduLine = lines.find(l => eduKeywords.some(k => l.toLowerCase().includes(k)));
  const education = eduLine && eduLine.length > 5 && eduLine.length < 200 ? eduLine : "Bachelor's Degree in Technology / Computer Science";

  // EXPERIENCE
  const expKeywords = ['experience', 'internship', 'intern', 'worked at', 'work experience', 'employment'];
  const expLine = lines.find(l => expKeywords.some(k => l.toLowerCase().includes(k)) && l.length > 5);
  const yearMatch = lower.match(/(\d+)\s*\+?\s*(?:year|yr)/);
  const experience = yearMatch ? `${yearMatch[1]}+ year${yearMatch[1] !== '1' ? 's' : ''} of relevant experience` : expLine && expLine.length < 150 ? expLine : 'Fresher / Entry-level candidate';

  // PROJECTS (improved: only clean text, role-relevant tech)
  const projects: CandidateProfile['projects'] = [];
  const projTitleKeywords = ['project', 'projects', 'key project', 'academic project', 'personal project', 'mini project', 'major project'];

  let projStartIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].toLowerCase();
    if (projTitleKeywords.some(k => l.includes(k)) && l.length < 50) { projStartIdx = i; break; }
  }

  if (projStartIdx >= 0) {
    const sectionEnders = ['experience', 'education', 'skills', 'certification', 'achievement', 'hobby', 'interest', 'reference', 'summary', 'objective', 'profile'];
    let projLines: string[] = [];
    for (let i = projStartIdx + 1; i < Math.min(projStartIdx + 30, lines.length); i++) {
      if (sectionEnders.some(se => lines[i].toLowerCase().startsWith(se) || lines[i].toLowerCase().includes(' ' + se + ':'))) break;
      if (lines[i].length > 1) projLines.push(lines[i]);
    }

    let currentTitle = '';
    let currentDesc = '';
    const flushProject = () => {
      if (currentTitle && currentTitle.length > 2) {
        let desc = (currentDesc || 'A software project demonstrating practical application of technical skills.').trim();
        if (desc.length < 15) desc = 'Developed and implemented key features using modern technologies, following industry best practices and clean architecture principles.';
        const projectTechs = roleRelevantSkills.slice(0, 4);
        projects.push({ title: currentTitle.replace(/[:\-\–]/g, '').trim(), description: desc.length > 300 ? desc.slice(0, 300) + '...' : desc, technologies: projectTechs });
      }
    };

    for (const line of projLines) {
      const looksLikeTitle = line.length > 3 && line.length < 70 && /^[A-Z]/.test(line) && !line.includes('@') && !line.startsWith('-') && !line.startsWith('*');
      if (looksLikeTitle && (currentTitle || projects.length === 0)) { flushProject(); currentTitle = line; currentDesc = ''; }
      else currentDesc += (currentDesc ? ' ' : '') + line;
    }
    flushProject();
  }

  if (projects.length === 0) {
    const actionVerbs = ['built', 'developed', 'created', 'designed', 'implemented', 'engineered', 'deployed', 'launched'];
    for (const line of lines) {
      if (projects.length >= 3) break;
      if (actionVerbs.some(v => line.toLowerCase().includes(v)) && skills.some(s => line.toLowerCase().includes(s.toLowerCase())) && line.length > 20 && line.length < 300) {
        const title = line.split(/[.,;]/)[0].slice(0, 60).replace(/^["'\-–*\d.)\s]+/, '').trim() || 'Software Development Project';
        projects.push({ title, description: line, technologies: roleRelevantSkills.slice(0, 3) });
      }
    }
  }

  if (projects.length === 0) {
    projects.push({ title: 'Software Development Project', description: 'Developed a full-stack application using modern technologies to solve real-world problems. Implemented clean architecture, responsive design, and efficient data management.', technologies: roleRelevantSkills.slice(0, 3) });
  }

  const finalProjects = projects.slice(0, 3);

  // STRENGTHS
  const softKeywords = ['communication', 'leadership', 'teamwork', 'problem solving', 'analytical', 'critical thinking', 'time management', 'adaptable', 'self-motivated', 'creative'];
  const strengths = softKeywords.filter(k => lower.includes(k)).map(k => k.split(' ').map(capitalize).join(' '));
  if (strengths.length === 0) strengths.push('Analytical Thinking', 'Problem Solving', 'Continuous Learning');

  return { name: name || 'Candidate', targetRole, skills: skills.length > 0 ? skills : ['JavaScript', 'HTML', 'CSS', 'Problem Solving'], projects: finalProjects, experience, education, strengths };
}

/**
 * Main entry point.
 */
export function parseResumeFile(fileContent: string | ArrayBuffer, fileName: string, isPDF: boolean): CandidateProfile {
  let text: string;
  if (isPDF) {
    if (fileContent instanceof ArrayBuffer) {
      const bytes = new Uint8Array(fileContent);
      let binary = '';
      for (let i = 0; i < Math.min(bytes.byteLength, 500000); i++) binary += String.fromCharCode(bytes[i]);
      text = extractTextFromPDF(binary);
    } else {
      text = extractTextFromPDF(fileContent as string);
    }
  } else {
    text = typeof fileContent === 'string' ? fileContent : new TextDecoder().decode(fileContent as ArrayBuffer);
  }
  return deepParseResume(text, fileName);
}
