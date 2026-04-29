import mongoose from "mongoose";

const participantSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["host", "guest"],
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const signalSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["offer", "answer"],
      required: true
    },
    sdp: {
      type: String,
      required: true
    },
    fromRole: {
      type: String,
      enum: ["host", "guest"],
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const iceCandidateSchema = new mongoose.Schema(
  {
    candidate: { type: String, required: true },
    sdpMid: { type: String, default: null },
    sdpMLineIndex: { type: Number, default: null },
    fromRole: {
      type: String,
      enum: ["host", "guest"],
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const roomEventSchema = new mongoose.Schema(
  {
    kind: {
      type: String,
      enum: ["note", "turn", "feedback"],
      required: true
    },
    fromRole: {
      type: String,
      enum: ["host", "guest", "system"],
      default: "system"
    },
    content: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const mockRoomSchema = new mongoose.Schema(
  {
    roomCode: {
      type: String,
      required: true,
      unique: true
    },
    topic: {
      type: String,
      required: true
    },
    roleFocus: {
      type: String,
      required: true
    },
    experience: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["waiting", "active", "ended"],
      default: "waiting"
    },
    host: {
      type: participantSchema,
      required: true
    },
    guest: {
      type: participantSchema,
      default: null
    },
    prompts: {
      type: [
        {
          question: { type: String, required: true },
          answer: { type: String, default: "" }
        }
      ],
      default: []
    },
    activePromptIndex: {
      type: Number,
      default: 0
    },
    signals: {
      type: [signalSchema],
      default: []
    },
    iceCandidates: {
      type: [iceCandidateSchema],
      default: []
    },
    events: {
      type: [roomEventSchema],
      default: []
    }
  },
  { timestamps: true }
);

const MockRoom = mongoose.model("MockRoom", mockRoomSchema);

export default MockRoom;
