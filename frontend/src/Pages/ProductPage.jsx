import React, { useState } from "react";
import { Heart, Percent, Box, Truck, Calendar, Star } from "lucide-react";
import { PAGE_CONTAINER_CLASS } from "../constants/pageLayout";
import Navbar from "../components/Navbar";

const ProductPage = () => {
  const [selectedSize, setSelectedSize] = useState("S");
  const [selectedImg, setSelectedImg] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const productImages = [
    "https://i.pinimg.com/1200x/27/b5/a1/27b5a1602087a7113d58118e357bdc54.jpg",
    "https://i.pinimg.com/736x/8e/5c/d8/8e5cd80146b3c15908b8701b4b3d4875.jpg",
    "https://i.pinimg.com/1200x/97/af/c3/97afc3efa46ad27828d18fcfb6005673.jpg",
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFB] font-sans text-black">
      <Navbar />

      <main className="pt-28 md:pt-40 pb-20">
        <div className={`${PAGE_CONTAINER_CLASS} max-w-screen-xl mx-auto`}>
          {/* --- TOP: PRODUCT SECTION --- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-start mb-24">
            {/* LEFT: GALLERY */}
            <div className="lg:col-span-8 flex gap-6 justify-start">
              <div className="hidden lg:flex flex-col gap-3 shrink-0">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(idx)}
                    className={`w-14 h-18 md:w-16 md:h-20 rounded-lg overflow-hidden border transition-all duration-300 ${
                      selectedImg === idx
                        ? "border-black shadow-md"
                        : "border-transparent opacity-40"
                    }`}
                  >
                    <img
                      src={img}
                      className="w-full h-full object-cover"
                      alt={`thumb-${idx}`}
                    />
                  </button>
                ))}
              </div>

              <div className="flex-grow aspect-[4/5] max-w-[480px] rounded-xl overflow-hidden bg-white border border-zinc-100 shadow-sm">
                <img
                  src={productImages[selectedImg]}
                  className="w-full h-full object-cover"
                  alt="Main Product"
                />
              </div>
            </div>

            {/* RIGHT: INFO */}
            <div className="lg:col-span-4 space-y-6 lg:-ml-12 px-2 lg:px-0">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-900">
                    Premium Collection
                  </span>
                  <div className="h-[1px] bg-zinc-200 flex-grow"></div>
                </div>
                <h1 className="text-3xl font-medium tracking-tight text-black leading-tight">
                  Loose Fit Hoodie
                </h1>
                <p className="text-[14px] text-zinc-600 leading-relaxed font-light">
                  A relaxed silhouette crafted from heavy-weight cotton fleece.
                  Features dropped shoulders and a structured double-layered
                  hood.
                </p>
                <p className="text-2xl font-bold text-black tracking-tighter">
                  $24.99
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Select Size
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  {["S", "M", "L", "XL", "XXL"].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-10 h-10 rounded-lg text-[11px] font-bold transition-all border ${
                        selectedSize === size
                          ? "bg-black border-black text-white"
                          : "bg-white border-zinc-200 text-zinc-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button className="flex-grow bg-black text-white py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg">
                  Add to Cart
                </button>
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-3.5 border rounded-xl transition-all ${isLiked ? "border-red-100 bg-red-50/30" : "border-zinc-200 bg-white"}`}
                >
                  <Heart
                    size={18}
                    strokeWidth={1.5}
                    className={
                      isLiked ? "fill-red-500 text-red-500" : "text-black"
                    }
                  />
                </button>
              </div>

              <div className="hidden sm:grid pt-6 border-t border-zinc-100 grid-cols-1 sm:grid-cols-2 gap-y-5">
                <ShippingItem Icon={Percent} label="Offer" val="50% Off" />
                <ShippingItem Icon={Box} label="Packaging" val="Luxury Box" />
                <ShippingItem Icon={Truck} label="Delivery" val="Fast Track" />
                <ShippingItem Icon={Calendar} label="Arrival" val="10-12 Oct" />
              </div>
            </div>
          </div>

          {/* --- BOTTOM: RATING ONLY SECTION --- */}
          <section className="pt-20 border-t border-zinc-100 max-w-4xl mx-auto">
            <h2 className="text-2xl font-medium tracking-tight text-black mb-12 text-center lg:text-left">
              Rating & Reviews
            </h2>

            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-24">
              {/* Massive Score */}
              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-baseline gap-1">
                  <span className="text-[100px] font-bold leading-none tracking-tighter">
                    4,5
                  </span>
                  <span className="text-zinc-400 text-2xl">/5</span>
                </div>
                <span className="text-zinc-400 text-sm mt-4 font-medium uppercase tracking-widest">
                  (50 New Reviews)
                </span>
              </div>

              {/* Progress Bars */}
              <div className="w-full max-w-md space-y-4 pt-4">
                {[
                  { star: 5, width: "w-full" },
                  { star: 4, width: "w-1/4" },
                  { star: 3, width: "w-[8%]" },
                  { star: 2, width: "w-[4%]" },
                  { star: 1, width: "w-[4%]" },
                ].map((row) => (
                  <div key={row.star} className="flex items-center gap-6">
                    <div className="flex items-center gap-2 w-8 shrink-0">
                      <Star
                        size={14}
                        className="fill-amber-400 text-amber-400"
                      />
                      <span className="text-xs font-bold text-black">
                        {row.star}
                      </span>
                    </div>
                    <div className="flex-grow h-[2px] bg-zinc-100 relative overflow-hidden">
                      <div
                        className={`absolute top-0 left-0 h-full bg-black ${row.width} transition-all duration-1000 ease-out`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

const ShippingItem = ({ Icon, label, val }) => (
  <div className="flex items-center gap-3">
    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-50 text-black">
      <Icon size={14} strokeWidth={1.5} />
    </div>
    <div>
      <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest">
        {label}
      </p>
      <p className="text-[11px] text-black font-bold">{val}</p>
    </div>
  </div>
);

export default ProductPage;
