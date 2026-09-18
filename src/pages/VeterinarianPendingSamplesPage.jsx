import React from 'react';
import { Link } from 'react-router-dom';
import { FlaskConical, Clock3, CheckCircle2, FileCheck2, ArrowRight, Eye, UserCheck } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { useBionexus } from '../context';
import { formatDateTime } from '../utils/casePresentation';
import { sampleTypeLabel } from '../utils/samplePresentation';
import VeterinarianHeaderNav from '../components/VeterinarianHeaderNav';

export default function VeterinarianPendingSamplesPage() {
  const { samples, cases, sevaSakhis } = useBionexus();

  const getStatusStep = (status) => {
    switch (status) {
      case 'REQUESTED':
        return { step: 1, label: 'Requested from Sakhi', tone: 'warning' };
      case 'COLLECTED_BY_SAKHI':
        return { step: 2, label: 'Collected on Field', tone: 'info' };
      case 'RECEIVED_AT_KENDRA':
        return { step: 3, label: 'Received at Kendra', tone: 'info' };
      case 'IN_TESTING':
        return { step: 4, label: 'In Lab Testing', tone: 'warning' };
      case 'RESULT_AVAILABLE':
        return { step: 5, label: 'Result Ready for Vet', tone: 'danger' };
      case 'REVIEWED':
        return { step: 6, label: 'Reviewed by Vet', tone: 'success' };
      default:
        return { step: 1, label: status, tone: 'neutral' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Diagnostic Surveillance</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl flex items-center gap-3">
            <FlaskConical className="h-7 w-7 text-indigo-600" />
            Pending & Active Diagnostic Samples
          </h1>
          <p className="mt-1 text-sm text-slate-500">Track laboratory sample collection, Seva Sakhi chain-of-custody, testing progress, and clinical result reviews.</p>
        </div>
      </div>

      {/* Sub navigation */}
      <VeterinarianHeaderNav />

      {/* Summary Stat Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <Card className="border-slate-200 bg-white p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Diagnostic Requests</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{samples.length}</p>
        </Card>

        <Card className="border-amber-200 bg-amber-50/60 p-4">
          <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Field Collection Pending</p>
          <p className="mt-2 text-3xl font-bold text-amber-700">
            {samples.filter((s) => s.status === 'REQUESTED' || s.status === 'COLLECTED_BY_SAKHI').length}
          </p>
        </Card>

        <Card className="border-indigo-200 bg-indigo-50/60 p-4">
          <p className="text-xs font-semibold text-indigo-800 uppercase tracking-wider">At Kendra / Testing</p>
          <p className="mt-2 text-3xl font-bold text-indigo-700">
            {samples.filter((s) => s.status === 'RECEIVED_AT_KENDRA' || s.status === 'IN_TESTING').length}
          </p>
        </Card>

        <Card className="border-red-200 bg-red-50/60 p-4">
          <p className="text-xs font-semibold text-red-800 uppercase tracking-wider">Ready for Vet Review</p>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {samples.filter((s) => s.status === 'RESULT_AVAILABLE').length}
          </p>
        </Card>
      </div>

      {/* Samples List */}
      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <div>
            <CardTitle>Sample Chain-of-Custody Monitor</CardTitle>
            <CardDescription>Live diagnostic samples linked to cases, farmers, and field workers</CardDescription>
          </div>
        </CardHeader>

        {samples.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <FlaskConical className="mx-auto h-10 w-10 text-slate-300 mb-2" />
            <p className="font-semibold text-slate-700">No active diagnostic samples requested.</p>
            <p className="text-xs text-slate-500 mt-1">Open a YELLOW or RED case to request sample collection from a Seva Sakhi.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {samples.map((sample) => {
              const relatedCase = cases.find((c) => c.caseId === sample.caseId);
              const assignedSakhi = (sevaSakhis || []).find((s) => s.sakhiId === sample.assignedSakhiId) || { name: 'Priya Jadhav (Assigned Sakhi)' };
              const statusInfo = getStatusStep(sample.status);

              return (
                <div key={sample.sampleId} className="p-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900 text-base">{sample.sampleId}</span>
                      <Badge variant="neutral" size="sm">Type: {sampleTypeLabel(sample.sampleType)}</Badge>
                      <Badge variant={statusInfo.tone} size="sm">{statusInfo.label}</Badge>
                      {sample.status === 'RESULT_AVAILABLE' && (
                        <Badge variant="danger" size="sm" className="animate-pulse">Action Required</Badge>
                      )}
                    </div>

                    <p className="text-xs text-slate-600">
                      <strong>Linked Case:</strong> {sample.caseId} · <strong>Village:</strong> {relatedCase?.location?.village || 'Assigned Village'}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1 text-slate-700">
                        <UserCheck className="h-3.5 w-3.5 text-blue-600" />
                        Seva Sakhi: <strong>{assignedSakhi.name}</strong>
                      </span>
                      <span>Requested: {formatDateTime(sample.createdAt || sample.collectedAt)}</span>
                    </div>

                    {sample.result && (
                      <div className="rounded-lg bg-indigo-50 border border-indigo-200 p-2.5 text-xs text-indigo-900 mt-2">
                        <strong>Test Result:</strong> {sample.result}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-start lg:self-center">
                    <Link to={`/veterinarian/samples/${sample.sampleId}`}>
                      <Button variant={sample.status === 'RESULT_AVAILABLE' ? 'primary' : 'outline'} size="sm" icon={FileCheck2}>
                        {sample.status === 'RESULT_AVAILABLE' ? 'Review Result' : 'View Sample Details'}
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
