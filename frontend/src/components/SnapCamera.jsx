import { useState, useRef, useEffect } from "react";

export default function SnapCamera({ community, onPost, onClose }) {
  const videoRef = useRef();
  const canvasRef = useRef();
  const mediaRecorderRef = useRef();
  const [stream, setStream] = useState(null);
  const [facing, setFacing] = useState("user");
  const [mode, setMode] = useState("photo"); // photo | video
  const [recording, setRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [captured, setCaptured] = useState(null); // { type, url }
  const [caption, setCaption] = useState("");
  const [flash, setFlash] = useState(false);
  const [showCaption, setShowCaption] = useState(false);
  const timerRef = useRef();
  const chunksRef = useRef([]);

  useEffect(() => {
    startCamera();
    return () => stopStream();
  }, [facing]);

  const startCamera = async () => {
    stopStream();
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true
      });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const stopStream = () => {
    if (stream) stream.getTracks().forEach(t => t.stop());
  };

  const flipCamera = () => {
    setFacing(f => f === "user" ? "environment" : "user");
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (facing === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0);
    const url = canvas.toDataURL("image/jpeg", 0.9);
    stopStream();
    setCaptured({ type: "photo", url });
  };

  const startRecording = () => {
    if (!stream) return;
    chunksRef.current = [];
    const mr = new MediaRecorder(stream, { mimeType: "video/webm" });
    mr.ondataavailable = e => chunksRef.current.push(e.data);
    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      stopStream();
      setCaptured({ type: "video", url });
    };
    mr.start();
    mediaRecorderRef.current = mr;
    setRecording(true);
    setRecordSeconds(0);
    timerRef.current = setInterval(() => {
      setRecordSeconds(s => {
        if (s >= 59) { stopRecording(); return 60; }
        return s + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    clearInterval(timerRef.current);
    setRecording(false);
  };

  const handleShutterPress = () => {
    if (mode === "photo") { takePhoto(); return; }
    if (!recording) startRecording(); else stopRecording();
  };

  const handleSend = () => {
    if (!captured) return;
    onPost(caption, captured.url, captured.type);
    onClose();
  };

  const retake = () => {
    setCaptured(null);
    setCaption("");
    setShowCaption(false);
    startCamera();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 500, display: "flex", flexDirection: "column" }}>

      {/* CAPTURE VIEW */}
      {!captured && (
        <>
          {/* Video feed */}
          <video ref={videoRef} autoPlay playsInline muted
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: facing === "user" ? "scaleX(-1)" : "none" }}
          />
          <canvas ref={canvasRef} style={{ display: "none" }} />

          {/* Top bar */}
          <div style={{ position: "relative", zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "52px 20px 16px" }}>
            <button onClick={() => { stopStream(); onClose(); }} style={{ background: "rgba(0,0,0,0.4)", border: "none", borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <div style={{ background: "rgba(0,0,0,0.5)", borderRadius: 20, padding: "6px 14px", color: "white", fontSize: 13, fontWeight: 600 }}>
              {community.emoji} {community.name}
            </div>
            <button onClick={() => setFlash(f => !f)} style={{ background: flash ? "rgba(255,200,0,0.5)" : "rgba(0,0,0,0.4)", border: "none", borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <svg viewBox="0 0 24 24" fill={flash ? "#FFD700" : "none"} stroke={flash ? "#FFD700" : "white"} strokeWidth="2" width="20" height="20"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </button>
          </div>

          {/* Recording timer */}
          {recording && (
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 10 }}>
              <div style={{ background: "rgba(0,0,0,0.5)", borderRadius: 20, padding: "6px 16px", display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff4444", animation: "pulse 1s infinite" }} />
                <span style={{ color: "white", fontSize: 14, fontWeight: 600 }}>
                  {String(Math.floor(recordSeconds / 60)).padStart(2, "0")}:{String(recordSeconds % 60).padStart(2, "0")}
                </span>
              </div>
            </div>
          )}

          {/* Mode toggle */}
          <div style={{ position: "absolute", bottom: 160, left: "50%", transform: "translateX(-50%)", zIndex: 10, display: "flex", gap: 0, background: "rgba(0,0,0,0.4)", borderRadius: 20, padding: 3 }}>
            {["photo", "video"].map(m => (
              <button key={m} onClick={() => !recording && setMode(m)} style={{
                background: mode === m ? "white" : "transparent",
                border: "none", borderRadius: 17, padding: "5px 18px",
                color: mode === m ? "#000" : "white",
                fontFamily: "DM Sans, sans-serif", fontSize: 12, fontWeight: 600,
                cursor: "pointer", textTransform: "capitalize", transition: "all 0.2s"
              }}>{m}</button>
            ))}
          </div>

          {/* Bottom controls */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10, padding: "0 30px 60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

            {/* Gallery picker */}
            <label style={{ width: 50, height: 50, borderRadius: 12, background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden" }}>
              <input type="file" accept="image/*,video/*" style={{ display: "none" }} onChange={e => {
                const file = e.target.files[0];
                if (!file) return;
                stopStream();
                setCaptured({ type: file.type.startsWith("video") ? "video" : "photo", url: URL.createObjectURL(file) });
              }} />
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" width="22" height="22"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </label>

            {/* Shutter */}
            <button onMouseDown={mode === "video" ? handleShutterPress : undefined}
              onClick={mode === "photo" ? handleShutterPress : undefined}
              style={{
                width: 78, height: 78, borderRadius: "50%",
                background: recording ? "#ff4444" : "white",
                border: recording ? "4px solid rgba(255,68,68,0.4)" : "4px solid rgba(255,255,255,0.4)",
                cursor: "pointer", transition: "all 0.15s", outline: "none",
                boxShadow: recording ? "0 0 0 6px rgba(255,68,68,0.3)" : "0 0 0 6px rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
              {mode === "video" && recording && (
                <div style={{ width: 24, height: 24, borderRadius: 4, background: "white" }} />
              )}
            </button>

            {/* Flip camera */}
            <button onClick={flipCamera} style={{ width: 50, height: 50, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" width="22" height="22"><path d="M1 4v6h6"/><path d="M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>
            </button>
          </div>

          <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
        </>
      )}

      {/* PREVIEW VIEW */}
      {captured && (
        <>
          {/* Media preview */}
          {captured.type === "photo"
            ? <img src={captured.url} alt="snap" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            : <video src={captured.url} autoPlay loop playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          }

          {/* Caption overlay */}
          {showCaption && (
            <div style={{ position: "absolute", top: "40%", left: 20, right: 20, zIndex: 20 }}>
              <input
                autoFocus
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="Add a caption..."
                style={{
                  width: "100%", background: "rgba(0,0,0,0.55)", border: "none",
                  borderRadius: 10, padding: "10px 16px", textAlign: "center",
                  fontFamily: "DM Sans, sans-serif", fontSize: 18, fontWeight: 600,
                  color: "white", outline: "none",
                  backdropFilter: "blur(4px)"
                }}
                onBlur={() => !caption && setShowCaption(false)}
              />
            </div>
          )}

          {/* Caption display when not editing */}
          {!showCaption && caption && (
            <div onClick={() => setShowCaption(true)} style={{
              position: "absolute", top: "40%", left: 20, right: 20, zIndex: 20,
              background: "rgba(0,0,0,0.55)", borderRadius: 10, padding: "10px 16px",
              textAlign: "center", fontFamily: "DM Sans, sans-serif",
              fontSize: 18, fontWeight: 600, color: "white", cursor: "pointer"
            }}>{caption}</div>
          )}

          {/* Top controls */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 20, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "52px 20px 16px" }}>
            <button onClick={retake} style={{ background: "rgba(0,0,0,0.4)", border: "none", borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="20" height="20"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button onClick={() => setShowCaption(true)} style={{ background: "rgba(0,0,0,0.4)", border: "none", borderRadius: 20, padding: "8px 16px", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" width="16" height="16"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              <span style={{ color: "white", fontSize: 13, fontFamily: "DM Sans, sans-serif" }}>Caption</span>
            </button>
            <div style={{ width: 40 }} />
          </div>

          {/* Send button */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 20, padding: "0 20px 60px" }}>
            <button onClick={handleSend} style={{
              width: "100%", background: "var(--red)", border: "none",
              borderRadius: 16, padding: "16px", display: "flex",
              alignItems: "center", justifyContent: "center", gap: 10,
              cursor: "pointer", fontFamily: "DM Sans, sans-serif"
            }}>
              <span style={{ color: "white", fontSize: 16, fontWeight: 700 }}>Send to {community.emoji} {community.name}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="20" height="20"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
}