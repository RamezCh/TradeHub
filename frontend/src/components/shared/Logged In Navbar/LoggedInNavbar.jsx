import { Link } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";
import NotificationDropdown from "../../NotificationDropdown";
import { LogOut, ChartCandlestick, MessageSquare } from "lucide-react";
import SearchBar from "../SearchBar";

const LoggedInNavbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <ChartCandlestick className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">TradeHub</h1>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="w-3/6">
            <SearchBar />
          </div>

          {/* Right Side Options */}
          <div className="flex items-center gap-2">
            {/* Add Listing */}
            <Link
              to="/listing/add"
              className="btn btn-primary text-xl flex items-center gap-2"
            >
              Add Listing
            </Link>

            {/* Settings */}
            <Link to="/settings" className="btn btn-ghost text-xl">
              Theme
            </Link>

            {/* Profile */}
            {authUser && (
              <Link to="/profile" className="btn btn-ghost text-xl">
                Profile
              </Link>
            )}

            {/* Notifications */}
            {authUser && <NotificationDropdown isAuthenticated={authUser} />}

            {/* Inbox */}
            <Link to="/inbox" className="btn btn-ghost text-xl">
              <MessageSquare />
            </Link>

            {/* Logout */}
            {authUser && (
              <button
                className="btn btn-ghost text-xl flex items-center gap-2"
                onClick={logout}
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default LoggedInNavbar;
