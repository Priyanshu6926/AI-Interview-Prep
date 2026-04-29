import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { AuthContext } from "./authContextValue";

const TOKEN_KEY = "interview-prep-token";
const USER_KEY = "interview-prep-user";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const value = localStorage.getItem(USER_KEY);
    return value ? JSON.parse(value) : null;
  });

  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      delete api.defaults.headers.common.Authorization;
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    setToken(data.token);
    setUser(data.user);
  };

  const login = async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      register,
      login,
      logout
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
