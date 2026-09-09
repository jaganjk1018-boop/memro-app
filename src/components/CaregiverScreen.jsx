import React, { useState } from "react";
import {
  ChevronRight, TrendingUp, AlertTriangle, Check, Gamepad2, BookHeart,
  Pill, Trophy, Stethoscope, PhoneCall, MessageCircle, Download,
  X, ShieldAlert, FileText, MapPin, Send, CheckSquare, Clock, WifiOff
} from "lucide-react";
import { playTapSound, playMatchSound } from "../utils/audio";

// ---------- Design tokens ----------
const TEAL = "#0E5C52";
const TEAL_DARK = "#07414C";
const TEAL_LIGHT = "#DCEFEA";
const AMBER = "#C99A2E";
const AMBER_LIGHT = "#FBF0CE";
const CORAL = "#E4574B";
const CORAL_LIGHT = "#FDE8D9";
const GREEN = "#5C9A57";
const GREEN_LIGHT = "#E2F0DE";
const TEXT_DARK = "#23312B";
const MUTED = "#7C8A80";

export const PHC_CENTERS = [
  { id: "guwahati", name: "Guwahati Municipal PHC (Assam)", contact: "+91 361 246 1234", coord: "26.1445° N, 91.7362° E" },
  { id: "shillong", name: "Shillong Cantonment PHC (Meghalaya)", contact: "+91 364 222 5678", coord: "25.5788° N, 91.8831° E" },
  { id: "imphal", name: "Imphal West PHC (Manipur)", contact: "+91 385 244 0987", coord: "24.8170° N, 93.9368° E" },
  { id: "aizawl", name: "Aizawl District PHC (Mizoram)", contact: "+91 389 232 4321", coord: "23.7271° N, 92.7176° E" },
  { id: "kohima", name: "Kohima Regional PHC (Nagaland)", contact: "+91 370 224 1122", coord: "25.6751° N, 94.1113° E" }
];

const LANGUAGE_FALLBACKS = {
  karbi: "as",
  mising: "as",
  nyishi: "hi",
  adi: "hi",
  apatani: "hi",
  monpa: "hi",
  galo: "hi",
  tangkhul: "mni",
  thadou: "mni",
  paite: "mni",
  hmar: "mni",
  khasi: "en",
  garo: "en",
  jaintia: "en",
  mizo: "en",
  lai: "en",
  mara: "en",
  nagamese: "as",
  ao: "en",
  angami: "en",
  sumi: "en",
  lotha: "en",
  konyak: "en",
  kokborok: "bn",
  sikkimese: "ne",
  lepcha: "ne"
};

export const CAREGIVER_TRANS = {
  en: {
    title: "Caregiver dashboard",
    offline: "Running Offline.",
    recordsQueued: "records queued locally.",
    dataSaved: "Data saved locally.",
    patientSelect: "PATIENT SELECT",
    patientDetails: "Today's patient details",
    cognitiveDomains: "COGNITIVE DOMAINS THIS WEEK",
    domains: {
      Memory: "Memory",
      Attention: "Attention",
      Language: "Language",
      "Sound recall": "Sound recall"
    },
    todaysMedicine: "TODAY'S MEDICINE",
    completed: "completed",
    complianceRate: "compliance rate",
    cognitiveTrend: "5-week cognitive trend",
    trendNote: "Typical range for this age group is 60–85. Amma's score is within range but trending down — worth a conversation with the PHC.",
    moodThisWeek: "Mood this week",
    recentActivity: "RECENT ACTIVITY",
    linkedHealthWorker: "LINKED HEALTH WORKER",
    lastVisit: "Last visit: 12 days ago · District PHC, Assam",
    requestHomeVisit: "Request a home visit",
    alertSensitivity: "ALERT SENSITIVITY",
    notifyImmediate: "Notify me right away",
    notifyWeekly: "Weekly summary only",
    call: "Call",
    message: "Message",
    scheduleVideo: "Schedule a video call for later",
    exportReport: "Export report for doctor visit",
    exportNote: "Score combines memory-game accuracy and response time. Exportable as a PDF for clinician visits, alongside MMSE/MoCA.",
    // report modal
    reportTitle: "Clinical Assessment Log",
    patientName: "Patient Name",
    ageSex: "Age / Sex",
    dateGenerated: "Date Generated",
    diagnosticBaseline: "Diagnostic Baseline",
    clinicianScores: "Clinician Scores",
    metric: "Metric",
    score: "Score",
    status: "Status",
    mmse: "MMSE Score (Global)",
    moca: "MoCA Assessment",
    gameScore: "Memory Game Avg Score",
    decline: "Mild Decline",
    stable: "Stable",
    complianceMood: "Reminders compliance & mood logs",
    compRateLabel: "Reminder Compliance Rate",
    todayMoodLabel: "Today's Reported Mood",
    completedTests: "Completed tests during this cycle",
    games: "games",
    clinicianSig: "REVIEWED BY CLINICIAN",
    caregiverSig: "CAREGIVER ATTESTATION",
    sigDate: "Signature / Date",
    printReport: "Print Report",
    close: "Close",
    // PHC alert modal
    phcTitle: "PHC Telemedical Alert",
    phcSubtitle: "Transmit latest patient telemetry logs directly to Regional Health Centers.",
    phcLabel: "Select Nearest PHC Centre:",
    urgencyLabel: "Urgency Level:",
    urgencyLow: "Low",
    urgencyMedium: "Medium",
    urgencyHigh: "High (ASHA Escalation)",
    notesLabel: "Caregiver Audio / Written Notes:",
    notesPlaceholder: "Describe patient status (e.g., Amma is having trouble remembering name of daughter today)...",
    cancel: "Cancel",
    sendRequest: "Send Request / Alert",
    successTitle: "Request Sent Successfully",
    successMsg: "Encrypted patient diagnostic telemetry has been sent to",
    successNote: "Their clinic coordinator has been notified.",
    dispatchRef: "Ref ID",
    returnDashboard: "Return to Dashboard",
    pending: "Pending check-in",
    lastActive: "Last active: 2 hours ago · weekly summary below",
    gamesLabel: "Games this week",
    remindersLabel: "Reminders completed",
    alertBannerText: "Cognitive score has dropped for 2 weeks running. Consider a check-in call — the linked PHC has been notified."
  },
  hi: {
    title: "देखभालकर्ता डैशबोर्ड",
    offline: "ऑफ़लाइन चल रहा है।",
    recordsQueued: "रिकॉर्ड स्थानीय रूप से कतारबद्ध हैं।",
    dataSaved: "डेटा स्थानीय रूप से सुरक्षित किया गया।",
    patientSelect: "मरीज का चयन",
    patientDetails: "आज के मरीज का विवरण",
    cognitiveDomains: "इस सप्ताह के संज्ञानात्मक क्षेत्र",
    domains: {
      Memory: "स्मरण शक्ति",
      Attention: "एकाग्रता",
      Language: "भाषा",
      "Sound recall": "ध्वनि स्मरण"
    },
    todaysMedicine: "आज की दवाएं",
    completed: "पूरा किया",
    complianceRate: "दवा अनुपालन दर",
    cognitiveTrend: "5-सप्ताह का संज्ञानात्मक रुझान",
    trendNote: "इस आयु वर्ग के लिए सामान्य सीमा 60-85 है। अम्मा का स्कोर सीमा के भीतर है लेकिन नीचे की ओर झुकाव है - पीएचसी के साथ बातचीत करने योग्य है।",
    moodThisWeek: "इस सप्ताह का मूड",
    recentActivity: "हाल की गतिविधि",
    linkedHealthWorker: "जुड़े हुए स्वास्थ्य कार्यकर्ता",
    lastVisit: "अंतिम दौरा: 12 दिन पहले · जिला पीएचसी, असम",
    requestHomeVisit: "गृह दौरे का अनुरोध करें",
    alertSensitivity: "अलर्ट संवेदनशीलता",
    notifyImmediate: "मुझे तुरंत सूचित करें",
    notifyWeekly: "केवल साप्ताहिक सारांश",
    call: "कॉल करें",
    message: "संदेश भेजें",
    scheduleVideo: "बाद के लिए वीडियो कॉल शेड्यूल करें",
    exportReport: "डॉक्टर के दौरे के लिए रिपोर्ट निर्यात करें",
    exportNote: "स्कोर मेमोरी-गेम सटीकता और प्रतिक्रिया समय को जोड़ता है। चिकित्सक के दौरे के लिए पीडीएफ के रूप में निर्यात करने योग्य है।",
    reportTitle: "नैदानिक मूल्यांकन लॉग",
    patientName: "मरीज का नाम",
    ageSex: "उम्र / लिंग",
    dateGenerated: "उत्पन्न तिथि",
    diagnosticBaseline: "नैदानिक आधार रेखा",
    clinicianScores: "चिकित्सक स्कोर",
    metric: "मीट्रिक",
    score: "अंक",
    status: "स्थिति",
    mmse: "एमएमएसई स्कोर (वैश्विक)",
    moca: "मोका मूल्यांकन",
    gameScore: "मेमोरी गेम औसत स्कोर",
    decline: "हल्की गिरावट",
    stable: "स्थिर",
    complianceMood: "दवा अनुपालन और मूड लॉग",
    compRateLabel: "दवा अनुपालन दर",
    todayMoodLabel: "आज का रिपोर्ट किया गया मूड",
    completedTests: "इस चक्र के दौरान पूरी की गई परीक्षाएं",
    games: "खेल",
    clinicianSig: "चिकित्सक द्वारा समीक्षित",
    caregiverSig: "देखभालकर्ता सत्यापन",
    sigDate: "हस्ताक्षर / तिथि",
    printReport: "रिपोर्ट प्रिंट करें",
    close: "बंद करें",
    phcTitle: "पीएचसी टेलीमेडिकल अलर्ट",
    phcSubtitle: "नवीनतम मरीज टेलीमेट्री लॉग सीधे क्षेत्रीय स्वास्थ्य केंद्रों को प्रेषित करें।",
    phcLabel: "निकटतम पीएचसी केंद्र चुनें:",
    urgencyLabel: "तात्कालिकता स्तर:",
    urgencyLow: "कम",
    urgencyMedium: "मध्यम",
    urgencyHigh: "उच्च (आशा वृद्धि)",
    notesLabel: "देखभालकर्ता नोट्स (आशा कार्यकर्ता दृश्य):",
    notesPlaceholder: "उदा. सुबह की दवा के दौरान मरीज थोड़ा भ्रमित थे, फोटो गेम में अपने भतीजे को नहीं पहचाना।",
    cancel: "रद्द करें",
    sendRequest: "अनुरोध / अलर्ट भेजें",
    successTitle: "अनुरोध सफलतापूर्वक भेजा गया",
    successMsg: "पूरे टेलीमेट्री लॉग के साथ आपका अलर्ट प्रेषित कर दिया गया है:",
    successNote: "उनके क्लिनिक समन्वयक को सूचित कर दिया गया है।",
    dispatchRef: "संदर्भ संख्या",
    returnDashboard: "डैशबोर्ड पर लौटें",
    pending: "चेक-इन लंबित",
    lastActive: "अंतिम सक्रिय: 2 घंटे पहले · साप्ताहिक सारांश नीचे है",
    gamesLabel: "इस सप्ताह के खेल",
    remindersLabel: "स्मरणपत्र पूरे किए",
    alertBannerText: "संज्ञानात्मक स्कोर लगातार 2 हफ्तों से गिर रहा है। चेक-इन कॉल पर विचार करें - जुड़े पीएचसी को सूचित कर दिया गया है।"
  },
  as: {
    title: "যত্নলওঁতাৰ ড্যাশবৰ্ড",
    offline: "অফলাইনত চলি আছে।",
    recordsQueued: "তথ্য স্থানীয়ভাৱে সঞ্চিত হৈছে।",
    dataSaved: "তথ্য স্থানীয়ভাৱে সংৰক্ষিত হ’ল।",
    patientSelect: "ৰোগী বাছনি",
    patientDetails: "আজিৰ ৰোগীৰ সবিশেষ",
    cognitiveDomains: "এই সপ্তাহৰ মানসিক ক্ষমতাৰ স্থিতি",
    domains: {
      Memory: "স্মৰণ শক্তি",
      Attention: "মনোযোগ",
      Language: "ভাষা",
      "Sound recall": "শব্দ মনত পেলোৱা"
    },
    todaysMedicine: "আজিৰ ঔষধ",
    completed: "সম্পূৰ্ণ হ’ল",
    complianceRate: "ঔষধ গ্ৰহণৰ হাৰ",
    cognitiveTrend: "৫ সপ্তাহৰ মানসিক ক্ষমতাৰ গতিধাৰা",
    trendNote: "এই বয়সৰ লোকৰ বাবে সাধাৰণ স্ক’ৰ ৬০-৮৫। আম্মাৰ স্ক’ৰ সীমাৰ ভিতৰত আছে কিন্তু তললৈ নামিছে - চিকিৎসালয়ৰ লগত কথা পতা উচিত।",
    moodThisWeek: "এই সপ্তাহৰ মনৰ অৱস্থা",
    recentActivity: "শেহতীয়া কাৰ্যকলাপ",
    linkedHealthWorker: "সংযোগ থকা স্বাস্থ্য কৰ্মী",
    lastVisit: "শেষ সাক্ষাত: ১২ দিন আগতে · জিলা PHC, অসম",
    requestHomeVisit: "ঘৰলৈ আহিবলৈ অনুৰোধ কৰক",
    alertSensitivity: "সতৰ্কতা সংবেদনশীলতা",
    notifyImmediate: "মোক লগে লগে জনাওক",
    notifyWeekly: "কেৱল সাপ্তাহিক সাৰাংশ",
    call: "কল কৰক",
    message: "বাৰ্তা পঠিয়াওক",
    scheduleVideo: "পিছৰ বাবে ভিডিঅ’ কল নিৰ্ধাৰণ কৰক",
    exportReport: "ডাক্তৰৰ বাবে ৰিপ’ৰ্ট উলিয়াওক",
    exportNote: "স্ক’ৰত গেমৰ শুদ্ধতা আৰু ক্ষিপ্ৰতা জোখা হয়। ইয়াক পিডিএফ হিচাপে ডাউনল’ড কৰিব পাৰি।",
    reportTitle: "ক্লিনিকেল মূল্যায়ন ৰিপ’ৰ্ট",
    patientName: "ৰোগীৰ নাম",
    ageSex: "বয়স / লিংগ",
    dateGenerated: "ৰিপ’ৰ্ট প্ৰস্তুতৰ তাৰিখ",
    diagnosticBaseline: "প্ৰাৰম্ভিক মূল্যায়ন",
    clinicianScores: "চিকিৎসকৰ মূল্যায়ন স্ক’ৰ",
    metric: "সূচক",
    score: "স্ক’ৰ",
    status: "স্থিতি",
    mmse: "MMSE স্ক’ৰ (সামগ্ৰিক)",
    moca: "MoCA মূল্যায়ন",
    gameScore: "মেমৰী গেমৰ গড় স্ক’ৰ",
    decline: "সামান্য হ্ৰাস",
    stable: " সুস্থিৰ",
    complianceMood: "ঔষধ গ্ৰহণ আৰু মনৰ অৱস্থাৰ তথ্য",
    compRateLabel: "ঔষধ গ্ৰহণৰ নিয়মানুৱৰ্তিতা",
    todayMoodLabel: "আজিৰ মনৰ অৱস্থা",
    completedTests: "এই চক্ৰত সম্পন্ন হোৱা পৰীক্ষা",
    games: "খেল",
    clinicianSig: "চিকিৎসকৰ চহী",
    caregiverSig: "যত্নলওঁতাৰ প্ৰমাণীকৰণ",
    sigDate: "চহী / তাৰিখ",
    printReport: "ৰিপ’ৰ্ট প্ৰিণ্ট কৰক",
    close: "বন্ধ কৰক",
    phcTitle: "PHC চিকিৎসা সতৰ্কতা",
    phcSubtitle: "ৰোগীৰ শেহতীয়া স্বাস্থ্যৰ তথ্য পোনে পোনে আঞ্চলিক স্বাস্থ্য কেন্দ্ৰলৈ প্ৰেৰণ কৰক।",
    phcLabel: "ওচৰৰ PHC বাছনি কৰক:",
    urgencyLabel: "জৰুৰীকালীন অৱস্থা:",
    urgencyLow: "কম",
    urgencyMedium: "মধ্যম",
    urgencyHigh: "উচ্চ (আশা কৰ্মী নিয়োজন)",
    notesLabel: "যত্নলওঁতাৰ মন্তব্য (আশা কৰ্মীৰ বাবে):",
    notesPlaceholder: "যেনে: আম্মাৰ পুৱাৰ ঔষধ লওঁতে অলপ খেলি-মেলি হৈছিল, ফটো গেমত ভতিজাকক চিনি পোৱা নাছিল।",
    cancel: "বাতিল কৰক",
    sendRequest: "অনুৰোধ / সতৰ্কতা পঠিয়াওক",
    successTitle: "অনুৰোধ সফলতাৰে পঠিওৱা হ’ল",
    successMsg: "আপোনাৰ স্বাস্থ্যৰ সমস্ত তথ্য প্ৰেৰণ কৰা হৈছে:",
    successNote: "তেওঁলোকৰ ক্লিনিক সমন্বয়কক অৱগত কৰা হৈছে।",
    dispatchRef: "ৰেফাৰেন্স সংখ্যা",
    returnDashboard: "ড্যাশবৰ্ডলৈ উভতি যাওক",
    pending: "অপেক্ষাৰত",
    lastActive: "সক্ৰিয় অৱস্থা: ২ ঘণ্টা আগতে · সাপ্তাহিক সাৰাংশ তলত দিয়া হৈছে",
    gamesLabel: "এই সপ্তাহৰ খেল",
    remindersLabel: "সম্পূৰ্ণ হোৱা স্মাৰকসমূহ",
    alertBannerText: "মানসিক ক্ষমতাৰ স্ক’ৰ ধাৰাবাহিকভাৱে ২ সপ্তাহ ধৰি হ্ৰাস পাইছে। লগত কথা পতক — চিকিৎসালয়ক অৱগত কৰা হৈছে।"
  },
  bn: {
    title: "তত্ত্বাবধায়ক ড্যাশবোর্ড",
    offline: "অফলাইনে চলছে।",
    recordsQueued: "তথ্য স্থানীয়ভাবে সংরক্ষিত হয়েছে।",
    dataSaved: "তথ্য সংরক্ষিত হয়েছে।",
    patientSelect: "রোগী নির্বাচন",
    patientDetails: "আজকের রোগীর বিবরণ",
    cognitiveDomains: "এই সপ্তাহের জ্ঞানীয় ডোমেন",
    domains: { Memory: "স্মৃতিশক্তি", Attention: "মনোযোগ", Language: "ভাষা", "Sound recall": "শব্দ স্মরণ" },
    todaysMedicine: "আজকের ওষুধ",
    completed: "সম্পন্ন",
    complianceRate: "ওষুধ গ্রহণের হার",
    cognitiveTrend: "৫ সপ্তাহের জ্ঞানীয় প্রবণতা",
    trendNote: "সাধারণ সীমা ৬০-৮৫। আম্মার স্কোর ঠিক আছে কিন্তু কমছে - পিএইচসির সাথে কথা বলা উচিত।",
    moodThisWeek: "এই সপ্তাহের মেজাজ",
    recentActivity: "সাম্প্রতিক ক্রিয়াকলাপ",
    linkedHealthWorker: "সংযুক্ত স্বাস্থ্য কর্মী",
    lastVisit: "শেষ পরিদর্শন: ১২ দিন আগে · জেলা পিএইচসি",
    requestHomeVisit: "হোম ভিজিট অনুরোধ করুন",
    alertSensitivity: "সতর্কতা সংবেদনশীলতা",
    notifyImmediate: "আমাকে অবিলম্বে জানান",
    notifyWeekly: "কেবল সাপ্তাহিক সারাংশ",
    call: "কল করুন",
    message: "বার্তা পাঠান",
    scheduleVideo: "ভিডিও কল নির্ধারণ করুন",
    exportReport: "রিপোর্ট ডাউনলোড করুন",
    reportTitle: "ক্লিনিকাল মূল্যায়ন রিপোর্ট",
    patientName: "রোগীর নাম",
    ageSex: "বয়স / লিঙ্গ",
    dateGenerated: "রিপোর্ট তৈরির তারিখ",
    diagnosticBaseline: "প্রাথমিক মূল্যায়ন",
    clinicianScores: "চিকিৎসকের মূল্যায়ন স্কোর",
    metric: "সূচক",
    score: "স্কোর",
    status: "স্থিতি",
    mmse: "MMSE স্কোর",
    moca: "MoCA মূল্যায়ন",
    gameScore: "মেমরি গেম গড় স্কোর",
    decline: "সামান্য হ্রাস",
    stable: "স্থিতিশীল",
    complianceMood: "ওষুধ গ্রহণ ও মেজাজের তথ্য",
    compRateLabel: "ওষুধের নিয়মিততা",
    todayMoodLabel: "আজকের মেজাজ",
    completedTests: "সম্পন্ন পরীক্ষা",
    games: "খেলা",
    clinicianSig: "চিকিৎসকের স্বাক্ষর",
    caregiverSig: "তত্ত্বাবধায়কের স্বাক্ষর",
    sigDate: "স্বাক্ষর / তারিখ",
    printReport: "রিপোর্ট প্রিন্ট করুন",
    close: "বন্ধ করুন",
    phcTitle: "পিএইচসি চিকিৎসা সতর্কতা",
    phcSubtitle: "রোগীর তথ্য সরাসরি আঞ্চলিক স্বাস্থ্য কেন্দ্রে পাঠান।",
    phcLabel: "নিকটবর্তী পিএইচসি নির্বাচন করুন:",
    urgencyLabel: "জরুরী অবস্থা:",
    urgencyLow: "কম",
    urgencyMedium: "মাঝারি",
    urgencyHigh: "উচ্চ (আশা কর্মী নিয়োগ)",
    notesLabel: "তত্ত্বাবধায়কের মন্তব্য:",
    notesPlaceholder: "যেমন: সকালে ওষুধ নেওয়ার সময় আম্মা একটু বিভ্রান্ত ছিলেন।",
    cancel: "বাতিল",
    sendRequest: "অনুরোধ / সতর্কতা পাঠান",
    successTitle: "অনুরোধ পাঠানো হয়েছে",
    successMsg: "তথ্য সফলভাবে পাঠানো হয়েছে:",
    successNote: "ক্লিনিক সমন্বয়কারীকে জানানো হয়েছে।",
    dispatchRef: "রেফারেন্স নম্বর",
    returnDashboard: "ড্যাশবোর্ডে ফিরে যান",
    pending: "অপেক্ষারত",
    lastActive: "সক্রিয়: ২ ঘণ্টা আগে",
    gamesLabel: "এই সপ্তাহের খেলা",
    remindersLabel: "সম্পন্ন রিমাইন্ডার",
    alertBannerText: "মানসিক ক্ষমতা ২ সপ্তাহ ধরে হ্রাস পাচ্ছে। যোগাযোগ করুন — চিকিৎসালয়কে জানানো হয়েছে।"
  },
  ta: {
    title: "பராமரிப்பாளர் டாஷ்போர்டு",
    offline: "ஆஃப்லைனில் இயங்குகிறது.",
    recordsQueued: "பதிவுகள் சேமிக்கப்பட்டுள்ளன.",
    dataSaved: "தரவு சேமிக்கப்பட்டது.",
    patientSelect: "நோயாளி தேர்வு",
    patientDetails: "இன்றைய நோயாளி விவரங்கள்",
    cognitiveDomains: "இந்த வார அறிவாற்றல் களங்கள்",
    domains: { Memory: "நினைவாற்றல்", Attention: "கவனம்", Language: "மொழி", "Sound recall": "ஒலி நினைவு" },
    todaysMedicine: "இன்றைய மருந்துகள்",
    completed: "முடிந்தது",
    complianceRate: "மருந்து இணக்க விகிதம்",
    cognitiveTrend: "5 வார அறிவாற்றல் போக்கு",
    trendNote: "சாதாரண வரம்பு 60-85. அம்மாவின் மதிப்பெண் நன்றாக உள்ளது ஆனால் குறைகிறது - மருத்துவரிடம் பேச வேண்டும்.",
    moodThisWeek: "இந்த வார மனநிலை",
    recentActivity: "சமீபத்திய செயல்பாடு",
    linkedHealthWorker: "இணைக்கப்பட்ட சுகாதார ஊழியர்",
    lastVisit: "கடைசி வருகை: 12 நாட்களுக்கு முன்பு · மாவட்ட PHC",
    requestHomeVisit: "வீட்டு வருகையைக் கோருங்கள்",
    alertSensitivity: "அலர்ட் உணர்திறன்",
    notifyImmediate: "உடனே எனக்கு அறிவிக்கவும்",
    notifyWeekly: "வாராந்திர சுருக்கம் மட்டும்",
    call: "அழைக்கவும்",
    message: "செய்தி அனுப்பவும்",
    scheduleVideo: "வீடியோ கால் திட்டமிடவும்",
    exportReport: "அறிக்கையை பதிவிறக்க செய்க",
    reportTitle: "மருத்துவ மதிப்பீட்டு அறிக்கை",
    patientName: "நோயாளி பெயர்",
    ageSex: "வயது / பாலினம்",
    dateGenerated: "உருவாக்கப்பட்ட தேதி",
    diagnosticBaseline: "ஆரம்ப மதிப்பீடு",
    clinicianScores: "மருத்துவர் மதிப்பெண்கள்",
    metric: "அளவீடு",
    score: "மதிப்பெண்",
    status: "நிலை",
    mmse: "MMSE மதிப்பெண்",
    moca: "MoCA மதிப்பீடு",
    gameScore: "நினைவக விளையாட்டு சராசரி",
    decline: "லேசான குறைவு",
    stable: "நிலையானது",
    complianceMood: "மருந்து மற்றும் மனநிலை பதிவுகள்",
    compRateLabel: "மருந்து இணக்கம்",
    todayMoodLabel: "இன்றைய மனநிலை",
    completedTests: "முடிக்கப்பட்ட சோதனைகள்",
    games: "விளையாட்டுகள்",
    clinicianSig: "மருத்துவர் கையொப்பம்",
    caregiverSig: "பராமரிப்பாளர் சான்றளிப்பு",
    sigDate: "கையொப்பம் / தேதி",
    printReport: "அறிக்கையை அச்சிடுக",
    close: "மூடுக",
    phcTitle: "PHC மருத்துவ அலர்ட்",
    phcSubtitle: "நோயாளியின் தகவலை நேரடியாக சுகாதார மையத்திற்கு அனுப்பவும்.",
    phcLabel: "அருகிலுள்ள PHC ஐத் தேர்ந்தெடுக்கவும்:",
    urgencyLabel: "அவசர நிலை:",
    urgencyLow: "குறைந்த",
    urgencyMedium: "நடுத்தர",
    urgencyHigh: "அதி அவசரம்",
    notesLabel: "பராமரிப்பாளர் குறிப்புகள்:",
    notesPlaceholder: "உதாரணமாக: காலையில் மருந்து எடுக்கும்போது அம்மா சற்று குழப்பமடைந்தார்.",
    cancel: "ரத்து செய்",
    sendRequest: "அலர்ட் அனுப்பவும்",
    successTitle: "அலர்ட் அனுப்பப்பட்டது",
    successMsg: "தகவல் வெற்றிகரமாக அனுப்பப்பட்டது:",
    successNote: "மருத்துவமனை ஒருங்கிணைப்பாளருக்கு தகவல் தெரிவிக்கப்பட்டுள்ளது.",
    dispatchRef: "குறிப்பு எண்",
    returnDashboard: "டாஷ்போர்டுக்குத் திரும்பு",
    pending: "காத்திருக்கிறது",
    lastActive: "செயலில்: 2 மணி நேரத்திற்கு முன்பு",
    gamesLabel: "இந்த வார விளையாட்டுகள்",
    remindersLabel: "முடிக்கப்பட்ட நினைவூட்டல்கள்",
    alertBannerText: "அறிவாற்றல் மதிப்பெண் 2 வாரங்களாகக் குறைந்து வருகிறது. மருத்துவரைத் தொடர்பு கொள்ளவும்."
  },
  te: {
    title: "కేర్ గివర్ డాష్‌బోర్డ్",
    offline: "ఆఫ్‌లైన్‌లో నడుస్తోంది.",
    recordsQueued: "రికార్డులు సేవ్ చేయబడ్డాయి.",
    dataSaved: "డేటా సేవ్ చేయబడింది.",
    patientSelect: "రోగి ఎంపిక",
    patientDetails: "ఈరోజు రోగి వివరాలు",
    cognitiveDomains: "ఈ వారం కాగ్నిటివ్ డొమైన్లు",
    domains: { Memory: "జ్ఞాపకశక్తి", Attention: "శ్రద్ధ", Language: "భాష", "Sound recall": "ధ్వని గుర్తింపు" },
    todaysMedicine: "ఈరోజు మందులు",
    completed: "పూర్తయింది",
    complianceRate: "మందుల వాడకం శాతం",
    cognitiveTrend: "5 వారాల కాగ్నిటివ్ ట్రెండ్",
    trendNote: "సాధారణ పరిధి 60-85. అమ్మ స్కోరు బాగుంది కానీ తగ్గుతోంది - డాక్టర్‌తో మాట్లాడాలి.",
    moodThisWeek: "ఈ వారం మానసిక స్థితి",
    recentActivity: "ఇటీవలి కార్యాచరణ",
    linkedHealthWorker: "కనెక్ట్ చేయబడిన ఆరోగ్య కార్యకర్త",
    lastVisit: "చివరి సందర్శన: 12 రోజుల క్రితం · జిల్లా PHC",
    requestHomeVisit: "హోమ్ విజిట్ అభ్యర్థించండి",
    alertSensitivity: "అలర్ట్ సెన్సిటివిటీ",
    notifyImmediate: "నాకు వెంటనే తెలియజేయండి",
    notifyWeekly: "వారానికోసారి నివేదిక మాత్రమే",
    call: "కాల్ చేయండి",
    message: "సందేశం పంపండి",
    scheduleVideo: "వీడియో కాల్ షెడ్యూల్ చేయండి",
    exportReport: "నివేదికను డౌన్‌లోడ్ చేసుకోండి",
    reportTitle: "క్లినికల్ అసెస్‌మెంట్ రిపోర్ట్",
    patientName: "రోగి పేరు",
    ageSex: "వయస్సు / లింగం",
    dateGenerated: "జనరేట్ చేసిన తేదీ",
    diagnosticBaseline: "ప్రాథమిక అంచనా",
    clinicianScores: "డాక్టర్ స్కోర్లు",
    metric: "కొలమానం",
    score: "స్కోర్",
    status: "స్థితి",
    mmse: "MMSE స్కోర్",
    moca: "MoCA అంచనా",
    gameScore: "మెమరీ గేమ్ యావరేజ్",
    decline: "స్వల్ప తగ్గుదల",
    stable: "స్థిరంగా ఉంది",
    complianceMood: "మందులు & మానసిక స్థితి నివేదిక",
    compRateLabel: "మందుల సక్రమత",
    todayMoodLabel: "ఈరోజు మానసిక స్థితి",
    completedTests: "పూర్తయిన పరీక్షలు",
    games: "ఆటలు",
    clinicianSig: "వైద్యుడి సంతకం",
    caregiverSig: "కేర్ గివర్ ధృవీకరణ",
    sigDate: "సంతకం / తేదీ",
    printReport: "రిపోర్ట్ ప్రింట్ చేయండి",
    close: "మూసివేయి",
    phcTitle: "PHC టెలిమెడికల్ అలర్ట్",
    phcSubtitle: "రోగి సమాచారాన్ని నేరుగా ఆరోగ్య కేంద్రానికి పంపండి.",
    phcLabel: "దగ్గరలోని PHCని ఎంచుకోండి:",
    urgencyLabel: "అవసరత శాతం:",
    urgencyLow: "తక్కువ",
    urgencyMedium: "మధ్యస్థం",
    urgencyHigh: "అत्यవసరం",
    notesLabel: "కేర్ గివర్ నోట్స్:",
    notesPlaceholder: "ఉదాహరణకు: ఉదయం మందులు తీసుకునేటప్పుడు అమ్మ కొద్దిగా అయోమయానికి గురైంది.",
    cancel: "రద్దు చేయి",
    sendRequest: "అలర్ట్ పంపండి",
    successTitle: "అలర్ట్ పంపబడింది",
    successMsg: "సమాచారం విజయవంతంగా పంపబడింది:",
    successNote: "క్లినిక్ సమన్వయకర్తకు సమాచారం అందించబడింది.",
    dispatchRef: "రెఫరెన్స్ నంబర్",
    returnDashboard: "డాష్‌బోర్డ్‌కు తిరిగి వెళ్ళు",
    pending: "వేచి ఉంది",
    lastActive: "యాక్టివ్: 2 గంటల క్రితం",
    gamesLabel: "ఈ వారం ఆటలు",
    remindersLabel: "పూర్తయిన రిమైండర్లు",
    alertBannerText: "జ్ఞాపకశక్తి స్కోరు 2 వారాలుగా తగ్గుతోంది. వైద్యుడిని సంప్రదించండి."
  },
  kn: {
    title: "ಆರೈಕೆದಾರರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    offline: "ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿದೆ.",
    recordsQueued: "ದಾಖಲೆಗಳನ್ನು ಉಳಿಸಲಾಗಿದೆ.",
    dataSaved: "ಮಾಹಿತಿ ಉಳಿಸಲಾಗಿದೆ.",
    patientSelect: "ರೋಗಿಯ ಆಯ್ಕೆ",
    patientDetails: "ಇಂದಿನ ರೋಗಿಯ ವಿವರಗಳು",
    cognitiveDomains: "ಈ ವಾರದ ಅರಿವಿನ ಡೊಮೇನ್‌ಗಳು",
    domains: { Memory: "ನೆನಪಿನ ಶಕ್ತಿ", Attention: "ಗಮನ", Language: "ಭಾಷೆ", "Sound recall": "ಧ್ವನಿ ನೆನಪು" },
    todaysMedicine: "ಇಂದಿನ ಔಷಧಿಗಳು",
    completed: "ಪೂರ್ಣಗೊಂಡಿದೆ",
    complianceRate: "ಔಷಧಿ ಅನುಸರಣೆ ದರ",
    cognitiveTrend: "5 ವಾರಗಳ ಅರಿವಿನ ಪ್ರವೃತ್ತಿ",
    trendNote: "ಸಾಮಾನ್ಯ ಶ್ರೇಣಿ 60-85. ಅಮ್ಮನ ಸ್ಕೋರ್ ಚೆನ್ನಾಗಿದೆ ಆದರೆ ಕಡಿಮೆಯಾಗುತ್ತಿದೆ - ವೈದ್ಯರೊಂದಿಗೆ ಮಾತನಾಡಬೇಕು.",
    moodThisWeek: "ಈ ವಾರದ ಮನಸ್ಥಿತಿ",
    recentActivity: "ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ",
    linkedHealthWorker: "ಸಂಪರ್ಕಿತ ಆರೋಗ್ಯ ಕಾರ್ಯಕರ್ತ",
    lastVisit: "ಕೊನೆಯ ಭೇಟಿ: 12 ದಿನಗಳ ಹಿಂದೆ · ಜಿಲ್ಲಾ PHC",
    requestHomeVisit: "ಮನೆ ಭೇಟಿಗೆ ವಿನಂತಿಸಿ",
    alertSensitivity: "ಅಲರ್ಟ್ ಸಂವೇದನೆ",
    notifyImmediate: "ನನಗೆ ತಕ್ಷಣ ತಿಳಿಸಿ",
    notifyWeekly: "ವಾರಕ್ಕೊಮ್ಮೆ ಸಾರಾಂಶ ಮಾತ್ರ",
    call: "ಕರೆ ಮಾಡಿ",
    message: "ಸಂದೇಶ ಕಳುಹಿಸಿ",
    scheduleVideo: "ವಿಡಿಯೋ ಕಾಲ್ ನಿಗದಿಪಡಿಸಿ",
    exportReport: "ವರದಿಯನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
    reportTitle: "ಕ್ಲಿನಿಕಲ್ ಮೌಲ್ಯಮಾಪನ ವರದಿ",
    patientName: "ರೋಗಿಯ ಹೆಸರು",
    ageSex: "ವಯಸ್ಸು / ಲಿಂಗ",
    dateGenerated: "ವರದಿ ತಯಾರಿಸಿದ ದಿನಾಂక",
    diagnosticBaseline: "ಪ್ರಾಥಮಿಕ ಮೌಲ್ಯಮಾಪನ",
    clinicianScores: "ವೈದ್ಯರ ಅಂಕಗಳು",
    metric: "ಅಳತೆಗೋಲು",
    score: "ಅಂಕ",
    status: "ಸ್ಥಿತಿ",
    mmse: "MMSE ಅಂಕ",
    moca: "MoCA ಮೌಲ್ಯಮಾಪನ",
    gameScore: "ಮೆಮೊರಿ ಆಟದ ಸರಾಸರಿ",
    decline: "ಸ್ವಲ್ಪ ಇಳಿಕೆ",
    stable: "ಸ್ಥಿರವಾಗಿದೆ",
    complianceMood: "ಔಷಧಿ ಮತ್ತು ಮನಸ್ಥಿತಿ ದಾಖಲೆಗಳು",
    compRateLabel: "ಔಷಧಿ ಅನುಸರಣೆ",
    todayMoodLabel: "ಇಂದಿನ ಮನಸ್ಥಿತಿ",
    completedTests: "ಪೂರ್ಣಗೊಂಡ ಪರೀಕ್ಷೆಗಳು",
    games: "ಆಟಗಳು",
    clinicianSig: "ವೈದ್ಯರ ಸಹಿ",
    caregiverSig: "ಆರೈಕೆದಾರರ ಪ್ರಮಾಣೀಕರಣ",
    sigDate: "ಸಹಿ / ದಿನಾಂక",
    printReport: "ವರದಿ ಪ್ರಿಂಟ್ ಮಾಡಿ",
    close: "ಮುಚ್ಚಿ",
    phcTitle: "PHC ವೈದ್ಯಕೀಯ ಅಲರ್ಟ್",
    phcSubtitle: "ರೋಗಿಯ ಮಾಹಿತಿಯನ್ನು ನೇರವಾಗಿ ಆರೋಗ್ಯ ಕೇಂದ್ರಕ್ಕೆ ಕಳುಹಿಸಿ.",
    phcLabel: "ಹತ್ತಿರದ PHC ಆಯ್ಕೆಮಾಡಿ:",
    urgencyLabel: "ತುರ್ತು ಮಟ್ಟ:",
    urgencyLow: "ಕಡಿಮೆ",
    urgencyMedium: "ಮಧ್ಯಮ",
    urgencyHigh: "ಅತ್ಯಂತ ತುರ್ತು",
    notesLabel: "ಆರೈಕೆದಾರರ ಟಿಪ್ಪಣಿಗಳು:",
    notesPlaceholder: "ಉದಾಹರಣೆಗೆ: ಬೆಳಗ್ಗೆ ಔಷಧಿ ತೆಗೆದುಕೊಳ್ಳುವಾಗ ಅಮ್ಮ ಸ್ವಲ್ಪ ಗೊಂದಲಕ್ಕೊಳಗಾಗಿದ್ದರು.",
    cancel: "ರದ್ದುಮಾಡಿ",
    sendRequest: "ಅಲರ್ಟ್ ಕಳುಹಿಸಿ",
    successTitle: "ಅಲರ್ಟ್ ಕಳುಹಿಸಲಾಗಿದೆ",
    successMsg: "ಮಾಹಿತಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಕಳುಹಿಸಲಾಗಿದೆ:",
    successNote: "ಆಸ್ಪತ್ರೆಯ ಸಂಯೋಜಕರಿಗೆ ಮಾಹಿತಿ ನೀಡಲಾಗಿದೆ.",
    dispatchRef: "ಉಲ್ಲೇಖ ಸಂಖ್ಯೆ",
    returnDashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ",
    pending: "ಕಾಯುತ್ತಿದೆ",
    lastActive: "ಸಕ್ರಿಯ: 2 ಗಂಟೆಯ ಹಿಂದೆ",
    gamesLabel: "ಈ ವಾರದ ಆಟಗಳು",
    remindersLabel: "ಪೂರ್ಣಗೊಂಡ ನೆನಪೋಲೆಗಳು",
    alertBannerText: "ಅರಿವಿನ ಸ್ಕೋರ್ 2 ವಾರಗಳಿಂದ ಕಡಿಮೆಯಾಗುತ್ತಿದೆ. ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ."
  },
  ml: {
    title: "കെയർഗിവർ ഡാഷ്‌ബോർഡ്",
    offline: "ഓഫ്‌ലൈനിലാണ്.",
    recordsQueued: "റെക്കോർഡുകൾ സൂക്ഷിച്ചിരിക്കുന്നു.",
    dataSaved: "ഡാറ്റ സംരക്ഷിച്ചു.",
    patientSelect: "രോഗിയെ തിരഞ്ഞെടുക്കുക",
    patientDetails: "ഇന്നത്തെ രോഗിയുടെ വിവരങ്ങൾ",
    cognitiveDomains: "ഈ ആഴ്ചയിലെ കോഗ്നിറ്റീവ് ഡൊമെയ്‌നുകൾ",
    domains: { Memory: "ഓർമ്മശക്തി", Attention: "ശ്രദ്ധ", Language: "ഭാഷ", "Sound recall": "ശബ്ദ ഓർമ്മ" },
    todaysMedicine: "ഇന്നത്തെ മരുന്നുകൾ",
    completed: "പൂർത്തിയായി",
    complianceRate: "മരുന്ന് ഉപയോഗ നിരക്ക്",
    cognitiveTrend: "5 ആഴ്ചയിലെ കോഗ്നിറ്റീവ് ട്രെൻഡ്",
    trendNote: "സാധാരണ പരിധി 60-85. അമ്മയുടെ സ്കോർ മികച്ചതാണ് എന്നാൽ കുറയുന്നു - ഡോക്ടറോട് സംസാരിക്കണം.",
    moodThisWeek: "ഈ ആഴ്ചയിലെ മാനസികാവസ്ഥ",
    recentActivity: "സമീപകാല പ്രവർത്തനം",
    linkedHealthWorker: "ബന്ധിപ്പിച്ച ആരോഗ്യ പ്രവർത്തകൻ",
    lastVisit: "അവസാന സന്ദർശനം: 12 ദിവസങ്ങൾക്ക് മുമ്പ് · ജില്ലാ PHC",
    requestHomeVisit: "ഹോം സന്ദർശനം അഭ്യർത്ഥിക്കുക",
    alertSensitivity: "അലർട്ട് സെൻസിറ്റിവിറ്റി",
    notifyImmediate: "എന്നെ ഉടനടി അറിയിക്കുക",
    notifyWeekly: "വാരത്തിലൊരിക്കൽ മാത്രം",
    call: "വിളിക്കുക",
    message: "സന്ദേശം അയക്കുക",
    scheduleVideo: "വീഡിയോ കോൾ നിശ്ചയിക്കുക",
    exportReport: "റിപ്പോർട്ട് ഡൗൺലോഡ് ചെയ്യുക",
    reportTitle: "ക്ലിനിക്കൽ വിലയിരുത്തൽ റിപ്പോർട്ട്",
    patientName: "രോഗിയുടെ പേര്",
    ageSex: "പ്രായം / ലിംഗം",
    dateGenerated: "റിപ്പോർട്ട് തീയതി",
    diagnosticBaseline: "പ്രാഥമിക വിലയിരുത്തൽ",
    clinicianScores: "ഡോക്ടറുടെ സ്കോറുകൾ",
    metric: "സൂചിക",
    score: "സ്കോർ",
    status: "നില",
    mmse: "MMSE സ്കോർ",
    moca: "MoCA വിലയിരുത്തൽ",
    gameScore: "മെമ്മറി ഗെയിം ശരാശരി",
    decline: "ചെറിയ കുറവ്",
    stable: "സ്ഥിരമാണ്",
    complianceMood: "മരുന്ന് & മാനസികാവസ്ഥ വിവരങ്ങൾ",
    compRateLabel: "മരുന്ന് ഉപയോഗം",
    todayMoodLabel: "ഇന്നത്തെ മാനസികാവസ്ഥ",
    completedTests: "പൂർത്തിയാക്കിയ പരിശോധനകൾ",
    games: "കളികൾ",
    clinicianSig: "ഡോക്ടറുടെ ഒപ്പ്",
    caregiverSig: "കെയർഗിവർ സാക്ഷ്യപ്പെടുത്തൽ",
    sigDate: "ഒപ്പ് / തീയതി",
    printReport: "റിപ്പോർട്ട് പ്രിന്റ് ചെയ്യുക",
    close: "അടക്കുക",
    phcTitle: "PHC മെഡിക്കൽ അലർട്ട്",
    phcSubtitle: "രോഗിയുടെ വിവരങ്ങൾ നേരിട്ട് ആരോഗ്യ കേന്ദ്രത്തിലേക്ക് അയക്കുക.",
    phcLabel: "അടുത്തുള്ള PHC തിരഞ്ഞെടുക്കുക:",
    urgencyLabel: "അടിയന്തിരതയുടെ അളവ്:",
    urgencyLow: "കുറഞ്ഞ",
    urgencyMedium: "ഇടത്തരം",
    urgencyHigh: "അതി അടിയന്തിരം",
    notesLabel: "കെയർഗിവർ കുറിപ്പുകൾ:",
    notesPlaceholder: "ഉദാഹരണത്തിന്: രാവിലെ മരുന്ന് കഴിക്കുമ്പോൾ അമ്മയ്ക്ക് ചെറിയ ആശയക്കുഴപ്പമുണ്ടായി.",
    cancel: "റദ്ദാക്കുക",
    sendRequest: "അലർട്ട് അയക്കുക",
    successTitle: "അലർട്ട് അയച്ചു കഴിഞ്ഞു",
    successMsg: "വിവരങ്ങൾ വിജയകരമായി അയച്ചു:",
    successNote: "ക്ലിനിക് കോർഡിനേറ്ററെ വിവരമറിയിച്ചിട്ടുണ്ട്.",
    dispatchRef: "റഫറൻസ് നമ്പർ",
    returnDashboard: "ഡാഷ്‌ബോർഡിലേക്ക് മടങ്ങുക",
    pending: "കാത്തിരിക്കുന്നു",
    lastActive: "സജീവം: 2 മണിക്കൂർ മുമ്പ്",
    gamesLabel: "ഈ വാരത്തിലെ കളികൾ",
    remindersLabel: "പൂർത്തിയാക്കിയ ഓർമ്മപ്പെടുത്തലുകൾ",
    alertBannerText: "കോഗ്നിറ്റീവ് സ്കോർ 2 ആഴ്ചയായി കുറയുന്നു. ഡോക്ടറെ സമീപിക്കുക."
  },
  mr: {
    title: "देखभालकर्ता डॅशबोर्ड",
    offline: "ऑफलाईन मोड सुरू आहे.",
    recordsQueued: "रेकॉर्ड जतन केले आहेत.",
    dataSaved: "माहिती जतन केली.",
    patientSelect: "रुग्ण निवड",
    patientDetails: "आजचा रुग्ण तपशील",
    cognitiveDomains: "या आठवड्यातील संज्ञानात्मक क्षेत्रे",
    domains: { Memory: "स्मरणशक्ती", Attention: "लक्ष देणे", Language: "भाषा", "Sound recall": "ध्वनी स्मरण" },
    todaysMedicine: "आजची औषधे",
    completed: "पूर्ण झाले",
    complianceRate: "औषध घेण्याचा दर",
    cognitiveTrend: "5 आठवड्यांचा संज्ञानात्मक कल",
    trendNote: "सामान्य श्रेणी 60-85 आहे. अम्माचे गुण समाधानकारक आहेत पण घसरत आहेत - पीएचसीशी संपर्क साधावा.",
    moodThisWeek: "या आठवड्याचा मूड",
    recentActivity: "अलीकडील क्रियाकलाप",
    linkedHealthWorker: "संलग्न आरोग्य सेवक",
    lastVisit: "शेवटची भेट: १२ दिवसांपूर्वी · जिल्हा पीएचसी",
    requestHomeVisit: "गृह भेटीची विनंती करा",
    alertSensitivity: "अलर्ट संवेदनशीलता",
    notifyImmediate: "मला त्वरित सूचित करा",
    notifyWeekly: "केवळ साप्ताहिक सारांश",
    call: "कॉल करा",
    message: "संदेश पाठवा",
    scheduleVideo: "व्हिडिओ कॉल शेड्यूल करा",
    exportReport: "डॉक्टरांच्या भेटीसाठी अहवाल काढा",
    reportTitle: "क्लिनिकल मूल्यांकन अहवाल",
    patientName: "रुग्णाचे नाव",
    ageSex: "वय / लिंग",
    dateGenerated: "अहवाल तयार केल्याची तारीख",
    diagnosticBaseline: "प्राथमिक मूल्यांकन",
    clinicianScores: "डॉक्टरांचे गुण",
    metric: "मापदंड",
    score: "गुण",
    status: "स्थिती",
    mmse: "MMSE गुण",
    moca: "MoCA मूल्यांकन",
    gameScore: "मेमरी गेम सरासरी",
    decline: "किरकोळ घट",
    stable: "स्थिर",
    complianceMood: "औषध आणि मूड नोंदी",
    compRateLabel: "औषध अनुपालन",
    todayMoodLabel: "आजचा मूड",
    completedTests: "पूर्ण चाचण्या",
    games: "खेळ",
    clinicianSig: "डॉक्टरांची स्वाक्षरी",
    caregiverSig: "देखभालकर्त्याचे प्रमाणपत्र",
    sigDate: "स्वाक्षरी / तारीख",
    printReport: "अहवाल प्रिंट करा",
    close: "बंद करा",
    phcTitle: "पीएचसी वैद्यकीय अलर्ट",
    phcSubtitle: "रुग्णाची माहिती थेट आरोग्य केंद्राकडे पाठवा.",
    phcLabel: "जवळपासचे पीएचसी निवडा:",
    urgencyLabel: "तातडीची पातळी:",
    urgencyLow: "कमी",
    urgencyMedium: "मध्यम",
    urgencyHigh: "अति तातडीचे",
    notesLabel: "देखभालकर्त्याची नोंद:",
    notesPlaceholder: "उदा. सकाळी औषध घेताना अम्मा थोडे गोंधळले होते.",
    cancel: "रद्द करा",
    sendRequest: "अलर्ट पाठवा",
    successTitle: "अलर्ट यशस्वीरीत्या पाठवला",
    successMsg: "माहिती यशस्वीरीत्या पाठवली आहे:",
    successNote: "दवाखाना समन्वयकाला कळवले आहे.",
    dispatchRef: "संदर्भ क्रमांक",
    returnDashboard: "डॅशबोर्डवर परत जा",
    pending: "प्रलंबित",
    lastActive: "सक्रिय: २ तासांपूर्वी",
    gamesLabel: "या आठवड्यातील खेळ",
    remindersLabel: "पूर्ण स्मरणपत्रे",
    alertBannerText: "संज्ञानात्मक गुण २ आठवड्यांपासून घसरत आहेत. डॉक्टरांचा सल्ला घ्या."
  },
  gu: {
    title: "સંભાળ રાખનાર ડેશબોર્ડ",
    offline: "ઓફલાઇન ચાલે છે.",
    recordsQueued: "રેકોર્ડ સેવ થયા છે.",
    dataSaved: "માહિતી સેવ થઈ.",
    patientSelect: "દર્દી પસંદગી",
    patientDetails: "આજના દર્દીની વિગતો",
    cognitiveDomains: "આ અઠવાડિયે જ્ઞાનાત્મક ક્ષેત્રો",
    domains: { Memory: "યાદશક્તિ", Attention: "ધ્યાન", Language: "ભાષા", "Sound recall": "અવાજ ઓળખ" },
    todaysMedicine: "આજની દવાઓ",
    completed: "પૂર્ણ થયું",
    complianceRate: "દવા લેવાનો દર",
    cognitiveTrend: "5 અઠવાડિયાનો જ્ઞાનાત્મક ટ્રેન્ડ",
    trendNote: "સામાન્ય મર્યાદા 60-85 છે. અમ્માના ગુણ સારા છે પણ ઘટી રહ્યા છે - પીએચસી સાથે વાત કરવી યોગ્ય છે.",
    moodThisWeek: "આ અઠવાડિયાનો મૂડ",
    recentActivity: "તાજેતરની પ્રવૃત્તિ",
    linkedHealthWorker: "જોડાયેલ આરોગ્ય કાર્યકર",
    lastVisit: "છેલ્લી મુલાકાત: 12 દિવસ પહેલા · જિલ્લા પીએચસી",
    requestHomeVisit: "ઘર મુલાકાતની વિનંતી કરો",
    alertSensitivity: "અલર્ટ સંવેદનશીલતા",
    notifyImmediate: "મને તરત જ જાણ કરો",
    notifyWeekly: "ફક્ત સાપ્તાહিক સારાંશ",
    call: "કોલ કરો",
    message: "સંદેશ મોકલો",
    scheduleVideo: "વીડિયો કોલ શિડ્યુઅલ કરો",
    exportReport: "ડૉક્ટર માટે રિપોર્ટ ડાઉનલોڈ કરો",
    reportTitle: "ક્લિનિકલ મૂલ્યાંકન અહેવાલ",
    patientName: "દર્દીનું નામ",
    ageSex: "ઉંમર / લિંગ",
    dateGenerated: "રિપોર્ટ જનરેટ તારીખ",
    diagnosticBaseline: "પ્રાથમિક મૂલ્યાંકન",
    clinicianScores: "ડૉક્ટરના સ્કોર્સ",
    metric: "માપદંડ",
    score: "સ્કોર",
    status: "સ્થિતિ",
    mmse: "MMSE સ્કોર",
    moca: "MoCA મૂલ્યાંકન",
    gameScore: "મેમરી ગેમ સરેરાશ",
    decline: "સામાન્ય ઘટાડો",
    stable: "સ્થિર",
    complianceMood: "દવા અને મૂડ રેકોર્ડ",
    compRateLabel: "દવા નિયમિતતા",
    todayMoodLabel: "આજનો મૂડ",
    completedTests: "પૂર્ણ થયેલ પરીક્ષણો",
    games: "રમતો",
    clinicianSig: "ડૉક્ટરની સહી",
    caregiverSig: "સંભાળ રાખનારનું પ્રમાણપત્ર",
    sigDate: "સહી / તારીખ",
    printReport: "રિપોર્ટ પ્રિન્ટ કરો",
    close: "બંધ કરો",
    phcTitle: "PHC તબીબી અલર્ટ",
    phcSubtitle: "દર્દીની માહિતી સીધી આરોગ્ય કેન્દ્ર પર મોકલો.",
    phcLabel: "નજીકનું PHC પસંદ કરો:",
    urgencyLabel: "તાકીદનું સ્તર:",
    urgencyLow: "ઓછું",
    urgencyMedium: "મધ્યમ",
    urgencyHigh: "અતિ તાકીદનું",
    notesLabel: "સંભાળ રાખનારની નોંધ:",
    notesPlaceholder: "દા.ત. સવારે દવા લેતી વખતે અમ્મા થોડા મૂંઝવણમાં હતા.",
    cancel: "ரદ કરો",
    sendRequest: "અલર્ટ મોકલો",
    successTitle: "અલર્ટ સફળતાપૂર્વક મોકલવામાં આવ્યો",
    successMsg: "માહિતી સફળતાપૂર્વક મોકલાઈ છે:",
    successNote: "દવાખાના સંયોજકને જાણ કરવામાં આવી છે.",
    dispatchRef: "સંદર્ભ નંબર",
    returnDashboard: "ડેશબોર્ડ પર પાછા જાઓ",
    pending: "બાકી છે",
    lastActive: "સક્રિય: 2 કલાક પહેલા",
    gamesLabel: "આ અઠવાડિયાની રમતો",
    remindersLabel: "પૂર્ણ થયેલ રિમાઇન્ડર્સ",
    alertBannerText: "જ્ઞાનાત્મક સ્કોર 2 અઠવાડિયાથી ઘટી રહ્યો છે. ડૉક્ટરનો સંપર્ક કરો."
  },
  pa: {
    title: "ਦੇਖਭਾਲਕਰਤਾ ਡੈਸ਼ਬੋਰਡ",
    offline: "ਔਫਲਾਈਨ ਚੱਲ ਰਿਹਾ ਹੈ।",
    recordsQueued: "ਰਿਕਾਰਡ ਸੁਰੱਖਿਅਤ ਕੀਤੇ ਗਏ ਹਨ।",
    dataSaved: "ਡਾਟਾ ਸੁਰੱਖਿਅਤ ਹੋਇਆ।",
    patientSelect: "ਮਰੀਜ਼ ਦੀ ਚੋਣ",
    patientDetails: "ਅੱਜ ਦੇ ਮਰੀਜ਼ ਦੇ ਵੇਰਵੇ",
    cognitiveDomains: "ਇਸ ਹਫ਼ਤੇ ਦੇ ਗਿਆਨਾਤਮਕ ਖੇਤਰ",
    domains: { Memory: "ਯਾਦਦਾਸ਼ਤ", Attention: "ਧਿਆਨ", Language: "ਭਾਸ਼ਾ", "Sound recall": "ਆਵਾਜ਼ ਯਾਦ ਕਰਨਾ" },
    todaysMedicine: "ਅੱਜ ਦੀਆਂ ਦਵਾਈਆਂ",
    completed: "ਪੂਰਾ ਹੋਇਆ",
    complianceRate: "ਦਵਾਈ ਲੈਣ ਦੀ ਦਰ",
    cognitiveTrend: "5 ਹਫ਼ਤਿਆਂ ਦਾ ਗਿਆਨਾਤਮਕ ਰੁਝਾਨ",
    trendNote: "ਆਮ ਸੀਮਾ 60-85 ਹੈ। ਅੰਮਾ ਦਾ ਸਕੋਰ ਠੀਕ ਹੈ ਪਰ ਘਟ ਰਿਹਾ ਹੈ - ਪੀਐਚਸੀ ਨਾਲ ਗੱਲ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ।",
    moodThisWeek: "ਇਸ ਹਫ਼ਤੇ ਦਾ ਮੂਡ",
    recentActivity: "ਹਾਲੀਆ ਸਰਗਰਮੀ",
    linkedHealthWorker: "ਲਿੰਕਡ ਸਿਹਤ ਕਰਮਚਾਰੀ",
    lastVisit: "ਆਖਰੀ ਦੌਰਾ: 12 ਦਿਨ ਪਹਿਲਾਂ · ਜ਼ਿਲ੍ਹਾ ਪੀਐਚਸੀ",
    requestHomeVisit: "ਘਰ ਆਉਣ ਦੀ ਬੇਨਤੀ ਕਰੋ",
    alertSensitivity: "ਅਲਰਟ ਸੰਵੇਦਨਸ਼ੀਲਤਾ",
    notifyImmediate: "ਮੈਨੂੰ ਤੁਰੰਤ ਸੂਚਿਤ ਕਰੋ",
    notifyWeekly: "ਸਿਰਫ਼ ਹਫ਼ਤਾਵਾਰੀ ਸਾਰਾਂਸ਼",
    call: "ਕਾਲ ਕਰੋ",
    message: "ਸੁਨੇਹਾ ਭੇਜੋ",
    scheduleVideo: "ਵੀਡੀਓ ਕਾਲ ਨਿਰਧਾਰਤ ਕਰੋ",
    exportReport: "ਡਾਕਟਰ ਲਈ ਰਿਪੋਰਟ ਡਾਊਨਲੋਡ ਕਰੋ",
    reportTitle: "ਕਲੀਨਿਕਲ ਮੁਲਾਂਕਣ ਰਿਪੋਰਟ",
    patientName: "ਮਰੀਜ਼ ਦਾ ਨਾਮ",
    ageSex: "ਉਮਰ / ਲਿੰਗ",
    dateGenerated: "ਰਿਪੋਰਟ ਬਣਾਉਣ ਦੀ ਮਿਤੀ",
    diagnosticBaseline: "ਮੁੱਢਲਾ ਮੁਲਾਂਕਣ",
    clinicianScores: "ਡਾਕਟਰ ਦੇ ਸਕੋਰ",
    metric: "ਮਾਪਦੰਡ",
    score: "ਸਕੋਰ",
    status: "ਸਥਿਤੀ",
    mmse: "MMSE ਸਕੋਰ",
    moca: "MoCA ਮੁਲਾਂਕਣ",
    gameScore: "ਮੈਮੋਰੀ ਗੇਮ ਔਸਤ",
    decline: "ਮਾਮੂਲੀ ਗਿਰਾਵਟ",
    stable: "ਸਥਿਰ",
    complianceMood: "ਦਵਾਈ ਅਤੇ ਮੂਡ ਦੇ ਰਿਕਾਰਡ",
    compRateLabel: "ਦਵਾਈ ਦੀ ਨਿਯਮਿਤਤਾ",
    todayMoodLabel: "ਅੱਜ ਦਾ ਮੂਡ",
    completedTests: "ਪੂਰੇ ਕੀਤੇ ਟੈਸਟ",
    games: "ਖੇਡਾਂ",
    clinicianSig: "ਡਾਕਟਰ ਦੇ ਦਸਤਖਤ",
    caregiverSig: "ਦੇਖਭਾਲਕਰਤਾ ਦਾ ਪ੍ਰਮਾਣ ਪੱਤਰ",
    sigDate: "ਦਸਤਖਤ / ਮਿਤੀ",
    printReport: "ਰਿਪੋਰਟ ਪ੍ਰਿਂਟ ਕਰੋ",
    close: "ਬੰਦ ਕਰੋ",
    phcTitle: "PHC ਮੈਡੀਕਲ ਅਲਰਟ",
    phcSubtitle: "ਮਰੀਜ਼ ਦੀ ਜਾਣਕਾਰੀ ਸਿੱਧੀ ਸਿਹਤ ਕੇਂਦਰ ਵਿੱਚ ਭੇਜੋ।",
    phcLabel: "ਨਜ਼ਦੀਕੀ PHC ਚੁਣੋ:",
    urgencyLabel: "ਲੋੜੀਂਦੀ ਤਾਕੀਦ ਦਾ ਪੱਧਰ:",
    urgencyLow: "ਘੱਟ",
    urgencyMedium: "ਦਰਮਿਆਨਾ",
    urgencyHigh: "ਅਤਿ ਜ਼ਰੂਰੀ",
    notesLabel: "ਦੇਖਭਾਲਕਰਤਾ ਦੀ ਨੋਟਿਸ:",
    notesPlaceholder: "ਉਦਾਹਰਨ ਲਈ: ਸਵੇਰੇ ਦਵਾਈ ਲੈਂਦੇ ਸਮੇਂ ਅੰਮਾ ਥੋੜ੍ਹੇ ਉਲਝਣ ਵਿੱਚ ਸਨ।",
    cancel: "ਰੱਦ ਕਰੋ",
    sendRequest: "ਅਲਰਟ ਭੇਜੋ",
    successTitle: "ਅਲਰਟ ਸਫ਼ਲਤਾਪੂਰਵਕ ਭੇਜਿਆ ਗਿਆ",
    successMsg: "ਜਾਣਕਾਰੀ ਸਫ਼ਲਤਾਪੂਰਵਕ ਭੇਜੀ ਗਈ ਹੈ:",
    successNote: "ਕਲੀਨਿਕ ਕੋਆਰਡੀਨੇਟਰ ਨੂੰ ਸੂਚਿਤ ਕਰ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
    dispatchRef: "ਹਵਾਲਾ ਨੰਬਰ",
    returnDashboard: "ਡੈਸ਼ਬੋਰਡ 'ਤੇ ਵਾਪਸ ਜਾਓ",
    pending: "ਬਾਕੀ ਹੈ",
    lastActive: "ਸਰਗਰਮ: 2 ਘੰਟੇ ਪਹਿਲਾਂ",
    gamesLabel: "ਇਸ ਹਫ਼ਤੇ ਦੀਆਂ ਖੇਡਾਂ",
    remindersLabel: "ਪੂਰੇ ਕੀਤੇ ਰੀਮਾਈਂਡਰ",
    alertBannerText: "ਗਿਆਨਾਤਮਕ ਸਕੋਰ 2 ਹਫ਼ਤਿਆਂ ਤੋਂ ਘਟ ਰਿਹਾ ਹੈ। ਡਾਕਟਰ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।"
  },
  or: {
    title: "ଦେଖାଶୁଣାକାରୀ ଡ୍ୟାସବୋର୍ଡ",
    offline: "ଅଫଲାଇନରେ ଚାଲୁଅଛି।",
    recordsQueued: "ତଥ୍ୟ ସଂରକ୍ଷିତ ହୋଇଛି।",
    dataSaved: "ତଥ୍ୟ ସଫଳତାର ସହ ସଂରକ୍ଷିତ ହେଲା।",
    patientSelect: "ରୋଗୀ ଚୟନ",
    patientDetails: "ଆଜିର ରୋଗୀ ବିବରଣୀ",
    cognitiveDomains: "ଏହି ସପ୍ତାହର କଗ୍ନିଟିଭ୍ ଡୋମେନ୍",
    domains: { Memory: "ସ୍ମୃତି ଶକ୍ତି", Attention: "ଧ୍ୟାନ", Language: "ଭାଷା", "Sound recall": "ଶବ୍ਦ ମନେ ପକାଇବା" },
    todaysMedicine: "ଆଜିର ଔଷଧ",
    completed: "ସମ୍ପୂର୍ଣ୍ଣ",
    complianceRate: "ଔଷଧ ନିୟମିତତା ହାର",
    cognitiveTrend: "୫ ସପ୍ତାହର କଗ୍ନିଟିଭ୍ ଟ୍ରେଣ୍ଡ୍",
    trendNote: "ସାଧାରଣ ସୀମਾ ୬୦-୮୫। ଅମ୍ମାଙ୍କ ସ୍କୋର ଠିକ୍ ଅଛି କିନ୍ତୁ ହ୍ରାସ ପାଉଛି - ଡାକ୍ତରଖାନା ସହ କଥା ହେବା ଉଚିତ୍।",
    moodThisWeek: "ଏହି ସପ୍ତାହର ମନୋଭାବ",
    recentActivity: "ସାମ୍ପ୍ରତିକ କାର୍ଯ୍ୟକଳାପ",
    linkedHealthWorker: "ସଂଯୁକ୍ତ ସ୍ୱାସ୍ଥ୍ୟ କର୍ମୀ",
    lastVisit: "ଶେଷ ସାକ୍ଷାତକାର: ୧୨ ଦିନ ପୂର୍ବରୁ · ଜିଲ୍ଲା PHC",
    requestHomeVisit: "ଗୃହ ପରିଦର୍ଶନ ଅନୁରୋਧ କରନ୍ତୁ",
    alertSensitivity: "ସତਰ୍କତା ସଂବେଦନଶୀଳତା",
    notifyImmediate: "ମୋତେ ତুରନ୍ତ ଜଣାନ୍ତୁ",
    notifyWeekly: "କେବଳ ସାପ୍ତାହିକ ସାରାଂଶ",
    call: "କଲ୍ କରନ୍ତୁ",
    message: "ସନ୍ଦେଶ ପଠାନ୍ତୁ",
    scheduleVideo: "ଭିଡିଓ କଲ୍ ସମୟ ନିର୍ଦ୍ଧାରଣ କରନ୍ତୁ",
    exportReport: "ଡାକ୍ତରଙ୍କ ପାଇଁ ରିପୋର୍ଟ ଡାଉନଲୋଡ୍ କରନ୍ତୁ",
    reportTitle: "କ୍ଲିନିକାଲ୍ ମୂଲ୍ୟାଙ୍କନ ରିପୋର୍ଟ",
    patientName: "ରୋଗୀଙ୍କ ନାମ",
    ageSex: "ବୟସ / ଲିଙ୍ଗ",
    dateGenerated: "ରିପୋର୍ଟ ପ୍ରସ୍ତուତ ତାରିଖ",
    diagnosticBaseline: "ପ୍ରାରମ୍ଭିକ ମୂଲ୍ୟାଙ୍କନ",
    clinicianScores: "ଡାକ୍ତରଙ୍କ ମୂଲ୍ୟାଙ୍କନ ସ୍କୋର",
    metric: "ସୂଚక",
    score: "ସ୍କୋର",
    status: "ସ୍ଥିତି",
    mmse: "MMSE ସ୍କୋର",
    moca: "MoCA ମୂଲ୍ୟାଙ୍କନ",
    gameScore: "ମେମୋରୀ ଗେମ୍ ହାରାହାରି",
    decline: "ସାମାନ୍ୟ ହ୍ରାਸ",
    stable: "ସ୍ଥିର",
    complianceMood: "ଔଷଧ ଏବଂ ମନୋଭାବର ତଥ୍ୟ",
    compRateLabel: "ଔଷଧ ନିୟମਿତତା",
    todayMoodLabel: "ଆଜିର ମନୋଭାବ",
    completedTests: "ସମ୍ପୂର୍ଣ୍ଣ ହୋଇଥିବା ପରୀକ୍ଷା",
    games: "ଖେଳ",
    clinicianSig: "ଡାକ୍ତରଙ୍କ ସ୍ୱାକ୍ଷર",
    caregiverSig: "ଦେଖାଶୁଣାକାରୀଙ୍କ ପ୍ରମାណୀକରଣ",
    sigDate: "ସ୍ୱାକ୍ଷਰ / ତାରିଖ",
    printReport: "ରିପୋର୍ଟ ପ୍ରିଣ୍ଟ୍ କରନ୍ତୁ",
    close: "বন্ধ କରନ୍ତୁ",
    phcTitle: "PHC ଚିକିତ୍ସା ସତਰ୍କତା",
    phcSubtitle: "ରୋଗୀଙ୍କ ସ୍ୱାସ୍ଥ୍ୟ ତଥ୍ୟ ସିଧାସଳଖ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ରକୁ ପଠାନ୍ତୁ।",
    phcLabel: "ନିକଟସ୍ଥ PHC ବାଛନ୍ତୁ:",
    urgencyLabel: "ଜରուରୀକାଳୀନ ସ୍ତର:",
    urgencyLow: "କମ୍",
    urgencyMedium: "ମଧ୍ୟମ",
    urgencyHigh: "ଅତି ଜରୁରୀ",
    notesLabel: "ଦେଖାଶୁଣାକାରୀଙ୍କ ମତାମତ:",
    notesPlaceholder: "ଯେପରିକି: ସକାଳେ ଔଷଧ ଖାଇବା ସମୟରେ ଅମ୍ମା ସାମାନ୍ୟ ଦ୍ୱନ୍ଦ୍ୱରେ ଥିଲେ।",
    cancel: "ବାତିଲ୍ କରନ୍ତୁ",
    sendRequest: "ସତਰ୍କତା ପଠାନ୍ତୁ",
    successTitle: "ସତਰ୍କତା ସଫଳତାର ସହ ପଠାଗଲା",
    successMsg: "ତଥ୍ୟ ସଫଳତାର ସହ ପଠାଯାଇଛି:",
    successNote: "ଡାକ୍ତରଖାନା ସମନ୍ୱୟକାରୀଙ୍କୁ ଅବଗତ କରାଯାଇଛି।",
    dispatchRef: "ରେଫରେନ୍ସ ନମ୍ବର",
    returnDashboard: "ଡ୍ୟାସବୋର୍ଡକୁ ଫେରିଯାଆନ୍ତು",
    pending: "ଅପେକ୍ଷାରତ",
    lastActive: "ସକ୍ରିୟ: ୨ ଘଣ୍ଟା ପୂର୍ବରୁ",
    gamesLabel: "ଏହି ସପ୍ତାହର ଖେଳ",
    remindersLabel: "ସମ୍ପୂର୍ଣ୍ଣ ରିମାଇଣ୍ଡର",
    alertBannerText: "କଗ୍ନିଟିવ୍ ସ୍କୋର ୨ ସପ୍ତାହ ଧରି ହ୍ରାସ ପାଉଛି। ଡାକ୍તରଙ୍କ ସହ କଥา ହୁଅନ୍ତୁ।"
  },
  ur: {
    title: "دیکھ بھال کرنے والے کا ڈیش بورڈ",
    offline: "آف لائن چل رہا ہے۔",
    recordsQueued: "تفصیلات محفوظ کر لی گئی ہیں۔",
    dataSaved: "ڈیٹا محفوظ ہو گیا۔",
    patientSelect: "مریض کا انتخاب",
    patientDetails: "آج کے مریض کی تفصیلات",
    cognitiveDomains: "اس ہفتے کے علمی ڈومینز",
    domains: { Memory: "یادداشت", Attention: "توجہ", Language: "زبان", "Sound recall": "آواز یاد کرنا" },
    todaysMedicine: "آج کی ادویات",
    completed: "مکمل",
    complianceRate: "دوا کے استعمال کی شرح",
    cognitiveTrend: "5 ہفتے کا علمی رجحان",
    trendNote: "عام حد 60-85 ہے۔ اماں کا اسکور ٹھیک ہے لیکن کم ہو رہا ہے - ڈاکٹر سے بات کرنی چاہیے۔",
    moodThisWeek: "اس ہفتے کا موڈ",
    recentActivity: "حالیہ سرگرمی",
    linkedHealthWorker: "منسلک صحت کارکن",
    lastVisit: "آخری دورہ: 12 دن پہلے · ضلع پی ایչ سی",
    requestHomeVisit: "غور کے دورے کی درخواست کریں",
    alertSensitivity: "الرٹ حساسیت",
    notifyImmediate: "مجھے فوری طور پر مطلع کریں",
    notifyWeekly: "صرف ہفتہ وار خلاصہ",
    call: "کال کریں",
    message: "پیغام بھیجیں",
    scheduleVideo: "ویڈیو کال شیڈول کریں",
    exportReport: "رپورٹ ڈاؤن لوڈ کریں",
    reportTitle: "کلینیکل تشخیص کی رپورٹ",
    patientName: "مریض کا نام",
    ageSex: "عمر / جنس",
    dateGenerated: "رپورٹ تیار کرنے کی تاریخ",
    diagnosticBaseline: "ابتدائی تشخیص",
    clinicianScores: "ڈاکٹر کے اسکورز",
    metric: "پیمائش",
    score: "اسکور",
    status: "حالت",
    mmse: "MMSE اسکور",
    moca: "MoCA تشخیص",
    gameScore: "یادداشت کے کھیل کا اوسط",
    decline: "معمولی کمی",
    stable: "مستحکم",
    complianceMood: "دوا اور موڈ کا ریکارڈ",
    compRateLabel: "دوا کی پابندی",
    todayMoodLabel: "آج کا موڈ",
    completedTests: "مکمل شدہ ٹیسٹ",
    games: "کھیل",
    clinicianSig: "ڈاکٹر کے دستخط",
    caregiverSig: "دیکھ بھال کرنے والے کی تصدیق",
    sigDate: "دستخط / تاریخ",
    printReport: "رپورٹ پرنٹ کریں",
    close: "بند کریں",
    phcTitle: "PHC طبی الرٹ",
    phcSubtitle: "مریض کی معلومات براہ راست ہیلتھ سینٹر بھیجیں۔",
    phcLabel: "قریب ترین PHC منتخب کریں:",
    urgencyLabel: "فوری ضرورت کی سطح:",
    urgencyLow: "کم",
    urgencyMedium: "درمیانی",
    urgencyHigh: "انتہائی فوری",
    notesLabel: "دیکھ بھال کرنے والے کا نوٹ:",
    notesPlaceholder: "مثال کے طور پر: صبح دوا لیتے وقت اماں تھوڑا الجھن کا شکار تھیں۔",
    cancel: "منسوخ کریں",
    sendRequest: "الرٹ بھیجیں",
    successTitle: "الرٹ کامیابی سے بھیجا گیا",
    successMsg: "معلومات کامیابی سے بھیجی گئی ہیں:",
    successNote: "کلینک کوآرڈینیٹر کو مطلع کر دیا گیا ہے۔",
    dispatchRef: "حوالہ نمبر",
    returnDashboard: "ڈیش بورڈ پر واپس جائیں",
    pending: "زیر التواء",
    lastActive: "سرگرم: 2 گھنٹے پہلے",
    gamesLabel: "اس ہفتے کے کھیل",
    remindersLabel: "مکمل یاد دہانیاں",
    alertBannerText: "یادداشت کا اسکور 2 ہفتوں سے کم ہو رہا ہے۔  ڈاکٹر سے رابطہ کریں۔"
  }
};

function primaryBtn(color) {
  return {
    display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 14,
    border: "none", background: color, color: "white", fontSize: 14, fontWeight: 800, cursor: "pointer",
  };
}

function TopBar({ title }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0 14px" }}>
      <div style={{ fontSize: 21, fontWeight: 800, color: TEXT_DARK, flex: 1 }}>{title}</div>
    </div>
  );
}

function SectionLabel({ children }) {
  return <div style={{ fontSize: 12.5, fontWeight: 800, color: MUTED, marginBottom: 10, letterSpacing: 0.3, marginTop: 12 }}>{children}</div>;
}

export default function CaregiverScreen({ reminders = [], mood = "", gameHistory = [], isOnline = true, syncQueue = 0, language = "en" }) {
  const [patient, setPatient] = useState("Amma");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [notifyMode, setNotifyMode] = useState("immediate");
  const patients = ["Amma", "Bapu (father-in-law)"];

  // Clinician & Alert States
  const [showClinicianReport, setShowClinicianReport] = useState(false);
  const [showPhcAlert, setShowPhcAlert] = useState(false);
  const [selectedPhc, setSelectedPhc] = useState("guwahati");
  const [urgencyLevel, setUrgencyLevel] = useState("medium");
  const [customVocalNotes, setCustomVocalNotes] = useState("");
  const [dispatchStatus, setDispatchStatus] = useState("idle"); // idle | sending | completed
  const [dispatchId, setDispatchId] = useState("");

  const LANGUAGE_FALLBACKS = {
    karbi: "as", mising: "as", nyishi: "hi", adi: "hi", apatani: "hi", monpa: "hi", galo: "hi",
    tangkhul: "mni", thadou: "mni", paite: "mni", hmar: "mni", khasi: "en", garo: "en",
    jaintia: "en", mizo: "en", lai: "en", mara: "en", nagamese: "as", ao: "en", angami: "en",
    sumi: "en", lotha: "en", konyak: "en", kokborok: "bn", sikkimese: "ne", lepcha: "ne"
  };

  const resolvedLang = LANGUAGE_FALLBACKS[language] || language || "en";
  const t = CAREGIVER_TRANS[resolvedLang] || CAREGIVER_TRANS["en"];

  const defaultWeeks = [
    { label: "Wk 1", score: 78 }, { label: "Wk 2", score: 81 }, { label: "Wk 3", score: 75 },
    { label: "Wk 4", score: 68 }, { label: "Wk 5", score: 64 },
  ];

  const hasHistory = gameHistory.length > 0;
  const latestGameScore = hasHistory ? gameHistory[0].score : null;

  const weeks = [...defaultWeeks];
  if (latestGameScore) {
    weeks.push({ label: "Today", score: latestGameScore });
  }

  const completedReminders = reminders.filter(r => r.done).length;
  const complianceRate = reminders.length > 0
    ? Math.round((completedReminders / reminders.length) * 100)
    : 100;

  const defaultMoods = ["😊", "🙂", "😊", "😐", "🙂", "😐"];
  const moodWeek = [...defaultMoods];
  moodWeek.push(mood ? mood : "⏳");

  const max = 100;

  const domains = [
    { label: t.domains.Memory, pct: latestGameScore ? Math.min(100, Math.round(latestGameScore * 1.1)) : 80, color: TEAL },
    { label: t.domains.Attention, pct: 65, color: AMBER },
    { label: t.domains.Language, pct: 90, color: GREEN },
    { label: t.domains["Sound recall"], pct: 72, color: "#6B5FC4" },
  ];

  // Map real reminders to meds
  const meds = reminders && reminders.length > 0 ? reminders.map(r => ({
    time: r.time,
    text: r.text,
    taken: r.done
  })) : [
    { time: "8:00 AM", text: "Blood pressure tablet", taken: true },
    { time: "8:30 PM", text: "Evening tablet", taken: false },
  ];

  // Blend real game completions into activity feed
  const activity = [];
  if (gameHistory && gameHistory.length > 0) {
    gameHistory.slice(0, 3).forEach((g, idx) => {
      activity.push({
        icon: Gamepad2,
        text: `Played ${g.gameName || "Memory Match"} — Score: ${g.score} (${g.difficulty})`,
        time: `Today, ${g.date || "recent"}`,
        color: TEAL
      });
    });
  }
  // Standard preset activities
  activity.push(
    { icon: BookHeart, text: "Recorded a memory — \u201cThe Bihu festival, 1978\u201d", time: "Yesterday, 6:40 PM", color: CORAL },
    { icon: Pill, text: "Marked evening tablet as not yet taken", time: "Yesterday, 8:45 PM", color: AMBER },
    { icon: Trophy, text: "Unlocked badge — Memory Champion", time: "2 days ago", color: "#B98A2E" }
  );

  const activePhc = PHC_CENTERS.find(p => p.id === selectedPhc) || PHC_CENTERS[0];

  const handleSendPhcEscalation = (e) => {
    e.preventDefault();
    playTapSound();
    setDispatchStatus("sending");

    setTimeout(() => {
      playMatchSound();
      setDispatchStatus("completed");
      const generatedRef = "MEMRO-PHC-" + Math.floor(100000 + Math.random() * 900000);
      setDispatchId(generatedRef);
    }, 2000);
  };

  const handleCall = () => {
    playTapSound();
    alert(`Calling ASHA worker Rina Bora at ${activePhc.contact}...`);
  };

  const handleMessage = () => {
    playTapSound();
    alert(`Opening secure chat message window for ASHA worker Rina Bora...`);
  };

  const handleScheduleVideo = () => {
    playTapSound();
    alert("Video consultation request scheduled for tomorrow at 11:00 AM. Confirmation SMS sent to caregiver.");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
      <TopBar title={t.title} />
      
      {/* Offline Sync Banner */}
      {!isOnline && (
        <div style={{
          background: AMBER_LIGHT, borderRadius: 16, padding: "12px 14px", display: "flex",
          gap: 10, alignItems: "center", marginBottom: 16, border: "1px solid #fbf0ce"
        }}>
          <WifiOff size={18} color={AMBER} style={{ flexShrink: 0 }} />
          <div style={{ fontSize: 12, color: "#78350f", fontWeight: 700 }}>
            {t.offline} {syncQueue > 0 ? `${syncQueue} ${t.recordsQueued}` : t.dataSaved}
          </div>
        </div>
      )}

      <div style={{ padding: "0 0 24px" }}>
        {/* Patient switcher */}
        <div style={{ position: "relative", marginBottom: 6 }}>
          <button
            onClick={() => { playTapSound(); setPickerOpen((p) => !p); }}
            style={{
              display: "flex", alignItems: "center", gap: 8, border: "none", background: TEAL_LIGHT,
              borderRadius: 14, padding: "10px 14px", cursor: "pointer", fontSize: 14.5, fontWeight: 800,
              color: TEAL_DARK,
            }}
          >
            👤 {patient} <ChevronRight size={14} style={{ transform: pickerOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
          </button>
          {pickerOpen && (
            <div style={{
              position: "absolute", top: 46, left: 0, zIndex: 6, background: "white", borderRadius: 14,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)", overflow: "hidden", width: 220,
            }}>
              {patients.map((p) => (
                <button
                  key={p} onClick={() => { playTapSound(); setPatient(p); setPickerOpen(false); }}
                  style={{
                    display: "block", width: "100%", textAlign: "left", padding: "12px 14px", border: "none",
                    background: p === patient ? TEAL_LIGHT : "white", cursor: "pointer", fontSize: 13.5, color: TEXT_DARK,
                  }}
                >{p}</button>
              ))}
            </div>
          )}
        </div>
        <div style={{ fontSize: 12, color: MUTED, marginBottom: 18 }}>{t.lastActive}</div>

        {/* Quick stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div style={{ background: TEAL_LIGHT, borderRadius: 16, padding: "14px" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: TEAL_DARK }}>{complianceRate}%</div>
            <div style={{ fontSize: 12, color: MUTED }}>{t.remindersLabel}</div>
          </div>
          <div style={{ background: AMBER_LIGHT, borderRadius: 16, padding: "14px" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#7A4A0E" }}>{11 + gameHistory.length}</div>
            <div style={{ fontSize: 12, color: MUTED }}>{t.gamesLabel}</div>
          </div>
        </div>

        {/* Alert banner */}
        <div style={{
          background: CORAL_LIGHT, borderRadius: 16, padding: "14px 16px", display: "flex", gap: 12,
          alignItems: "flex-start", marginBottom: 20,
        }}>
          <AlertTriangle size={20} color="#A32D2D" style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: 13.5, color: "#7A1F1F" }}>
            {t.alertBannerText}
          </div>
        </div>

        {/* Domain breakdown */}
        <SectionLabel>{t.cognitiveDomains}</SectionLabel>
        <div style={{ background: "white", borderRadius: 18, padding: "16px 16px 6px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: 20 }}>
          {domains.map((d) => (
            <div key={d.label} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
                <span style={{ color: TEXT_DARK, fontWeight: 700 }}>{d.label}</span>
                <span style={{ color: MUTED }}>{d.pct}%</span>
              </div>
              <div style={{ height: 7, background: "#EEEEE6", borderRadius: 999, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${d.pct}%`, background: d.color, borderRadius: 999 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Medicine adherence */}
        <SectionLabel>{t.todaysMedicine}</SectionLabel>
        <div style={{ marginBottom: 20 }}>
          {meds.map((m, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 14,
              background: m.taken ? GREEN_LIGHT : CORAL_LIGHT, marginBottom: 8,
            }}>
              {m.taken ? <Check size={17} color={GREEN} /> : <AlertTriangle size={17} color={CORAL} />}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: TEXT_DARK }}>{m.text}</div>
                <div style={{ fontSize: 11.5, color: MUTED }}>{m.time}</div>
              </div>
              <span style={{ fontSize: 11.5, fontWeight: 800, color: m.taken ? "#1F6B4A" : "#A32D2D" }}>{m.taken ? t.completed : t.pending}</span>
            </div>
          ))}
        </div>

        {/* Trend chart */}
        <div style={{ background: TEAL_LIGHT, borderRadius: 18, padding: "18px 16px", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <TrendingUp size={18} color={TEAL_DARK} />
            <div style={{ fontSize: 14, fontWeight: 800, color: TEAL_DARK }}>{t.cognitiveTrend}</div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 130 }}>
            {weeks.map((w, idx) => (
              <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ fontSize: 12, color: MUTED, marginBottom: 6 }}>{w.score}</div>
                <div style={{
                  width: "100%", height: `${(w.score / max) * 100}px`, borderRadius: 8,
                  background: w.score < 70 ? AMBER : TEAL,
                }} />
                <div style={{ fontSize: 11, color: MUTED, marginTop: 6 }}>{w.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ fontSize: 11.5, color: MUTED, marginBottom: 20, lineHeight: 1.5 }}>
          {t.trendNote}
        </div>

        {/* Mood */}
        <div style={{ background: GREEN_LIGHT, borderRadius: 18, padding: "16px", marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#1F6B4A", marginBottom: 10 }}>{t.moodThisWeek}</div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {moodWeek.map((m, i) => (
              <div key={i} style={{ textAlign: "center", fontSize: 20 }}>{m}</div>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <SectionLabel>{t.recentActivity}</SectionLabel>
        <div style={{ marginBottom: 20 }}>
          {activity.map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10, background: `${a.color}1A`, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}><a.icon size={16} color={a.color} /></div>
              <div>
                <div style={{ fontSize: 13, color: TEXT_DARK, lineHeight: 1.4 }}>{a.text}</div>
                <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* PHC / ASHA contact */}
        <SectionLabel>{t.linkedHealthWorker}</SectionLabel>
        <div style={{
          background: "white", borderRadius: 18, padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          display: "flex", alignItems: "center", gap: 14, marginBottom: 20,
        }}>
          <div style={{
            width: 46, height: 46, borderRadius: "50%", background: TEAL_LIGHT, display: "flex",
            alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}><Stethoscope size={22} color={TEAL_DARK} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: TEXT_DARK }}>Rina Bora, ASHA worker</div>
            <div style={{ fontSize: 12, color: MUTED }}>{t.lastVisit}</div>
          </div>
        </div>
        <button 
          onClick={() => { playTapSound(); setShowPhcAlert(true); }}
          style={{ ...primaryBtn(TEAL_LIGHT), color: TEAL_DARK, width: "100%", justifyContent: "center", marginBottom: 20 }}
        >
          {t.requestHomeVisit}
        </button>

        {/* Notification sensitivity */}
        <SectionLabel>{t.alertSensitivity}</SectionLabel>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[["immediate", t.notifyImmediate], ["weekly", t.notifyWeekly]].map(([key, label]) => (
            <button
              key={key} onClick={() => { playTapSound(); setNotifyMode(key); }}
              style={{
                flex: 1, padding: "12px 10px", borderRadius: 14, border: "none", cursor: "pointer",
                fontSize: 12.5, fontWeight: 700, background: notifyMode === key ? TEAL : TEAL_LIGHT,
                color: notifyMode === key ? "white" : TEXT_DARK,
              }}
            >{label}</button>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          <button style={{ ...primaryBtn(TEAL), flex: 1, justifyContent: "center" }} onClick={handleCall}><PhoneCall size={16} /> {t.call}</button>
          <button style={{ ...primaryBtn(AMBER), flex: 1, justifyContent: "center" }} onClick={handleMessage}><MessageCircle size={16} /> {t.message}</button>
        </div>
        <button style={{ ...primaryBtn(TEAL_LIGHT), color: TEAL_DARK, width: "100%", justifyContent: "center", marginBottom: 16 }} onClick={handleScheduleVideo}>
          {t.scheduleVideo}
        </button>

        <button 
          onClick={() => { playTapSound(); setShowClinicianReport(true); }}
          style={{ ...primaryBtn(GREEN), width: "100%", justifyContent: "center", marginBottom: 12 }}
        >
          <Download size={16} /> {t.exportReport}
        </button>

        <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.6 }}>
          {t.exportNote}
        </div>
      </div>

      {/* Clinician PDF Modal Overlay */}
      {showClinicianReport && (
        <div style={{
          position: "absolute", inset: 0, background: "rgba(35, 49, 43, 0.7)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 120, backdropFilter: "blur(4px)", padding: "20px 10px"
        }}>
          <div className="tp-anim" style={{
            background: "white", width: "100%", maxWidth: 370, borderRadius: 24, padding: 20,
            boxShadow: "var(--shadow-lg)", maxHeight: "90%", overflowY: "auto"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, borderBottom: "2px solid var(--color-bg-warm)", paddingBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <FileText size={20} color="var(--color-teal)" />
                <h3 style={{ fontSize: 16, color: "var(--color-text-dark)", fontWeight: 800 }}>{t.reportTitle}</h3>
              </div>
              <button 
                onClick={() => { playTapSound(); setShowClinicianReport(false); }}
                style={{ border: "none", background: "var(--color-teal-light)", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 12, color: "var(--color-text-dark)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, padding: 10, background: "var(--color-bg-warm)", borderRadius: 10 }}>
                <div><strong>{t.patientName}:</strong> {patient}</div>
                <div><strong>{t.ageSex}:</strong> 74 / Female</div>
                <div><strong>{t.dateGenerated}:</strong> {new Date().toLocaleDateString()}</div>
                <div><strong>{t.diagnosticBaseline}:</strong> MMSE / MoCA</div>
              </div>

              <div>
                <h4 style={{ fontSize: 13, color: "var(--color-teal)", marginBottom: 4, fontWeight: 700 }}>{t.clinicianScores}</h4>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--color-teal-soft)" }}>
                      <th style={{ padding: "4px 0", fontSize: 11, color: "var(--color-text-muted)" }}>{t.metric}</th>
                      <th style={{ padding: "4px 0", fontSize: 11, color: "var(--color-text-muted)" }}>{t.score}</th>
                      <th style={{ padding: "4px 0", fontSize: 11, color: "var(--color-text-muted)" }}>{t.status}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "6px 0" }}>{t.mmse}</td>
                      <td style={{ padding: "6px 0" }}><strong>23 / 30</strong></td>
                      <td style={{ padding: "6px 0", color: "var(--color-gold)", fontWeight: 700 }}>{t.decline}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "6px 0" }}>{t.moca}</td>
                      <td style={{ padding: "6px 0" }}><strong>19 / 30</strong></td>
                      <td style={{ padding: "6px 0", color: "var(--color-gold)", fontWeight: 700 }}>{t.decline}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "6px 0" }}>{t.gameScore}</td>
                      <td style={{ padding: "6px 0" }}><strong>{latestGameScore ? Math.round((weeks.reduce((acc, curr) => acc + curr.score, 0)) / weeks.length) : 73} pts</strong></td>
                      <td style={{ padding: "6px 0", color: "var(--color-teal)", fontWeight: 700 }}>{t.stable}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h4 style={{ fontSize: 13, color: "var(--color-teal)", marginBottom: 4, fontWeight: 700 }}>{t.complianceMood}</h4>
                <ul style={{ paddingLeft: 16, lineHeight: 1.5 }}>
                  <li>{t.compRateLabel}: <strong>{complianceRate}%</strong></li>
                  <li>{t.todayMoodLabel}: <strong>{mood ? mood : t.pending}</strong></li>
                  <li>{t.completedTests}: <strong>{weeks.length + gameHistory.length - 5} {t.games}</strong></li>
                </ul>
              </div>

              <div style={{ borderLeft: "3px solid var(--color-teal)", paddingLeft: 10, fontStyle: "italic", color: "var(--color-text-muted)", lineHeight: 1.4 }}>
                "Note: A drop in cognitive deck score has been observed from Week 2 to Week 5. Recommended action: Schedule clinician follow-up review for diagnostic comparison."
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, borderTop: "1px solid #e5e7eb", paddingTop: 10 }}>
                <div>
                  <div style={{ fontSize: 9, color: "var(--color-text-muted)" }}>{t.clinicianSig}</div>
                  <div style={{ height: 20 }}></div>
                  <div style={{ borderBottom: "1px solid #9ca3af", width: 120 }}></div>
                  <div style={{ fontSize: 10, color: "var(--color-text-dark)", marginTop: 2 }}>{t.sigDate}</div>
                </div>
                <div>
                  <div style={{ fontSize: 9, color: "var(--color-text-muted)" }}>{t.caregiverSig}</div>
                  <div style={{ height: 20 }}></div>
                  <div style={{ borderBottom: "1px solid #9ca3af", width: 120 }}></div>
                  <div style={{ fontSize: 10, color: "var(--color-text-dark)", marginTop: 2 }}>{t.sigDate}</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button
                  onClick={() => { playTapSound(); window.print(); }}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: 10,
                    border: "none",
                    background: "var(--color-teal)",
                    color: "white",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  {t.printReport}
                </button>
                <button
                  onClick={() => { playTapSound(); setShowClinicianReport(false); }}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: 10,
                    border: "1px solid var(--color-teal-soft)",
                    background: "white",
                    color: "var(--color-text-dark)",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  {t.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced PHC Escalation Modal Overlay */}
      {showPhcAlert && (
        <div style={{
          position: "absolute", inset: 0, background: "rgba(35, 49, 43, 0.7)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 120, backdropFilter: "blur(4px)", padding: "20px 10px"
        }}>
          <div className="tp-anim" style={{
            background: "white", width: "100%", maxWidth: 370, borderRadius: 24, padding: 20,
            boxShadow: "var(--shadow-lg)", maxHeight: "90%", overflowY: "auto"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, borderBottom: "1px solid var(--color-teal-soft)", paddingBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <MapPin size={20} color="var(--color-terracotta)" />
                <h3 style={{ fontSize: 16, color: "var(--color-text-dark)", fontWeight: 800 }}>{t.phcTitle}</h3>
              </div>
              <button 
                onClick={() => { playTapSound(); setShowPhcAlert(false); setDispatchStatus("idle"); }}
                style={{ border: "none", background: "var(--color-teal-light)", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <X size={16} />
              </button>
            </div>

            {dispatchStatus === "completed" ? (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <div style={{ fontSize: 44, marginBottom: 10 }}>✅</div>
                <h4 style={{ fontSize: 16, color: "var(--color-success)", fontWeight: 800, marginBottom: 8 }}>{t.successTitle}</h4>
                <div style={{
                  background: "var(--color-success-light)",
                  border: "1px dashed var(--color-success)",
                  padding: "12px",
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--color-success)",
                  marginBottom: 16,
                  display: "inline-block"
                }}>
                  {t.dispatchRef}: {dispatchId}
                </div>
                <p style={{ fontSize: 12, color: "var(--color-text-muted)", lineHeight: 1.5, marginBottom: 20 }}>
                  {t.successMsg} <strong>{activePhc.name}</strong>. {t.successNote}
                </p>
                <button
                  onClick={() => { playTapSound(); setShowPhcAlert(false); setDispatchStatus("idle"); }}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: 12,
                    border: "none",
                    background: "var(--color-teal)",
                    color: "white",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  {t.returnDashboard}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendPhcEscalation} style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 12 }}>
                <div>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: 4 }}>{t.phcLabel}</label>
                  <select
                    value={selectedPhc}
                    onChange={(e) => setSelectedPhc(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: 10,
                      border: "1px solid var(--color-teal-soft)",
                      background: "white",
                      fontSize: 12,
                      fontWeight: 600
                    }}
                  >
                    {PHC_CENTERS.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ background: "var(--color-bg-warm)", padding: 10, borderRadius: 10 }}>
                  <div>📍 <strong>Coordinates:</strong> {activePhc.coord}</div>
                  <div style={{ marginTop: 4 }}>📞 <strong>PHC Contact:</strong> {activePhc.contact}</div>
                </div>

                <div>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: 4 }}>{t.urgencyLabel}</label>
                  <div style={{ display: "flex", gap: 6 }}>
                    {["low", "medium", "high"].map(level => {
                      let displayLabel = t.urgencyLow;
                      if (level === "medium") displayLabel = t.urgencyMedium;
                      if (level === "high") displayLabel = t.urgencyHigh;

                      return (
                        <button
                          key={level}
                          type="button"
                          onClick={() => { playTapSound(); setUrgencyLevel(level); }}
                          style={{
                            flex: 1,
                            padding: "8px 4px",
                            borderRadius: 8,
                            border: "1px solid var(--color-teal-soft)",
                            textTransform: "uppercase",
                            fontSize: 10,
                            fontWeight: 700,
                            cursor: "pointer",
                            background: urgencyLevel === level 
                              ? (level === "high" ? "var(--color-danger)" : level === "medium" ? "var(--color-gold)" : "var(--color-teal)")
                              : "white",
                            color: urgencyLevel === level ? "white" : "var(--color-text-dark)"
                          }}
                        >
                          {displayLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: 4 }}>{t.notesLabel}</label>
                  <textarea
                    rows={3}
                    placeholder={t.notesPlaceholder}
                    value={customVocalNotes}
                    onChange={(e) => setCustomVocalNotes(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: 10,
                      border: "1px solid var(--color-teal-soft)",
                      fontFamily: "var(--font-body)",
                      fontSize: 12
                    }}
                  />
                </div>

                <div style={{ background: "var(--color-teal-light)", padding: 10, borderRadius: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontWeight: 700, color: "var(--color-teal)" }}>
                    <CheckSquare size={14} /> Telemetry Enclosed:
                  </div>
                  <div style={{ marginTop: 4, color: "var(--color-text-muted)" }}>
                    • Latest Memory score: {latestGameScore ? `${latestGameScore} pts` : "No runs today"}<br />
                    • Task compliance: {complianceRate}%<br />
                    • Mood state: {mood || "Not logged"}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={dispatchStatus === "sending"}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    width: "100%",
                    padding: "14px",
                    borderRadius: 12,
                    border: "none",
                    background: "var(--color-teal)",
                    color: "white",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "var(--shadow-sm)"
                  }}
                >
                  <Send size={14} /> 
                  <span>{dispatchStatus === "sending" ? "Transmitting..." : t.sendRequest}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
