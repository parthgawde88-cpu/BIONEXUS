import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { History, Search, Filter, Eye, MapPin, CalendarClock, ShieldAlert } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { Input, Select } from '../components/ui/FormField';
import { useBionexus } from '../context';
import { formatCaseStatus, formatDateTime, getCaseSubject, riskVariant, statusVariant } from '../utils/casePresentation';
import VeterinarianHeaderNav from '../components/VeterinarianHeaderNav';

export default function VeterinarianCaseHistoryPage() {
  const { cases, farmers, animals, flocks, villages } = useBionexus();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedRisk, setSelectedRisk] = useState('ALL');

  const filteredCases = cases.filter((c) => {
    const farmer = farmers.find((f) => f.farmerId === c.farmerId);
    const subject = getCaseSubject(c, animals, flocks);
    const textMatch =
      (c.caseId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (farmer?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.farmerId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (subject.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.symptoms || []).join(' ').toLowerCase().includes(searchQuery.toLowerCase());

    const villageMatch =
      selectedVillage === 'ALL' ||
      (c.location?.village || '').toLowerCase().includes(selectedVillage.toLowerCase());

    const statusMatch = selectedStatus === 'ALL' || c.status === selectedStatus;
    const riskMatch = selectedRisk === 'ALL' || c.riskLevel === selectedRisk;

    return textMatch && villageMatch && statusMatch && riskMatch;
  });

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Clinical Archive</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl flex items-center gap-3">
            <History className="h-7 w-7 text-blue-600" />
            Veterinary Case History & Clinical Archive
          </h1>
          <p className="mt-1 text-sm text-slate-500">Search and review past epidemiological records, diagnoses, and treatment histories across all villages.</p>
        </div>
      </div>

      {/* Sub navigation */}
      <VeterinarianHeaderNav />

      {/* Search & Filter Bar */}
      <Card className="mb-6 border-slate-200 bg-white p-4">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-1">
            <Input
              label="Search Record"
              placeholder="Search Case ID, Farmer, Animal ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
            />
          </div>

          <div>
            <Select label="Filter by Village" value={selectedVillage} onChange={(e) => setSelectedVillage(e.target.value)}>
              <option value="ALL">All Villages</option>
              {(villages || []).map((v) => (
                <option key={v.villageId} value={v.name}>{v.name}</option>
              ))}
            </Select>
          </div>

          <div>
            <Select label="Filter by Case Status" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
              <option value="ALL">All Statuses</option>
              <option value="VET_REVIEW">In Vet Review</option>
              <option value="ACTION_REQUIRED">Action Required</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </Select>
          </div>

          <div>
            <Select label="Filter by Risk Assessment" value={selectedRisk} onChange={(e) => setSelectedRisk(e.target.value)}>
              <option value="ALL">All Risk Levels</option>
              <option value="RED">RED (Urgent)</option>
              <option value="YELLOW">YELLOW (Diagnostic)</option>
              <option value="LOW">GREEN / LOW (Treatment)</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Cases Registry */}
      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Historical Clinical Cases</CardTitle>
              <CardDescription>Archive of patient consults, diagnostic results & prescriptions</CardDescription>
            </div>
            <Badge variant="neutral">{filteredCases.length} Matching Records</Badge>
          </div>
        </CardHeader>

        {filteredCases.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <History className="mx-auto h-10 w-10 text-slate-300 mb-2" />
            <p className="font-semibold text-slate-700">No matching case history records found.</p>
            <p className="text-xs text-slate-500 mt-1">Try clearing filters or changing your search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Case ID</th>
                  <th className="py-3 px-4 font-semibold">Farmer & Village</th>
                  <th className="py-3 px-4 font-semibold">Animal / Flock ID</th>
                  <th className="py-3 px-4 font-semibold">Symptoms & Original Input</th>
                  <th className="py-3 px-4 font-semibold">Risk Level</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCases.map((item) => {
                  const farmer = farmers.find((f) => f.farmerId === item.farmerId);
                  const subject = getCaseSubject(item, animals, flocks);

                  return (
                    <tr key={item.caseId} className="align-middle hover:bg-slate-50/50">
                      <td className="py-3.5 px-4 font-bold text-blue-700">{item.caseId}</td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-900">{farmer?.name || item.farmerId}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          {item.location?.village || farmer?.address || 'Village pending'}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-medium text-slate-800">
                        {subject.id} ({subject.label})
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600 max-w-[220px]">
                        <p className="font-medium text-slate-800">{item.symptoms?.join(', ') || 'No symptoms'}</p>
                        {item.originalSymptoms && (
                          <p className="text-[11px] text-slate-400 truncate italic mt-0.5">Original: "{item.originalSymptoms}"</p>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={riskVariant(item.riskLevel)} size="sm">
                          {item.riskLevel || 'PENDING'}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={statusVariant(item.status)} size="sm">
                          {formatCaseStatus(item.status)}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link to={`/veterinarian/cases/${item.caseId}`}>
                          <Button variant="ghost" size="sm" icon={Eye}>View Details</Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
