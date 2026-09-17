import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  CASE_STATUS,
  createVeterinarianAssessment,
  PRESCRIPTION_STATUS,
} from '../domain';
import casesService from '../services/cases';
import prescriptionsService, { prescriptionQuantity } from '../services/prescriptions';
import samplesService from '../services/samples';
import prescriptionOtpService from '../services/prescriptionOtp';
import inventoryService from '../services/inventory';
import { appendAuditEvent, mockStore } from '../services/mockStore';

const BionexusContext = createContext(null);

export function BionexusProvider({ children }) {
  const [cases, setCases] = useState(() => casesService.list());
  const [prescriptions, setPrescriptions] = useState(() => prescriptionsService.list());
  const [samples, setSamples] = useState(() => samplesService.list());
  const [assessments, setAssessments] = useState(() => [...mockStore.veterinarianAssessments]);
  const [emergencyTasks, setEmergencyTasks] = useState(() => [...mockStore.emergencyTasks]);
  const [otps, setOtps] = useState(() => prescriptionOtpService.list());
  const [inventory, setInventory] = useState(() => inventoryService.list());
  const [inventoryTransactions, setInventoryTransactions] = useState(() => inventoryService.listTransactions());
  const [auditEvents, setAuditEvents] = useState(() => [...mockStore.auditEvents]);
  const [sessionUser, setSessionUser] = useState(null);
  const [animals, setAnimals] = useState(() => [...mockStore.animals]);
  const [flocks, setFlocks] = useState(() => [...mockStore.flocks]);
  const [alerts, setAlerts] = useState(() => [...mockStore.alerts]);
  const [riskZones, setRiskZones] = useState(() => [...mockStore.riskZones]);
  const [farmerLanguage, setFarmerLanguageState] = useState(() => localStorage.getItem('bionexus_farmer_lang') || 'hi');

  const setFarmerLanguage = (lang) => {
    localStorage.setItem('bionexus_farmer_lang', lang);
    setFarmerLanguageState(lang);
  };

  const addAnimal = (input) => {
    const newAnimal = {
      rapidId: input.rapidId || `BLX-${Math.floor(100 + Math.random() * 900)}`,
      farmerId: input.farmerId || 'FR-4821',
      species: input.species || 'CATTLE',
      breed: input.breed || 'Desi',
      sex: input.sex || 'FEMALE',
      age: input.age || '3 years',
      healthStatus: input.healthStatus || 'HEALTHY',
      vaccinationStatus: input.vaccinationStatus || 'CURRENT',
      status: 'ACTIVE',
    };
    mockStore.animals.push(newAnimal);
    setAnimals((prev) => [...prev, newAnimal]);
    return newAnimal;
  };

  const addFlock = (input) => {
    const newFlock = {
      flockId: input.flockId || `FLK-${Math.floor(10 + Math.random() * 90)}`,
      farmerId: input.farmerId || 'FR-4821',
      species: 'POULTRY',
      breed: input.breed || 'Broiler',
      count: Number(input.count || 100),
      age: input.age || '4 weeks',
      healthStatus: input.healthStatus || 'HEALTHY',
      vaccinationStatus: input.vaccinationStatus || 'CURRENT',
      status: 'ACTIVE',
    };
    mockStore.flocks.push(newFlock);
    setFlocks((prev) => [...prev, newFlock]);
    return newFlock;
  };

  const createDiseaseAlert = (input) => {
    const alertId = `ALT-${Date.now()}`;
    const alertItem = {
      alertId,
      caseId: input.caseId,
      disease: input.disease || 'High Priority Animal Disease',
      location: input.location || { village: 'Udaipur, Rajasthan' },
      severity: input.severity || 'HIGH',
      radiusKm: input.radiusKm || 5,
      createdByVeterinarian: input.createdBy || 'Dr. Parth Gawde',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };
    const riskZoneItem = {
      id: `RZ-${Date.now()}`,
      alertId,
      village: input.location?.village || 'Udaipur, Rajasthan',
      riskLevel: input.severity || 'HIGH',
      radiusKm: input.radiusKm || 5,
    };
    mockStore.alerts.push(alertItem);
    mockStore.riskZones.push(riskZoneItem);
    setAlerts([...mockStore.alerts]);
    setRiskZones([...mockStore.riskZones]);
    appendAuditEvent({ type: 'DISEASE_ALERT_CREATED', alertId, caseId: input.caseId, actorId: input.createdBy });
    return alertItem;
  };

  const refreshAudit = () => setAuditEvents([...mockStore.auditEvents]);
  const refreshPrescriptions = () => setPrescriptions(prescriptionsService.list());
  const refreshOtps = () => setOtps(prescriptionOtpService.list());
  const refreshInventory = () => {
    setInventory(inventoryService.list());
    setInventoryTransactions(inventoryService.listTransactions());
  };

  const submitCase = (input) => {
    const item = casesService.submit(input);
    setCases(casesService.list());
    return item;
  };

  const assignCaseToVeterinarian = (caseId, veterinarianId) => {
    const item = casesService.assignToVeterinarian(caseId, veterinarianId);
    setCases(casesService.list());
    return item;
  };

  const recordVeterinarianDecision = (input) => {
    const assessment = createVeterinarianAssessment(input);
    const status = CASE_STATUS.ACTION_REQUIRED;
    casesService.update(input.caseId, { riskLevel: input.riskLevel, status, veterinarianId: input.veterinarianId }, 'caseId');
    appendAuditEvent({ type: 'VETERINARIAN_DECISION', caseId: input.caseId, actorId: input.veterinarianId, riskLevel: input.riskLevel });
    mockStore.veterinarianAssessments.push(assessment);
    setAssessments((current) => [...current, assessment]);
    setCases(casesService.list());
    refreshAudit();

    if (input.createDiseaseAlert) {
      createDiseaseAlert({
        caseId: input.caseId,
        disease: input.diseaseName || 'Confirmed Infectious Outbreak',
        location: input.location,
        severity: input.riskLevel === 'RED' ? 'CRITICAL' : 'HIGH',
        radiusKm: input.radiusKm || 10,
        createdBy: input.veterinarianId,
      });
    }

    return assessment;
  };

  const refreshSamples = () => {
    setSamples(samplesService.list());
  };

  const requestSample = (input) => {
    const sample = samplesService.request(input);
    refreshSamples();
    return sample;
  };

  const transitionSample = (method, sampleId, input) => {
    const sample = samplesService[method](sampleId, input);
    if (sample) refreshSamples();
    return sample;
  };

  const createPrescription = (input) => {
    const prescription = prescriptionsService.create({ ...input, status: PRESCRIPTION_STATUS.CREATED });
    prescriptionOtpService.generate({
      prescriptionId: prescription.prescriptionId,
      farmerId: prescription.farmerId,
      actorId: prescription.veterinarianId,
    });
    prescriptionsService.setStatus(prescription.prescriptionId, PRESCRIPTION_STATUS.OTP_PENDING);
    refreshPrescriptions();
    refreshOtps();
    refreshAudit();
    return prescriptionsService.getById(prescription.prescriptionId, 'prescriptionId');
  };

  const verifyPrescriptionOtp = ({ prescriptionId, farmerId, code, actorId }) => {
    const prescription = prescriptionsService.getById(prescriptionId, 'prescriptionId');
    if (!prescription) return { ok: false, error: 'NOT_FOUND' };
    if (prescription.status !== PRESCRIPTION_STATUS.OTP_PENDING) return { ok: false, error: 'NOT_OTP_PENDING' };
    const result = prescriptionOtpService.verify({ prescriptionId, farmerId, code, actorId });
    if (!result.ok) {
      refreshOtps();
      return result;
    }
    prescriptionsService.setStatus(prescriptionId, PRESCRIPTION_STATUS.VERIFIED);
    refreshPrescriptions();
    refreshOtps();
    refreshAudit();
    return { ok: true };
  };

  const verifyPrescriptionMedicine = ({ prescriptionId, scannedCode, actorId }) => {
    const prescription = prescriptionsService.getById(prescriptionId, 'prescriptionId');
    if (!prescription) return { ok: false, error: 'NOT_FOUND' };
    if (prescription.status !== PRESCRIPTION_STATUS.VERIFIED) return { ok: false, error: 'OTP_REQUIRED' };
    const medicine = mockStore.medicines.find((item) => item.medicineId === prescription.medicineId);
    if (!medicine) return { ok: false, error: 'MEDICINE_MISSING' };
    const code = String(scannedCode || '').trim();
    const identityOk = code === medicine.medicineId || code === medicine.batch || code === `QR-${medicine.medicineId}`;
    if (!identityOk) return { ok: false, error: 'MEDICINE_MISMATCH' };
    const quantity = prescriptionQuantity(prescription);
    if (quantity <= 0) return { ok: false, error: 'INVALID_QUANTITY' };
    const stock = inventoryService.findByMedicine(prescription.medicineId);
    if (!stock || stock.availableQuantity < quantity) return { ok: false, error: 'INSUFFICIENT_STOCK', stock };
    prescriptionsService.setStatus(prescriptionId, PRESCRIPTION_STATUS.VERIFIED, {
      medicineVerified: true,
      verifiedBatch: medicine.batch,
    });
    appendAuditEvent({ type: 'MEDICINE_VERIFIED', prescriptionId, actorId, medicineId: medicine.medicineId, quantity });
    refreshPrescriptions();
    refreshAudit();
    return { ok: true, medicine, quantity, stock };
  };

  const dispensePrescription = ({ prescriptionId, actorId }) => {
    const prescription = prescriptionsService.getById(prescriptionId, 'prescriptionId');
    if (!prescription) return { ok: false, error: 'NOT_FOUND' };
    if (prescription.status !== PRESCRIPTION_STATUS.VERIFIED) return { ok: false, error: 'OTP_REQUIRED' };
    if (!prescription.medicineVerified) return { ok: false, error: 'MEDICINE_NOT_VERIFIED' };
    const quantity = prescriptionQuantity(prescription);
    const stock = inventoryService.findByMedicine(prescription.medicineId);
    if (!stock) return { ok: false, error: 'NOT_FOUND' };
    const result = inventoryService.recordDispensing(stock.inventoryId, quantity, actorId, { prescriptionId });
    if (!result.ok) return result;
    prescriptionsService.setStatus(prescriptionId, PRESCRIPTION_STATUS.DISPENSED, {
      dispensedAt: new Date().toISOString(),
      dispensedQuantity: quantity,
    });
    appendAuditEvent({ type: 'MEDICINE_DISPENSED', prescriptionId, actorId, quantity });
    refreshPrescriptions();
    refreshInventory();
    refreshAudit();
    return { ok: true, prescription: prescriptionsService.getById(prescriptionId, 'prescriptionId'), inventory: result.entry };
  };

  const createEmergencyTask = (input) => {
    const task = { taskId: `TASK-${Date.now()}`, status: 'URGENT', createdAt: new Date().toISOString(), ...input };
    mockStore.emergencyTasks.push(task);
    casesService.update(input.caseId, { riskLevel: 'RED', status: CASE_STATUS.ACTION_REQUIRED }, 'caseId');
    appendAuditEvent({ type: 'EMERGENCY_FIELD_TASK_CREATED', caseId: input.caseId, actorId: input.createdBy });
    setEmergencyTasks((current) => [...current, task]);
    setCases(casesService.list());
    refreshAudit();
    return task;
  };

  const login = ({ role, credential }) => {
    const user = mockStore.users.find((item) => item.role === role) || {
      id: `MOCK-${role}`,
      role,
      name: role === 'FARMER' ? 'Demo Farmer' : 'Demo User',
      mobile: credential,
      status: 'ACTIVE',
    };
    const authenticatedUser = { ...user, role, credential };
    setSessionUser(authenticatedUser);
    return authenticatedUser;
  };

  const logout = () => setSessionUser(null);

  const value = useMemo(() => ({
    users: mockStore.users,
    farmers: mockStore.farmers,
    animals,
    flocks,
    addAnimal,
    addFlock,
    veterinarians: mockStore.veterinarians,
    medicines: mockStore.medicines,
    inventory,
    inventoryTransactions,
    alerts,
    riskZones,
    createDiseaseAlert,
    farmerLanguage,
    setFarmerLanguage,
    notifications: mockStore.notifications,
    emergencyTasks,
    auditEvents,
    otps,
    sessionUser,
    login,
    logout,
    cases,
    assessments,
    prescriptions,
    samples,
    submitCase,
    assignCaseToVeterinarian,
    recordVeterinarianDecision,
    requestSample,
    collectSample: (sampleId, input) => transitionSample('collect', sampleId, input),
    receiveSample: (sampleId, input) => transitionSample('receive', sampleId, input),
    storeSample: (sampleId, input) => transitionSample('store', sampleId, input),
    pickupSample: (sampleId, input) => transitionSample('pickup', sampleId, input),
    startTesting: (sampleId, input) => transitionSample('startTesting', sampleId, input),
    submitSampleResult: (sampleId, input) => transitionSample('submitResult', sampleId, input),
    reviewSampleResult: (sampleId, input) => transitionSample('reviewResult', sampleId, input),
    createPrescription,
    verifyPrescriptionOtp,
    verifyPrescriptionMedicine,
    dispensePrescription,
    createEmergencyTask,
  }), [cases, assessments, prescriptions, samples, emergencyTasks, otps, inventory, inventoryTransactions, auditEvents, sessionUser, animals, flocks, alerts, riskZones, farmerLanguage]);

  return <BionexusContext.Provider value={value}>{children}</BionexusContext.Provider>;
}

export function useBionexus() {
  const context = useContext(BionexusContext);
  if (!context) throw new Error('useBionexus must be used inside BionexusProvider');
  return context;
}
