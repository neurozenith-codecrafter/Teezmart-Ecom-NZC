import { useEffect, useRef, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const DropDown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!ref.current?.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <Motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center justify-between min-w-[150px] bg-[#f9f9f9] border border-[#f0f0f0] px-5 py-2.5 rounded-xl cursor-pointer transition-colors hover:bg-white"
      >
        <span className="text-[14px] text-black">Shop</span>

        <Motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="ml-3 flex items-center"
        >
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </Motion.span>
      </Motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <Motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[calc(100%+8px)] left-0 min-w-[170px] bg-white border border-[#f0f0f0] rounded-xl shadow-lg z-[999] overflow-hidden"
          >
            <button className="w-full text-left px-5 py-3 text-[14px] hover:bg-[#f9f9f9] transition-colors">
              T-Shirts
            </button>

            {/* <button className="w-full text-left px-5 py-3 text-[14px] hover:bg-[#f9f9f9] transition-colors">
              Track Pants
            </button> */}
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DropDown;