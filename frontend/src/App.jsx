import { useState } from "react";
import { AppProvider } from "./context/AppContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Feed from "./pages/Feed";
import Communities from "./pages/Communities";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfileSetup from "./pages/ProfileSetup";
import BottomNav from "./components/BottomNav";
import CommunityScreen from "./components/CommunityScreen";
import "./index.css";
import axios from "axios";
axios.defaults.withCredentials = true;

function Main() {
  const { user, loading } = useAuth();
  const [activePage, setActivePage] = useState("feed");
  const [openCommunity, setOpenCommunity] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: "Playfair Display, serif", fontSize: 28, fontWeight: 900 }}>
        Streak<span style={{ color: "var(--accent)" }}>Circle</span>
      </div>
    </div>
  );

  if (!user) return showSignup
    ? <SignupPage onSwitch={() => setShowSignup(false)} />
    : <LoginPage onSwitch={() => setShowSignup(true)} />;

  // Show profile setup if not done yet
  if (!user.profileSetupDone) return <ProfileSetup />;

  const pages = {
    feed: <Feed onOpenCommunity={setOpenCommunity} />,
    communities: <Communities onOpenCommunity={setOpenCommunity} />,
    explore: <Explore onOpenCommunity={setOpenCommunity} />,
    profile: <Profile onOpenCommunity={setOpenCommunity} />,
  };

  return (
    <AppProvider>
      <div style={{ minHeight: "100vh", paddingBottom: openCommunity ? 0 : "80px" }}>
        {openCommunity ? (
          <CommunityScreen community={openCommunity} onBack={() => setOpenCommunity(null)} />
        ) : (
          <>
            {pages[activePage]}
            <BottomNav activePage={activePage} setActivePage={setActivePage} />
          </>
        )}
      </div>
    </AppProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}