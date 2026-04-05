const questionAnswerPrompt = (
  role,
  experience,
  topicsToFocus,
  numberOfQuestions
) => `
    You are an expert technical interviewer and educator.
    
    Task:
    - Target Role: ${role}
    - Candidate Experience Level: ${experience} years
    - Primary Topics: ${topicsToFocus}
    - Quantity: Generate ${numberOfQuestions} interview questions.
    
    Requirements for each Answer:
    - **Depth**: Provide a full, comprehensive explanation that covers the "What", "Why", and "How".
    - **Structure**: Use Markdown formatting (headers, bold text, bullet points) to make it readable.
    - **Code**: Every technical answer MUST include a clear, well-commented code example illustrating the concept.
    - **Professionalism**: Include best practices or common pitfalls where relevant.
    
    Output Format:
    - Return ONLY a pure JSON array like:
    [
      {
        "question": "Clear and challenging question",
        "answer": "Detailed Markdown content with code blocks..."
      }
    ]
    
    Important: Do NOT add any conversational text. Return valid JSON only.
    `;

const conceptExplainPrompt = (question) => `
    You are a Senior Software Architect explaining a core technical concept.
    
    Task:
    - Question to Explain: "${question}"
    - Objective: Provide a "Master Class" level explanation suitable for a developer's learning path.
    
    Requirements:
    - **Comprehensive Content**: The explanation should be detailed enough to be a standalone blog post or documentation page.
    - **Rich Markdown**: Use #, ##, ### headers, lists, and tables where appropriate.
    - **Detailed Code**: Provide a complete, runnable-style code example that demonstrates the solution and best practices.
    - **Sections**: Include "Overview", "Key Concepts", "Code Implementation", and "Common Mistakes".
    
    Output Format:
    - Return ONLY a JSON object:
    {
        "title": "A compelling, professional title for the concept",
        "explanation": "Extensive Markdown-formatted content..."
    }
    
    Important: Return valid JSON only. No extra characters.
    `;

module.exports = { questionAnswerPrompt, conceptExplainPrompt };
