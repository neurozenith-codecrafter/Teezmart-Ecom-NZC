import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MapPin, PhoneCall } from "lucide-react";
import { PAGE_CONTAINER_CLASS } from "../../constants/pageLayout";

const FooterBrandBlock = () => (
  <div className="space-y-4">
    <h2 className="text-3xl font-semibold tracking-tighter text-slate-950">
      TeezMart<span className="text-[#32F18F]">.</span>
    </h2>
    <p className="text-slate-500 text-sm leading-relaxed max-w-sm font-medium">
      At MartTeez, we don&apos;t just make T-shirts — We craft oversized comfort
      with attitude. Premium fabrics, unique vibes.
    </p>

    <div className="flex gap-6 text-slate-400">
      {[
        {
          d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
          s: 20,
        },
        { insta: true, s: 20 },
        { x: true, s: 18 },
        {
          d: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-10.6 8.38 8.38 0 0 1 3.9.9L22 4z",
          s: 20,
        },
      ].map((icon, idx) => (
        <a
          key={idx}
          href="#"
          className="hover:text-slate-950 hover:scale-110 transition-all duration-300"
        >
          <svg
            width={icon.s}
            height={icon.s}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {icon.d && <path d={icon.d} />}
            {icon.insta && (
              <>
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </>
            )}
            {icon.x && (
              <>
                <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
              </>
            )}
          </svg>
        </a>
      ))}
    </div>
  </div>
);

const FooterSection = ({ compactMobile = false }) => {
  const [isPinging, setIsPinging] = useState(false);

  useEffect(() => {
    let timer;
    const handleHighlight = () => {
      setIsPinging(true);
      timer = window.setTimeout(() => setIsPinging(false), 2000);
    };
    window.addEventListener("highlight-contact", handleHighlight);
    return () => {
      window.removeEventListener("highlight-contact", handleHighlight);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <footer
      className={`relative bg-white pt-20 pb-8 text-slate-900 w-full border-t border-slate-100 ${compactMobile ? "hidden md:block" : ""}`}
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-50" />

      <div className={PAGE_CONTAINER_CLASS}>
        <div className="grid grid-cols-2 md:grid-cols-12 gap-y-12 pb-10 relative">
          {/* 1. Brand Block */}
          <div className="col-span-2 md:col-span-12 lg:col-span-4 space-y-10">
            <FooterBrandBlock />
          </div>

          {/* 2. Navigation */}
          <div className="col-span-1 md:col-span-3 lg:col-span-2 space-y-6">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">
              Navigation
            </h4>
            <ul className="text-[13px] text-slate-500 space-y-4 font-semibold">
              {[
                "Why Us?",
                "New Arrivals",
                "Best Sellers",
                "Products",
                "Our Story",
              ].map((link) => (
                <li
                  key={link}
                  className="hover:text-slate-950 cursor-pointer transition-all hover:translate-x-1 w-fit whitespace-nowrap"
                >
                  {link}
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Collections */}
          <div className="col-span-1 md:col-span-3 lg:col-span-2 lg:col-start-7 space-y-6">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">
              Collections
            </h4>
            <ul className="text-[13px] text-slate-500 space-y-4 font-semibold">
              {[
                "Streetwear Drop",
                "Minimalist Tech",
                "Abstract",
                "Essentials",
                "Vintage Wash",
              ].map((link) => (
                <li
                  key={link}
                  className="hover:text-slate-950 cursor-pointer transition-all hover:translate-x-1 w-fit whitespace-nowrap"
                >
                  {link}
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Contact Us */}
          <div className="col-span-2 md:col-span-6 lg:col-start-9 lg:col-span-4 relative group flex flex-col md:justify-self-end lg:min-w-[320px]">
            <div className="relative w-full px-0 md:px-6 py-2">
              <AnimatePresence>
                {isPinging && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute -inset-4 z-0 pointer-events-none rounded-[2rem] 
                     bg-[#32F18F]/10 shadow-[0_0_40px_-10px_rgba(50,241,143,0.2)] 
                     border border-[#32F18F]/20 backdrop-blur-[2px]"
                  />
                )}
              </AnimatePresence>
              <div className="relative z-10 space-y-7">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">
                  Contact Us
                </h4>
                <div id="footer-contact" className="space-y-5">
                  <div className="flex items-start gap-4 group cursor-pointer w-full">
                    <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-[#18181B] group-hover:text-white transition-all duration-500 shrink-0">
                      <MapPin size={16} strokeWidth={1.5} />
                    </div>
                    <span className="text-[13px] text-slate-500 group-hover:text-slate-950 font-medium leading-relaxed pt-1">
                      75 TeezMart Blvd, <br /> New York, NY 10001
                    </span>
                  </div>

                  <div className="flex items-center gap-4 group cursor-pointer w-full">
                    <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-[#18181B] group-hover:text-white transition-all duration-500 shrink-0">
                      <Mail size={16} strokeWidth={1.5} />
                    </div>
                    <span className="text-[13px] text-slate-500 group-hover:text-slate-950 font-medium transition-colors">
                      care@teezmart.com
                    </span>
                  </div>

                  <div className="flex items-center gap-4 group cursor-pointer w-full">
                    <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-[#18181B] group-hover:text-white transition-all duration-500 shrink-0">
                      <PhoneCall size={16} strokeWidth={1.5} />
                    </div>
                    <span className="text-[13px] text-slate-500 group-hover:text-slate-950 font-medium transition-colors">
                      +1 (555) 123-4567
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* THE COPYRIGHT */}
          <div className="col-span-2 md:col-span-12 relative flex items-center justify-center h-px mt-12 bg-slate-100">
            <div className="absolute bg-white px-8">
              <p className="text-[9px] text-slate-500 font-bold tracking-[0.7em] uppercase whitespace-nowrap">
                © NeuroZenith 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const MobileCopyright = ({ className = "" }) => {
  return (
    <div
      className={`md:hidden border-t border-slate-200/70 bg-white px-4 py-3 text-center ${className}`}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-slate-500">
        @neurozenith2026
      </p>
    </div>
  );
};

export default FooterSection;
