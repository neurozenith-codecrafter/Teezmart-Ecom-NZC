// components/admin/ProductFormModal.jsx
import React from "react";
import { motion } from "framer-motion";
import { X, Upload } from "lucide-react";
motion;

const ProductFormModal = ({ isOpen, onClose, editingProduct }) => {
  if (!isOpen) return null;
  const isEditing = !!editingProduct;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-2xl rounded-[2.5rem] p-12 relative z-10 shadow-2xl border border-zinc-100"
      >
        <button
          onClick={onClose}
          className="absolute top-8 right-8 p-2 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-full transition-all"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-10 tracking-tight text-slate-900">
          {isEditing
            ? "Update T-Shirt Collection"
            : "Add New Collection T-Shirt"}
        </h2>

        <form className="grid grid-cols-2 gap-7">
          <div className="col-span-2 space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">
              Product Title
            </label>
            <input
              type="text"
              defaultValue={editingProduct?.title || ""}
              className="w-full bg-[#FBFBFB] border border-zinc-100 rounded-2xl px-6 py-4 focus:ring-1 focus:ring-black outline-none text-sm font-medium"
              placeholder="e.g. Heavyweight Bone Tee"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">
              Price (₹)
            </label>
            <input
              type="number"
              defaultValue={editingProduct?.price || ""}
              className="w-full bg-[#FBFBFB] border border-zinc-100 rounded-2xl px-6 py-4 focus:ring-1 focus:ring-black outline-none text-sm font-medium"
              placeholder="999"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">
              Initial Stock Level
            </label>
            <input
              type="number"
              defaultValue={editingProduct?.stock || ""}
              className="w-full bg-[#FBFBFB] border border-zinc-100 rounded-2xl px-6 py-4 focus:ring-1 focus:ring-black outline-none text-sm font-medium"
              placeholder="50"
            />
          </div>

          <div className="col-span-2 space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">
              Imagery (Isolated Shot Recommended)
            </label>
            <div className="border-2 border-dashed border-zinc-200 rounded-[2rem] p-10 flex flex-col items-center justify-center gap-3 bg-[#FBFBFB] hover:bg-zinc-100 transition-colors cursor-pointer group">
              <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-zinc-400 group-hover:text-black transition-colors">
                <Upload size={20} />
              </div>
              <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                Drop high-resolution imagery here
              </p>
            </div>
          </div>

          <div className="col-span-2 pt-6">
            <button
              type="submit"
              className="w-full bg-black text-white py-4.5 rounded-2xl font-bold uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-zinc-200 hover:bg-zinc-800 active:scale-[0.98] transition-all"
            >
              {isEditing ? "Update T-Shirt" : "Initialize Collection T-Shirt"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProductFormModal;
