import React from "react";
import { Star } from "lucide-react";

const RatingSummary = ({ ratingData, reviewCount, ratingsBreakdown }) => {
  // 1. Fallback data structure if backend hasn't loaded yet or data is missing
  // Expecting ratingData to look like: { 1: 2, 2: 5, 3: 10, 4: 50, 5: 100, average: 4.5 }
  const stats = {
    1: ratingsBreakdown?.[1] || ratingsBreakdown?.["1"] || 0,
    2: ratingsBreakdown?.[2] || ratingsBreakdown?.["2"] || 0,
    3: ratingsBreakdown?.[3] || ratingsBreakdown?.["3"] || 0,
    4: ratingsBreakdown?.[4] || ratingsBreakdown?.["4"] || 0,
    5: ratingsBreakdown?.[5] || ratingsBreakdown?.["5"] || 0,
    average: ratingData || 0,
  };

  const totalReviews = reviewCount || 0;

  // 2. Generate the breakdown dynamically
  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = stats[star] || 0;
    // Calculate percentage width; if no reviews, width is 0%
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

    return {
      stars: star,
      width: `${percentage}%`,
      count: count,
    };
  });

  return (
    <section className="w-full pt-16 pb-8 border-t border-zinc-100 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-32 max-w-screen-xl mx-auto">
        {/* --- LEFT SIDE: THE AVERAGE --- */}
        <div className="flex flex-col items-center md:items-start shrink-0 text-center md:text-left">
          <div className="flex items-baseline justify-center md:justify-start">
            <span className="text-8xl font-bold tracking-tighter text-black leading-none">
              {stats.average > 0 ? stats.average.toFixed(1) : "0"}
            </span>
            <span className="text-2xl font-light text-zinc-400 ml-2">/5</span>
          </div>
          <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
            ({totalReviews} Total Reviews)
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
                  className={
                    item.count > 0 ? "fill-black text-black" : "text-zinc-200"
                  }
                  strokeWidth={1}
                />
                <span
                  className={`text-[11px] font-bold ${item.count > 0 ? "text-black" : "text-zinc-300"}`}
                >
                  {item.stars}
                </span>
              </div>

              {/* Progress Bar Track */}
              <div className="flex-grow h-[3px] bg-zinc-100 rounded-full relative overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-black rounded-full transition-all duration-1000 ease-out group-hover:bg-zinc-800"
                  style={{ width: item.width }} // Dynamic Width from calculation
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
