import { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";

export default function Profile({ onOpenCommunity }) {
  const { communities, getStreakStatus } = useApp();
  const { user, logout, updateProfile } = useAuth();
  const joined = communities.filter(c => c.joined);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const [savingName, setSavingName] = useState(false);
  const fileInputRef = useRef();

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  const handleNameSave = async () => {
    if (!newName.trim()) return;
    setSavingName(true);
    await updateProfile({ name: newName.trim() });
    setSavingName(false);
    setEditingName(false);
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      await updateProfile({ avatar: reader.result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      {/* Hero */}
      <div style={{ background: "linear-gradient(180deg, var(--red-pale) 0%, transparent 100%)", padding: "52px 20px 24px", textAlign: "center", borderBottom: "1px solid var(--border)" }}>

        {/* Avatar with edit */}
        <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto 12px" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--red)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: "white", border: "3px solid var(--red-bright)", overflow: "hidden" }}>
            {user?.avatar
              ? <img src={user.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : initials}
          </div>
          <button onClick={() => fileInputRef.current.click()} style={{ position: "absolute", bottom: 0, right: 0, width: 26, height: 26, borderRadius: "50%", background: "var(--accent)", border: "2px solid var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="12" height="12"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoChange} />
        </div>

        {/* Editable name */}
        {editingName ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 4 }}>
            <input value={newName} onChange={e => setNewName(e.target.value)}
              autoFocus
              style={{ background: "var(--bg3)", border: "1px solid var(--accent)", borderRadius: 8, padding: "6px 12px", fontFamily: "Playfair Display, serif", fontSize: 18, fontWeight: 700, color: "var(--text)", outline: "none", textAlign: "center", width: 180 }} />
            <button onClick={handleNameSave} disabled={savingName} style={{ background: "var(--red)", border: "none", borderRadius: 8, padding: "6px 12px", color: "white", fontFamily: "DM Sans, sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              {savingName ? "..." : "Save"}
            </button>
            <button onClick={() => setEditingName(false)} style={{ background: "transparent", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 10px", color: "var(--muted)", fontFamily: "DM Sans, sans-serif", fontSize: 12, cursor: "pointer" }}>✕</button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ fontFamily: "Playfair Display, serif", fontSize: 22, fontWeight: 700 }}>{user?.name}</div>
            <button onClick={() => setEditingName(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", display: "flex", alignItems: "center" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
          </div>
        )}

        <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>@{user?.name?.toLowerCase().replace(/\s/g, "") || "user"}</div>

        <div style={{ display: "flex", justifyContent: "center", gap: 32 }}>
          {[[joined.length, "Communities"], [joined.length > 0 ? Math.max(...joined.map(c => getStreakStatus(c.name).count)) : 0, "Best Streak"], ["0", "Total Days"]].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "var(--accent)" }}>{num}</div>
              <div style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: 20 }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: "var(--muted)", marginBottom: 14 }}>Personal Info</div>
        {[
          ["Email", user?.email || "—"],
          ["Gender", user?.gender || "—"],
          ["Birthday", user?.birthday || "—"],
          ["Location", user?.location || "—"],
        ].map(([label, value]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
            <span style={{ fontSize: 11, color: "var(--muted)", width: 70 }}>{label}</span>
            <span style={{ fontSize: 13 }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Communities */}
      <div style={{ padding: "0 20px 20px" }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: "var(--muted)", marginBottom: 14 }}>My Communities</div>
        {joined.length === 0 && (
          <div style={{ textAlign: "center", padding: "20px 0", color: "var(--muted)", fontSize: 13 }}>You haven't joined any communities yet.</div>
        )}
        {joined.map(c => {
          const s = getStreakStatus(c.name);
          return (
            <div key={c.name} onClick={() => onOpenCommunity(c)} style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 12, padding: "10px 14px", marginBottom: 8, cursor: "pointer" }}>
              <span style={{ fontSize: 20 }}>{c.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: s.broken ? "var(--muted)" : "var(--accent)" }}>
                  {s.broken ? "💀 Streak lost — post to restart" : `🔥 ${s.count} day streak · ${s.hoursLeft}h left`}
                </div>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" style={{ color: "var(--muted)" }}><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          );
        })}
      </div>

      {/* Logout */}
      <div style={{ padding: "0 20px 40px" }}>
        <button onClick={logout} style={{ width: "100%", background: "transparent", border: "1px solid var(--red)", borderRadius: 12, padding: 14, color: "var(--accent)", fontFamily: "DM Sans, sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Logout
        </button>
      </div>
    </div>
  );
}