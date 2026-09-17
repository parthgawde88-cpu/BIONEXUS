import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Camera,
  CheckCircle2,
  ClipboardList,
  FileText,
  MapPin,
  Mic,
  Send,
  ShieldAlert,
  Stethoscope,
  Volume2,
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

const riskOptions = [
  { value: RISK_LEVELS.LOW, label: 'LOW', detail: 'Treatment / Preventive action', selectedClass: 'border-emerald-500 bg-emerald-50' },
  { value: RISK_LEVELS.YELLOW, label: 'YELLOW', detail: 'Diagnostic sample collection', selectedClass: 'border-amber-500 bg-amber-50' },
  { value: RISK_LEVELS.RED, label: 'RED', detail: 'Urgent field visit / Emergency response', selectedClass: 'border-red-500 bg-red-50' },
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
    recordVeterinarianDecision,
    createPrescription,
    requestSample,
    createEmergencyTask,
    createDiseaseAlert,
  } = useBionexus();

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
  const [triggerAlert, setTriggerAlert] = useState(false);
  const [diseaseName, setDiseaseName] = useState('Foot and Mouth Disease (Suspected)');

  const [medicineId, setMedicineId] = useState(medicines[0]?.medicineId || '');
  const [dosage, setDosage] = useState('');
  const [duration, setDuration] = useState('');
  const [instructions, setInstructions] = useState('');
  const [affectedCount, setAffectedCount] = useState('1');
  const [preventiveCount, setPreventiveCount] = useState('0');
  const [preventiveQuantity, setPreventiveQuantity] = useState('0');
  const [affectedAnimalIds, setAffectedAnimalIds] = useState(caseItem?.animalId ? [caseItem.animalId] : []);
  const [affectedFlockIds, setAffectedFlockIds] = useState(caseItem?.flockId ? [caseItem.flockId] : []);

  const [sampleType, setSampleType] = useState('BLOOD');
  const [collectionInstructions, setCollectionInstructions] = useState('Collect a clean sample and label it with the case ID.');
  const [priority, setPriority] = useState('HIGH');
  const [actionMessage, setActionMessage] = useState('');

  const selectedRisk = useMemo(() => riskOptions.find((item) => item.value === riskLevel), [riskLevel]);

  if (!caseItem) {
    return (
      <div className="mx-auto max-w-3xl py-10">
        <Alert variant="danger" title="Case not found">
          This case is not available in the current shared mock state.
        </Alert>
        <Link to="/veterinarian/cases" className="mt-4 inline-flex">
          <Button variant="secondary">Return to queue</Button>
        </Link>
      </div>
    );
  }

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
      location: caseItem.location || { village: farmer?.address || 'Udaipur, Rajasthan' },
    });

    setActionMessage(`${riskLevel} decision recorded. ${selectedRisk.detail} is now required.`);
  };

  const toggleId = (list, setList, id) => {
    setList(list.includes(id) ? list.filter((item) => item !== id) : [...list, id]);
  };

  const submitTreatmentPlan = () => {
    if (!medicineId || !dosage.trim() || !duration.trim() || !instructions.trim() || Number(affectedCount) < 1) return;
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
      treatmentQuantity: Number(affectedCount),
      preventiveEligiblePopulation: Number(preventiveCount),
      preventiveQuantity: Number(preventiveQuantity),
      items: [
        { type: 'TREATMENT', medicineId, eligibleAnimalIds: affectedAnimalIds, eligibleFlockIds: affectedFlockIds, quantity: Number(affectedCount), instructions: `${dosage}; ${duration}; ${instructions}` },
        ...(Number(preventiveCount) > 0 || Number(preventiveQuantity) > 0
          ? [{ type: 'PREVENTIVE_ACTION', medicineId, eligibleAnimalIds: [], eligibleFlockIds: [], quantity: Number(preventiveQuantity), instructions: `Preventive eligible population: ${preventiveCount}` }]
          : []),
      ],
    });
    setActionMessage('Prescription created. OTP pending with farmer / Seva Sakhi.');
  };

  const submitSampleRequest = () => {
    requestSample({
      caseId,
      farmerId: caseItem.farmerId,
      animalId: caseItem.animalId,
      flockId: caseItem.flockId,
      veterinarianId: veterinarian.id,
      sampleType,
      status: SAMPLE_STATUS.REQUESTED,
      collectionInstructions,
      priority,
      requestedBy: veterinarian.id,
    });
    setActionMessage('Diagnostic sample request created for Seva Sakhi collection.');
  };

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
        location: caseItem.location || { village: farmer?.address || 'Udaipur' },
        severity: 'CRITICAL',
        radiusKm: 10,
        createdBy: veterinarian.id,
      });
    }
    setActionMessage('Urgent field response task created.');
  };

  return (
    <div className="mx-auto max-w-7xl py-6 sm:py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Veterinarian case review</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{caseId}</h1>
            <Badge variant={statusVariant(caseItem.status)}>{formatCaseStatus(caseItem.status)}</Badge>
            <Badge variant={riskVariant(caseItem.riskLevel)}>{caseItem.riskLevel || 'PENDING VET ASSESSMENT'}</Badge>
          </div>
          <p className="mt-2 text-sm text-slate-500">Final clinical decision belongs to the veterinarian.</p>
        </div>
        <Link to="/veterinarian/cases" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" />
          Case queue
        </Link>
      </div>

      {actionMessage && (
        <Alert className="mb-6" variant="success" onDismiss={() => setActionMessage('')}>
          <strong>{actionMessage}</strong>
        </Alert>
      )}

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.35fr_0.9fr]">
        {/* Patient Info */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Patient / livestock</CardTitle>
              <CardDescription>Registered identity and history</CardDescription>
            </div>
            <Stethoscope className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <div className="space-y-3 text-sm">
            {[
              ['Farmer', farmer?.name],
              ['Mobile', farmer?.mobile],
              ['Village', caseItem.location?.village || farmer?.address],
              ['Animal/Flock', subject?.id],
              ['Species', subject?.details?.species],
              ['Breed', subject?.details?.breed],
              ['Age / Count', subject?.details?.age || subject?.details?.count],
              ['Vaccination', subject?.details?.vaccinationStatus],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="mt-1 font-semibold text-slate-800">{value || 'Not recorded'}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-slate-200 pt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Previous cases</p>
            <p className="mt-2 text-sm text-slate-600">
              {previousCases.length ? previousCases.map((item) => item.caseId).join(', ') : 'No previous cases in history.'}
            </p>
          </div>
        </Card>

        {/* Evidence Card (REAL CAPTURED PHOTO & AUDIO PLAYBACK) */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Evidence Submission</CardTitle>
              <CardDescription>Submitted by {farmer?.name || caseItem.submittedBy}</CardDescription>
            </div>
            <ClipboardList className="h-5 w-5 text-blue-600" />
          </CardHeader>

          {/* Photo Display */}
          <div className="rounded-xl bg-slate-900 p-4 text-white">
            <div className="flex aspect-video items-center justify-center overflow-hidden rounded-lg border border-slate-700 bg-slate-800">
              {caseItem.photo ? (
                <img src={caseItem.photo} alt="Farmer Evidence" className="h-full w-full object-contain" />
              ) : (
                <div className="text-center text-slate-400">
                  <Camera className="mx-auto h-9 w-9" />
                  <p className="mt-2 text-sm">No photo attached</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 space-y-3 text-sm">
            {/* Original vs Translated Symptoms for Veterinarian */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Symptom Translation View</span>
                <div className="flex items-center gap-1.5 text-xs font-medium text-blue-700">
                  <span>Vet View Language:</span>
                  <select
                    value={vetLanguage}
                    onChange={(e) => setVetLanguage(e.target.value)}
                    className="rounded border border-slate-300 bg-white px-2 py-1 font-bold text-blue-800"
                  >
                    <option value="en">English (en)</option>
                    <option value="hi">Hindi (hi)</option>
                    <option value="mr">Marathi (mr)</option>
                  </select>
                </div>
              </div>

              {/* Original Symptoms — always shown */}
              <div className="rounded-lg bg-white p-3 border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-slate-800 text-xs">Original Symptoms (Farmer Input)</p>
                  <Badge variant="neutral" size="sm">
                    Language: {(caseItem.originalLanguage || caseItem.language || 'mr').toUpperCase()}
                  </Badge>
                </div>
                <p className="text-slate-700 text-sm">{caseItem.originalSymptoms || caseItem.symptoms?.join(', ') || 'No symptoms provided'}</p>
                {caseItem.transcriptText && (
                  <p className="mt-1.5 text-xs text-blue-700 italic">Voice transcript: "{caseItem.transcriptText}"</p>
                )}
              </div>

              {/* Translated — honest: exact match or pending backend */}
              <div className="rounded-lg bg-blue-50/70 p-3 border border-blue-200">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-blue-900 text-xs">Translated for Veterinarian</p>
                  <Badge variant="info" size="sm">
                    → {vetLanguage.toUpperCase()}
                  </Badge>
                </div>
                {(() => {
                  const srcLang = caseItem.originalLanguage || caseItem.language || 'mr';
                  if (srcLang === vetLanguage) {
                    return <p className="text-slate-700 text-sm italic">Same language — no translation needed.</p>;
                  }
                  const result = translateClinicalText(
                    caseItem.originalSymptoms || caseItem.symptoms?.join(', ') || '',
                    srcLang,
                    vetLanguage
                  );
                  if (result.status === 'exact_match') {
                    return (
                      <>
                        <p className="text-slate-800 text-sm font-medium">{result.translated}</p>
                        <p className="mt-1 text-[10px] text-emerald-700">✓ Clinical dictionary match (IndicTrans2 adapter boundary)</p>
                      </>
                    );
                  }
                  return (
                    <>
                      <p className="text-amber-800 text-sm font-semibold">Translation pending backend integration</p>
                      <p className="mt-1 text-[10px] text-amber-600">
                        Real translation requires IndicTrans2 / backend API. Connect the translateClinicalText adapter in adapters.js to enable.
                      </p>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Voice Note Audio Playback */}
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Volume2 className="h-4 w-4 text-blue-600" />
                Voice Recording & Audio Note
              </p>
              {caseItem.voiceNote ? (
                <div className="mt-2">
                  <audio src={caseItem.voiceNote} controls className="w-full h-8" />
                  <p className="mt-1 text-[11px] text-slate-500">Real audio recording playback available</p>
                </div>
              ) : (
                <p className="mt-1 text-xs text-slate-500">No voice note attached</p>
              )}
            </div>

            {/* Location & Geotag Metadata */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="font-semibold text-slate-800 flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  Application Geo-Tag & Village
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  {caseItem.location?.village || farmer?.address}
                  <br />
                  Lat: <strong>{caseItem.geotagMetadata?.latitude || caseItem.location?.latitude || 'N/A'}</strong>, Long: <strong>{caseItem.geotagMetadata?.longitude || caseItem.location?.longitude || 'N/A'}</strong>
                  {caseItem.geotagMetadata?.locationAccuracy && (
                    <span className="block text-[10px] text-emerald-700 font-semibold mt-0.5">
                      Accuracy: {caseItem.geotagMetadata.locationAccuracy}
                    </span>
                  )}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="font-semibold text-slate-800">Submitted Timestamp</p>
                <p className="mt-1 text-xs text-slate-600">{formatDateTime(caseItem.submittedAt)}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* AI Advisory Panel */}
        <Card className="border-violet-200">
          <CardHeader>
            <div>
              <CardTitle>AI-ASSISTED ADVISORY</CardTitle>
              <CardDescription>Advisory support only. No autonomous diagnosis.</CardDescription>
            </div>
            <ShieldAlert className="h-5 w-5 text-violet-600" />
          </CardHeader>
          <Alert variant="info">AI-assisted. Veterinarian makes the final clinical decision.</Alert>
          <div className="mt-4 space-y-3 text-sm">
            {[
              ['Image Quality', caseItem.photo ? 'Acceptable resolution' : 'No image'],
              ['Visual Indicators', 'Slight inflammation / lethargy flags'],
              ['Speech Transcript', caseItem.transcriptText || 'No transcript'],
              ['Language Support', caseItem.language || 'English'],
              ['Duplicate Flag', 'Not flagged'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-violet-50 p-3">
                <p className="text-xs font-semibold text-violet-800">{label}</p>
                <p className="mt-1 text-slate-700">{value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Veterinarian Assessment Form */}
      <Card className="mt-6">
        <CardHeader>
          <div>
            <CardTitle>Veterinarian Clinical Assessment</CardTitle>
            <CardDescription>Choose one explicit clinical risk level and required action.</CardDescription>
          </div>
          <AlertTriangle className="h-5 w-5 text-amber-600" />
        </CardHeader>

        <form onSubmit={submitAssessment}>
          <div className="grid gap-3 md:grid-cols-3">
            {riskOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setRiskLevel(option.value)}
                className={[
                  'rounded-xl border-2 p-4 text-left transition-all',
                  riskLevel === option.value ? option.selectedClass : 'border-slate-200',
                ].join(' ')}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{option.label}</span>
                  {riskLevel === option.value && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                </div>
                <p className="mt-2 text-xs text-slate-600">{option.detail}</p>
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Textarea
              label="Clinical assessment"
              required
              rows={3}
              value={assessment}
              onChange={(event) => setAssessment(event.target.value)}
              placeholder="Describe the clinical findings and assessment."
            />
            <Textarea
              label="Clinical notes"
              rows={3}
              value={clinicalNotes}
              onChange={(event) => setClinicalNotes(event.target.value)}
              placeholder="Record relevant observations and instructions."
            />
          </div>

          {/* Disease Outbreak Alert Trigger */}
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50/50 p-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-red-900 cursor-pointer">
              <input
                type="checkbox"
                checked={triggerAlert}
                onChange={(e) => setTriggerAlert(e.target.checked)}
                className="h-4 w-4 rounded border-red-300 text-red-600"
              />
              Trigger Disease Outbreak Alert & Geographic Risk Map
            </label>
            {triggerAlert && (
              <div className="mt-3">
                <Input
                  label="Disease / Infection Name"
                  value={diseaseName}
                  onChange={(e) => setDiseaseName(e.target.value)}
                  placeholder="e.g. FMD / Brucellosis / Avian Influenza"
                />
                <p className="mt-1 text-xs text-red-700">Creates a biosecurity alert and 5-10km risk zone on local dashboards.</p>
              </div>
            )}
          </div>

          <label className="mt-4 flex items-start gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(event) => setConfirmed(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600"
            />
            I confirm this is my veterinarian decision and not an automated AI diagnosis.
          </label>

          <Button className="mt-5" type="submit" disabled={!riskLevel || !assessment.trim() || !confirmed} icon={Send}>
            Confirm Veterinarian Decision
          </Button>
        </form>
      </Card>

      {/* LOW WORKFLOW: PRESCRIPTION CREATION */}
      {caseItem.riskLevel === RISK_LEVELS.LOW && (
        <Card className="mt-6 border-emerald-200">
          <CardHeader>
            <div>
              <CardTitle>Create Treatment Plan (LOW Risk)</CardTitle>
              <CardDescription>Treatment and prevention populations are defined separately.</CardDescription>
            </div>
            <FileText className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <PrescriptionWorkflowStrip
            status={prescriptions.find((item) => item.caseId === caseId)?.status}
            medicineVerified={prescriptions.find((item) => item.caseId === caseId)?.medicineVerified}
          />
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs font-semibold text-slate-500">Affected animal(s)</p>
              {animals
                .filter((item) => item.farmerId === caseItem.farmerId)
                .map((item) => (
                  <label key={item.rapidId} className="mt-2 flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={affectedAnimalIds.includes(item.rapidId)}
                      onChange={() => toggleId(affectedAnimalIds, setAffectedAnimalIds, item.rapidId)}
                      className="h-4 w-4 rounded border-slate-300 text-emerald-600"
                    />
                    {item.rapidId} · {item.species}
                  </label>
                ))}
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs font-semibold text-slate-500">Affected flock(s)</p>
              {flocks
                .filter((item) => item.farmerId === caseItem.farmerId)
                .map((item) => (
                  <label key={item.flockId} className="mt-2 flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={affectedFlockIds.includes(item.flockId)}
                      onChange={() => toggleId(affectedFlockIds, setAffectedFlockIds, item.flockId)}
                      className="h-4 w-4 rounded border-slate-300 text-emerald-600"
                    />
                    {item.flockId} · Poultry ({item.count})
                  </label>
                ))}
            </div>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Select label="Treatment medicine" value={medicineId} onChange={(event) => setMedicineId(event.target.value)}>
              {medicines.map((item) => (
                <option key={item.medicineId} value={item.medicineId}>
                  {item.name} ({item.batch})
                </option>
              ))}
            </Select>
            <Input label="Dosage" value={dosage} onChange={(event) => setDosage(event.target.value)} placeholder="e.g. 10 ml twice daily" />
            <Input label="Duration" value={duration} onChange={(event) => setDuration(event.target.value)} placeholder="e.g. 5 days" />
            <Input
              label="Treatment quantity (affected)"
              type="number"
              min="1"
              value={affectedCount}
              onChange={(event) => setAffectedCount(event.target.value)}
            />
            <Input
              label="Preventive eligible population"
              type="number"
              min="0"
              value={preventiveCount}
              onChange={(event) => setPreventiveCount(event.target.value)}
              hint="Veterinarian-defined population."
            />
            <Input
              label="Preventive quantity"
              type="number"
              min="0"
              value={preventiveQuantity}
              onChange={(event) => setPreventiveQuantity(event.target.value)}
              hint="Set independently of total herd/flock count."
            />
          </div>
          <Textarea
            className="mt-4"
            label="Instructions"
            value={instructions}
            onChange={(event) => setInstructions(event.target.value)}
            placeholder="Administration and follow-up instructions"
          />
          <Alert className="mt-4" variant="info">
            Affected animals and preventive eligible animals are veterinarian-defined.
          </Alert>
          <Button className="mt-4" onClick={submitTreatmentPlan} disabled={!dosage.trim() || !duration.trim() || !instructions.trim()}>
            Create Prescription & Generate OTP
          </Button>

          {prescriptions
            .filter((item) => item.caseId === caseId)
            .map((item) => (
              <div key={item.prescriptionId} className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm">
                <p className="font-semibold text-slate-800">{item.prescriptionId}</p>
                <p className="mt-1 text-slate-600">
                  Status: <strong>{item.status}</strong> · Qty {item.treatmentQuantity} + preventive {item.preventiveQuantity}
                </p>
              </div>
            ))}
        </Card>
      )}

      {/* YELLOW WORKFLOW: SAMPLE REQUEST */}
      {caseItem.riskLevel === RISK_LEVELS.YELLOW && (
        <Card className="mt-6 border-amber-200">
          <CardHeader>
            <div>
              <CardTitle>YELLOW - DIAGNOSTIC SAMPLE REQUIRED</CardTitle>
              <CardDescription>Create a request for Seva Sakhi field collection.</CardDescription>
            </div>
            <ClipboardList className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <div className="grid gap-4 md:grid-cols-3">
            <Select label="Sample type" value={sampleType} onChange={(event) => setSampleType(event.target.value)}>
              <option value="BLOOD">Blood</option>
              <option value="SWAB">Swab</option>
              <option value="TISSUE">Tissue</option>
              <option value="FECAL">Fecal</option>
              <option value="OTHER">Other</option>
            </Select>
            <Select label="Collection priority" value={priority} onChange={(event) => setPriority(event.target.value)}>
              <option value="ROUTINE">Routine</option>
              <option value="PRIORITY">Priority</option>
              <option value="URGENT">Urgent</option>
            </Select>
            <Input label="Current sample status" value={samples.find((item) => item.caseId === caseId)?.status || 'Not requested'} readOnly />
          </div>
          <Textarea className="mt-4" label="Collection instructions" value={collectionInstructions} onChange={(event) => setCollectionInstructions(event.target.value)} />
          <Button className="mt-4" onClick={submitSampleRequest}>
            Request Sample Collection
          </Button>
        </Card>
      )}

      {/* RED WORKFLOW: URGENT FIELD VISIT */}
      {caseItem.riskLevel === RISK_LEVELS.RED && (
        <Card className="mt-6 border-red-200">
          <CardHeader>
            <div>
              <CardTitle className="text-red-700">URGENT FIELD RESPONSE (RED Risk)</CardTitle>
              <CardDescription>Emergency task details for immediate coordination.</CardDescription>
            </div>
            <ShieldAlert className="h-5 w-5 text-red-600" />
          </CardHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ['Farmer', farmer?.name],
              ['Mobile', farmer?.mobile],
              ['Village', caseItem.location?.village || farmer?.address],
              ['Location', `${caseItem.location?.latitude || 'N/A'}, ${caseItem.location?.longitude || 'N/A'}`],
              ['Animal/Flock', subject?.id],
              ['Symptoms', caseItem.symptoms?.join(', ') || 'Not recorded'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-red-50 p-3">
                <p className="text-xs text-red-700">{label}</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
              </div>
            ))}
          </div>
          <Button className="mt-5 bg-red-600 hover:bg-red-700 text-white" onClick={submitEmergencyTask}>
            Create Urgent Field-Visit Task
          </Button>
        </Card>
      )}

      {latestAssessment && (
        <Alert className="mt-6" variant="success" title="Latest veterinarian assessment">
          {latestAssessment.riskLevel} - {latestAssessment.actionType}. Recorded {formatDateTime(latestAssessment.createdAt)}.
        </Alert>
      )}
    </div>
  );
}
