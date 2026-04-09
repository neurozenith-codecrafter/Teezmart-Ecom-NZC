import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  Search,
  Bell,
  ShoppingCart,
  User,
  ChevronDown,
  X,
} from "lucide-react";
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

  return (
    <>
      {/* 1. TOP NAVBAR (Permanently Fixed) */}
      <nav className="fixed top-0 left-0 w-full z-[60] bg-white/95 backdrop-blur-md border-b border-[#f5f5f5]">
        <div
          className={`${PAGE_CONTAINER_CLASS} h-[55px] md:h-[68px] flex items-center justify-between relative`}
        >
          <div className="flex-1 flex justify-start">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 -ml-2 cursor-pointer hover:bg-gray-50 rounded-full transition-colors group"
            >
              <Menu className="w-[22px] h-[22px] md:w-[24px] md:h-[24px] text-black stroke-[1.2] group-hover:scale-110 transition-transform" />
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
              <Bell className="w-[21px] h-[21px] text-black stroke-[1.2] cursor-pointer" />
              <ShoppingCart className="w-[21px] h-[21px] text-black stroke-[1.2] cursor-pointer" />
              <User className="w-[21px] h-[21px] text-black stroke-[1.2] cursor-pointer" />
            </div>
          </div>
        </div>
      </nav>

      {/* 2. BOTTOM NAVBAR (Dynamic Reveal) */}
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

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-[100] p-6 flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <div className="text-[22px] font-bold">TeezMart</div>
            <X
              className="w-8 h-8 cursor-pointer hover:rotate-90 transition-transform"
              onClick={() => setIsMenuOpen(false)}
            />
          </div>
          <div className="flex flex-col space-y-6 text-2xl font-bold">
            <a href="#" className="hover:text-gray-500 transition">
              New Arrivals
            </a>
            <a href="#" className="hover:text-gray-500 transition">
              Sale
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
