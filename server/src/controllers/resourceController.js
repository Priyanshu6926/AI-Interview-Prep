import Lecture from "../models/Lecture.js";

export async function getLectures(_req, res, next) {
  try {
    const lectures = await Lecture.find().sort({ createdAt: 1 });
    res.json({ lectures });
  } catch (error) {
    next(error);
  }
}
