import React, { useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  LogOut,
  Bell,
  Menu,
  X,
  Search,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdmin } from "../../context/useAdmin";

// Optimized NavLink styling
const navClass = (isActive) =>
  `group relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
    isActive
      ? "bg-[#5D5FEF] text-white shadow-lg shadow-[#5D5FEF]/30"
      : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
  }`;

export const AdminLayout = () => {
  const { admin } = useAdmin();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ✅ Helper to convert role to Title Case (Dev Admin)
  const formatRole = (role) => {
    return role
      ?.toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const menuItems = [
    {
      to: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      roles: ["DEV_ADMIN", "PRODUCT_ADMIN"],
    },
    {
      to: "products",
      label: "Products",
      icon: Package,
      roles: ["DEV_ADMIN", "PRODUCT_ADMIN"],
    },
    {
      to: "orders",
      label: "Orders",
      icon: ShoppingBag,
      roles: ["DEV_ADMIN", "PRODUCT_ADMIN"],
    },
    { to: "users", label: "Consumer", icon: Users, roles: ["DEV_ADMIN"] },
  ];

  const closeMobile = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-[#FBFBFB] flex font-sans text-slate-900 overflow-hidden">
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside
        className={`
        fixed inset-y-4 left-4 z-[70] w-64 bg-white rounded-[2rem] border border-slate-100 p-6 flex flex-col transition-all duration-500
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-[110%] lg:translate-x-0"}
      `}
      >
        <div className="flex items-center gap-3 mb-10 px-2 pt-2">
          <span className="font-bold text-2xl tracking-tight text-slate-800 uppercase">
            TeezMart
          </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-8 no-scrollbar">
          <div>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-4 px-2">
              MENU
            </p>
            <nav className="space-y-1">
              {menuItems.map((item) => {
                if (!item.roles.includes(admin.role)) return null;
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={closeMobile}
                    className={({ isActive }) => navClass(isActive)}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium tracking-tight">
                      {item.label}
                    </span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-50">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-500 transition-all text-sm font-bold w-full"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </aside>

      {/* --- MAIN WORKSPACE --- */}
      <div className="flex-1 lg:ml-[18rem] min-w-0 flex flex-col">
        <header className="h-24 px-8 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-4 lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-slate-600"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Right Aligned Utilities */}
          <div className="flex items-center gap-4 ml-auto">
            <button className="p-2.5 bg-white rounded-full shadow-sm text-slate-500 border border-slate-100 hover:scale-110 transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>

            {/* Profile Section */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800 leading-none">
                  {admin.name}
                </p>
                {/* ✅ Fixed: Now using formatRole helper for Title Case */}
                <p className="text-[10px] text-slate-400 mt-1 font-medium uppercase tracking-tighter">
                  {formatRole(admin.role)}
                </p>
              </div>
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(admin.name)}&background=5d5fef&color=fff&bold=true`}
                alt="Profile"
                className="w-10 h-10 rounded-full border border-slate-200"
              />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="px-8 pb-8 lg:px-12 overflow-y-auto no-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
