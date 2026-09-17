import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Clock3,
  MapPin,
  Mic,
  RotateCcw,
  Send,
  ShieldCheck,
  Square,
  Wheat,
  AlertTriangle,
  Info,
  Navigation,
  MessageSquareText,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Alert from '../components/ui/Alert';
import { useBionexus } from '../context';
import { CASE_STATUS } from '../domain';
import { formatDateTime } from '../utils/casePresentation';
import { getTranslation } from '../utils/farmerTranslations';
import { analyzeImageQuality } from '../utils/adapters';

const defaultLocation = { village: 'Udaipur, Rajasthan', latitude: '24.5854', longitude: '73.7125' };

const LANG_NAMES = { mr: 'Marathi (mr-IN)', hi: 'Hindi (hi-IN)', en: 'English (en-IN)' };
const LANG_BCP47 = { mr: 'mr-IN', hi: 'hi-IN', en: 'en-IN' };
const SYMPTOM_PLACEHOLDER = {
  mr: 'उदा: दूध कमी झाले आहे, खोकला, ताप',
  hi: 'उदा: दूध कम हो गया है, बुखार, थनों में सूजन',
  en: 'e.g. reduced milk yield, fever, swelling',
};

export default function FarmerCaseReportPage() {
  const navigate = useNavigate();
  const { farmers, animals, flocks, submitCase, farmerLanguage } = useBionexus();
  const farmer = farmers[0];

  const t = (key) => getTranslation(key, farmerLanguage);
  const steps = [t('selectLivestock'), t('captureEvidence'), t('imageCheck'), t('reviewSubmit')];

  const [step, setStep] = useState(0);
  const [livestockType, setLivestockType] = useState('animal');
  const [selectedId, setSelectedId] = useState(animals[0]?.rapidId || '');
  const [symptoms, setSymptoms] = useState('');

  // ── Camera state ──────────────────────────────────────────────────────────
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [photoDataUrl, setPhotoDataUrl] = useState('');
  const [cameraError, setCameraError] = useState('');
  const [qualityCheck, setQualityCheck] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // ── Geo-tag state ─────────────────────────────────────────────────────────
  const [geotag, setGeotag] = useState(null);
  const [geotagStatus, setGeotagStatus] = useState('idle'); // 'idle' | 'fetching' | 'captured' | 'denied' | 'unavailable'

  // ── Voice / Speech state ─────────────────────────────────────────────────
  const [isRecording, setIsRecording] = useState(false);
  const [voiceRecorded, setVoiceRecorded] = useState(false);
  const [voiceAudioUrl, setVoiceAudioUrl] = useState(null);
  const [micError, setMicError] = useState('');
  // Transcript collected during recording — NOT auto-inserted into symptoms
  const [pendingTranscript, setPendingTranscript] = useState('');
  const [transcriptCommitted, setTranscriptCommitted] = useState(false);
  const [speechApiAvailable, setSpeechApiAvailable] = useState(null); // null = not yet checked
  const [speechApiError, setSpeechApiError] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const transcriptAccRef = useRef(''); // accumulates during recording session

  const [submittedCase, setSubmittedCase] = useState(null);

  const selected = useMemo(
    () => (livestockType === 'animal' ? animals.find((item) => item.rapidId === selectedId) : flocks.find((item) => item.flockId === selectedId)),
    [animals, flocks, livestockType, selectedId]
  );

  const selectType = (type) => {
    setLivestockType(type);
    setSelectedId(type === 'animal' ? animals[0]?.rapidId || '' : flocks[0]?.flockId || '');
  };

  // Cleanup camera + speech recognition on unmount
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      try { recognitionRef.current?.stop(); } catch (_) {}
    };
  }, []);

  // Guarantee stream is attached to videoRef whenever camera is active
  useEffect(() => {
    if (isCameraActive && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch((err) => {
        console.log('Camera play error on mount:', err);
      });
    }
  }, [isCameraActive]);

  // ── Camera handlers ───────────────────────────────────────────────────────
  const stopStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const startCamera = async () => {
    setCameraError('');
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(t('cameraApiUnsupported'));
      return;
    }
    try {
      stopStream();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      streamRef.current = stream;
      setIsCameraActive(true);
      
      // Delay srcObject assignment slightly to ensure React has rendered the <video> ref element
      setTimeout(() => {
        if (videoRef.current && streamRef.current) {
          videoRef.current.srcObject = streamRef.current;
          videoRef.current.play().catch(() => {});
        }
      }, 50);
    } catch (error) {
      setIsCameraActive(false);
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setCameraError(t('cameraDenied'));
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setCameraError(t('noCameraFound'));
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        setCameraError(t('cameraInUse'));
      } else {
        setCameraError(`Camera error: ${error.name} — ${error.message}`);
      }
    }
  };

  const captureGeotag = () => {
    if (!navigator.geolocation) {
      setGeotagStatus('unavailable');
      return;
    }
    setGeotagStatus('fetching');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeotag({
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
          accuracy: `${Math.round(pos.coords.accuracy)} m`,
          capturedAt: new Date().toISOString(),
          mediaId: `MEDIA-${Date.now()}`,
          geoTagStatus: 'captured',
        });
        setGeotagStatus('captured');
      },
      (err) => {
        setGeotagStatus('denied');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !video.videoWidth) {
      setCameraError('Video stream not ready. Please wait for the camera to initialize.');
      return;
    }
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setPhotoDataUrl(dataUrl);
    setQualityCheck(analyzeImageQuality(canvas));
    // Stop camera stream immediately after capture
    stopStream();
    setIsCameraActive(false);
    setPhotoCaptured(true);
    // Trigger geolocation capture alongside frame capture
    captureGeotag();
  };

  const retakePhoto = () => {
    setPhotoCaptured(false);
    setPhotoDataUrl('');
    setQualityCheck(null);
    setGeotag(null);
    setGeotagStatus('idle');
    startCamera();
  };

  // ── Voice / Speech handlers ───────────────────────────────────────────────
  const initSpeechRecognition = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setSpeechApiAvailable(false);
      return null;
    }
    setSpeechApiAvailable(true);
    const recog = new SR();
    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = LANG_BCP47[farmerLanguage] || 'hi-IN';

    recog.onresult = (event) => {
      let segment = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          segment += event.results[i][0].transcript;
        }
      }
      if (segment) {
        transcriptAccRef.current = transcriptAccRef.current
          ? transcriptAccRef.current + ' ' + segment
          : segment;
        setPendingTranscript(transcriptAccRef.current);
      }
    };

    recog.onerror = (event) => {
      // 'no-speech' is a normal timeout, don't show as error
      if (event.error !== 'no-speech') {
        if (event.error === 'language-not-supported') {
          setSpeechApiError(`Speech recognition language not supported by browser. Audio is saved for veterinarian.`);
        } else {
          setSpeechApiError(`Speech recognition: ${event.error}`);
        }
      }
    };

    recog.onend = () => {
      // recognition may end on its own (timeout/network) — don't change recording state
    };

    return recog;
  };

  const startRecording = async () => {
    setMicError('');
    setSpeechApiError('');
    setPendingTranscript('');
    setTranscriptCommitted(false);
    transcriptAccRef.current = '';

    if (!navigator.mediaDevices?.getUserMedia) {
      setMicError('Voice recording is not supported by this browser.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setVoiceAudioUrl(URL.createObjectURL(blob));
        setVoiceRecorded(true);
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      setIsRecording(true);

      // Start speech recognition concurrently
      const recog = initSpeechRecognition();
      if (recog) {
        recognitionRef.current = recog;
        try { recog.start(); } catch (_) {}
      }
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setMicError(`Microphone permission denied (${err.name}). Allow microphone access in browser settings.`);
      } else {
        setMicError(`Microphone error: ${err.name} — ${err.message}`);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    try { recognitionRef.current?.stop(); } catch (_) {}
    recognitionRef.current = null;
    // Do NOT insert transcript into symptoms here — wait for explicit user action
  };

  const commitTranscript = () => {
    const textToCommit = pendingTranscript.trim() || `[Voice recording attached (${LANG_NAMES[farmerLanguage] || farmerLanguage})]`;
    setSymptoms((prev) => (prev.trim() ? prev.trim() + '\n' + textToCommit : textToCommit));
    setTranscriptCommitted(true);
  };

  const retakeVoice = () => {
    setVoiceAudioUrl(null);
    setVoiceRecorded(false);
    setPendingTranscript('');
    setTranscriptCommitted(false);
    setSpeechApiError('');
    transcriptAccRef.current = '';
  };

  const handleSubmit = () => {
    const item = submitCase({
      farmerId: farmer?.farmerId || 'FR-4821',
      animalId: livestockType === 'animal' ? selectedId : undefined,
      flockId: livestockType === 'flock' ? selectedId : undefined,
      submittedBy: farmer?.userId || 'USR-001',
      symptoms: symptoms.split(/[\n,]/).map((s) => s.trim()).filter(Boolean),
      originalSymptoms: symptoms,
      originalLanguage: farmerLanguage,
      transcriptText: pendingTranscript || null,
      transcriptionStatus: pendingTranscript ? 'browser_speech_api' : 'none',
      voiceNote: voiceAudioUrl || null,
      photo: photoDataUrl || null,
      geotagMetadata: geotag || {
        latitude: defaultLocation.latitude,
        longitude: defaultLocation.longitude,
        capturedAt: new Date().toISOString(),
        accuracy: 'Default location (permission not granted)',
        geoTagStatus: geotagStatus,
      },
      location: geotag
        ? { village: farmer?.address || 'Udaipur', latitude: geotag.latitude, longitude: geotag.longitude }
        : defaultLocation,
      status: CASE_STATUS.SUBMITTED,
      riskLevel: null,
      veterinarianId: 'USR-003',
    });
    setSubmittedCase(item);
  };

  // ── Success screen ────────────────────────────────────────────────────────
  if (submittedCase) {
    return (
      <div className="mx-auto max-w-3xl py-8">
        <Alert variant="success" title="Case Submitted Successfully">
          <p>{t('vetReview')}</p>
        </Alert>
        <Card className="mt-6">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Canonical Case ID</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900">{submittedCase.caseId}</h1>
              <p className="mt-2 text-sm text-slate-600">Your evidence report is now available in the veterinarian queue.</p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              ['Animal / Flock', selectedId],
              ['Submitted time', formatDateTime(submittedCase.submittedAt)],
              ['Original Language', LANG_NAMES[farmerLanguage] || farmerLanguage.toUpperCase()],
              ['Geo-Tag', geotag ? `${geotag.latitude}, ${geotag.longitude} (±${geotag.accuracy})` : 'Location not granted'],
              ['Voice Transcript', pendingTranscript ? 'Captured via browser Speech API' : 'None'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="mt-1 font-semibold text-slate-800">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={() => navigate('/farmer/cases')} icon={ArrowLeft} iconPosition="left" variant="secondary">
              View Case History
            </Button>
            <Button onClick={() => { setSubmittedCase(null); setStep(0); setPhotoCaptured(false); setPhotoDataUrl(''); setSymptoms(''); setVoiceAudioUrl(null); setVoiceRecorded(false); setPendingTranscript(''); setGeotag(null); setGeotagStatus('idle'); }} variant="outline">
              Report another issue
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // ── Main page ─────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-4xl py-6 sm:py-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">{t('portalTitle')}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{t('reportHealthIssue')}</h1>
          <p className="mt-2 text-sm text-slate-500">
            {t('captureEvidenceDesc')}
          </p>
        </div>
        <Link to="/farmer" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>
      </div>

      {/* Step Header */}
      <div className="mb-6 grid grid-cols-4 gap-2">
        {steps.map((stepName, index) => (
          <div key={stepName} className="flex items-center gap-2">
            <span
              className={[
                'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold',
                index <= step ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400',
              ].join(' ')}
            >
              {index + 1}
            </span>
            <span className={['hidden text-xs font-medium sm:block', index === step ? 'text-emerald-700 font-bold' : 'text-slate-500'].join(' ')}>
              {stepName}
            </span>
          </div>
        ))}
      </div>

      {/* ── STEP 0: Select Livestock ── */}
      {step === 0 && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>{t('selectLivestock')}</CardTitle>
              <CardDescription>Use a Rapid ID for large livestock or a Flock ID for poultry.</CardDescription>
            </div>
            <Wheat className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => selectType('animal')}
              className={['rounded-xl border p-4 text-left transition-all', livestockType === 'animal' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'].join(' ')}
            >
              <p className="font-semibold text-slate-900">{t('individualLivestock')}</p>
              <p className="mt-1 text-xs text-slate-500">Cattle, buffalo, goat and individually tracked animals.</p>
            </button>
            <button
              type="button"
              onClick={() => selectType('flock')}
              className={['rounded-xl border p-4 text-left transition-all', livestockType === 'flock' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'].join(' ')}
            >
              <p className="font-semibold text-slate-900">{t('poultryFlock')}</p>
              <p className="mt-1 text-xs text-slate-500">Track poultry flock as a group (Flock ID & Count).</p>
            </button>
          </div>

          <label className="mt-5 block text-sm font-medium text-slate-700">
            {livestockType === 'animal' ? t('rapidId') : t('flockId')}
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold"
            >
              {(livestockType === 'animal' ? animals : flocks).map((item) => (
                <option key={livestockType === 'animal' ? item.rapidId : item.flockId} value={livestockType === 'animal' ? item.rapidId : item.flockId}>
                  {livestockType === 'animal' ? `${item.rapidId} (${item.species} - ${item.breed})` : `${item.flockId} (Poultry - ${item.count} birds)`}
                </option>
              ))}
            </select>
          </label>

          {selected && (
            <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">Selected summary</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {Object.entries(
                  livestockType === 'animal'
                    ? { ID: selected.rapidId, Species: selected.species, Breed: selected.breed, Age: selected.age, Sex: selected.sex }
                    : { ID: selected.flockId, Species: selected.species, Breed: selected.breed, Count: `${selected.count} birds`, Age: selected.age }
                ).map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="font-semibold text-slate-800">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button onClick={() => setStep(1)}>{t('continue')}</Button>
          </div>
        </Card>
      )}

      {/* ── STEP 1: Camera Evidence & Regional Speech ── */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>{t('captureEvidence')}</CardTitle>
              <CardDescription>{t('captureEvidenceDesc')}</CardDescription>
            </div>
            <Camera className="h-5 w-5 text-emerald-600" />
          </CardHeader>

          {/* Photo guidance */}
          {!photoCaptured && (
            <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-900 mb-2">
                <Info className="h-4 w-4 text-emerald-600" />
                {t('photoGuidance')}
              </div>
              <div className="grid gap-2 sm:grid-cols-2 text-xs text-slate-700">
                {[t('tipVisible'), t('tipDaylight'), t('tipSteady'), t('tipAvoidShadows')].map((tip, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Camera container */}
          <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-900 p-6 text-center text-white">
            {cameraError && (
              <Alert className="mb-4 text-left" variant="danger">
                {cameraError}
              </Alert>
            )}

            <div className="relative mx-auto aspect-video max-w-xl overflow-hidden rounded-lg border border-slate-600 bg-slate-800 flex items-center justify-center">
              {/* Hidden canvas used for frame capture */}
              <canvas ref={canvasRef} className="hidden" />

              {photoCaptured ? (
                <div className="relative h-full w-full">
                  <img src={photoDataUrl} alt="Captured evidence" className="h-full w-full object-cover" />
                  <div className="absolute top-3 right-3 rounded-full bg-emerald-600 p-2 text-white shadow-md">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                </div>
              ) : isCameraActive ? (
                /* CRITICAL: autoPlay + playsInline + muted required for mobile browsers */
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full object-cover min-h-[280px] bg-black"
                />
              ) : (
                <div className="p-6 text-center">
                  <Camera className="mx-auto h-12 w-12 text-slate-400" />
                  <p className="mt-2 text-sm text-slate-300 font-semibold">{t('environmentCamera')}</p>
                  <p className="mt-1 text-xs text-slate-400">{t('startCameraInstruction')}</p>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {!isCameraActive && !photoCaptured && (
                <Button onClick={startCamera} icon={Camera} variant="primary">
                  {t('startCamera')}
                </Button>
              )}
              {isCameraActive && (
                <Button onClick={capturePhoto} icon={Camera} variant="primary">
                  {t('captureFrame')}
                </Button>
              )}
              {photoCaptured && (
                <Button onClick={retakePhoto} variant="secondary" icon={RotateCcw}>
                  {t('retake')}
                </Button>
              )}
            </div>
          </div>

          {/* Geo-tag status */}
          {photoCaptured && (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Navigation className="h-4 w-4 text-emerald-600" />
                  {t('deviceGeotag')}
                </span>
                <Badge
                  variant={geotagStatus === 'captured' ? 'success' : geotagStatus === 'fetching' ? 'info' : 'warning'}
                  size="sm"
                >
                  {geotagStatus === 'captured'
                    ? t('geotagCaptured')
                    : geotagStatus === 'fetching'
                    ? t('geotagFetching')
                    : geotagStatus === 'denied'
                    ? t('geotagDenied')
                    : t('geotagUnavailable')}
                </Badge>
              </div>

              {geotag ? (
                <p className="mt-1.5 text-emerald-800 font-semibold">
                  {t('geotagCaptured')} — Lat {geotag.latitude}, Long {geotag.longitude} (Accuracy: {geotag.accuracy})
                </p>
              ) : geotagStatus === 'denied' ? (
                <p className="mt-1.5 text-amber-700">{t('geotagDenied')}</p>
              ) : geotagStatus === 'unavailable' ? (
                <p className="mt-1.5 text-amber-700">{t('geotagUnavailable')}</p>
              ) : geotagStatus === 'fetching' ? (
                <p className="mt-1.5 text-slate-500">{t('geotagFetching')}</p>
              ) : null}
            </div>
          )}

          {/* Symptoms text input + Regional voice */}
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {/* Text symptoms */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                {t('textSymptomsLabel')}{' '}
                <span className="text-xs font-normal text-slate-400">({LANG_NAMES[farmerLanguage] || farmerLanguage})</span>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  rows="5"
                  placeholder={SYMPTOM_PLACEHOLDER[farmerLanguage] || SYMPTOM_PLACEHOLDER.en}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                />
              </label>
              {transcriptCommitted && (
                <p className="mt-1 text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {t('voiceCommitted')}
                </p>
              )}
            </div>

            {/* Voice recording */}
            <div>
              <p className="text-sm font-medium text-slate-700">
                {t('voiceSymptomsLabel')}{' '}
                <span className="text-xs font-normal text-slate-400">({LANG_NAMES[farmerLanguage] || farmerLanguage})</span>
              </p>
              <div className="mt-1.5 rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
                {micError && <p className="text-xs text-red-600 font-semibold">{micError}</p>}
                {speechApiError && <p className="text-xs text-amber-700">{speechApiError}</p>}

                {isRecording && (
                  <div className="flex items-center gap-2 text-red-600 font-bold text-sm animate-pulse">
                    <span className="h-3 w-3 rounded-full bg-red-600" />
                    {t('recordingIn')} {LANG_NAMES[farmerLanguage] || farmerLanguage}…
                  </div>
                )}

                {/* Audio player — appears after recording stops */}
                {voiceRecorded && voiceAudioUrl && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-emerald-700">{t('recordingSaved')}</p>
                    <audio src={voiceAudioUrl} controls className="w-full h-9" />
                  </div>
                )}

                {/* Pending transcript preview */}
                {voiceRecorded && pendingTranscript && !transcriptCommitted && (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs">
                    <p className="font-semibold text-blue-800 mb-1">{t('speechRecognized')} ({LANG_NAMES[farmerLanguage] || farmerLanguage}):</p>
                    <p className="text-slate-800 italic">"{pendingTranscript}"</p>
                  </div>
                )}

                {voiceRecorded && !pendingTranscript && speechApiAvailable === false && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                    <p className="font-semibold">Browser SpeechRecognition API not supported.</p>
                    <p className="mt-1">{t('noTranscriptCaptured')}</p>
                  </div>
                )}

                {voiceRecorded && !pendingTranscript && speechApiAvailable !== false && (
                  <p className="text-xs text-slate-500">{t('noTranscriptCaptured')}</p>
                )}

                {!voiceRecorded && !isRecording && (
                  <p className="text-xs text-slate-500">
                    {t('speakInstruction')}
                  </p>
                )}

                {/* Buttons — ALWAYS visible when audio recorded */}
                <div className="flex flex-wrap gap-2">
                  {!isRecording && !voiceRecorded && (
                    <Button size="sm" onClick={startRecording} icon={Mic} variant="primary">
                      {t('recordVoice')}
                    </Button>
                  )}
                  {isRecording && (
                    <Button size="sm" onClick={stopRecording} icon={Square} variant="danger">
                      {t('stopRecording')}
                    </Button>
                  )}
                  {voiceRecorded && !transcriptCommitted && (
                    <Button size="sm" onClick={commitTranscript} icon={MessageSquareText} variant="primary">
                      {t('useConvertText')}
                    </Button>
                  )}
                  {voiceRecorded && (
                    <Button size="sm" onClick={retakeVoice} variant="outline" icon={RotateCcw}>
                      {t('retakeAudio')}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-between border-t pt-4">
            <Button variant="ghost" onClick={() => setStep(0)}>{t('back')}</Button>
            <Button onClick={() => setStep(2)} disabled={!photoCaptured}>
              {t('continue')}
            </Button>
          </div>
        </Card>
      )}

      {/* ── STEP 2: Quality Check ── */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>{t('imageCheck')}</CardTitle>
              <CardDescription>{t('imageCheckDesc')}</CardDescription>
            </div>
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
          </CardHeader>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2">{t('capturedEvidencePreview')}</p>
              <img src={photoDataUrl} alt="Preview" className="h-48 w-full rounded-xl object-cover border" />
            </div>

            <div className="space-y-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs space-y-1">
                <p className="font-bold text-slate-800">{t('qualityAnalysis')}</p>
                <p>• {t('resolution')} {qualityCheck?.isAcceptable !== false ? t('passed') : t('low')}</p>
                <p>• {t('brightnessScore')} {qualityCheck?.brightnessScore ?? 78} / 255</p>
                <p>• {t('status')} {qualityCheck?.isAcceptable !== false ? t('acceptable') : t('reviewSuggested')}</p>
              </div>

              {qualityCheck?.suggestions?.map((sug) => (
                <Alert key={sug} variant="warning">{sug}</Alert>
              ))}

              {geotag && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900 font-medium">
                  {t('geotagLinked')} Lat {geotag.latitude}, Long {geotag.longitude} (±{geotag.accuracy})
                </div>
              )}

              {!geotag && geotagStatus === 'denied' && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                  {t('locationDeniedNotice')}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-between border-t pt-4">
            <Button variant="ghost" onClick={() => setStep(1)}>{t('back')}</Button>
            <Button onClick={() => setStep(3)}>{t('continue')}</Button>
          </div>
        </Card>
      )}

      {/* ── STEP 3: Review & Submit ── */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>{t('reviewSubmit')}</CardTitle>
              <CardDescription>Check canonical case record before sending to veterinarian.</CardDescription>
            </div>
            <Send className="h-5 w-5 text-emerald-600" />
          </CardHeader>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ['Farmer Name', farmer?.name || 'Bhupesh Paliwal'],
              ['Village / Location', farmer?.address || 'Udaipur, Rajasthan'],
              ['Animal / Flock ID', selectedId],
              ['Camera Photo', photoCaptured ? 'Captured (device camera only)' : 'None'],
              ['Symptoms language', LANG_NAMES[farmerLanguage]],
              ['Original symptoms text', symptoms || 'None entered'],
              ['Voice note', voiceAudioUrl ? 'Recorded (audio saved)' : 'None'],
              ['Voice transcript', pendingTranscript ? `"${pendingTranscript.slice(0, 60)}${pendingTranscript.length > 60 ? '…' : ''}"` : 'None'],
              ['Geo-coordinates', geotag ? `${geotag.latitude}, ${geotag.longitude} (±${geotag.accuracy})` : 'Not captured'],
              ['Assigned Veterinarian', 'Dr. Parth Gawde (Udaipur Unit)'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between border-t pt-4">
            <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
            <Button onClick={handleSubmit} icon={Send} variant="primary">
              {t('submitCase')}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
