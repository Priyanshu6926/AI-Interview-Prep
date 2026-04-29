import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { BookOpenText, Code2, LayoutDashboard, LogOut, PlusCircle, UsersRound } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import appLogo from "../assets/app-logo.png";

const navItems = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/sessions/new", label: "New Session", icon: PlusCircle },
  { to: "/app/coding-lab", label: "Coding Lab", icon: Code2 },
  { to: "/app/mock-rooms", label: "Mock Rooms", icon: UsersRound },
  { to: "/app/resources", label: "Lectures", icon: BookOpenText }
];

function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,243,211,0.95),_rgba(248,250,252,0.92)_32%,_rgba(248,250,252,1)_68%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col gap-4 glass-panel p-4 sm:p-6">
        <header className="flex flex-col gap-4 border-b border-slate-100 pb-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-white">
              <img src={appLogo} alt="Interview Prep AI logo" className="h-9 w-9 object-contain" />
            </div>
            <div>
              <Link to="/app" className="text-2xl font-semibold tracking-tight text-slate-950">
                Interview Prep AI
              </Link>
              <p className="text-sm text-slate-500">Practice, review, and improve with AI-guided coaching.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <nav className="flex flex-wrap gap-2">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/app"}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition ${
                      isActive ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
            </nav>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-3 py-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                {user?.name?.slice(0, 2).toUpperCase() || "IP"}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{user?.name || "Interviewer"}</p>
                <button onClick={logout} className="inline-flex items-center gap-1 text-sm font-medium text-brand-500">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>
        <main className={location.pathname === "/app" ? "flex-1" : "flex-1"}><Outlet /></main>
      </div>
    </div>
  );
}

export default DashboardLayout;
