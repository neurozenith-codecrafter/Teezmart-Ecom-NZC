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
      bg: message?.toLowerCase().includes("removed") ? "bg-zinc-50" : "bg-pink-50",
      border: message?.toLowerCase().includes("removed") ? "border-zinc-200" : "border-pink-100",
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
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
          <Motion.div
            initial={{ opacity: 0, scale: 0, width: "0px", filter: "blur(8px)" }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              width: "auto", 
              filter: "blur(0px)",
              transition: { type: "spring", stiffness: 350, damping: 25, mass: 0.5 }
            }}
            exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)", transition: { duration: 0.2 } }}
            className={`
              pointer-events-auto flex items-center gap-3 px-4 py-2.5
              rounded-full border shadow-2xl backdrop-blur-md
              ${currentConfig.bg} ${currentConfig.border}
              min-w-[280px] max-w-[90vw] whitespace-nowrap
            `}
          >
            <Motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3 w-full"
            >
              <div className="shrink-0">{currentConfig.icon}</div>
              
              <p className="flex-grow text-[13px] font-bold tracking-tight text-zinc-800">
                {message}
              </p>

              <div className="h-4 w-[1px] bg-zinc-200/80 mx-1" />

              <button 
                onClick={onClose}
                className="p-1 rounded-full hover:bg-black/5 transition-colors text-zinc-400 hover:text-zinc-900"
              >
                <X className="w-4 h-4" />
              </button>
            </Motion.div>
          </Motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};