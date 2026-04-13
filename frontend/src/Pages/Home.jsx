import React from "react";
import HeroSection from "../components/HomepageComponents/HeroSection";
import { BestSellerSection } from "../components/HomepageComponents/BestSellerSection";
import { PAGE_CONTAINER_CLASS } from "../constants/pageLayout";
import { WhyUsSection } from "../components/HomepageComponents/WhyUsSection";

const Home = () => {
  return (
    <main>
      <div className={`${PAGE_CONTAINER_CLASS} py-2`}>
        <HeroSection />
      </div>
      <BestSellerSection />
      <WhyUsSection />
    </main>
  );
};

export default Home;
