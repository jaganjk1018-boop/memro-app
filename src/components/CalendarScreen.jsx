import React, { useState, useEffect } from "react";
import { ArrowLeft, Plus, ChevronLeft, ChevronRight, X, Calendar as CalendarIcon, Cake, Stethoscope, Users, Video } from "lucide-react";
import { playTapSound } from "../utils/audio";
import Garland from "./Garland";

const EVENT_TYPES = {
  call: { icon: Video, color: "#145952", bg: "#DCEFEA" },
  birthday: { icon: Cake, color: "#E07B33", bg: "#FDE8D9" },
  asha: { icon: Users, color: "#5C7A5A", bg: "#E2F0DE" },
  doctor: { icon: Stethoscope, color: "#BD4433", bg: "#FCE5E2" },
};

const DEFAULT_EVENTS = [
  { id: 1, title: "Priya பிறந்தநாள் · Priya Birthday", date: "2026-08-30", type: "birthday" },
  { id: 2, title: "Arjun-உடன் வீடியோ அழைப்பு · Video call with Arjun", date: "2026-08-29", type: "call" },
  { id: 3, title: "ASHA worker வருகை · ASHA Visit", date: "2026-09-02", type: "asha" },
  { id: 4, title: "PHC டாக்டர் appointment · PHC Doctor Appointment", date: "2026-09-05", type: "doctor" },
];

export default function CalendarScreen({ back, speak, language }) {
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem("memro_family_events");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_EVENTS;
  });
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Modal fields
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("2026-08-28");
  const [newType, setNewType] = useState("call");

  // Save to local storage
  useEffect(() => {
    localStorage.setItem("memro_family_events", JSON.stringify(events));
  }, [events]);

  const translations = {
    en: {
      title: "Calendar",
      sub: "Shared Family Calendar",
      addEvent: "Add Event",
      upcoming: "Upcoming Events",
      save: "Save Event",
      cancel: "Cancel",
      eventTitle: "Event Name",
      dateLabel: "Date",
      noEvents: "No upcoming events scheduled.",
      weekdays: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
      monthName: "August 2026",
      addedSpeech: "Added event {title} on {date}",
      typeLabels: {
        call: "Video Call",
        birthday: "Birthday",
        asha: "ASHA Worker",
        doctor: "Doctor Visit"
      }
    },
    hi: {
      title: "कैलेंडर",
      sub: "साझा पारिवारिक कैलेंडर",
      addEvent: "कार्यक्रम जोड़ें",
      upcoming: "आगामी कार्यक्रम",
      save: "सुरक्षित करें",
      cancel: "रद्द करें",
      eventTitle: "कार्यक्रम का नाम",
      dateLabel: "तारीख",
      noEvents: "कोई आगामी कार्यक्रम निर्धारित नहीं है।",
      weekdays: ["रवि", "सोम", "मंग", "बुध", "गुरु", "शुक्र", "शनि"],
      monthName: "अगस्त 2026",
      addedSpeech: "{date} को {title} कार्यक्रम जोड़ा गया",
      typeLabels: {
        call: "वीडियो कॉल",
        birthday: "जन्मदिन",
        asha: "आशा कार्यकर्ता",
        doctor: "डॉक्टर से मुलाकात"
      }
    },
    ta: {
      title: "நாள்காட்டி",
      sub: "குடும்ப நாள்காட்டி",
      addEvent: "புது நிகழ்வு",
      upcoming: "வரவிருக்கும் நிகழ்வுகள்",
      save: "சேமிக்கவும்",
      cancel: "ரத்து செய்",
      eventTitle: "நிகழ்வின் பெயர்",
      dateLabel: "தேதி",
      noEvents: "நிகழ்வுகள் எதுவும் இல்லை.",
      weekdays: ["ஞா", "தி", "செ", "பு", "வி", "வெ", "ச"],
      monthName: "ஆகஸ்ட் 2026",
      addedSpeech: "{date} அன்று {title} நிகழ்வு சேர்க்கப்பட்டது",
      typeLabels: {
        call: "வீдео அழைப்பு",
        birthday: "பிறந்தநாள்",
        asha: "ஆஷா பணியாளர்",
        doctor: "மருத்துவர் சந்திப்பு"
      }
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

  // August 2026 calendar configuration
  // August 1, 2026 starts on Saturday (index 6)
  // August has 31 days
  const daysInAugust = 31;
  const startDayOffset = 6;
  const calendarCells = [];
  
  // Fill empty cells before August 1st
  for (let i = 0; i < startDayOffset; i++) {
    calendarCells.push(null);
  }
  // Fill August days
  for (let day = 1; day <= daysInAugust; day++) {
    calendarCells.push(day);
  }

  // Helper to format date string like "2026-08-dd"
  const getDateString = (day) => {
    if (!day) return "";
    return `2026-08-${day < 10 ? "0" + day : day}`;
  };

  // Helper to check if a day has events
  const getEventsForDay = (day) => {
    if (!day) return [];
    const dateStr = getDateString(day);
    const safeEvents = Array.isArray(events) ? events : [];
    return safeEvents.filter(e => e.date === dateStr);
  };

  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    playTapSound();
    const newEvent = {
      id: Date.now(),
      title: newTitle.trim(),
      date: newDate,
      type: newType
    };

    const safePrev = Array.isArray(events) ? events : [];
    const parseSafeDate = (dStr) => {
      const d = new Date(dStr);
      return isNaN(d.getTime()) ? 0 : d.getTime();
    };

    setEvents([...safePrev, newEvent].sort((a, b) => parseSafeDate(a.date) - parseSafeDate(b.date)));
    speak(translations["en"].addedSpeech.replace("{title}", newTitle).replace("{date}", newDate), tr.addedSpeech.replace("{title}", newTitle).replace("{date}", newDate));

    // Reset Form
    setNewTitle("");
    setNewDate("2026-08-28");
    setNewType("call");
    setShowAddModal(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", position: "relative", gap: 12 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={back}
            aria-label="Go back"
            style={{
              border: "none",
              background: "var(--color-teal-light)",
              borderRadius: 14,
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--color-teal)"
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <h2 style={{ fontSize: 20, color: "var(--color-text-dark)", fontWeight: 800 }}>
            {tr.title}
          </h2>
        </div>

        <button
          onClick={() => { playTapSound(); setShowAddModal(true); }}
          style={{
            border: "none", background: "var(--color-teal)", color: "white",
            padding: "8px 12px", borderRadius: 12, fontSize: 11.5, fontWeight: 700,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 4
          }}
        >
          <Plus size={14} /> {tr.addEvent}
        </button>
      </div>

      <Garland tone="light" />

      {/* Screen Toggle Tabs */}
      <div style={{ display: "flex", background: "white", padding: 3, borderRadius: 20, border: "1px solid var(--color-teal-soft)", marginBottom: 12 }}>
        <button
          onClick={() => { playTapSound(); back(); }}
          style={{
            flex: 1, padding: "8px 12px", borderRadius: 16, border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer",
            background: "transparent", color: "var(--color-text-muted)"
          }}
        >
          {language === "ta" ? "நினைவூட்டல்" : language === "hi" ? "स्मरणपत्र" : "Reminders"}
        </button>
        <button
          style={{
            flex: 1, padding: "8px 12px", borderRadius: 16, border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer",
            background: "var(--color-teal)", color: "white"
          }}
        >
          {language === "ta" ? "நாள்காட்டி" : language === "hi" ? "कैलेंडर" : "Calendar"}
        </button>
      </div>

      {/* Shared Calendar Header */}
      <div style={{ textAlign: "center", margin: "8px 0 14px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <button style={{ border: "none", background: "none", color: "var(--color-text-muted)", cursor: "pointer" }}>
            <ChevronLeft size={18} />
          </button>
          <span style={{ fontSize: 16.5, fontWeight: 800, color: "var(--color-text-dark)" }}>
            {tr.monthName}
          </span>
          <button style={{ border: "none", background: "none", color: "var(--color-text-muted)", cursor: "pointer" }}>
            <ChevronRight size={18} />
          </button>
        </div>
        <p style={{ fontSize: 11.5, color: "var(--color-text-muted)", margin: "2px 0 0" }}>{tr.sub}</p>
      </div>

      {/* Weekdays Labels */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", gap: 4, marginBottom: 8 }}>
        {tr.weekdays.map((w, idx) => (
          <span key={idx} style={{
            fontSize: 11.5, fontWeight: 800,
            color: idx === 0 || idx === 6 ? "var(--color-terracotta)" : "var(--color-text-muted)"
          }}>
            {w}
          </span>
        ))}
      </div>

      {/* Month Days Grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6,
        background: "white", borderRadius: 20, padding: 10, border: "1px solid var(--color-teal-soft)"
      }}>
        {calendarCells.map((day, idx) => {
          const isToday = day === 28;
          const dayEvents = getEventsForDay(day);
          const hasEvents = dayEvents.length > 0;

          return (
            <div
              key={idx}
              style={{
                aspectRatio: "1", borderRadius: 10, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", position: "relative",
                background: isToday ? "var(--color-teal-light)" : "transparent",
                border: isToday ? "1px solid var(--color-teal-soft)" : "none"
              }}
            >
              {day && (
                <>
                  <span style={{
                    fontSize: 13, fontWeight: isToday || hasEvents ? 800 : 500,
                    color: isToday ? "var(--color-teal)" : "var(--color-text-dark)"
                  }}>
                    {day}
                  </span>
                  
                  {/* Event indicator dots */}
                  {hasEvents && (
                    <div style={{ display: "flex", gap: 2, marginTop: 2, position: "absolute", bottom: 4 }}>
                      {dayEvents.slice(0, 3).map((e, index) => {
                        const typeInfo = EVENT_TYPES[e.type] || EVENT_TYPES.call;
                        return (
                          <span key={index} style={{
                            width: 5, height: 5, borderRadius: "50%",
                            background: typeInfo.color
                          }} />
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Upcoming Events List */}
      <div style={{ marginTop: 18, paddingBottom: 24 }}>
        <h3 style={{ fontSize: 14.5, fontWeight: 800, color: "var(--color-text-dark)", marginBottom: 10 }}>
          🗓️ {tr.upcoming}
        </h3>

        {(!events || events.length === 0) ? (
          <p style={{ textAlign: "center", fontSize: 12.5, color: "var(--color-text-muted)", marginTop: 20 }}>
            {tr.noEvents}
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(Array.isArray(events) ? events : []).map((e) => {
              const typeInfo = EVENT_TYPES[e.type] || EVENT_TYPES.call;
              const TypeIcon = typeInfo.icon;
              
              // Safe human readable date string formatting
              let formattedDate = e.date;
              try {
                const eventDate = new Date(e.date);
                if (eventDate && !isNaN(eventDate.getTime())) {
                  formattedDate = eventDate.toLocaleDateString(
                    language === "en" ? "en-US" : language === "hi" ? "hi-IN" : "ta-IN",
                    { day: "numeric", month: "short" }
                  );
                }
              } catch (err) {
                console.error("Date format error:", err);
              }

              return (
                <div
                  key={e.id}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    background: "white", borderRadius: 16, padding: "12px 14px",
                    border: "1px solid var(--color-teal-soft)", boxShadow: "var(--shadow-sm)"
                  }}
                >
                  <div style={{
                    width: 38, height: 38, borderRadius: 12, background: typeInfo.bg,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                  }}>
                    <TypeIcon size={18} color={typeInfo.color} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "var(--color-text-muted)", fontWeight: 700 }}>
                      {formattedDate} · {tr.typeLabels[e.type] || e.type}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text-dark)", marginTop: 2 }}>
                      {e.title}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ADD EVENT MODAL */}
      {showAddModal && (
        <div style={{
          position: "absolute", inset: 0, background: "rgba(35, 49, 43, 0.7)",
          display: "flex", alignItems: "flex-end", zIndex: 120, backdropFilter: "blur(4px)"
        }}>
          <div className="tp-anim" style={{
            background: "white", width: "100%", borderRadius: "28px 28px 0 0", padding: "24px 20px 30px",
            boxShadow: "var(--shadow-lg)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ color: "var(--color-text-dark)", fontSize: 18, fontWeight: 800 }}>
                {tr.addEvent}
              </h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                <X size={22} color="var(--color-text-muted)" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--color-text-dark)" }}>
                  {tr.eventTitle}
                </label>
                <input
                  placeholder="e.g. Birthday Party, ASHA Visit" value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{
                    width: "100%", padding: "12px 14px", borderRadius: 12, border: "2px solid var(--color-teal-soft)",
                    fontSize: 14, background: "var(--color-bg-warm)", color: "var(--color-text-dark)", outline: "none", boxSizing: "border-box"
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--color-text-dark)" }}>
                    {tr.dateLabel}
                  </label>
                  <input
                    type="date" value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    style={{
                      width: "100%", padding: "12px 14px", borderRadius: 12, border: "2px solid var(--color-teal-soft)",
                      fontSize: 14, background: "var(--color-bg-warm)", color: "var(--color-text-dark)", outline: "none", boxSizing: "border-box"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--color-text-dark)" }}>
                    Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    style={{
                      width: "100%", padding: "12px 14px", borderRadius: 12, border: "2px solid var(--color-teal-soft)",
                      fontSize: 14, background: "var(--color-bg-warm)", color: "var(--color-text-dark)", outline: "none", boxSizing: "border-box"
                    }}
                  >
                    <option value="call">{tr.typeLabels.call}</option>
                    <option value="birthday">{tr.typeLabels.birthday}</option>
                    <option value="asha">{tr.typeLabels.asha}</option>
                    <option value="doctor">{tr.typeLabels.doctor}</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button
                  type="submit"
                  disabled={!newTitle.trim()}
                  style={{
                    flex: 1, padding: "14px 0", borderRadius: 14, border: "none", fontSize: 14, fontWeight: 700,
                    background: newTitle.trim() ? "var(--color-teal)" : "#E4E1D6",
                    color: newTitle.trim() ? "white" : "var(--color-text-muted)",
                    cursor: newTitle.trim() ? "pointer" : "not-allowed",
                  }}
                >
                  {tr.save}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    flex: 1, padding: "14px 0", borderRadius: 14,
                    border: "2px solid var(--color-teal-soft)", background: "white",
                    color: "var(--color-text-dark)", fontSize: 14, fontWeight: 700, cursor: "pointer"
                  }}
                >
                  {tr.cancel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
