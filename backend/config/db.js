const mongoose = require("mongoose");

const connectDB = async () => {
  // Try Atlas first
  if (process.env.MONGO_URI) {
    try {
      console.log("⏳ Connecting to MongoDB Atlas...");
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log("✅ MongoDB Atlas connected");
      return;
    } catch (err) {
      console.warn("⚠️  Could not connect to MongoDB Atlas:");
      if (err.message.includes("querySrv ENOTFOUND")) {
        console.warn("   ↳ Network/DNS Error: SRV records not found. Check your cluster URI or network settings.");
      } else {
        console.warn("   ↳ Error:", err.message);
      }
      console.log("🔄 Falling back to in-memory MongoDB for local development...");
    }
  }

  // Fallback: in-memory MongoDB
  try {
    const { MongoMemoryServer } = require("mongodb-memory-server");
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log("✅ In-memory MongoDB connected (dev fallback)");
    console.log("💡 Note: Data will NOT persist between restarts.");
  } catch (fallbackErr) {
    console.error("❌ Failed to start in-memory MongoDB:", fallbackErr);
    process.exit(1);
  }
};

module.exports = connectDB;
