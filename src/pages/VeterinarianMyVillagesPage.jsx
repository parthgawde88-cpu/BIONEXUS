import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowRight, ShieldAlert, FlaskConical, HeartPulse, MapPin } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { useBionexus } from '../context';
import VeterinarianHeaderNav from '../components/VeterinarianHeaderNav';

export default function VeterinarianMyVillagesPage() {
  const navigate = useNavigate();
  const { villages, cases, samples } = useBionexus();

  const assignedVillages = villages && villages.length > 0 ? villages : [
    { villageId: 'VIL-UDAIPUR', name: 'Udaipur Village', code: 'UDP-01', liveCasesCount: 8, highPriorityCount: 2, pendingSamplesCount: 1, kendraName: 'Udaipur Pashu Seva Kendra' },
    { villageId: 'VIL-BHARAMPUR', name: 'Bharampur Village', code: 'BHP-02', liveCasesCount: 5, highPriorityCount: 1, pendingSamplesCount: 0, kendraName: 'Bharampur Seva Kendra' },
    { villageId: 'VIL-NAWADA', name: 'Nawada Village', code: 'NWD-03', liveCasesCount: 4, highPriorityCount: 2, pendingSamplesCount: 2, kendraName: 'Nawada Pashu Kendra' },
    { villageId: 'VIL-KALKAMATA', name: 'Kalka Mata Village', code: 'KLK-04', liveCasesCount: 2, highPriorityCount: 0, pendingSamplesCount: 0, kendraName: 'Kalka Mata Seva Kendra' },
    { villageId: 'VIL-RAMPUR', name: 'Rampur Village', code: 'RMP-05', liveCasesCount: 3, highPriorityCount: 1, pendingSamplesCount: 1, kendraName: 'Rampur Animal Care Kendra' },
    { villageId: 'VIL-SUKHER', name: 'Sukher Village', code: 'SKH-06', liveCasesCount: 1, highPriorityCount: 0, pendingSamplesCount: 0, kendraName: 'Sukher Seva Kendra' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8">
      {/* Top Header */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Veterinarian Administration</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">My Assigned Villages</h1>
          <p className="mt-1 text-sm text-slate-500">Monitor biosecurity and live case trends across your 6 assigned village clusters.</p>
        </div>
      </div>

      {/* Navigation Sub-header */}
      <VeterinarianHeaderNav />

      {/* Villages Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {assignedVillages.map((village) => {
          // Dynamic calculation based on state cases if matching village name exists
          const vCases = cases.filter((c) => (c.location?.village || '').toLowerCase().includes(village.name.split(' ')[0].toLowerCase()));
          const liveCount = vCases.length > 0 ? vCases.filter((c) => c.status !== 'RESOLVED').length : village.liveCasesCount;
          const highCount = vCases.length > 0 ? vCases.filter((c) => c.riskLevel === 'RED' || c.aiPriority === 'HIGH').length : village.highPriorityCount;
          const pendingSampleCount = samples.filter((s) => {
            const relatedCase = cases.find((c) => c.caseId === s.caseId);
            return relatedCase && (relatedCase.location?.village || '').toLowerCase().includes(village.name.split(' ')[0].toLowerCase());
          }).length || village.pendingSamplesCount;

          return (
            <Card
              key={village.villageId}
              onClick={() => navigate(`/veterinarian/villages/${village.villageId}`)}
              className="group cursor-pointer border-slate-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-blue-400"
            >
              <CardHeader className="pb-3 border-b border-slate-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-base group-hover:text-blue-600 transition-colors">{village.name}</CardTitle>
                      <CardDescription className="text-xs">ID: {village.code || village.villageId}</CardDescription>
                    </div>
                  </div>
                  {highCount > 0 ? (
                    <Badge variant="danger" size="sm">{highCount} High Priority</Badge>
                  ) : (
                    <Badge variant="success" size="sm">Stable</Badge>
                  )}
                </div>
              </CardHeader>

              <div className="p-5 space-y-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-slate-50 p-2.5">
                    <div className="flex items-center justify-center gap-1 text-slate-500 mb-1">
                      <HeartPulse className="h-3.5 w-3.5 text-blue-600" />
                      <span className="text-[10px] font-bold uppercase">Cases</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900">{liveCount}</p>
                  </div>

                  <div className="rounded-lg bg-red-50/60 p-2.5">
                    <div className="flex items-center justify-center gap-1 text-red-600 mb-1">
                      <ShieldAlert className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-bold uppercase">Urgent</span>
                    </div>
                    <p className="text-lg font-bold text-red-700">{highCount}</p>
                  </div>

                  <div className="rounded-lg bg-indigo-50/60 p-2.5">
                    <div className="flex items-center justify-center gap-1 text-indigo-600 mb-1">
                      <FlaskConical className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-bold uppercase">Samples</span>
                    </div>
                    <p className="text-lg font-bold text-indigo-700">{pendingSampleCount}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {village.kendraName || 'Pashu Seva Kendra'}
                  </span>
                  <span className="font-semibold text-blue-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Overview <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
