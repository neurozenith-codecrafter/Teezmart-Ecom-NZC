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
    <section className="bg-[#FBFBFB] py-12 md:py-20 text-slate-900 font-sans w-full border-t border-slate-100">
      <div className={PAGE_CONTAINER_CLASS}>
        {/* --- SECTION HEADER --- */}
        <div className="mb-10 md:mb-14 flex flex-col items-start">
          <div className="flex items-center gap-3 md:gap-4 w-full">
            <h2 className="text-xl md:text-3xl font-normal text-slate-800 tracking-tight whitespace-nowrap">
              Why Us
            </h2>
            <div className="h-[1px] bg-slate-200 flex-grow"></div>
          </div>
        </div>

        {/* --- BRAND STORY PARAGRAPH --- 
            FIXED: Added 'md:border-2 md:border-dotted md:border-slate-200' 
            Added 'md:rounded-[2.5rem]' and 'md:bg-white/40' for a premium look
        */}
        <div className="mb-12 md:mb-24 max-w-5xl mx-auto md:p-12 md:border-2 md:border-dotted md:border-slate-200 md:rounded-[3rem] md:bg-white/40 transition-all duration-300 hover:border-slate-300">
          <p className="text-[15px] md:text-lg text-slate-600 font-light leading-relaxed italic opacity-90 text-justify md:text-center [hyphens:auto] px-2 md:px-0">
            "At TeezMart, we don’t just make t-shirts — we craft oversized
            comfort with attitude. Our collections are designed for those who
            love to stand out, offering a wide range of unique styles from
            minimal aesthetics to bold streetwear statements. Every piece is
            made using premium-quality fabrics that feel soft, breathable, and
            incredibly comfortable for all-day wear. We focus on delivering the
            perfect blend of durability and style, ensuring that your tee looks
            fresh even after multiple washes. And the best part? You get all of
            this at prices that don’t burn your wallet, because great fashion
            should be accessible to everyone. So go ahead, pick your vibe, wear
            it loud, and let your tee do the talking."
          </p>
        </div>

        {/* --- FEATURES GRID (Hidden on Mobile) --- */}
        <div className="hidden md:grid grid-cols-3 gap-8 md:gap-10">
          {whyUsData.map(({ id, title, desc, Icon }) => (
            <div
              key={id}
              className="group flex flex-col items-center text-center p-8 md:p-10 bg-white rounded-2xl md:rounded-[2rem] border border-slate-100/50 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)]"
            >
              <div className="mb-6 flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-50 text-slate-700 transition-colors duration-200 group-hover:bg-slate-900 group-hover:text-white">
                <Icon size={28} strokeWidth={1.5} />
              </div>

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
