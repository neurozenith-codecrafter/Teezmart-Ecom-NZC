import React from "react";
import { ArrowUpRight } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="relative h-[380px] md:h-[600px] w-full rounded-lg md:rounded-xl overflow-hidden shadow-2xl bg-gray-100">
      <img
        src="/bst4.jpg"
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,0,0,0.5),transparent_75%)]" />

      <div className="absolute top-8 left-6 md:top-12 md:left-12 max-w-sm md:max-w-xl text-white z-10">
        <h1 className="text-[36px] md:text-[75px] font-bold mb-3 md:mb-5 tracking-tighter leading-[1.0] drop-shadow-xl">
          TeezMartStyles.
        </h1>
        <div className="flex items-start gap-3 opacity-95">
          <span className="text-xl md:text-2xl mt-1 rotate-45">↘</span>
          <p className="text-sm md:text-lg font-normal leading-snug drop-shadow-md max-w-[320px]">
            Discover our wide ranging and timeless lifestyle products.
          </p>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10">
        <div className="flex items-center gap-3">
          <button className="bg-white text-black px-10 md:px-14 py-4 rounded-full font-bold text-base md:text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer">
            Start shopping
          </button>
          <button className="bg-white text-black w-[55px] h-[55px] md:w-[60px] md:h-[60px] rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-all cursor-pointer">
            <ArrowUpRight size={24} />
          </button>
        </div>
        <span className="text-white text-[11px] md:text-[12px] font-semibold tracking-[0.2em] uppercase drop-shadow-xl opacity-90">
          Top Collection
        </span>
      </div>
    </div>
  );
};

export default HeroSection;
