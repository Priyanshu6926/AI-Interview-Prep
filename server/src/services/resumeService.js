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
  const summary = segments.slice(0, 3).join(". ");
  const skills = Array.from(
    new Set(
      (normalized.match(/\b(react|node|express|mongodb|javascript|typescript|python|sql|aws|docker|java|next\.js)\b/gi) || []).map(
        (item) => item.toLowerCase()
      )
    )
  );

  return {
    fileName,
    summary: summary || "Resume uploaded successfully. The app will use this profile to bias interview questions toward your actual experience.",
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
Extract a concise JSON summary from this resume text.

Resume text:
${text.slice(0, 12000)}

Return valid JSON:
{
  "summary": "2 to 4 sentence summary",
  "skills": ["skill"],
  "projects": ["project or accomplishment"],
  "highlights": ["interview-relevant highlight"]
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
