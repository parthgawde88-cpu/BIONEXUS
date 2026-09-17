/**
 * BIONEXUS Integration Adapters
 *
 * Clean adapter boundaries for future backend / AI services:
 *   - Image Quality  → OpenCV / YOLOv8 (adapter boundary only)
 *   - Translation    → IndicTrans2 (real phrases only; no fabricated output)
 *   - Emergency      → Configurable toll-free number
 *
 * Speech Recognition is handled DIRECTLY in FarmerCaseReportPage.jsx using
 * the browser Web Speech API (SpeechRecognition / webkitSpeechRecognition).
 * No mock transcription is generated here.
 */

// ── Emergency helpline ────────────────────────────────────────────────────
export const EMERGENCY_TOLL_FREE_NUMBER = null; // Set to real number when available

export const getEmergencyContactInfo = () => {
  if (!EMERGENCY_TOLL_FREE_NUMBER) {
    return {
      configured: false,
      displayText: 'Toll-free emergency helpline: number not configured',
      instruction: 'Contact assigned village Pashu Sakhi or Local Kendra for urgent assistance.',
    };
  }
  return {
    configured: true,
    displayText: `Toll-free Helpline: ${EMERGENCY_TOLL_FREE_NUMBER}`,
    instruction: 'Official Helpline active 24/7.',
  };
};

// ── Image Quality Adapter ─────────────────────────────────────────────────
/**
 * Performs client-side canvas brightness/resolution analysis.
 * Adapter boundary: replace analyzeImageQuality body with OpenCV/YOLOv8
 * call when backend integration is available.
 */
export const analyzeImageQuality = (canvas) => {
  if (!canvas || !canvas.getContext) {
    return { isAcceptable: true, brightnessScore: 80, suggestions: [] };
  }
  try {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    if (width < 200 || height < 200) {
      return {
        isAcceptable: false,
        brightnessScore: 50,
        suggestions: ['Image resolution is too low. Move closer to the animal.'],
      };
    }

    const imgData = ctx.getImageData(0, 0, Math.min(width, 300), Math.min(height, 300));
    const data = imgData.data;
    let totalBrightness = 0;
    for (let i = 0; i < data.length; i += 16) {
      totalBrightness += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    }
    const avg = totalBrightness / (data.length / 16);
    const suggestions = [];
    if (avg < 40) suggestions.push('Image is dark. Use natural daylight or improve lighting.');
    else if (avg > 220) suggestions.push('Image is overexposed. Avoid direct harsh glare.');

    return { isAcceptable: suggestions.length === 0, brightnessScore: Math.round(avg), suggestions };
  } catch {
    return { isAcceptable: true, brightnessScore: 75, suggestions: [] };
  }
};

// ── IndicTrans2 Translation Adapter ──────────────────────────────────────
/**
 * Translation strategy:
 *   1. If source === target, return original text unchanged.
 *   2. If a known clinical phrase exists in the dictionary, return the
 *      verified clinical translation.
 *   3. Otherwise, return a TRUTHFUL "Translation pending backend integration"
 *      message — never fabricate a translation.
 *
 * Adapter boundary: replace the fallback branch with a real IndicTrans2 /
 * Google Translate / backend API call when available.
 */
const CLINICAL_DICTIONARY = {
  // Marathi → English
  mr: {
    en: {
      'दूध कमी झाले आहे': 'Reduced milk yield',
      'ताप आला आहे': 'Fever / High body temperature',
      'भूक मंदावली आहे': 'Loss of appetite / Reduced feeding',
      'खोकला आणि धाप लागत आहे': 'Coughing and respiratory distress',
      'मागील पायाला सूज आली आहे': 'Swelling in hind leg',
      'तोंडात आणि खुरांत फोड आले आहेत': 'Blisters in mouth and hooves (Suspected FMD)',
      'स्तनाला सूज आणि वेदना': 'Swelling and tenderness in udder (Mastitis check)',
      'लंगडणे आणि चालीत अडचण': 'Lameness and difficulty walking',
    },
    hi: {
      'दूध कमी झाले आहे': 'दूध उत्पादन कम हो गया है',
      'ताप आला आहे': 'बुखार आ गया है',
      'भूक मंदावली आहे': 'भूख कम हो गई है',
      'खोकला आणि धाप लागत आहे': 'खांसी और सांस लेने में तकलीफ है',
      'मागील पायाला सूज आली आहे': 'पिछले पैर में सूजन आई है',
      'तोंडात आणि खुरांत फोड आले आहेत': 'मुंह और खुरों में छाले पड़ गए हैं',
      'स्तनाला सूज आणि वेदना': 'थनों में सूजन और दर्द',
      'लंगडणे आणि चालीत अडचण': 'लंगड़ापन और चलने में परेशानी',
    },
  },
  // Hindi → English
  hi: {
    en: {
      'दूध कम हो गया है': 'Reduced milk yield',
      'बुखार आ गया है': 'Fever / Pyrexia',
      'भूख कम हो गई है': 'Reduced appetite',
      'खांसी और सांस में तकलीफ': 'Coughing and shortness of breath',
      'पैरों में सूजन': 'Leg swelling',
      'मुंह और खुर में छाले': 'Mouth and hoof lesions (FMD alert)',
      'थनों में सूजन': 'Swelling in udder / Mastitis signs',
      'लंगड़ापन': 'Lameness and joint stiffness',
    },
    mr: {
      'दूध कम हो गया है': 'दूध कमी झाले आहे',
      'बुखार आ गया है': 'ताप आला आहे',
      'भूख कम हो गई है': 'भूक मंदावली आहे',
      'खांसी और सांस में तकलीफ': 'खोकला आणि धाप लागत आहे',
    },
  },
};

/**
 * Returns a translated string for known clinical phrases.
 * For unknown text, returns an HONEST pending message — no fabrication.
 *
 * @param {string} text - Source text in `sourceLang`
 * @param {'mr'|'hi'|'en'} sourceLang
 * @param {'mr'|'hi'|'en'} targetLang
 * @returns {{ translated: string, status: 'exact_match' | 'same_language' | 'pending_backend' }}
 */
export const translateClinicalText = (text, sourceLang = 'mr', targetLang = 'en') => {
  if (!text || !text.trim()) {
    return { translated: '', status: 'same_language' };
  }

  // No translation needed
  if (sourceLang === targetLang) {
    return { translated: text, status: 'same_language' };
  }

  const clean = text.trim();
  const exactMatch = CLINICAL_DICTIONARY[sourceLang]?.[targetLang]?.[clean];
  if (exactMatch) {
    return { translated: exactMatch, status: 'exact_match' };
  }

  // No fabrication — return honest pending message
  return {
    translated: null,
    status: 'pending_backend',
  };
};
