import { addPropertyControls, ControlType } from "framer"
import { useRef, useState, useEffect } from "react"

// ─────────────────────────────────────────────────────────────
// DESIGN TOKENS (INLINED)
// ─────────────────────────────────────────────────────────────

const F = {
  h: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  b: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
}

const C = {
  primary: "#3751FF",
  primaryHover: "#2A3FCC",
  primaryGlow: "rgba(55,81,255,.15)",
  dark: "#000737",
  darkBg: "#010314",
  white: "#FFFFFF",
  offWhite: "#F3F5FF",
  lightGray: "#F7F8FC",
  gray200: "#E5E7EB",
  gray400: "#9CA3AF",
  gray600: "#6B7280",
  gray800: "#1F2937",
  text: "#171717",
  textSec: "#555555",
  success: "#10B981",
  accent: "#0098FE",
}

const R = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 9999,
}

// ─────────────────────────────────────────────────────────────
// SHARED HOOKS & UTILITIES
// ─────────────────────────────────────────────────────────────

function useSectionWidth() {
  const ref = useRef(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (!ref.current) return

    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setWidth(entries[0].contentRect.width)
      }
    })

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return [ref, width]
}

function useInjectKeyframes() {
  useEffect(() => {
    const styleId = "beamr-keyframes"
    if (document.getElementById(styleId)) return

    const style = document.createElement("style")
    style.id = styleId
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
      @keyframes pulse-ring {
        0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
        100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
      }
      @keyframes gradient-shift {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
      @keyframes scan {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(100%); }
      }
    `
    document.head.appendChild(style)
  }, [])
}

// ─────────────────────────────────────────────────────────────
// ORB COMPONENT
// ─────────────────────────────────────────────────────────────

function Orb({ size = 300, color = "#3751FF", opacity = 0.3, top = 0, left = 0, delay = 0 }) {
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: color,
        opacity,
        filter: "blur(80px)",
        animation: `float 6s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        top: `${top}%`,
        left: `${left}%`,
        transform: "translate(-50%, -50%)",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

export default function MLSafeHero({
  videoUrl = "",
  headline = "Half the storage.",
  headlineAccent = "Zero risk to your models.",
  subtitle = "Cut storage costs without compromising video quality or AI/ML model safety with ML-Safe compression.",
  ctaPrimaryText = "Talk to our team",
  ctaPrimaryLink = "#contact",
  ctaSecondaryText = "See how it works",
  ctaSecondaryLink = "#how-it-works",
  style,
}) {
  useInjectKeyframes()
  const [sectionRef, sectionWidth] = useSectionWidth()
  const isMobile = sectionWidth < 900

  return (
    <section
      ref={sectionRef}
      style={{
        ...style,
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        background: `linear-gradient(165deg, #000a3d 0%, ${C.darkBg} 45%, #080b2e 100%)`,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* ANIMATED ORBS */}
      <Orb
        size={400}
        color={C.primary}
        opacity={0.2}
        top={20}
        left={15}
        delay={0}
      />
      <Orb
        size={350}
        color={C.accent}
        opacity={0.15}
        top={70}
        left={85}
        delay={1}
      />
      <Orb
        size={300}
        color={C.success}
        opacity={0.1}
        top={50}
        left={50}
        delay={2}
      />

      {/* CONCENTRIC CIRCLES */}
      <div
        style={{
          position: "absolute",
          width: "800px",
          height: "800px",
          border: `1px solid rgba(255, 255, 255, 0.05)`,
          borderRadius: "50%",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "1200px",
          height: "1200px",
          border: `1px solid rgba(255, 255, 255, 0.03)`,
          borderRadius: "50%",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* CONTENT CONTAINER */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: "1400px",
          padding: "40px 20px",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: "60px",
          alignItems: "center",
        }}
      >
        {/* LEFT CONTENT */}
        <div>
          {/* BADGE */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              border: `1px solid rgba(16, 185, 129, 0.3)`,
              borderRadius: R.pill,
              padding: "8px 16px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: C.success,
                animation: "pulse-ring 2s infinite",
              }}
            />
            <span
              style={{
                fontSize: "12px",
                fontFamily: F.b,
                color: C.white,
                fontWeight: 500,
              }}
            >
              ML-Safe Video Compression
            </span>
          </div>

          {/* HEADLINE */}
          <h1
            style={{
              fontSize: isMobile ? "36px" : "52px",
              fontFamily: F.h,
              fontWeight: 700,
              lineHeight: "1.2",
              color: C.white,
              margin: "0 0 16px 0",
            }}
          >
            {headline}
          </h1>

          {/* ACCENT TEXT (GRADIENT) */}
          <h1
            style={{
              fontSize: isMobile ? "36px" : "52px",
              fontFamily: F.h,
              fontWeight: 700,
              lineHeight: "1.2",
              margin: "0 0 24px 0",
              background: `linear-gradient(135deg, ${C.accent} 0%, ${C.primary} 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {headlineAccent}
          </h1>

          {/* SUBTITLE */}
          <p
            style={{
              fontSize: "16px",
              fontFamily: F.b,
              lineHeight: "1.6",
              color: C.gray400,
              marginBottom: "32px",
              maxWidth: "500px",
            }}
          >
            {subtitle}
          </p>

          {/* CTA BUTTONS */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            {/* PRIMARY BUTTON */}
            <a
              href={ctaPrimaryLink}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px 28px",
                backgroundColor: C.primary,
                color: C.white,
                borderRadius: R.lg,
                fontFamily: F.b,
                fontSize: "14px",
                fontWeight: 600,
                textDecoration: "none",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = C.primaryHover
                e.currentTarget.style.boxShadow = `0 8px 24px ${C.primaryGlow}`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = C.primary
                e.currentTarget.style.boxShadow = "none"
              }}
            >
              {ctaPrimaryText}
            </a>

            {/* SECONDARY BUTTON */}
            <a
              href={ctaSecondaryLink}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px 28px",
                backgroundColor: "transparent",
                color: C.white,
                border: `1px solid rgba(255, 255, 255, 0.2)`,
                borderRadius: R.lg,
                fontFamily: F.b,
                fontSize: "14px",
                fontWeight: 600,
                textDecoration: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)"
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.4)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent"
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)"
              }}
            >
              {ctaSecondaryText}
            </a>
          </div>
        </div>

        {/* RIGHT CONTENT - VIDEO PLAYER */}
        <div
            style={{
              position: "relative",
              aspectRatio: "16/9",
              borderRadius: R.lg,
              overflow: "hidden",
              border: `1px solid rgba(255, 255, 255, 0.1)`,
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(10px)",
            }}
          >
            {videoUrl ? (
              /* VIDEO PLAYER */
              <video
                src={videoUrl}
                autoPlay
                muted
                loop
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              /* PLACEHOLDER */
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  background: `linear-gradient(135deg, rgba(55, 81, 255, 0.1) 0%, rgba(0, 152, 254, 0.1) 100%)`,
                }}
              >
                {/* SCAN LINE */}
                <div
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "2px",
                    backgroundColor: "rgba(0, 152, 254, 0.3)",
                    top: 0,
                    animation: "scan 3s linear infinite",
                  }}
                />

                {/* PLAY BUTTON */}
                <button
                  style={{
                    position: "relative",
                    zIndex: 2,
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    backgroundColor: C.primary,
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: `0 8px 32px ${C.primaryGlow}`,
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)"
                    e.currentTarget.style.boxShadow = `0 12px 48px ${C.primaryGlow}`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)"
                    e.currentTarget.style.boxShadow = `0 8px 32px ${C.primaryGlow}`
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill={C.white}
                    style={{ marginLeft: "2px" }}
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>

                {/* LABEL */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "24px",
                    left: "24px",
                    zIndex: 2,
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      fontFamily: F.b,
                      color: C.gray400,
                      marginBottom: "6px",
                    }}
                  >
                    See CABR in action
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontFamily: F.b,
                      color: C.white,
                      fontWeight: 600,
                    }}
                  >
                    2:00
                  </div>
                </div>
              </div>
            )}
          </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// PROPERTY CONTROLS
// ─────────────────────────────────────────────────────────────

addPropertyControls(MLSafeHero, {
  videoUrl: {
    type: ControlType.File,
    title: "Hero Video",
    allowedFileTypes: ["mp4", "webm", "mov"],
  },
  headline: {
    type: ControlType.String,
    title: "Headline",
    defaultValue: "Half the storage.",
  },
  headlineAccent: {
    type: ControlType.String,
    title: "Headline Accent",
    defaultValue: "Zero risk to your models.",
  },
  subtitle: {
    type: ControlType.String,
    title: "Subtitle",
    displayTextArea: true,
    defaultValue:
      "Cut storage costs without compromising video quality or AI/ML model safety with ML-Safe compression.",
  },
  ctaPrimaryText: {
    type: ControlType.String,
    title: "Primary CTA Text",
    defaultValue: "Talk to our team",
  },
  ctaPrimaryLink: {
    type: ControlType.String,
    title: "Primary CTA Link",
    defaultValue: "#contact",
  },
  ctaSecondaryText: {
    type: ControlType.String,
    title: "Secondary CTA Text",
    defaultValue: "See how it works",
  },
  ctaSecondaryLink: {
    type: ControlType.String,
    title: "Secondary CTA Link",
    defaultValue: "#how-it-works",
  },
})
