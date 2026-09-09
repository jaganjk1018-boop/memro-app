import React, { useState } from "react";
import {
  ArrowLeft, MapPin, ShieldCheck, Watch, HeartPulse, Brain, AlertTriangle,
  PhoneCall, ChevronRight, Bell, Activity, Sparkles, Footprints, Moon,
  BatteryMedium, Sun, Phone, History, Smile,
} from "lucide-react";

/* ---------------- Design tokens (same family as Memro) ---------------- */
const CREAM = "#FBF8F0";
const PANEL = "#FFFFFF";
const TEAL = "#0E5C52";
const TEAL_LIGHT = "#DCEFEA";
const BLUE = "#DDEAF8";
const BLUE_ICON = "#3E7FB0";
const YELLOW = "#FBF0CE";
const YELLOW_ICON = "#C99A2E";
const PURPLE = "#EEE8FA";
const PURPLE_ICON = "#7A5FAE";
const CORAL_LIGHT = "#FBE4E1";
const CORAL = "#E4574B";
const GREEN_PASTEL = "#E2F0DE";
const GREEN_ICON = "#3FA65B";
const PEACH = "#FDE8D9";
const PEACH_ICON = "#E07B33";
const TEXT_DARK = "#23312B";
const MUTED = "#7C8A80";

const playTapSound = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.03, audioCtx.currentTime);
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.1);
    oscillator.stop(audioCtx.currentTime + 0.1);
  } catch (e) {
    console.log("Audio feedback not supported");
  }
};

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@500;600;700;800&display=swap');
    .si-root, .si-root * { font-family: 'Nunito', system-ui, sans-serif; box-sizing: border-box; }
    .si-display { font-family: 'Baloo 2', 'Nunito', system-ui, sans-serif; }
    @keyframes si-rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes si-pulse-ring { 0% { transform: scale(0.85); opacity: 0.6; } 100% { transform: scale(2.1); opacity: 0; } }
    @keyframes si-heartbeat { 0%,100% { transform: scale(1); } 15% { transform: scale(1.18); } 30% { transform: scale(1); } 45% { transform: scale(1.1); } 60% { transform: scale(1); } }
    @keyframes si-blip { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }
    @keyframes si-sos-pulse { 0% { box-shadow: 0 0 0 0 rgba(228,87,75,0.5); } 70% { box-shadow: 0 0 0 16px rgba(228,87,75,0); } 100% { box-shadow: 0 0 0 0 rgba(228,87,75,0); } }
    .si-rise { animation: si-rise 0.5s cubic-bezier(.2,.8,.2,1) both; }
    .si-card { transition: transform 0.15s ease, box-shadow 0.15s ease; }
    .si-card:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(35,49,43,0.1); }
    @media (prefers-reduced-motion: reduce) {
      .si-root *, .si-root *::before, .si-root *::after {
        animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important;
      }
    }
  `}</style>
);

function pill(bg, color) {
  return { display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 999, background: bg, color, fontSize: 10.5, fontWeight: 800 };
}

function GeofenceMap() {
  return (
    <svg width="100%" height="120" viewBox="0 0 320 120" style={{ borderRadius: 16, display: "block" }}>
      <rect width="320" height="120" fill="#EAF3EE" />
      <path d="M0 90 L60 70 L130 95 L200 65 L260 88 L320 72 L320 120 L0 120 Z" fill="#DCEAE0" />
      <circle cx="160" cy="58" r="50" fill={`${TEAL}22`} stroke={TEAL} strokeWidth="1.5" strokeDasharray="4 4" />
      <circle cx="160" cy="58" r="50" fill="none" stroke={TEAL} strokeOpacity="0.5" strokeWidth="2" style={{ animation: "si-pulse-ring 2.6s ease-out infinite", transformOrigin: "160px 58px" }} />
      <circle cx="245" cy="82" r="20" fill={`${GREEN_ICON}22`} stroke={GREEN_ICON} strokeWidth="1.2" strokeDasharray="3 3" />
      <rect x="140" y="46" width="26" height="20" rx="2" fill="#C9A97A" />
      <polygon points="137,46 153,34 169,46" fill="#A8794D" />
      <circle cx="150" cy="52" r="6" fill={TEAL} style={{ animation: "si-blip 1.6s ease-in-out infinite" }} />
      <circle cx="150" cy="52" r="2.2" fill="white" />
    </svg>
  );
}

function Sparkline({ pts, color }) {
  const max = Math.max(...pts), min = Math.min(...pts);
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${(i * 200) / (pts.length - 1)},${36 - ((p - min) / (max - min || 1)) * 30}`).join(" ");
  return (
    <svg width="200" height="40" viewBox="0 0 200 40">
      <path d={path} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const LOCATION_HISTORY = [
  { place: "Home", time: "Now", zone: "safe" },
  { place: "Garden (backyard)", time: "10:20 AM", zone: "safe" },
  { place: "Home", time: "9:00 AM", zone: "safe" },
];

const CONTACTS = [
  { name: "Priya", role: "Daughter · Primary", emoji: "👩" },
  { name: "Ravi", role: "Son", emoji: "👨" },
  { name: "District PHC", role: "Clinic front desk", emoji: "🏥" },
];

export default function AiSafetyInsightsScreen({ onBack }) {
  const [showEscalation, setShowEscalation] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="si-root app-container">
      <GlobalStyle />
      <div className="phone-mockup">
        <div style={{ flex: 1, overflowY: "auto", background: CREAM, position: "relative", paddingBottom: 24 }}>

          {/* Top bar */}
          <div style={{ padding: "18px 20px 0", display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => { playTapSound(); if (onBack) onBack(); }} aria-label="Back" style={{ border: "none", background: "white", borderRadius: 12, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.06)", cursor: "pointer" }}>
              <ArrowLeft size={19} color={TEXT_DARK} />
            </button>
            <div>
              <div style={{ fontSize: 11, color: MUTED, fontWeight: 700 }}>Memro · AI Safety</div>
              <div className="si-display" style={{ fontSize: 18, fontWeight: 800, color: TEXT_DARK }}>Safety & Insights</div>
            </div>
          </div>

          {/* Geofence / location */}
          <div className="si-rise" style={{ margin: "16px 20px 0", background: PANEL, borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 14px rgba(35,49,43,0.06)" }}>
            <GeofenceMap />
            <div style={{ padding: "13px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <ShieldCheck size={17} color={GREEN_ICON} />
                  <span className="si-display" style={{ fontSize: 14, fontWeight: 700, color: TEXT_DARK }}>Kamala is at home</span>
                </div>
                <span style={pill(GREEN_PASTEL, GREEN_ICON)}>Safe zone</span>
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                <span style={pill(TEAL_LIGHT, TEAL)}><MapPin size={10} /> Home zone</span>
                <span style={pill(GREEN_PASTEL, GREEN_ICON)}><MapPin size={10} /> Garden zone</span>
              </div>
              <button onClick={() => setShowHistory((s) => !s)} style={{ display: "flex", alignItems: "center", gap: 6, border: "none", background: "none", cursor: "pointer", padding: 0, marginTop: 10 }}>
                <History size={13} color={MUTED} />
                <span style={{ fontSize: 11, color: MUTED, fontWeight: 700 }}>{showHistory ? "Hide" : "View"} today's movement</span>
                <ChevronRight size={13} color={MUTED} style={{ transform: showHistory ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
              </button>
              {showHistory && (
                <div className="si-rise" style={{ marginTop: 10, borderTop: "1px solid #F1EEE3", paddingTop: 10 }}>
                  {LOCATION_HISTORY.map((h, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", fontSize: 11.5 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: GREEN_ICON }} />
                      <span style={{ color: TEXT_DARK, fontWeight: 700 }}>{h.place}</span>
                      <span style={{ color: MUTED, marginLeft: "auto" }}>{h.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Wearable stats grid */}
          <div className="si-rise" style={{ margin: "12px 20px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, animationDelay: "0.06s" }}>
            <div className="si-card" style={{ background: PANEL, borderRadius: 16, padding: "12px", boxShadow: "0 4px 14px rgba(35,49,43,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <Activity size={13} color={CORAL} style={{ animation: "si-heartbeat 1.8s ease-in-out infinite" }} />
                <span style={{ fontSize: 10.5, fontWeight: 800, color: MUTED }}>Falls</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: GREEN_ICON, marginTop: 6 }}>None today</div>
            </div>
            <div className="si-card" style={{ background: PANEL, borderRadius: 16, padding: "12px", boxShadow: "0 4px 14px rgba(35,49,43,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <HeartPulse size={13} color={CORAL} />
                <span style={{ fontSize: 10.5, fontWeight: 800, color: MUTED }}>Heart rate</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: TEXT_DARK, marginTop: 6 }}>78 bpm</div>
            </div>
            <div className="si-card" style={{ background: PANEL, borderRadius: 16, padding: "12px", boxShadow: "0 4px 14px rgba(35,49,43,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <Footprints size={13} color={GREEN_ICON} />
                <span style={{ fontSize: 10.5, fontWeight: 800, color: MUTED }}>Steps</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: TEXT_DARK, marginTop: 6 }}>1,240</div>
            </div>
            <div className="si-card" style={{ background: PANEL, borderRadius: 16, padding: "12px", boxShadow: "0 4px 14px rgba(35,49,43,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <Moon size={13} color={PURPLE_ICON} />
                <span style={{ fontSize: 10.5, fontWeight: 800, color: MUTED }}>Sleep</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: TEXT_DARK, marginTop: 6 }}>6h 40m</div>
            </div>
          </div>

          <div className="si-rise" style={{ margin: "10px 20px 0", display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: MUTED, animationDelay: "0.08s" }}>
            <Watch size={13} color={BLUE_ICON} /> Wearable connected
            <span style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: "auto" }}><BatteryMedium size={13} color={GREEN_ICON} /> 64%</span>
          </div>

          {/* AI insight 1 — cognitive/speech */}
          <div className="si-rise" style={{
            margin: "14px 20px 0", background: `linear-gradient(135deg, ${PURPLE}, #F7F2FD)`, borderRadius: 20, padding: "16px 16px",
            boxShadow: "0 4px 14px rgba(35,49,43,0.06)", border: `1px solid ${PURPLE_ICON}22`, animationDelay: "0.12s",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <Brain size={17} color={PURPLE_ICON} />
              <span className="si-display" style={{ fontSize: 14, fontWeight: 700, color: TEXT_DARK }}>Cognitive pattern</span>
              <span style={pill("#FBE4E1", CORAL)}><AlertTriangle size={10} /> Worth a look</span>
            </div>
            <div style={{ fontSize: 12.5, color: "#4B3B72", lineHeight: 1.5, marginBottom: 10 }}>
              Speech response time in games slowed <b>12% over 2 weeks</b>. Not a diagnosis — a gentle check-in is recommended.
            </div>
            <Sparkline pts={[72, 75, 70, 66, 60, 61, 56]} color={PURPLE_ICON} />
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button onClick={() => { playTapSound(); alert("Checking in with Kamala..."); }} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, border: "none", cursor: "pointer", borderRadius: 12, padding: "10px 0", background: PURPLE_ICON, color: "white", fontSize: 12, fontWeight: 800 }}>
                <PhoneCall size={13} /> Schedule check-in
              </button>
              <button onClick={() => { playTapSound(); alert("Opening cognitive pattern details..."); }} style={{ border: "none", cursor: "pointer", borderRadius: 12, padding: "10px 14px", background: "white", color: PURPLE_ICON, fontSize: 12, fontWeight: 800 }}>Details</button>
            </div>
          </div>

          {/* AI insight 2 — mood/activity correlation */}
          <div className="si-rise" style={{
            margin: "12px 20px 0", background: `linear-gradient(135deg, ${GREEN_PASTEL}, #F2F9F0)`, borderRadius: 20, padding: "16px 16px",
            boxShadow: "0 4px 14px rgba(35,49,43,0.06)", border: `1px solid ${GREEN_ICON}22`, animationDelay: "0.16s",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <Smile size={17} color={GREEN_ICON} />
              <span className="si-display" style={{ fontSize: 14, fontWeight: 700, color: TEXT_DARK }}>Mood ↔ activity link</span>
              <span style={pill(GREEN_PASTEL, GREEN_ICON)}>Positive trend</span>
            </div>
            <div style={{ fontSize: 12.5, color: "#2C5D42", lineHeight: 1.5 }}>
              On days Kamala completes her garden walk, her self-reported mood is <b>higher 4 out of 5 times</b>. Keep the evening walk routine going.
            </div>
          </div>

          {/* Weather / heat advisory */}
          <div className="si-rise" style={{
            margin: "12px 20px 0", background: PEACH, borderRadius: 18, padding: "13px 14px", display: "flex", alignItems: "center", gap: 12, animationDelay: "0.2s",
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: PEACH_ICON, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Sun size={17} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: TEXT_DARK }}>High heat advisory today</div>
              <div style={{ fontSize: 11, color: MUTED }}>Suggest the garden walk moves to early morning or indoors.</div>
            </div>
          </div>

          {/* Medication escalation logic */}
          <button onClick={() => { playTapSound(); setShowEscalation((s) => !s); }} className="si-rise" style={{
            margin: "14px 20px 0", width: "calc(100% - 40px)", textAlign: "left", border: "none", cursor: "pointer",
            background: PANEL, borderRadius: 18, padding: "14px 16px", boxShadow: "0 4px 14px rgba(35,49,43,0.06)",
            display: "flex", alignItems: "center", gap: 12, animationDelay: "0.24s",
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: YELLOW, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Bell size={16} color={YELLOW_ICON} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: TEXT_DARK }}>Missed-dose escalation</div>
              <div style={{ fontSize: 11, color: MUTED }}>Auto-notify family if a dose is missed</div>
            </div>
            <ChevronRight size={16} color={MUTED} style={{ transform: showEscalation ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
          </button>
          {showEscalation && (
            <div className="si-rise" style={{ margin: "8px 20px 0", background: YELLOW, borderRadius: 16, padding: "12px 16px", fontSize: 11.5, color: "#6B5424", lineHeight: 1.7 }}>
              <div>🕒 <b>+30 min</b> — gentle reminder repeats on Kamala's app</div>
              <div>📱 <b>+45 min</b> — Priya (primary caregiver) is notified</div>
              <div>📞 <b>+60 min</b> — Ravi is called automatically; PHC flagged if unresolved</div>
            </div>
          )}

          {/* Emergency contacts */}
          <div className="si-rise" style={{ margin: "14px 20px 0", background: PANEL, borderRadius: 20, padding: "14px 16px", boxShadow: "0 4px 14px rgba(35,49,43,0.06)" }}>
            <div className="si-display" style={{ fontSize: 14, fontWeight: 700, color: TEXT_DARK, marginBottom: 8 }}>Emergency contacts</div>
            {CONTACTS.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderTop: i > 0 ? "1px solid #F1EEE3" : "none" }}>
                <span style={{ fontSize: 17 }}>{c.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: TEXT_DARK }}>{c.name}</div>
                  <div style={{ fontSize: 10, color: MUTED }}>{c.role}</div>
                </div>
                <button onClick={() => { playTapSound(); alert("Calling emergency contact: " + c.name); }} aria-label={`Call ${c.name}`} style={{ border: "none", cursor: "pointer", borderRadius: "50%", width: 30, height: 30, background: TEAL_LIGHT, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <PhoneCall size={13} color={TEAL} />
                </button>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="si-rise" style={{
            margin: "14px 20px 90px", padding: "12px 14px", borderRadius: 16, background: TEAL_LIGHT,
            display: "flex", gap: 10, alignItems: "flex-start", fontSize: 11.5, color: TEAL, animationDelay: "0.28s",
          }}>
            <Sparkles size={15} color={TEAL} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>All AI insights are screening signals, not diagnoses — always reviewed by the linked PHC clinician.</span>
          </div>

          {/* Floating SOS */}
          <button onClick={() => { playTapSound(); alert("SOS triggered! Sending location alerts to all contacts."); }} aria-label="Emergency SOS" style={{
            position: "absolute", bottom: 22, right: 22, width: 56, height: 56, borderRadius: "50%",
            background: `linear-gradient(135deg, ${CORAL}, #C2454A)`, border: "none", color: "white",
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            boxShadow: "0 8px 18px rgba(228,87,75,0.4)", animation: "si-sos-pulse 2.4s ease-in-out infinite",
          }}><Phone size={22} /></button>
        </div>
      </div>
    </div>
  );
}
