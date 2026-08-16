import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  Home,
  Wheat,
  Stethoscope,
  FlaskConical,
  Building2,
  ShieldAlert,
  UserCircle2,
  Menu,
  X,
  Bell,
  LogOut,
  ChevronRight,
} from 'lucide-react';

// ─── Navigation items ─────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    label:       'Farmer',
    labelHi:     'किसान',
    path:        '/farmer',
    icon:        Wheat,
    iconColor:   'text-emerald-600',
    iconBg:      'bg-emerald-50',
    iconBgActive:'bg-emerald-100',
    description: 'Livestock health & tele-vet',
  },
  {
    label:       'Pashu Sakhi',
    labelHi:     'पशु सखी',
    path:        '/pashu-sakhi',
    icon:        UserCircle2,
    iconColor:   'text-teal-600',
    iconBg:      'bg-teal-50',
    iconBgActive:'bg-teal-100',
    description: 'Community field health worker',
  },
  {
    label:       'Veterinarian',
    labelHi:     'पशु चिकित्सक',
    path:        '/veterinarian',
    icon:        Stethoscope,
    iconColor:   'text-blue-600',
    iconBg:      'bg-blue-50',
    iconBgActive:'bg-blue-100',
    description: 'Tele-consultation & prescriptions',
  },
  {
    label:       'Laboratory',
    labelHi:     'प्रयोगशाला',
    path:        '/laboratory',
    icon:        FlaskConical,
    iconColor:   'text-purple-600',
    iconBg:      'bg-purple-50',
    iconBgActive:'bg-purple-100',
    description: 'Diagnostics & test reports',
  },
  {
    label:       'Pashu Seva Kendra',
    labelHi:     'पशु सेवा केंद्र',
    path:        '/kendra',
    icon:        Building2,
    iconColor:   'text-amber-600',
    iconBg:      'bg-amber-50',
    iconBgActive:'bg-amber-100',
    description: 'Kendra management & services',
  },
  {
    label:       'Admin',
    labelHi:     'प्रशासन',
    path:        '/admin',
    icon:        ShieldAlert,
    iconColor:   'text-slate-600',
    iconBg:      'bg-slate-100',
    iconBgActive:'bg-slate-200',
    description: 'System administration',
  },
];

// ─── Brand Logo ───────────────────────────────────────────────────────────────
function Brand() {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
        <ShieldCheck className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[15px] font-bold tracking-tight text-slate-900 leading-tight">
          BIONEXUS
        </p>
        <p className="text-[10px] text-slate-400 uppercase tracking-widest leading-tight truncate">
          Biosecurity Portal
        </p>
      </div>
    </div>
  );
}

// ─── Sidebar Nav Item ─────────────────────────────────────────────────────────
function SidebarItem({ item, onNavigate }) {
  return (
    <NavLink
      to={item.path}
      onClick={onNavigate}
      className={({ isActive }) =>
        [
          'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
          'transition-all duration-150 cursor-pointer',
          isActive
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent',
        ].join(' ')
      }
    >
      {({ isActive }) => (
        <>
          <div
            className={[
              'w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 transition-colors',
              isActive ? item.iconBgActive : item.iconBg,
            ].join(' ')}
          >
            <item.icon
              className={['w-4 h-4', item.iconColor].join(' ')}
              aria-hidden="true"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate">{item.label}</p>
          </div>
          {isActive && (
            <ChevronRight
              className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0"
              aria-hidden="true"
            />
          )}
        </>
      )}
    </NavLink>
  );
}

// ─── Sidebar Content ──────────────────────────────────────────────────────────
function SidebarContent({ onClose }) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-slate-200 flex-shrink-0">
        <Brand />
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="ml-2 p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors lg:hidden"
            aria-label="Close navigation"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav
        className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-thin"
        aria-label="Main navigation"
      >
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">
          Role Portals
        </p>
        {NAV_ITEMS.map((item) => (
          <SidebarItem key={item.path} item={item} onNavigate={onClose} />
        ))}
      </nav>

      {/* Footer links */}
      <div className="border-t border-slate-200 px-3 py-3 space-y-0.5 flex-shrink-0">
        <Link
          to="/"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors border border-transparent"
        >
          <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center flex-shrink-0">
            <Home className="w-4 h-4 text-slate-500" aria-hidden="true" />
          </div>
          Home
        </Link>
        <Link
          to="/login"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors border border-transparent"
        >
          <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center flex-shrink-0">
            <LogOut className="w-4 h-4 text-slate-400" aria-hidden="true" />
          </div>
          Login
        </Link>
        <div className="px-3 pt-3 pb-1">
          <p className="text-[10px] text-slate-400 leading-relaxed">
            BIONEXUS v0.1.0 · Stage 1
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── AppLayout ────────────────────────────────────────────────────────────────
export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile sidebar open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  // Find current page label for header breadcrumb
  const currentItem = NAV_ITEMS.find(
    (i) => location.pathname === i.path || location.pathname.startsWith(i.path + '/')
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      {/* ── Desktop Sidebar ─────────────────────────────────────────────── */}
      <aside className="hidden lg:flex lg:flex-col w-64 flex-shrink-0 bg-white border-r border-slate-200">
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Overlay ───────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile Sidebar Drawer ────────────────────────────────────────── */}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200',
          'transform transition-transform duration-300 ease-out-expo lg:hidden',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
        aria-label="Mobile navigation"
        aria-hidden={!sidebarOpen}
      >
        <SidebarContent onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* ── Main Area ────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header */}
        <header className="flex-shrink-0 h-16 bg-white border-b border-slate-200 flex items-center gap-3 px-4 sm:px-6">

          {/* Hamburger (mobile) */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Open navigation"
            aria-expanded={sidebarOpen}
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </button>

          {/* Mobile brand */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            </div>
            <span className="text-sm font-bold text-slate-900">BIONEXUS</span>
          </div>

          {/* Desktop breadcrumb */}
          {currentItem && (
            <div className="hidden lg:flex items-center gap-2 text-sm">
              <span className="text-slate-400">Portal</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" aria-hidden="true" />
              <span className="font-semibold text-slate-900">{currentItem.label}</span>
              {currentItem.labelHi && (
                <span className="text-slate-400 text-xs">· {currentItem.labelHi}</span>
              )}
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Header actions */}
          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <button
              type="button"
              className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" aria-hidden="true" />
              <span
                className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"
                aria-hidden="true"
              />
            </button>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold select-none cursor-pointer hover:bg-emerald-700 transition-colors">
              U
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
