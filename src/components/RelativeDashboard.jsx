import React, { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea,
} from "recharts";
import {
  Bell, Search, PhoneCall, MessageCircle, Video, Download, AlertTriangle, Check,
  TrendingUp, Gamepad2, BookHeart, Pill, Trophy, Stethoscope, Settings, LayoutGrid,
  FileText, ChevronDown, Plus, Calendar, Heart, MapPin, X, LogOut, Users
} from "lucide-react";
import { playTapSound, playMatchSound } from "../utils/audio";
import { CAREGIVER_TRANS, PHC_CENTERS } from "./CaregiverScreen";

// ---------- Design tokens (same brand as the Memro patient app) ----------
const TEAL = "#0B5D6B";
const TEAL_DARK = "#07414C";
const TEAL_LIGHT = "#EAF5F5";
const AMBER = "#E8871E";
const AMBER_LIGHT = "#FCEFDC";
const CORAL = "#E0604D";
const CORAL_LIGHT = "#FBEAE7";
const GREEN = "#3A9469";
const GREEN_LIGHT = "#E9F5EE";
const PURPLE = "#6B5FC4";
const PURPLE_LIGHT = "#EFEDFA";
const TEXT_DARK = "#1B2B2E";
const MUTED = "#6B7E82";
const BORDER = "#E7E4DA";
const BG = "#F6F4EE";

const patients = [
  { name: "Amma", relation: "Mother", status: "online", initial: "A" },
  { name: "Bapu", relation: "Father-in-law", status: "offline", initial: "B" },
];

function Card({ children, style }) {
  return (
    <div style={{
      background: "white", borderRadius: 18, border: `1px solid ${BORDER}`,
      boxShadow: "0 1px 3px rgba(20,30,32,0.04)", ...style,
    }}>{children}</div>
  );
}

function SectionLabel({ children, right }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: TEXT_DARK }}>{children}</div>
      {right}
    </div>
  );
}

function ActionBtn({ icon: Icon, label, color, filled, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flex: 1,
      padding: "11px 14px", borderRadius: 12, border: filled ? "none" : `1.5px solid ${BORDER}`,
      background: filled ? color : "white", color: filled ? "white" : TEXT_DARK,
      fontSize: 13.5, fontWeight: 700, cursor: "pointer",
    }}>
      <Icon size={16} /> {label}
    </button>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      background: TEAL_DARK, color: "white", padding: "8px 12px", borderRadius: 10, fontSize: 12.5,
      boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
    }}>
      <div style={{ fontWeight: 800 }}>{label}</div>
      <div>Index: {payload[0].value}</div>
    </div>
  );
}

export default function RelativeDashboard({
  reminders = [],
  mood = "",
  gameHistory = [],
  isOnline = true,
  syncQueue = 0,
  language = "en",
  onSwitchRole,
  onExit,
  isFamilyMode = false
}) {
  const [activePatient, setActivePatient] = useState(0);
  const patient = patients[activePatient];

  // Modals & Action States
  const [showClinicianReport, setShowClinicianReport] = useState(false);
  const [showPhcAlert, setShowPhcAlert] = useState(false);
  const [selectedPhc, setSelectedPhc] = useState("guwahati");
  const [urgencyLevel, setUrgencyLevel] = useState("medium");
  const [customVocalNotes, setCustomVocalNotes] = useState("");
  const [dispatchStatus, setDispatchStatus] = useState("idle"); // idle | sending | completed
  const [dispatchId, setDispatchId] = useState("");

  const LANGUAGE_FALLBACKS = {
    karbi: "as", mising: "as", nyishi: "hi", adi: "hi", apatani: "hi", monpa: "hi", galo: "hi",
    tangkhul: "mni", thadou: "mni", paite: "mni", hmar: "mni", khasi: "en", garo: "en",
    jaintia: "en", mizo: "en", lai: "en", mara: "en", nagamese: "as", ao: "en", angami: "en",
    sumi: "en", lotha: "en", konyak: "en", kokborok: "bn", sikkimese: "ne", lepcha: "ne"
  };

  const resolvedLang = LANGUAGE_FALLBACKS[language] || language || "en";
  const t = CAREGIVER_TRANS[resolvedLang] || CAREGIVER_TRANS["en"];

  // Real data state computation
  const hasHistory = gameHistory.length > 0;
  const latestGameScore = hasHistory ? gameHistory[0].score : null;

  // 8-week cognitive trend mapping
  const defaultWeeks = [
    { week: "Wk 1", score: 78 }, { week: "Wk 2", score: 81 }, { week: "Wk 3", score: 79 },
    { week: "Wk 4", score: 75 }, { week: "Wk 5", score: 71 }, { week: "Wk 6", score: 68 },
    { week: "Wk 7", score: 69 }, { week: "Wk 8", score: 64 },
  ];
  const trendData = [...defaultWeeks];
  if (latestGameScore && patient.name === "Amma") {
    trendData[7] = { week: "Today", score: latestGameScore };
  }

  // Calculate compliance rate
  const completedReminders = reminders.filter(r => r.done).length;
  const complianceRate = reminders.length > 0
    ? Math.round((completedReminders / reminders.length) * 100)
    : 92;

  // Map reminders to meds
  const medsData = patient.name === "Amma" && reminders && reminders.length > 0
    ? reminders.map(r => ({
        time: r.time,
        text: r.text,
        taken: r.done,
        verificationStatus: r.verificationStatus,
        cat: r.cat
      }))
    : [
        { time: "8:00 AM", text: "Blood pressure tablet", taken: true, verificationStatus: "Patient Verified", cat: "medicine" },
        { time: "1:00 PM", text: "Vitamin supplement", taken: true, verificationStatus: "Patient Verified", cat: "medicine" },
        { time: "8:30 PM", text: "Evening tablet", taken: false, verificationStatus: undefined, cat: "medicine" },
      ];

  // Activities blending
  const activityData = [];
  if (patient.name === "Amma" && gameHistory && gameHistory.length > 0) {
    gameHistory.slice(0, 3).forEach((g) => {
      activityData.push({
        icon: Gamepad2,
        text: `Played ${g.gameName || "Memory Match"} — Score: ${g.score} (${g.difficulty})`,
        time: `Today, ${g.date || "recent"}`,
        color: TEAL
      });
    });
  }
  activityData.push(
    { icon: BookHeart, text: "Recorded a memory — “The Bihu festival, 1978”", time: "Yesterday, 6:40 PM", color: CORAL },
    { icon: Pill, text: "Marked evening tablet as not yet taken", time: "Yesterday, 8:45 PM", color: AMBER },
    { icon: Trophy, text: "Unlocked badge — Memory Champion", time: "2 days ago", color: "#B98A2E" }
  );

  // Cognitive Index
  const cognitiveIndex = patient.name === "Amma" && latestGameScore
    ? latestGameScore
    : 64;

  // Mood today
  const moodToday = patient.name === "Amma" && mood
    ? mood
    : "🙂 Okay";

  const domains = [
    { label: t.domains?.Memory || "Memory", pct: latestGameScore ? Math.min(100, Math.round(latestGameScore * 1.1)) : 80, color: TEAL },
    { label: t.domains?.Attention || "Attention", pct: 65, color: AMBER },
    { label: t.domains?.Language || "Language", pct: 90, color: GREEN },
    { label: t.domains?.["Sound recall"] || "Sound recall", pct: 72, color: PURPLE },
  ];

  const activePhc = PHC_CENTERS.find(p => p.id === selectedPhc) || PHC_CENTERS[0];

  const handleSendPhcEscalation = (e) => {
    if (e) e.preventDefault();
    playTapSound();
    setDispatchStatus("sending");

    setTimeout(() => {
      playMatchSound();
      setDispatchStatus("completed");
      setDispatchId("PHC-" + Math.floor(100000 + Math.random() * 900000));
    }, 1500);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: BG, fontFamily: "-apple-system, Segoe UI, Roboto, sans-serif", width: "100%" }}>

      {/* ---------------- Sidebar ---------------- */}
      <div style={{ width: 240, background: TEAL_DARK, color: "white", display: "flex", flexDirection: "column", padding: "26px 18px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 34, paddingLeft: 4 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10, background: AMBER, display: "flex",
            alignItems: "center", justifyContent: "center", fontSize: 17,
          }}>🪔</div>
          <div style={{ fontFamily: "Cambria, Georgia, serif", fontSize: 19, fontWeight: 700 }}>Memro</div>
        </div>

        <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.5)", letterSpacing: 0.6, marginBottom: 10, paddingLeft: 4 }}>MENU</div>
        {[
          [LayoutGrid, "Dashboard", true],
          [FileText, "Reports", false, () => { playTapSound(); setShowClinicianReport(true); }],
          [Calendar, "Appointments", false],
          [Settings, "Settings", false],
        ].map(([Icon, label, active, onClick]) => (
          <div key={label} onClick={onClick} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", borderRadius: 12,
            background: active ? "rgba(255,255,255,0.12)" : "transparent", marginBottom: 4, cursor: "pointer",
            fontSize: 14, fontWeight: active ? 700 : 500, color: active ? "white" : "rgba(255,255,255,0.7)",
          }}>
            <Icon size={17} /> {label}
          </div>
        ))}

        <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.5)", letterSpacing: 0.6, margin: "22px 0 10px", paddingLeft: 4 }}>APP VIEW</div>
        <div
          onClick={() => { playTapSound(); onSwitchRole("patient"); }}
          style={{
            display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12,
            background: "transparent", marginBottom: 4, cursor: "pointer", fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.7)"
          }}
        >
          <Heart size={17} /> Patient App
        </div>
        <div
          onClick={() => { playTapSound(); onSwitchRole("clinician"); }}
          style={{
            display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12,
            background: "transparent", marginBottom: 4, cursor: "pointer", fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.7)"
          }}
        >
          <Stethoscope size={17} /> Clinician View
        </div>
        <div
          onClick={() => { playTapSound(); onSwitchRole(isFamilyMode ? "family_mobile" : "caregiver_mobile"); }}
          style={{
            display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12,
            background: "transparent", marginBottom: 4, cursor: "pointer", fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.7)"
          }}
        >
          {isFamilyMode ? <Users size={17} /> : <PhoneCall size={17} />} {isFamilyMode ? "Mobile Family View" : "Mobile Routine View"}
        </div>

        <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.5)", letterSpacing: 0.6, margin: "22px 0 10px", paddingLeft: 4 }}>YOUR FAMILY</div>
        {patients.map((p, i) => (
          <div
            key={p.name} onClick={() => { playTapSound(); setActivePatient(i); }}
            style={{
              display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12,
              background: i === activePatient ? "rgba(255,255,255,0.12)" : "transparent", marginBottom: 4, cursor: "pointer",
            }}
          >
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%", background: TEAL_LIGHT, color: TEAL_DARK,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800,
              }}>{p.initial}</div>
              <div style={{
                position: "absolute", bottom: -1, right: -1, width: 9, height: 9, borderRadius: "50%",
                background: p.status === "online" ? GREEN : "#8A9A9E", border: `2px solid ${TEAL_DARK}`,
              }} />
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700 }}>{p.name}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>{p.relation}</div>
            </div>
          </div>
        ))}
        <div style={{
          display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12,
          border: "1.5px dashed rgba(255,255,255,0.25)", marginTop: 6, cursor: "pointer",
          fontSize: 13, color: "rgba(255,255,255,0.65)",
        }}><Plus size={15} /> Add a family member</div>

        <div style={{ flex: 1 }} />
        {onExit && (
          <div
            onClick={() => { playTapSound(); onExit(); }}
            style={{
              display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12,
              cursor: "pointer", fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.75)", marginBottom: 10,
            }}
          >
            <LogOut size={17} /> {isFamilyMode ? "Exit Family App" : "Switch to Patient app"}
          </div>
        )}
        <div style={{
          background: "rgba(255,255,255,0.08)", borderRadius: 14, padding: "14px", fontSize: 12,
          color: "rgba(255,255,255,0.75)", lineHeight: 1.5,
        }}>
          🔒 Data stays private — only your family and doctor can see it.
        </div>
      </div>

      {/* ---------------- Main content ---------------- */}
      <div style={{ flex: 1, padding: "28px 36px", overflowY: "auto" }}>

        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: TEXT_DARK }}>{isFamilyMode ? "Welcome back, Family" : "Welcome back, Priya"}</div>
            <div style={{ fontSize: 13.5, color: MUTED, marginTop: 2 }}>Here's how {patient.name} is doing this week</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8, background: "white", border: `1px solid ${BORDER}`,
              borderRadius: 12, padding: "9px 14px", fontSize: 13, color: MUTED,
            }}><Search size={15} /> Search reports…</div>
            <div style={{
              position: "relative", width: 40, height: 40, borderRadius: 12, background: "white",
              border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            }}>
              <Bell size={18} color={TEXT_DARK} />
              <span style={{
                position: "absolute", top: 6, right: 7, width: 7, height: 7, borderRadius: "50%", background: CORAL,
              }} />
            </div>
            <div style={{
              width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${TEAL}, ${TEAL_DARK})`,
              display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: 14,
            }}>P</div>
          </div>
        </div>

        {/* KPI row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
          {[
            ["Reminders completed", `${complianceRate}%`, TrendingUp, TEAL, TEAL_LIGHT],
            ["Games this week", patient.name === "Amma" ? `${gameHistory.length}` : "11", Gamepad2, AMBER, AMBER_LIGHT],
            ["Current cognitive index", `${cognitiveIndex} / 100`, Heart, CORAL, CORAL_LIGHT],
            ["Mood today", moodToday, Bell, PURPLE, PURPLE_LIGHT],
          ].map(([label, value, Icon, color, bg]) => (
            <Card key={label} style={{ padding: "18px 20px" }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: bg, display: "flex", alignItems: "center",
                justifyContent: "center", marginBottom: 14,
              }}><Icon size={17} color={color} /></div>
              <div style={{ fontSize: 22, fontWeight: 800, color: TEXT_DARK }}>{value}</div>
              <div style={{ fontSize: 12.5, color: MUTED, marginTop: 2 }}>{label}</div>
            </Card>
          ))}
        </div>

        {/* Alert */}
        <div style={{
          background: CORAL_LIGHT, borderRadius: 16, padding: "14px 18px", display: "flex", gap: 12,
          alignItems: "center", marginBottom: 22, border: "1px solid #F3CFC7",
        }}>
          <AlertTriangle size={19} color="#A32D2D" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: 13.5, color: "#7A1F1F", flex: 1 }}>
            {patient.name}'s cognitive score has dropped for 2 weeks running. The linked PHC has been notified.
          </div>
          <button onClick={() => { playTapSound(); setShowPhcAlert(true); }} style={{
            border: "none", background: CORAL, color: "white", fontSize: 12.5, fontWeight: 700,
            padding: "8px 14px", borderRadius: 10, cursor: "pointer", flexShrink: 0,
          }}>View details</button>
        </div>

        {/* Main grid: trend + side cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20, marginBottom: 20 }}>

          {/* Trend chart */}
          <Card style={{ padding: "22px 24px" }}>
            <SectionLabel right={<span style={{ fontSize: 12, color: MUTED }}>Typical range: 60–85</span>}>
              8-week cognitive trend
            </SectionLabel>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="#EFECE1" vertical={false} />
                <ReferenceArea y1={60} y2={85} fill={TEAL} fillOpacity={0.06} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: MUTED }} axisLine={{ stroke: BORDER }} tickLine={false} />
                <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="score" stroke={TEAL} strokeWidth={3} dot={{ r: 4, fill: TEAL }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>

            <div style={{ marginTop: 18, paddingTop: 18, borderTop: `1px solid ${BORDER}` }}>
              <SectionLabel>Cognitive domains this week</SectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 24px" }}>
                {domains.map((d) => (
                  <div key={d.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 5 }}>
                      <span style={{ color: TEXT_DARK, fontWeight: 700 }}>{d.label}</span>
                      <span style={{ color: MUTED }}>{d.pct}%</span>
                    </div>
                    <div style={{ height: 7, background: "#EEEEE6", borderRadius: 999, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${d.pct}%`, background: d.color, borderRadius: 999 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Right column: meds + health worker */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Card style={{ padding: "20px 22px" }}>
              <SectionLabel>Today's medicine</SectionLabel>
              {medsData.map((m, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 0",
                  borderBottom: i < medsData.length - 1 ? `1px solid ${BORDER}` : "none",
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center",
                    justifyContent: "center", 
                    background: !m.taken 
                      ? CORAL_LIGHT 
                      : (m.verificationStatus === "Patient Denied" 
                          ? CORAL_LIGHT 
                          : (m.verificationStatus === "Awaiting Verification" 
                              ? AMBER_LIGHT 
                              : GREEN_LIGHT))
                  }}>
                    {!m.taken 
                      ? <AlertTriangle size={14} color={CORAL} /> 
                      : (m.verificationStatus === "Patient Denied" 
                          ? <X size={14} color={CORAL} /> 
                          : (m.verificationStatus === "Awaiting Verification" 
                              ? <Clock size={14} color={AMBER} /> 
                              : <Check size={14} color={GREEN} />))}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: TEXT_DARK }}>{m.text}</div>
                    <div style={{ fontSize: 11, color: MUTED }}>{m.time}</div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                    {m.taken ? (
                      m.verificationStatus ? (
                        m.verificationStatus === "Patient Verified" ? (
                          <span style={{ fontSize: 11, fontWeight: 800, color: "#1F6B4A", background: "#E9F5EE", padding: "3px 8px", borderRadius: 6 }}>
                            Verified ✅
                          </span>
                        ) : m.verificationStatus === "Patient Denied" ? (
                          <span style={{ fontSize: 11, fontWeight: 800, color: "#A32D2D", background: "#FBEAE7", padding: "3px 8px", borderRadius: 6 }}>
                            Denied ❌
                          </span>
                        ) : (
                          <span style={{ fontSize: 11, fontWeight: 800, color: "#A87600", background: "#FFF3CD", padding: "3px 8px", borderRadius: 6 }}>
                            Awaiting ⏳
                          </span>
                        )
                      ) : (
                        <span style={{ fontSize: 11, fontWeight: 800, color: "#1F6B4A" }}>
                          Taken
                        </span>
                      )
                    ) : (
                      <span style={{ fontSize: 11, fontWeight: 800, color: "#A32D2D" }}>
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </Card>

            <Card style={{ padding: "20px 22px" }}>
              <SectionLabel>Linked health worker</SectionLabel>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: "50%", background: TEAL_LIGHT, display: "flex",
                  alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}><Stethoscope size={19} color={TEAL_DARK} /></div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: TEXT_DARK }}>Rina Bora</div>
                  <div style={{ fontSize: 11.5, color: MUTED }}>ASHA worker · District PHC, Assam</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 12 }}>Last visit: 12 days ago</div>
              <button onClick={() => { playTapSound(); alert("A home visit request has been sent to Rina Bora."); }} style={{
                width: "100%", border: `1.5px solid ${TEAL}`, background: "white", color: TEAL_DARK,
                fontSize: 12.5, fontWeight: 700, padding: "9px 0", borderRadius: 10, cursor: "pointer",
              }}>Request a home visit</button>
            </Card>
          </div>
        </div>

        {/* Bottom row: activity + actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20 }}>
          <Card style={{ padding: "20px 24px" }}>
            <SectionLabel>Recent activity</SectionLabel>
            {activityData.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < activityData.length - 1 ? 16 : 0 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 9, background: `${a.color}1A`, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}><a.icon size={15} color={a.color} /></div>
                <div>
                  <div style={{ fontSize: 13, color: TEXT_DARK, lineHeight: 1.4 }}>{a.text}</div>
                  <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </Card>

          <Card style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 10 }}>
            <SectionLabel>Quick actions</SectionLabel>
            <div style={{ display: "flex", gap: 10 }}>
              <ActionBtn icon={PhoneCall} label="Call" color={TEAL} filled onClick={() => { playTapSound(); alert(`Dialing simulation to ${patient.name}...`); }} />
              <ActionBtn icon={Video} label="Video" color={TEAL} onClick={() => { playTapSound(); alert(`Video call simulation to ${patient.name}...`); }} />
            </div>
            <ActionBtn icon={MessageCircle} label="Message" color={AMBER} onClick={() => { playTapSound(); alert(`SMS interface mock for ${patient.name}.`); }} />
            <ActionBtn icon={Calendar} label="Schedule a call for later" color={TEXT_DARK} onClick={() => { playTapSound(); alert("Scheduled a call request simulation."); }} />
            <div style={{ height: 1, background: BORDER, margin: "4px 0" }} />
            <button onClick={() => { playTapSound(); setShowClinicianReport(true); }} style={{
              display: "flex", alignItems: "center", justifycontent: "center", gap: 8, width: "100%",
              padding: "11px 14px", borderRadius: 12, border: "none", background: GREEN, color: "white",
              fontSize: 13.5, fontWeight: 700, cursor: "pointer",
            }}><Download size={16} /> Export report for doctor visit</button>
          </Card>
        </div>

      </div>

      {/* Clinician PDF Modal Overlay */}
      {showClinicianReport && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(35, 49, 43, 0.7)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 120, backdropFilter: "blur(4px)", padding: "20px 10px"
        }}>
          <div className="tp-anim" style={{
            background: "white", width: "100%", maxWidth: 450, borderRadius: 24, padding: 24,
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)", maxHeight: "90%", overflowY: "auto"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, borderBottom: "2px solid #F6F4EE", paddingBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <FileText size={20} color={TEAL} />
                <h3 style={{ fontSize: 16, color: TEXT_DARK, fontWeight: 800 }}>{t.reportTitle}</h3>
              </div>
              <button
                onClick={() => { playTapSound(); setShowClinicianReport(false); }}
                style={{ border: "none", background: TEAL_LIGHT, width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 12, color: TEXT_DARK }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, padding: 10, background: BG, borderRadius: 10 }}>
                <div><strong>{t.patientName}:</strong> {patient.name}</div>
                <div><strong>{t.ageSex}:</strong> 74 / Female</div>
                <div><strong>{t.dateGenerated}:</strong> {new Date().toLocaleDateString()}</div>
                <div><strong>{t.diagnosticBaseline}:</strong> MMSE / MoCA</div>
              </div>

              <div>
                <h4 style={{ fontSize: 13, color: TEAL, marginBottom: 4, fontWeight: 700 }}>{t.clinicianScores}</h4>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                      <th style={{ padding: "4px 0", fontSize: 11, color: MUTED }}>{t.metric}</th>
                      <th style={{ padding: "4px 0", fontSize: 11, color: MUTED }}>{t.score}</th>
                      <th style={{ padding: "4px 0", fontSize: 11, color: MUTED }}>{t.status}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "6px 0" }}>{t.mmse}</td>
                      <td style={{ padding: "6px 0" }}><strong>23 / 30</strong></td>
                      <td style={{ padding: "6px 0", color: AMBER, fontWeight: 700 }}>{t.decline}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "6px 0" }}>{t.moca}</td>
                      <td style={{ padding: "6px 0" }}><strong>19 / 30</strong></td>
                      <td style={{ padding: "6px 0", color: AMBER, fontWeight: 700 }}>{t.decline}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "6px 0" }}>{t.gameScore}</td>
                      <td style={{ padding: "6px 0" }}><strong>{latestGameScore ? Math.round((trendData.reduce((acc, curr) => acc + curr.score, 0)) / trendData.length) : 73} pts</strong></td>
                      <td style={{ padding: "6px 0", color: TEAL, fontWeight: 700 }}>{t.stable}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h4 style={{ fontSize: 13, color: TEAL, marginBottom: 4, fontWeight: 700 }}>{t.complianceMood}</h4>
                <ul style={{ paddingLeft: 16, lineHeight: 1.5 }}>
                  <li>{t.compRateLabel}: <strong>{complianceRate}%</strong></li>
                  <li>{t.todayMoodLabel}: <strong>{moodToday}</strong></li>
                  <li>{t.completedTests}: <strong>{gameHistory.length} {t.games}</strong></li>
                </ul>
              </div>

              <div style={{ borderLeft: `3px solid ${TEAL}`, paddingLeft: 10, fontStyle: "italic", color: MUTED, lineHeight: 1.4 }}>
                "Note: A drop in cognitive deck score has been observed from Week 2 to Week 5. Recommended action: Schedule clinician follow-up review for diagnostic comparison."
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, borderTop: "1px solid #e5e7eb", paddingTop: 10 }}>
                <div>
                  <div style={{ fontSize: 9, color: MUTED }}>{t.clinicianSig}</div>
                  <div style={{ height: 20 }}></div>
                  <div style={{ borderBottom: "1px solid #9ca3af", width: 120 }}></div>
                  <div style={{ fontSize: 10, color: TEXT_DARK, marginTop: 2 }}>{t.sigDate}</div>
                </div>
                <div>
                  <div style={{ fontSize: 9, color: MUTED }}>{t.caregiverSig}</div>
                  <div style={{ height: 20 }}></div>
                  <div style={{ borderBottom: "1px solid #9ca3af", width: 120 }}></div>
                  <div style={{ fontSize: 10, color: TEXT_DARK, marginTop: 2 }}>{t.sigDate}</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button
                  onClick={() => { playTapSound(); window.print(); }}
                  style={{
                    flex: 1, padding: "10px", borderRadius: 10, border: "none",
                    background: TEAL, color: "white", fontWeight: 700, cursor: "pointer"
                  }}
                >
                  {t.printReport}
                </button>
                <button
                  onClick={() => { playTapSound(); setShowClinicianReport(false); }}
                  style={{
                    flex: 1, padding: "10px", borderRadius: 10, border: `1px solid ${BORDER}`,
                    background: "white", color: TEXT_DARK, fontWeight: 700, cursor: "pointer"
                  }}
                >
                  {t.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced PHC Escalation Modal Overlay */}
      {showPhcAlert && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(35, 49, 43, 0.7)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 120, backdropFilter: "blur(4px)", padding: "20px 10px"
        }}>
          <div className="tp-anim" style={{
            background: "white", width: "100%", maxWidth: 450, borderRadius: 24, padding: 24,
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)", maxHeight: "90%", overflowY: "auto"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, borderBottom: `1px solid ${BORDER}`, paddingBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <MapPin size={20} color={CORAL} />
                <h3 style={{ fontSize: 16, color: TEXT_DARK, fontWeight: 800 }}>{t.phcTitle}</h3>
              </div>
              <button
                onClick={() => { playTapSound(); setShowPhcAlert(false); setDispatchStatus("idle"); }}
                style={{ border: "none", background: TEAL_LIGHT, width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <X size={16} />
              </button>
            </div>

            {dispatchStatus === "completed" ? (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <div style={{ fontSize: 44, marginBottom: 10 }}>✅</div>
                <h4 style={{ fontSize: 16, color: GREEN, fontWeight: 800, marginBottom: 8 }}>{t.successTitle}</h4>
                <div style={{
                  background: GREEN_LIGHT,
                  border: `1.5px dashed ${GREEN}`,
                  padding: "12px",
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 700,
                  color: GREEN,
                  marginBottom: 16,
                  display: "inline-block"
                }}>
                  {t.dispatchRef}: {dispatchId}
                </div>
                <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.5, marginBottom: 20 }}>
                  {t.successMsg} <strong>{activePhc.name}</strong>. {t.successNote}
                </p>
                <button
                  onClick={() => { playTapSound(); setShowPhcAlert(false); setDispatchStatus("idle"); }}
                  style={{
                    width: "100%", padding: "12px", borderRadius: 12, border: "none",
                    background: TEAL, color: "white", fontWeight: 700, cursor: "pointer"
                  }}
                >
                  {t.returnDashboard}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendPhcEscalation} style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 12 }}>
                <div>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: 4 }}>{t.phcLabel}</label>
                  <select
                    value={selectedPhc}
                    onChange={(e) => setSelectedPhc(e.target.value)}
                    style={{
                      width: "100%", padding: "10px", borderRadius: 10, border: `1px solid ${BORDER}`,
                      background: "white", fontSize: 12, fontWeight: 600
                    }}
                  >
                    {PHC_CENTERS.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ background: BG, padding: 10, borderRadius: 10 }}>
                  <div>📍 <strong>Coordinates:</strong> {activePhc.coord}</div>
                  <div style={{ marginTop: 4 }}>📞 <strong>PHC Contact:</strong> {activePhc.contact}</div>
                </div>

                <div>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: 4 }}>{t.urgencyLabel}</label>
                  <div style={{ display: "flex", gap: 6 }}>
                    {["low", "medium", "high"].map(level => {
                      let displayLabel = t.urgencyLow;
                      if (level === "medium") displayLabel = t.urgencyMedium;
                      if (level === "high") displayLabel = t.urgencyHigh;

                      return (
                        <button
                          key={level}
                          type="button"
                          onClick={() => { playTapSound(); setUrgencyLevel(level); }}
                          style={{
                            flex: 1, padding: "8px 4px", borderRadius: 8, border: `1px solid ${BORDER}`,
                            textTransform: "uppercase", fontSize: 10, fontWeight: 700, cursor: "pointer",
                            background: urgencyLevel === level ? (level === "high" ? CORAL : level === "medium" ? AMBER : TEAL) : "white",
                            color: urgencyLevel === level ? "white" : TEXT_DARK
                          }}
                        >
                          {displayLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: 4 }}>{t.notesLabel}</label>
                  <textarea
                    rows={3}
                    placeholder={t.notesPlaceholder}
                    value={customVocalNotes}
                    onChange={(e) => setCustomVocalNotes(e.target.value)}
                    style={{
                      width: "100%", padding: "10px", borderRadius: 10, border: `1px solid ${BORDER}`,
                      fontFamily: "inherit", fontSize: 12
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button
                    type="submit"
                    style={{
                      flex: 1, padding: "12px", borderRadius: 12, border: "none",
                      background: CORAL, color: "white", fontWeight: 800, cursor: "pointer"
                    }}
                  >
                    {t.sendRequest}
                  </button>
                  <button
                    type="button"
                    onClick={() => { playTapSound(); setShowPhcAlert(false); }}
                    style={{
                      flex: 1, padding: "12px", borderRadius: 12, border: `1px solid ${BORDER}`,
                      background: "white", color: TEXT_DARK, fontWeight: 800, cursor: "pointer"
                    }}
                  >
                    {t.cancel}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
