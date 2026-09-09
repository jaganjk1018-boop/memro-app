import React, { useState } from "react";
import {
  Menu, Bell, PhoneCall, MessageCircle, Check, Pill, Gamepad2,
  AlertTriangle, TrendingUp, ThumbsUp, Clock, Users, CalendarClock,
  FileDown, UserPlus, X, ChevronRight, MapPin, LogOut, Brain
} from "lucide-react";
import { playTapSound } from "../utils/audio";
import AiSafetyInsightsScreen from "./AiSafetyInsightsScreen";

/* ---------------- Design tokens (same family as Memro) ---------------- */
const CREAM = "#FBF8F0";
const PANEL = "#FFFFFF";
const TEAL = "#0E5C52";
const TEAL_LIGHT = "#DCEFEA";
const PEACH_ICON = "#E07B33";
const BLUE = "#DDEAF8";
const BLUE_ICON = "#3E7FB0";
const YELLOW = "#FBF0CE";
const YELLOW_ICON = "#C99A2E";
const PURPLE = "#EEE8FA";
const PURPLE_ICON = "#7A5FAE";
const CORAL_LIGHT = "#FBE4E1";
const CORAL = "#E4574B";
const GREEN_ICON = "#3FA65B";
const TEXT_DARK = "#23312B";
const MUTED = "#7C8A80";

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@500;600;700;800&display=swap');
    .fam-root, .fam-root * { font-family: 'Nunito', system-ui, sans-serif; box-sizing: border-box; }
    .fam-display { font-family: 'Baloo 2', 'Nunito', system-ui, sans-serif; }
    @keyframes fam-rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    .fam-rise { animation: fam-rise 0.5s cubic-bezier(.2,.8,.2,1) both; }
    .fam-card { transition: transform 0.15s ease, box-shadow 0.15s ease; }
    .fam-card:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(35,49,43,0.1); }
    @media (prefers-reduced-motion: reduce) {
      .fam-root *, .fam-root *::before, .fam-root *::after {
        animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important;
      }
    }
  `}</style>
);

function pill(bg, color) {
  return { display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 999, background: bg, color, fontSize: 10.5, fontWeight: 800 };
}

function ProgressRing({ pct, size = 58, color = TEAL, track = TEAL_LIGHT }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth="6.5" fill="none" />
      <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth="6.5" fill="none" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c - (pct / 100) * c} style={{ transition: "stroke-dashoffset 0.8s ease" }} />
    </svg>
  );
}

function DualTrend() {
  const patient = [70, 74, 71, 75];
  const caregiver = [80, 76, 84, 86];
  const toPath = (arr) => arr.map((v, i) => `${i === 0 ? "M" : "L"}${(i * 200) / (arr.length - 1)},${46 - ((v - 60) / 40) * 40}`).join(" ");
  return (
    <svg width="200" height="46" viewBox="0 0 200 46">
      <path d={toPath(patient)} fill="none" stroke={TEAL} strokeWidth="2.4" strokeLinecap="round" />
      <path d={toPath(caregiver)} fill="none" stroke={BLUE_ICON} strokeWidth="2.4" strokeLinecap="round" strokeDasharray="4 3" />
    </svg>
  );
}

const FEED = [
  { who: "patient", icon: Check, text: "Kamala marked \u2018Blood pressure tablet\u2019 done", time: "8:04 AM", color: GREEN_ICON },
  { who: "caregiver", icon: Pill, text: "Priya added a new routine: Evening walk", time: "7:50 AM", color: BLUE_ICON },
  { who: "patient", icon: Gamepad2, text: "Kamala played Memory Match \u2014 3 stars", time: "Yesterday, 6:40 PM", color: PEACH_ICON },
  { who: "caregiver", icon: PhoneCall, text: "Priya checked in with a call", time: "Yesterday, 1:15 PM", color: TEAL },
  { who: "patient", icon: AlertTriangle, text: "Kamala missed the evening walk", time: "Yesterday, 6:00 PM", color: CORAL },
];

const NOTIFICATIONS = [
  { text: "Kamala missed her evening walk", time: "6:00 PM", urgent: true },
  { text: "Priya added a new reminder", time: "7:50 AM", urgent: false },
  { text: "Weekly clinician report is ready", time: "Yesterday", urgent: false },
];

const FAMILY = [
  { name: "Priya", role: "Primary caregiver", emoji: "👩", pct: 86, color: BLUE_ICON },
  { name: "Ravi", role: "Son", emoji: "👨", pct: 52, color: PEACH_ICON },
  { name: "Arjun", role: "Grandson", emoji: "👦", pct: 38, color: PURPLE_ICON },
];

function AssignTaskSheet({ onClose }) {
  const [who, setWho] = useState(FAMILY[0].name);
  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(20,30,26,0.5)", zIndex: 20, display: "flex", alignItems: "flex-end" }}>
      <div className="fam-rise" style={{ background: "white", width: "100%", borderRadius: "26px 26px 0 0", padding: "20px 20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div className="fam-display" style={{ fontSize: 16, fontWeight: 800, color: TEXT_DARK }}>Assign this week's tasks</div>
          <button onClick={() => { playTapSound(); onClose(); }} aria-label="Close" style={{ border: "none", background: TEAL_LIGHT, borderRadius: 10, width: 30, height: 30, cursor: "pointer" }}><X size={15} color={TEAL} /></button>
        </div>
        <div style={{ fontSize: 12, color: MUTED, marginBottom: 12 }}>Share the load — pick who checks in on Kamala this week.</div>
        {FAMILY.map((f) => (
          <button key={f.name} onClick={() => { playTapSound(); setWho(f.name); }} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12, border: "none", cursor: "pointer",
            padding: "10px 12px", borderRadius: 14, marginBottom: 8, background: who === f.name ? TEAL_LIGHT : "#F6F4EC", textAlign: "left",
          }}>
            <span style={{ fontSize: 20 }}>{f.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: TEXT_DARK }}>{f.name}</div>
              <div style={{ fontSize: 10.5, color: MUTED }}>{f.role}</div>
            </div>
            {who === f.name && <Check size={16} color={TEAL} />}
          </button>
        ))}
        <button onClick={() => { playTapSound(); onClose(); }} style={{ width: "100%", marginTop: 8, border: "none", cursor: "pointer", borderRadius: 14, padding: "13px 0", background: TEAL, color: "white", fontSize: 14, fontWeight: 800 }}>
          Assign to {who}
        </button>
      </div>
    </div>
  );
}

export default function FamilyOverviewScreen({ onExit, onSwitchToWidescreen, reminders = [] }) {
  const [tab, setTab] = useState("both");
  const [showNotifs, setShowNotifs] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSafety, setShowSafety] = useState(false);

  const medReminders = reminders.filter(r => r.cat === "medicine");
  const completedCount = reminders.filter(r => r.done).length;
  const totalCount = reminders.length;
  const patientPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 75;
  const caregiverPct = 86;
  const filteredFeed = FEED.filter((f) => tab === "both" || f.who === tab);

  if (showSafety) {
    return <AiSafetyInsightsScreen onBack={() => setShowSafety(false)} />;
  }

  return (
    <div className="app-container">
      <GlobalStyle />
      <div className="phone-mockup">
        <div style={{ flex: 1, overflowY: "auto", background: CREAM, position: "relative", paddingBottom: 24 }}>

          {/* Top bar */}
          <div style={{ padding: "18px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
            <button onClick={() => { playTapSound(); setShowMenu(!showMenu); }} aria-label="Menu" style={{ border: "none", background: "white", borderRadius: 12, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.06)", cursor: "pointer" }}>
              <Menu size={19} color={TEXT_DARK} />
            </button>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: MUTED, fontWeight: 700 }}>Family · Memro</div>
              <div className="fam-display" style={{ fontSize: 17, fontWeight: 800, color: TEXT_DARK }}>Kamala's Household</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {onSwitchToWidescreen && (
                <button onClick={() => { playTapSound(); onSwitchToWidescreen(); }} style={{ display: "flex", alignItems: "center", gap: 5, border: "none", cursor: "pointer", background: "white", borderRadius: 999, padding: "6px 10px", boxShadow: "0 2px 6px rgba(0,0,0,0.06)", fontSize: 11, fontWeight: 800, color: TEAL }}>
                  Widescreen
                </button>
              )}
              <button onClick={() => { playTapSound(); setShowNotifs((s) => !s); }} aria-label="Notifications" style={{ position: "relative", border: "none", background: TEAL_LIGHT, borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Bell size={17} color={TEAL} />
                <span style={{ position: "absolute", top: 7, right: 8, width: 8, height: 8, borderRadius: "50%", background: CORAL, border: "2px solid " + TEAL_LIGHT }} />
              </button>
            </div>

            {/* Menu Dropdown */}
            {showMenu && (
              <div className="fam-rise" style={{
                position: "absolute", top: 58, left: 20, background: "white", borderRadius: 14,
                boxShadow: "0 8px 24px rgba(35,49,43,0.15)", padding: 6, zIndex: 30, display: "flex", flexDirection: "column",
                border: "1px solid #ECE9DF", minWidth: 160
              }}>
                <button
                  onClick={() => {
                    playTapSound();
                    setShowMenu(false);
                    if (onExit) onExit();
                  }}
                  style={{
                    border: "none", background: "transparent", padding: "10px 14px", fontSize: 13, fontWeight: 700,
                    color: CORAL, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, borderRadius: 10,
                    width: "100%", textAlign: "left"
                  }}
                >
                  <LogOut size={14} /> Exit Family App
                </button>
              </div>
            )}
          </div>

          {showNotifs && (
            <div className="fam-rise" style={{ margin: "10px 20px 0", background: PANEL, borderRadius: 16, boxShadow: "0 8px 20px rgba(35,49,43,0.12)", overflow: "hidden" }}>
              {NOTIFICATIONS.map((n, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "11px 14px", borderBottom: i < NOTIFICATIONS.length - 1 ? "1px solid #F1EEE3" : "none" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: n.urgent ? CORAL : TEAL_LIGHT, marginTop: 5, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: TEXT_DARK }}>{n.text}</div>
                    <div style={{ fontSize: 10, color: MUTED }}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Two-up summary */}
          <div className="fam-rise" style={{ padding: "16px 20px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="fam-card" style={{ background: PANEL, borderRadius: 20, padding: "16px 14px", boxShadow: "0 4px 14px rgba(35,49,43,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg, ${TEAL_LIGHT}, white)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>👵</div>
                <div><div style={{ fontSize: 12.5, fontWeight: 800, color: TEXT_DARK }}>Kamala</div><div style={{ fontSize: 9.5, color: MUTED }}>Patient</div></div>
              </div>
              <div style={{ position: "relative", width: 58, height: 58, margin: "0 auto" }}>
                <ProgressRing pct={patientPct} color={TEAL} track={TEAL_LIGHT} />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 }}>{patientPct}%</div>
              </div>
              <div style={{ fontSize: 10.5, color: MUTED, textAlign: "center", marginTop: 8 }}>
                {totalCount > 0 ? `${completedCount}/${totalCount} routines done today` : "No routines scheduled"}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, fontSize: 9.5, color: GREEN_ICON, marginTop: 6, fontWeight: 800 }}>
                <MapPin size={10} /> At home
              </div>
              <button onClick={() => { playTapSound(); alert("Calling Kamala simulation..."); }} style={{ width: "100%", marginTop: 8, border: "none", cursor: "pointer", borderRadius: 10, padding: "8px 0", background: TEAL_LIGHT, color: TEAL, fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                <PhoneCall size={12} /> Call Kamala
              </button>
            </div>

            <div className="fam-card" style={{ background: PANEL, borderRadius: 20, padding: "16px 14px", boxShadow: "0 4px 14px rgba(35,49,43,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg, ${BLUE}, white)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>👩</div>
                <div><div style={{ fontSize: 12.5, fontWeight: 800, color: TEXT_DARK }}>Priya</div><div style={{ fontSize: 9.5, color: MUTED }}>Caregiver</div></div>
              </div>
              <div style={{ position: "relative", width: 58, height: 58, margin: "0 auto" }}>
                <ProgressRing pct={caregiverPct} color={BLUE_ICON} track={BLUE} />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 }}>{caregiverPct}%</div>
              </div>
              <div style={{ fontSize: 10.5, color: MUTED, textAlign: "center", marginTop: 8 }}>6/7 days engaged this week</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, fontSize: 9.5, color: BLUE_ICON, marginTop: 6, fontWeight: 800 }}>
                <TrendingUp size={10} /> Trending up
              </div>
              <button onClick={() => { playTapSound(); alert("Thanked Priya!"); }} style={{ width: "100%", marginTop: 8, border: "none", cursor: "pointer", borderRadius: 10, padding: "8px 0", background: BLUE, color: BLUE_ICON, fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                <ThumbsUp size={12} /> Thank Priya
              </button>
            </div>
          </div>

          {/* Family member strip (multi-caregiver) */}
          <div className="fam-rise" style={{ margin: "14px 20px 0", background: PANEL, borderRadius: 18, padding: "13px 14px", boxShadow: "0 4px 14px rgba(35,49,43,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span className="fam-display" style={{ fontSize: 13, fontWeight: 800, color: TEXT_DARK }}>Family involved</span>
              <button onClick={() => { playTapSound(); setShowAssign(true); }} style={{ display: "flex", alignItems: "center", gap: 4, border: "none", cursor: "pointer", background: TEAL_LIGHT, color: TEAL, borderRadius: 999, padding: "5px 10px", fontSize: 10.5, fontWeight: 800 }}>
                <UserPlus size={11} /> Assign
              </button>
            </div>
            <div style={{ display: "flex", gap: 14 }}>
              {FAMILY.map((f) => (
                <div key={f.name} style={{ textAlign: "center", flex: 1 }}>
                  <div style={{ position: "relative", width: 40, height: 40, margin: "0 auto" }}>
                    <ProgressRing pct={f.pct} size={40} color={f.color} track="#EFECE2" />
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>{f.emoji}</div>
                  </div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: TEXT_DARK, marginTop: 4 }}>{f.name}</div>
                  <div style={{ fontSize: 9, color: MUTED }}>{f.pct}% active</div>
                </div>
              ))}
            </div>
          </div>

          {/* Alert */}
          <div className="fam-rise" style={{ margin: "12px 20px 0", padding: "12px 14px", borderRadius: 16, background: CORAL_LIGHT, display: "flex", gap: 10, alignItems: "flex-start", fontSize: 12, color: "#8A2E24" }}>
            <AlertTriangle size={16} color={CORAL} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>Kamala missed her evening walk yesterday. Priya has been notified.</span>
          </div>

          {/* Monthly trend */}
          <div className="fam-rise" style={{ margin: "12px 20px 0", background: PANEL, borderRadius: 18, padding: "14px 16px", boxShadow: "0 4px 14px rgba(35,49,43,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <span className="fam-display" style={{ fontSize: 13, fontWeight: 800, color: TEXT_DARK }}>4-week trend</span>
              <div style={{ display: "flex", gap: 10, fontSize: 9.5 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4, color: TEAL }}><span style={{ width: 10, height: 2, background: TEAL, display: "inline-block" }} /> Kamala</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, color: BLUE_ICON }}><span style={{ width: 10, height: 2, background: BLUE_ICON, display: "inline-block" }} /> Priya</span>
              </div>
            </div>
            <DualTrend />
          </div>

          {/* Upcoming appointment */}
          <div className="fam-rise" style={{ margin: "12px 20px 0", background: `linear-gradient(120deg, ${PURPLE}, #F7F2FD)`, borderRadius: 18, padding: "13px 14px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: PURPLE_ICON, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <CalendarClock size={17} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: TEXT_DARK }}>Next clinician visit</div>
              <div style={{ fontSize: 10.5, color: MUTED }}>Dr. Sharma · Tue, 3:00 PM · District PHC</div>
            </div>
            <ChevronRight size={16} color={PURPLE_ICON} />
          </div>

          {/* Medicine Verification Status Card */}
          <div className="fam-rise" style={{ margin: "12px 20px 0", background: PANEL, borderRadius: 18, padding: "14px 16px", boxShadow: "0 4px 14px rgba(35,49,43,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: "#FFF3CD", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Pill size={16} color="#E8871E" fill="#E8871E" />
              </div>
              <span className="fam-display" style={{ fontSize: 13, fontWeight: 800, color: TEXT_DARK }}>Medicine Verification</span>
            </div>
            
            {medReminders.length === 0 ? (
              <div style={{ fontSize: 12, color: MUTED, textAlign: "center", padding: "8px 0" }}>No medicine routines scheduled today.</div>
            ) : (
              medReminders.map((r, i) => (
                <div key={r.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderTop: i > 0 ? "1px solid #F1EEE3" : "none" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: TEXT_DARK }}>{r.text}</div>
                    <div style={{ fontSize: 10.5, color: MUTED, marginTop: 2 }}>{r.time}</div>
                  </div>
                  
                  <div>
                    {!r.done ? (
                      <span style={pill("#EFECE2", MUTED)}>Awaiting Given</span>
                    ) : !r.verificationStatus ? (
                      <span style={pill(TEAL_LIGHT, TEAL)}>Taken</span>
                    ) : r.verificationStatus === "Awaiting Verification" ? (
                      <span style={pill("#FFF3CD", "#A87600")}>⏳ Awaiting Patient</span>
                    ) : r.verificationStatus === "Patient Verified" ? (
                      <span style={pill("#E9F5EE", "#1F6B4A")}>✅ Patient Verified</span>
                    ) : (
                      <span style={pill("#FBEAE7", "#A32D2D")}>❌ Patient Denied</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* AI Safety Insights Card */}
          <div onClick={() => { playTapSound(); setShowSafety(true); }} className="fam-rise fam-card" style={{ margin: "12px 20px 0", background: `linear-gradient(120deg, ${TEAL_LIGHT}, #F3FAF8)`, borderRadius: 18, padding: "13px 14px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", border: `1px solid ${TEAL}22` }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: TEAL, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Brain size={17} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: TEXT_DARK }}>Safety & AI Insights</div>
              <div style={{ fontSize: 10.5, color: MUTED }}>Geofence safe zone · Wearable stats · Speech analysis</div>
            </div>
            <ChevronRight size={16} color={TEAL} />
          </div>

          {/* Feed filter tabs */}
          <div style={{ padding: "16px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div className="fam-display" style={{ fontSize: 15, fontWeight: 800, color: TEXT_DARK }}>Family activity</div>
            <div style={{ display: "flex", gap: 4, background: "white", borderRadius: 999, padding: 3, boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>
              {[["both", "All"], ["patient", "Kamala"], ["caregiver", "Priya"]].map(([key, label]) => (
                <button key={key} onClick={() => { playTapSound(); setTab(key); }} style={{ border: "none", cursor: "pointer", borderRadius: 999, padding: "5px 10px", fontSize: 10.5, fontWeight: 800, background: tab === key ? TEAL : "transparent", color: tab === key ? "white" : MUTED }}>{label}</button>
              ))}
            </div>
          </div>

          <div style={{ padding: "12px 20px 0" }}>
            {filteredFeed.map((f, i) => (
              <div key={i} className="fam-card" style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 4px" }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: `${f.color}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <f.icon size={15} color={f.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, color: TEXT_DARK, fontWeight: 600 }}>{f.text}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10.5, color: MUTED, marginTop: 2 }}>
                    <Clock size={10} /> {f.time}
                    <span style={pill(f.who === "patient" ? TEAL_LIGHT : BLUE, f.who === "patient" ? TEAL : BLUE_ICON)}>{f.who === "patient" ? "Kamala" : "Priya"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="fam-rise" style={{ display: "flex", gap: 10, padding: "14px 20px 0" }}>
            <button onClick={() => { playTapSound(); alert("Downloading weekly report..."); }} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, border: "none", cursor: "pointer", borderRadius: 14, padding: "12px 0", background: PANEL, boxShadow: "0 4px 12px rgba(35,49,43,0.06)" }}>
              <FileDown size={16} color={TEAL} /><span style={{ fontSize: 10, fontWeight: 800, color: TEXT_DARK }}>Weekly report</span>
            </button>
            <button onClick={() => { playTapSound(); alert("Opening Family chat..."); }} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, border: "none", cursor: "pointer", borderRadius: 14, padding: "12px 0", background: PANEL, boxShadow: "0 4px 12px rgba(35,49,43,0.06)" }}>
              <MessageCircle size={16} color={BLUE_ICON} /><span style={{ fontSize: 10, fontWeight: 800, color: TEXT_DARK }}>Family chat</span>
            </button>
            <button onClick={() => { playTapSound(); setShowAssign(true); }} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, border: "none", cursor: "pointer", borderRadius: 14, padding: "12px 0", background: PANEL, boxShadow: "0 4px 12px rgba(35,49,43,0.06)" }}>
              <UserPlus size={16} color={PURPLE_ICON} /><span style={{ fontSize: 10, fontWeight: 800, color: TEXT_DARK }}>Assign task</span>
            </button>
          </div>

          {/* Clinician sync note */}
          <div className="fam-rise" style={{ margin: "14px 20px 20px", padding: "13px 14px", borderRadius: 16, background: YELLOW, display: "flex", gap: 10, alignItems: "flex-start", fontSize: 11.5, color: "#6B5424" }}>
            <TrendingUp size={16} color={YELLOW_ICON} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>Everyone's weekly summaries are shared with the PHC clinician automatically.</span>
          </div>

          {showAssign && <AssignTaskSheet onClose={() => setShowAssign(false)} />}
        </div>
      </div>
    </div>
  );
}
