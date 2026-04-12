import React from "react";
import { useAdmin } from "../../context/useAdmin";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  MoreHorizontal,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const StatCard = ({ label, value, trend, isUp, colorCode }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col relative overflow-hidden">
    <div
      className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 rounded-r-full ${colorCode}`}
    />
    <div className="flex justify-between items-start mb-2">
      <p className="text-slate-500 text-sm font-medium">{label}</p>
      <div className="p-2 rounded-lg bg-slate-50 text-slate-400 opacity-70">
        {label.includes("Product") ? (
          <Package size={18} />
        ) : (
          <DollarSign size={18} />
        )}
      </div>
    </div>
    <h3 className="text-2xl font-bold text-slate-900 mb-2">{value}</h3>
    <div className="flex items-center gap-1">
      {isUp ? (
        <TrendingUp size={14} className="text-emerald-500" />
      ) : (
        <TrendingDown size={14} className="text-rose-500" />
      )}
      <span
        className={`text-[11px] font-bold ${isUp ? "text-emerald-500" : "text-rose-500"}`}
      >
        {isUp ? "+" : "-"}
        {trend}%
      </span>
      <span className="text-[11px] text-slate-400 ml-1">Since last week</span>
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
      {"\u20B9"}
      {value.toLocaleString()}
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
    { name: "Jan", sales: 4200 },
    { name: "Feb", sales: 6200 },
    { name: "Mar", sales: 4500 },
    { name: "Apr", sales: 5200 },
    { name: "May", sales: 9400 },
    { name: "Jun", sales: 5400 },
    { name: "Jul", sales: 7000 },
    { name: "Aug", sales: 5400 },
    { name: "Sep", sales: 6200 },
    { name: "Oct", sales: 6200 },
    { name: "Nov", sales: 6200 },
    { name: "Dec", sales: 3800 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          Welcome Back, {admin?.name?.split(" ")[0] || "Admin"} {"\u{1F44B}"}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Products"
          value="1.456"
          trend="6.5"
          isUp={true}
          colorCode="bg-indigo-500"
        />
        <StatCard
          label="Total Orders"
          value="1.135"
          trend="11.5"
          isUp={true}
          colorCode="bg-blue-400"
        />
        {admin.role === "DEV_ADMIN" ? (
          <>
            <StatCard
              label="Total Profit"
              value={"\u20B94.280"}
              trend="0.2"
              isUp={false}
              colorCode="bg-purple-500"
            />
            <StatCard
              label="Revenue"
              value={"\u20B93.345"}
              trend="0.1"
              isUp={false}
              colorCode="bg-teal-400"
            />
          </>
        ) : (
          <StatCard
            label="My Profit"
            value={"\u20B942.500"}
            trend="5.2"
            isUp={true}
            colorCode="bg-emerald-500"
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-6">
            Stock Distribution
          </h4>
          <div className="flex flex-col items-center">
            <div className="relative w-40 h-40 rounded-full border-[12px] border-slate-50 border-t-indigo-500 border-l-slate-800 flex items-center justify-center mb-6">
              <div className="text-center">
                <p className="text-xl font-bold text-slate-800">124</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">
                  Total
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              Sales Analytics
            </h4>
            <MoreHorizontal size={18} className="text-slate-300" />
          </div>
          <div
            className="relative h-72 w-full"
            onMouseLeave={() => setActivePoint(null)}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={dummySalesData}
                margin={{ top: 40, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  vertical={true}
                  horizontal={false}
                  stroke="#f1f5f9"
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
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  tickFormatter={(v) => `${v / 1000}k`}
                />

                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fill="url(#colorSales)"
                  dot={(props) => {
                    const { cx, cy, payload } = props;
                    const isActive = activePoint?.name === payload.name;

                    return (
                      <g
                        onMouseEnter={() =>
                          setActivePoint({ name: payload.name })
                        }
                        onMouseLeave={() => setActivePoint(null)}
                        style={{ cursor: "pointer" }}
                      >
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isActive ? 8 : 5}
                          fill="#fff"
                          stroke="#6366f1"
                          strokeWidth={2}
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
    </div>
  );
};
