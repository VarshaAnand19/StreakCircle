import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function ProfileSetup() {
  const { user, setUser } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ gender: "", birthday: "", city: "", nationality: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = field => e => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleFinish = async () => {
    if (!form.gender || !form.birthday || !form.city || !form.nationality)
      return setError("Please fill in all fields");
    setLoading(true);
    setError("");
    try {
      const res = await axios.put("/api/auth/profile", {
        birthday: form.birthday,
        location: `${form.city}, ${form.nationality}`,
        gender: form.gender,
        profileSetupDone: true,
      });
      setUser(res.data.user);
    } catch (err) {
      console.error("Profile save error:", err.response?.data);
      setError(err.response?.data?.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ fontFamily: "Playfair Display, serif", fontSize: 28, fontWeight: 900, marginBottom: 6 }}>
        Streak<span style={{ color: "var(--accent)" }}>Circle</span>
      </div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 32 }}>Let's set up your profile</div>

      <div style={{ width: "100%", maxWidth: 400, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, padding: 28 }}>

        <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
          {[1, 2].map(s => (
            <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: step >= s ? "var(--accent)" : "var(--border)", transition: "background 0.3s" }} />
          ))}
        </div>

        {error && (
          <div style={{ background: "#2a0a0a", border: "1px solid var(--red)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "var(--accent)", marginBottom: 16 }}>{error}</div>
        )}

        {step === 1 && (
          <>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, fontFamily: "Playfair Display, serif" }}>Hey {user?.name}! 👋</div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>Tell us a bit about yourself</div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>Gender</div>
              <div style={{ display: "flex", gap: 10 }}>
                {["Male", "Female", "Other"].map(g => (
                  <button key={g} onClick={() => setForm(p => ({ ...p, gender: g }))} style={{
                    flex: 1, padding: "10px", borderRadius: 10, cursor: "pointer",
                    fontFamily: "DM Sans, sans-serif", fontSize: 13, fontWeight: 500,
                    background: form.gender === g ? "var(--red)" : "var(--bg3)",
                    border: form.gender === g ? "none" : "1px solid var(--border)",
                    color: form.gender === g ? "white" : "var(--text)",
                    transition: "all 0.2s"
                  }}>{g}</button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>Birthday</div>
              <input value={form.birthday} onChange={update("birthday")} type="date"
                style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px", fontFamily: "DM Sans, sans-serif", fontSize: 14, color: "var(--text)", outline: "none" }} />
            </div>

            <button onClick={() => {
              if (!form.gender || !form.birthday) return setError("Please fill in all fields");
              setError(""); setStep(2);
            }} style={{
              width: "100%", background: "var(--red)", border: "none", borderRadius: 12,
              padding: "14px", color: "white", fontFamily: "DM Sans, sans-serif",
              fontSize: 15, fontWeight: 700, cursor: "pointer"
            }}>Next →</button>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, fontFamily: "Playfair Display, serif" }}>Where are you from?</div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>Help us connect you with nearby communities</div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>City</div>
              <input value={form.city} onChange={update("city")} placeholder="Chennai"
                style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px", fontFamily: "DM Sans, sans-serif", fontSize: 14, color: "var(--text)", outline: "none" }} />
            </div>

            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>Nationality</div>
              <input value={form.nationality} onChange={update("nationality")} placeholder="India"
                style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px", fontFamily: "DM Sans, sans-serif", fontSize: 14, color: "var(--text)", outline: "none" }} />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, background: "transparent", border: "1px solid var(--border)", borderRadius: 12, padding: 14, color: "var(--muted)", fontFamily: "DM Sans, sans-serif", fontSize: 14, cursor: "pointer" }}>← Back</button>
              <button onClick={handleFinish} disabled={loading} style={{
                flex: 2, background: "var(--red)", border: "none", borderRadius: 12,
                padding: "14px", color: "white", fontFamily: "DM Sans, sans-serif",
                fontSize: 15, fontWeight: 700, cursor: "pointer", opacity: loading ? 0.7 : 1
              }}>{loading ? "Saving..." : "Finish Setup 🔥"}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
