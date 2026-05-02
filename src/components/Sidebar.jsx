import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Bus,
  Map,
  AlertTriangle,
  Search,
  Users,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Bus, label: "Buses", path: "/buses" },
    { icon: Map, label: "Routes", path: "/routes" },
    { icon: AlertTriangle, label: "Reports", path: "/reports" },
    { icon: Search, label: "Lost & Found", path: "/lost-found" },
    { icon: Users, label: "Users", path: "/users" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-border h-screen flex flex-col sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Bus className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary leading-tight">
              PU Bus
            </h1>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Admin Portal
            </p>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn("sidebar-item group", isActive && "active")
              }
            >
              <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="flex-1">{item.label}</span>
              <ChevronRight
                className={cn(
                  "w-4 h-4 opacity-0 -translate-x-2 transition-all duration-300",
                  "group-hover:opacity-100 group-hover:translate-x-0",
                )}
              />
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-border">
        <button
          className="sidebar-item w-full text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>

        <div className="mt-6 p-4 rounded-xl bg-secondary/50 border border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-pu-bronze/20 flex items-center justify-center text-pu-bronze font-bold text-sm">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate text-foreground">
                Admin User
              </p>
              <p className="text-xs text-muted-foreground truncate">
                admin@pu.edu.pk
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
