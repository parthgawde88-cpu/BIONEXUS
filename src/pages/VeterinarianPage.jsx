import React from 'react';
import { Stethoscope } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card';

export default function VeterinarianPage() {
  return (
    <div className="max-w-4xl mx-auto py-6">
      <Card className="border-blue-200 bg-gradient-to-br from-white to-blue-50/40">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Stethoscope className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <CardTitle>Veterinarian Portal</CardTitle>
              <CardDescription>Clinical advisory and tele-consultation workspace</CardDescription>
            </div>
          </div>
        </CardHeader>

        <div className="space-y-4 text-slate-700">
          <p className="text-base leading-relaxed">
            This role placeholder is for the Veterinarian portal in BIONEXUS.
          </p>
          <p className="text-sm leading-relaxed text-slate-600">
            The full dashboard and clinical operations experience will be developed in the next stage.
          </p>
        </div>
      </Card>
    </div>
  );
}
