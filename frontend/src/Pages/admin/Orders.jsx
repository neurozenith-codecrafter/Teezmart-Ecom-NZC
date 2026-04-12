import React from "react";
import {
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
} from "lucide-react";

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: "bg-[#FFF4E5] text-[#FFB648]",
    Shipped: "bg-[#E6F9F0] text-[#34D399]",
    Delivered: "bg-[#EEF2FF] text-[#6366F1]",
    Cancelled: "bg-[#FFE4E6] text-[#FB7185]",
  };

  return (
    <span
      className={`px-4 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-tight ${styles[status] || styles.Pending}`}
    >
      {status}
    </span>
  );
};

export const Orders = () => {
  const mockOrders = [
    {
      id: "#TZ-99201",
      product: "Vintage Heavyweight Tee",
      category: "Oversized",
      size: "L, XL",
      price: "₹1,499",
      status: "Pending",
    },
    {
      id: "#TZ-99198",
      product: "Acid Wash Boxy Fit",
      category: "Streetwear",
      size: "M",
      price: "₹1,299",
      status: "Shipped",
    },
    {
      id: "#TZ-99195",
      product: "Classic Essential White",
      category: "Basics",
      size: "S, M, L",
      price: "₹999",
      status: "Delivered",
    },
    {
      id: "#TZ-99192",
      product: "Retro Graphic Tee",
      category: "Graphic",
      size: "XL",
      price: "₹1,899",
      status: "Cancelled",
    },
    {
      id: "#TZ-99188",
      product: "Sand Boxy Fit Tee",
      category: "Oversized",
      size: "M, L",
      price: "₹1,399",
      status: "Shipped",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Order Log
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Manage incoming store purchases and fulfillment
          </p>
        </div>
        <div className="flex gap-3">
          <select className="bg-white border-slate-200 rounded-xl text-xs font-bold px-4 py-2.5 shadow-sm outline-none focus:ring-2 focus:ring-slate-100 transition-all cursor-pointer">
            <option>All Orders</option>
            <option>Recent</option>
            <option>High Value</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-50 bg-[#FDFDFD]">
              <th className="px-8 py-5">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Product Name <ChevronsUpDown size={12} />
                </div>
              </th>
              <th className="px-6 py-5">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Order ID <ChevronsUpDown size={12} />
                </div>
              </th>
              <th className="px-6 py-5">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Category <ChevronsUpDown size={12} />
                </div>
              </th>
              <th className="px-6 py-5">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Size <ChevronsUpDown size={12} />
                </div>
              </th>
              <th className="px-6 py-5">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Amount <ChevronsUpDown size={12} />
                </div>
              </th>
              <th className="px-6 py-5 text-center">
                <div className="flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Status
                </div>
              </th>
              <th className="px-8 py-5 text-right text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {mockOrders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-slate-50/50 transition-colors group"
              >
                {/* Product Name (Text Only) */}
                <td className="px-8 py-5">
                  <span className="text-[14px] font-bold text-slate-800 tracking-tight">
                    {order.product}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <span className="text-[12px] font-bold text-[#5D5FEF] bg-[#5D5FEF]/5 px-2 py-1 rounded-md">
                    {order.id}
                  </span>
                </td>

                <td className="px-6 py-5 text-sm font-medium text-slate-500">
                  {order.category}
                </td>

                <td className="px-6 py-5">
                  <span className="text-xs font-black text-slate-400">
                    {order.size}
                  </span>
                </td>

                <td className="px-6 py-5 text-[14px] font-black text-slate-900">
                  {order.price}
                </td>

                <td className="px-6 py-5 text-center">
                  <StatusBadge status={order.status} />
                </td>

                <td className="px-8 py-5 text-right">
                  <button
                    type="button"
                    className="p-2 text-slate-300 hover:text-slate-600 transition-all hover:bg-slate-100 rounded-full"
                  >
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer Pagination */}
        <div className="px-8 py-6 border-t border-slate-50 flex items-center justify-between bg-[#FDFDFD]">
          <button className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-slate-500 transition-all">
            <ChevronLeft size={16} /> Previous
          </button>

          <div className="flex items-center gap-2">
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                  page === 1
                    ? "bg-black text-white shadow-lg shadow-black/10"
                    : "text-slate-400 hover:bg-slate-100"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-2 text-xs font-bold text-slate-800 hover:text-black transition-all">
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
