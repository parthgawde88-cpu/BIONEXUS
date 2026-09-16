import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  CASE_STATUS,
  createVeterinarianAssessment,
  RISK_LEVELS,
} from '../domain';
import casesService from '../services/cases';
import prescriptionsService from '../services/prescriptions';
import samplesService from '../services/samples';
import { appendAuditEvent, mockStore } from '../services/mockStore';

const BionexusContext = createContext(null);

export function BionexusProvider({ children }) {
  const [cases, setCases] = useState(() => casesService.list());
  const [prescriptions, setPrescriptions] = useState(() => prescriptionsService.list());
  const [samples, setSamples] = useState(() => samplesService.list());
  const [assessments, setAssessments] = useState(() => [...mockStore.veterinarianAssessments]);
  const [emergencyTasks, setEmergencyTasks] = useState(() => [...mockStore.emergencyTasks]);

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
    const prescription = prescriptionsService.create(input);
    setPrescriptions(prescriptionsService.list());
    return prescription;
  };

  const createEmergencyTask = (input) => {
    const task = { taskId: `TASK-${Date.now()}`, status: 'URGENT', createdAt: new Date().toISOString(), ...input };
    mockStore.emergencyTasks.push(task);
    appendAuditEvent({ type: 'EMERGENCY_FIELD_TASK_CREATED', caseId: input.caseId, actorId: input.createdBy });
    setEmergencyTasks((current) => [...current, task]);
    return task;
  };

  const value = useMemo(() => ({
    users: mockStore.users,
    farmers: mockStore.farmers,
    animals: mockStore.animals,
    flocks: mockStore.flocks,
    veterinarians: mockStore.veterinarians,
    medicines: mockStore.medicines,
    inventory: mockStore.inventory,
    alerts: mockStore.alerts,
    riskZones: mockStore.riskZones,
    notifications: mockStore.notifications,
    emergencyTasks,
    auditEvents: mockStore.auditEvents,
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
    createEmergencyTask,
  }), [cases, assessments, prescriptions, samples, emergencyTasks]);

  return <BionexusContext.Provider value={value}>{children}</BionexusContext.Provider>;
}

export function useBionexus() {
  const context = useContext(BionexusContext);
  if (!context) throw new Error('useBionexus must be used inside BionexusProvider');
  return context;
}
