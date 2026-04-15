import React from "react";
import { useAdmin } from "../../context/useAdmin";
import {
  TrendingUp,
  ShoppingBag,
  ShieldCheck,
  CreditCard,
  Zap,
} from "lucide-react";

const PremiumCard = ({ label, value, icon: Icon, variant = "default" }) => {
  const isIndigo = variant === "indigo";
  const isEmerald = variant === "emerald";

  return (
    <div
      className={`relative overflow-hidden p-8 rounded-3xl border transition-all duration-300 hover:translate-y-[-4px]
      ${
        isIndigo
          ? "bg-slate-900 border-slate-800 text-white shadow-2xl"
          : isEmerald
            ? "bg-emerald-950 border-emerald-900 text-emerald-50 shadow-2xl"
            : "bg-white border-slate-100 text-slate-900 shadow-sm hover:shadow-md"
      }`}
    >
      <div className="flex justify-between items-start mb-8">
        <div
          className={`p-3 rounded-2xl ${isIndigo ? "bg-slate-800" : isEmerald ? "bg-emerald-900" : "bg-slate-50"}`}
        >
          <Icon
            size={22}
            className={
              isIndigo
                ? "text-indigo-400"
                : isEmerald
                  ? "text-emerald-400"
                  : "text-slate-400"
            }
          />
        </div>
        <div
          className={`text-[10px] font-bold uppercase tracking-widest ${isIndigo || isEmerald ? "opacity-50" : "text-slate-300"}`}
        >
          Live Status
        </div>
      </div>

      <div>
        <p
          className={`text-xs font-medium mb-1 uppercase tracking-wider ${isIndigo || isEmerald ? "text-slate-400" : "text-slate-500"}`}
        >
          {label}
        </p>
        <h3 className="text-4xl font-light tracking-tight italic">{value}</h3>
      </div>

      {/* Subtle decorative element for premium feel */}
      <div className="absolute -right-4 -bottom-4 opacity-5">
        <Icon size={120} />
      </div>
    </div>
  );
};

export const Dashboard = () => {
  const { admin } = useAdmin();

  // Dynamic role check
  const isDevAdmin = admin?.role === "dev_admin";

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Stats Grid - Now at the top of the component */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
        {/* Common Stats for both Admins */}
        <PremiumCard label="Total Revenue" value="₹842,000" icon={CreditCard} />
        <PremiumCard
          label="Product Admin Profit"
          value="₹124,500"
          icon={TrendingUp}
        />
        <PremiumCard label="Total Orders" value="1,284" icon={ShoppingBag} />

        {/* Exclusive Dev Admin Stats */}
        {isDevAdmin && (
          <>
            <PremiumCard
              label="Dev Admin Profit"
              value="₹42,000"
              icon={ShieldCheck}
              variant="indigo"
            />
            <PremiumCard
              label="Profit from Revenue"
              value="₹12,800"
              icon={Zap}
              variant="emerald"
            />
          </>
        )}
      </div>

      {/* Simple Table or List Placeholder for "Recent Activity" */}
      <div className="pt-6">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-300 mb-6">
          Recent Inventory
        </h2>
        <div className="bg-white border border-slate-100 rounded-3xl p-4">
          <div className="flex items-center justify-center h-32 border-2 border-dashed border-slate-50 rounded-2xl text-slate-300 text-xs font-medium">
            Detailed logs and product lists will appear here.
          </div>
        </div>
      </div>
    </div>
  );
};
