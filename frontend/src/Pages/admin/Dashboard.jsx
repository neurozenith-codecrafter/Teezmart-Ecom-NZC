import React from "react";
import { useAdmin } from "../../context/useAdmin";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  MoreHorizontal,
  Users,
  ShoppingBag,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Refined StatCard matching the "Sales Report" reference exactly
const StatCard = ({ label, value, trend, isUp, icon: Icon, isPrimary }) => (
  <div
    className={`p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between h-full transition-all hover:shadow-md ${isPrimary ? "bg-[#5D5FEF] text-white" : "bg-white text-slate-900"}`}
  >
    <div className="flex justify-between items-start">
      <div
        className={`p-3 rounded-2xl ${isPrimary ? "bg-white/20 text-white" : "bg-slate-50 text-slate-400"}`}
      >
        <Icon size={20} />
      </div>
      <div
        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${isPrimary ? "bg-[#B2FF81] text-[#006B3D]" : isUp ? "bg-emerald-50 text-emerald-500" : "bg-rose-50 text-rose-500"}`}
      >
        {isUp ? "+" : "-"}
        {trend}%
      </div>
    </div>

    <div className="mt-6">
      <p
        className={`text-xs font-medium mb-1 ${isPrimary ? "text-white/70" : "text-slate-400"}`}
      >
        {label}
      </p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
        <span
          className={`text-[9px] font-medium whitespace-nowrap uppercase tracking-tighter ${isPrimary ? "text-white/50" : "text-slate-300"}`}
        >
          vs last month
        </span>
      </div>
    </div>
  </div>
);

const SvgTooltip = ({ x, y, value }) => (
  <g transform={`translate(${x}, ${y - 20})`} pointerEvents="none">
    <rect x={-56} y={-30} width={112} height={32} rx={12} fill="#1e293b" />
    <circle cx={-33} cy={-14} r={10} fill="#4ade80" />
    <path
      d="M -36 -14 L -33 -17 L -30 -14"
      fill="none"
      stroke="#1e293b"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M -33 -17 L -33 -10"
      fill="none"
      stroke="#1e293b"
      strokeWidth={1.75}
      strokeLinecap="round"
    />
    <text
      x={10}
      y={-10}
      textAnchor="middle"
      fill="white"
      fontSize="12"
      fontWeight="700"
    >
      ₹{value.toLocaleString()}
    </text>
    <polygon points="-6,2 6,2 0,10" fill="#1e293b" />
  </g>
);

const CustomXAxisTick = ({ x, y, payload }) => {
  const isActive = payload.value === "Apr";
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="middle"
        fill={isActive ? "#1e293b" : "#94a3b8"}
        fontSize={11}
        fontWeight={isActive ? 800 : 600}
      >
        {payload.value}
      </text>
      {isActive && (
        <line
          x1="-10"
          y1="25"
          x2="10"
          y2="25"
          stroke="#1e293b"
          strokeWidth={2}
        />
      )}
    </g>
  );
};

export const Dashboard = () => {
  const { admin } = useAdmin();
  const [activePoint, setActivePoint] = React.useState(null);

  const dummySalesData = [
    { name: "Mar", sales: 4500 },
    { name: "Apr", sales: 0 },
    { name: "May", sales: 9400 },
    { name: "Jun", sales: 5400 },
    { name: "Jul", sales: 7000 },
    { name: "Oct", sales: 6200 },
    { name: "Nov", sales: 6200 },
    { name: "Dec", sales: 3800 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700 max-w-[1600px] mx-auto">
      {/* SECTION 1: TOP BENTO GRID (REPLICATING IMAGE LAYOUT) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* COLUMN 1: PROFIT & ORDERS */}
        <div className="grid grid-rows-2 gap-6 h-[400px]">
          <StatCard
            label="Total Profit"
            value="₹612.917"
            trend="2.08"
            isUp={true}
            icon={DollarSign}
            isPrimary={true}
          />
          <StatCard
            label="Visitor"
            value="14.987"
            trend="2.08"
            isUp={false}
            icon={Users}
          />
        </div>

        {/* COLUMN 2: VISITORS & SOLD */}
        <div className="grid grid-rows-2 gap-6 h-[400px]">
          <StatCard
            label="Total Orders"
            value="34.760"
            trend="12.4"
            isUp={true}
            icon={ShoppingBag}
          />
          <StatCard
            label="Total Sold Products"
            value="12.987"
            trend="12.1"
            isUp={true}
            icon={Package}
          />
        </div>

        {/* COLUMN 3: PRODUCT STATISTIC (DOUBLE HEIGHT) */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col h-[400px]">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-xl font-bold text-slate-800 tracking-tight leading-none">
              Product Statistic
            </h4>
            <select className="bg-slate-50 border-none rounded-xl text-[10px] font-bold px-3 py-1.5 outline-none">
              <option>Today</option>
            </select>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300 mb-6">
            Track your product sales
          </p>

          {/* PIE CHART AREA - Preserved design as requested */}
          <div className="flex-grow flex flex-col items-center justify-center">
            <div className="relative w-40 h-40 rounded-full border-[16px] border-slate-50 border-t-[#5D5FEF] border-l-slate-800 border-b-rose-400 flex items-center justify-center mb-6">
              <div className="text-center">
                <p className="text-xl font-black text-slate-800 tracking-tighter">
                  9.829
                </p>
                <p className="text-[8px] text-slate-400 font-bold uppercase">
                  Total Units
                </p>
              </div>
            </div>

            {/* LIST ITEMS MATCHING REFERENCE */}
            <div className="w-full space-y-3 px-2">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-3 text-slate-500 font-bold text-[11px] uppercase tracking-wide">
                  <Package size={12} className="text-slate-300" /> Electronic
                </span>
                <span className="text-slate-800 font-bold text-xs">
                  2.487{" "}
                  <span className="text-[9px] text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-md ml-1">
                    +1.8%
                  </span>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-3 text-slate-500 font-bold text-[11px] uppercase tracking-wide">
                  <Package size={12} className="text-slate-300" /> Games
                </span>
                <span className="text-slate-800 font-bold text-xs">
                  1.828{" "}
                  <span className="text-[9px] text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-md ml-1">
                    +2.3%
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: SALES ANALYTICS GRAPH (FULL WIDTH) */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-2 px-2">
          <h4 className="text-xl font-bold text-slate-800 tracking-tight">
            Customer Habits
          </h4>
          <div className="flex items-center gap-3">
            <select className="bg-slate-50 border-none rounded-xl text-[10px] font-bold px-4 py-2 outline-none uppercase tracking-widest">
              <option>This Year</option>
            </select>
            <button className="text-slate-300 hover:text-slate-600">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300 px-2 mb-10">
          Track your customer habits and trends
        </p>

        <div
          className="h-[400px] w-full"
          onMouseLeave={() => setActivePoint(null)}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={dummySalesData}
              margin={{ top: 40, right: 20, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                stroke="#f1f5f9"
                strokeDasharray="4 4"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={<CustomXAxisTick />}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
                tickFormatter={(v) => `${v / 1000}k`}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#6366f1"
                strokeWidth={4}
                fill="url(#colorSales)"
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  const isActive = activePoint?.name === payload.name;
                  return (
                    <g
                      onMouseEnter={() =>
                        setActivePoint({
                          name: payload.name,
                          x: cx,
                          y: cy,
                          sales: payload.sales,
                        })
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isActive ? 8 : 5}
                        fill="#fff"
                        stroke="#6366f1"
                        strokeWidth={3}
                      />
                      {isActive && (
                        <SvgTooltip x={cx} y={cy} value={payload.sales} />
                      )}
                    </g>
                  );
                }}
                activeDot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
