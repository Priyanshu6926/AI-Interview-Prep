import CodingExercise from "../models/CodingExercise.js";

export async function getExercises(req, res, next) {
  try {
    const { role, difficulty } = req.query;
    const query = {};

    if (role) {
      query.role = role;
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    const exercises = await CodingExercise.find(query).sort({ createdAt: 1 });
    res.json({ exercises });
  } catch (error) {
    next(error);
  }
}
