import React, { useState, useEffect } from "react";
import axios from "axios";
import { Star, SlidersHorizontal, Heart, X, RotateCcw } from "lucide-react";
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
  const categories = [
    { label: "T-Shirt", value: "tshirt" },
    { label: "Tracks", value: "trackpant" },
  ];
  const filters = [
    { label: "All", value: "all" },
    { label: "Top Collection", value: "best" },
    { label: "Most Rated", value: "rated" },
  ];
  const sortOptions = [
    { label: "New", value: "new" },
    { label: "Rating (High to Low)", value: "rating_desc" },
    { label: "Underrated", value: "underrated" },
  ];
  const sizes = ["S", "M", "L", "XL", "XXL"];

  const [products, setProducts] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [activeSort, setActiveSort] = useState("new");
  const [activeCategory, setActiveCategory] = useState(null);

  const [productNotAvailable, setProductNotAvailable] = useState(false);

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

  // 🔹 Normalize category

  const toggleSize = (size) => {
    setSelectedSizes((prev) => {
      // Remove if already selected
      if (prev.includes(size)) {
        return prev.filter((s) => s !== size);
      }

      // Add if not selected
      return [...prev, size];
    });
  };

  const buildFilterQuery = ({ category, filter, sizes, sort }) => {
    const params = new URLSearchParams();

    // 🔹 Normalize category
    if (category) {
      params.append("category", category);
    }

    // 🔹 Normalize filter
    if (filter !== "all") {
      params.append("collection", filter);
    }

    // 🔹 Normalize sizes
    if (sizes?.length) {
      params.append("sizes", sizes.join(","));
    }

    // 🔹 Normalize sort
    if (sort !== "new") {
      params.append("sort", sort);
    }

    return params.toString();
  };

  const handleApply = async () => {
    const query = buildFilterQuery({
      category: activeCategory,
      filter: activeFilter,
      sizes: selectedSizes,
      sort: activeSort,
    });

    const url = query
      ? `/api/products/filter?${query}`
      : `/api/products/filter`;

    const res = await axios.get(url);

    setProducts(res.data.products);
    setIsFilterOpen(false);

    setProductNotAvailable(res.data.count === 0);
  };

  const handleReset = async () => {
    // 🔹 Reset UI state (NOT backend values)
    setActiveFilter("all");
    setSelectedSizes([]);
    setActiveSort("new");
    setActiveCategory(null);

    // 🔹 Fetch using normalized query builder
    const query = buildFilterQuery({
      category: null,
      filter: "all",
      sizes: [],
      sort: "new",
    });

    const url = query
      ? `/api/products/filter?${query}`
      : `/api/products/filter`;

    const res = await axios.get(url);

    setProducts(res.data.products);
    setProductNotAvailable(false);
  };

  const isDirty =
    activeFilter !== filters[0].value ||
    selectedSizes.length > 0 ||
    activeSort !== sortOptions[0].value ||
    activeCategory !== null;

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

                  <div className="p-6 space-y-7">
                    {/* Category Section - NEW */}
                    <div className="space-y-3">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                        Category
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map((cat) => (
                          <button
                            key={cat.value}
                            onClick={() => setActiveCategory(cat.value)}
                            className={`py-3 rounded-2xl text-[10px] font-bold transition-all border ${
                              activeCategory === cat.value
                                ? "bg-zinc-900 border-zinc-900 text-white shadow-lg shadow-zinc-200"
                                : "bg-zinc-50 border-transparent text-zinc-500 hover:bg-zinc-100"
                            }`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Collections Section */}
                    <div className="space-y-3">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                        Collections
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {filters.map((filter) => (
                          <button
                            key={filter.value}
                            onClick={() => setActiveFilter(filter.value)}
                            className={`px-4 py-2 rounded-full text-[10px] font-bold transition-all border ${
                              activeFilter === filter.value
                                ? "bg-zinc-900 border-zinc-900 text-white shadow-md"
                                : "bg-zinc-50 border-zinc-100 text-zinc-500 hover:bg-zinc-100"
                            }`}
                          >
                            {filter.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sizes Section */}
                    <div className="space-y-3">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                        Available Sizes
                      </p>
                      <div className="grid grid-cols-4 gap-2">
                        {sizes.map((s) => (
                          <button
                            key={s}
                            onClick={() => toggleSize(s)}
                            className={`h-11 flex items-center justify-center rounded-full text-[10px] font-bold transition-all border ${
                              selectedSizes.includes(s)
                                ? "bg-zinc-900 border-zinc-900 text-white shadow-md"
                                : "bg-zinc-50 border-zinc-100 text-zinc-500 hover:border-zinc-900"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sort Section */}
                    <div className="space-y-3">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                        Sort By
                      </p>
                      <div className="grid grid-cols-1 gap-1">
                        {sortOptions.map((sortOption) => (
                          <button
                            key={sortOption.value}
                            onClick={() => setActiveSort(sortOption.value)}
                            className={`flex items-center justify-between px-4 py-3 rounded-2xl text-[11px] font-bold transition-all ${
                              activeSort === sortOption.value
                                ? "bg-zinc-100 text-zinc-900"
                                : "text-zinc-500 hover:bg-zinc-50"
                            }`}
                          >
                            {sortOption.label}
                            {activeSort === sortOption.value && (
                              <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer Section */}
                  <div className="p-6 pt-2 mt-auto space-y-3 bg-white/50 backdrop-blur-sm border-t border-zinc-50">
                    <div className="flex items-center gap-3">
                      <Motion.button
                        disabled={!isDirty}
                        whileTap={isDirty ? { scale: 0.95 } : {}}
                        onClick={handleReset}
                        className={`
                          flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300
                          ${
                            isDirty
                              ? "bg-rose-50/50 text-rose-600 hover:bg-rose-50 cursor-pointer"
                              : "bg-zinc-50 text-zinc-300 cursor-not-allowed opacity-60"
                          }
                        `}
                      >
                        <RotateCcw
                          size={12}
                          className={isDirty ? "animate-spin-once" : ""}
                        />
                        <span>Reset</span>
                      </Motion.button>

                      <button
                        onClick={() => {
                          setIsFilterOpen(false);
                          handleApply();
                        }}
                        className="flex-[2] py-4 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-black transition-all shadow-xl active:scale-[0.98]"
                      >
                        Apply Filters
                      </button>
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
          {products.length === 0 && !productNotAvailable ? (
            // 🔹 1. Skeleton
            Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} index={i} />
            ))
          ) : productNotAvailable ? (
            // 🔹 2. No products
            <div className="col-span-full text-center py-10 text-zinc-500">
              No products found
            </div>
          ) : (
            // 🔹 3. Render products
            products.map((item, index) => (
              <ProductCard
                key={item._id}
                product={item}
                index={index}
                handleAddToCart={handleAddToCart}
              />
            ))
          )}
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
