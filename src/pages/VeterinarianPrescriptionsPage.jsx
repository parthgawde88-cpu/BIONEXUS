import React from 'react';
import { Link } from 'react-router-dom';
import { FileCheck2, ShieldCheck, Clock3, Pill, Eye, KeyRound } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { useBionexus } from '../context';
import { formatDateTime } from '../utils/casePresentation';
import VeterinarianHeaderNav from '../components/VeterinarianHeaderNav';

export default function VeterinarianPrescriptionsPage() {
  const { prescriptions, cases, farmers, otps, medicines } = useBionexus();

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Prescription Management</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl flex items-center gap-3">
            <FileCheck2 className="h-7 w-7 text-blue-600" />
            Issued Prescriptions & OTP Verifications
          </h1>
          <p className="mt-1 text-sm text-slate-500">Monitor veterinarian-created treatment & preventive prescriptions, OTP security, and Kendra dispensing status.</p>
        </div>
      </div>

      {/* Sub navigation */}
      <VeterinarianHeaderNav />

      {/* Summary Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="border-slate-200 bg-white p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Issued Prescriptions</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{prescriptions.length}</p>
        </Card>

        <Card className="border-amber-200 bg-amber-50/50 p-4">
          <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">OTP Pending Verification</p>
          <p className="mt-2 text-3xl font-bold text-amber-700">
            {prescriptions.filter((p) => p.status === 'OTP_PENDING' || p.status === 'CREATED').length}
          </p>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50/50 p-4">
          <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Verified & Dispensed</p>
          <p className="mt-2 text-3xl font-bold text-emerald-700">
            {prescriptions.filter((p) => p.status === 'VERIFIED' || p.status === 'DISPENSED').length}
          </p>
        </Card>
      </div>

      {/* Prescriptions Table */}
      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <div>
            <CardTitle>Prescription Registry</CardTitle>
            <CardDescription>Veterinarian-authorized prescriptions generated for farmers</CardDescription>
          </div>
        </CardHeader>

        {prescriptions.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <Pill className="mx-auto h-10 w-10 text-slate-300 mb-2" />
            <p className="font-semibold text-slate-700">No prescriptions created yet.</p>
            <p className="text-xs text-slate-500 mt-1">Open a case with GREEN, YELLOW, or RED assessment to generate a treatment plan.</p>
            <Link to="/veterinarian/cases" className="mt-4 inline-block">
              <Button size="sm">Go to Case Queue</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Prescription ID</th>
                  <th className="py-3 px-4 font-semibold">Case & Farmer</th>
                  <th className="py-3 px-4 font-semibold">Prescription Breakdown</th>
                  <th className="py-3 px-4 font-semibold">Medicine</th>
                  <th className="py-3 px-4 font-semibold">OTP State</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {prescriptions.map((p) => {
                  const farmer = farmers.find((f) => f.farmerId === p.farmerId);
                  const medicine = medicines.find((m) => m.medicineId === p.medicineId);
                  const otpRecord = otps.find((o) => o.prescriptionId === p.prescriptionId);

                  return (
                    <tr key={p.prescriptionId} className="align-middle hover:bg-slate-50/50">
                      <td className="py-3.5 px-4 font-bold text-blue-700">{p.prescriptionId}</td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-900">{farmer?.name || p.farmerId}</p>
                        <p className="text-xs text-slate-500">Case: {p.caseId}</p>
                      </td>
                      <td className="py-3.5 px-4 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-800">
                          <span className="font-semibold">Infected Count:</span> {p.treatmentQuantity || 1}
                        </div>
                        <div className="flex items-center gap-1.5 text-indigo-700">
                          <span className="font-semibold">Preventive Qty:</span> {p.preventiveQuantity || 0}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-medium text-slate-700">
                        {medicine?.name || p.medicineId}
                      </td>
                      <td className="py-3.5 px-4">
                        {otpRecord ? (
                          <div className="flex items-center gap-1 text-xs text-slate-700">
                            <KeyRound className="h-3.5 w-3.5 text-amber-600" />
                            <span>OTP Issued ({otpRecord.code || '******'})</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">N/A</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            p.status === 'DISPENSED'
                              ? 'success'
                              : p.status === 'VERIFIED'
                              ? 'info'
                              : p.status === 'OTP_PENDING'
                              ? 'warning'
                              : 'neutral'
                          }
                          size="sm"
                        >
                          {p.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link to={`/veterinarian/cases/${p.caseId}`}>
                          <Button variant="ghost" size="sm" icon={Eye}>Open Case</Button>
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
