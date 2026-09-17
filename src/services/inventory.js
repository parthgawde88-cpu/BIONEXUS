import { appendAuditEvent, mockStore } from './mockStore';
import { createMockService } from './createMockService';

const baseService = createMockService(mockStore, 'inventory');
export default {
  ...baseService,
  listTransactions: () => [...mockStore.inventoryTransactions],
  findByMedicine: (medicineId) => mockStore.inventory.find((item) => item.medicineId === medicineId) || null,
  recordDispensing: (inventoryId, quantity, actorId, extra = {}) => {
    const entry = baseService.getById(inventoryId, 'inventoryId');
    if (!entry) return { ok: false, error: 'NOT_FOUND' };
    const amount = Number(quantity || 0);
    if (amount <= 0) return { ok: false, error: 'INVALID_QUANTITY', entry };
    if (amount > entry.availableQuantity) return { ok: false, error: 'INSUFFICIENT_STOCK', entry };
    const updated = baseService.update(inventoryId, {
      availableQuantity: entry.availableQuantity - amount,
      usedQuantity: entry.usedQuantity + amount,
    }, 'inventoryId');
    const transaction = {
      transactionId: `INVTX-${Date.now()}`,
      inventoryId,
      medicineId: entry.medicineId,
      quantity: amount,
      type: 'DISPENSE',
      actorId: actorId || null,
      prescriptionId: extra.prescriptionId || null,
      createdAt: new Date().toISOString(),
    };
    mockStore.inventoryTransactions.push(transaction);
    appendAuditEvent({ type: 'INVENTORY_UPDATED', inventoryId, quantity: amount, actorId, prescriptionId: extra.prescriptionId });
    return { ok: true, entry: updated, transaction };
  },
};
