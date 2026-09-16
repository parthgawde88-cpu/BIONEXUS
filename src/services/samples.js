import { createSample, SAMPLE_STATUS, SAMPLE_STATUS_SEQUENCE } from '../domain';
import { appendAuditEvent, mockStore } from './mockStore';
import { createMockService } from './createMockService';

const baseService = createMockService(mockStore, 'samples');
const nextSampleId = () => {
  const year = new Date().getFullYear();
  const sequence = mockStore.samples.reduce((highest, sample) => {
    const match = sample.sampleId?.match(/^SMP-\d{4}-(\d{4})$/);
    return Math.max(highest, match ? Number(match[1]) : 0);
  }, 0) + 1;
  return `SMP-${year}-${String(sequence).padStart(4, '0')}`;
};

const transition = (sampleId, status, actorId, patch = {}) => {
  const sample = baseService.getById(sampleId, 'sampleId');
  if (!sample) return null;
  const currentIndex = SAMPLE_STATUS_SEQUENCE.indexOf(sample.status);
  const nextIndex = SAMPLE_STATUS_SEQUENCE.indexOf(status);
  if (nextIndex !== currentIndex + 1) return null;
  const event = { status, timestamp: new Date().toISOString(), responsibleRole: patch.responsibleRole || 'SYSTEM', location: patch.location || null };
  const updated = baseService.update(sampleId, { ...patch, status, history: [...(sample.history || []), event] }, 'sampleId');
  appendAuditEvent({ type: `SAMPLE_${status}`, sampleId, actorId, metadata: event });
  return updated;
};

export default {
  ...baseService,
  request: (input) => {
    const sampleId = nextSampleId();
    return baseService.create(createSample({ ...input, sampleId, status: SAMPLE_STATUS.REQUESTED, requestedAt: new Date().toISOString(), qrCodeReference: `sample:${sampleId}` }));
  },
  collect: (sampleId, input) => transition(sampleId, SAMPLE_STATUS.COLLECTED, input.collectedBy, { ...input, responsibleRole: 'SEVA_SAKHI', collectedAt: input.collectedAt || new Date().toISOString(), collectionLocation: input.collectionLocation || null }),
  receive: (sampleId, input) => transition(sampleId, SAMPLE_STATUS.RECEIVED_AT_KENDRA, input.receivedBy, { ...input, responsibleRole: 'KENDRA', receivedAt: input.receivedAt || new Date().toISOString() }),
  store: (sampleId, input) => transition(sampleId, SAMPLE_STATUS.STORED, input.receivedBy, { ...input, responsibleRole: 'KENDRA', storedAt: input.storedAt || new Date().toISOString() }),
  pickup: (sampleId, input) => transition(sampleId, SAMPLE_STATUS.PICKED_UP, input.pickedUpBy, { ...input, responsibleRole: 'KENDRA', pickedUpAt: input.pickedUpAt || new Date().toISOString() }),
  startTesting: (sampleId, input) => transition(sampleId, SAMPLE_STATUS.TESTING, input.startedBy, { ...input, responsibleRole: 'KENDRA', testingStartedAt: input.testingStartedAt || new Date().toISOString() }),
  submitResult: (sampleId, input) => transition(sampleId, SAMPLE_STATUS.RESULT_AVAILABLE, input.submittedBy, { ...input, responsibleRole: 'KENDRA' }),
  reviewResult: (sampleId, input) => transition(sampleId, SAMPLE_STATUS.REVIEWED, input.reviewedBy, { ...input, responsibleRole: 'VETERINARIAN', reviewedAt: input.reviewedAt || new Date().toISOString() }),
};
