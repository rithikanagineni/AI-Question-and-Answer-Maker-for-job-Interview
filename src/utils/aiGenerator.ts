import { CandidateProfile, JobDescriptionData, GeneratedQuestion } from '../data/samplePresets';

/**
 * Helper: Capitalize first letter
 */
const cap = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

/**
 * Helper: Get a comma-separated list of skills (max N items)
 */
const skillList = (skills: string[], n = 4) => skills.slice(0, n).join(', ') || 'relevant technologies';

/**
 * Generate a realistic project narrative that sounds professional regardless of
 * how well the resume data was extracted.
 */
function buildProjectNarrative(proj: { title: string; description: string }): string {
  if (!proj || !proj.title) {
    return 'I developed a production-grade web application that solved real business problems using modern frameworks and clean architecture patterns. I owned the full development lifecycle from requirements gathering through deployment, ensuring code quality with automated testing and code reviews.';
  }
  const title = proj.title;
  const desc = proj.description || '';

  // Short, punchy descriptions that always sound professional
  if (desc.length < 30) {
    return `I built ${title} as a key project where I designed and implemented core features from scratch. I focused on writing clean, maintainable code and followed industry best practices throughout the development process.`;
  }

  // Build a natural narrative from description
  return `I worked on ${title}, where my main focus was ${desc.toLowerCase().startsWith('built') || desc.toLowerCase().startsWith('developed') || desc.toLowerCase().startsWith('designed')
    ? desc.charAt(0).toLowerCase() + desc.slice(1)
    : `building and developing a solution that addresses key technical challenges. ${cap(desc)}`}. I ensured the project met all functional requirements while maintaining high code quality and scalability standards.`;
}

/**
 * Helper: Generate strong professional answers that reference the candidate's
 * actual resume data naturally without sounding like a template.
 */
function generatePersonalizedAnswers(profile: CandidateProfile, jd: JobDescriptionData, questions: GeneratedQuestion[]): GeneratedQuestion[] {
  const jdSkills = jd.requiredSkills.map(s => s.toLowerCase());
  const profileSkills = profile.skills.map(s => s.toLowerCase());
  const matchingSkills = profile.skills.filter(s => jdSkills.some(j => j.includes(s.toLowerCase()) || s.toLowerCase().includes(j)));
  const missingSkills = jd.requiredSkills.filter(j => !profileSkills.some(s => s.includes(j.toLowerCase()) || j.toLowerCase().includes(s)));

  const primarySkill = matchingSkills[0] || profile.skills[0] || 'my core expertise';
  const primarySkillDesc = matchingSkills[0] ? `${primarySkill} and related technologies` : 'the technologies relevant to this role';

  const proj1 = profile.projects[0];
  const proj2 = profile.projects[1];
  const proj1Narrative = buildProjectNarrative(proj1);
  const proj2Narrative = buildProjectNarrative(proj2);

  const companyName = jd.companyName || 'your company';
  const roleName = jd.jobTitle || 'this role';
  const experience = profile.experience || 'my academic and project experience';
  const strengths = profile.strengths.length > 0 ? profile.strengths : ['fast learning', 'collaboration', 'problem solving'];

  // Determine if missing skills exist
  const missingSkillFocus = missingSkills.length > 0 ? missingSkills[0] : null;

  // Build richer answers for each question
  return questions.map(q => {
    let personalizedAnswer = q.personalizedAnswer;
    let starBreakdown = q.starBreakdown;

    switch (q.id.split('_').slice(0, 3).join('_')) {
      case 'q_tech_1':
        personalizedAnswer = `Based on my hands-on experience with ${primarySkillDesc}, I approach system architecture by focusing on modularity, maintainability, and performance. In my project work, particularly ${proj1Narrative.split('.')[0]}, I applied these same principles to deliver scalable solutions. At ${companyName}, I would leverage my deep understanding of ${primarySkill} to design robust features with clean separation of concerns, comprehensive error handling, and optimized data flows. My goal would be to deliver code that is not only functional but also highly readable and easy for the team to maintain long-term.`;
        starBreakdown = {
          situation: `${companyName} needs efficient, maintainable features built with ${primarySkill} to support their growing user base and product goals.`,
          task: `Design and implement a high-performance component or feature that scales well, handles edge cases gracefully, and integrates cleanly with the existing architecture.`,
          action: `I would start by understanding the requirements thoroughly, then design a modular architecture with clear interfaces. Drawing from my experience with ${primarySkillDesc}, I'd implement with clean code practices including type safety, automated testing, and proper error handling. I'd also set up monitoring and observability from day one.`,
          result: `The result would be a reliable, well-tested feature that meets performance targets, is easy for the team to extend, and delivers a seamless user experience — just as I achieved in my previous projects.`
        };
        break;

      case 'q_tech_2':
        personalizedAnswer = proj2Narrative ? `${proj2Narrative} One of the biggest challenges was ensuring reliability under real-world conditions. I approached this by breaking the problem down systematically — first identifying the root cause through debugging and log analysis, then implementing a solution with proper testing. I learned that the best technical decisions come from understanding trade-offs between speed, quality, and maintainability. This experience significantly improved my problem-solving skills and taught me the value of writing defensive code from the start.` : `Throughout my projects, I've encountered several technical challenges that required creative problem-solving. One notable instance involved resolving performance bottlenecks in a data-heavy application. I profiled the system, identified the root cause in database query patterns, and implemented optimized indexing and caching strategies that reduced response times by over 60%. This taught me the importance of systematic debugging and the value of understanding the full technology stack.`;
        starBreakdown = {
          situation: `During the development of one of my key projects, we encountered a significant technical challenge that threatened our delivery timeline and required a systematic approach to resolve.`,
          task: `I needed to identify the root cause, design a fix that wouldn't introduce new bugs, and implement it efficiently while keeping the rest of the team informed and aligned.`,
          action: `I started with thorough debugging — analyzing logs, writing targeted test cases, and isolating the problematic code path. Once I identified the issue, I designed a solution that addressed the root cause rather than just symptoms. I also added regression tests to prevent recurrence.`,
          result: `The fix was deployed successfully with zero downtime. The team adopted my debugging methodology for future issues, and the experience significantly improved my ability to handle complex technical problems under pressure.`
        };
        break;

      case 'q_role_1':
        personalizedAnswer = `My background aligns strongly with the ${roleName} position at ${companyName}. Looking at your requirements for ${skillList(jd.requiredSkills, 3)}, I have direct experience with ${skillList(matchingSkills.length > 0 ? matchingSkills : profile.skills, 4)}. My strengths in ${strengths.slice(0, 2).join(' and ')} have been consistently demonstrated across my projects, where I've taken ownership of full development lifecycles and delivered production-quality code. I'm not just looking for any job — I'm specifically excited about what ${companyName} is building and confident that I can contribute meaningfully from day one.`;
        starBreakdown = {
          situation: `${companyName} is seeking a ${roleName} who can immediately contribute to their engineering team without a lengthy ramp-up period, and I need to demonstrate I'm that person.`,
          task: `Prove that my specific skills, project experience, and professional strengths map directly to their day-to-day needs and long-term team goals.`,
          action: `I map each of their key requirements to concrete evidence from my work — specific projects, technologies used, outcomes achieved, and collaborative experiences that mirror their team culture.`,
          result: `This demonstrates to the hiring manager that I'm a low-risk, high-value hire who understands their needs and can deliver results quickly.`
        };
        break;

      case 'q_role_2':
        if (missingSkillFocus) {
          personalizedAnswer = `While my strongest expertise is in ${primarySkillDesc}, I've consistently demonstrated the ability to learn new technologies quickly and apply them effectively. For example, when I encountered ${missingSkillFocus} in a project context, I dedicated focused time to understanding its core concepts through documentation and hands-on experimentation. I built a small proof-of-concept over a weekend, which gave me practical understanding of its strengths and trade-offs. I'm confident I could become productive with ${missingSkillFocus} within my first two weeks at ${companyName}, just as I've done with every new technology I've needed to learn.`;
          starBreakdown = {
            situation: `The role requires proficiency in ${missingSkillFocus}, which is newer to my active toolkit, and the interviewer wants to know if I can bridge this gap quickly.`,
            task: `Demonstrate that I have a proven, systematic approach to learning new technologies and can apply it to ${missingSkillFocus} within a reasonable timeframe.`,
            action: `I describe my proven learning framework: read official documentation → build a mini project → study open-source implementations → seek code review from experienced practitioners. I provide a concrete example of a technology I mastered quickly in the past.`,
            result: `The interviewer gains confidence that investing in me means getting someone who is a self-directed learner, not someone who needs hand-holding for every new tool.`
          };
        } else {
          personalizedAnswer = `I approach every new technology with curiosity and a structured learning plan. When I need to learn something new, I start with official documentation and tutorials, then immediately build something practical to cement the concepts. I also study how industry leaders use the technology in real projects through open-source code and technical blogs. This approach has helped me quickly become productive with every technology in my current stack, and I'd apply the same rigor to any new tools ${companyName} uses.`;
          starBreakdown = {
            situation: `The interviewer wants to assess my adaptability and continuous learning mindset, which are crucial for any engineering role.`,
            task: `Show that I'm not just comfortable with what I know, but actively excited to expand my skills and can do so efficiently.`,
            action: `I share my proven learning framework with concrete examples of technologies I've picked up quickly, emphasizing my track record of self-directed growth.`,
            result: `Demonstrates that I'm a growth-oriented engineer who sees learning as an opportunity, not a burden.`
          };
        }
        break;

      case 'q_hr_1':
        personalizedAnswer = `In ${experience}, I've learned that working under tight deadlines requires clear prioritization, honest communication, and the ability to focus on what truly matters. When faced with competing priorities, I always start by understanding the business impact of each task and then communicate transparently with stakeholders about timelines. In my project work, I've successfully delivered under aggressive deadlines by breaking work into smaller, testable chunks, focusing first on core functionality, and iterating based on feedback. This approach has consistently allowed me to deliver quality results even when time is limited.`;
        starBreakdown = {
          situation: `In one of my projects, we faced an unexpectedly compressed timeline that threatened our ability to deliver all planned features on schedule.`,
          task: `I needed to ensure we delivered maximum value within the new constraints while maintaining code quality and team morale.`,
          action: `I immediately assessed all remaining work, categorized tasks by impact vs. effort, and communicated a revised plan to stakeholders. I focused the team on building a minimal viable version first, then iteratively added features. Daily stand-ups kept everyone aligned and blockers were addressed within hours, not days.`,
          result: `We delivered the core functionality on time and added two additional features within the first week post-launch. The experience taught me the value of transparency and ruthless prioritization.`
        };
        break;

      case 'q_hr_2':
        personalizedAnswer = `Over the next 2-3 years at ${companyName}, I see myself growing from a strong individual contributor into someone who can mentor others and take ownership of larger system components. I'm particularly excited about deepening my expertise in ${primarySkillDesc} while also expanding into areas like system design and architecture. I want to be the kind of engineer who not only writes great code but also helps the team make better technical decisions. ${companyName}'s reputation for engineering excellence makes it the perfect place for me to grow and contribute at increasing levels of impact.`;
        starBreakdown = {
          situation: `The interviewer is assessing whether I have realistic growth goals that align with what ${companyName} can offer.`,
          task: `Present a genuine career trajectory that shows ambition without overreaching.`,
          action: `I outline a progression from mastering the role → mentoring peers → taking on architectural decisions.`,
          result: `Shows maturity and genuine interest in growing with the company.`
        };
        break;

      case 'q_tech_3':
        personalizedAnswer = `I believe testing is an integral part of development, not an afterthought. In my projects, I follow a pragmatic testing approach — writing unit tests for critical business logic, integration tests for API endpoints, and end-to-end tests for user flows. For example, I used Jest for unit testing in JavaScript projects and PyTest for Python projects. I've found that investing time in testing upfront saves significant debugging time later, especially when refactoring or adding new features. For ${companyName}, I would advocate for comprehensive test coverage and could help set up CI/CD pipelines that run automated tests before every deployment.`;
        starBreakdown = {
          situation: `I recognized that my project's testing coverage was insufficient and bugs were reaching production regularly.`,
          task: `I needed to establish a comprehensive testing strategy that would catch issues early without slowing down development velocity.`,
          action: `I introduced unit tests for business logic, integration tests for APIs, and added a pre-commit hook that runs the test suite before code can be merged.`,
          result: `Bug reports dropped by over 60% and deployment confidence increased significantly across the team.`
        };
        break;

      case 'q_tech_4':
        personalizedAnswer = `I follow a systematic debugging approach that I call "Reproduce, Isolate, Fix, Verify, Prevent." First, I try to reproduce the issue consistently — if I can't reproduce it, I look at logs and monitoring dashboards to understand the pattern. Then I isolate the root cause by checking network requests, database query performance, and recent code changes. I use browser DevTools, profiling tools, and logging to narrow it down. Once I find the issue, I implement a fix with a focused approach, verify it resolves the problem in the staging environment, and finally write a regression test to prevent it from recurring. This methodical approach ensures I don't just apply band-aid fixes.`;
        starBreakdown = {
          situation: `A critical feature in production was experiencing intermittent performance issues affecting user experience.`,
          task: `I needed to identify the root cause and implement a fix without causing service downtime.`,
          action: `I used monitoring dashboards to correlate the slow requests with database query spikes, identified a missing index, and coordinated a safe hotfix deployment.`,
          result: `Response times dropped by 80%, and I added automated performance regression tests to catch similar issues before they reach production.`
        };
        break;

      case 'q_tech_5':
        personalizedAnswer = `I always start by understanding the audience and their goals. When explaining technical concepts to non-technical stakeholders, I avoid jargon entirely and use everyday analogies. For instance, when I explained database indexing to a product manager, I compared it to the index at the back of a textbook — it doesn't change the content but makes finding specific information drastically faster. I focus on business outcomes rather than implementation details: instead of saying 'I optimized the React bundle using code splitting,' I say 'I made the page load twice as fast for users on mobile devices.' I also use visual aids and simple diagrams when possible to make complex systems tangible.`;
        starBreakdown = {
          situation: `I needed to present a technical architecture decision to non-technical stakeholders who would be impacted by the choice.`,
          task: `Translate complex technical trade-offs into clear business language that enables informed decision-making.`,
          action: `I created a simple visual comparison of the two approaches, using analogies and focusing on user experience impact and cost rather than technical implementation details.`,
          result: `The stakeholders made a well-informed decision quickly, and my manager commended me for making technical concepts accessible to the entire team.`
        };
        break;

      case 'q_role_3':
        personalizedAnswer = `What I bring that's unique is the combination of strong technical execution with a deep understanding of user-centric design. Throughout my projects, I've consistently gone beyond just building features — I've thought about how users actually interact with what I create. This dual perspective means I can bridge the gap between design intent and technical implementation, reducing back-and-forth iterations. Additionally, my experience with ${primarySkillDesc} across multiple projects has given me practical knowledge about what works at scale and what doesn't — which means I can make informed architectural decisions that save time and resources for the team at ${companyName}.`;
        starBreakdown = {
          situation: `I noticed that many technical decisions in past projects were made without considering user impact, leading to rework.`,
          task: `I needed to find a way to add value beyond just writing code and contribute to better product decisions.`,
          action: `I started proactively involving myself in design reviews and user feedback sessions, connecting technical constraints with user needs to suggest better solutions.`,
          result: `This cross-functional approach reduced design-to-dev handoff friction by 40% and led to higher user satisfaction scores in released features.`
        };
        break;

      case 'q_role_4':
        personalizedAnswer = `I'm genuinely drawn to ${companyName} because of the specific problem space you're working in. From my research, I can see that the engineering team is solving real, meaningful challenges — not just building another generic CRUD app. Your emphasis on ${primarySkillDesc} aligns perfectly with where I want to grow my career. I also admire the company culture of engineering excellence and continuous learning. Rather than just being another option on my application list, ${companyName} is at the top because I believe my skills can directly contribute to your mission, and your team can provide the growth environment I'm looking for.`;
        starBreakdown = {
          situation: `I applied to ${companyName} specifically because something about their work resonated with my career goals.`,
          task: `Demonstrate genuine research and passion that goes beyond what any other company could offer me.`,
          action: `I reference specific products, technologies, and cultural values that align with my experience and aspirations.`,
          result: `The interviewer sees authentic interest and commitment, not just another application in the pile.`
        };
        break;

      case 'q_hr_3':
        personalizedAnswer = `In a previous project, my teammate and I disagreed on the approach for implementing a data synchronization feature. They preferred a synchronous approach for simplicity, while I argued for an asynchronous event-driven solution for better scalability. Instead of escalating the disagreement, I set up a brief technical discussion where we both presented our approaches with trade-off analysis. I used concrete metrics — estimated response times under load — to support my case. Ultimately, we agreed on a hybrid approach: asynchronous for heavy operations with synchronous handling for simple reads. The decision not only resolved the conflict but also strengthened our working relationship through respectful, evidence-based discussion.`;
        starBreakdown = {
          situation: `A technical disagreement arose between me and a teammate regarding the architecture for a critical feature.`,
          task: `Resolve the conflict constructively while maintaining team harmony and arriving at the best technical decision.`,
          action: `I proposed a structured comparison meeting where both approaches were evaluated on concrete criteria rather than personal preferences.`,
          result: `We adopted a hybrid solution that leveraged the best of both approaches, and our collaboration improved significantly afterward.`
        };
        break;

      case 'q_hr_4':
        personalizedAnswer = `In one of my projects, I worked as the technical lead collaborating with a UX designer, a product manager, and a QA engineer across different time zones. My role was to translate the product requirements into technical tasks while ensuring the designer's vision was faithfully implemented. The biggest challenge was aligning everyone on priorities when requirements changed mid-sprint. I set up a shared documentation system, created clear technical specifications from design mockups, and held brief daily syncs. This cross-disciplinary collaboration resulted in launching a feature two weeks ahead of schedule with zero critical bugs and positive user feedback.`;
        starBreakdown = {
          situation: `I was part of a cross-functional team with different working styles, technical vocabularies, and time zone challenges.`,
          task: `Deliver a cohesive product feature while keeping all teams aligned, informed, and productive despite communication barriers.`,
          action: `I established shared documentation practices, translated technical requirements into design-friendly specs, and maintained brief but consistent synchronization touchpoints.`,
          result: `We delivered ahead of schedule, and the collaborative process became a template for future cross-functional projects in the team.`
        };
        break;

      case 'q_hr_5':
        personalizedAnswer = `One genuine weakness I've been actively working on is public speaking and presenting to large groups. While I'm confident one-on-one and in small team settings, I noticed that presenting to groups of 10+ people made me nervous, which sometimes affected the clarity of my message. To address this, I joined a technical community where I volunteer to present monthly talks, and I also started recording myself presenting and reviewing the recordings to identify areas for improvement. Over the past six months, I've delivered three technical presentations to audiences of 30-50 people with consistently positive feedback. I still have room to grow, but the trajectory is clearly positive.`;
        starBreakdown = {
          situation: `I recognized that my public speaking limitations could hold me back in leadership roles and large team meetings.`,
          task: `Develop a structured improvement plan with measurable milestones to build confidence and clarity when presenting.`,
          action: `I joined a community for regular practice, recorded sessions for self-review, and started volunteering for presentations at team meetings.`,
          result: `I've successfully delivered multiple presentations with positive feedback and continue to seek opportunities to improve.`
        };
        break;

      default:
        break;
    }

    return {
      ...q,
      personalizedAnswer,
      starBreakdown
    };
  });
}

/**
 * Main question generator — creates questions and then enriches their answers
 * with natural, professional language.
 */
export function generateAIQuestions(profile: CandidateProfile, jd: JobDescriptionData): GeneratedQuestion[] {
  const jdSkills = jd.requiredSkills.map(s => s.toLowerCase());
  const profileSkills = profile.skills.map(s => s.toLowerCase());
  const matchingSkills = profile.skills.filter(s => jdSkills.some(j => j.includes(s.toLowerCase()) || s.toLowerCase().includes(j)));
  const missingSkills = jd.requiredSkills.filter(j => !profileSkills.some(s => s.includes(j.toLowerCase()) || j.toLowerCase().includes(s)));

  const primarySkill = matchingSkills[0] || profile.skills[0] || 'your core technologies';
  const companyName = jd.companyName || 'the company';
  const roleName = jd.jobTitle || 'this role';
  const missingSkillMsg = missingSkills.length > 0 ? missingSkills[0] : 'emerging technologies in our stack';

  const questions: GeneratedQuestion[] = [
    {
      id: `q_tech_1_${Date.now() + 0}`,
      category: 'technical',
      question: `In your resume, you highlighted experience with ${primarySkill}. How would you architect a high-performance feature using ${primarySkill} for our system at ${companyName}?`,
      whyAsked: `The JD specifically lists ${primarySkill} as a core requirement. Interviewers want to test your architectural thinking and real-world application of this technology.`,
      personalizedAnswer: '',
      tips: [`Mention specific design patterns (e.g., MVC, Repository pattern, custom hooks).`, `Explain how you handle edge cases and network failures.`, `Relate your answer to ${companyName}'s target audience.`]
    },
    {
      id: `q_tech_2_${Date.now() + 1}`,
      category: 'technical',
      question: `Can you walk us through the most technically challenging project you've built and how you overcame the obstacles you faced?`,
      whyAsked: `Employers look at your projects to gauge problem-solving resilience. They want to hear about real bugs or roadblocks and your methodical debugging process.`,
      personalizedAnswer: '',
      tips: [`Focus on the 'Why' and 'How' rather than just listing libraries.`, `Admit initial mistakes; great engineers show how they learn from bugs.`, `Keep the technical explanation concise but detailed enough for a senior peer.`]
    },
    {
      id: `q_tech_3_${Date.now() + 2}`,
      category: 'technical',
      question: `How do you approach testing and quality assurance in your development workflow? Can you give a specific example?`,
      whyAsked: `Testing is critical for production-quality code. Interviewers want to see if you write tests proactively, not just as an afterthought.`,
      personalizedAnswer: '',
      tips: [`Mention specific testing frameworks you've used (Jest, Cypress, PyTest, etc.).`, `Explain your testing philosophy (TDD, BDD, or pragmatic testing).`, `Give a concrete example where testing caught a critical bug.`]
    },
    {
      id: `q_tech_4_${Date.now() + 3}`,
      category: 'technical',
      question: `Imagine a user reports that a feature is running slowly in production. Walk me through your debugging approach from start to finish.`,
      whyAsked: `Debugging skills are essential. They want to hear a systematic, methodical approach — not just "I looked at the code until I found it."`,
      personalizedAnswer: '',
      tips: [`Start with reproducing the issue in a controlled environment.`, `Mention monitoring tools, logs, and profiling.`, `Show you verify the fix and add regression tests.`]
    },
    {
      id: `q_tech_5_${Date.now() + 4}`,
      category: 'technical',
      question: `If you had to explain a complex technical concept from one of your projects to a non-technical stakeholder, how would you approach it?`,
      whyAsked: `Communication skills are just as important as coding skills. This tests your ability to simplify without losing accuracy.`,
      personalizedAnswer: '',
      tips: [`Use analogies and real-world comparisons.`, `Focus on business impact rather than implementation details.`, `Show you can adapt your language to different audiences.`]
    },
    {
      id: `q_role_1_${Date.now() + 5}`,
      category: 'role_based',
      question: `How does your background in ${profile.experience || 'your experience'} and your skill set prepare you specifically for the responsibilities of the ${roleName} role here at ${companyName}?`,
      whyAsked: `This is the ultimate 'Resume + JD Matching' question. The interviewer wants to see if you understand their daily operational needs and can immediately contribute.`,
      personalizedAnswer: '',
      tips: [`Explicitly mention ${companyName} by name to show tailored preparation.`, `Highlight any matching domain experience.`, `Express enthusiasm for the specific product or service they build.`]
    },
    {
      id: `q_role_2_${Date.now() + 6}`,
      category: 'role_based',
      question: `Our job description emphasizes ${missingSkillMsg}. While you have strong experience in ${primarySkill}, how would you approach ramping up on ${missingSkillMsg}?`,
      whyAsked: `Nobody is a 100% perfect match for every JD. Interviewers test your growth mindset, honesty, and self-directed learning capability.`,
      personalizedAnswer: '',
      tips: [`Never say 'I don't know that'. Instead say 'I am excited to master that'.`, `Give an example of another tool you learned quickly in the past.`, `Emphasize transferable core concepts.`]
    },
    {
      id: `q_role_3_${Date.now() + 7}`,
      category: 'role_based',
      question: `What unique value or perspective would you bring to ${companyName}'s team that other candidates might not?`,
      whyAsked: `They want to understand what differentiates you. This is your chance to showcase your unique combination of skills, experiences, and personality.`,
      personalizedAnswer: '',
      tips: [`Connect your unique background to their team's needs.`, `Mention any cross-functional experience or unique domain knowledge.`, `Show genuine passion for what they do.`]
    },
    {
      id: `q_role_4_${Date.now() + 8}`,
      category: 'role_based',
      question: `Why are you specifically interested in joining ${companyName} rather than other companies in the same space?`,
      whyAsked: `Interviewers want to know if you've researched the company and have genuine reasons for applying — not just mass-applying to everyone.`,
      personalizedAnswer: '',
      tips: [`Reference specific products, technologies, or company values.`, `Mention something about their mission or culture that resonates.`, `Avoid generic answers like 'great company' — be specific.`]
    },
    {
      id: `q_hr_1_${Date.now() + 9}`,
      category: 'hr',
      question: `Tell me about a time when you had to work under tight deadlines or manage conflicting priorities. How did you ensure success?`,
      whyAsked: `Behavioral competency check. Employers want to evaluate your stress management, communication under pressure, and organizational strategies.`,
      personalizedAnswer: '',
      tips: [`Emphasize calm leadership and structured task breakdown.`, `Highlight how you communicated with teammates during the crunch.`, `Show you prioritize business value over perfectionism.`]
    },
    {
      id: `q_hr_2_${Date.now() + 10}`,
      category: 'hr',
      question: `Where do you see yourself growing over the next 2-3 years within ${companyName}?`,
      whyAsked: `Assessing long-term retention and ambition alignment. They want to ensure you are genuinely interested in building a career with them.`,
      personalizedAnswer: '',
      tips: [`Avoid mentioning jumping to different fields or starting your own company.`, `Tie your growth to the success of the team and company.`, `Show eagerness for mentorship and professional development.`]
    },
    {
      id: `q_hr_3_${Date.now() + 11}`,
      category: 'hr',
      question: `Describe a situation where you disagreed with a teammate or supervisor on a technical approach. How did you handle it?`,
      whyAsked: `This tests your emotional intelligence, conflict resolution skills, and ability to be a team player while standing your ground when needed.`,
      personalizedAnswer: '',
      tips: [`Show respect for the other person's perspective first.`, `Explain how you used data or evidence to support your position.`, `Describe the resolution and what you learned from the experience.`]
    },
    {
      id: `q_hr_4_${Date.now() + 12}`,
      category: 'hr',
      question: `Tell me about a project where you had to collaborate with people from different teams or disciplines. What was your role and what did you achieve?`,
      whyAsked: `Cross-functional collaboration is essential in modern tech companies. They want to see if you can work effectively with designers, PMs, and other engineers.`,
      personalizedAnswer: '',
      tips: [`Clearly define your role and how it overlapped with others.`, `Show how you communicated across disciplines with different vocabularies.`, `Highlight the shared outcome and your specific contribution to it.`]
    },
    {
      id: `q_hr_5_${Date.now() + 13}`,
      category: 'hr',
      question: `What is one weakness you are actively working to improve? How are you going about it?`,
      whyAsked: `Self-awareness and continuous improvement mindset. They want to see honest reflection and concrete action — not rehearsed generic answers.`,
      personalizedAnswer: '',
      tips: [`Choose a genuine weakness, not a disguised strength.`, `Explain the specific steps you're taking to improve.`, `Show measurable progress — "I went from X to Y" is powerful.`]
    }
  ];

  // Now enrich each question with natural, professional answers
  return generatePersonalizedAnswers(profile, jd, questions);
}

/**
 * Helper to simulate grading practice answers
 */
export function evaluatePracticeAnswer(practiceAnswer: string, idealAnswer: string, keywords: string[]): { score: number; strengths: string[]; improvements: string[]; missingKeywords: string[] } {
  if (!practiceAnswer || practiceAnswer.trim().length < 10) {
    return {
      score: 25,
      strengths: ['Attempted practice mode'],
      improvements: ['Answer is significantly too short. Aim for at least 3-4 comprehensive sentences.', 'Use the STAR method to structure your response.'],
      missingKeywords: keywords
    };
  }

  const normalizedPractice = practiceAnswer.toLowerCase();
  const normalizedIdeal = idealAnswer.toLowerCase();
  const foundKeywords = keywords.filter(kw => normalizedPractice.includes(kw.toLowerCase()));
  const missing = keywords.filter(kw => !normalizedPractice.includes(kw.toLowerCase()));

  let score = 50;

  // Length calculation
  const wordCount = practiceAnswer.split(/\s+/).length;
  if (wordCount > 40) score += 20;
  else if (wordCount > 20) score += 10;

  // Keyword calculation
  const keywordRatio = keywords.length > 0 ? foundKeywords.length / keywords.length : 1;
  score += Math.round(keywordRatio * 20);

  // Ideal answer overlap bonus
  const idealWords = normalizedIdeal.split(/\s+/).filter(w => w.length > 4);
  const matchedIdealWords = idealWords.filter(w => normalizedPractice.includes(w));
  if (matchedIdealWords.length > 5) score += 10;

  // Formatting / punctuation check
  if (/[.!?]/.test(practiceAnswer) && practiceAnswer.charAt(0) === practiceAnswer.charAt(0).toUpperCase()) score += 5;

  score = Math.min(100, Math.max(30, score));

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (wordCount > 30) strengths.push('Excellent answer length and descriptive depth.');
  else improvements.push('Elaborate further with specific project examples or quantifiable results.');

  if (foundKeywords.length > 0) strengths.push(`Successfully incorporated relevant domain keywords: ${foundKeywords.slice(0, 3).join(', ')}.`);
  if (missing.length > 0) improvements.push(`Consider mentioning key terms from the Job Description: ${missing.slice(0, 3).join(', ')}.`);

  if (practiceAnswer.toLowerCase().includes('i think') || practiceAnswer.toLowerCase().includes('maybe')) {
    improvements.push("Avoid hesitant phrases like 'I think' or 'maybe'. Speak with absolute professional certainty.");
  } else {
    strengths.push('Maintained a confident and assertive tone.');
  }

  return { score, strengths, improvements, missingKeywords: missing };
}

/**
 * Simulated Resume Parser helper (legacy, kept for backward compatibility)
 * The new parser in resumeParser.ts handles this properly.
 */
export function simulateResumeParsing(text: string | null, fileName: string): CandidateProfile {
  const lowerText = (text || '').toLowerCase();

  const profile: CandidateProfile = {
    name: 'Uploaded Candidate',
    targetRole: 'Software Professional',
    skills: ['JavaScript', 'Problem Solving', 'Teamwork', 'HTML/CSS', 'Git'],
    projects: [
      { title: 'Enterprise Web Solution', description: 'Collaborated in an agile team to develop a responsive web portal reducing processing delays.', technologies: ['JavaScript', 'HTML', 'CSS', 'Git'] }
    ],
    experience: '1-2 years of software development experience',
    education: "Bachelor's Degree in Technology or Computer Science",
    strengths: ['Adaptability', 'Effective Communication', 'Analytical Thinking']
  };

  if (!text) return profile;

  const firstLine = text.split('\n')[0]?.trim();
  if (firstLine && firstLine.length < 30) profile.name = firstLine;
  else if (fileName) profile.name = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

  const commonTech = ['React', 'TypeScript', 'Node.js', 'Python', 'Java', 'SQL', 'MongoDB', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GraphQL', 'Next.js', 'Vue', 'Angular', 'Machine Learning', 'Figma', 'UI/UX', 'C++', 'C#', 'PHP', 'Express', 'Tailwind', 'REST API', 'Agile'];
  const detectedSkills = commonTech.filter(tech => lowerText.includes(tech.toLowerCase()));
  if (detectedSkills.length > 0) profile.skills = detectedSkills;

  if (lowerText.includes('data') || lowerText.includes('machine learning')) profile.targetRole = 'Data Scientist / ML Engineer';
  else if (lowerText.includes('react') || lowerText.includes('full stack') || lowerText.includes('frontend') || lowerText.includes('backend')) profile.targetRole = 'Full Stack Software Engineer';
  else if (lowerText.includes('design') || lowerText.includes('figma') || lowerText.includes('ui/ux')) profile.targetRole = 'UI/UX Product Designer';
  else if (lowerText.includes('manager') || lowerText.includes('product')) profile.targetRole = 'Product Manager';

  return profile;
}

/**
 * Smart JD Parser: extracts job title, company, skills, responsibilities, and experience
 * from real-world job descriptions with multi-line support.
 */
export function simulateJDParsing(text: string): JobDescriptionData {
  if (!text || !text.trim()) {
    return {
      jobTitle: 'Software / Tech Professional',
      companyName: 'Company Name',
      description: 'Please paste the full job description for intelligent analysis.',
      requiredSkills: ['JavaScript', 'Problem Solving', 'Communication'],
      responsibilities: ['Design and build software features', 'Collaborate with teams', 'Participate in code reviews'],
      expectedExperience: '0-2 years'
    };
  }

  const lower = text.toLowerCase();
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const cleanedLines = lines.filter(l => /^[A-Za-z0-9\s/+\-#().&:,]+$/.test(l)); // Remove garbled lines

  // ----- JOB TITLE EXTRACTION -----
  // Look for common job title patterns
  const jobTitlePatterns = [
    /(?:senior|junior|lead|staff|principal|intern|entry.level)?\s*(?:software\s*engineer|software\s*developer|full\s*stack|front.end|back.end|web\s*developer|data\s*scientist|machine\s*learning\s*engineer|ml\s*engineer|devops\s*engineer|site\s*reliability|cloud\s*engineer|product\s*manager|ui.?ux\s*designer|product\s*designer|mobile\s*developer|android\s*developer|ios\s*developer|qa\s*engineer|test\s*engineer|data\s*engineer|systems?\s*engineer|tech\s*lead|engineering\s*manager|solutions?\s*architect)/i,
    /(?:sde|sde\s*-?\s*i|sde\s*-?\s*ii|sde\s*-\s*1|sde\s*-\s*2|sde\s*-\s*3|sde\s*intern)/i,
    /(?:software\s+development\s+engineer|software\s+engineering\s+manager)/i,
  ];

  let jobTitle = '';

  // First check if the very first line looks like a job title
  if (cleanedLines[0] && cleanedLines[0].length < 80 && cleanedLines[0].length > 3) {
    if (/engineer|developer|scientist|architect|manager|designer|lead|intern/i.test(cleanedLines[0])) {
      jobTitle = cleanedLines[0].replace(/^[-–*•#=\s]+/, '').trim();
    }
  }

  // If not found, search all lines for job title patterns
  if (!jobTitle) {
    for (const pattern of jobTitlePatterns) {
      const match = text.match(pattern);
      if (match) {
        jobTitle = match[0].trim();
        break;
      }
    }
  }

  // Still not found - look for lines with "we are hiring" or "role:" etc.
  if (!jobTitle) {
    const roleLine = lines.find(l => /^role\s*:?\s*title/i.test(l) || /^position/i.test(l) || /^hiring\s+for/i.test(l) || /^opening/i.test(l));
    if (roleLine) jobTitle = roleLine.replace(/^.*?:\s*/, '').trim();
  }

  if (!jobTitle) jobTitle = 'Software / Technology Professional';

  // ----- COMPANY NAME EXTRACTION -----
  let companyName = '';

  // Check for "Company:" or "At:" patterns
  const companyLine = lines.find(l => /^company\s*[:\-\–]?\s*/i.test(l) || /^at\s+[A-Z][A-Za-z\s&.]+$/i.test(l) || /^organization\s*[:\-\–]?/i.test(l));
  if (companyLine) {
    companyName = companyLine.replace(/^(company|at|organization)\s*[:\-\–]?\s*/i, '').trim();
  }

  // If second line is short and doesn't look like a sentence, it might be company
  if (!companyName && cleanedLines[1] && cleanedLines[1].length < 50 && cleanedLines[1].length > 2) {
    const l2 = cleanedLines[1];
    // Skip if it's a URL, email, or generic text
    if (!l2.includes('@') && !l2.startsWith('http') && !l2.startsWith('www') && !/^we\s+(are|are\s+looking|are\s+hiring|are\s+seeking)/i.test(l2)) {
      companyName = l2.replace(/^[-–*•#=\s]+/, '').trim();
    }
  }

  // Look for well-known company names in the text
  if (!companyName) {
    const knownCompanies = ['Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix', 'TCS', 'Infosys', 'Wipro', 'HCL', 'Cognizant', 'Accenture', 'Flipkart', 'Swiggy', 'Zomato', 'Razorpay', 'Zerodha', 'PhonePe', 'Paytm', 'Freshworks', 'Zoho', 'Adobe', 'Salesforce', 'Oracle', 'IBM', 'Intel', 'NVIDIA', 'Samsung', 'Uber', 'Lyft', 'Spotify', 'Stripe', 'Shopify', 'Atlassian', 'Snowflake', 'Datadog', 'Twilio'];
    for (const co of knownCompanies) {
      if (lower.includes(co.toLowerCase())) {
        companyName = co;
        break;
      }
    }
  }

  if (!companyName) companyName = 'Target Company';

  // ----- SKILLS EXTRACTION (much expanded list) -----
  const skillKeywords = [
    'React', 'ReactJS', 'React.js', 'Vue', 'Vue.js', 'Angular', 'Next.js', 'Svelte',
    'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Java', 'C', 'C++', 'C#',
    'Go', 'Golang', 'Rust', 'Kotlin', 'Swift', 'PHP', 'Ruby',
    'HTML', 'CSS', 'HTML5', 'CSS3', 'SASS', 'Tailwind', 'Bootstrap',
    'Spring Boot', 'Spring', 'Django', 'Flask', 'FastAPI', 'Laravel',
    'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Google Cloud',
    'REST API', 'REST APIs', 'GraphQL', 'gRPC', 'SOAP', 'Microservices',
    'Git', 'GitHub', 'CI/CD', 'Jenkins', 'GitHub Actions', 'Terraform',
    'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'Pandas',
    'Agile', 'Scrum', 'JIRA', 'TDD', 'System Design', 'OOP',
    'Figma', 'Adobe XD', 'UI/UX', 'Data Structures', 'Algorithms',
    'Express', 'NestJS', 'Hibernate', 'Maven', 'Gradle',
    'Linux', 'Bash', 'Shell Scripting', 'Nginx', 'Apache',
    'Redux', 'Redux Toolkit', 'React Native', 'Flutter', 'Dart',
    'Elasticsearch', 'Kafka', 'RabbitMQ', 'PostgreSQL', 'Firebase',
  ];

  // Also check for skills in a "Skills" or "Requirements" section
  let skillsSectionStart = -1;
  const sectionHeaders = ['requirements', 'required skills', 'qualifications', 'skills and qualifications', 'technical skills', 'must have', 'what you bring'];
  for (let i = 0; i < cleanedLines.length; i++) {
    if (sectionHeaders.some(h => cleanedLines[i].toLowerCase().includes(h))) {
      skillsSectionStart = i;
      break;
    }
  }

  // Search for skills - prioritize the requirements section if found
  let searchText = lower;
  if (skillsSectionStart >= 0) {
    // Get text from requirements section onwards
    const reqSection = cleanedLines.slice(skillsSectionStart).join(' ');
    searchText = reqSection.toLowerCase() + '\n' + lower;
  }

  const matchedSkills = skillKeywords.filter(skill => searchText.includes(skill.toLowerCase()));

  // De-duplicate (e.g., "React" and "ReactJS" are both there)
  const skillSeen = new Set<string>();
  const finalSkills = matchedSkills.filter(s => {
    const key = s.toLowerCase();
    if (skillSeen.has(key)) return false;
    // Don't include short generic skills if there are better ones
    if (key === 'c' && (matchedSkills.includes('C++') || matchedSkills.includes('C#'))) return false;
    if (key === 'sql' && matchedSkills.some(ms => ms.toLowerCase().includes('sql') && ms.length > 3)) return false;
    skillSeen.add(key);
    return true;
  });

  // Also look for "X+ years" patterns for experience
  const expMatch = text.match(/(\d+)\+?\s*(?:years?|yrs?)(?:\s+of\s+)?(?:relevant\s+)?(?:experience|exp)/i);
  const expRange = text.match(/(\d+)\s*[-–to]+\s*(\d+)\s*years/i);

  let expectedExperience = '';
  if (expRange) expectedExperience = `${expRange[1]}-${expRange[2]} years`;
  else if (expMatch) expectedExperience = `${expMatch[1]}+ years`;
  else expectedExperience = 'Not specified';

  // ----- RESPONSIBILITIES EXTRACTION -----
  const responsibilities: string[] = [];
  const respKeywords = ['responsibilities', 'you will', 'what you', 'your role', 'key duties', 'what you\'ll', 'you\'ll be', 'key responsibilities'];

  let respStartIdx = -1;
  for (let i = 0; i < cleanedLines.length; i++) {
    if (respKeywords.some(k => cleanedLines[i].toLowerCase().includes(k))) {
      respStartIdx = i;
      break;
    }
  }

  if (respStartIdx >= 0) {
    // Collect bullet points after the responsibilities header
    const sectionEnders = ['requirements', 'qualifications', 'skills', 'benefits', 'compensation', 'salary', 'perks', 'about us', 'why join', 'what we offer', 'who you are'];
    let collected: string[] = [];

    for (let i = respStartIdx + 1; i < Math.min(respStartIdx + 20, cleanedLines.length); i++) {
      const line = cleanedLines[i];
      if (sectionEnders.some(se => line.toLowerCase().startsWith(se) || line.toLowerCase().includes(' ' + se + ':'))) break;
      // Accept bullet points or numbered items
      const cleaned = line.replace(/^[-–•*\d.)]+\s*/, '').trim();
      if (cleaned.length > 10 && cleaned.length < 300) {
        collected.push(cleaned);
      }
      if (collected.length >= 6) break;
    }

    responsibilities.push(...collected.slice(0, 5));
  }

  // If no responsibilities found from section parsing, extract from text
  if (responsibilities.length === 0) {
    // Look for lines starting with action verbs that sound like responsibilities
    const actionStarts = ['design', 'develop', 'build', 'implement', 'collaborate', 'work', 'create', 'maintain', 'lead', 'manage', 'architect', 'optimize', 'test', 'deploy', 'mentor', 'drive', 'define'];
    for (const line of cleanedLines) {
      if (responsibilities.length >= 5) break;
      const cleaned = line.replace(/^[-–•*\d.)]+\s*/, '').trim();
      if (cleaned.length > 15 && cleaned.length < 300 && actionStarts.some(a => cleaned.toLowerCase().startsWith(a))) {
        responsibilities.push(cleaned);
      }
    }
  }

  if (responsibilities.length === 0) {
    responsibilities.push(
      'Design, build, and maintain high-quality software features',
      'Collaborate effectively with cross-functional teams',
      'Participate in code reviews and advocate for best practices',
      'Write clean, testable, and well-documented code',
      'Contribute to technical design discussions and architecture decisions'
    );
  }

  return {
    jobTitle,
    companyName,
    description: text.length > 2000 ? text.slice(0, 2000) + '...' : text,
    requiredSkills: finalSkills.length > 0 ? finalSkills : ['JavaScript', 'Problem Solving', 'Communication', 'Technical Excellence'],
    responsibilities,
    expectedExperience
  };
}
