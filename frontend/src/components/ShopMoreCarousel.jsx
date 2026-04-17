import React, { useRef, useState, useEffect } from "react";
import { Star, ArrowRight, ChevronRight, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion as Motion, useMotionValue, animate } from "framer-motion";
import Loader from "../components/Loader"
import { buildApiUrl } from "../constants/api";

// --- PROFESSIONAL DUMMY DATA ---

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/product/${product.slug}`}
      className="flex-shrink-0 w-[160px] md:w-[220px] group pointer-events-auto"
    >
      <div className="space-y-3 md:space-y-4">
        <div className="relative aspect-[4/5] rounded-[1.8rem] md:rounded-[2.2rem] bg-[#F3F3F3] overflow-hidden transition-all duration-500 group-hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)]">
          <img
            src={product.images?.[0]?.url}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-1.5 px-1">
          <h3 className="text-[13px] md:text-[15px] font-medium text-zinc-900 truncate tracking-tight">
            {product.title}
          </h3>
          <div className="flex items-center gap-1">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={10}
                  fill={i < 4 ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth={2}
                />
              ))}
            </div>
            <span className="text-[10px] text-zinc-400 font-bold tracking-tighter">
              4.5
            </span>
          </div>
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-[14px] md:text-[17px] font-black text-zinc-900 tracking-tighter leading-none">
              ₹{product.price}
            </span>
            <span className="text-[10px] md:text-[12px] text-zinc-300 line-through font-medium">
              ₹{Math.round(product.price * 1.3)}
            </span>
            <span className="bg-red-50 text-red-500 text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase">
              -30%
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const NavButton = ({ onClick, icon, label }) => {
  const IconComponent = icon;

  return (
    <Motion.button
      whileHover={{
        scale: 1.05,
        backgroundColor: "#18181b",
        color: "#fff",
        borderColor: "#18181b",
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-full text-zinc-500 shadow-sm transition-all duration-300 cursor-pointer"
    >
      <IconComponent size={16} strokeWidth={2.5} />
      <span className="text-[10px] font-black uppercase tracking-widest">
        {label}
      </span>
    </Motion.button>
  );
};

export const ShopMoreCarousel = ({ productId }) => {
  const containerRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });
  const x = useMotionValue(0);

  useEffect(() => {
    if (!productId) return;

    x.set(0);

    const fetchRelated = async () => {
      try {
        const res = await axios.get(buildApiUrl(`/api/products/${productId}/suggestions`));

        if (res.data.data?.length > 0) {
          setProducts(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching show more ->", error);
      }
    };

    fetchRelated();
  }, [productId, x]);

  useEffect(() => {
    const updateConstraints = () => {
      requestAnimationFrame(() => {
        if (!containerRef.current) return;

        const scrollWidth = containerRef.current.scrollWidth;
        const offsetWidth = containerRef.current.offsetWidth;

        const maxDrag = Math.min(0, offsetWidth - scrollWidth - 80);
        setConstraints({ left: maxDrag, right: 0 });
      });
    };

    updateConstraints(); // ✅ runs AFTER products render

    window.addEventListener("resize", updateConstraints);
    return () => window.removeEventListener("resize", updateConstraints);
  }, [products]); // ✅ KEY CHANGE

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      // Sensitivity factor - touchpads often send very small deltas
      const sensitivity = 1.2;

      // If the user is swiping horizontally on trackpad
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        const currentX = x.get();
        const newX = currentX - e.deltaX * sensitivity;

        // Apply hard boundaries so we don't scroll into infinity
        const boundedX = Math.max(constraints.left, Math.min(0, newX));
        x.set(boundedX);
      }
    };

    // Use non-passive to allow e.preventDefault()
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [constraints, x]);

  const slide = (direction) => {
    // Slide by roughly 2 cards width
    const slideAmount = direction === "right" ? -460 : 460;
    const targetX = Math.max(
      constraints.left,
      Math.min(0, x.get() + slideAmount),
    );

    animate(x, targetX, {
      type: "spring",
      stiffness: 200, // Slightly lower stiffness for "heavier" premium feel
      damping: 30,
      mass: 0.8,
    });
  };

  return (
    <section className="py-16 border-t border-zinc-100 overflow-hidden bg-[#FBFBFB]">
      <div className="flex items-center justify-between mb-10 px-1">
        <h2 className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tight">
          Shop More
        </h2>
        <div className="hidden md:flex items-center gap-3">
          <NavButton
            onClick={() => slide("left")}
            icon={ChevronLeft}
            label="Prev"
          />
          <NavButton
            onClick={() => slide("right")}
            icon={ChevronRight}
            label="Next"
          />
        </div>
      </div>

      <div className="relative overflow-visible">
        <Motion.div
          ref={containerRef}
          drag="x"
          style={{ x }}
          dragConstraints={constraints}
          dragElastic={0.1}
          dragTransition={{ bounceStiffness: 600, bounceDamping: 35 }}
          whileTap={{ cursor: "grabbing" }}
          className="flex gap-5 md:gap-8 cursor-grab active:cursor-grabbing select-none"
        >
          {
            !products.length ? <Loader /> :
            products.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))
          }

          <Link
            to="/catalog"
            className="flex-shrink-0 w-32 md:w-48 flex flex-col items-center justify-center gap-4 group"
          >
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-500 shadow-sm border border-zinc-200/50">
              <ArrowRight size={22} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-black transition-colors">
              Explore All
            </span>
          </Link>
        </Motion.div>
      </div>
    </section>
  );
};

export default ShopMoreCarousel;
