import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  TrendingUp,
  FileText,
  Settings,
  Shield,
  User,
  LogOut
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import { toast } from "sonner";

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  // 🔥 Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/analysis", label: "Analysis", icon: TrendingUp },
    { path: "/reports", label: "Reports", icon: FileText },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#0B0F1A]">

      {/* 🔹 SIDEBAR */}
      <aside className="w-64 border-r border-white/10 flex flex-col">

        {/* 🔹 LOGO */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-orange-500 to-yellow-400 shadow-lg">
              <Shield className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">PowerGuard AI</h1>
              <p className="text-xs text-gray-400">Theft Detection</p>
            </div>
          </div>
        </div>

        {/* 🔹 NAVIGATION */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-orange-500/10 text-orange-400 border-l-4 border-orange-500"
                    : "text-gray-400 hover:bg-white/5"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* 🔹 PROFILE */}
        <div className="p-4 border-t border-white/10">

          {/* Session Indicator */}
          <div className="flex items-center gap-2 mb-3 px-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-400">Session Active</span>
          </div>

          {/* User Card */}
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-orange-500 to-yellow-400">
              <User className="w-5 h-5 text-black" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-white">{user?.username || "Admin User"}</p>
              <p className="text-xs text-gray-400">{user?.email || "admin@powerguard.ai"}</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full mt-3 px-4 py-2 rounded-xl flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:scale-105 transition"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* 🔹 MAIN CONTENT */}
      <main className="flex-1 overflow-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}