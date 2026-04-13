import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Minus,
  ArrowRight,
  Trash2,
  ShoppingBag,
  ChevronLeft,
} from "lucide-react";
import {
  motion as Motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import Loader from "../components/Loader";
import { useCart } from "../Hooks/useCart";

const CartItemRow = ({
  item,
  isBusy,
  onQuantity,
  getProductId,
  getProductImage,
  getProductName,
  getProductPrice,
}) => {
  const productId = getProductId(item);
  const key = `${productId}-${item.size}`;
  const x = useMotionValue(0);

  const iconScale = useTransform(x, [-100, -50], [1.2, 0.5]);
  const bgOpacity = useTransform(x, [-100, 0], [1, 0]);

  return (
    <div
      key={key}
      className="relative group/item border-b border-zinc-100 last:border-0 mx-4 md:mx-0 overflow-hidden"
    >
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
        dragElastic={0.05}
        style={{ x }}
        onDragEnd={(_, info) => {
          if (info.offset.x < -80 || info.velocity.x < -500) {
            onQuantity(item, 0);
          } else {
            animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
          }
        }}
        className="relative bg-white md:bg-transparent flex gap-5 md:gap-10 py-10 items-center z-10 transition-colors duration-300"
      >
        <div className="relative aspect-[4/5] w-28 md:w-36 bg-zinc-50 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-zinc-100/50">
          <Motion.img
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6 }}
            src={getProductImage(item)}
            alt={getProductName(item)}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col flex-grow min-w-0 justify-between self-stretch py-1">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-start gap-4">
              <div className="min-w-0">
                {/* Product Name: Reduced to font-medium */}
                <h2 className="text-[15px] md:text-xl font-medium text-zinc-900 tracking-tight leading-snug">
                  {getProductName(item)}
                </h2>
                <p className="text-[9px] md:text-[11px] uppercase tracking-[0.2em] text-zinc-400 font-bold mt-2">
                  Size:{" "}
                  <span className="text-zinc-600 font-black">{item.size}</span>
                </p>
              </div>
              {/* Price: Reduced to font-medium/semibold */}
              <span className="text-base md:text-2xl font-medium text-zinc-900 tracking-tighter">
                ₹{getProductPrice(item).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-end mt-6">
            <div className="flex flex-col gap-2.5">
              <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.25em] text-zinc-300 ml-1">
                Quantity
              </span>
              <div className="flex items-center gap-5 bg-zinc-50 px-4 py-2.5 rounded-xl border border-zinc-100">
                <Motion.button
                  whileTap={{ scale: 0.8 }}
                  disabled={isBusy}
                  onClick={() => onQuantity(item, item.quantity - 1)}
                  className="text-zinc-400 hover:text-rose-500 transition-colors disabled:opacity-50"
                >
                  <Minus size={13} strokeWidth={3} />
                </Motion.button>

                <div className="relative w-4 h-5 overflow-hidden flex items-center justify-center">
                  <AnimatePresence mode="popLayout">
                    <Motion.span
                      key={item.quantity}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute text-[13px] md:text-sm font-black text-zinc-900"
                    >
                      {item.quantity}
                    </Motion.span>
                  </AnimatePresence>
                </div>

                <Motion.button
                  whileTap={{ scale: 0.8 }}
                  disabled={isBusy}
                  onClick={() => onQuantity(item, item.quantity + 1)}
                  className="text-zinc-400 hover:text-zinc-900 transition-colors disabled:opacity-50"
                >
                  <Plus size={13} strokeWidth={3} />
                </Motion.button>
              </div>
            </div>

            <Motion.button
              whileHover={{ opacity: 0.7 }}
              disabled={isBusy}
              onClick={() => onQuantity(item, 0)}
              className="hidden md:flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.25em] text-rose-500 group/btn"
            >
              <Trash2 size={12} strokeWidth={2.5} />
              <span className="relative">
                Remove
                <span className="absolute -bottom-1.5 left-0 w-full h-[1.5px] bg-rose-500 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-500 origin-left" />
              </span>
            </Motion.button>
          </div>
        </div>
      </Motion.div>
    </div>
  );
};

const EmptyCart = () => {
  const navigate = useNavigate();
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
        <button
          onClick={() => navigate("/")}
          className="w-full sm:w-auto px-10 py-4 bg-zinc-900 text-white rounded-full font-bold text-[13px] tracking-widest uppercase transition-all duration-300 hover:bg-zinc-800 active:scale-[0.98]"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, cartItems, isCartLoading, updateCartItem, removeCartItem } =
    useCart();
  const [busyKey, setBusyKey] = useState("");

  const getProductId = (item) =>
    String(item?.product?._id || item?.product || "");
  const getProductImage = (item) =>
    item?.image || item?.product?.images?.[0]?.url || "";
  const getProductName = (item) =>
    item?.name || item?.product?.title || "Product";
  const getProductPrice = (item) =>
    Number(item?.price || item?.product?.price || 0);

  const summary = useMemo(
    () => ({
      subtotal: cart.subtotal || 0,
      discount: cart.discount || 0,
      deliveryFee: 0,
      total: (cart.subtotal || 0) - (cart.discount || 0),
      units: cart.totalQuantity || 0,
    }),
    [cart],
  );

  const handleQuantity = async (item, nextQty) => {
    const productId = getProductId(item);
    const key = `${productId}-${item.size}`;
    if (!productId) return;
    setBusyKey(key);
    try {
      if (nextQty <= 0) {
        await removeCartItem({ productId, size: item.size });
      } else {
        await updateCartItem({ productId, size: item.size, quantity: nextQty });
      }
    } finally {
      setBusyKey("");
    }
  };

  if (isCartLoading) return <Loader />;
  if (!cartItems.length) return <EmptyCart />;

  return (
    <div className="min-h-screen bg-[#FBFBFB] md:flex md:items-center md:justify-center lg:items-start lg:pt-20 selection:bg-black selection:text-white">
      <div className="max-w-[1400px] w-full mx-auto px-4 md:px-10 lg:px-20 py-10">
        <header className="relative flex items-center justify-center mb-10 md:mb-20 py-2">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 p-3 text-zinc-900 hover:bg-zinc-100 rounded-full transition-all active:scale-90"
          >
            <ChevronLeft size={24} strokeWidth={2} />
          </button>
          <h1 className="text-[22px] md:text-3xl font-bold text-zinc-900 tracking-tight">
            Cart
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
            {/* Repositioned Mobile Hint: Top Left of Product List */}
            <span className="md:hidden mb-4 ml-1 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">
              Swipe left to delete
            </span>

            <AnimatePresence mode="popLayout" initial={false}>
              {cartItems.map((item) => {
                const key = `${getProductId(item)}-${item.size}`;
                return (
                  <Motion.div
                    key={key}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{
                      opacity: 0,
                      x: -100,
                      height: 0,
                      transition: { duration: 0.4 },
                    }}
                    transition={{ type: "spring", damping: 28, stiffness: 250 }}
                  >
                    <CartItemRow
                      item={item}
                      isBusy={busyKey === key}
                      onQuantity={handleQuantity}
                      getProductId={getProductId}
                      getProductImage={getProductImage}
                      getProductName={getProductName}
                      getProductPrice={getProductPrice}
                    />
                  </Motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <aside className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-20">
            {/* Order Summary UI stays the same */}
            <div className="bg-white rounded-[2.5rem] border border-zinc-100 p-10 md:p-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.04)]">
              <h2 className="text-xl font-black text-zinc-900 mb-10 tracking-tight">
                Order Summary
              </h2>

              <div className="bg-zinc-50 p-2 rounded-[2rem] border border-zinc-100 flex items-center mb-10">
                <input
                  type="text"
                  placeholder="Promo Code"
                  className="flex-grow bg-transparent pl-5 pr-2 py-3 text-[13px] font-medium text-zinc-500 outline-none placeholder:text-zinc-300"
                />
                <button className="bg-zinc-900 text-white px-7 py-3 rounded-[1.6rem] text-[10px] font-black tracking-widest uppercase hover:bg-black transition-colors">
                  Apply
                </button>
              </div>

              <div className="space-y-6 px-1 mb-10">
                <div className="flex justify-between items-center text-[13px]">
                  <span className="font-bold text-zinc-400 uppercase tracking-wider">
                    Subtotal
                  </span>
                  <span className="font-black text-zinc-900">
                    ₹{summary.subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="font-bold text-zinc-400 uppercase tracking-wider">
                    Offer
                  </span>
                  <span className="font-black text-emerald-600">
                    - ₹{summary.discount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="font-bold text-zinc-400 uppercase tracking-wider">
                    Delivery Fee
                  </span>
                  <span className="font-black text-emerald-600 uppercase text-[10px] tracking-widest">
                    Free
                  </span>
                </div>
                <div className="border-t border-dashed border-zinc-200 w-full pt-4" />
                <div className="flex justify-between items-start pt-2">
                  <div className="flex flex-col">
                    <span className="text-lg md:text-xl font-black text-zinc-900 tracking-tight">
                      Total
                    </span>
                    <span className="text-[9px] font-black text-zinc-300 uppercase tracking-[0.3em]">
                      {summary.units} Units
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tighter leading-none block">
                      ₹{summary.total.toLocaleString()}
                    </span>
                    <span className="text-[9px] font-bold text-zinc-300 uppercase mt-2 block tracking-widest">
                      (GST Included)
                    </span>
                  </div>
                </div>
              </div>

              <button className="w-full bg-zinc-900 text-white py-6 rounded-[2.2rem] font-black text-[14px] uppercase tracking-[0.2em] shadow-2xl shadow-zinc-200 flex items-center justify-center gap-3 active:scale-[0.98] hover:bg-black transition-all">
                Checkout <ArrowRight size={18} />
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
