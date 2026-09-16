import React, { useMemo, useState } from 'react';
import { AlertTriangle, ArrowLeft, Camera, CheckCircle2, ClipboardList, FileText, MapPin, Mic, Send, ShieldAlert, Stethoscope } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Alert from '../components/ui/Alert';
import { Input, Select, Textarea } from '../components/ui/FormField';
import { useBionexus } from '../context';
import { RISK_LEVELS, SAMPLE_STATUS } from '../domain';
import { formatCaseStatus, formatDateTime, getCaseSubject, riskVariant, statusVariant } from '../utils/casePresentation';

const riskOptions = [
  { value: RISK_LEVELS.LOW, label: 'LOW', detail: 'Treatment / Preventive action', selectedClass: 'border-emerald-500 bg-emerald-50' },
  { value: RISK_LEVELS.YELLOW, label: 'YELLOW', detail: 'Diagnostic sample collection', selectedClass: 'border-amber-500 bg-amber-50' },
  { value: RISK_LEVELS.RED, label: 'RED', detail: 'Urgent field visit / Emergency response', selectedClass: 'border-red-500 bg-red-50' },
];

export default function VeterinarianCaseDetailPage() {
  const { caseId } = useParams();
  const { cases, farmers, animals, flocks, veterinarians, assessments, medicines, samples, recordVeterinarianDecision, createPrescription, requestSample, createEmergencyTask } = useBionexus();
  const caseItem = cases.find((item) => item.caseId === caseId);
  const veterinarian = veterinarians[0];
  const farmer = farmers.find((item) => item.farmerId === caseItem?.farmerId);
  const subject = caseItem ? getCaseSubject(caseItem, animals, flocks) : null;
  const previousCases = cases.filter((item) => item.farmerId === caseItem?.farmerId && item.caseId !== caseId);
  const latestAssessment = [...assessments].reverse().find((item) => item.caseId === caseId);
  const [riskLevel, setRiskLevel] = useState('');
  const [assessment, setAssessment] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [medicineId, setMedicineId] = useState(medicines[0]?.medicineId || '');
  const [dosage, setDosage] = useState('');
  const [duration, setDuration] = useState('');
  const [instructions, setInstructions] = useState('');
  const [affectedCount, setAffectedCount] = useState('1');
  const [preventiveCount, setPreventiveCount] = useState('0');
  const [preventiveQuantity, setPreventiveQuantity] = useState('0');
  const [sampleType, setSampleType] = useState('BLOOD');
  const [collectionInstructions, setCollectionInstructions] = useState('Collect a clean sample and label it with the case ID.');
  const [priority, setPriority] = useState('HIGH');
  const [actionMessage, setActionMessage] = useState('');

  const selectedRisk = useMemo(() => riskOptions.find((item) => item.value === riskLevel), [riskLevel]);
  if (!caseItem) return <div className="mx-auto max-w-3xl py-10"><Alert variant="danger" title="Case not found">This case is not available in the current mock state.</Alert><Link to="/veterinarian/cases" className="mt-4 inline-flex"><Button variant="secondary">Return to queue</Button></Link></div>;

  const submitAssessment = (event) => {
    event.preventDefault();
    if (!riskLevel || !assessment.trim() || !confirmed) return;
    recordVeterinarianDecision({ caseId, veterinarianId: veterinarian.id, assessment, riskLevel, clinicalNotes, actionType: selectedRisk.detail });
    setActionMessage(`${riskLevel} decision recorded. ${selectedRisk.detail} is now required.`);
  };

  const submitTreatmentPlan = () => {
    createPrescription({ caseId, veterinarianId: veterinarian.id, farmerId: caseItem.farmerId, status: 'READY_FOR_VERIFICATION', items: [{ type: 'TREATMENT', medicineId, eligibleAnimalIds: caseItem.animalId ? [caseItem.animalId] : [], eligibleFlockIds: caseItem.flockId ? [caseItem.flockId] : [], quantity: Number(affectedCount), instructions: `${dosage}; ${duration}; ${instructions}` }, ...(Number(preventiveCount) > 0 ? [{ type: 'PREVENTIVE_ACTION', eligibleAnimalIds: caseItem.animalId ? [caseItem.animalId] : [], eligibleFlockIds: caseItem.flockId ? [caseItem.flockId] : [], quantity: Number(preventiveQuantity), instructions: 'Veterinarian-defined eligible population' }] : [])] });
    setActionMessage('Treatment plan created for the veterinarian-defined eligible population.');
  };

  const submitSampleRequest = () => {
    requestSample({ caseId, farmerId: caseItem.farmerId, animalId: caseItem.animalId, flockId: caseItem.flockId, veterinarianId: veterinarian.id, sampleType, status: SAMPLE_STATUS.REQUESTED, collectionInstructions, priority, requestedBy: veterinarian.id });
    setActionMessage('Diagnostic sample request created for Seva Sakhi collection.');
  };

  const submitEmergencyTask = () => {
    createEmergencyTask({ caseId, createdBy: veterinarian.id, farmerId: caseItem.farmerId, farmer: farmer?.name, mobile: farmer?.mobile, village: caseItem.location?.village || farmer?.address, location: caseItem.location, subject: subject.id, symptoms: caseItem.symptoms });
    setActionMessage('Urgent field response task created.');
  };

  return <div className="mx-auto max-w-7xl py-6 sm:py-8"><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Veterinarian case review</p><div className="mt-1 flex flex-wrap items-center gap-2"><h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{caseId}</h1><Badge variant={statusVariant(caseItem.status)}>{formatCaseStatus(caseItem.status)}</Badge><Badge variant={riskVariant(caseItem.riskLevel)}>{caseItem.riskLevel || 'PENDING VET ASSESSMENT'}</Badge></div><p className="mt-2 text-sm text-slate-500">Final clinical decision belongs to the veterinarian.</p></div><Link to="/veterinarian/cases" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"><ArrowLeft className="h-4 w-4" />Case queue</Link></div>{actionMessage && <Alert className="mb-6" variant="success" onDismiss={() => setActionMessage('')}><strong>{actionMessage}</strong></Alert>}

    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.35fr_0.9fr]"><Card><CardHeader><div><CardTitle>Patient / livestock</CardTitle><CardDescription>Registered identity and history</CardDescription></div><Stethoscope className="h-5 w-5 text-blue-600" /></CardHeader><div className="space-y-3 text-sm">{[['Farmer', farmer?.name], ['Mobile', farmer?.mobile], ['Village', caseItem.location?.village || farmer?.address], ['Animal/Flock', subject.id], ['Species', subject.details?.species], ['Breed', subject.details?.breed], ['Age', subject.details?.age], ['Vaccination', subject.details?.vaccinationStatus]].map(([label, value]) => <div key={label} className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 font-semibold text-slate-800">{value || 'Not recorded'}</p></div>)}</div><div className="mt-5 border-t border-slate-200 pt-4"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Previous cases</p><p className="mt-2 text-sm text-slate-600">{previousCases.length ? previousCases.map((item) => item.caseId).join(', ') : 'No previous cases in mock history.'}</p></div></Card>

      <Card><CardHeader><div><CardTitle>Evidence</CardTitle><CardDescription>Submitted by {farmer?.name || caseItem.submittedBy}</CardDescription></div><ClipboardList className="h-5 w-5 text-blue-600" /></CardHeader><div className="rounded-xl bg-slate-900 p-4 text-white"><div className="flex aspect-video items-center justify-center rounded-lg border border-slate-700 bg-slate-800">{caseItem.photo ? <div className="text-center"><Camera className="mx-auto h-9 w-9 text-emerald-400" /><p className="mt-2 text-sm">Photo preview placeholder</p></div> : <div className="text-center text-slate-400"><Camera className="mx-auto h-9 w-9" /><p className="mt-2 text-sm">No photo attached</p></div>}</div></div><div className="mt-4 space-y-3 text-sm"><div className="rounded-lg border border-slate-200 p-3"><p className="font-semibold text-slate-800">Symptoms</p><p className="mt-1 text-slate-600">{caseItem.symptoms?.join(', ') || 'No text symptoms provided'}</p></div><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-lg border border-slate-200 p-3"><p className="font-semibold text-slate-800"><MapPin className="mr-1 inline h-4 w-4 text-blue-600" />Location</p><p className="mt-1 text-xs text-slate-600">{caseItem.location?.village || farmer?.address}<br />Lat {caseItem.location?.latitude || 'Not recorded'}, Long {caseItem.location?.longitude || 'Not recorded'}</p></div><div className="rounded-lg border border-slate-200 p-3"><p className="font-semibold text-slate-800"><Mic className="mr-1 inline h-4 w-4 text-blue-600" />Voice note</p><p className="mt-1 text-xs text-slate-600">{caseItem.voiceNote ? 'Playback placeholder available' : 'No voice note attached'}</p></div></div><p className="text-xs text-slate-500">Submitted {formatDateTime(caseItem.submittedAt)}</p></div></Card>

      <Card className="border-violet-200"><CardHeader><div><CardTitle>AI-ASSISTED INFORMATION</CardTitle><CardDescription>Advisory support only. No autonomous diagnosis.</CardDescription></div><ShieldAlert className="h-5 w-5 text-violet-600" /></CardHeader><Alert variant="info">AI-assisted. Veterinarian makes the final clinical decision.</Alert><div className="mt-4 space-y-3 text-sm">{[['Image quality', 'Acceptable (mock validation)'], ['Visual indicators', 'Placeholder: visual model not connected'], ['Speech transcript', 'Placeholder: transcription not connected'], ['Translated symptoms', 'Placeholder: translation not connected'], ['Duplicate image flag', 'Not flagged (mock result)'], ['Risk-support information', 'No automated risk recommendation']].map(([label, value]) => <div key={label} className="rounded-lg bg-violet-50 p-3"><p className="text-xs font-semibold text-violet-800">{label}</p><p className="mt-1 text-slate-700">{value}</p></div>)}</div><p className="mt-4 text-xs font-semibold text-violet-800">AI-assisted. Veterinarian makes the final clinical decision.</p></Card></div>

    <Card className="mt-6"><CardHeader><div><CardTitle>Veterinarian Assessment</CardTitle><CardDescription>Choose one explicit clinical risk level and required action.</CardDescription></div><AlertTriangle className="h-5 w-5 text-amber-600" /></CardHeader><form onSubmit={submitAssessment}><div className="grid gap-3 md:grid-cols-3">{riskOptions.map((option) => <button key={option.value} type="button" onClick={() => setRiskLevel(option.value)} className={['rounded-xl border-2 p-4 text-left', riskLevel === option.value ? `border-${option.color}-500 bg-${option.color}-50` : 'border-slate-200'].join(' ')}><div className="flex items-center justify-between"><span className="font-bold text-slate-900">{option.label}</span>{riskLevel === option.value && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}</div><p className="mt-2 text-xs text-slate-600">{option.detail}</p></button>)}</div><div className="mt-5 grid gap-4 md:grid-cols-2"><Textarea label="Clinical assessment" required rows={3} value={assessment} onChange={(event) => setAssessment(event.target.value)} placeholder="Describe the clinical assessment." /><Textarea label="Clinical notes" rows={3} value={clinicalNotes} onChange={(event) => setClinicalNotes(event.target.value)} placeholder="Record relevant notes and observations." /></div><label className="mt-4 flex items-start gap-2 text-sm text-slate-700"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600" />I confirm this is my veterinarian decision and not an automated AI diagnosis.</label><Button className="mt-5" type="submit" disabled={!riskLevel || !assessment.trim() || !confirmed} icon={Send}>Confirm Veterinarian Decision</Button></form></Card>

    {caseItem.riskLevel === RISK_LEVELS.LOW && <Card className="mt-6 border-emerald-200"><CardHeader><div><CardTitle>Create Treatment Plan</CardTitle><CardDescription>Treatment and prevention populations are defined separately.</CardDescription></div><FileText className="h-5 w-5 text-emerald-600" /></CardHeader><div className="grid gap-4 md:grid-cols-2"><Select label="Medicine" value={medicineId} onChange={(event) => setMedicineId(event.target.value)}>{medicines.map((item) => <option key={item.medicineId} value={item.medicineId}>{item.name}</option>)}</Select><Input label="Dosage" value={dosage} onChange={(event) => setDosage(event.target.value)} placeholder="e.g. 10 ml twice daily" /><Input label="Duration" value={duration} onChange={(event) => setDuration(event.target.value)} placeholder="e.g. 5 days" /><Input label="Treatment quantity (affected)" type="number" min="1" value={affectedCount} onChange={(event) => setAffectedCount(event.target.value)} /><Input label="Preventive eligible population" type="number" min="0" value={preventiveCount} onChange={(event) => setPreventiveCount(event.target.value)} /><Input label="Preventive quantity" type="number" min="0" value={preventiveQuantity} onChange={(event) => setPreventiveQuantity(event.target.value)} hint="Set only after defining eligible animals/flocks." /></div><Textarea className="mt-4" label="Instructions" value={instructions} onChange={(event) => setInstructions(event.target.value)} placeholder="Administration and follow-up instructions" /><Alert className="mt-4" variant="info">Do not prescribe for an entire herd or flock automatically. Affected animals and preventive eligible animals must be veterinarian-defined.</Alert><Button className="mt-4" onClick={submitTreatmentPlan}>Create Treatment Plan</Button></Card>}

    {caseItem.riskLevel === RISK_LEVELS.YELLOW && <Card className="mt-6 border-amber-200"><CardHeader><div><CardTitle>YELLOW - DIAGNOSTIC SAMPLE REQUIRED</CardTitle><CardDescription>Create a request for Seva Sakhi collection.</CardDescription></div><ClipboardList className="h-5 w-5 text-amber-600" /></CardHeader><div className="grid gap-4 md:grid-cols-3"><Select label="Sample type" value={sampleType} onChange={(event) => setSampleType(event.target.value)}><option value="BLOOD">Blood</option><option value="SWAB">Swab</option><option value="TISSUE">Tissue</option><option value="FECAL">Fecal</option><option value="OTHER">Other</option></Select><Select label="Collection priority" value={priority} onChange={(event) => setPriority(event.target.value)}><option value="ROUTINE">Routine</option><option value="PRIORITY">Priority</option><option value="URGENT">Urgent</option></Select><Input label="Current sample status" value={samples.find((item) => item.caseId === caseId)?.status || 'Not requested'} readOnly /></div><Textarea className="mt-4" label="Collection instructions" value={collectionInstructions} onChange={(event) => setCollectionInstructions(event.target.value)} /><Textarea className="mt-4" label="Veterinarian notes" value={clinicalNotes} onChange={(event) => setClinicalNotes(event.target.value)} /><Button className="mt-4" onClick={submitSampleRequest}>Request Sample Collection</Button></Card>}

    {caseItem.riskLevel === RISK_LEVELS.RED && <Card className="mt-6 border-red-200"><CardHeader><div><CardTitle className="text-red-700">URGENT FIELD RESPONSE</CardTitle><CardDescription>Emergency task details for immediate coordination.</CardDescription></div><ShieldAlert className="h-5 w-5 text-red-600" /></CardHeader><div className="grid gap-3 sm:grid-cols-2">{[['Farmer', farmer?.name], ['Mobile', farmer?.mobile], ['Village', caseItem.location?.village || farmer?.address], ['Location', `${caseItem.location?.latitude || 'N/A'}, ${caseItem.location?.longitude || 'N/A'}`], ['Animal/Flock', subject.id], ['Symptoms', caseItem.symptoms?.join(', ') || 'Not recorded']].map(([label, value]) => <div key={label} className="rounded-lg bg-red-50 p-3"><p className="text-xs text-red-700">{label}</p><p className="mt-1 text-sm font-semibold text-slate-800">{value}</p></div>)}</div><Button className="mt-5 bg-red-600 hover:bg-red-700" onClick={submitEmergencyTask}>Create Urgent Field-Visit Task</Button></Card>}

    {latestAssessment && <Alert className="mt-6" variant="success" title="Latest veterinarian assessment">{latestAssessment.riskLevel} - {latestAssessment.actionType}. Recorded {formatDateTime(latestAssessment.createdAt)}.</Alert>}
  </div>;
}
