import React, { useState } from "react";
import {
  ArrowLeft, Plus, Pill, Utensils, Footprints, Gamepad2, Clock, Check,
  RefreshCw, TrendingUp, PhoneCall, Video, Heart, X, Trash2, Stethoscope,
  ChevronDown, PackageOpen, NotebookPen, Sparkles, Repeat, Brain, ChevronRight
} from "lucide-react";
import { playTapSound } from "../utils/audio";
import AiSafetyInsightsScreen from "./AiSafetyInsightsScreen";

/* ---------------- Design tokens (same family as Memro) ---------------- */
const CREAM = "#FBF8F0";
const PANEL = "#FFFFFF";
const TEAL = "#0E5C52";
const TEAL_LIGHT = "#DCEFEA";
const PEACH = "#FDE8D9";
const PEACH_ICON = "#E07B33";
const BLUE = "#DDEAF8";
const BLUE_ICON = "#3E7FB0";
const YELLOW = "#FBF0CE";
const YELLOW_ICON = "#C99A2E";
const GREEN_PASTEL = "#E2F0DE";
const GREEN_ICON = "#5C9A57";
const PURPLE = "#EEE8FA";
const PURPLE_ICON = "#7A5FAE";
const TEXT_DARK = "#23312B";
const MUTED = "#7C8A80";
const RED = "#E4574B";
const RED_LIGHT = "#FBE4E1";

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@500;600;700;800&display=swap');
    .cg-root, .cg-root * { font-family: 'Nunito', system-ui, sans-serif; box-sizing: border-box; }
    .cg-display { font-family: 'Baloo 2', 'Nunito', system-ui, sans-serif; }
    @keyframes cg-rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes cg-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes cg-pop { 0% { opacity: 0; transform: scale(0.85); } 100% { opacity: 1; transform: scale(1); } }
    .cg-rise { animation: cg-rise 0.5s cubic-bezier(.2,.8,.2,1) both; }
    .cg-card { transition: transform 0.15s ease, box-shadow 0.15s ease; }
    .cg-card:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(35,49,43,0.1); }
    @media (prefers-reduced-motion: reduce) {
      .cg-root *, .cg-root *::before, .cg-root *::after {
        animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important;
      }
    }
  `}</style>
);

const CATEGORY = {
  medicine: { icon: Pill, color: RED, bg: RED_LIGHT, label: "Medicine" },
  meal: { icon: Utensils, color: PEACH_ICON, bg: PEACH, label: "Meal" },
  walk: { icon: Footprints, color: GREEN_ICON, bg: GREEN_PASTEL, label: "Activity" },
  game: { icon: Gamepad2, color: BLUE_ICON, bg: BLUE, label: "Cognitive game" },
};

const TEMPLATES = [
  { time: "08:00", text: "Morning tablets", cat: "medicine", repeat: "Daily" },
  { time: "08:30", text: "Breakfast", cat: "meal", repeat: "Daily" },
  { time: "17:30", text: "Evening walk", cat: "walk", repeat: "Daily" },
  { time: "20:30", text: "Night tablets", cat: "medicine", repeat: "Daily" },
];

const PATIENTS = [
  { name: "Kamala", relation: "Mother", emoji: "👵" },
  { name: "Suresh", relation: "Father-in-law", emoji: "👴" },
];

function pill(bg, color) {
  return { display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 11px", borderRadius: 999, background: bg, color, fontSize: 11, fontWeight: 800 };
}

function ProgressRing({ pct, size = 66 }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke={TEAL_LIGHT} strokeWidth="7" fill="none" />
      <circle cx={size / 2} cy={size / 2} r={r} stroke={TEAL} strokeWidth="7" fill="none" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c - (pct / 100) * c} style={{ transition: "stroke-dashoffset 0.8s ease" }} />
    </svg>
  );
}

function AddRoutineSheet({ onClose, onAdd, prefill }) {
  const [time, setTime] = useState(prefill?.time || "08:00");
  const [text, setText] = useState(prefill?.text || "");
  const [cat, setCat] = useState(prefill?.cat || "medicine");
  const [repeat, setRepeat] = useState(prefill?.repeat || "Once");

  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(20,30,26,0.5)", zIndex: 20, display: "flex", alignItems: "flex-end" }}>
      <div className="cg-rise" style={{ background: "white", width: "100%", borderRadius: "26px 26px 0 0", padding: "20px 20px 24px", maxHeight: "88%", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div className="cg-display" style={{ fontSize: 17, fontWeight: 800, color: TEXT_DARK }}>Add a routine</div>
          <button onClick={() => { playTapSound(); onClose(); }} aria-label="Close" style={{ border: "none", background: TEAL_LIGHT, borderRadius: 10, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={16} color={TEAL} />
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {Object.entries(CATEGORY).map(([key, c]) => (
            <button key={key} onClick={() => { playTapSound(); setCat(key); }} style={{
              flex: 1, border: "none", cursor: "pointer", borderRadius: 14, padding: "10px 0",
              background: cat === key ? c.color : c.bg, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            }}>
              <c.icon size={17} color={cat === key ? "white" : c.color} />
              <span style={{ fontSize: 9.5, fontWeight: 800, color: cat === key ? "white" : TEXT_DARK }}>{c.label}</span>
            </button>
          ))}
        </div>

        <label style={{ fontSize: 12, fontWeight: 700, color: MUTED }}>What should they do?</label>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. Take blood pressure tablet"
          style={{ width: "100%", padding: "13px 14px", borderRadius: 14, border: `2px solid ${TEAL_LIGHT}`, fontSize: 15, marginTop: 6, marginBottom: 14, outline: "none" }} />

        <label style={{ fontSize: 12, fontWeight: 700, color: MUTED }}>Time</label>
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
          style={{ width: "100%", padding: "13px 14px", borderRadius: 14, border: `2px solid ${TEAL_LIGHT}`, fontSize: 15, marginTop: 6, marginBottom: 14, outline: "none" }} />

        <label style={{ fontSize: 12, fontWeight: 700, color: MUTED, display: "flex", alignItems: "center", gap: 5 }}><Repeat size={12} /> Repeat</label>
        <div style={{ display: "flex", gap: 8, marginTop: 6, marginBottom: 18 }}>
          {["Once", "Daily", "Weekly"].map((r) => (
            <button key={r} onClick={() => { playTapSound(); setRepeat(r); }} style={{
              flex: 1, border: "none", cursor: "pointer", borderRadius: 12, padding: "9px 0", fontSize: 12, fontWeight: 800,
              background: repeat === r ? TEAL : TEAL_LIGHT, color: repeat === r ? "white" : TEAL,
            }}>{r}</button>
          ))}
        </div>

        <button
          onClick={() => { playTapSound(); if (text.trim()) onAdd({ time, text, cat, repeat }); }}
          style={{ width: "100%", border: "none", cursor: "pointer", borderRadius: 14, padding: "14px 0", background: TEAL, color: "white", fontSize: 15, fontWeight: 800 }}
        >Save & sync</button>
      </div>
    </div>
  );
}

export default function CaregiverRoutineScreen({ onExit, reminders = [], setReminders }) {
  const [patient, setPatient] = useState(PATIENTS[0]);
  const [showPatientMenu, setShowPatientMenu] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [prefill, setPrefill] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [showSafety, setShowSafety] = useState(false);
  const [medicines, setMedicines] = useState([
    { name: "Amlodipine (BP)", left: 6, low: true },
    { name: "Donepezil", left: 18, low: false },
  ]);
  const [notes, setNotes] = useState([
    { text: "Seemed a bit confused about the day of the week this morning.", time: "Yesterday" },
  ]);
  const [noteText, setNoteText] = useState("");

  const completed = reminders.filter((r) => r.done).length;
  const pct = reminders.length > 0 ? Math.round((completed / reminders.length) * 100) : 0;

  const weekEngagement = [
    { d: "M", done: true }, { d: "T", done: true }, { d: "W", done: true },
    { d: "T", done: false }, { d: "F", done: true }, { d: "S", done: true }, { d: "S", done: null },
  ];
  const weekPct = Math.round((weekEngagement.filter((d) => d.done).length / 6) * 100);
  const streak = 6;

  if (showSafety) {
    return <AiSafetyInsightsScreen onBack={() => setShowSafety(false)} />;
  }

  function addRoutine(r) {
    let formattedTime = r.time;
    if (r.time && r.time.includes(":")) {
      const [hrs, mins] = r.time.split(":");
      const h = parseInt(hrs);
      const ampm = h >= 12 ? "PM" : "AM";
      const displayHour = h % 12 || 12;
      formattedTime = `${displayHour}:${mins} ${ampm}`;
    }
    const newId = reminders.length > 0 ? Math.max(...reminders.map((x) => x.id)) + 1 : 1;
    const newReminder = {
      id: newId,
      time: formattedTime,
      text: r.text,
      cat: r.cat || "medicine",
      repeat: r.repeat || "Once",
      done: false,
    };
    setReminders((prev) => [...prev, newReminder]);
    setShowAdd(false);
    setPrefill(null);
    setSyncing(true);
    setTimeout(() => setSyncing(false), 1400);
  }

  function removeRoutine(id) {
    playTapSound();
    setReminders((rs) => rs.filter((r) => r.id !== id));
  }

  function toggleRoutine(id) {
    playTapSound();
    setReminders((rs) => rs.map((r) => {
      if (r.id === id) {
        const isDone = !r.done;
        return {
          ...r,
          done: isDone,
          verificationStatus: isDone && r.cat === "medicine" ? "Awaiting Verification" : undefined
        };
      }
      return r;
    }));
  }

  function addNote() {
    playTapSound();
    if (!noteText.trim()) return;
    setNotes((n) => [{ text: noteText, time: "Just now" }, ...n]);
    setNoteText("");
  }

  return (
    <div className="app-container">
      <GlobalStyle />
      <div className="phone-mockup">
        <div style={{ flex: 1, overflowY: "auto", background: CREAM, position: "relative", paddingBottom: 24 }}>

          {/* Top bar with patient switcher (multi-patient support) */}
          <div style={{ padding: "18px 20px 0", display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => { playTapSound(); if (onExit) onExit(); }} aria-label="Back" style={{ border: "none", background: "white", borderRadius: 12, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.06)", cursor: "pointer" }}>
              <ArrowLeft size={18} color={TEXT_DARK} />
            </button>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: MUTED, fontWeight: 700 }}>Caregiver · Memro</div>
              <div className="cg-display" style={{ fontSize: 17, fontWeight: 800, color: TEXT_DARK }}>{patient.name}'s day</div>
            </div>
            <button onClick={() => { playTapSound(); setShowPatientMenu((s) => !s); }} style={{ display: "flex", alignItems: "center", gap: 4, border: "none", cursor: "pointer", background: "white", borderRadius: 999, padding: "3px 8px 3px 4px", boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}>
              <span style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg, ${TEAL_LIGHT}, white)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{patient.emoji}</span>
              <ChevronDown size={11} color={MUTED} />
            </button>
          </div>

          {showPatientMenu && (
            <div className="cg-rise" style={{ margin: "8px 20px 0", background: PANEL, borderRadius: 16, boxShadow: "0 8px 20px rgba(35,49,43,0.12)", overflow: "hidden" }}>
              {PATIENTS.map((p) => (
                <button key={p.name} onClick={() => { playTapSound(); setPatient(p); setShowPatientMenu(false); }} style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10, border: "none", cursor: "pointer",
                  padding: "11px 14px", background: p.name === patient.name ? TEAL_LIGHT : "white", textAlign: "left",
                }}>
                  <span style={{ fontSize: 18 }}>{p.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: TEXT_DARK }}>{p.name}</div>
                    <div style={{ fontSize: 10, color: MUTED }}>{p.relation}</div>
                  </div>
                  {p.name === patient.name && <Check size={15} color={TEAL} />}
                </button>
              ))}
            </div>
          )}

          {/* Sync status */}
          <div className="cg-rise" style={{
            margin: "14px 20px 0", display: "flex", alignItems: "center", gap: 8, padding: "9px 14px",
            borderRadius: 999, background: syncing ? YELLOW : TEAL_LIGHT, color: syncing ? "#8A6A1A" : TEAL,
            fontSize: 12, fontWeight: 800,
          }}>
            <RefreshCw size={13} style={{ animation: syncing ? "cg-spin 0.9s linear infinite" : "none" }} />
            {syncing ? `Syncing to ${patient.name}'s app…` : `Synced — ${patient.name}'s app is up to date`}
          </div>

          {/* Patient progress */}
          <div className="cg-rise" style={{
            margin: "14px 20px 0", background: PANEL, borderRadius: 20, padding: "16px 16px",
            display: "flex", alignItems: "center", gap: 14, boxShadow: "0 4px 14px rgba(35,49,43,0.06)",
          }}>
            <div style={{ position: "relative", width: 66, height: 66, flexShrink: 0 }}>
              <ProgressRing pct={pct} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: TEXT_DARK }}>{completed}/{reminders.length}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div className="cg-display" style={{ fontSize: 14.5, fontWeight: 700, color: TEXT_DARK }}>{patient.name}'s progress today</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>Ticks off as they mark each one done</div>
            </div>
            <TrendingUp size={18} color={TEAL} />
          </div>

          {/* Quick templates */}
          <div style={{ padding: "16px 20px 0" }}>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: MUTED, marginBottom: 8 }}>QUICK ADD</div>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
              {TEMPLATES.map((t, i) => {
                const IconComponent = CATEGORY[t.cat].icon;
                return (
                  <button key={i} onClick={() => { playTapSound(); setPrefill(t); setShowAdd(true); }} style={{
                    flexShrink: 0, display: "flex", alignItems: "center", gap: 6, border: "none", cursor: "pointer",
                    borderRadius: 999, padding: "7px 12px", background: CATEGORY[t.cat].bg, color: TEXT_DARK, fontSize: 11.5, fontWeight: 700,
                  }}>
                    <IconComponent size={12} color={CATEGORY[t.cat].color} /> {t.text}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Routine list */}
          <div style={{ padding: "14px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div className="cg-display" style={{ fontSize: 15, fontWeight: 800, color: TEXT_DARK }}>Today's routine</div>
            <button onClick={() => { playTapSound(); setPrefill(null); setShowAdd(true); }} style={{
              display: "flex", alignItems: "center", gap: 5, border: "none", cursor: "pointer", borderRadius: 999,
              padding: "7px 13px", background: TEAL, color: "white", fontSize: 12, fontWeight: 800,
            }}><Plus size={13} /> Add routine</button>
          </div>

          <div style={{ padding: "10px 20px 0" }}>
            {reminders.map((r) => {
              const c = CATEGORY[r.cat] || CATEGORY.medicine;
              return (
                <div key={r.id} className="cg-card" style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 16,
                  background: r.done ? GREEN_PASTEL : c.bg, marginBottom: 10,
                }}>
                  {/* Left Toggle Circle */}
                  <div 
                    onClick={() => toggleRoutine(r.id)}
                    style={{ 
                      width: 36, 
                      height: 36, 
                      borderRadius: 11, 
                      background: r.done ? GREEN_ICON : c.color, 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      flexShrink: 0,
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                    title={r.done ? "Mark undone" : "Mark done"}
                  >
                    {r.done ? <Check size={17} color="white" /> : <c.icon size={16} color="white" />}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: TEXT_DARK, textDecoration: r.done ? "line-through" : "none", opacity: r.done ? 0.65 : 1 }}>{r.text}</div>
                    
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 4, fontSize: 11, color: MUTED, marginTop: 2 }}>
                      <Clock size={11} /> {r.time} · {r.done ? "Marked done" : "Waiting"}
                      {r.repeat && r.repeat !== "Once" && <span style={pill(TEAL_LIGHT, TEAL)}><Repeat size={9} /> {r.repeat}</span>}
                    </div>

                    {/* Verification Action for Caregiver */}
                    {r.cat === "medicine" && !r.done && (
                      <div style={{ marginTop: 6 }}>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            playTapSound();
                            setReminders((rs) => rs.map((rem) => 
                              rem.id === r.id ? { ...rem, done: true, verificationStatus: "Awaiting Verification" } : rem
                            ));
                          }}
                          style={{
                            padding: "6px 12px",
                            borderRadius: 8,
                            border: "none",
                            background: RED,
                            color: "white",
                            fontSize: 11,
                            fontWeight: 800,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            boxShadow: "0 2px 4px rgba(228,87,75,0.2)"
                          }}
                        >
                          <Pill size={11} />
                          Medicine Given
                        </button>
                      </div>
                    )}

                    {/* Verification Status Badge */}
                    {r.done && r.cat === "medicine" && r.verificationStatus && (
                      <div style={{ marginTop: 6, display: "flex" }}>
                        {r.verificationStatus === "Awaiting Verification" && (
                          <span style={pill("#FFF3CD", "#856404")}>
                            ⏳ Awaiting Verification
                          </span>
                        )}
                        {r.verificationStatus === "Patient Verified" && (
                          <span style={pill("#D4EDDA", "#155724")}>
                            ✅ Patient Verified
                          </span>
                        )}
                        {r.verificationStatus === "Patient Denied" && (
                          <span style={pill("#F8D7DA", "#721C24")}>
                            ❌ Patient Denied
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <button onClick={() => removeRoutine(r.id)} aria-label="Remove routine" style={{ border: "none", background: "transparent", cursor: "pointer", padding: 4 }}>
                    <Trash2 size={15} color={MUTED} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Medicine stock tracker */}
          <div className="cg-rise" style={{ margin: "6px 20px 0", background: PANEL, borderRadius: 20, padding: "16px 16px", boxShadow: "0 4px 14px rgba(35,49,43,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <PackageOpen size={16} color={PEACH_ICON} />
              <span className="cg-display" style={{ fontSize: 14.5, fontWeight: 700, color: TEXT_DARK }}>Medicine stock</span>
            </div>
            {medicines.map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderTop: i > 0 ? "1px solid #F1EEE3" : "none" }}>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: TEXT_DARK }}>{m.name}</div>
                  <div style={{ fontSize: 10.5, color: m.low ? RED : MUTED }}>{m.left} tablets left{m.low ? " · reorder soon" : ""}</div>
                </div>
                {m.low ? (
                  <button onClick={() => { playTapSound(); alert("Ordered medicine: " + m.name); }} style={{ border: "none", cursor: "pointer", borderRadius: 999, padding: "6px 12px", background: RED, color: "white", fontSize: 10.5, fontWeight: 800 }}>Reorder</button>
                ) : (
                  <span style={pill(GREEN_PASTEL, GREEN_ICON)}>OK</span>
                )}
              </div>
            ))}
          </div>

          {/* AI Safety Insights Card */}
          <div onClick={() => { playTapSound(); setShowSafety(true); }} className="cg-rise cg-card" style={{ margin: "12px 20px 0", background: `linear-gradient(120deg, ${TEAL_LIGHT}, #F3FAF8)`, borderRadius: 18, padding: "13px 14px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", border: `1px solid ${TEAL}22`, boxShadow: "0 4px 14px rgba(35,49,43,0.06)" }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: TEAL, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Brain size={17} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: TEXT_DARK }}>Safety & AI Insights</div>
              <div style={{ fontSize: 10.5, color: MUTED }}>Geofence safe zone · Wearable stats · Speech analysis</div>
            </div>
            <ChevronRight size={16} color={TEAL} />
          </div>

          {/* Your engagement */}
          <div className="cg-pop" style={{ margin: "12px 20px 0", background: PANEL, borderRadius: 20, padding: "16px 16px", boxShadow: "0 4px 14px rgba(35,49,43,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div className="cg-display" style={{ fontSize: 14.5, fontWeight: 800, color: TEXT_DARK }}>Your engagement this week</div>
              <span style={pill(TEAL_LIGHT, TEAL)}><Heart size={11} /> {weekPct}%</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {weekEngagement.map((d, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 4px", background: d.done === true ? TEAL : d.done === false ? RED_LIGHT : TEAL_LIGHT,
                  }}>{d.done === true && <Check size={13} color="white" />}</div>
                  <div style={{ fontSize: 10, color: MUTED }}>{d.d}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button onClick={() => { playTapSound(); alert("Checking in simulation..."); }} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, border: "none", cursor: "pointer", borderRadius: 12, padding: "10px 0", background: TEAL_LIGHT, color: TEAL, fontSize: 12.5, fontWeight: 800 }}>
                <PhoneCall size={14} /> Check in
              </button>
              <button onClick={() => { playTapSound(); alert("Starting video call simulation..."); }} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, border: "none", cursor: "pointer", borderRadius: 12, padding: "10px 0", background: BLUE, color: BLUE_ICON, fontSize: 12.5, fontWeight: 800 }}>
                <Video size={14} /> Video call
              </button>
            </div>
          </div>

          {/* Caregiver self-care nudge */}
          <div className="cg-rise" style={{
            margin: "12px 20px 0", background: `linear-gradient(120deg, ${PURPLE}, #F7F2FD)`, borderRadius: 18, padding: "14px 16px",
            display: "flex", gap: 12, alignItems: "flex-start",
          }}>
            <Sparkles size={17} color={PURPLE_ICON} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: "#4B3B72" }}>You've checked in {streak} days straight 💜</div>
              <div style={{ fontSize: 11.5, color: "#4B3B72", marginTop: 3, lineHeight: 1.5 }}>Caring for someone is tiring too. Take a 10-minute break for yourself today — it helps you both.</div>
            </div>
          </div>

          {/* Observations for clinician */}
          <div className="cg-rise" style={{ margin: "12px 20px 0", background: PANEL, borderRadius: 20, padding: "16px 16px", boxShadow: "0 4px 14px rgba(35,49,43,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <NotebookPen size={16} color={BLUE_ICON} />
              <span className="cg-display" style={{ fontSize: 14.5, fontWeight: 700, color: TEXT_DARK }}>Notes for the clinician</span>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <input value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Anything unusual today?"
                style={{ flex: 1, padding: "10px 12px", borderRadius: 12, border: `2px solid ${TEAL_LIGHT}`, fontSize: 12.5, outline: "none" }} />
              <button onClick={addNote} style={{ border: "none", cursor: "pointer", borderRadius: 12, padding: "0 14px", background: TEAL, color: "white", fontSize: 12, fontWeight: 800 }}>Add</button>
            </div>
            {notes.map((n, i) => (
              <div key={i} style={{ padding: "8px 0", borderTop: i > 0 ? "1px solid #F1EEE3" : "none" }}>
                <div style={{ fontSize: 12, color: TEXT_DARK }}>{n.text}</div>
                <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>{n.time}</div>
              </div>
            ))}
          </div>

          {/* Clinician visibility note */}
          <div className="cg-rise" style={{
            margin: "14px 20px 20px", padding: "13px 14px", borderRadius: 16, background: YELLOW,
            display: "flex", gap: 10, alignItems: "flex-start", fontSize: 12, color: "#6B5424",
          }}>
            <Stethoscope size={16} color={YELLOW_ICON} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>Shared with the PHC clinician: {patient.name}'s completion rate, your engagement, and your notes.</span>
          </div>

          {showAdd && <AddRoutineSheet onClose={() => { setShowAdd(false); setPrefill(null); }} onAdd={addRoutine} prefill={prefill} />}
        </div>
      </div>
    </div>
  );
}
