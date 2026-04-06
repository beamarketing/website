// Beamr - Gated Content Landing Page
// Framer Code Component with HubSpot form integration
// Campaign landing page for gated benchmark research downloads

import { addPropertyControls, ControlType } from "framer"
import { useState, useEffect, useRef } from "react"

// ─── Types ───────────────────────────────────────────────────────────────────

interface KeyFinding {
    stat: string
    label: string
}

interface Highlight {
    icon: string
    title: string
    description: string
}

interface Props {
    // Hero
    badge: string
    showBadge: boolean
    heading: string
    subheading: string
    contentType: string

    // Research preview
    coverImage: string
    showCoverImage: boolean
    researchTitle: string
    researchDescription: string

    // Key findings
    sectionLabel: string
    keyFindingsHeading: string
    keyFindings: KeyFinding[]
    showKeyFindings: boolean

    // Highlights
    highlightsHeading: string
    highlights: Highlight[]
    showHighlights: boolean

    // Social proof
    showSocialProof: boolean
    downloadCount: string
    socialProofText: string

    // Form
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
    jobTitleLabel: string
    showJobTitleField: boolean
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

// ─── Component ───────────────────────────────────────────────────────────────

function GatedContentPage(props: Props) {
    const {
        badge = "New Research",
        showBadge = true,
        heading = "The State of Video\nEncoding Benchmark",
        subheading = "A comprehensive analysis of encoding performance across the industry — real-world data, head-to-head comparisons, and actionable insights for video engineering teams.",
        contentType = "Full Research Report",

        coverImage = "",
        showCoverImage = true,
        researchTitle = "About This Research",
        researchDescription = "This benchmark study analyzes encoding performance across 10,000+ video assets from leading streaming platforms, comparing quality metrics, bitrate efficiency, and processing speed. The full report includes detailed methodology, raw data tables, and strategic recommendations for optimizing your video pipeline.",

        sectionLabel = "KEY FINDINGS",
        keyFindingsHeading = "A Preview of What's Inside",
        keyFindings = [
            { stat: "50%", label: "Average bitrate reduction with content-adaptive encoding" },
            { stat: "99.2%", label: "VMAF score preservation across all test assets" },
            { stat: "3.2x", label: "Faster encoding vs. traditional multi-pass workflows" },
            { stat: "42%", label: "CDN cost savings reported by enterprise adopters" },
        ],
        showKeyFindings = true,

        highlightsHeading = "What You'll Get in the Full Report",
        highlights = [
            { icon: "📊", title: "Detailed Benchmarks", description: "Side-by-side codec comparisons with VMAF, SSIM, and PSNR scoring across diverse content types" },
            { icon: "🏢", title: "Enterprise Case Studies", description: "How leading streaming platforms achieved measurable ROI with content-adaptive encoding" },
            { icon: "⚙️", title: "Implementation Playbook", description: "Step-by-step integration guide with architecture diagrams and API examples" },
            { icon: "📈", title: "ROI Calculator", description: "Framework to estimate your own cost savings based on your current encoding pipeline" },
        ],
        showHighlights = true,

        showSocialProof = true,
        downloadCount = "2,500+",
        socialProofText = "video professionals have downloaded this research",

        formHeading = "Get the Full Research",
        formSubheading = "Enter your details to receive the complete benchmark report — sent straight to your inbox.",
        hubspotPortalId = "",
        hubspotFormId = "",
        useEmbeddedHubspot = false,
        submitButtonText = "Download the Report",
        firstNameLabel = "First Name",
        lastNameLabel = "Last Name",
        emailLabel = "Work Email",
        companyLabel = "Company",
        showCompanyField = true,
        jobTitleLabel = "Job Title",
        showJobTitleField = false,
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

    // ─── Responsive ──────────────────────────────────────────────────────────

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 860)
        check()
        window.addEventListener("resize", check)
        return () => window.removeEventListener("resize", check)
    }, [])

    // ─── HubSpot Embed ───────────────────────────────────────────────────────

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

    // ─── Form Submit ─────────────────────────────────────────────────────────

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
        if (showJobTitleField) fields.push({ name: "jobtitle", value: fd.get("jobtitle") as string })

        if (!hubspotPortalId || !hubspotFormId) {
            // Preview mode — simulate success
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

    // ─── Shared Styles ───────────────────────────────────────────────────────

    const borderAlpha = "rgba(255,255,255,0.06)"

    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "14px 16px",
        backgroundColor: "rgba(255,255,255,0.04)",
        border: `1px solid rgba(255,255,255,0.1)`,
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

    // ─── Render ──────────────────────────────────────────────────────────────

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
            {/* Global glow — matches Hero.tsx radial */}
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

            {/* Inject interaction styles */}
            <style>{`
                .gc-input:focus { border-color: ${accentColor} !important; }
                .gc-input::placeholder { color: ${secondaryTextColor}; opacity: 0.5; }
                .gc-submit:hover { opacity: 0.92; transform: translateY(-1px); }
                .gc-submit:active { transform: translateY(0); }
                .gc-finding:hover { border-color: ${accentColor}44 !important; }
                .gc-highlight:hover { background: rgba(255,255,255,0.03) !important; border-color: rgba(255,255,255,0.12) !important; }
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
                .gc-hs-embed .hs-form label { color: ${secondaryTextColor} !important; font-size: 13px !important; font-weight: 500 !important; }
                .gc-hs-embed .hs-form .hs-error-msgs label { color: #ff4d4d !important; }
            `}</style>

            {/* ════════════════════════════════════════════════════════════════
                HERO
            ════════════════════════════════════════════════════════════════ */}
            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    width: "100%",
                    padding: isMobile ? "80px 20px 40px" : "120px 48px 64px",
                    boxSizing: "border-box",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                {/* Badge — matches Hero.tsx dot-pill pattern */}
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
                        <span
                            style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                backgroundColor: accentColor,
                            }}
                        />
                        {badge} — {contentType}
                    </div>
                )}

                <h1
                    style={{
                        fontSize: isMobile ? 36 : 56,
                        fontWeight: 700,
                        color: textColor,
                        margin: 0,
                        lineHeight: 1.1,
                        letterSpacing: "-0.02em",
                        fontFamily,
                        whiteSpace: "pre-line",
                        maxWidth: 820,
                    }}
                >
                    {heading}
                </h1>

                <p
                    style={{
                        fontSize: isMobile ? 16 : 18,
                        color: textColor,
                        opacity: 0.65,
                        lineHeight: 1.6,
                        margin: "20px 0 0",
                        fontFamily,
                        maxWidth: 640,
                    }}
                >
                    {subheading}
                </p>

                {/* Social proof */}
                {showSocialProof && (
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            marginTop: 28,
                            padding: "6px 16px",
                            borderRadius: 8,
                            backgroundColor: "rgba(255,255,255,0.03)",
                        }}
                    >
                        <span style={{ fontSize: 14, color: accentColor, fontWeight: 700, fontFamily }}>
                            {downloadCount}
                        </span>
                        <span style={{ fontSize: 14, color: secondaryTextColor, fontFamily }}>
                            {socialProofText}
                        </span>
                    </div>
                )}
            </div>

            {/* ════════════════════════════════════════════════════════════════
                MAIN TWO-COLUMN LAYOUT
            ════════════════════════════════════════════════════════════════ */}
            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    maxWidth: 1200,
                    margin: "0 auto",
                    padding: isMobile ? "0 20px 60px" : "0 48px 100px",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: isMobile ? 48 : 56,
                    alignItems: "flex-start",
                }}
            >
                {/* ── Left Column ─────────────────────────────────────────── */}
                <div style={{ flex: 1, minWidth: 0 }}>

                    {/* Cover image */}
                    {showCoverImage && coverImage && (
                        <div
                            style={{
                                width: "100%",
                                borderRadius: 16,
                                overflow: "hidden",
                                border: `1px solid ${borderAlpha}`,
                                marginBottom: 48,
                                boxShadow: `0 40px 80px rgba(0,0,0,0.4), 0 0 80px ${accentColor}06`,
                            }}
                        >
                            <img
                                src={coverImage}
                                alt="Research preview"
                                style={{ width: "100%", height: "auto", display: "block" }}
                            />
                        </div>
                    )}

                    {/* About the research */}
                    <div style={{ marginBottom: 48 }}>
                        <h2
                            style={{
                                fontSize: isMobile ? 24 : 28,
                                fontWeight: 700,
                                color: textColor,
                                margin: "0 0 16px",
                                lineHeight: 1.2,
                                letterSpacing: "-0.02em",
                                fontFamily,
                            }}
                        >
                            {researchTitle}
                        </h2>
                        <p
                            style={{
                                fontSize: 16,
                                color: textColor,
                                opacity: 0.65,
                                margin: 0,
                                lineHeight: 1.7,
                                fontFamily,
                            }}
                        >
                            {researchDescription}
                        </p>
                    </div>

                    {/* Key Findings — stat cards */}
                    {showKeyFindings && keyFindings.length > 0 && (
                        <div style={{ marginBottom: 48 }}>
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
                                {sectionLabel}
                            </span>
                            <h3
                                style={{
                                    fontSize: isMobile ? 20 : 24,
                                    fontWeight: 700,
                                    color: textColor,
                                    margin: "12px 0 24px",
                                    letterSpacing: "-0.02em",
                                    fontFamily,
                                }}
                            >
                                {keyFindingsHeading}
                            </h3>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                                    gap: 16,
                                }}
                            >
                                {keyFindings.map((finding, i) => (
                                    <div
                                        key={i}
                                        className="gc-finding"
                                        style={{
                                            backgroundColor: cardBgColor,
                                            borderRadius: 12,
                                            border: `1px solid ${borderAlpha}`,
                                            padding: "24px",
                                            transition: "border-color 0.2s",
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: isMobile ? 28 : 32,
                                                fontWeight: 800,
                                                color: accentColor,
                                                fontFamily,
                                                lineHeight: 1,
                                                marginBottom: 8,
                                            }}
                                        >
                                            {finding.stat}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 14,
                                                color: secondaryTextColor,
                                                lineHeight: 1.5,
                                                fontFamily,
                                            }}
                                        >
                                            {finding.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Highlights — what's included */}
                    {showHighlights && highlights.length > 0 && (
                        <div>
                            <h3
                                style={{
                                    fontSize: isMobile ? 20 : 24,
                                    fontWeight: 700,
                                    color: textColor,
                                    margin: "0 0 24px",
                                    letterSpacing: "-0.02em",
                                    fontFamily,
                                }}
                            >
                                {highlightsHeading}
                            </h3>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 12,
                                }}
                            >
                                {highlights.map((h, i) => (
                                    <div
                                        key={i}
                                        className="gc-highlight"
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: 16,
                                            padding: "20px",
                                            borderRadius: 12,
                                            backgroundColor: cardBgColor,
                                            border: `1px solid ${borderAlpha}`,
                                            transition: "all 0.2s",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 44,
                                                height: 44,
                                                borderRadius: 10,
                                                backgroundColor: `${accentColor}12`,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 22,
                                                flexShrink: 0,
                                            }}
                                        >
                                            {h.icon}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div
                                                style={{
                                                    fontSize: 15,
                                                    fontWeight: 600,
                                                    color: textColor,
                                                    fontFamily,
                                                    marginBottom: 4,
                                                }}
                                            >
                                                {h.title}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 14,
                                                    color: secondaryTextColor,
                                                    lineHeight: 1.5,
                                                    fontFamily,
                                                }}
                                            >
                                                {h.description}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Right Column: Form Card ─────────────────────────────── */}
                <div
                    style={{
                        width: isMobile ? "100%" : 420,
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
                            padding: isMobile ? "32px 24px" : "40px 36px",
                            boxSizing: "border-box",
                            position: "relative",
                            overflow: "hidden",
                            boxShadow: `0 32px 64px rgba(0,0,0,0.3)`,
                        }}
                    >
                        {/* Card glow — matches CTASection.tsx */}
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
                            /* ── Thank You ── */
                            <div
                                style={{
                                    textAlign: "center",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 16,
                                    padding: "20px 0",
                                    position: "relative",
                                    zIndex: 1,
                                }}
                            >
                                <div
                                    style={{
                                        width: 64,
                                        height: 64,
                                        borderRadius: "50%",
                                        backgroundColor: `${accentColor}18`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 28,
                                        color: accentColor,
                                    }}
                                >
                                    &#10003;
                                </div>
                                <h3
                                    style={{
                                        fontSize: 24,
                                        fontWeight: 700,
                                        color: textColor,
                                        margin: 0,
                                        fontFamily,
                                    }}
                                >
                                    {thankYouHeading}
                                </h3>
                                <p
                                    style={{
                                        fontSize: 15,
                                        color: secondaryTextColor,
                                        margin: 0,
                                        lineHeight: 1.6,
                                        fontFamily,
                                    }}
                                >
                                    {thankYouMessage}
                                </p>
                                <a
                                    href={thankYouCtaUrl}
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 8,
                                        marginTop: 12,
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
                            /* ── Embedded HubSpot ── */
                            <div style={{ position: "relative", zIndex: 1 }}>
                                <h3 style={{ fontSize: 22, fontWeight: 700, color: textColor, margin: "0 0 8px", fontFamily }}>
                                    {formHeading}
                                </h3>
                                <p style={{ fontSize: 14, color: secondaryTextColor, margin: "0 0 24px", lineHeight: 1.5, fontFamily }}>
                                    {formSubheading}
                                </p>
                                <div ref={hubspotRef} className="gc-hs-embed" />
                            </div>
                        ) : (
                            /* ── Custom Form ── */
                            <form
                                onSubmit={handleSubmit}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    position: "relative",
                                    zIndex: 1,
                                }}
                            >
                                <h3
                                    style={{
                                        fontSize: 22,
                                        fontWeight: 700,
                                        color: textColor,
                                        margin: "0 0 8px",
                                        fontFamily,
                                    }}
                                >
                                    {formHeading}
                                </h3>
                                <p
                                    style={{
                                        fontSize: 14,
                                        color: secondaryTextColor,
                                        margin: "0 0 28px",
                                        lineHeight: 1.5,
                                        fontFamily,
                                    }}
                                >
                                    {formSubheading}
                                </p>

                                {/* Name row */}
                                <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={labelStyle}>{firstNameLabel} *</label>
                                        <input className="gc-input" type="text" name="firstname" required placeholder="John" style={inputStyle} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={labelStyle}>{lastNameLabel} *</label>
                                        <input className="gc-input" type="text" name="lastname" required placeholder="Doe" style={inputStyle} />
                                    </div>
                                </div>

                                {/* Email */}
                                <div style={{ marginBottom: 16 }}>
                                    <label style={labelStyle}>{emailLabel} *</label>
                                    <input className="gc-input" type="email" name="email" required placeholder="john@company.com" style={inputStyle} />
                                </div>

                                {/* Company */}
                                {showCompanyField && (
                                    <div style={{ marginBottom: 16 }}>
                                        <label style={labelStyle}>{companyLabel}</label>
                                        <input className="gc-input" type="text" name="company" placeholder="Acme Inc." style={inputStyle} />
                                    </div>
                                )}

                                {/* Job Title */}
                                {showJobTitleField && (
                                    <div style={{ marginBottom: 16 }}>
                                        <label style={labelStyle}>{jobTitleLabel}</label>
                                        <input className="gc-input" type="text" name="jobtitle" placeholder="VP of Engineering" style={inputStyle} />
                                    </div>
                                )}

                                {/* Consent */}
                                {showConsent && (
                                    <label
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: 10,
                                            marginBottom: 24,
                                            marginTop: 8,
                                            cursor: "pointer",
                                        }}
                                    >
                                        <input type="checkbox" required style={{ marginTop: 3, accentColor, flexShrink: 0 }} />
                                        <span style={{ fontSize: 13, color: secondaryTextColor, lineHeight: 1.5, fontFamily }}>
                                            {consentText}
                                        </span>
                                    </label>
                                )}

                                {/* Error */}
                                {formError && (
                                    <p style={{ fontSize: 13, color: "#ff4d4d", margin: "0 0 12px", fontFamily }}>
                                        {formError}
                                    </p>
                                )}

                                {/* Submit — matches Hero.tsx primary CTA pattern */}
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

                                {/* Privacy */}
                                <p
                                    style={{
                                        fontSize: 12,
                                        color: secondaryTextColor,
                                        margin: "16px 0 0",
                                        textAlign: "center",
                                        lineHeight: 1.5,
                                        fontFamily,
                                        opacity: 0.6,
                                    }}
                                >
                                    Your data is safe. We never share your information with third parties.
                                </p>
                            </form>
                        )}
                    </div>

                    {/* Content type tag below form card */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 12,
                            marginTop: 20,
                            opacity: 0.5,
                        }}
                    >
                        <span style={{ fontSize: 13, color: secondaryTextColor, fontFamily }}>
                            PDF &middot; Free &middot; No credit card required
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}

// ─── Framer Property Controls ────────────────────────────────────────────────

addPropertyControls(GatedContentPage, {
    // ── Hero ──
    showBadge: {
        type: ControlType.Boolean,
        title: "Show Badge",
        defaultValue: true,
    },
    badge: {
        type: ControlType.String,
        title: "Badge Text",
        defaultValue: "New Research",
        hidden: (props) => !props.showBadge,
    },
    contentType: {
        type: ControlType.Enum,
        title: "Content Type",
        options: ["Full Research Report", "Whitepaper", "Benchmark Study", "eBook", "Guide", "Case Study"],
        defaultValue: "Full Research Report",
    },
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "The State of Video\nEncoding Benchmark",
        displayTextArea: true,
    },
    subheading: {
        type: ControlType.String,
        title: "Subheading",
        defaultValue: "A comprehensive analysis of encoding performance across the industry — real-world data, head-to-head comparisons, and actionable insights for video engineering teams.",
        displayTextArea: true,
    },

    // ── Research Preview ──
    showCoverImage: {
        type: ControlType.Boolean,
        title: "Cover Image",
        defaultValue: true,
    },
    coverImage: {
        type: ControlType.Image,
        title: "Cover",
        hidden: (props) => !props.showCoverImage,
    },
    researchTitle: {
        type: ControlType.String,
        title: "Research Title",
        defaultValue: "About This Research",
    },
    researchDescription: {
        type: ControlType.String,
        title: "Research Desc",
        defaultValue: "This benchmark study analyzes encoding performance across 10,000+ video assets from leading streaming platforms, comparing quality metrics, bitrate efficiency, and processing speed. The full report includes detailed methodology, raw data tables, and strategic recommendations for optimizing your video pipeline.",
        displayTextArea: true,
    },

    // ── Key Findings ──
    showKeyFindings: {
        type: ControlType.Boolean,
        title: "Key Findings",
        defaultValue: true,
    },
    sectionLabel: {
        type: ControlType.String,
        title: "Section Label",
        defaultValue: "KEY FINDINGS",
        hidden: (props) => !props.showKeyFindings,
    },
    keyFindingsHeading: {
        type: ControlType.String,
        title: "Findings Title",
        defaultValue: "A Preview of What's Inside",
        hidden: (props) => !props.showKeyFindings,
    },
    keyFindings: {
        type: ControlType.Array,
        title: "Findings",
        maxCount: 8,
        hidden: (props) => !props.showKeyFindings,
        control: {
            type: ControlType.Object,
            controls: {
                stat: { type: ControlType.String, title: "Stat", defaultValue: "50%" },
                label: { type: ControlType.String, title: "Label", defaultValue: "Description of the finding" },
            },
        },
        defaultValue: [
            { stat: "50%", label: "Average bitrate reduction with content-adaptive encoding" },
            { stat: "99.2%", label: "VMAF score preservation across all test assets" },
            { stat: "3.2x", label: "Faster encoding vs. traditional multi-pass workflows" },
            { stat: "42%", label: "CDN cost savings reported by enterprise adopters" },
        ],
    },

    // ── Highlights ──
    showHighlights: {
        type: ControlType.Boolean,
        title: "Highlights",
        defaultValue: true,
    },
    highlightsHeading: {
        type: ControlType.String,
        title: "Highlights Title",
        defaultValue: "What You'll Get in the Full Report",
        hidden: (props) => !props.showHighlights,
    },
    highlights: {
        type: ControlType.Array,
        title: "Highlights",
        maxCount: 8,
        hidden: (props) => !props.showHighlights,
        control: {
            type: ControlType.Object,
            controls: {
                icon: { type: ControlType.String, title: "Icon", defaultValue: "📊" },
                title: { type: ControlType.String, title: "Title", defaultValue: "Highlight title" },
                description: { type: ControlType.String, title: "Description", defaultValue: "Highlight description" },
            },
        },
        defaultValue: [
            { icon: "📊", title: "Detailed Benchmarks", description: "Side-by-side codec comparisons with VMAF, SSIM, and PSNR scoring across diverse content types" },
            { icon: "🏢", title: "Enterprise Case Studies", description: "How leading streaming platforms achieved measurable ROI with content-adaptive encoding" },
            { icon: "⚙️", title: "Implementation Playbook", description: "Step-by-step integration guide with architecture diagrams and API examples" },
            { icon: "📈", title: "ROI Calculator", description: "Framework to estimate your own cost savings based on your current encoding pipeline" },
        ],
    },

    // ── Social Proof ──
    showSocialProof: {
        type: ControlType.Boolean,
        title: "Social Proof",
        defaultValue: true,
    },
    downloadCount: {
        type: ControlType.String,
        title: "Download #",
        defaultValue: "2,500+",
        hidden: (props) => !props.showSocialProof,
    },
    socialProofText: {
        type: ControlType.String,
        title: "Proof Text",
        defaultValue: "video professionals have downloaded this research",
        hidden: (props) => !props.showSocialProof,
    },

    // ── Form ──
    formHeading: {
        type: ControlType.String,
        title: "Form Heading",
        defaultValue: "Get the Full Research",
    },
    formSubheading: {
        type: ControlType.String,
        title: "Form Subhead",
        defaultValue: "Enter your details to receive the complete benchmark report — sent straight to your inbox.",
        displayTextArea: true,
    },
    useEmbeddedHubspot: {
        type: ControlType.Boolean,
        title: "Embed HubSpot",
        defaultValue: false,
    },
    hubspotPortalId: {
        type: ControlType.String,
        title: "Portal ID",
        defaultValue: "",
    },
    hubspotFormId: {
        type: ControlType.String,
        title: "Form ID",
        defaultValue: "",
    },
    submitButtonText: {
        type: ControlType.String,
        title: "Submit Text",
        defaultValue: "Download the Report",
        hidden: (props) => props.useEmbeddedHubspot,
    },
    firstNameLabel: { type: ControlType.String, title: "First Name", defaultValue: "First Name", hidden: (props) => props.useEmbeddedHubspot },
    lastNameLabel: { type: ControlType.String, title: "Last Name", defaultValue: "Last Name", hidden: (props) => props.useEmbeddedHubspot },
    emailLabel: { type: ControlType.String, title: "Email Label", defaultValue: "Work Email", hidden: (props) => props.useEmbeddedHubspot },
    showCompanyField: { type: ControlType.Boolean, title: "Company Field", defaultValue: true, hidden: (props) => props.useEmbeddedHubspot },
    companyLabel: { type: ControlType.String, title: "Company Label", defaultValue: "Company", hidden: (props) => props.useEmbeddedHubspot || !props.showCompanyField },
    showJobTitleField: { type: ControlType.Boolean, title: "Job Title Field", defaultValue: false, hidden: (props) => props.useEmbeddedHubspot },
    jobTitleLabel: { type: ControlType.String, title: "Job Title Label", defaultValue: "Job Title", hidden: (props) => props.useEmbeddedHubspot || !props.showJobTitleField },
    showConsent: { type: ControlType.Boolean, title: "Consent Box", defaultValue: true, hidden: (props) => props.useEmbeddedHubspot },
    consentText: { type: ControlType.String, title: "Consent Text", defaultValue: "I agree to receive communications from Beamr. You can unsubscribe at any time.", displayTextArea: true, hidden: (props) => props.useEmbeddedHubspot || !props.showConsent },

    // ── Thank You ──
    thankYouHeading: { type: ControlType.String, title: "TY Heading", defaultValue: "Check Your Inbox" },
    thankYouMessage: { type: ControlType.String, title: "TY Message", defaultValue: "We've sent the full benchmark report to your email. If you don't see it in a few minutes, check your spam folder.", displayTextArea: true },
    thankYouCtaText: { type: ControlType.String, title: "TY CTA Text", defaultValue: "Back to Homepage" },
    thankYouCtaUrl: { type: ControlType.String, title: "TY CTA URL", defaultValue: "/" },

    // ── Appearance ──
    bgColor: { type: ControlType.Color, title: "Background", defaultValue: "#07071c" },
    cardBgColor: { type: ControlType.Color, title: "Card BG", defaultValue: "#0f1029" },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: "#ffffff" },
    secondaryTextColor: { type: ControlType.Color, title: "Secondary Text", defaultValue: "#8b8ba3" },
    accentColor: { type: ControlType.Color, title: "Accent", defaultValue: "#00d46a" },
    fontFamily: { type: ControlType.String, title: "Font Family", defaultValue: "'Inter', sans-serif" },
})

export default GatedContentPage
