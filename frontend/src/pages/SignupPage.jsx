import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function SignupPage({ onSwitch }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = field => e => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password || !form.confirm)
      return setError("All fields are required");
    if (form.password.length < 6)
      return setError("Password must be at least 6 characters");
    if (form.password !== form.confirm)
      return setError("Passwords do not match");
    setLoading(true); setError("");
    try {
      await register(form.name, form.email, form.password);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = ({ show, toggle }) => (
    <button onClick={toggle} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--muted)", display: "flex", alignItems: "center" }}>
      {show
        ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
        : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      }
    </button>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ fontFamily: "Playfair Display, serif", fontSize: 36, fontWeight: 900, marginBottom: 8 }}>
        Streak<span style={{ color: "var(--accent)" }}>Circle</span>
      </div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 40 }}>Build habits. Keep streaks. Together.</div>

      <div style={{ width: "100%", maxWidth: 400, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, padding: 28 }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, fontFamily: "Playfair Display, serif" }}>Create account</div>

        {error && (
          <div style={{ background: "#2a0a0a", border: "1px solid var(--red)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "var(--accent)", marginBottom: 16 }}>{error}</div>
        )}

        {/* Username */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>Username</div>
          <input value={form.name} onChange={update("name")} placeholder="arunkumar" type="text"
            style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px", fontFamily: "DM Sans, sans-serif", fontSize: 14, color: "var(--text)", outline: "none" }} />
        </div>

        {/* Email */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>Email</div>
          <input value={form.email} onChange={update("email")} placeholder="you@email.com" type="email"
            style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px", fontFamily: "DM Sans, sans-serif", fontSize: 14, color: "var(--text)", outline: "none" }} />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>Password</div>
          <div style={{ position: "relative" }}>
            <input value={form.password} onChange={update("password")} placeholder="min 6 characters" type={showPass ? "text" : "password"}
              style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 44px 12px 14px", fontFamily: "DM Sans, sans-serif", fontSize: 14, color: "var(--text)", outline: "none" }} />
            <EyeIcon show={showPass} toggle={() => setShowPass(p => !p)} />
          </div>
        </div>

        {/* Confirm Password */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>Confirm Password</div>
          <div style={{ position: "relative" }}>
            <input value={form.confirm} onChange={update("confirm")} placeholder="repeat password" type={showConfirm ? "text" : "password"}
              onKeyDown={e => e.key === "Enter" && handleRegister()}
              style={{ width: "100%", background: "var(--bg3)", border: `1px solid ${form.confirm && form.confirm !== form.password ? "var(--accent)" : "var(--border)"}`, borderRadius: 10, padding: "12px 44px 12px 14px", fontFamily: "DM Sans, sans-serif", fontSize: 14, color: "var(--text)", outline: "none" }} />
            <EyeIcon show={showConfirm} toggle={() => setShowConfirm(p => !p)} />
          </div>
          {form.confirm && form.confirm !== form.password && (
            <div style={{ fontSize: 11, color: "var(--accent)", marginTop: 6 }}>Passwords do not match</div>
          )}
          {form.confirm && form.confirm === form.password && (
            <div style={{ fontSize: 11, color: "#4CAF50", marginTop: 6 }}>✓ Passwords match</div>
          )}
        </div>

        <button onClick={handleRegister} disabled={loading} style={{
          width: "100%", background: "var(--red)", border: "none", borderRadius: 12,
          padding: "14px", color: "white", fontFamily: "DM Sans, sans-serif",
          fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 20, opacity: loading ? 0.7 : 1
        }}>{loading ? "Creating account..." : "Create Account 🔥"}</button>

        <div style={{ textAlign: "center", fontSize: 13, color: "var(--muted)" }}>
          Already have an account?{" "}
          <span onClick={onSwitch} style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 600 }}>Login</span>
        </div>
      </div>
    </div>
  );
}