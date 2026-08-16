import React from 'react';
import { Building2 } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card';

export default function KendraPage() {
  return (
    <div className="max-w-4xl mx-auto py-6">
      <Card className="border-amber-200 bg-gradient-to-br from-white to-amber-50/40">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Building2 className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <CardTitle>Pashu Seva Kendra Portal</CardTitle>
              <CardDescription>Service center coordination and field operations</CardDescription>
            </div>
          </div>
        </CardHeader>

        <div className="space-y-4 text-slate-700">
          <p className="text-base leading-relaxed">
            This placeholder is for the Pashu Seva Kendra role in the BIONEXUS platform.
          </p>
          <p className="text-sm leading-relaxed text-slate-600">
            The full service center dashboard and management workflow will be developed in the next stage.
          </p>
        </div>
      </Card>
    </div>
  );
}
