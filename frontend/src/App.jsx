{
  /* Core */
}
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore.js";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
{
  /* Navbars & Footer */
}
import Navbar from "./components/shared/Navbar/Navbar.jsx";
import MobileNavbar from "./components/shared/Navbar/MobileNavbar.jsx";
import PadNavbar from "./components/shared/Navbar/PadNavbar.jsx";
import LoggedInNavbar from "./components/shared/Logged In Navbar/LoggedInNavbar";
import LoggedInMobileNavbar from "./components/shared/Logged In Navbar/LoggedInMobileNavbar.jsx";
import LoggedInPadNavbar from "./components/shared/Logged In Navbar/LoggedInPadNavbar.jsx";
import AdminNavbar from "./components/shared/Admin Navbar/AdminNavbar.jsx";
import Footer from "./components/shared/Footer";
{
  /* Pages */
}
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import ErrorPage from "./pages/ErrorPage";
import ProfilePage from "./pages/ProfilePage";
import PublicProfile from "./pages/PublicProfile.jsx";
import SettingsPage from "./pages/SettingsPage";
import ListingPage from "./pages/ListingPage";
import InboxPage from "./pages/InboxPage";
import AddListingPage from "./pages/AddListingPage";
import EditListingPage from "./pages/EditListingPage.jsx";
import RegisterSellerPage from "./pages/RegisterSellerPage.jsx";
import VerifyEmailPage from "./pages/VerifyEmailPage.jsx";
import MyListingsPage from "./pages/MyListingsPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
{
  /* Admin Pages */
}
import AdminHomePage from "./pages/Admin/AdminHomePage.jsx";
import AdminLogsPage from "./pages/Admin/AdminLogsPage.jsx";
import AdminPendingListingsPage from "./pages/Admin/AdminPendingListingsPage.jsx";
import AdminListingPage from "./pages/Admin/AdminListingPage.jsx";
import AdminUsersPage from "./pages/Admin/AdminUsersPage.jsx";
import AdminUserProfile from "./pages/Admin/AdminUserProfile.jsx";

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
      ) : !authUser?.isAdmin ? (
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
      ) : (
        <>
          <div className="hidden lg:block">
            <AdminNavbar />
          </div>
        </>
      )}
      <div className="h-16 mb-2 bg-black bg-opacity-55"></div>
      <div className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={
              !authUser ? (
                <HomePage />
              ) : authUser.isAdmin ? (
                <AdminHomePage />
              ) : (
                <SearchPage />
              )
            }
          />
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
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />
          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
          <Route path="/profile/:username" element={<PublicProfile />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/listing/add" element={<AddListingPage />} />
          <Route
            path="/listing/edit/:listingId"
            element={<EditListingPage />}
          />
          <Route path="/listings/mine" element={<MyListingsPage />} />
          <Route path="/listing/:listingId" element={<ListingPage />} />
          <Route path="/listings/search" element={<SearchPage />} />
          <Route
            path="/inbox"
            element={authUser ? <InboxPage /> : <HomePage />}
          />
          <Route
            path="/inbox/:username"
            element={authUser ? <InboxPage /> : <HomePage />}
          />
          {/* Admin Routes */}
          <Route
            path="/admin/users"
            element={
              authUser?.isAdmin ? <AdminUsersPage /> : <Navigate to="/" />
            }
          />
          <Route
            path="/admin/user/:username"
            element={
              authUser?.isAdmin ? <AdminUserProfile /> : <Navigate to="/" />
            }
          />
          <Route
            path="/admin/logs"
            element={
              authUser?.isAdmin ? <AdminLogsPage /> : <Navigate to="/" />
            }
          />
          <Route
            path="/admin/pending-listings"
            element={
              authUser?.isAdmin ? (
                <AdminPendingListingsPage />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/admin/listing/:listingId"
            element={<AdminListingPage />}
          />
          {/* Error Route */}
          <Route path="/*" element={<ErrorPage />} />
        </Routes>
      </div>
      <Footer />

      <Toaster />
    </div>
  );
};

export default App;
