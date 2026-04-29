import Lecture from "../models/Lecture.js";

const lectures = [
  {
    title: "React Interview Questions and Concepts",
    category: "React",
    description: "A practical review of hooks, rendering, state, effects, and common interview traps.",
    url: "https://www.youtube.com/watch?v=bMknfKXIFA8",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "System Design Basics in One Sitting",
    category: "System Design",
    description: "Use this to reinforce load balancing, scaling, caching, and core backend architecture patterns.",
    url: "https://www.youtube.com/watch?v=MbjObHmDbZo",
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Behavioral Interview Prep and Storytelling",
    category: "Behavioral",
    description: "Sharpen STAR responses, leadership examples, and the way you structure impact-driven stories.",
    url: "https://www.youtube.com/watch?v=PJKYqLP6MRE",
    thumbnail: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
  }
];

export default async function seedLectures() {
  const count = await Lecture.countDocuments();
  if (count > 0) {
    return;
  }

  await Lecture.insertMany(lectures);
}
