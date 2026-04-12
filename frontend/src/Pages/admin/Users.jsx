import React, { useState } from "react";
import { UserPlus, ShieldCheck, Trash2 } from "lucide-react";

export const Users = () => {
  const [users] = useState([
    {
      id: 1,
      name: "Arjun Sharma",
      email: "arjun@teezmart.com",
      role: "DEV_ADMIN",
      joined: "Jan 2025",
    },
    {
      id: 2,
      name: "Sanya Malhotra",
      email: "sanya@teezmart.com",
      role: "PRODUCT_ADMIN",
      joined: "Mar 2025",
    },
    {
      id: 3,
      name: "Rahul Verma",
      email: "rahul@gmail.com",
      role: "USER",
      joined: "Apr 2026",
    },
  ]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          <p className="text-zinc-500 text-sm mt-1">
            Control access levels and manage administrative roles.
          </p>
        </div>
        <button
          type="button"
          className="bg-black text-white flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-all"
        >
          <UserPlus size={16} strokeWidth={3} /> Add New User
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-zinc-100 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/50 border-b border-zinc-100">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                Administrator
              </th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                Access Level
              </th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                Joined
              </th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-zinc-50/30 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-500 text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900 tracking-tight">{user.name}</p>
                      <p className="text-[11px] text-zinc-400 font-medium">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <span
                    className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      user.role === "DEV_ADMIN"
                        ? "bg-indigo-50 text-indigo-600 border-indigo-100"
                        : user.role === "PRODUCT_ADMIN"
                          ? "bg-zinc-900 text-white border-zinc-900"
                          : "bg-zinc-50 text-zinc-500 border-zinc-100"
                    }`}
                  >
                    {user.role.replace("_", " ")}
                  </span>
                </td>
                <td className="px-6 py-6 text-xs font-bold text-zinc-500">{user.joined}</td>
                <td className="px-6 py-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      title="Change Role"
                      className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-indigo-600 transition-all"
                    >
                      <ShieldCheck size={18} />
                    </button>
                    <button
                      type="button"
                      title="Remove"
                      className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-red-500 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
