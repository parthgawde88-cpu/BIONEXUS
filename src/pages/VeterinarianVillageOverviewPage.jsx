import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Building2, Eye, ShieldAlert, AlertTriangle, CheckCircle2, MapPin, Sliders, HeartPulse } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import DiseaseRiskMap from '../components/DiseaseRiskMap';
import { useBionexus } from '../context';
import { formatCaseStatus, formatDateTime, getCaseSubject, riskVariant, statusVariant } from '../utils/casePresentation';
import VeterinarianHeaderNav from '../components/VeterinarianHeaderNav';

export default function VeterinarianVillageOverviewPage() {
  const { villageId } = useParams();
  const { villages, cases, farmers, animals, flocks, alerts, riskZones } = useBionexus();
  const [configuredRadius, setConfiguredRadius] = useState(5);

  const village = (villages || []).find((v) => v.villageId === villageId || v.code === villageId) || {
    villageId: villageId || 'VIL-UDAIPUR',
    name: 'Udaipur Village Cluster',
    code: 'UDP-01',
    kendraName: 'Udaipur Pashu Seva Kendra',
  };

  // Filter cases belonging to this village
  const villageCases = cases.filter((c) => {
    const vName = village.name.split(' ')[0].toLowerCase();
    const locVillage = (c.location?.village || '').toLowerCase();
    return locVillage.includes(vName) || c.farmerId === 'FR-4821';
  });

  // Group cases by AI Priority
  const highPriorityCases = villageCases.filter((c) => c.aiPriority === 'HIGH' || c.riskLevel === 'RED' || c.riskLevel === 'HIGH');
  const mediumPriorityCases = villageCases.filter((c) => c.aiPriority === 'MEDIUM' || c.riskLevel === 'YELLOW');
  const lowPriorityCases = villageCases.filter((c) => c.aiPriority === 'LOW' || c.riskLevel === 'LOW' || (!c.aiPriority && !c.riskLevel));

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8">
      {/* Back button & Title */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
            <Link to="/veterinarian/villages" className="hover:underline flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> My Villages
            </Link>
            <span>/</span>
            <span>Village Overview</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl flex items-center gap-3">
            <Building2 className="h-7 w-7 text-blue-600" />
            {village.name}
          </h1>
          <p className="mt-1 text-sm text-slate-500">Live surveillance cases and geographic disease risk mapping for this village.</p>
        </div>

        <Link to="/veterinarian/villages">
          <Button variant="outline" icon={ArrowLeft} iconPosition="left">Back to Villages</Button>
        </Link>
      </div>

      {/* Header Navigation */}
      <VeterinarianHeaderNav />

      {/* SECTION A: LIVE CASES BY AI PRIORITY */}
      <div className="mb-10 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <HeartPulse className="h-6 w-6 text-blue-600" />
              Section A: Live Cases (AI-Assisted Priority)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              AI provides priority sorting assistance. The veterinarian remains the sole clinical decision-maker.
            </p>
          </div>
          <Badge variant="info" size="md">{villageCases.length} Active Village Cases</Badge>
        </div>

        {/* HIGH PRIORITY CASES */}
        <Card className="border-red-200 bg-red-50/20">
          <CardHeader className="bg-red-50/60 border-b border-red-100 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-red-600" />
                <CardTitle className="text-red-900 text-base">HIGH PRIORITY CASES</CardTitle>
              </div>
              <Badge variant="danger" size="sm">{highPriorityCases.length} Urgent Review Needed</Badge>
            </div>
          </CardHeader>
          <div className="p-4 space-y-3">
            {highPriorityCases.length === 0 ? (
              <p className="text-xs text-slate-500 py-2">No high priority cases currently in this village.</p>
            ) : (
              highPriorityCases.map((item) => {
                const farmer = farmers.find((f) => f.farmerId === item.farmerId);
                const subject = getCaseSubject(item, animals, flocks);
                return (
                  <div key={item.caseId} className="flex flex-col gap-3 rounded-xl border border-red-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between hover:border-red-400 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-base">{item.caseId}</span>
                        <Badge variant="danger">HIGH PRIORITY</Badge>
                        <Badge variant={statusVariant(item.status)}>{formatCaseStatus(item.status)}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-slate-600">
                        <strong>Farmer:</strong> {farmer?.name || item.farmerId} · <strong>Subject:</strong> {subject.id} ({subject.label})
                      </p>
                      <p className="mt-1 text-xs text-red-700 font-medium">
                        <strong>Reported Symptoms:</strong> {item.symptoms?.join(', ') || 'High priority flags present'}
                      </p>
                    </div>
                    <Link to={`/veterinarian/cases/${item.caseId}`}>
                      <Button variant="danger" size="sm" icon={Eye}>Review Case</Button>
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* MEDIUM PRIORITY CASES */}
        <Card className="border-amber-200 bg-amber-50/20">
          <CardHeader className="bg-amber-50/60 border-b border-amber-100 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-amber-900 text-base">MEDIUM PRIORITY CASES</CardTitle>
              </div>
              <Badge variant="warning" size="sm">{mediumPriorityCases.length} Pending Review</Badge>
            </div>
          </CardHeader>
          <div className="p-4 space-y-3">
            {mediumPriorityCases.length === 0 ? (
              <p className="text-xs text-slate-500 py-2">No medium priority cases currently in this village.</p>
            ) : (
              mediumPriorityCases.map((item) => {
                const farmer = farmers.find((f) => f.farmerId === item.farmerId);
                const subject = getCaseSubject(item, animals, flocks);
                return (
                  <div key={item.caseId} className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between hover:border-amber-400 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-base">{item.caseId}</span>
                        <Badge variant="warning">MEDIUM PRIORITY</Badge>
                        <Badge variant={statusVariant(item.status)}>{formatCaseStatus(item.status)}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-slate-600">
                        <strong>Farmer:</strong> {farmer?.name || item.farmerId} · <strong>Subject:</strong> {subject.id} ({subject.label})
                      </p>
                      <p className="mt-1 text-xs text-amber-800">
                        <strong>Symptoms:</strong> {item.symptoms?.join(', ') || 'Mild symptoms'}
                      </p>
                    </div>
                    <Link to={`/veterinarian/cases/${item.caseId}`}>
                      <Button variant="outline" size="sm" icon={Eye}>Open Case</Button>
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* LOW PRIORITY CASES */}
        <Card className="border-emerald-200 bg-emerald-50/20">
          <CardHeader className="bg-emerald-50/60 border-b border-emerald-100 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <CardTitle className="text-emerald-900 text-base">LOW PRIORITY CASES</CardTitle>
              </div>
              <Badge variant="success" size="sm">{lowPriorityCases.length} Standard Follow-up</Badge>
            </div>
          </CardHeader>
          <div className="p-4 space-y-3">
            {lowPriorityCases.length === 0 ? (
              <p className="text-xs text-slate-500 py-2">No low priority cases currently in this village.</p>
            ) : (
              lowPriorityCases.map((item) => {
                const farmer = farmers.find((f) => f.farmerId === item.farmerId);
                const subject = getCaseSubject(item, animals, flocks);
                return (
                  <div key={item.caseId} className="flex flex-col gap-3 rounded-xl border border-emerald-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between hover:border-emerald-400 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-base">{item.caseId}</span>
                        <Badge variant="success">LOW PRIORITY</Badge>
                        <Badge variant={statusVariant(item.status)}>{formatCaseStatus(item.status)}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-slate-600">
                        <strong>Farmer:</strong> {farmer?.name || item.farmerId} · <strong>Subject:</strong> {subject.id} ({subject.label})
                      </p>
                      <p className="mt-1 text-xs text-slate-600">
                        <strong>Symptoms:</strong> {item.symptoms?.join(', ') || 'Routine check / Minor issue'}
                      </p>
                    </div>
                    <Link to={`/veterinarian/cases/${item.caseId}`}>
                      <Button variant="ghost" size="sm" icon={Eye}>View Details</Button>
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>

      {/* SECTION B: DISEASE RISK / HEAT MAP */}
      <div className="mt-10 space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="h-6 w-6 text-red-600" />
              Section B: Disease Risk & Geographic Surveillance Map
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Visual biosecurity risk map with configurable radius controls and detailed zone breakdown.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm">
            <Sliders className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-semibold text-slate-700">Surveillance Radius:</span>
            <select
              value={configuredRadius}
              onChange={(e) => setConfiguredRadius(Number(e.target.value))}
              className="rounded border border-slate-300 bg-white text-xs font-bold text-blue-700 px-2 py-1"
            >
              <option value={3}>3 km Radius</option>
              <option value={5}>5 km Radius</option>
              <option value={8}>8 km Radius</option>
              <option value={10}>10 km Radius</option>
            </select>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Map Viewer */}
          <Card className="border-slate-200 bg-white p-2">
            <DiseaseRiskMap alerts={alerts} riskZones={riskZones} radiusKm={configuredRadius} />
          </Card>

          {/* Explanation Panel */}
          <div className="space-y-4">
            <Card className="border-red-200 bg-red-50/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-red-800 font-bold text-sm">
                    <span className="h-3 w-3 rounded-full bg-red-600 animate-pulse" />
                    RED RISK ZONE
                  </div>
                  <Badge variant="danger" size="sm">Active Outbreak</Badge>
                </div>
              </CardHeader>
              <div className="p-4 pt-0 space-y-2 text-xs text-red-900">
                <p><strong>Reason:</strong> Increased reported cases associated with Foot & Mouth Disease / High Pyrexia Signal.</p>
                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-red-200">
                  <div className="rounded bg-white p-2 border border-red-200">
                    <span className="text-slate-500 text-[10px]">Active Cases</span>
                    <p className="text-base font-bold text-red-700">{highPriorityCases.length + 5}</p>
                  </div>
                  <div className="rounded bg-white p-2 border border-red-200">
                    <span className="text-slate-500 text-[10px]">Affected Animals</span>
                    <p className="text-base font-bold text-red-700">24 Animals</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-amber-200 bg-amber-50/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                    <span className="h-3 w-3 rounded-full bg-amber-500" />
                    YELLOW RISK ZONE
                  </div>
                  <Badge variant="warning" size="sm">Elevated Risk</Badge>
                </div>
              </CardHeader>
              <div className="p-4 pt-0 space-y-2 text-xs text-amber-900">
                <p><strong>Reason:</strong> Suspected cases reported & ongoing sample diagnostic testing for mastitis and respiratory illness.</p>
                <p className="mt-1 text-slate-700">Recommended action: Sakhi field sample collection & strict milking hygiene.</p>
              </div>
            </Card>

            <Card className="border-emerald-200 bg-emerald-50/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <span className="h-3 w-3 rounded-full bg-emerald-500" />
                    GREEN AREA
                  </div>
                  <Badge variant="success" size="sm">Clear</Badge>
                </div>
              </CardHeader>
              <div className="p-4 pt-0 space-y-2 text-xs text-emerald-900">
                <p><strong>Reason:</strong> No significant active disease signals reported within {configuredRadius} km radius of buffer area.</p>
                <p className="mt-1 text-slate-700">Routine preventive vaccination remains active.</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
