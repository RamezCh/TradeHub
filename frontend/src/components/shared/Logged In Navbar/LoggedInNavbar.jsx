import { Link } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";
import NotificationDropdown from "../../NotificationDropdown";
import { LogOut, ChartCandlestick, User } from "lucide-react";
import SearchBar from "../SearchBar";
import { useState } from "react";

const LoggedInNavbar = () => {
  const { logout, authUser } = useAuthStore();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const closeDropdown = () => {
    setDropdownVisible(false);
  };

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex items-center gap-6">
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
          <div className="flex items-center gap-6">
            {/* Grouped Buttons: Add Listing and Become Seller */}
            <div className="flex items-center gap-4">
              {authUser && authUser.sellerStatus && (
                <Link
                  to="/listing/add"
                  className="btn btn-primary text-xl flex items-center gap-2"
                >
                  Add Listing
                </Link>
              )}
              {authUser && !authUser.sellerStatus && (
                <Link to="/register-seller" className="btn btn-ghost text-xl">
                  Become a Seller
                </Link>
              )}
            </div>

            {/* Profile - User Icon with Dropdown */}
            {authUser && (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center justify-center p-2"
                >
                  <User className="w-6 h-6 cursor-pointer" />
                </button>

                {dropdownVisible && (
                  <div className="absolute bg-white shadow-lg rounded-lg right-0 top-8 p-2 w-48">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 p-2 text-xl text-gray-800 hover:bg-gray-100 rounded-md"
                      onClick={closeDropdown}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/inbox"
                      className="flex items-center gap-2 p-2 text-xl text-gray-800 hover:bg-gray-100 rounded-md"
                      onClick={closeDropdown}
                    >
                      Inbox
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 p-2 text-xl text-gray-800 hover:bg-gray-100 rounded-md"
                      onClick={closeDropdown}
                    >
                      Theme
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Notifications */}
            {authUser && <NotificationDropdown isAuthenticated={authUser} />}

            {/* Logout - Outside Dropdown */}
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
