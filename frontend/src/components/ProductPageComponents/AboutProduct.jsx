import React from "react";
import { motion as Motion } from "framer-motion";
import { ShieldCheck, Leaf, Sparkles } from "lucide-react";

// Simple, lightweight fade-in variant that won't lag mobile processors
const gentleFadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function AboutProduct({ product }) {
  const fallbackImages = [
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=800&q=80",
  ];
  const images =
    product?.images
      ?.map((image) => (typeof image === "string" ? image : image?.url))
      .filter(Boolean) || fallbackImages;

  return (
    <section className="w-full bg-white py-12 md:py-20 px-4 sm:px-6 lg:px-8 border-t border-zinc-100 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-12 gap-8 md:gap-12 lg:gap-16">
        {/* LEFT COLUMN: Image Presentation Layer */}
        {/* Mobile: Swipeable, frictionless horizontal strip | Desktop: Asymmetric stacked gallery */}
        <div className="lg:col-span-7 flex overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory lg:grid lg:grid-cols-12 gap-4 pb-4 lg:pb-0 scrollbar-none -mx-4 px-4 lg:mx-0 lg:px-0 h-fit">
          {/* Main Feature Image */}
          <div className="min-w-[80%] sm:min-w-[60%] lg:min-w-0 col-span-12 lg:col-span-8 snap-start overflow-hidden rounded-xl md:rounded-2xl bg-zinc-50 border border-zinc-100">
            <img
              src={images[0]}
              alt="Premium fabric closeup"
              className="w-full h-[280px] sm:h-[380px] lg:h-[480px] object-cover hover:scale-[1.01] transition-transform duration-500 ease-out"
              loading="lazy"
            />
          </div>

          {/* Supporting Context Images */}
          <div className="min-w-[80%] sm:min-w-[60%] lg:min-w-0 col-span-12 lg:col-span-4 snap-start grid grid-cols-2 lg:flex lg:flex-col gap-4">
            <div className="overflow-hidden rounded-xl md:rounded-2xl bg-zinc-50 border border-zinc-100 h-[280px] sm:h-[380px] lg:h-[232px]">
              <img
                src={images[1] || images[0]}
                alt="T-shirt tailored fit layout"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="overflow-hidden rounded-xl md:rounded-2xl bg-zinc-50 border border-zinc-100 h-[280px] sm:h-[380px] lg:h-[232px]">
              <img
                src={images[2] || images[0]}
                alt="Stitching detail view"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Marketing Copy & Technical Metrics */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-6 md:space-y-8 lg:sticky lg:top-10">
          <Motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={gentleFadeUp}
            className="space-y-3 md:space-y-4"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-50/60 border border-amber-100/40 text-amber-800 text-[11px] font-medium tracking-wide">
                <Sparkles size={11} />
                Behind The Design
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-medium tracking-tight text-zinc-900 leading-tight">
              Crafted for everyday rhythm, engineered to last.
            </h2>

            <p className="text-[13px] sm:text-[14px] text-zinc-600 leading-relaxed font-light">
              We reimagined what an essential tee should feel like. Stripping
              away heavy dyes and rigid synthetic blends, this piece is cut from
              structured heavyweight cotton that drapes clean without clinging.
              It retains its shape loop after loop, wash after wash.
            </p>
          </Motion.div>

          {/* Micro Feature/Benefit Grid */}
          <Motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={gentleFadeUp}
            className="space-y-4 pt-4 border-t border-zinc-100"
          >
            {/* Benefit Item 1 */}
            <div className="flex gap-3 sm:gap-4 items-start">
              <div className="p-2 bg-emerald-50/60 border border-emerald-100/40 rounded-xl text-emerald-800 shrink-0">
                <Leaf size={15} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-0.5">
                  Breathable Combed Fiber
                </h4>
                <p className="text-[12px] sm:text-[13px] text-zinc-500 font-light leading-snug">
                  100% long-staple organic cotton yarns combed clean to
                  eliminate rough micro-knots against your skin.
                </p>
              </div>
            </div>

            {/* Benefit Item 2 */}
            <div className="flex gap-3 sm:gap-4 items-start">
              <div className="p-2 bg-stone-50 border border-stone-200/60 rounded-xl text-stone-700 shrink-0">
                <ShieldCheck size={15} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-0.5">
                  Anti-Relax Rib Collar
                </h4>
                <p className="text-[12px] sm:text-[13px] text-zinc-500 font-light leading-snug">
                  Reinforced double-needle stitched neckline tailored to sit
                  flat. No sagging, curling, or warping over time.
                </p>
              </div>
            </div>
          </Motion.div>

          {/* Metric Technical Badges */}
          <div className="grid grid-cols-3 gap-3 pt-2 text-center">
            <div className="bg-zinc-50/60 rounded-xl p-2.5 sm:p-3 border border-zinc-100">
              <span className="block text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Weight
              </span>
              <span className="text-xs sm:text-sm font-medium text-zinc-800 mt-0.5 block">
                240 GSM
              </span>
            </div>
            <div className="bg-zinc-50/60 rounded-xl p-2.5 sm:p-3 border border-zinc-100">
              <span className="block text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Pre-Shrunk
              </span>
              <span className="text-xs sm:text-sm font-medium text-zinc-800 mt-0.5 block">
                Yes
              </span>
            </div>
            <div className="bg-zinc-50/60 rounded-xl p-2.5 sm:p-3 border border-zinc-100">
              <span className="block text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Dye Type
              </span>
              <span className="text-xs sm:text-sm font-medium text-zinc-800 mt-0.5 block">
                Low Impact
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
