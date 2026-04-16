import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { PAGE_CONTAINER_CLASS } from "../../constants/pageLayout";
import { useCart } from "../../Hooks/useCart";
import { useWishlist } from "../../Hooks/useWishlist";

const ProductCard = ({ item, isLiked, onLikeToggle, handleAddToCart }) => {
  const [isAdded, setIsAdded] = useState(false);

  const onAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAdded(true);

    try {
      await handleAddToCart({
        productId: item._id,
        quantity: 1,
        size: item?.sizes?.[0],
      });
    } finally {
      setTimeout(() => setIsAdded(false), 1500);
    }
  };

  return (
    <Link to={`/product/${item.slug}`} className="block relative">
      <div className="space-y-4">
        <div className="relative aspect-[4/5] rounded-[2rem] md:rounded-[2.4rem] bg-[#F3F3F3] overflow-hidden transition-all duration-700 group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)]">
          <button
            type="button"
            onClick={onLikeToggle}
            className="absolute top-3 right-3 md:top-5 md:right-5 z-10 p-2 md:p-3 rounded-full bg-white/60 backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-110 active:scale-90 shadow-sm"
          >
            <Motion.div
              animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart
                size={16}
                className={`md:w-[18px] md:h-[18px] transition-colors duration-300 ${
                  isLiked ? "fill-red-500 stroke-red-500" : "text-zinc-600"
                }`}
              />
            </Motion.div>
          </button>

          <img
            src={item.images[0].url}
            alt={item.title}
            className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-90"
          />

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden md:block">
            <Motion.button
              type="button"
              onClick={onAdd}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
                mass: 0.5,
              }}
              animate={{
                backgroundColor: isAdded ? "#18181b" : "#ffffff",
                color: isAdded ? "#ffffff" : "#18181b",
                scale: isAdded ? 0.95 : 1,
              }}
              className="backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em] px-8 py-3.5 rounded-full shadow-2xl border border-zinc-200/50 transition-colors"
            >
              <AnimatePresence mode="wait">
                <Motion.span
                  key={isAdded ? "added" : "add"}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-2"
                >
                  {isAdded ? "Success ✓" : "Quick Add +"}
                </Motion.span>
              </AnimatePresence>
            </Motion.button>
          </div>
        </div>

        <div className="space-y-1.5 px-1">
          <h3 className="text-[15px] font-medium text-zinc-900 truncate tracking-tight">
            {item.title}
          </h3>

          <div className="flex items-center gap-1.5">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={10}
                  fill={i < 4 ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth={2}
                />
              ))}
            </div>
            <span className="text-[10px] text-zinc-400 font-bold tracking-tighter">
              4.5
            </span>
          </div>

          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-[17px] font-black text-zinc-900 tracking-tighter italic leading-none">
              ₹{item.price}
            </span>
            <span className="text-[12px] text-zinc-300 line-through font-medium leading-none">
              ₹{Math.round(item.price * 1.3)}
            </span>
            <span className="text-red-500 text-[10px] font-black uppercase italic leading-none">
              -30%
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const BestSellerSection = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const { handleAddToCart } = useCart();
  const { wishlistIds, handleToggleWishlist } = useWishlist();

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await axios.get("/api/products/recommended");
        setBestSellers(response.data.data);
      } catch (error) {
        console.error("Error fetching best sellers:", error);
      }
    };
    fetchBestSellers();
  }, []);

  const toggleLike = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    await handleToggleWishlist(product);
  };

  return (
    <section className="bg-[#FBFBFB] pt-12 md:pt-20 pb-16 text-slate-900 font-sans w-full">
      <div className={PAGE_CONTAINER_CLASS}>
        {/* HEADER SECTION - Styles preserved as requested */}
        <div className="mb-8 md:mb-14 flex flex-col items-start">
          <div className="flex items-center gap-3 md:gap-4 w-full">
            <h2 className="text-xl md:text-3xl font-normal text-slate-800 tracking-tight whitespace-nowrap">
              Best Sellers
            </h2>
            <div className="h-[1px] bg-slate-200 flex-grow"></div>
          </div>
        </div>

        {/* GRID SECTION - Updated spacing and layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-14 md:gap-x-8 md:gap-y-16">
          {(!bestSellers || bestSellers.length === 0) &&
            [...Array(8)].map((_, i) => (
              <div key={i} className="block relative animate-pulse">
                <div className="space-y-4">
                  {/* Image Skeleton */}
                  <div className="relative aspect-[4/5] rounded-[2rem] md:rounded-[2.4rem] bg-zinc-200 overflow-hidden" />

                  {/* Content Skeleton */}
                  <div className="space-y-2 px-1">
                    {/* Title */}
                    <div className="h-4 w-3/4 bg-zinc-200 rounded" />

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-20 bg-zinc-200 rounded" />
                      <div className="h-3 w-6 bg-zinc-200 rounded" />
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-16 bg-zinc-200 rounded" />
                      <div className="h-3 w-12 bg-zinc-200 rounded" />
                      <div className="h-3 w-8 bg-zinc-200 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            ))}

          {bestSellers.map((item, index) => {
            const isLiked = wishlistIds.has(String(item._id));

            return (
              <Motion.div
                key={item._id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index % 4) * 0.1, duration: 0.5 }}
                className="group"
              >
                <ProductCard
                  item={item}
                  isLiked={isLiked}
                  onLikeToggle={(e) => toggleLike(e, item)}
                  handleAddToCart={handleAddToCart}
                />
              </Motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BestSellerSection;
