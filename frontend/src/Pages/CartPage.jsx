import { useMemo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  isAvailable,
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

  // Render a lightweight unavailable row when the product has been deleted
  if (!isAvailable) {
    return (
      <Motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ type: "spring", stiffness: 500, damping: 35, mass: 0.8 }}
        className="relative border-b border-zinc-100 last:border-0 mx-4 md:mx-0"
      >
        <div className="flex items-center gap-4 md:gap-8 py-6">
          <div className="aspect-[4/5] w-24 md:w-32 bg-zinc-50 rounded-xl shrink-0 flex items-center justify-center border border-zinc-100">
            <span className="text-zinc-300 text-[10px] font-bold uppercase tracking-widest text-center px-2">
              No image
            </span>
          </div>
          <div className="flex flex-col flex-grow gap-2">
            <p className="text-[13px] font-medium text-zinc-400 italic">
              Product no longer available
            </p>
            {item.size && (
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-300 font-bold">
                Size: {item.size}
              </p>
            )}
            <button
              disabled={isBusy}
              onClick={() => onQuantity(item, 0)}
              className="mt-1 self-start flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.25em] text-rose-500 disabled:opacity-50"
            >
              <Trash2 size={11} strokeWidth={2.5} /> Remove
            </button>
          </div>
        </div>
      </Motion.div>
    );
  }

  return (
    <Motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 35,
        mass: 0.8,
      }}
      key={key}
      className="relative group/item border-b border-zinc-100 last:border-0 mx-4 md:mx-0 overflow-hidden"
    >
      {/* 🗑️ MOBILE SWIPE LAYER */}
      <Motion.div
        style={{ opacity: bgOpacity }}
        className="absolute inset-0 bg-rose-50 flex items-center justify-end px-8 md:hidden rounded-[1.25rem] "
      >
        <Motion.div
          style={{
            scale: iconScale,
            rotate: x.get() < -80 ? [0, -10, 10, 0] : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          <Trash2 className="text-rose-500" size={20} />
        </Motion.div>
      </Motion.div>

      {/*  MAIN PRODUCT CARD */}
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
        className="relative bg-white md:bg-transparent flex gap-4 md:gap-8 py-8 items-center z-10"
      >
        {/* Product Image: Removed whileHover zoom/rotate logic */}
        <div className="relative aspect-[4/5] w-24 md:w-32 bg-zinc-50 rounded-xl overflow-hidden shrink-0 shadow-sm border border-zinc-100/50 group-hover/item:shadow-lg transition-shadow duration-500">
          <Motion.img
            src={getProductImage(item)}
            alt={getProductName(item)}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col flex-grow min-w-0 justify-between self-stretch py-0.5">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-start gap-4">
              <div className="min-w-0">
                <h2 className="text-[14px] md:text-lg font-medium text-zinc-900 tracking-tight leading-snug">
                  {getProductName(item)}
                </h2>
                <p className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold mt-1.5">
                  Size:{" "}
                  <span className="text-zinc-600 font-black">{item.size}</span>
                </p>
              </div>

              <div className="flex flex-col items-end leading-none pt-1">
                <span className="text-[9px] md:text-[11px] text-zinc-400 font-bold uppercase tracking-[0.05em] mb-0.5">
                  ₹{getProductPrice(item).toFixed(2)}{" "}
                  <span className="opacity-60 lowercase">ea</span>
                </span>

                <div className="relative h-6 md:h-7 flex items-center overflow-hidden">
                  <AnimatePresence mode="popLayout">
                    <Motion.span
                      key={item.quantity}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                      className="text-lg md:text-xl font-bold text-zinc-900 tracking-tighter"
                    >
                      ₹{(item.quantity * getProductPrice(item)).toFixed(2)}
                    </Motion.span>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-end mt-4">
            <div className="flex flex-col gap-2">
              <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.25em] text-zinc-300 ml-0.5">
                Quantity
              </span>
              <div className="flex items-center gap-4 bg-zinc-50 px-3 py-2 rounded-lg border border-zinc-100/80">
                <Motion.button
                  whileTap={{ scale: 0.8 }}
                  disabled={isBusy}
                  onClick={() => onQuantity(item, item.quantity - 1)}
                  className="text-zinc-400 hover:text-rose-500 transition-colors disabled:opacity-50"
                >
                  <Minus size={11} strokeWidth={3} />
                </Motion.button>

                <div className="relative w-3.5 h-4 overflow-hidden flex items-center justify-center">
                  <AnimatePresence mode="popLayout">
                    <Motion.span
                      key={item.quantity}
                      initial={{ y: 8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -8, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                      className="absolute text-[12px] md:text-[13px] font-black text-zinc-900"
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
                  <Plus size={11} strokeWidth={3} />
                </Motion.button>
              </div>
            </div>

            <Motion.button
              whileHover={{ x: 3 }}
              disabled={isBusy}
              onClick={() => onQuantity(item, 0)}
              className="hidden md:flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.25em] text-rose-500 group/btn"
            >
              <Trash2 size={11} strokeWidth={2.5} />
              <span className="relative">
                Remove
                <span className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-rose-500 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-500 origin-left" />
              </span>
            </Motion.button>
          </div>
        </div>
      </Motion.div>
    </Motion.div>
  );
};

const EmptyCart = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="max-w-[380px] w-full flex flex-col items-center text-center">
        <div className="mb-8">
          <ShoppingBag size={28} strokeWidth={1.2} className="text-zinc-300" />
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tight mb-3">
          Nothing here yet.
        </h1>
        <p className="text-zinc-400 text-[13px] md:text-sm font-medium leading-relaxed mb-10 max-w-[240px]">
          Start exploring and find something you&apos;ll actually want to wear.
        </p>
        <button
          onClick={() => navigate("/")}
          className="w-full sm:w-auto px-8 py-3.5 bg-zinc-900 text-white rounded-full font-bold text-[12px] tracking-widest uppercase transition-all duration-300 hover:bg-zinc-800 active:scale-[0.98]"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

const CartPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    cart,
    cartItems,
    isCartLoading,
    updateCartItem,
    removeCartItem,
    refreshCart,
  } = useCart();
  const [busyKey, setBusyKey] = useState("");
  
  useEffect(() => {
    refreshCart();
  }, [location.pathname, refreshCart]);



  // Resolve the product ObjectId — works even when populate returns null
  // (item.product is always the raw ObjectId string/object from the DB)
  const getProductId = (item) =>
    String(item?.product?._id || item?.product || "");

  const getProductImage = (item) =>
    item?.image || item?.product?.images?.[0]?.url || "";

  const getProductName = (item) => item?.name || item?.product?.title || null; // null signals "unavailable"

  const getProductPrice = (item) =>
    Number(item?.price || item?.product?.price || 0);

  // Whether the product reference is still resolvable (not deleted)
  const isProductAvailable = (item) => !!getProductName(item);

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

    // Always allow removal (qty ≤ 0) even if product was deleted.
    // Block quantity increases/decreases only when no ID can be resolved.
    if (!productId && nextQty > 0) return;
    if (!productId) return; // can't remove without an ID to send to API either

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
    <div className="min-h-screen bg-[#FBFBFB] lg:pt-16 selection:bg-black selection:text-white">
      <div className="max-w-[1300px] w-full mx-auto px-5 md:px-10 lg:px-16 py-8">
        <header className="relative flex items-center justify-center mb-8 md:mb-14 py-1">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 p-2.5 text-zinc-900 hover:bg-zinc-100 rounded-full transition-all active:scale-90"
          >
            <ChevronLeft size={22} strokeWidth={2} />
          </button>
          <h1 className="text-[20px] md:text-2xl font-bold text-zinc-900 tracking-tight">
            Cart
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
            <span className="md:hidden mb-4 ml-1 text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-500">
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
                      isAvailable={isProductAvailable(item)}
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

          <aside className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-16">
            <div className="bg-white rounded-[2rem] border border-zinc-100 p-8 md:p-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)]">
              <h2 className="text-lg font-black text-zinc-900 mb-8 tracking-tight">
                Order Summary
              </h2>

              <div className="bg-zinc-50 p-1.5 rounded-2xl border border-zinc-100 flex items-center mb-8">
                <input
                  type="text"
                  placeholder="Promo Code"
                  className="flex-grow bg-transparent pl-4 pr-2 py-2 text-[12px] font-medium text-zinc-500 outline-none placeholder:text-zinc-300"
                />
                <button className="bg-zinc-900 text-white px-5 py-2.5 rounded-xl text-[9px] font-black tracking-widest uppercase hover:bg-black transition-colors">
                  Apply
                </button>
              </div>

              <div className="space-y-5 px-1 mb-8">
                <div className="flex justify-between items-center text-[12px]">
                  <span className="font-bold text-zinc-400 uppercase tracking-wider">
                    Subtotal
                  </span>
                  <span className="font-black text-zinc-900">
                    ₹{summary.subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[12px]">
                  <span className="font-bold text-zinc-400 uppercase tracking-wider">
                    Offer
                  </span>
                  <span className="font-black text-emerald-600">
                    - ₹{summary.discount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[12px]">
                  <span className="font-bold text-zinc-400 uppercase tracking-wider">
                    Delivery
                  </span>
                  <span className="font-black text-emerald-600 uppercase text-[9px] tracking-widest">
                    Free
                  </span>
                </div>
                <div className="border-t border-dashed border-zinc-200 w-full pt-4" />
                <div className="flex justify-between items-start pt-1">
                  <div className="flex flex-col">
                    <span className="text-base md:text-lg font-black text-zinc-900 tracking-tight">
                      Total
                    </span>
                    <span className="text-[8px] font-black text-zinc-300 uppercase tracking-[0.3em]">
                      {summary.units} Units
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tighter leading-none block">
                      ₹{summary.total.toLocaleString()}
                    </span>
                    <span className="text-[8px] font-bold text-zinc-300 uppercase mt-1.5 block tracking-widest">
                      (GST Included)
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-zinc-900 text-white py-5 rounded-[1.75rem] font-black text-[12px] uppercase tracking-[0.2em] shadow-xl shadow-zinc-200 flex items-center justify-center gap-2.5 active:scale-[0.98] hover:bg-black transition-all"
              >
                Checkout <ArrowRight size={16} />
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
