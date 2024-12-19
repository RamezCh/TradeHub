import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import NotificationDropdown from "../NotificationDropdown";
import { LogOut, ChartCandlestick, Settings, User } from "lucide-react";

const LoggedInNavbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
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

          <div className="flex items-center gap-2">
            {/* Profile */}
            {authUser && (
              <Link to="/profile" className="btn btn-sm gap-2">
                <User className="size-5" />
              </Link>
            )}

            {/* Notifications */}
            {authUser && <NotificationDropdown isAuthenticated={authUser} />}

            {/* Settings */}
            <Link to="/settings" className="btn btn-sm gap-2 transition-colors">
              <Settings className="w-4 h-4" />
            </Link>

            {/* Logout */}
            {authUser && (
              <button className="flex gap-2 items-center" onClick={logout}>
                <LogOut className="size-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default LoggedInNavbar;
