import { Link } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";
import NotificationDropdown from "../../NotificationDropdown";
import SearchBar from "../SearchBar";
import { useState } from "react";
import { LogOut, MessageSquare, X, Menu, ChartCandlestick } from "lucide-react";

const LoggedInPadNavbar = () => {
  const { logout, authUser } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 hover:opacity-80 transition-all"
        >
          <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <ChartCandlestick className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-lg font-bold">TradeHub</h1>
        </Link>

        {/* Search Bar */}
        <div className="w-3/6">
          <SearchBar />
        </div>

        {/* Menu Button for Mobile */}
        <button
          onClick={toggleMenu}
          className="btn btn-ghost btn-circle lg:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X /> : <Menu className="w-6 h-6" />}
        </button>

        {menuOpen && (
          <div className="absolute top-16 left-0 w-full bg-base-100 shadow-lg border-t border-base-300 lg:hidden">
            <nav className="flex flex-col gap-4 p-4">
              {authUser && authUser.sellerStatus && (
                <Link
                  to="/listing/add"
                  className="btn btn-primary w-full text-left text-sm"
                  onClick={toggleMenu}
                >
                  Add Listing
                </Link>
              )}
              {authUser && !authUser.sellerStatus && (
                <Link
                  to="/register-seller"
                  className="btn btn-ghost w-full text-left text-sm"
                  onClick={toggleMenu}
                >
                  Become a Seller
                </Link>
              )}
              {authUser && authUser.sellerStatus && (
                <Link
                  to="/listings/mine"
                  className="btn btn-ghost w-full text-left text-sm"
                  onClick={toggleMenu}
                >
                  My Listings
                </Link>
              )}
              <Link
                to="/settings"
                className="btn btn-ghost w-full text-left text-sm"
                onClick={toggleMenu}
              >
                Theme
              </Link>
              {authUser && (
                <Link
                  to="/profile"
                  className="btn btn-ghost w-full text-left text-sm"
                  onClick={toggleMenu}
                >
                  Profile
                </Link>
              )}
              <div className="flex items-center justify-around py-2">
                {authUser && (
                  <NotificationDropdown isAuthenticated={authUser} />
                )}
                <Link
                  to="/inbox"
                  className="btn btn-ghost w-auto"
                  onClick={toggleMenu}
                >
                  <MessageSquare className="w-5 h-5" />
                </Link>
                {authUser && (
                  <button
                    className="btn btn-ghost w-auto"
                    onClick={() => {
                      logout();
                      toggleMenu();
                    }}
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default LoggedInPadNavbar;
