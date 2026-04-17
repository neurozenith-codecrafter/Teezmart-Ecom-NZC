import React from "react";
import { useAdmin } from "../../context/useAdmin";
import {
  TrendingUp,
  ShoppingBag,
  ShieldCheck,
  CreditCard,
  Zap,
  ArrowUpRight,
  Package,
} from "lucide-react";

/**
 * REDESIGNED PREMIUM CARD
 * Style: Luxury SaaS / Minimalist Fintech
 */
const PremiumCard = ({ label, value, icon, isSpecial = false }) => {
  const IconComponent = icon;

  return (
    <div
      className={`relative group overflow-hidden p-7 rounded-[2.5rem] transition-all duration-700 
      ${
        isSpecial
          ? "bg-gradient-to-br from-zinc-50 to-emerald-50/30 border border-emerald-100/20 shadow-[0_1px_2px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.01)]"
          : "bg-white border border-zinc-100 shadow-[0_1px_2px_rgba(0,0,0,0.02),0_8px_24px_rgba(0,0,0,0.02)]"
      } 
      hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:-translate-y-1`}
    >
      {/* Subtle Inner Glow (Top Edge Reflection) */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-60" />

      <div className="flex justify-between items-center mb-8 relative z-10">
        {/* Refined Icon Container */}
        <div
          className={`w-11 h-11 flex items-center justify-center rounded-2xl transition-all duration-500 shadow-sm
          ${
            isSpecial
              ? "bg-white text-emerald-600 border border-emerald-100/50"
              : "bg-zinc-50 text-zinc-400 group-hover:text-emerald-500 border border-zinc-100 group-hover:border-emerald-100 group-hover:bg-emerald-50/30"
          }`}
        >
          <IconComponent size={18} strokeWidth={1.5} />
        </div>

        {/* Premium Trend Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10 transition-transform duration-500 group-hover:scale-105">
          <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">
            Live
          </span>
          <ArrowUpRight
            size={10}
            strokeWidth={2.5}
            className="text-emerald-500"
          />
        </div>
      </div>

      <div className="relative z-10">
        {/* Sharper, more spaced Label */}
        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-[0.25em] mb-1.5">
          {label}
        </p>

        {/* Elegant, Refined Value */}
        <h3 className="text-3xl font-medium tracking-tight text-zinc-900 flex items-baseline gap-1">
          <span className="opacity-[0.85]">{value}</span>
        </h3>
      </div>

      {/* Luxury Reflection Blur - Moves with hover */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-100/40 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

      {/* Aesthetic Micro-gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    </div>
  );
};

export const Dashboard = () => {
  const { admin } = useAdmin();
  const isDevAdmin = admin?.role === "devAdmin";

  return (
    <div className="max-w-7xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
        {/* Standard Premium Cards */}
        <PremiumCard label="Total Revenue" value="₹842,000" icon={CreditCard} />
        <PremiumCard label="Admin Profit" value="₹124,500" icon={TrendingUp} />
        <PremiumCard label="Shipments" value="1,284" icon={ShoppingBag} />

        {/* Special Dev Metrics */}
        {isDevAdmin && (
          <>
            <PremiumCard
              label="Dev Net Profit"
              value="₹42,000"
              icon={ShieldCheck}
              isSpecial={true}
            />
            <PremiumCard
              label="Platform Yield"
              value="₹12,800"
              icon={Zap}
              isSpecial={true}
            />
          </>
        )}
      </div>

      {/* Activity Section - Unchanged as per rules */}
      <section className="space-y-8">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300">
            Log Terminal
          </h2>
          <div className="h-px flex-1 bg-slate-50 ml-6" />
        </div>

        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 min-h-[300px] flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-16 h-16 bg-[#F4F9F6] rounded-full flex items-center justify-center mb-6">
            <Package size={24} className="text-[#86C19F] opacity-50" />
          </div>
          <h4 className="text-[#1A3024] font-bold text-sm tracking-tight">
            Empty Inventory State
          </h4>
          <p className="text-slate-400 text-xs mt-2 max-w-[240px] leading-relaxed">
            Your real-time product logs and transaction history will sync once
            the first shipment is processed.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
