import React, { useState } from "react";
import { Check, Shield, WifiOff, Trash2 } from "lucide-react";
import { playTapSound } from "../utils/audio";
import Garland from "./Garland";

const ONBOARD_TRANS = {
  en: {
    welcome: "Welcome",
    welcomeDesc: "This app helps with daily memory, gentle games, and staying close to family. Let's set it up together — it only takes a minute.",
    aboutYou: "About you",
    whatCall: "What should we call you?",
    whatCallSub: "This is how the app will greet you each day",
    yourName: "Your name",
    privacyConsent: "Privacy",
    privacyTitle: "Your privacy, protected",
    privacySub: "Step 3 of 5 · Privacy & safety",
    point1Title: "Your memories are private",
    point1Desc: "Only the family & doctor you approve can ever see your data.",
    point2Title: "Works offline-first",
    point2Desc: "Works offline-first, and syncs safely once you're back online.",
    point3Title: "Delete everything anytime",
    point3Desc: "Delete everything, anytime, from Settings — no questions asked.",
    agreeCheckbox: "I understand and agree to these terms",
    familyContact: "Family contact",
    whoCallHelp: "Who should we call if you need help?",
    whoCallSub: "They'll also see how you're doing each week",
    contactName: "Family member's name",
    relation: "Relation",
    daughter: "Daughter",
    son: "Son",
    grandchild: "Grandchild",
    allSet: "All set",
    allSetDesc: "will be able to see how you're doing and get a call if you ever need one.",
    friend: "friend",
    continue: "Continue",
    startApp: "Start using the app"
  },
  hi: {
    welcome: "स्वागत है",
    welcomeDesc: "यह ऐप दैनिक स्मृति, सरल खेलों और परिवार के करीब रहने में मदद करता है। आइए इसे मिलकर सेट करें — इसमें केवल एक मिनट लगता है।",
    aboutYou: "आपके बारे में",
    whatCall: "हम आपको क्या कहकर बुलाएं?",
    whatCallSub: "इसी तरह ऐप हर दिन आपका अभिवादन करेगा",
    yourName: "आपका नाम",
    privacyConsent: "गोपनीयता",
    privacyTitle: "आपकी गोपनीयता, सुरक्षित",
    privacySub: "चरण 3 / 5 · गोपनीयता और सुरक्षा",
    point1Title: "आपकी यादें निजी हैं",
    point1Desc: "केवल आपके द्वारा स्वीकृत परिवार और डॉक्टर ही आपका डेटा देख सकते हैं।",
    point2Title: "पहले ऑफ़लाइन काम करता है",
    point2Desc: "यह इंटरनेट के बिना भी काम करता है, और ऑनलाइन होने पर सुरक्षित रूप से सिंक होता है।",
    point3Title: "कभी भी सब कुछ हटाएं",
    point3Desc: "सेटिंग्स से कभी भी सब कुछ हटाएं — कोई सवाल नहीं पूछा जाएगा।",
    agreeCheckbox: "मैं गोपनीयता की शर्तों को समझता हूँ और सहमत हूँ",
    familyContact: "पारिवारिक संपर्क",
    whoCallHelp: "यदि आपको सहायता की आवश्यकता हो तो हमें किसे कॉल करना चाहिए?",
    whoCallSub: "वे यह भी देख पाएंगे कि आप हर हफ्ते कैसा कर रहे हैं",
    contactName: "परिवार के सदस्य का नाम",
    relation: "संबंध",
    daughter: "बेटी",
    son: "बेटा",
    grandchild: "पोता/पोती",
    allSet: "सब तैयार",
    allSetDesc: "यह देख पाएंगे कि आप कैसा कर रहे हैं और जरूरत पड़ने पर कॉल प्राप्त कर सकेंगे।",
    friend: "मित्र",
    continue: "जारी रखें",
    startApp: "ऐप का उपयोग शुरू करें"
  },
  ta: {
    welcome: "வரவேற்பு",
    welcomeDesc: "இந்த ஆப் தினசரி நினைவாற்றல், எளிய விளையாட்டுகள் மற்றும் குடும்பத்துடன் நெருக்கமாக இருக்க உதவுகிறது. இதை ஒன்றாக அமைப்போம் — இதற்கு ஒரு நிமிடம் மட்டுமே ஆகும்.",
    aboutYou: "உங்களைப் பற்றி",
    whatCall: "உங்களை நாங்கள் எப்படி அழைக்க வேண்டும்?",
    whatCallSub: "ஆப் ஒவ்வொரு நாளும் உங்களை இப்படித்தான் வரவேற்கும்",
    yourName: "உங்கள் பெயர்",
    privacyConsent: "தனியுரிமை",
    privacyTitle: "உங்க தகவல் பாதுகாப்பா இருக்கும்",
    privacySub: "படி 3 / 5 · தனியுரிமை & பாதுகாப்பு",
    point1Title: "உங்க நினைவுகள் தனிப்பட்டதுதான்",
    point1Desc: "நீங்கள் ஒப்புதல் அளிக்கும் குடும்பத்தினர் & மருத்துவர் மட்டுமே உங்கள் தகவலைப் பார்க்க முடியும்.",
    point2Title: "இணையம் இல்லாமலும் வேலை செய்யும்",
    point2Desc: "முதலில் ஆஃப்லைனில் வேலை செய்யும், இணையம் கிடைத்ததும் பாதுகாப்பாக ஒத்திசைக்கப்படும்.",
    point3Title: "எப்போ வேணா முழுசா அழிக்கலாம்",
    point3Desc: "அமைப்புகளில் இருந்து எப்போது வேண்டுமானாலும் எல்லாவற்றையும் நீக்கலாம் — கேள்விகள் எதுவும் கேட்கப்படாது.",
    agreeCheckbox: "இதை படிச்சு புரிஞ்சுக்கிட்டேன், ஒப்புக்கிறேன்",
    familyContact: "குடும்ப தொடர்பு",
    whoCallHelp: "உங்களுக்கு உதவி தேவைப்பட்டால் நாங்கள் யாரை அழைக்க வேண்டும்?",
    whoCallSub: "ஒவ்வொரு வாரமும் நீங்கள் எப்படி இருக்கையீர்கள் என்பதையும் அவர்கள் பார்ப்பார்கள்",
    contactName: "குடும்ப உறுப்பினரின் பெயர்",
    relation: "உறவு",
    daughter: "மகள்",
    son: "மகன்",
    grandchild: "பேரன்/பேத்தி",
    allSet: "அனைத்தும் தயார்",
    allSetDesc: "நீங்கள் எப்படி இருக்கிறீர்கள் என்பதைப் பார்க்கவும், தேவைப்படும்போது அழைப்பைப் பெறவும் முடியும்.",
    friend: "நண்பர்",
    continue: "தொடரவும்",
    startApp: "ஆப்பை பயன்படுத்தத் தொடங்குக"
  }
};

export default function OnboardingScreen({ onComplete, language }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [relation, setRelation] = useState("Daughter");
  const [agreed, setAgreed] = useState(false);

  const activeLang = ONBOARD_TRANS[language] ? language : (language === "ta" || language === "hi" ? language : "en");
  const t = ONBOARD_TRANS[activeLang] || ONBOARD_TRANS["en"];
  const steps = [t.welcome, t.aboutYou, t.privacyConsent, t.familyContact, t.allSet];

  const handleNext = () => {
    playTapSound();
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete({
        name: name || t.friend,
        contactName: contact || "Priya",
        contactRelation: relation
      });
    }
  };

  return (
    <div style={{ padding: "20px 20px", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
      <div>
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          {steps.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 6,
                borderRadius: 999,
                background: i <= step ? "var(--color-teal)" : "var(--color-teal-soft)",
                transition: "background 0.3s"
              }}
            />
          ))}
        </div>

        <Garland tone="light" />

        {step === 0 && (
          <div style={{ textAlign: "center", marginTop: 20 }} className="tp-anim">
            <div style={{ fontSize: 56, marginBottom: 18 }}>🪔</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "var(--color-text-dark)", marginBottom: 10 }}>
              {t.welcome}
            </div>
            <div style={{ fontSize: 13.5, color: "var(--color-text-muted)", lineHeight: 1.6 }}>
              {t.welcomeDesc}
            </div>
          </div>
        )}

        {step === 1 && (
          <div style={{ marginTop: 10 }} className="tp-anim">
            <div style={{ fontSize: 18, fontWeight: 800, color: "var(--color-text-dark)", marginBottom: 6 }}>
              {t.whatCall}
            </div>
            <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginBottom: 18 }}>
              {t.whatCallSub}
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.yourName}
              style={{
                width: "100%",
                padding: "16px 18px",
                borderRadius: 16,
                border: "2px solid var(--color-teal-soft)",
                fontSize: 16,
                color: "var(--color-text-dark)",
                outline: "none",
                boxSizing: "border-box"
              }}
            />
          </div>
        )}

        {step === 2 && (
          <div style={{ marginTop: 6 }} className="tp-anim">
            <h1 className="phdt-display" style={{ color: "var(--color-text-dark)", fontSize: 20, fontWeight: 800, margin: "2px 0" }}>
              {t.privacyTitle}
            </h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: 12.5, marginBottom: 12 }}>{t.privacySub}</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: Shield, color: "#C99A2E", title: t.point1Title, desc: t.point1Desc },
                { icon: WifiOff, color: "#5C9A57", title: t.point2Title, desc: t.point2Desc },
                { icon: Trash2, color: "#E4574B", title: t.point3Title, desc: t.point3Desc },
              ].map((p, i) => (
                <div key={i} style={{
                  display: "flex", gap: 12, alignItems: "flex-start",
                  background: "white", border: "1px solid var(--color-teal-soft)", borderRadius: 16, padding: "10px 12px"
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                    background: p.color, display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <p.icon size={18} color="white" />
                  </div>
                  <div>
                    <p style={{ color: "var(--color-text-dark)", fontWeight: 700, fontSize: 13.5, marginBottom: 2 }}>{p.title}</p>
                    <p style={{ color: "var(--color-text-muted)", fontSize: 11.5, lineHeight: 1.4 }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <label style={{
              display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
              background: "white", border: "1px solid var(--color-teal-soft)", borderRadius: 14, padding: "10px 12px", marginTop: 14
            }}>
              <button
                type="button"
                onClick={() => setAgreed(!agreed)}
                style={{
                  width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                  border: `2px solid ${agreed ? "var(--color-teal)" : "var(--color-text-muted)"}`,
                  background: agreed ? "var(--color-teal)" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0
                }}
              >
                {agreed && <Check size={14} color="white" strokeWidth={3} />}
              </button>
              <span style={{ color: "var(--color-text-dark)", fontSize: 12.5, fontWeight: 600 }}>
                {t.agreeCheckbox}
              </span>
            </label>
          </div>
        )}

        {step === 3 && (
          <div style={{ marginTop: 10 }} className="tp-anim">
            <div style={{ fontSize: 18, fontWeight: 800, color: "var(--color-text-dark)", marginBottom: 6 }}>
              {t.whoCallHelp}
            </div>
            <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginBottom: 18 }}>
              {t.whoCallSub}
            </div>
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder={t.contactName}
              style={{
                width: "100%",
                padding: "16px 18px",
                borderRadius: 16,
                border: "2px solid var(--color-teal-soft)",
                fontSize: 16,
                color: "var(--color-text-dark)",
                outline: "none",
                boxSizing: "border-box",
                marginBottom: 16
              }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              {["Daughter", "Son", "Grandchild"].map((r) => {
                const isSel = relation === r;
                let relLabel = r;
                if (language === "hi") {
                  if (r === "Daughter") relLabel = "बेटी";
                  else if (r === "Son") relLabel = "बेटा";
                  else if (r === "Grandchild") relLabel = "पोता/पोती";
                } else if (language === "ta") {
                  if (r === "Daughter") relLabel = "மகள்";
                  else if (r === "Son") relLabel = "மகன்";
                  else if (r === "Grandchild") relLabel = "பேரன்/பேத்தி";
                }
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRelation(r)}
                    style={{
                      flex: 1,
                      padding: "12px 0",
                      borderRadius: 12,
                      border: "none",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 700,
                      background: isSel ? "var(--color-teal)" : "var(--color-teal-light)",
                      color: isSel ? "white" : "var(--color-teal)",
                      transition: "all 0.2s"
                    }}
                  >
                    {relLabel}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={{ textAlign: "center", marginTop: 20 }} className="tp-anim">
            <div style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "var(--color-success-light)",
              margin: "0 auto 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Check size={36} color="var(--color-success)" />
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "var(--color-text-dark)", marginBottom: 10 }}>
              {t.allSet}, {name || t.friend}
            </div>
            <div style={{ fontSize: 13.5, color: "var(--color-text-muted)", lineHeight: 1.6 }}>
              {contact || "Priya"} ({relation.toLowerCase()}) {t.allSetDesc}
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleNext}
        disabled={step === 2 && !agreed}
        style={{
          width: "100%",
          padding: "16px 0",
          borderRadius: 16,
          border: "none",
          background: (step === 2 && !agreed) ? "#E4E1D6" : "var(--color-teal)",
          color: (step === 2 && !agreed) ? "var(--color-text-muted)" : "white",
          fontSize: 15,
          fontWeight: 700,
          cursor: (step === 2 && !agreed) ? "not-allowed" : "pointer",
          marginTop: 20,
          boxShadow: (step === 2 && !agreed) ? "none" : "var(--shadow-sm)",
          transition: "all 0.2s"
        }}
      >
        {step < 4 ? t.continue : t.startApp}
      </button>
    </div>
  );
}

