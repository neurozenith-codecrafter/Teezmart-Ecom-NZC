import React, { useState } from "react";
import {
  Plus,
  Minus,
  ChevronLeft,
  ArrowRight,
  Trash2,
  ShoppingBag,
} from "lucide-react";
import {
  motion as Motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";

const CartItem = ({ item, onDelete }) => {
  const x = useMotionValue(0);

  // Dynamic transformations for a tactile mobile swipe feel
  const iconScale = useTransform(x, [-100, -50], [1.2, 0.5]);
  const bgOpacity = useTransform(x, [-100, 0], [1, 0]);

  return (
    <div className="relative overflow-hidden mb-1 rounded-[1.5rem] md:rounded-0 md:mb-0">
      {/* 🗑️ MOBILE SWIPE LAYER */}
      <Motion.div
        style={{ opacity: bgOpacity }}
        className="absolute inset-0 bg-rose-50 flex items-center justify-end px-8 md:hidden"
      >
        <Motion.div style={{ scale: iconScale }}>
          <Trash2 className="text-rose-500" size={24} />
        </Motion.div>
      </Motion.div>

      {/* 👕 MAIN PRODUCT CARD */}
      <Motion.div
        drag="x"
        dragDirectionLock
        // Only allow swiping on mobile devices
        dragConstraints={{
          left:
            typeof window !== "undefined" && window.innerWidth < 768 ? -100 : 0,
          right: 0,
        }}
        dragElastic={0.1}
        style={{ x }}
        onDragEnd={(_, info) => {
          if (info.offset.x < -80) onDelete(item.id);
        }}
        className="relative bg-white md:bg-transparent flex gap-4 md:gap-6 py-6 border-b border-zinc-50 items-center group last:border-0 px-4 md:px-0"
      >
        {/* Editorial Aspect Ratio Image */}
        <div className="relative aspect-square w-20 md:w-32 bg-zinc-100 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shrink-0 shadow-sm border border-zinc-50">
          <img
            src={item.image}
            className="w-full h-full object-cover"
            alt={item.name}
          />
        </div>

        {/* Content Block */}
        <div className="flex flex-col flex-grow min-w-0 justify-between h-full py-1">
          <div className="flex justify-between items-start gap-2">
            <div className="min-w-0">
              <h3 className="text-sm md:text-lg font-bold text-slate-800 tracking-tight truncate">
                {item.name}
              </h3>
              <p className="text-[11px] md:text-sm text-slate-400 font-medium mt-0.5">
                Ref: {item.stockInfo}
              </p>
            </div>
            <span className="text-sm md:text-lg font-black text-slate-900 tracking-tight whitespace-nowrap">
              ₹{item.price.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center mt-3 md:mt-6">
            {/* Quantity Pill */}
            <div className="flex items-center gap-3 bg-white border border-zinc-100 p-1 rounded-full shadow-sm shrink-0">
              <button className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-slate-400 hover:text-black border border-zinc-100 rounded-full transition-colors active:scale-90">
                <Minus size={12} md:size={14} strokeWidth={3} />
              </button>
              <span className="text-xs md:text-sm font-black text-slate-800 px-1">
                {item.qty}
              </span>
              <button className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-[#18181B] text-white rounded-full transition-transform active:scale-90">
                <Plus size={12} md:size={14} strokeWidth={3} />
              </button>
            </div>

            {/* Desktop-Only Remove Link */}
            <button
              onClick={() => onDelete(item.id)}
              className="hidden md:block text-[10px] md:text-xs font-bold text-rose-500 uppercase tracking-widest hover:underline transition-all"
            >
              Remove
            </button>
          </div>
        </div>
      </Motion.div>
    </div>
  );
};

const EmptyCart = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8 selection:bg-zinc-900 selection:text-white">
      <div className="max-w-[420px] w-full flex flex-col items-center text-center">
        <div className="mb-10">
          <ShoppingBag size={32} strokeWidth={1.2} className="text-zinc-300" />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight mb-4">
          Nothing here yet.
        </h1>

        <p className="text-zinc-400 text-sm md:text-base font-medium leading-relaxed mb-12 max-w-[280px]">
          Start exploring and find something you&apos;ll actually want to wear.
        </p>

        <button className="w-full sm:w-auto px-10 py-4 bg-zinc-900 text-white rounded-full font-bold text-[13px] tracking-widest uppercase transition-colors duration-300 hover:bg-zinc-700 active:scale-[0.98]">
          Continue Shopping
        </button>

        <div className="mt-20 opacity-0 select-none pointer-events-none">.</div>
      </div>
    </div>
  );
};

const CartPage = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Drawstring Hoodie",
      stockInfo: "25/43",
      qty: "01",
      price: 1499.0,
      image:
        "https://i.pinimg.com/1200x/f2/cc/b7/f2ccb7ab73dda6947619291522e01e77.jpg",
    },
    {
      id: 2,
      name: "Fashion Hoodie",
      stockInfo: "20/14",
      qty: "01",
      price: 1299.0,
      image:
        "https://i.pinimg.com/736x/a7/e9/0d/a7e90dd949514229dc04291d21ad2d40.jpg",
    },
    {
      id: 3,
      name: "Reebok Hoodie",
      stockInfo: "26/45",
      qty: "01",
      price: 999.0,
      image:
        "https://i.pinimg.com/736x/62/2c/30/622c3034337829762cc0fabdd7a35b00.jpg",
    },
  ]);

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  if (!items.length) {
    return <EmptyCart />;
  }

  return (
    <div className="min-h-screen bg-[#FBFBFB] selection:bg-black selection:text-white md:flex md:items-center md:justify-center lg:items-start lg:pt-20">
      <div className="max-w-[1400px] w-full mx-auto px-4 md:px-10 lg:px-20 py-10 md:py-12 lg:py-0">
        {/* PRECISE HEADER EXTRACTION FROM IMAGE */}
        <header className="relative flex items-center justify-center mb-10 md:mb-16 py-2">
          {/* Back Button positioned absolutely to the left to allow true centering of title */}
          <button className="absolute left-0 p-2 text-zinc-900 hover:opacity-60 transition-opacity active:scale-90">
            <ChevronLeft size={24} strokeWidth={2.5} />
          </button>

          {/* Centered Title matching the image typography */}
          <h1 className="text-[20px] md:text-2xl font-bold text-zinc-800 tracking-tight">
            Cart
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* ... rest of the code remains exactly the same */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <Motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: -100, height: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                >
                  <CartItem item={item} onDelete={handleDelete} />
                </Motion.div>
              ))}
            </AnimatePresence>
          </div>

          <aside className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-10">
            <div className="bg-white rounded-[2.5rem] border border-zinc-100 p-8 md:p-10 shadow-xl shadow-zinc-200/40">
              <h2 className="text-xl font-black text-slate-800 mb-8 tracking-tight">
                Order Summary
              </h2>
              {/* Summary content continues... */}
              <div className="bg-[#FBFBFB] p-1.5 rounded-[2rem] border border-zinc-100 flex items-center mb-8">
                <input
                  type="text"
                  placeholder="Promo Code"
                  className="flex-grow bg-transparent pl-5 pr-2 py-3 text-sm font-medium text-slate-600 outline-none"
                />
                <button className="bg-[#18181B] text-white px-6 py-3 rounded-[1.6rem] text-xs font-bold tracking-widest uppercase">
                  Apply
                </button>
              </div>
              <div className="space-y-5 px-1 mb-10">
                <div className="flex justify-between items-center text-sm md:text-base">
                  <span className="font-bold text-slate-500">Sub Total</span>
                  <span className="font-black text-slate-900">₹3797.00</span>
                </div>
                <div className="border-t border-dashed border-zinc-200 w-full" />
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
                    Total
                  </span>
                  <div className="text-right">
                    <span className="text-[24px] md:text-[32px] font-black text-slate-900 tracking-tighter leading-none block">
                      ₹3917.00
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase mt-1 block">
                      (Inc. all taxes)
                    </span>
                  </div>
                </div>
              </div>
              <button className="w-full bg-[#18181B] text-white py-5 rounded-[2.2rem] font-bold text-[16px] shadow-lg flex items-center justify-center gap-3 active:scale-[0.98] transition-all">
                Checkout Now <ArrowRight size={18} />
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
