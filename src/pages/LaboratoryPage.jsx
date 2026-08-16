import React from 'react';
import { FlaskConical } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card';

export default function LaboratoryPage() {
  return (
    <div className="max-w-4xl mx-auto py-6">
      <Card className="border-violet-200 bg-gradient-to-br from-white to-violet-50/40">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center">
              <FlaskConical className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <CardTitle>Laboratory Portal</CardTitle>
              <CardDescription>Diagnostics, test data, and reporting workspace</CardDescription>
            </div>
          </div>
        </CardHeader>

        <div className="space-y-4 text-slate-700">
          <p className="text-base leading-relaxed">
            This placeholder represents the Laboratory role within BIONEXUS.
          </p>
          <p className="text-sm leading-relaxed text-slate-600">
            The complete laboratory dashboard, reporting workflows, and sample tracking features will be
            developed in the next stage.
          </p>
        </div>
      </Card>
    </div>
  );
}
