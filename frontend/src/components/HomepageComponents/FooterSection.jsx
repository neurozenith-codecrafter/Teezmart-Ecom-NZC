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
      <a
        href="#"
        className="hover:text-slate-950 hover:scale-110 transition-all duration-300"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
        </svg>
      </a>
      <a
        href="#"
        className="hover:text-slate-950 hover:scale-110 transition-all duration-300"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      </a>
      <a
        href="#"
        className="hover:text-slate-950 hover:scale-110 transition-all duration-300"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
          <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
        </svg>
      </a>
      <a
        href="#"
        className="hover:text-slate-950 hover:scale-110 transition-all duration-300"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-10.6 8.38 8.38 0 0 1 3.9.9L22 4z"></path>
        </svg>
      </a>
    </div>
  </div>
);

const FooterSection = ({ compactMobile = false }) => {
  return (
    <footer className="relative bg-gradient-to-b from-white via-zinc-50 to-slate-100 pt-24 pb-12 text-slate-900 font-sans w-full border-t border-slate-200/50">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#32F18F]/20 to-transparent" />

      {compactMobile && (
        <div className={`md:hidden ${PAGE_CONTAINER_CLASS}`}>
          <FooterBrandBlock />
        </div>
      )}

      <div className={PAGE_CONTAINER_CLASS}>
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20 mb-24 ${compactMobile ? "hidden md:grid" : ""}`}
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
                  strokeWidth={1.5}
                  className="text-slate-400 group-hover:text-slate-900 transition-colors"
                />
                <span className="text-sm text-slate-600 font-medium leading-snug">
                  75 TeezMart Blvd,
                  <br />
                  New York, NY 10001
                </span>
              </div>
              <div className="flex items-center gap-4 group">
                <Mail
                  size={18}
                  strokeWidth={1.5}
                  className="text-slate-400 group-hover:text-slate-900 transition-colors"
                />
                <span className="text-sm text-slate-600 font-medium">
                  care@teezmart.com
                </span>
              </div>
              <div className="flex items-center gap-4 group">
                <PhoneCall
                  size={18}
                  strokeWidth={1.5}
                  className="text-slate-400 group-hover:text-slate-900 transition-colors"
                />
                <span className="text-sm text-slate-600 font-medium">
                  +1 (555) 123-4567
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`flex flex-col md:flex-row items-center justify-between pt-12 border-t border-slate-200/60 gap-8 ${compactMobile ? "hidden md:flex" : ""}`}
        >
          <p className="text-[10px] text-slate-400 font-bold tracking-[0.4em] uppercase">
            © NeuroZenith 2026
          </p>

          <div className="flex gap-8 text-[10px] text-slate-400 font-bold tracking-[0.3em] uppercase">
            {["Terms", "Privacy", "Cookies"].map((link) => (
              <span
                key={link}
                className="hover:text-slate-950 cursor-pointer transition-colors"
              >
                {link}
              </span>
            ))}
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-[1px] bg-slate-200"></div>
            <span className="text-[10px] italic text-slate-400 font-medium">
              Wear it loud.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
