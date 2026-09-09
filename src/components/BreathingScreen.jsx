import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Wind, Volume2, VolumeX } from "lucide-react";
import { playTapSound } from "../utils/audio";

export default function BreathingScreen({ back, speak, language }) {
  const [phase, setPhase] = useState("inhale"); // inhale | hold | exhale
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);
  const gainRef = useRef(null);

  const translations = {
    en: {
      title: "Deep Breathing",
      sub: "Breathe slowly to relax your mind",
      inhale: "Inhale...",
      hold: "Hold...",
      exhale: "Exhale...",
      soundOn: "Sound On",
      soundOff: "Muted"
    },
    hi: {
      title: "गहरी सांस लें",
      sub: "मन को शांत करने के लिए धीरे-धीरे सांस लें",
      inhale: "सांस अंदर लें...",
      hold: "सांस रोकें...",
      exhale: "सांस बाहर छोड़ें...",
      soundOn: "आवाज चालू",
      soundOff: "मौन"
    },
    bn: {
      title: "গভীর শ্বাস নিন",
      sub: "মন শান্ত করতে ধীরে ধীরে শ্বাস নিন",
      inhale: "শ্বাস ভেতরে নিন...",
      hold: "শ্বাস ধরে রাখুন...",
      exhale: "শ্বাস বাইরে ছাড়ুন...",
      soundOn: "শব্দ চালু",
      soundOff: "শব্দ বন্ধ"
    },
    ta: {
      title: "ஆழ்ந்த சுவாசம்",
      sub: "மனதை ரிலாக்ஸ் செய்ய மெதுவாக சுவாசிக்கவும்",
      inhale: "மூச்சை உள்ளே இழுக்கவும்...",
      hold: "மூச்சை அடக்கவும்...",
      exhale: "மூச்சை வெளியே விடவும்...",
      soundOn: "ஒலி ஆன்",
      soundOff: "ஒலி ஆஃப்"
    },
    te: {
      title: "దీర్ఘ శ్వాస",
      sub: "మనస్సును ప్రశాంతంగా ఉంచడానికి నెమ్మదిగా శ్వాస తీసుకోండి",
      inhale: "శ్వాస లోపలికి తీసుకోండి...",
      hold: "శ్వాసను ఆపండి...",
      exhale: "శ్వాసను వదలండి...",
      soundOn: "సౌండ్ ఆన్",
      soundOff: "మ్యూట్"
    },
    mr: {
      title: "दीर्घ श्वास घ्या",
      sub: "मन शांत करण्यासाठी हळूहळू श्वास घ्या",
      inhale: "श्वास आत घ्या...",
      hold: "श्वास रोखून धरा...",
      exhale: "श्वास बाहेर सोडा...",
      soundOn: "आवाज चालू",
      soundOff: "म्युट"
    },
    as: {
      title: "দীৰ্ঘ শ্বাস লওক",
      sub: "মন শান্ত কৰিবলৈ লাহে লাহে শ্বাস লওক",
      inhale: "শ্বাস ভিতৰলৈ লওক...",
      hold: "শ্বাস ধৰি ৰাখক...",
      exhale: "শ্বাস এৰি দিয়ক...",
      soundOn: "ধ্বনি অন",
      soundOff: "ধ্বনি অফ"
    }
  };

  const LANGUAGE_FALLBACKS = {
    karbi: "as", mising: "as", nyishi: "hi", adi: "hi", apatani: "hi", monpa: "hi", galo: "hi",
    tangkhul: "mni", thadou: "mni", paite: "mni", hmar: "mni", khasi: "en", garo: "en",
    jaintia: "en", mizo: "en", lai: "en", mara: "en", nagamese: "as", ao: "en", angami: "en",
    sumi: "en", lotha: "en", konyak: "en", kokborok: "bn", sikkimese: "ne", lepcha: "ne"
  };

  const getResolvedLang = () => {
    if (translations[language]) return language;
    const fb = LANGUAGE_FALLBACKS[language];
    if (fb && translations[fb]) return fb;

    const hiFallbacks = ["hi", "br", "doi", "ks", "kok", "mai", "mr", "ne", "pa", "sa", "sd", "ur", "gu", "bn", "as", "or"];
    const taFallbacks = ["ta", "te", "kn", "ml"];

    if (hiFallbacks.includes(language) || hiFallbacks.includes(fb)) return "hi";
    if (taFallbacks.includes(language) || taFallbacks.includes(fb)) return "ta";
    return "en";
  };

  const resolved = getResolvedLang();
  const tr = translations[resolved] || translations["en"];

  // Initialize synthesizer for breathing guidance
  useEffect(() => {
    if (soundEnabled) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(260, ctx.currentTime); // Low soothing pitch
        gain.gain.setValueAtTime(0, ctx.currentTime);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        audioCtxRef.current = ctx;
        oscRef.current = osc;
        gainRef.current = gain;
      } catch (err) {
        console.warn("Web Audio not supported in background", err);
      }
    }

    return () => {
      stopSynthesizer();
    };
  }, [soundEnabled]);

  const stopSynthesizer = () => {
    try {
      if (oscRef.current) oscRef.current.stop();
      if (audioCtxRef.current) audioCtxRef.current.close();
    } catch (e) {}
    oscRef.current = null;
    audioCtxRef.current = null;
  };

  // Phase controller: 4s Inhale, 4s Hold, 4s Exhale
  useEffect(() => {
    let interval;
    const runBreathingCycle = () => {
      // Inhale phase
      setPhase("inhale");
      speak(translations["en"].inhale, tr.inhale);
      sweepVolumeAndFrequency(0.12, 380, 4);

      interval = setTimeout(() => {
        // Hold phase
        setPhase("hold");
        speak(translations["en"].hold, tr.hold);
        sweepVolumeAndFrequency(0.06, 380, 4);

        interval = setTimeout(() => {
          // Exhale phase
          setPhase("exhale");
          speak(translations["en"].exhale, tr.exhale);
          sweepVolumeAndFrequency(0.0, 220, 4);
        }, 4000);

      }, 4000);
    };

    runBreathingCycle();
    const mainTimer = setInterval(runBreathingCycle, 12000);

    return () => {
      clearTimeout(interval);
      clearInterval(mainTimer);
    };
  }, [language]);

  const sweepVolumeAndFrequency = (targetVolume, targetFreq, duration) => {
    if (!gainRef.current || !oscRef.current || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    // Smooth sweeps
    gainRef.current.gain.linearRampToValueAtTime(targetVolume, ctx.currentTime + duration);
    oscRef.current.frequency.exponentialRampToValueAtTime(targetFreq, ctx.currentTime + duration);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", alignItems: "center" }}>
      {/* Header */}
      <div style={{ display: "flex", width: "100%", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button
          onClick={() => { playTapSound(); back(); }}
          aria-label="Go back"
          style={{
            border: "none",
            background: "var(--color-teal-light)",
            borderRadius: 14,
            width: 44,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "var(--color-teal)"
          }}
        >
          <ArrowLeft size={22} />
        </button>
        <h2 style={{ fontSize: 22, color: "var(--color-text-dark)", fontWeight: 800 }}>
          {tr.title}
        </h2>
      </div>

      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <p style={{ fontSize: 14, color: "var(--color-text-muted)", margin: 0, fontWeight: 500 }}>
          {tr.sub}
        </p>
      </div>

      {/* Soothing breathing visualization circle */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        width: "100%"
      }}>
        <div 
          className={`breathing-circle ${phase}`}
          style={{
            width: 130,
            height: 130,
            borderRadius: "50%",
            background: phase === "inhale" 
              ? "radial-gradient(circle, var(--color-teal-medium) 0%, var(--color-teal) 100%)"
              : phase === "hold"
              ? "radial-gradient(circle, var(--color-gold) 0%, #d97706 100%)"
              : "radial-gradient(circle, var(--color-terracotta) 0%, #c2410c 100%)",
            boxShadow: phase === "inhale"
              ? "0 0 40px rgba(12, 106, 120, 0.4)"
              : phase === "hold"
              ? "0 0 40px rgba(217, 119, 6, 0.4)"
              : "0 0 40px rgba(204, 90, 55, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 800,
            fontSize: 20,
            userSelect: "none"
          }}
        >
          <Wind size={40} className="spin-animation" style={{ opacity: 0.15, position: "absolute" }} />
          <span style={{ position: "relative", zIndex: 5 }}>
            {phase === "inhale" ? "💨" : phase === "hold" ? "🛑" : "🌬️"}
          </span>
        </div>

        {/* Phase Text Indicator */}
        <h3 style={{ 
          fontSize: 24, 
          fontWeight: 800, 
          color: "var(--color-text-dark)", 
          marginTop: 40,
          minHeight: 36,
          transition: "all 0.3s"
        }}>
          {phase === "inhale" ? tr.inhale : phase === "hold" ? tr.hold : tr.exhale}
        </h3>
      </div>

      {/* Soothing Sound Toggle */}
      <button
        onClick={() => { playTapSound(); setSoundEnabled(!soundEnabled); }}
        style={{
          border: "none",
          background: "var(--color-teal-light)",
          color: "var(--color-teal)",
          padding: "12px 24px",
          borderRadius: 16,
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 20
        }}
      >
        {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        <span>{soundEnabled ? tr.soundOn : tr.soundOff}</span>
      </button>
    </div>
  );
}
