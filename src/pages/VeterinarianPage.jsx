import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  CheckCircle2,
  ShieldAlert,
  Building2,
  FileCheck2,
  PackageCheck,
  History,
  Eye,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useBionexus } from '../context';
import { formatDateTime } from '../utils/casePresentation';
import { sampleTypeLabel } from '../utils/samplePresentation';
import VeterinarianHeaderNav from '../components/VeterinarianHeaderNav';

export default function VeterinarianPage() {
  const navigate = useNavigate();
  const { cases, samples, alerts, villages, prescriptions } = useBionexus();

  const assignedVillages = villages && villages.length > 0 ? villages : [
    { villageId: 'VIL-UDAIPUR', name: 'Udaipur Village', liveCasesCount: 8, highPriorityCount: 2, pendingSamplesCount: 1 },
    { villageId: 'VIL-BHARAMPUR', name: 'Bharampur Village', liveCasesCount: 5, highPriorityCount: 1, pendingSamplesCount: 0 },
    { villageId: 'VIL-NAWADA', name: 'Nawada Village', liveCasesCount: 4, highPriorityCount: 2, pendingSamplesCount: 2 },
    { villageId: 'VIL-KALKAMATA', name: 'Kalka Mata Village', liveCasesCount: 2, highPriorityCount: 0, pendingSamplesCount: 0 },
    { villageId: 'VIL-RAMPUR', name: 'Rampur Village', liveCasesCount: 3, highPriorityCount: 1, pendingSamplesCount: 1 },
    { villageId: 'VIL-SUKHER', name: 'Sukher Village', liveCasesCount: 1, highPriorityCount: 0, pendingSamplesCount: 0 },
  ];

  const totalLiveCases = cases.filter((c) => c.status !== 'RESOLVED' && c.status !== 'CLOSED').length;
  const highPriorityCases = cases.filter((c) => c.riskLevel === 'RED' || c.aiPriority === 'HIGH' || c.riskLevel === 'HIGH').length;
  const pendingSamples = samples.filter((s) => s.status === 'REQUESTED' || s.status === 'COLLECTED_BY_SAKHI' || s.status === 'RECEIVED_AT_KENDRA' || s.status === 'RESULT_AVAILABLE');
  const pendingDecisions = cases.filter((c) => c.status === 'VET_REVIEW' || !c.riskLevel).length;

  const quickNavCards = [
    { title: 'My Villages', detail: `${assignedVillages.length} Villages under surveillance`, icon: Building2, color: 'bg-blue-50 text-blue-700 border-blue-200', path: '/veterinarian/villages' },
    { title: 'Case Queue', detail: `${pendingDecisions} Cases pending vet assessment`, icon: ClipboardPlus, color: 'bg-amber-50 text-amber-700 border-amber-200', path: '/veterinarian/cases' },
    { title: 'Pending Samples', detail: `${pendingSamples.length} Active diagnostic requests`, icon: FlaskConical, color: 'bg-indigo-50 text-indigo-700 border-indigo-200', path: '/veterinarian/samples' },
    { title: 'Prescriptions', detail: `${prescriptions.length} Active prescriptions issued`, icon: FileCheck2, color: 'bg-emerald-50 text-emerald-700 border-emerald-200', path: '/veterinarian/prescriptions' },
    { title: 'Kendra Inventory', detail: 'Monitor medicine stock & refill requests', icon: PackageCheck, color: 'bg-teal-50 text-teal-700 border-teal-200', path: '/veterinarian/kendra-inventory' },
    { title: 'Case History', detail: 'Search & review past clinical records', icon: History, color: 'bg-slate-100 text-slate-700 border-slate-200', path: '/veterinarian/case-history' },
  ];

  const recentCases = cases.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8">
      {/* Top Header */}
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
            <Stethoscope className="h-7 w-7" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Veterinarian Surveillance Portal</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Dr. Parth Gawde</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
            <MapPin className="h-4 w-4 text-blue-600" aria-hidden="true" />
            <span>Assigned: 6 Village Clusters</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 shadow-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
            Duty Active
          </div>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <VeterinarianHeaderNav />

      {/* Overview Banner */}
      <Card className="mb-6 border-blue-200 bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 text-white shadow-lg">
        <div className="flex flex-col gap-4 p-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-200">Clinical Surveillance Control Center</p>
            <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">Veterinary Management & Disease Prevention Portal</h2>
            <p className="mt-1 text-xs text-blue-100">Select a section below or navigate using the top tabs to manage village cases, sample workflows, and prescriptions.</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-blue-700/50 px-3 py-1.5 text-xs text-blue-100 border border-blue-500/40">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>SIH Biosecurity Prototype</span>
          </div>
        </div>
      </Card>

      {/* High Level Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Card className="border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Assigned Villages</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{assignedVillages.length}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <Building2 className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Live Cases</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{totalLiveCases}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
              <HeartPulse className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">High Priority</p>
              <p className="mt-2 text-3xl font-bold text-red-600">{highPriorityCases}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-700">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pending Samples</p>
              <p className="mt-2 text-3xl font-bold text-indigo-600">{pendingSamples.length}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
              <FlaskConical className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pending Decisions</p>
              <p className="mt-2 text-3xl font-bold text-amber-600">{pendingDecisions}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <Clock3 className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Module Navigation Grid */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-blue-600" />
          Veterinarian Modules & Workflows
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickNavCards.map(({ title, detail, icon: Icon, color, path }) => (
            <Card
              key={title}
              onClick={() => navigate(path)}
              className="group cursor-pointer border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-blue-300"
            >
              <div className="flex items-start justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <ArrowRight className="h-5 w-5 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-blue-600" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 group-hover:text-blue-600">{title}</h3>
              <p className="mt-1 text-xs text-slate-500">{detail}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Live Case Activity & Recent Disease Alerts */}
      <div className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <div>
              <CardTitle>Recent Case Activity</CardTitle>
              <CardDescription>Live cases submitted across assigned villages</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/veterinarian/cases')}>
              View All Queue
            </Button>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead>
                <tr className="text-slate-500 text-xs uppercase tracking-wider">
                  <th className="pb-3 pr-4 font-semibold">Case ID</th>
                  <th className="pb-3 pr-4 font-semibold">Village</th>
                  <th className="pb-3 pr-4 font-semibold">Reported Symptoms</th>
                  <th className="pb-3 pr-4 font-semibold">AI Priority</th>
                  <th className="pb-3 pr-4 font-semibold">Vet Assessment</th>
                  <th className="pb-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentCases.map((item) => (
                  <tr key={item.caseId} className="align-middle">
                    <td className="py-3 pr-4 font-bold text-blue-700">{item.caseId}</td>
                    <td className="py-3 pr-4 text-slate-700">{item.location?.village || 'Assigned Village'}</td>
                    <td className="py-3 pr-4 text-slate-600 max-w-[200px] truncate">{item.symptoms?.join(', ') || 'Reported'}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={item.aiPriority === 'HIGH' ? 'danger' : item.aiPriority === 'MEDIUM' ? 'warning' : 'info'} size="sm">
                        {item.aiPriority || 'NORMAL'}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={item.riskLevel === 'RED' ? 'danger' : item.riskLevel === 'YELLOW' ? 'warning' : item.riskLevel === 'LOW' ? 'success' : 'neutral'} size="sm">
                        {item.riskLevel || 'PENDING'}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      <Link to={`/veterinarian/cases/${item.caseId}`}>
                        <Button variant="ghost" size="sm" icon={Eye}>Open</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Active Disease Alerts */}
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <div>
              <CardTitle>Recent Disease Alerts</CardTitle>
              <CardDescription>Active surveillance zones & field warnings</CardDescription>
            </div>
            <ShieldAlert className="h-5 w-5 text-amber-600" />
          </CardHeader>

          <div className="space-y-3">
            {alerts && alerts.length > 0 ? (
              alerts.map((alert) => (
                <div key={alert.alertId || alert.title} className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-700 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-amber-900">{alert.disease || alert.title}</p>
                        <p className="mt-1 text-xs text-amber-800">{alert.location?.village || alert.detail}</p>
                      </div>
                    </div>
                    <Badge variant="danger" size="sm">{alert.severity || 'HIGH'}</Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-500">
                No active critical disease alerts reported.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
