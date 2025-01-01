import Navbar from "./components/shared/Navbar/Navbar.jsx";
import LoggedInNavbar from "./components/shared/Logged In Navbar/LoggedInNavbar";
import LoggedInMobileNavbar from "./components/shared/Logged In Navbar/LoggedInMobileNavbar.jsx";
import LoggedInPadNavbar from "./components/shared/Logged In Navbar/LoggedInPadNavbar.jsx";
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
import AddListing from "./pages/AddListing";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore.js";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import SearchResultsPage from "./pages/SearchResultsPage.jsx";
import MobileNavbar from "./components/shared/Navbar/MobileNavbar.jsx";
import PadNavbar from "./components/shared/Navbar/PadNavbar.jsx";
import RegisterSellerPage from "./pages/RegisterSellerPage.jsx";
import VerifyEmailPage from "./pages/VerifyEmailPage.jsx";

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
    <div data-theme={theme} className="flex flex-col min-h-screen">
      {authUser == null ? (
        <>
          <div className="hidden lg:block">
            <Navbar />
          </div>
          <div className="hidden md:block lg:hidden">
            <PadNavbar />
          </div>
          <div className="block md:hidden">
            <MobileNavbar />
          </div>
        </>
      ) : (
        <>
          <div className="hidden lg:block">
            <LoggedInNavbar />
          </div>
          <div className="hidden md:block lg:hidden">
            <LoggedInPadNavbar />
          </div>
          <div className="block md:hidden">
            <LoggedInMobileNavbar />
          </div>
        </>
      )}
      <div className="h-16 mb-2 bg-black bg-opacity-55"></div>
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route path="/register-seller" element={<RegisterSellerPage />} />
          <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
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
          <Route path="/listing/add" element={<AddListing />} />
          <Route path="/listing/:listingId" element={<ListingPage />} />
          <Route path="/listings/search" element={<SearchResultsPage />} />
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
      </div>
      <Footer />

      <Toaster />
    </div>
  );
};

export default App;
