import React from "react";
import { ArrowLeft, Check, Sparkles } from "lucide-react";

const PROG_TRANS = {
  en: {
    title: "My Progress",
    doingGreat: "You're doing great this week",
    completedSoFar: (count) => `${count} out of 7 days completed so far`,
    keepItUp: "Keep it up! Playing a game most days helps keep your mind active and sharp."
  },
  hi: {
    title: "मेरी प्रगति",
    doingGreat: "आप इस सप्ताह बहुत अच्छा कर रहे हैं",
    completedSoFar: (count) => `अब तक 7 में से ${count} दिन पूरे हो चुके हैं`,
    keepItUp: "इसे जारी रखें! अधिकांश दिनों में खेल खेलने से आपका दिमाग सक्रिय और तेज रहता है।"
  },
  ta: {
    title: "என் முன்னேற்றம்",
    doingGreat: "இந்த வாரம் நீங்கள் சிறப்பாகச் செய்கிறீர்கள்",
    completedSoFar: (count) => `இதுவரை 7 நாட்களில் ${count} நாட்கள் முடிந்துள்ளன`,
    keepItUp: "தொடர்ந்து செய்யுங்கள்! பெரும்பாலான நாட்களில் விளையாடுவது உங்கள் மனதை சுறுசுறுப்பாகவும் கூர்மையாகவும் வைத்திருக்க உதவும்."
  }
};

const DAYS_SHORT = {
  en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  hi: ["सोम", "मंग", "बुध", "गुरु", "शुक्र", "शनि", "रवि"],
  ta: ["திங்", "செவ்", "புத", "வியா", "வெள்", "சனி", "ஞாயி"]
};

export default function ProgressScreen({ back, language, gameHistory = [], reminders = [] }) {
  const t = PROG_TRANS[language] || PROG_TRANS["en"];
  const daysList = DAYS_SHORT[language] || DAYS_SHORT["en"];

  // Determine current day of week index (Monday = 0, Sunday = 6)
  const todayIndex = (new Date().getDay() + 6) % 7;

  // Build the 7 days array based on actual play history
  const days = daysList.map((label, index) => {
    // Check if a game was played on this day of the current week
    const playedOnDay = gameHistory.some(item => {
      const itemDate = new Date(item.timestamp || Date.now());
      // Check if it's within the last 7 days and matches the day index
      const diffTime = Math.abs(Date.now() - itemDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const itemDayIndex = (itemDate.getDay() + 6) % 7;
      return diffDays <= 7 && itemDayIndex === index;
    });

    if (playedOnDay) {
      return { label, ok: true };
    } else if (index < todayIndex) {
      // Past day in the current week, but no game was played
      return { label, ok: false };
    } else {
      // Today or future day (no game played yet)
      return { label, ok: null };
    }
  });

  const completedDaysCount = days.filter(d => d.ok === true).length;
  const completedSoFarText = typeof t.completedSoFar === "function"
    ? t.completedSoFar(completedDaysCount)
    : `${completedDaysCount} out of 7 days completed so far`;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <button
          onClick={back}
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
          {t.title}
        </h2>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{
          background: "linear-gradient(135deg, var(--color-teal) 0%, var(--color-teal-medium) 100%)",
          borderRadius: 24,
          padding: "22px 20px",
          color: "white",
          marginBottom: 20,
          textAlign: "center",
          boxShadow: "var(--shadow-md)"
        }}>
          <Sparkles size={26} style={{ marginBottom: 8, color: "var(--color-gold-light)" }} />
          <div style={{ fontSize: 18, fontWeight: 800 }}>{t.doingGreat}</div>
          <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>{completedSoFarText}</div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24, background: "white", padding: 16, borderRadius: 20, border: "1px solid var(--color-teal-soft)" }}>
          {days.map((d, idx) => (
            <div key={idx} style={{ textAlignment: "center" }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 6px",
                background: d.ok === true ? "var(--color-success)" : d.ok === false ? "var(--color-danger-light)" : "var(--color-teal-light)",
                border: d.ok === false ? "1px solid var(--color-danger)" : "none"
              }}>
                {d.ok === true && <Check size={16} color="white" />}
                {d.ok === false && <span style={{ color: "var(--color-danger)", fontWeight: 700, fontSize: 12 }}>!</span>}
              </div>
              <div style={{ fontSize: 11, color: "var(--color-text-muted)", fontWeight: 600, textAlign: "center" }}>{d.label}</div>
            </div>
          ))}
        </div>

        <div style={{
          background: "var(--color-gold-light)",
          borderRadius: 20,
          padding: "16px 18px",
          fontSize: 13.5,
          color: "var(--color-gold)",
          border: "1px solid rgba(217, 119, 6, 0.15)",
          lineHeight: 1.5
        }}>
          {t.keepItUp}
        </div>
      </div>
    </div>
  );
}
