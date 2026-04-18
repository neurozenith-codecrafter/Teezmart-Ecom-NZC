import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  History,
  TrendingUp,
  Home,
} from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { PAGE_CONTAINER_CLASS } from "../constants/pageLayout";
import { useCommerce } from "../Hooks/useCommerce";
import DropDown from "../components/HomepageComponents/DropDown";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBottomNav, setShowBottomNav] = useState(true);
  const [activeItem, setActiveItem] = useState("Order History");
  const [isMobileSidebar, setIsMobileSidebar] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [hasImgError, setHasImgError] = useState(false);
  const [hasPopupImgError, setHasPopupImgError] = useState(false);

  // --- NEW SEARCH STATES ---
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchContainerRef = useRef(null);
  const trendingSearches = [
    "Oversized Tees",
    "Graphic Hoodies",
    "Summer Drop",
    "Baggy Jeans",
  ];

  const { isLoggedIn, user, logout } = useAuth();
  const { cartCount, wishlistCount } = useCommerce();

  const lastScrollY = useRef(0);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Load Recent Searches
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  // Handle Search Outside Click & ESC
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };
    const handleEsc = (event) => {
      if (event.key === "Escape") setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  // Search Logic
  const handleSearch = (query) => {
    const term = query || searchQuery;
    if (!term.trim()) return;

    // Local Storage logic
    const updatedRecent = [
      term,
      ...recentSearches.filter((s) => s !== term),
    ].slice(0, 5);
    setRecentSearches(updatedRecent);
    localStorage.setItem("recentSearches", JSON.stringify(updatedRecent));

    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      if (showSuggestions) {
        setShowBottomNav(true);
        lastScrollY.current = currentScrollY;
        return;
      }

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
  }, [showSuggestions]);

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

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setHasImgError(false);
      setHasPopupImgError(false);
    });

    return () => cancelAnimationFrame(frameId);
  }, [user]);

  useEffect(() => {
    if (location.pathname !== "/") return;
    if (sessionStorage.getItem("scrollToHomeContact") !== "true") return;

    const timerId = window.setTimeout(() => {
      const element = document.getElementById("footer-contact");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        window.dispatchEvent(new CustomEvent("highlight-contact"));
      }
      sessionStorage.removeItem("scrollToHomeContact");
    }, 350);

    return () => window.clearTimeout(timerId);
  }, [location.pathname]);

  const userInitial = user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";
  const canAccessAdmin = user?.role === "admin" || user?.role === "devAdmin";
  const shouldShowNavAvatar = user?.avatar && !hasImgError;
  const shouldShowPopupAvatar = user?.avatar && !hasPopupImgError;

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    setIsProfilePopupOpen(false);
    setIsMenuOpen(false);
    navigate("/", { replace: true });
  };

  const navigateToCatalog = () => {
    setActiveItem("Products");
    setIsMenuOpen(false);
    navigate("/catalog");
  };

  // const navigateToTshirtCatalog = () => {
  //   setActiveItem("Products");
  //   setIsMenuOpen(false);
  //   navigate("/catalog?category=tshirt");
  // };

  const navigateToNewArrivals = () => {
    setActiveItem("Products");
    setIsMenuOpen(false);
    navigate("/catalog?sort=new");
  };

  const navigateToMostRated = () => {
    setActiveItem("Products");
    setIsMenuOpen(false);
    navigate("/catalog?collection=rated");
  };

  const scrollToWhyUs = (e) => {
    e.preventDefault();
    const element = document.getElementById("why-us");
    if (element) {
      const offset = 100;
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

  const redirectToHomeContact = () => {
    setIsMenuOpen(false);

    if (location.pathname === "/") {
      // Already on the homepage — the pathname won't change so the useEffect
      // that reads sessionStorage will never fire. Scroll directly instead.
      setTimeout(() => {
        const element = document.getElementById("footer-contact");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          window.dispatchEvent(new CustomEvent("highlight-contact"));
        }
      }, 400); // slightly longer to let the mobile sidebar finish closing
    } else {
      // On a different page — navigate home, then the useEffect will handle it
      sessionStorage.setItem("scrollToHomeContact", "true");
      navigate("/");
    }
  };

  const sidebarVariants = {
    closed: {
      x: "-100%",
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
    },
    open: { x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  const menuItems = [
    { name: "Home", icon: Home },
    { name: "Live Orders", icon: LayoutGrid },
    { name: "Order History", icon: ShoppingBag },
    { name: "Wishlist", icon: Heart, isMobileOnly: true },
    { name: "Products", icon: Package },
    { name: "Message", icon: MessageSquare, isContact: true },
    { name: "Report", icon: ShieldAlert, isContact: true },
  ];

  const bubbleSpring = {
    type: "spring",
    stiffness: 260,
    damping: 18,
  };

  const logoSpring = {
    type: "spring",
    stiffness: 400,
    damping: 15,
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.1,
      },
    },
  };

  const letterVariants = {
    initial: {
      y: 10,
      opacity: 0,
      scale: 0.5,
      filter: "blur(4px)",
    },
    animate: {
      y: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: logoSpring,
    },
  };

  const curtainSpring = {
    type: "spring",
    stiffness: 120,
    damping: 20,
    mass: 0.8,
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[60] bg-white/95 backdrop-blur-md border-b border-[#f5f5f5]">
        <div
          className={`${PAGE_CONTAINER_CLASS} h-[55px] md:h-[68px] flex items-center justify-between relative`}
        >
          <div className="flex-1 flex justify-start">
            <Motion.button
              onClick={() => setIsMenuOpen(true)}
              whileTap={{ scale: 0.9 }}
              className="p-2 -ml-2 rounded-full hover:bg-zinc-50 transition-colors flex flex-col gap-[4px] cursor-pointer"
            >
              <span className="w-5 h-[1.5px] bg-black rounded-full" />
              <span className="w-4 h-[1.5px] bg-black rounded-full" />
              <span className="w-5 h-[1.5px] bg-black rounded-full" />
            </Motion.button>
          </div>

          <Link
            to="/"
            onClick={scrollToTop}
            className="absolute left-1/2 -translate-x-1/2 text-[19px] md:text-[23px] font-bold tracking-tighter text-black whitespace-nowrap"
          >
            <Motion.span
              variants={containerVariants}
              initial="initial"
              animate="animate"
              className="flex"
            >
              {"TeezMart".split("").map((char, index) => (
                <Motion.span
                  key={index}
                  variants={letterVariants}
                  style={{ display: "inline-block" }}
                  whileHover={{
                    scale: 1.2,
                    y: -3,
                    transition: { type: "spring", stiffness: 600, damping: 10 },
                  }}
                >
                  {char}
                </Motion.span>
              ))}
            </Motion.span>
          </Link>

          <div className="flex-1 flex items-center justify-end space-x-4 md:space-x-8">
            <div className="hidden lg:flex items-center space-x-7 text-[12px] font-semibold text-black uppercase tracking-wider">
              <Motion.a
                href="#why-us"
                onClick={scrollToWhyUs}
                whileHover={{ y: -2, color: "#71717a" }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="hover:opacity-60 transition-opacity cursor-pointer"
              >
                Blogs
              </Motion.a>
              <Motion.a
                href="#why-us"
                onClick={scrollToWhyUs}
                whileHover={{ y: -2, color: "#71717a" }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="hover:opacity-60 transition-opacity cursor-pointer"
              >
                FAQs
              </Motion.a>
            </div>

            <div className="flex items-center space-x-3 md:space-x-5">
              <div className="flex items-center space-x-3 md:space-x-5">
                {isLoggedIn ? (
                  <div className="flex items-center space-x-3 md:space-x-5">
                    <Link to="/wishlist" className="hidden md:block relative">
                      <Motion.div
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.8 }}
                      >
                        <Heart className="w-[19px] h-[19px] text-black stroke-[1.1] cursor-pointer hover:text-rose-500 transition-colors" />
                        {wishlistCount > 0 ? (
                          <Motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 min-w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] leading-none px-1 inline-flex items-center justify-center"
                          >
                            {wishlistCount > 99 ? "99+" : wishlistCount}
                          </Motion.span>
                        ) : null}
                      </Motion.div>
                    </Link>

                    <Link to="/cart" className="relative">
                      <Motion.div
                        whileHover={{ y: -3, scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        transition={bubbleSpring}
                      >
                        <ShoppingCart className="w-[19px] h-[19px] text-black stroke-[1.1] cursor-pointer hover:opacity-60 transition-opacity" />
                        {cartCount > 0 ? (
                          <Motion.span
                            layoutId="cartBadge"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 min-w-4 h-4 rounded-full bg-zinc-900 text-white text-[10px] leading-none px-1 inline-flex items-center justify-center"
                          >
                            {cartCount > 99 ? "99+" : cartCount}
                          </Motion.span>
                        ) : null}
                      </Motion.div>
                    </Link>

                    <div className="relative ml-2 md:ml-0" ref={profileMenuRef}>
                      <Motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                        className="flex items-center justify-center transition-transform active:scale-95"
                      >
                        {shouldShowNavAvatar ? (
                          <img
                            src={user.avatar}
                            alt={user?.name || "User"}
                            onError={() => setHasImgError(true)}
                            className="w-8 h-8 rounded-full object-cover border border-zinc-100 shadow-sm"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-zinc-900 text-white text-[11px] font-bold flex items-center justify-center shadow-md border border-white/20">
                            {userInitial}
                          </div>
                        )}
                      </Motion.button>

                      <AnimatePresence>
                        {isProfileMenuOpen && (
                          <Motion.div
                            initial={{
                              opacity: 0,
                              scale: 0.8,
                              y: 10,
                              filter: "blur(4px)",
                            }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                              y: 0,
                              filter: "blur(0px)",
                            }}
                            exit={{
                              opacity: 0,
                              scale: 0.8,
                              y: 10,
                              filter: "blur(4px)",
                            }}
                            transition={bubbleSpring}
                            className="absolute right-0 mt-3 w-48 bg-white border border-zinc-100 rounded-2xl shadow-[0_16px_40px_-20px_rgba(0,0,0,0.35)] p-2 z-[120] origin-top-right"
                          >
                            {canAccessAdmin && (
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
                            )}
                            {canAccessAdmin && (
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
                            )}
                            <button
                              type="button"
                              onClick={handleLogout}
                              className="w-full text-left text-sm px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-500 transition-colors inline-flex items-center gap-2"
                            >
                              <LogOut className="w-4 h-4" />
                              Log out
                            </button>
                          </Motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ) : (
                  <Motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "#000" }}
                    whileTap={{ scale: 0.95 }}
                    transition={bubbleSpring}
                    onClick={() => navigate("/login")}
                    className="px-5 py-2 md:px-6 md:py-2.5 bg-[#18181B] text-white text-[11px] md:text-[12px] font-medium tracking-tight rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.1)] hover:bg-black transition-all duration-200 active:scale-[0.96] cursor-pointer flex items-center justify-center"
                  >
                    Log in
                  </Motion.button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {showBottomNav && (
          <Motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "58px", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={curtainSpring}
            style={{ overflow: "visible" }}
            className="hidden lg:block fixed left-0 w-full bg-white z-[55] border-b border-[#f9f9f9]/50 top-[68px] origin-top"
          >
            <Motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              exit={{ y: -20 }}
              transition={curtainSpring}
              className={`${PAGE_CONTAINER_CLASS} flex items-center justify-between h-full gap-x-6`}
            >
              <div className="flex items-center gap-x-3 shrink-0">
                <div className="relative">
                  <DropDown />
                </div>

                <div className="flex items-center gap-x-2">
                  {["New Arrivals", "Most Rated"].map((label) => (
                    <Motion.button
                      key={label}
                      onClick={
                        label === "New Arrivals"
                          ? navigateToNewArrivals
                          : navigateToMostRated
                      }
                      whileHover={{ y: -2, backgroundColor: "#f9f9f9" }}
                      whileTap={{ scale: 0.96 }}
                      className="px-6 py-2.5 border border-[#f0f0f0] rounded-full text-[14px] font-normal text-black transition-colors"
                    >
                      {label}
                    </Motion.button>
                  ))}
                </div>
              </div>

              {/* ENHANCED SEARCH SECTION */}
              <div
                className="relative w-full max-w-[320px] lg:max-w-[360px]"
                ref={searchContainerRef}
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search collection..."
                  className="w-full bg-[#f9f9f9] border border-[#f0f0f0] py-2.5 pl-6 pr-12 rounded-full text-[14px] font-normal outline-none focus:bg-white transition-all"
                />
                <Search
                  className="w-4 h-4 absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-black transition-colors"
                  onClick={() => {
                    setShowSuggestions(true);
                    handleSearch();
                  }}
                />

                <AnimatePresence>
                  {showSuggestions && (
                    <Motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      className="absolute top-full mt-2 left-0 w-full bg-white/95 backdrop-blur-md border border-zinc-200 rounded-2xl shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden z-[100]"
                    >
                      <div className="p-5 space-y-6">
                        {recentSearches.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                              <History size={12} /> Recent Searches
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {recentSearches.map((item) => (
                                <button
                                  key={item}
                                  onClick={() => handleSearch(item)}
                                  className="px-3 py-1.5 bg-zinc-50 border border-zinc-100 rounded-full text-[12px] text-zinc-600 hover:bg-zinc-100 hover:text-black transition-all"
                                >
                                  {item}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="space-y-3">
                          <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                            <TrendingUp size={12} /> Trending
                          </h4>
                          <div className="grid grid-cols-1 gap-1">
                            {trendingSearches.map((item) => (
                              <button
                                key={item}
                                onClick={() => handleSearch(item)}
                                className="text-left px-3 py-2 text-[13px] text-zinc-600 hover:bg-zinc-50 rounded-lg transition-colors"
                              >
                                {item}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE SECONDARY NAV — visible only below lg breakpoint */}
      {/* Always mounted; only `translateY` is animated so the GPU compositor handles it */}
      <Motion.div
        animate={{ y: showBottomNav ? 0 : "-100%" }}
        transition={{ type: "tween", duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        style={{ willChange: "transform", overflow: "visible" }}
        className="block lg:hidden fixed left-0 w-full h-[52px] bg-white z-[55] border-b border-[#f5f5f5] top-[55px]"
      >
        <div className="h-full flex items-center px-4 gap-x-3">
          {/* Shop pill */}
          <Motion.button
            onClick={navigateToCatalog}
            whileTap={{ scale: 0.96 }}
            className="shrink-0 px-4 py-2 bg-[#f9f9f9] border border-[#f0f0f0] rounded-full text-[13px] font-medium text-black"
          >
            Shop
          </Motion.button>

          {/* Search bar */}
          <div className="relative flex-1" ref={searchContainerRef}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search collection..."
              className="w-full bg-[#f9f9f9] border border-[#f0f0f0] py-2 pl-4 pr-10 rounded-full text-[13px] font-normal outline-none focus:bg-white transition-all"
            />
            <Search
              className="w-3.5 h-3.5 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-black transition-colors"
              onClick={() => {
                setShowSuggestions(true);
                handleSearch();
              }}
            />

            {/* Click-trap overlay: blocks taps on page elements while suggestions are open */}
            {showSuggestions && (
              <div
                className="fixed inset-0 z-[98]"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setShowSuggestions(false);
                }}
              />
            )}

            <AnimatePresence>
              {showSuggestions && (
                <Motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  className="absolute top-full mt-2 left-0 w-full bg-white border border-zinc-200 rounded-2xl shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden z-[99]"
                >
                  <div className="p-4 space-y-5">
                    {recentSearches.length > 0 && (
                      <div className="space-y-2.5">
                        <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                          <History size={12} /> Recent
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map((item) => (
                            <button
                              key={item}
                              onClick={() => handleSearch(item)}
                              className="px-3 py-1.5 bg-zinc-50 border border-zinc-100 rounded-full text-[12px] text-zinc-600 hover:bg-zinc-100 hover:text-black transition-all"
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                        <TrendingUp size={12} /> Trending
                      </h4>
                      <div className="grid grid-cols-1 gap-1">
                        {trendingSearches.map((item) => (
                          <button
                            key={item}
                            onClick={() => handleSearch(item)}
                            className="text-left px-3 py-2 text-[13px] text-zinc-600 hover:bg-zinc-50 rounded-lg transition-colors"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Motion.div>

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
                          isMobileSidebar
                            ? redirectToHomeContact()
                            : scrollToContact();
                        } else if (item.name === "Home") {
                          navigate("/");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                          setIsMenuOpen(false);
                        } else if (item.name === "Wishlist") {
                          navigate("/wishlist");
                          setIsMenuOpen(false);
                        } else if (item.name === "Products") {
                          navigateToCatalog();
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
                  {shouldShowPopupAvatar ? (
                    <img
                      src={user.avatar}
                      alt={user?.name || "User"}
                      onError={() => setHasPopupImgError(true)}
                      className="w-12 h-12 rounded-full object-cover border border-zinc-50 shadow-sm"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-zinc-900 text-white text-sm font-bold flex items-center justify-center shadow-lg border-2 border-zinc-50">
                      {userInitial}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 truncate">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">
                      {user?.email}
                    </p>
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
