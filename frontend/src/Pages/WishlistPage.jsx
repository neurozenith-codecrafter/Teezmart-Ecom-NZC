import { Link, useNavigate } from "react-router-dom";
import { Heart, Trash2, ArrowRight, Star } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "../Hooks/useWishlist";
import { useCart } from "../Hooks/useCart";
import { PAGE_CONTAINER_CLASS } from "../constants/pageLayout";
import { useState } from "react";

const WishlistPage = () => {
  const navigate = useNavigate();
  const { wishlistItems, handleToggleWishlist } = useWishlist();
  const { handleAddToCart } = useCart();
  const [loadingProductId, setLoadingProductId] = useState(null);

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

  if (!wishlistItems.length) {
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
            <span className="text-zinc-200">/ {wishlistItems.length}</span>
          </h1>
          <p className="text-zinc-400 text-xs font-medium tracking-widest uppercase">
            Your personal curation.
          </p>
        </div>
      </div>

      <main className="w-full">
        {/* Exact Grid spacing from Img1: gap-x-6 gap-y-14 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-14 md:gap-x-8 md:gap-y-16">
          <AnimatePresence mode="popLayout">
            {wishlistItems.map((item) => (
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
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={10}
                            fill={
                              i < (item.rating || 4) ? "currentColor" : "none"
                            }
                            stroke="currentColor"
                            strokeWidth={2}
                          />
                        ))}
                      </div>
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
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default WishlistPage;
