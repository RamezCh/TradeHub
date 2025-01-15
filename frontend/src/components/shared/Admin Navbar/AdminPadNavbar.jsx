import { LogOut, Users, CandlestickChart } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";

const AdminPadNavbar = () => {
  const { logout } = useAuthStore();

  return (
    <nav className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <CandlestickChart className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">TradeHub</h1>
            </Link>
          </div>

          {/* Navbar Links */}
          <div className="space-x-4 flex items-center">
            <Link to="/admin/users" className="btn btn-ghost text-xl">
              <Users className="w-4 h-4" />
              <span>Users</span>
            </Link>
            <Link
              to="/admin/pending-listings"
              className="btn btn-ghost text-xl"
            >
              <span>Pending Listings</span>
            </Link>
            <Link to="/admin/logs" className="btn btn-ghost text-xl">
              <span>Logs</span>
            </Link>
            <Link to="/settings" className="btn btn-ghost text-xl">
              Theme
            </Link>
            <button
              className="btn btn-neutral text-xl flex items-center gap-2"
              onClick={logout}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminPadNavbar;
