import { CandidateProfile, JobDescriptionData } from '../data/samplePresets';

export interface MatchInsightsData {
  overallFit: number;
  skillCoverage: number;
  interviewRisk: number;
  detectedStrengths: string[];
  missingKeywords: string[];
  recruiterSummary: string;
}

export function computeMatchInsights(profile: CandidateProfile, jd: JobDescriptionData): MatchInsightsData {
  const profileSkills = profile.skills.map(s => s.toLowerCase().trim());
  const jdSkills = jd.requiredSkills.map(s => s.toLowerCase().trim());
  const profileProjects = profile.projects.map(p => p.title + ' ' + p.description + ' ' + p.technologies.join(' ')).join(' ').toLowerCase();
  const profileExp = (profile.experience + ' ' + profile.education + ' ' + profile.strengths.join(' ')).toLowerCase();
  const profileAllText = profileProjects + ' ' + profileExp + ' ' + profileSkills.join(' ');

  // Detected strengths: skills found in JD that match profile
  const detectedStrengths: string[] = [];
  const missingKeywords: string[] = [];

  for (const jdSkill of jdSkills) {
    const matched = profileSkills.some(ps => ps.includes(jdSkill) || jdSkill.includes(ps));
    if (matched) {
      detectedStrengths.push(jdSkill.charAt(0).toUpperCase() + jdSkill.slice(1));
    } else {
      // Check if it's mentioned in projects or experience
      if (profileAllText.includes(jdSkill)) {
        detectedStrengths.push(jdSkill.charAt(0).toUpperCase() + jdSkill.slice(1));
      } else {
        missingKeywords.push(jdSkill.charAt(0).toUpperCase() + jdSkill.slice(1));
      }
    }
  }

  // Also add unique profile strengths
  const additionalStrengths = profile.strengths.filter(s => !detectedStrengths.some(ds => ds.toLowerCase() === s.toLowerCase()));
  detectedStrengths.push(...additionalStrengths);

  // Add profile skills that aren't in JD as bonus strengths
  const extraSkills = profile.skills.filter(s => !jdSkills.some(js => js.includes(s.toLowerCase()) || s.toLowerCase().includes(js)));
  detectedStrengths.push(...extraSkills);

  // Deduplicate
  const uniqueStrengths = Array.from(new Set(detectedStrengths));
  const uniqueMissing = Array.from(new Set(missingKeywords));

  // Calculate scores
  const totalJdSkills = jdSkills.length || 1;
  const matchedCount = totalJdSkills - uniqueMissing.length;
  const skillCoverage = Math.round((matchedCount / totalJdSkills) * 100);
  
  // Overall fit: weighted combination
  const projectStrength = profile.projects.length > 0 ? 15 : 0;
  const expStrength = profile.experience && profile.experience.length > 5 ? 10 : 0;
  const overallFit = Math.min(100, Math.max(15, Math.round(skillCoverage * 0.7 + projectStrength + expStrength)));
  
  // Interview risk: inverse of coverage + missing penalty
  const interviewRisk = Math.min(100, Math.max(0, Math.round(100 - overallFit + (uniqueMissing.length * 3))));

  // Recruiter-facing summary
  const strengthsList = uniqueStrengths.slice(0, 6).join(', ');
  const missingList = uniqueMissing.slice(0, 5).join(', ');
  
  let summary = `Candidate appears `;
  if (overallFit >= 80) summary += `strongly aligned`;
  else if (overallFit >= 60) summary += `reasonably aligned`;
  else summary += `partially aligned`;
  summary += ` for ${jd.jobTitle}. `;
  
  if (uniqueStrengths.length > 0) summary += `Strong evidence found for ${strengthsList}. `;
  summary += `Interview should validate project depth, debugging, communication`;
  if (uniqueMissing.length > 0) summary += ` and gaps around ${missingList}`;
  summary += `.`;

  return {
    overallFit,
    skillCoverage,
    interviewRisk,
    detectedStrengths: uniqueStrengths,
    missingKeywords: uniqueMissing,
    recruiterSummary: summary
  };
}

export function computeFeedbackMetrics(practiceAnswer: string, keywords: string[]) {
  if (!practiceAnswer || practiceAnswer.trim().length < 10) {
    return { overall: 25, structure: 20, keywords: 15, clarity: 30 };
  }

  const normalizedPractice = practiceAnswer.toLowerCase();
  const wordCount = practiceAnswer.split(/\s+/).length;
  const sentCount = practiceAnswer.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  
  // Structure score: checks for STAR-like structure
  const hasSituation = /(situation|when|while|during|in my|previous|project|role)/i.test(practiceAnswer);
  const hasTask = /(task|goal|objective|needed|required|had to|responsibility)/i.test(practiceAnswer);
  const hasAction = /(action|implemented|built|created|developed|designed|led|managed|used)/i.test(practiceAnswer);
  const hasResult = /(result|outcome|achieved|improved|reduced|increased|delivered|saved|launched)/i.test(practiceAnswer);
  
  let structureScore = 20;
  if (hasSituation) structureScore += 20;
  if (hasTask) structureScore += 20;
  if (hasAction) structureScore += 20;
  if (hasResult) structureScore += 20;
  
  // Keywords score
  const foundKeywords = keywords.filter(kw => normalizedPractice.includes(kw.toLowerCase()));
  const keywordRatio = keywords.length > 0 ? foundKeywords.length / keywords.length : 0;
  const keywordsScore = Math.round(keywordRatio * 80) + 10;

  // Clarity score
  let clarityScore = 50;
  if (wordCount > 30) clarityScore += 15;
  if (wordCount > 50) clarityScore += 10;
  if (sentCount >= 3) clarityScore += 10;
  if (/[.!?]/.test(practiceAnswer) && practiceAnswer.charAt(0) === practiceAnswer.charAt(0).toUpperCase()) clarityScore += 10;
  if (!/(i think|maybe|probably|kind of)/i.test(practiceAnswer)) clarityScore += 5;
  clarityScore = Math.min(100, clarityScore);
  
  // Overall
  const overall = Math.round((structureScore * 0.35 + keywordsScore * 0.35 + clarityScore * 0.3));
  
  return {
    overall: Math.min(100, Math.max(10, overall)),
    structure: Math.min(100, Math.max(10, structureScore)),
    keywords: Math.min(100, Math.max(10, keywordsScore)),
    clarity: Math.min(100, Math.max(10, clarityScore))
  };
}
