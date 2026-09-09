import React from "react";
import { Stethoscope, AlertTriangle, FileText, Download, CheckCircle2, ArrowLeft } from "lucide-react";
import { playTapSound, playMatchSound } from "../utils/audio";

const CLIN_TRANS = {
  en: {
    title: "Clinician View",
    patientSub: "Patient: Amma · District PHC, Assam",
    scoreTitle: "Screening-derived cognitive score",
    scoreSub: "Not a diagnosis — supplements MMSE / MoCA",
    scoreIndex: "Current index (of 100)",
    scoreChange: "Change over 5 weeks",
    alertText: "Sustained decline flagged for clinical review. Recommend an in-person MMSE/MoCA assessment.",
    stableText: "Cognitive performance is stable or improving. Adherence levels are positive.",
    reportIncludes: "REPORT INCLUDES",
    trend: "Weekly cognitive index trend",
    accuracy: "Game accuracy & response time",
    adherence: "Reminder adherence (medicine)",
    moods: "Mood self-reports",
    exportBtn: "Export report for visit"
  },
  hi: {
    title: "चिकित्सक दृश्य",
    patientSub: "मरीज: अम्मा · जिला पीएचसी, असम",
    scoreTitle: "स्क्रीनिंग-व्युत्पन्न संज्ञानात्मक स्कोर",
    scoreSub: "कोई निदान नहीं — एमएमएसई / मोका का पूरक है",
    scoreIndex: "वर्तमान सूचकांक (100 में से)",
    scoreChange: "5 सप्ताह में बदलाव",
    alertText: "नैदानिक समीक्षा के लिए निरंतर गिरावट दर्ज की गई। व्यक्तिगत एमएमएसई/मोका मूल्यांकन की सिफारिश की जाती है।",
    stableText: "संज्ञानात्मक प्रदर्शन स्थिर या सुधर रहा है। अनुपालन सकारात्मक है।",
    reportIncludes: "रिपोर्ट में शामिल है",
    trend: "साঞ্চল্য संज्ञानात्मक सूचकांक प्रवृत्ति",
    accuracy: "खेल की सटीकता और प्रतिक्रिया समय",
    adherence: "अनुस्मारक अनुपालन (दवा)",
    moods: "मनोदशा स्व-रिपोर्ट",
    exportBtn: "यात्रा के लिए रिपोर्ट निर्यात करें"
  },
  ta: {
    title: "மருத்துவப் பார்வை",
    patientSub: "நோயாளி: அம்மா · மாவட்ட ஆரம்ப சுகாதார நிலையம், அசாம்",
    scoreTitle: "நினைவாற்றல் மதிப்பீட்டு மதிப்பெண்",
    scoreSub: "இது ஒரு நோய் கண்டறிதல் அல்ல — MMSE / MoCA க்கு கூடுதல் உதவி",
    scoreIndex: "தற்போதைய குறியீடு (100க்கு)",
    scoreChange: "5 வாரங்களில் மாற்றம்",
    alertText: "தொடர் சரிவு கண்டறியப்பட்டுள்ளது. நேரில் சென்று MMSE/MoCA பரிசோதனை செய்ய பரிந்துரைக்கப்படுகிறது.",
    stableText: "அறிவாற்றல் செயல்திறன் சீராக உள்ளது. நோயாளி பயிற்சிகளைத் தொடர்ந்து செய்கிறார்.",
    reportIncludes: "அறிக்கையில் அடங்குபவை",
    trend: "வாராந்திர அறிவாற்றல் போக்கு",
    accuracy: "விளையாட்டின் துல்லியம் & எதிர்வினை நேரம்",
    adherence: "நினைவூட்டல் கடைபிடித்தல் (மருந்து)",
    moods: "மனநிலை சுய அறிக்கைகள்",
    exportBtn: "அறிக்கையை பதிவிறக்கம் செய்ய"
  }
};

export default function ClinicianScreen({ language, gameHistory = [], reminders = [], mood = "", onExit }) {
  const LANGUAGE_FALLBACKS = {
    karbi: "as", mising: "as", nyishi: "hi", adi: "hi", apatani: "hi", monpa: "hi", galo: "hi",
    tangkhul: "mni", thadou: "mni", paite: "mni", hmar: "mni", khasi: "en", garo: "en",
    jaintia: "en", mizo: "en", lai: "en", mara: "en", nagamese: "as", ao: "en", angami: "en",
    sumi: "en", lotha: "en", konyak: "en", kokborok: "bn", sikkimese: "ne", lepcha: "ne"
  };

  const getResolvedLang = () => {
    if (CLIN_TRANS[language]) return language;
    const fb = LANGUAGE_FALLBACKS[language];
    if (fb && CLIN_TRANS[fb]) return fb;

    const hiFallbacks = ["hi", "br", "doi", "ks", "kok", "mai", "mr", "ne", "pa", "sa", "sd", "ur", "gu", "bn", "as", "or"];
    const taFallbacks = ["ta", "te", "kn", "ml"];

    if (hiFallbacks.includes(language) || hiFallbacks.includes(fb)) return "hi";
    if (taFallbacks.includes(language) || taFallbacks.includes(fb)) return "ta";
    return "en";
  };

  const resolved = getResolvedLang();
  const t = CLIN_TRANS[resolved] || CLIN_TRANS["en"];

  const handleExport = () => {
    playMatchSound();
    alert("Downloading Clinical Cognitive Assessment Report PDF...");
  };

  const hasHistory = gameHistory && gameHistory.length > 0;
  
  // Calculate average cognitive score from last 5 games
  const recentGames = hasHistory ? gameHistory.slice(0, 5) : [];
  const cognitiveIndex = hasHistory
    ? Math.round(recentGames.reduce((sum, g) => sum + g.score, 0) / recentGames.length)
    : 64;

  // Calculate percentage change
  let changeText = "0%";
  let isDecline = false;
  if (hasHistory && gameHistory.length > 1) {
    const oldestScore = gameHistory[gameHistory.length - 1].score;
    const newestScore = gameHistory[0].score;
    const pctChange = Math.round(((newestScore - oldestScore) / oldestScore) * 100);
    if (pctChange < 0) {
      changeText = `↓ ${Math.abs(pctChange)}%`;
      isDecline = true;
    } else {
      changeText = `↑ ${pctChange}%`;
      isDecline = false;
    }
  } else {
    changeText = hasHistory ? "0%" : "↓ 18%";
    isDecline = !hasHistory; // default to showing caution state if no data
  }

  // Calculate adherence compliance
  const completedReminders = reminders ? reminders.filter(r => r.done).length : 0;
  const complianceRate = reminders && reminders.length > 0 
    ? Math.round((completedReminders / reminders.length) * 100) 
    : 100;

  const latestGame = hasHistory ? gameHistory[0] : null;
  const latestAccuracy = latestGame ? `${latestGame.score} pts (${latestGame.difficulty})` : "No games played";
  const latestMoodDisplay = mood ? mood : "Not recorded today";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", paddingBottom: 20 }}>
      {/* Title */}
      <div style={{ marginBottom: 18, display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={() => { playTapSound(); if (onExit) onExit(); }}
          aria-label="Back"
          style={{
            border: "none",
            background: "white",
            borderRadius: 12,
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
            cursor: "pointer"
          }}
        >
          <ArrowLeft size={18} color="var(--color-text-dark)" />
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 22, color: "var(--color-text-dark)", fontWeight: 800, margin: 0 }}>
            {t.title}
          </h2>
          <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 2, fontWeight: 500 }}>
            {t.patientSub}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Score Card Header */}
        <div style={{
          background: "var(--color-teal-light)",
          borderRadius: 20,
          padding: "18px 16px",
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 14,
          border: "1px solid var(--color-teal-soft)"
        }}>
          <div style={{
            width: 46,
            height: 46,
            borderRadius: 12,
            background: "var(--color-teal)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            flexShrink: 0
          }}>
            <Stethoscope size={24} />
          </div>
          <div>
            <div style={{ fontSize: 14.5, fontWeight: 800, color: "var(--color-teal)" }}>
              {t.scoreTitle}
            </div>
            <div style={{ fontSize: 11.5, color: "var(--color-text-muted)" }}>
              {t.scoreSub}
            </div>
          </div>
        </div>

        {/* Index and Change grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div style={{ background: "white", borderRadius: 18, padding: 14, border: "1px solid rgba(8, 81, 92, 0.08)", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: "var(--color-text-dark)" }}>{cognitiveIndex}</div>
            <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 2 }}>{t.scoreIndex}</div>
          </div>
          <div style={{ background: "white", borderRadius: 18, padding: 14, border: "1px solid rgba(8, 81, 92, 0.08)", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: isDecline ? "var(--color-danger)" : "var(--color-success)" }}>
              {changeText}
            </div>
            <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 2 }}>{t.scoreChange}</div>
          </div>
        </div>

        {/* Warning or Stable Banner */}
        <div style={{
          background: isDecline ? "var(--color-danger-light)" : "var(--color-success-light)",
          borderRadius: 18,
          padding: "14px 16px",
          display: "flex",
          gap: 12,
          border: isDecline ? "1px solid rgba(220, 38, 38, 0.15)" : "1px solid rgba(58, 148, 105, 0.15)",
          marginBottom: 20
        }}>
          {isDecline ? (
            <>
              <AlertTriangle size={20} color="var(--color-danger)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ fontSize: 13.5, color: "var(--color-danger)", lineHeight: 1.5, fontWeight: 600 }}>
                {t.alertText}
              </div>
            </>
          ) : (
            <>
              <CheckCircle2 size={20} color="var(--color-success)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ fontSize: 13.5, color: "var(--color-success)", lineHeight: 1.5, fontWeight: 600 }}>
                {t.stableText}
              </div>
            </>
          )}
        </div>

        {/* Details list */}
        <div style={{
          background: "white",
          borderRadius: 20,
          padding: 16,
          border: "1px solid rgba(8, 81, 92, 0.08)",
          boxShadow: "var(--shadow-sm)",
          marginBottom: 24
        }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "var(--color-text-muted)", marginBottom: 12, letterSpacing: "0.5px" }}>
            {t.reportIncludes}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { text: t.trend, detail: `Avg Score: ${cognitiveIndex}` },
              { text: t.accuracy, detail: latestAccuracy },
              { text: t.adherence, detail: `${complianceRate}% Compliance` },
              { text: t.moods, detail: `Today: ${latestMoodDisplay}` }
            ].map((item, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <FileText size={15} color="var(--color-teal)" />
                  <span style={{ fontSize: 13.5, color: "var(--color-text-dark)", fontWeight: 500 }}>
                    {item.text}
                  </span>
                </div>
                <span style={{ fontSize: 12, color: "var(--color-text-muted)", fontWeight: 700 }}>
                  {item.detail}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            boxShadow: "var(--shadow-sm)"
          }}
        >
          <Download size={16} />
          <span>{t.exportBtn}</span>
        </button>
      </div>
    </div>
  );
}
