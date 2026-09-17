import { createPrescription, PRESCRIPTION_STATUS } from '../domain';
import { appendAuditEvent } from './mockStore';
import { createMockService } from './createMockService';
import { mockStore } from './mockStore';

const baseService = createMockService(mockStore, 'prescriptions');

export const prescriptionQuantity = (prescription) => (
  Number(prescription?.treatmentQuantity || 0) + Number(prescription?.preventiveQuantity || 0)
);

export default {
  ...baseService,
  create: (input) => {
    const item = createPrescription({ ...input, status: input.status || PRESCRIPTION_STATUS.CREATED });
    baseService.create(item);
    appendAuditEvent({ type: 'PRESCRIPTION_CREATED', prescriptionId: item.prescriptionId, actorId: item.veterinarianId, caseId: item.caseId });
    return item;
  },
  setStatus: (prescriptionId, status, extra = {}) => (
    baseService.update(prescriptionId, { status, ...extra }, 'prescriptionId')
  ),
};
