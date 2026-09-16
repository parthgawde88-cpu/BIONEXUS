import React from 'react';
import { Activity, AlertTriangle, ArrowRight, Bell, Building2, CalendarClock, CheckCircle2, ClipboardList, FileBarChart, FlaskConical, HeartPulse, MapPin, Settings2, ShieldAlert, Stethoscope, UserRound, UsersRound, Wheat } from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const platformSummary = [
  { label: 'Registered farmers', value: '12,486', detail: '+4.8% this quarter', icon: UsersRound, tone: 'emerald' },
  { label: 'Livestock registered', value: '38,742', detail: 'Across 24 districts', icon: Wheat, tone: 'teal' },
  { label: 'Active health cases', value: '1,284', detail: '86 critical cases', icon: HeartPulse, tone: 'red' },
  { label: 'Total service requests', value: '8,961', detail: '642 pending assignment', icon: ClipboardList, tone: 'amber' },
];

const networkStats = [
  { label: 'Active veterinarians', value: '148', detail: '92% available today', icon: Stethoscope, tone: 'blue' },
  { label: 'Active Pashu Sakhis', value: '326', detail: 'Serving 214 villages', icon: UserRound, tone: 'teal' },
  { label: 'Tests in progress', value: '418', detail: '31 beyond target time', icon: FlaskConical, tone: 'purple' },
  { label: 'Active Kendras', value: '42 / 45', detail: '3 require attention', icon: Building2, tone: 'amber' },
];

const roles = [
  { role: 'Farmers', total: '12,486', active: '11,904', attention: '582 pending verification', icon: Wheat, tone: 'emerald' },
  { role: 'Pashu Sakhis', total: '348', active: '326', attention: '22 onboarding', icon: UserRound, tone: 'teal' },
  { role: 'Veterinarians', total: '162', active: '148', attention: '14 profile reviews', icon: Stethoscope, tone: 'blue' },
  { role: 'Diagnostic workflow access', total: '74', active: '69', attention: '5 access requests', icon: FlaskConical, tone: 'purple' },
  { role: 'Kendra staff', total: '126', active: '119', attention: '7 role updates', icon: Building2, tone: 'amber' },
];

const serviceActivity = [
  ['New farmer registration', 'Mohan Meena · Udaipur', 'Today, 09:42 AM', 'Verified'],
  ['Livestock registration', '5 cattle · Farmer ID FR-4821', 'Today, 09:28 AM', 'Recorded'],
  ['Veterinary consultation completed', 'Dr. Parth Gawde · CASE-2841', 'Today, 09:16 AM', 'Completed'],
  ['Vaccination recorded', 'FMD campaign · Kendra Udaipur', 'Today, 08:54 AM', 'Synced'],
  ['Laboratory report completed', 'LAB-1051 · Buffalo BLX-347', 'Today, 08:31 AM', 'Released'],
  ['Kendra service request created', 'REQ-2848 · Bharampur Kendra', 'Today, 08:12 AM', 'Pending'],
];

const alerts = [
  ['Critical livestock health case', '86 critical cases are open; 12 have exceeded the escalation window.', 'Critical', 'danger'],
  ['Pending requests above threshold', '642 service requests are waiting for assignment across the network.', 'High', 'warning'],
  ['Laboratory reports delayed', '31 tests have exceeded the 24-hour turnaround target.', 'High', 'warning'],
  ['Vaccination campaign attention', 'Three districts are below the current FMD campaign coverage target.', 'Medium', 'info'],
  ['Kendra workload imbalance', 'Bharampur Kendra is operating at 118% of its weekly request capacity.', 'Medium', 'warning'],
];

const performance = [
  ['Veterinary services', '3,842', '4,500', '85%', 'bg-blue-500'],
  ['Vaccination services', '7,214', '8,000', '90%', 'bg-emerald-500'],
  ['Laboratory testing', '2,968', '3,600', '82%', 'bg-purple-500'],
  ['Field visits', '1,486', '1,800', '83%', 'bg-teal-500'],
  ['Service requests resolved', '8,319', '8,961', '93%', 'bg-amber-500'],
];

const kendras = [
  ['Udaipur Central Kendra', 'Udaipur · Rajasthan', '37', '24', 'Operational'],
  ['Bharampur Service Center', 'Bharampur · Maharashtra', '52', '68', 'High workload'],
  ['Nawada Livestock Hub', 'Nawada · Bihar', '29', '17', 'Operational'],
  ['Sarai Rural Kendra', 'Sarai · Uttar Pradesh', '41', '32', 'Review needed'],
];

const quickActions = [
  ['Manage users', UsersRound, 'primary'], ['View service requests', ClipboardList, 'secondary'],
  ['Monitor health cases', HeartPulse, 'outline'], ['Review laboratory activity', FlaskConical, 'secondary'],
  ['Manage Kendras', Building2, 'ghost'], ['View system reports', FileBarChart, 'ghost'],
];

const adminActivity = [
  ['User registration', 'Approved 18 new Pashu Sakhi profiles', 'Today, 09:20 AM', 'Approved'],
  ['Role update', 'Updated access for 6 Kendra managers', 'Today, 08:48 AM', 'Updated'],
  ['Assignment', 'Rebalanced veterinary coverage across 3 Kendras', 'Yesterday, 05:10 PM', 'Actioned'],
  ['System update', 'Published vaccination campaign targets for Q3', 'Yesterday, 02:35 PM', 'Published'],
  ['Report', 'Generated monthly platform performance report', 'Aug 15, 04:40 PM', 'Generated'],
];

const toneClasses = { emerald: 'bg-emerald-100 text-emerald-700', teal: 'bg-teal-100 text-teal-700', red: 'bg-red-100 text-red-700', amber: 'bg-amber-100 text-amber-700', blue: 'bg-blue-100 text-blue-700', purple: 'bg-purple-100 text-purple-700' };
const statusVariant = (status) => ({ Verified: 'success', Recorded: 'info', Completed: 'success', Synced: 'success', Released: 'success', Pending: 'warning', Operational: 'success', 'High workload': 'danger', 'Review needed': 'warning' }[status] || 'neutral');

function SectionHeader({ title, description, action }) {
  return <CardHeader><div><CardTitle>{title}</CardTitle><CardDescription>{description}</CardDescription></div>{action}</CardHeader>;
}

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-7xl py-6 sm:py-8">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-200 text-slate-700 shadow-sm"><ShieldAlert className="h-7 w-7" aria-hidden="true" /></div><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">BIONEXUS administration</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Welcome, Aditi Rao</h1><p className="mt-1 text-sm text-slate-500">Platform administrator - National Livestock Services</p></div></div>
        <div className="flex flex-wrap items-center gap-3 self-start xl:self-auto"><div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-card"><MapPin className="h-4 w-4 text-slate-500" aria-hidden="true" />24 districts connected</div><div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 shadow-card"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true" />All systems operational</div><button type="button" aria-label="Notifications" className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-card transition-colors hover:bg-slate-50"><Bell className="h-5 w-5" aria-hidden="true" /><span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-slate-700 ring-2 ring-white" aria-hidden="true" /></button></div>
      </div>
      <Card className="mb-6 border-slate-300 bg-gradient-to-br from-slate-100 via-white to-white"><div className="flex flex-col gap-4 p-1 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-medium text-slate-600">Platform command view</p><h2 className="mt-1 text-xl font-semibold text-slate-900">Monitor service delivery, system health, and regional capacity in one view.</h2></div><div className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />Last refreshed 2 minutes ago</div></div></Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{platformSummary.map(({ label, value, detail, icon: Icon, tone }) => <Card key={label}><div className="flex items-start justify-between gap-3"><div><p className="text-sm text-slate-500">{label}</p><p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{value}</p></div><div className={`flex h-11 w-11 items-center justify-center rounded-xl ${toneClasses[tone]}`}><Icon className="h-5 w-5" aria-hidden="true" /></div></div><p className="mt-4 text-sm text-slate-600">{detail}</p></Card>)}</div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">{networkStats.map(({ label, value, detail, icon: Icon, tone }) => <div key={label} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-card"><span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${toneClasses[tone]}`}><Icon className="h-4 w-4" aria-hidden="true" /></span><div className="min-w-0 flex-1"><p className="truncate text-xs text-slate-500">{label}</p><div className="flex items-baseline justify-between gap-2"><p className="text-lg font-bold text-slate-900">{value}</p><p className="truncate text-[11px] text-slate-500">{detail}</p></div></div></div>)}</div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_1fr]"><Card><SectionHeader title="User & role overview" description="Platform identities and access requiring attention" action={<Button variant="outline" size="sm" icon={Settings2}>Manage roles</Button>} /><div className="overflow-x-auto"><table className="min-w-[650px] divide-y divide-slate-200 text-left text-sm"><thead><tr className="text-slate-500"><th className="pb-3 pr-4 font-medium">Role</th><th className="pb-3 pr-4 font-medium">Total users</th><th className="pb-3 pr-4 font-medium">Active users</th><th className="pb-3 pr-4 font-medium">Attention</th><th className="pb-3 text-right font-medium">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{roles.map(({ role, total, active, attention, icon: Icon, tone }) => <tr key={role}><td className="py-3 pr-4"><span className="flex items-center gap-2 font-medium text-slate-800"><span className={`flex h-7 w-7 items-center justify-center rounded-md ${toneClasses[tone]}`}><Icon className="h-3.5 w-3.5" aria-hidden="true" /></span>{role}</span></td><td className="py-3 pr-4 text-slate-700">{total}</td><td className="py-3 pr-4 text-slate-700">{active}</td><td className="py-3 pr-4 text-xs text-slate-500">{attention}</td><td className="py-3 text-right"><Button variant="ghost" size="sm">View</Button></td></tr>)}</tbody></table></div></Card>
      <Card><SectionHeader title="Critical platform alerts" description="Cross-network issues for administrator review" /><div className="space-y-3">{alerts.map(([title, detail, severity, tone]) => <div key={title} className="rounded-lg border border-slate-200 bg-slate-50 p-3"><div className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" aria-hidden="true" /><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><p className="text-sm font-medium text-slate-800">{title}</p><Badge variant={tone} size="sm">{severity}</Badge></div><p className="mt-1 text-xs leading-relaxed text-slate-600">{detail}</p></div></div></div>)}</div></Card></div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_1fr]"><Card><SectionHeader title="Recent service activity" description="Latest events across the BIONEXUS network" /><div className="overflow-x-auto"><table className="min-w-[600px] divide-y divide-slate-200 text-left text-sm"><thead><tr className="text-slate-500"><th className="pb-3 pr-4 font-medium">Activity</th><th className="pb-3 pr-4 font-medium">Related entity</th><th className="pb-3 pr-4 font-medium">Date / time</th><th className="pb-3 font-medium">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{serviceActivity.map(([activity, entity, time, status]) => <tr key={`${activity}-${time}`}><td className="py-3 pr-4 font-medium text-slate-800">{activity}</td><td className="py-3 pr-4 text-slate-600">{entity}</td><td className="py-3 pr-4 text-xs text-slate-500">{time}</td><td className="py-3"><Badge variant={statusVariant(status)} size="sm" dot>{status}</Badge></td></tr>)}</tbody></table></div></Card>
      <Card><SectionHeader title="Service performance" description="Progress against current period targets" /><div className="space-y-4">{performance.map(([label, completed, target, percent, tone]) => <div key={label}><div className="flex items-center justify-between gap-3 text-sm"><span className="font-medium text-slate-700">{label}</span><span className="text-xs text-slate-500">{completed} / {target}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${tone}`} style={{ width: percent }} /></div><p className="mt-1 text-right text-[11px] font-medium text-slate-500">{percent} complete</p></div>)}</div></Card></div>

      <Card className="mt-8"><SectionHeader title="Kendra & regional overview" description="Operational health across selected service centers" action={<Button variant="outline" size="sm" icon={MapPin}>View all regions</Button>} /><div className="overflow-x-auto"><table className="min-w-[650px] divide-y divide-slate-200 text-left text-sm"><thead><tr className="text-slate-500"><th className="pb-3 pr-4 font-medium">Kendra</th><th className="pb-3 pr-4 font-medium">Region</th><th className="pb-3 pr-4 font-medium">Active cases</th><th className="pb-3 pr-4 font-medium">Pending requests</th><th className="pb-3 pr-4 font-medium">Status</th><th className="pb-3 text-right font-medium">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{kendras.map(([name, region, cases, requests, status]) => <tr key={name}><td className="py-3 pr-4 font-medium text-slate-800">{name}</td><td className="py-3 pr-4 text-slate-600">{region}</td><td className="py-3 pr-4 text-slate-700">{cases}</td><td className="py-3 pr-4 text-slate-700">{requests}</td><td className="py-3 pr-4"><Badge variant={statusVariant(status)} size="sm" dot>{status}</Badge></td><td className="py-3 text-right"><Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">Open</Button></td></tr>)}</tbody></table></div></Card>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_1fr]"><Card><SectionHeader title="Quick actions" description="Administrator tools and monitoring views" /><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{quickActions.map(([title, Icon, variant]) => <Button key={title} variant={variant} icon={Icon} className="justify-start whitespace-normal text-left">{title}</Button>)}</div></Card><Card><SectionHeader title="Recent administrative activity" description="Governance and configuration audit trail" /><div className="space-y-3">{adminActivity.map(([category, title, time, tag]) => <div key={title} className="border-l-2 border-slate-300 pl-3"><div className="flex items-center justify-between gap-2"><span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{category}</span><Badge variant="neutral" size="sm">{tag}</Badge></div><p className="mt-1 text-sm font-medium leading-snug text-slate-800">{title}</p><p className="mt-1 text-xs text-slate-500">{time}</p></div>)}</div></Card></div>
    </div>
  );
}