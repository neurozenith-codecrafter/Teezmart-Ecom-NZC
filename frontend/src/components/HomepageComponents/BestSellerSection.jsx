import React, { useEffect, useState } from "react";
import axios from "axios";
import { Heart, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PAGE_CONTAINER_CLASS } from "../../constants/pageLayout";

export const BestSellerSection = () => {
  const [bestSellers, setBestSellers] = useState([]);
  // State to track liked products locally
  const [likedProducts, setLikedProducts] = useState({});

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/products/most-selling",
        );
        setBestSellers(response.data.data);
      } catch (error) {
        console.error("Error fetching best sellers:", error);
      }
    };
    fetchBestSellers();
  }, []);

  const toggleLike = (e, productId) => {
    // IMPORTANT: Prevents the click from bubbling up to the Link component
    e.preventDefault();
    e.stopPropagation();

    setLikedProducts((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  return (
    <section className="bg-[#FBFBFB] pt-12 md:pt-20 pb-0 text-slate-900 font-sans w-full">
      <div className={PAGE_CONTAINER_CLASS}>
        <div className="mb-8 md:mb-14 flex flex-col items-start">
          <div className="flex items-center gap-3 md:gap-4 w-full">
            <h2 className="text-xl md:text-3xl font-normal text-slate-800 tracking-tight whitespace-nowrap">
              Best Sellers
            </h2>
            <div className="h-[1px] bg-slate-200 flex-grow"></div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 md:gap-x-6 gap-y-10 md:gap-y-16 mb-0">
          {bestSellers.map((item) => {
            const isLiked = likedProducts[item._id];

            return (
              <Link
                to={`/product/${item._id}`}
                key={item._id}
                className="group flex flex-col h-full p-2 md:p-3 rounded-2xl md:rounded-3xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] bg-white/50 hover:bg-white cursor-pointer"
              >
                {/* IMAGE CONTAINER */}
                <div className="relative aspect-[3/4] mb-3 md:mb-6 overflow-hidden rounded-xl md:rounded-2xl shadow-sm bg-white shrink-0">
                  <img
                    src={item.images[0].url}
                    alt={item.title}
                    className="block w-full h-full object-cover transition-transform duration-500 will-change-transform"
                  />

                  {/* WISHLIST BUTTON */}
                  <button
                    onClick={(e) => toggleLike(e, item._id)}
                    className="absolute top-2 right-2 md:top-4 md:right-4 p-1.5 md:p-2.5 bg-white/80 backdrop-blur-md rounded-full shadow-sm transition-all duration-300 border border-white/50 z-20 group/heart"
                  >
                    <Heart
                      size={14}
                      className={`md:size-[18px] transition-all duration-300 transform ${
                        isLiked
                          ? "fill-red-500 text-red-500 scale-110"
                          : "text-slate-500 group-hover/heart:text-red-400"
                      }`}
                      strokeWidth={isLiked ? 0 : 2}
                    />
                  </button>
                </div>

                {/* DETAILS BLOCK */}
                <div className="flex flex-col flex-grow space-y-1.5 md:space-y-3 px-1">
                  <h3 className="text-sm md:text-lg font-bold text-slate-800 leading-tight line-clamp-1">
                    {item.title}
                  </h3>

                  <p className="text-[11px] md:text-[13px] text-slate-500 leading-relaxed font-medium line-clamp-1 h-[1.2em]">
                    {item.description}
                  </p>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2 gap-2 mt-auto">
                    <span className="text-base md:text-2xl font-bold text-slate-900 whitespace-nowrap">
                      ₹{item.price}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault(); // Prevents nav if you just want to add to cart
                        console.log("Added to cart");
                      }}
                      className="w-full sm:w-auto flex items-center justify-center gap-1 bg-gradient-to-r from-[#32F18F] to-[#3AF6C9] text-slate-900 px-3 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl font-bold text-[10px] md:text-[12px] shadow-sm active:scale-95 transition-all"
                    >
                      Add <span className="hidden md:inline">to cart</span>
                      <ChevronRight
                        size={12}
                        className="md:size-[14px]"
                        strokeWidth={3}
                      />
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BestSellerSection;
