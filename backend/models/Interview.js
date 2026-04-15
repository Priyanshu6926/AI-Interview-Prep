const mongoose = require("mongoose");

const transcriptSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "assistant"], required: true },
  message: { type: String, required: true },
});

const interviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, required: true },
    experienceLevel: { type: String, required: true },
    techStack: [{ type: String }],
    transcript: [transcriptSchema],
    scores: {
      communication: { type: Number, min: 0, max: 100 },
      technical: { type: Number, min: 0, max: 100 },
      problemSolving: { type: Number, min: 0, max: 100 },
      overall: { type: Number, min: 0, max: 100 },
    },
    feedback: { type: String },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    vapiCallId: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Interview", interviewSchema);
