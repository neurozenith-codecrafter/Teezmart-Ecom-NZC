import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Heart, Trash2, ArrowRight } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "../Hooks/useWishlist";
import { useCart } from "../Hooks/useCart";
import { PAGE_CONTAINER_CLASS } from "../constants/pageLayout";
import RatingComponent from "../components/RatingComponent"

const WishlistCardSkeleton = ({ index = 0 }) => {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index % 4) * 0.08, duration: 0.35 }}
      className="group animate-pulse"
    >
      <div className="space-y-4">
        <div className="relative aspect-[4/5] rounded-[2rem] md:rounded-[2.4rem] overflow-hidden bg-[linear-gradient(145deg,#f6f6f6_0%,#ececec_100%)] border border-white/70 shadow-[0_20px_45px_-25px_rgba(0,0,0,0.18)]">
          <div className="absolute top-5 right-5 h-11 w-11 rounded-full bg-white/80 border border-zinc-200/80 shadow-sm" />

          <div className="absolute inset-x-5 top-6 h-[72%] rounded-[1.6rem] bg-gradient-to-br from-white/60 via-zinc-100/90 to-zinc-200/80" />

          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-y-0 -left-1/3 w-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[shimmer_1.8s_infinite]" />
          </div>

          <div className="absolute bottom-5 left-1/2 h-12 w-32 -translate-x-1/2 rounded-full bg-white/90 border border-zinc-200/70 shadow-lg" />
        </div>

        <div className="space-y-2 px-1">
          <div className="h-4 w-3/4 rounded-full bg-zinc-200" />
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, starIndex) => (
                <div
                  key={starIndex}
                  className="h-2.5 w-2.5 rounded-full bg-zinc-200"
                />
              ))}
            </div>
            <div className="h-3 w-8 rounded-full bg-zinc-200" />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <div className="h-4 w-16 rounded-full bg-zinc-200" />
            <div className="h-3 w-12 rounded-full bg-zinc-100" />
            <div className="h-5 w-10 rounded-full bg-red-50" />
          </div>
        </div>
      </div>
    </Motion.div>
  );
};

const WishlistPage = () => {
  const navigate = useNavigate();
  const { wishlistItems, isWishlistLoading, handleToggleWishlist } = useWishlist();
  const { handleAddToCart } = useCart();
  const [loadingProductId, setLoadingProductId] = useState(null);

  // Filter out any completely null entries (shouldn't happen after backend cleanup,
  // but guards against stale cached state between delete and next fetch)
  const validItems = wishlistItems.filter((item) => item && item._id);

  const handleMoveToCart = async (product) => {
    const defaultSize = product?.sizes?.[0];
    if (!defaultSize) return;
    setLoadingProductId(product._id);
    try {
      await handleAddToCart({
        productId: product._id,
        quantity: 1,
        size: defaultSize,
      });
    } finally {
      setLoadingProductId(null);
    }
  };

  if (!validItems.length && !isWishlistLoading) {
    return (
      <div className="min-h-[70vh] bg-[#FBFBFB] flex items-center justify-center px-4">
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center max-w-sm"
        >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-zinc-100">
            <Heart className="w-6 h-6 text-zinc-200" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-zinc-900 uppercase italic mb-4">
            Wishlist <span className="text-zinc-300">/ Empty</span>
          </h1>
          <button
            onClick={() => navigate("/catalog")}
            className="flex items-center gap-2 px-8 py-3 rounded-full bg-zinc-900 text-white text-[9px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all mx-auto"
          >
            Start Shopping <ArrowRight size={12} />
          </button>
        </Motion.div>
      </div>
    );
  }

  return (
    // Matching Catalog pt-6 md:pt-10 and px-20 for exact card sizing
    <div className="min-h-screen bg-[#FBFBFB] pt-6 md:pt-10 pb-20 px-4 md:px-10 lg:px-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-zinc-100 pb-8">
        <div className="space-y-1">
          <h1 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tighter uppercase italic leading-none">
            Saved{" "}
            <span className="text-zinc-200">/ {validItems.length}</span>
          </h1>
          <p className="text-zinc-400 text-xs font-medium tracking-widest uppercase">
            Your personal curation.
          </p>
        </div>
      </div>

      <main className="w-full">
        {/* Exact Grid spacing from Img1: gap-x-6 gap-y-14 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-14 md:gap-x-8 md:gap-y-16">
          {isWishlistLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <WishlistCardSkeleton key={index} index={index} />
            ))
          ) : (
            <AnimatePresence mode="popLayout">
              {validItems.map((item) => {
              // Item has an ID but product data is gone (deleted between fetches)
              const isAvailable = !!(item.title && item.images?.length);

              if (!isAvailable) {
                return (
                  <Motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="group"
                  >
                    <div className="space-y-4">
                      <div className="relative aspect-[4/5] rounded-[2rem] md:rounded-[2.4rem] bg-zinc-100 overflow-hidden flex items-center justify-center">
                        <span className="text-zinc-300 text-[10px] font-bold uppercase tracking-widest text-center px-4">
                          No longer available
                        </span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleToggleWishlist(item);
                          }}
                          className="absolute top-5 right-5 z-10 p-3 rounded-full bg-white/60 border border-white/20 transition-all hover:scale-110 active:scale-95 shadow-sm text-rose-500"
                        >
                          <Trash2 size={18} strokeWidth={2} />
                        </button>
                      </div>
                      <div className="px-1">
                        <p className="text-[13px] font-medium text-zinc-400 italic">
                          Product removed
                        </p>
                      </div>
                    </div>
                  </Motion.div>
                );
              }

              return (
                <Motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="group"
                >
                  <div className="space-y-4">
                    {/* IMAGE BOX - Exact Rounded and Aspect Ratio from Img1 */}
                    <div className="relative aspect-[4/5] rounded-[2rem] md:rounded-[2.4rem] bg-[#F3F3F3] overflow-hidden transition-all duration-700 group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)]">
                      <Link to={`/product/${item.slug}`} className="block h-full">
                        <img
                          src={item?.images?.[0]?.url}
                          alt={item.title}
                          className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-90"
                        />
                      </Link>

                      {/* REMOVE BUTTON - Using your Img1 style button position */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleToggleWishlist(item);
                        }}
                        className="absolute top-5 right-5 z-10 p-3 rounded-full bg-white/60 backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm text-rose-500"
                      >
                        <Trash2 size={18} strokeWidth={2} />
                      </button>

                      {/* QUICK ADD OVERLAY - Matching Img1 exactly */}
                      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden md:block">
                        <button
                          onClick={() => handleMoveToCart(item)}
                          disabled={loadingProductId === item._id}
                          className="bg-white/90 backdrop-blur-md text-black text-[10px] font-black uppercase tracking-widest px-8 py-3.5 rounded-full shadow-xl hover:bg-black hover:text-white transition-all disabled:opacity-50"
                        >
                          {loadingProductId === item._id ? "..." : "Quick Add +"}
                        </button>
                      </div>
                    </div>

                    {/* DETAILS - Using Img1 typography */}
                    <div className="space-y-1.5 px-1">
                      <h3 className="text-[15px] font-medium text-zinc-900 truncate tracking-tight">
                        {item.title}
                      </h3>

                      {/* RATING */}
                      <div className="flex items-center gap-1.5">
                        <RatingComponent rating={item.rating}/>
                        <span className="text-[10px] text-zinc-400 font-bold tracking-tighter">
                          {item.rating || "4.5"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="text-[17px] font-black text-zinc-900 tracking-tighter italic">
                          ₹{item.price}
                        </span>
                        {/* Optional: Add discount display if available in your item data to match Img1 exactly */}
                        <span className="text-[12px] text-zinc-300 line-through font-medium">
                          ₹{Math.round(item.price * 1.3)}
                        </span>
                        <span className="text-red-500 text-[10px] font-black uppercase italic">
                          -30%
                        </span>
                      </div>
                    </div>
                  </div>
                  </Motion.div>
              );
              })}
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
};

export default WishlistPage;
