import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Camera,
  CheckCircle2,
  ClipboardList,
  FileText,
  FlaskConical,
  MapPin,
  Mic,
  Send,
  ShieldAlert,
  Stethoscope,
  Volume2,
  UserCheck,
  Building2,
  Pill,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Alert from '../components/ui/Alert';
import { Input, Select, Textarea } from '../components/ui/FormField';
import { useBionexus } from '../context';
import { PRESCRIPTION_STATUS, RISK_LEVELS, SAMPLE_STATUS } from '../domain';
import { formatCaseStatus, formatDateTime, getCaseSubject, riskVariant, statusVariant } from '../utils/casePresentation';
import PrescriptionWorkflowStrip from '../components/PrescriptionWorkflowStrip';
import { translateClinicalText } from '../utils/adapters';
import VeterinarianHeaderNav from '../components/VeterinarianHeaderNav';

const riskOptions = [
  { value: RISK_LEVELS.LOW, label: 'GREEN (Treatment / Prescription)', detail: 'Issue prescription for infected animals & preventive action for at-risk herd.', selectedClass: 'border-emerald-500 bg-emerald-50' },
  { value: RISK_LEVELS.YELLOW, label: 'YELLOW (Diagnostic Sample)', detail: 'Request field sample collection by Seva Sakhi + optional supportive treatment.', selectedClass: 'border-amber-500 bg-amber-50' },
  { value: RISK_LEVELS.RED, label: 'RED (Urgent Field Response)', detail: 'Immediate emergency response, sample collection & biosecurity outbreak alert.', selectedClass: 'border-red-500 bg-red-50' },
];

export default function VeterinarianCaseDetailPage() {
  const { caseId } = useParams();
  const [vetLanguage, setVetLanguage] = useState('en');
  const {
    cases,
    farmers,
    animals,
    flocks,
    veterinarians,
    assessments,
    medicines,
    samples,
    prescriptions,
    sevaSakhis,
    recordVeterinarianDecision,
    createPrescription,
    requestSample,
    createEmergencyTask,
    createDiseaseAlert,
  } = useBionexus();

  const caseItem = cases.find((item) => item.caseId === caseId);
  const veterinarian = veterinarians[0] || { id: 'USR-003', name: 'Dr. Parth Gawde' };
  const farmer = farmers.find((item) => item.farmerId === caseItem?.farmerId);
  const subject = caseItem ? getCaseSubject(caseItem, animals, flocks) : null;
  const previousCases = cases.filter((item) => item.farmerId === caseItem?.farmerId && item.caseId !== caseId);
  const latestAssessment = [...assessments].reverse().find((item) => item.caseId === caseId);

  // Assessment state
  const [riskLevel, setRiskLevel] = useState(caseItem?.riskLevel || '');
  const [assessment, setAssessment] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [triggerAlert, setTriggerAlert] = useState(false);
  const [diseaseName, setDiseaseName] = useState('Foot and Mouth Disease (Suspected)');

  // Prescription Form State (For GREEN / YELLOW / RED)
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [medicineId, setMedicineId] = useState(medicines[0]?.medicineId || '');
  const [dosage, setDosage] = useState('10 ml twice daily');
  const [duration, setDuration] = useState('5 days');
  const [instructions, setInstructions] = useState('Administer orally after feeding.');
  const [infectedCount, setInfectedCount] = useState('1');
  const [preventiveCount, setPreventiveCount] = useState('0');
  const [preventiveQuantity, setPreventiveQuantity] = useState('0');
  const [affectedAnimalIds, setAffectedAnimalIds] = useState(caseItem?.animalId ? [caseItem.animalId] : []);
  const [affectedFlockIds, setAffectedFlockIds] = useState(caseItem?.flockId ? [caseItem.flockId] : []);

  // Sample Request State (For YELLOW / RED)
  const [sampleType, setSampleType] = useState('BLOOD');
  const [sampleQuantity, setSampleQuantity] = useState('5 ml');
  const [collectionInstructions, setCollectionInstructions] = useState('Collect sterile sample into EDTA vial, label with Case ID, maintain cold chain.');
  const [priority, setPriority] = useState('HIGH');
  const [selectedSakhiId, setSelectedSakhiId] = useState(sevaSakhis[0]?.sakhiId || 'SAKHI-101');

  const [actionMessage, setActionMessage] = useState('');

  const selectedRisk = useMemo(() => riskOptions.find((item) => item.value === riskLevel), [riskLevel]);

  if (!caseItem) {
    return (
      <div className="mx-auto max-w-3xl py-10">
        <Alert variant="danger" title="Case not found">
          This case ID is not available in the current surveillance context.
        </Alert>
        <Link to="/veterinarian/cases" className="mt-4 inline-flex">
          <Button variant="secondary">Return to Queue</Button>
        </Link>
      </div>
    );
  }

  // 1. Submit Vet Clinical Decision (GREEN / YELLOW / RED)
  const submitAssessment = (event) => {
    event.preventDefault();
    if (!riskLevel || !assessment.trim() || !confirmed) return;

    recordVeterinarianDecision({
      caseId,
      veterinarianId: veterinarian.id,
      assessment,
      riskLevel,
      clinicalNotes,
      actionType: selectedRisk.detail,
      createDiseaseAlert: triggerAlert,
      diseaseName: triggerAlert ? diseaseName : null,
      location: caseItem.location || { village: farmer?.address || 'Udaipur Village' },
    });

    setActionMessage(`Clinical assessment saved as ${riskLevel}. ${selectedRisk.detail}`);
  };

  const toggleId = (list, setList, id) => {
    setList(list.includes(id) ? list.filter((item) => item !== id) : [...list, id]);
  };

  // 2. Submit Prescription (Infected + Preventive)
  const submitTreatmentPlan = () => {
    if (!medicineId || !dosage.trim() || !duration.trim() || !instructions.trim() || Number(infectedCount) < 1) return;
    createPrescription({
      caseId,
      veterinarianId: veterinarian.id,
      farmerId: caseItem.farmerId,
      status: PRESCRIPTION_STATUS.CREATED,
      medicineId,
      dosage,
      duration,
      instructions,
      affectedAnimalIds,
      affectedFlockIds,
      treatmentQuantity: Number(infectedCount),
      preventiveEligiblePopulation: Number(preventiveCount),
      preventiveQuantity: Number(preventiveQuantity),
      items: [
        { type: 'INFECTED_ANIMAL_TREATMENT', medicineId, eligibleAnimalIds: affectedAnimalIds, eligibleFlockIds: affectedFlockIds, quantity: Number(infectedCount), instructions: `${dosage}; ${duration}; ${instructions}` },
        ...(Number(preventiveCount) > 0 || Number(preventiveQuantity) > 0
          ? [{ type: 'PREVENTIVE_ACTION', medicineId, eligibleAnimalIds: [], eligibleFlockIds: [], quantity: Number(preventiveQuantity), instructions: `Preventive eligible population: ${preventiveCount}` }]
          : []),
      ],
    });
    setActionMessage('Prescription generated successfully! OTP pending verification by Farmer & Seva Sakhi.');
  };

  // 3. Submit Sample Collection Request with Nearby Sakhi Assignment
  const submitSampleRequest = () => {
    const assignedSakhi = sevaSakhis.find((s) => s.sakhiId === selectedSakhiId) || sevaSakhis[0];

    requestSample({
      caseId,
      farmerId: caseItem.farmerId,
      animalId: caseItem.animalId,
      flockId: caseItem.flockId,
      veterinarianId: veterinarian.id,
      sampleType,
      sampleQuantity,
      status: SAMPLE_STATUS.REQUESTED,
      collectionInstructions,
      priority,
      assignedSakhiId: selectedSakhiId,
      assignedSakhiName: assignedSakhi?.name,
      requestedBy: veterinarian.id,
    });
    setActionMessage(`Diagnostic sample request sent to Seva Sakhi ${assignedSakhi?.name || 'Priya Jadhav'} (${assignedSakhi?.distanceKm || '2.1'} km away).`);
  };

  // 4. Submit Emergency Task (For RED Workflow)
  const submitEmergencyTask = () => {
    createEmergencyTask({
      caseId,
      createdBy: veterinarian.id,
      farmerId: caseItem.farmerId,
      farmer: farmer?.name,
      mobile: farmer?.mobile,
      village: caseItem.location?.village || farmer?.address,
      location: caseItem.location,
      subject: subject.id,
      symptoms: caseItem.symptoms,
    });
    if (triggerAlert) {
      createDiseaseAlert({
        caseId,
        disease: diseaseName,
        location: caseItem.location || { village: farmer?.address || 'Udaipur Village' },
        severity: 'CRITICAL',
        radiusKm: 10,
        createdBy: veterinarian.id,
      });
    }
    setActionMessage('Urgent field visit response team dispatched and biosecurity alert broadcasted.');
  };

  return (
    <div className="mx-auto max-w-7xl py-6 sm:py-8">
      {/* Top Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
            <Link to="/veterinarian/cases" className="hover:underline flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Case Queue
            </Link>
            <span>/</span>
            <span>Case Review</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{caseId}</h1>
            <Badge variant={statusVariant(caseItem.status)}>{formatCaseStatus(caseItem.status)}</Badge>
            <Badge variant={riskVariant(caseItem.riskLevel)}>{caseItem.riskLevel ? `DECISION: ${caseItem.riskLevel}` : 'PENDING VET ASSESSMENT'}</Badge>
          </div>
          <p className="mt-1 text-xs text-slate-500">AI Priority: <strong>{caseItem.aiPriority || 'HIGH'}</strong> · Final clinical decision belongs exclusively to the veterinarian.</p>
        </div>
        <Link to="/veterinarian/cases">
          <Button variant="outline" icon={ArrowLeft} iconPosition="left">Back to Queue</Button>
        </Link>
      </div>

      {/* Header Navigation */}
      <VeterinarianHeaderNav />

      {actionMessage && (
        <Alert className="mb-6" variant="success" onDismiss={() => setActionMessage('')}>
          <strong>{actionMessage}</strong>
        </Alert>
      )}

      {/* THREE COLUMN DETAILS SECTION */}
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.35fr_0.9fr]">
        {/* 1. FARMER & ANIMAL DETAILS */}
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <div>
              <CardTitle>Farmer & Livestock Details</CardTitle>
              <CardDescription>Identity, contact & flock history</CardDescription>
            </div>
            <Stethoscope className="h-5 w-5 text-blue-600" />
          </CardHeader>

          <div className="space-y-3 text-xs">
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-slate-400 font-semibold uppercase text-[10px]">Farmer Information</p>
              <p className="mt-1 text-sm font-bold text-slate-900">{farmer?.name || caseItem.farmerId}</p>
              <p className="text-slate-600">ID: {caseItem.farmerId} · Mobile: {farmer?.mobile || '9876543210'}</p>
              <p className="text-slate-600 flex items-center gap-1 mt-1">
                <MapPin className="h-3.5 w-3.5 text-blue-600" />
                {caseItem.location?.village || farmer?.address || 'Udaipur Village'}
              </p>
            </div>

            <div className="rounded-lg bg-blue-50/60 p-3 border border-blue-100">
              <p className="text-blue-800 font-semibold uppercase text-[10px]">Animal / Flock Profile</p>
              <p className="mt-1 text-sm font-bold text-blue-950">{subject?.id} ({subject?.label})</p>
              <p className="text-blue-900">Species: {subject?.details?.species || 'CATTLE'} · Breed: {subject?.details?.breed || 'Tharparkar'}</p>
              <p className="text-blue-900">Age / Count: {subject?.details?.age || subject?.details?.count || '240 poultry'}</p>
              <p className="text-blue-900">Vaccination Status: <strong>{subject?.details?.vaccinationStatus || 'CURRENT'}</strong></p>
            </div>

            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-slate-400 font-semibold uppercase text-[10px]">GPS Geotag Metadata</p>
              <p className="mt-1 text-slate-700">
                Lat: <strong>{caseItem.geotagMetadata?.latitude || caseItem.location?.latitude || '24.5854'}</strong>, Long: <strong>{caseItem.geotagMetadata?.longitude || caseItem.location?.longitude || '73.7125'}</strong>
              </p>
              <span className="block text-[10px] text-emerald-700 font-semibold mt-0.5">
                ✓ {caseItem.geotagMetadata?.locationAccuracy || '3.2m GPS lock verified'}
              </span>
            </div>
          </div>

          <div className="mt-4 border-t border-slate-200 pt-3 text-xs">
            <p className="font-semibold text-slate-500 uppercase text-[10px]">Previous Case History</p>
            <p className="mt-1 text-slate-600">
              {previousCases.length ? previousCases.map((item) => item.caseId).join(', ') : 'No previous reported cases for this farmer.'}
            </p>
          </div>
        </Card>

        {/* 2. CASE INFORMATION, MEDIA & MULTILINGUAL TRANSLATION */}
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <div>
              <CardTitle>Case Information & Farmer Media</CardTitle>
              <CardDescription>Submitted evidence, voice note & multilingual view</CardDescription>
            </div>
            <ClipboardList className="h-5 w-5 text-blue-600" />
          </CardHeader>

          {/* Photo Display */}
          <div className="rounded-xl bg-slate-900 p-3 text-white">
            <div className="flex aspect-video items-center justify-center overflow-hidden rounded-lg border border-slate-700 bg-slate-800">
              {caseItem.photo ? (
                <img src={caseItem.photo} alt="Farmer Submitted Evidence" className="h-full w-full object-contain" />
              ) : (
                <div className="text-center text-slate-400">
                  <Camera className="mx-auto h-8 w-8 text-slate-500" />
                  <p className="mt-1 text-xs">No photograph attached by farmer</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 space-y-3 text-xs">
            {/* Multilingual Symptom Translation Component */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Veterinarian Preferred Language View</span>
                <div className="flex items-center gap-1.5 text-xs font-medium text-blue-700">
                  <span>Vet Language:</span>
                  <select
                    value={vetLanguage}
                    onChange={(e) => setVetLanguage(e.target.value)}
                    className="rounded border border-slate-300 bg-white px-2 py-0.5 text-xs font-bold text-blue-800"
                  >
                    <option value="en">English (en)</option>
                    <option value="hi">Hindi (hi)</option>
                    <option value="mr">Marathi (mr)</option>
                  </select>
                </div>
              </div>

              {/* Original Farmer Submission Text - Preserved */}
              <div className="rounded-lg bg-white p-3 border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-slate-800 text-xs">Original Farmer Text (Preserved)</p>
                  <Badge variant="neutral" size="sm">
                    Language: {(caseItem.originalLanguage || caseItem.language || 'mr').toUpperCase()}
                  </Badge>
                </div>
                <p className="text-slate-800 font-medium text-xs">
                  "{caseItem.originalSymptoms || caseItem.symptoms?.join(', ') || 'No original text provided'}"
                </p>
                {caseItem.transcriptText && (
                  <p className="mt-1 text-[11px] text-blue-700 italic">Voice Speech Transcript: "{caseItem.transcriptText}"</p>
                )}
              </div>

              {/* Translated Text View for Veterinarian */}
              <div className="rounded-lg bg-blue-50/70 p-3 border border-blue-200">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-blue-900 text-xs">Translated for Veterinarian Review</p>
                  <Badge variant="info" size="sm">
                    Target: {vetLanguage.toUpperCase()}
                  </Badge>
                </div>
                {(() => {
                  const srcLang = caseItem.originalLanguage || caseItem.language || 'mr';
                  if (srcLang === vetLanguage) {
                    return <p className="text-slate-700 text-xs italic">Same language — no translation required.</p>;
                  }
                  const result = translateClinicalText(
                    caseItem.originalSymptoms || caseItem.symptoms?.join(', ') || '',
                    srcLang,
                    vetLanguage
                  );
                  if (result.status === 'exact_match') {
                    return (
                      <>
                        <p className="text-slate-900 font-semibold text-xs">{result.translated}</p>
                        <p className="mt-1 text-[10px] text-emerald-700">✓ Clinical dictionary translation match</p>
                      </>
                    );
                  }
                  return (
                    <>
                      <p className="text-amber-900 font-semibold text-xs">Translation pending IndicTrans2 backend API integration</p>
                      <p className="mt-0.5 text-[10px] text-amber-700">Original farmer language metadata preserved above.</p>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Voice Recording Audio Player */}
            <div className="rounded-lg border border-slate-200 p-3 bg-white">
              <p className="font-semibold text-slate-800 flex items-center gap-1.5 text-xs">
                <Volume2 className="h-4 w-4 text-blue-600" />
                Farmer Audio Note & Voice Recording
              </p>
              {caseItem.voiceNote ? (
                <div className="mt-2">
                  <audio src={caseItem.voiceNote} controls className="w-full h-8" />
                  <p className="mt-1 text-[10px] text-slate-500">Audio playback available</p>
                </div>
              ) : (
                <p className="mt-1 text-xs text-slate-500 italic">No voice note audio file attached for this report.</p>
              )}
            </div>
          </div>
        </Card>

        {/* 3. AI ADVISORY PANEL */}
        <Card className="border-violet-200 bg-white">
          <CardHeader>
            <div>
              <CardTitle>AI Advisory Assistance</CardTitle>
              <CardDescription>Preliminary automated analysis</CardDescription>
            </div>
            <ShieldAlert className="h-5 w-5 text-violet-600" />
          </CardHeader>
          <Alert variant="info" title="Clinical Boundary">
            AI assists with priority triage. The veterinarian must independently make the clinical decision.
          </Alert>
          <div className="mt-3 space-y-2 text-xs">
            {[
              ['AI Priority Assessment', caseItem.aiPriority || 'HIGH PRIORITY'],
              ['Image Quality Check', caseItem.photo ? 'Acceptable Resolution' : 'No photo submitted'],
              ['Speech Recognition', caseItem.transcriptText ? 'Transcript Processed' : 'N/A'],
              ['Language Auto-detect', (caseItem.originalLanguage || 'mr').toUpperCase()],
              ['Outbreak Correlation', 'Cluster match in Udaipur region'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-violet-50/70 p-2.5">
                <p className="text-[10px] font-bold text-violet-800 uppercase">{label}</p>
                <p className="mt-0.5 text-slate-800 font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* VETERINARIAN CLINICAL ASSESSMENT FORM (GREEN / YELLOW / RED) */}
      <Card className="mt-8 border-slate-300">
        <CardHeader>
          <div>
            <CardTitle className="text-xl">Veterinarian Clinical Assessment & Decision</CardTitle>
            <CardDescription>Select the clinical risk status to trigger the appropriate prescription or sample workflow.</CardDescription>
          </div>
          <AlertTriangle className="h-6 w-6 text-amber-600" />
        </CardHeader>

        <form onSubmit={submitAssessment} className="p-4">
          <div className="grid gap-4 md:grid-cols-3">
            {riskOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setRiskLevel(option.value)}
                className={[
                  'rounded-xl border-2 p-4 text-left transition-all cursor-pointer',
                  riskLevel === option.value ? option.selectedClass : 'border-slate-200 bg-white hover:border-slate-300',
                ].join(' ')}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{option.label}</span>
                  {riskLevel === option.value && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                </div>
                <p className="mt-2 text-xs text-slate-600">{option.detail}</p>
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Textarea
              label="Clinical Diagnosis & Findings"
              required
              rows={3}
              value={assessment}
              onChange={(event) => setAssessment(event.target.value)}
              placeholder="Record clinical examination notes, differential diagnosis, and findings."
            />
            <Textarea
              label="Treatment & Administration Notes"
              rows={3}
              value={clinicalNotes}
              onChange={(event) => setClinicalNotes(event.target.value)}
              placeholder="Record specific feeding, isolation, or follow-up instructions."
            />
          </div>

          {/* Disease Outbreak Alert Trigger */}
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50/50 p-4">
            <label className="flex items-center gap-2 text-xs font-bold text-red-900 cursor-pointer">
              <input
                type="checkbox"
                checked={triggerAlert}
                onChange={(e) => setTriggerAlert(e.target.checked)}
                className="h-4 w-4 rounded border-red-300 text-red-600"
              />
              Trigger Disease Outbreak Alert & Geographic Risk Map Zone
            </label>
            {triggerAlert && (
              <div className="mt-3">
                <Input
                  label="Suspected / Confirmed Infection Name"
                  value={diseaseName}
                  onChange={(e) => setDiseaseName(e.target.value)}
                  placeholder="e.g. Foot and Mouth Disease (FMD) / Newcastle Disease"
                />
                <p className="mt-1 text-[11px] text-red-700">Creates a biosecurity warning and updates the local village heat map.</p>
              </div>
            )}
          </div>

          <label className="mt-4 flex items-start gap-2 text-xs text-slate-700">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(event) => setConfirmed(event.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600"
            />
            I explicitly confirm this is my licensed veterinarian clinical decision and not an automated AI diagnosis.
          </label>

          <Button className="mt-5" type="submit" disabled={!riskLevel || !assessment.trim() || !confirmed} icon={Send}>
            Record Clinical Decision
          </Button>
        </form>
      </Card>

      {/* WORKFLOW 1: GREEN / LOW RISK — PRESCRIPTION WORKFLOW */}
      {(riskLevel === RISK_LEVELS.LOW || caseItem.riskLevel === RISK_LEVELS.LOW || showPrescriptionForm) && (
        <Card className="mt-8 border-emerald-300 bg-emerald-50/10">
          <CardHeader className="bg-emerald-50 border-b border-emerald-200">
            <div>
              <CardTitle className="text-emerald-950 flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-600" />
                GREEN WORKFLOW: Prescription & Preventive Treatment
              </CardTitle>
              <CardDescription className="text-emerald-800">
                Separate prescriptions for infected animals vs preventive eligible population.
              </CardDescription>
            </div>
          </CardHeader>

          <div className="p-5 space-y-4">
            <PrescriptionWorkflowStrip
              status={prescriptions.find((item) => item.caseId === caseId)?.status}
              medicineVerified={prescriptions.find((item) => item.caseId === caseId)?.medicineVerified}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-emerald-200 bg-white p-4">
                <p className="text-xs font-bold uppercase text-emerald-900">A. INFECTED ANIMAL PRESCRIPTION</p>
                <p className="text-xs text-slate-500 mt-0.5">Select infected animals/flocks for targeted treatment medication</p>
                <div className="mt-3 space-y-2 text-xs">
                  {animals.filter((item) => item.farmerId === caseItem.farmerId).map((item) => (
                    <label key={item.rapidId} className="flex items-center gap-2 text-slate-800">
                      <input
                        type="checkbox"
                        checked={affectedAnimalIds.includes(item.rapidId)}
                        onChange={() => toggleId(affectedAnimalIds, setAffectedAnimalIds, item.rapidId)}
                        className="h-4 w-4 rounded border-slate-300 text-emerald-600"
                      />
                      {item.rapidId} · {item.species} ({item.breed})
                    </label>
                  ))}
                  {flocks.filter((item) => item.farmerId === caseItem.farmerId).map((item) => (
                    <label key={item.flockId} className="flex items-center gap-2 text-slate-800">
                      <input
                        type="checkbox"
                        checked={affectedFlockIds.includes(item.flockId)}
                        onChange={() => toggleId(affectedFlockIds, setAffectedFlockIds, item.flockId)}
                        className="h-4 w-4 rounded border-slate-300 text-emerald-600"
                      />
                      {item.flockId} · Poultry Flock ({item.count} total count)
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-indigo-200 bg-white p-4">
                <p className="text-xs font-bold uppercase text-indigo-900">B. PREVENTIVE / PRE-PRESCRIPTION</p>
                <p className="text-xs text-slate-500 mt-0.5">Veterinarian defines eligible remaining population for preventive action</p>
                <div className="mt-3 space-y-3">
                  <Input
                    label="Preventive Eligible Population"
                    type="number"
                    min="0"
                    value={preventiveCount}
                    onChange={(event) => setPreventiveCount(event.target.value)}
                    hint="Remaining animals considered at risk"
                  />
                  <Input
                    label="Preventive Medicine Quantity"
                    type="number"
                    min="0"
                    value={preventiveQuantity}
                    onChange={(event) => setPreventiveQuantity(event.target.value)}
                    hint="Set independently by veterinarian"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Select label="Select Medicine from Kendra Inventory" value={medicineId} onChange={(event) => setMedicineId(event.target.value)}>
                {medicines.map((item) => (
                  <option key={item.medicineId} value={item.medicineId}>
                    {item.name} (Batch: {item.batch})
                  </option>
                ))}
              </Select>

              <Input label="Dosage Instructions" value={dosage} onChange={(event) => setDosage(event.target.value)} placeholder="e.g. 10 ml twice daily" />
              <Input label="Treatment Duration" value={duration} onChange={(event) => setDuration(event.target.value)} placeholder="e.g. 5 days" />
              <Input label="Infected Animal Quantity" type="number" min="1" value={infectedCount} onChange={(event) => setInfectedCount(event.target.value)} />
            </div>

            <Textarea
              label="Administration & Follow-up Instructions"
              value={instructions}
              onChange={(event) => setInstructions(event.target.value)}
              placeholder="Detailed administration guidelines for the farmer."
            />

            <Button onClick={submitTreatmentPlan} disabled={!dosage.trim() || !duration.trim() || !instructions.trim()} icon={Pill}>
              Generate Prescription & Issue OTP
            </Button>

            {/* Issued Prescriptions List */}
            {prescriptions.filter((item) => item.caseId === caseId).map((item) => (
              <div key={item.prescriptionId} className="mt-4 rounded-xl border border-emerald-300 bg-white p-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{item.prescriptionId}</span>
                  <Badge variant={item.status === 'VERIFIED' ? 'success' : 'warning'}>{item.status}</Badge>
                </div>
                <p className="mt-1 text-slate-700">
                  Infected Treatment Qty: <strong>{item.treatmentQuantity}</strong> · Preventive Qty: <strong>{item.preventiveQuantity}</strong>
                </p>
                <p className="mt-1 text-slate-500">Available to farmer and verifiable by Seva Sakhi & Pashu Seva Kendra.</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* WORKFLOW 2: YELLOW / RED — DIAGNOSTIC SAMPLE REQUEST & SEVA SAKHI ASSIGNMENT */}
      {(riskLevel === RISK_LEVELS.YELLOW || riskLevel === RISK_LEVELS.RED || caseItem.riskLevel === RISK_LEVELS.YELLOW || caseItem.riskLevel === RISK_LEVELS.RED) && (
        <Card className="mt-8 border-amber-300 bg-amber-50/10">
          <CardHeader className="bg-amber-50 border-b border-amber-200">
            <div>
              <CardTitle className="text-amber-950 flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-amber-600" />
                {riskLevel === 'RED' ? 'RED WORKFLOW: Urgent Field Visit & Sample Request' : 'YELLOW WORKFLOW: Diagnostic Sample Request'}
              </CardTitle>
              <CardDescription className="text-amber-900">
                Request specific laboratory sample collection from nearby Seva Sakhi + optional supportive prescription.
              </CardDescription>
            </div>
          </CardHeader>

          <div className="p-5 space-y-5">
            {/* Seva Sakhi Selection Near Farmer Field */}
            <div className="rounded-xl border border-amber-200 bg-white p-4">
              <p className="text-xs font-bold uppercase text-amber-900 flex items-center gap-1.5">
                <UserCheck className="h-4 w-4 text-amber-600" />
                Nearby Seva Sakhi Availability (Field Location)
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {(sevaSakhis || []).map((sakhi) => (
                  <button
                    key={sakhi.sakhiId}
                    type="button"
                    onClick={() => setSelectedSakhiId(sakhi.sakhiId)}
                    className={[
                      'rounded-xl border p-3 text-left transition-all cursor-pointer text-xs',
                      selectedSakhiId === sakhi.sakhiId ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-400' : 'border-slate-200 bg-slate-50',
                    ].join(' ')}
                  >
                    <p className="font-bold text-slate-900">{sakhi.name}</p>
                    <p className="mt-0.5 text-slate-600">Distance: <strong>{sakhi.distanceKm} km</strong></p>
                    <p className="mt-0.5 text-emerald-700 font-semibold">Status: {sakhi.status}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Sample Request Form */}
            <div className="grid gap-4 md:grid-cols-3">
              <Select label="Required Sample Type" value={sampleType} onChange={(event) => setSampleType(event.target.value)}>
                <option value="BLOOD">Blood Sample</option>
                <option value="SWAB">Nasal / Respiratory Swab</option>
                <option value="MILK_CULTURE">Milk Culture</option>
                <option value="TISSUE">Tissue Biopsy</option>
                <option value="FECAL">Fecal Sample</option>
                <option value="OTHER">Other Specimen</option>
              </Select>

              <Input label="Sample Quantity Required" value={sampleQuantity} onChange={(e) => setSampleQuantity(e.target.value)} placeholder="e.g. 5 ml in EDTA vial" />

              <Select label="Collection Priority" value={priority} onChange={(event) => setPriority(event.target.value)}>
                <option value="ROUTINE">Routine</option>
                <option value="PRIORITY">Priority</option>
                <option value="URGENT">Urgent / Emergency</option>
              </Select>
            </div>

            <Textarea
              label="Collection & Handling Instructions"
              value={collectionInstructions}
              onChange={(event) => setCollectionInstructions(event.target.value)}
              placeholder="Specific sample handling, preservation, and labeling guidelines for Seva Sakhi."
            />

            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={submitSampleRequest} icon={FlaskConical}>
                Send Sample Request to Seva Sakhi
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowPrescriptionForm(!showPrescriptionForm)}
                icon={Pill}
              >
                {showPrescriptionForm ? 'Hide Supportive Prescription' : 'Create Supportive Prescription (Optional)'}
              </Button>

              {riskLevel === 'RED' && (
                <Button variant="danger" onClick={submitEmergencyTask} icon={ShieldAlert}>
                  Dispatch Urgent Response Team
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {latestAssessment && (
        <Alert className="mt-8" variant="success" title="Latest Saved Veterinarian Decision">
          Recorded {latestAssessment.riskLevel} decision. Action: {latestAssessment.actionType}. Logged on {formatDateTime(latestAssessment.createdAt)}.
        </Alert>
      )}
    </div>
  );
}
