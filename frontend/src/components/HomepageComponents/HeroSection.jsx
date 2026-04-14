import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

import { motion as Motion } from "framer-motion";

const heroSpring = { type: "spring", stiffness: 100, damping: 20 };

const HeroSection = () => {
  return (
    <Motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="relative h-[380px] md:h-[580px] w-full rounded-lg md:rounded-xl overflow-hidden shadow-2xl bg-gray-100"
    >
      {/* 1. Background Image - "The Slow Breath" Zoom */}
      <Motion.img
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 60, damping: 20 }}
        src="https://res.cloudinary.com/dnypxpkvl/image/upload/v1776099103/bst4.jpg_zwtc6t.jpg"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,0,0,0.4),transparent_80%)]" />

      {/* 2. TOP-LEFT Content Block */}
      <div className="absolute top-8 left-8 md:top-12 md:left-16 max-w-sm md:max-w-3xl text-white z-10">
        <Motion.h1
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...heroSpring, delay: 0.3 }}
          className="text-[36px] md:text-[72px] font-light mb-2 md:mb-4 tracking-tight leading-[1.1] drop-shadow-lg"
        >
          TeezStyles.
        </Motion.h1>

        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...heroSpring, delay: 0.5 }}
          className="flex items-center gap-2 md:gap-4 opacity-90"
        >
          <ArrowDownRight
            size={14}
            className="md:size-[26px] shrink-0 text-white md:-translate-y-[8px]"
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
        </Motion.div>
      </div>

      {/* 3. BOTTOM-CENTER CTA Block */}
      <div className="absolute bottom-6 md:bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-5 z-10 w-full px-4">
        <Motion.button
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...heroSpring, delay: 0.8 }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          }}
          whileTap={{ scale: 0.95 }}
          className="group flex items-center gap-2 bg-white text-black px-5 py-3 md:px-8 md:py-4 rounded-full font-medium shadow-xl hover:bg-black hover:text-white transition-all duration-300 cursor-pointer whitespace-nowrap"
        >
          <span className="text-sm md:text-lg">Start shopping</span>
          <ArrowUpRight
            size={18}
            className="md:size-[22px] transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
            strokeWidth={2.5}
          />
        </Motion.button>

        <Motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 1.2 }}
          whileHover={{ opacity: 1, scale: 1.1 }}
          className="text-white text-[10px] md:text-[11px] font-light tracking-[0.3em] uppercase drop-shadow-xl cursor-pointer transition-all"
        >
          Top Collection
        </Motion.span>
      </div>
    </Motion.div>
  );
};

export default HeroSection;
