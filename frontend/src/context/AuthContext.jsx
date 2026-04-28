import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/auth/me")
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await axios.post("/api/auth/login", { email, password });
    setUser(res.data.user);
    return res.data;
  };

  const register = async (name, email, password, birthday, location) => {
    const res = await axios.post("/api/auth/register", { name, email, password, birthday, location });
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    await axios.post("/api/auth/logout");
    setUser(null);
  };

  const loginWithGoogle = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

 return (
  <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, loginWithGoogle }}>
    {children}
  </AuthContext.Provider>
);
}

export const useAuth = () => useContext(AuthContext);