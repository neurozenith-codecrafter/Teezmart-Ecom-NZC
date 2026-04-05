import React from "react";
import { Instagram, Youtube, ArrowRight } from "lucide-react";
import { PAGE_CONTAINER_CLASS } from "../constants/pageLayout";

const FooterSection = () => {
  return (
    <footer className="bg-[#FBFBFB] pt-20 pb-10 text-slate-900 font-sans w-full border-t border-slate-100">
      <div className={PAGE_CONTAINER_CLASS}>
        {/* --- TOP SECTION: BRAND & NEWSLETTER --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          {/* Brand Identity Block */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tighter text-slate-900">
              TeezMart<span className="text-[#32F18F]">.</span>
            </h2>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-sm">
              Crafting oversized comfort with attitude. Join our community and
              stay updated on our latest streetwear drops and minimal
              essentials.
            </p>
            {/* Social Links - Cleaned to Instagram and YouTube */}
            <div className="flex gap-5 text-slate-400">
              <Instagram
                size={20}
                className="hover:text-slate-900 cursor-pointer transition-colors"
              />
              <Youtube
                size={20}
                className="hover:text-slate-900 cursor-pointer transition-colors"
              />
            </div>
          </div>

          {/* Premium Newsletter Input */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-slate-800">
              Newsletter
            </h3>
            <div className="relative max-w-md group">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent border-b border-slate-200 py-3 pr-12 focus:outline-none focus:border-slate-900 transition-colors text-sm placeholder:text-slate-300"
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-slate-400 group-hover:text-slate-900 transition-colors">
                <ArrowRight size={18} strokeWidth={1.5} />
              </button>
            </div>
            <p className="text-[11px] text-slate-400 uppercase tracking-widest">
              Get 10% off your first order.
            </p>
          </div>
        </div>

        {/* --- MIDDLE SECTION: QUICK LINKS --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-20 border-t border-slate-100 pt-16">
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900">
              Shop
            </h4>
            <ul className="text-sm text-slate-500 space-y-2">
              <li className="hover:text-slate-900 cursor-pointer transition-colors">
                Best Sellers
              </li>
              <li className="hover:text-slate-900 cursor-pointer transition-colors">
                New Arrivals
              </li>
              <li className="hover:text-slate-900 cursor-pointer transition-colors">
                Streetwear
              </li>
              <li className="hover:text-slate-900 cursor-pointer transition-colors">
                Accessories
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900">
              Information
            </h4>
            <ul className="text-sm text-slate-500 space-y-2">
              <li className="hover:text-slate-900 cursor-pointer transition-colors">
                Our Story
              </li>
              <li className="hover:text-slate-900 cursor-pointer transition-colors">
                Sustainability
              </li>
              <li className="hover:text-slate-900 cursor-pointer transition-colors">
                Wholesale
              </li>
              <li className="hover:text-slate-900 cursor-pointer transition-colors">
                Careers
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900">
              Support
            </h4>
            <ul className="text-sm text-slate-500 space-y-2">
              <li className="hover:text-slate-900 cursor-pointer transition-colors">
                Shipping Policy
              </li>
              <li className="hover:text-slate-900 cursor-pointer transition-colors">
                Returns & Exchanges
              </li>
              <li className="hover:text-slate-900 cursor-pointer transition-colors">
                Size Guide
              </li>
              <li className="hover:text-slate-900 cursor-pointer transition-colors">
                Contact Us
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900">
              Legal
            </h4>
            <ul className="text-sm text-slate-500 space-y-2">
              <li className="hover:text-slate-900 cursor-pointer transition-colors">
                Privacy Policy
              </li>
              <li className="hover:text-slate-900 cursor-pointer transition-colors">
                Terms of Service
              </li>
              <li className="hover:text-slate-900 cursor-pointer transition-colors">
                Cookie Settings
              </li>
            </ul>
          </div>
        </div>

        {/* --- BOTTOM SECTION: COPYRIGHT --- */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-10 border-t border-slate-100 gap-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="h-[1px] bg-slate-200 flex-grow w-12 md:hidden"></div>
            <p className="text-[11px] text-slate-400 font-medium tracking-widest uppercase text-center">
              © NeuroZenith 2026
            </p>
            <div className="h-[1px] bg-slate-200 flex-grow w-12 md:hidden"></div>
          </div>

          <div className="flex gap-6 text-[11px] text-slate-400 font-medium tracking-widest uppercase">
            <span className="hover:text-slate-900 cursor-pointer transition-colors italic">
              Built for Comfort
            </span>
            <span className="hover:text-slate-900 cursor-pointer transition-colors italic">
              Worn with Attitude
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
