require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

async function test() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    console.log("Testing Gemini with model: gemini-2.0-flash-lite");
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: "Hello, testing API"
    });
    console.log("Response:", response.text);
  } catch (error) {
    console.error("Test failed:", error.message);
    if (error.stack) console.error(error.stack);
  }
}

test();
