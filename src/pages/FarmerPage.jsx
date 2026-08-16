import React from 'react';
import {
  Bell,
  MapPin,
  Wheat,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  FlaskConical,
  Clock3,
  CalendarClock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Plus,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const summaryCards = [
  { label: 'Total livestock', value: '24', detail: 'Across 3 sheds', icon: Wheat, tone: 'emerald' },
  { label: 'Active health cases', value: '04', detail: '2 require review', icon: HeartPulse, tone: 'amber' },
  { label: 'Vaccinations due', value: '07', detail: 'Due in next 14 days', icon: ShieldCheck, tone: 'blue' },
  { label: 'Recent consultations', value: '12', detail: 'Last 30 days', icon: Stethoscope, tone: 'purple' },
];

const livestock = [
  { id: 'BLX-204', type: 'Cow', age: '4 years', status: 'Healthy', lastCheck: '2026-08-12', action: 'View record' },
  { id: 'BLX-118', type: 'Buffalo', age: '6 years', status: 'Monitoring', lastCheck: '2026-08-09', action: 'Review' },
  { id: 'BLX-347', type: 'Goat', age: '18 months', status: 'Vaccination due', lastCheck: '2026-08-07', action: 'Schedule' },
  { id: 'BLX-521', type: 'Cow', age: '2 years', status: 'Healthy', lastCheck: '2026-08-04', action: 'View record' },
];

const healthAlerts = [
  { title: 'Mastitis check recommended', detail: 'Cow BLX-118 shows mild swelling and reduced appetite.', severity: 'High', tone: 'danger' },
  { title: 'Vaccination reminder', detail: 'Goat BLX-347 vaccination is due this week.', severity: 'Medium', tone: 'warning' },
  { title: 'Follow-up consultation', detail: 'Vet review scheduled for BLX-204 after milk quality check.', severity: 'Low', tone: 'info' },
];

const quickActions = [
  { title: 'Book veterinarian', icon: Stethoscope, variant: 'primary' },
  { title: 'Request laboratory test', icon: FlaskConical, variant: 'secondary' },
  { title: 'Contact Pashu Sakhi', icon: Plus, variant: 'outline' },
  { title: 'View livestock records', icon: FileText, variant: 'ghost' },
];

const recentActivity = [
  { category: 'Consultation', title: 'Tele-vet follow-up for BLX-204', time: 'Today, 09:15 AM', tag: 'Completed' },
  { category: 'Vaccination', title: 'FMD vaccination completed for 5 cattle', time: 'Yesterday, 04:30 PM', tag: 'Updated' },
  { category: 'Laboratory', title: 'Milk test report received for BLX-347', time: 'Aug 12, 10:40 AM', tag: 'Received' },
];

const getBadgeVariant = (status) => {
  switch (status) {
    case 'Healthy':
      return 'success';
    case 'Monitoring':
      return 'warning';
    case 'Vaccination due':
      return 'info';
    default:
      return 'neutral';
  }
};

const getAlertVariant = (tone) => {
  switch (tone) {
    case 'danger':
      return 'danger';
    case 'warning':
      return 'warning';
    case 'info':
      return 'info';
    default:
      return 'neutral';
  }
};

export default function FarmerPage() {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-sm">
            <Wheat className="h-7 w-7" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Farmer dashboard</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Welcome back, Bhupesh Paliwal</h1>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start xl:self-auto">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-card">
            <MapPin className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            <span>Village: Udaipur, Rajasthan</span>
          </div>
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-card transition-colors hover:bg-slate-50"
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" aria-hidden="true" />
          </button>
        </div>
      </div>

      <Card className="mb-6 border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-white">
        <div className="flex flex-col gap-4 p-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700">Livestock health overview</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">Your farm remains in good operational health.</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Clock3 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            <span>Mock data for prototype review</span>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map(({ label, value, detail, icon: Icon, tone }) => (
          <Card key={label} className="border-slate-200 bg-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
              </div>
              <div
                className={[
                  'flex h-11 w-11 items-center justify-center rounded-xl',
                  tone === 'emerald' && 'bg-emerald-100 text-emerald-700',
                  tone === 'amber' && 'bg-amber-100 text-amber-700',
                  tone === 'blue' && 'bg-blue-100 text-blue-700',
                  tone === 'purple' && 'bg-violet-100 text-violet-700',
                ].join(' ')}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-600">{detail}</p>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <div>
              <CardTitle>Livestock overview</CardTitle>
              <CardDescription>Current animal health and care status</CardDescription>
            </div>
            <Button variant="outline" size="sm" icon={Plus} iconPosition="left">
              Add animal
            </Button>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead>
                <tr className="text-slate-500">
                  <th className="pb-3 pr-4 font-medium">Animal ID</th>
                  <th className="pb-3 pr-4 font-medium">Type</th>
                  <th className="pb-3 pr-4 font-medium">Age</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 font-medium">Last check-up</th>
                  <th className="pb-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {livestock.map((animal) => (
                  <tr key={animal.id} className="align-middle">
                    <td className="py-3 pr-4 font-medium text-slate-800">{animal.id}</td>
                    <td className="py-3 pr-4 text-slate-600">{animal.type}</td>
                    <td className="py-3 pr-4 text-slate-600">{animal.age}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={getBadgeVariant(animal.status)} size="sm" dot>
                        {animal.status}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">{animal.lastCheck}</td>
                    <td className="py-3 text-right">
                      <Button variant="ghost" size="sm">
                        {animal.action}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <div>
                <CardTitle>Health alerts</CardTitle>
                <CardDescription>Priority issues that need attention</CardDescription>
              </div>
            </CardHeader>

            <div className="space-y-4">
              {healthAlerts.map((alert) => (
                <div key={alert.title} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-600" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">{alert.title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-600">{alert.detail}</p>
                      </div>
                    </div>
                    <Badge variant={getAlertVariant(alert.tone)} size="sm">
                      {alert.severity}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <div>
                <CardTitle>Vaccination reminders</CardTitle>
                <CardDescription>Upcoming animal protection actions</CardDescription>
              </div>
            </CardHeader>

            <div className="space-y-3">
              {[
                'FMD vaccination for 3 cattle — due by 18 Aug',
                'Deworming cycle for goats — due by 20 Aug',
                'Foot care review for buffalo group — due by 22 Aug',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-lg border border-emerald-100 bg-emerald-50/60 p-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                  <span className="text-sm text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <div>
              <CardTitle>Quick actions</CardTitle>
              <CardDescription>Useful tasks for current farm operations</CardDescription>
            </div>
          </CardHeader>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {quickActions.map(({ title, icon: Icon, variant }) => (
              <Button
                key={title}
                variant={variant}
                className="h-auto justify-between rounded-xl px-4 py-3"
                icon={ArrowRight}
                iconPosition="right"
              >
                <span className="flex items-center gap-2">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span>{title}</span>
                </span>
              </Button>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <div>
              <CardTitle>Recent activity</CardTitle>
              <CardDescription>Latest consultations, vaccinations and laboratory updates</CardDescription>
            </div>
          </CardHeader>

          <div className="grid gap-4 lg:grid-cols-3">
            {recentActivity.map((item) => (
              <div key={item.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{item.category}</span>
                  <Badge variant="neutral" size="sm">
                    {item.tag}
                  </Badge>
                </div>
                <p className="text-base font-semibold text-slate-800">{item.title}</p>
                <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                  <CalendarClock className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  <span>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
