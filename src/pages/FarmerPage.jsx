import React from 'react';
import { Wheat } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card';

export default function FarmerPage() {
  return (
    <div className="max-w-4xl mx-auto py-6">
      <Card className="border-emerald-200 bg-gradient-to-br from-white to-emerald-50/40">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Wheat className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <CardTitle>Farmer Portal</CardTitle>
              <CardDescription>Livestock health and advisory access</CardDescription>
            </div>
          </div>
        </CardHeader>

        <div className="space-y-4 text-slate-700">
          <p className="text-base leading-relaxed">
            This portal is dedicated to the Farmer role within BIONEXUS.
          </p>
          <p className="text-sm leading-relaxed text-slate-600">
            The full dashboard experience for this role will be developed in the next stage,
            including farmer-specific workflows, alerts, and operational tools.
          </p>
        </div>
      </Card>
    </div>
  );
}
