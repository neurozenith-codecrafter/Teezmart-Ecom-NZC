import React, { useState, useEffect, useMemo } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  LogOut,
  Bell,
  Menu,
  Home,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdmin } from "../../context/useAdmin";
import { useAuth } from "../../Hooks/useAuth";
import { MobileCopyright } from "../HomepageComponents/FooterSection";

/**
 * Premium Mint/White Palette
 */
const navClass = (isActive) =>
  `group relative w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 ${
    isActive
      ? "bg-[#EBF5EE] text-[#2D4F3C] font-semibold shadow-sm"
      : "text-slate-400 hover:text-[#2D4F3C] hover:bg-[#F8FBFA]"
  }`;

export const AdminLayout = () => {
  const { admin } = useAdmin();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- Avatar Logic (STRICT BACKEND ONLY) ---
  const [hasImgError, setHasImgError] = useState(false);

  useEffect(() => {
    setHasImgError(false);
  }, [admin]);

  // ✅ Only backend avatar is allowed (NO Google photoURL)
  const externalImage = useMemo(() => {
    if (!admin?.avatar) return null;

    // Basic validation for URL
    try {
      const url = new URL(admin.avatar);
      return url.href;
    } catch {
      return null;
    }
  }, [admin]);

  const userInitial = admin?.name?.trim()?.charAt(0)?.toUpperCase() || "A";

  const shouldShowAvatar = Boolean(externalImage) && !hasImgError;

  const formatRoleText = (role) => {
    if (!role) return "";
    return role
      .replace(/([A-Z])/g, "$1")
      .trim()
      .toUpperCase();
  };

  const menuItems = [
    {
      to: "dashboard",
      label: "Overview",
      icon: LayoutDashboard,
      roles: ["devAdmin", "admin"],
    },
    {
      to: "products",
      label: "Inventory",
      icon: Package,
      roles: ["devAdmin", "admin"],
    },
    {
      to: "orders",
      label: "Shipments",
      icon: ShoppingBag,
      roles: ["devAdmin", "admin"],
    },
    { to: "users", label: "Admins", icon: Users, roles: ["devAdmin"] },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!admin) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#86C19F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex font-sans text-slate-900 overflow-hidden">
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-slate-900/10 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-4 left-4 z-[70] w-72 bg-white rounded-[2rem] border border-slate-100 p-8 flex flex-col transition-all duration-500 ease-out
          ${
            isMobileMenuOpen
              ? "translate-x-0 shadow-2xl"
              : "-translate-x-[110%] lg:translate-x-0"
          }
        `}
      >
        <div className="mb-12 px-2">
          <span className="font-bold text-xl tracking-tight text-[#1A3024]">
            TeezMart
          </span>
          <div className="h-0.5 w-6 bg-[#86C19F] mt-1.5 rounded-full" />
        </div>

        <div className="flex-1 overflow-y-auto space-y-8 no-scrollbar">
          <nav className="space-y-1.5">
            {/* Home Button with Home Icon and extra margin for spacing */}
            <NavLink
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => `${navClass(isActive)} mb-6`}
            >
              <Home size={18} strokeWidth={2.2} />
              <span className="text-[13px] tracking-tight">Home</span>
            </NavLink>

            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-4 px-2">
              Management
            </p>

            {menuItems.map((item) => {
              if (!item.roles.includes(admin?.role)) return null;
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => navClass(isActive)}
                >
                  <Icon size={18} strokeWidth={2.2} />
                  <span className="text-[13px] tracking-tight">
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-5 py-3 text-slate-400 hover:text-rose-500 transition-colors text-sm font-semibold w-full rounded-2xl"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:ml-[20rem] min-w-0 flex flex-col">
        <header className="h-24 px-8 lg:px-12 flex items-center justify-between">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2.5 bg-slate-50 rounded-xl lg:hidden text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-6 ml-auto">
            <button className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-xl transition-all relative group">
              <Bell
                size={20}
                className="group-hover:rotate-12 transition-transform"
              />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#86C19F] rounded-full border-2 border-white" />
            </button>

            {/* PROFILE UI */}
            <div className="flex items-center justify-end gap-3.5 bg-white py-1 pl-6 pr-1 rounded-full border border-slate-100/70 shadow-[0_2px_15px_-4px_rgba(238,242,246,0.6)]">
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {admin?.name || "User"}
                </span>
                <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                  {formatRoleText(admin?.role)}
                </span>
              </div>

              <div className="relative flex items-center justify-center w-11 h-11 bg-white rounded-full border border-slate-50 shadow-inner">
                {shouldShowAvatar ? (
                  <img
                    src={externalImage}
                    alt={admin?.name}
                    referrerPolicy="no-referrer"
                    onError={() => setHasImgError(true)}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-zinc-900 text-white text-[11px] font-bold flex items-center justify-center">
                    {userInitial}
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full shadow-sm" />
              </div>
            </div>
          </div>
        </header>

        <main className="px-8 pb-8 lg:px-12 flex-1 overflow-y-auto no-scrollbar">
          <Outlet />
        </main>

        <div className="mt-auto px-8 lg:px-12 py-4">
          <MobileCopyright />
        </div>
      </div>
    </div>
  );
};
