import { AnimatePresence, motion as Motion } from "framer-motion";
import { CheckCircle, Heart, HeartOff, Trash2, X } from "lucide-react";

export const Toasts = ({ type, message, isVisible, onClose }) => {
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

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] pointer-events-none px-4 w-full flex justify-center">
          <Motion.div
            // Hardware-accelerated properties only (GPU-friendly)
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 30,
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              transition: { duration: 0.1 },
            }}
            // Using your original color logic
            className={`
          pointer-events-auto flex items-center gap-3 px-5 py-3
          rounded-2xl border-2 shadow-lg bg-white/95
          ${currentConfig.bg} ${currentConfig.border}
          w-full max-w-[340px]
        `}
          >
            <div className="shrink-0">{currentConfig.icon}</div>

            <div className="flex flex-col flex-grow min-w-0">
              <p className="text-[13px] font-bold text-zinc-900 leading-tight">
                {message}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 -mr-1 rounded-full hover:bg-black/5 text-zinc-400 active:text-zinc-900"
            >
              <X className="w-4 h-4 stroke-[3px]" />
            </button>
          </Motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
