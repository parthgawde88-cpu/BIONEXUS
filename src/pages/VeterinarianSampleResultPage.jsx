import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, FileCheck2, Stethoscope } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Alert from '../components/ui/Alert';
import Badge from '../components/ui/Badge';
import { Textarea } from '../components/ui/FormField';
import SampleChainTimeline from '../components/SampleChainTimeline';
import { useBionexus } from '../context';
import { formatDateTime } from '../utils/casePresentation';
import { sampleTypeLabel } from '../utils/samplePresentation';

export default function VeterinarianSampleResultPage() {
  const { sampleId } = useParams();
  const { samples, cases, reviewSampleResult } = useBionexus();
  const sample = samples.find((item) => item.sampleId === sampleId);
  const caseItem = cases.find((item) => item.caseId === sample?.caseId);
  const [interpretation, setInterpretation] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [message, setMessage] = useState('');
  if (!sample) return <div className="mx-auto max-w-3xl py-10"><Alert variant="danger" title="Sample not found">The sample is not available.</Alert></div>;
  const review = (event) => { event.preventDefault(); const updated = reviewSampleResult(sample.sampleId, { reviewedBy: 'USR-003', clinicalInterpretation: interpretation, nextAction }); if (updated) setMessage('Result reviewed. The veterinarian remains the final clinical decision-maker.'); };
  return <div className="mx-auto max-w-5xl py-6 sm:py-8"><div className="mb-6 flex items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Veterinarian result review</p><h1 className="mt-1 text-2xl font-bold text-slate-900">{sample.sampleId}</h1><p className="mt-2 text-sm text-slate-500">Case {sample.caseId} · test result is operational evidence, not an automated diagnosis.</p></div><Link to={`/veterinarian/cases/${sample.caseId}`} className="inline-flex items-center gap-2 text-sm text-slate-600"><ArrowLeft className="h-4 w-4" />Related case</Link></div>{message && <Alert className="mb-6" variant="success" title="Result reviewed">{message}</Alert>}<div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]"><Card><CardHeader><div><CardTitle>Pending sample result</CardTitle><CardDescription>Review the complete collection record before deciding next action.</CardDescription></div><Badge variant={sample.status === 'REVIEWED' ? 'success' : 'warning'}>{sample.status}</Badge></CardHeader><div className="grid gap-3 sm:grid-cols-2">{[['Sample ID', sample.sampleId], ['Sample type', sampleTypeLabel(sample.sampleType)], ['Collection details', `${formatDateTime(sample.collectedAt)} · ${sample.collectionLocation?.village || 'Location not recorded'}`], ['Result', sample.result], ['Test method', sample.testMethod], ['Test date', sample.testDate], ['Remarks', sample.resultRemarks || 'No remarks']].map(([label, value]) => <div key={label} className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-sm font-semibold text-slate-800">{value || 'Not available'}</p></div>)}</div><form onSubmit={review} className="mt-6 space-y-4"><Textarea label="Clinical interpretation" value={interpretation} onChange={(event) => setInterpretation(event.target.value)} placeholder="Interpret the result clinically." required /><Textarea label="Next action" value={nextAction} onChange={(event) => setNextAction(event.target.value)} placeholder="Record the veterinarian-led next action." required /><Button type="submit" disabled={sample.status === 'REVIEWED'} icon={FileCheck2}>{sample.status === 'REVIEWED' ? 'Result Reviewed' : 'Review Result'}</Button></form></Card><div className="space-y-6"><Card className="border-blue-200"><CardHeader><div><CardTitle>Clinical control</CardTitle><CardDescription>Veterinarian decision boundary</CardDescription></div><Stethoscope className="h-5 w-5 text-blue-600" /></CardHeader><Alert variant="info">The test result does not diagnose or prescribe automatically. The veterinarian makes the final clinical decision.</Alert><p className="mt-4 text-sm text-slate-600"><CheckCircle2 className="mr-2 inline h-4 w-4 text-blue-600" />Related case: {caseItem?.caseId}</p></Card><Card><CardHeader><CardTitle>Chain of custody</CardTitle></CardHeader><SampleChainTimeline sample={sample} /></Card></div></div></div>;
}
