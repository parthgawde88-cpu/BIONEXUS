import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBionexus } from '../context';
import PrescriptionWorkflowStrip from '../components/PrescriptionWorkflowStrip';
import DiseaseRiskMap from '../components/DiseaseRiskMap';
import { PRESCRIPTION_STATUS } from '../domain';
import { getTranslation } from '../utils/farmerTranslations';
import { getEmergencyContactInfo } from '../utils/adapters';
import {
  Bell,
  MapPin,
  Wheat,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  Clock3,
  CalendarClock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Plus,
  Globe,
  X,
  PhoneCall,
  Phone,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Alert from '../components/ui/Alert';
import { Input, Select } from '../components/ui/FormField';

const getBadgeVariant = (status) => {
  switch (status) {
    case 'Healthy':
    case 'HEALTHY':
      return 'success';
    case 'Monitoring':
    case 'MONITORING':
      return 'warning';
    case 'Vaccination due':
    case 'DUE':
      return 'info';
    default:
      return 'neutral';
  }
};

const getAlertVariant = (tone) => {
  switch (tone) {
    case 'CRITICAL':
    case 'danger':
    case 'HIGH':
      return 'danger';
    case 'warning':
    case 'MEDIUM':
      return 'warning';
    case 'info':
    case 'LOW':
      return 'info';
    default:
      return 'neutral';
  }
};

const prescriptionStatusVariant = (status) => ({
  [PRESCRIPTION_STATUS.CREATED]: 'neutral',
  [PRESCRIPTION_STATUS.OTP_PENDING]: 'warning',
  [PRESCRIPTION_STATUS.VERIFIED]: 'info',
  [PRESCRIPTION_STATUS.DISPENSED]: 'success',
}[status] || 'neutral');

export default function FarmerPage() {
  const navigate = useNavigate();
  const {
    farmers,
    prescriptions,
    medicines,
    otps,
    animals,
    flocks,
    addAnimal,
    addFlock,
    alerts,
    riskZones,
    cases,
    farmerLanguage,
    setFarmerLanguage,
  } = useBionexus();

  const farmer = farmers[0];
  const farmerPrescriptions = prescriptions.filter((item) => item.farmerId === farmer?.farmerId);
  const farmerCases = cases.filter((item) => item.farmerId === farmer?.farmerId);

  // Calculate total animals: individual animals + sum of counts in poultry flocks
  const totalAnimalCount = animals.length + flocks.reduce((acc, f) => acc + (Number(f.count) || 0), 0);

  // Modal State for Add Animal / Flock & Emergency Helpline
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [addType, setAddType] = useState('animal'); // 'animal' or 'flock'
  const [formData, setFormData] = useState({
    species: 'CATTLE',
    breed: 'Tharparkar',
    age: '2 years',
    count: 50,
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (addType === 'animal') {
      addAnimal({
        farmerId: farmer?.farmerId,
        species: formData.species,
        breed: formData.breed,
        age: formData.age,
        sex: 'FEMALE',
      });
    } else {
      addFlock({
        farmerId: farmer?.farmerId,
        species: 'POULTRY',
        breed: formData.breed || 'Broiler',
        count: Number(formData.count),
        age: formData.age || '4 weeks',
      });
    }
    setShowAddModal(false);
  };

  const t = (key) => getTranslation(key, farmerLanguage);
  const emergencyInfo = getEmergencyContactInfo();

  const quickActions = [
    { title: t('reportHealthIssue'), icon: HeartPulse, variant: 'primary', path: '/farmer/cases/new' },
    { title: 'Contact Veterinarian', icon: Stethoscope, variant: 'secondary', path: '/veterinarian' },
    { title: 'Emergency / Toll-Free', icon: PhoneCall, variant: 'outline', onClick: () => setShowEmergencyModal(true) },
    { title: t('caseHistory'), icon: FileText, variant: 'ghost', path: '/farmer/cases' },
    // NOTE: 'Request laboratory test' has been intentionally removed (no Laboratory role)
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8">

      {/* Header & Language Switcher */}
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-sm">
            <Wheat className="h-7 w-7" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{t('portalTitle')}</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {t('welcomeBack')}, {farmer?.name || 'Bhupesh Paliwal'}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start xl:self-auto">
          {/* Language Switcher */}
          <div className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-800 shadow-card">
            <Globe className="h-4 w-4 text-emerald-600" />
            <span className="text-xs text-slate-600 font-medium">{t('languageLabel')}:</span>
            <select
              value={farmerLanguage}
              onChange={(e) => setFarmerLanguage(e.target.value)}
              className="bg-transparent font-bold text-emerald-800 focus:outline-none cursor-pointer text-sm"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="mr">मराठी (Marathi)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-card">
            <MapPin className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            <span>Village: {farmer?.address || 'Udaipur, Rajasthan'}</span>
          </div>

          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-card transition-colors hover:bg-slate-50"
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Prescription History Card */}
      <Card className="mb-6 border-emerald-200 bg-white">
        <CardHeader>
          <div>
            <CardTitle>{t('prescriptions')}</CardTitle>
            <CardDescription>Veterinarian prescriptions are read-only</CardDescription>
          </div>
          <FileText className="h-5 w-5 text-emerald-600" />
        </CardHeader>
        {farmerPrescriptions.length === 0 ? (
          <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">No prescriptions yet.</p>
        ) : (
          <div className="space-y-3">
            {farmerPrescriptions.map((item) => {
              const medicine = medicines.find((entry) => entry.medicineId === item.medicineId);
              const otp = otps.find((entry) => entry.prescriptionId === item.prescriptionId && entry.status === 'ACTIVE');
              return (
                <div key={item.prescriptionId} className="rounded-xl border border-slate-200 p-4">
                  <PrescriptionWorkflowStrip status={item.status} medicineVerified={item.medicineVerified} />
                  <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
                    <div>
                      <p className="text-xs text-slate-500">Prescription ID</p>
                      <p className="mt-1 font-semibold text-slate-900">{item.prescriptionId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Case ID</p>
                      <p className="mt-1 font-semibold text-slate-800">{item.caseId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Medicine</p>
                      <p className="mt-1 text-sm text-slate-700">{medicine?.name || item.medicineId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Quantity</p>
                      <p className="mt-1 text-sm text-slate-700">
                        {Number(item.treatmentQuantity || 0) + Number(item.preventiveQuantity || 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Instructions</p>
                      <p className="mt-1 text-sm text-slate-700">{item.instructions || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Status</p>
                      <Badge className="mt-1" variant={prescriptionStatusVariant(item.status)}>
                        {item.status === 'DISPENSED' ? t('dispensed') : item.status === 'OTP_PENDING' ? t('otpPending') : item.status}
                      </Badge>
                    </div>
                  </div>
                  {otp && item.status === PRESCRIPTION_STATUS.OTP_PENDING && (
                    <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 flex items-center justify-between">
                      <span><strong>Verification OTP:</strong> {otp.code} (Share this with Pashu Sakhi for dispensing)</span>
                      <span className="text-[10px] text-amber-700">Expires: {new Date(otp.expiresAt).toLocaleTimeString()}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Summary Banner */}
      <Card className="mb-6 border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-white">
        <div className="flex flex-col gap-4 p-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700">{t('livestockOverview')}</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">Your farm remains in good operational health.</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Clock3 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            <span>Active Connected Bio-Network</span>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* Total Animals Card (UPDATED WORDING & COUNT) */}
        <Card className="border-slate-200 bg-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">{t('totalAnimals')}</p>
              <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{totalAnimalCount}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Wheat className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600">{t('acrossSheds')}</p>
        </Card>

        {/* Active Health Cases */}
        <Card className="border-slate-200 bg-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">{t('activeHealthCases')}</p>
              <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                {String(farmerCases.length).padStart(2, '0')}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <HeartPulse className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600">Shared canonical cases</p>
        </Card>

        {/* Vaccinations Due */}
        <Card className="border-slate-200 bg-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">{t('vaccinationsDue')}</p>
              <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">07</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600">Due in next 14 days</p>
        </Card>

        {/* Recent Consultations */}
        <Card className="border-slate-200 bg-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">{t('recentConsultations')}</p>
              <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">12</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              <Stethoscope className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600">Last 30 days</p>
        </Card>
      </div>

      {/* Main Livestock & Alerts Section */}
      <div className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <div>
              <CardTitle>{t('livestockOverview')}</CardTitle>
              <CardDescription>Current individual animals and poultry flock records</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={Plus}
              iconPosition="left"
              onClick={() => setShowAddModal(true)}
            >
              {t('addAnimal')}
            </Button>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead>
                <tr className="text-slate-500">
                  <th className="pb-3 pr-4 font-medium">Rapid ID / Flock ID</th>
                  <th className="pb-3 pr-4 font-medium">Type / Species</th>
                  <th className="pb-3 pr-4 font-medium">Age / Count</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 text-right font-medium">Vaccination</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Individual Animals */}
                {animals.map((animal) => (
                  <tr key={animal.rapidId} className="align-middle">
                    <td className="py-3 pr-4 font-medium text-slate-800">{animal.rapidId}</td>
                    <td className="py-3 pr-4 text-slate-600">{animal.species} ({animal.breed})</td>
                    <td className="py-3 pr-4 text-slate-600">{animal.age}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={getBadgeVariant(animal.healthStatus)} size="sm" dot>
                        {animal.healthStatus}
                      </Badge>
                    </td>
                    <td className="py-3 text-right text-slate-600">{animal.vaccinationStatus}</td>
                  </tr>
                ))}
                {/* Poultry Flocks */}
                {flocks.map((flock) => (
                  <tr key={flock.flockId} className="align-middle bg-slate-50/50">
                    <td className="py-3 pr-4 font-semibold text-emerald-800">{flock.flockId} (Poultry Batch)</td>
                    <td className="py-3 pr-4 text-slate-600">POULTRY ({flock.breed})</td>
                    <td className="py-3 pr-4 font-bold text-slate-800">{flock.count} birds</td>
                    <td className="py-3 pr-4">
                      <Badge variant={getBadgeVariant(flock.healthStatus)} size="sm" dot>
                        {flock.healthStatus}
                      </Badge>
                    </td>
                    <td className="py-3 text-right text-slate-600">{flock.vaccinationStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Health Alerts & Vaccination Reminders */}
        <div className="space-y-6">
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <div>
                <CardTitle>{t('healthAlerts')}</CardTitle>
                <CardDescription>Priority issues and biosecurity zone alerts</CardDescription>
              </div>
            </CardHeader>

            <div className="space-y-4">
              {alerts.length > 0 && alerts.map((alt) => (
                <div key={alt.alertId} className="rounded-xl border border-red-200 bg-red-50 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="mt-0.5 h-4 w-4 text-red-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-red-900">{alt.disease}</p>
                        <p className="mt-1 text-xs text-red-700">Outbreak Alert · Radius {alt.radiusKm} km · {alt.location?.village || 'Local Region'}</p>
                      </div>
                    </div>
                    <Badge variant="danger" size="sm">{alt.severity}</Badge>
                  </div>
                </div>
              ))}
              {[
                { title: 'Mastitis check recommended', detail: 'Cow BLX-118 shows mild swelling and reduced appetite.', severity: 'High', tone: 'danger' },
                { title: 'Vaccination reminder', detail: 'Goat BLX-347 vaccination is due this week.', severity: 'Medium', tone: 'warning' },
              ].map((alert) => (
                <div key={alert.title} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-600" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">{alert.title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-600">{alert.detail}</p>
                      </div>
                    </div>
                    <Badge variant={getAlertVariant(alert.tone)} size="sm">
                      {alert.severity}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <div>
                <CardTitle>{t('vaccinationReminders')}</CardTitle>
                <CardDescription>Upcoming animal protection actions</CardDescription>
              </div>
            </CardHeader>

            <div className="space-y-3">
              {[
                'FMD vaccination for 3 cattle — due by 18 Aug',
                'Deworming cycle for goats — due by 20 Aug',
                'Foot care review for buffalo group — due by 22 Aug',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-lg border border-emerald-100 bg-emerald-50/60 p-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                  <span className="text-sm text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Disease Risk Heatmap Section */}
      <div className="mt-8">
        <DiseaseRiskMap alerts={alerts} riskZones={riskZones} />
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <div>
              <CardTitle>{t('quickActions')}</CardTitle>
              <CardDescription>Useful tasks for current farm operations</CardDescription>
            </div>
          </CardHeader>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {quickActions.map(({ title, icon: Icon, variant, path, onClick }) => (
              <Button
                key={title}
                variant={variant}
                className="h-auto justify-between rounded-xl px-4 py-3"
                icon={ArrowRight}
                iconPosition="right"
                onClick={() => (onClick ? onClick() : path && navigate(path))}
              >
                <span className="flex items-center gap-2">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span>{title}</span>
                </span>
              </Button>
            ))}
          </div>
        </Card>
      </div>

      {/* ADD ANIMAL / FLOCK MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-lg bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">{t('addAnimal')}</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAddType('animal')}
                  className={`rounded-xl border p-3 text-left text-sm font-semibold transition-all ${addType === 'animal' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-600'}`}
                >
                  {t('individualLivestock')}
                </button>
                <button
                  type="button"
                  onClick={() => setAddType('flock')}
                  className={`rounded-xl border p-3 text-left text-sm font-semibold transition-all ${addType === 'flock' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-600'}`}
                >
                  {t('poultryFlock')}
                </button>
              </div>

              {addType === 'animal' ? (
                <>
                  <Select
                    label={t('species')}
                    value={formData.species}
                    onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                  >
                    <option value="CATTLE">Cattle (Cow)</option>
                    <option value="BUFFALO">Buffalo</option>
                    <option value="GOAT">Goat</option>
                    <option value="SHEEP">Sheep</option>
                  </Select>
                  <Input
                    label={t('breed')}
                    value={formData.breed}
                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                    placeholder="e.g. Gir / Tharparkar / Murrah"
                  />
                  <Input
                    label={t('age')}
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="e.g. 3 years"
                  />
                </>
              ) : (
                <>
                  <Input
                    label="Breed / Type"
                    value={formData.breed}
                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                    placeholder="e.g. Broiler / Layer / Kadaknath"
                  />
                  <Input
                    label={t('populationCount')}
                    type="number"
                    min="1"
                    value={formData.count}
                    onChange={(e) => setFormData({ ...formData, count: e.target.value })}
                  />
                  <Input
                    label={t('age')}
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="e.g. 5 weeks"
                  />
                </>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>
                  {t('cancel')}
                </Button>
                <Button type="submit" variant="primary">
                  {t('saveAnimal')}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* EMERGENCY HELPLINE MODAL */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-white p-6 shadow-2xl border-red-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2 text-red-600 font-bold">
                <PhoneCall className="h-5 w-5" />
                <span>Emergency Biosecurity Assistance</span>
              </div>
              <button onClick={() => setShowEmergencyModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
                <Phone className="mx-auto h-8 w-8 text-red-600 mb-2" />
                <p className="text-sm font-semibold text-slate-900">{emergencyInfo.displayText}</p>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">{emergencyInfo.instruction}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">Emergency Dispatch Context:</p>
                <p>• Farmer ID: {farmer?.farmerId}</p>
                <p>• Location: {farmer?.address}</p>
                <p>• Priority: Immediate Veterinary Field Unit</p>
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="secondary" onClick={() => setShowEmergencyModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
}
