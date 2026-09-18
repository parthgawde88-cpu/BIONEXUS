import React, { useState } from 'react';
import { PackageCheck, AlertTriangle, Building2, Send, CheckCircle2, ShieldAlert, RefreshCw } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { Input, Select } from '../components/ui/FormField';
import { useBionexus } from '../context';
import VeterinarianHeaderNav from '../components/VeterinarianHeaderNav';

export default function VeterinarianKendraInventoryPage() {
  const { inventory, medicines, villages, requestStockRefill, stockRefillRequests } = useBionexus();
  const [selectedKendra, setSelectedKendra] = useState('KEN-UDAIPUR');
  const [refillModalItem, setRefillModalItem] = useState(null);
  const [refillQuantity, setRefillQuantity] = useState('50');
  const [actionMessage, setActionMessage] = useState('');

  const kendraOptions = (villages || []).map((v) => ({
    id: v.kendraId || `KEN-${v.villageId}`,
    name: `${v.kendraName || v.name + ' Kendra'} (${v.name})`,
  }));

  const handleSendRefillRequest = (e) => {
    e.preventDefault();
    if (!refillModalItem || !refillQuantity) return;

    requestStockRefill({
      kendraId: selectedKendra,
      medicineId: refillModalItem.medicineId,
      medicineName: refillModalItem.name,
      quantity: Number(refillQuantity),
      requestedBy: 'Dr. Parth Gawde',
    });

    setActionMessage(`Stock refill request for ${refillQuantity} units of ${refillModalItem.name} submitted to Admin workflow.`);
    setRefillModalItem(null);
    setRefillQuantity('50');
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Medicine Stock Surveillance</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl flex items-center gap-3">
            <PackageCheck className="h-7 w-7 text-teal-600" />
            Pashu Seva Kendra Inventory & Refill Demands
          </h1>
          <p className="mt-1 text-sm text-slate-500">Monitor local Kendra medicine availability before issuing prescriptions and trigger government stock refill requests.</p>
        </div>
      </div>

      {/* Sub navigation */}
      <VeterinarianHeaderNav />

      {actionMessage && (
        <Alert className="mb-6" variant="success" onDismiss={() => setActionMessage('')}>
          <strong>{actionMessage}</strong>
        </Alert>
      )}

      {/* Kendra Selector */}
      <Card className="mb-6 border-teal-200 bg-teal-50/30 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Building2 className="h-6 w-6 text-teal-700" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-teal-800">Select Seva Kendra Location</p>
              <p className="text-xs text-slate-600">View inventory levels for the Kendra supplying your patient's village</p>
            </div>
          </div>

          <div className="min-w-[280px]">
            <Select
              value={selectedKendra}
              onChange={(e) => setSelectedKendra(e.target.value)}
              className="bg-white font-semibold text-slate-800 border-teal-300"
            >
              {kendraOptions.length > 0 ? (
                kendraOptions.map((k) => (
                  <option key={k.id} value={k.id}>{k.name}</option>
                ))
              ) : (
                <option value="KEN-UDAIPUR">Udaipur Pashu Seva Kendra</option>
              )}
            </Select>
          </div>
        </div>
      </Card>

      {/* Inventory Table */}
      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <div>
            <CardTitle>Medicine Stock Availability</CardTitle>
            <CardDescription>Available quantities, batch info, and stock health status</CardDescription>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Medicine Name</th>
                <th className="py-3 px-4 font-semibold">Batch No.</th>
                <th className="py-3 px-4 font-semibold">Available Qty</th>
                <th className="py-3 px-4 font-semibold">Stock Status</th>
                <th className="py-3 px-4 text-right font-semibold">Veterinarian Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {medicines.map((med) => {
                const stockItem = inventory.find((i) => i.medicineId === med.medicineId && (i.kendraId === selectedKendra || true));
                const qty = stockItem ? stockItem.availableQuantity : med.quantity;
                const status = qty === 0 ? 'OUT_OF_STOCK' : qty < 25 ? 'LOW_STOCK' : 'AVAILABLE';

                return (
                  <tr key={med.medicineId} className="align-middle hover:bg-slate-50/50">
                    <td className="py-4 px-4 font-bold text-slate-900">
                      {med.name}
                      <span className="block text-xs font-normal text-slate-500">{med.unit || 'Units'}</span>
                    </td>
                    <td className="py-4 px-4 text-xs font-mono text-slate-600">{med.batch || 'B-2026-04'}</td>
                    <td className="py-4 px-4 font-bold text-slate-800 text-base">{qty}</td>
                    <td className="py-4 px-4">
                      <Badge
                        variant={status === 'AVAILABLE' ? 'success' : status === 'LOW_STOCK' ? 'warning' : 'danger'}
                        size="sm"
                      >
                        {status === 'AVAILABLE' ? 'In Stock' : status === 'LOW_STOCK' ? 'Low Stock' : 'Out of Stock'}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {status !== 'AVAILABLE' ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={RefreshCw}
                          onClick={() => setRefillModalItem(med)}
                        >
                          REQUEST REFILL
                        </Button>
                      ) : (
                        <span className="text-xs text-slate-400">Stock Adequate</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Refill Request List */}
      <Card className="mt-8 border-slate-200 bg-white">
        <CardHeader>
          <div>
            <CardTitle>Sent Stock Refill Requests</CardTitle>
            <CardDescription>Demands submitted by veterinarian to admin / district supply chain</CardDescription>
          </div>
        </CardHeader>

        {stockRefillRequests.length === 0 ? (
          <p className="p-4 text-xs text-slate-500">No stock refill demands submitted yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {stockRefillRequests.map((req) => (
              <div key={req.requestId} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900">{req.requestId}</span>
                  <p className="text-slate-600">Medicine: {req.medicineName} ({req.quantityRequested} units requested)</p>
                </div>
                <Badge variant="warning">{req.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* REFILL MODAL */}
      {refillModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-teal-600" />
              Request Medicine Refill
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Submit an official refill request for <strong>{refillModalItem.name}</strong> to government admin supply.
            </p>

            <form onSubmit={handleSendRefillRequest} className="mt-4 space-y-4">
              <Input
                label="Required Refill Quantity"
                type="number"
                min="10"
                value={refillQuantity}
                onChange={(e) => setRefillQuantity(e.target.value)}
                required
              />

              <Alert variant="info" title="Supply Chain Note">
                The veterinarian requests stock replenishment; the government/admin logistics team executes the supply dispatch.
              </Alert>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setRefillModalItem(null)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" icon={Send}>
                  Submit Demand
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
