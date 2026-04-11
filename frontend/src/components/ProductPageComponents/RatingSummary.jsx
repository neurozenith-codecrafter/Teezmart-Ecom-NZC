import React from "react";
import { Star } from "lucide-react";

const RatingSummary = () => {
  const distribution = [
    { stars: 5, width: "w-[85%]" },
    { stars: 4, width: "w-[30%]" },
    { stars: 3, width: "w-[12%]" },
    { stars: 2, width: "w-[5%]" },
    { stars: 1, width: "w-[2%]" },
  ];

  return (
    <section className="w-full pt-16 pb-8 border-t border-zinc-100 animate-in fade-in duration-1000">
      {/* 'justify-center' centers the two columns horizontally.
          'items-center' keeps them aligned vertically in the center.
      */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-32 max-w-screen-xl mx-auto">
        {/* --- LEFT SIDE: THE RATING --- */}
        <div className="flex flex-col items-center md:items-start shrink-0 text-center md:text-left">
          <div className="flex items-baseline justify-center md:justify-start">
            <span className="text-8xl font-bold tracking-tighter text-black leading-none">
              4.5
            </span>
            <span className="text-2xl font-light text-zinc-400 ml-2">/5</span>
          </div>
          <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
            (50 New Reviews)
          </p>
        </div>

        {/* --- RIGHT SIDE: THE BREAKDOWN --- */}
        <div className="w-full max-w-[340px] space-y-4 pt-2">
          {distribution.map((item) => (
            <div
              key={item.stars}
              className="flex items-center gap-6 group cursor-default"
            >
              {/* Star + Label */}
              <div className="flex items-center gap-2 w-8 shrink-0">
                <Star
                  size={12}
                  className="fill-black text-black"
                  strokeWidth={1}
                />
                <span className="text-[11px] font-bold text-black">
                  {item.stars}
                </span>
              </div>

              {/* Progress Bar Track */}
              <div className="flex-grow h-[3px] bg-zinc-100 rounded-full relative overflow-hidden">
                <div
                  className={`absolute top-0 left-0 h-full bg-black rounded-full transition-all duration-700 ease-out group-hover:bg-zinc-800 ${item.width}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RatingSummary;
