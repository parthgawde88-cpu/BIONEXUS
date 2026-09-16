import React from 'react';
import { CheckCircle2, Circle, MapPin } from 'lucide-react';
import Badge from './ui/Badge';
import { SAMPLE_STATUS } from '../domain';
import { formatDateTime } from '../utils/casePresentation';

const stages = [
  [SAMPLE_STATUS.REQUESTED, 'Requested', 'VETERINARIAN'],
  [SAMPLE_STATUS.COLLECTED, 'Collected', 'SEVA SAKHI'],
  [SAMPLE_STATUS.RECEIVED_AT_KENDRA, 'Received at Kendra', 'KENDRA'],
  [SAMPLE_STATUS.STORED, 'Stored', 'KENDRA'],
  [SAMPLE_STATUS.PICKED_UP, 'Picked up', 'KENDRA'],
  [SAMPLE_STATUS.TESTING, 'Testing', 'KENDRA'],
  [SAMPLE_STATUS.RESULT_AVAILABLE, 'Result available', 'KENDRA'],
  [SAMPLE_STATUS.REVIEWED, 'Vet reviewed', 'VETERINARIAN'],
];

export default function SampleChainTimeline({ sample }) {
  const currentIndex = stages.findIndex(([status]) => status === sample.status);
  return <div className="space-y-0">{stages.map(([status, label, role], index) => { const event = sample.history?.find((item) => item.status === status); const complete = index <= currentIndex; return <div key={status} className="flex gap-3"><div className="flex flex-col items-center"><div className={["flex h-8 w-8 items-center justify-center rounded-full border-2", complete ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-200 bg-white text-slate-300'].join(' ')}>{complete ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}</div>{index < stages.length - 1 && <div className={['h-12 w-px', index < currentIndex ? 'bg-emerald-300' : 'bg-slate-200'].join(' ')} />}</div><div className="min-w-0 flex-1 pb-5"><div className="flex flex-wrap items-center gap-2"><p className={['text-sm font-semibold', complete ? 'text-slate-800' : 'text-slate-400'].join(' ')}>{label}</p><Badge size="sm" variant={complete ? 'success' : 'neutral'}>{complete ? status : 'PENDING'}</Badge></div><p className="mt-1 text-xs text-slate-500">Responsible: {role}</p>{event && <p className="mt-1 text-xs text-slate-500">{formatDateTime(event.timestamp)}{event.location?.village ? ` · ${event.location.village}` : ''}</p>}</div></div>; })}</div>;
}
