import React, { useState } from "react";
import {
  Star,
  Minus,
  Plus,
  ShoppingBag,
  Heart,
  ChevronRight,
} from "lucide-react";
import { PAGE_CONTAINER_CLASS } from "../constants/pageLayout";

const ProductPage = () => {
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [selectedImg, setSelectedImg] = useState(0);

  const product = {
    name: "Jorpeche Oversize Fit Blazer",
    price: 299.0,
    originalPrice: 320.0,
    rating: 4.8,
    reviews: 350,
    sku: "GHFT95245AAA",
    category: "Blazer",
    colors: ["#E5E4E0", "#1A1A1A"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: [
      "https://i.pinimg.com/1200x/27/b5/a1/27b5a1602087a7113d58118e357bdc54.jpg",
      "https://i.pinimg.com/736x/8e/5c/d8/8e5cd80146b3c15908b8701b4b3d4875.jpg",
      "https://i.pinimg.com/1200x/97/af/c3/97afc3efa46ad27828d18fcfb6005673.jpg",
      "https://i.pinimg.com/1200x/3a/7c/a4/3a7ca40c29b66e1abaa6bd3ac8dd252b.jpg",
    ],
  };

  return (
    <main className="bg-white min-h-screen pt-24 pb-20 font-sans text-slate-900">
      <div className={PAGE_CONTAINER_CLASS}>
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-slate-400 mb-10">
          <span className="hover:text-slate-900 cursor-pointer">Home</span>
          <ChevronRight size={10} />
          <span className="hover:text-slate-900 cursor-pointer">
            Collections
          </span>
          <ChevronRight size={10} />
          <span className="text-slate-900 font-bold">{product.category}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* --- LEFT: IMAGE GALLERY --- */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible no-scrollbar">
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImg(idx)}
                  className={`relative w-20 h-24 md:w-24 md:h-32 flex-shrink-0 cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImg === idx
                      ? "border-slate-900"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={img}
                    alt="thumb"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-grow aspect-[3/4] rounded-[2rem] overflow-hidden bg-slate-50 border border-slate-100 relative group">
              <img
                src={product.images[selectedImg]}
                alt="Product"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <button className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition-all text-slate-900">
                <Heart size={20} />
              </button>
            </div>
          </div>

          {/* --- RIGHT: PRODUCT INFO --- */}
          <div className="lg:col-span-5 space-y-8 py-2">
            <div className="space-y-4">
              <span className="px-4 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < 5 ? "currentColor" : "none"}
                    />
                  ))}
                </div>
                <span className="text-sm text-slate-400 font-medium">
                  ({product.rating} from {product.reviews} Reviews)
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-slate-900">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-xl text-slate-300 line-through font-medium">
                ${product.originalPrice.toFixed(2)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Color Selection */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Available Color
                </h4>
                <div className="flex gap-3">
                  {product.colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="p-1 rounded-full border-2 border-transparent hover:border-slate-900 transition-all cursor-pointer"
                      style={{
                        borderColor: idx === 0 ? "#1a1a1a" : "transparent",
                      }}
                    >
                      <div
                        className="w-6 h-6 rounded-full border border-slate-200"
                        style={{ backgroundColor: color }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity Selection */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Quantity
                </h4>
                <div className="flex items-center gap-6 bg-slate-50 w-fit px-4 py-2 rounded-full border border-slate-100">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    <Minus size={16} strokeWidth={3} />
                  </button>
                  <span className="text-base font-bold w-4 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    <Plus size={16} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Available Size
              </h4>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[60px] py-2.5 rounded-full text-xs font-bold transition-all border ${
                      selectedSize === size
                        ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200"
                        : "bg-white border-slate-100 text-slate-400 hover:border-slate-900 hover:text-slate-900"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="flex-1 bg-slate-900 text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-sm shadow-xl shadow-slate-100 active:scale-[0.98] transition-all">
                Buy It Now
              </button>
              <button className="flex-1 bg-white text-slate-900 border-2 border-slate-900 py-5 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <ShoppingBag size={18} />
                Add to Cart
              </button>
            </div>

            <div className="pt-8 border-t border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                SKU: <span className="text-slate-900 ml-2">{product.sku}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductPage;
