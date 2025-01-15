import { LogOut, Users, CandlestickChart, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";
import { useState } from "react";

const AdminMobileNavbar = () => {
  const { logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 hover:opacity-80 transition-all"
          onClick={closeMenu}
        >
          <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <CandlestickChart className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-lg font-bold">TradeHub</h1>
        </Link>

        {/* Menu Button for Mobile */}
        <button
          onClick={toggleMenu}
          className="btn btn-ghost btn-circle lg:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-16 left-0 w-full bg-base-100 shadow-lg border-t border-base-300 lg:hidden">
            <nav className="flex flex-col gap-4 p-4">
              <Link
                to="/admin/users"
                className="btn btn-ghost w-full text-left text-sm"
                onClick={closeMenu}
              >
                <Users className="w-4 h-4" />
                <span>Users</span>
              </Link>
              <Link
                to="/admin/pending-listings"
                className="btn btn-ghost w-full text-left text-sm"
                onClick={closeMenu}
              >
                <span>Pending Listings</span>
              </Link>
              <Link
                to="/admin/logs"
                className="btn btn-ghost w-full text-left text-sm"
                onClick={closeMenu}
              >
                <span>Logs</span>
              </Link>
              <Link
                to="/settings"
                className="btn btn-ghost w-full text-left text-sm"
                onClick={closeMenu}
              >
                Theme
              </Link>
              <button
                className="btn btn-neutral w-full text-left text-sm flex items-center gap-2"
                onClick={() => {
                  logout();
                  closeMenu();
                }}
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminMobileNavbar;
