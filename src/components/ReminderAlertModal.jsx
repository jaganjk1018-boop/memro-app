import React, { useEffect, useRef } from "react";
import { Bell, Check, Clock, X, Volume2 } from "lucide-react";
import { playReminderAlertSound, playTapSound } from "../utils/audio";

const alertTranslations = {
  en: {
    title: "Reminder Alert",
    done: "Mark as Done",
    snooze: "Snooze 5 Min",
    dismiss: "Dismiss",
    speakPrefix: "Reminder: "
  },
  hi: {
    title: "स्मरणपत्र अलर्ट",
    done: "पूरा हो गया",
    snooze: "5 मिनट बाद",
    dismiss: "बंद करें",
    speakPrefix: "स्मरणपत्र: "
  },
  ta: {
    title: "நினைவூட்டல்",
    done: "முடித்தேன்",
    snooze: "5 நிமி தள்ளிவை",
    dismiss: "விலக்கு",
    speakPrefix: "நினைவூட்டல்: "
  },
  bn: {
    title: "রিমাইন্ডার",
    done: "সম্পন্ন",
    snooze: "৫ মিনিট পর",
    dismiss: "বাতিল",
    speakPrefix: "রিমাইন্ডার: "
  },
  te: {
    title: "రిమైండర్",
    done: "పూర్తయింది",
    snooze: "5 నిమిషాలు ఆపు",
    dismiss: "మూసివేయి",
    speakPrefix: "రిమైండర్: "
  },
  mr: {
    title: "स्मरणपत्र",
    done: "झाले",
    snooze: "५ मिनिटे नंतर",
    dismiss: "बंद करा",
    speakPrefix: "स्मरणपत्र: "
  },
  gu: {
    title: "રિમાઇન્ડર",
    done: "પૂર્ણ",
    snooze: "५ મિનિટ પછી",
    dismiss: "બંધ કરો",
    speakPrefix: "રિમાઇન્ડર: "
  },
  kn: {
    title: "ನೆನಪೋಲೆ",
    done: "ಮುಗಿದಿದೆ",
    snooze: "5 ನಿಮಿಷ ಮುಂದೂಡಿ",
    dismiss: "ಮುಚ್ಚಿ",
    speakPrefix: "ನೆನಪೋಲೆ: "
  },
  ml: {
    title: "ഓർമ്മപ്പെടുത്തൽ",
    done: "കഴിഞ്ഞു",
    snooze: "5 മിനിറ്റ് മാറ്റിവെക്കുക",
    dismiss: "ഒഴിവാക്കുക",
    speakPrefix: "ഓർമ്മപ്പെടുത്തൽ: "
  }
};

const LANGUAGE_FALLBACKS = {
  karbi: "as", mising: "as", nyishi: "hi", adi: "hi", apatani: "hi", monpa: "hi", galo: "hi",
  tangkhul: "mni", thadou: "mni", paite: "mni", hmar: "mni", khasi: "en", garo: "en",
  jaintia: "en", mizo: "en", lai: "en", mara: "en", nagamese: "as", ao: "en", angami: "en",
  sumi: "en", lotha: "en", konyak: "en", kokborok: "bn", sikkimese: "ne", lepcha: "ne"
};

function getLangCode(lang) {
  return LANGUAGE_FALLBACKS[lang] || lang || "en";
}

export default function ReminderAlertModal({ reminder, onClose, onMarkDone, onSnooze, speak, language = "en" }) {
  const soundIntervalRef = useRef(null);
  const resolvedLang = getLangCode(language);
  const t = alertTranslations[resolvedLang] || alertTranslations["en"];

  // Play sound and voice guidance
  useEffect(() => {
    // 1. Play alert chime immediately
    playReminderAlertSound();

    // 2. Play alert voice synthesis immediately
    const speakText = `${t.speakPrefix} ${reminder.text}`;
    // If language has native voice, it will speak in regional. Fallback to English.
    speak(speakText, speakText);

    // 3. Repeat alarm chime every 4 seconds
    soundIntervalRef.current = setInterval(() => {
      playReminderAlertSound();
    }, 4000);

    return () => {
      if (soundIntervalRef.current) {
        clearInterval(soundIntervalRef.current);
      }
    };
  }, [reminder, language]);

  return (
    <div className="modal-overlay" style={{ zIndex: 1050 }}>
      <style>{`
        @keyframes alert-bell-ring {
          0% { transform: rotate(0); }
          5% { transform: rotate(18deg); }
          10% { transform: rotate(-18deg); }
          15% { transform: rotate(14deg); }
          20% { transform: rotate(-14deg); }
          25% { transform: rotate(10deg); }
          30% { transform: rotate(-10deg); }
          35% { transform: rotate(6deg); }
          40% { transform: rotate(-6deg); }
          45% { transform: rotate(0); }
          100% { transform: rotate(0); }
        }
        .alert-bell-ringing {
          animation: alert-bell-ring 1.8s infinite ease-in-out;
          transform-origin: top center;
        }
        .modal-content-pulse {
          box-shadow: 0 0 0 0 rgba(232, 135, 30, 0.4);
          animation: alert-modal-pulse 2s infinite cubic-bezier(0.66, 0, 0, 1);
        }
        @keyframes alert-modal-pulse {
          to {
            box-shadow: 0 0 0 16px rgba(232, 135, 30, 0);
          }
        }
      `}</style>
      
      <div 
        className="modal-content modal-content-pulse" 
        style={{ 
          padding: 24, 
          maxWidth: 360, 
          textAlign: "center", 
          borderRadius: 24,
          background: "var(--color-bg-warm, #FBF8F1)",
          border: "2px solid var(--color-gold, #E8871E)",
        }}
      >
        {/* Close Button */}
        <button 
          onClick={() => { playTapSound(); onClose(); }}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            border: "none",
            background: "rgba(0,0,0,0.05)",
            borderRadius: "50%",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "var(--color-text-muted, #6B7E82)"
          }}
          aria-label={t.dismiss}
        >
          <X size={18} />
        </button>

        {/* Ringing Bell Icon */}
        <div style={{ 
          width: 72, 
          height: 72, 
          borderRadius: "50%", 
          background: "rgba(232, 135, 30, 0.12)", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          margin: "12px auto 16px" 
        }}>
          <div className="alert-bell-ringing">
            <Bell size={38} color="var(--color-gold, #E8871E)" fill="var(--color-gold, #E8871E)" />
          </div>
        </div>

        {/* Title */}
        <h3 style={{ 
          fontSize: 21, 
          fontWeight: 900, 
          color: "var(--color-text-dark, #1B2B2E)", 
          marginBottom: 6 
        }}>
          {t.title}
        </h3>

        {/* Time Badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "white",
          padding: "6px 14px",
          borderRadius: 99,
          border: "1px solid var(--color-teal-soft, rgba(8, 81, 92, 0.08))",
          fontSize: 14,
          fontWeight: 700,
          color: "var(--color-teal, #0B5D6B)",
          marginBottom: 16
        }}>
          <Clock size={15} />
          <span>{reminder.time}</span>
        </div>

        {/* Reminder Description */}
        <p style={{ 
          fontSize: 17, 
          fontWeight: 700,
          color: "var(--color-text-dark, #1B2B2E)", 
          marginBottom: 24, 
          lineHeight: 1.4,
          padding: "0 10px"
        }}>
          {reminder.text}
        </p>

        {/* Action Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Mark as Done (Main Call to Action) */}
          <button
            onClick={() => { playTapSound(); onMarkDone(); }}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 16,
              border: "none",
              background: "var(--color-success, #2e7d32)",
              color: "white",
              fontSize: 15,
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: "0 4px 12px rgba(46,125,50,0.25)"
            }}
          >
            <Check size={18} strokeWidth={3} />
            <span>{t.done}</span>
          </button>

          {/* Secondary Actions Row */}
          <div style={{ display: "flex", gap: 8 }}>
            {/* Snooze 5 Min */}
            <button
              onClick={() => { playTapSound(); onSnooze(); }}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: 14,
                border: "1.5px solid var(--color-teal-soft, rgba(8, 81, 92, 0.2))",
                background: "white",
                color: "var(--color-teal, #0B5D6B)",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6
              }}
            >
              <Clock size={14} />
              <span>{t.snooze}</span>
            </button>

            {/* Dismiss */}
            <button
              onClick={() => { playTapSound(); onClose(); }}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: 14,
                border: "none",
                background: "rgba(0,0,0,0.06)",
                color: "var(--color-text-dark, #1B2B2E)",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              {t.dismiss}
            </button>
          </div>
        </div>

        {/* Read aloud helper */}
        <button
          onClick={() => speak(`${t.speakPrefix} ${reminder.text}`, `${t.speakPrefix} ${reminder.text}`)}
          style={{
            border: "none",
            background: "none",
            color: "var(--color-teal, #0B5D6B)",
            cursor: "pointer",
            marginTop: 18,
            fontSize: 12,
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            gap: 4
          }}
          aria-label="Repeat text read-aloud"
        >
          <Volume2 size={14} />
          <span>Listen again</span>
        </button>
      </div>
    </div>
  );
}
