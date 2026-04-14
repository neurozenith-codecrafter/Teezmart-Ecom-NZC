import React, {useEffect} from "react";
import HeroSection from "../components/HomepageComponents/HeroSection";
import { BestSellerSection } from "../components/HomepageComponents/BestSellerSection";
import { PAGE_CONTAINER_CLASS } from "../constants/pageLayout";
import { WhyUsSection } from "../components/HomepageComponents/WhyUsSection";

const Home = () => {

  useEffect(() => {
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }
}, []);

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
