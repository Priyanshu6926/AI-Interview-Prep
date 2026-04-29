import { Link } from "react-router-dom";
import { ArrowRight, BookOpenText, Mic, Sparkles } from "lucide-react";
import appLogo from "../assets/app-logo.png";
import heroImage from "../assets/hero-img.png";
import { featureCards, lectureHighlights } from "../data/landingContent";

function LandingPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#fff7e3_0%,_#f8fafc_28%,_#f8fafc_100%)] px-4 py-6 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="glass-panel flex flex-col items-start justify-between gap-4 px-6 py-5 lg:flex-row lg:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white">
              <img src={appLogo} alt="Interview Prep AI logo" className="h-10 w-10 object-contain" />
            </div>
            <div>
              <p className="text-2xl font-semibold tracking-tight text-slate-950">Interview Prep AI</p>
              <p className="text-sm text-slate-500">A smarter practice space for technical and behavioral interviews.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to="/login" className="secondary-button">
              Log in
            </Link>
            <Link to="/register" className="primary-button">
              Start Practicing
            </Link>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="space-y-6 py-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white/90 px-4 py-2 text-sm font-medium text-brand-700">
              <Sparkles className="h-4 w-4" />
              Built for role-specific, AI-guided interview prep
            </div>
            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Practice with tailored questions, spoken answers, and lecture-backed review.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Generate study sessions from your job role and experience, pin what matters, listen to answers out loud, and get AI explanations when something needs a cleaner breakdown.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/register" className="primary-button">
                Launch your first session
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link to="/login" className="secondary-button">
                See the dashboard
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {featureCards.map((item) => (
                <article key={item.title} className="rounded-3xl border border-white/70 bg-white/85 p-5 shadow-soft">
                  <h2 className="text-base font-semibold text-slate-900">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-brand-100 bg-white/80 p-3 shadow-soft">
            <img src={heroImage} alt="Interview Prep AI dashboard preview" className="w-full rounded-[24px] object-cover" />
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="glass-panel p-6">
            <Mic className="h-6 w-6 text-brand-600" />
            <h3 className="mt-4 text-xl font-semibold text-slate-950">AI Voice Reader</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Read every question and answer aloud for listening drills, pronunciation practice, and better recall.
            </p>
          </div>
          <div className="glass-panel p-6">
            <BookOpenText className="h-6 w-6 text-brand-600" />
            <h3 className="mt-4 text-xl font-semibold text-slate-950">Curated Lectures</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Jump into carefully selected lectures across React, system design, and behavioral prep without leaving the app.
            </p>
          </div>
          <div className="glass-panel p-6">
            <Sparkles className="h-6 w-6 text-brand-600" />
            <h3 className="mt-4 text-xl font-semibold text-slate-950">Resume-Worthy Roadmap</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              The codebase is ready to grow into resume Q&A parsing, readiness scoring, live coding, and peer mock rooms.
            </p>
          </div>
        </section>

        <section className="glass-panel p-6">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">Featured learning tracks</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {lectureHighlights.map((topic) => (
              <span key={topic} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white">
                {topic}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default LandingPage;
