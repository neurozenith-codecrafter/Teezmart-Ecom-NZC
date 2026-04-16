import React from "react";
import { ArrowUpRight, ArrowDownRight, Gift } from "lucide-react";
import { Link } from "react-router-dom";

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
          className="relative text-[42px] md:text-[88px] tracking-tighter leading-[0.95] mb-6 select-none"
          initial="initial"
          animate="animate"
        >
          {/* 1. Main Text with Staggered Letter Animation */}
          <div className="flex overflow-hidden pb-2">
            {"TeezStyles".split("").map((char, index) => (
              <Motion.span
                key={index}
                variants={{
                  initial: { y: "100%", opacity: 0 },
                  animate: { y: 0, opacity: 1 },
                }}
                transition={{
                  duration: 0.8,
                  ease: [0.2, 1, 0.3, 1],
                  delay: 0.2 + index * 0.03,
                }}
                className="inline-block font-light drop-shadow-2xl"
              >
                {char}
              </Motion.span>
            ))}

            {/* 2. The "Signature" Dot */}
            <Motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 10,
                delay: 0.8,
              }}
              className="inline-block text-green-400 font-bold"
            >
              .
            </Motion.span>
          </div>

          {/* 3. Underline Decorative Flow */}
          <Motion.div
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
            className="h-[1px] md:h-[2px] w-32 md:w-64 bg-gradient-to-r from-white/80 to-transparent mt-[-4px]"
          />
        </Motion.h1>

        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...heroSpring, delay: 0.5 }}
          className="flex items-start gap-3 md:gap-5"
        >
          {/* 1. The Icon - Simple & Clean */}
          <ArrowDownRight
            size={20}
            className="md:size-[32px] shrink-0 text-white mt-1 opacity-100"
            strokeWidth={2}
          />

          {/* 2. The Text - High Readability */}
          <div className="max-w-xs md:max-w-md">
            {/* Mobile Version: Simple high-contrast badge */}
            <p className="block md:hidden bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full text-[12px] font-semibold uppercase tracking-widest text-white w-fit">
              Shop Smart
            </p>

            {/* Desktop Version: Clean, spaced typography */}
            <p className="hidden md:block text-[18px] lg:text-[20px] font-normal leading-snug text-white drop-shadow-md">
              Upgrade your wardrobe with tees that speak style.
              <span className="block mt-2 opacity-80 font-light text-[16px]">
                Pick your favourite stuff that matches your personal taste.
              </span>
            </p>
          </div>
        </Motion.div>
        {/* --- NEW OFFER TAG --- */}
        {/* --- BIG, EYE-CATCHING OFFER CARD --- */}
        <Motion.div
          initial={{ opacity: 0, scale: 0.3, y: 50, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 180,
            damping: 18, // slightly smoother
            delay: 0.7,
          }}
          whileHover={{
            scale: 1.02,
            rotate: 0.8, // ✅ stable instead of array
          }}
          style={{ willChange: "transform" }} // ✅ performance boost
          transition={{
            type: "spring",
            stiffness: 250,
            damping: 20,
          }}
          className="mt-6 md:mt-10 mb-6 md:mb-8 inline-flex items-center gap-3 md:gap-4 bg-white/10 backdrop-blur-xl border border-white/20 p-4 md:px-6 md:py-4 rounded-2xl md:rounded-3xl shadow-2xl cursor-pointer max-w-[90vw] md:max-w-none"
        >
          {/* Icon */}
          <div className="flex items-center justify-center p-2 md:p-3 bg-green-500 rounded-xl md:rounded-2xl shrink-0">
            <Gift className="w-5 h-5 md:w-8 md:h-8 text-white" />
          </div>

          {/* Text */}
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="uppercase tracking-[0.15em] text-[9px] md:text-[11px] font-bold text-green-400">
                Special Offer
              </span>
              <div className="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-green-500"></span>
              </div>
            </div>

            <p className="text-[14px] md:text-[22px] font-medium md:font-light tracking-tight text-white leading-tight">
              Buy 1, Get{" "}
              <span className="font-bold text-green-400">₹50 OFF</span>
              <span className="block text-[11px] md:text-[16px] opacity-80 md:mt-1 font-light">
                on every next T-shirt!
              </span>
            </p>
          </div>
        </Motion.div>
      </div>

      {/* 3. BOTTOM-CENTER CTA Block */}
      <div className="absolute bottom-6 md:bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-5 z-10 w-full px-4">
        <Link to={"/catalog"}>
          <Motion.button
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...heroSpring, delay: 1.2 }}
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
        </Link>

        <Link to={"/catalog"}>
          <Motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 1.2 }}
            whileHover={{ opacity: 1, scale: 1.1 }}
            className="text-white text-[10px] md:text-[11px] font-light tracking-[0.3em] uppercase drop-shadow-xl cursor-pointer transition-all"
          >
            Top Collection
          </Motion.span>
        </Link>
      </div>
    </Motion.div>
  );
};

export default HeroSection;
