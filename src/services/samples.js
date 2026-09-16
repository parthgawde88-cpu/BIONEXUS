import { createSample, SAMPLE_STATUS } from '../domain';
import { appendAuditEvent, mockStore } from './mockStore';
import { createMockService } from './createMockService';

const baseService = createMockService(mockStore, 'samples');
export default {
  ...baseService,
  request: (input) => baseService.create(createSample(input)),
  updateStatus: (sampleId, status, actorId) => {
    const sample = baseService.update(sampleId, { status }, 'sampleId');
    if (sample) appendAuditEvent({ type: status === SAMPLE_STATUS.COLLECTED ? 'SAMPLE_COLLECTION' : 'SAMPLE_STATUS_UPDATE', sampleId, actorId });
    return sample;
  },
};
