import React from "react";
import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const HeroSection = () => {

  const [heroImage, setHeroImage] = useState("");

  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products/hero-image");
        const data = await response.json();
        setHeroImage(data.data);
      } catch (error) {
        console.error("Error fetching hero image:", error);
      }
    };

    fetchHeroImage();
  }, []);

  return (
    <div className="relative h-[380px] md:h-[580px] w-full rounded-lg md:rounded-xl overflow-hidden shadow-2xl bg-gray-100">
      {/* Background Image */}
    
      <img
          src={heroImage}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,0,0,0.4),transparent_80%)]" />

      {/* TOP-LEFT Content Block */}
      <div className="absolute top-8 left-8 md:top-12 md:left-16 max-w-sm md:max-w-3xl text-white z-10">
        <h1 className="text-[36px] md:text-[72px] font-light mb-2 md:mb-4 tracking-tight leading-[1.1] drop-shadow-lg">
          TeezStyles.
        </h1>

        <div className="flex items-center gap-2 md:gap-4 opacity-90 transform -translate-x-2">
          <ArrowDownRight
            size={14}
            className="md:size-[26px] shrink-0 opacity-100 text-white transform -translate-y-[1px] md:-translate-y-[8px]"
            strokeWidth={2.5}
          />

          <div className="text-sm md:text-base font-light leading-relaxed drop-shadow-md max-w-xs md:max-w-md">
            <p className="block md:hidden uppercase tracking-[0.2em] text-[11px] font-medium">
              Shop smart
            </p>
            <p className="hidden md:block">
              Upgrade your wardrobe with tees that speak style. Pick your
              favourite stuff that matches your personal taste, style and suits
              your style.
            </p>
          </div>
        </div>
      </div>

      {/* BOTTOM-CENTER CTA Block */}
      <div className="absolute bottom-6 md:bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-5 z-10 w-full px-4">
        {/* COMPACT UNIFIED BUTTON: 
            - Reduced horizontal padding (px-5 on mobile, md:px-8 on desktop)
            - Gap kept tight for a unified look
        */}
        <button className="group flex items-center gap-2 bg-white text-black px-5 py-3 md:px-8 md:py-4 rounded-full font-medium shadow-xl hover:bg-black hover:text-white transition-all duration-300 cursor-pointer whitespace-nowrap">
          <span className="text-sm md:text-lg">Start shopping</span>

          <ArrowUpRight
            size={18}
            className="md:size-[22px] transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
            strokeWidth={2.5}
          />
        </button>

        <span className="text-white text-[10px] md:text-[11px] font-light tracking-[0.3em] uppercase drop-shadow-xl opacity-80 cursor-pointer transition-all duration-300 hover:underline underline-offset-4 decoration-white decoration-1">
          Top Collection
        </span>
      </div>
    </div>
  );
};

export default HeroSection;
