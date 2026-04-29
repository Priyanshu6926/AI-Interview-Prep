import { ExternalLink, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../services/api";

function ResourcesPage() {
  const [lectures, setLectures] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const { data } = await api.get("/resources/lectures");
        setLectures(data.lectures);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load lecture resources.");
      }
    };

    fetchLectures();
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] bg-slate-950 p-8 text-white shadow-soft">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-brand-100">Learning resources</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Curated lectures for deeper interview preparation.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
          Use these hand-picked lectures to reinforce concepts before jumping back into AI-generated questions.
        </p>
      </section>

      {error ? <p className="text-sm text-rose-500">{error}</p> : null}

      <section className="grid gap-5 lg:grid-cols-3">
        {lectures.map((lecture) => (
          <article key={lecture._id} className="glass-panel overflow-hidden p-0">
            <div className="h-48 bg-slate-100">
              <img src={lecture.thumbnail} alt={lecture.title} className="h-full w-full object-cover" />
            </div>
            <div className="p-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
                <PlayCircle className="h-3.5 w-3.5" />
                {lecture.category}
              </div>
              <h2 className="mt-4 text-xl font-semibold text-slate-950">{lecture.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{lecture.description}</p>
              <a
                href={lecture.url}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-600"
              >
                Watch lecture
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

export default ResourcesPage;
