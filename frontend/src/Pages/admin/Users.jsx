import React, { useState } from "react";
import {
  UserPlus,
  ShieldCheck,
  Trash2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
} from "lucide-react";
import { motion } from "framer-motion";
motion;

const RoleBadge = ({ role }) => {
  // Helper to convert role to Title Case
  const formatRole = (r) =>
    r
      .toLowerCase()
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const styles = {
    // Premium Soft Indigo for Dev Admin
    DEV_ADMIN:
      "bg-indigo-50/50 text-indigo-600 border-indigo-100/80 shadow-[0_2px_10px_-3px_rgba(99,102,241,0.1)]",
    // Premium Soft Slate/Zinc for Product Admin (Replacing the high-contrast black)
    PRODUCT_ADMIN:
      "bg-slate-50 text-slate-600 border-slate-200/60 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]",
  };

  return (
    <span
      className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all duration-300 ${styles[role]}`}
    >
      {formatRole(role)}
    </span>
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
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* HEADER SECTION - Matching Products Page exactly */}
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          Admins
        </h2>
        <button
          type="button"
          className="bg-black text-white flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-sm active:scale-95 transition-all"
        >
          <UserPlus size={14} strokeWidth={3} /> Add
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-50 bg-[#FDFDFD]">
              <th className="px-8 py-5">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Administrator <ChevronsUpDown size={12} />
                </div>
              </th>
              <th className="px-6 py-5">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Access Level <ChevronsUpDown size={12} />
                </div>
              </th>
              <th className="px-6 py-5">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Joined <ChevronsUpDown size={12} />
                </div>
              </th>
              <th className="px-8 py-5 text-right text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-slate-50/50 transition-colors group"
              >
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center font-black text-zinc-500 text-xs shadow-inner">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-slate-800 tracking-tight">
                        {user.name}
                      </p>
                      <p className="text-[12px] text-slate-400 font-medium">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-5">
                  <RoleBadge role={user.role} />
                </td>

                <td className="px-6 py-5">
                  <span className="text-xs font-black text-slate-400">
                    {user.joined}
                  </span>
                </td>

                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      title="Manage Access"
                      className="p-2 text-slate-300 hover:text-[#5D5FEF] hover:bg-indigo-50 rounded-full transition-all"
                    >
                      <ShieldCheck size={18} />
                    </button>
                    <button
                      type="button"
                      title="Remove Admin"
                      className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Premium Pagination Footer - Matching Orders UI */}
        <div className="px-8 py-6 border-t border-slate-50 flex items-center justify-between bg-[#FDFDFD]">
          <button className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-slate-500 transition-all">
            <ChevronLeft size={16} /> Previous
          </button>

          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-xl bg-black text-white shadow-lg shadow-black/10 flex items-center justify-center text-xs font-bold transition-all">
              1
            </button>
          </div>

          <button className="flex items-center gap-2 text-xs font-bold text-slate-800 hover:text-black transition-all">
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
