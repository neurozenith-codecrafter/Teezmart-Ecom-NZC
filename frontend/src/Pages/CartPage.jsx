import React, { useState, useEffect } from "react";
import axios from "axios";
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
import { useAuth } from "../Hooks/useAuth";
import Loader from "../components/Loader";

const CartItem = ({ item, onDelete, onUpdateQuantity }) => {
  const x = useMotionValue(0);
  const iconScale = useTransform(x, [-100, -50], [1.2, 0.5]);
  const bgOpacity = useTransform(x, [-100, 0], [1, 0]);

  return (
    /* Container with a subtle bottom divider that doesn't feel "heavy" */
    <div className="relative group/item border-b border-zinc-100 last:border-0 mx-4 md:mx-0">
      {/* 🗑️ MOBILE SWIPE LAYER */}
      <Motion.div
        style={{ opacity: bgOpacity }}
        className="absolute inset-0 bg-rose-50 flex items-center justify-end px-8 md:hidden rounded-[1.5rem]"
      >
        <Motion.div style={{ scale: iconScale }}>
          <Trash2 className="text-rose-500" size={24} />
        </Motion.div>
      </Motion.div>

      {/* 👕 MAIN PRODUCT CARD */}
      <Motion.div
        drag="x"
        dragDirectionLock
        dragConstraints={{
          left:
            typeof window !== "undefined" && window.innerWidth < 768 ? -100 : 0,
          right: 0,
        }}
        dragElastic={0.1}
        style={{ x }}
        onDragEnd={(_, info) => {
          if (info.offset.x < -80) onDelete(`${item.product._id}-${item.size}`);
        }}
        whileHover={{ x: 5 }} // Slight nudge on hover feels very "flowy"
        className="relative bg-white md:bg-transparent flex gap-4 md:gap-8 py-8 items-center transition-colors duration-300"
      >
        {/* Editorial Aspect Ratio Image */}
        <div className="relative aspect-[4/5] w-24 md:w-32 bg-zinc-50 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-zinc-100/50">
          <Motion.img
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6 }}
            src={item.image}
            className="w-full h-full object-cover"
            alt={item.name}
          />
        </div>

        {/* Content Block */}
        <div className="flex flex-col flex-grow min-w-0 justify-between self-stretch py-1">
          <div className="flex justify-between items-start gap-4">
            <div className="min-w-0">
              <h3 className="text-sm md:text-lg font-bold text-zinc-900 tracking-tight truncate">
                {item.name}
              </h3>
              <p className="text-[10px] md:text-[11px] uppercase tracking-[0.15em] text-zinc-400 font-bold mt-1">
                Size: <span className="text-zinc-600">{item.size}</span>
              </p>
            </div>
            <span className="text-sm md:text-xl font-black text-zinc-900 tracking-tighter">
              ₹{item.price.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-end mt-4">
            {/* Quantity Section with Label */}
            <div className="flex flex-col gap-2">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">
                Quantity
              </span>
              <div className="flex items-center gap-4 bg-zinc-50 px-3 py-2 rounded-xl border border-zinc-100">
                <Motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={() =>
                    onUpdateQuantity(
                      item.product._id,
                      item.size,
                      item.quantity - 1,
                    )
                  }
                  className="text-zinc-400 hover:text-rose-500 transition-colors"
                >
                  <Minus size={14} strokeWidth={3} />
                </Motion.button>

                <div className="relative w-4 h-5 overflow-hidden flex items-center justify-center">
                  <AnimatePresence mode="popLayout" custom={item.quantity}>
                    <Motion.span
                      key={item.quantity}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute text-sm font-black text-zinc-900"
                    >
                      {item.quantity}
                    </Motion.span>
                  </AnimatePresence>
                </div>

                <Motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={() =>
                    onUpdateQuantity(
                      item.product._id,
                      item.size,
                      item.quantity + 1,
                    )
                  }
                  className="text-zinc-400 hover:text-zinc-900 transition-colors"
                >
                  <Plus size={14} strokeWidth={3} />
                </Motion.button>
              </div>
            </div>

            {/* Desktop-Only Remove Button */}
            <Motion.button
              whileHover={{ opacity: 0.7 }}
              onClick={() => onDelete(`${item.product._id}-${item.size}`)}
              className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 group/btn"
            >
              <Trash2 size={12} className="mb-0.5" />
              <span className="relative">
                Remove
                <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-rose-500 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left" />
              </span>
            </Motion.button>
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

export const CartPage = () => {
  const { token } = useAuth();

  const [cart, setCart] = useState({});
  const [items, setItems] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("/api/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCart(response.data.data);
        setItems(response.data.data.items);
        console.log(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, [token]);

  const handleDelete = (id) => {
    setItems((prev) =>
      prev.filter((item) => `${item.product._id}-${item.size}` !== id),
    );
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] selection:bg-black selection:text-white md:flex md:items-center md:justify-center lg:items-start lg:pt-20">
      {isLoading ? (
        <Loader />
      ) : !items.length ? (
        <EmptyCart />
      ) : (
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
                    key={`${item.product._id}-${item.size}`}
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
                    <span className="font-bold text-slate-500">cart</span>
                    <span className="font-black text-slate-900">
                      ₹{cart.subtotal}
                    </span>
                  </div>
                  <div className="border-t border-dashed border-zinc-200 w-full" />
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
                      Total
                    </span>
                    <div className="text-right">
                      <span className="text-[24px] md:text-[32px] font-black text-slate-900 tracking-tighter leading-none block">
                        ₹{cart.totalPrice}
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
      )}
    </div>
  );
};

export default CartPage;
