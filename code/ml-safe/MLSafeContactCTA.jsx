import React, { useRef, useState, useEffect } from "react"
import { addPropertyControls, ControlType } from "framer"

// Design tokens
const F = {
  h: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  b: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
}

const C = {
  primary: "#3751FF",
  primaryHover: "#2A3FCC",
  primaryGlow: "rgba(55,81,255,.15)",
  dark: "#000737",
  darkBg: "#010314",
  white: "#FFFFFF",
  gray200: "#E5E7EB",
  gray400: "#9CA3AF",
  gray600: "#6B7280",
  text: "#171717",
  textSec: "#555555"
}

const R = { sm: 8, lg: 16, xl: 24, pill: 9999 }

// ============================================================================
// UTILITY HOOKS & COMPONENTS
// ============================================================================

/**
 * useReveal: Triggers on-mount animation when element enters viewport
 */
function useReveal(ref, delay = 0) {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (ref?.current) {
        const rect = ref.current.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.75) {
          setRevealed(true)
        }
      }
    }, delay)

    const handleScroll = () => {
      clearTimeout(timer)
      if (ref?.current) {
        const rect = ref.current.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.75) {
          setRevealed(true)
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    // Trigger on mount
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(timer)
    }
  }, [ref, delay])

  return revealed
}

/**
 * useInjectKeyframes: Inject CSS keyframes for animations
 */
function useInjectKeyframes(keyframes) {
  useEffect(() => {
    if (!keyframes) return

    const styleId = "framer-keyframes"
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style")
      style.id = styleId
      style.innerHTML = keyframes
      document.head.appendChild(style)
    }
  }, [keyframes])
}

/**
 * useSectionWidth: Get container width for responsive logic
 */
function useSectionWidth() {
  const ref = useRef(null)
  const [width, setWidth] = useState(1200)

  useEffect(() => {
    if (!ref.current) return

    const updateWidth = () => {
      setWidth(ref.current.offsetWidth)
    }

    updateWidth()

    const resizeObserver = new ResizeObserver(updateWidth)
    resizeObserver.observe(ref.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return [ref, width]
}

/**
 * RevealDiv: Wrapper for reveal animation
 */
function RevealDiv({ children, delay = 0, style = {} }) {
  const ref = useRef(null)
  const revealed = useReveal(ref, delay)

  return (
    <div
      ref={ref}
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(24px)",
        transition: "all 0.6s ease-out",
        ...style
      }}
    >
      {children}
    </div>
  )
}

/**
 * Chk: Check item with icon
 */
function Chk({ text }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        alignItems: "flex-start",
        fontSize: "16px",
        lineHeight: "1.5",
        color: C.white,
        fontFamily: F.b,
        fontWeight: 400
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        style={{ flexShrink: 0, marginTop: "2px" }}
      >
        <circle cx="10" cy="10" r="10" fill={C.primaryGlow} />
        <path
          d="M7 10l2 2 4-4"
          stroke={C.primary}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>{text}</span>
    </div>
  )
}

/**
 * Orb: Floating decorative orb
 */
function Orb({ top, left, size = 120, delay = 0 }) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        background: `radial-gradient(circle at 30% 30%, rgba(55, 81, 255, 0.15), rgba(55, 81, 255, 0.02))`,
        filter: "blur(40px)",
        animation: `float 6s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        pointerEvents: "none"
      }}
    />
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function MLSafeContactCTA({
  headline = "Every dataset is different.",
  headlineAccent = "Let's explore yours.",
  subtitle = "Tell us about your data and we'll provide compression estimates, ML accuracy validation approach, and integration roadmap tailored to your needs.",
  formTitle = "Tell us about your data",
  buttonText = "Let's explore →",
  hubspotPortalId = "",
  hubspotFormId = "",
  redirectUrl = "https://beamr.com/thank-you",
  consentText = "By submitting, you allow Beamr to send you occasional updates. You can unsubscribe at any time.",
  style
}) {
  const [containerRef, width] = useSectionWidth()
  const isMobile = width < 900

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    workEmail: "",
    company: ""
  })

  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Inject float animation keyframes
  useInjectKeyframes(`
    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-20px);
      }
    }
  `)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg("")

    if (!hubspotPortalId || !hubspotFormId) {
      setErrorMsg("HubSpot Portal ID and Form ID are required.")
      setIsSubmitting(false)
      return
    }

    const submission = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.workEmail,
      company: formData.company,
      timestamp: new Date().toISOString(),
      page: typeof window !== "undefined" ? window.location.href : "",
    }

    // Save to localStorage as backup before attempting HubSpot
    try {
      const stored = JSON.parse(localStorage.getItem("mlsafe_submissions") || "[]")
      stored.push(submission)
      localStorage.setItem("mlsafe_submissions", JSON.stringify(stored))
    } catch (e) {}

    // Get HubSpot tracking cookie if available
    const hutk = document.cookie.split(";").map(c => c.trim()).find(c => c.startsWith("hubspotutk="))
    const hutkValue = hutk ? hutk.split("=")[1] : undefined

    try {
      const res = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${hubspotPortalId}/${hubspotFormId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fields: [
              { name: "firstname", value: formData.firstName },
              { name: "lastname", value: formData.lastName },
              { name: "email", value: formData.workEmail },
              { name: "company", value: formData.company },
            ],
            context: {
              hutk: hutkValue,
              pageUri: typeof window !== "undefined" ? window.location.href : "",
              pageName: "ML-Safe Landing Page",
            },
          }),
        }
      )

      if (res.ok) {
        // Mark as synced in localStorage
        try {
          const stored = JSON.parse(localStorage.getItem("mlsafe_submissions") || "[]")
          if (stored.length > 0) {
            stored[stored.length - 1].synced = true
            localStorage.setItem("mlsafe_submissions", JSON.stringify(stored))
          }
        } catch (e) {}

        window.location.href = redirectUrl
      } else {
        const data = await res.json().catch(() => null)
        setErrorMsg(data?.message || "Submission failed. We've saved your info and will follow up.")
      }
    } catch (err) {
      setErrorMsg("Network error. We've saved your info and will follow up.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        padding: isMobile ? "60px 24px" : "80px 60px",
        background: `linear-gradient(165deg, #000a3d 0%, ${C.darkBg} 50%, #080b2e 100%)`,
        overflow: "hidden",
        ...style
      }}
    >
      {/* Floating Orbs for depth */}
      <Orb top="-80px" left="-120px" size={280} delay={0} />
      <Orb top="50%" left="85%" size={200} delay={1.5} />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1280px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? "48px" : "80px",
          alignItems: "center"
        }}
      >
        {/* LEFT SIDE: Headline & Value Props */}
        <RevealDiv delay={0}>
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {/* Headline */}
            <div>
              <h2
                style={{
                  fontFamily: F.h,
                  fontSize: isMobile ? "28px" : "40px",
                  fontWeight: 700,
                  lineHeight: 1.2,
                  color: C.white,
                  margin: "0 0 8px 0"
                }}
              >
                {headline}{" "}
                <span
                  style={{
                    background: `linear-gradient(135deg, ${C.primary} 0%, #5b7eff 100%)`,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}
                >
                  {headlineAccent}
                </span>
              </h2>
              <p
                style={{
                  fontFamily: F.b,
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: 1.5,
                  color: C.white,
                  opacity: 0.5,
                  margin: 0
                }}
              >
                {subtitle}
              </p>
            </div>
          </div>
        </RevealDiv>

        {/* RIGHT SIDE: Contact Form */}
        <RevealDiv delay={0.2}>
          <div
            style={{
              background: C.white,
              opacity: 0.97,
              borderRadius: "20px",
              padding: isMobile ? "32px" : "40px",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              border: `1px solid rgba(255, 255, 255, 0.1)`
            }}
          >
            {/* Form Title */}
            <h3
              style={{
                fontFamily: F.h,
                fontSize: "20px",
                fontWeight: 600,
                color: C.text,
                margin: "0 0 8px 0"
              }}
            >
              {formTitle}
            </h3>

            <p
              style={{
                fontFamily: F.b,
                fontSize: "14px",
                fontWeight: 400,
                color: C.textSec,
                margin: "0 0 28px 0"
              }}
            >
              We'll get back within one business day.
            </p>

            {/* Error Message */}
            {errorMsg && (
              <div
                style={{
                  marginBottom: "20px",
                  padding: "12px 16px",
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid #EF4444",
                  borderRadius: "8px",
                  fontSize: "14px",
                  color: "#EF4444",
                  fontWeight: 500,
                }}
              >
                {errorMsg}
              </div>
            )}

            {/* Success Message */}
            {submitted && (
              <div
                style={{
                  marginBottom: "20px",
                  padding: "12px 16px",
                  background: "rgba(55, 81, 255, 0.1)",
                  border: `1px solid ${C.primary}`,
                  borderRadius: "8px",
                  fontSize: "14px",
                  color: C.primary,
                  fontWeight: 500,
                  animation: "fadeIn 0.3s ease-out"
                }}
              >
                Thank you! We'll be in touch soon.
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* First & Last Name */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: "16px",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label
                    style={{
                      fontFamily: F.b,
                      fontSize: "11px",
                      fontWeight: 600,
                      color: C.gray600,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="John"
                    required
                    style={{
                      fontFamily: F.b,
                      fontSize: "14px",
                      padding: "11px 14px",
                      border: `1.5px solid ${C.gray200}`,
                      borderRadius: "10px",
                      outline: "none",
                      transition: "all 0.2s ease",
                      backgroundColor: C.white,
                      boxSizing: "border-box"
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = C.primary
                      e.target.style.boxShadow = `0 0 0 3px ${C.primaryGlow}`
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = C.gray200
                      e.target.style.boxShadow = "none"
                    }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label
                    style={{
                      fontFamily: F.b,
                      fontSize: "11px",
                      fontWeight: 600,
                      color: C.gray600,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                    required
                    style={{
                      fontFamily: F.b,
                      fontSize: "14px",
                      padding: "11px 14px",
                      border: `1.5px solid ${C.gray200}`,
                      borderRadius: "10px",
                      outline: "none",
                      transition: "all 0.2s ease",
                      backgroundColor: C.white,
                      boxSizing: "border-box"
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = C.primary
                      e.target.style.boxShadow = `0 0 0 3px ${C.primaryGlow}`
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = C.gray200
                      e.target.style.boxShadow = "none"
                    }}
                  />
                </div>
              </div>

              {/* Work Email */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label
                  style={{
                    fontFamily: F.b,
                    fontSize: "11px",
                    fontWeight: 600,
                    color: C.gray600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}
                >
                  Work Email
                </label>
                <input
                  type="email"
                  name="workEmail"
                  value={formData.workEmail}
                  onChange={handleInputChange}
                  placeholder="john@company.com"
                  required
                  style={{
                    fontFamily: F.b,
                    fontSize: "14px",
                    padding: "11px 14px",
                    border: `1.5px solid ${C.gray200}`,
                    borderRadius: "10px",
                    outline: "none",
                    transition: "all 0.2s ease",
                    backgroundColor: C.white,
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = C.primary
                    e.target.style.boxShadow = `0 0 0 3px ${C.primaryGlow}`
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = C.gray200
                    e.target.style.boxShadow = "none"
                  }}
                />
              </div>

              {/* Company */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label
                  style={{
                    fontFamily: F.b,
                    fontSize: "11px",
                    fontWeight: 600,
                    color: C.gray600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}
                >
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Your Company"
                  required
                  style={{
                    fontFamily: F.b,
                    fontSize: "14px",
                    padding: "11px 14px",
                    border: `1.5px solid ${C.gray200}`,
                    borderRadius: "10px",
                    outline: "none",
                    transition: "all 0.2s ease",
                    backgroundColor: C.white,
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = C.primary
                    e.target.style.boxShadow = `0 0 0 3px ${C.primaryGlow}`
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = C.gray200
                    e.target.style.boxShadow = "none"
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  fontFamily: F.h,
                  fontSize: "16px",
                  fontWeight: 600,
                  padding: "14px 28px",
                  background: isSubmitting ? C.primaryHover : C.primary,
                  color: C.white,
                  border: "none",
                  borderRadius: "10px",
                  cursor: isSubmitting ? "default" : "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 8px 24px rgba(55, 81, 255, 0.3)",
                  marginTop: "8px",
                  opacity: isSubmitting ? 0.8 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.target.style.background = C.primaryHover
                    e.target.style.transform = "translateY(-2px)"
                    e.target.style.boxShadow = "0 12px 32px rgba(55, 81, 255, 0.4)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.target.style.background = C.primary
                    e.target.style.transform = "translateY(0)"
                    e.target.style.boxShadow = "0 8px 24px rgba(55, 81, 255, 0.3)"
                  }
                }}
              >
                {isSubmitting ? "Sending..." : buttonText}
              </button>
            </form>

            {/* Consent Note */}
            <p
              style={{
                fontFamily: F.b,
                fontSize: "11px",
                fontWeight: 400,
                color: C.gray400,
                textAlign: "center",
                margin: "16px 0 0 0",
                lineHeight: 1.5
              }}
            >
              {consentText}
            </p>
          </div>
        </RevealDiv>
      </div>

      {/* Fade-in keyframes */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

// ============================================================================
// PROPERTY CONTROLS
// ============================================================================

addPropertyControls(MLSafeContactCTA, {
  headline: {
    type: ControlType.String,
    title: "Headline",
    defaultValue: "Every dataset is different."
  },
  headlineAccent: {
    type: ControlType.String,
    title: "Headline Accent",
    defaultValue: "Let's explore yours."
  },
  subtitle: {
    type: ControlType.String,
    title: "Subtitle",
    defaultValue:
      "Tell us about your data and we'll provide compression estimates, ML accuracy validation approach, and integration roadmap tailored to your needs.",
    displayTextArea: true
  },
  formTitle: {
    type: ControlType.String,
    title: "Form Title",
    defaultValue: "Tell us about your data"
  },
  buttonText: {
    type: ControlType.String,
    title: "Button Text",
    defaultValue: "Let's explore →"
  },
  hubspotPortalId: {
    type: ControlType.String,
    title: "HubSpot Portal ID",
    defaultValue: "",
    description: "Your HubSpot portal/account ID"
  },
  hubspotFormId: {
    type: ControlType.String,
    title: "HubSpot Form ID",
    defaultValue: "",
    description: "The HubSpot form GUID"
  },
  redirectUrl: {
    type: ControlType.String,
    title: "Redirect URL",
    defaultValue: "https://beamr.com/thank-you",
  },
  consentText: {
    type: ControlType.String,
    title: "Consent Text",
    displayTextArea: true,
    defaultValue: "By submitting, you allow Beamr to send you occasional updates. You can unsubscribe at any time."
  }
})
