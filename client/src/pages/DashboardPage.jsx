import { Link } from "react-router-dom";
import { ArrowRight, Clock3, Code2, Pin, PlusCircle, Sparkles, TrendingUp, UsersRound } from "lucide-react";
import { useSessions } from "../hooks/useSessions";
import { badgeText, formatDate } from "../utils/formatters";

function DashboardPage() {
  const { sessions, loading, error } = useSessions();
  const pinnedCount = sessions.reduce((sum, session) => sum + session.questions.filter((item) => item.isPinned).length, 0);
  const attempts = sessions.flatMap((session) => session.questions.flatMap((item) => item.attempts || []));
  const averageScore = attempts.length
    ? Math.round(attempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0) / attempts.length)
    : null;
  const latestTrend = attempts.slice(-5).map((attempt) => attempt.score || 0);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.86fr_1.14fr]">
      <section className="space-y-6">
        <div className="rounded-[32px] bg-slate-950 p-8 text-white shadow-soft">
          <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-100">
            Daily prep cockpit
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">Turn interview practice into a repeatable system.</h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Create sessions by role and experience, listen to answers, pin tricky questions, and build a cleaner review loop.
          </p>
          <Link to="/app/sessions/new" className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950">
            <PlusCircle className="h-4 w-4" />
            Create new session
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <article className="glass-panel p-5">
            <p className="text-sm text-slate-500">Total sessions</p>
            <p className="mt-4 text-3xl font-semibold text-slate-950">{sessions.length}</p>
          </article>
          <article className="glass-panel p-5">
            <p className="text-sm text-slate-500">Pinned questions</p>
            <p className="mt-4 text-3xl font-semibold text-slate-950">{pinnedCount}</p>
          </article>
          <article className="glass-panel p-5">
            <p className="text-sm text-slate-500">Readiness avg</p>
            <p className="mt-4 text-xl font-semibold text-slate-950">{averageScore != null ? `${averageScore}/100` : "No attempts yet"}</p>
          </article>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Link to="/app/coding-lab" className="glass-panel p-5 transition hover:border-brand-200 hover:shadow-soft">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">
                <Code2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Coding Lab</h2>
                <p className="text-sm text-slate-500">Practice with runnable exercises inside the app.</p>
              </div>
            </div>
          </Link>
          <Link to="/app/mock-rooms" className="glass-panel p-5 transition hover:border-brand-200 hover:shadow-soft">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">
                <UsersRound className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Mock Rooms</h2>
                <p className="text-sm text-slate-500">Pair up for peer interviews with live prompts and WebRTC.</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <section className="glass-panel p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Recent sessions</h2>
            <p className="text-sm text-slate-500">Open a session to review, pin, listen, and request deeper explanations.</p>
          </div>
          <Sparkles className="h-5 w-5 text-brand-500" />
        </div>

        {loading ? <p className="mt-6 text-sm text-slate-500">Loading sessions...</p> : null}
        {error ? <p className="mt-6 text-sm text-rose-500">{error}</p> : null}

        <div className="mt-6 rounded-[24px] border border-slate-100 bg-slate-50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">Voice practice trend</p>
              <p className="text-sm text-slate-500">Latest readiness scores across your spoken attempts.</p>
            </div>
            <TrendingUp className="h-5 w-5 text-brand-500" />
          </div>
          <div className="mt-4 flex h-28 items-end gap-2">
            {latestTrend.length ? (
              latestTrend.map((score, index) => (
                <div key={`${score}-${index}`} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-t-2xl bg-slate-950/90" style={{ height: `${Math.max(score, 12)}%` }} />
                  <span className="text-xs text-slate-500">{score}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No spoken answers evaluated yet.</p>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {!loading && !sessions.length ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
              <p className="text-sm text-slate-500">No sessions yet. Start with a role and experience level, and the app will generate your first set.</p>
              <Link to="/app/sessions/new" className="primary-button mt-4">
                Create your first session
              </Link>
            </div>
          ) : null}

          {sessions.map((session) => (
            <Link
              to={`/app/sessions/${session._id}`}
              key={session._id}
              className="flex flex-col gap-4 rounded-[28px] border border-slate-100 bg-white p-5 transition hover:border-brand-200 hover:shadow-soft sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold text-slate-950">{session.role}</h3>
                <p className="mt-1 text-sm text-slate-500">{session.focusAreas.join(", ")}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">{session.experience} years</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {badgeText(session.questions.length, "question")}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {badgeText(session.questions.filter((item) => item.isPinned).length, "pin")}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4" />
                  {formatDate(session.updatedAt)}
                </div>
                <div className="flex items-center gap-2">
                  <Pin className="h-4 w-4" />
                  {session.questions.filter((item) => item.isPinned).length}
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
