import React from 'react';
import { ShieldCheck, CheckCircle2, Layers, Cpu, Database, Network } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 mb-6">
          <ShieldCheck className="w-9 h-9" />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-3">
          BIONEXUS
        </h1>
        
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
          Smart Livestock Biosecurity &amp; Tele-Veterinary Portal
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Frontend Foundation Initialized Successfully</span>
        </div>
      </div>

      {/* Architecture Readiness Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-900">React + Vite</h3>
          <p className="text-xs text-slate-500 mt-1">
            Ultra-fast build tooling and modern JSX runtime configured.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-900">Tailwind CSS</h3>
          <p className="text-xs text-slate-500 mt-1">
            Utility-first styling with custom brand palettes ready for UI design.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
            <Network className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-900">PERN-Ready Architecture</h3>
          <p className="text-xs text-slate-500 mt-1">
            Modular folder structure structured for upcoming Node/Express APIs.
          </p>
        </div>
      </div>
    </div>
  );
}
