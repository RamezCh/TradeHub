import Navbar from "./components/shared/Navbar";
import LoggedInNavbar from "./components/shared/LoggedInNavbar";
import Footer from "./components/shared/Footer";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ErrorPage from "./pages/ErrorPage";
import ProfilePage from "./pages/ProfilePage";
import PublicProfile from "./pages/PublicProfile.jsx";
import SettingsPage from "./pages/SettingsPage";
import ListingPage from "./pages/ListingPage";
import InboxPage from "./pages/InboxPage";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore.js";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log("authUser:", authUser);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      {authUser == null ? <Navbar /> : <LoggedInNavbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route path="/profile/:username" element={<PublicProfile />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/listing/:listingId" element={<ListingPage />} />
        <Route
          path="/inbox"
          element={authUser ? <InboxPage /> : <HomePage />}
        />
        <Route
          path="/inbox/:username"
          element={authUser ? <InboxPage /> : <HomePage />}
        />
        <Route path="/*" element={<ErrorPage />} />
      </Routes>
      <Footer />

      <Toaster />
    </div>
  );
};

export default App;
