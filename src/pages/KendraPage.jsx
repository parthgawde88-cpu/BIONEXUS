import React from 'react';
import {
  Activity, AlertTriangle, ArrowRight, Bell, Building2, CalendarClock,
  ClipboardList, Clock3, FlaskConical, HeartPulse, MapPin, Plus,
  ShieldCheck, Stethoscope, UserRound, UsersRound,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const summaryCards = [
  { label: 'Registered farmers', value: '486', detail: '+18 this month', icon: UsersRound, tone: 'emerald' },
  { label: 'Active livestock cases', value: '37', detail: '6 need same-day review', icon: HeartPulse, tone: 'red' },
  { label: 'Pending service requests', value: '24', detail: '8 awaiting assignment', icon: ClipboardList, tone: 'amber' },
  { label: "Today's appointments", value: '16', detail: '4 field visits planned', icon: CalendarClock, tone: 'blue' },
];

const requests = [
  { id: 'REQ-2841', farmer: 'Bhupesh Paliwal', service: 'Veterinary consultation', animal: 'Cow BLX-204', date: 'Today, 08:40', priority: 'High', assigned: 'Dr. Parth Gawde', status: 'Assigned', action: 'Open' },
  { id: 'REQ-2837', farmer: 'Sita Devi', service: 'Vaccination', animal: '12 goats', date: 'Today, 09:15', priority: 'Medium', assigned: 'Janvi Madam', status: 'In progress', action: 'Track' },
  { id: 'REQ-2832', farmer: 'Ram Lal', service: 'Laboratory test', animal: 'Buffalo BLX-347', date: 'Yesterday', priority: 'Critical', assigned: 'Udaipur Lab', status: 'Escalated', action: 'Review' },
  { id: 'REQ-2826', farmer: 'Anita Yadav', service: 'Field visit', animal: 'Cow BLX-521', date: 'Aug 15, 14:20', priority: 'Low', assigned: 'Unassigned', status: 'Pending', action: 'Assign' },
  { id: 'REQ-2819', farmer: 'Mohan Meena', service: 'Livestock registration', animal: '3 calves', date: 'Aug 15, 11:05', priority: 'Medium', assigned: 'Front desk', status: 'Completed', action: 'View' },
];

const appointments = [
  { time: '09:00 AM', farmer: 'Sita Devi', service: 'Vaccination drive', professional: 'Janvi Madam', status: 'Ongoing', action: 'Update' },
  { time: '10:30 AM', farmer: 'Bhupesh Paliwal', service: 'Vet consultation', professional: 'Dr. Parth Gawde', status: 'Confirmed', action: 'Open' },
  { time: '12:15 PM', farmer: 'Ram Lal', service: 'Critical case review', professional: 'Dr. Meena Sharma', status: 'Urgent', action: 'Call' },
  { time: '03:00 PM', farmer: 'Anita Yadav', service: 'Field visit', professional: 'Pashu Sakhi team', status: 'Scheduled', action: 'Open' },
];

const resources = [
  { label: 'Available veterinarians', value: '04 / 06', detail: '2 on field duty', icon: Stethoscope, tone: 'blue' },
  { label: 'Active Pashu Sakhis', value: '09', detail: 'Across 6 villages', icon: UserRound, tone: 'teal' },
  { label: 'Pending laboratory work', value: '11', detail: '3 beyond 24 hours', icon: FlaskConical, tone: 'purple' },
  { label: 'Upcoming field visits', value: '07', detail: 'Next 48 hours', icon: MapPin, tone: 'amber' },
];

const healthOverview = [
  { label: 'Healthy animals', value: '1,842', percent: '78%', tone: 'bg-emerald-500', icon: ShieldCheck },
  { label: 'Under treatment', value: '286', percent: '12%', tone: 'bg-amber-500', icon: Activity },
  { label: 'Vaccinations due', value: '174', percent: '7%', tone: 'bg-blue-500', icon: CalendarClock },
  { label: 'Critical cases', value: '37', percent: '3%', tone: 'bg-red-500', icon: AlertTriangle },
];

const alerts = [
  { title: 'Critical livestock case', detail: 'Buffalo BLX-347 at Nawada needs same-day veterinary review.', severity: 'Critical', tone: 'danger' },
  { title: 'Veterinarian unavailable', detail: 'Dr. Meena Sharma is unavailable from 2:00 PM to 5:00 PM.', severity: 'High', tone: 'warning' },
  { title: 'Vaccination campaign due', detail: 'FMD campaign for 42 cattle is scheduled to begin tomorrow.', severity: 'Medium', tone: 'info' },
  { title: 'Delayed laboratory report', detail: 'LAB-1051 has exceeded the expected turnaround by 6 hours.', severity: 'Medium', tone: 'warning' },
];

const quickActions = [
  { title: 'Register farmer', icon: Plus, variant: 'primary' },
  { title: 'Create service request', icon: ClipboardList, variant: 'secondary' },
  { title: 'Schedule appointment', icon: CalendarClock, variant: 'outline' },
  { title: 'Assign veterinarian', icon: Stethoscope, variant: 'secondary' },
  { title: 'Assign Pashu Sakhi', icon: UserRound, variant: 'ghost' },
  { title: 'View laboratory requests', icon: FlaskConical, variant: 'ghost' },
];

const recentActivity = [
  { category: 'Registration', title: 'Registered 6 new farmers from Bharampur', time: 'Today, 08:25 AM', tag: 'Completed' },
  { category: 'Assignment', title: 'Assigned REQ-2841 to Dr. Parth Gawde', time: 'Today, 08:10 AM', tag: 'Assigned' },
  { category: 'Appointment', title: 'Completed vaccination appointment for 8 goats', time: 'Yesterday, 04:45 PM', tag: 'Completed' },
  { category: 'Vaccination', title: 'Recorded FMD vaccinations for Udaipur cluster', time: 'Yesterday, 02:20 PM', tag: 'Recorded' },
  { category: 'Laboratory', title: 'Received 4 reports from Udaipur Diagnostic Center', time: 'Aug 15, 11:30 AM', tag: 'Received' },
];

const priorityVariant = (priority) => ({ Critical: 'danger', High: 'warning', Medium: 'info', Low: 'neutral' }[priority] || 'neutral');
const statusVariant = (status) => ({ Assigned: 'success', 'In progress': 'warning', Escalated: 'danger', Pending: 'info', Completed: 'success', Ongoing: 'warning', Confirmed: 'success', Urgent: 'danger', Scheduled: 'info' }[status] || 'neutral');

function SectionHeader({ title, description, action }) {
  return <CardHeader><div><CardTitle>{title}</CardTitle><CardDescription>{description}</CardDescription></div>{action}</CardHeader>;
}

export default function KendraPage() {
  return (
    <div className="mx-auto max-w-7xl py-6 sm:py-8">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 shadow-sm"><Building2 className="h-7 w-7" aria-hidden="true" /></div><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Kendra coordination dashboard</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Welcome, Kavita Sharma</h1><p className="mt-1 text-sm text-slate-500">Center manager · Pashu Seva Kendra, Udaipur</p></div></div>
        <div className="flex flex-wrap items-center gap-3 self-start xl:self-auto"><div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-card"><MapPin className="h-4 w-4 text-amber-600" aria-hidden="true" />Udaipur service area</div><div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 shadow-card"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true" />Open - 08:00-18:00</div><button type="button" aria-label="Notifications" className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-card transition-colors hover:bg-slate-50"><Bell className="h-5 w-5" aria-hidden="true" /><span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-white" aria-hidden="true" /></button></div>
      </div>

      <Card className="mb-6 border-amber-200 bg-gradient-to-br from-amber-50 via-white to-white"><div className="flex flex-col gap-4 p-1 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-medium text-amber-700">Today at the Kendra</p><h2 className="mt-1 text-xl font-semibold text-slate-900">Coordinate care across 6 villages and keep every request moving.</h2></div><div className="flex items-center gap-2 text-sm text-slate-600"><Clock3 className="h-4 w-4 text-amber-600" aria-hidden="true" />Tuesday, 18 August 2026</div></div></Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{summaryCards.map(({ label, value, detail, icon: Icon, tone }) => <Card key={label} className="border-slate-200 bg-white"><div className="flex items-start justify-between gap-3"><div><p className="text-sm text-slate-500">{label}</p><p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{value}</p></div><div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone === 'emerald' ? 'bg-emerald-100 text-emerald-700' : tone === 'red' ? 'bg-red-100 text-red-700' : tone === 'amber' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}><Icon className="h-5 w-5" aria-hidden="true" /></div></div><p className="mt-4 text-sm text-slate-600">{detail}</p></Card>)}</div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.8fr_1fr]"><Card className="border-slate-200 bg-white"><SectionHeader title="Service request queue" description="Coordinate incoming requests and ownership" action={<Button variant="outline" size="sm" icon={Plus}>New request</Button>} /><div className="overflow-x-auto"><table className="min-w-[900px] divide-y divide-slate-200 text-left text-sm"><thead><tr className="text-slate-500"><th className="pb-3 pr-4 font-medium">Request</th><th className="pb-3 pr-4 font-medium">Farmer</th><th className="pb-3 pr-4 font-medium">Service</th><th className="pb-3 pr-4 font-medium">Livestock</th><th className="pb-3 pr-4 font-medium">Requested</th><th className="pb-3 pr-4 font-medium">Priority</th><th className="pb-3 pr-4 font-medium">Assigned to</th><th className="pb-3 pr-4 font-medium">Status</th><th className="pb-3 text-right font-medium">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{requests.map((request) => <tr key={request.id}><td className="py-3 pr-4 font-medium text-slate-800">{request.id}</td><td className="py-3 pr-4 text-slate-700">{request.farmer}</td><td className="py-3 pr-4 text-slate-600">{request.service}</td><td className="py-3 pr-4 text-slate-600">{request.animal}</td><td className="py-3 pr-4 text-slate-600">{request.date}</td><td className="py-3 pr-4"><Badge variant={priorityVariant(request.priority)} size="sm">{request.priority}</Badge></td><td className="py-3 pr-4 text-slate-600">{request.assigned}</td><td className="py-3 pr-4"><Badge variant={statusVariant(request.status)} size="sm" dot>{request.status}</Badge></td><td className="py-3 text-right"><Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">{request.action}</Button></td></tr>)}</tbody></table></div></Card>
      <Card className="border-slate-200 bg-white"><SectionHeader title="Today's appointments" description="Appointments and activities to coordinate" /><div className="space-y-3">{appointments.map((appointment) => <div key={`${appointment.time}-${appointment.farmer}`} className="rounded-lg border border-slate-200 bg-slate-50 p-3"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-slate-800">{appointment.time} · {appointment.farmer}</p><p className="mt-1 text-xs text-slate-600">{appointment.service}</p><p className="mt-1 text-xs text-slate-500">Assigned: {appointment.professional}</p></div><Badge variant={statusVariant(appointment.status)} size="sm">{appointment.status}</Badge></div><div className="mt-2 text-right"><Button variant="ghost" size="sm">{appointment.action}</Button></div></div>)}</div></Card></div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_1fr]"><Card className="border-slate-200 bg-white"><SectionHeader title="Resource & staff coordination" description="Live capacity across the service network" /><div className="grid gap-3 sm:grid-cols-2">{resources.map(({ label, value, detail, icon: Icon, tone }) => <div key={label} className="rounded-lg border border-slate-200 p-3"><div className="flex items-center justify-between gap-2"><span className={`flex h-9 w-9 items-center justify-center rounded-lg ${tone === 'blue' ? 'bg-blue-100 text-blue-700' : tone === 'teal' ? 'bg-teal-100 text-teal-700' : tone === 'purple' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'}`}><Icon className="h-4 w-4" aria-hidden="true" /></span><span className="text-lg font-bold text-slate-900">{value}</span></div><p className="mt-3 text-sm font-medium text-slate-800">{label}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></div>)}</div></Card>
      <Card className="border-slate-200 bg-white"><SectionHeader title="Livestock health overview" description="Current status across the service area" /><div className="space-y-4">{healthOverview.map(({ label, value, percent, tone, icon: Icon }) => <div key={label}><div className="flex items-center justify-between gap-3 text-sm"><span className="flex items-center gap-2 text-slate-700"><Icon className="h-4 w-4 text-slate-500" aria-hidden="true" />{label}</span><span className="font-semibold text-slate-900">{value} <span className="font-normal text-slate-500">({percent})</span></span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${tone}`} style={{ width: percent }} /></div></div>)}</div></Card></div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_1.2fr]"><Card className="border-slate-200 bg-white"><SectionHeader title="Important alerts" description="Issues requiring coordination today" /><div className="space-y-3">{alerts.map((alert) => <div key={alert.title} className="rounded-lg border border-slate-200 bg-slate-50 p-3"><div className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" aria-hidden="true" /><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><p className="text-sm font-medium text-slate-800">{alert.title}</p><Badge variant={alert.tone} size="sm">{alert.severity}</Badge></div><p className="mt-1 text-xs leading-relaxed text-slate-600">{alert.detail}</p></div></div></div>)}</div></Card>
      <Card className="border-slate-200 bg-white"><SectionHeader title="Quick actions" description="Common tasks for the Kendra desk" /><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{quickActions.map(({ title, icon: Icon, variant }) => <Button key={title} variant={variant} size="md" icon={Icon} className="justify-start whitespace-normal text-left">{title}</Button>)}</div></Card></div>

      <Card className="mt-8 border-slate-200 bg-white"><SectionHeader title="Recent activity" description="Latest coordination updates from the center" /><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">{recentActivity.map((item) => <div key={item.title} className="border-l-2 border-amber-200 pl-3"><div className="flex items-center justify-between gap-2"><span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">{item.category}</span><Badge variant="neutral" size="sm">{item.tag}</Badge></div><p className="mt-2 text-sm font-medium leading-snug text-slate-800">{item.title}</p><p className="mt-2 text-xs text-slate-500">{item.time}</p></div>)}</div></Card>
    </div>
  );
}
