import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, RotateCcw } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";

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

const Filter = ({ products }) => {
  const {
    setItems,
    setIsLoading,
    setProductNotAvailable,
  } = products;
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const activeCategory = normalizeCategory(searchParams.get("category"));
  const activeFilter = normalizeFilter(searchParams.get("collection"));
  const activeSort = normalizeSort(searchParams.get("sort"));
  const activeSizesParamValue = searchParams.get("sizes") || "";
  const activeSizes = activeSizesParamValue
    .split(",")
    .map((size) => size.trim().toUpperCase())
    .filter(Boolean);

  const [draftCategory, setDraftCategory] = useState(activeCategory);
  const [draftFilter, setDraftFilter] = useState(activeFilter);
  const [draftSizes, setDraftSizes] = useState(activeSizes);
  const [draftSort, setDraftSort] = useState(activeSort);

  const activeFilterCount =
    (activeCategory ? 1 : 0) +
    (activeFilter !== "all" ? 1 : 0) +
    (activeSort !== "new" ? 1 : 0) +
    (activeSizes.length > 0 ? 1 : 0);

  const hasActiveFilters = activeFilterCount > 0;

  useEffect(() => {
    if (!isFilterOpen) {
      setDraftCategory(activeCategory);
      setDraftFilter(activeFilter);
      setDraftSizes(activeSizes);
      setDraftSort(activeSort);
    }
  }, [
    isFilterOpen,
    activeCategory,
    activeFilter,
    activeSizesParamValue,
    activeSort,
  ]);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      const query = buildFilterQuery({
        category: activeCategory,
        filter: activeFilter,
        sizes: activeSizes,
        sort: activeSort,
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
        setItems(nextProducts);
        setProductNotAvailable(nextProducts.length === 0);
      } catch (error) {
        console.error("Error fetching catalog products ->", error);

        if (isMounted) {
          setItems([]);
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
  }, [
    activeCategory,
    activeFilter,
    activeSizesParamValue,
    activeSort,
    setIsLoading,
    setItems,
    setProductNotAvailable,
  ]);

  const handleCategoryChange = (value) => {
    setDraftCategory((prev) => (prev === value ? null : value));
  };

  const toggleSize = (size) => {
    setDraftSizes((prev) =>
      prev.includes(size)
        ? prev.filter((item) => item !== size)
        : [...prev, size],
    );
  };

  const hasSizeDraftChanges =
    draftSizes.length !== activeSizes.length ||
    draftSizes.some((size) => !activeSizes.includes(size));

  const isDirty =
    draftCategory !== activeCategory ||
    draftFilter !== activeFilter ||
    draftSort !== activeSort ||
    hasSizeDraftChanges;

  const canReset = isDirty || hasActiveFilters;

  const updateSearchParams = ({ category, filter, sort, sizes: nextSizes }) => {
    const nextParams = new URLSearchParams(searchParams);

    if (category) nextParams.set("category", category);
    else nextParams.delete("category");

    if (filter && filter !== "all") nextParams.set("collection", filter);
    else nextParams.delete("collection");

    if (sort && sort !== "new") nextParams.set("sort", sort);
    else nextParams.delete("sort");

    if (nextSizes.length > 0) {
      nextParams.set("sizes", nextSizes.join(","));
    } else {
      nextParams.delete("sizes");
    }

    setSearchParams(nextParams);
  };

  const handleApplyFilters = () => {
    updateSearchParams({
      category: draftCategory,
      filter: draftFilter,
      sizes: draftSizes,
      sort: draftSort,
    });
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    setDraftCategory(null);
    setDraftFilter("all");
    setDraftSizes([]);
    setDraftSort("new");
    setProductNotAvailable(false);
    setSearchParams({});
    setIsFilterOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsFilterOpen(true)}
        className="group relative flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white border border-zinc-200 text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm transition-all hover:border-black hover:text-black"
      >
        <SlidersHorizontal size={13} />
        <span>Filter & Sort</span>
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
                  type="button"
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
                    {categories.map((category) => (
                      <button
                        type="button"
                        key={category.value}
                        onClick={() => handleCategoryChange(category.value)}
                        className={`py-3 rounded-2xl text-[10px] font-bold transition-all border ${
                          draftCategory === category.value
                            ? "bg-zinc-900 border-zinc-900 text-white shadow-lg shadow-zinc-200"
                            : "bg-zinc-50 border-transparent text-zinc-500 hover:bg-zinc-100"
                        }`}
                      >
                        {category.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                    Collections
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {filters.map((filterOption) => (
                      <button
                        type="button"
                        key={filterOption.value}
                        onClick={() => setDraftFilter(filterOption.value)}
                        className={`px-4 py-2 rounded-full text-[10px] font-bold transition-all border ${
                          draftFilter === filterOption.value
                            ? "bg-zinc-900 border-zinc-900 text-white shadow-md"
                            : "bg-zinc-50 border-zinc-100 text-zinc-500 hover:bg-zinc-100"
                        }`}
                      >
                        {filterOption.label}
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
                        type="button"
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
                        type="button"
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
                    type="button"
                    disabled={!canReset}
                    whileTap={canReset ? { scale: 0.95 } : {}}
                    onClick={handleResetFilters}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                      canReset
                        ? "bg-rose-50/50 text-rose-600 hover:bg-rose-50 cursor-pointer"
                        : "bg-zinc-50 text-zinc-300 cursor-not-allowed opacity-60"
                    }`}
                  >
                    <RotateCcw
                      size={12}
                      className={canReset ? "animate-spin-once" : ""}
                    />
                    <span>Reset</span>
                  </Motion.button>

                  <button
                    type="button"
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
    </>
  );
};

export default Filter;
