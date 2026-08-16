import React from 'react';
import {
  Bell,
  MapPin,
  Stethoscope,
  HeartPulse,
  ClipboardPlus,
  FlaskConical,
  CalendarClock,
  Clock3,
  AlertTriangle,
  ArrowRight,
  Plus,
  CheckCircle2,
  ShieldAlert,
  FileText,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const summaryCards = [
  { label: 'Today’s appointments', value: '18', detail: 'Across 3 villages', icon: CalendarClock, tone: 'blue' },
  { label: 'Pending consultations', value: '06', detail: '2 need urgent review', icon: Clock3, tone: 'amber' },
  { label: 'Active treatment cases', value: '14', detail: '8 ongoing monitoring', icon: HeartPulse, tone: 'emerald' },
  { label: 'Critical cases', value: '03', detail: 'Escalation required', icon: ShieldAlert, tone: 'danger' },
];

const appointments = [
  { time: '09:00 AM', farmer: 'Bhupesh Paliwal', animalId: 'BLX-204', type: 'Cow', complaint: 'Mastitis and low milk yield', priority: 'High', status: 'Confirmed', action: 'Consult' },
  { time: '10:30 AM', farmer: 'Sita Devi', animalId: 'BLX-118', type: 'Goat', complaint: 'Vaccination follow-up', priority: 'Medium', status: 'Scheduled', action: 'Review' },
  { time: '12:15 PM', farmer: 'Ram Lal', animalId: 'BLX-347', type: 'Buffalo', complaint: 'Fever and reduced appetite', priority: 'Critical', status: 'Urgent', action: 'Assess' },
  { time: '02:45 PM', farmer: 'Anita Yadav', animalId: 'BLX-521', type: 'Cow', complaint: 'Hoof lesion and lameness', priority: 'Medium', status: 'Confirmed', action: 'Consult' },
];

const activeCases = [
  { id: 'VT-204', animalId: 'BLX-204', type: 'Cow', farmer: 'Bhupesh Paliwal', condition: 'Mastitis with reduced milk yield', severity: 'High', treatment: 'Antibiotic course', lastConsult: '2026-08-15' },
  { id: 'VT-118', animalId: 'BLX-118', type: 'Goat', farmer: 'Sita Devi', condition: 'Respiratory stress and cough', severity: 'Medium', treatment: 'Monitoring + meds', lastConsult: '2026-08-13' },
  { id: 'VT-347', animalId: 'BLX-347', type: 'Buffalo', farmer: 'Ram Lal', condition: 'Pyrexia and dehydration', severity: 'Critical', treatment: 'Urgent evaluation', lastConsult: '2026-08-14' },
  { id: 'VT-521', animalId: 'BLX-521', type: 'Cow', farmer: 'Anita Yadav', condition: 'Lameness and minor swelling', severity: 'Low', treatment: 'Hoof care / rest', lastConsult: '2026-08-12' },
];

const treatmentFollowUp = [
  { animal: 'BLX-204', treatment: 'Antibiotics & wound dressing', schedule: 'Due today', status: 'Monitoring', tone: 'warning' },
  { animal: 'BLX-118', treatment: 'Respiratory medication', schedule: 'Due tomorrow', status: 'Stable', tone: 'success' },
  { animal: 'BLX-347', treatment: 'IV fluids and fever review', schedule: 'Due today', status: 'Critical', tone: 'danger' },
  { animal: 'BLX-521', treatment: 'Hoof care plan', schedule: 'Re-check in 3 days', status: 'Follow-up', tone: 'info' },
];

const diagnosticRequests = [
  { id: 'LAB-104', animalId: 'BLX-204', type: 'Milk culture', date: '2026-08-15', priority: 'High', status: 'Pending', action: 'Review' },
  { id: 'LAB-207', animalId: 'BLX-347', type: 'Blood profile', date: '2026-08-14', priority: 'Critical', status: 'In progress', action: 'Track' },
  { id: 'LAB-312', animalId: 'BLX-118', type: 'Respiratory swab', date: '2026-08-12', priority: 'Medium', status: 'Results ready', action: 'Open' },
  { id: 'LAB-442', animalId: 'BLX-521', type: 'Hoof tissue exam', date: '2026-08-10', priority: 'Low', status: 'Reviewed', action: 'View' },
];

const alerts = [
  { title: 'Critical case requiring attention', detail: 'Buffalo BLX-347 needs immediate clinical review today.', severity: 'Critical', tone: 'danger' },
  { title: 'Follow-up due today', detail: 'Cow BLX-204 requires re-check after treatment review.', severity: 'High', tone: 'warning' },
  { title: 'Laboratory result available', detail: 'Respiratory swab results for BLX-118 are ready for review.', severity: 'Medium', tone: 'info' },
  { title: 'Treatment review overdue', detail: 'Two cases remain beyond expected review window.', severity: 'Medium', tone: 'warning' },
];

const quickActions = [
  { title: 'Start consultation', icon: Stethoscope, variant: 'primary' },
  { title: 'Add health record', icon: ClipboardPlus, variant: 'secondary' },
  { title: 'Create treatment plan', icon: FileText, variant: 'outline' },
  { title: 'Request laboratory test', icon: FlaskConical, variant: 'secondary' },
  { title: 'Refer case', icon: ArrowRight, variant: 'ghost' },
  { title: 'View animal history', icon: HeartPulse, variant: 'ghost' },
];

const recentClinicalActivity = [
  { category: 'Consultation', title: 'Reviewed mastitis case in Udaipur', time: 'Today, 08:40 AM', tag: 'Completed' },
  { category: 'Diagnosis', title: 'Recorded respiratory stress diagnosis for BLX-118', time: 'Yesterday, 04:15 PM', tag: 'Updated' },
  { category: 'Treatment', title: 'Antibiotic regimen updated for BLX-204', time: 'Aug 14, 02:10 PM', tag: 'Actioned' },
  { category: 'Laboratory', title: 'Received milk culture result for BLX-521', time: 'Aug 12, 11:45 AM', tag: 'Received' },
  { category: 'Referral', title: 'Referred fever case to specialist for advanced review', time: 'Aug 11, 09:30 AM', tag: 'Sent' },
];

const priorityVariant = (priority) => {
  switch (priority) {
    case 'Critical':
      return 'danger';
    case 'High':
      return 'warning';
    case 'Medium':
      return 'info';
    default:
      return 'neutral';
  }
};

const statusVariant = (status) => {
  switch (status) {
    case 'Confirmed':
      return 'success';
    case 'Scheduled':
      return 'info';
    case 'Urgent':
      return 'danger';
    case 'In progress':
      return 'warning';
    case 'Results ready':
      return 'success';
    case 'Reviewed':
      return 'info';
    case 'Critical':
      return 'danger';
    case 'Monitoring':
      return 'warning';
    case 'Stable':
      return 'success';
    case 'Follow-up':
      return 'info';
    default:
      return 'neutral';
  }
};

export default function VeterinarianPage() {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 shadow-sm">
            <Stethoscope className="h-7 w-7" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Veterinarian dashboard</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Welcome, Dr. Parth Gawde</h1>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start xl:self-auto">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-card">
            <MapPin className="h-4 w-4 text-blue-600" aria-hidden="true" />
            <span>Clinic:Lalbaugh Veterinary Unit</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 shadow-card">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
            Online & available
          </div>
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-card transition-colors hover:bg-slate-50"
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-blue-500 ring-2 ring-white" aria-hidden="true" />
          </button>
        </div>
      </div>

      <Card className="mb-6 border-blue-200 bg-gradient-to-br from-blue-50 via-white to-white">
        <div className="flex flex-col gap-4 p-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-700">Clinical overview</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">Your clinical caseload is active across assigned villages and outreach clusters.</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <CheckCircle2 className="h-4 w-4 text-blue-600" aria-hidden="true" />
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
                  tone === 'blue' && 'bg-blue-100 text-blue-700',
                  tone === 'amber' && 'bg-amber-100 text-amber-700',
                  tone === 'emerald' && 'bg-emerald-100 text-emerald-700',
                  tone === 'danger' && 'bg-red-100 text-red-700',
                ].join(' ')}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-600">{detail}</p>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.7fr_0.95fr]">
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <div>
              <CardTitle>Today’s appointments</CardTitle>
              <CardDescription>Scheduled patient consultations and visits</CardDescription>
            </div>
            <Button variant="outline" size="sm" icon={Plus} iconPosition="left">
              Add consult
            </Button>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead>
                <tr className="text-slate-500">
                  <th className="pb-3 pr-4 font-medium">Time</th>
                  <th className="pb-3 pr-4 font-medium">Farmer</th>
                  <th className="pb-3 pr-4 font-medium">Animal ID</th>
                  <th className="pb-3 pr-4 font-medium">Type</th>
                  <th className="pb-3 pr-4 font-medium">Complaint</th>
                  <th className="pb-3 pr-4 font-medium">Priority</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((item) => (
                  <tr key={`${item.time}-${item.animalId}`} className="align-middle">
                    <td className="py-3 pr-4 font-medium text-slate-800">{item.time}</td>
                    <td className="py-3 pr-4 text-slate-600">{item.farmer}</td>
                    <td className="py-3 pr-4 text-slate-600">{item.animalId}</td>
                    <td className="py-3 pr-4 text-slate-600">{item.type}</td>
                    <td className="py-3 pr-4 text-slate-600">{item.complaint}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={priorityVariant(item.priority)} size="sm">
                        {item.priority}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={statusVariant(item.status)} size="sm">
                        {item.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      <Button variant="ghost" size="sm">
                        {item.action}
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
                <CardTitle>Alerts</CardTitle>
                <CardDescription>Attention needed from clinical team</CardDescription>
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

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <div>
              <CardTitle>Critical / active cases</CardTitle>
              <CardDescription>Clinical cases pending assessment and ongoing treatment</CardDescription>
            </div>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead>
                <tr className="text-slate-500">
                  <th className="pb-3 pr-4 font-medium">Case ID</th>
                  <th className="pb-3 pr-4 font-medium">Animal ID</th>
                  <th className="pb-3 pr-4 font-medium">Type</th>
                  <th className="pb-3 pr-4 font-medium">Farmer</th>
                  <th className="pb-3 pr-4 font-medium">Condition</th>
                  <th className="pb-3 pr-4 font-medium">Severity</th>
                  <th className="pb-3 pr-4 font-medium">Treatment</th>
                  <th className="pb-3 font-medium">Last consult</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeCases.map((item) => (
                  <tr key={item.id} className="align-middle">
                    <td className="py-3 pr-4 font-medium text-slate-800">{item.id}</td>
                    <td className="py-3 pr-4 text-slate-600">{item.animalId}</td>
                    <td className="py-3 pr-4 text-slate-600">{item.type}</td>
                    <td className="py-3 pr-4 text-slate-600">{item.farmer}</td>
                    <td className="py-3 pr-4 text-slate-600">{item.condition}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={priorityVariant(item.severity)} size="sm">
                        {item.severity}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">{item.treatment}</td>
                    <td className="py-3 text-slate-600">{item.lastConsult}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <div>
              <CardTitle>Treatment & follow-up</CardTitle>
              <CardDescription>Current medication plans and review timing</CardDescription>
            </div>
          </CardHeader>

          <div className="space-y-3">
            {treatmentFollowUp.map((item) => (
              <div key={item.animal} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{item.animal}</p>
                    <p className="mt-1 text-xs text-slate-600">{item.treatment}</p>
                  </div>
                  <Badge variant={statusVariant(item.status)} size="sm">
                    {item.status}
                  </Badge>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>Schedule: {item.schedule}</span>
                  <span className="font-medium text-slate-600">Review</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <div>
              <CardTitle>Laboratory / diagnostic requests</CardTitle>
              <CardDescription>Pending or completed requests requiring clinician review</CardDescription>
            </div>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead>
                <tr className="text-slate-500">
                  <th className="pb-3 pr-4 font-medium">Test ID</th>
                  <th className="pb-3 pr-4 font-medium">Animal ID</th>
                  <th className="pb-3 pr-4 font-medium">Test type</th>
                  <th className="pb-3 pr-4 font-medium">Date</th>
                  <th className="pb-3 pr-4 font-medium">Priority</th>
                  <th className="pb-3 pr-4 font-medium">Result</th>
                  <th className="pb-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {diagnosticRequests.map((item) => (
                  <tr key={item.id} className="align-middle">
                    <td className="py-3 pr-4 font-medium text-slate-800">{item.id}</td>
                    <td className="py-3 pr-4 text-slate-600">{item.animalId}</td>
                    <td className="py-3 pr-4 text-slate-600">{item.type}</td>
                    <td className="py-3 pr-4 text-slate-600">{item.date}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={priorityVariant(item.priority)} size="sm">
                        {item.priority}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={statusVariant(item.status)} size="sm">
                        {item.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      <Button variant="ghost" size="sm">
                        {item.action}
                      </Button>
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
              <CardTitle>Quick actions</CardTitle>
              <CardDescription>Fast clinical workflow tasks</CardDescription>
            </div>
          </CardHeader>

          <div className="grid gap-3 sm:grid-cols-2">
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
              <CardTitle>Recent clinical activity</CardTitle>
              <CardDescription>Latest consultations, diagnoses, treatments and referrals</CardDescription>
            </div>
          </CardHeader>

          <div className="grid gap-4 lg:grid-cols-5">
            {recentClinicalActivity.map((item) => (
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
