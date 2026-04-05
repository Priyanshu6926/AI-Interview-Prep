const { GoogleGenAI } = require("@google/genai");
const {
  conceptExplainPrompt,
  questionAnswerPrompt,
} = require("../utils/prompts");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ─── Timeout wrapper ────────────────────────────────────────────────────────
const withTimeout = (promise, ms = 10000) => {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("API_TIMEOUT")), ms)
  );
  return Promise.race([promise, timeout]);
};

// ─── Local fallback question bank ───────────────────────────────────────────
const fallbackQuestions = (role, topicsToFocus, numberOfQuestions) => {
  const topic = topicsToFocus || role;
  const bank = [
    {
      question: `What are the core responsibilities of a ${role}?`,
      answer: `A **${role}** plays a critical role in the software development lifecycle. Here are the key responsibilities:

**1. Design & Architecture**
- Plan and architect scalable, maintainable software systems.
- Make key technology decisions that align with business requirements.
- Write technical design documents and participate in architecture reviews.

**2. Development & Coding**
- Write clean, efficient, and well-documented code following best practices.
- Follow design patterns (MVC, Repository, Factory, etc.) to keep code organized.
- Conduct and participate in code reviews to maintain code quality.

**3. Testing & Debugging**
- Write unit tests, integration tests, and end-to-end tests.
- Debug and resolve issues in production and development environments.
- Use tools like Jest, Mocha, Cypress, or Postman for verification.

**4. Collaboration**
- Work closely with product managers, designers, and other developers.
- Participate in sprint planning, daily standups, and retrospectives (Agile/Scrum).
- Communicate progress, blockers, and technical trade-offs clearly.

**5. Continuous Learning**
- Stay updated with new frameworks, tools, and industry trends.
- Contribute to open source and internal libraries.

\`\`\`javascript
// Example: Clean, well-structured function a ${role} should write
/**
 * Fetches a user by their unique identifier, excluding sensitive data.
 * @param {string} id - The user ID to search for.
 * @returns {Promise<Object>} The user object.
 */
const getUserById = async (id) => {
  if (!id) throw new Error('User ID is required');
  
  try {
    const user = await UserModel.findById(id).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    console.error('[getUserById] Error:', error.message);
    throw new Error('Could not retrieve user details');
  }
};
\`\`\``,
    },
    {
      question: `Explain the concept of ${topic} and why it matters in real projects.`,
      answer: `**${topic}** is a foundational concept every developer must understand deeply. Here's a comprehensive breakdown:

## What is ${topic}?
${topic} refers to the set of principles, tools, and patterns that help developers build robust, maintainable, and scalable applications. It bridges the gap between writing code that works and writing code that lasts.

## Why does it matter?
- **Maintainability**: Code following ${topic} principles is easier to update and extend over time.
- **Scalability**: Systems built with these concepts can handle increasing user growth without breaking.
- **Team Collaboration**: Shared understanding of ${topic} reduces friction in teams and makes onboarding easier.
- **Bug Prevention**: Well-structured code following ${topic} has fewer defects and is easier to test.

## Core Concepts to Remember

**1. Separation of Concerns**
Each module or function should do one thing and do it well. This minimizes complexity.

**2. DRY (Don't Repeat Yourself)**
Avoid duplicating logic — abstract reusable parts into functions or modules.

**3. SOLID Principles**
- **S** — Single Responsibility
- **O** — Open/Closed
- **L** — Liskov Substitution
- **I** — Interface Segregation
- **D** — Dependency Inversion

\`\`\`javascript
// ❌ Bad: Violates Single Responsibility
const processOrder = (order) => {
  // validates, calculates, saves, and emails all in one function
  if (!order.items.length) throw new Error('Empty order');
  const total = order.items.reduce((sum, i) => sum + i.price, 0);
  db.save(order);
  emailService.send(order.userEmail, 'Your order is confirmed!');
};

// ✅ Good: Each function has one responsibility
const validateOrder = (order) => {
  if (!order.items.length) throw new Error('Empty order');
};

const calculateTotal = (items) => {
  return items.reduce((sum, i) => sum + i.price, 0);
};

const saveOrder = async (order) => {
  return db.save(order);
};

const notifyUser = async (email) => {
  return emailService.send(email, 'Confirmed!');
};

// Orchestrator function
const completeOrderFlow = async (order) => {
  validateOrder(order);
  const total = calculateTotal(order.items);
  await saveOrder({ ...order, total });
  await notifyUser(order.userEmail);
};
\`\`\`

## Real-World Application
In a production application, ${topic} concepts are applied at every level — from how APIs are structured, to how state is managed in the frontend, to how databases are queried efficiently.`,
    },
    {
      question: `What is the difference between synchronous and asynchronous programming? How do you handle async operations in JavaScript?`,
      answer: `This is one of the most important concepts in modern JavaScript development.

## Synchronous Programming
Code executes **line by line**, and the next line waits for the current one to finish. This can "block" the main thread, making the UI unresponsive.

\`\`\`javascript
// Synchronous — each line waits for the previous
console.log('Start');
const data = fs.readFileSync('file.txt', 'utf8'); // BLOCKS until done
console.log(data); // runs after file is fully read
console.log('End'); 
\`\`\`

## Asynchronous Programming
Code can **start an operation and move on**, handling the result later via callbacks, Promises, or async/await. This keeps the application responsive.

\`\`\`javascript
// Asynchronous with async/await (modern approach)
const fetchUserData = async (userId) => {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    if (!response.ok) throw new Error('Failed to fetch user');
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Error fetching user:', error.message);
    throw error;
  }
};

// Usage
fetchUserData(42)
  .then(user => console.log('User found:', user.name))
  .catch(err => console.error('Fetch failed:', err.message));
\`\`\`

## Promises vs Async/Await

\`\`\`javascript
// Promise chaining (can lead to "callback hell" if nested too deeply)
fetch('/api/data')
  .then(res => res.json())
  .then(data => processData(data))
  .catch(err => handleError(err));

// Async/Await (cleaner, looks like synchronous code, easier to debug)
async function loadData() {
  try {
    const res = await fetch('/api/data');
    const data = await res.json();
    return processData(data);
  } catch (err) {
    handleError(err);
  }
}
\`\`\`

## Running Operations in Parallel
\`\`\`javascript
// Sequential (slow — waits for each to finish one after another)
const user = await fetchUser(id);
const posts = await fetchPosts(id);

// Parallel (fast — runs both at the same time using Promise.all)
const [user, posts] = await Promise.all([
  fetchUser(id),
  fetchPosts(id),
]);
\`\`\`

**Key Takeaway**: Always use async/await with try/catch for modern JavaScript. Use \`Promise.all\` when you need to run multiple independent async operations simultaneously for better performance.`,
    },
    {
      question: `Explain how you would handle errors in a full-stack application.`,
      answer: `Error handling is what separates production-ready code from prototypes. Here's a complete strategy:

## Backend Error Handling (Node.js/Express)

1. **Create a custom error class** to capture status codes and operational state.
2. **Use it in your controllers** to handle validation and business logic failures.
3. **Global error handling middleware** to catch everything in one place.

\`\`\`javascript
// 1. Custom Error Class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // distinguishes known errors from server crashes
  }
}

// 2. Controller Usage
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError('User not found', 404));
    res.json(user);
  } catch (error) {
    next(error); // pass to global error handler
  }
};

// 3. Global Error Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal Server Error';
  
  console.error(\`[ERROR] \${req.method} \${req.url}:\`, err);
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});
\`\`\`

## Frontend Error Handling (React + Axios)

\`\`\`javascript
// Axios interceptor — catches all API errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    
    if (error.response?.status === 401) {
      // Handle expired session
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // Show user-friendly toast message
    toast.error(message);
    return Promise.reject(new Error(message));
  }
);
\`\`\`

## Best Practices
- **Never** leave catch blocks empty.
- **Log** errors with relevant context (which route, which user).
- **Graceful degradation**: Show an "Error Page" or fallback UI instead of a blank screen.
- **User feedback**: Always let the user know what went wrong (e.g., "Invalid Password" vs "Error").`,
    },
    {
      question: `What are best practices for writing clean, maintainable code?`,
      answer: `Clean code is code that is easy to **read, understand, and change**. Here are the most important practices:

## 1. Meaningful Naming
Variables and functions should describe exactly what they do.

\`\`\`javascript
// ❌ Bad
const d = new Date();
const fn = (x) => x * 1.1;

// ✅ Good
const currentDate = new Date();
const calculatePriceWithTax = (price) => price * 1.1;
\`\`\`

## 2. Functions Should Do One Thing
Keep functions small and focused on a single responsibility.

\`\`\`javascript
// ❌ Bad — function does too many things
const handleSubmit = async (formData) => {
  // validates, transforms, sends API call, updates state, shows toast
};

// ✅ Good — each function has one job
const validateForm = (data) => { /* ... */ };
const submitData = async (payload) => { /* ... */ };

const handleSubmit = async (formData) => {
  const errors = validateForm(formData);
  if (errors.length > 0) return handleErrors(errors);
  
  await submitData(formData);
  toast.success('Successfully submitted!');
};
\`\`\`

## 3. Avoid Magic Numbers and Strings
Use constants to give context to values.

\`\`\`javascript
// ❌ Bad
if (user.status === 1) { /* what is 1? */ }
setTimeout(refresh, 86400000);

// ✅ Good
const USER_STATUS = { ACTIVE: 1, INACTIVE: 0 };
const MS_IN_ONE_DAY = 24 * 60 * 60 * 1000;

if (user.status === USER_STATUS.ACTIVE) { /* ... */ }
setTimeout(refresh, MS_IN_ONE_DAY);
\`\`\`

## 4. Early Returns (Guard Clauses)
Avoid deep nesting by returning early when conditions aren't met.

\`\`\`javascript
// ❌ Hard to follow
const processPayment = (user, cart) => {
  if (user) {
    if (cart.items.length > 0) {
      if (user.hasCreditCard) {
        // process...
      }
    }
  }
};

// ✅ Flatter and more readable
const processPayment = (user, cart) => {
  if (!user) return;
  if (!cart.items.length) return;
  if (!user.hasCreditCard) return;
  
  // process payment logic goes here
};
\`\`\`

## 5. Comment "Why", not "What"
The code should tell you *what* it is doing. Comments should explain *why* something complex or unusual is happening.`,
    },
  ];

  const count = Math.min(parseInt(numberOfQuestions) || 5, bank.length);
  return bank.slice(0, count);
};

// ─── Fallback explanation ────────────────────────────────────────────────────
const fallbackExplanation = (question) => {
  // Try to find if this question is in our bank for a richer explanation
  const bankRef = [
    {
      match: "responsibilities",
      title: "Core Engineering Responsibilities",
      explanation: `Building software at a professional level involves much more than just writing code. A developer's responsibilities can be broken down into these primary pillars:

### 🏗️ Design & Architecture
Before a single line of code is written, a senior developer must consider how the system will scale. This involves choosing the right design patterns (like **Singleton**, **Observer**, or **Strategy**) and ensuring the database schema is optimized.

### 💻 Implementation (Clean Code)
The "Clean Code" philosophy states that code is read significantly more often than it is written. Therefore, we prioritize:
- **Meaningful names**: \`calculateInvoiceTotal\` instead of \`calc\`.
- **Small functions**: Ideally under 20 lines of code.

### 🧪 Testing & Reliability
In production systems, we use **TDD (Test Driven Development)** to ensure new changes don't break existing features. This includes:
- **Unit Tests**: Testing individual functions.
- **Integration Tests**: Testing how different services work together.

### 🤝 Mental Models & Collaboration
Software is a team sport. Participating in **Code Reviews** and writing clean **Technical Documentation** is just as important as the feature itself.

\`\`\`javascript
// Example of a professionally structured feature
class OrderService {
  constructor(database, mailer) {
    this.db = database;
    this.mailer = mailer;
  }

  async process(order) {
    const trx = await this.db.startTransaction();
    try {
      await this.db.save(order, trx);
      await this.mailer.sendConfirmation(order.userEmail);
      await trx.commit();
    } catch (err) {
      await trx.rollback();
      throw err;
    }
  }
}
\`\`\``
    },
    {
      match: "React",
      title: "Deep Dive into React Concepts",
      explanation: `React has revolutionized frontend development by introducing a **declarative**, **component-based** approach. Here is why it's the industry standard:

### ⚡ The Virtual DOM
Traditional DOM manipulation is slow. React creates a lightweight copy (Virtual DOM) and uses a **"diffing" algorithm** to update only the parts of the actual DOM that changed. This makes updates lightning-fast.

### 🧩 Components & Composability
Everything in React is a component. This allows you to build complex UIs from small, independent, and reusable pieces.

### 🔄 State & One-Way Data Flow
Data in React moves in one direction: from parent to child via **Props**. This makes the application more predictable and easier to debug. When data changes (State), React automatically re-renders the necessary components.

### 🎣 The Power of Hooks
Hooks allow functional components to "hook into" state and lifecycle features.
- **useState**: Manages local data.
- **useEffect**: Handles side-effects like API calls.

\`\`\`jsx
import React, { useState, useEffect } from 'react';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('https://api.example.com/users')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []); // Empty dependency array means this runs once on mount

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};
\`\`\``
    },
    {
      match: "sync",
      title: "Sync vs Async: The Event Loop",
      explanation: `Understanding the JavaScript **Event Loop** is the difference between a junior and a senior developer.

### Synchronous (Blocking)
JS is single-threaded. If you run a heavy synchronous operation, the entire browser "freezes".
\`\`\`javascript
const res = heavyComputation(); // Everything stops until this finishes
console.log("This waits...");
\`\`\`

### Asynchronous (Non-Blocking)
Javascript offloads heavy tasks (like network calls) to the browser/environment and continues executing code. When the task is done, it's pushed back onto the **Callback Queue**.

### The Modern Way: Async/Await
Introduced in ES2017, this is the gold standard for handling asynchronous code.

\`\`\`javascript
// Real-world API wrapper
const apiHandler = async (endpoint) => {
  try {
    const response = await fetch(\`https://api.myapp.com/\${endpoint}\`);
    if (!response.ok) throw new Error('Network error');
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
\`\`\`

**Tip:** Always use \`Promise.all()\` if you are fetching multiple independent resources to avoid "Async Waterfall" (sequential waiting).`
    }
  ];

  const match = bankRef.find(item => question.toLowerCase().includes(item.match.toLowerCase()));

  if (match) {
    return {
      title: match.title,
      explanation: match.explanation
    };
  }

  // General fallback if no specific match is found
  return {
    title: `Exploring Concept: ${question.slice(0, 40)}...`,
    explanation: `**${question}**

This is a comprehensive overview of the requested concept.

### 📌 Core Definition
The concept refers to the standard practices and technical implementations used to solve specific architectural problems in modern development.

### 🚀 Implementation Steps
1. **Analyze Requirements**: Understand the problem scope.
2. **Apply Patterns**: Use established industry standards (like **DRY**, **KISS**, or **SOLID**).
3. **Verify & Refine**: Test your implementation across edge cases.

### 💡 Expert Tip
When explaining this in an interview, focus on the **trade-offs**. No solution is perfect; explaining *why* you chose one approach over another shows seniority.

\`\`\`javascript
// General implementation pattern
function standardPattern(input) {
  // 1. Initial validation
  if (!input) return null;

  // 2. Core logic
  const result = process(input);

  // 3. Return formatted output
  return result;
}
\`\`\``,
  };
};

// ─── Controllers ────────────────────────────────────────────────────────────

// @desc    Generate interview questions and answers using Gemini
// @route   POST /api/ai/generate-questions
// @access  Private
const generateInterviewQuestions = async (req, res) => {
  const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

  if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // 1️⃣ Try Gemini API with timeout
  try {
    const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);

    const response = await withTimeout(
      ai.models.generateContent({ model: "gemini-1.5-flash", contents: prompt }),
      15000
    );

    const rawText = response.text;
    
    // Improved JSON cleaning: find the first '[' and last ']'
    const jsonMatch = rawText.match(/\[[\s\S]*\]/);
    const cleanedText = jsonMatch ? jsonMatch[0] : rawText.trim();

    const data = JSON.parse(cleanedText);
    return res.status(200).json(data);
  } catch (error) {
    // 2️⃣ Fallback to local questions on timeout or API error
    console.warn("⚠️  Gemini API unavailable or invalid output, using local fallback:", error.message);
    const fallback = fallbackQuestions(role, topicsToFocus, numberOfQuestions);
    return res.status(200).json(fallback);
  }
};

// @desc    Explain an interview question
// @route   POST /api/ai/generate-explanation
// @access  Private
const generateConceptExplanation = async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // 1️⃣ Try Gemini API with timeout
  try {
    const prompt = conceptExplainPrompt(question);

    const response = await withTimeout(
      ai.models.generateContent({ model: "gemini-1.5-flash", contents: prompt }),
      15000
    );

    const rawText = response.text;
    
    // Improved JSON cleaning: find the first '{' and last '}'
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    const cleanedText = jsonMatch ? jsonMatch[0] : rawText.trim();

    const data = JSON.parse(cleanedText);
    return res.status(200).json(data);
  } catch (error) {
    // 2️⃣ Fallback to local explanation on timeout or API error
    console.warn("⚠️  Gemini API unavailable or invalid output, using local fallback:", error.message);
    const fallback = fallbackExplanation(question);
    return res.status(200).json(fallback);
  }
};

module.exports = { generateInterviewQuestions, generateConceptExplanation };
