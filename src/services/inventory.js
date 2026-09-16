import { appendAuditEvent, mockStore } from './mockStore';
import { createMockService } from './createMockService';

const baseService = createMockService(mockStore, 'inventory');
export default {
  ...baseService,
  recordDispensing: (inventoryId, quantity, actorId) => {
    const entry = baseService.getById(inventoryId, 'inventoryId');
    if (!entry) return null;
    const updated = baseService.update(inventoryId, {
      availableQuantity: Math.max(0, entry.availableQuantity - quantity),
      usedQuantity: entry.usedQuantity + quantity,
    }, 'inventoryId');
    appendAuditEvent({ type: 'INVENTORY_UPDATE', inventoryId, quantity, actorId });
    return updated;
  },
};
