import { useState } from "react";
import { useApp } from "../context/AppContext";
import CreateCommunitySheet from "../components/CreateCommunitySheet";

export default function Communities({ onOpenCommunity }) {
  const { communities, toggleJoin, getStreakStatus, requestJoin } = useApp();
  const [activeTab, setActiveTab] = useState("Joined");
  const [showCreate, setShowCreate] = useState(false);

  const filtered = activeTab === "Joined"
    ? communities.filter(c => c.joined)
    : communities.filter(c => !c.joined);

  return (
    <div>
      <div style={{ padding: "52px 20px 20px" }}>
        <div style={{ fontFamily: "Playfair Display, serif", fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Communities</div>
        <div style={{ fontSize: 13, color: "var(--muted)" }}>Build habits together</div>
      </div>

      {/* Create button */}
      <div style={{ margin: "0 20px 20px" }}>
        <button onClick={() => setShowCreate(true)} style={{
          background: "linear-gradient(135deg, var(--red) 0%, var(--red-bright) 100%)",
          border: "none", borderRadius: 14, padding: "16px 20px", width: "100%",
          display: "flex", alignItems: "center", gap: 12,
          cursor: "pointer", color: "white", fontFamily: "DM Sans, sans-serif"
        }}>
          <div style={{
            width: 36, height: 36, background: "rgba(255,255,255,0.15)",
            borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18
          }}>✦</div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Create a Community</div>
            <div style={{ fontSize: 11, opacity: 0.75 }}>Start a new habit circle</div>
          </div>
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", padding: "0 20px", borderBottom: "1px solid var(--border)", marginBottom: 20 }}>
        {["Joined", "Discover"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            background: "none", border: "none", fontFamily: "DM Sans, sans-serif",
            fontSize: 13, fontWeight: 500, padding: "10px 16px", cursor: "pointer",
            color: activeTab === tab ? "var(--accent)" : "var(--muted)",
            borderBottom: activeTab === tab ? "2px solid var(--accent)" : "2px solid transparent",
            marginBottom: -1, transition: "all 0.2s"
          }}>{tab}</button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ padding: "0 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {filtered.map(c => {
          const s = getStreakStatus(c.name);
          const hasRequested = (c.joinRequests || []).includes("Arun Kumar");

          return (
            <div key={c.name}
              onClick={() => c.joined && onOpenCommunity(c)}
              style={{
                background: "var(--card)", border: "1px solid var(--border)",
                borderRadius: 14, padding: 16,
                cursor: c.joined ? "pointer" : "default"
              }}>

              {/* Private badge */}
              {c.type === "private" && (
                <div style={{ fontSize: 9, color: "var(--accent)", background: "var(--red-pale)", border: "1px solid var(--red)", borderRadius: 20, padding: "2px 8px", display: "inline-block", marginBottom: 6 }}>🔒 Private</div>
              )}

              <div style={{ fontSize: 28, marginBottom: 8 }}>{c.emoji}</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{c.name}</div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: c.joined ? 6 : 10 }}>
                {c.members} members · 🔥 avg {c.avg}
              </div>

              {/* Streak info */}
              {c.joined && (
                <div style={{ fontSize: 11, color: s.broken ? "var(--muted)" : "var(--accent)", marginBottom: 8 }}>
                  {s.broken ? "💀 Streak lost" : `🔥 ${s.count} day streak · ${s.hoursLeft}h left`}
                </div>
              )}

              {/* Join / Leave button */}
              <button
                onClick={e => {
                  e.stopPropagation();
                  if (c.joined) {
                    toggleJoin(c.name);
                  } else if (c.type === "private") {
                    if (!hasRequested) requestJoin(c.name);
                  } else {
                    toggleJoin(c.name);
                  }
                }}
                style={{
                  width: "100%", borderRadius: 8, padding: "7px",
                  fontFamily: "DM Sans, sans-serif", fontSize: 12, fontWeight: 600,
                  cursor: hasRequested ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  background: c.joined
                    ? "transparent"
                    : hasRequested
                      ? "transparent"
                      : "var(--red)",
                  border: c.joined || hasRequested
                    ? "1px solid var(--border)"
                    : "none",
                  color: c.joined
                    ? "var(--muted)"
                    : hasRequested
                      ? "var(--accent)"
                      : "white"
                }}>
                {c.joined
                  ? "Joined"
                  : hasRequested
                    ? "Requested ⏳"
                    : c.type === "private"
                      ? "🔒 Request"
                      : "Join"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Create community sheet */}
      {showCreate && <CreateCommunitySheet onClose={() => setShowCreate(false)} />}
    </div>
  );
}