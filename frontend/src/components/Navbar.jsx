import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";
import {
  Menu,
  Search,
  Heart,
  ShoppingCart,
  LogOut,
  ChevronDown,
  X,
  LayoutGrid,
  ShoppingBag,
  Percent,
  Package,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { PAGE_CONTAINER_CLASS } from "../constants/pageLayout";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBottomNav, setShowBottomNav] = useState(true);
  const [activeItem, setActiveItem] = useState("Order History");
  const [isMobileSidebar, setIsMobileSidebar] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);

  const { isLoggedIn, user, logout } = useAuth();

  const lastScrollY = useRef(0);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();

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

    const updateSidebarMode = () => {
      setIsMobileSidebar(window.innerWidth <= 768);
    };

    updateSidebarMode();
    window.addEventListener("scroll", controlNavbar, { passive: true });
    window.addEventListener("resize", updateSidebarMode, { passive: true });

    return () => {
      window.removeEventListener("scroll", controlNavbar);
      window.removeEventListener("resize", updateSidebarMode);
    };
  }, []);

  useEffect(() => {
    if (!isProfileMenuOpen) return undefined;

    const handleClickOutside = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isProfileMenuOpen]);

  const userInitial = user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";
  const canAccessAdmin = user?.role === "admin" || user?.role === "devAdmin";

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    setIsProfilePopupOpen(false);
    setIsMenuOpen(false);
    navigate("/", { replace: true });
  };

  const scrollToWhyUs = (e) => {
    e.preventDefault();
    const element = document.getElementById("why-us");
    if (element) {
      const offset = 100; // Account for fixed navbar height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById("why-us");
        if (el) {
          const offset = 100;
          window.scrollTo({ top: el.offsetTop - offset, behavior: "smooth" });
        }
      }, 100);
    }
  };

  const scrollToTop = (e) => {
    e.preventDefault();
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToContact = () => {
    setIsMenuOpen(false);
    setTimeout(() => {
      const element = document.getElementById("footer-contact");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        window.dispatchEvent(new CustomEvent("highlight-contact"));
      }
    }, 350);
  };

  const sidebarVariants = {
    closed: {
      x: "-100%",
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
    },
    open: { x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  const menuItems = [
    { name: "Live Orders", icon: LayoutGrid },
    { name: "Order History", icon: ShoppingBag },
    { name: "Wishlist", icon: Heart, isMobileOnly: true },
    { name: "Offers", icon: Percent },
    { name: "Products", icon: Package },
    { name: "Message", icon: MessageSquare, isContact: true },
    { name: "Report", icon: ShieldAlert, isContact: true },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[60] bg-white/95 backdrop-blur-md border-b border-[#f5f5f5]">
        <div
          className={`${PAGE_CONTAINER_CLASS} h-[55px] md:h-[68px] flex items-center justify-between relative`}
        >
          <div className="flex-1 flex justify-start">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 -ml-2 cursor-pointer hover:bg-zinc-50 rounded-full transition-all"
            >
              <Menu className="w-[22px] h-[22px] md:w-[24px] md:h-[24px] text-black stroke-[1.5]" />
            </button>
          </div>

          <Link
            to="/"
            onClick={scrollToTop}
            className="absolute left-1/2 -translate-x-1/2 text-[19px] md:text-[23px] font-bold tracking-tight text-black whitespace-nowrap"
          >
            TeezMart
          </Link>

          <div className="flex-1 flex items-center justify-end space-x-4 md:space-x-8">
            <div className="hidden lg:flex items-center space-x-7 text-[12px] font-semibold text-black uppercase tracking-wider">
              <a
                href="#why-us"
                onClick={scrollToWhyUs}
                className="hover:opacity-60 transition-opacity cursor-pointer"
              >
                Blogs
              </a>
              <a
                href="#why-us"
                onClick={scrollToWhyUs}
                className="hover:opacity-60 transition-opacity cursor-pointer"
              >
                FAQs
              </a>
            </div>

            <div className="flex items-center space-x-3 md:space-x-5">
              <div className="flex items-center space-x-3 md:space-x-5">
                {isLoggedIn ? (
                  <div className="flex items-center space-x-3 md:space-x-5">
                    {/* 1. Wishlist Icon - Hidden on Mobile */}
                    <Heart className="hidden md:block w-[19px] h-[19px] text-black stroke-[1.1] cursor-pointer hover:text-rose-500 transition-colors" />

                    {/* 2. Cart Icon */}
                    <Link to="/cart">
                      <ShoppingCart className="w-[19px] h-[19px] text-black stroke-[1.1] cursor-pointer hover:opacity-60 transition-opacity" />
                    </Link>

                    <div className="relative ml-2 md:ml-0" ref={profileMenuRef}>
                      <button
                        type="button"
                        onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                        className="flex items-center gap-2 rounded-full border border-zinc-200 px-2 py-1 hover:bg-zinc-50 transition-colors"
                      >
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user?.name || "User"}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-zinc-900 text-white text-xs font-bold flex items-center justify-center">
                            {userInitial}
                          </div>
                        )}
                        <span className="hidden md:block text-xs font-semibold text-zinc-800 max-w-[84px] truncate">
                          {user?.name || "Account"}
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                      </button>

                      {isProfileMenuOpen ? (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-zinc-100 rounded-2xl shadow-[0_16px_40px_-20px_rgba(0,0,0,0.35)] p-2 z-[120]">
                          {canAccessAdmin ? (
                            <button
                              type="button"
                              onClick={() => {
                                setIsProfileMenuOpen(false);
                                setIsProfilePopupOpen(true);
                              }}
                              className="w-full text-left text-sm px-3 py-2 rounded-xl hover:bg-zinc-50 transition-colors"
                            >
                              My Profile
                            </button>
                          ) : null}
                          {canAccessAdmin ? (
                            <button
                              type="button"
                              onClick={() => {
                                setIsProfileMenuOpen(false);
                                navigate("/admin/dashboard");
                              }}
                              className="w-full text-left text-sm px-3 py-2 rounded-xl hover:bg-zinc-50 transition-colors"
                            >
                              Admin Dashboard
                            </button>
                          ) : null}
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full text-left text-sm px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-500 transition-colors inline-flex items-center gap-2"
                          >
                            <LogOut className="w-4 h-4" />
                            Log out
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  /* ... Login Button logic remains the same ... */
                  <button
                    onClick={() => navigate("/login")}
                    className="px-5 py-2 md:px-6 md:py-2.5 bg-[#18181B] text-white text-[11px] md:text-[12px] font-medium tracking-tight rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.1)] hover:bg-black transition-all duration-200 active:scale-[0.96] cursor-pointer flex items-center justify-center"
                  >
                    Log in
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* BOTTOM NAV & SIDEBAR logic remains consistent with previous update */}
      <div
        className={`hidden lg:block fixed left-0 w-full bg-white z-[55] transition-all duration-500 ease-in-out border-b border-[#f9f9f9]/50 ${showBottomNav ? "top-[68px] opacity-100 translate-y-0" : "top-[10px] opacity-0 -translate-y-full pointer-events-none"}`}
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

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-zinc-900/20 backdrop-blur-[2px] z-[100]"
            />
            <Motion.div
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 left-0 h-full w-[280px] bg-white z-[101] shadow-[20px_0_60px_-15px_rgba(0,0,0,0.05)] flex flex-col"
            >
              <div className="p-8 pb-4 flex justify-between items-center">
                <span className="text-[20px] font-semibold tracking-tight text-zinc-900">
                  TeezMart
                </span>
                <X
                  size={20}
                  className="cursor-pointer text-zinc-400 hover:text-black transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                />
              </div>
              <div className="flex-1 px-4 py-6 space-y-1 relative">
                {menuItems.map((item) => {
                  if (item.isMobileOnly && !isMobileSidebar) return null;
                  const isActive = activeItem === item.name;
                  return (
                    <div
                      key={item.name}
                      onClick={() => {
                        setActiveItem(item.name);
                        if (item.isContact) {
                          scrollToContact();
                        } else {
                          setIsMenuOpen(false);
                        }
                      }}
                      className="relative px-4 py-3.5 rounded-2xl transition-all cursor-pointer group"
                    >
                      {isActive && (
                        <Motion.div
                          layoutId="activePill"
                          className="absolute inset-0 bg-rose-50 rounded-2xl z-0"
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      )}
                      <div className="relative z-10 flex items-center gap-4">
                        <item.icon
                          className={`w-5 h-5 transition-colors duration-300 ${isActive ? "text-rose-500" : "text-zinc-400 group-hover:text-zinc-900"}`}
                          strokeWidth={1.5}
                        />
                        <span
                          className={`text-[15px] transition-colors duration-300 ${isActive ? "text-rose-500 font-semibold" : "text-zinc-500"}`}
                        >
                          {item.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-8 border-t border-zinc-100">
                <div className="flex items-center gap-3 text-zinc-400 text-[10px] font-bold tracking-[0.3em] uppercase">
                  © NeuroZenith 2026
                </div>
              </div>
            </Motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isProfilePopupOpen ? (
          <>
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProfilePopupOpen(false)}
              className="fixed inset-0 bg-black/25 z-[130]"
            />
            <Motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="fixed z-[131] top-[84px] right-4 md:right-8 w-[92%] max-w-[340px] bg-white border border-zinc-100 rounded-3xl shadow-[0_30px_80px_-40px_rgba(0,0,0,0.45)] p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user?.name || "User"}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-zinc-900 text-white text-sm font-bold flex items-center justify-center">
                      {userInitial}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 truncate">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
                    <p className="text-[10px] mt-1 inline-flex px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 uppercase tracking-wide">
                      {user?.role || "user"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsProfilePopupOpen(false)}
                  className="p-1.5 rounded-full hover:bg-zinc-100 transition-colors"
                >
                  <X className="w-4 h-4 text-zinc-500" />
                </button>
              </div>

              <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-end gap-2">
                {canAccessAdmin ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfilePopupOpen(false);
                      navigate("/admin/dashboard");
                    }}
                    className="px-3 py-2 text-xs font-semibold rounded-xl bg-zinc-100 hover:bg-zinc-200 transition-colors"
                  >
                    Open Admin
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3 py-2 text-xs font-semibold rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
                >
                  Log out
                </button>
              </div>
            </Motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
