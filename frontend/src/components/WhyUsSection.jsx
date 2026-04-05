import React from "react";
import { Sparkles, ShieldCheck, Tag } from "lucide-react";
import { PAGE_CONTAINER_CLASS } from "../constants/pageLayout";

const whyUsData = [
  {
    id: 1,
    title: "Unique Designs",
    desc: "Stand out with exclusive styles made for you.",
    Icon: Sparkles,
  },
  {
    id: 2,
    title: "Premium Quality",
    desc: "Soft, durable fabric with long-lasting prints.",
    Icon: ShieldCheck,
  },
  {
    id: 3,
    title: "Affordable Prices",
    desc: "Trendy fashion without breaking the bank.",
    Icon: Tag,
  },
];

export const WhyUsSection = () => {
  return (
    /* Matching the background tone and vertical rhythm (py-20) 
       of the BestSellerSection for a seamless transition.
    */
    <section className="bg-[#FBFBFB] py-12 md:py-20 text-slate-900 font-sans w-full border-t border-slate-100">
      <div className={PAGE_CONTAINER_CLASS}>
        {/* --- SECTION HEADER --- 
            Maintains the same "Line-through" or "Left-aligned" logic 
            used in your Best Seller header for visual brand identity.
        */}
        <div className="mb-12 md:mb-16 flex flex-col items-start">
          <div className="flex items-center gap-3 md:gap-4 w-full">
            <h2 className="text-xl md:text-3xl font-normal text-slate-800 tracking-tight whitespace-nowrap">
              Why Us
            </h2>
            <div className="h-[1px] bg-slate-200 flex-grow"></div>
          </div>
        </div>

        {/* --- FEATURES GRID --- 
            3 columns on desktop, stacked on mobile.
            Clean, balanced spacing (gap-8).
        */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {whyUsData.map(({ id, title, desc, Icon }) => (
            <div
              key={id}
              /* HOVER INTERACTION:
                 - Slight upward move: -translate-y-1
                 - Soft shadow enhancement
                 - Fast, snappy transition (duration-200)
              */
              className="group flex flex-col items-center text-center p-8 md:p-10 bg-white rounded-2xl md:rounded-[2rem] border border-slate-100/50 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)]"
            >
              {/* ICON BLOCK: Slightly larger, minimal, and modern */}
              <div className="mb-6 flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-50 text-slate-700 transition-colors duration-200 group-hover:bg-slate-900 group-hover:text-white">
                <Icon size={28} strokeWidth={1.5} />
              </div>

              {/* TEXT CONTENT: Clean font and subtle hierarchy */}
              <div className="space-y-3">
                <h3 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">
                  {title}
                </h3>
                <p className="text-sm md:text-base text-slate-500 font-normal leading-relaxed max-w-[240px] mx-auto">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
