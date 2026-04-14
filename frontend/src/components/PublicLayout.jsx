import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion as Motion } from "framer-motion";
import Navbar from "./Navbar";
import FooterSection, {
  MobileCopyright,
} from "./HomepageComponents/FooterSection";

const PublicLayout = () => {
  const { pathname } = useLocation();
  const isHomePage = pathname === "/";

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      <Navbar />
      <div className="pt-[65px] lg:pt-[136px]">
        <AnimatePresence mode="wait">
          <Motion.div
            key={pathname}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </Motion.div>
        </AnimatePresence>
      </div>
      <FooterSection compactMobile={!isHomePage} />
      {!isHomePage && <MobileCopyright />}
    </div>
  );
};

export default PublicLayout;
