import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";

export default function Feed({ onOpenCommunity }) {
  const { communities, getStreakStatus } = useApp();
  const joined = communities.filter(c => c.joined);
  const { user } = useAuth();
  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  const feedPosts = [
    { id: 1, initials: "RK", color: "#8B0000", user: "Ravi Kumar", streak: 22, community: "Reading", time: "2m ago", body: 'Just finished "Atomic Habits" — the 2-minute rule actually works! 📖', likes: 48, comments: 12 },
    { id: 2, initials: "PM", color: "#5a0d2a", user: "Priya M", streak: 8, community: "Morning Run", time: "18m ago", body: "5km done before 6am! Day 8 and feeling unstoppable 💪", likes: 93, comments: 7, imageEmoji: "🌅" },
    { id: 3, initials: "AS", color: "#1a3a6b", user: "Arjun S", streak: 31, community: "Journaling", time: "1h ago", body: "31 days of daily journaling. Sharing my prompts sheet 📝", likes: 127, comments: 34 },
  ];

  return (
    <div>
      <div style={{ padding: "52px 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "Playfair Display, serif", fontSize: 26, fontWeight: 900 }}>
          Streak<span style={{ color: "var(--accent)" }}>Circle</span>
        </div>
      </div>

      <div style={{ padding: "0 20px" }}>

        {/* Your Streaks — only shown when user has joined communities */}
        {joined.length > 0 && (
          <>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: "var(--muted)", marginBottom: 12 }}>Your Streaks</div>
            <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8, marginBottom: 24, scrollbarWidth: "none" }}>
              {joined.map((c, i) => {
                const s = getStreakStatus(c.name);
                const deg = Math.round((s.count / 30) * 360);
                return (
                  <div key={i} onClick={() => onOpenCommunity(c)} style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }}>
                    <div style={{ width: 60, height: 60, borderRadius: "50%", background: `conic-gradient(var(--accent) ${deg}deg, var(--border) 0)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                      <div style={{ position: "absolute", inset: 4, borderRadius: "50%", background: "var(--bg2)" }} />
                      <span style={{ position: "relative", zIndex: 1, fontSize: 22 }}>{c.emoji}</span>
                    </div>
                    <div style={{ fontSize: 10, color: "var(--muted)", textAlign: "center", maxWidth: 64, lineHeight: 1.3 }}>{c.name}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: s.broken ? "var(--muted)" : "var(--accent)" }}>
                      {s.broken ? "💀 0" : `🔥 ${s.count}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Community Feed — always visible */}
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: "var(--muted)", marginBottom: 12 }}>Community Feed</div>
        {feedPosts.map(post => {
          const comm = communities.find(c => c.name === post.community);
          return (
            <div key={post.id} onClick={() => comm && onOpenCommunity(comm)} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: 16, marginBottom: 14, cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: post.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: "white", flexShrink: 0 }}>{post.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{post.user} <span style={{ background: "var(--red-pale)", border: "1px solid var(--red)", color: "var(--accent)", fontSize: 10, padding: "3px 8px", borderRadius: 20, fontWeight: 600 }}>🔥 {post.streak}</span></div>
                  <div style={{ fontSize: 11, color: "var(--accent)" }}>r/{post.community}</div>
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>{post.time}</div>
              </div>
              {post.imageEmoji && (
                <div style={{ width: "100%", height: 140, borderRadius: 10, marginBottom: 12, background: "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>{post.imageEmoji}</div>
              )}
              <div style={{ fontSize: 14, lineHeight: 1.6 }}>{post.body}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}