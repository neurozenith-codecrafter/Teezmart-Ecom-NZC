import React from "react";
import { motion as Motion } from "framer-motion";

const TShirtShowcase = () => {
  const images = [
    {
      url: "https://res.cloudinary.com/dnypxpkvl/image/upload/v1778347951/products/xhuyy4hjq9n4rlddlrsj.jpg",
      size: "large",
      label: "01 / Silhouette",
    },
    {
      url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800",
      size: "small",
      label: "02 / Texture",
    },
    {
      url: "https://images.unsplash.com/photo-1537832816519-689ad163238b?q=80&w=800",
      size: "medium",
      label: "03 / Detail",
    },
    {
      url: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=800",
      size: "small",
      label: "04 / Palette",
    },
  ];

  return (
    <section className="bg-white py-20 md:py-32 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* --- Header Section: Bold & Attitude --- */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-16 md:mb-24 gap-12 relative">
          {/* 1. Background "Statement" Text - Fills the central void */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block opacity-[0.03] select-none pointer-events-none">
            <h3 className="text-[200px] font-black tracking-tighter uppercase whitespace-nowrap">
              Premium
            </h3>
          </div>

          <Motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl relative z-10"
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[#B89868] font-[Satisfy] text-4xl block">
                Beyond the Tee
              </span>
              {/* 2. Visual bridge: A thin line connecting the script to the headline */}
              <div className="h-[1px] flex-grow bg-zinc-100 hidden md:block" />
            </div>

            <h2 className="text-6xl md:text-8xl font-black text-zinc-900 tracking-tighter leading-[0.85] uppercase">
              OVERSIZED <br /> <span className="text-zinc-300">ATTITUDE.</span>
            </h2>

            <p className="mt-8 text-xl md:text-2xl font-medium text-zinc-800 leading-snug">
              At TeezMart, we don’t just make t-shirts —{" "}
              <br className="hidden md:block" />
              we craft oversized comfort with attitude.
            </p>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            /* 3. Shifted alignment: Pulls the secondary text into the "flow" */
            className="md:pt-32 relative z-10"
          >
            {/* 4. Added "Brand DNA" stamps to fill space above the paragraph */}
            <div className="flex gap-2 mb-6">
              {["EST 2024", "HQ: INDIA", "LIMITED"].map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] font-bold px-2 py-1 bg-zinc-50 text-zinc-400 border border-zinc-100 rounded-full uppercase tracking-tighter"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="w-20 h-[2px] bg-[#B89868] mb-6" />
            <p className="text-zinc-500 text-sm md:text-base max-w-xs font-light leading-relaxed">
              Designed for those who love to stand out, offering unique styles
              from minimal aesthetics to bold streetwear statements.
            </p>

            {/* 5. A "Discovery" Link - Fills the bottom of the column */}
            <button className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#B89868] hover:text-zinc-900 transition-colors">
              View All Chapters +
            </button>
          </Motion.div>
        </div>

        {/* --- Narrative Masonry Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-20 md:gap-x-10 items-center">
          {/* Feature 1: Quality & Fabric */}
          <div className="md:col-span-6 order-2 md:order-1 px-4 md:px-0">
            <Motion.div
              whileHover={{ scale: 0.98 }}
              /* 1. Removed overflow-hidden so the inner box can hang out */
              className="relative aspect-[4/5] bg-zinc-100 rounded-sm shadow-2xl"
            >
              <img
                src={images[0].url}
                /* 2. Added rounded-sm here to keep the image corners clean */
                className="w-full h-full object-cover rounded-sm"
                alt="Premium Fabric"
              />

              {/* 3. The Overlapping Box */}
              <Motion.div
                initial={{ x: 20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                /* - translate-x-4 and translate-y-4 pushes it "outside" the parent.
         - md:right-[-30px] and md:bottom-[-30px] creates the offset on desktop.
      */
                className="absolute bottom-[-20px] right-[-10px] md:bottom-[-30px] md:right-[-40px] bg-white p-6 md:p-10 max-w-[280px] shadow-xl z-10 border border-zinc-100"
              >
                <h4 className="text-xs font-black tracking-widest uppercase mb-3 text-zinc-900">
                  The Touch
                </h4>
                <p className="text-sm text-zinc-500 leading-relaxed italic">
                  "Every piece is made using premium-quality fabrics that feel
                  soft, breathable, and incredibly comfortable for all-day
                  wear."
                </p>
              </Motion.div>
            </Motion.div>
          </div>

          {/* Feature 2: Durability Text Breakout */}
          <div className="md:col-span-6 md:pl-12 order-1 md:order-2 self-center">
            <Motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="relative space-y-8"
            >
              {/* Background Watermark - Fills space without clutter */}
              <span className="absolute -top-16 -left-4 text-[120px] font-black text-zinc-50 opacity-[0.03] select-none pointer-events-none">
                02
              </span>

              <div className="space-y-4 relative z-10">
                <h3 className="text-3xl md:text-5xl font-serif italic text-zinc-800 leading-tight">
                  Fresh after every wash. <br />
                  <span className="font-sans not-italic font-black text-[#B89868] text-sm tracking-[0.4em] uppercase">
                    Built to Last
                  </span>
                </h3>

                <p className="text-zinc-500 leading-relaxed max-w-sm text-sm md:text-base">
                  We focus on delivering the perfect blend of durability and
                  style, ensuring that your tee looks fresh even after multiple
                  washes.
                </p>
              </div>

              {/* NEW: Editorial "Tech Specs" - Fills the empty bottom space */}
              <div className="pt-6 border-t border-zinc-100 flex gap-8">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-tighter text-zinc-300">
                    Grade
                  </span>
                  <span className="text-xs font-bold text-zinc-800">
                    Premium Heavyweight
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-tighter text-zinc-300">
                    Finish
                  </span>
                  <span className="text-xs font-bold text-zinc-800">
                    Pre-Shrunk
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-tighter text-zinc-300">
                    Lifespan
                  </span>
                  <span className="text-xs font-bold text-zinc-800">
                    Multi-Season
                  </span>
                </div>
              </div>

              {/* NEW: Minimalist Decorative Graphic */}
              <div className="hidden md:block absolute -right-4 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-zinc-200 to-transparent" />
            </Motion.div>
          </div>

          {/* Feature 3: Accessibility & Wallet */}
          <div className="md:col-span-5 md:mt-20 order-3">
            <Motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="aspect-square overflow-hidden bg-zinc-100 rounded-sm">
                <img
                  src={images[1].url}
                  className="w-full h-full object-cover"
                  alt="Accessible Fashion"
                />
              </div>
              <div className="pr-10">
                <h4 className="font-bold text-zinc-900 uppercase text-sm tracking-widest">
                  Accessible Luxury
                </h4>
                <p className="text-zinc-500 text-sm mt-2 leading-relaxed">
                  Great fashion should be accessible to everyone. We offer
                  premium style at prices that don’t burn your wallet.
                </p>
              </div>
            </Motion.div>
          </div>

          {/* Feature 4: Final Vibe CTA */}
          <div className="md:col-span-7 order-4">
            <div className="relative">
              <Motion.div
                whileHover={{ y: -10 }}
                className="aspect-[16/9] overflow-hidden bg-zinc-100 rounded-sm w-full shadow-lg"
              >
                <img
                  src={images[2].url}
                  className="w-full h-full object-cover"
                  alt="Final Vibe"
                />
              </Motion.div>

              <Motion.div
                initial={{ x: 30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                className="md:absolute -bottom-10 -right-6 bg-zinc-900 p-8 md:p-12 text-white shadow-2xl max-w-md"
              >
                <p className="text-lg md:text-xl font-light leading-snug italic mb-6">
                  "So go ahead, pick your vibe, wear it loud, and let your tee
                  do the talking."
                </p>
                <button className="text-[10px] font-black tracking-[0.4em] uppercase border-b border-[#B89868] pb-2 hover:text-[#B89868] transition-colors">
                  Find Your Vibe
                </button>
              </Motion.div>
            </div>
          </div>
        </div>

        {/* --- Footer Signature: Brand Promise --- */}
        <div className="mt-40 md:mt-60 text-center border-t border-zinc-100 pt-16">
          <p className="text-[#B89868] font-[Satisfy] text-3xl mb-4">
            TeezMart
          </p>
          <h2 className="text-sm font-black tracking-[0.5em] uppercase text-zinc-400">
            Comfort / Attitude / Style
          </h2>
        </div>
      </div>
    </section>
  );
};

export default TShirtShowcase;
