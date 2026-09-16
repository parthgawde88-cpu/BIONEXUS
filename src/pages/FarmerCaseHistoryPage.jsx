import React from 'react';
import { ArrowLeft, ClipboardList, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import SampleChainTimeline from '../components/SampleChainTimeline';
import { useBionexus } from '../context';
import { formatCaseStatus, formatDateTime, getCaseSubject, riskVariant, statusVariant } from '../utils/casePresentation';
import { sampleTypeLabel } from '../utils/samplePresentation';

export default function FarmerCaseHistoryPage() {
  const { cases, farmers, animals, flocks, veterinarians, samples } = useBionexus();
  const farmer = farmers[0];
  const farmerCases = cases.filter((item) => item.farmerId === farmer.farmerId);

  return (
    <div className="mx-auto max-w-7xl py-6 sm:py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Farmer portal</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">Case history</h1>
          <p className="mt-2 text-sm text-slate-500">Every submitted case stays available for follow-up and audit.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/farmer" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"><ArrowLeft className="h-4 w-4" />Dashboard</Link>
          <Link to="/farmer/cases/new"><Button icon={Plus}>Report issue</Button></Link>
        </div>
      </div>
      <Card>
        <CardHeader>
          <div><CardTitle>Your health cases</CardTitle><CardDescription>{farmerCases.length} case(s) in the shared demo state</CardDescription></div>
          <ClipboardList className="h-5 w-5 text-emerald-600" />
        </CardHeader>
        <div className="space-y-3">
          {farmerCases.map((item) => {
            const subject = getCaseSubject(item, animals, flocks);
            const vet = veterinarians.find((person) => person.id === item.veterinarianId);
            const sample = samples.find((candidate) => candidate.caseId === item.caseId);
            return <div key={item.caseId} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
                  <div><p className="text-xs text-slate-500">Case ID</p><p className="mt-1 font-semibold text-slate-900">{item.caseId}</p></div>
                  <div><p className="text-xs text-slate-500">Animal/Flock</p><p className="mt-1 font-semibold text-slate-800">{subject.id}</p><p className="text-xs text-slate-500">{subject.label}</p></div>
                  <div><p className="text-xs text-slate-500">Date</p><p className="mt-1 text-sm text-slate-700">{formatDateTime(item.submittedAt)}</p></div>
                  <div><p className="text-xs text-slate-500">Village</p><p className="mt-1 text-sm text-slate-700">{item.location?.village || farmer.address}</p></div>
                  <div><p className="text-xs text-slate-500">Status</p><Badge className="mt-1" variant={statusVariant(item.status)}>{formatCaseStatus(item.status)}</Badge></div>
                  <div><p className="text-xs text-slate-500">Risk / Vet</p><div className="mt-1 flex flex-wrap gap-1.5"><Badge variant={riskVariant(item.riskLevel)}>{item.riskLevel || 'PENDING'}</Badge><span className="text-xs text-slate-500">{vet?.name || 'Awaiting assignment'}</span></div></div>
                </div>
                <Link to={`/veterinarian/cases/${item.caseId}`}><Button variant="ghost">View Case</Button></Link>
              </div>
              {sample && <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">Diagnostic Sample</p><p className="mt-1 text-lg font-bold text-slate-900">{sample.sampleId}</p><p className="text-xs text-slate-500">{sampleTypeLabel(sample.sampleType)}</p></div><Badge variant={sample.status === 'RESULT_AVAILABLE' || sample.status === 'REVIEWED' ? 'success' : 'info'}>{sample.status}</Badge></div><div className="mt-4"><SampleChainTimeline sample={sample} /></div></div>}
            </div>;
          })}
        </div>
      </Card>
    </div>
  );
}
