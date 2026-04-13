import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Minus, ArrowRight, Trash2, ShoppingBag, ChevronLeft } from "lucide-react";
import { motion as Motion, useMotionValue, useTransform } from "framer-motion";
import Loader from "../components/Loader";
import { useCart } from "../Hooks/useCart";

const CartItemRow = ({ item, isBusy, onQuantity, getProductId, getProductImage, getProductName, getProductPrice }) => {
  const productId = getProductId(item);
  const key = `${productId}-${item.size}`;
  const x = useMotionValue(0);
  const iconScale = useTransform(x, [-100, -50], [1.2, 0.5]);
  const bgOpacity = useTransform(x, [-100, 0], [1, 0]);

  return (
    <div key={key} className="relative">
      <Motion.div
        style={{ opacity: bgOpacity }}
        className="absolute inset-0 bg-rose-50 items-center justify-end px-8 md:hidden rounded-2xl flex"
      >
        <Motion.div style={{ scale: iconScale }}>
          <Trash2 className="text-rose-500" size={24} />
        </Motion.div>
      </Motion.div>

      <Motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: -100, right: 0 }}
        dragElastic={0.12}
        style={{ x }}
        onDragEnd={(_, info) => {
          if (info.offset.x < -80) {
            onQuantity(item, 0);
          }
        }}
        className="bg-white rounded-2xl border border-zinc-100 p-4 md:p-6 flex gap-4"
      >
        <img
          src={getProductImage(item)}
          alt={getProductName(item)}
          className="w-24 md:w-28 h-28 md:h-32 rounded-xl object-cover"
        />
        <div className="flex-1">
          <div className="flex justify-between gap-3">
            <div>
              <h2 className="font-bold text-zinc-900 text-sm md:text-base">
                {getProductName(item)}
              </h2>
              <p className="text-xs text-zinc-500 mt-1">Size: {item.size}</p>
            </div>
            <p className="font-bold text-zinc-900">₹{getProductPrice(item)}</p>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2">
              <button disabled={isBusy} onClick={() => onQuantity(item, item.quantity - 1)}>
                <Minus size={14} />
              </button>
              <span className="text-sm font-semibold min-w-4 text-center">{item.quantity}</span>
              <button disabled={isBusy} onClick={() => onQuantity(item, item.quantity + 1)}>
                <Plus size={14} />
              </button>
            </div>

            <button
              disabled={isBusy}
              onClick={() => onQuantity(item, 0)}
              className="hidden md:inline-flex items-center gap-2 text-xs text-rose-500 font-semibold"
            >
              <Trash2 size={13} />
              Remove
            </button>
          </div>
        </div>
      </Motion.div>
    </div>
  );
};

const EmptyCart = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] bg-white flex items-center justify-center p-8">
      <div className="max-w-[420px] w-full flex flex-col items-center text-center">
        <ShoppingBag size={32} strokeWidth={1.2} className="text-zinc-300 mb-8" />
        <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight mb-4">
          Your cart is empty
        </h1>
        <p className="text-zinc-400 text-sm md:text-base font-medium leading-relaxed mb-12 max-w-[280px]">
          Start exploring and add your favorite pieces.
        </p>
        <button
          onClick={() => navigate("/")}
          className="w-full sm:w-auto px-10 py-4 bg-zinc-900 text-white rounded-full font-bold text-[13px] tracking-widest uppercase hover:bg-zinc-700"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, cartItems, isCartLoading, updateCartItem, removeCartItem } = useCart();
  const [busyKey, setBusyKey] = useState("");

  const getProductId = (item) => String(item?.product?._id || item?.product || "");
  const getProductImage = (item) => item?.image || item?.product?.images?.[0]?.url || "";
  const getProductName = (item) => item?.name || item?.product?.title || "Product";
  const getProductPrice = (item) => Number(item?.price || item?.product?.price || 0);

  const summary = useMemo(() => {
    const deliveryFee = 0;
    const tax = 0;
    const discount = cart.discount || 0;
    const subtotal = cart.subtotal || 0;
    const total = subtotal - discount + deliveryFee + tax;
    return {
      subtotal,
      discount,
      deliveryFee,
      tax,
      total,
      units: cart.totalQuantity || 0,
    };
  }, [cart]);

  const handleQuantity = async (item, nextQty) => {
    const productId = getProductId(item);
    const key = `${productId}-${item.size}`;

    if (!productId) return;

    setBusyKey(key);
    try {
      if (nextQty <= 0) {
        await removeCartItem({ productId, size: item.size });
      } else {
        await updateCartItem({
          productId,
          size: item.size,
          quantity: nextQty,
        });
      }
    } finally {
      setBusyKey("");
    }
  };

  if (isCartLoading) return <Loader />;
  if (!cartItems.length) return <EmptyCart />;

  return (
    <div className="min-h-screen bg-[#FBFBFB] py-8 md:py-12">
      <div className="max-w-[1400px] w-full mx-auto px-4 md:px-10 lg:px-20">
        <header className="relative flex items-center justify-center mb-10 md:mb-16 py-2">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 p-2 text-zinc-900 hover:opacity-60"
          >
            <ChevronLeft size={24} strokeWidth={2.5} />
          </button>
          <h1 className="text-[20px] md:text-2xl font-bold text-zinc-800 tracking-tight">
            Cart
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            {cartItems.map((item) => {
              const productId = getProductId(item);
              const key = `${productId}-${item.size}`;
              const isBusy = busyKey === key;

              return (
                <CartItemRow
                  key={key}
                  item={item}
                  isBusy={isBusy}
                  onQuantity={handleQuantity}
                  getProductId={getProductId}
                  getProductImage={getProductImage}
                  getProductName={getProductName}
                  getProductPrice={getProductPrice}
                />
              );
            })}
          </div>

          <aside className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-10">
            <div className="bg-white rounded-[2rem] border border-zinc-100 p-6 md:p-8 shadow-xl shadow-zinc-200/40">
              <h2 className="text-xl font-black text-slate-800 mb-6 tracking-tight">
                Order Summary
              </h2>

              <div className="space-y-3 mb-7 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal ({summary.units} items)</span>
                  <span className="font-bold">₹{summary.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Discount</span>
                  <span className="font-bold text-emerald-600">
                    -₹{summary.discount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Delivery</span>
                  <span className="font-bold">₹{summary.deliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tax</span>
                  <span className="font-bold">₹{summary.tax.toLocaleString()}</span>
                </div>
                <div className="border-t border-dashed border-zinc-200 pt-4 mt-4 flex justify-between items-center">
                  <span className="text-base font-black text-slate-900">Total</span>
                  <span className="text-2xl font-black text-slate-900 tracking-tight">
                    ₹{summary.total.toLocaleString()}
                  </span>
                </div>
              </div>

              <button className="w-full bg-[#18181B] text-white py-4 rounded-[1.2rem] font-bold text-[14px] flex items-center justify-center gap-3 hover:bg-black">
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
