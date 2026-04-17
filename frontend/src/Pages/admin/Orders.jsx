import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
} from "lucide-react";
import { useAuth } from "../../Hooks/useAuth";

const StatusBadge = ({ status }) => {
  const normalizedStatus = (status || "").toLowerCase();
  const styles = {
    "order placed": "bg-[#FFF4E5] text-[#FFB648]",
    shipped: "bg-[#E6F9F0] text-[#34D399]",
    delivered: "bg-[#EEF2FF] text-[#6366F1]",
    cancelled: "bg-[#FFE4E6] text-[#FB7185]",
  };

  return (
    <span
      className={`px-4 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-tight ${styles[normalizedStatus] || styles["order placed"]}`}
    >
      {status || "order placed"}
    </span>
  );
};

export const Orders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setOrders([]);
        setError("Missing auth token");
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/orders`, {
          params: {
            page,
            limit: 10,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(response.data.orders || []);
        setCurrentPage(response.data.currentPage || 1);
        setTotalPages(response.data.totalPages || 1);
      } catch (fetchError) {
        console.error("Error fetching orders:", fetchError);
        setOrders([]);
        setError(
          fetchError.response?.data?.message || "Failed to fetch orders",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [page, token]);

  const formattedOrders = orders.map((order) => {
    const items = order.items || [];
    const firstProduct = items[0];

    return {
      id: order._id,
      product:
        items.map((item) => item.name).filter(Boolean).join(", ") ||
        firstProduct?.product?.title ||
        "Untitled product",
      category: firstProduct?.product?.category || "N/A",
      size: items.map((item) => item.size).filter(Boolean).join(", ") || "N/A",
      price: new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(order.pricing?.total || 0),
      status: order.status,
    };
  });

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
            {isLoading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-8 py-10 text-center text-sm font-medium text-slate-400"
                >
                  Loading orders...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-8 py-10 text-center text-sm font-medium text-red-500"
                >
                  {error}
                </td>
              </tr>
            ) : formattedOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-8 py-10 text-center text-sm font-medium text-slate-400"
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              formattedOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
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
                    <StatusBadge status={order.status === "order placed" ? "placed" : order.status} />
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
              ))
            )}
          </tbody>
        </table>

        {/* Footer Pagination */}
        <div className="px-8 py-6 border-t border-slate-50 flex items-center justify-between bg-[#FDFDFD]">
          <button
            className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-slate-500 transition-all disabled:opacity-50"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} /> Previous
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                  currentPage === pageNumber
                    ? "bg-black text-white shadow-lg shadow-black/10"
                    : "text-slate-400 hover:bg-slate-100"
                }`}
              >
                {pageNumber}
              </button>
              ),
            )}
          </div>

          <button
            className="flex items-center gap-2 text-xs font-bold text-slate-800 hover:text-black transition-all disabled:opacity-50"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
