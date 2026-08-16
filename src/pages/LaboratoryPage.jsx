import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileText,
  FlaskConical,
  MapPin,
  Plus,
  Search,
  ShieldCheck,
  TestTube2,
  TrendingUp,
  UserRound,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const summaryCards = [
  { label: 'Samples received', value: '146', detail: 'Across 8 collection points', icon: ClipboardCheck, tone: 'purple' },
  { label: 'Tests in progress', value: '34', detail: '9 require escalation', icon: Clock3, tone: 'amber' },
  { label: 'Results pending', value: '21', detail: '5 need verification', icon: AlertTriangle, tone: 'blue' },
  { label: 'Reports completed', value: '89', detail: 'This week', icon: ShieldCheck, tone: 'emerald' },
];

const sampleQueue = [
  { id: 'LAB-1042', animalId: 'BLX-204', type: 'Cow', farmer: 'Bhupesh Paliwal', sampleType: 'Milk culture', collectionDate: '2026-08-15', priority: 'High', status: 'Received', action: 'Process' },
  { id: 'LAB-1046', animalId: 'BLX-118', type: 'Goat', farmer: 'Sita Devi', sampleType: 'Blood', collectionDate: '2026-08-15', priority: 'Medium', status: 'Processing', action: 'Track' },
  { id: 'LAB-1051', animalId: 'BLX-347', type: 'Buffalo', farmer: 'Ram Lal', sampleType: 'Faecal exam', collectionDate: '2026-08-14', priority: 'Critical', status: 'Awaiting review', action: 'Review' },
  { id: 'LAB-1058', animalId: 'BLX-521', type: 'Cow', farmer: 'Anita Yadav', sampleType: 'Urine', collectionDate: '2026-08-14', priority: 'Low', status: 'Completed', action: 'Report' },
];

const activeTests = [
  { id: 'TEST-2041', sampleId: 'LAB-1042', type: 'Milk culture', technician: 'Ritika Verma', start: '2026-08-15 09:15', priority: 'High', progress: 68, status: 'Processing' },
  { id: 'TEST-2047', sampleId: 'LAB-1046', type: 'Blood profile', technician: 'Amit Singh', start: '2026-08-15 10:05', priority: 'Medium', progress: 52, status: 'In progress' },
  { id: 'TEST-2053', sampleId: 'LAB-1051', type: 'Parasitology screen', technician: 'Nisha Rao', start: '2026-08-14 15:40', priority: 'Critical', progress: 84, status: 'Urgent review' },
  { id: 'TEST-2059', sampleId: 'LAB-1058', type: 'Urine analysis', technician: 'Kiran Shah', start: '2026-08-14 12:10', priority: 'Low', progress: 100, status: 'Ready for report' },
];

const pendingResults = [
  { sampleId: 'LAB-1046', animalId: 'BLX-118', test: 'Blood profile', requestedBy: 'Dr. Parth Gawde', date: '2026-08-15', priority: 'Medium', reviewStatus: 'Pending verification', action: 'Verify' },
  { sampleId: 'LAB-1048', animalId: 'BLX-321', test: 'Serology', requestedBy: 'Pashu Sakhi Team', date: '2026-08-14', priority: 'High', reviewStatus: 'Awaiting sign-off', action: 'Review' },
  { sampleId: 'LAB-1051', animalId: 'BLX-347', test: 'Parasitology screen', requestedBy: 'Dr. Meena Sharma', date: '2026-08-14', priority: 'Critical', reviewStatus: 'Escalated', action: 'Check' },
  { sampleId: 'LAB-1055', animalId: 'BLX-492', test: 'Milk quality analysis', requestedBy: 'Farmer support desk', date: '2026-08-13', priority: 'Low', reviewStatus: 'Ready', action: 'Open' },
];

const recentReports = [
  { reportId: 'REP-4401', sampleId: 'LAB-1018', animalId: 'BLX-089', testType: 'Blood profile', resultStatus: 'Positive', completedDate: '2026-08-15', reportStatus: 'Released', action: 'View' },
  { reportId: 'REP-4395', sampleId: 'LAB-1014', animalId: 'BLX-290', testType: 'Milk culture', resultStatus: 'Negative', completedDate: '2026-08-15', reportStatus: 'Reviewed', action: 'Open' },
  { reportId: 'REP-4388', sampleId: 'LAB-1009', animalId: 'BLX-144', testType: 'Faecal exam', resultStatus: 'Needs follow-up', completedDate: '2026-08-14', reportStatus: 'Pending release', action: 'Review' },
  { reportId: 'REP-4382', sampleId: 'LAB-0997', animalId: 'BLX-402', testType: 'Urine analysis', resultStatus: 'Stable', completedDate: '2026-08-14', reportStatus: 'Released', action: 'View' },
];

const quickActions = [
  { title: 'Register sample', icon: Plus, variant: 'primary' },
  { title: 'Start test', icon: TestTube2, variant: 'secondary' },
  { title: 'Update status', icon: ClipboardCheck, variant: 'outline' },
  { title: 'Review result', icon: FileText, variant: 'secondary' },
  { title: 'Generate report', icon: ShieldCheck, variant: 'ghost' },
  { title: 'Search sample', icon: Search, variant: 'ghost' },
];

const alerts = [
  { title: 'High-priority sample received', detail: 'Buffalo sample LAB-1051 entered at 15:40 and requires urgent screening.', severity: 'Critical', tone: 'danger' },
  { title: 'Result awaiting review', detail: 'Blood profile for BLX-118 is pending verification by the senior lab officer.', severity: 'High', tone: 'warning' },
  { title: 'Delayed test', detail: 'Parasitology screen for BLX-347 is behind expected turnaround time.', severity: 'Medium', tone: 'info' },
  { title: 'Sample requiring attention', detail: 'Sample LAB-1048 needs additional staining and repeat documentation.', severity: 'Medium', tone: 'warning' },
  { title: 'Report ready for release', detail: 'Report REP-4401 for BLX-089 is ready for final sign-off.', severity: 'Low', tone: 'success' },
];

const recentActivity = [
  { category: 'Sample intake', title: 'Registered 12 new samples at the field collection unit', time: 'Today, 08:30 AM', tag: 'Logged' },
  { category: 'Test completion', title: 'Completed 7 diagnostic assays for milk and blood samples', time: 'Yesterday, 04:20 PM', tag: 'Completed' },
  { category: 'Result review', title: 'Verified urine analysis report for BLX-402', time: 'Aug 14, 01:15 PM', tag: 'Verified' },
  { category: 'Report release', title: 'Released two laboratory summaries to the vet desk', time: 'Aug 14, 09:55 AM', tag: 'Released' },
  { category: 'Status update', title: 'Updated sample LAB-1046 to processing workstream', time: 'Aug 13, 03:05 PM', tag: 'Updated' },
];

const priorityVariant = (priority) => {
  switch (priority) {
    case 'Critical':
      return 'danger';
    case 'High':
      return 'warning';
    case 'Medium':
      return 'info';
    case 'Low':
      return 'neutral';
    default:
      return 'neutral';
  }
};

const statusVariant = (status) => {
  switch (status) {
    case 'Received':
      return 'info';
    case 'Processing':
      return 'warning';
    case 'In progress':
      return 'warning';
    case 'Awaiting review':
      return 'danger';
    case 'Completed':
      return 'success';
    case 'Ready for report':
      return 'success';
    case 'Urgent review':
      return 'danger';
    case 'Pending verification':
      return 'warning';
    case 'Awaiting sign-off':
      return 'info';
    case 'Escalated':
      return 'danger';
    case 'Ready':
      return 'success';
    case 'Released':
      return 'success';
    case 'Reviewed':
      return 'info';
    case 'Pending release':
      return 'warning';
    default:
      return 'neutral';
  }
};

export default function LaboratoryPage() {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 shadow-sm">
            <FlaskConical className="h-7 w-7" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Laboratory dashboard</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Welcome, Dr. Anjali Vishwakarma</h1>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start xl:self-auto">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-card">
            <MapPin className="h-4 w-4 text-violet-600" aria-hidden="true" />
            <span>Lab: Udaipur Diagnostic Center</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 shadow-card">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
            Online & receiving samples
          </div>
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-card transition-colors hover:bg-slate-50"
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-violet-500 ring-2 ring-white" aria-hidden="true" />
          </button>
        </div>
      </div>

      <Card className="mb-6 border-violet-200 bg-gradient-to-br from-violet-50 via-white to-white">
        <div className="flex flex-col gap-4 p-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-violet-700">Sample & result workflow</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">Diagnostics operations are active across field sample intake, tests, and report release.</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <CheckCircle2 className="h-4 w-4 text-violet-600" aria-hidden="true" />
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
                  tone === 'purple' && 'bg-violet-100 text-violet-700',
                  tone === 'amber' && 'bg-amber-100 text-amber-700',
                  tone === 'blue' && 'bg-blue-100 text-blue-700',
                  tone === 'emerald' && 'bg-emerald-100 text-emerald-700',
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
              <CardTitle>Sample queue</CardTitle>
              <CardDescription>Samples received and assigned for processing</CardDescription>
            </div>
            <Button variant="outline" size="sm" icon={Plus} iconPosition="left">
              Register sample
            </Button>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead>
                <tr className="text-slate-500">
                  <th className="pb-3 pr-4 font-medium">Sample ID</th>
                  <th className="pb-3 pr-4 font-medium">Animal ID</th>
                  <th className="pb-3 pr-4 font-medium">Animal type</th>
                  <th className="pb-3 pr-4 font-medium">Farmer</th>
                  <th className="pb-3 pr-4 font-medium">Sample type</th>
                  <th className="pb-3 pr-4 font-medium">Collection date</th>
                  <th className="pb-3 pr-4 font-medium">Priority</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sampleQueue.map((sample) => (
                  <tr key={sample.id} className="align-middle">
                    <td className="py-3 pr-4 font-medium text-slate-800">{sample.id}</td>
                    <td className="py-3 pr-4 text-slate-600">{sample.animalId}</td>
                    <td className="py-3 pr-4 text-slate-600">{sample.type}</td>
                    <td className="py-3 pr-4 text-slate-600">{sample.farmer}</td>
                    <td className="py-3 pr-4 text-slate-600">{sample.sampleType}</td>
                    <td className="py-3 pr-4 text-slate-600">{sample.collectionDate}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={priorityVariant(sample.priority)} size="sm">
                        {sample.priority}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={statusVariant(sample.status)} size="sm">
                        {sample.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      <Button variant="ghost" size="sm">
                        {sample.action}
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
                <CardDescription>Priority issues for lab operations</CardDescription>
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
              <CardTitle>Test processing</CardTitle>
              <CardDescription>Active laboratory tests in process</CardDescription>
            </div>
          </CardHeader>

          <div className="space-y-4">
            {activeTests.map((test) => (
              <div key={test.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-slate-800">{test.id}</p>
                      <Badge variant={priorityVariant(test.priority)} size="sm">{test.priority}</Badge>
                    </div>
                    <p className="mt-2 text-base font-medium text-slate-800">{test.type}</p>
                    <p className="mt-1 text-xs text-slate-500">Sample: {test.sampleId} · Technician: {test.technician}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{test.start}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                    <span>{test.status}</span>
                    <span>{test.progress}%</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500"
                      style={{ width: `${test.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <div>
              <CardTitle>Quick actions</CardTitle>
              <CardDescription>Common laboratory tasks</CardDescription>
            </div>
          </CardHeader>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
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

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.25fr_1fr]">
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <div>
              <CardTitle>Pending results</CardTitle>
              <CardDescription>Awaiting laboratory verification and sign-off</CardDescription>
            </div>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead>
                <tr className="text-slate-500">
                  <th className="pb-3 pr-4 font-medium">Sample ID</th>
                  <th className="pb-3 pr-4 font-medium">Animal ID</th>
                  <th className="pb-3 pr-4 font-medium">Test</th>
                  <th className="pb-3 pr-4 font-medium">Requested by</th>
                  <th className="pb-3 pr-4 font-medium">Date</th>
                  <th className="pb-3 pr-4 font-medium">Priority</th>
                  <th className="pb-3 pr-4 font-medium">Review status</th>
                  <th className="pb-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingResults.map((item) => (
                  <tr key={item.sampleId} className="align-middle">
                    <td className="py-3 pr-4 font-medium text-slate-800">{item.sampleId}</td>
                    <td className="py-3 pr-4 text-slate-600">{item.animalId}</td>
                    <td className="py-3 pr-4 text-slate-600">{item.test}</td>
                    <td className="py-3 pr-4 text-slate-600">{item.requestedBy}</td>
                    <td className="py-3 pr-4 text-slate-600">{item.date}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={priorityVariant(item.priority)} size="sm">{item.priority}</Badge>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={statusVariant(item.reviewStatus)} size="sm">{item.reviewStatus}</Badge>
                    </td>
                    <td className="py-3 text-right">
                      <Button variant="ghost" size="sm">{item.action}</Button>
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
              <CardTitle>Recent activity</CardTitle>
              <CardDescription>Latest internal sample and report events</CardDescription>
            </div>
          </CardHeader>

          <div className="space-y-4">
            {recentActivity.map((entry) => (
              <div key={entry.title} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">{entry.category}</span>
                  <Badge variant="neutral" size="sm">{entry.tag}</Badge>
                </div>
                <p className="text-sm font-medium text-slate-800">{entry.title}</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                  <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{entry.time}</span>
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
              <CardTitle>Recent laboratory reports</CardTitle>
              <CardDescription>Completed results and released records</CardDescription>
            </div>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead>
                <tr className="text-slate-500">
                  <th className="pb-3 pr-4 font-medium">Report ID</th>
                  <th className="pb-3 pr-4 font-medium">Sample ID</th>
                  <th className="pb-3 pr-4 font-medium">Animal ID</th>
                  <th className="pb-3 pr-4 font-medium">Test type</th>
                  <th className="pb-3 pr-4 font-medium">Result status</th>
                  <th className="pb-3 pr-4 font-medium">Completed date</th>
                  <th className="pb-3 pr-4 font-medium">Report status</th>
                  <th className="pb-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentReports.map((report) => (
                  <tr key={report.reportId} className="align-middle">
                    <td className="py-3 pr-4 font-medium text-slate-800">{report.reportId}</td>
                    <td className="py-3 pr-4 text-slate-600">{report.sampleId}</td>
                    <td className="py-3 pr-4 text-slate-600">{report.animalId}</td>
                    <td className="py-3 pr-4 text-slate-600">{report.testType}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={report.resultStatus === 'Positive' ? 'danger' : report.resultStatus === 'Negative' ? 'success' : report.resultStatus === 'Stable' ? 'info' : 'warning'} size="sm">
                        {report.resultStatus}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">{report.completedDate}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={statusVariant(report.reportStatus)} size="sm">{report.reportStatus}</Badge>
                    </td>
                    <td className="py-3 text-right">
                      <Button variant="ghost" size="sm">{report.action}</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
