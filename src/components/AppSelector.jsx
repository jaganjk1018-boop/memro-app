import React from "react";
import { Heart, Shield, Users, Sparkles, ArrowRight, Activity, Smile } from "lucide-react";

export default function AppSelector({ onSelectPatient, onSelectCaregiver, onSelectFamily }) {
  return (
    <div style={{
      minHeight: "100%",
      display: "flex",
      flexDirection: "column",
      background: "linear-gradient(180deg, #FBF8F0 0%, #F4ECE1 100%)",
      padding: "24px 20px 30px",
      boxSizing: "border-box",
      fontFamily: "var(--font-body, system-ui, sans-serif)",
      color: "var(--color-text-dark, #23312B)"
    }}>
      {/* Brand Header */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "var(--color-teal-light, #DCEFEA)",
          color: "var(--color-teal, #0E5C52)",
          padding: "6px 14px",
          borderRadius: 999,
          fontSize: 13,
          fontWeight: 700,
          marginBottom: 12
        }}>
          <Sparkles size={16} />
          <span>Smart Cognitive Care Companion</span>
        </div>

        <h1 style={{
          margin: 0,
          fontSize: 32,
          fontWeight: 800,
          color: "var(--color-teal, #0E5C52)",
          letterSpacing: "-0.5px",
          fontFamily: "var(--font-display, inherit)"
        }}>
          Memro
        </h1>
        <p style={{
          margin: "6px 0 0",
          fontSize: 14,
          color: "var(--color-text-muted, #7C8A80)",
          lineHeight: 1.4
        }}>
          Welcome! Select your portal to continue:
        </p>
      </div>

      {/* Role Selection Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
        {/* Patient / Elder Card */}
        <button
          onClick={onSelectPatient}
          className="role-card"
          style={{
            textAlign: "left",
            border: "2px solid #0E5C52",
            background: "#FFFFFF",
            borderRadius: 18,
            padding: "16px 18px",
            boxShadow: "0 6px 18px rgba(14, 92, 82, 0.08)",
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: 16
          }}
        >
          <div style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            background: "linear-gradient(135deg, #0E5C52 0%, #1C7A6C 100%)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}>
            <Smile size={28} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 17, fontWeight: 800, color: "#0E5C52" }}>
                Amma Companion
              </span>
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                background: "#E2F0DE",
                color: "#2E6B29",
                padding: "2px 8px",
                borderRadius: 8
              }}>
                Recommended
              </span>
            </div>
            <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "#5F6E66", lineHeight: 1.35 }}>
              Voice-first guidance, joyful memory card games, daily reminders & calm breathing.
            </p>
          </div>
          <ArrowRight size={20} color="#0E5C52" style={{ flexShrink: 0 }} />
        </button>

        {/* Caregiver Portal Card */}
        <button
          onClick={onSelectCaregiver}
          className="role-card"
          style={{
            textAlign: "left",
            border: "1.5px solid #E0E7E4",
            background: "#FFFFFF",
            borderRadius: 18,
            padding: "16px 18px",
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.04)",
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: 16
          }}
        >
          <div style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            background: "linear-gradient(135deg, #E07B33 0%, #C8641E 100%)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}>
            <Shield size={26} />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: "#23312B" }}>
              Caregiver Routine Hub
            </span>
            <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "#5F6E66", lineHeight: 1.35 }}>
              Medicine schedules, adherence tracking, daily routine diary & PIN access.
            </p>
          </div>
          <ArrowRight size={20} color="#8A9991" style={{ flexShrink: 0 }} />
        </button>

        {/* Family Member Card */}
        <button
          onClick={onSelectFamily}
          className="role-card"
          style={{
            textAlign: "left",
            border: "1.5px solid #E0E7E4",
            background: "#FFFFFF",
            borderRadius: 18,
            padding: "16px 18px",
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.04)",
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: 16
          }}
        >
          <div style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            background: "linear-gradient(135deg, #4A6FB3 0%, #35538C 100%)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}>
            <Users size={26} />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: "#23312B" }}>
              Family Circle
            </span>
            <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "#5F6E66", lineHeight: 1.35 }}>
              Photo recognition memories, loved ones check-in & family wellbeing updates.
            </p>
          </div>
          <ArrowRight size={20} color="#8A9991" style={{ flexShrink: 0 }} />
        </button>
      </div>

      {/* Footer Info */}
      <div style={{
        marginTop: 20,
        textAlign: "center",
        padding: "12px",
        background: "rgba(14, 92, 82, 0.05)",
        borderRadius: 12,
        fontSize: 12,
        color: "#607268",
        lineHeight: 1.4
      }}>
        💡 <strong>Quick Tip:</strong> You can switch between roles or perspectives anytime using the top navigation bar.
      </div>
    </div>
  );
}
