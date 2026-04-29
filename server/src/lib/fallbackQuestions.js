const interviewAngles = [
  {
    id: "fundamentals",
    title: "Fundamentals Check",
    buildQuestion: ({ topic, role, experience }) =>
      `What is ${topic}, and why does it matter for a ${role} with ${experience} years of experience?`,
    buildAnswer: ({ topic, role, experience }) =>
      `A strong answer should first define ${topic} clearly, then explain why it matters in real work for a ${role}. After that, connect it to implementation decisions, team velocity, product quality, or system reliability. For a candidate with ${experience} years of experience, interviewers usually expect both conceptual clarity and evidence that you have used the concept to make better engineering decisions.`,
    buildExplanation: ({ topic, role }) =>
      `Start by defining ${topic} in plain language.\n\nThen explain where it appears in the day-to-day work of a ${role}, what problems it helps solve, and why teams rely on it.\n\nA good response also mentions one practical example so the interviewer can see that you understand both the theory and the application.`
  },
  {
    id: "debugging",
    title: "Debugging Scenario",
    buildQuestion: ({ topic, role }) =>
      `Suppose a feature related to ${topic} is behaving incorrectly in production. How would you debug the issue step by step as a ${role}?`,
    buildAnswer: ({ topic, role }) =>
      `A strong answer should walk through a practical debugging path: reproduce the issue, narrow down the failure surface, inspect logs or browser/dev tooling, validate assumptions, and isolate whether the problem comes from logic, state, data flow, infrastructure, or integration boundaries. For ${topic}, it helps to explain what signals you would check first and how you would avoid making the incident worse while investigating. Interviewers want to hear structured troubleshooting, not random guessing.`,
    buildExplanation: ({ topic }) =>
      `This question is testing structured debugging judgment.\n\nFor ${topic}, the interviewer wants to hear how you reduce uncertainty, verify hypotheses, and move from symptoms to root cause.\n\nA great answer sounds methodical: reproduce, inspect, isolate, confirm, fix, and add prevention.`
  },
  {
    id: "tradeoff",
    title: "Tradeoff Discussion",
    buildQuestion: ({ topic, role }) =>
      `What tradeoffs would you consider when choosing one approach over another for ${topic} in a ${role} interview setting?`,
    buildAnswer: ({ topic }) =>
      `A strong answer should explain that there is rarely a single best solution for ${topic}. Instead, the right choice depends on scale, maintainability, performance, team familiarity, delivery speed, and failure tolerance. The best answers compare at least two reasonable options, explain what each optimizes for, and show how you would choose based on the constraints of the system rather than personal preference alone.`,
    buildExplanation: ({ topic }) =>
      `Interviewers ask this to see whether you can reason instead of recite.\n\nFor ${topic}, they want evidence that you understand competing priorities, such as simplicity versus flexibility or speed versus correctness.\n\nIf your answer explains why a decision changes under different constraints, it will sound much stronger.`
  },
  {
    id: "project",
    title: "Project-Based Follow-Up",
    buildQuestion: ({ topic, role, resumeProfile }) =>
      resumeProfile?.projects?.length
        ? `On your resume, you mention work that likely touches ${topic}. How would you describe a real project where you applied ${topic} as a ${role}?`
        : `Describe a project where you applied ${topic} as a ${role}. What problem were you solving, and what was your contribution?`,
    buildAnswer: ({ topic }) =>
      `A strong answer should tell a compact project story: the problem, the context, the constraint, the technical decisions you made around ${topic}, and the outcome. Interviewers usually care less about buzzwords and more about whether you can explain ownership, tradeoffs, and lessons learned. The answer should make your contribution specific instead of speaking only at the team level.`,
    buildExplanation: ({ topic }) =>
      `This is a practical credibility question.\n\nFor ${topic}, the interviewer wants proof that you have used the concept in real project work and can explain your own contribution clearly.\n\nA clean structure is: context, challenge, action, result, and what you learned.`
  },
  {
    id: "design",
    title: "Design and Scalability",
    buildQuestion: ({ topic, role }) =>
      `If you had to design or improve a system involving ${topic}, what architecture or implementation choices would you make first as a ${role}?`,
    buildAnswer: ({ topic, role }) =>
      `A strong answer should start with requirements and constraints, then move into architecture choices, key components, risk areas, and how success would be measured. For ${topic}, a candidate should explain how their decisions would affect scalability, maintainability, and observability. Interviewers expect a ${role} candidate to show structured thinking, not just list technologies.`,
    buildExplanation: ({ topic }) =>
      `This question checks whether you can think beyond isolated features.\n\nFor ${topic}, the interviewer wants to hear how you move from requirements to design choices, what bottlenecks you expect, and how you would validate the solution after implementation.\n\nA strong answer names components, data flow, tradeoffs, and failure modes.`
  }
];

function normalizeQuestion(question) {
  return question.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function buildTopics(focusAreas, count) {
  const concepts = focusAreas.length ? focusAreas : ["Core concepts", "Problem solving", "System design"];
  return Array.from({ length: count }, (_, index) => concepts[index % concepts.length]);
}

export function ensureQuestionSetQuality(
  questions,
  { role, experience, focusAreas, count = 5, existingQuestions = [], resumeProfile = null }
) {
  const normalizedExisting = new Set(existingQuestions.map(normalizeQuestion));
  const seen = new Set();
  const filtered = [];

  for (const item of questions) {
    const normalized = normalizeQuestion(item.question || "");
    if (!normalized || normalizedExisting.has(normalized) || seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    filtered.push({
      ...item,
      title: item.title || "Interview Question",
      tags: Array.isArray(item.tags) ? item.tags : [role, ...(focusAreas || [])].filter(Boolean).slice(0, 3),
      isPinned: Boolean(item.isPinned),
      userAnswer: item.userAnswer || "",
      lastEvaluation: item.lastEvaluation || { score: null, feedback: "" }
    });
  }

  if (filtered.length < count) {
    const supplemental = generateFallbackQuestions({
      role,
      experience,
      focusAreas,
      count: count - filtered.length,
      existingQuestions: [...existingQuestions, ...filtered.map((item) => item.question)],
      resumeProfile
    });
    return [...filtered, ...supplemental].slice(0, count);
  }

  return filtered.slice(0, count);
}

export function generateFallbackQuestions({
  role,
  experience,
  focusAreas,
  count = 5,
  existingQuestions = [],
  resumeProfile = null
}) {
  const topics = buildTopics(focusAreas, count);
  const used = new Set(existingQuestions.map(normalizeQuestion));

  const generated = topics.map((topic, index) => {
    const angle = interviewAngles[index % interviewAngles.length];
    const question = angle.buildQuestion({ topic, role, experience, resumeProfile });
    const normalized = normalizeQuestion(question);
    const uniqueIndex = existingQuestions.length + index + 1;

    if (used.has(normalized)) {
      const fallbackAngle = interviewAngles[(index + 2) % interviewAngles.length];
      const alternateQuestion = fallbackAngle.buildQuestion({ topic, role, experience, resumeProfile });
      used.add(normalizeQuestion(alternateQuestion));
      return {
        title: `${topic}: ${fallbackAngle.title}`,
        question: alternateQuestion,
        answer: fallbackAngle.buildAnswer({ topic, role, experience, resumeProfile }),
        explanation: fallbackAngle.buildExplanation({ topic, role, experience, resumeProfile }),
        tags: [topic, fallbackAngle.id, role],
        isPinned: existingQuestions.length === 0 && index === 0,
        userAnswer: "",
        lastEvaluation: {
          score: null,
          feedback: ""
        }
      };
    }

    used.add(normalized);
    return {
      title: `${topic}: ${angle.title} ${uniqueIndex}`,
      question,
      answer: angle.buildAnswer({ topic, role, experience, resumeProfile }),
      explanation: angle.buildExplanation({ topic, role, experience, resumeProfile }),
      tags: [topic, angle.id, role],
      isPinned: existingQuestions.length === 0 && index === 0,
      userAnswer: "",
      lastEvaluation: {
        score: null,
        feedback: ""
      }
    };
  });

  return generated;
}

export function generateFallbackExplanation(question) {
  return (
    `Core Idea\n${question.question} is really testing whether you understand the concept well enough to explain both the theory and the practical engineering decisions behind it.\n\n` +
    `Why Interviewers Ask This\nInterviewers use questions like this to see whether you can move beyond a memorized definition and explain where the concept shows up in production work. They want to hear whether you understand impact, tradeoffs, constraints, and the situations where the concept becomes important.\n\n` +
    `How To Build A Strong Answer\nStart with a crisp definition in simple language. Then connect that definition to the kind of system or feature where the concept matters. After that, talk through one practical scenario, the decision you would make, and why that decision is reasonable. A good answer should sound like you have applied the concept, not just read about it.\n\n` +
    `Common Mistakes\nAvoid giving only a textbook definition. Avoid jumping straight into tools or buzzwords without explaining what problem the concept solves. Also avoid answers that sound absolute. Strong interview answers usually explain when an approach works well and when another choice might be better.\n\n` +
    `Practical Example\nImagine you are asked about component state in React. A better answer is not just "state stores data." A better answer explains that state is used for data that changes over time, like form values, loading flags, or selected filters, and that updating state triggers re-renders so the UI stays in sync with user actions.\n\n` +
    `Example Code\n\`\`\`jsx\nfunction SearchBox() {\n  const [query, setQuery] = useState(\"\");\n\n  return (\n    <input\n      value={query}\n      onChange={(event) => setQuery(event.target.value)}\n      placeholder=\"Search interviews\"\n    />\n  );\n}\n\`\`\`\n\n` +
    `In an interview, code like this helps because it turns an abstract concept into something concrete and easy to reason about.`
  );
}

export function generateFallbackEvaluation(answer) {
  const score = Math.max(68, Math.min(96, 60 + Math.round(answer.length / 8)));
  return {
    score,
    feedback:
      "Your answer covers the core idea well. To push the score higher, add one specific production example, mention a tradeoff, and close with how you would measure success after implementation."
  };
}
