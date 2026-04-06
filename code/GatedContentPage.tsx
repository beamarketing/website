// Beamr - Gated Content Landing Page
// Lead magnet for NVIDIA Cosmos Curator benchmark research
// Framer Code Component with HubSpot form integration

import { addPropertyControls, ControlType } from "framer"
import { useState, useEffect, useRef } from "react"

interface StatItem {
    value: string
    label: string
}

interface Props {
    // Logos
    beamrLogo: string
    nvidiaLogo: string

    // Content
    heading: string
    subheading: string
    stats: StatItem[]

    // Form
    formHeading: string
    submitButtonText: string
    hubspotPortalId: string
    hubspotFormId: string
    useEmbeddedHubspot: boolean
    showCompanyField: boolean
    consentText: string
    showConsent: boolean

    // Thank you
    thankYouHeading: string
    thankYouMessage: string
    thankYouCtaText: string
    thankYouCtaUrl: string

    // Appearance
    bgColor: string
    cardBgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    fontFamily: string
    style?: React.CSSProperties
}

function GatedContentPage(props: Props) {
    const {
        beamrLogo = "",
        nvidiaLogo = "",
        heading = "Optimized Compression\nValidated on Cosmos Curator",
        subheading = "41–57% smaller files. Zero impact on AI model fidelity.",
        stats = [
            { value: "41–57%", label: "Bitrate reduction" },
            { value: "~95%", label: "VRI agreement" },
            { value: ">0.98", label: "Cluster accuracy" },
        ],
        formHeading = "Get the Full Research",
        submitButtonText = "Download Free Report",
        hubspotPortalId = "",
        hubspotFormId = "",
        useEmbeddedHubspot = false,
        showCompanyField = true,
        consentText = "I agree to receive communications from Beamr. Unsubscribe anytime.",
        showConsent = true,
        thankYouHeading = "Check Your Inbox",
        thankYouMessage = "The full benchmark report is on its way to your email.",
        thankYouCtaText = "Visit Beamr.com",
        thankYouCtaUrl = "/",
        bgColor = "#07071c",
        cardBgColor = "#0f1029",
        textColor = "#ffffff",
        secondaryTextColor = "#8b8ba3",
        accentColor = "#00d46a",
        fontFamily = "'Inter', sans-serif",
        style,
    } = props

    const [submitted, setSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formError, setFormError] = useState("")
    const [isMobile, setIsMobile] = useState(false)
    const hubspotRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 860)
        check()
        window.addEventListener("resize", check)
        return () => window.removeEventListener("resize", check)
    }, [])

    useEffect(() => {
        if (!useEmbeddedHubspot || !hubspotPortalId || !hubspotFormId || submitted) return
        const script = document.createElement("script")
        script.src = "https://js.hsforms.net/forms/v2.js"
        script.async = true
        script.onload = () => {
            if ((window as any).hbspt && hubspotRef.current) {
                hubspotRef.current.innerHTML = ""
                ;(window as any).hbspt.forms.create({
                    portalId: hubspotPortalId,
                    formId: hubspotFormId,
                    target: hubspotRef.current,
                    onFormSubmitted: () => setSubmitted(true),
                })
            }
        }
        document.head.appendChild(script)
        return () => { if (script.parentNode) script.parentNode.removeChild(script) }
    }, [useEmbeddedHubspot, hubspotPortalId, hubspotFormId, submitted])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setFormError("")
        setIsSubmitting(true)
        const fd = new FormData(e.currentTarget)
        const fields: { name: string; value: string }[] = [
            { name: "firstname", value: fd.get("firstname") as string },
            { name: "lastname", value: fd.get("lastname") as string },
            { name: "email", value: fd.get("email") as string },
        ]
        if (showCompanyField) fields.push({ name: "company", value: fd.get("company") as string })
        if (!hubspotPortalId || !hubspotFormId) {
            setTimeout(() => { setIsSubmitting(false); setSubmitted(true) }, 800)
            return
        }
        try {
            const res = await fetch(
                `https://api.hsforms.com/submissions/v3/integration/submit/${hubspotPortalId}/${hubspotFormId}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ fields, context: { pageUri: window.location.href, pageName: document.title } }),
                }
            )
            if (res.ok) setSubmitted(true)
            else setFormError("Something went wrong. Please try again.")
        } catch {
            setFormError("Connection error. Please retry.")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Inline SVG logos as fallbacks
    const BeamrWordmark = () => (
        <svg viewBox="0 0 120 28" fill="none" style={{ height: isMobile ? 22 : 28 }}>
            <text x="0" y="22" fill={textColor} fontFamily={fontFamily} fontWeight="800" fontSize="24" letterSpacing="-0.5">BEAMR</text>
        </svg>
    )

    const NvidiaWordmark = () => (
        <svg viewBox="0 0 140 32" fill="none" style={{ height: isMobile ? 22 : 28 }}>
            <path d="M44.5 8.2h4.3l5.8 12.9h.1L60.5 8.2h4.2V25h-3V13.3h-.1L55.9 25h-2.5l-5.7-11.7h-.1V25h-3V8.2zM26 8.2l-7.7 16.8h3.4l1.7-3.9h8.1l1.7 3.9H37L29.2 8.2H26zm1.6 4.3l2.8 6.2h-5.5l2.7-6.2zM14.5 8.2h3.1V25h-3.1V8.2zm-4.8 0h-3v16.8h9.6v-2.8H9.7V8.2zM2 8.2h5.2c3.6 0 5.4 2.2 5.4 5.1 0 2.2-1 4-3 4.8L13 25h-3.6l-3-6.2H5V25H2V8.2zm5 8c1.8 0 2.8-1.2 2.8-2.9 0-1.7-1-2.8-2.8-2.8H5v5.7h2z" fill={textColor} opacity="0.5"/>
            <text x="44" y="23" fill={textColor} fontFamily={fontFamily} fontWeight="700" fontSize="22" letterSpacing="0.5" opacity="0.5">NVIDIA</text>
        </svg>
    )

    const inputCss: React.CSSProperties = {
        width: "100%",
        padding: "13px 16px",
        backgroundColor: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 10,
        color: textColor,
        fontSize: 15,
        fontFamily,
        outline: "none",
        boxSizing: "border-box",
        transition: "border-color 0.2s",
    }

    return (
        <section
            style={{
                ...style,
                width: "100%",
                minHeight: "100vh",
                backgroundColor: bgColor,
                fontFamily,
                boxSizing: "border-box",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {/* Background glows */}
            <div style={{ position: "absolute", top: "-20%", left: "30%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${accentColor}06 0%, transparent 70%)`, pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "-10%", right: "20%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, #6366f106 0%, transparent 70%)`, pointerEvents: "none" }} />

            <style>{`
                .gc-input:focus { border-color: ${accentColor} !important; }
                .gc-input::placeholder { color: ${secondaryTextColor}; opacity: 0.5; }
                .gc-submit:hover { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 8px 32px ${accentColor}30; }
                .gc-submit:active { transform: translateY(0); }
                .gc-stat { transition: transform 0.2s, border-color 0.2s; }
                .gc-stat:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.12) !important; }
                .gc-form-card { background: linear-gradient(135deg, ${cardBgColor} 0%, #0d0e28 100%); }
                .gc-hs-embed .hs-form input[type="text"],
                .gc-hs-embed .hs-form input[type="email"],
                .gc-hs-embed .hs-form select,
                .gc-hs-embed .hs-form textarea {
                    width: 100% !important; padding: 13px 16px !important;
                    background: rgba(255,255,255,0.05) !important;
                    border: 1px solid rgba(255,255,255,0.1) !important;
                    border-radius: 10px !important; color: ${textColor} !important;
                    font-size: 15px !important; font-family: ${fontFamily} !important;
                    box-sizing: border-box !important;
                }
                .gc-hs-embed .hs-form input:focus { border-color: ${accentColor} !important; outline: none !important; }
                .gc-hs-embed .hs-form .hs-button {
                    width: 100% !important; padding: 16px !important;
                    background: ${accentColor} !important; color: #07071c !important;
                    border: none !important; border-radius: 10px !important;
                    font-size: 16px !important; font-weight: 600 !important;
                    cursor: pointer !important;
                }
                .gc-hs-embed .hs-form label { color: ${secondaryTextColor} !important; font-size: 13px !important; }
            `}</style>

            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    width: "100%",
                    maxWidth: 1080,
                    padding: isMobile ? "70px 20px 50px" : "80px 48px",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: isMobile ? 36 : 56,
                    alignItems: isMobile ? "stretch" : "center",
                }}
            >
                {/* ── Left: Content ── */}
                <div style={{ flex: 1, minWidth: 0 }}>

                    {/* Logo lockup */}
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
                        {beamrLogo ? (
                            <img src={beamrLogo} alt="Beamr" style={{ height: isMobile ? 22 : 28, objectFit: "contain" }} />
                        ) : (
                            <BeamrWordmark />
                        )}
                        <span style={{ fontSize: 18, color: secondaryTextColor, opacity: 0.4, fontWeight: 300 }}>&times;</span>
                        {nvidiaLogo ? (
                            <img src={nvidiaLogo} alt="NVIDIA" style={{ height: isMobile ? 22 : 28, objectFit: "contain" }} />
                        ) : (
                            <NvidiaWordmark />
                        )}
                    </div>

                    {/* Accent line */}
                    <div style={{ width: 48, height: 3, borderRadius: 2, backgroundColor: accentColor, marginBottom: 28, opacity: 0.8 }} />

                    {/* Heading */}
                    <h1
                        style={{
                            fontSize: isMobile ? 30 : 44,
                            fontWeight: 700,
                            color: textColor,
                            margin: 0,
                            lineHeight: 1.12,
                            letterSpacing: "-0.025em",
                            fontFamily,
                            whiteSpace: "pre-line",
                        }}
                    >
                        {heading}
                    </h1>

                    {/* Subheading */}
                    <p
                        style={{
                            fontSize: isMobile ? 15 : 17,
                            color: textColor,
                            opacity: 0.55,
                            lineHeight: 1.55,
                            margin: "14px 0 0",
                            fontFamily,
                            maxWidth: 460,
                        }}
                    >
                        {subheading}
                    </p>

                    {/* Stats row */}
                    {stats.length > 0 && (
                        <div
                            style={{
                                display: "flex",
                                gap: 12,
                                marginTop: 32,
                                flexWrap: "wrap",
                            }}
                        >
                            {stats.map((s, i) => (
                                <div
                                    key={i}
                                    className="gc-stat"
                                    style={{
                                        flex: isMobile ? "1 1 calc(50% - 6px)" : "1 1 0",
                                        padding: "18px 16px",
                                        borderRadius: 12,
                                        border: "1px solid rgba(255,255,255,0.06)",
                                        backgroundColor: "rgba(255,255,255,0.02)",
                                        textAlign: "center",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: isMobile ? 24 : 28,
                                            fontWeight: 800,
                                            color: accentColor,
                                            fontFamily,
                                            lineHeight: 1,
                                            letterSpacing: "-0.02em",
                                        }}
                                    >
                                        {s.value}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 12,
                                            color: secondaryTextColor,
                                            marginTop: 6,
                                            fontFamily,
                                            lineHeight: 1.3,
                                        }}
                                    >
                                        {s.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Right: Form ── */}
                <div style={{ width: isMobile ? "100%" : 380, flexShrink: 0 }}>
                    {/* Gradient border wrapper */}
                    <div
                        style={{
                            borderRadius: 22,
                            padding: 1,
                            background: `linear-gradient(135deg, ${accentColor}30, rgba(255,255,255,0.06), ${accentColor}15)`,
                        }}
                    >
                        <div
                            className="gc-form-card"
                            style={{
                                borderRadius: 21,
                                padding: isMobile ? "28px 22px" : "32px 28px",
                                boxSizing: "border-box",
                                position: "relative",
                                overflow: "hidden",
                            }}
                        >
                            {/* Corner glow */}
                            <div style={{ position: "absolute", top: -50, right: -50, width: 160, height: 160, borderRadius: "50%", background: `radial-gradient(circle, ${accentColor}10 0%, transparent 70%)`, pointerEvents: "none" }} />

                            {submitted ? (
                                <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "12px 0", position: "relative", zIndex: 1 }}>
                                    <div style={{ width: 52, height: 52, borderRadius: "50%", backgroundColor: `${accentColor}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: accentColor }}>
                                        &#10003;
                                    </div>
                                    <h3 style={{ fontSize: 20, fontWeight: 700, color: textColor, margin: 0, fontFamily }}>{thankYouHeading}</h3>
                                    <p style={{ fontSize: 14, color: secondaryTextColor, margin: 0, lineHeight: 1.5, fontFamily }}>{thankYouMessage}</p>
                                    <a
                                        href={thankYouCtaUrl}
                                        style={{
                                            display: "inline-flex", alignItems: "center", gap: 8,
                                            marginTop: 6, padding: "13px 28px",
                                            backgroundColor: accentColor, color: "#07071c",
                                            borderRadius: 10, fontSize: 15, fontWeight: 600,
                                            textDecoration: "none", fontFamily,
                                        }}
                                    >
                                        {thankYouCtaText} <span style={{ fontSize: 17 }}>&#8594;</span>
                                    </a>
                                </div>
                            ) : useEmbeddedHubspot && hubspotPortalId && hubspotFormId ? (
                                <div style={{ position: "relative", zIndex: 1 }}>
                                    <h3 style={{ fontSize: 19, fontWeight: 700, color: textColor, margin: "0 0 16px", fontFamily }}>{formHeading}</h3>
                                    <div ref={hubspotRef} className="gc-hs-embed" />
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12, position: "relative", zIndex: 1 }}>
                                    <h3 style={{ fontSize: 19, fontWeight: 700, color: textColor, margin: "0 0 4px", fontFamily }}>{formHeading}</h3>

                                    <div style={{ display: "flex", gap: 10 }}>
                                        <input className="gc-input" type="text" name="firstname" required placeholder="First name" style={inputCss} />
                                        <input className="gc-input" type="text" name="lastname" required placeholder="Last name" style={inputCss} />
                                    </div>

                                    <input className="gc-input" type="email" name="email" required placeholder="Work email *" style={inputCss} />

                                    {showCompanyField && (
                                        <input className="gc-input" type="text" name="company" placeholder="Company" style={inputCss} />
                                    )}

                                    {showConsent && (
                                        <label style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer", marginTop: 2 }}>
                                            <input type="checkbox" required style={{ marginTop: 3, accentColor, flexShrink: 0 }} />
                                            <span style={{ fontSize: 11, color: secondaryTextColor, lineHeight: 1.4, fontFamily, opacity: 0.8 }}>{consentText}</span>
                                        </label>
                                    )}

                                    {formError && <p style={{ fontSize: 12, color: "#ff4d4d", margin: 0, fontFamily }}>{formError}</p>}

                                    <button
                                        type="submit"
                                        className="gc-submit"
                                        disabled={isSubmitting}
                                        style={{
                                            width: "100%",
                                            padding: "15px 24px",
                                            backgroundColor: isSubmitting ? `${accentColor}88` : accentColor,
                                            color: "#07071c",
                                            border: "none",
                                            borderRadius: 10,
                                            fontSize: 15,
                                            fontWeight: 600,
                                            fontFamily,
                                            cursor: isSubmitting ? "not-allowed" : "pointer",
                                            transition: "all 0.2s",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: 8,
                                            marginTop: 2,
                                        }}
                                    >
                                        {isSubmitting ? "Sending..." : submitButtonText}
                                        {!isSubmitting && <span style={{ fontSize: 17 }}>&#8594;</span>}
                                    </button>

                                    <p style={{ fontSize: 11, color: secondaryTextColor, margin: 0, textAlign: "center", fontFamily, opacity: 0.5 }}>
                                        Free PDF &middot; No credit card
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

addPropertyControls(GatedContentPage, {
    beamrLogo: { type: ControlType.Image, title: "Beamr Logo" },
    nvidiaLogo: { type: ControlType.Image, title: "NVIDIA Logo" },
    heading: { type: ControlType.String, title: "Heading", defaultValue: "Optimized Compression\nValidated on Cosmos Curator", displayTextArea: true },
    subheading: { type: ControlType.String, title: "Subheading", defaultValue: "41–57% smaller files. Zero impact on AI model fidelity.", displayTextArea: true },
    stats: {
        type: ControlType.Array,
        title: "Stats",
        maxCount: 4,
        control: {
            type: ControlType.Object,
            controls: {
                value: { type: ControlType.String, title: "Value", defaultValue: "50%" },
                label: { type: ControlType.String, title: "Label", defaultValue: "Description" },
            },
        },
        defaultValue: [
            { value: "41–57%", label: "Bitrate reduction" },
            { value: "~95%", label: "VRI agreement" },
            { value: ">0.98", label: "Cluster accuracy" },
        ],
    },

    formHeading: { type: ControlType.String, title: "Form Heading", defaultValue: "Get the Full Research" },
    submitButtonText: { type: ControlType.String, title: "Submit Text", defaultValue: "Download Free Report", hidden: (props) => props.useEmbeddedHubspot },
    useEmbeddedHubspot: { type: ControlType.Boolean, title: "Embed HubSpot", defaultValue: false },
    hubspotPortalId: { type: ControlType.String, title: "Portal ID", defaultValue: "" },
    hubspotFormId: { type: ControlType.String, title: "Form ID", defaultValue: "" },
    showCompanyField: { type: ControlType.Boolean, title: "Company Field", defaultValue: true, hidden: (props) => props.useEmbeddedHubspot },
    showConsent: { type: ControlType.Boolean, title: "Consent", defaultValue: true, hidden: (props) => props.useEmbeddedHubspot },
    consentText: { type: ControlType.String, title: "Consent Text", defaultValue: "I agree to receive communications from Beamr. Unsubscribe anytime.", displayTextArea: true, hidden: (props) => props.useEmbeddedHubspot || !props.showConsent },

    thankYouHeading: { type: ControlType.String, title: "TY Heading", defaultValue: "Check Your Inbox" },
    thankYouMessage: { type: ControlType.String, title: "TY Message", defaultValue: "The full benchmark report is on its way to your email.", displayTextArea: true },
    thankYouCtaText: { type: ControlType.String, title: "TY CTA", defaultValue: "Visit Beamr.com" },
    thankYouCtaUrl: { type: ControlType.String, title: "TY URL", defaultValue: "/" },

    bgColor: { type: ControlType.Color, title: "Background", defaultValue: "#07071c" },
    cardBgColor: { type: ControlType.Color, title: "Card BG", defaultValue: "#0f1029" },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: "#ffffff" },
    secondaryTextColor: { type: ControlType.Color, title: "Secondary", defaultValue: "#8b8ba3" },
    accentColor: { type: ControlType.Color, title: "Accent", defaultValue: "#00d46a" },
    fontFamily: { type: ControlType.String, title: "Font", defaultValue: "'Inter', sans-serif" },
})

export default GatedContentPage
