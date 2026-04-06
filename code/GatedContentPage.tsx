// Beamr - Gated Content Landing Page
// Framer Code Component with HubSpot form integration
// Displays content preview + gated form to capture leads

import { addPropertyControls, ControlType } from "framer"
import { useState, useEffect, useRef } from "react"

// ─── Types ───────────────────────────────────────────────────────────────────

interface Benefit {
    icon: string
    text: string
}

interface Props {
    // Content
    badge: string
    showBadge: boolean
    heading: string
    subheading: string
    contentTitle: string
    contentDescription: string
    contentImage: string
    contentType: string

    // Benefits / what you'll learn
    benefitsHeading: string
    benefits: Benefit[]

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

    // Thank you state
    thankYouHeading: string
    thankYouMessage: string
    thankYouCtaText: string
    thankYouCtaUrl: string

    // Social proof
    showSocialProof: boolean
    downloadCount: string
    socialProofText: string

    // Appearance
    bgColor: string
    cardBgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    borderColor: string
    fontFamily: string
    contentImageBorderRadius: number

    style?: React.CSSProperties
}

// ─── Component ───────────────────────────────────────────────────────────────

function GatedContentPage(props: Props) {
    const {
        badge = "Free Resource",
        showBadge = true,
        heading = "The Complete Guide to\nContent-Adaptive Encoding",
        subheading = "Learn how leading enterprises are cutting video delivery costs by up to 50% while maintaining pristine quality.",
        contentTitle = "What's Inside",
        contentDescription = "This comprehensive guide covers everything you need to know about modern video optimization — from the science behind content-adaptive encoding to real-world implementation strategies used by Fortune 500 companies.",
        contentImage = "",
        contentType = "eBook",

        benefitsHeading = "What You'll Learn",
        benefits = [
            { icon: "📊", text: "ROI analysis framework for video optimization" },
            { icon: "⚙️", text: "Step-by-step implementation guide" },
            { icon: "🏢", text: "Case studies from Media & Entertainment leaders" },
            { icon: "🔬", text: "Technical deep-dive into CABR technology" },
            { icon: "📈", text: "Benchmarks and performance metrics" },
            { icon: "🗺️", text: "Migration roadmap and best practices" },
        ],

        formHeading = "Download Your Free Copy",
        formSubheading = "Fill in your details and we'll send it straight to your inbox.",
        hubspotPortalId = "",
        hubspotFormId = "",
        useEmbeddedHubspot = false,
        submitButtonText = "Get the Guide →",
        firstNameLabel = "First Name",
        lastNameLabel = "Last Name",
        emailLabel = "Work Email",
        companyLabel = "Company",
        showCompanyField = true,
        jobTitleLabel = "Job Title",
        showJobTitleField = false,
        consentText = "I agree to receive communications from Beamr. You can unsubscribe at any time.",
        showConsent = true,

        thankYouHeading = "Check Your Inbox! 🎉",
        thankYouMessage = "We've sent the guide to your email address. If you don't see it within a few minutes, please check your spam folder.",
        thankYouCtaText = "Back to Homepage",
        thankYouCtaUrl = "/",

        showSocialProof = true,
        downloadCount = "2,500+",
        socialProofText = "professionals have downloaded this guide",

        bgColor = "#07071c",
        cardBgColor = "#0f1029",
        textColor = "#ffffff",
        secondaryTextColor = "#8b8ba3",
        accentColor = "#00d46a",
        borderColor = "#1c1c3a",
        fontFamily = "'Inter', sans-serif",
        contentImageBorderRadius = 16,

        style,
    } = props

    const [submitted, setSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formError, setFormError] = useState("")
    const [isMobile, setIsMobile] = useState(false)
    const hubspotContainerRef = useRef<HTMLDivElement>(null)

    // Responsive breakpoint
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 860)
        check()
        window.addEventListener("resize", check)
        return () => window.removeEventListener("resize", check)
    }, [])

    // Load HubSpot embedded form
    useEffect(() => {
        if (!useEmbeddedHubspot || !hubspotPortalId || !hubspotFormId) return
        if (submitted) return

        const script = document.createElement("script")
        script.src = "https://js.hsforms.net/forms/v2.js"
        script.async = true
        script.onload = () => {
            if ((window as any).hbspt && hubspotContainerRef.current) {
                hubspotContainerRef.current.innerHTML = ""
                ;(window as any).hbspt.forms.create({
                    portalId: hubspotPortalId,
                    formId: hubspotFormId,
                    target: hubspotContainerRef.current,
                    onFormSubmitted: () => setSubmitted(true),
                })
            }
        }
        document.head.appendChild(script)

        return () => {
            if (script.parentNode) script.parentNode.removeChild(script)
        }
    }, [useEmbeddedHubspot, hubspotPortalId, hubspotFormId, submitted])

    // Custom form submission via HubSpot Forms API
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setFormError("")
        setIsSubmitting(true)

        const form = e.currentTarget
        const data = new FormData(form)

        const fields: { name: string; value: string }[] = []
        fields.push({ name: "firstname", value: data.get("firstname") as string })
        fields.push({ name: "lastname", value: data.get("lastname") as string })
        fields.push({ name: "email", value: data.get("email") as string })
        if (showCompanyField) {
            fields.push({ name: "company", value: data.get("company") as string })
        }
        if (showJobTitleField) {
            fields.push({ name: "jobtitle", value: data.get("jobtitle") as string })
        }

        // If no HubSpot IDs configured, just show success (for Framer preview)
        if (!hubspotPortalId || !hubspotFormId) {
            setTimeout(() => {
                setIsSubmitting(false)
                setSubmitted(true)
            }, 800)
            return
        }

        try {
            const response = await fetch(
                `https://api.hsforms.com/submissions/v3/integration/submit/${hubspotPortalId}/${hubspotFormId}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        fields,
                        context: {
                            pageUri: window.location.href,
                            pageName: document.title,
                        },
                    }),
                }
            )

            if (response.ok) {
                setSubmitted(true)
            } else {
                setFormError("Something went wrong. Please try again.")
            }
        } catch {
            setFormError("Network error. Please check your connection and try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    // ─── Shared styles ───────────────────────────────────────────────────────

    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "14px 16px",
        backgroundColor: "rgba(255,255,255,0.04)",
        border: `1px solid ${borderColor}`,
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
            }}
        >
            {/* Inject focus styles */}
            <style>{`
                .gc-input:focus {
                    border-color: ${accentColor} !important;
                }
                .gc-input::placeholder {
                    color: ${secondaryTextColor};
                    opacity: 0.6;
                }
                .gc-submit:hover {
                    opacity: 0.9;
                    transform: translateY(-1px);
                }
                .gc-submit:active {
                    transform: translateY(0);
                }
                .gc-benefit:hover {
                    background: rgba(255,255,255,0.04) !important;
                }
                /* Style embedded HubSpot form */
                .gc-hs-embed .hs-form input[type="text"],
                .gc-hs-embed .hs-form input[type="email"],
                .gc-hs-embed .hs-form select,
                .gc-hs-embed .hs-form textarea {
                    width: 100% !important;
                    padding: 14px 16px !important;
                    background-color: rgba(255,255,255,0.04) !important;
                    border: 1px solid ${borderColor} !important;
                    border-radius: 10px !important;
                    color: ${textColor} !important;
                    font-size: 15px !important;
                    font-family: ${fontFamily} !important;
                    box-sizing: border-box !important;
                }
                .gc-hs-embed .hs-form input[type="text"]:focus,
                .gc-hs-embed .hs-form input[type="email"]:focus {
                    border-color: ${accentColor} !important;
                    outline: none !important;
                }
                .gc-hs-embed .hs-form .hs-button {
                    width: 100% !important;
                    padding: 16px 32px !important;
                    background-color: ${accentColor} !important;
                    color: #07071c !important;
                    border: none !important;
                    border-radius: 10px !important;
                    font-size: 16px !important;
                    font-weight: 600 !important;
                    font-family: ${fontFamily} !important;
                    cursor: pointer !important;
                }
                .gc-hs-embed .hs-form label {
                    color: ${secondaryTextColor} !important;
                    font-size: 13px !important;
                    font-weight: 500 !important;
                    font-family: ${fontFamily} !important;
                }
                .gc-hs-embed .hs-form .hs-error-msgs label {
                    color: #ff4d4d !important;
                }
            `}</style>

            {/* Hero area */}
            <div
                style={{
                    width: "100%",
                    padding: isMobile ? "80px 20px 48px" : "100px 48px 64px",
                    boxSizing: "border-box",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                {showBadge && (
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "8px 20px",
                            borderRadius: 100,
                            border: `1px solid ${accentColor}33`,
                            backgroundColor: `${accentColor}0a`,
                            marginBottom: 24,
                        }}
                    >
                        <span style={{ fontSize: 14 }}>📄</span>
                        <span
                            style={{
                                fontSize: 14,
                                fontWeight: 500,
                                color: accentColor,
                                fontFamily,
                            }}
                        >
                            {badge} — {contentType}
                        </span>
                    </div>
                )}

                <h1
                    style={{
                        fontSize: isMobile ? 32 : 52,
                        fontWeight: 700,
                        color: textColor,
                        margin: 0,
                        lineHeight: 1.12,
                        letterSpacing: "-0.025em",
                        fontFamily,
                        whiteSpace: "pre-line",
                        maxWidth: 780,
                    }}
                >
                    {heading}
                </h1>

                <p
                    style={{
                        fontSize: isMobile ? 16 : 18,
                        color: secondaryTextColor,
                        margin: "20px 0 0",
                        lineHeight: 1.65,
                        fontFamily,
                        maxWidth: 620,
                    }}
                >
                    {subheading}
                </p>

                {/* Social proof */}
                {showSocialProof && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginTop: 28,
                        }}
                    >
                        <span
                            style={{
                                fontSize: 14,
                                color: accentColor,
                                fontWeight: 700,
                                fontFamily,
                            }}
                        >
                            {downloadCount}
                        </span>
                        <span
                            style={{
                                fontSize: 14,
                                color: secondaryTextColor,
                                fontFamily,
                            }}
                        >
                            {socialProofText}
                        </span>
                    </div>
                )}
            </div>

            {/* Main content: two-column layout */}
            <div
                style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    padding: isMobile ? "0 20px 80px" : "0 48px 100px",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: isMobile ? 40 : 48,
                    alignItems: "flex-start",
                }}
            >
                {/* Left column: content preview + benefits */}
                <div
                    style={{
                        flex: 1,
                        minWidth: 0,
                    }}
                >
                    {/* Content preview image */}
                    {contentImage && (
                        <div
                            style={{
                                width: "100%",
                                borderRadius: contentImageBorderRadius,
                                overflow: "hidden",
                                border: `1px solid ${borderColor}`,
                                marginBottom: 40,
                            }}
                        >
                            <img
                                src={contentImage}
                                alt={contentTitle}
                                style={{
                                    width: "100%",
                                    height: "auto",
                                    display: "block",
                                }}
                            />
                        </div>
                    )}

                    {/* Content description */}
                    <div style={{ marginBottom: 40 }}>
                        <h2
                            style={{
                                fontSize: isMobile ? 22 : 26,
                                fontWeight: 700,
                                color: textColor,
                                margin: "0 0 16px",
                                fontFamily,
                                letterSpacing: "-0.02em",
                            }}
                        >
                            {contentTitle}
                        </h2>
                        <p
                            style={{
                                fontSize: 16,
                                color: secondaryTextColor,
                                margin: 0,
                                lineHeight: 1.7,
                                fontFamily,
                            }}
                        >
                            {contentDescription}
                        </p>
                    </div>

                    {/* Benefits list */}
                    <div>
                        <h3
                            style={{
                                fontSize: isMobile ? 18 : 20,
                                fontWeight: 600,
                                color: textColor,
                                margin: "0 0 20px",
                                fontFamily,
                            }}
                        >
                            {benefitsHeading}
                        </h3>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 12,
                            }}
                        >
                            {benefits.map((benefit, i) => (
                                <div
                                    key={i}
                                    className="gc-benefit"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 14,
                                        padding: "14px 18px",
                                        borderRadius: 12,
                                        backgroundColor: `${cardBgColor}88`,
                                        border: `1px solid ${borderColor}`,
                                        transition: "background 0.2s",
                                    }}
                                >
                                    <span style={{ fontSize: 20, flexShrink: 0 }}>
                                        {benefit.icon}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: 15,
                                            color: textColor,
                                            fontFamily,
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        {benefit.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right column: form card */}
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
                            border: `1px solid ${borderColor}`,
                            padding: isMobile ? "32px 24px" : "40px 36px",
                            boxSizing: "border-box",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        {/* Glow accent */}
                        <div
                            style={{
                                position: "absolute",
                                top: -80,
                                right: -80,
                                width: 200,
                                height: 200,
                                borderRadius: "50%",
                                background: `radial-gradient(circle, ${accentColor}15 0%, transparent 70%)`,
                                pointerEvents: "none",
                            }}
                        />

                        {submitted ? (
                            /* ─── Thank You State ─── */
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
                                        marginBottom: 4,
                                    }}
                                >
                                    ✓
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
                                </a>
                            </div>
                        ) : useEmbeddedHubspot && hubspotPortalId && hubspotFormId ? (
                            /* ─── Embedded HubSpot Form ─── */
                            <div style={{ position: "relative", zIndex: 1 }}>
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
                                        margin: "0 0 24px",
                                        lineHeight: 1.5,
                                        fontFamily,
                                    }}
                                >
                                    {formSubheading}
                                </p>
                                <div
                                    ref={hubspotContainerRef}
                                    className="gc-hs-embed"
                                />
                            </div>
                        ) : (
                            /* ─── Custom Form (posts to HubSpot API) ─── */
                            <form
                                onSubmit={handleSubmit}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 0,
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
                                <div
                                    style={{
                                        display: "flex",
                                        gap: 12,
                                        marginBottom: 16,
                                    }}
                                >
                                    <div style={{ flex: 1 }}>
                                        <label style={labelStyle}>
                                            {firstNameLabel} *
                                        </label>
                                        <input
                                            className="gc-input"
                                            type="text"
                                            name="firstname"
                                            required
                                            placeholder="John"
                                            style={inputStyle}
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={labelStyle}>
                                            {lastNameLabel} *
                                        </label>
                                        <input
                                            className="gc-input"
                                            type="text"
                                            name="lastname"
                                            required
                                            placeholder="Doe"
                                            style={inputStyle}
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div style={{ marginBottom: 16 }}>
                                    <label style={labelStyle}>
                                        {emailLabel} *
                                    </label>
                                    <input
                                        className="gc-input"
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="john@company.com"
                                        style={inputStyle}
                                    />
                                </div>

                                {/* Company */}
                                {showCompanyField && (
                                    <div style={{ marginBottom: 16 }}>
                                        <label style={labelStyle}>
                                            {companyLabel}
                                        </label>
                                        <input
                                            className="gc-input"
                                            type="text"
                                            name="company"
                                            placeholder="Acme Inc."
                                            style={inputStyle}
                                        />
                                    </div>
                                )}

                                {/* Job Title */}
                                {showJobTitleField && (
                                    <div style={{ marginBottom: 16 }}>
                                        <label style={labelStyle}>
                                            {jobTitleLabel}
                                        </label>
                                        <input
                                            className="gc-input"
                                            type="text"
                                            name="jobtitle"
                                            placeholder="VP of Engineering"
                                            style={inputStyle}
                                        />
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
                                        <input
                                            type="checkbox"
                                            required
                                            style={{
                                                marginTop: 3,
                                                accentColor,
                                                flexShrink: 0,
                                            }}
                                        />
                                        <span
                                            style={{
                                                fontSize: 13,
                                                color: secondaryTextColor,
                                                lineHeight: 1.5,
                                                fontFamily,
                                            }}
                                        >
                                            {consentText}
                                        </span>
                                    </label>
                                )}

                                {/* Error message */}
                                {formError && (
                                    <p
                                        style={{
                                            fontSize: 13,
                                            color: "#ff4d4d",
                                            margin: "0 0 12px",
                                            fontFamily,
                                        }}
                                    >
                                        {formError}
                                    </p>
                                )}

                                {/* Submit */}
                                <button
                                    type="submit"
                                    className="gc-submit"
                                    disabled={isSubmitting}
                                    style={{
                                        width: "100%",
                                        padding: "16px 32px",
                                        backgroundColor: isSubmitting
                                            ? `${accentColor}88`
                                            : accentColor,
                                        color: "#07071c",
                                        border: "none",
                                        borderRadius: 10,
                                        fontSize: 16,
                                        fontWeight: 600,
                                        fontFamily,
                                        cursor: isSubmitting
                                            ? "not-allowed"
                                            : "pointer",
                                        transition: "all 0.2s",
                                    }}
                                >
                                    {isSubmitting
                                        ? "Sending..."
                                        : submitButtonText}
                                </button>

                                {/* Privacy note */}
                                <p
                                    style={{
                                        fontSize: 12,
                                        color: secondaryTextColor,
                                        margin: "16px 0 0",
                                        textAlign: "center",
                                        lineHeight: 1.5,
                                        fontFamily,
                                        opacity: 0.7,
                                    }}
                                >
                                    🔒 Your data is safe. We never share your
                                    information with third parties.
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

// ─── Framer Property Controls ────────────────────────────────────────────────

addPropertyControls(GatedContentPage, {
    // Content
    showBadge: {
        type: ControlType.Boolean,
        title: "Show Badge",
        defaultValue: true,
    },
    badge: {
        type: ControlType.String,
        title: "Badge Text",
        defaultValue: "Free Resource",
        hidden: (props) => !props.showBadge,
    },
    contentType: {
        type: ControlType.Enum,
        title: "Content Type",
        options: ["eBook", "Whitepaper", "Guide", "Report", "Webinar", "Case Study", "Checklist", "Template"],
        defaultValue: "eBook",
    },
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "The Complete Guide to\nContent-Adaptive Encoding",
        displayTextArea: true,
    },
    subheading: {
        type: ControlType.String,
        title: "Subheading",
        defaultValue: "Learn how leading enterprises are cutting video delivery costs by up to 50% while maintaining pristine quality.",
        displayTextArea: true,
    },
    contentImage: {
        type: ControlType.Image,
        title: "Content Image",
    },
    contentTitle: {
        type: ControlType.String,
        title: "Content Title",
        defaultValue: "What's Inside",
    },
    contentDescription: {
        type: ControlType.String,
        title: "Content Desc",
        defaultValue: "This comprehensive guide covers everything you need to know about modern video optimization — from the science behind content-adaptive encoding to real-world implementation strategies used by Fortune 500 companies.",
        displayTextArea: true,
    },

    // Benefits
    benefitsHeading: {
        type: ControlType.String,
        title: "Benefits Title",
        defaultValue: "What You'll Learn",
    },
    benefits: {
        type: ControlType.Array,
        title: "Benefits",
        maxCount: 10,
        control: {
            type: ControlType.Object,
            controls: {
                icon: {
                    type: ControlType.String,
                    title: "Icon",
                    defaultValue: "✓",
                },
                text: {
                    type: ControlType.String,
                    title: "Text",
                    defaultValue: "Benefit description",
                },
            },
        },
        defaultValue: [
            { icon: "📊", text: "ROI analysis framework for video optimization" },
            { icon: "⚙️", text: "Step-by-step implementation guide" },
            { icon: "🏢", text: "Case studies from Media & Entertainment leaders" },
            { icon: "🔬", text: "Technical deep-dive into CABR technology" },
            { icon: "📈", text: "Benchmarks and performance metrics" },
            { icon: "🗺️", text: "Migration roadmap and best practices" },
        ],
    },

    // Social Proof
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
        defaultValue: "professionals have downloaded this guide",
        hidden: (props) => !props.showSocialProof,
    },

    // Form section
    formHeading: {
        type: ControlType.String,
        title: "Form Heading",
        defaultValue: "Download Your Free Copy",
    },
    formSubheading: {
        type: ControlType.String,
        title: "Form Subhead",
        defaultValue: "Fill in your details and we'll send it straight to your inbox.",
        displayTextArea: true,
    },

    // HubSpot
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

    // Custom form labels
    submitButtonText: {
        type: ControlType.String,
        title: "Submit Text",
        defaultValue: "Get the Guide →",
        hidden: (props) => props.useEmbeddedHubspot,
    },
    firstNameLabel: {
        type: ControlType.String,
        title: "First Name",
        defaultValue: "First Name",
        hidden: (props) => props.useEmbeddedHubspot,
    },
    lastNameLabel: {
        type: ControlType.String,
        title: "Last Name",
        defaultValue: "Last Name",
        hidden: (props) => props.useEmbeddedHubspot,
    },
    emailLabel: {
        type: ControlType.String,
        title: "Email Label",
        defaultValue: "Work Email",
        hidden: (props) => props.useEmbeddedHubspot,
    },
    showCompanyField: {
        type: ControlType.Boolean,
        title: "Company Field",
        defaultValue: true,
        hidden: (props) => props.useEmbeddedHubspot,
    },
    companyLabel: {
        type: ControlType.String,
        title: "Company Label",
        defaultValue: "Company",
        hidden: (props) => props.useEmbeddedHubspot || !props.showCompanyField,
    },
    showJobTitleField: {
        type: ControlType.Boolean,
        title: "Job Title Field",
        defaultValue: false,
        hidden: (props) => props.useEmbeddedHubspot,
    },
    jobTitleLabel: {
        type: ControlType.String,
        title: "Job Title Label",
        defaultValue: "Job Title",
        hidden: (props) => props.useEmbeddedHubspot || !props.showJobTitleField,
    },
    showConsent: {
        type: ControlType.Boolean,
        title: "Consent Box",
        defaultValue: true,
        hidden: (props) => props.useEmbeddedHubspot,
    },
    consentText: {
        type: ControlType.String,
        title: "Consent Text",
        defaultValue: "I agree to receive communications from Beamr. You can unsubscribe at any time.",
        displayTextArea: true,
        hidden: (props) => props.useEmbeddedHubspot || !props.showConsent,
    },

    // Thank you
    thankYouHeading: {
        type: ControlType.String,
        title: "TY Heading",
        defaultValue: "Check Your Inbox! 🎉",
    },
    thankYouMessage: {
        type: ControlType.String,
        title: "TY Message",
        defaultValue: "We've sent the guide to your email address. If you don't see it within a few minutes, please check your spam folder.",
        displayTextArea: true,
    },
    thankYouCtaText: {
        type: ControlType.String,
        title: "TY CTA Text",
        defaultValue: "Back to Homepage",
    },
    thankYouCtaUrl: {
        type: ControlType.String,
        title: "TY CTA URL",
        defaultValue: "/",
    },

    // Appearance
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#07071c",
    },
    cardBgColor: {
        type: ControlType.Color,
        title: "Card BG",
        defaultValue: "#0f1029",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text",
        defaultValue: "#ffffff",
    },
    secondaryTextColor: {
        type: ControlType.Color,
        title: "Secondary Text",
        defaultValue: "#8b8ba3",
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent",
        defaultValue: "#00d46a",
    },
    borderColor: {
        type: ControlType.Color,
        title: "Border",
        defaultValue: "#1c1c3a",
    },
    fontFamily: {
        type: ControlType.String,
        title: "Font Family",
        defaultValue: "'Inter', sans-serif",
    },
    contentImageBorderRadius: {
        type: ControlType.Number,
        title: "Image Radius",
        defaultValue: 16,
        min: 0,
        max: 40,
    },
})

export default GatedContentPage
