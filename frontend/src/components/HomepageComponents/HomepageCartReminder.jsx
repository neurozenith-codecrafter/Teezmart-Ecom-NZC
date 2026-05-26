import React from 'react';
import { motion as Motion } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useDevice from '../../Hooks/useDevice';
import { useCommerce } from '../../Hooks/useCommerce';

export default function HomepageCartReminder() {

  const navigate = useNavigate();
  const { isMobile } = useDevice();
  const { cart, cartCount } = useCommerce();

  // If the user has nothing in their cart, the section completely disappears from the homepage layout
  if (!cart || cartCount === 0) return null;

  return (
    <div className="w-full bg-zinc-50/50 py-8 border-y border-zinc-100 my-6">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header Row */}
        <div className="flex items-center justify-between mb-5">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-zinc-900">
              <ShoppingBag size={18} strokeWidth={2} className="text-zinc-800" />
              <h2 className="text-[16px] md:text-lg font-bold tracking-tight">
                Still thinking about these?
              </h2>
            </div>
            <p className="text-zinc-400 text-[11px] md:text-xs font-medium">
              Your pieces are reserved and ready to ship.
            </p>
          </div>

          <button 
            onClick={() => navigate('/cart')}
            className="flex items-center gap-1.5 text-zinc-900 text-[11px] md:text-xs font-black uppercase tracking-wider bg-white px-4 py-2 rounded-full border border-zinc-200/60 shadow-sm active:scale-95 transition-all"
          >
            Open Cart
            <ArrowRight size={14} strokeWidth={2.5} />
          </button>
        </div>

        {/* Horizontal Smooth Track */}
        <div className="flex gap-4 overflow-x-auto pb-3 pt-1 no-scrollbar snap-x h-full">
          {cart?.items?.map((item, index) => (
            <div 
              key={item._id + item.image}
              className={`flex-none w-[140px] md:w-[160px] snap-start transform transition-all duration-700 ease-[cubic-bezier(0.215,0.61,0.355,1.0)]`}
              style={isMobile ? { 
                animation: 'fadeInUp 0.5s ease-out both',
                animationDelay: `${index * 0.05}s` 
              } : {}}
            >
              <div className="space-y-2">
                {/* Media Shell */}
                <div className="relative aspect-[4/5] rounded-2xl bg-zinc-100 overflow-hidden group shadow-sm">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Subtle Badge Overlay */}
                  <div className="absolute top-2 left-2 bg-zinc-900/90 text-white font-bold text-[8px] tracking-wider uppercase px-2 py-0.5 rounded-md backdrop-blur-sm">
                    In Cart
                  </div>
                </div>

                {/* Micro Meta Section */}
                <div className="px-0.5 space-y-0.5">
                  <h4 className="text-[12px] font-medium text-zinc-800 truncate leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[13px] font-black text-zinc-900 italic tracking-tight">
                    ₹{item.price}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}