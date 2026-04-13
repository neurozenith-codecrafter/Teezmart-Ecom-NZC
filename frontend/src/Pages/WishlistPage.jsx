import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { motion as Motion } from "framer-motion";
import { useWishlist } from "../Hooks/useWishlist";
import { useCart } from "../Hooks/useCart";
import { PAGE_CONTAINER_CLASS } from "../constants/pageLayout";
import { useState } from "react";

const WishlistPage = () => {
  const navigate = useNavigate();
  const { wishlistItems, wishlistIds, handleToggleWishlist } = useWishlist();
  const { handleAddToCart } = useCart();
  const [loadingProductId, setLoadingProductId] = useState(null);

  const handleMoveToCart = async (product) => {
    const defaultSize = product?.sizes?.[0];
    if (!defaultSize) return;

    setLoadingProductId(product._id);
    try {
      await handleAddToCart({
        productId: product._id,
        quantity: 1,
        size: defaultSize,
      });
    } finally {
      setLoadingProductId(null);
    }
  };

  if (!wishlistItems.length) {
    return (
      <div className="min-h-[70vh] bg-[#FBFBFB] flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-md">
          <Heart className="mx-auto w-9 h-9 text-zinc-300 mb-4" />
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 mb-3">
            Your wishlist is empty
          </h1>
          <p className="text-zinc-500 mb-8">
            Save products you love and come back whenever you want.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 rounded-full bg-zinc-900 text-white text-sm font-semibold tracking-wide hover:bg-black transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FBFBFB] min-h-screen py-8 md:py-12">
      <div className={PAGE_CONTAINER_CLASS}>
        <div className="flex items-end justify-between mb-8 md:mb-12">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">
              Wishlist
            </h1>
            <p className="text-zinc-500 mt-2 text-sm md:text-base">
              {wishlistItems.length} saved item{wishlistItems.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {wishlistItems.map((item) => (
            <Motion.div
              key={item._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl md:rounded-3xl overflow-hidden border border-zinc-100"
            >
              <Link to={`/product/${item.slug}`} className="block relative aspect-[3/4]">
                <img
                  src={item?.images?.[0]?.url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    await handleToggleWishlist(item);
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/85 backdrop-blur text-rose-500"
                >
                  <Heart
                    size={16}
                    className={wishlistIds.has(String(item._id)) ? "fill-rose-500" : ""}
                  />
                </button>
              </Link>

              <div className="p-3 md:p-4">
                <h2 className="text-sm md:text-base font-bold text-zinc-900 line-clamp-1">
                  {item.title}
                </h2>
                <p className="text-zinc-600 font-semibold mt-1 text-sm md:text-lg">
                  ₹{item.price}
                </p>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleMoveToCart(item)}
                    disabled={loadingProductId === item._id}
                    className="flex-1 py-2 rounded-xl bg-zinc-900 text-white text-xs md:text-sm font-semibold flex items-center justify-center gap-1 disabled:opacity-60"
                  >
                    <ShoppingBag size={14} />
                    {loadingProductId === item._id ? "Adding..." : "Move to Cart"}
                  </button>
                  <button
                    onClick={() => handleToggleWishlist(item)}
                    className="px-3 rounded-xl border border-zinc-200 text-zinc-600 hover:text-rose-500 hover:border-rose-200"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </Motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
