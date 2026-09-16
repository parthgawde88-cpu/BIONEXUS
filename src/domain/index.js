/**
 * Shared BIONEXUS domain contracts.
 * These JSDoc shapes keep the JavaScript app aligned with the future API models.
 */

export const ROLES = Object.freeze({
  FARMER: 'FARMER',
  SEVA_SAKHI: 'SEVA_SAKHI',
  VETERINARIAN: 'VETERINARIAN',
  KENDRA: 'KENDRA',
  ADMIN: 'ADMIN',
});

export const CASE_STATUS = Object.freeze({
  SUBMITTED: 'SUBMITTED',
  AI_PROCESSING: 'AI_PROCESSING',
  VET_REVIEW: 'VET_REVIEW',
  ACTION_REQUIRED: 'ACTION_REQUIRED',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
});

export const RISK_LEVELS = Object.freeze({ LOW: 'LOW', YELLOW: 'YELLOW', RED: 'RED' });

export const SAMPLE_STATUS = Object.freeze({
  REQUESTED: 'REQUESTED',
  COLLECTED: 'COLLECTED',
  RECEIVED_AT_KENDRA: 'RECEIVED_AT_KENDRA',
  STORED: 'STORED',
  PICKED_UP: 'PICKED_UP',
  TESTING: 'TESTING',
  RESULT_AVAILABLE: 'RESULT_AVAILABLE',
  REVIEWED: 'REVIEWED',
});

export const PRESCRIPTION_ITEM_TYPES = Object.freeze({
  TREATMENT: 'TREATMENT',
  PREVENTIVE_ACTION: 'PREVENTIVE_ACTION',
});

/** @typedef {{ id: string, role: string, name: string, mobile: string, status: string }} User */
/** @typedef {{ farmerId: string, userId: string, name: string, mobile: string, villageId: string, address: string, preferredLanguage: string }} FarmerProfile */
/** @typedef {{ rapidId: string, farmerId: string, species: string, breed: string, sex: string, age: string|number, healthStatus: string, vaccinationStatus: string, status: string }} Animal */
/** @typedef {{ flockId: string, farmerId: string, species: string, breed: string, count: number, age: string|number, healthStatus: string, vaccinationStatus: string, status: string }} Flock */
/** @typedef {{ caseId: string, farmerId: string, animalId?: string, flockId?: string, submittedBy: string, submittedAt: string, location: Object|null, symptoms: string[], voiceNote: string|null, photo: string|null, status: string, riskLevel: string|null, veterinarianId: string|null }} Case */
/** @typedef {{ id: string, caseId: string, type: string, uri: string, timestamp: string, metadata: Object }} CaseMedia */
/** @typedef {{ caseId: string, imageQuality: Object|null, visualIndicators: string[], speechTranscript: string|null, translatedText: string|null, duplicateFlag: boolean, riskSupport: Object|null, modelStatus: string }} AiAnalysis */
/** @typedef {{ caseId: string, veterinarianId: string, assessment: string, riskLevel: string, clinicalNotes: string, actionType: string|null, createdAt: string }} VeterinarianAssessment */
/** @typedef {{ prescriptionId: string, caseId: string, veterinarianId: string, farmerId: string, status: string, createdAt: string, items: Object[] }} Prescription */
/** @typedef {{ sampleId: string, caseId: string, collectedBy: string|null, sampleType: string, collectedAt: string|null, kendraId: string|null, status: string, qrCodeReference: string|null }} Sample */
/** @typedef {{ medicineId: string, name: string, batch: string, expiry: string, quantity: number }} Medicine */
/** @typedef {{ kendraId: string, medicineId: string, availableQuantity: number, reservedQuantity: number, usedQuantity: number }} Inventory */
/** @typedef {{ prescriptionId: string, farmerId: string, status: string, expiresAt: string }} PrescriptionOtp */
/** @typedef {{ alertId: string, caseId: string, disease: string, location: Object, severity: string, createdByVeterinarian: string, status: string }} OutbreakAlert */
/** @typedef {{ id: string, alertId: string, geometry: Object, riskLevel: string }} RiskZone */
/** @typedef {{ id: string, type: string, actorId: string, caseId?: string, createdAt: string, metadata?: Object }} AuditEvent */

export const createCase = (input) => ({
  caseId: input.caseId || `CASE-${Date.now()}`,
  farmerId: input.farmerId,
  animalId: input.animalId,
  flockId: input.flockId,
  submittedBy: input.submittedBy,
  submittedAt: input.submittedAt || new Date().toISOString(),
  location: input.location || null,
  symptoms: input.symptoms || [],
  voiceNote: input.voiceNote || null,
  photo: input.photo || null,
  status: input.status || CASE_STATUS.SUBMITTED,
  riskLevel: input.riskLevel || null,
  veterinarianId: input.veterinarianId || null,
});

export const createVeterinarianAssessment = (input) => ({
  caseId: input.caseId,
  veterinarianId: input.veterinarianId,
  assessment: input.assessment || '',
  riskLevel: input.riskLevel,
  clinicalNotes: input.clinicalNotes || '',
  actionType: input.actionType || null,
  createdAt: input.createdAt || new Date().toISOString(),
});

export const createPrescription = (input) => ({
  prescriptionId: input.prescriptionId || `RX-${Date.now()}`,
  caseId: input.caseId,
  veterinarianId: input.veterinarianId,
  farmerId: input.farmerId,
  status: input.status || 'DRAFT',
  createdAt: input.createdAt || new Date().toISOString(),
  items: (input.items || []).map((item) => ({
    type: item.type || PRESCRIPTION_ITEM_TYPES.TREATMENT,
    medicineId: item.medicineId || null,
    eligibleAnimalIds: item.eligibleAnimalIds || [],
    eligibleFlockIds: item.eligibleFlockIds || [],
    quantity: item.quantity || 0,
    instructions: item.instructions || '',
  })),
});

export const createSample = (input) => ({
  sampleId: input.sampleId || `SAMPLE-${Date.now()}`,
  caseId: input.caseId,
  collectedBy: input.collectedBy || null,
  sampleType: input.sampleType,
  collectedAt: input.collectedAt || null,
  kendraId: input.kendraId || null,
  status: input.status || SAMPLE_STATUS.REQUESTED,
  qrCodeReference: input.qrCodeReference || null,
});

/** @type {Object} AI analysis is advisory only and never a clinical decision. */
export const createAiAnalysis = (input) => ({
  caseId: input.caseId,
  imageQuality: input.imageQuality || null,
  visualIndicators: input.visualIndicators || [],
  speechTranscript: input.speechTranscript || null,
  translatedText: input.translatedText || null,
  duplicateFlag: Boolean(input.duplicateFlag),
  riskSupport: input.riskSupport || null,
  modelStatus: input.modelStatus || 'NOT_STARTED',
});
