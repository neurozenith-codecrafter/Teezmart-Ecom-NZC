import React from "react";
import { Star } from "lucide-react"

const RatingComponent = ({ rating }) => {
  const getStarFillPercent = (rating, index) => {
    // Convert rating to a scale of 0-5 (e.g., 3.3)
    const starValue = rating - index;

    // 1. If the rating hasn't reached this star at all
    if (starValue <= 0) return 0;

    // 2. If the rating fully covers this star
    if (starValue >= 1) return 100;

    // 3. Handle Partial Stars (The "Bug" Fix)
    const percent = starValue * 100;

    // If it's between 1% and 50%, snap it to 50% so it's visible
    if (percent > 0 && percent <= 50) {
      return 50;
    }

    // If it's above 50%, let it render the actual percentage (or snap to 100)
    return percent;
  };

  return (
    <div className="flex text-yellow-400">
      {[...Array(5)].map((_, i) => {
        const fillPercent = getStarFillPercent(rating, i);

        return (
          <div key={i} className="relative">
            {/* Base empty star */}
            <Star
              size={12}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            />

            {/* Dynamic fill */}
            {fillPercent > 0 && (
              <Star
                size={12}
                fill="currentColor"
                stroke="currentColor"
                strokeWidth={1.5}
                className="absolute top-0 left-0"
                style={{
                  clipPath: `inset(0 ${100 - fillPercent}% 0 0)`,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RatingComponent;
