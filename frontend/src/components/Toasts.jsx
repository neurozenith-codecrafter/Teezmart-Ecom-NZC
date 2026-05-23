import { AnimatePresence, motion as Motion } from "framer-motion";
import { CheckCircle, Heart, HeartOff, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";
import useDevice from "../Hooks/useDevice";

export const Toasts = ({ type, message, isVisible, onClose }) => {
  const { isMobile } = useDevice();

  const configs = {
    cart: {
      icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
    wishlist: {
      // ✅ Dynamic icon check based on message content
      icon: message?.toLowerCase().includes("removed") ? (
        <HeartOff className="w-5 h-5 text-zinc-400" />
      ) : (
        <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
      ),
      bg: message?.toLowerCase().includes("removed")
        ? "bg-zinc-50"
        : "bg-pink-50",
      border: message?.toLowerCase().includes("removed")
        ? "border-zinc-200"
        : "border-pink-100",
    },
    delete: {
      icon: <Trash2 className="w-5 h-5 text-rose-500" />,
      bg: "bg-rose-50",
      border: "border-rose-100",
    },
  };

  const currentConfig = configs[type] || configs.cart;

  const handleToLinkRoute = () => {
    switch (type) {
      case "cart":
        return "/cart";
      case "wishlist":
        return "/wishlist";
      default:
        return window.location.href; // Stay on the same page for 'delete' or unknown types
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <Link
          to={handleToLinkRoute()}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] pointer-events-none px-4 w-full flex justify-center"
        >
          <Motion.div
            // Zero movement or scaling. Just an instant/ultra-fast opacity flash.
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: isMobile
                ? { duration: 0 }
                : { duration: 0.1, ease: "linear" },
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.1 },
            }}
            className={`
              pointer-events-auto flex items-center gap-3.5 px-4 py-2.5
              rounded-2xl border shadow-md bg-white
              ${currentConfig.bg} ${currentConfig.border}
              w-full max-w-[320px]
            `}
          >
            {/* Grayed icon filter if it's a deletion/removal action */}
            <div
              className={`shrink-0 ${message.toLowerCase().includes("removed") ? "text-zinc-400 grayscale contrast-75" : ""}`}
            >
              {currentConfig.icon}
            </div>

            {/* Content Group */}
            <div className="flex flex-col flex-grow min-w-0">
              <p className="text-[13px] font-semibold text-zinc-900 leading-tight">
                {message}
              </p>

              {/* Ultra-subtle, secondary context string */}
              {(type === "wishlist" || type === "cart" || type === "bag") && (
                <span className="text-[10px] font-medium text-zinc-400 mt-0.5 tracking-tight">
                  {type === "wishlist" ? "View wishlist →" : "View full bag →"}
                </span>
              )}
            </div>

            {/* Static Close Anchor */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="p-1 -mr-0.5 rounded-full text-zinc-400 hover:text-zinc-900 transition-colors shrink-0"
            >
              <X className="w-4 h-4 stroke-[2.5px]" />
            </button>
          </Motion.div>
        </Link>
      )}
    </AnimatePresence>
  );
};
