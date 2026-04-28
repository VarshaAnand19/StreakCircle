export default function BottomNav({ activePage, setActivePage }) {
  const navItems = [
    {
      id: "feed", label: "Feed",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    },
    {
      id: "communities", label: "Communities",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    },
    {
      id: "explore", label: "Explore",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    },
    {
      id: "profile", label: "Profile",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    },
  ];

  return (
    <nav style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "var(--bg2)", borderTop: "1px solid var(--border)",
      display: "flex", justifyContent: "space-around",
      padding: "10px 0 14px", zIndex: 100
    }}>
      {navItems.map(item => (
        <button key={item.id} onClick={() => setActivePage(item.id)} style={{
          background: "none", border: "none",
          color: activePage === item.id ? "var(--accent)" : "var(--muted)",
          fontFamily: "DM Sans, sans-serif", fontSize: "10px",
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: "4px", cursor: "pointer", padding: "4px 12px", transition: "color 0.2s"
        }}>
          {item.icon}
          {item.label}
        </button>
      ))}
    </nav>
  );
}