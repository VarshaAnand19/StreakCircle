import { useState } from "react";
import { useApp } from "../context/AppContext";

const tags = ["📚 Reading", "🏃 Running", "🎯 Focus", "💻 Coding", "🍃 Wellness", "🎨 Art", "🧠 Learning", "💪 Fitness"];

export default function Explore({ onOpenCommunity }) {
  const { communities, toggleJoin } = useApp();
  const [query, setQuery] = useState("");

  const filtered = communities.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div style={{ padding: "52px 20px 20px" }}>
        <div style={{ fontFamily: "Playfair Display, serif", fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Explore</div>
        <div style={{ fontSize: 13, color: "var(--muted)" }}>Find your next habit circle</div>
      </div>

      <div style={{ margin: "0 20px 20px", position: "relative" }}>
        <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--muted)", width: 18, height: 18 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search communities, habits..."
          style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 16px 12px 44px", fontFamily: "DM Sans, sans-serif", fontSize: 14, color: "var(--text)", outline: "none" }} />
      </div>

      {!query && (
        <>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: "var(--muted)", padding: "0 20px", marginBottom: 10 }}>Trending Topics</div>
          <div style={{ padding: "0 16px", marginBottom: 24 }}>
            {tags.map(tag => (
              <span key={tag} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 20, padding: "6px 14px", fontSize: 12, color: "var(--text)", cursor: "pointer", margin: 4 }}>{tag}</span>
            ))}
          </div>
        </>
      )}

      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: "var(--muted)", padding: "0 20px", marginBottom: 10 }}>
        {query ? "Search Results" : "All Communities"}
      </div>
      <div style={{ padding: "0 20px" }}>
        {filtered.map(c => (
          <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderBottom: "1px solid var(--border)", cursor: c.joined ? "pointer" : "default" }}
            onClick={() => c.joined && onOpenCommunity(c)}>
            <div style={{ width: 44, height: 44, background: "var(--bg3)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{c.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{c.name}</div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{c.members} members · 🔥 Avg streak {c.avg} days</div>
            </div>
            <button onClick={e => { e.stopPropagation(); toggleJoin(c.name); }} style={{ background: c.joined ? "transparent" : "var(--red)", border: c.joined ? "1px solid var(--border)" : "none", borderRadius: 8, padding: "6px 14px", fontFamily: "DM Sans, sans-serif", fontSize: 12, fontWeight: 600, color: c.joined ? "var(--muted)" : "white", cursor: "pointer" }}>
              {c.joined ? "Joined ✓" : "Join"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}