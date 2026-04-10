// Contact Form Component — HubSpot integration
// Framer Code Component with full property controls

import React, { useRef, useState, useEffect } from "react"
import { addPropertyControls, ControlType } from "framer"

interface Props {
    // HubSpot
    hubspotPortalId: string
    hubspotFormId: string
    // Copy
    heading: string
    subtitle: string
    submitText: string
    successMessage: string
    // Labels
    firstNameLabel: string
    lastNameLabel: string
    emailLabel: string
    companyLabel: string
    firstNamePlaceholder: string
    lastNamePlaceholder: string
    emailPlaceholder: string
    companyPlaceholder: string
    // Style
    accentColor: string
    bgColor: string
    textColor: string
    secondaryTextColor: string
    inputBgColor: string
    inputBorderColor: string
    fontFamily: string
    headingFontFamily: string
    headingFontWeight: number
    borderRadius: number
    paddingTop: number
    style?: React.CSSProperties
}

function ContactForm(props: Props) {
    const {
        hubspotPortalId = "",
        hubspotFormId = "",
        heading = "Get in touch",
        subtitle = "Fill in the form below and we\u2019ll get back to you shortly.",
        submitText = "Submit",
        successMessage = "Thanks! We\u2019ll be in touch soon.",
        firstNameLabel = "First name",
        lastNameLabel = "Last name",
        emailLabel = "Work email",
        companyLabel = "Company",
        firstNamePlaceholder = "Jane",
        lastNamePlaceholder = "Doe",
        emailPlaceholder = "jane@company.com",
        companyPlaceholder = "Acme Inc.",
        accentColor = "#4f3ef5",
        bgColor = "#ffffff",
        textColor = "#1a1a2e",
        secondaryTextColor = "#666",
        inputBgColor = "#f8f8fa",
        inputBorderColor = "#e0e0e6",
        fontFamily = "'Inter', sans-serif",
        headingFontFamily = "'Poppins', sans-serif",
        headingFontWeight = 700,
        borderRadius = 10,
        paddingTop = 80,
        style,
    } = props

    const containerRef = useRef<HTMLDivElement>(null)
    const [isMobile, setIsMobile] = useState(false)
    const [isTablet, setIsTablet] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [isFocused, setIsFocused] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState("")

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
    })

    useEffect(() => {
        const el = containerRef.current
        if (!el) return
        const ro = new ResizeObserver((entries) => {
            const w = entries[0]?.contentRect.width ?? 0
            setIsMobile(w < 480)
            setIsTablet(w >= 480 && w < 900)
        })
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    function handleChange(field: string, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }))
        setError("")
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError("")

        if (!form.firstName || !form.email) {
            setError("Please fill in at least your first name and email.")
            return
        }

        if (!hubspotPortalId || !hubspotFormId) {
            setError("HubSpot Portal ID and Form ID are required.")
            return
        }

        setIsSubmitting(true)

        try {
            const res = await fetch(
                `https://api.hsforms.com/submissions/v3/integration/submit/${hubspotPortalId}/${hubspotFormId}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        fields: [
                            { name: "firstname", value: form.firstName },
                            { name: "lastname", value: form.lastName },
                            { name: "email", value: form.email },
                            { name: "company", value: form.company },
                        ],
                        context: {
                            pageUri: typeof window !== "undefined" ? window.location.href : "",
                            pageName: typeof document !== "undefined" ? document.title : "",
                        },
                    }),
                }
            )

            if (res.ok) {
                setIsSuccess(true)
                setForm({ firstName: "", lastName: "", email: "", company: "" })
            } else {
                const data = await res.json().catch(() => null)
                setError(data?.message || "Something went wrong. Please try again.")
            }
        } catch {
            setError("Network error. Please check your connection and try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const sectionPadding = isMobile
        ? `${paddingTop}px 20px 64px`
        : isTablet
          ? `${paddingTop}px 32px 72px`
          : `${paddingTop}px 48px 80px`

    const inputStyle = (field: string): React.CSSProperties => ({
        width: "100%",
        padding: "12px 14px",
        fontSize: 15,
        fontFamily,
        color: textColor,
        backgroundColor: inputBgColor,
        border: `1.5px solid ${isFocused === field ? accentColor : inputBorderColor}`,
        borderRadius,
        outline: "none",
        boxSizing: "border-box",
        transition: "border-color 0.2s ease",
    })

    const labelStyle: React.CSSProperties = {
        display: "block",
        fontSize: 13,
        fontWeight: 600,
        color: textColor,
        marginBottom: 6,
        fontFamily,
    }

    if (isSuccess) {
        return (
            <section
                ref={containerRef}
                style={{
                    ...style,
                    width: "100%",
                    backgroundColor: bgColor,
                    padding: sectionPadding,
                    boxSizing: "border-box",
                    fontFamily,
                }}
            >
                <div
                    style={{
                        maxWidth: 520,
                        margin: "0 auto",
                        textAlign: "center",
                    }}
                >
                    <div
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: "50%",
                            backgroundColor: `${accentColor}14`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 20px",
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <p
                        style={{
                            fontSize: isMobile ? 17 : 19,
                            fontWeight: 600,
                            color: textColor,
                            fontFamily,
                            margin: 0,
                            lineHeight: 1.5,
                        }}
                    >
                        {successMessage}
                    </p>
                </div>
            </section>
        )
    }

    return (
        <section
            ref={containerRef}
            style={{
                ...style,
                width: "100%",
                backgroundColor: bgColor,
                padding: sectionPadding,
                boxSizing: "border-box",
                fontFamily,
            }}
        >
            <div style={{ maxWidth: 520, margin: "0 auto" }}>
                {/* Header */}
                {heading && (
                    <h2
                        style={{
                            fontSize: isMobile ? 26 : 32,
                            fontWeight: headingFontWeight,
                            color: textColor,
                            margin: 0,
                            lineHeight: 1.2,
                            fontFamily: headingFontFamily,
                            letterSpacing: "-0.02em",
                            textAlign: "center",
                        }}
                    >
                        {heading}
                    </h2>
                )}
                {subtitle && (
                    <p
                        style={{
                            fontSize: 15,
                            color: secondaryTextColor,
                            margin: "10px 0 0",
                            lineHeight: 1.6,
                            fontFamily,
                            textAlign: "center",
                        }}
                    >
                        {subtitle}
                    </p>
                )}

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    style={{ marginTop: isMobile ? 28 : 36 }}
                >
                    {/* Name row */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                            gap: isMobile ? 16 : 14,
                            marginBottom: isMobile ? 16 : 14,
                        }}
                    >
                        <div>
                            <label style={labelStyle}>{firstNameLabel}</label>
                            <input
                                type="text"
                                value={form.firstName}
                                onChange={(e) => handleChange("firstName", e.target.value)}
                                onFocus={() => setIsFocused("firstName")}
                                onBlur={() => setIsFocused(null)}
                                placeholder={firstNamePlaceholder}
                                style={inputStyle("firstName")}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>{lastNameLabel}</label>
                            <input
                                type="text"
                                value={form.lastName}
                                onChange={(e) => handleChange("lastName", e.target.value)}
                                onFocus={() => setIsFocused("lastName")}
                                onBlur={() => setIsFocused(null)}
                                placeholder={lastNamePlaceholder}
                                style={inputStyle("lastName")}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div style={{ marginBottom: isMobile ? 16 : 14 }}>
                        <label style={labelStyle}>{emailLabel}</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            onFocus={() => setIsFocused("email")}
                            onBlur={() => setIsFocused(null)}
                            placeholder={emailPlaceholder}
                            style={inputStyle("email")}
                        />
                    </div>

                    {/* Company */}
                    <div style={{ marginBottom: isMobile ? 24 : 20 }}>
                        <label style={labelStyle}>{companyLabel}</label>
                        <input
                            type="text"
                            value={form.company}
                            onChange={(e) => handleChange("company", e.target.value)}
                            onFocus={() => setIsFocused("company")}
                            onBlur={() => setIsFocused(null)}
                            placeholder={companyPlaceholder}
                            style={inputStyle("company")}
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <p
                            style={{
                                fontSize: 13,
                                color: "#e53e3e",
                                margin: "0 0 14px",
                                fontFamily,
                                lineHeight: 1.5,
                            }}
                        >
                            {error}
                        </p>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        style={{
                            width: "100%",
                            padding: "14px 24px",
                            fontSize: 15,
                            fontWeight: 600,
                            color: "#ffffff",
                            backgroundColor: accentColor,
                            border: "none",
                            borderRadius,
                            cursor: isSubmitting ? "wait" : "pointer",
                            fontFamily,
                            transition: "transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease",
                            transform: isHovered && !isSubmitting ? "translateY(-1px)" : "translateY(0)",
                            boxShadow: isHovered && !isSubmitting
                                ? `0 6px 20px ${accentColor}40`
                                : `0 2px 8px ${accentColor}20`,
                            opacity: isSubmitting ? 0.7 : isHovered ? 0.92 : 1,
                        }}
                    >
                        {isSubmitting ? "Submitting\u2026" : submitText}
                    </button>
                </form>
            </div>
        </section>
    )
}

addPropertyControls(ContactForm, {
    hubspotPortalId: {
        type: ControlType.String,
        title: "HubSpot Portal ID",
        defaultValue: "",
        description: "Your HubSpot portal ID (e.g. 12345678)",
    },
    hubspotFormId: {
        type: ControlType.String,
        title: "HubSpot Form ID",
        defaultValue: "",
        description: "The form GUID from HubSpot",
    },
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "Get in touch",
    },
    subtitle: {
        type: ControlType.String,
        title: "Subtitle",
        defaultValue: "Fill in the form below and we\u2019ll get back to you shortly.",
        displayTextArea: true,
    },
    submitText: {
        type: ControlType.String,
        title: "Button Text",
        defaultValue: "Submit",
    },
    successMessage: {
        type: ControlType.String,
        title: "Success Message",
        defaultValue: "Thanks! We\u2019ll be in touch soon.",
    },
    firstNameLabel: {
        type: ControlType.String,
        title: "First Name Label",
        defaultValue: "First name",
    },
    lastNameLabel: {
        type: ControlType.String,
        title: "Last Name Label",
        defaultValue: "Last name",
    },
    emailLabel: {
        type: ControlType.String,
        title: "Email Label",
        defaultValue: "Work email",
    },
    companyLabel: {
        type: ControlType.String,
        title: "Company Label",
        defaultValue: "Company",
    },
    firstNamePlaceholder: {
        type: ControlType.String,
        title: "First Name Placeholder",
        defaultValue: "Jane",
    },
    lastNamePlaceholder: {
        type: ControlType.String,
        title: "Last Name Placeholder",
        defaultValue: "Doe",
    },
    emailPlaceholder: {
        type: ControlType.String,
        title: "Email Placeholder",
        defaultValue: "jane@company.com",
    },
    companyPlaceholder: {
        type: ControlType.String,
        title: "Company Placeholder",
        defaultValue: "Acme Inc.",
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "#4f3ef5",
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#ffffff",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#1a1a2e",
    },
    secondaryTextColor: {
        type: ControlType.Color,
        title: "Secondary Text",
        defaultValue: "#666",
    },
    inputBgColor: {
        type: ControlType.Color,
        title: "Input BG",
        defaultValue: "#f8f8fa",
    },
    inputBorderColor: {
        type: ControlType.Color,
        title: "Input Border",
        defaultValue: "#e0e0e6",
    },
    fontFamily: {
        type: ControlType.String,
        title: "Font Family",
        defaultValue: "'Inter', sans-serif",
    },
    headingFontFamily: {
        type: ControlType.String,
        title: "Heading Font",
        defaultValue: "'Poppins', sans-serif",
    },
    headingFontWeight: {
        type: ControlType.Number,
        title: "Heading Weight",
        defaultValue: 700,
        min: 100,
        max: 900,
        step: 100,
    },
    borderRadius: {
        type: ControlType.Number,
        title: "Border Radius",
        defaultValue: 10,
        min: 0,
        max: 20,
        step: 1,
    },
    paddingTop: {
        type: ControlType.Number,
        title: "Padding Top",
        defaultValue: 80,
        min: 0,
        max: 200,
        step: 10,
    },
})

export default ContactForm
