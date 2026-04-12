import React, { useState } from "react";
import { Plus, Edit3, Trash2, X, Upload, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
motion;

const ProductFormModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/20 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-2xl rounded-[2rem] p-8 md:p-12 relative z-10 shadow-2xl border border-zinc-100"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-full transition-all"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-8 tracking-tight text-slate-900">
          Add New Product
        </h2>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">
              Product Name
            </label>
            <input
              type="text"
              className="w-full bg-[#FBFBFB] border border-zinc-100 rounded-xl px-5 py-3.5 focus:ring-1 focus:ring-black outline-none text-sm font-medium"
              placeholder="Classic Oversized Tee"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">
              Price (₹)
            </label>
            <input
              type="number"
              className="w-full bg-[#FBFBFB] border border-zinc-100 rounded-xl px-5 py-3.5 focus:ring-1 focus:ring-black outline-none text-sm font-medium"
              placeholder="1299"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">
              Initial Stock
            </label>
            <input
              type="number"
              className="w-full bg-[#FBFBFB] border border-zinc-100 rounded-xl px-5 py-3.5 focus:ring-1 focus:ring-black outline-none text-sm font-medium"
              placeholder="100"
            />
          </div>

          <div className="md:col-span-2 pt-4">
            <button
              type="submit"
              className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-[11px] shadow-lg shadow-zinc-200 hover:bg-zinc-800 active:scale-[0.98] transition-all"
            >
              Add Product
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* HEADER SECTION - Compact and inline */}
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          Inventory
        </h2>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-sm active:scale-95 transition-all"
        >
          <Plus size={14} strokeWidth={3} /> Add
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="bg-white rounded-[1.5rem] border border-zinc-100 p-3 shadow-sm hover:shadow-xl hover:shadow-zinc-200/50 transition-all group"
          >
            <div className="relative aspect-[3/4] bg-[#F2F2F2] rounded-xl mb-5 overflow-hidden">
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-10 backdrop-blur-[2px]">
                <button className="bg-white p-3 rounded-full hover:scale-110 transition-transform shadow-xl text-black">
                  <Edit3 size={18} />
                </button>
                <button className="bg-white p-3 rounded-full hover:scale-110 transition-transform shadow-xl text-rose-500">
                  <Trash2 size={18} />
                </button>
              </div>
              <img
                src="https://i.pinimg.com/1200x/f2/cc/b7/f2ccb7ab73dda6947619291522e01e77.jpg"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="product"
              />
            </div>

            <div className="px-1 space-y-3">
              <div>
                <h4 className="font-bold text-slate-800 tracking-tight text-lg leading-tight">
                  Sand Oversized Fit
                </h4>
                <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest mt-1">
                  Sizes: S, M, L, XL
                </p>
              </div>

              <div className="flex justify-between items-center border-t border-zinc-50 pt-4 pb-1">
                <span className="text-xl font-bold text-slate-900 tracking-tighter">
                  ₹1,299
                </span>
                <span className="text-[9px] font-black bg-zinc-50 px-2.5 py-1.5 rounded-lg text-zinc-400 uppercase tracking-widest border border-zinc-100">
                  Stock: 42
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <ProductFormModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products;
