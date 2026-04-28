import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";

const AppContext = createContext();

const initialCommunities = [
  { emoji: "📚", name: "Reading", members: "4.2k", avg: 11, joined: false, type: "public", createdBy: "system", memberList: ["Ravi Kumar", "Priya M"], joinRequests: [] },
  { emoji: "🏃", name: "Morning Run", members: "2.8k", avg: 7, joined: false, type: "public", createdBy: "system", memberList: ["Priya M"], joinRequests: [] },
  { emoji: "🧘", name: "Meditation", members: "6.1k", avg: 14, joined: false, type: "public", createdBy: "system", memberList: ["Arjun S"], joinRequests: [] },
  { emoji: "✍️", name: "Journaling", members: "3.4k", avg: 9, joined: false, type: "public", createdBy: "system", memberList: ["Arjun S"], joinRequests: [] },
  { emoji: "🎸", name: "Guitar", members: "1.9k", avg: 6, joined: false, type: "public", createdBy: "system", memberList: ["Ravi Kumar"], joinRequests: [] },
  { emoji: "🍳", name: "Cooking", members: "5.5k", avg: 8, joined: false, type: "private", createdBy: "Chef Roy", memberList: ["Chef Roy"], joinRequests: [] },
  { emoji: "💻", name: "Coding", members: "9.8k", avg: 18, joined: false, type: "public", createdBy: "system", memberList: ["Dev Team"], joinRequests: [] },
  { emoji: "🎨", name: "Art", members: "2.3k", avg: 9, joined: false, type: "private", createdBy: "Art Admin", memberList: ["Art Admin"], joinRequests: [] },
];

export function AppProvider({ children }) {
  const { user } = useAuth();
  const currentUser = user?.name || "";

  const [communities, setCommunities] = useState(initialCommunities);
  const [posts, setPosts] = useState({
    Reading: [{ id: 1, initials: "RK", color: "#8B0000", user: "Ravi Kumar", time: "2m ago", body: 'Just finished "Atomic Habits" — the 2-minute rule actually works! 📖', likes: 48, comments: 12 }],
    "Morning Run": [{ id: 2, initials: "PM", color: "#5a0d2a", user: "Priya M", time: "18m ago", body: "5km done before 6am! Day 8 and feeling unstoppable 💪", likes: 93, comments: 7 }],
    Meditation: [],
    Journaling: [{ id: 3, initials: "AS", color: "#1a3a6b", user: "Arjun S", time: "1h ago", body: "31 days of daily journaling. Sharing my prompts sheet 📝", likes: 127, comments: 34 }],
  });

  const [streaks, setStreaks] = useState({});

  const toggleJoin = (name) => {
    setCommunities(prev => prev.map(c => {
      if (c.name !== name) return c;
      const isJoining = !c.joined;
      const newList = isJoining
        ? [...c.memberList, currentUser]
        : c.memberList.filter(m => m !== currentUser);
      const newAdmin = !isJoining && c.createdBy === currentUser
        ? (newList[0] || "system")
        : c.createdBy;
      return { ...c, joined: isJoining, memberList: newList, createdBy: newAdmin };
    }));
    setStreaks(prev => {
      if (!prev[name]) return { ...prev, [name]: { count: 0, lastPosted: null } };
      return prev;
    });
  };

  const leaveCommunity = (name) => {
    setCommunities(prev => prev.map(c => {
      if (c.name !== name) return c;
      const newList = c.memberList.filter(m => m !== currentUser);
      const newAdmin = c.createdBy === currentUser ? (newList[0] || "system") : c.createdBy;
      return { ...c, joined: false, memberList: newList, createdBy: newAdmin };
    }));
  };

  const requestJoin = (name) => {
    setCommunities(prev => prev.map(c =>
      c.name === name
        ? { ...c, joinRequests: [...(c.joinRequests || []), currentUser] }
        : c
    ));
  };

  const acceptRequest = (communityName, userName) => {
    setCommunities(prev => prev.map(c =>
      c.name === communityName
        ? {
            ...c,
            memberList: [...c.memberList, userName],
            joinRequests: c.joinRequests.filter(r => r !== userName),
            joined: userName === currentUser ? true : c.joined,
          }
        : c
    ));
  };

  const declineRequest = (communityName, userName) => {
    setCommunities(prev => prev.map(c =>
      c.name === communityName
        ? { ...c, joinRequests: c.joinRequests.filter(r => r !== userName) }
        : c
    ));
  };

  const createCommunity = ({ name, emoji, type, description }) => {
    const newComm = {
      emoji, name, members: "1", avg: 0,
      joined: true, type,
      description: description || "",
      createdBy: currentUser,
      memberList: [currentUser],
      joinRequests: [],
      inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
    };
    setCommunities(prev => [newComm, ...prev]);
    setPosts(prev => ({ ...prev, [name]: [] }));
    setStreaks(prev => ({ ...prev, [name]: { count: 0, lastPosted: null } }));
  };

  const joinByCode = (code) => {
    const comm = communities.find(c => c.inviteCode === code);
    if (!comm) return { success: false, message: "Invalid invite code." };
    if (comm.memberList.includes(currentUser)) return { success: false, message: "You're already a member!" };
    setCommunities(prev => prev.map(c =>
      c.inviteCode === code
        ? { ...c, joined: true, memberList: [...c.memberList, currentUser] }
        : c
    ));
    setStreaks(prev => ({ ...prev, [comm.name]: { count: 0, lastPosted: null } }));
    return { success: true, community: comm };
  };

  const addPost = (communityName, body, media = null, mediaType = null) => {
    const now = Date.now();
    const initials = currentUser.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    const newPost = {
      id: now, initials, color: "#8B0000",
      user: currentUser, time: "just now",
      body, media, mediaType, likes: 0, comments: 0,
    };
    setPosts(prev => ({ ...prev, [communityName]: [newPost, ...(prev[communityName] || [])] }));
    setStreaks(prev => {
      const existing = prev[communityName] || { count: 0, lastPosted: null };
      const hoursSince = existing.lastPosted ? (now - existing.lastPosted) / (1000 * 60 * 60) : 999;
      const newCount = hoursSince > 48 ? 1 : hoursSince >= 20 ? existing.count + 1 : existing.count;
      return { ...prev, [communityName]: { count: newCount, lastPosted: now } };
    });
  };

  const getStreakStatus = (communityName) => {
    const s = streaks[communityName];
    if (!s || !s.lastPosted) return { count: 0, hoursLeft: 48, broken: false };
    const hoursSince = (Date.now() - s.lastPosted) / (1000 * 60 * 60);
    const hoursLeft = Math.max(0, 48 - hoursSince);
    return { count: hoursSince > 48 ? 0 : s.count, hoursLeft: Math.round(hoursLeft), broken: hoursSince > 48 };
  };

  const isAdmin = (communityName) => {
    const c = communities.find(c => c.name === communityName);
    return c?.createdBy === currentUser;
  };

  return (
    <AppContext.Provider value={{
      communities, currentUser,
      toggleJoin, leaveCommunity, requestJoin,
      acceptRequest, declineRequest, createCommunity,
      joinByCode, isAdmin,
      posts, addPost, streaks, getStreakStatus,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);