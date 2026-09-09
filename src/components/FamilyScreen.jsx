import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Check, X, Phone, MessageCircle, ChevronRight, Video, Plus, Camera, PhoneOff } from "lucide-react";
import { playTapSound, playMatchSound } from "../utils/audio";
import Garland from "./Garland";

import priyaImg from "../assets/priya.png";
import arjunImg from "../assets/arjun.png";
import raviImg from "../assets/ravi.png";

const DEFAULT_MEMBERS = [
  {
    id: 1,
    name: "Priya",
    relations: { en: "Daughter", hi: "बेटी", ta: "மகள்" },
    bio: {
      en: "Priya is 42. She lives in Bengaluru and works as a teacher. She calls you every morning at 9:00 AM.",
      hi: "प्रिया 42 वर्ष की हैं। वह बेंगलुरु में रहती हैं और शिक्षिका हैं। वह आपको हर सुबह 9:00 बजे फोन करती हैं।",
      ta: "பிரியாவிற்கு 42 வயது. அவர் பெங்களூரில் ஆசிரியராக பணியாற்றுகிறார். ஒவ்வொரு காலையும் 9:00 மணிக்கு போன் செய்வார்."
    },
    avatarBg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    avatarText: "👩",
    phone: "+91 98765 43210",
    photo: priyaImg
  },
  {
    id: 2,
    name: "Arjun",
    relations: { en: "Grandson", hi: "पोता", ta: "பேரன்" },
    bio: {
      en: "Arjun is 12. He is Priya's son. He loves playing cricket, eating mangoes, and hearing your stories.",
      hi: "अर्जुन 12 वर्ष का है। वह प्रिया का बेटा है। उसे क्रिकेट खेलना, आम खाना और आपकी कहानियां सुनना पसंद है।",
      ta: "அர்ஜுனிற்கு 12 வயது. அவர் பிரியாவின் மகன். அவருக்கு கிரிக்கெட் விளையாடவும், மாம்பழம் சாப்பிடவும் பிடிக்கும்."
    },
    avatarBg: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
    avatarText: "👦",
    phone: "+91 98765 01234",
    photo: arjunImg
  },
  {
    id: 3,
    name: "Ravi",
    relations: { en: "Son", hi: "बेटा", ta: "மகன்" },
    bio: {
      en: "Ravi is 45. He lives in Mumbai and is a doctor. He visits you on holidays and loves cooking for you.",
      hi: "रवि 45 वर्ष का है। वह मुंबई में रहता है और डॉक्टर है। वह छुट्टियों में आपसे मिलने आता है और आपके लिए खाना बनाता है।",
      ta: "ரவிக்கு 45 வயது. அவர் மும்பையில் மருத்துவராக இருக்கிறார். விடுமுறை நாட்களில் உங்களைச் சந்திக்க வருவார்."
    },
    avatarBg: "linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)",
    avatarText: "👨",
    phone: "+91 99887 76655",
    photo: raviImg
  }
];

export default function FamilyScreen({ back, speak, language }) {
  const [mode, setMode] = useState("call"); // "call" | "quiz"
  const [members, setMembers] = useState(() => {
    try {
      const saved = localStorage.getItem("memro_family_members");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // migrate if previous run saved members without photo paths
          return parsed.map(m => {
            if (m.id === 1 && !m.photo) return { ...m, photo: priyaImg };
            if (m.id === 2 && !m.photo) return { ...m, photo: arjunImg };
            if (m.id === 3 && !m.photo) return { ...m, photo: raviImg };
            return m;
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_MEMBERS;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showBio, setShowBio] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [callWith, setCallWith] = useState(null);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem("memro_family_members", JSON.stringify(members));
  }, [members]);

  const current = members[currentIndex % members.length] || members[0];

  useEffect(() => {
    setSelectedAnswer(null);
    setShowBio(false);
  }, [currentIndex, mode]);

  function handleAnswer(name) {
    if (selectedAnswer !== null) return;
    
    const isCorrect = name === current.name;
    setSelectedAnswer(name);
    
    const rel = current.relations[language] || current.relations["en"] || "family member";
    const enRel = current.relations["en"] || "family member";

    if (isCorrect) {
      playMatchSound();
      const speakTextEn = translations["en"].correctSpeech.replace("{name}", current.name).replace("{rel}", enRel);
      const speakTextReg = tr.correctSpeech.replace("{name}", current.name).replace("{rel}", rel);
      speak(speakTextEn, speakTextReg);
    } else {
      playTapSound();
      const speakTextEn = translations["en"].incorrectSpeech.replace("{name}", current.name).replace("{rel}", enRel);
      const speakTextReg = tr.incorrectSpeech.replace("{name}", current.name).replace("{rel}", rel);
      speak(speakTextEn, speakTextReg);
    }
  }

  function handleNext() {
    playTapSound();
    setCurrentIndex((prev) => (prev + 1) % members.length);
  }

  const translations = {
    en: {
      title: "Family",
      quizMode: "Recognize Game",
      callMode: "Call Family",
      whoIsThis: "Who is this family member?",
      correct: "Correct! That's",
      incorrect: "Not quite! That's",
      detailsBtn: "Show details",
      call: "Call",
      msg: "Message",
      next: "Next Person",
      descSuffix: "is your relative.",
      videoCall: "Video Call",
      addMember: "Add family member",
      saveMember: "Save member",
      namePlaceholder: "Name",
      relationPlaceholder: "Relation (e.g. Daughter)",
      calling: "Calling...",
      connected: "Connected",
      endCall: "End call",
      correctSpeech: "That's right! This is {name}, your {rel}.",
      incorrectSpeech: "Not quite, Amma. This is {name}, your {rel}."
    },
    hi: {
      title: "परिवार",
      quizMode: "पहेली खेल",
      callMode: "कॉल करें",
      whoIsThis: "यह परिवार का कौन सा सदस्य है?",
      correct: "सही है! यह हैं",
      incorrect: "गलत है! यह हैं",
      detailsBtn: "विवरण दिखाएं",
      call: "कॉल करें",
      msg: "संदेश भेजें",
      next: "अगला व्यक्ति",
      descSuffix: "हैं।",
      videoCall: "वीडियो कॉल",
      addMember: "परिवार के सदस्य जोड़ें",
      saveMember: "सुरक्षित करें",
      namePlaceholder: "नाम",
      relationPlaceholder: "संबंध (उदा. बेटी)",
      calling: "कॉल कर रहे हैं...",
      connected: "जुड़ गया",
      endCall: "कॉल समाप्त",
      correctSpeech: "बिल्कुल सही! यह {name} हैं, आपके {rel}。",
      incorrectSpeech: "नहीं अम्मा। यह {name} हैं, आपके {rel}。"
    },
    ta: {
      title: "குடும்பம்",
      correctSpeech: "சரியான விடை! இது உங்கள் {rel} {name}.",
      incorrectSpeech: "இல்லை அம்மா. இது உங்கள் {rel} {name}.",
      quizMode: "விளையாடு",
      callMode: "அழைக்கவும்",
      whoIsThis: "இந்தக் குடும்ப உறுப்பினர் யார்?",
      correct: "சரியான விடை! இது",
      incorrect: "தவறான விடை! இது",
      detailsBtn: "விவரங்களைக் காட்டு",
      call: "அழைக்கவும்",
      msg: "செய்தி",
      next: "அடுத்த நபர்",
      descSuffix: "உங்கள் உறவினர்.",
      videoCall: "வீடியோ கால்",
      addMember: "புது உறுப்பினர்",
      saveMember: "சேர்க்கவும்",
      namePlaceholder: "பெயர்",
      relationPlaceholder: "உறவு (எ.கா. மகள்)",
      calling: "அழைக்கிறது...",
      connected: "இணைக்கப்பட்டது",
      endCall: "அழைப்பை முடிக்க"
    },
    bn: {
      title: "পরিবার",
      quizMode: "চেনা জানার খেলা",
      callMode: "পরিবারকে ফোন",
      whoIsThis: "এই পারিবারিক সদস্যটি কে?",
      correct: "সঠিক! এটি",
      incorrect: "ঠিক নয়! এটি",
      detailsBtn: "বিস্তারিত দেখুন",
      call: "কল করুন",
      msg: "বার্তা পাঠান",
      next: "পরবর্তী ব্যক্তি",
      descSuffix: "আপনার আত্মীয় হয়।",
      videoCall: "ভিডিও কল",
      addMember: "পরিবারের সদস্য যুক্ত করুন",
      saveMember: "সংরक्षण করুন",
      namePlaceholder: "নাম",
      relationPlaceholder: "সম্পর্ক (যেমন: মেয়ে)",
      calling: "কল করা হচ্ছে...",
      connected: "সংযুক্ত হয়েছে",
      endCall: "কল শেষ করুন",
      correctSpeech: "একদম ঠিক! ইনি আপনার {rel} {name}।",
      incorrectSpeech: "ঠিক তা নয়, আম্মা। ইনি আপনার {rel} {name}।"
    },
    te: {
      title: "కుటుంబం",
      quizMode: "గుర్తించే ఆట",
      callMode: "కుటుంబానికి కాల్",
      whoIsThis: "ఈ కుటుంబ సభ్యుడు ఎవరు?",
      correct: "కరెక్ట్! ఈమె/ఇతను",
      incorrect: "కాదు! ఈమె/ఇతను",
      detailsBtn: "వివరాలు చూపించు",
      call: "కాల్",
      msg: "సందేశం",
      next: "తదుపరి వ్యక్తి",
      descSuffix: "మీ బంధువు.",
      videoCall: "వీడియో కాల్",
      addMember: "కుటుంబ సభ్యుడిని చేర్చు",
      saveMember: "సేవ్ చేయి",
      namePlaceholder: "పేరు",
      relationPlaceholder: "బంధుత్వం (ఉదా. కుమార్తె)",
      calling: "కాల్ చేస్తోంది...",
      connected: "కనెక్ట్ అయింది",
      endCall: "కాల్ ముగించు",
      correctSpeech: "కరెక్ట్! ఇది మీ {rel} {name}.",
      incorrectSpeech: "కాదమ్మా. ఇది మీ {rel} {name}."
    },
    kn: {
      title: "ಕುಟುಂಬ",
      quizMode: "ಗುರುತಿಸುವ ಆಟ",
      callMode: "ಕುಟುಂಬಕ್ಕೆ ಕರೆ",
      whoIsThis: "ಈ ಕುಟುಂಬದ ಸದಸ್ಯ ಯಾರು?",
      correct: "ಸರಿ! ಇದು",
      incorrect: "ಅಲ್ಲ! ಇದು",
      detailsBtn: "ವಿವರ ತೋರಿಸು",
      call: "ಕರೆ",
      msg: "ಸಂದೇಶ",
      next: "ಮುಂದಿನ ವ್ಯಕ್ತಿ",
      descSuffix: "ನಿಮ್ಮ ಸಂಬಂಧಿ.",
      videoCall: "ವಿಡಿಯೋ ಕರೆ",
      addMember: "ಕುಟುಂಬದ ಸದಸ್ಯರನ್ನು ಸೇರಿಸಿ",
      saveMember: "ಉಳಿಸಿ",
      namePlaceholder: "ಹೆಸರು",
      relationPlaceholder: "ಸಂಬಂಧ (ಉದಾ. ಮಗಳು)",
      calling: "ಕರೆ ಹೋಗುತ್ತಿದೆ...",
      connected: "ಸಂಪರ್ಕಗೊಂಡಿದೆ",
      endCall: "ಕರೆ ಮುಗಿಸಿ",
      correctSpeech: "ಸರಿಯಾದ ಉತ್ತರ! ಇದು ನಿಮ್ಮ {rel} {name}.",
      incorrectSpeech: "ಅಲ್ಲ ಅಮ್ಮ, ಇದು ನಿಮ್ಮ {rel} {name}."
    },
    ml: {
      title: "കുടുംബം",
      quizMode: "തിരിച്ചറിയൽ കളി",
      callMode: "കുടുംബത്തെ വിളിക്കുക",
      whoIsThis: "ഈ കുടുംബാംഗം ആരാണ്?",
      correct: "ശരിയാണ്! ഇത്",
      incorrect: "അല്ല! ഇത്",
      detailsBtn: "വിശദാംശങ്ങൾ കാണിക്കുക",
      call: "വിളിക്കുക",
      msg: "സന്ദേശം",
      next: "അടുത്ത ആൾ",
      descSuffix: "നിങ്ങളുടെ ബന്ധുവാണ്.",
      videoCall: "വീഡിയോ കോൾ",
      addMember: "കുടുംബാംഗത്തെ ചേർക്കുക",
      saveMember: "സൂക്ഷിക്കുക",
      namePlaceholder: "പേര്",
      relationPlaceholder: "ബന്ധം (ഉദാ: മകൾ)",
      calling: "വിളിക്കുന്നു...",
      connected: "ബന്ധിപ്പിച്ചു",
      endCall: "കോൾ അവസാനിപ്പിക്കുക",
      correctSpeech: "അതെ ശരിയാണ്! ഇത് നിങ്ങളുടെ {rel} {name} ആണ്.",
      incorrectSpeech: "അല്ല അമ്മേ, ഇത് നിങ്ങളുടെ {rel} {name} ആണ്."
    },
    mr: {
      title: "कुटुंब",
      quizMode: "ओळखा पाहू खेळ",
      callMode: "कुटुंबाला फोन करा",
      whoIsThis: "हा कुटुंबातील सदस्य कोण आहे?",
      correct: "बरोबर! हे आहेत",
      incorrect: "चूक! हे आहेत",
      detailsBtn: "तपशील दाखवा",
      call: "फोन करा",
      msg: "संदेश",
      next: "पुढील व्यक्ती",
      descSuffix: "तुमचे नातेवाईक आहेत.",
      videoCall: "व्हिडिओ कॉल",
      addMember: "कुटुंबातील सदस्य जोडा",
      saveMember: "जतन करा",
      namePlaceholder: "नाव",
      relationPlaceholder: "नाते (उदा. मुलगी)",
      calling: "फोन लावत आहे...",
      connected: "फोन जोडला गेला",
      endCall: "फोन बंद करा",
      correctSpeech: "Agdi barobar! He tumche {rel} {name} ahet.",
      incorrectSpeech: "Nahi Amma. He tumche {rel} {name} ahet."
    },
    gu: {
      title: "પરિવાર",
      quizMode: "ઓળખવાની રમત",
      callMode: "પરિવારને ફોન કરો",
      whoIsThis: "આ પરિવારના સભ્ય કોણ છે?",
      correct: "સાચું! આ છે",
      incorrect: "ખોટું! આ છે",
      detailsBtn: "વિગત જુઓ",
      call: "ફોન કરો",
      msg: "સંદેશો",
      next: "બીજી વ્યક્તિ",
      descSuffix: "તમારા સંબંધી છે.",
      videoCall: "વીડિયો કોલ",
      addMember: "પરિવારના સભ્ય ઉમેરો",
      saveMember: "સાચવો",
      namePlaceholder: "નામ",
      relationPlaceholder: "સંબંધ (દા.ત. પુત્રી)",
      calling: "ફોન જોડાઈ રહ્યો છે...",
      connected: "જોડાઈ ગયું",
      endCall: "ફોન કાપો",
      correctSpeech: "સાચું છે! આ તમારા {rel} {name} છે.",
      incorrectSpeech: "ના અમ્મા. આ તમારા {rel} {name} છે."
    },
    pa: {
      title: "ਪਰਿਵਾਰ",
      quizMode: "ਪਛਾਣੋ ਖੇਡ",
      callMode: "ਪਰਿਵਾਰ ਨੂੰ ਕਾਲ",
      whoIsThis: "ਇਹ ਪਰਿਵารਕ ਮੈਂਬਰ ਕੌਣ ਹੈ?",
      correct: "ਸਹੀ! ਇਹ ਹੈ",
      incorrect: "ਗਲਤ! ਇਹ ਹੈ",
      detailsBtn: "ਵੇਰਵੇ ਦਿਖਾਓ",
      call: "ਕਾਲ ਕਰੋ",
      msg: "ਸੁਨੇਹਾ",
      next: "ਅਗਲਾ ਵਿਅਕਤੀ",
      descSuffix: "ਤੁਹਾਡੇ ਰਿਸ਼ਤੇਦਾਰ ਹਨ।",
      videoCall: "ਵੀਡੀਓ ਕਾਲ",
      addMember: "ਪਰਿਵਾਰਕ ਮੈਂਬਰ ਜੋੜੋ",
      saveMember: "ਸੁਰੱਖਿਅਤ ਕਰੋ",
      namePlaceholder: "ਨਾਮ",
      relationPlaceholder: "ਰਿਸ਼ਤਾ (ਜਿਵੇਂ ਕਿ ਬੇਟੀ)",
      calling: "ਕਾਲ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ...",
      connected: "ਕਾਲ ਜੁੜ ਗਈ",
      endCall: "ਕਾਲ ਖਤਮ ਕਰੋ",
      correctSpeech: "ਬਿਲਕੁਲ ਸਹੀ! ਇਹ ਤੁਹਾਡੇ {rel} {name} ਹਨ।",
      incorrectSpeech: "ਨਹੀਂ ਅੰਮਾ। ਇਹ ਤੁਹਾਡੇ {rel} {name} ਹਨ।"
    },
    or: {
      title: "ପରିବାର",
      quizMode: "ଚିହ୍ନିବା ଖେଳ",
      callMode: "ପରିବାରକୁ କଲ୍",
      whoIsThis: "ଏହି ପରିବାର ସଦସ୍ୟ କିଏ?",
      correct: "ଠିକ୍! ଏ ହେଉଛନ୍ତି",
      incorrect: "ଭୁଲ୍! ଏ ହେଉଛନ୍ତି",
      detailsBtn: "ବିବରଣୀ ଦେଖନ୍ତು",
      call: "କଲ୍",
      msg: "ମେସେଜ୍",
      next: "ପରବର୍ତ୍ତୀ ବ୍ୟକ୍ତି",
      descSuffix: "ଆପଣଙ୍କର ସମ୍ପର୍କୀୟ ଅଟନ୍ତି।",
      videoCall: "ଭିଡିଓ କଲ୍",
      addMember: "ପରିବାର ସଦସ୍ୟ ଯୋଡନ୍ତು",
      saveMember: "ସେଭ୍ କରନ୍ତು",
      namePlaceholder: "ନାମ",
      relationPlaceholder: "ସମ୍ପര୍କ (ଯେପରିକି ଝିଅ)",
      calling: "କଲ୍ ଯାଉଛି...",
      connected: "ସଂଯୋਗ ହେଲା",
      endCall: "କଲ୍ ଶେଷ କരନ୍ତು",
      correctSpeech: "ବିଲକୁଲ୍ ଠିକ୍! ଏ ହେଉଛନ୍ତି ଆପଣଙ୍କ {rel} {name}।",
      incorrectSpeech: "ବ୍ୟସ୍ତ ହୁଅନ୍ତುନି ଅମ୍ମା, ଏ ହେଉଛନ୍ତି ଆପଣଙ୍କ {rel} {name}।"
    },
    ur: {
      title: "خاندان",
      quizMode: "پہچانیں گیم",
      callMode: "خاندان کو کال",
      whoIsThis: "یہ خاندان کا کون سا رکن ہے؟",
      correct: "صحیح! یہ ہیں",
      incorrect: "غلط! یہ ہیں",
      detailsBtn: "تفصیلات دیکھیں",
      call: "کال کریں",
      msg: "پیغام",
      next: "اگلا شخص",
      descSuffix: "آپ کے رشتہ دار ہیں۔",
      videoCall: "ویڈیو کال",
      addMember: "خاندان کے رکن کو شامل کریں",
      saveMember: "محفوظ کریں",
      namePlaceholder: "نام",
      relationPlaceholder: "رشتہ (مثلاً بیٹی)",
      calling: "کال ہو رہی ہے...",
      connected: "کال مل گئی",
      endCall: "کال ختم کریں",
      correctSpeech: "بالکل ٹھیک! یہ آپ کی {rel} {name} ہیں۔",
      incorrectSpeech: "نہیں اماں۔ یہ آپ کی {rel} {name} ہیں۔"
    }
  };

  const tr = translations[language] || translations["en"];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={back}
            aria-label="Go back"
            style={{
              border: "none",
              background: "var(--color-teal-light)",
              borderRadius: 14,
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--color-teal)"
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <h2 style={{ fontSize: 20, color: "var(--color-text-dark)", fontWeight: 800 }}>
            {tr.title}
          </h2>
        </div>

        {/* Mode Toggle Button */}
        <div style={{ display: "flex", background: "white", padding: 3, borderRadius: 20, border: "1px solid var(--color-teal-soft)" }}>
          <button
            onClick={() => { playTapSound(); setMode("call"); }}
            style={{
              padding: "6px 12px", borderRadius: 16, border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer",
              background: mode === "call" ? "var(--color-teal)" : "transparent",
              color: mode === "call" ? "white" : "var(--color-text-muted)"
            }}
          >
            {tr.callMode}
          </button>
          <button
            onClick={() => { playTapSound(); setMode("quiz"); }}
            style={{
              padding: "6px 12px", borderRadius: 16, border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer",
              background: mode === "quiz" ? "var(--color-teal)" : "transparent",
              color: mode === "quiz" ? "white" : "var(--color-text-muted)"
            }}
          >
            {tr.quizMode}
          </button>
        </div>
      </div>

      <Garland tone="light" />

      {/* CALL MODE CONTENT */}
      {mode === "call" && (
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: 60 }} className="tp-anim">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 6 }}>
            {members.map((m) => {
              const rel = m.relations?.[language] || m.relations?.["en"] || m.relation || "Family";
              return (
                <div
                  key={m.id}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                    background: "white", borderRadius: 20, padding: "16px 12px", border: "1px solid var(--color-teal-soft)",
                    boxShadow: "var(--shadow-sm)", textAlign: "center"
                  }}
                >
                  {/* Photo or Styled Initials Avatar */}
                  {m.photo ? (
                    <img src={m.photo} alt={m.name} style={{
                      width: 68, height: 68, borderRadius: "50%", objectFit: "cover",
                      border: "3px solid white", boxShadow: "0 2px 6px rgba(0,0,0,0.12)"
                    }} />
                  ) : (
                    <div style={{
                      width: 68, height: 68, borderRadius: "50%",
                      background: m.avatarBg || "var(--color-teal-medium)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      border: "3px solid white", boxShadow: "0 2px 6px rgba(0,0,0,0.12)"
                    }}>
                      <span style={{ color: "white", fontSize: 26, fontWeight: 700 }}>
                        {m.avatarText || m.name[0]}
                      </span>
                    </div>
                  )}

                  <span style={{ color: "var(--color-text-dark)", fontWeight: 700, fontSize: 14.5 }}>{m.name}</span>
                  <span style={{ color: "var(--color-text-muted)", fontSize: 11.5 }}>{rel}</span>

                  <button
                    onClick={() => { playTapSound(); setCallWith(m); }}
                    style={{
                      marginTop: 4, display: "flex", alignItems: "center", gap: 5,
                      background: "var(--color-teal)", borderRadius: 20, padding: "6px 14px",
                      border: "none", cursor: "pointer"
                    }}
                  >
                    <Video size={13} color="white" />
                    <span style={{ color: "white", fontSize: 11.5, fontWeight: 700 }}>{tr.videoCall}</span>
                  </button>
                </div>
              );
            })}

            {/* Add Member Card */}
            <button
              onClick={() => { playTapSound(); setShowAddMember(true); }}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
                borderRadius: 20, padding: "16px 12px", border: "2px dashed var(--color-teal)",
                background: "transparent", cursor: "pointer", minHeight: 160
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: "50%", background: "var(--color-teal-light)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <Plus size={20} color="var(--color-teal)" />
              </div>
              <span style={{ color: "var(--color-teal)", fontSize: 12.5, fontWeight: 700, textAlign: "center" }}>
                {tr.addMember}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* QUIZ MODE CONTENT */}
      {mode === "quiz" && current && (
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: 10 }} className="tp-anim">
          <div style={{
            background: "white",
            borderRadius: 28,
            border: "1px solid var(--color-teal-soft)",
            boxShadow: "var(--shadow-md)",
            padding: "24px 16px",
            textAlign: "center",
            marginBottom: 16
          }}>
            {/* Photo / Styled avatar preview */}
            {current.photo ? (
              <img src={current.photo} alt={current.name} style={{
                width: 140, height: 140, borderRadius: "50%", objectFit: "cover",
                margin: "0 auto 20px", display: "block", border: "5px solid white",
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)"
              }} />
            ) : (
              <div
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: "50%",
                  background: current.avatarBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 72,
                  margin: "0 auto 20px",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                  border: "5px solid white",
                  userSelect: "none"
                }}
              >
                {current.avatarText || current.name[0]}
              </div>
            )}

            <div style={{ fontSize: 17, color: "var(--color-text-dark)", fontWeight: 700, marginBottom: 16 }}>
              {tr.whoIsThis}
            </div>

            {/* Quiz Multiple Choice Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {members.map((p) => {
                const isSelected = selectedAnswer === p.name;
                const isCorrect = p.name === current.name;
                let btnStyle = {};

                if (selectedAnswer !== null) {
                  if (isCorrect) {
                    btnStyle = {
                      backgroundColor: "var(--color-success-light)",
                      borderColor: "var(--color-success)",
                      color: "var(--color-success)",
                    };
                  } else if (isSelected) {
                    btnStyle = {
                      backgroundColor: "var(--color-danger-light)",
                      borderColor: "var(--color-danger)",
                      color: "var(--color-danger)",
                    };
                  } else {
                    btnStyle = { opacity: 0.5 };
                  }
                }

                return (
                  <button
                    key={p.name}
                    disabled={selectedAnswer !== null}
                    onClick={() => handleAnswer(p.name)}
                    className="family-option-btn"
                    style={btnStyle}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      {selectedAnswer !== null && isCorrect && <Check size={16} />}
                      {selectedAnswer !== null && isSelected && !isCorrect && <X size={16} />}
                      {p.name}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quiz Feedback */}
            {selectedAnswer !== null && (
              <div style={{ marginTop: 20 }}>
                <div style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: selectedAnswer === current.name ? "var(--color-success)" : "var(--color-danger)",
                  marginBottom: 8
                }}>
                  {selectedAnswer === current.name 
                    ? `${tr.correct} ${current.name}` 
                    : `${tr.incorrect} ${current.name}`}
                </div>
                <div style={{ fontSize: 13, color: "var(--color-text-muted)", lineHeight: 1.5, marginBottom: 16 }}>
                  {current.name} {(current.relations?.[language] || current.relations?.["en"] || current.relation || "relative").toLowerCase()} {tr.descSuffix}
                </div>

                {!showBio ? (
                  <button
                    onClick={() => { playTapSound(); setShowBio(true); }}
                    style={{
                      border: "none",
                      background: "var(--color-teal-light)",
                      color: "var(--color-teal)",
                      padding: "8px 16px",
                      borderRadius: 12,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    {tr.detailsBtn}
                  </button>
                ) : (
                  <div style={{
                    background: "var(--color-teal-light)",
                    borderRadius: 16,
                    padding: 16,
                    textAlign: "left",
                    border: "1px solid var(--color-teal-soft)",
                    marginTop: 10
                  }}>
                    <div style={{ fontSize: 13.5, color: "var(--color-text-dark)", lineHeight: 1.6, marginBottom: 12 }}>
                      {current.bio?.[language] || current.bio?.["en"] || "No additional bio details available."}
                    </div>
                    
                    {/* Action buttons */}
                    <div style={{ display: "flex", gap: 10 }}>
                      <a
                        href={`tel:${current.phone || "+919876543210"}`}
                        onClick={playTapSound}
                        style={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                          padding: "10px",
                          borderRadius: 10,
                          background: "var(--color-teal)",
                          color: "white",
                          fontSize: 12,
                          fontWeight: 700,
                          textDecoration: "none",
                          textAlign: "center"
                        }}
                      >
                        <Phone size={14} /> {tr.call}
                      </a>
                      <button
                        onClick={() => { playTapSound(); alert(`Calling/messaging simulation to ${current.name}...`); }}
                        style={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                          padding: "10px",
                          borderRadius: 10,
                          background: "white",
                          border: "1px solid var(--color-teal-soft)",
                          color: "var(--color-teal)",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer"
                        }}
                      >
                        <MessageCircle size={14} /> {tr.msg}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {selectedAnswer !== null && (
            <button
              onClick={handleNext}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                width: "100%",
                padding: "16px",
                borderRadius: 18,
                border: "none",
                background: "var(--color-teal)",
                color: "white",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "var(--shadow-sm)",
                marginTop: 10
              }}
            >
              <span>{tr.next}</span>
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      )}

      {/* ADD MEMBER MODAL */}
      {showAddMember && (
        <AddMemberModal
          tr={tr}
          onClose={() => setShowAddMember(false)}
          onSave={(newM) => {
            setMembers((prev) => [...prev, newM]);
            setShowAddMember(false);
          }}
        />
      )}

      {/* CALL OVERLAY */}
      {callWith && (
        <CallOverlay
          member={callWith}
          tr={tr}
          onEnd={() => setCallWith(null)}
        />
      )}
    </div>
  );
}

/* Modal component for adding new members */
function AddMemberModal({ onClose, onSave, tr }) {
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [photo, setPhoto] = useState(null);
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  const gradients = [
    "linear-gradient(135deg, #1C7A6C 0%, #0E5C52 100%)",
    "linear-gradient(135deg, #f5576c 0%, #f093fb 100%)",
    "linear-gradient(135deg, #fda085 0%, #f6d365 100%)",
    "linear-gradient(135deg, #b490ca 0%, #5ee7df 100%)",
    "linear-gradient(135deg, #E07B33 0%, #C99A2E 100%)",
  ];

  const handleSave = () => {
    const randomGrad = gradients[Math.floor(Math.random() * gradients.length)];
    onSave({
      id: Date.now(),
      name: name.trim(),
      relations: { en: relation.trim(), hi: relation.trim(), ta: relation.trim() },
      relation: relation.trim(),
      bio: {
        en: `${name.trim()} is your family member.`,
        hi: `${name.trim()} आपके परिवार के सदस्य हैं।`,
        ta: `${name.trim()} உங்கள் குடும்ப உறுப்பினர்.`
      },
      avatarBg: randomGrad,
      avatarText: name.trim()[0].toUpperCase(),
      photo,
      phone: "+91 99887 76655"
    });
  };

  return (
    <div style={{
      position: "absolute", inset: 0, background: "rgba(35, 49, 43, 0.7)",
      display: "flex", alignItems: "flex-end", zIndex: 120, backdropFilter: "blur(4px)"
    }}>
      <div className="tp-anim" style={{
        background: "white", width: "100%", borderRadius: "28px 28px 0 0", padding: "24px 20px 30px",
        boxShadow: "var(--shadow-lg)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ color: "var(--color-text-dark)", fontSize: 18, fontWeight: 800 }}>
            {tr.addMember}
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <X size={22} color="var(--color-text-muted)" />
          </button>
        </div>

        {/* Photo Upload Area */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
          <button
            onClick={() => fileRef.current.click()}
            style={{
              width: 90, height: 90, borderRadius: "50%", border: `2px dashed var(--color-teal)`,
              background: photo ? "transparent" : "var(--color-teal-light)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", overflow: "hidden", position: "relative"
            }}
            title="Upload photo"
          >
            {photo ? (
              <img src={photo} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <Camera size={26} color="var(--color-teal)" />
            )}
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
        </div>

        <input
          placeholder={tr.namePlaceholder} value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%", padding: "14px 16px", borderRadius: 14, border: "2px solid var(--color-teal-soft)",
            marginBottom: 12, fontSize: 15, background: "var(--color-bg-warm)", color: "var(--color-text-dark)", outline: "none", boxSizing: "border-box"
          }}
        />
        <input
          placeholder={tr.relationPlaceholder} value={relation}
          onChange={(e) => setRelation(e.target.value)}
          style={{
            width: "100%", padding: "14px 16px", borderRadius: 14, border: "2px solid var(--color-teal-soft)",
            marginBottom: 20, fontSize: 15, background: "var(--color-bg-warm)", color: "var(--color-text-dark)", outline: "none", boxSizing: "border-box"
          }}
        />

        <button
          disabled={!name.trim()}
          onClick={handleSave}
          style={{
            width: "100%", padding: "16px 0", borderRadius: 16, border: "none", fontSize: 15, fontWeight: 700,
            background: name.trim() ? "var(--color-teal)" : "#E4E1D6",
            color: name.trim() ? "white" : "var(--color-text-muted)",
            cursor: name.trim() ? "pointer" : "not-allowed",
            boxShadow: name.trim() ? "var(--shadow-sm)" : "none",
            transition: "all 0.2s"
          }}
        >
          {tr.saveMember}
        </button>
      </div>
    </div>
  );
}

/* Call Overlay simulating a connected video call */
function CallOverlay({ member, tr, onEnd }) {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setConnected(true);
      playMatchSound();
    }, 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      position: "absolute", inset: 0, background: "#0E5C52", zIndex: 150,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24
    }} className="tp-anim">
      {/* Pulsing ring animation in calling mode */}
      <div className={!connected ? "pulse-listening" : ""} style={{ borderRadius: "50%" }}>
        {member.photo ? (
          <img src={member.photo} alt={member.name} style={{
            width: 120, height: 120, borderRadius: "50%", objectFit: "cover",
            border: "4px solid white", boxShadow: "0 4px 12px rgba(0,0,0,0.25)"
          }} />
        ) : (
          <div style={{
            width: 120, height: 120, borderRadius: "50%", background: member.avatarBg || "#1C7A6C",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "4px solid white", boxShadow: "0 4px 12px rgba(0,0,0,0.25)"
          }}>
            <span style={{ color: "white", fontSize: 44, fontWeight: 700 }}>
              {member.avatarText || member.name[0]}
            </span>
          </div>
        )}
      </div>

      <h3 style={{ color: "white", fontSize: 24, fontWeight: 800, marginTop: 24, fontFamily: "var(--font-display)" }}>
        {member.name}
      </h3>
      
      <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, marginTop: 6, fontWeight: 600 }}>
        {connected ? tr.connected : tr.calling}
      </p>

      {/* Red Call End Button */}
      <button
        onClick={() => { playTapSound(); onEnd(); }}
        style={{
          marginTop: 48, width: 64, height: 64, borderRadius: "50%", border: "none",
          background: "var(--color-danger)", display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", boxShadow: "0 4px 14px rgba(228, 87, 75, 0.4)",
          transition: "transform 0.15s ease"
        }}
        className="phdt-card"
        title={tr.endCall}
      >
        <PhoneOff size={28} color="white" />
      </button>
    </div>
  );
}
