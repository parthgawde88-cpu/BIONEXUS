import { createPrescription } from '../domain';
import { appendAuditEvent, mockStore } from './mockStore';
import { createMockService } from './createMockService';

const baseService = createMockService(mockStore, 'prescriptions');
export default {
  ...baseService,
  create: (input) => {
    const item = createPrescription(input);
    baseService.create(item);
    appendAuditEvent({ type: 'PRESCRIPTION_CREATED', prescriptionId: item.prescriptionId, actorId: item.veterinarianId });
    return item;
  },
};
