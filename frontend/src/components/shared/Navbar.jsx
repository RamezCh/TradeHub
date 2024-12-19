import { Link } from "react-router-dom";
import { ChartCandlestick, Settings, User, KeyRound } from "lucide-react";

const Navbar = () => {
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
            {/* Settings */}
            <Link to="/settings" className="btn btn-sm gap-2 transition-colors">
              <Settings className="w-4 h-4" />
            </Link>

            {/* Login */}
            <Link to="/login" className="btn btn-sm gap-2 transition-colors">
              <KeyRound className="w-4 h-4" />
            </Link>

            {/* Signup */}
            <Link to="/signup" className="btn btn-sm gap-2 transition-colors">
              <User className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;