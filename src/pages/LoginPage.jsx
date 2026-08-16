import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Phone,
  ChevronRight,
  Lock,
} from 'lucide-react';
import Button  from '../components/ui/Button';
import { Input, Select } from '../components/ui/FormField';
import Alert  from '../components/ui/Alert';

// ─── Role options ─────────────────────────────────────────────────────────────
const ROLES = [
  { value: 'farmer',        label: 'Farmer — किसान' },
  { value: 'pashu-sakhi',   label: 'Pashu Sakhi — पशु सखी' },
  { value: 'veterinarian',  label: 'Veterinarian — पशु चिकित्सक' },
  { value: 'laboratory',    label: 'Laboratory — प्रयोगशाला' },
  { value: 'kendra',        label: 'Pashu Seva Kendra — पशु सेवा केंद्र' },
  { value: 'admin',         label: 'System Administrator' },
];

// ─── LoginPage ────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm]           = useState({ credential: '', password: '', role: '' });
  const [errors, setErrors]       = useState({});
  const [showPassword, setShow]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [serverError, setServerError] = useState('');

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setServerError('');
  };

  const validate = () => {
    const next = {};
    if (!form.credential.trim()) next.credential = 'Mobile number or email is required.';
    if (!form.password)          next.password   = 'Password is required.';
    if (!form.role)              next.role       = 'Please select your role.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    // UI prototype — simulated 1-second delay then redirect
    setTimeout(() => {
      setLoading(false);
      navigate(`/${form.role}`);
    }, 900);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex bg-slate-50">

      {/* ── Left panel (decorative) — hidden on mobile ──────────────────── */}
      <div className="hidden lg:flex lg:w-[420px] xl:w-[500px] flex-col justify-between bg-emerald-700 text-white p-10 flex-shrink-0">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight">BIONEXUS</p>
            <p className="text-[10px] text-emerald-200 uppercase tracking-widest">
              Smart Livestock Portal
            </p>
          </div>
        </div>

        {/* Tagline */}
        <div>
          <h2 className="text-3xl font-bold leading-snug mb-4">
            Protecting India's<br />Livestock Ecosystem
          </h2>
          <p className="text-sm text-emerald-200 leading-relaxed max-w-xs">
            A unified biosecurity and tele-veterinary platform connecting farmers, field
            workers, veterinarians, laboratories, and Pashu Seva Kendras across India.
          </p>

          {/* Feature list */}
          <ul className="mt-6 space-y-2">
            {[
              'Role-based access for all stakeholders',
              'Tele-consultation with veterinarians',
              'Real-time biosecurity alerts',
              'Disease surveillance & reporting',
            ].map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-emerald-100">
                <ChevronRight className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <p className="text-xs text-emerald-300">
          Smart India Hackathon 2025 · Government of India Initiative
        </p>
      </div>

      {/* ── Right panel (login form) ─────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">

          {/* Mobile brand */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-base font-bold text-slate-900">BIONEXUS</p>
              <p className="text-xs text-slate-500">Smart Livestock Portal</p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Sign in</h1>
            <p className="text-sm text-slate-500">
              Access your role-based portal to continue.
            </p>
          </div>

          {/* Server error */}
          {serverError && (
            <div className="mb-5">
              <Alert variant="danger" onDismiss={() => setServerError('')}>
                {serverError}
              </Alert>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            <Input
              id="credential"
              name="credential"
              type="text"
              label="Mobile Number or Email"
              placeholder="e.g. 9876543210 or user@gov.in"
              value={form.credential}
              onChange={handleChange}
              error={errors.credential}
              required
              autoComplete="username"
              prefix={<Phone className="w-4 h-4" aria-hidden="true" />}
            />

            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              required
              autoComplete="current-password"
              prefix={<Lock className="w-4 h-4" aria-hidden="true" />}
              suffix={
                <button
                  type="button"
                  onClick={() => setShow((p) => !p)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4" aria-hidden="true" />
                    : <Eye    className="w-4 h-4" aria-hidden="true" />}
                </button>
              }
            />

            <Select
              id="role"
              name="role"
              label="Your Role"
              value={form.role}
              onChange={handleChange}
              error={errors.role}
              required
            >
              <option value="" disabled>Select your role…</option>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </Select>

            {/* Remember / Forgot row */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              icon={!loading ? ChevronRight : undefined}
              iconPosition="right"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>

          </form>

          {/* Prototype notice */}
          <div className="mt-6 p-3.5 rounded-lg bg-amber-50 border border-amber-200">
            <p className="text-xs text-amber-700 text-center leading-relaxed">
              <strong>UI Prototype</strong> — No real authentication is performed.
              Selecting a role and clicking Sign In will navigate to that role's placeholder dashboard.
            </p>
          </div>

          {/* Back link */}
          <p className="text-center mt-5 text-sm text-slate-500">
            <Link
              to="/"
              className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
            >
              ← Back to Home
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}
