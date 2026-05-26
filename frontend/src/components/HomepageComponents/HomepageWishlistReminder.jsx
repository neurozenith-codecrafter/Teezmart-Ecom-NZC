import React from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCommerce } from "../../Hooks/useCommerce";
import useDevice from "../../Hooks/useDevice";

export default function HomepageWishlistReminder() {
  const navigate = useNavigate();
  const { isMobile } = useDevice();

  const { wishlistItems } = useCommerce();
  // Completely vanishes from the homepage if the user hasn't liked anything yet
  if (!wishlistItems || wishlistItems.length === 0) return null;

  return (
    <div className="w-full bg-white py-8 border-b border-zinc-100 my-2">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header Block */}
        <div className="flex items-center justify-between mb-5">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-zinc-900">
              <Heart
                size={17}
                className="fill-red-500 stroke-red-500 animate-pulse"
              />
              <h2 className="text-[16px] md:text-lg font-bold tracking-tight">
                Your Favorites Playlist
              </h2>
            </div>
            <p className="text-zinc-400 text-[11px] md:text-xs font-medium">
              Don't let the pieces you love slip away.
            </p>
          </div>

          <button
            onClick={() => navigate("/wishlist")}
            className="text-[11px] md:text-xs font-bold text-zinc-500 hover:text-zinc-900 underline underline-offset-4 transition-colors"
          >
            See All Items
          </button>
        </div>

        {/* Horizontal Scroll Layout Container */}
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar snap-x">
          {wishlistItems.map((item, index) => (
            <div
              key={item._id}
              className="flex-none w-[145px] md:w-[170px] snap-start"
              /* Adjusted mobile animation styling below */
              style={
                isMobile
                  ? {
                      animation: "fadeIn 0.3s ease-out both", // Standard fade without vertical movement
                      animationDelay: "0s", // Removed sequential index stacking for immediate loading
                    }
                  : {}
              }
            >
              <div className="space-y-2.5 group">
                {/* Media Wrapper Frame */}
                <div className="relative aspect-[4/5] rounded-[1.8rem] bg-[#F9F9F9] overflow-hidden shadow-sm border border-zinc-100/50">
                  <img
                    src={item.images?.[0]?.url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out md:group-hover:scale-[1.03]"
                  />
                </div>

                {/* Minimalist Details Section */}
                <div className="px-1 space-y-0.5">
                  <h4 className="text-[12px] font-medium text-zinc-800 truncate tracking-tight">
                    {item.title}
                  </h4>

                  {/* Price Tag with clean discount emphasis */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-black text-zinc-900 italic">
                      ₹{item.price}
                    </span>
                    <span className="text-[10px] text-zinc-400 line-through font-medium">
                      ₹{Math.round(item.price * 1.3)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
