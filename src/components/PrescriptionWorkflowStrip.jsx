import React from 'react';
import { PRESCRIPTION_STATUS } from '../domain';

const steps = [
  { id: 'VET', label: '👨‍⚕️ VET' },
  { id: 'PRESCRIPTION', label: '💊 PRESCRIPTION' },
  { id: 'OTP', label: '🔐 OTP' },
  { id: 'SAKHI', label: '👩‍🌾 SEVA SAKHI' },
  { id: 'VERIFY', label: '📱 MEDICINE VERIFICATION' },
  { id: 'KENDRA', label: '🏪 KENDRA' },
  { id: 'DISPENSED', label: '💊 DISPENSED' },
  { id: 'INVENTORY', label: '📦 INVENTORY UPDATED' },
];

const activeIndexFor = (status, medicineVerified) => {
  if (status === PRESCRIPTION_STATUS.DISPENSED) return 7;
  if (status === PRESCRIPTION_STATUS.VERIFIED && medicineVerified) return 5;
  if (status === PRESCRIPTION_STATUS.VERIFIED) return 4;
  if (status === PRESCRIPTION_STATUS.OTP_PENDING) return 2;
  if (status === PRESCRIPTION_STATUS.CREATED) return 1;
  return 0;
};

export default function PrescriptionWorkflowStrip({ status, medicineVerified = false }) {
  const active = activeIndexFor(status, medicineVerified);
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-semibold leading-5">
      {steps.map((step, index) => (
        <div key={step.id} className={index <= active ? 'text-emerald-700' : 'text-slate-400'}>
          <span>{step.label}</span>
          {index < steps.length - 1 && <div className="pl-2 text-slate-300">↓</div>}
        </div>
      ))}
    </div>
  );
}
