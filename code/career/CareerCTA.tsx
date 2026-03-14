// Career Open Application CTA Section
// Standalone Framer component with full property controls

import { addPropertyControls, ControlType } from "framer"
import { useState, useEffect } from "react"

const COLORS = {
    fullBlue: "#3751FF",
    accentBlue: "#0099FF",
    white: "#FFFFFF",
    muted: "#8896AB",
    darkText: "#1E293B",
}

const DEFAULTS = {
    headingFont: "'Poppins', 'Inter', sans-serif",
    bodyFont: "'Inter', 'Poppins', sans-serif",
    bodySize: 14,
    ctaButtonSize: 14,
}

// ═══════════════════════════════════════════════════════════════
// CAREER CTA — main export
// ═══════════════════════════════════════════════════════════════
interface CareerCTAProps {
    // Fonts
    headingFont: string
    bodyFont: string
    bodySize: number
    ctaButtonSize: number
    // Copy
    headline: string
    subtext: string
    primaryText: string
    secondaryText: string
    // URLs
    openAppUrl: string
    linkedInUrl: string
    // Style
    style?: React.CSSProperties
}

function CareerCTA(props: CareerCTAProps) {
    const {
        headingFont = DEFAULTS.headingFont,
        bodyFont = DEFAULTS.bodyFont,
        bodySize = DEFAULTS.bodyFontSize,
        ctaButtonSize = DEFAULTS.ctaButtonSize,
        headline = "Not every bit makes the cut.",
        subtext = "Don't see your role? Tell us what we're missing.",
        primaryText = "Send Us Your Story",
        secondaryText = "Follow on LinkedIn",
        openAppUrl = "#open-application",
        linkedInUrl = "#linkedin",
        style,
    } = props

    const [isMobile, setIsMobile] = useState(false)
    useEffect(() => {
        function check() { setIsMobile(window.innerWidth <= 900) }
        check()
        window.addEventListener("resize", check)
        return () => window.removeEventListener("resize", check)
    }, [])

    return (
        <section style={{
            ...style,
            width: "100%", backgroundColor: COLORS.white,
            borderTop: "1px solid rgba(0,0,0,0.04)",
            padding: isMobile ? "48px 24px" : "56px 48px",
            boxSizing: "border-box", textAlign: "center",
        }}>
            <h3 style={{
                fontFamily: headingFont, fontSize: 20, fontWeight: 700,
                color: COLORS.darkText, letterSpacing: "-0.3px", margin: 0,
            }}>
                {headline}
            </h3>
            <p style={{
                fontFamily: bodyFont, fontSize: bodySize,
                color: COLORS.muted, margin: "6px 0 0",
            }}>
                {subtext}
            </p>

            <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: 12, marginTop: 24, flexWrap: "wrap" as const,
            }}>
                {/* Primary */}
                <a
                    href={openAppUrl}
                    style={{
                        fontFamily: headingFont, fontSize: ctaButtonSize, fontWeight: 600,
                        color: COLORS.white, backgroundColor: COLORS.fullBlue,
                        padding: "10px 24px", borderRadius: 8,
                        textDecoration: "none", cursor: "pointer",
                        transition: "all 0.2s ease", border: "none",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = COLORS.accentBlue; e.currentTarget.style.transform = "translateY(-1px)" }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = COLORS.fullBlue; e.currentTarget.style.transform = "translateY(0)" }}
                >
                    {primaryText}
                </a>

                {/* Secondary */}
                <a
                    href={linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        fontFamily: headingFont, fontSize: ctaButtonSize, fontWeight: 600,
                        color: COLORS.fullBlue, backgroundColor: "transparent",
                        padding: "10px 24px", borderRadius: 8,
                        textDecoration: "none", cursor: "pointer",
                        transition: "all 0.2s ease",
                        border: `1.5px solid rgba(55,81,255,0.12)`,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.fullBlue }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(55,81,255,0.12)" }}
                >
                    {secondaryText}
                </a>
            </div>
        </section>
    )
}

addPropertyControls(CareerCTA, {
    headingFont: { type: ControlType.String, title: "Heading Font", defaultValue: DEFAULTS.headingFont },
    bodyFont: { type: ControlType.String, title: "Body Font", defaultValue: DEFAULTS.bodyFont },
    bodySize: { type: ControlType.Number, title: "Body Size", defaultValue: 14, min: 10, max: 22, step: 1, unit: "px" },
    ctaButtonSize: { type: ControlType.Number, title: "Button Size", defaultValue: 14, min: 10, max: 20, step: 1, unit: "px" },
    headline: { type: ControlType.String, title: "Headline", defaultValue: "Not every bit makes the cut." },
    subtext: { type: ControlType.String, title: "Subtext", defaultValue: "Don't see your role? Tell us what we're missing." },
    primaryText: { type: ControlType.String, title: "Primary CTA", defaultValue: "Send Us Your Story" },
    secondaryText: { type: ControlType.String, title: "Secondary CTA", defaultValue: "Follow on LinkedIn" },
    openAppUrl: { type: ControlType.String, title: "Open App URL", defaultValue: "#open-application" },
    linkedInUrl: { type: ControlType.String, title: "LinkedIn URL", defaultValue: "#linkedin" },
})

export default CareerCTA
