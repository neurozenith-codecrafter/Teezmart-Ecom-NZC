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

const PremiumCard = ({ label, value, icon, isSpecial = false }) => {
  const IconComponent = icon;

  return (
    <div
      className={`relative group overflow-hidden p-8 rounded-[2rem] border transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-100/50 hover:-translate-y-1
      ${
        isSpecial
          ? "bg-[#F4F9F6] border-emerald-100/50"
          : "bg-white border-slate-100"
      }`}
    >
      <div className="flex justify-between items-start mb-10">
        <div
          className={`p-3 rounded-2xl transition-colors duration-500 ${
            isSpecial
              ? "bg-white text-[#2D4F3C]"
              : "bg-slate-50 text-slate-400 group-hover:text-[#86C19F]"
          }`}
        >
          <IconComponent size={20} strokeWidth={1.5} />
        </div>

        {/* Minimal "Trend" indicator instead of "Live Status" text */}
        <div className="flex items-center gap-1 text-[#86C19F]">
          <span className="text-[10px] font-black tracking-tighter uppercase">
            Active
          </span>
          <ArrowUpRight size={12} strokeWidth={3} />
        </div>
      </div>

      <div className="relative z-10">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
          {label}
        </p>
        <h3 className="text-4xl font-light tracking-tight text-[#1A3024] italic">
          {value}
        </h3>
      </div>

      {/* Aesthetic Background Geometry - replaced big icon for a cleaner look */}
      <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-[#EBF5EE] rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </div>
  );
};

export const Dashboard = () => {
  const { admin } = useAdmin();

  // Role check matches your AdminLayout logic
  const isDevAdmin = admin?.role === "devAdmin";

  return (
    <div className="max-w-7xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Dynamic Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
        {/* Global Metrics */}
        <PremiumCard label="Total Revenue" value="₹842,000" icon={CreditCard} />
        <PremiumCard label="Admin Profit" value="₹124,500" icon={TrendingUp} />
        <PremiumCard label="Shipments" value="1,284" icon={ShoppingBag} />

        {/* Conditional Dev Metrics - styled as "Special" cards */}
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

      {/* Activity Section */}
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
