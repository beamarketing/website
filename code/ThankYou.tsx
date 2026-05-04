// Beamr Homepage - Thank You Confirmation Section
// Framer Code Component with full property controls
//
// Inspired by ces.tech/thank-you/ — shown after a form submission.

import { addPropertyControls, ControlType } from "framer"

interface Props {
    showBadge: boolean
    badge: string
    showCheckmark: boolean
    heading: string
    subheading: string
    body: string
    showSupportLine: boolean
    supportLeadingText: string
    supportLinkText: string
    supportLinkUrl: string
    supportTrailingText: string
    ctaPrimaryText: string
    ctaPrimaryUrl: string
    ctaSecondaryText: string
    ctaSecondaryUrl: string
    showSecondaryButton: boolean
    bgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    fontFamily: string
    headingFontSize: number
    minHeight: number
    style?: React.CSSProperties
}

function ThankYou(props: Props) {
    const {
        badge = "Form submitted successfully",
        showBadge = true,
        showCheckmark = true,
        heading = "Thank you for\nreaching out.",
        subheading = "Your message is on its way to the Beamr team.",
        body = "We've received your submission and a member of our team will review it shortly. If a follow-up is needed, we'll be in touch at the email address you provided.",
        showSupportLine = true,
        supportLeadingText = "Have a question in the meantime? Visit our",
        supportLinkText = "support page",
        supportLinkUrl = "#support",
        supportTrailingText = "or email hello@beamr.com.",
        ctaPrimaryText = "Back to Home",
        ctaPrimaryUrl = "/",
        ctaSecondaryText = "Explore Resources",
        ctaSecondaryUrl = "#resources",
        showSecondaryButton = true,
        bgColor = "#07071c",
        textColor = "#ffffff",
        secondaryTextColor = "#8b8ba3",
        accentColor = "#00d46a",
        fontFamily = "'Inter', sans-serif",
        headingFontSize = 56,
        minHeight = 640,
        style,
    } = props

    return (
        <section
            style={{
                ...style,
                width: "100%",
                minHeight,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                backgroundColor: bgColor,
                padding: "140px 48px 100px",
                boxSizing: "border-box",
                fontFamily,
                textAlign: "center",
            }}
        >
            {/* Glow */}
            <div
                style={{
                    position: "absolute",
                    top: "40%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 720,
                    height: 720,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${accentColor}10 0%, transparent 70%)`,
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            />

            {/* Content */}
            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    maxWidth: 760,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 24,
                }}
            >
                {/* Checkmark medallion */}
                {showCheckmark && (
                    <div
                        style={{
                            width: 84,
                            height: 84,
                            borderRadius: "50%",
                            backgroundColor: `${accentColor}1f`,
                            border: `1px solid ${accentColor}66`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: 4,
                            boxShadow: `0 0 60px ${accentColor}33`,
                        }}
                    >
                        <svg
                            width="36"
                            height="36"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path
                                d="M5 12.5L10 17.5L19 7.5"
                                stroke={accentColor}
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                )}

                {/* Badge */}
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
                            opacity: 0.85,
                            fontFamily,
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
                        {badge}
                    </div>
                )}

                {/* Heading */}
                <h1
                    style={{
                        fontSize: headingFontSize,
                        fontWeight: 700,
                        color: textColor,
                        lineHeight: 1.1,
                        margin: 0,
                        fontFamily,
                        whiteSpace: "pre-line",
                        letterSpacing: "-0.02em",
                    }}
                >
                    {heading}
                </h1>

                {/* Subheading */}
                <p
                    style={{
                        fontSize: 20,
                        color: textColor,
                        opacity: 0.85,
                        lineHeight: 1.5,
                        margin: 0,
                        maxWidth: 600,
                        fontFamily,
                    }}
                >
                    {subheading}
                </p>

                {/* Body */}
                <p
                    style={{
                        fontSize: 16,
                        color: secondaryTextColor,
                        lineHeight: 1.7,
                        margin: 0,
                        maxWidth: 600,
                        fontFamily,
                    }}
                >
                    {body}
                </p>

                {/* Support line */}
                {showSupportLine && (
                    <p
                        style={{
                            fontSize: 15,
                            color: secondaryTextColor,
                            margin: 0,
                            fontFamily,
                        }}
                    >
                        {supportLeadingText}{" "}
                        <a
                            href={supportLinkUrl}
                            style={{
                                color: accentColor,
                                textDecoration: "none",
                                fontWeight: 500,
                            }}
                        >
                            {supportLinkText}
                        </a>{" "}
                        {supportTrailingText}
                    </p>
                )}

                {/* CTA Buttons */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        marginTop: 16,
                        flexWrap: "wrap",
                        justifyContent: "center",
                    }}
                >
                    <a
                        href={ctaPrimaryUrl}
                        style={{
                            backgroundColor: accentColor,
                            color: "#07071c",
                            padding: "14px 32px",
                            borderRadius: 10,
                            fontSize: 16,
                            fontWeight: 600,
                            textDecoration: "none",
                            fontFamily,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        {ctaPrimaryText}
                        <span style={{ fontSize: 18 }}>&#8594;</span>
                    </a>
                    {showSecondaryButton && (
                        <a
                            href={ctaSecondaryUrl}
                            style={{
                                backgroundColor: "rgba(255,255,255,0.06)",
                                color: textColor,
                                padding: "14px 32px",
                                borderRadius: 10,
                                fontSize: 16,
                                fontWeight: 500,
                                textDecoration: "none",
                                border: "1px solid rgba(255,255,255,0.1)",
                                fontFamily,
                            }}
                        >
                            {ctaSecondaryText}
                        </a>
                    )}
                </div>
            </div>
        </section>
    )
}

addPropertyControls(ThankYou, {
    showCheckmark: {
        type: ControlType.Boolean,
        title: "Show Check",
        defaultValue: true,
    },
    showBadge: {
        type: ControlType.Boolean,
        title: "Show Badge",
        defaultValue: true,
    },
    badge: {
        type: ControlType.String,
        title: "Badge Text",
        defaultValue: "Form submitted successfully",
        hidden: (props) => !props.showBadge,
    },
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "Thank you for\nreaching out.",
        displayTextArea: true,
    },
    headingFontSize: {
        type: ControlType.Number,
        title: "Heading Size",
        defaultValue: 56,
        min: 32,
        max: 96,
        step: 2,
    },
    subheading: {
        type: ControlType.String,
        title: "Subheading",
        defaultValue: "Your message is on its way to the Beamr team.",
        displayTextArea: true,
    },
    body: {
        type: ControlType.String,
        title: "Body Text",
        defaultValue:
            "We've received your submission and a member of our team will review it shortly. If a follow-up is needed, we'll be in touch at the email address you provided.",
        displayTextArea: true,
    },
    showSupportLine: {
        type: ControlType.Boolean,
        title: "Support Line",
        defaultValue: true,
    },
    supportLeadingText: {
        type: ControlType.String,
        title: "Support Lead",
        defaultValue: "Have a question in the meantime? Visit our",
        hidden: (props) => !props.showSupportLine,
    },
    supportLinkText: {
        type: ControlType.String,
        title: "Support Link",
        defaultValue: "support page",
        hidden: (props) => !props.showSupportLine,
    },
    supportLinkUrl: {
        type: ControlType.String,
        title: "Support URL",
        defaultValue: "#support",
        hidden: (props) => !props.showSupportLine,
    },
    supportTrailingText: {
        type: ControlType.String,
        title: "Support Trail",
        defaultValue: "or email hello@beamr.com.",
        hidden: (props) => !props.showSupportLine,
    },
    ctaPrimaryText: {
        type: ControlType.String,
        title: "Primary CTA",
        defaultValue: "Back to Home",
    },
    ctaPrimaryUrl: {
        type: ControlType.String,
        title: "Primary URL",
        defaultValue: "/",
    },
    showSecondaryButton: {
        type: ControlType.Boolean,
        title: "Show Secondary",
        defaultValue: true,
    },
    ctaSecondaryText: {
        type: ControlType.String,
        title: "Secondary CTA",
        defaultValue: "Explore Resources",
        hidden: (props) => !props.showSecondaryButton,
    },
    ctaSecondaryUrl: {
        type: ControlType.String,
        title: "Secondary URL",
        defaultValue: "#resources",
        hidden: (props) => !props.showSecondaryButton,
    },
    minHeight: {
        type: ControlType.Number,
        title: "Min Height",
        defaultValue: 640,
        min: 400,
        max: 1000,
        step: 10,
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#07071c",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#ffffff",
    },
    secondaryTextColor: {
        type: ControlType.Color,
        title: "Secondary Text",
        defaultValue: "#8b8ba3",
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "#00d46a",
    },
    fontFamily: {
        type: ControlType.String,
        title: "Font Family",
        defaultValue: "'Inter', sans-serif",
    },
})

export default ThankYou
