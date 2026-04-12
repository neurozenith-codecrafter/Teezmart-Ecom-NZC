import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Percent, Box, Truck, Calendar, Star } from "lucide-react";
import { PAGE_CONTAINER_CLASS } from "../constants/pageLayout";
import Navbar from "../components/Navbar";
import RatingSummary from "../components/ProductPageComponents/RatingSummary";

motion;
// Animation settings
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const subtleReveal = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94], // smooth cubic bezier
    },
  },
};

const ProductPage = () => {
  const { id } = useParams();

  // const { handleAddToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [productImages, setProductImages] = useState([]);

  const [selectedSize, setSelectedSize] = useState("S");
  const [selectedImg, setSelectedImg] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    // Fetch product details using the id from the URL
    // Example: axios.get(`/api/products/${id}`).then(response => setProduct(response.data));

    const fecthProductDetails = async () => {
      try {
        const response = await axios.get(`/api/products/${id}`);
        setProduct(response.data.data);
        setProductImages(response.data.data.images);

        console.log("Response message ->", response.data.message);
        console.log("Product data ->", response.data.data);
        console.log("Product images URL ->", response.data.data.images);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
    fecthProductDetails();
  }, [id]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-[#FBFBFB] font-sans text-black"
    >
      <Navbar />

      <main className="pt-28 md:pt-40 pb-20">
        <div className={`${PAGE_CONTAINER_CLASS} max-w-screen-xl mx-auto`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-start mb-24">
            {/* LEFT: GALLERY (Animated as a single block) */}
            <motion.div
              variants={subtleReveal}
              className="lg:col-span-8 flex gap-6 justify-start"
            >
              <div className="hidden lg:flex flex-col gap-3 shrink-0">
                {productImages.map((image, idx) => (
                  <motion.button
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
                  </motion.button>
                ))}
              </div>

              <div className="flex-grow aspect-[4/5] max-w-[480px] rounded-xl overflow-hidden bg-white border border-zinc-100 shadow-sm">
                <AnimatePresence mode="wait">
                  <motion.img
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
            </motion.div>

            {/* RIGHT: INFO (Elements appear one by one) */}
            <motion.div
              variants={containerVariants}
              className="lg:col-span-4 space-y-6 lg:-ml-12 px-2 lg:px-0"
            >
              <motion.div variants={fadeInUp} className="space-y-4">
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
              </motion.div>

              <motion.div variants={fadeInUp} className="space-y-3 pt-2">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Select Size
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  {["S", "M", "L", "XL", "XXL"].map((size) => (
                    <motion.button
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
                        <motion.div
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
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="flex items-center gap-3 pt-2"
              >
                <motion.button
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
                  onClick={() => {
                    console.log("Add to cart clicked ->", product);
                  }} // Implement this function to add the product to cart
                >
                  {/* The Shine Layer (Kept exactly the same) */}
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />

                  <span className="relative z-10">Add to Cart</span>
                </motion.button>

                <motion.button
                  onClick={() => setIsLiked(!isLiked)}
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
                  <motion.div
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
                  </motion.div>
                </motion.button>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="hidden sm:grid pt-6 border-t border-zinc-100 grid-cols-1 sm:grid-cols-2 gap-y-5"
              >
                <ShippingItem icon={Percent} label="Offer" val="50% Off" />
                <ShippingItem icon={Box} label="Packaging" val="Luxury Box" />
                <ShippingItem icon={Truck} label="Delivery" val="Fast Track" />
                <ShippingItem icon={Calendar} label="Arrival" val="10-12 Oct" />
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <RatingSummary />
          </motion.div>
        </div>
      </main>
    </motion.div>
  );
};

const ShippingItem = ({ icon, label, val }) => (
  <div className="flex items-center gap-3">
    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-50 text-black">
      {React.createElement(icon, { size: 14, strokeWidth: 1.5 })}
    </div>
    <div>
      <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest">
        {label}
      </p>
      <p className="text-[11px] text-black font-bold">{val}</p>
    </div>
  </div>
);

export default ProductPage;
