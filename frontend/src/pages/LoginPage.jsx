import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage({ onSwitch }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return setError("Please fill in all fields");
    setLoading(true); setError("");
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>
      <div style={{ fontFamily: "Playfair Display, serif", fontSize: 36, fontWeight: 900, marginBottom: 8 }}>
        Streak<span style={{ color: "var(--accent)" }}>Circle</span>
      </div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 40 }}>Build habits. Keep streaks. Together.</div>

      <div style={{ width: "100%", maxWidth: 400, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, padding: 28 }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, fontFamily: "Playfair Display, serif" }}>Welcome back</div>

        {error && (
          <div style={{ background: "#2a0a0a", border: "1px solid var(--red)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "var(--accent)", marginBottom: 16 }}>{error}</div>
        )}

        {/* Email */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>Email</div>
          <input value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@email.com" type="email"
            style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px", fontFamily: "DM Sans, sans-serif", fontSize: 14, color: "var(--text)", outline: "none" }} />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>Password</div>
          <div style={{ position: "relative" }}>
            <input value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" type={showPass ? "text" : "password"}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 44px 12px 14px", fontFamily: "DM Sans, sans-serif", fontSize: 14, color: "var(--text)", outline: "none" }} />
            <button onClick={() => setShowPass(p => !p)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--muted)", display: "flex", alignItems: "center" }}>
              {showPass
                ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              }
            </button>
          </div>
        </div>

        <button onClick={handleLogin} disabled={loading} style={{
          width: "100%", background: "var(--red)", border: "none", borderRadius: 12,
          padding: "14px", color: "white", fontFamily: "DM Sans, sans-serif",
          fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 20, opacity: loading ? 0.7 : 1
        }}>{loading ? "Logging in..." : "Login 🔥"}</button>

        <div style={{ textAlign: "center", fontSize: 13, color: "var(--muted)" }}>
          Don't have an account?{" "}
          <span onClick={onSwitch} style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 600 }}>Sign up</span>
        </div>
      </div>
    </div>
  );
}