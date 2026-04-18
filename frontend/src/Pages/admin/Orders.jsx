import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Filter,
  ShoppingBag,
  ArrowUpRight,
} from "lucide-react";
import { useAuth } from "../../Hooks/useAuth";

const ORDER_STATUSES = ["order placed", "shipped", "delivered", "cancelled"];

/**
 * PREMIUM STATUS BADGE
 * Fixed alignment: Using inline-flex to prevent horizontal stretching.
 */
const StatusBadge = ({ status }) => {
  const normalizedStatus = (status || "").toLowerCase();
  const styles = {
    "order placed": "bg-blue-500/5 text-blue-600 border-blue-500/10",
    shipped: "bg-amber-500/5 text-amber-600 border-amber-500/10",
    delivered: "bg-emerald-500/5 text-emerald-600 border-emerald-500/10",
    cancelled: "bg-rose-500/5 text-rose-600 border-rose-500/10",
  };

  return (
    <div
      className={`inline-flex items-center justify-center px-3 py-1 rounded-full border whitespace-nowrap transition-all duration-500 ${
        styles[normalizedStatus] || styles["order placed"]
      }`}
    >
      <span className="text-[9px] font-bold uppercase tracking-wider">
        {status || "order placed"}
      </span>
    </div>
  );
};

const ActionMenu = ({ orderId, currentStatus, token, onStatusUpdate }) => {
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleStatusClick = async (newStatus) => {
    if (newStatus === currentStatus || updating) return;
    setUpdating(true);
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/admin/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      onStatusUpdate(orderId, newStatus);
      setOpen(false);
    } catch (err) {
      console.error("Status update failed:", err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div ref={menuRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-[#2D4F3C] hover:bg-[#EBF5EE] rounded-xl transition-all duration-300 border border-transparent hover:border-[#86C19F]/20"
      >
        <MoreHorizontal size={16} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-3 z-50 bg-white border border-zinc-100 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] py-2 min-w-[160px] animate-in fade-in zoom-in-95 duration-200">
          <p className="px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-300">
            Update Status
          </p>
          {ORDER_STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleStatusClick(s)}
              className={`w-full text-left px-4 py-2.5 text-[11px] font-semibold capitalize transition-colors ${
                s === currentStatus
                  ? "text-[#2D4F3C] bg-[#EBF5EE]/50"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const Orders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [filterMode, setFilterMode] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/orders`,
          {
            params: { page: currentPage, limit: 10, filter: filterMode },
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setOrders(response.data.orders || []);
        setTotalOrders(response.data.totalOrders || 0);
        setTotalPages(response.data.totalPages || 1);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [currentPage, token, filterMode]);

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)),
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#EBF5EE] text-[#2D4F3C] rounded-2xl flex items-center justify-center shadow-sm">
              <ShoppingBag size={18} />
            </div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300">
              Shipment Log
            </h2>
          </div>
          <h1 className="text-3xl font-medium tracking-tight text-zinc-900">
            Orders Management
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <select
              value={filterMode}
              onChange={(e) => {
                setFilterMode(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none bg-[#FCFDFB] border border-zinc-200/60 text-[11px] font-bold uppercase tracking-wider px-6 py-3.5 pr-12 rounded-2xl hover:border-[#86C19F]/30 focus:outline-none transition-all cursor-pointer shadow-sm"
            >
              <option value="all">All Transactions</option>
              <option value="recent">Recent Sync</option>
              <option value="high-value">Premium Orders</option>
            </select>
            <Filter
              className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 group-hover:text-[#86C19F] transition-colors"
              size={12}
            />
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-[#FCFDFB] border border-zinc-200/60 rounded-[2.5rem] shadow-[0_2px_6px_rgba(0,0,0,0.04),0_10px_30px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-700 hover:shadow-[0_25px_60px_rgba(0,0,0,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100/80">
                <th className="pl-10 pr-4 py-8 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                  Reference
                </th>
                <th className="px-4 py-8 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                  Customer
                </th>
                <th className="px-4 py-8 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                  Product Details
                </th>
                <th className="px-4 py-8 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 text-center">
                  Size
                </th>
                <th className="px-4 py-8 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                  Category
                </th>
                <th className="px-4 py-8 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 text-center">
                  Status
                </th>
                <th className="px-4 py-8 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                  Amount
                </th>
                <th className="pl-4 pr-10 py-8"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-50">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-32 text-center text-xs font-medium text-zinc-400 tracking-widest uppercase animate-pulse"
                  >
                    Syncing Database...
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="group hover:bg-[#F8FBFA]/50 transition-colors duration-500"
                  >
                    <td className="pl-10 pr-4 py-6">
                      <span className="text-[11px] font-bold text-zinc-400 bg-zinc-50 px-2 py-1 rounded-lg border border-zinc-100">
                        #{order._id.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-6">
                      <div className="text-[13px] font-semibold text-zinc-900">
                        {order.customerName || "External User"}
                      </div>
                      <div className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider mt-0.5">
                        Verified Payer
                      </div>
                    </td>
                    <td className="px-4 py-6">
                      <div className="text-[13px] text-zinc-600 font-medium max-w-[280px] leading-relaxed group-hover:text-zinc-900 transition-colors">
                        {order.items?.length > 0
                          ? order.items.map((i) => i.name).join(", ")
                          : "No Items"}
                      </div>
                    </td>
                    <td className="px-4 py-6 text-center">
                      <div className="text-[11px] font-black text-zinc-400 uppercase tracking-tighter">
                        {order.items?.length > 0
                          ? [...new Set(order.items.map((i) => i.size))].join(
                              ", ",
                            )
                          : "—"}
                      </div>
                    </td>
                    <td className="px-4 py-6">
                      <span className="text-[10px] font-bold text-[#2D4F3C] bg-[#EBF5EE] px-2.5 py-1 rounded-lg uppercase tracking-tight">
                        {order.items?.[0]?.category || "General"}
                      </span>
                    </td>
                    <td className="px-4 py-6 text-center">
                      <div className="flex justify-center items-center">
                        <StatusBadge status={order.status} />
                      </div>
                    </td>
                    <td className="px-4 py-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-zinc-900 font-medium text-base">
                          ₹{(order.pricing?.total || 0).toLocaleString("en-IN")}
                        </span>
                        <ArrowUpRight
                          size={10}
                          className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                    </td>
                    <td className="pl-4 pr-10 py-6 text-right">
                      <ActionMenu
                        orderId={order._id}
                        currentStatus={order.status}
                        token={token}
                        onStatusUpdate={handleStatusUpdate}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="px-10 py-8 bg-zinc-50/30 border-t border-zinc-100/80 flex items-center justify-between">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.15em]">
            Page <span className="text-zinc-900">{currentPage}</span> of{" "}
            {totalPages}
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-3 text-zinc-400 hover:text-[#2D4F3C] hover:bg-white rounded-xl border border-transparent hover:border-zinc-200 transition-all disabled:opacity-20 shadow-sm"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex gap-1.5 px-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-xl text-[11px] font-bold transition-all duration-300 ${
                    currentPage === i + 1
                      ? "bg-zinc-900 text-white shadow-lg shadow-zinc-200"
                      : "text-zinc-400 hover:bg-white hover:text-zinc-900"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-3 text-zinc-900 hover:text-white hover:bg-zinc-900 rounded-xl border border-zinc-200 transition-all disabled:opacity-20 shadow-sm"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
