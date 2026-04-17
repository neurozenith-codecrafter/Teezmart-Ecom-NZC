import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  X,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useAuth } from "../../Hooks/useAuth";
motion;

const ALLOWED_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const CATEGORIES = ["tshirt", "trackpant"];

const formatCurrencyINR = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
};

const getApiErrorMessage = (err, fallback = "Something went wrong") => {
  const message =
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    fallback;
  return typeof message === "string" ? message : fallback;
};

const ProductFormModal = ({
  isOpen,
  onClose,
  mode, // "add" | "edit"
  initialProduct,
  onSubmit,
  isSaving,
}) => {
  const isEditing = mode === "edit";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0] || "");
  const [price, setPrice] = useState("");
  const [sizes, setSizes] = useState([]);
  const [newImages, setNewImages] = useState([]); // File[]
  const [removeImages, setRemoveImages] = useState([]); // public_id[]
  const [formError, setFormError] = useState("");

  const existingImages = initialProduct?.images || [];

  useEffect(() => {
    if (!isOpen) return;

    setFormError("");
    setNewImages([]);
    setRemoveImages([]);

    if (isEditing && initialProduct) {
      setTitle(initialProduct.title || "");
      setDescription(initialProduct.description || "");
      setCategory(initialProduct.category || CATEGORIES[0] || "");
      setPrice(
        initialProduct.price === undefined || initialProduct.price === null
          ? ""
          : String(initialProduct.price),
      );
      setSizes(Array.isArray(initialProduct.sizes) ? initialProduct.sizes : []);
    } else {
      setTitle("");
      setDescription("");
      setCategory(CATEGORIES[0] || "");
      setPrice("");
      setSizes([]);
    }
  }, [isOpen, isEditing, initialProduct]);

  const nextExistingImages = useMemo(() => {
    if (!isEditing) return [];
    if (!Array.isArray(existingImages)) return [];
    const removed = new Set(removeImages);
    return existingImages.filter(
      (img) => img?.public_id && !removed.has(img.public_id),
    );
  }, [isEditing, existingImages, removeImages]);

  const canSubmit = useMemo(() => {
    if (isSaving) return false;

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const numericPrice = Number(price);

    if (!trimmedTitle) return false;
    if (!trimmedDescription) return false;
    if (!category) return false;
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) return false;

    if (isEditing) {
      const finalCount = nextExistingImages.length + newImages.length;
      return finalCount >= 1 && finalCount <= 5;
    }

    return newImages.length >= 1 && newImages.length <= 5;
  }, [
    isSaving,
    title,
    description,
    category,
    price,
    isEditing,
    nextExistingImages.length,
    newImages.length,
  ]);

  const onPickImages = (filesList) => {
    const files = Array.from(filesList || []);
    const valid = files.filter(
      (f) => f && f.type && f.type.startsWith("image/"),
    );
    const next = [...newImages, ...valid].slice(0, 5);
    setNewImages(next);
  };

  const toggleSize = (size) => {
    setSizes((prev) => {
      const set = new Set(prev);
      if (set.has(size)) set.delete(size);
      else set.add(size);
      return Array.from(set);
    });
  };

  const toggleRemoveExistingImage = (publicId) => {
    setRemoveImages((prev) => {
      const set = new Set(prev);
      if (set.has(publicId)) set.delete(publicId);
      else set.add(publicId);
      return Array.from(set);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const numericPrice = Number(price);

    if (!trimmedTitle) return setFormError("Product name is required.");
    if (!trimmedDescription) return setFormError("Description is required.");
    if (!category) return setFormError("Category is required.");
    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      return setFormError("Price must be a valid non-negative number.");
    }

    const finalImageCount = isEditing
      ? nextExistingImages.length + newImages.length
      : newImages.length;

    if (finalImageCount < 1)
      return setFormError("At least one image is required.");
    if (finalImageCount > 5)
      return setFormError("Total images cannot exceed 5.");

    const payload = {
      title: trimmedTitle,
      description: trimmedDescription,
      category,
      price: numericPrice,
      sizes,
      newImages,
      removeImages: isEditing ? removeImages : [],
    };

    try {
      await onSubmit(payload);
      onClose();
    } catch (err) {
      setFormError(getApiErrorMessage(err, "Failed to save product"));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white w-full max-w-2xl rounded-[2rem] p-8 md:p-12 relative z-10 shadow-2xl border border-zinc-100 overflow-y-auto max-h-[90vh] no-scrollbar"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-full transition-all"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold mb-8 tracking-tight text-slate-900">
              {isEditing ? "Update Product" : "Add New Product"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Image Upload Area */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">
                  Product Imagery
                </label>
                <div className="group relative border-2 border-dashed border-zinc-100 rounded-[1.5rem] bg-[#FBFBFB] hover:bg-zinc-50 hover:border-zinc-300 transition-all duration-300 min-h-[180px] flex flex-col items-center justify-center cursor-pointer overflow-hidden">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => onPickImages(e.target.files)}
                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                  />
                  <div className="flex flex-col items-center gap-3 py-6">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-zinc-400 group-hover:text-black group-hover:scale-110 transition-all duration-300">
                      <Upload size={20} />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-slate-800">
                        Upload product images (max 5)
                      </p>
                      <p className="text-[10px] text-zinc-400 mt-1 font-medium">
                        Drag and drop or click to browse
                      </p>
                    </div>
                  </div>
                </div>
                {(isEditing || newImages.length > 0) && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
                    {isEditing &&
                      (existingImages || []).map((img) => {
                        const isRemoved = removeImages.includes(img.public_id);
                        return (
                          <button
                            type="button"
                            key={img.public_id}
                            onClick={() =>
                              toggleRemoveExistingImage(img.public_id)
                            }
                            className={`relative aspect-square rounded-xl overflow-hidden border transition-all ${
                              isRemoved
                                ? "border-rose-200 opacity-40"
                                : "border-zinc-100 hover:border-zinc-300"
                            }`}
                            title={
                              isRemoved ? "Will be removed" : "Click to remove"
                            }
                          >
                            <img
                              src={img.url}
                              alt="existing"
                              className="w-full h-full object-cover"
                            />
                            {isRemoved && (
                              <div className="absolute inset-0 bg-rose-500/20 flex items-center justify-center">
                                <span className="text-[9px] font-black uppercase tracking-widest text-rose-600 bg-white/90 px-2 py-1 rounded-md">
                                  Remove
                                </span>
                              </div>
                            )}
                          </button>
                        );
                      })}

                    {newImages.map((file, idx) => (
                      <div
                        key={`${file.name}-${idx}`}
                        className="relative aspect-square rounded-xl overflow-hidden border border-zinc-100"
                        title={file.name}
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt="new"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setNewImages((prev) =>
                              prev.filter((_, i) => i !== idx),
                            )
                          }
                          className="absolute top-1 right-1 bg-white/90 hover:bg-white text-zinc-700 rounded-full p-1 shadow"
                          title="Remove"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#FBFBFB] border border-zinc-100 rounded-xl px-5 py-3.5 focus:ring-1 focus:ring-black outline-none text-sm font-medium"
                  placeholder="Classic Oversized Tee"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full bg-[#FBFBFB] border border-zinc-100 rounded-xl px-5 py-3.5 focus:ring-1 focus:ring-black outline-none text-sm font-medium resize-none"
                  placeholder="Soft cotton, relaxed fit, premium finish..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-[#FBFBFB] border border-zinc-100 rounded-xl px-5 py-3.5 focus:ring-1 focus:ring-black outline-none text-sm font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="1299"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#FBFBFB] border border-zinc-100 rounded-xl px-5 py-3.5 focus:ring-1 focus:ring-black outline-none text-sm font-medium"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">
                  Sizes
                </label>
                <div className="w-full bg-[#FBFBFB] border border-zinc-100 rounded-xl px-5 py-3.5">
                  <div className="flex flex-wrap gap-2">
                    {ALLOWED_SIZES.map((s) => {
                      const active = sizes.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleSize(s)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${
                            active
                              ? "bg-black text-white border-black"
                              : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300"
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-3 font-medium">
                    Leave empty if product has no sizes.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">
                  Sizes
                </label>
                <div className="w-full bg-[#FBFBFB] border border-zinc-100 rounded-xl px-5 py-3.5 text-xs font-semibold text-zinc-500">
                  {sizes.length ? sizes.join(", ") : "—"}
                </div>
              </div>

              {formError && (
                <div className="md:col-span-2 -mt-2">
                  <div className="bg-rose-50 border border-rose-100 text-rose-700 rounded-xl px-4 py-3 text-xs font-semibold">
                    {formError}
                  </div>
                </div>
              )}

              <div className="md:col-span-2 pt-2">
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`w-full py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-[11px] shadow-lg shadow-zinc-200 active:scale-[0.98] transition-all ${
                    canSubmit
                      ? "bg-black text-white hover:bg-zinc-800"
                      : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                  }`}
                >
                  {isSaving
                    ? "Saving..."
                    : isEditing
                      ? "Save Changes"
                      : "Add Product"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const Products = () => {
  const { token } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  const [editingProduct, setEditingProduct] = useState(null);

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  const fetchProducts = async () => {
    setPageError("");
    setIsLoading(true);
    try {
      const res = await axios.get("/api/products");
      const data = res?.data?.data;
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setPageError(getApiErrorMessage(err, "Failed to fetch products"));
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setModalMode("add");
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setModalMode("edit");
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
  };

  const createProduct = async (payload) => {
    setIsSaving(true);
    try {
      if (!token) {
        throw new Error("Missing auth token");
      }
      const fd = new FormData();
      fd.append("title", payload.title);
      fd.append("description", payload.description);
      fd.append("category", payload.category);
      fd.append("price", String(payload.price));
      (payload.sizes || []).forEach((s) => fd.append("sizes", s));
      (payload.newImages || []).forEach((file) => fd.append("images", file));

      const res = await axios.post("/api/admin/products/add", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const created = res?.data?.data;
      if (created && created._id) {
        setProducts((prev) => [created, ...prev]);
      } else {
        await fetchProducts();
      }
    } finally {
      setIsSaving(false);
    }
  };

  const updateProduct = async (id, payload) => {
    setIsSaving(true);
    try {
      if (!token) {
        throw new Error("Missing auth token");
      }
      const fd = new FormData();
      fd.append("title", payload.title);
      fd.append("description", payload.description);
      fd.append("category", payload.category);
      fd.append("price", String(payload.price));

      (payload.sizes || []).forEach((s) => fd.append("sizes", s));
      (payload.removeImages || []).forEach((publicId) =>
        fd.append("removeImages", publicId),
      );
      (payload.newImages || []).forEach((file) => fd.append("images", file));

      const res = await axios.put(`/api/admin/products/update/${id}`, fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const updated = res?.data?.data;
      if (updated && updated._id) {
        setProducts((prev) =>
          prev.map((p) => (p._id === updated._id ? updated : p)),
        );
      } else {
        await fetchProducts();
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (payload) => {
    if (modalMode === "edit") {
      const id = editingProduct?._id;
      if (!id) throw new Error("Missing product ID");
      return updateProduct(id, payload);
    }
    return createProduct(payload);
  };

  const handleDelete = async (product) => {
    const id = product?._id;
    if (!id) return;
    if (deletingId) return;

    setPageError("");
    setDeletingId(id);
    try {
      if (!token) {
        throw new Error("Missing auth token");
      }
      await axios.delete(`/api/admin/products/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setPageError(getApiErrorMessage(err, "Failed to delete product"));
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          Inventory
        </h2>
        <button
          type="button"
          onClick={openAddModal}
          className="bg-black text-white flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-sm active:scale-95 transition-all"
        >
          <Plus size={14} strokeWidth={3} /> Add
        </button>
      </div>

      {pageError && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl px-5 py-4 text-xs font-semibold">
          {pageError}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-[1.5rem] border border-zinc-100 p-3 shadow-sm animate-pulse"
            >
              <div className="aspect-[3/4] bg-zinc-100 rounded-xl mb-5" />
              <div className="px-1 space-y-3">
                <div className="h-5 bg-zinc-100 rounded w-3/4" />
                <div className="h-3 bg-zinc-100 rounded w-1/2" />
                <div className="h-3 bg-zinc-100 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <motion.div
              key={product._id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-[1.5rem] border border-zinc-100 p-3 shadow-sm hover:shadow-xl hover:shadow-zinc-200/50 transition-all group"
            >
              <div className="relative aspect-[3/4] bg-[#F2F2F2] rounded-xl mb-5 overflow-hidden">
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-10 backdrop-blur-[2px]">
                  <button
                    type="button"
                    onClick={() => openEditModal(product)}
                    className="bg-white p-3 rounded-full hover:scale-110 transition-transform shadow-xl text-black"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    type="button"
                    disabled={deletingId === product._id}
                    onClick={() => handleDelete(product)}
                    className={`bg-white p-3 rounded-full transition-transform shadow-xl ${
                      deletingId === product._id
                        ? "text-zinc-300 cursor-not-allowed"
                        : "text-rose-500 hover:scale-110"
                    }`}
                    title={
                      deletingId === product._id ? "Deleting..." : "Delete"
                    }
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                {product?.images?.[0]?.url ? (
                  <img
                    src={product.images[0].url}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    alt={product.title || "product"}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-300">
                    <ImageIcon size={32} />
                  </div>
                )}
              </div>

              <div className="px-1 space-y-3">
                <div>
                  <h4 className="font-bold text-slate-800 tracking-tight text-lg leading-tight">
                    {product.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest mt-1">
                    Category: {product.category || "—"}
                  </p>
                  <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest mt-1">
                    Sizes:{" "}
                    {Array.isArray(product.sizes) && product.sizes.length > 0
                      ? product.sizes.join(", ")
                      : "—"}
                  </p>
                  <p className="text-xs text-zinc-500 mt-2 leading-relaxed line-clamp-2">
                    {product.description || "—"}
                  </p>
                </div>

                <div className="flex justify-between items-center border-t border-zinc-50 pt-4 pb-1">
                  <span className="text-xl font-bold text-slate-900 tracking-tighter">
                    {formatCurrencyINR(product.price)}
                  </span>
                  <span className="text-[9px] font-black bg-zinc-50 px-2.5 py-1.5 rounded-lg text-zinc-400 uppercase tracking-widest border border-zinc-100">
                    Images:{" "}
                    {Array.isArray(product.images) ? product.images.length : 0}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        initialProduct={editingProduct}
        onSubmit={handleSubmit}
        isSaving={isSaving}
      />
    </div>
  );
};

export default Products;
