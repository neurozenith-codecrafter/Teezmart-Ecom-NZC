import React from "react";
import { useAdmin } from "../../context/useAdmin";
import { TrendingUp, DollarSign, Package, ShoppingBag } from "lucide-react";

const StatCard = ({ label, value, icon, trend, color }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color}`}>
        {React.createElement(icon, { size: 24, className: "text-white" })}
      </div>
      {trend && (
        <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-50 text-green-600">
          +{trend}%
        </span>
      )}
    </div>
    <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">
      {label}
    </p>
    <h3 className="text-2xl font-black text-zinc-900 tracking-tighter">{value}</h3>
  </div>
);

export const Dashboard = () => {
  const { admin } = useAdmin();

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
          <p className="text-zinc-500 text-sm mt-1">
            Here&apos;s what&apos;s happening with TeezMart today.
          </p>
        </div>
        <button
          type="button"
          className="bg-black text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
        >
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Products"
          value="124"
          icon={Package}
          color="bg-blue-500"
          trend="12"
        />
        <StatCard
          label="Total Orders"
          value="842"
          icon={ShoppingBag}
          color="bg-orange-500"
          trend="18"
        />

        {admin.role === "DEV_ADMIN" ? (
          <>
            <StatCard
              label="Total Profit"
              value="₹4,28,000"
              icon={DollarSign}
              color="bg-emerald-500"
              trend="24"
            />
            <StatCard
              label="Dev Admin Share"
              value="₹1,12,000"
              icon={TrendingUp}
              color="bg-indigo-500"
            />
          </>
        ) : (
          <StatCard
            label="My Profit"
            value="₹42,500"
            icon={DollarSign}
            color="bg-emerald-500"
            trend="5"
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-zinc-100 min-h-[400px] flex items-center justify-center text-zinc-300 font-bold uppercase tracking-widest text-sm">
          Sales Analytics Chart Placeholder
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100">
          <h4 className="font-bold text-lg mb-6">Recent Activity</h4>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4 items-center">
                <div className="w-2 h-2 rounded-full bg-zinc-200" />
                <div>
                  <p className="text-sm font-bold text-zinc-800 tracking-tight">
                    New Order #8429
                  </p>
                  <p className="text-[10px] text-zinc-400 font-medium">
                    2 minutes ago
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
