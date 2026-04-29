import { Link } from "react-router-dom";
import appLogo from "../assets/app-logo.png";

function AuthShell({ title, subtitle, footer, children }) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#fff7e3_0%,_#f8fafc_40%,_#f8fafc_100%)] px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <Link to="/" className="inline-flex items-center gap-3 text-slate-900">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-white">
            <img src={appLogo} alt="Interview Prep AI logo" className="h-9 w-9 object-contain" />
          </div>
          <span className="text-xl font-semibold">Interview Prep AI</span>
        </Link>
        <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[32px] border border-brand-100 bg-slate-950 p-8 text-white shadow-soft">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-brand-100">Interview coaching</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">{subtitle}</p>
            <div className="mt-10 space-y-4 text-sm text-slate-200">
              <p>Generate role-aware questions.</p>
              <p>Listen to answers out loud.</p>
              <p>Pin concepts worth revisiting.</p>
            </div>
          </section>
          <section className="glass-panel p-8">{children}<p className="mt-6 text-sm text-slate-500">{footer}</p></section>
        </div>
      </div>
    </div>
  );
}

export default AuthShell;
