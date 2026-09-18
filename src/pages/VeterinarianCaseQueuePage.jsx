import React, { useState } from 'react';
import { ArrowLeft, Camera, ClipboardList, Clock3, Eye, MapPin, Search, Filter, ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { Input, Select } from '../components/ui/FormField';
import { useBionexus } from '../context';
import { formatCaseStatus, formatDateTime, getCaseSubject, riskVariant, statusVariant } from '../utils/casePresentation';
import VeterinarianHeaderNav from '../components/VeterinarianHeaderNav';

export default function VeterinarianCaseQueuePage() {
  const { cases, farmers, animals, flocks, villages } = useBionexus();
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [villageFilter, setVillageFilter] = useState('ALL');

  const filteredCases = cases.filter((c) => {
    const priorityMatch = priorityFilter === 'ALL' || c.aiPriority === priorityFilter || c.riskLevel === priorityFilter;
    const villageMatch = villageFilter === 'ALL' || (c.location?.village || '').toLowerCase().includes(villageFilter.toLowerCase());
    return priorityMatch && villageMatch;
  });

  const highPriorityList = filteredCases.filter((c) => c.aiPriority === 'HIGH' || c.riskLevel === 'RED' || c.riskLevel === 'HIGH');
  const mediumPriorityList = filteredCases.filter((c) => c.aiPriority === 'MEDIUM' || c.riskLevel === 'YELLOW');
  const lowPriorityList = filteredCases.filter((c) => c.aiPriority === 'LOW' || c.riskLevel === 'LOW' || (!c.aiPriority && !c.riskLevel));

  return (
    <div className="mx-auto max-w-7xl py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Veterinarian Caseload</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl flex items-center gap-3">
            <ClipboardList className="h-7 w-7 text-blue-600" />
            Priority Case Queue
          </h1>
          <p className="mt-1 text-sm text-slate-500">AI-assisted priority sorting. Clinical decision remains with the veterinarian.</p>
        </div>
      </div>

      {/* Sub Navigation */}
      <VeterinarianHeaderNav />

      {/* Filters Bar */}
      <Card className="mb-6 border-slate-200 bg-white p-4">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <Select label="Filter by AI Priority" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="ALL">All Priorities</option>
            <option value="HIGH">High Priority (Urgent)</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </Select>

          <Select label="Filter by Village" value={villageFilter} onChange={(e) => setVillageFilter(e.target.value)}>
            <option value="ALL">All Villages</option>
            {(villages || []).map((v) => (
              <option key={v.villageId} value={v.name}>{v.name}</option>
            ))}
          </Select>

          <div className="flex items-end">
            <div className="rounded-lg bg-blue-50 p-2.5 text-xs text-blue-800 border border-blue-200 w-full flex items-center justify-between">
              <span>Showing <strong>{filteredCases.length}</strong> active queue cases</span>
              <Badge variant="info">{highPriorityList.length} High Priority</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Priority Sections */}
      <div className="space-y-6">
        {/* High Priority Group */}
        <Card className="border-red-200 bg-white">
          <CardHeader className="bg-red-50/50 border-b border-red-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-red-600" />
                <CardTitle className="text-red-900">HIGH PRIORITY CASES ({highPriorityList.length})</CardTitle>
              </div>
              <Badge variant="danger">Immediate Clinical Review</Badge>
            </div>
          </CardHeader>

          <div className="p-4 space-y-3">
            {highPriorityList.length === 0 ? (
              <p className="text-xs text-slate-500 py-2">No high priority cases in current queue filter.</p>
            ) : (
              highPriorityList.map((item) => {
                const farmer = farmers.find((f) => f.farmerId === item.farmerId);
                const subject = getCaseSubject(item, animals, flocks);

                return (
                  <div key={item.caseId} className="rounded-xl border border-red-200 bg-red-50/10 p-4 shadow-card hover:border-red-400 transition-colors">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                      <div className="flex h-16 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
                        <Camera className="h-5 w-5" />
                        <span className="ml-1 text-[10px]">{item.photo ? 'PHOTO' : 'NO PHOTO'}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-bold text-slate-900 text-base">{item.caseId}</p>
                          <Badge variant="danger">AI: HIGH PRIORITY</Badge>
                          <Badge variant={statusVariant(item.status)}>{formatCaseStatus(item.status)}</Badge>
                          <Badge variant={riskVariant(item.riskLevel)}>{item.riskLevel || 'PENDING VET DECISION'}</Badge>
                        </div>
                        <div className="mt-2 grid gap-2 text-xs text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
                          <span><strong>Farmer:</strong> {farmer?.name || item.farmerId}</span>
                          <span><MapPin className="mr-1 inline h-3.5 w-3.5 text-blue-600" />{item.location?.village || farmer?.address || 'Village pending'}</span>
                          <span><strong>Subject:</strong> {subject.id} ({subject.label})</span>
                          <span><Clock3 className="mr-1 inline h-3.5 w-3.5 text-slate-400" />{formatDateTime(item.submittedAt)}</span>
                        </div>
                        <p className="mt-2 text-xs font-medium text-red-800">
                          <strong>Reported Symptoms:</strong> {item.symptoms?.join(', ') || 'No symptoms text'}
                        </p>
                      </div>
                      <Link to={`/veterinarian/cases/${item.caseId}`}>
                        <Button variant="danger" icon={Eye} iconPosition="left">Open Case</Button>
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Medium Priority Group */}
        <Card className="border-amber-200 bg-white">
          <CardHeader className="bg-amber-50/50 border-b border-amber-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-amber-900">MEDIUM PRIORITY CASES ({mediumPriorityList.length})</CardTitle>
              </div>
              <Badge variant="warning">Standard Consultation</Badge>
            </div>
          </CardHeader>

          <div className="p-4 space-y-3">
            {mediumPriorityList.length === 0 ? (
              <p className="text-xs text-slate-500 py-2">No medium priority cases in current queue filter.</p>
            ) : (
              mediumPriorityList.map((item) => {
                const farmer = farmers.find((f) => f.farmerId === item.farmerId);
                const subject = getCaseSubject(item, animals, flocks);

                return (
                  <div key={item.caseId} className="rounded-xl border border-amber-200 bg-white p-4 shadow-card hover:border-amber-400 transition-colors">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                      <div className="flex h-16 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
                        <Camera className="h-5 w-5" />
                        <span className="ml-1 text-[10px]">{item.photo ? 'PHOTO' : 'NO PHOTO'}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-bold text-slate-900 text-base">{item.caseId}</p>
                          <Badge variant="warning">AI: MEDIUM</Badge>
                          <Badge variant={statusVariant(item.status)}>{formatCaseStatus(item.status)}</Badge>
                          <Badge variant={riskVariant(item.riskLevel)}>{item.riskLevel || 'PENDING VET DECISION'}</Badge>
                        </div>
                        <div className="mt-2 grid gap-2 text-xs text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
                          <span><strong>Farmer:</strong> {farmer?.name || item.farmerId}</span>
                          <span><MapPin className="mr-1 inline h-3.5 w-3.5 text-blue-600" />{item.location?.village || farmer?.address || 'Village pending'}</span>
                          <span><strong>Subject:</strong> {subject.id} ({subject.label})</span>
                          <span><Clock3 className="mr-1 inline h-3.5 w-3.5 text-slate-400" />{formatDateTime(item.submittedAt)}</span>
                        </div>
                        <p className="mt-2 text-xs text-slate-700">
                          <strong>Symptoms:</strong> {item.symptoms?.join(', ') || 'Reported'}
                        </p>
                      </div>
                      <Link to={`/veterinarian/cases/${item.caseId}`}>
                        <Button variant="outline" icon={Eye} iconPosition="left">Open Case</Button>
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Low Priority Group */}
        <Card className="border-emerald-200 bg-white">
          <CardHeader className="bg-emerald-50/50 border-b border-emerald-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <CardTitle className="text-emerald-900">LOW PRIORITY CASES ({lowPriorityList.length})</CardTitle>
              </div>
              <Badge variant="success">Routine Follow-up</Badge>
            </div>
          </CardHeader>

          <div className="p-4 space-y-3">
            {lowPriorityList.length === 0 ? (
              <p className="text-xs text-slate-500 py-2">No low priority cases in current queue filter.</p>
            ) : (
              lowPriorityList.map((item) => {
                const farmer = farmers.find((f) => f.farmerId === item.farmerId);
                const subject = getCaseSubject(item, animals, flocks);

                return (
                  <div key={item.caseId} className="rounded-xl border border-emerald-200 bg-white p-4 shadow-card hover:border-emerald-400 transition-colors">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                      <div className="flex h-16 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
                        <Camera className="h-5 w-5" />
                        <span className="ml-1 text-[10px]">{item.photo ? 'PHOTO' : 'NO PHOTO'}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-bold text-slate-900 text-base">{item.caseId}</p>
                          <Badge variant="success">AI: LOW</Badge>
                          <Badge variant={statusVariant(item.status)}>{formatCaseStatus(item.status)}</Badge>
                          <Badge variant={riskVariant(item.riskLevel)}>{item.riskLevel || 'PENDING VET DECISION'}</Badge>
                        </div>
                        <div className="mt-2 grid gap-2 text-xs text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
                          <span><strong>Farmer:</strong> {farmer?.name || item.farmerId}</span>
                          <span><MapPin className="mr-1 inline h-3.5 w-3.5 text-blue-600" />{item.location?.village || farmer?.address || 'Village pending'}</span>
                          <span><strong>Subject:</strong> {subject.id} ({subject.label})</span>
                          <span><Clock3 className="mr-1 inline h-3.5 w-3.5 text-slate-400" />{formatDateTime(item.submittedAt)}</span>
                        </div>
                        <p className="mt-2 text-xs text-slate-600">
                          <strong>Symptoms:</strong> {item.symptoms?.join(', ') || 'Minor issue / Routine'}
                        </p>
                      </div>
                      <Link to={`/veterinarian/cases/${item.caseId}`}>
                        <Button variant="ghost" icon={Eye} iconPosition="left">Open Case</Button>
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
