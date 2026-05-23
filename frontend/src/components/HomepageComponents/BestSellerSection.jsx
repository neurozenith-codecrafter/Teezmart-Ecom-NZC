import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { PAGE_CONTAINER_CLASS } from "../../constants/pageLayout";
import { useCart } from "../../Hooks/useCart";
import { useWishlist } from "../../Hooks/useWishlist";
import RatingComponent from "../RatingComponent";
import { Toasts } from "../Toasts";
import useDevice from "../../Hooks/useDevice";

const ProductCard = ({ item, isLiked, onLikeToggle, handleAddToCart }) => {
  const [isAdded, setIsAdded] = useState(false);
  const toastTimeoutRef = useRef(null);

  const { isMobile } = useDevice();

  const [toast, setToast] = useState({
    type: "cart",
    message: "",
    isVisible: false,
  });

  const onAdd = async () => {
    let added = false;

    try {
      added = await handleAddToCart({
        productId: item._id,
        quantity: 1,
        size: item?.sizes?.[0],
      });
      if (!added) return false;

      setIsAdded(true);
      triggerToast("cart", "Added to cart");
      return true;
    } finally {
      if (added) {
        setTimeout(() => setIsAdded(false), 1500);
      }
    }
  };

  const triggerToast = (type, msg) => {
    setToast({ type: type, message: msg, isVisible: true });
    window.clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = window.setTimeout(
      () => setToast((prev) => ({ ...prev, isVisible: false })),
      3000,
    );
  };

  useEffect(
    () => () => {
      window.clearTimeout(toastTimeoutRef.current);
    },
    [],
  );

  return (
    <Link to={`/product/${item.slug}`} className="block relative group">
      <div className="space-y-3.5">
        {/* Card Container */}
        <div
          className={`relative aspect-[4/5] rounded-[2rem] md:rounded-[2.4rem] bg-[#F3F3F3] overflow-hidden transition-all duration-500 ${
            !isMobile
              ? "group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)]"
              : ""
          }`}
        >
          {/* Wishlist Button */}
          <button
            type="button"
            onClick={async (e) => {
              e.preventDefault();
              const nextState = await onLikeToggle();
              if (nextState === null) return;

              triggerToast(
                "wishlist",
                nextState ? "Added to wishlist" : "Removed from wishlist",
              );
            }}
            className={`absolute top-3 right-3 md:top-5 md:right-5 z-10 p-2 md:p-3 rounded-full border border-zinc-200/30 transition-all active:scale-90 duration-300 shadow-sm ${
              isMobile ? "bg-white" : "bg-white/90 hover:scale-110"
            }`}
          >
            {isMobile ? (
              <Heart
                size={16}
                className={`transition-colors duration-300 ${isLiked ? "fill-red-500 stroke-red-500" : "text-zinc-600"}`}
              />
            ) : (
              <Motion.div
                animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart
                  size={17}
                  className={`transition-colors duration-300 ${isLiked ? "fill-red-500 stroke-red-500" : "text-zinc-600"}`}
                />
              </Motion.div>
            )}
          </button>

          {/* Product Image */}
          <img
            src={item.images?.[0]?.url}
            alt={item.title}
            className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
              !isMobile ? "group-hover:scale-[1.03]" : ""
            }`}
          />

          {/* Desktop Only: Quick Add Button */}
          {!isMobile && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden md:block">
              <Motion.button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAdd();
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 26,
                  mass: 0.4,
                }}
                animate={{
                  backgroundColor: isAdded ? "#18181b" : "#ffffff",
                  color: isAdded ? "#ffffff" : "#18181b",
                  scale: isAdded ? 0.96 : 1,
                }}
                className="text-[10px] font-bold uppercase tracking-[0.2em] px-8 py-3.5 rounded-full shadow-xl border border-zinc-100 transition-colors"
              >
                <AnimatePresence mode="wait">
                  <Motion.span
                    key={isAdded ? "added" : "add"}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.12 }}
                    className="flex items-center gap-2"
                  >
                    {isAdded ? "Success ✓" : "Quick Add"}
                  </Motion.span>
                </AnimatePresence>
              </Motion.button>
            </div>
          )}
        </div>

        {/* Metadata Information Footer */}
        <div className="space-y-1 px-1.5">
          <h3 className="text-[15px] font-medium text-zinc-800 truncate tracking-tight">
            {item.title}
          </h3>

          <div className="flex items-center gap-1.5">
            <RatingComponent rating={item.rating} />
            <span className="text-[10px] text-zinc-400 font-bold tracking-tighter">
              {item.rating?.toFixed(1) || "0.0"}
            </span>
          </div>

          <div className="flex items-center gap-2 pt-0.5">
            <div className="text-zinc-900 leading-none">
              <span className="text-[14px] font-normal mr-0.5">₹</span>
              <span className="text-[18px] font-black tracking-tight italic">
                {item.price}
              </span>
            </div>
            <span className="text-[12px] text-zinc-400 line-through font-medium leading-none">
              ₹{Math.round(item.price * 1.3)}
            </span>
            <span className="text-red-500 text-[10px] font-black uppercase tracking-wider leading-none">
              30% OFF
            </span>
          </div>
        </div>
      </div>

      {/* Self-closing toast wrapper fix placed properly inside the main fragment element */}
      <Toasts
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />
    </Link>
  );
};

export const BestSellerSection = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const { handleAddToCart } = useCart();
  const { wishlistIds, handleToggleWishlist } = useWishlist();
  const { isMobile } = useDevice();

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products/recommended`,
        );
        setBestSellers(response.data.data);
      } catch (error) {
        console.log(import.meta.env.VITE_API_URL);
        console.error("Error fetching best sellers:", error);
      }
    };
    fetchBestSellers();
  }, []);

  const toggleLike = async (product) => handleToggleWishlist(product);

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
          {/* Skeleton loaders when bestSellers is empty or null */}
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

            if (isMobile) {
              return (
                <div
                  key={item._id}
                  className="group animate-[fadeInUp_0.4s_ease-out_both]"
                  style={{ animationDelay: `${(index % 4) * 0.05}s` }}
                >
                  <ProductCard
                    item={item}
                    isLiked={isLiked}
                    onLikeToggle={() => toggleLike(item)}
                    handleAddToCart={handleAddToCart}
                  />
                </div>
              );
            }

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
                  onLikeToggle={() => toggleLike(item)}
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
