import React, { useEffect, useRef, useState } from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useCart } from "../Hooks/useCart";
import { useWishlist } from "../Hooks/useWishlist";
import RatingComponent from "../components/RatingComponent";
import { Toasts } from "../components/Toasts";
import Filter from "../components/Filter";
import useDevice from "../Hooks/useDevice";

const ProductCard = ({
  product,
  index,
  isLiked,
  handleAddToCart,
  onToggleWishlist,
  triggerToast,
}) => {
  const [isAdded, setIsAdded] = useState(false);

  const isMobile = useDevice();

  const onAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const added = await handleAddToCart({
        productId: product._id,
        quantity: 1,
        size: product?.sizes?.[0],
      });
      if (!added) return;

      setIsAdded(true);
      triggerToast("cart", "Added to cart");
    } finally {
      setTimeout(() => setIsAdded(false), 1500);
    }
  };

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = await onToggleWishlist(product);
    if (nextState === null) return;

    triggerToast(
      "wishlist",
      nextState ? "Added to wishlist" : "Removed from wishlist",
    );
  };

  return (
    <Motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: isMobile ? "-20px" : "-50px",
      }}
      transition={{
        delay: isMobile ? (index % 4) * 0.06 : (index % 4) * 0.1,
        duration: isMobile ? 0.75 : 0.85,
        type: isMobile ? "tween" : "spring",
        ease: [0.215, 0.61, 0.355, 1.0],
      }}
      className="group"
    >
      <Link to={`/product/${product.slug}`} className="block relative">
        <div className="space-y-4">
          <div className="relative aspect-[4/5] rounded-[2rem] md:rounded-[2.4rem] bg-[#F3F3F3] overflow-hidden transition-all duration-500 active:opacity-90 active:scale-[0.99]">
            <button
              type="button"
              onClick={toggleWishlist}
              className="absolute top-5 right-5 z-10 p-3 rounded-full bg-white/80 border border-white/40 transition-transform duration-200 active:scale-90 shadow-sm"
            >
              <Motion.div
                animate={isLiked ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                <Heart
                  size={18}
                  className={`transition-colors duration-300 ${isLiked ? "fill-red-500 stroke-red-500" : "text-zinc-600"}`}
                />
              </Motion.div>
            </button>

            <img
              src={product.images?.[0]?.url}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-1000 md:group-hover:scale-103"
            />

            <div
              className="
                absolute bottom-5 left-1/2 -translate-x-1/2
                transition-all duration-300
                opacity-0 pointer-events-none
                md:opacity-0 md:pointer-events-none
                md:group-hover:opacity-100
                md:group-hover:translate-y-0
                md:group-hover:pointer-events-auto
              "
            >
              <Motion.button
                type="button"
                onClick={onAdd}
                animate={{
                  backgroundColor: isAdded ? "#18181b" : "#ffffff",
                  color: isAdded ? "#ffffff" : "#18181b",
                }}
                className="backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em] px-8 py-3.5 rounded-full shadow-2xl border border-zinc-200/50"
              >
                <AnimatePresence mode="wait">
                  <Motion.span
                    key={isAdded ? "added" : "add"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-2"
                  >
                    {isAdded ? "Success" : "Quick Add +"}
                  </Motion.span>
                </AnimatePresence>
              </Motion.button>
            </div>
          </div>

          <div className="space-y-1.5 px-1">
            <h3 className="text-[15px] font-medium text-zinc-900 truncate tracking-tight">
              {product.title}
            </h3>
            <div className="flex items-center gap-1.5">
              <RatingComponent rating={product.rating} />
              <span className="text-[10px] text-zinc-400 font-bold tracking-tighter">
                {product.rating}
              </span>
            </div>
            <div className="flex items-center gap-2 pt-0.5">
              <span className="text-[17px] font-black text-zinc-900 tracking-tighter italic">
                Rs.{product.price}
              </span>
              <span className="text-red-500 text-[10px] font-black uppercase italic">
                -30%
              </span>
            </div>
          </div>
        </div>
      </Link>
    </Motion.div>
  );
};

const ProductCardSkeleton = ({ index = 0 }) => {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index % 4) * 0.1, duration: 0.4 }}
      className="group animate-pulse"
    >
      <div className="block relative">
        <div className="space-y-4">
          <div className="relative aspect-[4/5] rounded-[2rem] md:rounded-[2.4rem] bg-zinc-200 overflow-hidden">
            <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-zinc-300" />
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]" />
            </div>
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-24 h-8 bg-zinc-300 rounded-full" />
          </div>
          <div className="space-y-2 px-1">
            <div className="h-4 w-3/4 bg-zinc-200 rounded" />
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="w-3 h-3 bg-zinc-200 rounded" />
                ))}
              </div>
              <div className="h-3 w-6 bg-zinc-200 rounded" />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <div className="h-4 w-16 bg-zinc-200 rounded" />
              <div className="h-3 w-10 bg-zinc-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    </Motion.div>
  );
};

export const CatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productNotAvailable, setProductNotAvailable] = useState(false);
  const toastTimeoutRef = useRef(null);
  const [toast, setToast] = useState({
    type: "cart",
    message: "",
    isVisible: false,
  });

  const { handleAddToCart } = useCart();
  const { wishlistIds, handleToggleWishlist } = useWishlist(); 

  const triggerToast = (type, message) => {
    setToast({ type, message, isVisible: true });
    window.clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast((prev) => ({ ...prev, isVisible: false }));
    }, 3000);
  };

  useEffect(
    () => () => {
      window.clearTimeout(toastTimeoutRef.current);
    },
    [],
  );

  return (
    <div className="min-h-screen bg-[#FBFBFB] pt-6 md:pt-10 pb-20 px-4 md:px-10 lg:px-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-zinc-100 pb-8">
        <div className="space-y-1">
          <h1 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tighter uppercase italic leading-none">
            The Collection <span className="text-zinc-200">/ 26</span>
          </h1>
          <p className="text-zinc-400 text-xs font-medium tracking-widest uppercase">
            Curated streetwear for the digital age.
          </p>
        </div>

        <div className="relative">
          <Filter
            products={{
              items: products,
              setItems: setProducts,
              isLoading,
              setIsLoading,
              productNotAvailable,
              setProductNotAvailable,
            }}
          />
        </div>
      </div>

      <main className="w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-14 md:gap-x-8 md:gap-y-16">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} index={i} />
            ))
          ) : productNotAvailable ? (
            <div className="col-span-full text-center py-10 text-zinc-500">
              No products found
            </div>
          ) : (
            products.map((item, index) => (
              <ProductCard
                key={item._id}
                product={item}
                index={index}
                isLiked={wishlistIds.has(String(item._id))}
                handleAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                triggerToast={triggerToast}
              />
            ))
          )}
        </div>
      </main>
      <Toasts
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default CatalogPage;
