import React, { useState, useEffect } from "react";
import axios from "axios";
import { Star, SlidersHorizontal, Heart, X } from "lucide-react";
import { Link } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useCart } from "../Hooks/useCart";

const ProductCard = ({ product, index, handleAddToCart }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const onAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdded(true);
    try {
      await handleAddToCart({
        productId: product._id,
        quantity: 1,
        size: product?.sizes?.[0],
      });
    } finally {
      setTimeout(() => setIsAdded(false), 1500);
    }
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <Motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 4) * 0.1, duration: 0.5 }}
      className="group"
    >
      <Link to={`/product/${product.slug}`} className="block relative">
        <div className="space-y-4">
          <div className="relative aspect-[4/5] rounded-[2rem] md:rounded-[2.4rem] bg-[#F3F3F3] overflow-hidden transition-all duration-700 group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)]">
            <button
              onClick={toggleWishlist}
              className="absolute top-5 right-5 z-10 p-3 rounded-full bg-white/60 backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-110 active:scale-90 shadow-sm"
            >
              <Motion.div
                animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
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
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <Motion.button
                type="button"
                onClick={onAdd}
                animate={{
                  backgroundColor: isAdded ? "#18181b" : "#ffffff",
                  color: isAdded ? "#ffffff" : "#18181b",
                  scale: isAdded ? 0.95 : 1,
                }}
                className="backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em] px-8 py-3.5 rounded-full shadow-2xl border border-zinc-200/50"
              >
                <AnimatePresence mode="wait">
                  <Motion.span
                    key={isAdded ? "added" : "add"}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
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
              {product.title}
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
              <span className="text-[17px] font-black text-zinc-900 tracking-tighter italic">
                ₹{product.price}
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [activeSort, setActiveSort] = useState("New");
  const { handleAddToCart } = useCart();

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        if (isMounted) setProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching ->", error);
      }
    };
    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  const sizes = ["S", "M", "L", "XL"];
  const filters = ["All", "Top Collection", "Most Rated", "Best Seller"];
  const sortOptions = ["New", "Trending", "Recommended"];

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
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm transition-all border bg-white border-zinc-200 text-zinc-600 hover:border-black hover:text-black"
          >
            <SlidersHorizontal size={13} /> Filter & Sort
          </button>

          <AnimatePresence>
            {isFilterOpen && (
              <>
                <Motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsFilterOpen(false)}
                  className="fixed inset-0 bg-black/20 backdrop-blur-md z-[60]"
                />

                <Motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="fixed inset-0 m-auto md:absolute md:inset-auto md:right-0 md:top-full md:mt-3 w-[90%] md:w-80 h-fit max-h-[90vh] bg-white/95 border border-zinc-200 rounded-[2.5rem] shadow-2xl z-[70] overflow-hidden flex flex-col"
                >
                  <div className="p-6 pb-0 flex justify-between items-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      Filter & Sort
                    </p>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
                    >
                      <X size={16} className="text-zinc-900" />
                    </button>
                  </div>

                  <div className="p-6 space-y-8 overflow-y-auto">
                    {/* Collections Section */}
                    <div className="space-y-3">
                      <p className="text-[9px] font-bold uppercase tracking-tighter text-zinc-400">
                        Collections
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {filters.map((f) => (
                          <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={`px-4 py-2 rounded-full text-[10px] font-bold transition-all border ${
                              activeFilter === f
                                ? "bg-zinc-900 border-zinc-900 text-white"
                                : "bg-zinc-50 border-zinc-100 text-zinc-500 hover:bg-zinc-100"
                            }`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sizes Section */}
                    <div className="space-y-3">
                      <p className="text-[9px] font-bold uppercase tracking-tighter text-zinc-400">
                        Available Sizes
                      </p>
                      <div className="flex gap-2">
                        {sizes.map((s) => (
                          <button
                            key={s}
                            onClick={() => toggleSize(s)}
                            className={`w-11 h-11 flex items-center justify-center rounded-2xl text-[10px] font-bold transition-all border ${
                              selectedSizes.includes(s)
                                ? "bg-zinc-900 border-zinc-900 text-white shadow-lg"
                                : "bg-zinc-50 border-zinc-100 text-zinc-500 hover:border-zinc-300"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sort Section */}
                    <div className="space-y-3">
                      <p className="text-[9px] font-bold uppercase tracking-tighter text-zinc-400">
                        Sort By
                      </p>
                      <div className="grid grid-cols-1 gap-1">
                        {sortOptions.map((s) => (
                          <button
                            key={s}
                            onClick={() => setActiveSort(s)}
                            className={`flex items-center justify-between px-4 py-3 rounded-2xl text-[11px] font-bold transition-all ${
                              activeSort === s
                                ? "bg-zinc-100 text-zinc-900"
                                : "text-zinc-500 hover:bg-zinc-50"
                            }`}
                          >
                            {s}
                            {activeSort === s && (
                              <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 mt-auto">
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="w-full py-4 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-black transition-all shadow-xl active:scale-[0.98]"
                    >
                      Apply Filters
                    </button>
                  </div>
                </Motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      <main className="w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-14 md:gap-x-8 md:gap-y-16">
          {products.length === 0
            ? Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} index={i} />
              ))
            : products.map((item, index) => (
                <ProductCard
                  key={item._id}
                  product={item}
                  index={index}
                  handleAddToCart={handleAddToCart}
                />
              ))}
        </div>

        <div className="mt-24 flex flex-col items-center gap-6">
          <div className="w-px h-12 bg-zinc-200" />
          <button className="px-12 py-4 bg-zinc-900 text-white text-[11px] font-black uppercase tracking-[0.4em] rounded-full hover:bg-black transition-all shadow-2xl active:scale-95">
            View All Products
          </button>
        </div>
      </main>
    </div>
  );
};

export default CatalogPage;
