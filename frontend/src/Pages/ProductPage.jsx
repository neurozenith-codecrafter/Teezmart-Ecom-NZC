import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion as Motion } from "framer-motion";
import { Heart, Percent, Box, Truck, Calendar, Share2 } from "lucide-react";
import { PAGE_CONTAINER_CLASS } from "../constants/pageLayout";
import RatingSummary from "../components/ProductPageComponents/RatingSummary";
import { ShippingInfoItem } from "../components/ProductPageComponents/ShippingInfoItem";
import { useCart } from "../Hooks/useCart";
import { useWishlist } from "../Hooks/useWishlist";
import { ShopMoreCarousel } from "../components/ShopMoreCarousel";
import useAnimations from "../Hooks/useAnimation";
import { Toasts } from "../components/Toasts";

const ProductPage = () => {
  const { slug } = useParams();
  const { handleAddToCart } = useCart();
  const { wishlistIds, handleToggleWishlist } = useWishlist();
  const { containerVariants, fadeInUp, subtleReveal } = useAnimations();

  const [product, setProduct] = useState(null);
  const [productImages, setProductImages] = useState([]);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImg, setSelectedImg] = useState(0);
  const [imageDirection, setImageDirection] = useState(1);
  const swipeStartXRef = useRef(null);
  const swipeStartYRef = useRef(null);

  const [toast, setToast] = useState({ show: false, type: "cart", msg: "" });

  const triggerToast = (type, msg) => {
    setToast({ show: true, type, msg });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  useEffect(() => {
    // Fetch product details using the slug from the URL

    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products/${slug}`,
        );
        setProduct(response.data.data);
        setProductImages(response.data.data.images);
        setSelectedImg(0);
        setSelectedSize(response.data.data?.sizes?.[0] || "");
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
    fetchProductDetails();
  }, [slug]);

  const getDeliveryRange = () => {
    const today = new Date();

    const start = new Date(today);
    start.setDate(today.getDate() + 3);

    const end = new Date(today);
    end.setDate(today.getDate() + 5);

    const options = { day: "numeric", month: "short" };

    const startStr = start.toLocaleDateString("en-GB", options);
    const endStr = end.toLocaleDateString("en-GB", options);

    return `${startStr} - ${endStr}`;
  };

  const isLiked = product?._id ? wishlistIds.has(String(product._id)) : false;

  const paginateImage = (direction) => {
    if (!productImages?.length) return;

    setImageDirection(direction === "next" ? 1 : -1);
    setSelectedImg((prev) => {
      if (direction === "next") {
        return (prev + 1) % productImages.length;
      }

      return (prev - 1 + productImages.length) % productImages.length;
    });
  };

  const handleSelectImage = (index) => {
    if (index === selectedImg) return;

    setImageDirection(index > selectedImg ? 1 : -1);
    setSelectedImg(index);
  };

  const handleSwipeStart = (clientX, clientY) => {
    swipeStartXRef.current = clientX;
    swipeStartYRef.current = clientY;
  };

  const handleSwipeEnd = (clientX, clientY) => {
    if (swipeStartXRef.current === null || swipeStartYRef.current === null) {
      return;
    }

    const deltaX = clientX - swipeStartXRef.current;
    const deltaY = clientY - swipeStartYRef.current;
    const threshold = 50;

    swipeStartXRef.current = null;
    swipeStartYRef.current = null;

    if (Math.abs(deltaX) < threshold || Math.abs(deltaX) <= Math.abs(deltaY)) {
      return;
    }

    if (deltaX < 0) {
      paginateImage("next");
      return;
    }

    paginateImage("prev");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title,
          text: product?.description,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback for desktop browsers
      navigator.clipboard.writeText(window.location.href);
      triggerToast("share", "Link copied to clipboard!");
    }
  };

  return (
    <Motion.div
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-[#FBFBFB] font-sans text-black"
    >
      <main className="pt-12 md:pt-4 pb-20">
        <div className={`${PAGE_CONTAINER_CLASS} max-w-screen-xl mx-auto`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-start mb-24">
            {/* LEFT: GALLERY (Animated as a single block) */}

            {(!productImages || productImages.length === 0) && (
              <div className="lg:col-span-8 flex gap-6 justify-start animate-pulse">
                {/* Thumbnail Skeletons */}
                <div className="hidden lg:flex flex-col gap-3 shrink-0">
                  {[...Array(productImages?.length || 4)].map((_, idx) => (
                    <div
                      key={idx}
                      className="w-14 h-18 md:w-16 md:h-20 rounded-lg bg-zinc-200"
                    />
                  ))}
                </div>

                {/* Main Image Skeleton */}
                <div className="flex-grow aspect-[4/5] max-w-[480px] rounded-xl bg-zinc-200 border border-zinc-100" />
              </div>
            )}

            {productImages?.length > 0 && (
              <Motion.div
                variants={subtleReveal}
                className="lg:col-span-8 flex flex-col lg:flex-row gap-4 lg:gap-6 justify-start"
                data-no-swipe
              >
                <div className="order-2 lg:order-1 flex lg:flex-col gap-3 shrink-0 pb-2 lg:pb-0 justify-center">
                  {productImages?.length > 0 &&
                    productImages.map((image, idx) => (
                      <Motion.button
                        key={image._id || idx}
                        onClick={() => handleSelectImage(idx)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 35,
                        }}
                        className={`relative w-14 h-18 md:w-16 md:h-20 rounded-lg overflow-hidden transition-all ${
                          selectedImg === idx
                            ? "ring-1 ring-black"
                            : "opacity-40 hover:opacity-70"
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={`product thumbnail ${idx}`}
                          className="w-full h-full object-cover"
                        />
                      </Motion.button>
                    ))}
                </div>

                {productImages?.[selectedImg]?.url && (
                  <div
                    className="order-1 lg:order-2 overflow-hidden rounded-xl border border-zinc-100 shadow-sm max-w-[480px] bg-white touch-pan-y"
                    data-no-swipe
                    onTouchStart={(e) => {
                      const touch = e.touches[0];
                      if (!touch) return;
                      handleSwipeStart(touch.clientX, touch.clientY);
                    }}
                    onTouchEnd={(e) => {
                      const touch = e.changedTouches[0];
                      if (!touch) return;
                      handleSwipeEnd(touch.clientX, touch.clientY);
                    }}
                  >
                    <Motion.div
                      key={productImages[selectedImg]._id || selectedImg}
                      className="aspect-[4/5]"
                      initial={{ opacity: 0.75, x: imageDirection * 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.12,
                        ease: "easeOut",
                      }}
                    >
                      <img
                        src={productImages[selectedImg].url}
                        alt={`product ${selectedImg}`}
                        className="w-full h-full object-cover pointer-events-none"
                        draggable={false}
                      />
                    </Motion.div>
                  </div>
                )}
              </Motion.div>
            )}

            {/* RIGHT: INFO (Elements appear one by one) */}
            <Motion.div
              variants={containerVariants}
              className="lg:col-span-4 space-y-6 lg:-ml-12 px-2 lg:px-0"
            >
              <Motion.div variants={fadeInUp} className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-900">
                    Premium Collection
                  </span>
                  <div className="h-[1px] bg-zinc-200 flex-grow"></div>
                </div>

                {/* Flex wrapper to seamlessly host Title & Share button together */}
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-3xl font-medium tracking-tight text-black leading-tight flex-grow">
                    {product?.title}
                  </h1>

                  {/* High-end Share Button with spring physics matching your layout style */}
                  <Motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "#f4f4f5" }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    onClick={handleShare}
                    className="p-2.5 border border-zinc-200 bg-white rounded-xl text-black hover:border-black transition-colors duration-300 flex-shrink-0 flex items-center justify-center"
                    aria-label="Share product"
                  >
                    <Share2 size={18} strokeWidth={1.5} />
                  </Motion.button>
                </div>

                <p className="text-[14px] text-zinc-600 leading-relaxed font-light">
                  {product?.description}
                </p>
                <p className="text-2xl font-bold text-black tracking-tighter">
                  ₹{product?.price}
                </p>
              </Motion.div>

              <Motion.div variants={fadeInUp} className="space-y-3 pt-2">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Select Size
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  {(product?.sizes || []).map((size) => (
                    <Motion.button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      whileHover={{ y: -2, transition: { duration: 0.2 } }}
                      whileTap={{ scale: 0.9 }}
                      className={`relative w-10 h-10 rounded-lg text-[11px] font-bold transition-colors duration-300 border ${
                        selectedSize === size
                          ? "bg-black border-black text-white"
                          : "bg-white border-zinc-200 text-zinc-400 hover:border-black hover:text-black"
                      }`}
                    >
                      {selectedSize === size && (
                        <Motion.div
                          layoutId="activeSize"
                          className="absolute inset-0 rounded-lg ring-2 ring-black ring-offset-2"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                        />
                      )}

                      <span className="relative z-10">{size}</span>
                    </Motion.button>
                  ))}
                </div>
              </Motion.div>

              <Motion.div
                variants={fadeInUp}
                className="flex items-center gap-3 pt-2"
              >
                <Motion.button
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 15,
                  }}
                  whileHover={{
                    y: -4,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  }}
                  whileTap={{
                    y: 0,
                    scale: 0.95,
                  }}
                  className="group relative flex-grow bg-black text-white py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg overflow-hidden"
                  onClick={async () => {
                    const added = await handleAddToCart({
                      productId: product._id,
                      quantity: 1,
                      size: selectedSize,
                    });
                    if (added) {
                      triggerToast("cart", "Added to cart!");
                    }
                  }}
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  <span className="relative z-10">Add to Cart</span>
                </Motion.button>

                <Motion.button
                  onClick={async () => {
                    const nextState = await handleToggleWishlist(product);
                    if (nextState === null) return;
                    triggerToast(
                      "wishlist",
                      nextState ? "Added to wishlist" : "Removed from wishlist",
                    );
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className={`p-3.5 border rounded-xl transition-colors duration-300 ${
                    isLiked
                      ? "border-red-100 bg-red-50/30"
                      : "border-zinc-200 bg-white"
                  }`}
                >
                  <Motion.div
                    key={isLiked ? "liked" : "unliked"}
                    initial={{ scale: 1 }}
                    animate={{ scale: isLiked ? [1, 1.4, 1] : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Heart
                      size={18}
                      strokeWidth={1.5}
                      className={`transition-colors duration-300 ${
                        isLiked ? "fill-red-500 text-red-500" : "text-black"
                      }`}
                    />
                  </Motion.div>
                </Motion.button>
              </Motion.div>

              <Motion.div
                variants={fadeInUp}
                className="hidden sm:grid pt-6 border-t border-zinc-100 grid-cols-1 sm:grid-cols-2 gap-y-5"
              >
                <ShippingInfoItem Icon={Percent} label="Offer" val="27% Off" />
                <ShippingInfoItem
                  Icon={Box}
                  label="Packaging"
                  val="Secure Packaging"
                />
                <ShippingInfoItem
                  Icon={Truck}
                  label="Delivery"
                  val="Fast Delivery"
                />
                <ShippingInfoItem
                  Icon={Calendar}
                  label="Arrival"
                  val={getDeliveryRange()}
                />
              </Motion.div>
            </Motion.div>
          </div>

          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div data-no-swipe>
              <ShopMoreCarousel productId={product?._id} />
            </div>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <RatingSummary
              ratingData={product?.rating}
              reviewCount={product?.numReviews}
              ratingsBreakdown={product?.ratingsBreakdown}
            />
          </Motion.div>
        </div>
      </main>
      <Toasts
        type={toast.type}
        message={toast.msg}
        isVisible={toast.show}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />
    </Motion.div>
  );
};

export default ProductPage;
