import pdfParse from "pdf-parse";
import { GoogleGenerativeAI } from "@google/generative-ai";

function getModel() {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }

  const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return client.getGenerativeModel({ model: "gemini-1.5-flash" });
}

function fallbackResumeProfile(text, fileName) {
  const normalized = text.replace(/\s+/g, " ").trim();
  const segments = normalized.split(/[\.\u2022]/).map((item) => item.trim()).filter(Boolean);
  const skillMatches =
    normalized.match(/\b(react|next\.js|node|express|mongodb|mongoose|javascript|typescript|python|sql|postgresql|mysql|aws|docker|kubernetes|java|spring|redux|tailwind|html|css|git|graphql|rest api)\b/gi) || [];
  const skills = Array.from(
    new Set(skillMatches.map((item) => item.toLowerCase()))
  );
  const techSummaryParts = [];

  if (skills.length) {
    techSummaryParts.push(`Core stack: ${skills.slice(0, 8).join(", ")}.`);
  }

  if (segments[0]) {
    techSummaryParts.push(`Background: ${segments[0]}.`);
  }

  if (segments[1]) {
    techSummaryParts.push(`Likely strengths: ${segments[1]}.`);
  }

  return {
    fileName,
    summary:
      techSummaryParts.join(" ") ||
      "Resume uploaded successfully. The app will use this profile to generate a compact tech summary and bias interview questions toward your real experience.",
    skills,
    projects: segments.slice(3, 6),
    highlights: segments.slice(6, 10)
  };
}

export async function parseResume(file) {
  const parsed = await pdfParse(file.buffer);
  const text = parsed.text || "";
  const model = getModel();

  if (!model) {
    return fallbackResumeProfile(text, file.originalname);
  }

  try {
    const prompt = `
You are helping build a resume-aware interview coach.
Extract only the interview-relevant technical information from this resume text.

Resume text:
${text.slice(0, 12000)}

Return valid JSON:
{
  "summary": "2 to 4 sentence tech-stack style summary focused on role, tools, domains, and strongest experience areas. Do not paste resume lines.",
  "skills": ["specific technical skill"],
  "projects": ["very short project or accomplishment summary, one line each"],
  "highlights": ["interview-relevant technical or leadership highlight"]
}
`;
    const result = await model.generateContent(prompt);
    const response = result.response.text().replace(/```json|```/g, "").trim();
    const parsedJson = JSON.parse(response);

    return {
      fileName: file.originalname,
      summary: parsedJson.summary || "",
      skills: parsedJson.skills || [],
      projects: parsedJson.projects || [],
      highlights: parsedJson.highlights || []
    };
  } catch {
    return fallbackResumeProfile(text, file.originalname);
  }
}
