import { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import SnapCamera from "./SnapCamera";
import InviteSheet from "./InviteSheet";
import JoinRequestsSheet from "./JoinRequestsSheet";

export default function CommunityScreen({ community, onBack }) {
  const { posts, addPost, getStreakStatus, toggleJoin, leaveCommunity, isAdmin, communities } = useApp();
  const [text, setText] = useState("");
  const [showComments, setShowComments] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [commentData, setCommentData] = useState({});
  const [showInvite, setShowInvite] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showMemberAction, setShowMemberAction] = useState(null);
  const fileInputRef = useRef();
  const cameraInputRef = useRef();

  const liveCommunity = communities.find(c => c.name === community.name) || community;
  const amAdmin = isAdmin(community.name);
  const pendingRequests = liveCommunity.joinRequests?.length || 0;
  const communityPosts = posts[community.name] || [];
  const streak = getStreakStatus(community.name);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setMediaPreview(url);
    setMediaType(file.type.startsWith("video") ? "video" : "image");
  };

  const handlePost = () => {
    if (!text.trim() && !mediaPreview) return;
    addPost(community.name, text.trim(), mediaPreview, mediaType);
    setText("");
    setMediaPreview(null);
    setMediaType(null);
    setShowCompose(false);
  };

  const removeMedia = () => {
    setMediaPreview(null);
    setMediaType(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const addComment = (postId) => {
    if (!commentText.trim()) return;
    setCommentData(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), { text: commentText.trim(), time: "just now" }]
    }));
    setCommentText("");
  };

  const menuItems = [
    {
      icon: "👥", label: "Invite Friends",
      sub: "Share invite code or link", color: "var(--text)",
      action: () => { setShowMenu(false); setShowInvite(true); }
    },
    ...(amAdmin && liveCommunity.type === "private" ? [{
      icon: "📋",
      label: `Join Requests${pendingRequests > 0 ? ` (${pendingRequests})` : ""}`,
      sub: "Manage who joins this community",
      color: pendingRequests > 0 ? "var(--accent)" : "var(--text)",
      action: () => { setShowMenu(false); setShowRequests(true); }
    }] : []),
    {
      icon: "🔕", label: "Mute Community",
      sub: "Stop notifications from this community", color: "var(--text)",
      action: () => { alert("Community muted"); setShowMenu(false); }
    },
    {
      icon: "🚪", label: "Leave Community",
      sub: "Remove yourself from this community", color: "#ff4444",
      action: () => { setShowMenu(false); setShowLeaveConfirm(true); }
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: 100 }}>

      {/* Header */}
      <div style={{
        padding: "52px 20px 16px", display: "flex", alignItems: "center", gap: 14,
        borderBottom: "1px solid var(--border)", background: "var(--bg2)"
      }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "var(--text)", cursor: "pointer" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <span style={{ fontSize: 28 }}>{community.emoji}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>{community.name}</div>
          <div style={{ fontSize: 11, color: "var(--muted)" }}>{liveCommunity.members} members</div>
        </div>
        <div style={{ background: "var(--red-pale)", border: "1px solid var(--red)", borderRadius: 20, padding: "6px 12px", textAlign: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: streak.broken ? "var(--muted)" : "var(--accent)" }}>
            {streak.broken ? "💀" : "🔥"} {streak.count}
          </div>
          <div style={{ fontSize: 9, color: "var(--muted)" }}>
            {streak.broken ? "Streak lost" : `${streak.hoursLeft}h left`}
          </div>
        </div>
        <button onClick={() => setShowMenu(true)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: "4px" }}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
          </svg>
        </button>
      </div>

      {/* Warnings */}
      {!streak.broken && streak.hoursLeft < 12 && streak.hoursLeft > 0 && (
        <div style={{ margin: "12px 20px", background: "#2a1a00", border: "1px solid #ff6b35", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#ff6b35" }}>
          ⚠️ Post in the next {streak.hoursLeft}h to keep your streak alive!
        </div>
      )}
      {streak.broken && (
        <div style={{ margin: "12px 20px", background: "#1a0808", border: "1px solid var(--red)", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "var(--accent)" }}>
          💀 Your streak was lost. Post now to start a new one!
        </div>
      )}

      {/* Posts */}
      <div style={{ padding: "16px 20px" }}>
        {communityPosts.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--muted)", fontSize: 14 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🌱</div>
            No posts yet. Be the first to post!
          </div>
        )}
        {communityPosts.map(post => (
          <div key={post.id} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: 16, marginBottom: 14 }}>
            <div
              onClick={() => post.user !== "Arun Kumar" && setShowMemberAction(post)}
              style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, cursor: post.user !== "Arun Kumar" ? "pointer" : "default" }}
            >
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: post.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "white", flexShrink: 0 }}>
                {post.initials}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>
                  {post.user}{" "}
                  {post.user === "Arun Kumar" && <span style={{ fontSize: 10, color: "var(--muted)" }}>(you)</span>}
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>{post.time}</div>
              </div>
              {post.user !== "Arun Kumar" && (
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" style={{ color: "var(--muted)" }}>
                  <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
                </svg>
              )}
            </div>

            {post.mediaType === "image" && (
              <img src={post.media} alt="post" style={{ width: "100%", maxHeight: 300, objectFit: "cover", borderRadius: 10, marginBottom: 10 }} />
            )}
            {post.mediaType === "video" && (
              <video src={post.media} controls style={{ width: "100%", borderRadius: 10, marginBottom: 10 }} />
            )}
            {post.body && (
              <div style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 10 }}>{post.body}</div>
            )}

            <div style={{ display: "flex", gap: 16 }}>
              <button style={{ background: "none", border: "none", color: "var(--muted)", fontFamily: "DM Sans, sans-serif", fontSize: 12, display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {post.likes}
              </button>
              <button
                onClick={() => { setShowComments(post); setCommentText(""); }}
                style={{ background: "none", border: "none", color: "var(--muted)", fontFamily: "DM Sans, sans-serif", fontSize: 12, display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                {(commentData[post.id] || []).length + post.comments}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Hidden file inputs */}
      <input ref={fileInputRef} type="file" accept="image/*,video/*" style={{ display: "none" }} onChange={handleFileChange} />
      <input ref={cameraInputRef} type="file" accept="image/*,video/*" capture="environment" style={{ display: "none" }} onChange={handleFileChange} />

      {/* Compose Sheet */}
      {showCompose && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "flex-end", zIndex: 200 }}>
          <div style={{ background: "var(--bg2)", borderRadius: "20px 20px 0 0", padding: 20, width: "100%", borderTop: "1px solid var(--border)" }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>
              Post to {community.emoji} {community.name}
            </div>
            {mediaPreview && (
              <div style={{ position: "relative", marginBottom: 12 }}>
                {mediaType === "image"
                  ? <img src={mediaPreview} alt="preview" style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 10 }} />
                  : <video src={mediaPreview} controls style={{ width: "100%", borderRadius: 10 }} />
                }
                <button onClick={removeMedia} style={{
                  position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)",
                  border: "none", borderRadius: "50%", width: 28, height: 28, color: "white",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16
                }}>✕</button>
              </div>
            )}
            <textarea
              value={text} onChange={e => setText(e.target.value)}
              placeholder="Share your progress, thoughts, or a snap moment..."
              autoFocus
              style={{
                width: "100%", background: "var(--bg3)", border: "1px solid var(--border)",
                borderRadius: 12, padding: 14, fontFamily: "DM Sans, sans-serif",
                fontSize: 14, color: "var(--text)", resize: "none",
                height: mediaPreview ? 70 : 120, outline: "none"
              }}
            />
            <div style={{ display: "flex", gap: 10, marginTop: 12, marginBottom: 12 }}>
              <button onClick={() => cameraInputRef.current.click()} style={{
                flex: 1, background: "var(--bg3)", border: "1px solid var(--border)",
                borderRadius: 10, padding: "10px", fontFamily: "DM Sans, sans-serif",
                fontSize: 13, color: "var(--text)", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 7
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                Camera
              </button>
              <button onClick={() => fileInputRef.current.click()} style={{
                flex: 1, background: "var(--bg3)", border: "1px solid var(--border)",
                borderRadius: 10, padding: "10px", fontFamily: "DM Sans, sans-serif",
                fontSize: 13, color: "var(--text)", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 7
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Gallery
              </button>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setShowCompose(false); removeMedia(); setText(""); }} style={{
                flex: 1, background: "transparent", border: "1px solid var(--border)",
                borderRadius: 10, padding: 12, color: "var(--muted)",
                fontFamily: "DM Sans, sans-serif", fontSize: 14, cursor: "pointer"
              }}>Cancel</button>
              <button onClick={handlePost} disabled={!text.trim() && !mediaPreview} style={{
                flex: 2, background: text.trim() || mediaPreview ? "var(--red)" : "var(--bg3)",
                border: "none", borderRadius: 10, padding: 12,
                color: text.trim() || mediaPreview ? "white" : "var(--muted)",
                fontFamily: "DM Sans, sans-serif", fontSize: 14, fontWeight: 600,
                cursor: text.trim() || mediaPreview ? "pointer" : "not-allowed", transition: "all 0.2s"
              }}>Post 🔥</button>
            </div>
          </div>
        </div>
      )}

      {/* Community Menu */}
      {showMenu && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "flex-end", zIndex: 300 }}
          onClick={() => setShowMenu(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "var(--bg2)", borderRadius: "20px 20px 0 0", padding: 20, width: "100%", border: "1px solid var(--border)" }}>
            <div style={{ width: 36, height: 4, background: "var(--border)", borderRadius: 2, margin: "0 auto 20px" }} />
            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 14, textAlign: "center" }}>{community.emoji} {community.name}</div>
            {menuItems.map(item => (
              <button key={item.label} onClick={item.action} style={{
                width: "100%", background: "var(--bg3)", border: "1px solid var(--border)",
                borderRadius: 12, padding: "14px 16px", marginBottom: 10,
                display: "flex", alignItems: "center", gap: 14, cursor: "pointer", textAlign: "left"
              }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: item.color, fontFamily: "DM Sans, sans-serif" }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "DM Sans, sans-serif", marginTop: 2 }}>{item.sub}</div>
                </div>
              </button>
            ))}
            <button onClick={() => setShowMenu(false)} style={{
              width: "100%", background: "transparent", border: "1px solid var(--border)",
              borderRadius: 12, padding: 13, color: "var(--muted)",
              fontFamily: "DM Sans, sans-serif", fontSize: 14, cursor: "pointer", marginTop: 4
            }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Leave Confirm */}
      {showLeaveConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, padding: "0 30px" }}>
          <div style={{ background: "var(--bg2)", borderRadius: 20, padding: 24, width: "100%", border: "1px solid var(--border)", textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>😔</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Leave {community.name}?</div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24, lineHeight: 1.5 }}>
              Your 🔥 {getStreakStatus(community.name).count} day streak will be lost if you leave.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowLeaveConfirm(false)} style={{
                flex: 1, background: "transparent", border: "1px solid var(--border)",
                borderRadius: 10, padding: 12, color: "var(--text)",
                fontFamily: "DM Sans, sans-serif", fontSize: 14, cursor: "pointer"
              }}>Stay</button>
              <button onClick={() => { leaveCommunity(community.name); setShowLeaveConfirm(false); onBack(); }} style={{
                flex: 1, background: "var(--red)", border: "none",
                borderRadius: 10, padding: 12, color: "white",
                fontFamily: "DM Sans, sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer"
              }}>Leave</button>
            </div>
          </div>
        </div>
      )}

      {/* Member Action Sheet */}
      {showMemberAction && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "flex-end", zIndex: 300 }}
          onClick={() => setShowMemberAction(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "var(--bg2)", borderRadius: "20px 20px 0 0", padding: 20, width: "100%", border: "1px solid var(--border)" }}>
            <div style={{ width: 36, height: 4, background: "var(--border)", borderRadius: 2, margin: "0 auto 20px" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, padding: "0 4px" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: showMemberAction.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 600, color: "white" }}>{showMemberAction.initials}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{showMemberAction.user}</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>Member of {community.name}</div>
              </div>
            </div>
            {[
              { icon: "🔇", label: "Mute", sub: "Hide their posts from your feed", color: "var(--text)" },
              { icon: "🚫", label: "Restrict", sub: "Limit their interactions with you", color: "var(--text)" },
              { icon: "⚠️", label: "Report", sub: "Report inappropriate behaviour", color: "#ff9500" },
              { icon: "🛑", label: "Block", sub: "They won't be able to see your posts", color: "#ff4444" },
            ].map(item => (
              <button key={item.label} onClick={() => { alert(`${item.label}ed ${showMemberAction.user}`); setShowMemberAction(null); }} style={{
                width: "100%", background: "var(--bg3)", border: "1px solid var(--border)",
                borderRadius: 12, padding: "14px 16px", marginBottom: 10,
                display: "flex", alignItems: "center", gap: 14, cursor: "pointer", textAlign: "left"
              }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: item.color, fontFamily: "DM Sans, sans-serif" }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "DM Sans, sans-serif", marginTop: 2 }}>{item.sub}</div>
                </div>
              </button>
            ))}
            <button onClick={() => setShowMemberAction(null)} style={{
              width: "100%", background: "transparent", border: "1px solid var(--border)",
              borderRadius: 12, padding: 13, color: "var(--muted)",
              fontFamily: "DM Sans, sans-serif", fontSize: 14, cursor: "pointer", marginTop: 4
            }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Comment Sheet */}
      {showComments && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "flex-end", zIndex: 300 }}
          onClick={() => setShowComments(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "var(--bg2)", borderRadius: "20px 20px 0 0", width: "100%", border: "1px solid var(--border)", maxHeight: "75vh", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Comments</div>
              <button onClick={() => setShowComments(null)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 18 }}>✕</button>
            </div>
            <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: showComments.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: "white" }}>{showComments.initials}</div>
                <span style={{ fontSize: 12, fontWeight: 500 }}>{showComments.user}</span>
              </div>
              {showComments.body && (
                <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5, paddingLeft: 32 }}>{showComments.body}</div>
              )}
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "12px 20px" }}>
              {(commentData[showComments.id] || []).length === 0 && (
                <div style={{ textAlign: "center", padding: "24px 0", color: "var(--muted)", fontSize: 13 }}>
                  No comments yet. Be the first!
                </div>
              )}
              {(commentData[showComments.id] || []).map((c, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--red)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "white", flexShrink: 0 }}>AK</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>Arun Kumar</span>
                      <span style={{ fontSize: 10, color: "var(--muted)" }}>{c.time}</span>
                    </div>
                    <div style={{ fontSize: 13, lineHeight: 1.5, background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "4px 12px 12px 12px", padding: "8px 12px" }}>{c.text}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)", display: "flex", gap: 10, alignItems: "flex-end", flexShrink: 0 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--red)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "white", flexShrink: 0 }}>AK</div>
              <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                rows={1}
                style={{
                  flex: 1, background: "var(--bg3)", border: "1px solid var(--border)",
                  borderRadius: 20, padding: "8px 14px", fontFamily: "DM Sans, sans-serif",
                  fontSize: 13, color: "var(--text)", resize: "none", outline: "none", lineHeight: 1.5
                }}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    addComment(showComments.id);
                  }
                }}
              />
              <button onClick={() => addComment(showComments.id)} style={{
                background: commentText.trim() ? "var(--red)" : "var(--bg3)",
                border: "none", borderRadius: "50%", width: 36, height: 36,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: commentText.trim() ? "pointer" : "not-allowed",
                flexShrink: 0, transition: "background 0.2s"
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="16" height="16">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Sheet */}
      {showInvite && <InviteSheet community={liveCommunity} onClose={() => setShowInvite(false)} />}

      {/* Join Requests Sheet */}
      {showRequests && <JoinRequestsSheet community={liveCommunity} onClose={() => setShowRequests(false)} />}

      {/* Snap Camera */}
      {showCamera && (
        <SnapCamera
          community={community}
          onClose={() => setShowCamera(false)}
          onPost={(caption, url, type) => addPost(community.name, caption, url, type)}
        />
      )}

      {/* FAB */}
      <button onClick={() => setShowCamera(true)} style={{
        position: "fixed", bottom: 90, right: 20, width: 56, height: 56,
        borderRadius: "50%", background: "var(--red)", border: "none",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", boxShadow: "0 4px 20px rgba(139,0,0,0.5)", zIndex: 100
      }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" width="24" height="24">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
          <circle cx="12" cy="13" r="4"/>
        </svg>
      </button>

    </div>
  );
}