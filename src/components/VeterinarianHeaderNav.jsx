import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  ClipboardList,
  FlaskConical,
  FileCheck2,
  PackageCheck,
  History,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/veterinarian', icon: LayoutDashboard, exact: true },
  { label: 'My Villages', path: '/veterinarian/villages', icon: Building2 },
  { label: 'Case Queue', path: '/veterinarian/cases', icon: ClipboardList },
  { label: 'Pending Samples', path: '/veterinarian/samples', icon: FlaskConical },
  { label: 'Prescriptions', path: '/veterinarian/prescriptions', icon: FileCheck2 },
  { label: 'Kendra Inventory', path: '/veterinarian/kendra-inventory', icon: PackageCheck },
  { label: 'Case History', path: '/veterinarian/case-history', icon: History },
];

export default function VeterinarianHeaderNav() {
  return (
    <nav aria-label="Veterinarian Sub Navigation" className="mb-6 flex overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-card scrollbar-none">
      <div className="flex min-w-max items-center gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              [
                'flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all',
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
              ].join(' ')
            }
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
