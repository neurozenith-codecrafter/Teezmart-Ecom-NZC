import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import FooterSection from "./HomepageComponents/FooterSection";

const PublicLayout = () => {
  const { pathname } = useLocation();
  const isHomePage = pathname === "/";

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      <Navbar />
      <div className="pt-[65px] lg:pt-[136px]">
        <Outlet />
      </div>
      <FooterSection compactMobile={!isHomePage} />
    </div>
  );
};

export default PublicLayout;
