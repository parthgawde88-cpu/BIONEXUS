import React, { useMemo, useState } from 'react';
import { ArrowLeft, Camera, CheckCircle2, Clock3, MapPin, Mic, RotateCcw, Send, ShieldCheck, Square, Wheat } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Alert from '../components/ui/Alert';
import { useBionexus } from '../context';
import { CASE_STATUS } from '../domain';
import { formatDateTime } from '../utils/casePresentation';

const steps = ['Select livestock', 'Capture evidence', 'Validate image', 'Review & submit'];
const mockLocation = { village: 'Udaipur, Rajasthan', latitude: '24.5854', longitude: '73.7125' };

function StepHeader({ currentStep }) {
  return <div className="mb-6 grid grid-cols-4 gap-2">{steps.map((step, index) => <div key={step} className="flex items-center gap-2"><span className={["flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold", index <= currentStep ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'].join(' ')}>{index + 1}</span><span className={['hidden text-xs font-medium sm:block', index === currentStep ? 'text-emerald-700' : 'text-slate-500'].join(' ')}>{step}</span></div>)}</div>;
}

export default function FarmerCaseReportPage() {
  const navigate = useNavigate();
  const { farmers, animals, flocks, submitCase } = useBionexus();
  const farmer = farmers[0];
  const [step, setStep] = useState(0);
  const [livestockType, setLivestockType] = useState('animal');
  const [selectedId, setSelectedId] = useState(animals[0]?.rapidId || '');
  const [symptoms, setSymptoms] = useState('');
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [voiceRecorded, setVoiceRecorded] = useState(false);
  const [submittedCase, setSubmittedCase] = useState(null);

  const selected = useMemo(() => livestockType === 'animal' ? animals.find((item) => item.rapidId === selectedId) : flocks.find((item) => item.flockId === selectedId), [animals, flocks, livestockType, selectedId]);

  const selectType = (type) => {
    setLivestockType(type);
    setSelectedId(type === 'animal' ? animals[0]?.rapidId || '' : flocks[0]?.flockId || '');
  };

  const handleSubmit = () => {
    const item = submitCase({
      farmerId: farmer.farmerId,
      animalId: livestockType === 'animal' ? selectedId : undefined,
      flockId: livestockType === 'flock' ? selectedId : undefined,
      submittedBy: farmer.userId,
      symptoms: symptoms.split(',').map((item) => item.trim()).filter(Boolean),
      voiceNote: voiceRecorded ? 'mock://voice-note' : null,
      photo: photoCaptured ? 'mock://camera-capture' : null,
      location: mockLocation,
      status: CASE_STATUS.SUBMITTED,
      riskLevel: null,
    });
    setSubmittedCase(item);
  };

  if (submittedCase) return <div className="mx-auto max-w-3xl py-8"><Alert variant="success" title="Case submitted successfully"><p>Waiting for Veterinarian Review.</p></Alert><Card className="mt-6"><div className="flex items-start gap-4"><div className="rounded-xl bg-emerald-100 p-3 text-emerald-700"><CheckCircle2 className="h-7 w-7" /></div><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Health case</p><h1 className="mt-1 text-2xl font-bold text-slate-900">{submittedCase.caseId}</h1><p className="mt-2 text-sm text-slate-600">Your report is now in the veterinarian queue.</p></div></div><div className="mt-6 grid gap-3 sm:grid-cols-2">{[['Animal/Flock', selectedId], ['Submitted time', formatDateTime(submittedCase.submittedAt)], ['Village', farmer.address], ['Current status', 'Waiting for Veterinarian Review']].map(([label, value]) => <div key={label} className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 font-semibold text-slate-800">{value}</p></div>)}</div><div className="mt-6 flex flex-wrap gap-3"><Button onClick={() => navigate('/farmer/cases')} icon={ArrowLeft} iconPosition="left" variant="secondary">View Case History</Button><Button onClick={() => setSubmittedCase(null)} variant="outline">Report another issue</Button></div></Card></div>;

  return <div className="mx-auto max-w-4xl py-6 sm:py-8"><div className="mb-6 flex items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Farmer health report</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Report a health issue</h1><p className="mt-2 text-sm text-slate-500">Share evidence with the veterinarian. Clinical decisions remain with the veterinarian.</p></div><Link to="/farmer" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"><ArrowLeft className="h-4 w-4" />Dashboard</Link></div><StepHeader currentStep={step} />

    {step === 0 && <Card><CardHeader><div><CardTitle>Step 1: Select livestock</CardTitle><CardDescription>Use a Rapid ID for large livestock or a Flock ID for poultry.</CardDescription></div><Wheat className="h-5 w-5 text-emerald-600" /></CardHeader><div className="grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => selectType('animal')} className={['rounded-xl border p-4 text-left', livestockType === 'animal' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'].join(' ')}><p className="font-semibold text-slate-900">Individual livestock</p><p className="mt-1 text-xs text-slate-500">Cattle, buffalo, goat and other individually tracked animals.</p></button><button type="button" onClick={() => selectType('flock')} className={['rounded-xl border p-4 text-left', livestockType === 'flock' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'].join(' ')}><p className="font-semibold text-slate-900">Poultry flock</p><p className="mt-1 text-xs text-slate-500">Track the flock as a group. No individual bird IDs are created.</p></button></div><label className="mt-5 block text-sm font-medium text-slate-700">{livestockType === 'animal' ? 'Rapid ID' : 'Flock ID'}<select value={selectedId} onChange={(event) => setSelectedId(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm">{(livestockType === 'animal' ? animals : flocks).map((item) => <option key={livestockType === 'animal' ? item.rapidId : item.flockId} value={livestockType === 'animal' ? item.rapidId : item.flockId}>{livestockType === 'animal' ? item.rapidId : item.flockId}</option>)}</select></label>{selected && <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">Selected summary</p><div className="mt-3 grid gap-3 sm:grid-cols-3">{Object.entries(livestockType === 'animal' ? { ID: selected.rapidId, Species: selected.species, Breed: selected.breed, Age: selected.age, Sex: selected.sex } : { ID: selected.flockId, Species: selected.species, Breed: selected.breed, Count: selected.count, Age: selected.age }).map(([label, value]) => <div key={label}><p className="text-xs text-slate-500">{label}</p><p className="font-semibold text-slate-800">{value}</p></div>)}</div></div>}<div className="mt-6 flex justify-end"><Button onClick={() => setStep(1)}>Continue</Button></div></Card>}

    {step === 1 && <Card><CardHeader><div><CardTitle>Step 2: Capture health evidence</CardTitle><CardDescription>Camera-first capture with optional voice and text symptoms.</CardDescription></div><Camera className="h-5 w-5 text-emerald-600" /></CardHeader><div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-900 p-6 text-center text-white"><div className="mx-auto flex aspect-video max-w-xl items-center justify-center rounded-lg border border-slate-600 bg-slate-800">{photoCaptured ? <div><CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400" /><p className="mt-2 text-sm">Mock camera photo captured</p></div> : <div><Camera className="mx-auto h-10 w-10 text-slate-400" /><p className="mt-2 text-sm text-slate-300">Camera preview</p></div>}</div><div className="mt-4 flex justify-center gap-3"><Button onClick={() => setPhotoCaptured(true)} icon={Camera}>{photoCaptured ? 'Retake' : 'Take Photo'}</Button>{photoCaptured && <Button onClick={() => setPhotoCaptured(false)} variant="secondary" icon={RotateCcw}>Retake</Button>}</div></div><div className="mt-6 grid gap-5 md:grid-cols-2"><div><label className="block text-sm font-medium text-slate-700">Text symptoms<textarea value={symptoms} onChange={(event) => setSymptoms(event.target.value)} rows="5" placeholder="Example: reduced appetite, swelling, coughing" className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm" /></label></div><div><p className="text-sm font-medium text-slate-700">Voice note</p><div className="mt-1.5 rounded-lg border border-slate-200 bg-slate-50 p-4"><p className="text-sm text-slate-600">{voiceRecorded ? 'Playback placeholder: voice note recorded' : 'Record a short explanation for the veterinarian.'}</p><div className="mt-4 flex gap-2"><Button size="sm" onClick={() => setVoiceRecorded(!voiceRecorded)} icon={voiceRecorded ? Square : Mic}>{voiceRecorded ? 'Stop Recording' : 'Record Voice'}</Button>{voiceRecorded && <Button size="sm" variant="ghost">Play</Button>}</div></div><div className="mt-4 rounded-lg border border-slate-200 p-3 text-sm"><div className="flex items-center gap-2 text-slate-700"><MapPin className="h-4 w-4 text-emerald-600" />Current location placeholder</div><p className="mt-2 text-xs text-slate-500">{mockLocation.village} · Lat {mockLocation.latitude}, Long {mockLocation.longitude}</p><p className="mt-2 text-xs text-slate-500"><Clock3 className="mr-1 inline h-3.5 w-3.5" />{formatDateTime(new Date().toISOString())}</p></div></div></div><div className="mt-6 flex justify-between"><Button variant="ghost" onClick={() => setStep(0)}>Back</Button><Button onClick={() => setStep(2)} disabled={!photoCaptured}>Continue</Button></div></Card>}

    {step === 2 && <Card><CardHeader><div><CardTitle>Step 3: Image quality check</CardTitle><CardDescription>Mock validation confirms the captured evidence is ready for review.</CardDescription></div><ShieldCheck className="h-5 w-5 text-emerald-600" /></CardHeader><div className="space-y-3">{['Image received', 'Brightness acceptable', 'Focus acceptable', 'Animal clearly visible'].map((item) => <div key={item} className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"><CheckCircle2 className="h-5 w-5" />{item}</div>)}</div><Alert className="mt-5" variant="info" title="AI/Image validation will be connected later.">This is a mock quality result. It is not a diagnosis and YOLO is not running.</Alert><div className="mt-6 flex justify-between"><Button variant="ghost" onClick={() => setStep(1)}>Back</Button><Button onClick={() => setStep(3)}>Continue</Button></div></Card>}

    {step === 3 && <Card><CardHeader><div><CardTitle>Step 4: Review and submit</CardTitle><CardDescription>Check the report before sending it to the veterinarian.</CardDescription></div><Send className="h-5 w-5 text-emerald-600" /></CardHeader><div className="grid gap-3 sm:grid-cols-2">{[['Farmer', farmer.name], ['Village', farmer.address], ['Animal/Flock', selectedId], ['Photo', photoCaptured ? 'Captured' : 'Not captured'], ['Symptoms', symptoms || 'Not provided'], ['Voice note', voiceRecorded ? 'Recorded' : 'Not recorded'], ['Location', `${mockLocation.latitude}, ${mockLocation.longitude}`], ['Date/time', formatDateTime(new Date().toISOString())]].map(([label, value]) => <div key={label} className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-sm font-semibold text-slate-800">{value}</p></div>)}</div><div className="mt-6 flex justify-between"><Button variant="ghost" onClick={() => setStep(2)}>Back</Button><Button onClick={handleSubmit} icon={Send}>Submit Health Case</Button></div></Card>}
  </div>;
}
