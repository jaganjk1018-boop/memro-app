import React, { useEffect } from "react";
import { Pill, Check, X, HeartHandshake } from "lucide-react";
import { playReminderAlertSound, playTapSound } from "../utils/audio";

const translations = {
  en: {
    message: "Your caregiver has marked your medicine as given. Did you receive and take your medicine?",
    yes: "YES, I RECEIVED IT",
    no: "NO, I DID NOT RECEIVE IT",
    title: "Medicine Check",
  },
  hi: {
    message: "आपके देखभाल करने वाले ने आपकी दवा को दिया हुआ चिह्नित किया है। क्या आपको आपकी दवा मिली और आपने इसे लिया?",
    yes: "हाँ, मुझे यह मिल गया",
    no: "नहीं, मुझे यह नहीं मिला",
    title: "दवा की जाँच",
  },
  ta: {
    message: "உங்கள் பராமரிப்பாளர் உங்கள் மருந்தை வழங்கியதாகக் குறிப்பிட்டுள்ளார். உங்கள் மருந்தை நீங்கள் பெற்றுக்கொண்டீர்களா?",
    yes: "ஆம், நான் பெற்றுக்கொண்டேன்",
    no: "இல்லை, எனக்கு கிடைக்கவில்லை",
    title: "மருந்து சரிபார்ப்பு",
  },
  bn: {
    message: "আপনার কেয়ারগিভার আপনার ওষুধ দেওয়া হয়েছে বলে চিহ্নিত করেছেন। আপনি কি আপনার ওষুধ পেয়েছেন এবং খেয়েছেন?",
    yes: "হ্যাঁ, আমি পেয়েছি",
    no: "না, আমি পাইনি",
    title: "ওষুধ পরীক্ষা",
  },
  te: {
    message: "మీ సంరక్షకుడు మీ ఔషధాన్ని ఇచ్చినట్లు గుర్తించారు. మీరు మీ ఔషధాన్ని అందుకుని తీసుకున్నారా?",
    yes: "అవును, నేను అందుకున్నాను",
    no: "లేదు, నేను అందుకోలేదు",
    title: "ఔషధ తనిఖీ",
  },
  mr: {
    message: "तुमच्या केअरगिव्हरने तुमचे औषध दिले असल्याचे चिन्हांकित केले आहे. तुम्हाला तुमचे औषध मिळाले आणि तुम्ही ते घेतले का?",
    yes: "होय, मला ते मिळाले",
    no: "नाही, मला ते मिळाले नाही",
    title: "औषध तपासणी",
  },
  gu: {
    message: "તમારા કેરગિવરે તમારી દવા અપાઈ ગઈ હોવાનું ચિહ્નિત કર્યું છે. શું તમને તમારી દવા મળી અને તમે તે લીધી?",
    yes: "હા, મને તે મળી ગઈ",
    no: "ના, મને નથી મળી",
    title: "દવા ચકાસણી",
  },
  kn: {
    message: "ನಿಮ್ಮ ಆರೈಕೆದಾರರು ನಿಮ್ಮ ಔಷಧಿಯನ್ನು ನೀಡಲಾಗಿದೆ ಎಂದು ಗುರುತಿಸಿದ್ದಾರೆ. ನಿಮ್ಮ ಔಷಧಿಯನ್ನು ನೀವು ಪಡೆದುಕೊಂಡು ತೆಗೆದುಕೊಂಡಿದ್ದೀರಾ?",
    yes: "ಹೌದು, ನಾನು ಪಡೆದುಕೊಂಡೆ",
    no: "ಇಲ್ಲ, ನನಗೆ ಸಿಗಲಿಲ್ಲ",
    title: "ಔಷಧಿ ಪರಿಶೀಲನೆ",
  },
  ml: {
    message: "നിങ്ങളുടെ പരിചാരകൻ നിങ്ങളുടെ മരുന്ന് നൽകിയതായി അടയാളപ്പെടുത്തിയിരിക്കുന്നു. നിങ്ങൾക്ക് മരുന്ന് ലഭിക്കുകയും കഴിക്കുകയും ചെയ്തോ?",
    yes: "അതെ, എനിക്ക് ലഭിച്ചു",
    no: "ഇല്ല, എനിക്ക് ലഭിച്ചില്ല",
    title: "മരുന്ന് പരിശോധന",
  }
};

const LANGUAGE_FALLBACKS = {
  karbi: "as", mising: "as", nyishi: "hi", adi: "hi", apatani: "hi", monpa: "hi", galo: "hi",
  tangkhul: "mni", thadou: "mni", paite: "mni", hmar: "mni", khasi: "en",
  garo: "en", jaintia: "en", mizo: "en", lai: "en", mara: "en", nagamese: "as",
  ao: "en", angami: "en", sumi: "en", lotha: "en", konyak: "en", kokborok: "bn",
  sikkimese: "ne", lepcha: "ne"
};

function getLangCode(lang) {
  return LANGUAGE_FALLBACKS[lang] || lang || "en";
}

export default function MedicineVerificationModal({ reminder, onVerify, onDeny, speak, language = "en" }) {
  const resolvedLang = getLangCode(language);
  const t = translations[resolvedLang] || translations["en"];

  // Play alert sound and speak question when opened
  useEffect(() => {
    // Play sound immediately
    playReminderAlertSound();
    
    // Announce verification message
    const speechText = t.message;
    speak(speechText, speechText);
  }, [reminder, language]);

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <style>{`
        .elderly-btn-yes {
          background: #2e7d32;
          color: white;
          border: 3px solid #1b5e20;
          box-shadow: 0 6px 16px rgba(46,125,50,0.3);
          transition: transform 0.1s ease, background-color 0.2s;
        }
        .elderly-btn-yes:active {
          transform: scale(0.96);
          background: #1b5e20;
        }
        .elderly-btn-no {
          background: #d32f2f;
          color: white;
          border: 3px solid #c62828;
          box-shadow: 0 6px 16px rgba(211,47,47,0.3);
          transition: transform 0.1s ease, background-color 0.2s;
        }
        .elderly-btn-no:active {
          transform: scale(0.96);
          background: #c62828;
        }
        .icon-bounce {
          animation: icon-bounce 1.5s infinite alternate ease-in-out;
        }
        @keyframes icon-bounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(-8px); }
        }
      `}</style>
      
      <div 
        className="modal-content" 
        style={{ 
          padding: "28px 24px", 
          maxWidth: 380, 
          textAlign: "center", 
          borderRadius: 28,
          background: "#FFFFFF",
          border: "4px solid #0B5D6B", // high contrast teal border
          boxShadow: "0 12px 30px rgba(11,93,107,0.25)"
        }}
      >
        {/* Simple Caregiver/Medicine Icon */}
        <div style={{ 
          width: 80, 
          height: 80, 
          borderRadius: "50%", 
          background: "#EAF5F5", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          margin: "0 auto 18px" 
        }}>
          <div className="icon-bounce">
            <HeartHandshake size={44} color="#0B5D6B" />
          </div>
        </div>

        {/* Title */}
        <h2 style={{ 
          fontSize: 22, 
          fontWeight: 900, 
          color: "#1B2B2E", 
          marginBottom: 12,
          letterSpacing: "-0.5px"
        }}>
          {t.title}
        </h2>

        {/* Medicine Name Badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "#FCEFDC",
          padding: "8px 16px",
          borderRadius: 12,
          border: "1px solid #E8871E",
          fontSize: 15,
          fontWeight: 800,
          color: "#E8871E",
          marginBottom: 20
        }}>
          <Pill size={16} fill="#E8871E" />
          <span>{reminder.text}</span>
        </div>

        {/* Big accessible message for dementia patients */}
        <p style={{ 
          fontSize: 18, 
          fontWeight: 700, 
          color: "#1B2B2E", 
          marginBottom: 28, 
          lineHeight: 1.5,
          padding: "0 4px"
        }}>
          {t.message}
        </p>

        {/* Large, Easy-to-Understand verification buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* YES, I RECEIVED IT */}
          <button
            className="elderly-btn-yes"
            onClick={() => { playTapSound(); onVerify(); }}
            style={{
              width: "100%",
              padding: "18px 12px",
              borderRadius: 20,
              fontSize: 17,
              fontWeight: 900,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10
            }}
          >
            <Check size={22} strokeWidth={3} />
            <span>{t.yes}</span>
          </button>

          {/* NO, I DID NOT RECEIVE IT */}
          <button
            className="elderly-btn-no"
            onClick={() => { playTapSound(); onDeny(); }}
            style={{
              width: "100%",
              padding: "18px 12px",
              borderRadius: 20,
              fontSize: 17,
              fontWeight: 900,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10
            }}
          >
            <X size={22} strokeWidth={3} />
            <span>{t.no}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
