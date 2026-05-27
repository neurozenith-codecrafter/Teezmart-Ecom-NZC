import React from "react";
import { motion as Motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCommerce } from "../../Hooks/useCommerce";
// import useDevice from "../../Hooks/useDevice";

export const FavoritesSkeleton = () => {
  return (
    <div className="w-full bg-white py-8 border-b border-zinc-100 my-2">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header Block Skeleton */}
        <div className="flex items-center justify-between mb-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {/* Heart Icon Skeleton */}
              <div className="w-[17px] h-[17px] bg-zinc-200 rounded-full animate-pulse" />
              {/* Title Skeleton */}
              <div className="h-5 w-40 md:w-52 bg-zinc-200 rounded-md animate-pulse" />
            </div>
            {/* Subtitle Skeleton */}
            <div className="h-3 w-48 md:w-64 bg-zinc-100 rounded-md animate-pulse" />
          </div>

          {/* Button Skeleton */}
          <div className="h-4 w-20 bg-zinc-200 rounded-md animate-pulse" />
        </div>

        {/* Horizontal Track Skeleton */}
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar snap-x">
          {/* Rendering a static array of 5 cards to fill the mobile track view */}
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="flex-none w-[145px] md:w-[170px] snap-start space-y-2.5"
            >
              {/* Media Frame Skeleton */}
              <div className="relative aspect-[4/5] rounded-[1.8rem] bg-zinc-100 animate-pulse border border-zinc-100/50" />

              {/* Meta Details Skeleton */}
              <div className="px-1 space-y-2">
                {/* Product Title Line */}
                <div className="h-3.5 w-11/12 bg-zinc-100 rounded animate-pulse" />
                {/* Prices Row */}
                <div className="flex items-center gap-1.5">
                  <div className="h-4 w-10 bg-zinc-200 rounded animate-pulse" />
                  <div className="h-3 w-8 bg-zinc-100 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default function HomepageCartReminder() {
  const navigate = useNavigate();
  // const { isMobile } = useDevice();
  const { cart, cartCount, isCartLoading } = useCommerce();

  // If the user has nothing in their cart, the section completely disappears from the homepage layout
  if (!cart || cartCount === 0) return null;

  if (isCartLoading) {
    console.log("Cart is loading, showing skeleton...", isCartLoading);
    return <FavoritesSkeleton />;
  }

  // console.log("Cart loaded with items:", isCartLoading);

  return (
    <div className="w-full bg-zinc-50/50 py-8 border-y border-zinc-100 my-6">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-5">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-zinc-900">
              <ShoppingBag
                size={18}
                strokeWidth={2}
                className="text-zinc-800"
              />
              <h2 className="text-[16px] md:text-lg font-bold tracking-tight">
                Still thinking about these?
              </h2>
            </div>
            <p className="text-zinc-400 text-[11px] md:text-xs font-medium">
              Your pieces are reserved and ready to ship.
            </p>
          </div>

          <button
            onClick={() => navigate("/cart")}
            className="flex items-center gap-1.5 text-zinc-900 text-[11px] md:text-xs font-black uppercase tracking-wider bg-white px-4 py-2 rounded-full border border-zinc-200/60 shadow-sm md:active:scale-95 md:transition-all"
          >
            Open Cart
            <ArrowRight size={14} strokeWidth={2.5} />
          </button>
        </div>

        {/* Horizontal Smooth Track */}
        <div className="flex gap-4 overflow-x-auto pb-3 pt-1 no-scrollbar snap-x h-full">
          {cart?.items?.map((item, index) => (
            <div
              key={item._id + item.image + index}
              /* Removed inline styles entirely. Added desktop-only transition states to save mobile CPU cycles. */
              className="flex-none w-[140px] md:w-[160px] snap-start transition-none md:transition-all md:duration-700 md:ease-[cubic-bezier(0.215,0.61,0.355,1.0)]"
            >
              <div className="space-y-2">
                {/* Media Shell */}
                <div className="relative aspect-[4/5] rounded-2xl bg-zinc-100 overflow-hidden group shadow-sm">
                  <img
                    src={item.image}
                    alt={item.title}
                    /* Restricted the zoom animation strictly to md screens and up */
                    className="w-full h-full object-cover transition-none md:transition-transform md:duration-700 md:group-hover:scale-105"
                  />

                  {/* Subtle Badge Overlay */}
                  <div className="absolute top-2 left-2 bg-zinc-900/90 text-white font-bold text-[8px] tracking-wider uppercase px-2 py-0.5 rounded-md backdrop-blur-sm">
                    In Cart
                  </div>
                </div>

                {/* Micro Meta Section */}
                <div className="px-0.5 space-y-0.5">
                  <h4 className="text-[12px] font-medium text-zinc-800 truncate leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[13px] font-black text-zinc-900 italic tracking-tight">
                    ₹{item.price}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
