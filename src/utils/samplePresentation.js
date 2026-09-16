export function sampleTypeLabel(type) {
  return { BLOOD: 'Blood', SWAB: 'Swab', TISSUE: 'Tissue', FECAL: 'Fecal', OTHER: 'Other', MILK_CULTURE: 'Milk culture', RESPIRATORY_SWAB: 'Respiratory swab' }[type] || type;
}

export function samplePriorityVariant(priority) {
  return { ROUTINE: 'neutral', PRIORITY: 'warning', URGENT: 'danger', HIGH: 'warning', CRITICAL: 'danger' }[priority] || 'info';
}
