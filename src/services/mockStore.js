import {
  CASE_STATUS,
  createCase,
  createPrescription,
  createSample,
  SAMPLE_STATUS,
} from '../domain';

export const mockStore = {
  users: [
    { id: 'USR-001', role: 'FARMER', name: 'Bhupesh Paliwal', mobile: '9876543210', status: 'ACTIVE' },
    { id: 'USR-002', role: 'SEVA_SAKHI', name: 'Janvi Madam', mobile: '9876543211', status: 'ACTIVE' },
    { id: 'USR-003', role: 'VETERINARIAN', name: 'Dr. Parth Gawde', mobile: '9876543212', status: 'ACTIVE' },
    { id: 'USR-004', role: 'KENDRA', name: 'Kavita Sharma', mobile: '9876543213', status: 'ACTIVE' },
  ],
  farmers: [{ farmerId: 'FR-4821', userId: 'USR-001', name: 'Bhupesh Paliwal', mobile: '9876543210', villageId: 'VIL-UDAIPUR', address: 'Udaipur, Rajasthan', preferredLanguage: 'hi' }],
  animals: [
    { rapidId: 'BLX-204', farmerId: 'FR-4821', species: 'CATTLE', breed: 'Tharparkar', sex: 'FEMALE', age: '4 years', healthStatus: 'HEALTHY', vaccinationStatus: 'CURRENT', status: 'ACTIVE' },
    { rapidId: 'BLX-118', farmerId: 'FR-4821', species: 'BUFFALO', breed: 'Murrah', sex: 'FEMALE', age: '6 years', healthStatus: 'MONITORING', vaccinationStatus: 'DUE', status: 'ACTIVE' },
  ],
  flocks: [{ flockId: 'FLK-017', farmerId: 'FR-4821', species: 'POULTRY', breed: 'Broiler', count: 240, age: '5 weeks', healthStatus: 'HEALTHY', vaccinationStatus: 'CURRENT', status: 'ACTIVE' }],
  cases: [createCase({ caseId: 'CASE-204', farmerId: 'FR-4821', animalId: 'BLX-204', submittedBy: 'USR-001', submittedAt: '2026-08-15T09:15:00.000Z', symptoms: ['reduced milk yield'], status: CASE_STATUS.VET_REVIEW, riskLevel: 'YELLOW', veterinarianId: 'USR-003' })],
  veterinarians: [{ id: 'USR-003', veterinarianId: 'USR-003', name: 'Dr. Parth Gawde', status: 'AVAILABLE', villages: ['VIL-UDAIPUR'] }],
  prescriptions: [],
  samples: [createSample({ sampleId: 'SAMPLE-1042', caseId: 'CASE-204', sampleType: 'MILK_CULTURE', kendraId: 'KEN-UDAIPUR', status: SAMPLE_STATUS.RECEIVED_AT_KENDRA, qrCodeReference: 'QR-SAMPLE-1042' })],
  medicines: [{ medicineId: 'MED-001', name: 'Veterinary supportive care', batch: 'B-2026-04', expiry: '2027-04-30', quantity: 120 }],
  inventory: [{ inventoryId: 'INV-001', kendraId: 'KEN-UDAIPUR', medicineId: 'MED-001', availableQuantity: 120, reservedQuantity: 0, usedQuantity: 0 }],
  prescriptionOtps: [],
  alerts: [],
  riskZones: [],
  notifications: [],
  auditEvents: [],
};

export const appendAuditEvent = (event) => {
  const auditEvent = { id: `AUDIT-${Date.now()}`, createdAt: new Date().toISOString(), ...event };
  mockStore.auditEvents.push(auditEvent);
  return auditEvent;
};
