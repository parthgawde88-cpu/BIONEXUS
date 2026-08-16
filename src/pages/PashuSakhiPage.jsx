import React from 'react';
import { UserCircle2 } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card';

export default function PashuSakhiPage() {
  return (
    <div className="max-w-4xl mx-auto py-6">
      <Card className="border-teal-200 bg-gradient-to-br from-white to-teal-50/40">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <UserCircle2 className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <CardTitle>Pashu Sakhi Portal</CardTitle>
              <CardDescription>Community field health and outreach workspace</CardDescription>
            </div>
          </div>
        </CardHeader>

        <div className="space-y-4 text-slate-700">
          <p className="text-base leading-relaxed">
            This section is reserved for the Pashu Sakhi role.
          </p>
          <p className="text-sm leading-relaxed text-slate-600">
            The complete dashboard for field coordination, community health tasks, and reporting
            workflows will be developed in the next stage.
          </p>
        </div>
      </Card>
    </div>
  );
}
