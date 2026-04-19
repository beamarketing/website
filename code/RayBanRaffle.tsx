// Beamr Ray-Ban Meta Raffle - Lead Collection Landing Page
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"
import { useState, useRef, useEffect, useCallback } from "react"

interface Props {
    logoImage: string
    useLogoImage: boolean
    logoText: string
    badgeText: string
    heading: string
    subheading: string
    glassesImage: string
    formHeading: string
    formSubheading: string
    firstNameLabel: string
    firstNamePlaceholder: string
    lastNameLabel: string
    lastNamePlaceholder: string
    emailLabel: string
    emailPlaceholder: string
    companyLabel: string
    companyPlaceholder: string
    buttonText: string
    successMessage: string
    disclaimerText: string
    hubspotPortalId: string
    hubspotFormId: string
    bgColor: string
    accentYellow: string
    accentOrange: string
    accentPink: string
    accentBlue: string
    accentNavy: string
    accentTeal: string
    textDark: string
    textMuted: string
    fontFamily: string
    style?: React.CSSProperties
}

function RayBanRaffle(props: Props) {
    const {
        logoImage = "",
        useLogoImage = false,
        logoText = "BEAMR",
        badgeText = "Raffle",
        heading = "SEE WHAT\nOTHERS MISS",
        subheading = "Win Ray-Ban Meta smart glasses",
        glassesImage = "",
        formHeading = "Enter the Raffle",
        formSubheading = "Fill out the form below for a chance to win Ray-Ban Meta smart glasses.",
        firstNameLabel = "First Name",
        firstNamePlaceholder = "John",
        lastNameLabel = "Last Name",
        lastNamePlaceholder = "Doe",
        emailLabel = "Work Email",
        emailPlaceholder = "john@company.com",
        companyLabel = "Company",
        companyPlaceholder = "Your company",
        buttonText = "Enter to Win",
        successMessage = "You're in! The winner will be announced via email and on Beamr's social media channels. Good luck!",
        disclaimerText = "By entering this raffle, you agree to allow Beamr to send you updates, news, and promotional content. One entry per person. Winner will be announced via email and Beamr's social media channels.",
        hubspotPortalId = "144465530",
        hubspotFormId = "8ea446cd-2916-4510-a3ad-3e9fb41c78e8",
        bgColor = "#ffffff",
        accentYellow = "#FFC629",
        accentOrange = "#F27A1A",
        accentPink = "#F4A7C1",
        accentBlue = "#5BC0EB",
        accentNavy = "#1B2A4A",
        accentTeal = "#2EC4B6",
        textDark = "#111111",
        textMuted = "#6B7280",
        fontFamily = "'Inter', sans-serif",
        style,
    } = props

    const containerRef = useRef<HTMLDivElement>(null)
    const [isMobile, setIsMobile] = useState(false)
    const [isTablet, setIsTablet] = useState(false)

    useEffect(() => {
        const el = containerRef.current
        if (!el) return
        const ro = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const w = entry.contentRect.width
                setIsMobile(w < 520)
                setIsTablet(w >= 520 && w < 900)
            }
        })
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
    })
    const [submitState, setSubmitState] = useState<
        "idle" | "loading" | "success" | "error"
    >("idle")
    const [focusedField, setFocusedField] = useState<string | null>(null)

    const updateField = useCallback(
        (field: string, value: string) => {
            setFormData((prev) => ({ ...prev, [field]: value }))
            if (submitState === "error") setSubmitState("idle")
        },
        [submitState]
    )

    const handleSubmit = async () => {
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.company) return

        if (hubspotPortalId && hubspotFormId) {
            setSubmitState("loading")
            try {
                const fields: { name: string; value: string }[] = [
                    { name: "firstname", value: formData.firstName },
                    { name: "lastname", value: formData.lastName },
                    { name: "email", value: formData.email },
                    { name: "company", value: formData.company },
                ]

                const res = await fetch(
                    `https://api.hsforms.com/submissions/v3/integration/submit/${hubspotPortalId}/${hubspotFormId}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            fields,
                            context: {
                                pageUri:
                                    typeof window !== "undefined"
                                        ? window.location.href
                                        : "",
                                pageName: "Ray-Ban Meta Raffle",
                            },
                        }),
                    }
                )
                if (res.ok) {
                    setSubmitState("success")
                    setFormData({ firstName: "", lastName: "", email: "", company: "" })
                } else {
                    setSubmitState("error")
                }
            } catch {
                setSubmitState("error")
            }
        } else {
            setSubmitState("success")
            setFormData({ firstName: "", lastName: "", email: "", company: "" })
        }
    }

    const compact = isMobile || isTablet

    const inputStyle = (field: string): React.CSSProperties => ({
        width: "100%",
        padding: compact ? "12px 14px" : "14px 16px",
        borderRadius: 10,
        border: `2px solid ${
            focusedField === field ? accentBlue : "#E5E7EB"
        }`,
        backgroundColor: "#F9FAFB",
        color: textDark,
        fontSize: compact ? 15 : 16,
        fontFamily,
        outline: "none",
        boxSizing: "border-box" as const,
        transition: "border-color 0.2s",
    })

    const labelStyle: React.CSSProperties = {
        fontSize: 13,
        fontWeight: 600,
        color: textDark,
        fontFamily,
        marginBottom: 6,
        display: "block",
    }

    if (submitState === "success") {
        return (
            <div
                ref={containerRef}
                style={{
                    ...style,
                    width: "100%",
                    minHeight: "100vh",
                    backgroundColor: bgColor,
                    fontFamily,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                    boxSizing: "border-box",
                    padding: compact ? "40px 20px" : "60px 48px",
                }}
            >
                {/* Decorative blocks */}
                <DecoBlocks
                    orange={accentOrange}
                    pink={accentPink}
                    blue={accentBlue}
                    navy={accentNavy}
                    teal={accentTeal}
                    yellow={accentYellow}
                    compact={compact}
                />

                <div
                    style={{
                        position: "relative",
                        zIndex: 2,
                        textAlign: "center",
                        maxWidth: 520,
                    }}
                >
                    <div
                        style={{
                            width: 72,
                            height: 72,
                            borderRadius: "50%",
                            backgroundColor: "#22c55e",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 24px",
                        }}
                    >
                        <span
                            style={{ fontSize: 36, color: "#fff", lineHeight: 1 }}
                        >
                            &#10003;
                        </span>
                    </div>
                    <h2
                        style={{
                            fontSize: compact ? 28 : 36,
                            fontWeight: 800,
                            color: textDark,
                            margin: "0 0 16px",
                            fontFamily,
                            lineHeight: 1.2,
                        }}
                    >
                        You're In!
                    </h2>
                    <p
                        style={{
                            fontSize: compact ? 16 : 18,
                            color: textMuted,
                            margin: 0,
                            lineHeight: 1.6,
                            fontFamily,
                        }}
                    >
                        {successMessage}
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div
            ref={containerRef}
            style={{
                ...style,
                width: "100%",
                minHeight: "100vh",
                backgroundColor: bgColor,
                fontFamily,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
                boxSizing: "border-box",
            }}
        >
            {/* Decorative blocks */}
            <DecoBlocks
                orange={accentOrange}
                pink={accentPink}
                blue={accentBlue}
                navy={accentNavy}
                teal={accentTeal}
                yellow={accentYellow}
                compact={compact}
            />

            {/* Main content */}
            <div
                style={{
                    position: "relative",
                    zIndex: 2,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: compact ? "40px 20px" : "48px 48px 60px",
                    boxSizing: "border-box",
                }}
            >
                {/* Logo */}
                <div style={{ marginBottom: compact ? 24 : 32 }}>
                    {useLogoImage && logoImage ? (
                        <img
                            src={logoImage}
                            alt={logoText}
                            style={{
                                height: 32,
                                objectFit: "contain",
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                            }}
                        >
                            <div
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 10,
                                    backgroundColor: accentBlue,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <div
                                    style={{
                                        width: 18,
                                        height: 18,
                                        borderRadius: "50%",
                                        border: "2.5px solid #fff",
                                    }}
                                />
                            </div>
                            <span
                                style={{
                                    fontSize: 22,
                                    fontWeight: 800,
                                    color: textDark,
                                    letterSpacing: "0.04em",
                                    fontFamily,
                                }}
                            >
                                {logoText}
                            </span>
                        </div>
                    )}
                </div>

                {/* Badge */}
                <div
                    style={{
                        display: "inline-block",
                        padding: "6px 20px",
                        borderRadius: 4,
                        backgroundColor: accentYellow,
                        fontSize: 15,
                        fontWeight: 700,
                        color: textDark,
                        fontFamily,
                        marginBottom: compact ? 16 : 20,
                    }}
                >
                    {badgeText}
                </div>

                {/* Heading */}
                <h1
                    style={{
                        fontSize: compact ? 40 : isTablet ? 52 : 68,
                        fontWeight: 900,
                        color: textDark,
                        lineHeight: 0.95,
                        margin: "0 0 12px",
                        fontFamily,
                        textAlign: "center",
                        whiteSpace: "pre-line",
                        letterSpacing: "-0.02em",
                    }}
                >
                    {heading}
                </h1>

                {/* Subheading */}
                <p
                    style={{
                        fontSize: compact ? 18 : 22,
                        fontWeight: 400,
                        color: textDark,
                        margin: "0 0 24px",
                        fontFamily,
                        textAlign: "center",
                        lineHeight: 1.3,
                    }}
                >
                    {subheading}
                </p>

                {/* Glasses Image */}
                {glassesImage ? (
                    <img
                        src={glassesImage}
                        alt="Ray-Ban Meta Smart Glasses"
                        style={{
                            maxWidth: compact ? 280 : 420,
                            width: "100%",
                            height: "auto",
                            objectFit: "contain",
                            marginBottom: compact ? 24 : 36,
                        }}
                    />
                ) : (
                    <div
                        style={{
                            width: compact ? 280 : 420,
                            maxWidth: "100%",
                            height: compact ? 100 : 150,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: compact ? 24 : 36,
                        }}
                    >
                        <svg
                            viewBox="0 0 420 140"
                            fill="none"
                            style={{ width: "100%", height: "100%" }}
                        >
                            <ellipse
                                cx="130"
                                cy="70"
                                rx="75"
                                ry="50"
                                stroke={textDark}
                                strokeWidth="6"
                                fill="none"
                            />
                            <ellipse
                                cx="290"
                                cy="70"
                                rx="75"
                                ry="50"
                                stroke={textDark}
                                strokeWidth="6"
                                fill="none"
                            />
                            <path
                                d="M205 62 Q210 52 215 62"
                                stroke={textDark}
                                strokeWidth="5"
                                fill="none"
                            />
                            <line
                                x1="55"
                                y1="45"
                                x2="10"
                                y2="35"
                                stroke={textDark}
                                strokeWidth="5"
                                strokeLinecap="round"
                            />
                            <line
                                x1="365"
                                y1="45"
                                x2="410"
                                y2="35"
                                stroke={textDark}
                                strokeWidth="5"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>
                )}

                {/* Form Card */}
                <div
                    style={{
                        width: "100%",
                        maxWidth: 480,
                        backgroundColor: "#ffffff",
                        borderRadius: 16,
                        padding: compact ? "28px 20px" : "36px 32px",
                        boxShadow:
                            "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
                        boxSizing: "border-box",
                    }}
                >
                    <h2
                        style={{
                            fontSize: compact ? 22 : 26,
                            fontWeight: 800,
                            color: textDark,
                            margin: "0 0 6px",
                            fontFamily,
                            textAlign: "center",
                        }}
                    >
                        {formHeading}
                    </h2>
                    <p
                        style={{
                            fontSize: 14,
                            color: textMuted,
                            margin: "0 0 24px",
                            fontFamily,
                            textAlign: "center",
                            lineHeight: 1.5,
                        }}
                    >
                        {formSubheading}
                    </p>

                    {/* Form Fields */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 16,
                        }}
                    >
                        {/* First & Last Name Row */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: compact ? "1fr" : "1fr 1fr",
                                gap: compact ? 16 : 12,
                            }}
                        >
                            <div>
                                <label style={labelStyle}>{firstNameLabel}</label>
                                <input
                                    type="text"
                                    placeholder={firstNamePlaceholder}
                                    value={formData.firstName}
                                    onChange={(e) =>
                                        updateField("firstName", e.target.value)
                                    }
                                    onFocus={() => setFocusedField("firstName")}
                                    onBlur={() => setFocusedField(null)}
                                    style={inputStyle("firstName")}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>{lastNameLabel}</label>
                                <input
                                    type="text"
                                    placeholder={lastNamePlaceholder}
                                    value={formData.lastName}
                                    onChange={(e) =>
                                        updateField("lastName", e.target.value)
                                    }
                                    onFocus={() => setFocusedField("lastName")}
                                    onBlur={() => setFocusedField(null)}
                                    style={inputStyle("lastName")}
                                />
                            </div>
                        </div>

                        {/* Work Email */}
                        <div>
                            <label style={labelStyle}>{emailLabel}</label>
                            <input
                                type="email"
                                placeholder={emailPlaceholder}
                                value={formData.email}
                                onChange={(e) =>
                                    updateField("email", e.target.value)
                                }
                                onFocus={() => setFocusedField("email")}
                                onBlur={() => setFocusedField(null)}
                                style={inputStyle("email")}
                            />
                        </div>

                        {/* Company */}
                        <div>
                            <label style={labelStyle}>
                                {companyLabel}
                            </label>
                            <input
                                type="text"
                                placeholder={companyPlaceholder}
                                value={formData.company}
                                onChange={(e) =>
                                    updateField("company", e.target.value)
                                }
                                onFocus={() => setFocusedField("company")}
                                onBlur={() => setFocusedField(null)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSubmit()
                                }}
                                style={inputStyle("company")}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={
                                submitState === "loading" ||
                                !formData.firstName ||
                                !formData.lastName ||
                                !formData.email ||
                                !formData.company
                            }
                            style={{
                                width: "100%",
                                padding: compact ? "14px" : "16px",
                                borderRadius: 10,
                                border: "none",
                                backgroundColor:
                                    submitState === "error"
                                        ? "#ef4444"
                                        : textDark,
                                color: "#ffffff",
                                fontSize: compact ? 16 : 17,
                                fontWeight: 700,
                                fontFamily,
                                cursor:
                                    submitState === "loading" ||
                                    !formData.firstName ||
                                    !formData.lastName ||
                                    !formData.email ||
                                    !formData.company
                                        ? "not-allowed"
                                        : "pointer",
                                opacity:
                                    !formData.firstName || !formData.lastName || !formData.email || !formData.company
                                        ? 0.5
                                        : submitState === "loading"
                                          ? 0.7
                                          : 1,
                                transition:
                                    "background-color 0.2s, opacity 0.2s",
                                marginTop: 4,
                            }}
                        >
                            {submitState === "loading"
                                ? "Submitting..."
                                : submitState === "error"
                                  ? "Something went wrong. Try again."
                                  : buttonText}
                        </button>
                    </div>

                    {/* Disclaimer */}
                    <p
                        style={{
                            fontSize: 11,
                            color: textMuted,
                            margin: "16px 0 0",
                            fontFamily,
                            textAlign: "center",
                            lineHeight: 1.5,
                            opacity: 0.7,
                        }}
                    >
                        {disclaimerText}
                    </p>
                </div>
            </div>
        </div>
    )
}

function DecoBlocks({
    orange,
    pink,
    blue,
    navy,
    teal,
    yellow,
    compact,
}: {
    orange: string
    pink: string
    blue: string
    navy: string
    teal: string
    yellow: string
    compact: boolean
}) {
    const size = compact ? 60 : 90

    return (
        <>
            {/* Top-right cluster */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    zIndex: 1,
                }}
            >
                <div
                    style={{
                        width: size * 1.8,
                        height: size * 1.4,
                        backgroundColor: navy,
                        position: "absolute",
                        top: 0,
                        right: 0,
                    }}
                />
                <div
                    style={{
                        width: size,
                        height: size * 0.7,
                        backgroundColor: pink,
                        position: "absolute",
                        top: 0,
                        right: size * 1.8,
                    }}
                />
                <div
                    style={{
                        width: size * 0.8,
                        height: size * 0.5,
                        backgroundColor: "rgba(200,200,220,0.3)",
                        position: "absolute",
                        top: size * 0.7,
                        right: size * 1.8,
                    }}
                />
            </div>

            {/* Bottom-left cluster */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    zIndex: 1,
                }}
            >
                <div
                    style={{
                        width: size * 1.2,
                        height: size * 1.8,
                        backgroundColor: orange,
                        position: "absolute",
                        bottom: size * 0.6,
                        left: 0,
                    }}
                />
                <div
                    style={{
                        width: size,
                        height: size,
                        backgroundColor: pink,
                        position: "absolute",
                        bottom: size * 0.6 + size * 1.8,
                        left: 0,
                    }}
                />
                <div
                    style={{
                        width: size * 1.2,
                        height: size * 0.8,
                        backgroundColor: blue,
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                    }}
                />
                <div
                    style={{
                        width: size,
                        height: size * 0.8,
                        backgroundColor: blue,
                        position: "absolute",
                        bottom: 0,
                        left: size * 1.2,
                    }}
                />
                <div
                    style={{
                        width: size,
                        height: size * 0.6,
                        backgroundColor: pink,
                        position: "absolute",
                        bottom: size * 0.8,
                        left: size * 1.2,
                    }}
                />
                <div
                    style={{
                        width: size * 0.8,
                        height: size * 0.8,
                        backgroundColor: yellow,
                        position: "absolute",
                        bottom: 0,
                        left: size * 1.2 + size,
                    }}
                />
            </div>

            {/* Bottom-right accent */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    zIndex: 1,
                }}
            >
                <div
                    style={{
                        width: size * 1.5,
                        height: size,
                        backgroundColor: navy,
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                    }}
                />
            </div>
        </>
    )
}

addPropertyControls(RayBanRaffle, {
    useLogoImage: {
        type: ControlType.Boolean,
        title: "Use Logo Image",
        defaultValue: false,
    },
    logoImage: {
        type: ControlType.Image,
        title: "Logo Image",
        hidden: (props) => !props.useLogoImage,
    },
    logoText: {
        type: ControlType.String,
        title: "Logo Text",
        defaultValue: "BEAMR",
        hidden: (props) => props.useLogoImage,
    },
    badgeText: {
        type: ControlType.String,
        title: "Badge Text",
        defaultValue: "Raffle",
    },
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "SEE WHAT\nOTHERS MISS",
        displayTextArea: true,
    },
    subheading: {
        type: ControlType.String,
        title: "Subheading",
        defaultValue: "Win Ray-Ban Meta smart glasses",
    },
    glassesImage: {
        type: ControlType.Image,
        title: "Glasses Image",
    },
    formHeading: {
        type: ControlType.String,
        title: "Form Heading",
        defaultValue: "Enter the Raffle",
    },
    formSubheading: {
        type: ControlType.String,
        title: "Form Subheading",
        defaultValue:
            "Fill out the form below for a chance to win Ray-Ban Meta smart glasses.",
        displayTextArea: true,
    },
    firstNameLabel: {
        type: ControlType.String,
        title: "First Name Label",
        defaultValue: "First Name",
    },
    firstNamePlaceholder: {
        type: ControlType.String,
        title: "First Name Placeholder",
        defaultValue: "John",
    },
    lastNameLabel: {
        type: ControlType.String,
        title: "Last Name Label",
        defaultValue: "Last Name",
    },
    lastNamePlaceholder: {
        type: ControlType.String,
        title: "Last Name Placeholder",
        defaultValue: "Doe",
    },
    emailLabel: {
        type: ControlType.String,
        title: "Email Label",
        defaultValue: "Work Email",
    },
    emailPlaceholder: {
        type: ControlType.String,
        title: "Email Placeholder",
        defaultValue: "john@company.com",
    },
    companyLabel: {
        type: ControlType.String,
        title: "Company Label",
        defaultValue: "Company",
    },
    companyPlaceholder: {
        type: ControlType.String,
        title: "Company Placeholder",
        defaultValue: "Your company",
    },
    buttonText: {
        type: ControlType.String,
        title: "Button Text",
        defaultValue: "Enter to Win",
    },
    successMessage: {
        type: ControlType.String,
        title: "Success Message",
        defaultValue:
            "You're in! The winner will be announced via email and on Beamr's social media channels. Good luck!",
        displayTextArea: true,
    },
    disclaimerText: {
        type: ControlType.String,
        title: "Disclaimer",
        defaultValue:
            "By entering this raffle, you agree to allow Beamr to send you updates, news, and promotional content. One entry per person. Winner will be announced via email and Beamr's social media channels.",
        displayTextArea: true,
    },
    hubspotPortalId: {
        type: ControlType.String,
        title: "HubSpot Portal ID",
        defaultValue: "144465530",
        description: "Your HubSpot portal ID",
    },
    hubspotFormId: {
        type: ControlType.String,
        title: "HubSpot Form ID",
        defaultValue: "8ea446cd-2916-4510-a3ad-3e9fb41c78e8",
        description: "The HubSpot form GUID for raffle entries",
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#ffffff",
    },
    accentYellow: {
        type: ControlType.Color,
        title: "Badge Yellow",
        defaultValue: "#FFC629",
    },
    accentOrange: {
        type: ControlType.Color,
        title: "Block Orange",
        defaultValue: "#F27A1A",
    },
    accentPink: {
        type: ControlType.Color,
        title: "Block Pink",
        defaultValue: "#F4A7C1",
    },
    accentBlue: {
        type: ControlType.Color,
        title: "Block Blue",
        defaultValue: "#5BC0EB",
    },
    accentNavy: {
        type: ControlType.Color,
        title: "Block Navy",
        defaultValue: "#1B2A4A",
    },
    accentTeal: {
        type: ControlType.Color,
        title: "Block Teal",
        defaultValue: "#2EC4B6",
    },
    textDark: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#111111",
    },
    textMuted: {
        type: ControlType.Color,
        title: "Muted Text",
        defaultValue: "#6B7280",
    },
    fontFamily: {
        type: ControlType.String,
        title: "Font Family",
        defaultValue: "'Inter', sans-serif",
    },
})

export default RayBanRaffle
