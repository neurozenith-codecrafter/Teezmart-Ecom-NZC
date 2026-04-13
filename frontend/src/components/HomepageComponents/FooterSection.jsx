import React from "react";
import { Mail, MapPin, PhoneCall } from "lucide-react";
import { PAGE_CONTAINER_CLASS } from "../../constants/pageLayout";

const FooterBrandBlock = () => (
  <div className="space-y-4">
    <h2 className="text-3xl font-bold tracking-tighter text-slate-950">
      TeezMart<span className="text-[#32F18F]">.</span>
    </h2>
    <p className="text-slate-500 text-sm leading-relaxed max-w-sm font-medium">
      At TeezMart, we don&apos;t just make t-shirts — we craft oversized comfort
      with attitude. Premium fabrics, unique vibes.
    </p>

    <div className="flex gap-6 text-slate-400">
      {[
        {
          path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
          size: 20,
        },
        { isInsta: true },
        { isX: true },
        {
          path: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-10.6 8.38 8.38 0 0 1 3.9.9L22 4z",
          size: 20,
        },
      ].map((icon, idx) => (
        <a
          key={idx}
          href="#"
          className="hover:text-slate-950 hover:scale-110 transition-all duration-300"
        >
          <svg
            width={icon.size || 20}
            height={icon.size || 20}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {icon.path && <path d={icon.path} />}
            {icon.isInsta && (
              <>
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </>
            )}
            {icon.isX && (
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
  return (
    <footer
      className={`relative bg-gradient-to-b from-white via-zinc-50 to-slate-100 pt-24 pb-20 text-slate-900 font-sans w-full border-t border-slate-200/50 ${compactMobile ? "hidden md:block" : ""}`}
    >
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#32F18F]/20 to-transparent" />

      <div className={PAGE_CONTAINER_CLASS}>
        {/* Main Grid Layout */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20 pb-16 relative ${compactMobile ? "hidden md:grid" : ""}`}
        >
          <div className="space-y-8 flex flex-col items-start">
            <FooterBrandBlock />
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-bold text-slate-400 tracking-[0.3em] uppercase">
              Navigation
            </h4>
            <ul className="text-sm text-slate-600 space-y-4 font-semibold">
              {[
                "About Us",
                "New Arrivals",
                "Best Sellers",
                "Our Story",
                "Careers",
              ].map((link) => (
                <li
                  key={link}
                  className="hover:text-slate-950 hover:translate-x-1 cursor-pointer transition-all duration-200"
                >
                  {link}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-bold text-slate-400 tracking-[0.3em] uppercase">
              Collections
            </h4>
            <ul className="text-sm text-slate-600 space-y-4 font-semibold">
              {[
                "Streetwear Drop",
                "Minimalist Tech",
                "Abstract Graphics",
                "Essentials",
                "Vintage Wash",
              ].map((link) => (
                <li
                  key={link}
                  className="hover:text-slate-950 hover:translate-x-1 cursor-pointer transition-all duration-200"
                >
                  {link}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-bold text-slate-400 tracking-[0.3em] uppercase">
              Contact Us
            </h4>
            <div className="space-y-5 pt-1">
              <div className="flex items-start gap-4 group">
                <MapPin
                  size={18}
                  className="text-slate-400 group-hover:text-slate-900 transition-colors"
                />
                <span className="text-sm text-slate-600 font-medium">
                  75 TeezMart Blvd, <br /> New York, NY 10001
                </span>
              </div>
              <div className="flex items-center gap-4 group">
                <Mail
                  size={18}
                  className="text-slate-400 group-hover:text-slate-900 transition-colors"
                />
                <span className="text-sm text-slate-600 font-medium">
                  care@teezmart.com
                </span>
              </div>
              <div className="flex items-center gap-4 group">
                <PhoneCall
                  size={18}
                  className="text-slate-400 group-hover:text-slate-900 transition-colors"
                />
                <span className="text-sm text-slate-600 font-medium">
                  +1 (555) 123-4567
                </span>
              </div>
            </div>
          </div>

          {/* CENTERED COPYRIGHT BORDER EFFECT */}
          <div className="absolute bottom-0 left-0 w-full h-px bg-slate-200/60 flex items-center justify-center">
            <div className="bg-slate-50 px-6 py-2">
              <p className="text-[10px] text-slate-400 font-bold tracking-[0.5em] uppercase whitespace-nowrap">
                © NeuroZenith 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;

export const MobileCopyright = ({ className = "" }) => {
  return (
    <div
      className={`md:hidden border-t border-slate-200/70 bg-white px-4 py-4 text-center ${className}`}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-slate-400">
        @neurozenith2026
      </p>
    </div>
  );
};
