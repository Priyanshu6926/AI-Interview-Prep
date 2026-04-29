import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthShell from "../components/AuthShell";
import { useAuth } from "../hooks/useAuth";

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register(form);
      navigate("/app");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create your account right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Build your prep space"
      subtitle="Create an account to save interview sessions, return to pinned questions, and track your technical study flow across roles."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand-600">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Full name</label>
          <input
            className="input-field"
            type="text"
            placeholder="Priyanshu Sharma"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
          <input
            className="input-field"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
          <input
            className="input-field"
            type="password"
            placeholder="Create a strong password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            required
          />
        </div>
        {error ? <p className="text-sm text-rose-500">{error}</p> : null}
        <button type="submit" className="primary-button w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}

export default RegisterPage;
