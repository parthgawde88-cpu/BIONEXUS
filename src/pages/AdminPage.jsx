import React from 'react';
import { ShieldAlert } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card';

export default function AdminPage() {
  return (
    <div className="max-w-4xl mx-auto py-6">
      <Card className="border-slate-200 bg-gradient-to-br from-white to-slate-50/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <CardTitle>Admin Portal</CardTitle>
              <CardDescription>System administration and oversight workspace</CardDescription>
            </div>
          </div>
        </CardHeader>

        <div className="space-y-4 text-slate-700">
          <p className="text-base leading-relaxed">
            This placeholder is for the Administrator role in BIONEXUS.
          </p>
          <p className="text-sm leading-relaxed text-slate-600">
            The full system dashboard, monitoring, and governance tools will be developed in the next stage.
          </p>
        </div>
      </Card>
    </div>
  );
}
