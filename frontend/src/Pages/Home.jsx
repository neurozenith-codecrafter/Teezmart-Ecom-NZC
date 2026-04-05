import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import { BestSellerSection } from "../components/BestSellerSection";
import { PAGE_CONTAINER_CLASS } from "../constants/pageLayout";
import { WhyUsSection } from "../components/WhyUsSection";

const Home = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      <Navbar />
      <div className="pt-[65px] lg:pt-[136px]">
        <main>
          <div className={`${PAGE_CONTAINER_CLASS} py-2`}>
            <HeroSection />
          </div>
          <BestSellerSection />
          <WhyUsSection />
        </main>
      </div>
    </div>
  );
};

export default Home;
