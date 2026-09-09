import React, { useState } from "react";
import { Check, Bell, Volume2, ArrowLeft, Plus, CalendarDays, X } from "lucide-react";
import { playTapSound } from "../utils/audio";

const localTranslations = {
  en: {
    title: "Today's Reminders",
    sub: "Check items or tap speaker.",
    addCustom: "Add Custom",
    noReminders: "No reminders scheduled.",
    quick: "Quick reminders:",
    addTitle: "Add Custom Reminder",
    whatToDo: "What do you need to do?",
    whatTime: "What time?",
    save: "Save Reminder",
    cancel: "Cancel",
    formErrorText: "Please write a reminder description.",
    formErrorTime: "Please enter a time.",
    addedSpeech: "Added reminder for {text} at {time}",
    completedSpeech: "Completed: {text}",
    uncheckedSpeech: "Unchecked: {text}"
  },
  hi: {
    title: "आज के स्मरणपत्र",
    sub: "कार्यों पर सही का निशान लगाएं या स्पीकर छुएं।",
    addCustom: "नया जोड़ें",
    noReminders: "कोई स्मरणपत्र निर्धारित नहीं है।",
    quick: "त्वरित स्मरणपत्र:",
    addTitle: "स्मरणपत्र जोड़ें",
    whatToDo: "आपको क्या करने की आवश्यकता है?",
    whatTime: "किस समय?",
    save: "सुरक्षित करें",
    cancel: "रद्द करें",
    formErrorText: "कृपया विवरण लिखें।",
    formErrorTime: "कृपया समय दर्ज करें।",
    addedSpeech: "{time} बजे {text} के लिए स्मरणपत्र जोड़ा गया",
    completedSpeech: "पूरा हुआ: {text}",
    uncheckedSpeech: "अचिह्नित किया गया: {text}"
  },
  ta: {
    title: "இன்றைய நினைவூட்டல்கள்",
    sub: "பொருட்களைச் சரிபார்க்கவும் அல்லது ஸ்பீக்கரைத் தட்டவும்.",
    addCustom: "புதியதைச் சேர்",
    noReminders: "நினைவூட்டல்கள் எதுவும் திட்டமிடப்படவில்லை.",
    quick: "விரைவு நினைவூட்டல்கள்:",
    addTitle: "நினைவூட்டலைச் சேர்",
    whatToDo: "நீங்கள் என்ன செய்ய வேண்டும்?",
    whatTime: "என்ன நேரம்?",
    save: "சேமிக்கவும்",
    cancel: "ரத்து செய்",
    formErrorText: "நினைவூட்டல் விளக்கத்தை எழுதவும்.",
    formErrorTime: "நேரத்தை உள்ளிடவும்.",
    addedSpeech: "{time} மணிக்கு {text} நினைவூட்டல் சேர்க்கப்பட்டது",
    completedSpeech: "முடிந்தது: {text}",
    uncheckedSpeech: "மீண்டும் சேர்க்கப்பட்டது: {text}"
  }
};

const presetOptions = {
  en: [
    { text: "Drink a glass of water", time: "Every 2 hrs" },
    { text: "Afternoon tea & snack", time: "4:00 PM" },
    { text: "Stretch and joint exercises", time: "5:30 PM" }
  ],
  hi: [
    { text: "एक गिलास पानी पिएं", time: "हर 2 घंटे में" },
    { text: "दोपहर की चाय और नाश्ता", time: "शाम 4:00 बजे" },
    { text: "स्ट्रेचिंग और व्यायाम", time: "शाम 5:30 बजे" }
  ],
  ta: [
    { text: "ஒரு கிளாஸ் தண்ணீர் குடிக்கவும்", time: "ஒவ்வொரு 2 மணிக்கும்" },
    { text: "மாலை தேநீர் மற்றும் சிற்றுண்டி", time: "மாலை 4:00 மணி" },
    { text: "உடற்பயிற்சி மற்றும் யோகா", time: "மாலை 5:30 மணி" }
  ]
};

export default function RemindersScreen({ back, reminders, setReminders, speak, language = "en", go }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newText, setNewText] = useState("");
  const [newTime, setNewTime] = useState("");
  const [formError, setFormError] = useState("");

  const t = localTranslations[language] || localTranslations["en"];
  const presets = presetOptions[language] || presetOptions["en"];
  
  function handleToggle(id) {
    playTapSound();
    const updated = reminders.map((r) => {
      if (r.id === id) {
        const nextDone = !r.done;
        const speechTemplate = nextDone ? t.completedSpeech : t.uncheckedSpeech;
        const enT = localTranslations["en"];
        const enTemplate = nextDone ? enT.completedSpeech : enT.uncheckedSpeech;
        speak(enTemplate.replace("{text}", r.text), speechTemplate.replace("{text}", r.text));
        return { ...r, done: nextDone };
      }
      return r;
    });
    setReminders(updated);
  }

  function handleAddPreset(text, time) {
    playTapSound();
    const newId = reminders.length > 0 ? Math.max(...reminders.map(r => r.id)) + 1 : 1;
    const newReminder = { id: newId, time, text, done: false };
    setReminders([...reminders, newReminder]);
    speak(localTranslations["en"].addedSpeech.replace("{text}", text).replace("{time}", time), t.addedSpeech.replace("{text}", text).replace("{time}", time));
  }

  function handleSubmitCustom(e) {
    e.preventDefault();
    if (!newText.trim()) {
      setFormError(t.formErrorText);
      return;
    }
    if (!newTime.trim()) {
      setFormError(t.formErrorTime);
      return;
    }

    playTapSound();
    const newId = reminders.length > 0 ? Math.max(...reminders.map(r => r.id)) + 1 : 1;
    
    // Format time nicely: if user uses html time picker (e.g. 14:30), convert to 12h format
    let formattedTime = newTime;
    if (newTime.includes(":")) {
      const [hrs, mins] = newTime.split(":");
      const h = parseInt(hrs);
      const ampm = h >= 12 ? "PM" : "AM";
      const displayHour = h % 12 || 12;
      formattedTime = `${displayHour}:${mins} ${ampm}`;
    }

    const newReminder = { id: newId, time: formattedTime, text: newText, done: false };
    setReminders([...reminders, newReminder]);
    speak(localTranslations["en"].addedSpeech.replace("{text}", newText).replace("{time}", formattedTime), t.addedSpeech.replace("{text}", newText).replace("{time}", formattedTime));
    
    // Reset Form
    setNewText("");
    setNewTime("");
    setFormError("");
    setShowAddForm(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
      </div>

      {/* Screen Toggle Tabs */}
      {go && (
        <div style={{ display: "flex", background: "white", padding: 3, borderRadius: 20, border: "1px solid var(--color-teal-soft)", marginBottom: 16 }}>
          <button
            style={{
              flex: 1, padding: "8px 12px", borderRadius: 16, border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer",
              background: "var(--color-teal)", color: "white"
            }}
          >
            {t.title}
          </button>
          <button
            onClick={() => { playTapSound(); go("calendar"); }}
            style={{
              flex: 1, padding: "8px 12px", borderRadius: 16, border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer",
              background: "transparent", color: "var(--color-text-muted)"
            }}
          >
            {language === "ta" ? "நாள்காட்டி" : language === "hi" ? "कैलेंडर" : "Calendar"}
          </button>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <p style={{ fontSize: 13, color: "var(--color-text-muted)", margin: 0, fontWeight: 500 }}>
          {t.sub}
        </p>
        <button
          onClick={() => { playTapSound(); setShowAddForm(true); }}
          style={{
            border: "none",
            background: "var(--color-teal)",
            color: "white",
            padding: "8px 12px",
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4
          }}
        >
          <Plus size={14} /> {t.addCustom}
        </button>
      </div>

      {/* Reminder Checklist */}
      <div style={{ flex: 1, overflowY: "auto", marginBottom: 20 }}>
        {reminders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "30px 10px", color: "var(--color-text-muted)" }}>
            {t.noReminders}
          </div>
        ) : (
          reminders.map((r) => (
            <div key={r.id} className={`reminder-card ${r.done ? "completed" : ""}`}>
              <button
                onClick={() => handleToggle(r.id)}
                aria-label={r.done ? `Mark ${r.text} as incomplete` : `Mark ${r.text} as complete`}
                className="reminder-icon-container"
                style={{
                  background: r.done ? "var(--color-success)" : "var(--color-gold)",
                  border: "none"
                }}
              >
                {r.done ? <Check size={20} /> : <Bell size={18} />}
              </button>

              <div className="reminder-text-container" onClick={() => handleToggle(r.id)} style={{ cursor: "pointer" }}>
                <div className="reminder-time">{r.time}</div>
                <div className="reminder-text">{r.text}</div>
              </div>

              <button
                onClick={() => speak(`${r.text}`)}
                className="btn-speak"
                aria-label="Play reminder text aloud"
              >
                <Volume2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Preset helpers container */}
      <div style={{ background: "var(--color-bg-warm)", padding: 14, borderRadius: 20, border: "1px solid var(--color-teal-soft)" }}>
        <h3 style={{ fontSize: 13, color: "var(--color-teal)", marginBottom: 8, fontWeight: 700 }}>
          {t.quick}
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleAddPreset(p.text, p.time)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                borderRadius: 10,
                border: "1px solid rgba(8, 81, 92, 0.08)",
                background: "white",
                cursor: "pointer",
                textAlign: "left",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--color-text-dark)"
              }}
            >
              <span>{p.text} ({p.time})</span>
              <Plus size={14} color="var(--color-teal)" />
            </button>
          ))}
        </div>
      </div>

      {/* Drawer Overlay for Adding custom reminder */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: 20, borderRadius: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <CalendarDays size={18} color="var(--color-teal)" />
                <h3 style={{ fontSize: 16, fontWeight: 800 }}>{t.addTitle}</h3>
              </div>
              <button 
                onClick={() => { playTapSound(); setShowAddForm(false); setFormError(""); }}
                style={{ border: "none", background: "var(--color-teal-light)", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmitCustom} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {formError && (
                <div style={{ color: "var(--color-danger)", fontSize: 12, fontWeight: 700 }}>
                  {formError}
                </div>
              )}
              
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--color-text-dark)" }}>
                  {t.whatToDo}
                </label>
                <input
                  type="text"
                  placeholder={language === "hi" ? "उदा. गर्म चाय पीएं, टहलने जाएं" : language === "ta" ? "உதா. சூடான தேநீர் குடிக்கவும்" : "e.g. Drink hot tea, Take afternoon walk"}
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid var(--color-teal-soft)",
                    fontSize: 13,
                    fontFamily: "var(--font-body)"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: "var(--color-text-dark)" }}>
                  {t.whatTime}
                </label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid var(--color-teal-soft)",
                    fontSize: 13,
                    fontFamily: "var(--font-body)"
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 10,
                    border: "none",
                    background: "var(--color-teal)",
                    color: "white",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  {t.save}
                </button>
                <button
                  type="button"
                  onClick={() => { playTapSound(); setShowAddForm(false); setFormError(""); }}
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 10,
                    border: "1px solid var(--color-teal-soft)",
                    background: "white",
                    color: "var(--color-text-dark)",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  {t.cancel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
