import React from "react";
import { Hammer, ShieldAlert } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 animate-fade-in">
      <div className="max-w-md w-full bg-white border border-slate-100 rounded-3xl p-8 shadow-xl space-y-6 text-center">
        
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
          <Hammer size={32} className="stroke-[1.5]" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Store Under Maintenance</h1>
          <p className="text-slate-500 text-xs font-semibold leading-relaxed">
            We are currently executing scheduled upgrades, updating pricing lists, and polishing our handcrafted catalog.
          </p>
        </div>

        <div className="flex items-start gap-2.5 bg-amber-50 text-amber-800 text-[10px] font-bold p-4 rounded-2xl border border-amber-100 text-left">
          <ShieldAlert size={16} className="flex-shrink-0 text-amber-500 mt-0.5" />
          <span>
            Purchases and account sign-ins are temporarily suspended. If you have an active order dispatch pending, don&apos;t worry—our support desk is still fulfilling shipments manually!
          </span>
        </div>

        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2 border-t border-slate-100">
          Emerald Store support team
        </div>
      </div>
    </div>
  );
}
