import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";

const containerStyles = "max-w-[1700px] mx-auto px-4 md:px-8";

const Home = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      <Navbar />
      <div className="pt-[65px] lg:pt-[136px]">
        <main className={`${containerStyles} py-2`}>
          <HeroSection />
        </main>
      </div>
    </div>
  );
};

export default Home;
