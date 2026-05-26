import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  SlidersHorizontal,
  ArrowUpDown,
  ShoppingBag,
  Heart,
  Search,
  Grid3X3,
  ChevronDown,
} from "lucide-react";
import RatingComponent from "../components/RatingComponent";


const CustomSort = ({ sortBy, setSortBy }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Mapping out remaining valid non-price sorting configurations
  const sortOptions = [
    { value: 'relevance', label: 'Relevance Mix' },
    { value: 'most_rated', label: 'Customer Reviews' },
    { value: 'newest', label: 'Latest Arrivals' }
  ];

  // Get current label display string
  const currentLabel = sortOptions.find(opt => opt.value === sortBy)?.label || 'Relevance Mix';

  // Handle close-on-click-outside behavior
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-2 self-stretch sm:self-auto min-w-[210px]" ref={dropdownRef}>
      <div className="relative w-full z-30">
        
        {/* =========================================================
           CUSTOM TRIGGER DIV BUTTON
           ========================================================= */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full bg-zinc-50 border ${
            isOpen ? 'border-zinc-900 bg-white ring-1 ring-zinc-900' : 'border-zinc-200 hover:border-zinc-300 hover:bg-white'
          } text-zinc-900 rounded-xl pt-6 pb-2 pl-4 pr-10 text-[12px] cursor-pointer shadow-sm transition-all relative`}
        >
          {/* Label Display Overlay */}
          <span className="absolute left-4 top-2 text-[10px] font-black uppercase tracking-wider text-zinc-400 pointer-events-none">
            Sort By
          </span>
          
          {/* Active Option Output */}
          <span className="font-bold text-zinc-900 block truncate">
            {currentLabel}
          </span>

          {/* Rotatable Interactive Arrow indicator */}
          <div className={`absolute right-3 top-1/2 -translate-y-1/2 mt-1 text-zinc-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}>
            <ChevronDown size={14} strokeWidth={2.5} />
          </div>
        </div>

        {/* =========================================================
           MANUAL DROPDOWN MENU PANEL LAYOUT
           ========================================================= */}
        {isOpen && (
          <div className="absolute top-full mt-1.5 left-0 w-full bg-white border border-zinc-200/80 rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06)] overflow-hidden py-1 animate-in fade-in slide-in-from-top-1 duration-150">
            {sortOptions.map((option) => {
              const isSelected = sortBy === option.value;
              return (
                <div
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-2.5 text-[12px] font-medium tracking-tight text-left cursor-pointer transition-colors ${
                    isSelected 
                      ? 'bg-zinc-900 text-white font-bold' 
                      : 'text-zinc-600 hover:bg-zinc-50 hover:text-black'
                  }`}
                >
                  {option.label}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};


const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  console.log("Search query from URL:", query);

  // State management variables
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("relevance");

  // Mock fetching logic based on data changes from URL query parameters

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products/search?q=${encodeURIComponent(query)}`,
        );
        setResults(response.data.products);
        console.log("Fetched search results:", response.data.products);
        console.log("Response data ->", response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="w-full min-h-screen bg-[#fafafa] pb-20 select-none">
      {/* REMOVED PT-24: Fits perfectly underneath the global navigation bar with standard margins */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
        {/* =========================================================
       PREMIUM HEADER & LUXURY SORT BLOCK
       ========================================================= */}
        <div className="bg-white border border-zinc-200/60 rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-[0.18em] bg-zinc-900 text-white px-2 py-0.5 rounded">
                  Search Index
                </span>
                {!loading && (
                  <span className="text-[11px] font-bold text-zinc-400 bg-zinc-50 border border-zinc-100 px-2 py-0.5 rounded-md">
                    {results.length} {results.length === 1 ? "Piece" : "Pieces"}{" "}
                    Available
                  </span>
                )}
              </div>

              <h1 className="text-xl md:text-2xl font-black text-zinc-900 tracking-tight leading-tight">
                {query ? (
                  <>
                    Results for{" "}
                    <span className="text-zinc-500 font-medium italic">
                      "{query}"
                    </span>
                  </>
                ) : (
                  "Explore Entire Catalog"
                )}
              </h1>
            </div>

            {/* RE-DESIGNED SORT COMPONENT */}
            <CustomSort sortBy={sortBy} setSortBy={setSortBy} />
          </div>
        </div>

        {/* =========================================================
       MAIN RESULTS CONTENT SECTION
       ========================================================= */}
        {loading ? (
          /* SHIMMER SKELETON LAYER */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4 animate-pulse">
                <div className="aspect-[4/5] w-full bg-zinc-200/60 rounded-[1.8rem]" />
                <div className="space-y-2 px-1">
                  <div className="h-3 bg-zinc-200/60 rounded w-1/3" />
                  <div className="h-4 bg-zinc-200/60 rounded w-3/4" />
                  <div className="h-4 bg-zinc-200/60 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : results.length === 0 ? (
          /* EMPTY LOGIC FALLBACK SCREEN */
          <div className="flex flex-col items-center justify-center text-center py-24 bg-white border border-zinc-200/60 rounded-3xl max-w-2xl mx-auto shadow-sm px-6">
            <div className="w-14 h-14 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-center justify-center text-zinc-400 mb-6 shadow-inner">
              <Search size={20} strokeWidth={2} />
            </div>
            <h3 className="text-lg font-black text-zinc-900 tracking-tight">
              No matches found in database
            </h3>
            <p className="text-zinc-400 text-xs mt-1 mb-8 max-w-sm leading-relaxed font-medium">
              We couldn't locate any products matching your prompt. Try checking
              alternative spellings or exploring general fits.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-zinc-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-sm"
            >
              Return to Showroom
            </button>
          </div>
        ) : (
          /* POPULATED CARD SHOWCASE GRID */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-12">
            {results.map((product) => (
              <div
                key={product._id}
                className="group cursor-pointer space-y-3.5"
                onClick={() => navigate(`/product/${product.slug}`)}
              >
                {/* CLEAN EMBEDDED MEDIA FRAME FRAME */}
                <div className="relative aspect-[4/5] rounded-[1.8rem] bg-zinc-100 border border-zinc-200/40 overflow-hidden shadow-sm transition-all duration-300">
                  <img
                    src={product?.image?.url}
                    alt={product?.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  {/* STATIC WISHLIST HEART OVERLAY — ALWAYS VISIBLE, NO DESKTOP FLICKER */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Wishlist click logic hook goes here
                    }}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm border border-zinc-200/30 flex items-center justify-center text-zinc-400 hover:text-red-500 active:scale-90 transition-all shadow-sm z-10"
                  >
                    <Heart size={14} strokeWidth={2.2} />
                  </button>

                  {/* REMOVED: Quick View text block overlay completely stripped out to clean up hover visuals */}
                </div>

                {/* PRODUCT SPECIFICATIONS DETAILS SHEET */}
                <div className="px-1 space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block">
                    {product?.category}
                  </span>

                  <h3 className="text-[13px] font-medium text-zinc-800 line-clamp-1 group-hover:text-black transition-colors tracking-tight leading-snug">
                    {product?.title}
                  </h3>

                  {/* PRICE SYSTEM STRIP (STACKED FIRST) */}
                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="text-[14px] font-black text-zinc-900 italic tracking-tight">
                      ₹{product?.price}
                    </span>
                    {product?.originalPrice &&
                      product.originalPrice > product.price && (
                        <span className="text-[11px] text-zinc-400 line-through font-medium tracking-tight">
                          ₹{product?.originalPrice}
                        </span>
                      )}
                  </div>

                  {/* RATING BLOCK RE-POSITIONED (STAYS ON LEFT, BELOW THE RATES COMPONENT) */}
                  {product?.rating && (
                    <div className="flex items-center gap-1.5 pt-1">
                      <div className="flex items-center text-zinc-800">
                        <RatingComponent rating={product?.rating || 0} />
                      </div>
                      <span className="text-[11px] font-black text-zinc-900 italic">
                        {product?.rating}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
