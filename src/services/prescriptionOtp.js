import { appendAuditEvent, mockStore } from './mockStore';
import { createMockService } from './createMockService';

const baseService = createMockService(mockStore, 'prescriptionOtps');
const OTP_TTL_MS = 10 * 60 * 1000;

const randomCode = () => String(Math.floor(100000 + Math.random() * 900000));

export default {
  ...baseService,
  generate: ({ prescriptionId, farmerId, actorId }) => {
    mockStore.prescriptionOtps
      .filter((item) => item.prescriptionId === prescriptionId && item.status === 'ACTIVE')
      .forEach((item) => {
        item.status = 'SUPERSEDED';
      });
    const item = {
      otpId: `OTP-${Date.now()}`,
      prescriptionId,
      farmerId,
      code: randomCode(),
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + OTP_TTL_MS).toISOString(),
      actorId: actorId || null,
    };
    baseService.create(item);
    return item;
  },
  latestFor: (prescriptionId) => (
    [...mockStore.prescriptionOtps].reverse().find((item) => item.prescriptionId === prescriptionId) || null
  ),
  verify: ({ prescriptionId, farmerId, code, actorId }) => {
    const otp = [...mockStore.prescriptionOtps].reverse().find((item) => (
      item.prescriptionId === prescriptionId
      && item.farmerId === farmerId
      && item.status === 'ACTIVE'
    ));
    if (!otp) return { ok: false, error: 'NO_OTP' };
    if (new Date(otp.expiresAt).getTime() < Date.now()) {
      otp.status = 'EXPIRED';
      return { ok: false, error: 'EXPIRED' };
    }
    if (String(otp.code) !== String(code).trim()) return { ok: false, error: 'INVALID' };
    otp.status = 'USED';
    otp.verifiedAt = new Date().toISOString();
    otp.verifiedBy = actorId || null;
    appendAuditEvent({ type: 'OTP_VERIFIED', prescriptionId, farmerId, actorId });
    return { ok: true, otp };
  },
};
