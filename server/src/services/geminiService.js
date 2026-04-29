import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  ensureQuestionSetQuality,
  generateFallbackEvaluation,
  generateFallbackExplanation,
  generateFallbackQuestions
} from "../lib/fallbackQuestions.js";

function getModel() {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }

  const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return client.getGenerativeModel({ model: "gemini-1.5-flash" });
}

export async function generateInterviewQuestions({
  role,
  experience,
  focusAreas,
  count = 5,
  existingQuestions = [],
  resumeProfile = null
}) {
  const model = getModel();

  if (!model) {
    return generateFallbackQuestions({ role, experience, focusAreas, count, existingQuestions });
  }

  const prompt = `
Generate exactly ${count} interview questions and answers for a ${role} with ${experience} years of experience.
Focus areas: ${focusAreas.join(", ")}.
Avoid repeating or paraphrasing these existing questions: ${existingQuestions.join(" | ")}.
Resume context:
${resumeProfile ? `Summary: ${resumeProfile.summary}\nSkills: ${resumeProfile.skills.join(", ")}\nProjects: ${resumeProfile.projects.join(" | ")}\nHighlights: ${resumeProfile.highlights.join(" | ")}` : "No resume was uploaded."}
Make the set diverse. The questions must cover different interview angles such as:
- one fundamentals question
- one practical implementation question
- one debugging or troubleshooting question
- one tradeoff or comparison question
- one architecture or project discussion question

Every question must be:
- unique
- directly relevant to the role and focus areas
- phrased like a real interview question, not a study prompt
- different in intent from the others

Return valid JSON with this shape:
[
  {
    "title": "short heading",
    "question": "question text",
    "answer": "strong and interview-ready answer in 2 to 4 substantial paragraphs",
    "explanation": "detailed teaching style breakdown with multiple paragraphs",
    "tags": ["topic", "role"]
  }
]
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(text);
    const normalized = parsed.map((item) => ({
      ...item,
      isPinned: false,
      userAnswer: "",
      lastEvaluation: {
        score: null,
        feedback: ""
      }
    }));
    return ensureQuestionSetQuality(normalized, {
      role,
      experience,
      focusAreas,
      count,
      existingQuestions,
      resumeProfile
    });
  } catch {
    return generateFallbackQuestions({ role, experience, focusAreas, count, existingQuestions, resumeProfile });
  }
}

export async function generateQuestionExplanation(question, role) {
  const model = getModel();

  if (!model) {
    return generateFallbackExplanation(question);
  }

  const prompt = `
Explain this interview question for a ${role} candidate in a practical teaching style.
Question: ${question.question}
Current answer: ${question.answer}
Write a detailed explanation that feels like a strong mentor walking the candidate through the topic.

Required sections:
1. Core idea
2. Why interviewers ask this
3. How to build a strong answer
4. Common mistakes
5. Practical example

Important rules:
- Be detailed and genuinely useful, not brief
- Use multiple paragraphs under the sections
- If code helps explain the concept, include a short code example in a fenced code block
- Keep the code focused and interview-relevant
- Use plain English and connect the explanation back to the interview context
`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch {
    return generateFallbackExplanation(question);
  }
}

export async function evaluateReadiness({ question, answer, role }) {
  const model = getModel();

  if (!model) {
    return generateFallbackEvaluation(answer);
  }

  const prompt = `
You are an interview coach.
Role: ${role}
Question: ${question}
Candidate answer: ${answer}

Return valid JSON:
{
  "score": number from 0 to 100,
  "feedback": "constructive feedback with what is good, what is missing, and how to improve the answer"
}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, "").trim();
    return JSON.parse(text);
  } catch {
    return generateFallbackEvaluation(answer);
  }
}

export async function generateMockRoomPrompts({ role, experience, topic }) {
  const questions = await generateInterviewQuestions({
    role,
    experience,
    focusAreas: [topic],
    count: 3,
    existingQuestions: []
  });

  return questions.map((item) => ({
    question: item.question,
    answer: item.answer
  }));
}
