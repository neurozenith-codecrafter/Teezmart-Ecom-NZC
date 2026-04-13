import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  Search,
  Bell,
  ShoppingCart,
  User,
  ChevronDown,
  X,
  LayoutGrid,
  ShoppingBag,
  Percent,
  Package,
  Database,
  MessageSquare,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PAGE_CONTAINER_CLASS } from "../constants/pageLayout";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBottomNav, setShowBottomNav] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setShowBottomNav(false);
      } else {
        setShowBottomNav(true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", controlNavbar, { passive: true });
    return () => window.removeEventListener("scroll", controlNavbar);
  }, []);

  // Snappier, richer sidebar animation
  const sidebarVariants = {
    closed: {
      x: "-100%",
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
    },
    open: { x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  const menuItems = [
    { name: "Live Orders", icon: LayoutGrid },
    { name: "Order History", icon: ShoppingBag, active: true },
    { name: "Offers", icon: Percent },
    { name: "Products", icon: Package },
    { name: "Stock", icon: Database },
    { name: "Message", icon: MessageSquare },
    { name: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* 1. TOP NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-[60] bg-white/95 backdrop-blur-md border-b border-[#f5f5f5]">
        <div
          className={`${PAGE_CONTAINER_CLASS} h-[55px] md:h-[68px] flex items-center justify-between relative`}
        >
          <div className="flex-1 flex justify-start">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 -ml-2 cursor-pointer hover:bg-zinc-50 rounded-full transition-all"
            >
              {/* REMOVED ROTATION - Clean and straight */}
              <Menu className="w-[22px] h-[22px] md:w-[24px] md:h-[24px] text-black stroke-[1.5]" />
            </button>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 text-[19px] md:text-[23px] font-bold tracking-tight text-black whitespace-nowrap">
            TeezMart
          </div>

          <div className="flex-1 flex items-center justify-end space-x-4 md:space-x-8">
            <div className="hidden lg:flex items-center space-x-7 text-[12px] font-semibold text-black uppercase tracking-wider">
              <a href="#" className="hover:opacity-50 transition">
                Blogs
              </a>
              <a href="#" className="hover:opacity-50 transition">
                FAQs
              </a>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
<<<<<<< HEAD
              <Bell className="w-[21px] h-[21px] text-black stroke-[1.5] cursor-pointer" />
              <ShoppingCart className="w-[21px] h-[21px] text-black stroke-[1.5] cursor-pointer" />
              <User className="w-[21px] h-[21px] text-black stroke-[1.5] cursor-pointer" />
=======
              <Bell className="w-[21px] h-[21px] text-black stroke-[1.2] cursor-pointer" />
              <Link to={"/cart"}>
                <ShoppingCart className="w-[21px] h-[21px] text-black stroke-[1.2] cursor-pointer" />
              </Link>
              <User className="w-[21px] h-[21px] text-black stroke-[1.2] cursor-pointer" />
>>>>>>> d45ced7d4e6a39468bf83d27fb3238a1249e11cd
            </div>
          </div>
        </div>
      </nav>

      {/* 2. BOTTOM NAVBAR (LG Only) */}
      <div
        className={`hidden lg:block fixed left-0 w-full bg-white z-[55] transition-all duration-500 ease-in-out border-b border-[#f9f9f9]/50
        ${showBottomNav ? "top-[68px] opacity-100 translate-y-0" : "top-[10px] opacity-0 -translate-y-full pointer-events-none"}`}
      >
        <div
          className={`${PAGE_CONTAINER_CLASS} flex items-center justify-between h-[58px] gap-x-6`}
        >
          <div className="flex items-center gap-x-3 shrink-0">
            <button className="flex items-center justify-between min-w-[145px] bg-[#f9f9f9] border border-[#f0f0f0] px-5 py-2.5 rounded-xl hover:bg-white transition-all cursor-pointer group">
              <span className="text-[14px] font-normal text-black">
                Clothing
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400 ml-4 group-hover:translate-y-0.5 transition-transform" />
            </button>
            <div className="flex items-center gap-x-2">
              <button className="px-6 py-2.5 border border-[#f0f0f0] rounded-full text-[14px] font-normal text-black hover:bg-gray-50 transition-all">
                New Arrivals
              </button>
              <button className="px-6 py-2.5 border border-[#f0f0f0] rounded-full text-[14px] font-normal text-black hover:bg-gray-50 transition-all">
                Sale
              </button>
            </div>
          </div>
          <div className="relative w-full max-w-[400px]">
            <input
              type="text"
              placeholder="Search collection..."
              className="w-full bg-[#f9f9f9] border border-[#f0f0f0] py-2.5 pl-6 pr-12 rounded-full text-[14px] font-normal outline-none focus:bg-white transition-all shadow-sm"
            />
            <Search className="w-4 h-4 absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-zinc-900/20 backdrop-blur-[2px] z-[100]"
            />

            <motion.div
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 left-0 h-full w-[280px] bg-white z-[101] shadow-[20px_0_60px_-15px_rgba(0,0,0,0.05)] flex flex-col"
            >
              <div className="p-8 pb-4 flex justify-between items-center">
                <span className="text-[18px] font-black tracking-tighter uppercase text-zinc-900">
                  TeezMart
                </span>
                <X
                  size={20}
                  className="cursor-pointer text-zinc-400 hover:text-black transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                />
              </div>

              {/* LIST EXTRACTION: Extracted directly from reference img */}
              <div className="flex-1 px-4 py-6 space-y-1">
                {menuItems.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all cursor-pointer group
                      ${
                        item.active
                          ? "bg-rose-50 text-rose-500 font-semibold"
                          : "text-zinc-500 hover:bg-zinc-50"
                      }`}
                  >
                    <item.icon
                      className={`w-5 h-5 ${item.active ? "text-rose-500" : "text-zinc-400 group-hover:text-zinc-900"}`}
                      strokeWidth={1.5}
                    />
                    <span className="text-[15px]">{item.name}</span>
                  </motion.div>
                ))}
              </div>

              <div className="p-8 border-t border-zinc-100">
                <div className="flex items-center gap-3 text-zinc-400 text-[12px] font-bold tracking-[0.2em] uppercase">
                  © NeuroZenith 2026
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
