import mongoose from "mongoose";

const codingExerciseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    role: { type: String, required: true },
    difficulty: { type: String, required: true },
    prompt: { type: String, required: true },
    language: { type: String, default: "javascript" },
    functionName: { type: String, required: true },
    starterCode: { type: String, required: true },
    hints: { type: [String], default: [] },
    topics: { type: [String], default: [] },
    testCases: {
      type: [
        {
          args: { type: [mongoose.Schema.Types.Mixed], default: [] },
          expected: { type: mongoose.Schema.Types.Mixed, required: true },
          explanation: { type: String, default: "" }
        }
      ],
      default: []
    }
  },
  { timestamps: true }
);

const CodingExercise = mongoose.model("CodingExercise", codingExerciseSchema);

export default CodingExercise;
