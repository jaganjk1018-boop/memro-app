import React, { useState, useEffect, useRef } from "react";
import { AlertTriangle, PhoneCall, X } from "lucide-react";
import { playTapSound, playMatchSound } from "../utils/audio";

const SOS_TEXTS = {
  en: {
    title: "Emergency SOS",
    question: "Would you like to call your daughter Priya immediately?",
    calling: "Calling Priya...",
    connecting: "Connecting with your emergency contact",
    cancel: "Cancel",
    call: "Call",
    endCall: "End Call",
    speakConfirm: "Calling Priya now.",
    speakIntro: "Emergency SOS. Would you like to call Priya?"
  },
  hi: {
    title: "आपातकालीन एसओएस",
    question: "क्या आप अपनी बेटी प्रिया को तुरंत फोन करना चाहती हैं?",
    calling: "प्रिया को फोन किया जा रहा है...",
    connecting: "आपके आपातकालीन संपर्क से जोड़ा जा रहा है...",
    cancel: "रद्द करें",
    call: "कॉल करें",
    endCall: "कॉल समाप्त करें",
    speakConfirm: "प्रिया को फोन मिलाया जा रहा है।",
    speakIntro: "आपातकालीन एसओएस। क्या आप प्रिया को फोन करना चाहती हैं?"
  },
  ta: {
    title: "அவசர அலர்ட்",
    question: "உங்கள் மகள் பிரியாவை உடனே அழைக்க விரும்புகிறீர்களா?",
    calling: "பிரியாவை அழைக்கிறது...",
    connecting: "உங்கள் அவசர தொடர்பை இணைக்கிறது...",
    cancel: "ரத்து செய்",
    call: "அழைக்கவும்",
    endCall: "அழைப்பை முடி",
    speakConfirm: "பிரியாவை இப்போது அழைக்கிறது.",
    speakIntro: "அவசர அலர்ட். பிரியாவை அழைக்க விரும்புகிறீர்களா?"
  },
  bn: {
    title: "জরুরি এসওএস",
    question: "আপনি কি আপনার মেয়ে প্রিয়াকে এখনই ফোন করতে চান?",
    calling: "প্রিয়াকে ফোন করা হচ্ছে...",
    connecting: "আপনার জরুরি যোগাযোগের সাথে যুক্ত করা হচ্ছে...",
    cancel: "বাতিল করুন",
    call: "ফোন করুন",
    endCall: "ফোন কাটুন",
    speakConfirm: "প্রিয়াকে এখনই ফোন করা হচ্ছে।",
    speakIntro: "জরুরি এসওএস। আপনি কি প্রিয়াকে ফোন করতে চান?"
  },
  te: {
    title: "అత్యవసర ఎస్ఓఎస్",
    question: "మీ కుమార్తె ప్రియకు వెంటనే కాల్ చేయాలనుకుంటున్నారా?",
    calling: "ప్రియకు కాల్ చేస్తోంది...",
    connecting: "మీ అత్యవసర సంప్రదింపులను కనెక్ట్ చేస్తోంది...",
    cancel: "రద్దు చేయి",
    call: "కాల్ చేయి",
    endCall: "కాల్ ముగించు",
    speakConfirm: "ప్రియకు కాల్ వెళుతోంది.",
    speakIntro: "అత్యవసర ఎస్ఓఎస్. ప్రియకు కాల్ చేయాలనుకుంటున్నారా?"
  },
  mr: {
    title: "आपत्कालीन एसओएस",
    question: "तुम्ही तुमची मुलगी प्रिया हिला त्वरित फोन करू इच्छिता का?",
    calling: "प्रियाला फोन लावत आहे...",
    connecting: "आपत्कालीन संपर्काशी जोडत आहे...",
    cancel: "रद्द करा",
    call: "फोन करा",
    endCall: "फोन बंद करा",
    speakConfirm: "प्रियाला आता फोन लावत आहे.",
    speakIntro: "आपत्कालीन एसओएस. तुम्ही प्रियाला फोन करू इच्छिता?"
  },
  as: {
    title: "জৰুৰীকালীন এছঅ’এছ",
    question: "আপুনি আপোনাৰ জীয়াৰী প্ৰিয়াক লগে লগে ফোন কৰিব বিচাৰে নেকি?",
    calling: "প্ৰিয়াক ফোন কৰা হৈছে...",
    connecting: "আপোনাৰ জৰুৰীকালীন নম্বৰৰ সৈতে সংযোগ কৰা হৈছে...",
    cancel: "বাতিল কৰক",
    call: "ফোন কৰক",
    endCall: "ফোন কাটি দিয়ক",
    speakConfirm: "প্ৰিয়াক ফোন কৰা হৈছে।",
    speakIntro: "জৰুৰী এছঅ’এছ। প্ৰিয়াক ফোন কৰিব বিচাৰেনে?"
  }
};

export default function SOSModal({ onClose, speak, language }) {
  const [calling, setCalling] = useState(false);
  const timer = useRef(null);
  const sirenInterval = useRef(null);
  
  const text = SOS_TEXTS[language] || SOS_TEXTS["en"];

  // Announce SOS prompt when opened
  useEffect(() => {
    speak(SOS_TEXTS["en"].speakIntro, text.speakIntro);
    return () => {
      clearTimeout(timer.current);
      clearInterval(sirenInterval.current);
    };
  }, []);

  const handleCall = () => {
    playTapSound();
    setCalling(true);
    speak(SOS_TEXTS["en"].speakConfirm, text.speakConfirm);

    // Play a gentle alert sweep/siren simulation in background to alert caregiver
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      
      let count = 0;
      sirenInterval.current = setInterval(() => {
        if (count >= 4) {
          clearInterval(sirenInterval.current);
          return;
        }
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(550, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        
        osc.frequency.linearRampToValueAtTime(750, ctx.currentTime + 0.4);
        osc.frequency.linearRampToValueAtTime(550, ctx.currentTime + 0.8);
        
        setTimeout(() => {
          osc.stop();
        }, 800);
        count++;
      }, 1000);

      // Close context when call ends
      timer.current = setTimeout(() => {
        ctx.close();
        onClose();
      }, 4000);

    } catch (e) {
      // Audio support fallback
      timer.current = setTimeout(onClose, 4000);
    }
  };

  const handleCancel = () => {
    playTapSound();
    onClose();
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1000 }}>
      <div className="modal-content" style={{ padding: 24, maxWidth: 360, textAlign: "center", borderRadius: 24 }}>
        {!calling ? (
          <>
            <div style={{ width: 68, height: 68, borderRadius: "50%", background: "var(--color-danger-light)", display: "flex", alignItems: "center", justify: "center", margin: "0 auto 16px" }}>
              <AlertTriangle size={36} color="var(--color-danger)" />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--color-text-dark)", marginBottom: 8 }}>
              {text.title}
            </h3>
            <p style={{ fontSize: 14, color: "var(--color-text-muted)", marginBottom: 24, lineHeight: 1.5 }}>
              {text.question}
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={handleCancel}
                style={{
                  flex: 1,
                  padding: "14px",
                  borderRadius: 16,
                  border: "2px solid var(--color-teal-soft)",
                  background: "white",
                  color: "var(--color-teal)",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                {text.cancel}
              </button>
              <button
                onClick={handleCall}
                style={{
                  flex: 1,
                  padding: "14px",
                  borderRadius: 16,
                  border: "none",
                  background: "var(--color-danger)",
                  color: "white",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8
                }}
              >
                <PhoneCall size={16} />
                <span>{text.call}</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="pulse-listening" style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "var(--color-danger)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              color: "white"
            }}>
              <PhoneCall size={36} />
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: "var(--color-text-dark)", marginBottom: 6 }}>
              {text.calling}
            </h3>
            <p style={{ fontSize: 13, color: "var(--color-text-muted)", marginBottom: 24 }}>
              {text.connecting}
            </p>
            <button
              onClick={handleCancel}
              style={{
                padding: "12px 28px",
                borderRadius: 14,
                border: "none",
                background: "#e5e7eb",
                color: "var(--color-text-dark)",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {text.endCall}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
