import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  ensureQuestionSetQuality,
  generateFallbackEvaluation,
  generateFallbackExplanation,
  generateFallbackQuestions
} from "../lib/fallbackQuestions.js";

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "to", "of", "in", "on", "for", "with", "is", "are", "was", "were", "be", "as", "by",
  "it", "this", "that", "from", "at", "if", "then", "than", "into", "your", "you", "i", "we", "our", "their", "they",
  "about", "can", "will", "would", "should", "could", "have", "has", "had", "do", "does", "did", "but", "so"
]);

function extractKeywords(text) {
  return Array.from(
    new Set(
      String(text || "")
        .toLowerCase()
        .split(/[^a-z0-9#+.-]+/)
        .map((item) => item.trim())
        .filter((item) => item.length > 2 && !STOP_WORDS.has(item))
    )
  );
}

function keywordOverlap(source, target) {
  if (!source.length || !target.length) {
    return 0;
  }

  const targetSet = new Set(target);
  const hits = source.filter((item) => targetSet.has(item)).length;
  return hits / source.length;
}

function buildEvaluationContext({ question, answer, referenceAnswer }) {
  const answerWords = extractKeywords(answer);
  const questionWords = extractKeywords(question);
  const referenceWords = extractKeywords(referenceAnswer);
  const relevance = keywordOverlap(questionWords, answerWords);
  const coverage = keywordOverlap(referenceWords, answerWords);
  const wordCount = String(answer || "").trim().split(/\s+/).filter(Boolean).length;

  return { relevance, coverage, wordCount };
}

function clampEvaluation(evaluation, context) {
  const fallback = generateFallbackEvaluation("", context);
  let score = Number.isFinite(evaluation?.score) ? evaluation.score : fallback.score;

  if (context.wordCount < 20) {
    score = Math.min(score, 35);
  }

  if (context.relevance < 0.08) {
    score = Math.min(score, 30);
  } else if (context.relevance < 0.16) {
    score = Math.min(score, 45);
  }

  if (context.coverage < 0.1) {
    score = Math.min(score, 50);
  }

  return {
    score: Math.max(10, Math.min(95, Math.round(score))),
    feedback: evaluation?.feedback || fallback.feedback
  };
}

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
    "answer": "ideal candidate answer written as a complete interview response in 3 to 5 substantial paragraphs",
    "explanation": "detailed teaching style breakdown with multiple paragraphs and optional code example if useful",
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
The explanation should be richer than the reference answer and should teach the topic in depth.

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

export async function evaluateReadiness({ question, answer, role, referenceAnswer }) {
  const model = getModel();
  const evaluationContext = buildEvaluationContext({ question, answer, referenceAnswer });

  if (!model) {
    return generateFallbackEvaluation(answer, evaluationContext);
  }

  const prompt = `
You are an interview coach.
Role: ${role}
Question: ${question}
Candidate answer: ${answer}
Reference answer: ${referenceAnswer}

Score the answer strictly based only on the candidate answer. Do not reward unrelated or generic content.
Penalize answers that:
- do not address the asked topic
- avoid important technical details
- are vague or filler-heavy
- miss the main idea covered by the reference answer

Return valid JSON:
{
  "score": number from 0 to 100,
  "feedback": "constructive feedback with what is good, what is missing, and how to improve the answer"
}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, "").trim();
    return clampEvaluation(JSON.parse(text), evaluationContext);
  } catch {
    return generateFallbackEvaluation(answer, evaluationContext);
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
