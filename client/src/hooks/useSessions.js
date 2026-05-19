import { useCallback, useEffect, useState } from "react";
import api from "../services/api";

export function useSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/sessions");
      setSessions(data.sessions);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load sessions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const removeSession = (sessionId) => {
    setSessions((current) => current.filter((session) => session._id !== sessionId));
  };

  return { sessions, loading, error, refetch: fetchSessions, removeSession };
}
