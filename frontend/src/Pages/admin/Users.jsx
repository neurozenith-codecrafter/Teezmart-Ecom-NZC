import React, { useState } from "react";
import {
  UserPlus,
  ShieldCheck,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users as UsersIcon,
  ArrowUpRight,
} from "lucide-react";

/**
 * PREMIUM ROLE BADGE
 * Matches the StatusBadge style with emerald and indigo high-end accents
 */
const RoleBadge = ({ role }) => {
  const formatRole = (r) =>
    r
      .toLowerCase()
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const styles = {
    DEV_ADMIN: "bg-indigo-500/5 text-indigo-600 border-indigo-500/10",
    PRODUCT_ADMIN: "bg-emerald-500/5 text-emerald-600 border-emerald-500/10",
  };

  return (
    <div
      className={`inline-flex items-center justify-center px-3 py-1 rounded-full border whitespace-nowrap transition-all duration-500 ${styles[role] || styles.PRODUCT_ADMIN}`}
    >
      <span className="text-[9px] font-bold uppercase tracking-wider">
        {formatRole(role)}
      </span>
    </div>
  );
};

export const Users = () => {
  const [users] = useState([
    {
      id: 1,
      name: "Arjun Sharma",
      email: "arjun@teezmart.com",
      role: "DEV_ADMIN",
      joined: "12 Jan 2025",
    },
    {
      id: 2,
      name: "Sanya Malhotra",
      email: "sanya@teezmart.com",
      role: "PRODUCT_ADMIN",
      joined: "04 Mar 2025",
    },
    {
      id: 3,
      name: "Rahul Verma",
      email: "rahul@teezmart.com",
      role: "PRODUCT_ADMIN",
      joined: "18 Apr 2026",
    },
  ]);

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Header Section - Premium Terminal Style */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#EBF5EE] text-[#2D4F3C] rounded-2xl flex items-center justify-center shadow-sm">
              <UsersIcon size={18} />
            </div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300">
              Access Control
            </h2>
          </div>
          <h1 className="text-3xl font-medium tracking-tight text-zinc-900">
            Admin Directory
          </h1>
        </div>

        <button
          type="button"
          className="bg-zinc-900 text-white flex items-center gap-2 px-6 py-3.5 rounded-2xl text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-zinc-200 hover:bg-black active:scale-95 transition-all"
        >
          <UserPlus size={14} strokeWidth={2.5} /> Add Administrator
        </button>
      </div>

      {/* Main Table Container */}
      <div className="bg-[#FCFDFB] border border-zinc-200/60 rounded-[2.5rem] shadow-[0_2px_6px_rgba(0,0,0,0.04),0_10px_30px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-700 hover:shadow-[0_25px_60px_rgba(0,0,0,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100/80">
                <th className="pl-10 pr-4 py-8 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                  Administrator
                </th>
                <th className="px-4 py-8 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                  Access Level
                </th>
                <th className="px-4 py-8 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                  Joined Date
                </th>
                <th className="pl-4 pr-10 py-8 text-right text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-50">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="group hover:bg-[#F8FBFA]/50 transition-colors duration-500"
                >
                  <td className="pl-10 pr-4 py-6">
                    <div className="flex items-center gap-4">
                      {/* Premium Avatar */}
                      <div className="relative flex items-center justify-center w-11 h-11 bg-white rounded-full border border-zinc-100 shadow-inner group-hover:border-emerald-200 transition-colors duration-500">
                        <span className="text-[11px] font-black text-zinc-900">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold text-zinc-900 tracking-tight flex items-center gap-1.5">
                          {user.name}
                          <ArrowUpRight
                            size={10}
                            className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          />
                        </p>
                        <p className="text-[11px] text-zinc-400 font-medium lowercase tracking-tight">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-6">
                    <RoleBadge role={user.role} />
                  </td>

                  <td className="px-4 py-6">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-tighter bg-zinc-50 px-2 py-1 rounded-lg border border-zinc-100">
                      {user.joined}
                    </span>
                  </td>

                  <td className="pl-4 pr-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-300"
                      >
                        <ShieldCheck size={18} strokeWidth={1.5} />
                      </button>
                      <button
                        type="button"
                        className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all duration-300"
                      >
                        <Trash2 size={18} strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Premium Pagination - Exactly matching Orders Page */}
        <div className="px-10 py-8 bg-zinc-50/30 border-t border-zinc-100/80 flex items-center justify-between">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.15em]">
            Sync status: <span className="text-emerald-500">Secured</span>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-3 text-zinc-400 hover:text-[#2D4F3C] hover:bg-white rounded-xl border border-transparent hover:border-zinc-200 transition-all shadow-sm">
              <ChevronLeft size={16} />
            </button>
            <div className="flex gap-1.5 px-2">
              <button className="w-9 h-9 rounded-xl text-[11px] font-bold bg-zinc-900 text-white shadow-lg shadow-zinc-200 transition-all">
                1
              </button>
            </div>
            <button className="p-3 text-zinc-900 hover:text-white hover:bg-zinc-900 rounded-xl border border-zinc-200 transition-all shadow-sm">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
