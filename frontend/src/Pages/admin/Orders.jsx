import React from "react";
import { MoreHorizontal } from "lucide-react";

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: "bg-amber-50 text-amber-600 border-amber-100",
    Shipped: "bg-blue-50 text-blue-600 border-blue-100",
    Delivered: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status]}`}
    >
      {status}
    </span>
  );
};

export const Orders = () => {
  const mockOrders = [
    {
      id: "#8429",
      product: "Vintage Oversized Tee",
      qty: 2,
      price: "₹1,998",
      status: "Pending",
      date: "Oct 12, 2026",
    },
    {
      id: "#8428",
      product: "Acid Wash Boxy Fit",
      qty: 1,
      price: "₹1,299",
      status: "Shipped",
      date: "Oct 11, 2026",
    },
    {
      id: "#8427",
      product: "Heavyweight Essential",
      qty: 3,
      price: "₹3,450",
      status: "Delivered",
      date: "Oct 10, 2026",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <div className="flex gap-3">
          <select className="bg-white border-zinc-200 rounded-xl text-xs font-bold px-4 py-2 focus:ring-black">
            <option>All Status</option>
            <option>Pending</option>
            <option>Shipped</option>
            <option>Delivered</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-zinc-100 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/50 border-b border-zinc-100">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                Product
              </th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                Order ID
              </th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                Price
              </th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                Status
              </th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {mockOrders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-zinc-50/30 transition-colors group"
              >
                <td className="px-8 py-6">
                  <p className="text-sm font-bold text-zinc-900 tracking-tight">{order.product}</p>
                  <p className="text-[10px] text-zinc-400 font-medium mt-0.5">Qty: {order.qty}</p>
                </td>
                <td className="px-6 py-6 font-mono text-xs text-zinc-500 font-bold">{order.id}</td>
                <td className="px-6 py-6 text-sm font-bold text-zinc-900">{order.price}</td>
                <td className="px-6 py-6">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-6 py-6 text-right">
                  <button
                    type="button"
                    className="p-2 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-400"
                  >
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
