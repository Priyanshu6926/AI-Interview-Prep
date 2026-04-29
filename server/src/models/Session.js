import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    title: String,
    question: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true
    },
    userAnswer: {
      type: String,
      default: ""
    },
    explanation: {
      type: String,
      default: ""
    },
    lastEvaluation: {
      score: {
        type: Number,
        default: null
      },
      feedback: {
        type: String,
        default: ""
      }
    },
    attempts: {
      type: [
        new mongoose.Schema(
          {
            answer: {
              type: String,
              required: true
            },
            score: {
              type: Number,
              default: null
            },
            feedback: {
              type: String,
              default: ""
            },
            createdAt: {
              type: Date,
              default: Date.now
            }
          },
          { _id: true }
        )
      ],
      default: []
    },
    tags: {
      type: [String],
      default: []
    },
    isPinned: {
      type: Boolean,
      default: false
    }
  },
  { _id: true }
);

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    role: {
      type: String,
      required: true
    },
    experience: {
      type: Number,
      required: true
    },
    focusAreas: {
      type: [String],
      default: []
    },
    resumeProfile: {
      fileName: {
        type: String,
        default: ""
      },
      summary: {
        type: String,
        default: ""
      },
      skills: {
        type: [String],
        default: []
      },
      projects: {
        type: [String],
        default: []
      },
      highlights: {
        type: [String],
        default: []
      }
    },
    questions: {
      type: [questionSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;
