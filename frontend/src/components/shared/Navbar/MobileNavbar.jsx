import { Link } from "react-router-dom";
import { ChartCandlestick, Menu, X } from "lucide-react";
import SearchBar from "../SearchBar";
import { useState } from "react";

const MobileNavbar = () => {
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
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <ChartCandlestick className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-lg font-bold">TradeHub</h1>
        </Link>

        {/* Menu Button */}
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
              <SearchBar />
              <Link
                to="/settings"
                className="btn btn-ghost w-full text-left text-sm"
                onClick={toggleMenu}
              >
                Theme
              </Link>
              <Link
                to="/register-seller"
                className="btn btn-ghost w-full text-left text-sm"
                onClick={toggleMenu}
              >
                Become a Seller
              </Link>
              <Link
                to="/login"
                className="btn btn-ghost w-full text-left text-sm"
                onClick={toggleMenu}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="btn btn-primary w-full text-left text-sm"
                onClick={toggleMenu}
              >
                Join
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default MobileNavbar;
