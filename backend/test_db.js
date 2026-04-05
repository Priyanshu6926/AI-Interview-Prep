require("dotenv").config();
const mongoose = require("mongoose");

async function testDB() {
  try {
    console.log("Testing Atlas Connection with URI: " + process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ Atlas Connection Successful!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Atlas Connection Failed:", err.message);
    if (err.reason) console.error("Reason:", err.reason);
    process.exit(1);
  }
}

testDB();
