import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function InviteSheet({ community, onClose }) {
  const { joinByCode } = useApp();
  const [copied, setCopied] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [joinMsg, setJoinMsg] = useState(null);
  const [tab, setTab] = useState("invite");

  const inviteCode = community.inviteCode || "SC-" + community.name.substring(0, 3).toUpperCase() + "001";
  const inviteLink = `streakcircle.app/join/${inviteCode}`;

  const copyCode = () => {
    navigator.clipboard?.writeText(inviteCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLink = () => {
    navigator.clipboard?.writeText(inviteLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinCode = () => {
    const result = joinByCode(codeInput.trim().toUpperCase());
    setJoinMsg(result);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "flex-end", zIndex: 400 }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "var(--bg2)", borderRadius: "24px 24px 0 0", width: "100%", border: "1px solid var(--border)", padding: 24 }}>
        <div style={{ width: 36, height: 4, background: "var(--border)", borderRadius: 2, margin: "0 auto 20px" }} />

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, background: "var(--bg3)", borderRadius: 12, padding: 4, marginBottom: 24 }}>
          {["invite", "join"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, background: tab === t ? "var(--red)" : "transparent",
              border: "none", borderRadius: 10, padding: "9px",
              fontFamily: "DM Sans, sans-serif", fontSize: 13, fontWeight: 600,
              color: tab === t ? "white" : "var(--muted)", cursor: "pointer", transition: "all 0.2s",
              textTransform: "capitalize"
            }}>{t === "invite" ? "Invite a Friend" : "Join with Code"}</button>
          ))}
        </div>

        {tab === "invite" && (
          <>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>{community.emoji}</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{community.name}</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>Share this code or link to invite friends</div>
            </div>

            {/* Invite Code */}
            <div style={{ background: "var(--bg3)", border: "2px dashed var(--border)", borderRadius: 16, padding: "20px", textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Invite Code</div>
              <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: 8, color: "var(--accent)", fontFamily: "DM Sans, sans-serif", marginBottom: 12 }}>{inviteCode}</div>
              <button onClick={copyCode} style={{
                background: copied ? "var(--red)" : "transparent",
                border: "1px solid var(--border)", borderRadius: 20, padding: "6px 20px",
                fontFamily: "DM Sans, sans-serif", fontSize: 12, fontWeight: 600,
                color: copied ? "white" : "var(--text)", cursor: "pointer", transition: "all 0.2s"
              }}>{copied ? "Copied! ✓" : "Copy Code"}</button>
            </div>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              <span style={{ fontSize: 11, color: "var(--muted)" }}>or share link</span>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            </div>

            {/* Invite link */}
            <div style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ flex: 1, fontSize: 12, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{inviteLink}</div>
              <button onClick={copyLink} style={{ background: "var(--red)", border: "none", borderRadius: 8, padding: "6px 14px", fontFamily: "DM Sans, sans-serif", fontSize: 12, fontWeight: 600, color: "white", cursor: "pointer", flexShrink: 0 }}>Copy</button>
            </div>

            {/* Share options */}
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: "var(--muted)", marginBottom: 12 }}>Share via</div>
            <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
              {[
                { icon: "💬", label: "Message" },
                { icon: "📱", label: "WhatsApp" },
                { icon: "📧", label: "Email" },
                { icon: "🔗", label: "More" },
              ].map(s => (
                <button key={s.label} onClick={copyLink} style={{
                  flex: 1, background: "var(--bg3)", border: "1px solid var(--border)",
                  borderRadius: 12, padding: "12px 8px", cursor: "pointer",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 5
                }}>
                  <span style={{ fontSize: 20 }}>{s.icon}</span>
                  <span style={{ fontSize: 10, color: "var(--muted)", fontFamily: "DM Sans, sans-serif" }}>{s.label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {tab === "join" && (
          <>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🔑</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Have an invite code?</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>Enter it below to join a community</div>
            </div>

            <input
              value={codeInput}
              onChange={e => setCodeInput(e.target.value.toUpperCase())}
              placeholder="Enter code e.g. AB1C2D"
              maxLength={8}
              style={{
                width: "100%", background: "var(--bg3)", border: "1px solid var(--border)",
                borderRadius: 12, padding: "14px 16px", fontFamily: "DM Sans, sans-serif",
                fontSize: 20, fontWeight: 700, color: "var(--accent)", outline: "none",
                textAlign: "center", letterSpacing: 6, marginBottom: 16
              }}
            />

            {joinMsg && (
              <div style={{ background: joinMsg.success ? "#0a2a0a" : "#2a0a0a", border: `1px solid ${joinMsg.success ? "#4CAF50" : "var(--red)"}`, borderRadius: 10, padding: "10px 14px", fontSize: 13, color: joinMsg.success ? "#4CAF50" : "var(--accent)", marginBottom: 16, textAlign: "center" }}>
                {joinMsg.success ? `✅ Joined ${joinMsg.community?.emoji} ${joinMsg.community?.name}!` : `❌ ${joinMsg.message}`}
              </div>
            )}

            <button onClick={handleJoinCode} disabled={!codeInput.trim()} style={{
              width: "100%", background: codeInput.trim() ? "var(--red)" : "var(--bg3)",
              border: "none", borderRadius: 12, padding: 14, color: codeInput.trim() ? "white" : "var(--muted)",
              fontFamily: "DM Sans, sans-serif", fontSize: 15, fontWeight: 600,
              cursor: codeInput.trim() ? "pointer" : "not-allowed"
            }}>Join Community</button>
          </>
        )}
      </div>
    </div>
  );
}