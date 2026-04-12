import React, { useState } from "react";
import { Plus, Edit3, Trash2, X, Upload } from "lucide-react";

const ProductFormModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        role="presentation"
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      />
      <div className="bg-white w-full max-w-2xl rounded-[3rem] p-10 relative z-10 shadow-2xl animate-in fade-in zoom-in duration-300">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-8 right-8 p-2 hover:bg-zinc-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-8 tracking-tight">Add New T-Shirt</h2>

        <form className="grid grid-cols-2 gap-6">
          <div className="col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
              Product Name
            </label>
            <input
              type="text"
              className="w-full bg-zinc-50 border-zinc-100 rounded-2xl px-5 py-3 focus:ring-black focus:border-black transition-all"
              placeholder="e.g. Heavyweight Bone Tee"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
              Price (₹)
            </label>
            <input
              type="number"
              className="w-full bg-zinc-50 border-zinc-100 rounded-2xl px-5 py-3 focus:ring-black"
              placeholder="999"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
              Stock
            </label>
            <input
              type="number"
              className="w-full bg-zinc-50 border-zinc-100 rounded-2xl px-5 py-3 focus:ring-black"
              placeholder="50"
            />
          </div>

          <div className="col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
              Image Upload
            </label>
            <div className="border-2 border-dashed border-zinc-200 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-3 bg-zinc-50/50 hover:bg-zinc-50 transition-colors cursor-pointer group">
              <Upload
                size={24}
                className="text-zinc-300 group-hover:text-black transition-colors"
              />
              <p className="text-xs font-bold text-zinc-400">
                Click to upload or drag & drop
              </p>
            </div>
          </div>

          <div className="col-span-2 pt-4">
            <button
              type="submit"
              className="w-full bg-black text-white py-4 rounded-2xl font-bold uppercase tracking-[0.2em] shadow-xl shadow-zinc-200 hover:bg-zinc-800 active:scale-[0.98] transition-all"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-zinc-200 active:scale-95 transition-all"
        >
          <Plus size={16} strokeWidth={3} /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white rounded-[2.5rem] border border-zinc-100 p-4 shadow-sm group"
          >
            <div className="aspect-square bg-zinc-100 rounded-[2rem] mb-6 overflow-hidden relative">
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  className="bg-white p-3 rounded-full hover:scale-110 transition-transform shadow-xl"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  type="button"
                  className="bg-white p-3 rounded-full hover:scale-110 transition-transform shadow-xl text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <img
                src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400"
                className="w-full h-full object-cover"
                alt="product"
              />
            </div>
            <div className="px-2">
              <h4 className="font-bold text-zinc-900 tracking-tight">Sand Oversized Fit</h4>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1 mb-3">
                Sizes: S, M, L, XL
              </p>
              <div className="flex justify-between items-center border-t border-zinc-50 pt-3">
                <span className="text-lg font-black tracking-tighter">₹1,299</span>
                <span className="text-[10px] font-black bg-zinc-50 px-2 py-1 rounded-md text-zinc-400 uppercase tracking-widest">
                  In Stock: 42
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ProductFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
