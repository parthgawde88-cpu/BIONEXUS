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
  const [assessments, setAssessments] = useState([]);

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
    const status = input.riskLevel === RISK_LEVELS.LOW ? CASE_STATUS.ACTION_REQUIRED : CASE_STATUS.ACTION_REQUIRED;
    casesService.update(input.caseId, { riskLevel: input.riskLevel, status, veterinarianId: input.veterinarianId }, 'caseId');
    appendAuditEvent({ type: 'VETERINARIAN_DECISION', caseId: input.caseId, actorId: input.veterinarianId, riskLevel: input.riskLevel });
    setAssessments((current) => [...current, assessment]);
    setCases(casesService.list());
    return assessment;
  };

  const requestSample = (input) => {
    const sample = samplesService.request(input);
    setSamples(samplesService.list());
    return sample;
  };

  const createPrescription = (input) => {
    const prescription = prescriptionsService.create(input);
    setPrescriptions(prescriptionsService.list());
    return prescription;
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
    auditEvents: mockStore.auditEvents,
    cases,
    assessments,
    prescriptions,
    samples,
    submitCase,
    assignCaseToVeterinarian,
    recordVeterinarianDecision,
    requestSample,
    createPrescription,
  }), [cases, assessments, prescriptions, samples]);

  return <BionexusContext.Provider value={value}>{children}</BionexusContext.Provider>;
}

export function useBionexus() {
  const context = useContext(BionexusContext);
  if (!context) throw new Error('useBionexus must be used inside BionexusProvider');
  return context;
}
