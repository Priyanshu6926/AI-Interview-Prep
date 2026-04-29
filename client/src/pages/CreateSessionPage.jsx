import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const defaultForm = {
  role: "Frontend Developer",
  experience: 2,
  focusAreas: "React.js, DOM manipulation, CSS Flexbox, System Design basics"
};

function CreateSessionPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm);
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("role", form.role);
      formData.append("experience", String(form.experience));
      form.focusAreas
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .forEach((item) => formData.append("focusAreas", item));

      if (resumeFile) {
        formData.append("resume", resumeFile);
      }

      const { data } = await api.post("/sessions", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      navigate(`/app/sessions/${data.session._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create the session right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
      <section className="rounded-[32px] bg-white p-8 shadow-soft">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">Session setup</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">Generate a new interview drill.</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Tell the app the role, the experience level, and the concepts you care about. Every new session starts with 5 questions, and you can generate 5 more later from inside the session. Uploading your PDF resume will bias the questions toward your actual project history.
        </p>
      </section>

      <section className="glass-panel p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Job role</label>
            <input
              className="input-field"
              value={form.role}
              onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
              placeholder="Frontend Developer"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Years of experience</label>
            <input
              className="input-field"
              type="number"
              min="0"
              max="20"
              value={form.experience}
              onChange={(event) => setForm((current) => ({ ...current, experience: Number(event.target.value) }))}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Focus areas</label>
            <textarea
              className="input-field min-h-36 resize-y"
              value={form.focusAreas}
              onChange={(event) => setForm((current) => ({ ...current, focusAreas: event.target.value }))}
              placeholder="React.js, CSS Flexbox, Performance, Behavioral leadership"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Resume PDF (optional)</label>
            <input
              className="input-field file:mr-3 file:rounded-xl file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
              type="file"
              accept="application/pdf"
              onChange={(event) => setResumeFile(event.target.files?.[0] || null)}
            />
            <p className="mt-2 text-xs leading-6 text-slate-500">
              Use this when you want AI-generated questions tied to your real projects, tools, and experience.
            </p>
          </div>
          {error ? <p className="text-sm text-rose-500">{error}</p> : null}
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Generating 5 questions..." : "Create session"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default CreateSessionPage;
