import React, { useEffect } from "react";

const TIME_GREETINGS = {
  en: { morning: "Good morning", afternoon: "Good afternoon", evening: "Good evening" },
  hi: { morning: "शुभ प्रभात", afternoon: "नमस्ते", evening: "शुभ संध्या" },
  ta: { morning: "காலை வணக்கம்", afternoon: "மதிய வணக்கம்", evening: "மாலை வணக்கம்" },
  bn: { morning: "শুভ সকাল", afternoon: "শুভ দুপুর", evening: "শুভ সন্ধ্যা" },
  te: { morning: "శుభోదయం", afternoon: "నమస్కారం", evening: "శుభ సాయంత్రం" },
  mr: { morning: "शुभ सकाळ", afternoon: "नमस्कार", evening: "शुभ संध्याकाळ" },
  kn: { morning: "ಶುಭೋದಯ", afternoon: "ನಮಸ್ಕಾರ", evening: "ಶುಭ ಸಾಯಂಕಾಲ" },
  gu: { morning: "શુભ સવાર", afternoon: "નમસ્તે", evening: "શુભ સાંજ" },
  ml: { morning: "സുപ്രഭാതം", afternoon: "നമസ്കാരം", evening: "ശുഭ സായാഹ്നം" },
  pa: { morning: "ਸ਼ੁਭ ਸਵੇਰ", afternoon: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ", evening: "ਸ਼ੁਭ ਸ਼ਾਮ" },
  as: { morning: "সুপ্ৰভাত", afternoon: "নমস্কাৰ", evening: "শুভ সন্ধ্যা" },
  ur: { morning: "صبح بخیر", afternoon: "السلام علیکم", evening: "شام بخیر" },
  sa: { morning: "सुप्रभातम", afternoon: "नमो नमः", evening: "शुभ सन्ध्या" },
  br: { morning: "फुंबिलिनि गोजोननाय", afternoon: "खुरुमबाय", evening: "बेलाসেनि गोजोननाय" },
  doi: { morning: "सुप्रभात", afternoon: "नमस्ते", evening: "शुभ संध्या" },
  ks: { morning: "सुप्रभात", afternoon: "नमस्कार", evening: "शुभ संध्या" },
  kok: { morning: "देव बरें सकाळ", afternoon: "नमस्कार", evening: "देव बरी सांज" },
  mai: { morning: "शुभ प्रभात", afternoon: "नमस्ते", evening: "शुभ संध्या" },
  mni: { morning: "আয়ুক্কী খুরুমজরি", afternoon: "খুরুমজরি", evening: "নুমিদাংগী খুরুমজরি" },
  ne: { morning: "शुभ प्रभात", afternoon: "नमस्ते", evening: "शुभ संध्या" },
  or: { morning: "ସୁପ୍ରଭାତ", afternoon: "ନମସ୍କାର", evening: "ଶୁଭ ସନ୍ଧ୍ୟା" },
  sat: { morning: "সগুন সেতাঃ", afternoon: "জহার", evening: "সগুন আয়ুপ" },
  sd: { morning: "सुप्रभात", afternoon: "सलाम", evening: "शुभ संध्या" }
};

export const getGreetingSubtext = (lang) => {
  switch(lang) {
    case "hi": return "हमेशा आपके साथ, आज भी और कल भी";
    case "ta": return "உங்களுக்காக எப்போதும், இன்றும் என்றும்";
    case "bn": return "আপনার পাশে আছি, আজ ও সবসময়";
    case "te": return "మీ కోసం ఎల్లప్పుడూ, నేడు మరియు ఎప్పటికీ";
    case "mr": return "तुमच्या पाठीशी नेहमी, आज आणि सदैव";
    case "as": return "আপোনাৰ বাবে সদায়, আজিও আৰু চিৰদিন";
    case "kn": return "ನಿಮಗಾಗಿ ಯಾವಾಗಲೂ, ಇಂದು ಮತ್ತು ಎಂದೆಂದಿಗೂ";
    case "gu": return "હંમેશા આપની સાથે, આજે અને સદા માટે";
    case "ml": return "നിങ്ങൾക്കായി എപ്പോഴും, ഇന്നും എന്നേക്കും";
    case "pa": return "ਹਮੇਸ਼ਾ ਤੁਹਾਡੇ ਨਾਲ, ਅੱਜ ਵੀ ਅਤੇ ਸਦਾ ਵੀ";
    case "ur": return "ہمیشہ آپ کے ساتھ، آج اور ہمیشہ";
    default: return "Here for you, today and always";
  }
};

export default function SplashGreeting({ name, onDone, speak, language }) {
  useEffect(() => {
    const hrs = new Date().getHours();
    const period = hrs < 12 ? "morning" : hrs < 17 ? "afternoon" : "evening";
    const enGreetingText = TIME_GREETINGS["en"];
    const enTextToSpeak = `${enGreetingText[period]}, ${name}`;
    const greetings = TIME_GREETINGS[language] || TIME_GREETINGS["en"];
    const textToSpeak = `${greetings[period]}, ${name}`;
    
    // Speak the greeting
    speak(enTextToSpeak, textToSpeak);

    // Let the animation play fully
    const timer = setTimeout(onDone, 3800);
    return () => clearTimeout(timer);
  }, [language, name]);

  const hrs = new Date().getHours();
  const period = hrs < 12 ? "morning" : hrs < 17 ? "afternoon" : "evening";
  const greetingText = TIME_GREETINGS[language] || TIME_GREETINGS["en"];

  // 7 floating particles
  const particles = [
    { left: "18%", size: "6px", delay: "0.6s" },
    { left: "32%", size: "4px", delay: "2.1s" },
    { left: "70%", size: "5px", delay: "1.2s" },
    { left: "82%", size: "7px", delay: "3.0s" },
    { left: "55%", size: "4px", delay: "3.8s" },
    { left: "12%", size: "5px", delay: "4.6s" },
    { left: "64%", size: "6px", delay: "5.4s" },
  ];

  return (
    <div className="splash-screen-overlay">
      <style>{`
        .splash-screen-overlay {
          position: absolute;
          inset: 0;
          z-index: 200;
          background: radial-gradient(circle at 50% 38%, #F3EFE1 0%, #FBF8F1 55%, #F1EEE3 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-radius: 24px;
          animation: fadeOutSplash 0.6s ease 3.2s forwards;
        }

        @keyframes fadeOutSplash {
          0% { opacity: 1; }
          100% { opacity: 0; visibility: hidden; }
        }

        /* Ambient floating particles */
        .splash-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        
        .splash-particle {
          position: absolute;
          bottom: -10px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(232,135,30,0.55), rgba(232,135,30,0));
          opacity: 0;
          animation: splashFloatUp 7s ease-in infinite;
        }

        @keyframes splashFloatUp {
          0%   { transform: translateY(0) scale(0.6); opacity: 0; }
          12%  { opacity: 0.7; }
          85%  { opacity: 0.25; }
          100% { transform: translateY(-620px) scale(1); opacity: 0; }
        }

        /* Bloom/logo animation */
        .splash-bloom-wrap {
          position: relative;
          width: 190px;
          height: 190px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          animation: splashEmerge 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.25s forwards;
        }

        @keyframes splashEmerge {
          0%   { opacity: 0; transform: scale(0.55); }
          100% { opacity: 1; transform: scale(1); }
        }

        .splash-breathe {
          animation: splashBreathe 4.2s ease-in-out 1.5s infinite;
          transform-origin: center;
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @keyframes splashBreathe {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.055); }
        }

        .splash-halo {
          position: absolute;
          width: 190px;
          height: 190px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(143,191,160,0.45) 0%, rgba(143,191,160,0) 70%);
          animation: splashHaloPulse 4.2s ease-in-out 1.5s infinite;
        }

        @keyframes splashHaloPulse {
          0%, 100% { opacity: 0.55; transform: scale(0.92); }
          50%      { opacity: 0.95; transform: scale(1.08); }
        }

        .splash-petal {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 46px;
          height: 84px;
          margin: -42px 0 0 -23px;
          border-radius: 50% 50% 50% 50%/60% 60% 40% 40%;
          transform-origin: 50% 100%;
          opacity: 0;
          animation: splashPetalBloom 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes splashPetalBloom {
          0%   { opacity: 0; transform: rotate(var(--rot)) translateY(6px) scale(0.35); }
          100% { opacity: 1; transform: rotate(var(--rot)) translateY(0) scale(1); }
        }

        .petal-container .splash-petal:nth-child(1) { --rot: 0deg;   background: linear-gradient(180deg, #0B5D6B, #07414C); animation-delay: 0.45s; }
        .petal-container .splash-petal:nth-child(2) { --rot: 60deg;  background: linear-gradient(180deg, #12707F, #0B5D6B); animation-delay: 0.55s; }
        .petal-container .splash-petal:nth-child(3) { --rot: 120deg; background: linear-gradient(180deg, #8FBFA0, #6FA383); animation-delay: 0.65s; }
        .petal-container .splash-petal:nth-child(4) { --rot: 180deg; background: linear-gradient(180deg, #0B5D6B, #07414C); animation-delay: 0.75s; }
        .petal-container .splash-petal:nth-child(5) { --rot: 240deg; background: linear-gradient(180deg, #12707F, #0B5D6B); animation-delay: 0.85s; }
        .petal-container .splash-petal:nth-child(6) { --rot: 300deg; background: linear-gradient(180deg, #8FBFA0, #6FA383); animation-delay: 0.95s; }

        .splash-center-dot {
          position: absolute;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 30%, #FBE9CE, #E8871E 70%);
          box-shadow: 0 0 22px rgba(232,135,30,0.55);
          opacity: 0;
          animation: splashDotAppear 0.6s ease 1.15s forwards;
          z-index: 2;
        }

        @keyframes splashDotAppear {
          0%   { opacity: 0; transform: scale(0.3); }
          100% { opacity: 1; transform: scale(1); }
        }

        .splash-wordmark {
          margin-top: 26px;
          font-family: Cambria, Georgia, serif;
          font-size: 34px;
          font-weight: 700;
          letter-spacing: 0.5px;
          color: #07414C;
          opacity: 0;
          transform: translateY(10px);
          animation: splashRiseIn 0.8s ease 1.7s forwards;
        }

        .splash-tagline {
          margin-top: 8px;
          font-size: 14.5px;
          color: #6B7E82;
          letter-spacing: 0.2px;
          opacity: 0;
          transform: translateY(8px);
          animation: splashRiseIn 0.8s ease 2.15s forwards;
          padding: 0 20px;
          font-weight: 600;
        }

        @keyframes splashRiseIn {
          to { opacity: 1; transform: translateY(0); }
        }

        .splash-breath-hint {
          position: absolute;
          bottom: 46px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11.5px;
          color: #6B7E82;
          opacity: 0;
          animation: splashRiseIn 1s ease 2.7s forwards;
        }

        .splash-breath-hint .splash-ring {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #8FBFA0;
          animation: splashRingPulse 2s ease-in-out infinite;
        }

        @keyframes splashRingPulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50%      { transform: scale(1.6); opacity: 1; }
        }
      `}</style>

      {/* Floating particles */}
      <div className="splash-particles">
        {particles.map((p, i) => (
          <div
            key={i}
            className="splash-particle"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animationDelay: p.delay
            }}
          />
        ))}
      </div>

      {/* Blooming flower logo */}
      <div className="splash-bloom-wrap">
        <div className="splash-halo" />
        <div className="splash-breathe">
          <div className="petal-container" style={{ position: "absolute", width: "100%", height: "100%" }}>
            <div className="splash-petal" />
            <div className="splash-petal" />
            <div className="splash-petal" />
            <div className="splash-petal" />
            <div className="splash-petal" />
            <div className="splash-petal" />
          </div>
          <div className="splash-center-dot" />
        </div>
      </div>

      {/* Wordmark */}
      <div className="splash-wordmark">Memro</div>
      
      {/* Tagline showing localized greeting */}
      <div className="splash-tagline">
        {greetingText[period]}, {name}. {getGreetingSubtext(language)}
      </div>

      {/* Soft breathing hint text */}
      <div className="splash-breath-hint">
        <span className="splash-ring" /> gently breathing, always here
      </div>
    </div>
  );
}
