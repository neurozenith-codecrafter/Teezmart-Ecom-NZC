import React, { useEffect, useState } from "react";
import axios from "axios";
import { SlidersHorizontal, Heart, X, RotateCcw } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useCart } from "../Hooks/useCart";
import { useWishlist } from "../Hooks/useWishlist";
import RatingComponent from "../components/RatingComponent"

const ProductCard = ({
  product,
  index,
  isLiked,
  handleAddToCart,
  onToggleWishlist,
}) => {
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

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await onToggleWishlist(product);
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
              type="button"
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

            <div
              className="
                absolute bottom-5 left-1/2 -translate-x-1/2
                transition-all duration-300

                // MOBILE (default)
                opacity-0 pointer-events-none

                // DESKTOP base state
                md:opacity-0 md:pointer-events-none

                // DESKTOP hover state
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
              <RatingComponent rating={product.rating} />
              <span className="text-[10px] text-zinc-400 font-bold tracking-tighter">
                {product.rating}
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

const normalizeCategory = (value) => {
  if (!value) return null;

  const normalizedValue = value.toString().trim().toLowerCase();
  const categoryMap = {
    tshirt: "tshirt",
    tshirts: "tshirt",
    "t-shirt": "tshirt",
    "t-shirts": "tshirt",
    trackpant: "trackpant",
    trackpants: "trackpant",
    tracks: "trackpant",
  };

  return categoryMap[normalizedValue] || null;
};

const normalizeFilter = (value) => {
  if (!value) return "all";

  const normalizedValue = value.toString().trim().toLowerCase();
  const validFilters = new Set(["all", "best", "rated"]);

  return validFilters.has(normalizedValue) ? normalizedValue : "all";
};

const normalizeSort = (value) => {
  if (!value) return "new";

  const normalizedValue = value.toString().trim().toLowerCase();
  const validSorts = new Set(["new", "rating_desc", "underrated"]);

  return validSorts.has(normalizedValue) ? normalizedValue : "new";
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
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilter, setAppliedFilter] = useState("all");
  const [appliedSizes, setAppliedSizes] = useState([]);
  const [appliedSort, setAppliedSort] = useState("new");
  const [draftCategory, setDraftCategory] = useState(null);
  const [draftFilter, setDraftFilter] = useState("all");
  const [draftSizes, setDraftSizes] = useState([]);
  const [draftSort, setDraftSort] = useState("new");
  const [productNotAvailable, setProductNotAvailable] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const { handleAddToCart } = useCart();
  const { wishlistIds, handleToggleWishlist } = useWishlist();

  const activeCategory = normalizeCategory(searchParams.get("category"));
  const activeFilterParam = normalizeFilter(searchParams.get("collection"));
  const activeSortParam = normalizeSort(searchParams.get("sort"));
  const activeSizesParamValue = searchParams.get("sizes") || "";
  const activeSizesParam = activeSizesParamValue
    .split(",")
    .map((size) => size.trim().toUpperCase())
    .filter(Boolean);

  const buildFilterQuery = ({
    category,
    filter,
    sizes: selectedSizes,
    sort,
  }) => {
    const params = new URLSearchParams();

    if (category) {
      params.append("category", category);
    }

    if (filter !== "all") {
      params.append("collection", filter);
    }

    if (selectedSizes?.length) {
      params.append("sizes", selectedSizes.join(","));
    }

    if (sort !== "new") {
      params.append("sort", sort);
    }

    return params.toString();
  };

  const updateSearchParams = ({ category, filter, sort, sizes }) => {
    const nextParams = new URLSearchParams(searchParams);

    if (category) nextParams.set("category", category);
    else nextParams.delete("category");

    if (filter && filter !== "all") nextParams.set("collection", filter);
    else nextParams.delete("collection");

    if (sort && sort !== "new") nextParams.set("sort", sort);
    else nextParams.delete("sort");

    // ✅ ADD THIS
    if (sizes && sizes.length > 0) {
      nextParams.set("sizes", sizes.join(","));
    } else {
      nextParams.delete("sizes");
    }

    setSearchParams(nextParams);
  };

  const handleCategoryChange = (value) => {
    setDraftCategory((prev) => (prev === value ? null : value));
  };

  const toggleSize = (size) => {
    setDraftSizes((prev) => {
      if (prev.includes(size)) {
        return prev.filter((s) => s !== size);
      }

      return [...prev, size];
    });
  };

  const handleApplyFilters = () => {
    setAppliedFilter(draftFilter);
    setAppliedSizes(draftSizes);
    setAppliedSort(draftSort);
    updateSearchParams({
      category: draftCategory,
      filter: draftFilter,
      sort: draftSort,
      sizes: draftSizes,
    });
    setIsFilterOpen(false);
  };

  const handleReset = () => {
    setDraftCategory(null);
    setDraftFilter("all");
    setDraftSizes([]);
    setDraftSort("new");
    setAppliedFilter("all");
    setAppliedSizes([]);
    setAppliedSort("new");
    setProductNotAvailable(false);
    setIsFilterOpen(false);
    setSearchParams({});
  };

  useEffect(() => {
    setDraftCategory(activeCategory);
    setAppliedFilter(activeFilterParam);
    setAppliedSort(activeSortParam);
    setDraftFilter(activeFilterParam);
    setDraftSort(activeSortParam);
    setAppliedSizes(activeSizesParam);
    setDraftSizes(activeSizesParam);
  }, [
    activeCategory,
    activeFilterParam,
    activeSortParam,
    activeSizesParamValue,
  ]);

  useEffect(() => {
    if (!isFilterOpen) {
      setDraftCategory(activeCategory);
      setDraftFilter(appliedFilter);
      setDraftSizes(appliedSizes);
      setDraftSort(appliedSort);
    }
  }, [isFilterOpen, activeCategory, appliedFilter, appliedSizes, appliedSort]);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      const query = buildFilterQuery({
        category: activeCategory,
        filter: appliedFilter,
        sizes: appliedSizes,
        sort: appliedSort,
      });

      const url = query
        ? `${import.meta.env.VITE_API_URL}/api/products/filter?${query}`
        : `${import.meta.env.VITE_API_URL}/api/products/filter`;

      try {
        if (isMounted) {
          setIsLoading(true);
          setProductNotAvailable(false);
        }

        const res = await axios.get(url);

        if (!isMounted) return;

        const nextProducts = res.data.products || res.data.data || [];
        setProducts(nextProducts);
        setProductNotAvailable(nextProducts.length === 0);
      } catch (error) {
        console.error("Error fetching catalog products ->", error);

        if (isMounted) {
          setProducts([]);
          setProductNotAvailable(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [activeCategory, appliedFilter, appliedSizes, appliedSort]);

  const hasSizeDraftChanges =
    draftSizes.length !== activeSizesParam.length ||
    draftSizes.some((size) => !activeSizesParam.includes(size));

  const isDirty =
    draftCategory !== activeCategory ||
    draftFilter !== activeFilterParam ||
    draftSort !== activeSortParam ||
    hasSizeDraftChanges;

  const activeFilterCount =
    (activeCategory ? 1 : 0) +
    (activeFilterParam !== "all" ? 1 : 0) +
    (activeSortParam !== "new" ? 1 : 0) +
    (activeSizesParam.length > 0 ? 1 : 0);

  const hasActiveFilters = activeFilterCount > 0;
  const canReset = isDirty || hasActiveFilters;

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
            className="group relative flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white border border-zinc-200 text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm transition-all hover:border-black hover:text-black"
          >
            <SlidersHorizontal size={13} />

            <span>Filter & Sort</span>

            {/* The Floating Badge (Cherry on Top) */}
            {hasActiveFilters && (
              <span className="absolute -top-2 -right-2 flex min-h-[20px] min-w-[20px] px-1.5 items-center justify-center rounded-full bg-black text-white text-xs font-semibold ring-2 ring-white shadow-md">
                {activeFilterCount}
              </span>
            )}
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
                    <div className="space-y-3">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                        Category
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map((cat) => (
                          <button
                            key={cat.value}
                            onClick={() => handleCategoryChange(cat.value)}
                            className={`py-3 rounded-2xl text-[10px] font-bold transition-all border ${
                              draftCategory === cat.value
                                ? "bg-zinc-900 border-zinc-900 text-white shadow-lg shadow-zinc-200"
                                : "bg-zinc-50 border-transparent text-zinc-500 hover:bg-zinc-100"
                            }`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                        Collections
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {filters.map((filter) => (
                          <button
                            key={filter.value}
                            onClick={() => setDraftFilter(filter.value)}
                            className={`px-4 py-2 rounded-full text-[10px] font-bold transition-all border ${
                              draftFilter === filter.value
                                ? "bg-zinc-900 border-zinc-900 text-white shadow-md"
                                : "bg-zinc-50 border-zinc-100 text-zinc-500 hover:bg-zinc-100"
                            }`}
                          >
                            {filter.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                        Available Sizes
                      </p>
                      <div className="grid grid-cols-4 gap-2">
                        {sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => toggleSize(size)}
                            className={`h-11 flex items-center justify-center rounded-full text-[10px] font-bold transition-all border ${
                              draftSizes.includes(size)
                                ? "bg-zinc-900 border-zinc-900 text-white shadow-md"
                                : "bg-zinc-50 border-zinc-100 text-zinc-500 hover:border-zinc-900"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                        Sort By
                      </p>
                      <div className="grid grid-cols-1 gap-1">
                        {sortOptions.map((sortOption) => (
                          <button
                            key={sortOption.value}
                            onClick={() => setDraftSort(sortOption.value)}
                            className={`flex items-center justify-between px-4 py-3 rounded-2xl text-[11px] font-bold transition-all ${
                              draftSort === sortOption.value
                                ? "bg-zinc-100 text-zinc-900"
                                : "text-zinc-500 hover:bg-zinc-50"
                            }`}
                          >
                            {sortOption.label}
                            {draftSort === sortOption.value && (
                              <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-2 mt-auto space-y-3 bg-white/50 backdrop-blur-sm border-t border-zinc-50">
                    <div className="flex items-center gap-3">
                      <Motion.button
                        disabled={!canReset}
                        whileTap={canReset ? { scale: 0.95 } : {}}
                        onClick={handleReset}
                        className={`
                          flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300
                          ${
                            canReset
                              ? "bg-rose-50/50 text-rose-600 hover:bg-rose-50 cursor-pointer"
                              : "bg-zinc-50 text-zinc-300 cursor-not-allowed opacity-60"
                          }
                        `}
                      >
                        <RotateCcw
                          size={12}
                          className={canReset ? "animate-spin-once" : ""}
                        />
                        <span>Reset</span>
                      </Motion.button>

                      <button
                        onClick={handleApplyFilters}
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
