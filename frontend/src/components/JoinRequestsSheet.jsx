import { useApp } from "../context/AppContext";

export default function JoinRequestsSheet({ community, onClose }) {
  const { acceptRequest, declineRequest } = useApp();
  const requests = community.joinRequests || [];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "flex-end", zIndex: 400 }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "var(--bg2)", borderRadius: "24px 24px 0 0", width: "100%", border: "1px solid var(--border)", padding: 24, maxHeight: "70vh", overflowY: "auto" }}>

        <div style={{ width: 36, height: 4, background: "var(--border)", borderRadius: 2, margin: "0 auto 20px" }} />
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, fontFamily: "Playfair Display, serif" }}>Join Requests</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 24 }}>
          {community.emoji} {community.name} · {requests.length} pending
        </div>

        {requests.length === 0 && (
          <div style={{ textAlign: "center", padding: "32px 0", color: "var(--muted)", fontSize: 14 }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
            No pending requests
          </div>
        )}

        {requests.map((user, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
            <div style={{
              width: 42, height: 42, borderRadius: "50%", background: "var(--red)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 15, fontWeight: 700, color: "white", flexShrink: 0
            }}>
              {user.substring(0, 2).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{user}</div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>Wants to join {community.name}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => declineRequest(community.name, user)} style={{
                background: "transparent", border: "1px solid var(--border)",
                borderRadius: 8, padding: "6px 12px", fontFamily: "DM Sans, sans-serif",
                fontSize: 12, color: "var(--muted)", cursor: "pointer"
              }}>✕</button>
              <button onClick={() => acceptRequest(community.name, user)} style={{
                background: "var(--red)", border: "none",
                borderRadius: 8, padding: "6px 14px", fontFamily: "DM Sans, sans-serif",
                fontSize: 12, fontWeight: 600, color: "white", cursor: "pointer"
              }}>Accept</button>
            </div>
          </div>
        ))}

        <button onClick={onClose} style={{
          width: "100%", background: "transparent", border: "1px solid var(--border)",
          borderRadius: 12, padding: 13, color: "var(--muted)",
          fontFamily: "DM Sans, sans-serif", fontSize: 14, cursor: "pointer", marginTop: 16
        }}>Close</button>

      </div>
    </div>
  );
}