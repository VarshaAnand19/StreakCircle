import { useState } from "react";
import { useApp } from "../context/AppContext";

const EMOJIS = ["📚","🏃","🧘","✍️","🎸","🍳","💻","🎨","🎯","🌱","💪","🎵","🏊","🧪","📸","🎭","🌍","🧠"];

export default function CreateCommunitySheet({ onClose }) {
  const { createCommunity } = useApp();
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🌱");
  const [type, setType] = useState("public");
  const [description, setDescription] = useState("");
  const [step, setStep] = useState(1);

  const handleCreate = () => {
    if (!name.trim()) return;
    createCommunity({ name: name.trim(), emoji, type, description });
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "flex-end", zIndex: 400 }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "var(--bg2)", borderRadius: "24px 24px 0 0", width: "100%", border: "1px solid var(--border)", padding: 24, maxHeight: "90vh", overflowY: "auto" }}>

        <div style={{ width: 36, height: 4, background: "var(--border)", borderRadius: 2, margin: "0 auto 24px" }} />
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, fontFamily: "Playfair Display, serif" }}>Create Community</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 24 }}>Step {step} of 2</div>

        {/* Progress bar */}
        <div style={{ height: 3, background: "var(--border)", borderRadius: 2, marginBottom: 28 }}>
          <div style={{ height: "100%", width: step === 1 ? "50%" : "100%", background: "var(--accent)", borderRadius: 2, transition: "width 0.3s" }} />
        </div>

        {step === 1 && (
          <>
            {/* Emoji picker */}
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: "var(--muted)", marginBottom: 10 }}>Pick an Icon</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
              {EMOJIS.map(e => (
                <button key={e} onClick={() => setEmoji(e)} style={{
                  width: 44, height: 44, borderRadius: 12, fontSize: 22,
                  background: emoji === e ? "var(--red-pale)" : "var(--bg3)",
                  border: emoji === e ? "2px solid var(--accent)" : "1px solid var(--border)",
                  cursor: "pointer"
                }}>{e}</button>
              ))}
            </div>

            {/* Name */}
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: "var(--muted)", marginBottom: 10 }}>Community Name</div>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Morning Readers"
              style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 16px", fontFamily: "DM Sans, sans-serif", fontSize: 14, color: "var(--text)", outline: "none", marginBottom: 24 }} />

            {/* Description */}
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: "var(--muted)", marginBottom: 10 }}>Description (optional)</div>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="What's this community about?"
              style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 16px", fontFamily: "DM Sans, sans-serif", fontSize: 14, color: "var(--text)", outline: "none", resize: "none", height: 80, marginBottom: 24 }} />

            <button onClick={() => name.trim() && setStep(2)} style={{
              width: "100%", background: name.trim() ? "var(--red)" : "var(--bg3)",
              border: "none", borderRadius: 12, padding: 14, color: name.trim() ? "white" : "var(--muted)",
              fontFamily: "DM Sans, sans-serif", fontSize: 15, fontWeight: 600,
              cursor: name.trim() ? "pointer" : "not-allowed"
            }}>Next →</button>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: "var(--muted)", marginBottom: 16 }}>Community Type</div>

            {[
              { value: "public", icon: "🌍", title: "Public", sub: "Anyone can find and join instantly" },
              { value: "private", icon: "🔒", title: "Private", sub: "People must request to join. You approve." },
            ].map(opt => (
              <button key={opt.value} onClick={() => setType(opt.value)} style={{
                width: "100%", background: type === opt.value ? "var(--red-pale)" : "var(--bg3)",
                border: type === opt.value ? "2px solid var(--accent)" : "1px solid var(--border)",
                borderRadius: 14, padding: 16, marginBottom: 12,
                display: "flex", alignItems: "center", gap: 14, cursor: "pointer", textAlign: "left"
              }}>
                <span style={{ fontSize: 28 }}>{opt.icon}</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", fontFamily: "DM Sans, sans-serif" }}>{opt.title}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", fontFamily: "DM Sans, sans-serif", marginTop: 3 }}>{opt.sub}</div>
                </div>
                {type === opt.value && (
                  <div style={{ marginLeft: "auto", width: 20, height: 20, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" width="12" height="12"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                )}
              </button>
            ))}

            {/* Preview */}
            <div style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 14, padding: 16, margin: "20px 0", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 32 }}>{emoji}</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{name}</div>
                <div style={{ fontSize: 11, color: type === "public" ? "#4CAF50" : "var(--accent)", marginTop: 3 }}>
                  {type === "public" ? "🌍 Public" : "🔒 Private"} · 1 member · You are admin
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, background: "transparent", border: "1px solid var(--border)", borderRadius: 12, padding: 14, color: "var(--muted)", fontFamily: "DM Sans, sans-serif", fontSize: 14, cursor: "pointer" }}>← Back</button>
              <button onClick={handleCreate} style={{ flex: 2, background: "var(--red)", border: "none", borderRadius: 12, padding: 14, color: "white", fontFamily: "DM Sans, sans-serif", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
                Create {emoji} {name}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}