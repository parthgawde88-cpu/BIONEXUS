export function getCaseSubject(caseItem, animals, flocks) {
  if (caseItem.flockId) {
    const flock = flocks.find((item) => item.flockId === caseItem.flockId);
    return { id: caseItem.flockId, label: flock ? `${flock.species} flock` : 'Poultry flock', details: flock };
  }
  const animal = animals.find((item) => item.rapidId === caseItem.animalId);
  return { id: caseItem.animalId, label: animal?.species || 'Animal', details: animal };
}

export function formatCaseStatus(status) {
  return status.replaceAll('_', ' ');
}

export function formatDateTime(value) {
  if (!value) return 'Not recorded';
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

export function riskVariant(risk) {
  return { LOW: 'success', YELLOW: 'warning', RED: 'danger' }[risk] || 'neutral';
}

export function statusVariant(status) {
  return {
    SUBMITTED: 'info',
    AI_PROCESSING: 'info',
    VET_REVIEW: 'warning',
    ACTION_REQUIRED: 'warning',
    RESOLVED: 'success',
    CLOSED: 'neutral',
  }[status] || 'neutral';
}
