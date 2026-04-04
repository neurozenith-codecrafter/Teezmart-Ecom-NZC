import React from "react";
import { Heart, ChevronRight } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Classic Oversized Tee",
    desc: "100% Organic Cotton Heavyweight Boxy Fit",
    price: 29,
    img: "https://i.pinimg.com/1200x/27/b5/a1/27b5a1602087a7113d58118e357bdc54.jpg",
    colors: ["#FFFFFF", "#000000", "#4A5568"],
  },
  {
    id: 2,
    name: "Minimal Logo Tee",
    desc: "Premium Pima Cotton with chest embroidery",
    price: 25,
    img: "https://i.pinimg.com/736x/8e/5c/d8/8e5cd80146b3c15908b8701b4b3d4875.jpg",
    colors: ["#000000", "#E2E8F0", "#2D3748"],
  },
  {
    id: 3,
    name: "Streetwear Graphic",
    desc: "Limited edition screen-print on vintage-wash",
    price: 35,
    img: "https://i.pinimg.com/1200x/97/af/c3/97afc3efa46ad27828d18fcfb6005673.jpg",
    colors: ["#1A202C", "#FFFFFF", "#718096"],
  },
  {
    id: 4,
    name: "Vintage Washed Tee",
    desc: "Sun-faded effect with distressed edges",
    price: 32,
    img: "https://i.pinimg.com/1200x/3a/7c/a4/3a7ca40c29b66e1abaa6bd3ac8dd252b.jpg",
    colors: ["#718096", "#2D3748", "#EDF2F7"],
  },
  {
    id: 5,
    name: "Anime Print Tee",
    desc: "High-definition DTG print on combed cotton",
    price: 30,
    img: "https://i.pinimg.com/1200x/98/be/39/98be394e8367b05a7ac2668f202f0ca1.jpg",
    colors: ["#FFFFFF", "#1A202C"],
  },
  {
    id: 6,
    name: "Plain Cotton Essential",
    desc: "Breathable daily driver, shrink-resistant",
    price: 20,
    img: "https://i.pinimg.com/1200x/33/48/26/33482684ade520220b9096a08f79bc14.jpg",
    colors: ["#F7FAFC", "#000000"],
  },
  {
    id: 7,
    name: "Premium Black Tee",
    desc: "Jet black reactive dye that stays dark",
    price: 28,
    img: "https://i.pinimg.com/1200x/39/3d/35/393d353825cfd8d2f0fa41c9ce3b68ef.jpg",
    colors: ["#000000", "#1A202C"],
  },
  {
    id: 8,
    name: "Relaxed Drop Shoulder",
    desc: "Modern silhouette with reinforced seams",
    price: 34,
    img: "https://i.pinimg.com/1200x/b6/59/11/b65911151ac5b605cbb505add20e9145.jpg",
    colors: ["#CBD5E0", "#000000", "#FFFFFF"],
  },
];

export const BestSellerSection = () => {
  return (
    <main className="bg-[#FBFBFB] py-12 md:py-20 text-slate-900 font-sans w-full">
      <div className="w-full px-4 md:px-10 lg:px-20">
        {/* --- HEADER --- */}
        <div className="mb-8 md:mb-14 flex flex-col items-start">
          <div className="flex items-center gap-3 md:gap-4 w-full">
            <h2 className="text-xl md:text-3xl font-normal text-slate-800 tracking-tight whitespace-nowrap">
              Best Sellers
            </h2>
            <div className="h-[1px] bg-slate-200 flex-grow"></div>
          </div>
        </div>

        {/* --- PRODUCT GRID --- */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 md:gap-x-6 gap-y-10 md:gap-y-16 mb-24 md:mb-32">
          {products.map((item) => (
            <div
              key={item.id}
              /* CARD HOVER EFFECT:
                - hover:scale-[1.02]: Fast zoom on the whole card
                - hover:shadow-lg: Produces a soft shadow
                - transition-all duration-200: Fast transition
              */
              className="group flex flex-col p-2 md:p-3 rounded-2xl md:rounded-3xl transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] bg-white/50 hover:bg-white cursor-pointer"
            >
              {/* IMAGE LAYOUT - Removed inner zoom/hover */}
              <div className="relative aspect-[3/4] mb-3 md:mb-6 overflow-hidden rounded-xl md:rounded-2xl shadow-sm bg-white">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />

                <button className="absolute top-2 right-2 md:top-4 md:right-4 p-1.5 md:p-2.5 bg-white/80 backdrop-blur-md rounded-full shadow-sm text-slate-500 hover:text-red-500 transition-colors border border-white/50">
                  <Heart size={14} className="md:size-[18px]" strokeWidth={2} />
                </button>
              </div>

              {/* DETAILS BLOCK */}
              <div className="flex flex-col space-y-1.5 md:space-y-3 px-1">
                <h3 className="text-sm md:text-lg font-bold text-slate-800 leading-tight line-clamp-1">
                  {item.name}
                </h3>
                <p className="hidden sm:block text-[11px] md:text-[13px] text-slate-500 leading-relaxed font-medium line-clamp-2">
                  {item.desc}
                </p>

                <div className="flex items-center gap-1.5">
                  {item.colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="w-3 h-3 md:w-4 md:h-4 rounded-full border border-slate-200"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2 gap-2 mt-auto">
                  <span className="text-base md:text-2xl font-bold text-slate-900">
                    ${item.price}
                  </span>

                  <button className="w-full sm:w-auto flex items-center justify-center gap-1 bg-gradient-to-r from-[#32F18F] to-[#3AF6C9] text-slate-900 px-3 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl font-bold text-[10px] md:text-[12px] shadow-sm active:scale-95 transition-all">
                    Add
                    <span className="hidden md:inline"> to cart</span>
                    <ChevronRight
                      size={12}
                      className="md:size-[14px]"
                      strokeWidth={3}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- WHY US SECTION --- */}
        <section className="pt-16 md:pt-20 border-t border-slate-200/60">
          <div className="flex items-center gap-4 mb-8 md:mb-12">
            <h2 className="text-lg md:text-2xl font-bold text-slate-800 tracking-tight whitespace-nowrap">
              Why Us
            </h2>
            <div className="h-[1px] bg-slate-200 flex-grow"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                id: "01",
                title: "Minimal Design",
                desc: "Clean and modern styles that fit effortlessly.",
              },
              {
                id: "02",
                title: "Premium Quality",
                desc: "High-quality fabrics with long-lasting comfort.",
              },
              {
                id: "03",
                title: "Trusted Brand",
                desc: "Loved for our consistency and design.",
              },
            ].map((feature) => (
              <div key={feature.id} className="space-y-2 md:space-y-4">
                <span className="text-xs font-bold text-slate-400 block tracking-widest">
                  {feature.id}
                </span>
                <h4 className="text-sm md:text-base font-bold text-slate-800 uppercase tracking-wide">
                  {feature.title}
                </h4>
                <p className="text-xs md:text-[14px] leading-relaxed text-slate-500 font-normal">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default BestSellerSection;
