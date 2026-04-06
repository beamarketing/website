// Beamr - Gated Content Landing Page
// Framer Code Component with HubSpot form integration
// Campaign landing page for gated benchmark research downloads

import { addPropertyControls, ControlType } from "framer"
import { useState, useEffect, useRef } from "react"

interface KeyFinding {
    stat: string
    label: string
}

interface Props {
    badge: string
    showBadge: boolean
    heading: string
    subheading: string
    contentType: string
    keyFindings: KeyFinding[]
    showKeyFindings: boolean
    showSocialProof: boolean
    downloadCount: string
    socialProofText: string

    formHeading: string
    formSubheading: string
    hubspotPortalId: string
    hubspotFormId: string
    useEmbeddedHubspot: boolean
    submitButtonText: string
    firstNameLabel: string
    lastNameLabel: string
    emailLabel: string
    companyLabel: string
    showCompanyField: boolean
    consentText: string
    showConsent: boolean

    thankYouHeading: string
    thankYouMessage: string
    thankYouCtaText: string
    thankYouCtaUrl: string

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
        badge = "NVIDIA Cosmos Curator Benchmark",
        showBadge = true,
        heading = "Beamr CABR Validated on\nNVIDIA Cosmos Curator",
        subheading = "41-57% bitrate reduction with zero measurable impact on AI model fidelity. Full methodology, embedding analysis, and VRI results across 9 AV pipeline test videos.",
        contentType = "Research Report",

        keyFindings = [
            { stat: "41–57%", label: "Bitrate reduction while preserving model fidelity" },
            { stat: "~95%", label: "VRI scene classification agreement across all videos" },
            { stat: ">0.98", label: "K-means ARI — compression invisible to clustering" },
            { stat: "<0.25", label: "Compression SNR — well below model noise floor" },
        ],
        showKeyFindings = true,

        showSocialProof = true,
        downloadCount = "Beamr + NVIDIA",
        socialProofText = "Joint validation research",

        formHeading = "Get the Full Research",
        formSubheading = "We'll send the complete benchmark report to your inbox.",
        hubspotPortalId = "",
        hubspotFormId = "",
        useEmbeddedHubspot = false,
        submitButtonText = "Download the Report",
        firstNameLabel = "First Name",
        lastNameLabel = "Last Name",
        emailLabel = "Work Email",
        companyLabel = "Company",
        showCompanyField = true,
        consentText = "I agree to receive communications from Beamr. You can unsubscribe at any time.",
        showConsent = true,

        thankYouHeading = "Check Your Inbox",
        thankYouMessage = "We've sent the full benchmark report to your email. If you don't see it in a few minutes, check your spam folder.",
        thankYouCtaText = "Back to Homepage",
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
    const borderAlpha = "rgba(255,255,255,0.06)"

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
                    body: JSON.stringify({
                        fields,
                        context: { pageUri: window.location.href, pageName: document.title },
                    }),
                }
            )
            if (res.ok) setSubmitted(true)
            else setFormError("Something went wrong. Please try again.")
        } catch {
            setFormError("Network error. Please check your connection.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "14px 16px",
        backgroundColor: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 10,
        color: textColor,
        fontSize: 15,
        fontFamily,
        outline: "none",
        boxSizing: "border-box",
        transition: "border-color 0.2s",
    }

    const labelStyle: React.CSSProperties = {
        fontSize: 13,
        fontWeight: 500,
        color: secondaryTextColor,
        marginBottom: 6,
        display: "block",
        fontFamily,
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
            }}
        >
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 1000,
                    height: 800,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${accentColor}08 0%, transparent 70%)`,
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            />

            <style>{`
                .gc-input:focus { border-color: ${accentColor} !important; }
                .gc-input::placeholder { color: ${secondaryTextColor}; opacity: 0.5; }
                .gc-submit:hover { opacity: 0.92; transform: translateY(-1px); }
                .gc-submit:active { transform: translateY(0); }
                .gc-finding:hover { border-color: ${accentColor}44 !important; }
                .gc-hs-embed .hs-form input[type="text"],
                .gc-hs-embed .hs-form input[type="email"],
                .gc-hs-embed .hs-form select,
                .gc-hs-embed .hs-form textarea {
                    width: 100% !important; padding: 14px 16px !important;
                    background-color: rgba(255,255,255,0.04) !important;
                    border: 1px solid rgba(255,255,255,0.1) !important;
                    border-radius: 10px !important; color: ${textColor} !important;
                    font-size: 15px !important; font-family: ${fontFamily} !important;
                    box-sizing: border-box !important;
                }
                .gc-hs-embed .hs-form input:focus { border-color: ${accentColor} !important; outline: none !important; }
                .gc-hs-embed .hs-form .hs-button {
                    width: 100% !important; padding: 16px 32px !important;
                    background-color: ${accentColor} !important; color: #07071c !important;
                    border: none !important; border-radius: 10px !important;
                    font-size: 16px !important; font-weight: 600 !important;
                    font-family: ${fontFamily} !important; cursor: pointer !important;
                }
                .gc-hs-embed .hs-form label { color: ${secondaryTextColor} !important; font-size: 13px !important; }
                .gc-hs-embed .hs-form .hs-error-msgs label { color: #ff4d4d !important; }
            `}</style>

            {/* Two-column layout — stats left, form right */}
            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    maxWidth: 1120,
                    margin: "0 auto",
                    padding: isMobile ? "80px 20px 60px" : "120px 48px 100px",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: isMobile ? 40 : 56,
                    alignItems: "flex-start",
                }}
            >
                {/* Left — Hero + Key Findings */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    {showBadge && (
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "8px 20px",
                                borderRadius: 100,
                                border: "1px solid rgba(255,255,255,0.1)",
                                backgroundColor: "rgba(255,255,255,0.04)",
                                fontSize: 14,
                                color: textColor,
                                opacity: 0.8,
                                fontFamily,
                                marginBottom: 24,
                            }}
                        >
                            <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: accentColor }} />
                            {badge}
                        </div>
                    )}

                    <h1
                        style={{
                            fontSize: isMobile ? 32 : 48,
                            fontWeight: 700,
                            color: textColor,
                            margin: 0,
                            lineHeight: 1.1,
                            letterSpacing: "-0.02em",
                            fontFamily,
                            whiteSpace: "pre-line",
                        }}
                    >
                        {heading}
                    </h1>

                    <p
                        style={{
                            fontSize: isMobile ? 15 : 17,
                            color: textColor,
                            opacity: 0.65,
                            lineHeight: 1.6,
                            margin: "16px 0 0",
                            fontFamily,
                            maxWidth: 540,
                        }}
                    >
                        {subheading}
                    </p>

                    {showSocialProof && (
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                marginTop: 20,
                                padding: "6px 14px",
                                borderRadius: 8,
                                backgroundColor: "rgba(255,255,255,0.03)",
                            }}
                        >
                            <span style={{ fontSize: 13, color: accentColor, fontWeight: 700, fontFamily }}>
                                {downloadCount}
                            </span>
                            <span style={{ fontSize: 13, color: secondaryTextColor, fontFamily }}>
                                {socialProofText}
                            </span>
                        </div>
                    )}

                    {/* Key Findings */}
                    {showKeyFindings && keyFindings.length > 0 && (
                        <div style={{ marginTop: 40 }}>
                            <span
                                style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: accentColor,
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                    fontFamily,
                                }}
                            >
                                KEY FINDINGS
                            </span>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                                    gap: 14,
                                    marginTop: 16,
                                }}
                            >
                                {keyFindings.map((f, i) => (
                                    <div
                                        key={i}
                                        className="gc-finding"
                                        style={{
                                            backgroundColor: cardBgColor,
                                            borderRadius: 12,
                                            border: `1px solid ${borderAlpha}`,
                                            padding: "20px",
                                            transition: "border-color 0.2s",
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: isMobile ? 26 : 30,
                                                fontWeight: 800,
                                                color: accentColor,
                                                fontFamily,
                                                lineHeight: 1,
                                                marginBottom: 6,
                                            }}
                                        >
                                            {f.stat}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 13,
                                                color: secondaryTextColor,
                                                lineHeight: 1.45,
                                                fontFamily,
                                            }}
                                        >
                                            {f.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right — Form Card */}
                <div
                    style={{
                        width: isMobile ? "100%" : 400,
                        flexShrink: 0,
                        position: isMobile ? "relative" : "sticky",
                        top: isMobile ? undefined : 32,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: cardBgColor,
                            borderRadius: 20,
                            border: `1px solid ${borderAlpha}`,
                            padding: isMobile ? "32px 24px" : "36px 32px",
                            boxSizing: "border-box",
                            position: "relative",
                            overflow: "hidden",
                            boxShadow: "0 32px 64px rgba(0,0,0,0.3)",
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                top: -60,
                                right: -60,
                                width: 200,
                                height: 200,
                                borderRadius: "50%",
                                background: `radial-gradient(circle, ${accentColor}12 0%, transparent 70%)`,
                                pointerEvents: "none",
                            }}
                        />

                        {submitted ? (
                            <div
                                style={{
                                    textAlign: "center",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 16,
                                    padding: "16px 0",
                                    position: "relative",
                                    zIndex: 1,
                                }}
                            >
                                <div
                                    style={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: "50%",
                                        backgroundColor: `${accentColor}18`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 24,
                                        color: accentColor,
                                    }}
                                >
                                    &#10003;
                                </div>
                                <h3 style={{ fontSize: 22, fontWeight: 700, color: textColor, margin: 0, fontFamily }}>
                                    {thankYouHeading}
                                </h3>
                                <p style={{ fontSize: 14, color: secondaryTextColor, margin: 0, lineHeight: 1.6, fontFamily }}>
                                    {thankYouMessage}
                                </p>
                                <a
                                    href={thankYouCtaUrl}
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 8,
                                        marginTop: 8,
                                        padding: "14px 32px",
                                        backgroundColor: accentColor,
                                        color: "#07071c",
                                        borderRadius: 10,
                                        fontSize: 16,
                                        fontWeight: 600,
                                        textDecoration: "none",
                                        fontFamily,
                                    }}
                                >
                                    {thankYouCtaText}
                                    <span style={{ fontSize: 18 }}>&#8594;</span>
                                </a>
                            </div>
                        ) : useEmbeddedHubspot && hubspotPortalId && hubspotFormId ? (
                            <div style={{ position: "relative", zIndex: 1 }}>
                                <h3 style={{ fontSize: 20, fontWeight: 700, color: textColor, margin: "0 0 6px", fontFamily }}>
                                    {formHeading}
                                </h3>
                                <p style={{ fontSize: 14, color: secondaryTextColor, margin: "0 0 20px", lineHeight: 1.5, fontFamily }}>
                                    {formSubheading}
                                </p>
                                <div ref={hubspotRef} className="gc-hs-embed" />
                            </div>
                        ) : (
                            <form
                                onSubmit={handleSubmit}
                                style={{ display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}
                            >
                                <h3 style={{ fontSize: 20, fontWeight: 700, color: textColor, margin: "0 0 6px", fontFamily }}>
                                    {formHeading}
                                </h3>
                                <p style={{ fontSize: 14, color: secondaryTextColor, margin: "0 0 24px", lineHeight: 1.5, fontFamily }}>
                                    {formSubheading}
                                </p>

                                <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={labelStyle}>{firstNameLabel} *</label>
                                        <input className="gc-input" type="text" name="firstname" required placeholder="John" style={inputStyle} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={labelStyle}>{lastNameLabel} *</label>
                                        <input className="gc-input" type="text" name="lastname" required placeholder="Doe" style={inputStyle} />
                                    </div>
                                </div>

                                <div style={{ marginBottom: 14 }}>
                                    <label style={labelStyle}>{emailLabel} *</label>
                                    <input className="gc-input" type="email" name="email" required placeholder="john@company.com" style={inputStyle} />
                                </div>

                                {showCompanyField && (
                                    <div style={{ marginBottom: 14 }}>
                                        <label style={labelStyle}>{companyLabel}</label>
                                        <input className="gc-input" type="text" name="company" placeholder="Acme Inc." style={inputStyle} />
                                    </div>
                                )}

                                {showConsent && (
                                    <label style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 20, marginTop: 4, cursor: "pointer" }}>
                                        <input type="checkbox" required style={{ marginTop: 3, accentColor, flexShrink: 0 }} />
                                        <span style={{ fontSize: 12, color: secondaryTextColor, lineHeight: 1.5, fontFamily }}>
                                            {consentText}
                                        </span>
                                    </label>
                                )}

                                {formError && (
                                    <p style={{ fontSize: 13, color: "#ff4d4d", margin: "0 0 12px", fontFamily }}>{formError}</p>
                                )}

                                <button
                                    type="submit"
                                    className="gc-submit"
                                    disabled={isSubmitting}
                                    style={{
                                        width: "100%",
                                        padding: "16px 32px",
                                        backgroundColor: isSubmitting ? `${accentColor}88` : accentColor,
                                        color: "#07071c",
                                        border: "none",
                                        borderRadius: 10,
                                        fontSize: 16,
                                        fontWeight: 600,
                                        fontFamily,
                                        cursor: isSubmitting ? "not-allowed" : "pointer",
                                        transition: "all 0.2s",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 8,
                                    }}
                                >
                                    {isSubmitting ? "Sending..." : submitButtonText}
                                    {!isSubmitting && <span style={{ fontSize: 18 }}>&#8594;</span>}
                                </button>

                                <p style={{ fontSize: 11, color: secondaryTextColor, margin: "14px 0 0", textAlign: "center", fontFamily, opacity: 0.6 }}>
                                    PDF &middot; Free &middot; No credit card required
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

addPropertyControls(GatedContentPage, {
    showBadge: { type: ControlType.Boolean, title: "Show Badge", defaultValue: true },
    badge: { type: ControlType.String, title: "Badge Text", defaultValue: "NVIDIA Cosmos Curator Benchmark", hidden: (props) => !props.showBadge },
    contentType: {
        type: ControlType.Enum,
        title: "Content Type",
        options: ["Research Report", "Whitepaper", "Benchmark Study", "eBook", "Guide", "Case Study"],
        defaultValue: "Research Report",
    },
    heading: { type: ControlType.String, title: "Heading", defaultValue: "Beamr CABR Validated on\nNVIDIA Cosmos Curator", displayTextArea: true },
    subheading: { type: ControlType.String, title: "Subheading", defaultValue: "41-57% bitrate reduction with zero measurable impact on AI model fidelity. Full methodology, embedding analysis, and VRI results across 9 AV pipeline test videos.", displayTextArea: true },

    showKeyFindings: { type: ControlType.Boolean, title: "Key Findings", defaultValue: true },
    keyFindings: {
        type: ControlType.Array,
        title: "Findings",
        maxCount: 6,
        hidden: (props) => !props.showKeyFindings,
        control: {
            type: ControlType.Object,
            controls: {
                stat: { type: ControlType.String, title: "Stat", defaultValue: "50%" },
                label: { type: ControlType.String, title: "Label", defaultValue: "Description" },
            },
        },
        defaultValue: [
            { stat: "41–57%", label: "Bitrate reduction while preserving model fidelity" },
            { stat: "~95%", label: "VRI scene classification agreement across all videos" },
            { stat: ">0.98", label: "K-means ARI — compression invisible to clustering" },
            { stat: "<0.25", label: "Compression SNR — well below model noise floor" },
        ],
    },

    showSocialProof: { type: ControlType.Boolean, title: "Social Proof", defaultValue: true },
    downloadCount: { type: ControlType.String, title: "Proof Bold", defaultValue: "Beamr + NVIDIA", hidden: (props) => !props.showSocialProof },
    socialProofText: { type: ControlType.String, title: "Proof Text", defaultValue: "Joint validation research", hidden: (props) => !props.showSocialProof },

    formHeading: { type: ControlType.String, title: "Form Heading", defaultValue: "Get the Full Research" },
    formSubheading: { type: ControlType.String, title: "Form Subhead", defaultValue: "We'll send the complete benchmark report to your inbox.", displayTextArea: true },
    useEmbeddedHubspot: { type: ControlType.Boolean, title: "Embed HubSpot", defaultValue: false },
    hubspotPortalId: { type: ControlType.String, title: "Portal ID", defaultValue: "" },
    hubspotFormId: { type: ControlType.String, title: "Form ID", defaultValue: "" },
    submitButtonText: { type: ControlType.String, title: "Submit Text", defaultValue: "Download the Report", hidden: (props) => props.useEmbeddedHubspot },
    firstNameLabel: { type: ControlType.String, title: "First Name", defaultValue: "First Name", hidden: (props) => props.useEmbeddedHubspot },
    lastNameLabel: { type: ControlType.String, title: "Last Name", defaultValue: "Last Name", hidden: (props) => props.useEmbeddedHubspot },
    emailLabel: { type: ControlType.String, title: "Email Label", defaultValue: "Work Email", hidden: (props) => props.useEmbeddedHubspot },
    showCompanyField: { type: ControlType.Boolean, title: "Company Field", defaultValue: true, hidden: (props) => props.useEmbeddedHubspot },
    companyLabel: { type: ControlType.String, title: "Company Label", defaultValue: "Company", hidden: (props) => props.useEmbeddedHubspot || !props.showCompanyField },
    showConsent: { type: ControlType.Boolean, title: "Consent Box", defaultValue: true, hidden: (props) => props.useEmbeddedHubspot },
    consentText: { type: ControlType.String, title: "Consent Text", defaultValue: "I agree to receive communications from Beamr. You can unsubscribe at any time.", displayTextArea: true, hidden: (props) => props.useEmbeddedHubspot || !props.showConsent },

    thankYouHeading: { type: ControlType.String, title: "TY Heading", defaultValue: "Check Your Inbox" },
    thankYouMessage: { type: ControlType.String, title: "TY Message", defaultValue: "We've sent the full benchmark report to your email. If you don't see it in a few minutes, check your spam folder.", displayTextArea: true },
    thankYouCtaText: { type: ControlType.String, title: "TY CTA Text", defaultValue: "Back to Homepage" },
    thankYouCtaUrl: { type: ControlType.String, title: "TY CTA URL", defaultValue: "/" },

    bgColor: { type: ControlType.Color, title: "Background", defaultValue: "#07071c" },
    cardBgColor: { type: ControlType.Color, title: "Card BG", defaultValue: "#0f1029" },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: "#ffffff" },
    secondaryTextColor: { type: ControlType.Color, title: "Secondary Text", defaultValue: "#8b8ba3" },
    accentColor: { type: ControlType.Color, title: "Accent", defaultValue: "#00d46a" },
    fontFamily: { type: ControlType.String, title: "Font Family", defaultValue: "'Inter', sans-serif" },
})

export default GatedContentPage
