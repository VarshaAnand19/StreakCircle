import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

axios.defaults.baseURL = "https://streakcircle-backend.onrender.com";
axios.defaults.withCredentials = true;

const AuthContext = createContext();

// Set token in axios headers
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("sc_token", token);
  } else {
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("sc_token");
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("sc_token");
    if (token) {
      setAuthToken(token);
      axios.get("/api/auth/me")
        .then(res => setUser(res.data))
        .catch(() => {
          setAuthToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await axios.post("/api/auth/login", { email, password });
    setAuthToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await axios.post("/api/auth/register", { name, email, password });
    setAuthToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
  };

  const loginWithGoogle = () => {
    window.location.href = "https://streakcircle-backend.onrender.com/api/auth/google";
  };

  const updateProfile = async (data) => {
    const res = await axios.put("/api/auth/profile", data);
    setUser(res.data.user);
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, loginWithGoogle, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
