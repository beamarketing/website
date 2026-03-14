// Career Open Application CTA Section
// Standalone Framer component with full property controls

import { addPropertyControls, ControlType } from "framer"
import { useState, useEffect, useCallback } from "react"

const COLORS = {
    fullBlue: "#3751FF",
    accentBlue: "#0099FF",
    lightLavender: "#EAEBFF",
    white: "#FFFFFF",
    muted: "#8896AB",
    darkText: "#1E293B",
    overlay: "rgba(0,0,0,0.5)",
    success: "#10B981",
    error: "#EF4444",
}

const DEFAULTS = {
    headingFont: "'Poppins', 'Inter', sans-serif",
    bodyFont: "'Inter', 'Poppins', sans-serif",
    monoFont: "'JetBrains Mono', 'Fira Code', monospace",
    bodySize: 14,
    ctaButtonSize: 14,
}

const EXPERIENCE_OPTIONS = [
    "0–2 years — Fresh bits",
    "3–5 years — Proven stream",
    "6–10 years — High bitrate",
    "10+ years — Lossless quality",
]

// ═══════════════════════════════════════════════════════════════
// OPEN APPLICATION MODAL
// ═══════════════════════════════════════════════════════════════
function OpenApplicationModal({ headingFont, bodyFont, monoFont, primaryBgColor, onClose, webhookUrl, comeetPositionUid }: {
    headingFont: string
    bodyFont: string
    monoFont: string
    primaryBgColor: string
    onClose: () => void
    webhookUrl: string
    comeetPositionUid: string
}) {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [experience, setExperience] = useState("")
    const [aboutMe, setAboutMe] = useState("")
    const [linkedin, setLinkedin] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [submitError, setSubmitError] = useState("")

    useEffect(() => {
        document.body.style.overflow = "hidden"
        return () => { document.body.style.overflow = "" }
    }, [])

    useEffect(() => {
        function handleEsc(e: KeyboardEvent) {
            if (e.key === "Escape") onClose()
        }
        window.addEventListener("keydown", handleEsc)
        return () => window.removeEventListener("keydown", handleEsc)
    }, [onClose])

    const canSubmit = firstName.trim() && lastName.trim() && email.trim() && experience && aboutMe.trim()

    const handleSubmit = useCallback(async () => {
        if (!canSubmit || submitting) return
        setSubmitting(true)
        setSubmitError("")

        const payload = {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            email: email.trim(),
            experience,
            about_me: aboutMe.trim(),
            linkedin_url: linkedin.trim() || undefined,
            position_uid: comeetPositionUid || undefined,
            source: "careers-page-open-application",
            submitted_at: new Date().toISOString(),
        }

        if (!webhookUrl) {
            setSubmitted(true)
            setSubmitting(false)
            return
        }

        try {
            const res = await fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
            if (!res.ok) throw new Error(`Server responded with ${res.status}`)
            setSubmitted(true)
        } catch (err: any) {
            setSubmitError(err.message || "Something went wrong. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }, [canSubmit, submitting, firstName, lastName, email, experience, aboutMe, linkedin, webhookUrl, comeetPositionUid])

    const inputStyle: React.CSSProperties = {
        fontFamily: bodyFont, fontSize: 14,
        padding: "10px 14px", borderRadius: 8,
        border: "1.5px solid rgba(0,0,0,0.1)",
        outline: "none", width: "100%", boxSizing: "border-box",
        transition: "border-color 0.2s ease",
        color: COLORS.darkText,
    }

    const labelStyle: React.CSSProperties = {
        fontFamily: monoFont, fontSize: 10, fontWeight: 500,
        textTransform: "uppercase", letterSpacing: "1.5px",
        color: COLORS.muted, marginBottom: 6, display: "block",
    }

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: COLORS.overlay, zIndex: 9999,
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: 24,
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    backgroundColor: COLORS.white, borderRadius: 16,
                    maxWidth: 540, width: "100%", maxHeight: "90vh",
                    overflow: "auto", position: "relative",
                    boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
                }}
            >
                {/* Header */}
                <div style={{
                    padding: "28px 32px 20px", position: "sticky", top: 0,
                    backgroundColor: COLORS.white, zIndex: 1,
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                            <h2 style={{
                                fontFamily: headingFont, fontSize: 22, fontWeight: 700,
                                color: COLORS.darkText, margin: "0 0 4px 0", lineHeight: 1.2,
                            }}>
                                Drop Your Best Bits
                            </h2>
                            <p style={{
                                fontFamily: bodyFont, fontSize: 13,
                                color: COLORS.muted, margin: 0, lineHeight: 1.5,
                            }}>
                                No matching role? No problem. Show us what makes you signal, not noise.
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            style={{
                                background: "none", border: "none", cursor: "pointer",
                                padding: 8, color: COLORS.muted, fontSize: 20, lineHeight: 1,
                                marginLeft: 16, flexShrink: 0,
                            }}
                        >
                            &times;
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div style={{ padding: "24px 32px 32px" }}>
                    {submitted ? (
                        <div style={{ textAlign: "center", padding: "40px 16px" }}>
                            <div style={{
                                width: 56, height: 56, borderRadius: "50%",
                                backgroundColor: "rgba(16,185,129,0.1)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                margin: "0 auto 16px",
                            }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={COLORS.success} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            <h3 style={{
                                fontFamily: headingFont, fontSize: 20, fontWeight: 700,
                                color: COLORS.darkText, margin: "0 0 8px 0",
                            }}>
                                Bits Received
                            </h3>
                            <p style={{
                                fontFamily: bodyFont, fontSize: 14,
                                color: COLORS.muted, margin: "0 0 8px 0", lineHeight: 1.6,
                            }}>
                                Thanks, {firstName}! Your signal came through loud and clear.
                            </p>
                            <p style={{
                                fontFamily: monoFont, fontSize: 11,
                                color: COLORS.muted, opacity: 0.6, margin: "0 0 24px 0",
                            }}>
                                We'll decode your profile and get back to you soon.
                            </p>
                            <button
                                onClick={onClose}
                                style={{
                                    fontFamily: headingFont, fontSize: 14, fontWeight: 600,
                                    backgroundColor: primaryBgColor, color: COLORS.white,
                                    border: "none", borderRadius: 8, padding: "12px 32px",
                                    cursor: "pointer",
                                }}
                            >
                                Done
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Name row */}
                            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>First Name *</label>
                                    <input
                                        style={inputStyle}
                                        placeholder="Ada"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        onFocus={(e) => { e.currentTarget.style.borderColor = primaryBgColor }}
                                        onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)" }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>Last Name *</label>
                                    <input
                                        style={inputStyle}
                                        placeholder="Lovelace"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        onFocus={(e) => { e.currentTarget.style.borderColor = primaryBgColor }}
                                        onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)" }}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div style={{ marginBottom: 16 }}>
                                <label style={labelStyle}>Email *</label>
                                <input
                                    type="email"
                                    style={inputStyle}
                                    placeholder="ada@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={(e) => { e.currentTarget.style.borderColor = primaryBgColor }}
                                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)" }}
                                />
                            </div>

                            {/* Experience */}
                            <div style={{ marginBottom: 16 }}>
                                <label style={labelStyle}>Experience Level *</label>
                                <select
                                    style={{
                                        ...inputStyle,
                                        appearance: "none" as const, cursor: "pointer",
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%238896AB' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                                        backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center",
                                        color: experience ? COLORS.darkText : COLORS.muted,
                                    }}
                                    value={experience}
                                    onChange={(e) => setExperience(e.target.value)}
                                    onFocus={(e) => { e.currentTarget.style.borderColor = primaryBgColor }}
                                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)" }}
                                >
                                    <option value="" disabled>Select your bandwidth...</option>
                                    {EXPERIENCE_OPTIONS.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>

                            {/* About me */}
                            <div style={{ marginBottom: 16 }}>
                                <label style={labelStyle}>A Few Words About You *</label>
                                <textarea
                                    style={{
                                        ...inputStyle,
                                        minHeight: 100, resize: "vertical",
                                        lineHeight: 1.6,
                                    }}
                                    placeholder="What drives you? What's the most interesting problem you've solved? Think of this as your personal compression algorithm — distill yourself into the essential bits."
                                    value={aboutMe}
                                    onChange={(e) => setAboutMe(e.target.value)}
                                    onFocus={(e) => { e.currentTarget.style.borderColor = primaryBgColor }}
                                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)" }}
                                />
                            </div>

                            {/* LinkedIn (optional) */}
                            <div style={{ marginBottom: 24 }}>
                                <label style={labelStyle}>LinkedIn Profile</label>
                                <input
                                    style={inputStyle}
                                    placeholder="https://linkedin.com/in/..."
                                    value={linkedin}
                                    onChange={(e) => setLinkedin(e.target.value)}
                                    onFocus={(e) => { e.currentTarget.style.borderColor = primaryBgColor }}
                                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)" }}
                                />
                            </div>

                            {/* Error */}
                            {submitError && (
                                <p style={{
                                    fontFamily: bodyFont, fontSize: 13,
                                    color: COLORS.error, margin: "0 0 16px 0", textAlign: "center",
                                }}>
                                    {submitError}
                                </p>
                            )}

                            {/* Submit */}
                            <button
                                onClick={handleSubmit}
                                disabled={!canSubmit || submitting}
                                style={{
                                    fontFamily: headingFont, fontSize: 14, fontWeight: 600,
                                    color: COLORS.white,
                                    backgroundColor: canSubmit ? primaryBgColor : COLORS.muted,
                                    border: "none", borderRadius: 8,
                                    padding: "12px 24px", width: "100%",
                                    cursor: canSubmit && !submitting ? "pointer" : "not-allowed",
                                    opacity: submitting ? 0.7 : 1,
                                    transition: "all 0.2s ease",
                                }}
                            >
                                {submitting ? "Transmitting..." : "Submit Your Bits"}
                            </button>

                            <p style={{
                                fontFamily: monoFont, fontSize: 10,
                                color: COLORS.muted, opacity: 0.5,
                                textAlign: "center", margin: "12px 0 0",
                                letterSpacing: "0.5px",
                            }}>
                                Every bit counts. We read every application.
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════
// CAREER CTA — main export
// ═══════════════════════════════════════════════════════════════
interface CareerCTAProps {
    // Fonts
    headingFont: string
    bodyFont: string
    monoFont: string
    bodySize: number
    ctaButtonSize: number
    // Copy
    headline: string
    headlineSize: number
    headlineColor: string
    subtext: string
    subtextColor: string
    primaryText: string
    primaryBgColor: string
    primaryTextColor: string
    secondaryText: string
    secondaryTextColor: string
    secondaryBorderColor: string
    // URLs
    linkedInUrl: string
    // Webhook / Comeet
    webhookUrl: string
    comeetPositionUid: string
    // Style
    style?: React.CSSProperties
}

function CareerCTA(props: CareerCTAProps) {
    const {
        headingFont = DEFAULTS.headingFont,
        bodyFont = DEFAULTS.bodyFont,
        monoFont = DEFAULTS.monoFont,
        bodySize = DEFAULTS.bodySize,
        ctaButtonSize = DEFAULTS.ctaButtonSize,
        headline = "Not every bit makes the cut.",
        headlineSize = 20,
        headlineColor = COLORS.darkText,
        subtext = "Don't see your role? Tell us what we're missing.",
        subtextColor = COLORS.muted,
        primaryText = "Send Us Your Story",
        primaryBgColor = COLORS.fullBlue,
        primaryTextColor = COLORS.white,
        secondaryText = "Follow on LinkedIn",
        secondaryTextColor = COLORS.fullBlue,
        secondaryBorderColor = "rgba(55,81,255,0.12)",
        linkedInUrl = "#linkedin",
        webhookUrl = "",
        comeetPositionUid = "",
        style,
    } = props

    const [isMobile, setIsMobile] = useState(false)
    const [showForm, setShowForm] = useState(false)

    useEffect(() => {
        function check() { setIsMobile(window.innerWidth <= 900) }
        check()
        window.addEventListener("resize", check)
        return () => window.removeEventListener("resize", check)
    }, [])

    return (
        <>
            <section style={{
                ...style,
                width: "100%", backgroundColor: COLORS.white,
                borderTop: "1px solid rgba(0,0,0,0.04)",
                padding: isMobile ? "48px 24px" : "56px 48px",
                boxSizing: "border-box", textAlign: "center",
            }}>
                <h3 style={{
                    fontFamily: headingFont, fontSize: headlineSize, fontWeight: 700,
                    color: headlineColor, letterSpacing: "-0.3px", margin: 0,
                }}>
                    {headline}
                </h3>
                <p style={{
                    fontFamily: bodyFont, fontSize: bodySize,
                    color: subtextColor, margin: "6px 0 0",
                }}>
                    {subtext}
                </p>

                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    gap: 12, marginTop: 24, flexWrap: "wrap" as const,
                }}>
                    {/* Primary — opens form popup */}
                    <button
                        onClick={() => setShowForm(true)}
                        style={{
                            fontFamily: headingFont, fontSize: ctaButtonSize, fontWeight: 600,
                            color: primaryTextColor, backgroundColor: primaryBgColor,
                            padding: "10px 24px", borderRadius: 8,
                            textDecoration: "none", cursor: "pointer",
                            transition: "all 0.2s ease", border: "none",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "translateY(-1px)" }}
                        onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)" }}
                    >
                        {primaryText}
                    </button>

                    {/* Secondary */}
                    <a
                        href={linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            fontFamily: headingFont, fontSize: ctaButtonSize, fontWeight: 600,
                            color: secondaryTextColor, backgroundColor: "transparent",
                            padding: "10px 24px", borderRadius: 8,
                            textDecoration: "none", cursor: "pointer",
                            transition: "all 0.2s ease",
                            border: `1.5px solid ${secondaryBorderColor}`,
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = secondaryTextColor }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = secondaryBorderColor }}
                    >
                        {secondaryText}
                    </a>
                </div>
            </section>

            {showForm && (
                <OpenApplicationModal
                    headingFont={headingFont}
                    bodyFont={bodyFont}
                    monoFont={monoFont}
                    primaryBgColor={primaryBgColor}
                    onClose={() => setShowForm(false)}
                    webhookUrl={webhookUrl}
                    comeetPositionUid={comeetPositionUid}
                />
            )}
        </>
    )
}

addPropertyControls(CareerCTA, {
    headingFont: { type: ControlType.String, title: "Heading Font", defaultValue: DEFAULTS.headingFont },
    bodyFont: { type: ControlType.String, title: "Body Font", defaultValue: DEFAULTS.bodyFont },
    monoFont: { type: ControlType.String, title: "Mono Font", defaultValue: DEFAULTS.monoFont },
    bodySize: { type: ControlType.Number, title: "Body Size", defaultValue: 14, min: 10, max: 22, step: 1, unit: "px" },
    ctaButtonSize: { type: ControlType.Number, title: "Button Size", defaultValue: 14, min: 10, max: 20, step: 1, unit: "px" },
    headline: { type: ControlType.String, title: "Headline", defaultValue: "Not every bit makes the cut." },
    headlineSize: { type: ControlType.Number, title: "Headline Size", defaultValue: 20, min: 14, max: 48, step: 1, unit: "px" },
    headlineColor: { type: ControlType.Color, title: "Headline Color", defaultValue: COLORS.darkText },
    subtext: { type: ControlType.String, title: "Subtext", defaultValue: "Don't see your role? Tell us what we're missing." },
    subtextColor: { type: ControlType.Color, title: "Subtext Color", defaultValue: COLORS.muted },
    primaryText: { type: ControlType.String, title: "Primary CTA", defaultValue: "Send Us Your Story" },
    primaryBgColor: { type: ControlType.Color, title: "Primary BG", defaultValue: COLORS.fullBlue },
    primaryTextColor: { type: ControlType.Color, title: "Primary Text", defaultValue: COLORS.white },
    secondaryText: { type: ControlType.String, title: "Secondary CTA", defaultValue: "Follow on LinkedIn" },
    secondaryTextColor: { type: ControlType.Color, title: "Secondary Text", defaultValue: COLORS.fullBlue },
    secondaryBorderColor: { type: ControlType.Color, title: "Secondary Border", defaultValue: "rgba(55,81,255,0.12)" },
    linkedInUrl: { type: ControlType.String, title: "LinkedIn URL", defaultValue: "#linkedin" },
    webhookUrl: { type: ControlType.String, title: "Webhook URL", defaultValue: "", description: "POST endpoint for submissions (e.g. Zapier/Make webhook that forwards to Comeet)." },
    comeetPositionUid: { type: ControlType.String, title: "Comeet Position UID", defaultValue: "", description: "Optional Comeet position_uid sent in the webhook payload." },
})

export default CareerCTA
