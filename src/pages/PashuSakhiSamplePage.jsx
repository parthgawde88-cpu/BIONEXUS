import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, MapPin, PackageCheck, QrCode } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Alert from '../components/ui/Alert';
import { Input, Textarea } from '../components/ui/FormField';
import SampleChainTimeline from '../components/SampleChainTimeline';
import { useBionexus } from '../context';
import { formatDateTime, getCaseSubject } from '../utils/casePresentation';
import { samplePriorityVariant, sampleTypeLabel } from '../utils/samplePresentation';

export default function PashuSakhiSamplePage() {
  const { sampleId } = useParams();
  const { samples, cases, farmers, animals, flocks, veterinarians, collectSample } = useBionexus();
  const sample = samples.find((item) => item.sampleId === sampleId);
  const caseItem = cases.find((item) => item.caseId === sample?.caseId);
  const farmer = farmers.find((item) => item.farmerId === sample?.farmerId || item.farmerId === caseItem?.farmerId);
  const subject = caseItem ? getCaseSubject(caseItem, animals, flocks) : null;
  const [confirmed, setConfirmed] = useState(false);
  const [notes, setNotes] = useState('');
  const [location, setLocation] = useState('Udaipur field visit');
  const [collectedAt, setCollectedAt] = useState(new Date().toISOString().slice(0, 16));
  const [message, setMessage] = useState('');
  if (!sample) return <div className="mx-auto max-w-3xl py-10"><Alert variant="danger" title="Sample not found">The sample request is not in the current mock state.</Alert></div>;
  const collect = (event) => { event.preventDefault(); if (!confirmed) return; const result = collectSample(sample.sampleId, { collectedBy: 'USR-002', collectedAt: new Date(collectedAt).toISOString(), collectionLocation: { village: location }, collectionNotes: notes }); if (result) setMessage('Sample Collected'); };
  const collected = sample.status === 'COLLECTED' || sample.history?.some((item) => item.status === 'COLLECTED');
  return <div className="mx-auto max-w-6xl py-6 sm:py-8"><div className="mb-6 flex items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Seva Sakhi sample task</p><h1 className="mt-1 text-2xl font-bold text-slate-900">{sample.sampleId}</h1><p className="mt-2 text-sm text-slate-500">Collect only after a veterinarian request.</p></div><Link to="/pashu-sakhi" className="inline-flex items-center gap-2 text-sm text-slate-600"><ArrowLeft className="h-4 w-4" />Dashboard</Link></div>{message && <Alert className="mb-6" variant="success" title={message}>The sample now has a unique ID and QR-linked record.</Alert>}<div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]"><Card><CardHeader><div><CardTitle>Pending sample collection</CardTitle><CardDescription>Case {sample.caseId} · requested by {veterinarians.find((item) => item.id === sample.veterinarianId)?.name || 'Veterinarian'}</CardDescription></div><Badge variant={samplePriorityVariant(sample.priority)}>{sample.priority}</Badge></CardHeader><div className="grid gap-3 sm:grid-cols-2">{[['Farmer', farmer?.name], ['Village', farmer?.address], ['Animal/Flock', subject?.id], ['Species / breed', `${subject?.details?.species || ''} / ${subject?.details?.breed || ''}`], ['Sample type', sampleTypeLabel(sample.sampleType)], ['Requested time', formatDateTime(sample.requestedAt)]].map(([label, value]) => <div key={label} className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-sm font-semibold text-slate-800">{value || 'Not recorded'}</p></div>)}</div><div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-800">Veterinarian instructions</p><p className="mt-2 text-sm text-slate-700">{sample.collectionInstructions || 'Follow standard collection and labeling procedure.'}</p></div>{!collected ? <form onSubmit={collect} className="mt-6 space-y-4"><label className="flex items-start gap-2 text-sm text-slate-700"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600" />I confirm the sample was collected according to the veterinarian instructions.</label><Textarea label="Collection notes" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Record collection observations" /><Input label="Collection date/time" type="datetime-local" value={collectedAt} onChange={(event) => setCollectedAt(event.target.value)} /><Input label="Location" value={location} onChange={(event) => setLocation(event.target.value)} prefix={<MapPin className="h-4 w-4" />} /><Button type="submit" disabled={!confirmed} icon={PackageCheck}>Sample Collected</Button></form> : <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"><CheckCircle2 className="mr-2 inline h-5 w-5" />Collected {formatDateTime(sample.collectedAt)}. Ready for Kendra receipt.</div>}</Card><div className="space-y-6"><Card><CardHeader><div><CardTitle>Sample identity</CardTitle><CardDescription>Non-sensitive QR reference</CardDescription></div><QrCode className="h-5 w-5 text-teal-600" /></CardHeader><div className="rounded-xl border-2 border-dashed border-teal-300 bg-teal-50 p-6 text-center"><QrCode className="mx-auto h-24 w-24 text-teal-700" /><p className="mt-3 text-xs text-slate-500">QR Linked</p><p className="mt-1 text-xl font-bold text-slate-900">{sample.sampleId}</p><p className="mt-2 text-xs text-slate-500">Payload identifies the sample record only.</p></div></Card><Card><CardHeader><CardTitle>Chain of custody</CardTitle></CardHeader><SampleChainTimeline sample={sample} /></Card></div></div></div>;
}
