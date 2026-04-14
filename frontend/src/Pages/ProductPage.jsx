import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Heart, Percent, Box, Truck, Calendar } from "lucide-react";
import { PAGE_CONTAINER_CLASS } from "../constants/pageLayout";
import RatingSummary from "../components/ProductPageComponents/RatingSummary";
import { ShippingInfoItem } from "../components/ProductPageComponents/ShippingInfoItem";
import { useCart } from "../Hooks/useCart";
import { useWishlist } from "../Hooks/useWishlist";
import { ShopMoreCarousel } from "../components/ShopMoreCarousel";
import useAnimations from "../Hooks/useAnimation";

const ProductPage = () => {
  const { slug } = useParams();
  const { handleAddToCart } = useCart();
  const { wishlistIds, handleToggleWishlist } = useWishlist();
  const { containerVariants, fadeInUp, subtleReveal } = useAnimations();

  const [product, setProduct] = useState(null);
  const [productImages, setProductImages] = useState([]);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImg, setSelectedImg] = useState(0);

  useEffect(() => {
    // Fetch product details using the slug from the URL

    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`/api/products/${slug}`);
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
            <Motion.div
              variants={subtleReveal}
              className="lg:col-span-8 flex gap-6 justify-start"
            >
              <div className="hidden lg:flex flex-col gap-3 shrink-0">
                {productImages.map((image, idx) => (
                  <Motion.button
                    key={image._id}
                    onClick={() => setSelectedImg(idx)}
                    // Subtle, controlled interaction
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 35,
                    }}
                    className={`relative w-14 h-18 md:w-16 md:h-20 rounded-lg overflow-hidden ${
                      selectedImg === idx
                        ? "ring-1 ring-black"
                        : "opacity-40 hover:opacity-70"
                    }`}
                  >
                    <img
                      src={image.url}
                      className="w-full h-full object-cover"
                      alt={`thumb-${image._id}`}
                    />
                  </Motion.button>
                ))}
              </div>

              <div className="flex-grow aspect-[4/5] max-w-[480px] rounded-xl overflow-hidden bg-white border border-zinc-100 shadow-sm">
                <AnimatePresence mode="wait">
                  <Motion.img
                    key={productImages[selectedImg]?.url}
                    src={productImages[selectedImg]?.url}
                    alt="Main Product"
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.005 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.998 }}
                    transition={{
                      duration: 0.22,
                      ease: [0.33, 1, 0.68, 1], // smooth, natural easing
                    }}
                  />
                </AnimatePresence>
              </div>
            </Motion.div>

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
                <h1 className="text-3xl font-medium tracking-tight text-black leading-tight">
                  {product?.title || "Product Title"}
                </h1>
                <p className="text-[14px] text-zinc-600 leading-relaxed font-light">
                  {product?.description || "Product description goes here."}
                </p>
                <p className="text-2xl font-bold text-black tracking-tighter">
                  ₹{product?.price || "499"}
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
                      // Interactive States
                      whileHover={{ y: -2, transition: { duration: 0.2 } }}
                      whileTap={{ scale: 0.9 }}
                      className={`relative w-10 h-10 rounded-lg text-[11px] font-bold transition-colors duration-300 border ${
                        selectedSize === size
                          ? "bg-black border-black text-white"
                          : "bg-white border-zinc-200 text-zinc-400 hover:border-black hover:text-black"
                      }`}
                    >
                      {/* High-end "Indicator" Dot (Optional) */}
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
                  // 1. Define the Spring Physics
                  transition={{
                    type: "spring",
                    stiffness: 400, // High stiffness for a snappy start
                    damping: 15, // Low damping for more "bounce" at the end
                  }}
                  // 2. Map Hover State (Replaces hover:-translate-y-0.5 and hover:shadow-2xl)
                  whileHover={{
                    y: -4, // Sightly more exaggerated lift for the bounce feel
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", // tailwind shadow-2xl
                  }}
                  // 3. Map Click/Tap State (Replaces active:scale-95 and active:translate-y-0)
                  whileTap={{
                    y: 0,
                    scale: 0.95,
                  }}
                  // 4. Cleaned up className (removed transition and hover/active transform utilities)
                  className="group relative flex-grow bg-black text-white py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg overflow-hidden"
                  onClick={() =>
                    handleAddToCart({
                      productId: product._id,
                      quantity: 1,
                      size: selectedSize,
                    })
                  }
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />

                  <span className="relative z-10">Add to Cart</span>
                </Motion.button>

                <Motion.button
                  onClick={() => handleToggleWishlist(product)}
                  // Bouncy hover and tap
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
                    // This makes the heart "pop" whenever isLiked changes
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
            <ShopMoreCarousel productId={product?._id}/>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <RatingSummary />
          </Motion.div>
        </div>
      </main>
    </Motion.div>
  );
};

export default ProductPage;
