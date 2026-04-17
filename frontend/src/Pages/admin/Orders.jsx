import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Package,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../Hooks/useAuth";

const StatusBadge = ({ status }) => {
  const normalizedStatus = (status || "").toLowerCase();
  const styles = {
    "order placed": "bg-orange-50 text-orange-600 ring-orange-200/50",
    shipped: "bg-emerald-50 text-emerald-600 ring-emerald-200/50",
    delivered: "bg-blue-50 text-blue-600 ring-blue-200/50",
    cancelled: "bg-rose-50 text-rose-600 ring-rose-200/50",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset shadow-sm backdrop-blur-sm ${
        styles[normalizedStatus] || styles["order placed"]
      }`}
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

        const response = await axios.get("/api/admin/orders", {
          params: { page, limit: 10 },
          headers: { Authorization: `Bearer ${token}` },
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
        items
          .map((item) => item.name)
          .filter(Boolean)
          .join(", ") ||
        firstProduct?.product?.title ||
        "Untitled product",
      category: firstProduct?.product?.category || "N/A",
      size:
        items
          .map((item) => item.size)
          .filter(Boolean)
          .join(", ") || "N/A",
      price: new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(order.pricing?.total || 0),
      status: order.status,
    };
  });

  return (
    <div className="max-w-5xl mx-auto pb-20 px-4 md:px-0">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">
            Order Log <span className="text-slate-200">/ {orders.length}</span>
          </h2>
          <p className="text-sm text-slate-400 font-medium mt-1">
            Manage incoming purchases and store fulfillment
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select className="w-full md:w-auto bg-white border border-slate-200 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest px-5 py-3 shadow-sm outline-none focus:ring-4 focus:ring-slate-50 transition-all cursor-pointer appearance-none hover:border-slate-300">
            <option>All Orders</option>
            <option>Recent</option>
            <option>High Value</option>
          </select>
        </div>
      </div>

      {/* Content Area */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              Synchronizing Log...
            </p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-100 rounded-3xl p-8 text-center">
            <p className="text-rose-500 text-sm font-bold">{error}</p>
          </div>
        ) : formattedOrders.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-[2.5rem] py-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-slate-200" />
            </div>
            <h4 className="text-slate-900 font-bold text-lg">No Orders Yet</h4>
            <p className="text-slate-400 text-sm max-w-[240px] mt-1">
              Store logs will appear here once the first purchase is processed.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {formattedOrders.map((order) => (
              <div
                key={order.id}
                className="group relative bg-white border border-slate-100 rounded-[1.8rem] p-5 md:p-6 transition-all duration-500 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.08)] hover:scale-[1.01] hover:border-slate-200"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-[16px] font-bold text-slate-800 tracking-tight truncate max-w-[300px]">
                        {order.product}
                      </h3>
                      <span className="hidden md:inline-block text-[10px] font-black text-blue-500 bg-blue-50/50 px-2 py-0.5 rounded-lg uppercase tracking-tighter">
                        #{order.id.slice(-6)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] font-medium text-slate-400 uppercase tracking-widest">
                      <span>{order.category}</span>
                      <span className="w-1 h-1 bg-slate-200 rounded-full" />
                      <span>Size: {order.size}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-slate-50">
                    <div className="text-right">
                      <p className="text-lg font-black text-slate-900 tracking-tighter italic">
                        {order.price}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <StatusBadge
                        status={
                          order.status === "order placed"
                            ? "placed"
                            : order.status
                        }
                      />

                      <button className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all duration-300">
                        <ArrowUpRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && formattedOrders.length > 0 && (
        <div className="mt-12 flex flex-col items-center gap-6">
          <div className="w-px h-12 bg-slate-100" />
          <div className="flex items-center gap-2 bg-white border border-slate-100 p-1.5 rounded-[2rem] shadow-sm">
            <button
              className="p-3 text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-colors"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className={`min-w-[40px] h-[40px] rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      currentPage === pageNumber
                        ? "bg-slate-900 text-white shadow-lg shadow-slate-200 scale-110"
                        : "text-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ),
              )}
            </div>

            <button
              className="p-3 text-slate-900 hover:scale-110 disabled:opacity-30 transition-all"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
