import React from 'react';
import {
  Bell,
  MapPin,
  UserCircle2,
  HeartPulse,
  ClipboardCheck,
  Tractor,
  Stethoscope,
  FlaskConical,
  Clock3,
  AlertTriangle,
  CalendarClock,
  ArrowRight,
  Plus,
  CheckCircle2,
  Spline,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const summaryCards = [
  { label: 'Farmers assisted', value: '128', detail: 'Across 6 villages', icon: Tractor, tone: 'emerald' },
  { label: 'Livestock under care', value: '462', detail: 'Monitoring in field', icon: HeartPulse, tone: 'teal' },
  { label: 'Pending visits', value: '09', detail: 'Due today or tomorrow', icon: Clock3, tone: 'amber' },
  { label: 'Health cases', value: '17', detail: '3 urgent attention', icon: ClipboardCheck, tone: 'blue' },
];

const todaysVisits = [
  { farmer: 'Ramesh Kumar', village: 'Gopalpur', animal: 'Cow', reason: 'Mastitis check', time: '09:30 AM', status: 'Scheduled', action: 'Open' },
  { farmer: 'Sita Devi', village: 'Bharampur', animal: 'Goat', reason: 'Vaccination follow-up', time: '10:45 AM', status: 'Ongoing', action: 'Update' },
  { farmer: 'Ram Lal', village: 'Nawada', animal: 'Buffalo', reason: 'Fever observation', time: '12:15 PM', status: 'Delayed', action: 'Review' },
  { farmer: 'Anita Yadav', village: 'Sarai', animal: 'Cow', reason: 'Milk quality check', time: '03:00 PM', status: 'Scheduled', action: 'Open' },
];

const activeCases = [
  { id: 'CASE-204', farmer: 'Ramesh Kumar', animal: 'Cow', issue: 'Mild mastitis', severity: 'High', lastVisit: '2026-08-14', status: 'Monitoring' },
  { id: 'CASE-118', farmer: 'Sita Devi', animal: 'Goat', issue: 'Vaccination missed', severity: 'Medium', lastVisit: '2026-08-12', status: 'Follow-up' },
  { id: 'CASE-347', farmer: 'Ram Lal', animal: 'Buffalo', issue: 'Low appetite / fever', severity: 'High', lastVisit: '2026-08-11', status: 'Urgent' },
  { id: 'CASE-521', farmer: 'Anita Yadav', animal: 'Cow', issue: 'Hoof check', severity: 'Low', lastVisit: '2026-08-10', status: 'Stable' },
];

const vaccinationTasks = [
  { task: 'FMD vaccination', animals: '12 cattle', due: 'Today', status: 'Due', tone: 'warning' },
  { task: 'Deworming cycle', animals: '18 goats', due: 'Tomorrow', status: 'Scheduled', tone: 'info' },
  { task: 'Foot-and-mouth follow-up', animals: '4 buffalo', due: '2 days', status: 'Overdue', tone: 'danger' },
  { task: 'Calf vaccination review', animals: '7 calves', due: 'Thurs', status: 'Planned', tone: 'success' },
];

const alerts = [
  { title: 'Urgent animal health case', detail: 'Buffalo case at Nawada requires same-day review by vet.', severity: 'High', tone: 'danger' },
  { title: 'Vaccination due', detail: 'Gopalpur cattle group needs FMD vaccination before 5 PM today.', severity: 'Medium', tone: 'warning' },
  { title: 'Pending veterinarian visit', detail: 'Vet referral for mastitis case is waiting for confirmation.', severity: 'Medium', tone: 'info' },
  { title: 'Laboratory report available', detail: 'Milk test result for Sita Devi’s goat cohort is ready.', severity: 'Low', tone: 'success' },
];

const quickActions = [
  { title: 'Register livestock', icon: Plus, variant: 'primary' },
  { title: 'Schedule farmer visit', icon: CalendarClock, variant: 'secondary' },
  { title: 'Record animal health', icon: ClipboardCheck, variant: 'outline' },
  { title: 'Request veterinarian', icon: Stethoscope, variant: 'secondary' },
  { title: 'Request laboratory test', icon: FlaskConical, variant: 'ghost' },
];

const recentActivity = [
  { category: 'Field visit', title: 'Completed mastitis assessment in Gopalpur', time: 'Today, 08:40 AM', tag: 'Completed' },
  { category: 'Health record', title: 'Updated vaccination notes for goat group', time: 'Yesterday, 04:10 PM', tag: 'Updated' },
  { category: 'Vaccination', title: 'Recorded FMD vaccination for 5 cattle', time: 'Aug 14, 02:40 PM', tag: 'Recorded' },
  { category: 'Referral', title: 'Vet referral sent for fever case in Nawada', time: 'Aug 13, 11:20 AM', tag: 'Referral' },
];

const visitStatusVariant = (status) => {
  switch (status) {
    case 'Scheduled':
      return 'info';
    case 'Ongoing':
      return 'warning';
    case 'Delayed':
      return 'danger';
    default:
      return 'neutral';
  }
};

const caseSeverityVariant = (severity) => {
  switch (severity) {
    case 'High':
      return 'danger';
    case 'Medium':
      return 'warning';
    case 'Low':
      return 'info';
    default:
      return 'neutral';
  }
};

const taskStatusVariant = (status) => {
  switch (status) {
    case 'Overdue':
      return 'danger';
    case 'Due':
      return 'warning';
    case 'Scheduled':
      return 'info';
    case 'Planned':
      return 'success';
    default:
      return 'neutral';
  }
};

export default function PashuSakhiPage() {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100 text-teal-700 shadow-sm">
            <UserCircle2 className="h-7 w-7" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Pashu Sakhi dashboard</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Welcome, Asha Devi</h1>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start xl:self-auto">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-card">
            <MapPin className="h-4 w-4 text-teal-600" aria-hidden="true" />
            <span>Area: Gopalpur cluster, Bihar</span>
          </div>
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-card transition-colors hover:bg-slate-50"
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-teal-500 ring-2 ring-white" aria-hidden="true" />
          </button>
        </div>
      </div>

      <Card className="mb-6 border-teal-200 bg-gradient-to-br from-teal-50 via-white to-white">
        <div className="flex flex-col gap-4 p-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-teal-700">Field support status</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">Your outreach plan is active across the assigned villages.</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Spline className="h-4 w-4 text-teal-600" aria-hidden="true" />
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
                  tone === 'teal' && 'bg-teal-100 text-teal-700',
                  tone === 'amber' && 'bg-amber-100 text-amber-700',
                  tone === 'blue' && 'bg-blue-100 text-blue-700',
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
              <CardTitle>Today’s field visits</CardTitle>
              <CardDescription>Scheduled support visits and follow-ups</CardDescription>
            </div>
            <Button variant="outline" size="sm" icon={Plus} iconPosition="left">
              Add visit
            </Button>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead>
                <tr className="text-slate-500">
                  <th className="pb-3 pr-4 font-medium">Farmer</th>
                  <th className="pb-3 pr-4 font-medium">Village</th>
                  <th className="pb-3 pr-4 font-medium">Animal</th>
                  <th className="pb-3 pr-4 font-medium">Reason</th>
                  <th className="pb-3 pr-4 font-medium">Time</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {todaysVisits.map((visit) => (
                  <tr key={`${visit.farmer}-${visit.time}`} className="align-middle">
                    <td className="py-3 pr-4 font-medium text-slate-800">{visit.farmer}</td>
                    <td className="py-3 pr-4 text-slate-600">{visit.village}</td>
                    <td className="py-3 pr-4 text-slate-600">{visit.animal}</td>
                    <td className="py-3 pr-4 text-slate-600">{visit.reason}</td>
                    <td className="py-3 pr-4 text-slate-600">{visit.time}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={visitStatusVariant(visit.status)} size="sm" dot>
                        {visit.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      <Button variant="ghost" size="sm">
                        {visit.action}
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
                <CardTitle>Important alerts</CardTitle>
                <CardDescription>Priority issues for action today</CardDescription>
              </div>
            </CardHeader>

            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.title} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-600" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">{alert.title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-600">{alert.detail}</p>
                      </div>
                    </div>
                    <Badge variant={alert.tone === 'danger' ? 'danger' : alert.tone === 'warning' ? 'warning' : alert.tone === 'info' ? 'info' : 'success'} size="sm">
                      {alert.severity}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <div>
              <CardTitle>Animal health cases</CardTitle>
              <CardDescription>Active cases needing review or follow-up</CardDescription>
            </div>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead>
                <tr className="text-slate-500">
                  <th className="pb-3 pr-4 font-medium">Case ID</th>
                  <th className="pb-3 pr-4 font-medium">Farmer</th>
                  <th className="pb-3 pr-4 font-medium">Animal</th>
                  <th className="pb-3 pr-4 font-medium">Issue</th>
                  <th className="pb-3 pr-4 font-medium">Severity</th>
                  <th className="pb-3 pr-4 font-medium">Last visit</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeCases.map((item) => (
                  <tr key={item.id} className="align-middle">
                    <td className="py-3 pr-4 font-medium text-slate-800">{item.id}</td>
                    <td className="py-3 pr-4 text-slate-600">{item.farmer}</td>
                    <td className="py-3 pr-4 text-slate-600">{item.animal}</td>
                    <td className="py-3 pr-4 text-slate-600">{item.issue}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={caseSeverityVariant(item.severity)} size="sm">
                        {item.severity}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">{item.lastVisit}</td>
                    <td className="py-3">
                      <Badge variant={item.status === 'Urgent' ? 'danger' : item.status === 'Monitoring' ? 'warning' : item.status === 'Follow-up' ? 'info' : 'success'} size="sm">
                        {item.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <div>
              <CardTitle>Vaccination & preventive care</CardTitle>
              <CardDescription>Upcoming tasks and reminders</CardDescription>
            </div>
          </CardHeader>

          <div className="space-y-3">
            {vaccinationTasks.map((item) => (
              <div key={item.task} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{item.task}</p>
                    <p className="mt-1 text-xs text-slate-600">{item.animals}</p>
                  </div>
                  <Badge variant={taskStatusVariant(item.status)} size="sm">
                    {item.status}
                  </Badge>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>Due: {item.due}</span>
                  <span className="font-medium text-slate-600">Follow-up</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <div>
              <CardTitle>Quick actions</CardTitle>
              <CardDescription>Priority tasks for the current field cycle</CardDescription>
            </div>
          </CardHeader>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
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
              <CardDescription>Recent field actions and updates from your area</CardDescription>
            </div>
          </CardHeader>

          <div className="grid gap-4 lg:grid-cols-4">
            {recentActivity.map((item) => (
              <div key={item.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">{item.category}</span>
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
