import React, { useState, useEffect, useRef } from "react";
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

const ProductCardSkeleton = ({ index = 0 }) => (
  <div className="animate-pulse space-y-4">
    <div className="aspect-[4/5] rounded-[2rem] bg-zinc-200" />
    <div className="space-y-2">
      <div className="h-4 bg-zinc-200 rounded w-3/4" />
      <div className="h-4 bg-zinc-200 rounded w-1/2" />
    </div>
  </div>
);

export const CatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
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

  const sizes = ["S", "M", "L", "XL"];
  const filters = ["Top Collection", "Most Rated", "Best Seller"];
  const sortOptions = ["New", "Trending", "Recommended"];
  const categories = ["tshirt", "tracks"];

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
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm transition-all border ${
              isFilterOpen
                ? "bg-zinc-900 border-zinc-900 text-white"
                : "bg-white border-zinc-200 text-zinc-600 hover:border-black hover:text-black"
            }`}
          >
            <SlidersHorizontal size={13} /> Filter & Sort
          </button>

          <AnimatePresence>
            {isFilterOpen && (
              <>
                {/* Backdrop to close on outside click */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsFilterOpen(false)}
                />

                <Motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-72 bg-white/80 backdrop-blur-xl border border-zinc-200 rounded-[2rem] shadow-2xl z-50 overflow-hidden"
                >
                  <div className="p-6 space-y-6">
                    {/* Category Section - NEW */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        Category
                      </p>
                      <div className="flex gap-2">
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            className="flex-1 py-2.5 rounded-2xl bg-zinc-100 border border-transparent text-[10px] font-bold text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 transition-all active:scale-95"
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Filter Section */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        Filters
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {filters.map((f) => (
                          <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border ${
                              activeFilter === f
                                ? "bg-zinc-900 border-zinc-900 text-white"
                                : "bg-zinc-100 border-transparent text-zinc-600 hover:bg-zinc-200"
                            }`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Size Section */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        Size
                      </p>
                      <div className="flex gap-2">
                        {sizes.map((s) => (
                          <button
                            key={s}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-100 border border-transparent text-[10px] font-bold text-zinc-600 hover:border-zinc-900 transition-all"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="h-px bg-zinc-100" />

                    {/* Sort Section */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        Sort
                      </p>
                      <div className="grid grid-cols-1 gap-1">
                        {sortOptions.map((s) => (
                          <button
                            key={s}
                            onClick={() => setActiveSort(s)}
                            className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-[11px] font-bold transition-all ${
                              activeSort === s
                                ? "bg-zinc-900 text-white"
                                : "text-zinc-600 hover:bg-zinc-100"
                            }`}
                          >
                            {s}
                            {activeSort === s && (
                              <div className="w-1 h-1 rounded-full bg-white" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      <main className="w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-14 md:gap-x-8 md:gap-y-16">
          {products.length === 0 &&
            Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} index={i} />
            ))}

          {products.map((item, index) => (
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
