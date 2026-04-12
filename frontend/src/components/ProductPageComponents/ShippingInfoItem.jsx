import React from "react";

export const ShippingInfoItem = ({ Icon, label, val }) => (
  <div className="flex items-center gap-3">
    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-50 text-black">
      {Icon ? React.createElement(Icon, { size: 14, strokeWidth: 1.5 }) : null}
    </div>
    <div>
      <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest">
        {label}
      </p>
      <p className="text-[11px] text-black font-bold">{val}</p>
    </div>
  </div>
);
