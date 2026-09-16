import { CASE_STATUS, createCase } from '../domain';
import { appendAuditEvent, mockStore } from './mockStore';
import { createMockService } from './createMockService';

const baseService = createMockService(mockStore, 'cases');

export default {
  ...baseService,
  submit: (input) => {
    const item = createCase(input);
    baseService.create(item);
    appendAuditEvent({ type: 'CASE_SUBMITTED', caseId: item.caseId, actorId: item.submittedBy });
    return item;
  },
  assignToVeterinarian: (caseId, veterinarianId) => baseService.update(caseId, { veterinarianId, status: CASE_STATUS.VET_REVIEW }, 'caseId'),
};
