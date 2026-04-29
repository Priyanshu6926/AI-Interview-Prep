import dotenv from "dotenv";
import app from "./app.js";
import connectDatabase from "./config/db.js";
import seedLectures from "./seed/seedLectures.js";
import seedCodingExercises from "./seed/seedCodingExercises.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDatabase();
    await seedLectures();
    await seedCodingExercises();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

start();
