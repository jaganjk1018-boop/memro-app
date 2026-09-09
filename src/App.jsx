import React, { useState, useEffect, useRef } from "react";
import { Home, Gamepad2, Bell, Users, Heart, ShieldAlert, Volume2, VolumeX, Globe, Wifi, WifiOff, RefreshCw, Mic, MicOff, BookHeart, Wind, Stethoscope, Calendar as CalendarIcon, ChevronRight, HeartHandshake } from "lucide-react";
import { playTapSound, playMatchSound, playReminderAlertSound } from "./utils/audio";
import ReminderAlertModal from "./components/ReminderAlertModal";
import MedicineVerificationModal from "./components/MedicineVerificationModal";

// Import custom screens
import HomeScreen from "./components/HomeScreen";
import GameScreen from "./components/GameScreen";
import RemindersScreen from "./components/RemindersScreen";
import FamilyScreen from "./components/FamilyScreen";
import CaregiverRoutineScreen from "./components/CaregiverRoutineScreen";
import RelativeDashboard from "./components/RelativeDashboard";
import FamilyOverviewScreen from "./components/FamilyOverviewScreen";
import BreathingScreen from "./components/BreathingScreen";
import SplashGreeting from "./components/SplashGreeting";
import SOSModal from "./components/SOSModal";
import OnboardingScreen from "./components/OnboardingScreen";
import MemoriesScreen from "./components/MemoriesScreen";
import ProgressScreen from "./components/ProgressScreen";
import ClinicianScreen from "./components/ClinicianScreen";
import CalendarScreen from "./components/CalendarScreen";
import AppSelector from "./components/AppSelector";

// All 22 Constitutional Languages of India + English
export const LANGUAGES_LIST = [
  { code: "en", name: "English", locale: "en-US" },
  { code: "hi", name: "हिन्दी (Hindi)", locale: "hi-IN" },
  { code: "as", name: "অসমীয়া (Assamese)", locale: "as-IN" },
  { code: "bn", name: "বাংলা (Bengali)", locale: "bn-IN" },
  { code: "br", name: "बर' (Bodo)", locale: "hi-IN" },
  { code: "doi", name: "डोगरी (Dogri)", locale: "hi-IN" },
  { code: "gu", name: "ગુજરાતી (Gujarati)", locale: "gu-IN" },
  { code: "kn", name: "ಕನ್ನಡ (Kannada)", locale: "kn-IN" },
  { code: "ks", name: "कॉशुर (Kashmiri)", locale: "hi-IN" },
  { code: "kok", name: "कोंकणी (Konkani)", locale: "hi-IN" },
  { code: "mai", name: "मैथिली (Maithili)", locale: "hi-IN" },
  { code: "ml", name: "മലയാളം (Malayalam)", locale: "ml-IN" },
  { code: "mni", name: "ꯃꯤꯇꯩꯂꯣꯟ (Manipuri)", locale: "bn-IN" },
  { code: "mr", name: "मराठी (Marathi)", locale: "mr-IN" },
  { code: "ne", name: "नेपाली (Nepali)", locale: "ne-NP" },
  { code: "or", name: "ଓଡ଼িଆ (Odia)", locale: "or-IN" },
  { code: "pa", name: "ਪੰਜਾਬੀ (Punjabi)", locale: "pa-IN" },
  { code: "sa", name: "संस्कृतम् (Sanskrit)", locale: "hi-IN" },
  { code: "sat", name: "ᱥᱟᱱᱛᱟᱲᱤ (Santali)", locale: "bn-IN" },
  { code: "sd", name: "सिन्धी (Sindhi)", locale: "hi-IN" },
  { code: "ta", name: "தமிழ் (Tamil)", locale: "ta-IN" },
  { code: "te", name: "తెలుగు (Telugu)", locale: "te-IN" },
  { code: "ur", name: "اردو (Urdu)", locale: "ur-PK" },
  { code: "karbi", name: "Karbi (कारबी)", locale: "hi-IN" },
  { code: "mising", name: "Mising (মিচিং)", locale: "bn-IN" },
  { code: "nyishi", name: "Nyishi (न्यीशी)", locale: "hi-IN" },
  { code: "adi", name: "Adi (आदि)", locale: "hi-IN" },
  { code: "apatani", name: "Apatani (अपाटानी)", locale: "hi-IN" },
  { code: "monpa", name: "Monpa (मोनपा)", locale: "hi-IN" },
  { code: "galo", name: "Galo (गालो)", locale: "hi-IN" },
  { code: "tangkhul", name: "Tangkhul (তাংখুল)", locale: "bn-IN" },
  { code: "thadou", name: "Thadou (থাদৌ)", locale: "bn-IN" },
  { code: "paite", name: "Paite (পাইত)", locale: "bn-IN" },
  { code: "hmar", name: "Hmar (হ্মার)", locale: "bn-IN" },
  { code: "khasi", name: "Khasi (English/Khasi)", locale: "en-IN" },
  { code: "garo", name: "Garo (Garo)", locale: "en-IN" },
  { code: "jaintia", name: "Jaintia (Pnar)", locale: "en-IN" },
  { code: "mizo", name: "Mizo (Mizo)", locale: "en-IN" },
  { code: "lai", name: "Lai (Lai)", locale: "en-IN" },
  { code: "mara", name: "Mara (Mara)", locale: "en-IN" },
  { code: "nagamese", name: "Nagamese (নাগামি)", locale: "as-IN" },
  { code: "ao", name: "Ao (Ao)", locale: "en-IN" },
  { code: "angami", name: "Angami (Angami)", locale: "en-IN" },
  { code: "sumi", name: "Sumi (Sumi)", locale: "en-IN" },
  { code: "lotha", name: "Lotha (Lotha)", locale: "en-IN" },
  { code: "konyak", name: "Konyak (Konyak)", locale: "en-IN" },
  { code: "kokborok", name: "Kokborok (ককবরক)", locale: "bn-IN" },
  { code: "sikkimese", name: "Sikkimese (Bhutia)", locale: "ne-NP" },
  { code: "lepcha", name: "Lepcha (Lepcha)", locale: "ne-NP" }
];

export const LANGUAGE_FALLBACKS = {
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

export function getLangCode(lang) {
  return LANGUAGE_FALLBACKS[lang] || lang || "en";
}

export const TRANSLATIONS = {
  en: {
    back: "Back",
    home: "Home",
    play: "Play",
    reminders: "Reminders",
    family: "Family",
    caregiver: "Caregiver",
    patientApp: "Patient App",
    voiceGuide: "Voice Guide",
    online: "Online",
    offline: "Offline Mode",
    synced: "Data Synced",
    syncing: "Syncing...",
    pinTitle: "Secure Caregiver Access",
    enterPin: "Enter PIN to access:",
    incorrectPin: "Incorrect PIN.",
    unlock: "Unlock",
    lock: "Lock",
    namaste: "Namaste",
    howFeeling: "How are you feeling today?",
    dailyTip: "Daily Tip",
    playGame: "Play a Memory Game",
    gameSub: "Simple matching game at your own pace",
    todaysReminders: "Today's Reminders",
    remindersSub: "reminders completed",
    allDone: "All tasks completed!",
    familyPhotos: "Family Photos",
    familySub: "Recognize your family members",
    deepBreathing: "Deep Breathing",
    deepBreathingSub: "Soothing cycle to relax",
    memories: "Memories",
    calm: "Calm",
    clinician: "Clinician"
  },
  hi: {
    back: "पीछे",
    home: "मुख्य",
    play: "खेलें",
    reminders: "स्मरणपत्र",
    family: "परिवार",
    caregiver: "देखभालकर्ता",
    patientApp: "मरीज ऐप",
    voiceGuide: "आवाज सहायक",
    online: "ऑनलाइन",
    offline: "ऑफ़लाइन",
    synced: "सिंक हुआ",
    syncing: "सिंक हो रहा है...",
    pinTitle: "सुरक्षित पहुंच",
    enterPin: "पिन दर्ज करें:",
    incorrectPin: "गलत पिन।",
    unlock: "खोलें",
    lock: "बंद करें",
    namaste: "नमस्ते",
    howFeeling: "आज आपको कैसा लग रहा है?",
    dailyTip: "दैनिक सलाह",
    playGame: "मेमोरी गेम खेलें",
    gameSub: "सरल कार्ड मिलान खेल",
    todaysReminders: "आज के स्मरणपत्र",
    remindersSub: "कार्य पूरे किए गए",
    allDone: "सभी कार्य पूरे हो गए!",
    familyPhotos: "परिवार की तस्वीरें",
    familySub: "अपने बच्चों को पहचानें",
    deepBreathing: "गहरी सांस लें",
    deepBreathingSub: "तनाव दूर करने के लिए",
    memories: "यादें",
    calm: "शांत",
    clinician: "चिकित्सक"
  },
  as: {
    back: "উভতি যাওক",
    home: "গৃহ",
    play: "খেলক",
    reminders: "স্মাৰক",
    family: "পৰিয়াল",
    caregiver: "যত্নলওঁতা",
    patientApp: "ৰোগী এপ",
    voiceGuide: "ধ্বনি সহায়ক",
    online: "অনলাইন",
    offline: "অফলাইন",
    synced: "সংৰক্ষিত",
    syncing: "সংৰক্ষণ হৈছে...",
    pinTitle: "সুৰক্ষিত প্ৰৱেশ",
    enterPin: "পিন লিখক:",
    incorrectPin: "ভুল পিন।",
    unlock: "খোলক",
    lock: "বন্ধ কৰক",
    namaste: "নমস্কাৰ",
    howFeeling: "আজি আপোনাৰ কেনেকুৱা লাগিছে?",
    dailyTip: "পৰামৰ্শ",
    playGame: "মেমৰী গেম খেলক",
    gameSub: "সৰল খেল খেলক",
    todaysReminders: "আজিৰ স্মাৰকসমূহ",
    remindersSub: "সম্পূৰ্ণ হৈছে",
    allDone: "সকলো কাম সম্পূৰ্ণ হ’ল!",
    familyPhotos: "পৰিয়ালৰ ফটো",
    familySub: "পৰিয়ালৰ লোকক চিনাক্ত কৰক",
    deepBreathing: "দীৰ্ঘ শ্বাস লওক",
    deepBreathingSub: "আৰাম পাবলৈ"
  },
  bn: {
    back: "ফিরে যান",
    home: "মূল পাতা",
    play: "খেলুন",
    reminders: "স্মরণপত্র",
    family: "পরিবার",
    caregiver: "কেয়ারগিভার",
    patientApp: "রোগী অ্যাপ",
    voiceGuide: "ভয়েস গাইড",
    online: "অনলাইন",
    offline: "অফলাইন",
    synced: "সিঙ্কড",
    syncing: "সিঙ্ক হচ্ছে...",
    pinTitle: "নিরাপদ অ্যাক্সেস",
    enterPin: "পিন দিন:",
    incorrectPin: "ভুল পিন।",
    unlock: "আনলক",
    lock: "লক",
    namaste: "নমস্কার",
    howFeeling: "আজ আপনার কেমন লাগছে?",
    dailyTip: "পরামর্শ",
    playGame: "মেমরি গেম খেলুন",
    gameSub: "সহজ কার্ড মেলাবার খেলা",
    todaysReminders: "আজকের রিমাইন্ডার",
    remindersSub: "রিমাইন্ডার সম্পন্ন",
    allDone: "সব কাজ সম্পন্ন হয়েছে!",
    familyPhotos: "পারিবারিক ছবি",
    familySub: "পরিবারের সদস্যদের চিনুন",
    deepBreathing: "গভীর শ্বাস নিন",
    deepBreathingSub: "আরামদায়ক শ্বাস"
  },
  br: {
    back: "नों थां",
    home: "न'खाय",
    play: "गेले",
    reminders: "गोसोखां",
    family: "नखर",
    caregiver: "नखरगिरि",
    patientApp: "मरीज ऐप",
    voiceGuide: "राव विथिन",
    online: "ऑनलाइन",
    offline: "ऑफ़लाइन",
    synced: "सिंक जाबाय",
    syncing: "सिंक जागासिनो...",
    pinTitle: "सुरक्षित पहुंच",
    enterPin: "पिन हो:",
    incorrectPin: "भुल पिन।",
    unlock: "खेव",
    lock: "बन्द",
    namaste: "खुरुमबाय",
    howFeeling: "दिनै नोंहा माबोर मोनदों?",
    dailyTip: "दैनिक सुबं",
    playGame: "मेमोरी गेले",
    gameSub: "गोरलै गेलेनाय",
    todaysReminders: "दिनैनि गोसोखां",
    remindersSub: "मावफुं जाबाय",
    allDone: "गासैबो जाबाय!",
    familyPhotos: "नखरनि सावगारि",
    familySub: "नखरनि सुबुंफोरखौ सिनाय",
    deepBreathing: "गोथौ हां ला",
    deepBreathingSub: "गोसो गोजोनथाय"
  },
  doi: {
    back: "पिच्छे",
    home: "घर",
    play: "खेडो",
    reminders: "चेता रखन",
    family: "टब्बर",
    caregiver: "देखभालकर्ता",
    patientApp: "मरीज ऐप",
    voiceGuide: "आवाज गाईड",
    online: "ऑनलाइन",
    offline: "ऑफ़लाइन",
    synced: "सिंक होया",
    syncing: "सिंक होआ करदा...",
    pinTitle: "सुरक्षित पहुंच",
    enterPin: "पिन पाओ:",
    incorrectPin: "गलत पिन।",
    unlock: "खोल",
    lock: "बंद",
    namaste: "नमस्ते",
    howFeeling: "आज तुसें थके दे ओ?",
    dailyTip: "दैनिक सलाह",
    playGame: "मेमोरी खेडो",
    gameSub: "सौखा खेड",
    todaysReminders: "आज दे चेते",
    remindersSub: "पूरे होय",
    allDone: "सभ पूरा होया!",
    familyPhotos: "टब्बर दियां फोटो",
    familySub: "अपने टब्बर गी पछानो",
    deepBreathing: "डौंगा सा लेओ",
    deepBreathingSub: "मन शांत करो"
  },
  gu: {
    back: "પાછા",
    home: "મુખ્ય",
    play: "રમો",
    reminders: "રિમાઇન્ડર",
    family: "પરિવાર",
    caregiver: "સંભાળ રાખનાર",
    patientApp: "દર્દી એપ",
    voiceGuide: "માર્ગદર્શક",
    online: "ઓનલાઇન",
    offline: "ઓફલાઇન",
    synced: "સિન્ક થયું",
    syncing: "સિન્ક થાય છે...",
    pinTitle: "સુરક્ષિત પ્રવેશ",
    enterPin: "પિન દાખલ કરો:",
    incorrectPin: "ખોટો પિન.",
    unlock: "ખોલો",
    lock: "લોક",
    namaste: "નમસ્તે",
    howFeeling: "આજે તમને કેવું લાગે છે?",
    dailyTip: "દૈનિક સલાહ",
    playGame: "મેમરી ગેમ રમો",
    gameSub: "સરળ પત્તા મેળવવાની રમત",
    todaysReminders: "આજના રિમાઇન્ડર",
    remindersSub: "રિમાઇન્ડર પૂર્ણ",
    allDone: "બધા કાર્યો પૂર્ણ!",
    familyPhotos: "પરિવારની તસવીરો",
    familySub: "પરિવારજનોને ઓળખો",
    deepBreathing: "ઊંડા શ્વાસ લો",
    deepBreathingSub: "શાંતિ મેળવવા માટે"
  },
  kn: {
    back: "ಹಿಂದೆ",
    home: "ಮುಖಪುಟ",
    play: "ಆಟ",
    reminders: "ನೆನಪೋಲೆ",
    family: "ಕುಟುಂಬ",
    caregiver: "ರಕ್ಷಕ",
    patientApp: "ರೋಗಿ ಆಪ್",
    voiceGuide: "ಧ್ವನಿ ಮಾರ್ಗದರ್ಶಿ",
    online: "ಆನ್‌ಲೈನ್",
    offline: "ಆಫ್‌ಲೈನ್",
    synced: "ಸಿಂಕ್ ಆಗಿದೆ",
    syncing: "ಸಿಂಕ್ ಆಗುತ್ತಿದೆ...",
    pinTitle: "ಸುರಕ್ಷಿತ ಪ್ರವೇಶ",
    enterPin: "ಪಿನ್ ಹಾಕಿ:",
    incorrectPin: "ತಪ್ಪು ಪಿನ್.",
    unlock: "ಅನ್‌ಲಾಕ್",
    lock: "ಲಾಕ್",
    namaste: "ನಮಸ್ಕಾರ",
    howFeeling: "ಇಂದು ನಿಮಗೆ ಹೇಗನಿಸುತ್ತಿದೆ?",
    dailyTip: "ದಿನದ ಸಲಹೆ",
    playGame: "ನೆನಪಿನ ಆಟ",
    gameSub: "ಸರಳ ಜೋಡಿ ಆಟ",
    todaysReminders: "ಇಂದಿನ ನೆನಪೋಲೆಗಳು",
    remindersSub: "ಪೂರ್ಣಗೊಂಡಿದೆ",
    allDone: "ಎಲ್ಲಾ ಕೆಲಸಗಳು ಮುಗಿದವು!",
    familyPhotos: "ಕುಟುಂಬದ ಚಿತ್ರಗಳು",
    familySub: "ಕುಟುಂಬದವರನ್ನು ಗುರುತಿಸಿ",
    deepBreathing: "ದೀರ್ಘ ಶ್ವಾಸ",
    deepBreathingSub: "ಮನಸ್ಸು ಶಾಂತಗೊಳಿಸಲು"
  },
  ks: {
    back: "वापस",
    home: "गरा",
    play: "गिंदुन",
    reminders: "याद",
    family: "खानदान",
    caregiver: "रक्षक",
    patientApp: "मरीज ऐप",
    voiceGuide: "आवाज़",
    online: "ऑनलाइन",
    offline: "ऑफ़लाइन",
    synced: "सिंक",
    syncing: "सिंक गछान...",
    pinTitle: "सुरक्षित",
    enterPin: "पिन दियु:",
    incorrectPin: "गलत पिन।",
    unlock: "खोल",
    lock: "बंद",
    namaste: "नमस्कार",
    howFeeling: "अम्मा वारय छू?",
    dailyTip: "सलाह",
    playGame: "गेम गिंदुन",
    gameSub: "आसान गेम",
    todaysReminders: "आजुक याद",
    remindersSub: "गय पूर",
    allDone: "सरी गय पूर!",
    familyPhotos: "तस्वीर",
    familySub: "पननियन पछानिव",
    deepBreathing: "शह ल्यून",
    deepBreathingSub: "राहत खातिर"
  },
  kok: {
    back: "फाटी",
    home: "घर",
    play: "खेळात",
    reminders: "उगडास",
    family: "कुटुंब",
    caregiver: "सांभाळपी",
    patientApp: "रुग्ण ॲप",
    voiceGuide: "आवाज मार्गदर्शक",
    online: "ऑनलाइन",
    offline: "ऑफलाइन",
    synced: "सिंक जाला",
    syncing: "सिंक जाता...",
    pinTitle: "सुरक्षित प्रवेश",
    enterPin: "पिन घाला:",
    incorrectPin: "चुकीचा पिन।",
    unlock: "उगडात",
    lock: "लॉक",
    namaste: "नमस्कार",
    howFeeling: "आज तुमकां कशें दिसता?",
    dailyTip: "दैनिक बुद",
    playGame: "मेमरी खेळात",
    gameSub: "सोपो खेळ",
    todaysReminders: "आजचे उगडास",
    remindersSub: "पूर्ण जाल्यात",
    allDone: "सगळी कामां जालीं!",
    familyPhotos: "कुटुंबाचे फोटो",
    familySub: "घराच्यांक वळखा",
    deepBreathing: "दीर्घ श्वास",
    deepBreathingSub: "सुशेग मेळपाक"
  },
  mai: {
    back: "पाछू",
    home: "घर",
    play: "खेलू",
    reminders: "स्मरण",
    family: "परिवार",
    caregiver: "देखभालकर्ता",
    patientApp: "मरीज ऐप",
    voiceGuide: "आवाज सहायक",
    online: "ऑनलाइन",
    offline: "ऑफ़लाइन",
    synced: "सिंक भेल",
    syncing: "सिंक भ रहल अछि...",
    pinTitle: "सुरक्षित पहुंच",
    enterPin: "पिन लिखू:",
    incorrectPin: "गलत पिन।",
    unlock: "खोलू",
    lock: "लॉक",
    namaste: "प्रणाम",
    howFeeling: "आज केहन लगि रहल अछि?",
    dailyTip: "दैनिक सलाह",
    playGame: "मेमोरी खेलू",
    gameSub: "आसान मिलान खेल",
    todaysReminders: "आजुक स्मरण",
    remindersSub: "पूरा भेल",
    allDone: "सभ कार्य पूरा भेल!",
    familyPhotos: "परिवारक फोटो",
    familySub: "अपन लोकक चिन्हू",
    deepBreathing: "गहीर सांस लिय",
    deepBreathingSub: "तनाव दूर करू"
  },
  ml: {
    back: "പിന്നിലേക്ക്",
    home: "ഹോം",
    play: "കളി",
    reminders: "ഓർമ്മപ്പെടുത്തൽ",
    family: "കുടുംബം",
    caregiver: "പരിപാലകൻ",
    patientApp: "രോഗി ആപ്പ്",
    voiceGuide: "വഴികാട്ടി",
    online: "ഓൺലൈൻ",
    offline: "ഓഫ്‌ലൈൻ",
    synced: "സിങ്ക് ചെയ്തു",
    syncing: "സിങ്ക് ചെയ്യുന്നു...",
    pinTitle: "സുരക്ഷിത പ്രവേശനം",
    enterPin: "പിൻ നൽകുക:",
    incorrectPin: "തെറ്റായ പിൻ.",
    unlock: "തുറക്കുക",
    lock: "ലോക്ക്",
    namaste: "നമസ്കാരം",
    howFeeling: "ഇന്ന് സുഖമാണോ?",
    dailyTip: "സന്ദേശം",
    playGame: "മെമ്മറി കളി",
    gameSub: "ലളിതമായ മാച്ചിംഗ് ഗെയിം",
    todaysReminders: "ഇന്നത്തെ ഓർമ്മപ്പെടുത്തലുകൾ",
    remindersSub: "പൂർത്തിയായി",
    allDone: "എല്ലാം പൂർത്തിയായി!",
    familyPhotos: "കുടുംബ ചിത്രങ്ങൾ",
    familySub: "കുടുംബാംഗങ്ങളെ തിരിച്ചറിയുക",
    deepBreathing: "ദീർഘശ്വാസം",
    deepBreathingSub: "ആശ്വാസം ലഭിക്കാൻ"
  },
  mni: {
    back: "হন্দোকপা",
    home: "য়ুম",
    play: "শেল্লু",
    reminders: "নীংশিং",
    family: "ইমুং",
    caregiver: "য়েনশিনবা",
    patientApp: "রোগী এপ",
    voiceGuide: "শ্বর হোনবা",
    online: "অনলাইন",
    offline: "অফলাইন",
    synced: "সিঙ্কড",
    syncing: "সিঙ্ক তৌরি...",
    pinTitle: "নিরাপদ",
    enterPin: "পিন পীয়ু:",
    incorrectPin: "লাল্লবা পিন।",
    unlock: "হানদোকপা",
    lock: "লোল্লু",
    namaste: "খুরুমজরি",
    howFeeling: "ঙসি কামদৌরি?",
    dailyTip: "পরামর্শ",
    playGame: "মেমোরি শেল্লু",
    gameSub: "অরাইবা সান্নবা",
    todaysReminders: "ঙসিগী নীংশিং",
    remindersSub: "লোইখ্রে",
    allDone: "লোইনা লোইখ্রে!",
    familyPhotos: "ইমুংগী ফটো",
    familySub: "মীয়াম শকখঙউ",
    deepBreathing: "অচৌবা শ্বর হোনবা",
    deepBreathingSub: "নিঙথিনা হোনবা"
  },
  mr: {
    back: "मागे",
    home: "मुख्यपृष्ठ",
    play: "खेळा",
    reminders: "स्मरणपत्रे",
    family: "कुटुंब",
    caregiver: "केअरगिव्हर",
    patientApp: "रुग्ण ॲप",
    voiceGuide: "आवाज मार्गदर्शक",
    online: "ऑनलाइन",
    offline: "ऑफलाइन",
    synced: "सिंक झाला",
    syncing: "सिंक होत आहे...",
    pinTitle: "सुरक्षित प्रवेश",
    enterPin: "पिन घाला:",
    incorrectPin: "चुकीचा पिन।",
    unlock: "अनलॉक",
    lock: "लॉक",
    namaste: "नमस्कार",
    howFeeling: "आज कसे वाटत आहे?",
    dailyTip: "रोजचा सल्ला",
    playGame: "मेमरी गेम",
    gameSub: "सोपा जोड्या जुळवणे खेळ",
    todaysReminders: "आजची स्मरणपत्रे",
    remindersSub: "पूर्ण झाली",
    allDone: "सगळी कामे झाली!",
    familyPhotos: "कुटुंबाचे फोटो",
    familySub: "नातेवाईक ओळखा",
    deepBreathing: "दीर्घ श्वास घ्या",
    deepBreathingSub: "तणाव घालवण्यासाठी"
  },
  ne: {
    back: "पछाडि",
    home: "गृह",
    play: "खेल्नुहोस्",
    reminders: "स्मरणपत्र",
    family: "परिवार",
    caregiver: "हेरचाहकर्ता",
    patientApp: "बिरामी एप",
    voiceGuide: "आवाज सहयोगी",
    online: "अनलाइन",
    offline: "अफलाइन",
    synced: "सिंक भयो",
    syncing: "सिंक हुँदैछ...",
    pinTitle: "सुरक्षित पहुँच",
    enterPin: "पिन लेख्नुहोस्:",
    incorrectPin: "गलत पिन।",
    unlock: "खोल्नुहोस्",
    lock: "ताल्चा",
    namaste: "नमस्ते",
    howFeeling: "आज कस्तो छ?",
    dailyTip: "सुझाव",
    playGame: "मेमोरी खेल",
    gameSub: "सजिलो जोड मिलाउने खेल",
    todaysReminders: "आजका स्मरणपत्रहरू",
    remindersSub: "सकियो",
    allDone: "सबै काम सकियो!",
    familyPhotos: "परिवारका तस्बिरहरू",
    familySub: "आफ्ना मान्छे चिन्नुहोस्",
    deepBreathing: "लामो श्वास लिनुहोस्",
    deepBreathingSub: "मन शान्त पार्न"
  },
  or: {
    back: "ପଛକୁ",
    home: "ମୁଖ୍ୟ",
    play: "ଖେଳନ୍ତୁ",
    reminders: "ରିମାଇଣ୍ଡର",
    family: "ପରିବାର",
    caregiver: "ଯତ୍ନକାରୀ",
    patientApp: "ରୋଗୀ ଆପ୍",
    voiceGuide: "ନିର୍ଦ୍ଦେଶକ",
    online: "ଅନଲାଇନ୍",
    offline: "ଅଫଲାଇନ୍",
    synced: "ସିଙ୍କ୍ ହେଲା",
    syncing: "ସିଙ୍କ୍ ହେଉଛି...",
    pinTitle: "ସୁରକ୍ଷିତ ପ୍ରବେଶ",
    enterPin: "ପିନ୍ ଦିଅନ୍ତୁ:",
    incorrectPin: "ଭୁଲ୍ ପିନ୍।",
    unlock: "ଖୋଲନ୍ତୁ",
    lock: "ଲକ୍",
    namaste: "ନମସ୍କାର",
    howFeeling: "ଆଜି କେମିତି ଲାଗୁଛି?",
    dailyTip: "ଦୈନିକ ପରାମର୍ଶ",
    playGame: "ମେମୋରୀ ଗେମ୍",
    gameSub: "ସହଜ କାର୍ଡ ମିଳନ ଖେଳ",
    todaysReminders: "ଆଜିର ରିମାଇଣ୍ଡର",
    remindersSub: "ସମାପ୍ତ ହେଲା",
    allDone: "ସବୁ କାମ ସରିଲା!",
    familyPhotos: "ପରିବାରର ଫଟୋ",
    familySub: "ପରିବାର ଲୋକଙ୍କୁ ଚିହ୍ନନ୍ତୁ",
    deepBreathing: "ଦୀର୍ଘ ଶ୍ୱାସ ନିଅନ୍ତୁ",
    deepBreathingSub: "ଶାନ୍ତି ପାଇଁ"
  },
  pa: {
    back: "ਪਿੱਛੇ",
    home: "ਹੋਮ",
    play: "ਖੇਡੋ",
    reminders: "ਯਾਦ",
    family: "ਪਰਿਵਾਰ",
    caregiver: "ਦੇਖਭਾਲਕਾਰ",
    patientApp: "ਮਰੀਜ਼ ਐਪ",
    voiceGuide: "ਆਵਾਜ਼ ਗਾਈਡ",
    online: "ਆਨਲਾਈਨ",
    offline: "ਆਫਲਾਈਨ",
    synced: "ਸਿੰਕ ਹੋਇਆ",
    syncing: "ਸਿੰਕ ਹੋ ਰਿਹਾ...",
    pinTitle: "ਸੁਰੱਖਿਅਤ ਪਹੁੰਚ",
    enterPin: "ਪਿੰਨ ਭਰੋ:",
    incorrectPin: "ਗਲਤ ਪਿੰਨ।",
    unlock: "ਖੋਲ੍ਹੋ",
    lock: "ਲਾਕ",
    namaste: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ",
    howFeeling: "ਅੱਜ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰ ਰਹੇ ਹੋ?",
    dailyTip: "ਅੱਜ ਦਾ ਸੁਝਾਅ",
    playGame: "ਮੈਮੋਰੀ ਗੇਮ ਖੇਡੋ",
    gameSub: "ਸੌਖੀ ਕਾਰਡ ਮਿਲਾਉਣ ਦੀ ਖੇਡ",
    todaysReminders: "ਅੱਜ ਦੇ ਯਾਦ-ਪੱਤਰ",
    remindersSub: "ਕਾਰਜ ਪੂਰੇ",
    allDone: "ਸਾਰੇ ਕੰਮ ਪੂਰੇ ਹੋ ਗਏ!",
    familyPhotos: "ਪਰਿਵਾਰ ਦੀਆਂ ਫੋਟੋਆਂ",
    familySub: "ਆਪਣੇ ਪਰਿਵਾਰ ਨੂੰ ਪਛਾਣੋ",
    deepBreathing: "ਲੰਮਾ ਸਾਹ ਲਓ",
    deepBreathingSub: "ਤਣਾਅ ਮੁਕਤ ਹੋਣ ਲਈ"
  },
  sa: {
    back: "पृष्ठतः",
    home: "गृहम्",
    play: "क्रीडन्तु",
    reminders: "स्मरणम्",
    family: "परिवारः",
    caregiver: "रक्षकः",
    patientApp: "रुग्ण ऐप",
    voiceGuide: "मार्गदर्शकः",
    online: "सक्रियम्",
    offline: "अक्रियम्",
    synced: "संगृहीतम्",
    syncing: "संगृह्यते...",
    pinTitle: "सुरक्षित प्रवेशः",
    enterPin: "गुह्यकोडं लिखतु:",
    incorrectPin: "त्रुटिपूर्ण कोडः।",
    unlock: "उद्घाटयतु",
    lock: "कीलितम्",
    namaste: "नमो नमः",
    howFeeling: "अद्य भवतः स्वास्थ्यं कथम्?",
    dailyTip: "सदुक्तिः",
    playGame: "क्रीडां क्रीडन्तु",
    gameSub: "सरल क्रीडा",
    todaysReminders: "अद्यतन स्मरणीयानि",
    remindersSub: "पूर्णम्",
    allDone: "सर्वं सम्पन्नम्!",
    familyPhotos: "चित्राणि",
    familySub: "स्वकीयान् चिन्वन्तु",
    deepBreathing: "दीर्घश्वासः",
    deepBreathingSub: "मनः शान्तये"
  },
  sat: {
    back: "রুয়াড়",
    home: "ওড়াঃ",
    play: "এনেচ",
    reminders: "দিশৌ",
    family: "ঘরোঞ্জ",
    caregiver: "জাগাত",
    patientApp: "রুগী এপ",
    voiceGuide: "আড়াং দিশা",
    online: "অনলাইন",
    offline: "অফলাইন",
    synced: "সিঙ্কেনা",
    syncing: "সিঙ্কঃ কানাল...",
    pinTitle: "সুরক্ষিত",
    enterPin: "পিন এমমে:",
    incorrectPin: "ভুল পিন।",
    unlock: "ঝিজমে",
    lock: "কুলুপ",
    namaste: "জহার",
    howFeeling: "তেহেঞ চেলেকা মেনাঃমা?",
    dailyTip: "দিনৌ দিশা",
    playGame: "মেমোরি এনেচ",
    gameSub: "অলিজ এনেচ",
    todaysReminders: "তেহেঞাঃ দিশৌ",
    remindersSub: "পূরওনা",
    allDone: "জোতো পূরওনা!",
    familyPhotos: "ঘরোঞ্জ চিত্রা",
    familySub: "আপন হড় চিনহাউকোম",
    deepBreathing: "হাঁ লাওমে",
    deepBreathingSub: "জিরৌ হাতাউ লাগিৎ"
  },
  sd: {
    back: "वापिस",
    home: "घर",
    play: "खेड़ो",
    reminders: "यादगिरी",
    family: "कुटुंब",
    caregiver: "संभाळ कन्दड़",
    patientApp: "मरीज ऐप",
    voiceGuide: "आवाज़",
    online: "ऑनलाइन",
    offline: "ऑफ़लाइन",
    synced: "सिंक",
    syncing: "सिंक थिये थौ...",
    pinTitle: "सुरक्षित",
    enterPin: "पिन दर्ज कयो:",
    incorrectPin: "गलत पिन।",
    unlock: "खोलो",
    lock: "बंद",
    namaste: "सलाम / नमस्कार",
    howFeeling: "तव्हां किएं आहियो?",
    dailyTip: "दैनिक सलाह",
    playGame: "गेम खेडो",
    gameSub: "सौली गेम",
    todaysReminders: "आजजी यादगिरी",
    remindersSub: "पूर्ण थिया",
    allDone: "सभ पूर्ण थिया!",
    familyPhotos: "कुटुंब जा फोटो",
    familySub: "कुटुंब खे पछ्याणियो",
    deepBreathing: "दीर्घ श्वास",
    deepBreathingSub: "राहत खातिर"
  },
  ta: {
    back: "பின்னால்",
    home: "முகப்பு",
    play: "விளையாடு",
    reminders: "நினைவூட்டல்",
    family: "குடும்பம்",
    caregiver: "கவனிப்பாளர்",
    patientApp: "நோயாளி செயலி",
    voiceGuide: "குரல் வழிகாட்டி",
    online: "ஆன்லைன்",
    offline: "ஆஃப்லைன்",
    synced: "ஒத்திசைந்தது",
    syncing: "ஒத்திசைக்கப்படுகிறது...",
    pinTitle: "கவனிப்பாளர் பாதுகாப்பு",
    enterPin: "பின்னை உள்ளிடவும்:",
    incorrectPin: "தவறான பின்.",
    unlock: "திறக்க",
    lock: "பூட்டு",
    namaste: "வணக்கம்",
    howFeeling: "இன்று எப்படி உணர்கிறீர்கள்?",
    dailyTip: "தினசரி குறிப்பு",
    playGame: "நினைவக விளையாட்டு",
    gameSub: "எளிய அட்டை விளையாட்டு",
    todaysReminders: "இன்றைய நினைவூட்டல்கள்",
    remindersSub: "முடிந்தன",
    allDone: "அனைத்தும் முடிந்தது!",
    familyPhotos: "குடும்ப படங்கள்",
    familySub: "குடும்பத்தினரை அடையாளம் காண்க",
    deepBreathing: "ஆழ்ந்த சுவாசம்",
    deepBreathingSub: "மன அமைதிக்கு"
  },
  te: {
    back: "వెనుకకు",
    home: "హోమ్",
    play: "ఆడండి",
    reminders: "రిమైండర్లు",
    family: "కుటుంబం",
    caregiver: "రక్షకుడు",
    patientApp: "పేషెంట్ యాప్",
    voiceGuide: "వాయిస్ గైడ్",
    online: "ఆన్‌లైన్",
    offline: "ఆఫ్‌లైన్",
    synced: "సింక్ అయింది",
    syncing: "సింక్ అవుతోంది...",
    pinTitle: "సురక్షిత ప్రవేశం",
    enterPin: "పిన్ నమోదు చేయండి:",
    incorrectPin: "తప్పు పిన్.",
    unlock: "అన్‌లాక్",
    lock: "లాక్",
    namaste: "నమస్కారం",
    howFeeling: "ఈ రోజు ఎలా ఉంది?",
    dailyTip: "చిట్కా",
    playGame: "మెమరీ గేమ్",
    gameSub: "సులभ సరిపోలిక ఆట",
    todaysReminders: "నేటి రిమైండర్లు",
    remindersSub: "పూర్తయ్యాయి",
    allDone: "అన్నీ పూర్తయ్యాయి!",
    familyPhotos: "కుటుంబ ఫోటోలు",
    familySub: "కుటుంబ సభ్యులను గుర్తించండి",
    deepBreathing: "దీర్ఘ శ్వాస",
    deepBreathingSub: "మనస్సు ప్రశాంతత కోసం"
  },
  ur: {
    back: "واپس",
    home: "ہوم",
    play: "کھیلیں",
    reminders: "یاد دہانی",
    family: "خاندان",
    caregiver: "نگہبان",
    patientApp: "مریض ایپ",
    voiceGuide: "آواز گائیڈ",
    online: "آن لائن",
    offline: "آف لائن",
    synced: "سنک ہوا",
    syncing: "سنک ہو رہا ہے...",
    pinTitle: "محفوظ رسائی",
    enterPin: "پن درج کریں:",
    incorrectPin: "غلط پن۔",
    unlock: "کھولیں",
    lock: "لاک",
    namaste: "السلام علیکم",
    howFeeling: "آج آپ کیسا محسوس کر رہے ہیں؟",
    dailyTip: "آج کی نصیحت",
    playGame: "میموری گیم کھیلیں",
    gameSub: "سادہ کارڈ ملانے کا کھیل",
    todaysReminders: "آج کے ریمنڈرز",
    remindersSub: "مکمل ہوئے",
    allDone: "تمام کام مکمل!",
    familyPhotos: "خاندانی تصویریں",
    familySub: "گھر والوں کو پہچانیں",
    deepBreathing: "لمبی سانس لیں",
    deepBreathingSub: "سکون پانے کے لیے"
  }
};
const VOCALS = {
  en: {
    welcome: "Namaste Amma! Welcome to Memro. Today is a beautiful day.",
    navHome: "Returning to home screen.",
    navGame: "Opening memory matching game.",
    navReminders: "Opening your reminders checklist.",
    navFamily: "Opening family photos quiz.",
    navBreathing: "Opening deep breathing relaxation guide.",
    listening: "Listening to command..."
  },
  hi: {
    welcome: "नमस्ते अम्मा! मेम्रो में आपका स्वागत है। आज एक सुंदर दिन है।",
    navHome: "मुख्य पृष्ठ पर वापस जा रहे हैं। navGame: मेमोरी मैचिंग खेल खोल रहे हैं।",
    navReminders: "आपके स्मरणपत्र खोल रहे हैं।",
    navFamily: "परिवार की तस्वीरें खोल रहे हैं।",
    navBreathing: "गहरी सांस लेने का व्यायाम खोल रहे हैं।",
    listening: "सुन रहे हैं, कृपया बोलें..."
  },
  as: {
    welcome: "নমস্কাৰ আম্মা! মেম্ৰ’ত আপোনাক স্বাগতম জনাইছো। আজি এটা ধুনীয়া দিন।",
    navHome: "গৃহ পৃষ্ঠালৈ ঘূৰি গৈছে।",
    navGame: "মেমৰী খেলখন খোলা হৈছে।",
    navReminders: "স্মাৰক তালিকা খোলা হৈছে।",
    navFamily: "পৰিয়ালৰ ফটো কুইজ খোলা হৈছে।",
    navBreathing: "দীৰ্ঘ শ্বাসৰ নিৰ্দেশিকা খোলা হৈছে।",
    listening: "শুনি আছোঁ, কওক..."
  },
  bn: {
    welcome: "নমস্কার আম্মা! মেম্রোতে আপনাকে স্বাগত। আজকের দিনটি খুব সুন্দর।",
    navHome: "মূল পৃষ্ঠায় ফিরে যাচ্ছি।",
    navGame: "মেমরি ম্যাচিং গেম খোলা হচ্ছে।",
    navReminders: "রিমাইন্ডার তালিকা খোলা হচ্ছে।",
    navFamily: "পারিবারিক ছবির কুইজ খোলা হচ্ছে।",
    navBreathing: "গভীর শ্বাস নেওয়ার গাইড খোলা হচ্ছে।",
    listening: "শুনছি, বলুন..."
  },
  br: {
    welcome: "खुरुमबाय अम्मा! मेम्रो आव नोंथांखौ बरायबाय।",
    navHome: "न'खाय आव थांफिनगासिनो।",
    navGame: "गेलेनायखौ खेवगासिनो।",
    navReminders: "गोसोखांलाइ खेवगासिनो।",
    navFamily: " सावगारिफोरखौ खेवगासिनो।",
    navBreathing: "गोथौ हां लानायखौ खेवगासिनो।",
    listening: "खोनासं जागासिनो..."
  },
  doi: {
    welcome: "नमस्ते अम्मा! मेम्रो च स्वागत ऐ।",
    navHome: "मुख्य पृष्ठ पर वापस जा करदे।",
    navGame: "मेमोरी मैचिंग खेडो खोलदे।",
    navReminders: "चेता सूची खोलदे।",
    navFamily: "फोटो खोलदे।",
    navBreathing: "सा लेओ खोलदे।",
    listening: "सुनदे करदे..."
  },
  gu: {
    welcome: "નમસ્તે અમ્મા! સારથીમાં આપનું સ્વાગત છે.",
    navHome: "મુખ્ય પૃષ્ઠ પર પાછા જઈએ છીએ.",
    navGame: "મેમરી ગેમ ખોલીએ છીએ.",
    navReminders: "રિમાઇન્ડર ખોલીએ છીએ.",
    navFamily: "પરિવારની તસવીરો ખોલીએ છીએ.",
    navBreathing: "ઊંડા શ્વાસની રમત ખોલીએ છીએ.",
    listening: "સાંભળીએ છીએ, બોલો..."
  },
  kn: {
    welcome: "ನಮಸ್ಕಾರ ಅಮ್ಮ! ಸಾರಥಿಗೆ ಸುಸ್ವಾಗತ.",
    navHome: "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗುತ್ತಿದ್ದೇವೆ.",
    navGame: "ಜೋಡಿ ಆಟ ತೆರೆಯುತ್ತಿದ್ದೇವೆ.",
    navReminders: "ನೆನಪೋಲೆ ತೆರೆಯುತ್ತಿದ್ದೇವೆ.",
    navFamily: "ಚಿತ್ರಗಳ ಆಟ ತೆರೆಯುತ್ತಿದ್ದೇವೆ.",
    navBreathing: "ದೀರ್ಘ ಶ್ವಾಸ ತೆರೆಯುತ್ತಿದ್ದೇವೆ.",
    listening: "ಕೇಳುತ್ತಿದ್ದೇವೆ, ಹೇಳಿ..."
  },
  ks: {
    welcome: "नमस्कार अम्मा! मेम्रो मंज स्वागत छू।",
    navHome: "गरा वापस गछान।",
    navGame: "गेम खोलान।",
    navReminders: "यादगार खोलान।",
    navFamily: "तस्वीर खोलान।",
    navBreathing: "शह ल्यून खोलान।",
    listening: "बूज़ान छु..."
  },
  kok: {
    welcome: "नमस्कार अम्मा! मेम्रोचेर स्वागत आसा.",
    navHome: "घरा वतात.",
    navGame: "मेमरी खेळात.",
    navReminders: "उगडास उघडटा.",
    navFamily: "फोटो उघडटा.",
    navBreathing: "दीर्घ श्वास उघडटा.",
    listening: "आयकुंक येता..."
  },
  mai: {
    welcome: "प्रणाम अम्मा! मेम्रो में स्वागत अछि।",
    navHome: "घर वापस जा रहल छी।",
    navGame: "मेमोरी खेलू खोलि रहल छी।",
    navReminders: "स्मरणपत्र खोलि रहल छी।",
    navFamily: "फोटो खोलि रहल छी.",
    navBreathing: "सांस खोलि रहल छी।",
    listening: "सुनि रहल छी..."
  },
  ml: {
    welcome: "നമസ്കാരം അമ്മേ! സാരഥിയിലേക്ക് സ്വാഗതം.",
    navHome: "ഹോമിലേക്ക് മടങ്ങുന്നു.",
    navGame: "മെമ്മറി കളി തുറക്കുന്നു.",
    navReminders: "ഓർമ്മപ്പെടുത്തൽ തുറക്കുന്നു.",
    navFamily: "കുടുംബ ചിത്രങ്ങൾ തുറക്കുന്നു.",
    navBreathing: "ദീർഘശ്വാസം തുറക്കുന്നു.",
    listening: "കേൾക്കുന്നു, പറയൂ..."
  },
  mni: {
    welcome: "খুরুমজরি আম্মা! সারথীদা তরাম্না ওকচরি।",
    navHome: "য়ুমদা হল্লকখ্রে।",
    navGame: "শান্নবা থিঙখ্রে।",
    navReminders: "নীংশিংহৌবা থিঙখ্রে।",
    navFamily: "ফটো থিঙখ্রে।",
    navBreathing: "শ্বর হোনবা থিঙখ্রে।",
    listening: "তাজরি, হায়য়ু..."
  },
  mr: {
    welcome: "नमस्कार अम्मा! मेम्रोमध्ये तुमचे स्वागत आहे.",
    navHome: "मुख्यपृष्ठावर परत जात आहे.",
    navGame: "मेमरी गेम सुरू करत आहे.",
    navReminders: "स्मरणपत्रे उघडत आहे.",
    navFamily: "कुटुंबाचे फोटो उघडत आहे.",
    navBreathing: "दीर्घ श्वास व्यायाम उघडत आहे.",
    listening: "ऐकत आहे, बोला..."
  },
  ne: {
    welcome: "नमस्ते अम्मा! मेम्रोमा स्वागत छ।",
    navHome: "मुख्य पृष्ठमा फर्किंदै।",
    navGame: "मेमोरी खेल खोल्दै।",
    navReminders: "स्मरणपत्र खोल्दै।",
    navFamily: "तस्बिरहरू खोल्दै।",
    navBreathing: "लामो श्वास व्यायाम खोल्दै।",
    listening: "सुन्दैछौं, भन्नुहोस्..."
  },
  or: {
    welcome: "ନମସ୍କାର ଅମ୍ମା! ସାରଥୀରେ ଆପଣଙ୍କୁ ସ୍ୱାଗତ।",
    navHome: "ମୁଖ୍ୟ ପୃଷ୍ଠାକୁ ଫେରୁଛି।",
    navGame: "ମେମୋରୀ ଗେମ୍ ଖୋଲୁଛି।",
    navReminders: "ରିମାଇଣ୍ଡର ଖୋଲୁଛି।",
    navFamily: "ପରିବାର ଫଟୋ ଖୋଲୁଛି।",
    navBreathing: "ଦୀର୍ଘ ଶ୍ୱାସ ଖୋଲୁଛି।",
    listening: "ଶୁଣୁଛି, କୁହନ୍ତୁ..."
  },
  pa: {
    welcome: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਅੰਮਾ! ਸਾਰਥੀ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ।",
    navHome: "ਹੋਮ ਸਕ੍ਰੀਨ ਤੇ ਵਾਪਸ ਜਾ ਰਹੇ ਹਾਂ।",
    navGame: "ਮੈਮੋਰੀ ਗੇਮ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ।",
    navReminders: "ਯਾਦ-ਪੱਤਰ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ।",
    navFamily: "ਪਰਿਵਾਰ ਦੀਆਂ ਫੋਟோਆਂ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ।",
    navBreathing: "ਸਾਹ ਲੈਣ ਦੀ ਖੇਡ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ।",
    listening: "ਸੁਣ ਰਹੇ ਹਾਂ, ਬੋਲੋ..."
  },
  sa: {
    welcome: "नमो नमः अम्मा! मेम्रो ऐप मध्ये स्वागतम् अस्ति।",
    navHome: "गृहं प्रति गच्छामः।",
    navGame: "क्रीडाम् उद्घाटयामः।",
    navReminders: "स्मरणपत्राणि उद्घाटयामः।",
    navFamily: "चित्राणि उद्घाटयामः।",
    navBreathing: "दीर्घश्वासम् उद्घाटयामः।",
    listening: "शृणोमि, वदतु..."
  },
  sat: {
    welcome: "জহার আম্মা! সারথীরে সগুন দরাম।",
    navHome: "ওড়াত রুয়াড় কানাল।",
    navGame: "এনেচ ঝিজ কানাল।",
    navReminders: "দিশৌ ঝিজ কানাল।",
    navFamily: "চিত্রা ঝিজ কানাল।",
    navBreathing: "হাঁ এনেচ ঝিজ কানাল।",
    listening: "আঞ্জম কানাল..."
  },
  sd: {
    welcome: "सलाम अम्मा! मेम्रो में खुश आमदीद।",
    navHome: "घर वापस वंञी प्या।",
    navGame: "गेम खोली प्या।",
    navReminders: "यादगिरी खोली प्या।",
    navFamily: "फोटो खोली प्या।",
    navBreathing: "दीर्घ श्वास खोली प्या।",
    listening: "बुधी प्या, चओ..."
  },
  ta: {
    welcome: "வணக்கம் அம்மா! சாரதிக்கு உங்களை வரவேற்கிறோம்.",
    navHome: "முகப்புப் பக்கத்திற்குத் திரும்புகிறது.",
    navGame: "நினைவக விளையாட்டைத் திறக்கிறது.",
    navReminders: "நினைவூட்டல் பட்டியலைத் திறக்கிறது.",
    navFamily: "குடும்ப புகைப்படங்களைத் திறக்கிறது.",
    navBreathing: "ஆழ்ந்த சுவாசப் பயிற்சியைத் திறக்கிறது.",
    listening: "கேட்கிறது, சொல்லுங்கள்..."
  },
  te: {
    welcome: "నమస్కారం అమ్మ! సారథికి స్వాగతం.",
    navHome: "హోమ్ స్క్రీన్‌కి తిరిగి వెళ్తోంది.",
    navGame: "మెమరీ గేమ్ తెరుస్తోంది.",
    navReminders: "రిమైండర్ల జాబితాను తెరుస్తోంది.",
    navFamily: "కుటుంబ ఫోటోలను తెరుస్తోంది.",
    navBreathing: "దీర్ఘ శ్వాస వ్యాయామం తెరుస్తోంది.",
    listening: "వింటున్నాను, చెప్పండి..."
  },
  ur: {
    welcome: "السلام علیکم اماں! سارتھی میں خوش آمدید۔",
    navHome: "ہوم اسکرین پر واپس جا رہے ہیں۔",
    navGame: "میموری گیم کھول رہے ہیں۔",
    navReminders: "ریمائنڈرز کھول رہے ہیں۔",
    navFamily: "خاندان کی تصویریں کھول رہے ہیں۔",
    navBreathing: "لمبی سانس کی ورزش کھول رہے ہیں۔",
    listening: "سن رہے ہیں، فرمائیے..."
  }
};

export default function App() {
  const [screen, setScreen] = useState("home");
  const [view, setView] = useState("patient"); // patient | caregiver | clinician
  const [onboarded, setOnboarded] = useState(() => localStorage.getItem("memro_onboarded") === "true");
  const [patientName, setPatientName] = useState(() => localStorage.getItem("memro_patient_name") || "Amma");
  const [pinLocked, setPinLocked] = useState(true);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [picked, setPicked] = useState(false);
  const [familyMode, setFamilyMode] = useState(false);
  const [desktopCaregiverMode, setDesktopCaregiverMode] = useState(false);
  const [desktopFamilyMode, setDesktopFamilyMode] = useState(false);
  
  // Custom features
  const [language, setLanguage] = useState("en");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [syncQueue, setSyncQueue] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [voiceGuidance, setVoiceGuidance] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [sosOpen, setSosOpen] = useState(false);
  
  // Speech-to-Text State
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState("");
  const recognitionRef = useRef(null);
  const voiceTimeoutRef = useRef(null);

  // Adaptive recommendations
  const [adaptiveRecommendation, setAdaptiveRecommendation] = useState("");

  // Reminder Alert States
  const [activeReminderAlert, setActiveReminderAlert] = useState(null);
  const [triggeredToday, setTriggeredToday] = useState({});
  const [snoozedTimes, setSnoozedTimes] = useState({});

  // LocalStorage state management
  const [mood, setMood] = useState(() => localStorage.getItem("memro_mood") || "");
  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem("memro_reminders");
    return saved ? JSON.parse(saved) : [
      { id: 1, time: "8:00 AM", text: "Take blood pressure tablet", done: false, cat: "medicine", repeat: "Daily" },
      { id: 2, time: "1:00 PM", text: "Lunch with Priya", done: false, cat: "meal", repeat: "Once" },
      { id: 3, time: "6:00 PM", text: "Evening walk in the garden", done: false, cat: "walk", repeat: "Daily" },
      { id: 4, time: "9:00 PM", text: "Take night tablets", done: false, cat: "medicine", repeat: "Daily" },
    ];
  });
  const [gameHistory, setGameHistory] = useState(() => {
    const saved = localStorage.getItem("memro_game_history");
    return saved ? JSON.parse(saved) : [];
  });

  // Save states
  useEffect(() => {
    localStorage.setItem("memro_reminders", JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem("memro_game_history", JSON.stringify(gameHistory));
  }, [gameHistory]);

  useEffect(() => {
    localStorage.setItem("memro_mood", mood);
  }, [mood]);

  // Background reminder timer check loop
  useEffect(() => {
    function parseTimeToMinutes(timeStr) {
      if (!timeStr) return -1;
      timeStr = timeStr.trim().toUpperCase();
      let hours = 0;
      let minutes = 0;
      let is12h = false;
      let ampm = "";

      if (timeStr.includes("AM") || timeStr.includes("PM")) {
        is12h = true;
        ampm = timeStr.includes("PM") ? "PM" : "AM";
        timeStr = timeStr.replace("AM", "").replace("PM", "").trim();
      }

      const parts = timeStr.split(":");
      if (parts.length < 2) return -1;
      hours = parseInt(parts[0], 10);
      minutes = parseInt(parts[1], 10);

      if (isNaN(hours) || isNaN(minutes)) return -1;

      if (is12h) {
        if (ampm === "PM" && hours < 12) hours += 12;
        if (ampm === "AM" && hours === 12) hours = 0;
      }
      return hours * 60 + minutes;
    }

    const checkReminders = () => {
      // Only trigger reminder alerts in patient view & after onboarding is completed
      if (view !== "patient" || !onboarded) return;

      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const todayStr = now.toDateString();

      reminders.forEach((r) => {
        if (r.done) return;

        // Use snoozed time if set, otherwise original time
        const targetMinutes = snoozedTimes[r.id] !== undefined ? snoozedTimes[r.id] : parseTimeToMinutes(r.time);
        
        if (targetMinutes === currentMinutes) {
          const hasTriggeredToday = triggeredToday[r.id] === todayStr;
          const isSnoozeTrigger = snoozedTimes[r.id] === currentMinutes;
          
          if (!hasTriggeredToday || isSnoozeTrigger) {
            // Trigger alert!
            setActiveReminderAlert(r);
            
            // Mark as triggered today
            setTriggeredToday(prev => ({
              ...prev,
              [r.id]: todayStr
            }));
            
            // Clear snooze time since it has triggered
            if (isSnoozeTrigger) {
              setSnoozedTimes(prev => {
                const next = { ...prev };
                delete next[r.id];
                return next;
              });
            }
          }
        }
      });
    };

    // Check immediately and then every 10 seconds
    checkReminders();
    const interval = setInterval(checkReminders, 10000);
    return () => clearInterval(interval);
  }, [reminders, triggeredToday, snoozedTimes, view, onboarded]);

  const handleReminderMarkDone = (id) => {
    const updated = reminders.map((r) => {
      if (r.id === id) {
        return { ...r, done: true };
      }
      return r;
    });
    setReminders(updated);
    
    // Clear snooze state
    setSnoozedTimes(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    
    setActiveReminderAlert(null);
  };

  const handleReminderSnooze = (id) => {
    const now = new Date();
    // Snooze for 5 minutes
    const snoozeTargetMinutes = now.getHours() * 60 + now.getMinutes() + 5;
    setSnoozedTimes(prev => ({
      ...prev,
      [id]: snoozeTargetMinutes % 1440
    }));
    
    setActiveReminderAlert(null);
  };

  const handleReminderDismiss = (id) => {
    setActiveReminderAlert(null);
  };

  const handleVerifyMedicine = (id, verified) => {
    const feedbackTranslations = {
      en: {
        verified: "Thank you. I have marked your medicine as taken.",
        denied: "Understood. I have recorded that you did not receive your medicine. I am notifying your caregiver."
      },
      hi: {
        verified: "धन्यवाद। मैंने आपकी दवा को लिया हुआ चिह्नित कर दिया है।",
        denied: "समझ गया। मैंने दर्ज कर लिया है कि आपको दवा नहीं मिली। मैं आपके देखभाल करने वाले को सूचित कर रहा हूँ।"
      },
      ta: {
        verified: "நன்றி. உங்கள் மருந்து உட்கொள்ளப்பட்டதாக நான் குறித்துக்கொண்டேன்.",
        denied: "புரிந்துகொண்டேன். உங்களுக்கு மருந்து கிடைக்கவில்லை என்று நான் பதிவு செய்துள்ளேன். உங்கள் பராமரிப்பாளருக்கு நான் தெரிவிக்கிறேன்."
      },
      bn: {
        verified: "ধন্যবাদ। আমি আপনার ওষুধ খাওয়া হয়েছে বলে চিহ্নিত করেছি।",
        denied: "বুঝতে পেরেছি। আমি নথিভুক্ত করেছি যে আপনি ওষুধ পাননি। আমি আপনার কেয়ারগিভারকে জানাচ্ছি।"
      },
      te: {
        verified: "ధన్యవాదాలు. మీ ఔషధం తీసుకున్నట్లు నేను గుర్తించాను.",
        denied: "అర్థమైంది. మీకు ఔషధం అందలేదని నేను నమోదు చేసాను. నేను మీ సంరక్షకునికి తెలియజేస్తున్నాను."
      },
      mr: {
        verified: "धन्यवाद. मी तुमचे औषध घेतले असल्याचे चिन्हांकित केले आहे.",
        denied: "समजले. तुम्हाला औषध मिळाले नाही अशी मी नोंद केली आहे. मी तुमच्या केअरगिव्हरला सूचित करत आहे."
      },
      gu: {
        verified: "આભાર. મેં તમારી દવા લેવાઈ ગઈ હોવાનું ચિહ્નિત કર્યું છે.",
        denied: "સમજી ગયો. મેં નોંધ્યું છે કે તમને તમારી દવા નથી મળી. હું તમારા કેરગિવરને જાણ કરું છું."
      },
      kn: {
        verified: "ಧನ್ಯವಾದಗಳು. ನಿಮ್ಮ ಔಷಧಿಯನ್ನು ತೆಗೆದುಕೊಳ್ಳಲಾಗಿದೆ ಎಂದು ನಾನು ಗುರುತಿಸಿದ್ದೇನೆ.",
        denied: "ಅರ್ಥವಾಯಿತು. ನಿಮಗೆ ಔಷಧಿ ಸಿಕ್ಕಿಲ್ಲ ಎಂದು ನಾನು ದಾಖಲಿಸಿದ್ದೇನೆ. ನಿಮ್ಮ ಆರೈಕೆದಾರರಿಗೆ ನಾನು ತಿಳಿಸುತ್ತಿದ್ದೇನೆ."
      },
      ml: {
        verified: "നന്ദി. നിങ്ങളുടെ മരുന്ന് കഴിച്ചതായി ഞാൻ അടയാളപ്പെടുത്തിയിരിക്കുന്നു.",
        denied: "മനസ്സിലായി. നിങ്ങൾക്ക് മരുന്ന് ലഭിച്ചില്ല എന്ന് ഞാൻ രേഖപ്പെടുത്തിയിട്ടുണ്ട്. നിങ്ങളുടെ പരിചാരകനെ ഞാൻ അറിയിക്കാം."
      }
    };

    const localLanguageFallbacks = {
      karbi: "as", mising: "as", nyishi: "hi", adi: "hi", apatani: "hi", monpa: "hi", galo: "hi",
      tangkhul: "mni", thadou: "mni", paite: "mni", hmar: "mni", khasi: "en",
      garo: "en", jaintia: "en", mizo: "en", lai: "en", mara: "en", nagamese: "as",
      ao: "en", angami: "en", sumi: "en", lotha: "en", konyak: "en", kokborok: "bn",
      sikkimese: "ne", lepcha: "ne"
    };

    const resolvedLang = localLanguageFallbacks[language] || language || "en";
    const feedback = feedbackTranslations[resolvedLang] || feedbackTranslations["en"];
    const textToSpeak = verified ? feedback.verified : feedback.denied;
    
    // Speak feedback
    speak(textToSpeak, textToSpeak);

    if (verified) {
      playMatchSound();
    } else {
      // Play a custom warning sound/sweep
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        setTimeout(() => { osc.stop(); ctx.close(); }, 600);
      } catch (e) {
        console.warn("Verification sound failed", e);
      }
    }
    
    const updated = reminders.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          verificationStatus: verified ? "Patient Verified" : "Patient Denied"
        };
      }
      return r;
    });
    setReminders(updated);
  };

  // Pre-warm voices for SpeechSynthesis (critical for Chrome/Edge/Safari)
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      const handleVoices = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener("voiceschanged", handleVoices);
      return () => window.speechSynthesis.removeEventListener("voiceschanged", handleVoices);
    }
  }, []);

  // Voice synthesis
  function speak(text, regionalText = "") {
    if (!voiceGuidance) return;
    try {
      if (typeof window === "undefined" || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      
      const currentLanguageObj = LANGUAGES_LIST.find(l => l.code === language);
      const targetLocale = currentLanguageObj ? currentLanguageObj.locale : "en-US";
      
      const voices = window.speechSynthesis.getVoices();

      // 1. Try to find the exact voice for the current language
      let voice = voices.find(v => 
        v.lang.toLowerCase() === targetLocale.toLowerCase() || 
        v.lang.toLowerCase().replace("_", "-") === targetLocale.toLowerCase()
      );

      // 2. Try to find voice matching language prefix (e.g. "hi" for "hi-IN")
      if (!voice) {
        voice = voices.find(v => 
          v.lang.toLowerCase().startsWith(language.toLowerCase() + "-") ||
          v.lang.toLowerCase() === language.toLowerCase()
        );
      }

      let speechText = text;
      let speechLang = "en-US";

      if (voice) {
        // If native voice is found, use it!
        speechText = language !== "en" && regionalText ? regionalText : text;
        speechLang = voice.lang;
      } else {
        // No native voice found for this language!
        // Let's determine the best fallback voice
        const fallbackLang = getLangCode(language) || "en";
        
        // Try to get fallback voice (e.g. "hi" or "as")
        let fallbackVoice = voices.find(v => 
          v.lang.toLowerCase().startsWith(fallbackLang.toLowerCase() + "-") ||
          v.lang.toLowerCase() === fallbackLang.toLowerCase()
        );

        if (fallbackVoice) {
          voice = fallbackVoice;
          // Try to translate the text we are speaking to the fallback language's vocal string!
          const resolvedFallback = getLangCode(language);
          const activeVocal = VOCALS[resolvedFallback] || VOCALS["en"];
          // Try to match the text we are speaking to one of the VOCALS keys
          let vocalKey = null;
          const enVocals = VOCALS["en"];
          for (let key in enVocals) {
            if (enVocals[key] === text) {
              vocalKey = key;
              break;
            }
          }
          if (vocalKey && VOCALS[resolvedFallback]) {
            speechText = VOCALS[resolvedFallback][vocalKey];
          } else {
            // Fall back to the regional text if it uses Devanagari and the voice is Hindi
            const isDevanagariVoice = fallbackVoice.lang.toLowerCase().startsWith("hi");
            const isDevanagariText = language === "sa" || language === "mr" || language === "ne" || language === "doi" || language === "kok" || language === "mai";
            speechText = (isDevanagariVoice && isDevanagariText && regionalText) ? regionalText : text;
          }
          speechLang = fallbackVoice.lang;
        } else {
          // If no fallback voice is found either, try to find ANY English voice
          let enVoice = voices.find(v => v.lang.toLowerCase().startsWith("en"));
          if (enVoice) {
            voice = enVoice;
          }
          speechText = text; // Speak English text
          speechLang = enVoice ? enVoice.lang : "en-US";
        }
      }

      const u = new SpeechSynthesisUtterance(speechText);
      u.lang = speechLang;
      if (voice) {
        u.voice = voice;
      }
      u.rate = 0.82; // Slower rate for elderly users
      window.speechSynthesis.speak(u);
    } catch (e) {
      console.warn("Speech synthesis error", e);
    }
  }

  // Welcome prompt on language switch
  useEffect(() => {
    const resolvedLang = getLangCode(language);
    const activeVocal = VOCALS[resolvedLang] || VOCALS["en"];
    speak(VOCALS["en"].welcome, activeVocal.welcome);
  }, [language]);

  // Web Speech API Voice Recognition setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      
      rec.onstart = () => {
        setIsListening(true);
        setSpeechError("");
      };

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        handleVoiceCommand(transcript);
        setIsListening(false);
      };

      rec.onerror = (e) => {
        console.error("Speech Recognition Error", e);
        setSpeechError("Didn't hear clearly. Try again.");
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [language]);

  const handleVoiceCommand = (command) => {
    playMatchSound();
    console.log("Voice Command Received:", command);

    const matchGame = ["game", "play", "खेल", "खेळ", "விளையாடு", "ఆడండి", "খেলক", "খেলুন", "क्रीडा", "एनेच"];
    const matchReminders = ["reminder", "medicine", "alarm", "दवा", "काम", "রিমাইন্ডার", "நினைவூட்டல்", "రిమైండర్", "স্মাৰক", "स्मरण"];
    const matchFamily = ["family", "photos", "photo", "পরিবার", "குடும்பம்", "కుటుంబం", "পৰিয়াল", "तस्वीर", "ઘરોંજ"];
    const matchHome = ["home", "back", "घर", "मुख्य", "ফিরে", "முகப்பு", "హోమ్", "गृह", "ওড়াঃ"];
    const matchBreathing = ["breathing", "relax", "breath", "सांस", "শ্বাস", "சுவாசம்", "శ్వాస", "দীৰ্ঘ", "दीर्घ"];

    if (matchGame.some(kw => command.includes(kw))) {
      navigateTo("game");
    } else if (matchReminders.some(kw => command.includes(kw))) {
      navigateTo("reminders");
    } else if (matchFamily.some(kw => command.includes(kw))) {
      navigateTo("family");
    } else if (matchHome.some(kw => command.includes(kw))) {
      navigateTo("home");
    } else if (matchBreathing.some(kw => command.includes(kw))) {
      navigateTo("breathing");
    } else {
      const activeVocal = VOCALS[language] || VOCALS["en"];
      speak("Command not recognized. Try saying play game or deep breathing.", "आदेश नहीं समझा।");
    }
  };

  const startVoiceListening = () => {
    if (!recognitionRef.current) {
      alert("Voice speech recognition is not supported on this browser version.");
      return;
    }
    playTapSound();

    if (voiceTimeoutRef.current) {
      clearTimeout(voiceTimeoutRef.current);
      voiceTimeoutRef.current = null;
    }
    
    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error("Recognition stop failed", err);
      }
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsListening(false);
      return;
    }

    setIsListening(true);

    const activeVocal = VOCALS[language] || VOCALS["en"];
    speak(VOCALS["en"].listening, activeVocal.listening);
    
    voiceTimeoutRef.current = setTimeout(() => {
      try {
        const langObj = LANGUAGES_LIST.find(l => l.code === language) || LANGUAGES_LIST[0];
        recognitionRef.current.lang = langObj.locale;
        recognitionRef.current.start();
      } catch (err) {
        console.error("Recognition start failed", err);
        setIsListening(false);
      }
    }, 400);
  };

  const toggleNetwork = () => {
    playTapSound();
    const nextOnline = !isOnline;
    setIsOnline(nextOnline);
    if (nextOnline && syncQueue > 0) {
      triggerCloudSync();
    }
  };

  const triggerCloudSync = () => {
    setIsSyncing(true);
    speak("Syncing clinical data...", "डेटा सिंक किया जा रहा है...");
    setTimeout(() => {
      setIsSyncing(false);
      setSyncQueue(0);
      speak("Data synced successfully.", "डेटा सफलतापूर्वक सिंक हो गया है।");
    }, 2000);
  };

  function handleGameComplete(result) {
    setGameHistory((prev) => [result, ...prev]);
    
    if (result.stars === 3) {
      if (result.difficulty === "EASY") {
        setAdaptiveRecommendation("medium");
      } else if (result.difficulty === "MEDIUM") {
        setAdaptiveRecommendation("hard");
      }
    } else if (result.stars === 1) {
      if (result.difficulty === "HARD") {
        setAdaptiveRecommendation("medium");
      } else if (result.difficulty === "MEDIUM") {
        setAdaptiveRecommendation("easy");
      }
    }

    if (!isOnline) {
      setSyncQueue((q) => q + 1);
    }
  }

  const navigateTo = (scr) => {
    setScreen(scr);
    const activeVocal = VOCALS[language] || VOCALS["en"];
    const enVocal = VOCALS["en"];
    let spokenText = "";
    let enSpokenText = "";
    if (scr === "home") {
      spokenText = activeVocal.navHome;
      enSpokenText = enVocal.navHome;
    } else if (scr === "game") {
      spokenText = activeVocal.navGame;
      enSpokenText = enVocal.navGame;
    } else if (scr === "reminders" || scr === "calendar") {
      spokenText = activeVocal.navReminders;
      enSpokenText = enVocal.navReminders;
    } else if (scr === "family") {
      spokenText = activeVocal.navFamily;
      enSpokenText = enVocal.navFamily;
    } else if (scr === "breathing") {
      spokenText = activeVocal.navBreathing;
      enSpokenText = enVocal.navBreathing;
    }

    speak(enSpokenText, spokenText);
  };

  const handleToggleRole = (newView) => {
    playTapSound();
    if (newView === "caregiver_mobile") {
      setView("caregiver");
      setPinLocked(false);
      setDesktopCaregiverMode(false);
      return;
    }
    if (newView === "family_mobile") {
      setFamilyMode(true);
      setDesktopFamilyMode(false);
      return;
    }
    setView(newView);
    if (newView === "caregiver") {
      setPinLocked(true);
      setPinInput("");
      setPinError("");
      speak("Secure access screen. Enter your PIN.", "सुरक्षित पहुंच स्क्रीन। अपना पिन दर्ज करें।");
    } else if (newView === "clinician") {
      speak("Switched to Clinician view", "चिकित्सक ऐप पर स्विच किया गया");
    } else {
      speak("Switched to Patient view", "मरीज ऐप पर स्विच किया गया");
    }
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    playTapSound();
    if (pinInput === "1234") {
      setPinLocked(false);
      setPinError("");
      speak("Access granted. Loading caregiver portal.", "पहुंच की अनुमति मिली। देखभालकर्ता पोर्टल पोर्टल लोड हो रहा है।");
    } else {
      setPinError(TRANSLATIONS[getLangCode(language)]?.incorrectPin || "Incorrect PIN");
      setPinInput("");
      speak("Incorrect pin. Please try again.", "गलत पिन। फिर से प्रयास करें।");
    }
  };

  const handleOnboardingComplete = (data) => {
    setPatientName(data.name);
    setOnboarded(true);
    localStorage.setItem("memro_patient_name", data.name);
    localStorage.setItem("memro_onboarded", "true");
    speak("Setup complete. Welcome to Memro!", "सेटअप पूरा हुआ। मेम्रो में आपका स्वागत है!");
  };

  const t = TRANSLATIONS[getLangCode(language)] || TRANSLATIONS["en"];
  const currentLangObj = LANGUAGES_LIST.find(l => l.code === language) || LANGUAGES_LIST[0];

  if (familyMode) {
    return (
      <FamilyOverviewScreen 
        reminders={reminders}
        onExit={() => { setFamilyMode(false); setPicked(false); }}
      />
    );
  }

  if (view === "caregiver" && !pinLocked) {
    return (
      <CaregiverRoutineScreen 
        reminders={reminders}
        setReminders={setReminders}
        onExit={() => { setView("patient"); setPicked(false); }}
      />
    );
  }

  return (
    <div className="app-container" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div className="phone-mockup">
        {!picked ? (
          <AppSelector
            onSelectPatient={() => { playTapSound(); setView("patient"); setPicked(true); }}
            onSelectCaregiver={() => {
              playTapSound();
              setView("caregiver");
              setPinLocked(true);
              setPinInput("");
              setPinError("");
              setPicked(true);
              speak("Secure access screen. Enter your PIN.", "सुरक्षित पहुंच स्क्रीन। अपना पिन दर्ज करें।");
            }}
            onSelectFamily={() => { playTapSound(); setFamilyMode(true); }}
          />
        ) : (
          <>
            {/* Role Toggle Header inside the phone mockup */}
            {view === "patient" && (
              <div style={{
                padding: "12px 14px 10px",
                background: "var(--color-bg-warm)",
                borderBottom: "1px solid var(--color-teal-soft)",
                zIndex: 95
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  background: "white",
                  padding: 4,
                  borderRadius: 999,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.06)"
                }}>
                  <button
                    onClick={() => handleToggleRole("patient")}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 5,
                      border: "none",
                      cursor: "pointer",
                      borderRadius: 999,
                      padding: "8px 10px",
                      background: view === "patient" ? "var(--color-teal)" : "transparent",
                      color: view === "patient" ? "white" : "var(--color-text-dark)",
                      fontSize: 11,
                      fontWeight: 800,
                      transition: "all 0.2s"
                    }}
                  >
                    <Heart size={12} fill={view === "patient" ? "white" : "transparent"} />
                    <span>{t.patientApp || "Patient"}</span>
                  </button>
                  <button
                    onClick={() => handleToggleRole("caregiver")}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 5,
                      border: "none",
                      cursor: "pointer",
                      borderRadius: 999,
                      padding: "8px 10px",
                      background: view === "caregiver" ? "var(--color-teal)" : "transparent",
                      color: view === "caregiver" ? "white" : "var(--color-text-muted)",
                      fontSize: 11,
                      fontWeight: 800,
                      transition: "all 0.2s"
                    }}
                  >
                    <ShieldAlert size={12} />
                    <span>{t.caregiver || "Caregiver"}</span>
                  </button>
                  <button
                    onClick={() => handleToggleRole("clinician")}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 5,
                      border: "none",
                      cursor: "pointer",
                      borderRadius: 999,
                      padding: "8px 10px",
                      background: view === "clinician" ? "var(--color-teal)" : "transparent",
                      color: view === "clinician" ? "white" : "var(--color-text-muted)",
                      fontSize: 11,
                      fontWeight: 800,
                      transition: "all 0.2s"
                    }}
                  >
                    <Stethoscope size={12} />
                    <span>{t.clinician || "Clinician"}</span>
                  </button>
                </div>
              </div>
            )}
        
        {/* Render Splash Greeting if active */}
        {showSplash && view === "patient" && onboarded && (
          <SplashGreeting
            name={patientName}
            onDone={() => setShowSplash(false)}
            speak={speak}
            language={language}
          />
        )}

        {/* Render SOS Modal if active */}
        {sosOpen && view === "patient" && onboarded && (
          <SOSModal
            onClose={() => setSosOpen(false)}
            speak={speak}
            language={language}
          />
        )}

        {/* Render Reminder Alert Modal if active */}
        {activeReminderAlert && view === "patient" && onboarded && (
          <ReminderAlertModal
            reminder={activeReminderAlert}
            onClose={() => handleReminderDismiss(activeReminderAlert.id)}
            onMarkDone={() => handleReminderMarkDone(activeReminderAlert.id)}
            onSnooze={() => handleReminderSnooze(activeReminderAlert.id)}
            speak={speak}
            language={language}
          />
        )}

        {/* Render Medicine Verification Modal if caregiver marked given */}
        {(() => {
          const pendingMed = reminders.find(r => r.cat === 'medicine' && r.verificationStatus === 'Awaiting Verification');
          if (pendingMed && view === "patient" && onboarded) {
            return (
              <MedicineVerificationModal
                reminder={pendingMed}
                onVerify={() => handleVerifyMedicine(pendingMed.id, true)}
                onDeny={() => handleVerifyMedicine(pendingMed.id, false)}
                speak={speak}
                language={language}
              />
            );
          }
          return null;
        })()}

        {/* Global Toolbar: Multilingual, Network Status, and Voice Commands */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 12px",
          background: "var(--color-bg-warm)",
          borderBottom: "1px solid var(--color-teal-soft)",
          position: "relative",
          zIndex: 90
        }}>
          {/* Language Selector Dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => { playTapSound(); setShowLanguageDropdown(!showLanguageDropdown); }}
              style={{
                border: "none",
                background: "white",
                padding: "6px 10px",
                borderRadius: 10,
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                color: "var(--color-teal)"
              }}
            >
              <Globe size={14} />
              <span>{currentLangObj.name}</span>
            </button>

            {showLanguageDropdown && (
              <div style={{
                position: "absolute",
                top: "100%",
                left: 0,
                marginTop: 4,
                background: "white",
                borderRadius: 12,
                boxShadow: "var(--shadow-md)",
                border: "1px solid var(--color-teal-soft)",
                display: "flex",
                flexDirection: "column",
                width: 170,
                maxHeight: 260,
                overflowY: "auto",
                zIndex: 99
              }}>
                {LANGUAGES_LIST.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      playTapSound();
                      setLanguage(lang.code);
                      setShowLanguageDropdown(false);
                    }}
                    style={{
                      border: "none",
                      background: language === lang.code ? "var(--color-teal-light)" : "white",
                      padding: "8px 12px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                      color: "var(--color-text-dark)"
                    }}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Network and voice indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button
              onClick={() => {
                playTapSound();
                const defaultReminders = [
                  { id: 1, time: "8:00 AM", text: "Take blood pressure tablet", done: false, cat: "medicine", repeat: "Daily" },
                  { id: 2, time: "1:00 PM", text: "Lunch with Priya", done: false, cat: "meal", repeat: "Once" },
                  { id: 3, time: "6:00 PM", text: "Evening walk in the garden", done: false, cat: "walk", repeat: "Daily" },
                  { id: 4, time: "9:00 PM", text: "Take night tablets", done: false, cat: "medicine", repeat: "Daily" },
                ];
                setReminders(defaultReminders);
                setOnboarded(true);
                localStorage.setItem("memro_reminders", JSON.stringify(defaultReminders));
                localStorage.setItem("memro_onboarded", "true");
                alert("Demo data reset! All medicine tasks are now pending and patient is onboarded.");
              }}
              style={{
                border: "none",
                background: "#FBE4E1",
                color: "#E4574B",
                padding: "4px 8px",
                borderRadius: 8,
                fontSize: 10,
                fontWeight: 800,
                cursor: "pointer"
              }}
            >
              Reset Demo
            </button>

            {view === "patient" && onboarded && (
              <button
                onClick={startVoiceListening}
                className={isListening ? "pulse-listening" : ""}
                style={{
                  border: "none",
                  background: isListening ? "var(--color-danger)" : "var(--color-teal)",
                  color: "white",
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer"
                }}
                title="Voice control"
              >
                {isListening ? <Mic size={14} /> : <MicOff size={14} />}
              </button>
            )}

            <button
              onClick={toggleNetwork}
              title="Click to toggle Network simulation"
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 10,
                fontWeight: 700,
                color: isOnline ? "var(--color-success)" : "var(--color-terracotta)"
              }}
            >
              {isOnline ? (
                <>
                  <Wifi size={14} />
                  <span>{t.online}</span>
                </>
              ) : (
                <>
                  <WifiOff size={14} />
                  <span>{t.offline}</span>
                </>
              )}
            </button>

            {!isOnline && syncQueue > 0 && (
              <button
                onClick={triggerCloudSync}
                disabled={isSyncing}
                style={{
                  border: "none",
                  background: "var(--color-gold)",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: 8,
                  fontSize: 9,
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 3
                }}
              >
                <RefreshCw size={10} className={isSyncing ? "spin-animation" : ""} />
                <span>Sync ({syncQueue})</span>
              </button>
            )}
          </div>
        </div>

        {/* Voice Assistant Guidance Helper Bar */}
        {view === "patient" && (
          <div className="assist-bar">
            <span style={{ fontSize: 11, color: "var(--color-text-muted)", fontWeight: 600 }}>
              {t.voiceGuide}:
            </span>
            <button
              onClick={() => {
                const next = !voiceGuidance;
                setVoiceGuidance(next);
                playTapSound();
                if (next) {
                  setTimeout(() => {
                    const u = new SpeechSynthesisUtterance("Voice guide active.");
                    u.lang = currentLangObj.locale;
                    window.speechSynthesis.cancel();
                    window.speechSynthesis.speak(u);
                  }, 50);
                } else {
                  window.speechSynthesis.cancel();
                }
              }}
              className="assist-btn"
              aria-label={voiceGuidance ? "Disable voice guide" : "Enable voice guide"}
            >
              {voiceGuidance ? (
                <>
                  <Volume2 size={16} color="var(--color-teal)" />
                  <span style={{ color: "var(--color-teal)" }}>On</span>
                </>
              ) : (
                <>
                  <VolumeX size={16} color="var(--color-text-muted)" />
                  <span style={{ color: "var(--color-text-muted)" }}>Off</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Listening Overlay Alert */}
        {isListening && (
          <div style={{
            background: "rgba(8, 81, 92, 0.92)",
            color: "white",
            padding: "8px 12px",
            textAlign: "center",
            fontSize: 12,
            fontWeight: 700,
            animation: "matchPulse 1s infinite"
          }}>
            🎙️ {(VOCALS[language] || VOCALS["en"]).listening}
          </div>
        )}

        {speechError && (
          <div style={{
            background: "var(--color-danger-light)",
            color: "var(--color-danger)",
            padding: "6px 12px",
            textAlign: "center",
            fontSize: 11,
            fontWeight: 700
          }}>
            {speechError}
          </div>
        )}

        {/* Dynamic Screen Area */}
        <div className="screen-content">
          {view === "patient" ? (
            !onboarded ? (
              <OnboardingScreen
                onComplete={handleOnboardingComplete}
                language={language}
              />
            ) : screen === "home" ? (
              <HomeScreen 
                go={navigateTo} 
                name={patientName} 
                reminders={reminders} 
                mood={mood} 
                setMood={setMood}
                speak={speak}
                language={language}
                onSosTrigger={() => setSosOpen(true)}
              />
            ) : screen === "game" ? (
              <GameScreen 
                back={() => navigateTo("home")} 
                onGameComplete={handleGameComplete}
                speak={speak}
                adaptiveRecommendation={adaptiveRecommendation}
                setAdaptiveRecommendation={setAdaptiveRecommendation}
                language={language}
              />
            ) : screen === "reminders" ? (
              <RemindersScreen 
                back={() => navigateTo("home")} 
                reminders={reminders} 
                setReminders={setReminders}
                speak={speak}
                language={language}
                go={navigateTo}
              />
            ) : screen === "calendar" ? (
              <CalendarScreen
                back={() => navigateTo("reminders")}
                speak={speak}
                language={language}
              />
            ) : screen === "breathing" ? (
              <BreathingScreen
                back={() => navigateTo("home")}
                speak={speak}
                language={language}
              />
            ) : screen === "family" ? (
              <FamilyScreen 
                back={() => navigateTo("home")} 
                speak={speak}
                language={language}
              />
            ) : screen === "memories" ? (
              <MemoriesScreen
                back={() => navigateTo("home")}
                speak={speak}
                language={language}
              />
            ) : (
              <ProgressScreen
                back={() => navigateTo("home")}
                language={language}
                gameHistory={gameHistory}
                reminders={reminders}
              />
            )
          ) : view === "caregiver" ? (
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1, padding: "20px 10px" }}>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "var(--color-teal-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                  color: "var(--color-teal)"
                }}>
                  <ShieldAlert size={32} />
                </div>
                <h3 style={{ fontSize: 18, color: "var(--color-text-dark)", fontWeight: 800 }}>{t.pinTitle}</h3>
                <p style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 6 }}>{t.enterPin}</p>
                <p style={{ fontSize: 12, fontWeight: 700, color: "var(--color-teal-medium)", marginTop: 4 }}>Default PIN: <strong>1234</strong></p>
              </div>

              <form onSubmit={handlePinSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {pinError && (
                  <div style={{ color: "var(--color-danger)", fontSize: 12, textAlign: "center", fontWeight: 700 }}>
                    {pinError}
                  </div>
                )}
                <input
                  type="password"
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
                  placeholder="••••"
                  style={{
                    width: "100%",
                    padding: "16px",
                    borderRadius: 16,
                    border: "2px solid var(--color-teal-soft)",
                    fontSize: 24,
                    textAlign: "center",
                    letterSpacing: "8px",
                    fontFamily: "var(--font-display)"
                  }}
                />
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: 16,
                    border: "none",
                    background: "var(--color-teal)",
                    color: "white",
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "var(--shadow-sm)"
                  }}
                >
                  {t.unlock}
                </button>
                <button
                  type="button"
                  onClick={() => { playTapSound(); setView("patient"); setPicked(false); }}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: 16,
                    border: "none",
                    background: "transparent",
                    color: "var(--color-text-muted)",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    marginTop: 4
                  }}
                >
                  Cancel
                </button>
              </form>
            </div>
          ) : (
            <ClinicianScreen
              language={language}
              gameHistory={gameHistory}
              reminders={reminders}
              mood={mood}
              onExit={() => { setView("patient"); setPicked(false); }}
            />
          )}
        </div>

        {/* Bottom Tab Bar Navigation */}
        {view === "patient" && onboarded && !showSplash && (
          <div className="bottom-nav">
            <button
              onClick={() => navigateTo("home")}
              className={`nav-item ${screen === "home" ? "active" : ""}`}
            >
              <Home size={20} />
              <span>{t.home}</span>
            </button>
            <button
              onClick={() => navigateTo("game")}
              className={`nav-item ${screen === "game" ? "active" : ""}`}
            >
              <Gamepad2 size={20} />
              <span>{t.play}</span>
            </button>
            <button
              onClick={() => navigateTo("reminders")}
              className={`nav-item ${screen === "reminders" || screen === "calendar" ? "active" : ""}`}
            >
              <Bell size={20} />
              <span>{t.reminders}</span>
            </button>
            <button
              onClick={() => navigateTo("family")}
              className={`nav-item ${screen === "family" ? "active" : ""}`}
            >
              <Users size={20} />
              <span>{t.family}</span>
            </button>
            <button
              onClick={() => navigateTo("memories")}
              className={`nav-item ${screen === "memories" ? "active" : ""}`}
            >
              <BookHeart size={20} />
              <span>{t.memories || "Memories"}</span>
            </button>
            <button
              onClick={() => navigateTo("breathing")}
              className={`nav-item ${screen === "breathing" ? "active" : ""}`}
            >
              <Wind size={20} />
              <span>{t.calm || "Calm"}</span>
            </button>
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
}
