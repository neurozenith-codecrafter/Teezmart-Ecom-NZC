import React from "react";
import { Star, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";

// Reusing your DUMMY_PRODUCTS logic
const PRODUCTS = [
  {
    _id: "1",
    title: "Polo with Contrast Trims",
    price: 212,
    slug: "polo-contrast",
    rating: 4.0,
    img: "https://i.pinimg.com/736x/62/2c/30/622c3034337829762cc0fabdd7a35b00.jpg",
  },
  {
    _id: "2",
    title: "Gradient Graphic T-shirt",
    price: 145,
    slug: "gradient-graphic",
    rating: 3.5,
    img: "https://i.pinimg.com/1200x/59/13/76/5913766b1e90301f5372cca0fd446e28.jpg",
  },
  {
    _id: "3",
    title: "Polo with Tipping Details",
    price: 180,
    slug: "polo-tipping",
    rating: 4.5,
    img: "https://i.pinimg.com/1200x/42/27/7c/42277c6ee51bb0a9ae700aade699a05b.jpg",
  },
  {
    _id: "4",
    title: "Striped Jacket",
    price: 120,
    slug: "striped-jacket",
    rating: 5.0,
    img: "https://i.pinimg.com/1200x/29/61/1b/29611b83311bf4e7a86a51ef090083c7.jpg",
  },
  {
    _id: "5",
    title: "Oversized Street Hoodie",
    price: 299,
    slug: "oversized-hoodie",
    rating: 4.8,
    img: "https://i.pinimg.com/1200x/01/88/9a/01889a48305fca69c530fc5aa735a9d3.jpg",
  },
  {
    _id: "6",
    title: "Classic White Tee",
    price: 89,
    slug: "classic-white",
    rating: 4.2,
    img: "https://i.pinimg.com/1200x/85/f5/ab/85f5ab828c6283e80bf92d97651a15ab.jpg",
  },
  {
    _id: "7",
    title: "Midnight Denim Jacket",
    price: 450,
    slug: "denim-jacket",
    rating: 4.9,
    img: "https://i.pinimg.com/736x/84/fe/54/84fe5483e7baf091ef9cdf475cc7d400.jpg",
  },
  {
    _id: "8",
    title: "Urban Cargo Pants",
    price: 195,
    slug: "cargo-pants",
    rating: 4.3,
    img: "https://i.pinimg.com/1200x/80/38/c2/8038c25bec701cc59c247664e02b605f.jpg",
  },
  {
    _id: "9",
    title: "Vintage Flannel Shirt",
    price: 165,
    slug: "flannel-shirt",
    rating: 4.6,
    img: "https://i.pinimg.com/1200x/ac/f9/49/acf949c5a1b1af629c8adf2bb27f28af.jpg",
  },
  {
    _id: "10",
    title: "Tech Shell Windbreaker",
    price: 540,
    slug: "windbreaker",
    rating: 4.7,
    img: "https://i.pinimg.com/736x/8e/73/a3/8e73a39cfa8046fddf971135b06de1b0.jpg",
  },
  {
    _id: "11",
    title: "Essential Black Joggers",
    price: 130,
    slug: "black-joggers",
    rating: 4.4,
    img: "https://i.pinimg.com/1200x/42/27/7c/42277c6ee51bb0a9ae700aade699a05b.jpg",
  },
  {
    _id: "12",
    title: "Heavyweight Cotton Tee",
    price: 75,
    slug: "heavy-tee",
    rating: 4.1,
    img: "https://i.pinimg.com/736x/62/2c/30/622c3034337829762cc0fabdd7a35b00.jpg",
  },
];

const ProductCard = ({ product, index }) => {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.4 }}
      className="group"
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="space-y-3">
          <div className="relative aspect-[4/5] rounded-[1.8rem] md:rounded-[2.2rem] bg-[#F3F3F3] overflow-hidden transition-all duration-700 group-hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)]">
            <img
              src={product.img}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <button className="bg-white/90 backdrop-blur-md text-black text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-full shadow-xl hover:bg-black hover:text-white transition-colors">
                Quick Add +
              </button>
            </div>
          </div>

          <div className="space-y-1.5 px-1">
            <h3 className="text-[14px] font-medium text-zinc-900 truncate tracking-tight">
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
              <span className="text-[16px] font-black text-zinc-900 tracking-tighter italic">
                ₹{product.price}
              </span>
              <span className="text-[11px] text-zinc-300 line-through font-medium">
                ₹{Math.round(product.price * 1.3)}
              </span>
              <span className="text-red-500 text-[9px] font-black uppercase italic">
                -30%
              </span>
            </div>
          </div>
        </div>
      </Link>
    </Motion.div>
  );
};

export const CatalogPage = () => {
  return (
    <div className="min-h-screen bg-[#FBFBFB] pt-8 md:pt-12 pb-20 px-4 md:px-10 lg:px-16">
      {/* Header Section - Reduced bottom margin and padding */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="space-y-0.5">
          <h1 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tighter uppercase italic leading-none">
            Collection <span className="text-zinc-300">/ 26</span>
          </h1>
          <p className="text-zinc-400 text-[11px] font-medium tracking-tight uppercase">
            Curated streetwear essentials.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-full text-zinc-600 hover:border-black hover:text-black transition-all text-[10px] font-bold uppercase tracking-widest shadow-sm">
            <SlidersHorizontal size={12} /> Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-full text-zinc-600 hover:border-black hover:text-black transition-all text-[10px] font-bold uppercase tracking-widest shadow-sm">
            Sort <ChevronDown size={12} />
          </button>
        </div>
      </div>

      <div className="flex gap-10">
        {/* Sidebar - Adjusted spacing */}
        <aside className="hidden lg:block w-56 space-y-8">
          <div>
            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4">
              Categories
            </h4>
            <ul className="space-y-3 text-[12px] font-medium text-zinc-600">
              <li className="text-black font-bold flex items-center justify-between">
                All Products <span className="text-[9px] opacity-30">48</span>
              </li>
              <li className="hover:text-black transition-colors cursor-pointer">
                Outerwear
              </li>
              <li className="hover:text-black transition-colors cursor-pointer">
                T-Shirts & Tops
              </li>
              <li className="hover:text-black transition-colors cursor-pointer">
                Bottoms
              </li>
            </ul>
          </div>
          <div className="pt-5 border-t border-zinc-100">
            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4">
              Price Range
            </h4>
            <div className="h-[2px] bg-zinc-100 relative">
              <div className="absolute left-0 right-1/4 h-full bg-black"></div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-black rounded-full"></div>
              <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-black rounded-full"></div>
            </div>
          </div>
        </aside>

        {/* Main Grid */}
        <main className="flex-1">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
            {PRODUCTS.map((item, index) => (
              <ProductCard key={item._id} product={item} index={index} />
            ))}
          </div>

          <div className="mt-16 flex justify-center border-t border-zinc-100 pt-8">
            <button className="px-8 py-3.5 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-black transition-all shadow-lg active:scale-95">
              Load More
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CatalogPage;
