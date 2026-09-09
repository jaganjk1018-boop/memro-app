import React, { useState } from "react";
import { Gamepad2, Bell, Users, Heart, Wind, AlertOctagon, ArrowRight, Mic, ShieldAlert } from "lucide-react";
import { playTapSound } from "../utils/audio";
import { TRANSLATIONS } from "../App";

/* ---- Friendly flat illustrations (hand-built SVG, no external assets) ---- */
function ElderlyAvatar({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" style={{ display: "block" }}>
      <circle cx="50" cy="50" r="48" fill="#FDEEDC" />
      <path d="M20 78c2-20 12-30 30-30s28 10 30 30" fill="#E8CBAE" />
      <circle cx="50" cy="42" r="22" fill="#F3D2AE" />
      <path d="M28 34c2-14 40-18 44-2 2 8 0 4-4 4-4-10-32-10-36 0-2 4-4 2-4-2z" fill="#D9D9D9" />
      <path d="M27 30c-3 8-3 16 1 22-6-2-9-10-8-18 1-6 4-6 7-4z" fill="#D9D9D9" />
      <path d="M73 30c3 8 3 16-1 22 6-2 9-10 8-18-1-6-4-6-7-4z" fill="#D9D9D9" />
      <circle cx="41" cy="44" r="6.4" fill="none" stroke="#5B4636" strokeWidth="2.2" />
      <circle cx="59" cy="44" r="6.4" fill="none" stroke="#5B4636" strokeWidth="2.2" />
      <line x1="47.4" y1="44" x2="52.6" y2="44" stroke="#5B4636" strokeWidth="2.2" />
      <line x1="34.6" y1="41" x2="30" y2="39" stroke="#5B4636" strokeWidth="2" />
      <line x1="65.4" y1="41" x2="70" y2="39" stroke="#5B4636" strokeWidth="2" />
      <circle cx="41" cy="44" r="2.1" fill="#5B4636" />
      <circle cx="59" cy="44" r="2.1" fill="#5B4636" />
      <path d="M42 55q8 6 16 0" fill="none" stroke="#B4633F" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M14 92c3-16 15-24 36-24s33 8 36 24" fill="#1C7A6C" />
    </svg>
  );
}

function LeavesDecor({ width = 120, height = 90 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 140 110" aria-hidden="true" style={{ animation: "phdt-sway 6s ease-in-out infinite", transformOrigin: "0% 100%" }}>
      <path d="M0 110C10 70 35 45 70 35 55 60 45 85 40 110Z" fill="#6FA383" opacity="0.8" />
      <path d="M0 110C6 78 22 52 50 38 40 62 28 88 24 110Z" fill="#8FBF8A" opacity="0.75" />
      <path d="M0 110C4 90 12 70 30 55 24 74 18 92 16 110Z" fill="#B7DAAE" opacity="0.7" />
    </svg>
  );
}

function GameControllerIllustration({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path d="M12 18h24a10 10 0 0 1 10 10v2a6 6 0 0 1-10.8 3.6L32 30H16l-3.2 3.6A6 6 0 0 1 2 30v-2a10 10 0 0 1 10-10Z" fill="white" opacity="0.92" />
      <rect x="10" y="24" width="4" height="10" rx="2" fill="var(--color-teal)" />
      <rect x="7" y="27" width="10" height="4" rx="2" fill="var(--color-teal)" />
      <circle cx="34" cy="24" r="2.4" fill="var(--color-teal)" />
      <circle cx="39" cy="29" r="2.4" fill="var(--color-teal)" />
    </svg>
  );
}

function FamilyIllustration({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="17" cy="16" r="7" fill="white" opacity="0.95" />
      <path d="M6 38c1-9 6-13 11-13s10 4 11 13Z" fill="white" opacity="0.95" />
      <circle cx="33" cy="19" r="5.4" fill="white" opacity="0.8" />
      <path d="M24 39c1-7 5-10 9-10s8 3 9 10Z" fill="white" opacity="0.8" />
    </svg>
  );
}

function LeafBreatheIllustration({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path d="M24 6C12 10 8 22 12 34c4 10 16 12 22 6 8-8 6-24-10-34Z" fill="white" opacity="0.92" />
      <path d="M24 10c-2 10-2 20 6 28" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

function GardenIllustration({ width = 76, height = 50 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 92 60" aria-hidden="true" style={{ flexShrink: 0 }}>
      <ellipse cx="46" cy="54" rx="44" ry="5" fill="#E9DFAE" />
      <g style={{ animation: "phdt-sway 5s ease-in-out infinite", transformOrigin: "16px 54px" }}>
        <rect x="14" y="26" width="4" height="26" rx="2" fill="#9C7A4B" />
        <circle cx="16" cy="20" r="14" fill="#7FAE8C" />
        <circle cx="8" cy="26" r="9" fill="#8FBF8A" />
      </g>
      <g style={{ animation: "phdt-sway 6.5s ease-in-out infinite", transformOrigin: "74px 54px" }}>
        <rect x="72" y="20" width="4" height="32" rx="2" fill="#9C7A4B" />
        <circle cx="74" cy="16" r="12" fill="#6FA383" />
      </g>
      <rect x="34" y="42" width="24" height="4" rx="2" fill="#B48A55" />
      <rect x="36" y="46" width="3" height="8" fill="#8A6A42" />
      <rect x="53" y="46" width="3" height="8" fill="#8A6A42" />
      <circle cx="46" cy="12" r="6" fill="#FCE8A8" opacity="0.9" />
    </svg>
  );
}

function WaveformBars({ count = 4, color = "var(--color-teal-medium)" }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 20 }} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          style={{
            width: 4,
            height: 20,
            borderRadius: 2,
            background: color,
            transformOrigin: "bottom",
            display: "inline-block",
            animation: `phdt-eq ${0.7 + i * 0.14}s ease-in-out ${i * 0.1}s infinite`
          }}
        />
      ))}
    </div>
  );
}

function FeatureCard({ Illustration, iconBg, label, sub, bg, delay, badge, onClick }) {
  return (
    <div
      onClick={onClick}
      className="phdt-card phdt-rise"
      style={{
        animationDelay: `${delay}s`,
        position: "relative",
        borderRadius: 22,
        background: bg,
        padding: "16px 16px 44px",
        boxShadow: "var(--shadow-sm)",
        cursor: "pointer"
      }}
    >
      {badge > 0 && (
        <span
          style={{
            position: "absolute",
            top: 12,
            right: 14,
            background: "var(--color-danger)",
            color: "white",
            fontSize: 11,
            fontWeight: 800,
            borderRadius: 999,
            minWidth: 20,
            height: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 5px"
          }}
        >
          {badge}
        </span>
      )}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.06)"
        }}
      >
        <Illustration />
      </div>
      <div className="phdt-display" style={{ fontSize: 15, fontWeight: 700, color: "var(--color-text-dark)", marginTop: 12 }}>
        {label}
      </div>
      <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 4, lineHeight: 1.4 }}>
        {sub}
      </div>
      <button
        className="phdt-arrow"
        aria-label={`Open ${label}`}
        style={{
          position: "absolute",
          bottom: 14,
          right: 14,
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "none",
          background: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 3px 8px rgba(0,0,0,0.06)",
          cursor: "pointer"
        }}
      >
        <ArrowRight size={14} color="var(--color-text-dark)" />
      </button>
    </div>
  );
}

export default function HomeScreen({ go, name, reminders, mood, setMood, speak, language, onSosTrigger }) {
  const [sosSent, setSosSent] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);

  const today = new Date().toLocaleDateString(
    language === "en" ? "en-US" : 
    language === "hi" ? "hi-IN" :
    language === "bn" ? "bn-IN" :
    language === "ta" ? "ta-IN" :
    language === "te" ? "te-IN" :
    language === "mr" ? "mr-IN" : "as-IN",
    { weekday: "long", day: "numeric", month: "long" }
  );

  const completedCount = reminders.filter(r => r.done).length;
  const totalCount = reminders.length;

  const t = TRANSLATIONS[language] || TRANSLATIONS["en"];

  // Custom mood translations & speech voice feedbacks
  const moods = {
    en: [
      { emoji: "😁", label: "Very Happy", voice: "I am so happy you are feeling wonderful today, Amma!" },
      { emoji: "😊", label: "Happy", voice: "Glad to see you smiling today, Amma!" },
      { emoji: "🙂", label: "Okay", voice: "Have a peaceful day today, Amma." },
      { emoji: "😔", label: "Tired", voice: "Please take rest if you are feeling tired, Amma." },
      { emoji: "😢", label: "Sad", voice: "Remember Priya and Ravi love you very much, Amma!" },
    ],
    hi: [
      { emoji: "😁", label: "बहुत खुश", voice: "मुझे बहुत खुशी है कि आप आज बहुत अच्छा महसूस कर रही हैं, अम्मा!" },
      { emoji: "😊", label: "खुश", voice: "आज आपको मुस्कुराते हुए देखकर खुशी हुई, अम्मा!" },
      { emoji: "🙂", label: "ठीक", voice: "अम्मा, आज आपका दिन शांतिपूर्ण रहे।" },
      { emoji: "😔", label: "थका हुआ", voice: "अगर आप थकान महसूस कर रही हैं तो कृपया आराम करें, अम्मा।" },
      { emoji: "😢", label: "उदास", voice: "याद रखें कि प्रिया और रवि आपसे बहुत प्यार करते हैं, अम्मा!" },
    ],
    bn: [
      { emoji: "😁", label: "খুব খুশি", voice: "আমি খুব খুশি যে আজ আপনি চমৎকার অনুভব করছেন, আম্মা!" },
      { emoji: "😊", label: "খুশি", voice: "আজ আপনাকে হাসতে দেখে খুব ভালো লাগছে, আম্মা!" },
      { emoji: "🙂", label: "স্বাভাবিক", voice: "আম্মা, আজকের দিনটি আপনার শান্তিতে কাটুক।" },
      { emoji: "😔", label: "ক্লান্ত", voice: "আম্মা, ক্লান্ত লাগলে একটু বিশ্রাম নিন।" },
      { emoji: "😢", label: "দুঃখিত", voice: "মনে রাখবেন প্রিয়া ও রবি আপনাকে খুব ভালোবাসে, আম্মা!" },
    ],
    ta: [
      { emoji: "😁", label: "மிகவும் மகிழ்ச்சி", voice: "இன்று நீங்கள் நன்றாக உணர்வதில் நான் மிகவும் மகிழ்ச்சியடைகிறேன் அம்மா!" },
      { emoji: "😊", label: "மகிழ்ச்சி", voice: "இன்று உங்களை சிரிக்கப் பார்ப்பதில் மகிழ்ச்சி அம்மா!" },
      { emoji: "🙂", label: "பரவாயில்லை", voice: "இன்று ஒரு அமைதியான நாள் அமையட்டும் அம்மா." },
      { emoji: "😔", label: "சோர்வு", voice: "சோர்வாக இருந்தால் தயவுசெய்து ஓய்வெடுங்கள் அம்மா." },
      { emoji: "😢", label: "வருத்தம்", voice: "பிரியாவும் ரவியும் உங்களை மிகவும் நேசிக்கிறார்கள் என்பதை நினைவில் கொள்ளுங்கள் அம்மா!" },
    ],
    te: [
      { emoji: "😁", label: "చాలా సంతోషం", voice: "ఈ రోజు మీరు చాలా సంతోషంగా ఉన్నందుకు నాకు చాలా ఆనందంగా ఉంది అమ్మా!" },
      { emoji: "😊", label: "సంతోషం", voice: "ఈ రోజు మిమ్మల్ని నవ్వుతూ చూడటం సంతోషంగా ఉంది అమ్మా!" },
      { emoji: "🙂", label: "పర్వాలేదు", voice: "ఈ రోజు మీకు ప్రశాంతంగా గడవాలని కోరుకుంటున్నాను అమ్మా." },
      { emoji: "😔", label: "అలసట", voice: "అలసటగా అనిపిస్తే దయచేసి విశ్రాంతి తీసుకోండి అమ్మా." },
      { emoji: "😢", label: "బాధ", voice: "ప్రియ మరియు రవి మిమ్మల్ని చాలా ప్రేమిస్తున్నారని గుర్తుంచుకోండి అమ్మా!" },
    ],
    mr: [
      { emoji: "😁", label: "खूप आनंदी", voice: "आज तुम्हाला खूप छान वाटत असल्यामुळे मला खूप आनंद झाला आहे अम्मा!" },
      { emoji: "😊", label: "आनंदी", voice: "आज तुम्हाला हसताना पाहून खूप आनंद झाला अम्मा!" },
      { emoji: "🙂", label: "ठीक", voice: "अम्मा, आजचा裝 दिवस शांततेचा जावो." },
      { emoji: "😔", label: "थकलेला", voice: "जर तुम्हाला थकल्यासारखे वाटत असेल तर कृपया विश्रांती घ्या अम्मा." },
      { emoji: "😢", label: "उदास", voice: "लक्षात ठेवा प्रिया आणि रवी तुमच्यावर खूप प्रेम करतात अम्मा!" },
    ],
    as: [
      { emoji: "😁", label: "খুব সুখী", voice: "আজি আপুনি ভাল অনুভৱ কৰি থকা দেখি মই বৰ সুখী আম্মা!" },
      { emoji: "😊", label: "সুখী", voice: "আজি আপোনাক হঁহা দেখি বৰ ভাল লাগিল আম্মা!" },
      { emoji: "😐", label: "ঠিক আছে", voice: "আজিৰ দিনটো শান্তিময় হওক আম্মা।" },
      { emoji: "😔", label: "ভাগৰুৱা", voice: "যদি আপুনি ভাগৰুৱা অনুভৱ কৰিছে তেন্তে অনুগ্ৰহ কৰি জিৰণি লওক আম্মা।" },
      { emoji: "😢", label: "দুখী", voice: "মনত ৰাখিব প্ৰিয়া আৰু ৰবিয়ে আপোনাক বহুত ভাল পায় আম্মা!" }
    ]
  };

  const dailyTip = {
    en: "A 10-minute walk in the garden is great for boosting memory and keeping the mind fresh.",
    hi: "बगीचे में 10 मिनट की सैर याददाश्त बढ़ाने और दिमाग को तरोताजा रखने के लिए बेहतरीन है।",
    as: "বাগিচাত ১০ মিনিট খোজ কঢ়া স্মৃতিশক্তি সতেজ কৰি ৰাখিবলৈ অতি উত্তম।",
    bn: "বাগানে ১০ মিনিটের হাঁটা স্মৃতিশক্তি বাড়াতে এবং মনকে সতেজ রাখতে সাহায্য করে।",
    br: "उन्दै बारगोआव 10 मिनिट साबायनाया गोसोखां शक्ति बांहोनो गोसोखौ गोजोन खालामो।",
    doi: "बाग बगीचे च 10 minute दी सैर याददाश्त बधाने ते दिमाग तरोताजा रखन लई शैल ऐ।",
    gu: "બગીચામાં 10 મિનિટ ચાલવું યાદશક્તિ सुधारवा आनी मन ताजे दवरपाक बरें आसता।",
    kn: "ತೋಟದಲ್ಲಿ 10 ನಿಮಿಷಗಳ ನಡಿಗೆ ಜ್ಞాపకಶಕ್ತಿ ಹೆಚ್ಚಿಸಲು ಮತ್ತು ಮನಸ್ಸನ್ನು ತಾಜாவಾಗಿಡಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
    ks: "باغس منز ۱۰ منٹ پیدल پکن چھ یادداشت بہتر بناونہ تہ دماغ تازہ थाونہ ختر वारयाہ जान।",
    kok: "बागेंत 10 मिनिटां चलप याद दवरपाक आनी मन ताजे दवरपाक बरें आसता।",
    mai: "बगीचामे 10 मिनट टहलनाई याददाश्त बढेबाक लेल आ दिमाग ताजा रखबाक लेल बहुत नीक अछि।",
    ml: "പൂന്തോട്ടത്തിൽ 10 മിനിറ്റ് നടക്കുന്നത് ഓർമ്മശക്തി വർദ്ധിപ്പിക്കുന്നതിനും മനസ്സിന് ഉന്മേഷം നൽകുന്നതിനും വളരെ നല്ലതാണ്.",
    mni: "লৈকোন্দা মিনিট ১০ খঙচৎ চৎপা স্মৃতি শক্তি হেনগৎহনবা অমসুং ৱาখল নুংঙাইহনবদা কান্নৈ।",
    mr: "बागेत १० मिनिटे चालणे स्मरणशक्ती वाढवण्यासाठी आणि मन ताजेतवाने ठेवण्यासाठी खूप फायदेशीर आहे।",
    ne: "बगैंचामा १० मिनेट हिंड्नु सम्झना शक्ति बढाउन र मन ताजा राख्नको लागि राम्रो हुन्छ।",
    or: "ବଗିଚାରେ 10 ମିନିଟ୍ ଚାଲିବା ସ୍ମରଣ ଶକ୍ତି ବୃଦ୍ଧି ଏବଂ ମନକୁ ସତେଜ ରଖିବା ପାଇଁ ବହୁତ ଭଲ ।",
    pa: "ਬਗੀਚੇ ਵਿੱਚ 10 ਮਿੰਟ ਦੀ ਸੈਰ ਯਾਦਦਾਸ਼ਤ ਵਧਾਉਣ ਅਤੇ ਮਨ ਨੂੰ ਤਾਜ਼ਾ ਰੱਖਣ ਲਈ ਬਹੁਤ ਵਧੀਆ ਹੈ।",
    sa: "उद्याने दश निमेषाणां विहारः स्मरणशक्तिवर्धनाय मनसः प्रफुल्लतायै च अतीव उत्तमः अस्ति।",
    sat: "বাগানরে ১০ মিনিট তাড়াং দিশা শক্তি হারা লাগিৎ আর মন সতেজ লাগিৎ আডি ভাগোয়া।",
    sd: "باغيچي ۾ 10 منٽ هلڻ یاداشت کي تیز ڪرڻ ۽ دماغ کي تازو رکڻ لاءِ بهترين آهي.",
    ta: "தோட்டத்தில் 10 நிமிட நடைப்பயிற்சி நினைவகத்தை மேம்படுத்தவும் புதிய மனதிற்கும் சிறந்தது.",
    te: "తోటలో 10 నిమిషాల నడక జ్ఞాపకశక్తి పెరగడానికి మరియు మనస్సును తాజాగా ఉంచడానికి చాలా మంచిది.",
    ur: "باغ میں 10 منٹ की चहल कदमी याददाश्त को बेहतर बनाने और दिमाग को ताजा दम करने के लिए बहुत बेहतरीन है।"
  };

  const handleMoodSelect = (m) => {
    setMood(m.emoji);
    playTapSound();
    const enMood = moods["en"].find(em => em.emoji === m.emoji);
    speak(enMood ? enMood.voice : m.voice, m.voice);
  };

  const triggerSosAlarm = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      
      const osc1 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(660, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      osc1.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc1.start();
      
      osc1.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.5);
      osc1.frequency.linearRampToValueAtTime(660, ctx.currentTime + 1.0);
      
      setTimeout(() => {
        osc1.stop();
        ctx.close();
      }, 1000);
    } catch(e) {}

    setSosSent(true);
    const enSosVoice = "SOS Alert triggered. Sending help coordinates to Ravi and Priya.";
    let sosVoice = enSosVoice;
    if (language === "hi") {
      sosVoice = "एसओएस अलर्ट भेजा गया है। आपकी बेटी प्रिया को सूचना मिल गई है।";
    } else if (language === "ta") {
      sosVoice = "உதவி கோரப்பட்டது. பிரியா மற்றும் ரவிக்கு செய்தி அனுப்பப்பட்டது.";
    } else if (language === "bn") {
      sosVoice = "জরুরি সতর্কতা পাঠানো হয়েছে। প্রিয়া এবং রবির সাথে যোগাযোগ করা হচ্ছে।";
    }
    speak(enSosVoice, sosVoice);

    if (onSosTrigger) {
      onSosTrigger();
    }
  };

  const activeMoodList = moods[language] || moods["en"];

  const getFeelingText = () => {
    switch (language) {
      case "en": return "Feeling: ";
      case "hi": return "महसूस हो रहा है: ";
      case "ta": return "உணர்வு: ";
      case "bn": return "অনুভব হচ্ছে: ";
      case "te": return "అనిపిస్తోంది: ";
      case "mr": return "वाटत आहे: ";
      case "as": return "অনুভৱ হৈছে: ";
      default: return "Feeling: ";
    }
  };

  const getSosMessage = () => {
    switch (language) {
      case "hi": return "🚨 आपातकालीन सूचना भेजी गई! प्रिया और रवि से संपर्क किया जा रहा है...";
      case "ta": return "🚨 அவசர அலார்ட் அனுப்பப்பட்டது! பிரியா & ரவியை தொடர்பு கொள்கிறது...";
      case "bn": return "🚨 জরুরি বার্তা পাঠানো হয়েছে! প্রিয়া ও রবির সাথে যোগাযোগ করা হচ্ছে...";
      case "te": return "🚨 అత్యవసర అలర్ట్ పంపబడింది! ప్రియ & రవిని సంప్రదిస్తోంది...";
      case "mr": return "🚨 आपत्कालीन इशारा पाठवला गेला! प्रिया आणि रवीशी संपर्क साधत आहे...";
      case "as": return "🚨 জৰুৰীকালীন জাননী প্ৰেৰণ কৰা হৈছে! প্ৰিয়া আৰু ৰবিৰ সৈতে যোগাযোগ কৰা হৈছে...";
      default: return "🚨 SOS Alert Sent! Contacting Priya & Ravi...";
    }
  };

  const toggleVoiceGuide = () => {
    playTapSound();
    const nextVal = !voiceOn;
    setVoiceOn(nextVal);
    if (nextVal) {
      const enTxt = "Voice guide is active.";
      const txt = language === "hi" ? "आवाज सहायक सक्रिय है।" : 
                  language === "ta" ? "குரல் வழிகாட்டி செயலில் உள்ளது." : 
                  language === "bn" ? "কন্ঠ নির্দেশিকা সক্রিয় আছে।" : enTxt;
      speak(enTxt, txt);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, minHeight: "100%" }}>
      {/* Top Greeting Block & SOS button */}
      <div style={{ position: "relative" }}>
        <div className="phdt-rise" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ maxWidth: 210 }}>
            <div style={{ fontSize: 13, color: "var(--color-text-muted)", fontWeight: 700 }}>
              {today}
            </div>
            <h1 className="phdt-display" style={{ fontSize: 24, fontWeight: 800, color: "var(--color-text-dark)", marginTop: 6, lineHeight: 1.25 }}>
              {t.namaste || "Vanakkam"}, {name}
            </h1>
          </div>
          <div style={{ animation: "phdt-bob 4s ease-in-out infinite", flexShrink: 0 }}>
            <ElderlyAvatar size={74} />
          </div>
        </div>

        <div style={{ position: "absolute", left: -26, bottom: -60, opacity: 0.8, pointerEvents: "none", zIndex: 1 }}>
          <LeavesDecor width={110} height={80} />
        </div>
      </div>

      {/* SOS trigger button */}
      <div className="phdt-rise" style={{ display: "flex", justifyContent: "flex-end", marginTop: 4, zIndex: 2 }}>
        <button
          onClick={triggerSosAlarm}
          className="pulse-listening"
          style={{
            border: "none",
            background: "var(--color-danger)",
            color: "white",
            padding: "8px 16px",
            borderRadius: 14,
            fontSize: 12,
            fontWeight: 800,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 5,
            boxShadow: "0 4px 14px rgba(228, 87, 75, 0.4)"
          }}
        >
          <AlertOctagon size={14} />
          <span>SOS</span>
        </button>
      </div>

      {/* SOS Alert Banner */}
      {sosSent && (
        <div style={{
          background: "var(--color-danger-light)",
          color: "var(--color-danger)",
          padding: "12px 16px",
          borderRadius: 16,
          border: "1px solid rgba(228, 87, 75, 0.2)",
          fontSize: 12.5,
          fontWeight: 700,
          textAlign: "center",
          animation: "matchPulse 1.5s infinite",
          zIndex: 3
        }}>
          {getSosMessage()}
        </div>
      )}

      {/* Interactive Mood Tracker */}
      <div className="mood-container phdt-rise" style={{ animationDelay: "0.08s", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 12 }}>
          <Heart size={15} color="var(--color-terracotta)" fill="var(--color-terracotta)" />
          <div className="mood-title" style={{ margin: 0, fontSize: 14 }}>{t.howFeeling}</div>
        </div>
        <div className="mood-options">
          {activeMoodList.map((m) => (
            <button
              key={m.label}
              className={`mood-btn ${mood === m.emoji ? "selected" : ""}`}
              onClick={() => handleMoodSelect(m)}
              aria-label={m.label}
              title={m.label}
            >
              {m.emoji}
            </button>
          ))}
        </div>
        {mood && (
          <div style={{ 
            textAlign: "center", 
            fontSize: 12.5, 
            color: "var(--color-teal-medium)", 
            marginTop: 10,
            fontWeight: 700
          }}>
            {getFeelingText()}
            {activeMoodList.find(m => m.emoji === mood)?.label}
          </div>
        )}
      </div>

      {/* Voice guide card */}
      <div className="phdt-rise" style={{
        background: "var(--color-card-bg)",
        borderRadius: 20,
        padding: "12px 14px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        boxShadow: "var(--shadow-sm)",
        animationDelay: "0.14s",
        zIndex: 2
      }}>
        <div style={{
          width: 38,
          height: 38,
          borderRadius: 12,
          background: "var(--color-teal)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        }}>
          <Mic size={18} color="white" />
        </div>
        <div style={{ flex: 1 }}>
          <div className="phdt-display" style={{ fontSize: 13.5, fontWeight: 700, color: "var(--color-text-dark)" }}>
            {t.voiceGuide || "Voice Guide"}
          </div>
          <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 2 }}>
            {language === "hi" ? "निर्देश सुनने के लिए टैप करें" : "Tap for voice guidance support"}
          </div>
        </div>
        {voiceOn && <WaveformBars />}
        <button
          onClick={toggleVoiceGuide}
          style={{
            border: "none",
            cursor: "pointer",
            borderRadius: 999,
            padding: "6px 12px",
            fontSize: 11,
            fontWeight: 800,
            background: voiceOn ? "var(--color-teal)" : "#E4E1D6",
            color: voiceOn ? "white" : "var(--color-text-muted)",
            transition: "all 0.2s"
          }}
        >
          {voiceOn ? "On" : "Off"}
        </button>
      </div>

      {/* Feature grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, zIndex: 2 }}>
        <FeatureCard
          Illustration={() => <GameControllerIllustration />}
          iconBg="var(--color-teal-medium)"
          label={language === "hi" ? "संज्ञानात्मक खेल" : language === "ta" ? "அறிவுசார் விளையாட்டு" : t.playGame}
          sub={language === "hi" ? "दिमागी कसरत और खेल" : language === "ta" ? "நினைவாற்றல் பயிற்சிகள்" : t.gameSub}
          bg="var(--color-teal-light)"
          delay={0.2}
          onClick={() => go("game")}
        />
        <FeatureCard
          Illustration={() => <Bell size={20} color="white" />}
          iconBg="var(--color-terracotta)"
          label={t.todaysReminders}
          sub={completedCount === totalCount ? t.allDone : `${completedCount}/${totalCount} ${t.remindersSub}`}
          bg="var(--color-terracotta-light)"
          delay={0.26}
          badge={totalCount - completedCount}
          onClick={() => go("reminders")}
        />
        <FeatureCard
          Illustration={() => <FamilyIllustration />}
          iconBg="var(--color-gold)"
          label={t.familyPhotos}
          sub={t.familySub}
          bg="var(--color-gold-light)"
          delay={0.32}
          onClick={() => go("family")}
        />
        <FeatureCard
          Illustration={() => <LeafBreatheIllustration />}
          iconBg="var(--color-success)"
          label={t.deepBreathing}
          sub={t.deepBreathingSub}
          bg="var(--color-success-light)"
          delay={0.38}
          onClick={() => go("breathing")}
        />
      </div>

      {/* Daily tip */}
      <div className="phdt-rise" style={{
        borderRadius: 22,
        background: "var(--color-gold-light)",
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        boxShadow: "var(--shadow-sm)",
        animationDelay: "0.46s",
        zIndex: 2
      }}>
        <div style={{ flex: 1 }}>
          <div className="phdt-display" style={{ fontSize: 14, fontWeight: 800, color: "#7A5A16", display: "flex", alignItems: "center", gap: 6 }}>
            💡 {t.dailyTip || "Daily Tip"}
          </div>
          <div style={{ fontSize: 12, color: "#6B5424", marginTop: 6, lineHeight: 1.5 }}>
            {dailyTip[language] || dailyTip["en"]}
          </div>
        </div>
        <GardenIllustration width={74} height={50} />
      </div>

    </div>
  );
}
