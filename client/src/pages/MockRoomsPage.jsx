import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UsersRound, Video } from "lucide-react";
import api from "../services/api";

function MockRoomsPage() {
  const navigate = useNavigate();
  const [createForm, setCreateForm] = useState({
    topic: "Frontend architecture",
    roleFocus: "Frontend Developer",
    experience: 2
  });
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createRoom = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/mock-rooms", createForm);
      navigate(`/app/mock-rooms/${data.room.roomCode}`);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create room.");
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post(`/mock-rooms/${joinCode.toUpperCase()}/join`);
      navigate(`/app/mock-rooms/${joinCode.toUpperCase()}`);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to join room.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <section className="rounded-[32px] bg-slate-950 p-8 text-white shadow-soft">
        <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-100">
          Peer-to-peer mock interviews
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Open a live practice room and interview each other.</h1>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          These rooms use browser WebRTC for local media and REST-backed signaling so you can create a room, share a code, and run a mock session around AI-generated prompts.
        </p>
      </section>

      <section className="space-y-6">
        <form onSubmit={createRoom} className="glass-panel p-6">
          <div className="flex items-center gap-2 text-sm font-medium text-brand-600">
            <Video className="h-4 w-4" />
            Create room
          </div>
          <div className="mt-5 space-y-4">
            <input
              className="input-field"
              value={createForm.topic}
              onChange={(event) => setCreateForm((current) => ({ ...current, topic: event.target.value }))}
              placeholder="Topic focus"
            />
            <input
              className="input-field"
              value={createForm.roleFocus}
              onChange={(event) => setCreateForm((current) => ({ ...current, roleFocus: event.target.value }))}
              placeholder="Role focus"
            />
            <input
              className="input-field"
              type="number"
              min="0"
              max="20"
              value={createForm.experience}
              onChange={(event) => setCreateForm((current) => ({ ...current, experience: Number(event.target.value) }))}
            />
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? "Creating..." : "Create mock room"}
            </button>
          </div>
        </form>

        <form onSubmit={joinRoom} className="glass-panel p-6">
          <div className="flex items-center gap-2 text-sm font-medium text-brand-600">
            <UsersRound className="h-4 w-4" />
            Join with code
          </div>
          <div className="mt-5 space-y-4">
            <input
              className="input-field uppercase"
              value={joinCode}
              onChange={(event) => setJoinCode(event.target.value)}
              placeholder="Enter room code"
            />
            <button type="submit" className="secondary-button" disabled={loading || !joinCode.trim()}>
              Join room
            </button>
          </div>
        </form>

        {error ? <p className="text-sm text-rose-500">{error}</p> : null}
      </section>
    </div>
  );
}

export default MockRoomsPage;
