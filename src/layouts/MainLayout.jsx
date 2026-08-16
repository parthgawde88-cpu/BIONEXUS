import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShieldCheck, Activity, Wifi } from 'lucide-react';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Name */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:bg-emerald-700 transition-colors">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                  BIONEXUS
                </span>
                <span className="block text-[11px] font-medium text-slate-500 tracking-wide uppercase">
                  Biosecurity &amp; Tele-Vet Portal
                </span>
              </div>
            </Link>

            {/* Navigation & Status */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>System Online</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                <Activity className="w-3.5 h-3.5 text-slate-600" />
                <span>Frontend Ready</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-700">BIONEXUS</span> &mdash; Smart Livestock Biosecurity &amp; Tele-Veterinary Platform
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-slate-600">
              <Wifi className="w-3.5 h-3.5 text-emerald-600" /> PERN Frontend Architecture
            </span>
            <span>v0.1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
