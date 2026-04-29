import CodingExercise from "../models/CodingExercise.js";

const exercises = [
  {
    title: "Debounced Search Suggestions",
    role: "Frontend Developer",
    difficulty: "medium",
    functionName: "debounce",
    prompt:
      "Implement a debounce helper that delays execution until the user stops typing. Return a wrapped function and preserve the latest arguments.",
    starterCode:
      "export function debounce(fn, delay) {\n  // write your solution here\n}\n",
    hints: [
      "You will need a closure to retain the timeout id.",
      "Clear the previous timeout before scheduling the next call."
    ],
    topics: ["javascript", "frontend", "performance"],
    testCases: [
      {
        args: [null, 200],
        expected: "function",
        explanation: "The outer function should return a callable wrapper."
      }
    ]
  },
  {
    title: "Rate Limiter Log Aggregation",
    role: "Backend Developer",
    difficulty: "medium",
    functionName: "topUsersByRequestCount",
    prompt:
      "Build a function that groups API request logs by user id and returns the top 3 users by request count.",
    starterCode:
      "export function topUsersByRequestCount(logs) {\n  // logs: [{ userId: 'u1', path: '/api' }]\n}\n",
    hints: [
      "Use a map or object for counts.",
      "Sort the grouped values by count descending before slicing."
    ],
    topics: ["node", "algorithms", "data-processing"],
    testCases: [
      {
        args: [[{ userId: "u1" }, { userId: "u2" }, { userId: "u1" }]],
        expected: [{ userId: "u1", count: 2 }, { userId: "u2", count: 1 }],
        explanation: "Repeated ids should accumulate correctly."
      }
    ]
  },
  {
    title: "Merge Busy Meeting Slots",
    role: "Full Stack Developer",
    difficulty: "hard",
    functionName: "mergeIntervals",
    prompt:
      "Given an array of time intervals, merge overlapping intervals and return the normalized schedule in ascending order.",
    starterCode:
      "export function mergeIntervals(intervals) {\n  // intervals: [[1,3],[2,5],[8,10]]\n}\n",
    hints: [
      "Sort by the interval start value first.",
      "Compare each interval with the last merged interval."
    ],
    topics: ["algorithms", "scheduling", "full-stack"],
    testCases: [
      {
        args: [[[1, 3], [2, 5], [8, 10]]],
        expected: [[1, 5], [8, 10]],
        explanation: "The first two intervals overlap and should collapse into one."
      }
    ]
  }
];

export default async function seedCodingExercises() {
  const count = await CodingExercise.countDocuments();
  if (count > 0) {
    return;
  }

  await CodingExercise.insertMany(exercises);
}
