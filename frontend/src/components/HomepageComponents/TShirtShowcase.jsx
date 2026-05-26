import React from "react";
import { motion as Motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const TShirtShowcase = () => {
  const loomSteps = [
    {
      index: "V-01",
      phase: "MATERIAL EXTRACTION",
      title: "240 GSM INTERLOCK YARN",
      description:
        "Knitted on high-gauge industrial tracks. The extreme structural loop density results in an architectural drop-shoulder silhouette that hangs straight and naturally resists warping.",
      url: "https://res.cloudinary.com/dnypxpkvl/image/upload/v1778347951/products/xhuyy4hjq9n4rlddlrsj.jpg",
      offset: "lg:translate-y-0",
    },
    {
      index: "V-02",
      phase: "STITCH ENGINEERING",
      title: "ANTI-RELAX CORE RIB",
      description:
        "Interlocking twin-needle thread lines stabilize the neckline. Tailored specifically to retain its shape memory through heavy washing and wear cycles without curling.",
      url: "https://images.unsplash.com/photo-1537832816519-689ad163238b?q=80&w=800",
      offset: "lg:translate-y-16", // Asymmetric staggered offset
    },
    {
      index: "V-03",
      phase: "SURFACE CONFIGURATION",
      title: "ORGANIC MINERAL WASH",
      description:
        "The completed garments undergo low-temperature mineral baths to pre-shrunk the cotton bonds. This mechanical relaxation technique ensures an exceptionally soft texture.",
      url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800",
      offset: "lg:translate-y-0",
    },
  ];

  return (
    <section
      className="relative bg-[#FAF9F5] text-zinc-900 py-28 sm:py-40 px-6 sm:px-12 lg:px-24 overflow-hidden"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {/* GLOBAL BACKGROUND CANVAS GUIDES */}
      <div className="absolute inset-0 bg-[#FAF9F5]" />
      <div className="absolute top-0 bottom-0 left-1/4 w-[1px] bg-zinc-200/30 hidden lg:block" />
      <div className="absolute top-0 bottom-0 left-3/4 w-[1px] bg-zinc-200/30 hidden lg:block" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* --- SECTION INTRO: ULTRA SPACED MINIMAL HEADER --- */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 border-b border-zinc-200/80 pb-20 mb-36 lg:mb-48">
          <div className="space-y-8 max-w-3xl">
            <span className="text-[10px] font-medium tracking-[0.5em] text-zinc-400 block uppercase">
              // ARCHIVE COLLECTION SERIES // RE-04
            </span>
            <h2
              className="text-4xl sm:text-6xl lg:text-[5.5rem] font-normal tracking-wide text-zinc-950 uppercase leading-[1.1]"
              style={{ fontFamily: "'Cinzel Decorative', serif" }}
            >
              The Fabric <br />
              <span className="text-zinc-400 font-light block mt-4">
                Deconstruction
              </span>
            </h2>
          </div>

          {/* <div className="lg:max-w-xs space-y-6 lg:pt-24">
            <p className="text-xs font-medium tracking-widest text-zinc-800 uppercase leading-relaxed">
              Analyzing the automated processing loops behind each silhouette.
            </p>
            <p className="text-xs text-zinc-500 font-light leading-relaxed tracking-wide">
              No artificial dyes or chemical structures. Just pure raw
              manufacturing metrics tailored into premium oversized streetwear
              statements.
            </p>
          </div> */}
        </div>

        {/* --- THE UNLOCKED ASYMMETRIC PICTURE GRID --- */}
        {/* Images are fully borderless and framed with absolute spatial independence */}
        <div className="flex flex-col gap-32 sm:gap-48 lg:grid lg:grid-cols-3 lg:gap-12 items-start">
          {loomSteps.map((step) => (
            <div
              key={step.index}
              className={`flex flex-col space-y-10 group w-full ${step.offset}`}
            >
              {/* IMAGE HOUSING LAYER: Completely free of borders and outlines */}
              <div className="w-full aspect-[3/4] overflow-hidden rounded-[2.5rem] bg-zinc-100 shadow-sm transition-all duration-1000 ease-out group-hover:shadow-xl group-hover:rounded-[1.5rem]">
                <img
                  src={step.url}
                  alt={step.title}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
                  loading="lazy"
                />
              </div>

              {/* DETAILS METRIC CHANNELS: Generously spaced tracking blocks */}
              <div className="space-y-6 px-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-zinc-400">
                    <span className="text-[10px] font-bold tracking-[0.3em] font-mono">
                      {step.index}
                    </span>
                    <div className="w-6 h-[1px] bg-zinc-200" />
                    <span className="text-[10px] font-medium tracking-[0.2em] uppercase">
                      {step.phase}
                    </span>
                  </div>

                  <h3
                    className="text-lg sm:text-xl font-bold tracking-wide text-zinc-950 uppercase pt-1"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {step.title}
                  </h3>
                </div>

                <p className="text-zinc-600 text-xs sm:text-[13px] font-light leading-relaxed tracking-wide">
                  {step.description}
                </p>

                <div className="flex items-center gap-4 text-[9px] text-zinc-400 tracking-widest font-mono pt-2 border-t border-zinc-100">
                  <span>[ STRCT // PASS ]</span>
                  <span>[ YLD // 100% ]</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- SECTION TERMINATION FOOTER --- */}
        <div className="mt-48 sm:mt-64 border-t border-zinc-200 pt-16 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
          <div className="space-y-2">
            <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-zinc-400">
              TEEZMART PROCESS SYSTEM
            </p>
            <h4 className="text-xs text-zinc-500 font-light tracking-wide">
              All sequences logged, verified, and certified for distribution.
            </h4>
          </div>

          <Link to="/catalog">
            <Motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 bg-zinc-950 text-white px-6 py-3.5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] shadow-lg shadow-zinc-950/10 hover:bg-zinc-900 transition-colors"
            >
              <span>Enter Studio Catalog</span>
              <ArrowUpRight size={14} strokeWidth={2} />
            </Motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TShirtShowcase;
