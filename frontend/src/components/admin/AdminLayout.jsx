import React, { useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  LogOut,
  Search,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdmin } from "../../context/useAdmin";

const navClass = ({ isActive }) =>
  `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
    isActive
      ? "bg-zinc-900 text-white shadow-lg shadow-zinc-200"
      : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
  }`;

export const AdminLayout = () => {
  const { admin } = useAdmin();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    { to: "users", label: "Users", icon: Users, roles: ["DEV_ADMIN"] },
  ];

  const closeMobile = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-[#FBFBFB] flex">
      {isMobileMenuOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-zinc-900/40 backdrop-blur-sm lg:hidden"
          onClick={closeMobile}
        />
      )}

      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-zinc-100 p-6 transition-transform duration-300
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex items-center justify-between gap-3 mb-10 px-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 shrink-0 bg-black rounded-lg flex items-center justify-center text-white font-black italic">
              T
            </div>
            <span className="font-bold text-xl tracking-tighter truncate">
              TEEZMART{" "}
              <span className="text-[10px] bg-zinc-100 px-2 py-0.5 rounded-full">ADMIN</span>
            </span>
          </div>
          <button
            type="button"
            className="lg:hidden p-2 text-zinc-500 hover:bg-zinc-100 rounded-lg"
            onClick={closeMobile}
            aria-label="Close sidebar"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            if (!item.roles.includes(admin.role)) return null;
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "dashboard"}
                onClick={closeMobile}
                className={navClass}
              >
                {({ isActive }) => (
                  <>
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="text-sm font-semibold uppercase tracking-wider">
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="absolute bottom-10 left-6 right-6">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-bold text-sm uppercase tracking-widest"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64 min-w-0">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-zinc-100 sticky top-0 z-40 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-zinc-500 shrink-0"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center gap-3 bg-zinc-50 px-4 py-2 rounded-full w-full max-w-md border border-zinc-100">
              <Search size={18} className="text-zinc-400 shrink-0" />
              <input
                type="text"
                placeholder="Search analytics..."
                className="bg-transparent border-none text-sm focus:ring-0 w-full outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <button
              type="button"
              className="relative p-2 text-zinc-400 hover:text-black transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-zinc-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-none">{admin.name}</p>
                <p className="text-[10px] text-zinc-400 font-black uppercase mt-1 tracking-tighter">
                  {admin.role.replace("_", " ")}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(admin.name)}&background=f4f4f5&color=18181b`}
                  alt=""
                />
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 md:p-10 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
