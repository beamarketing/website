// Beamr Homepage - CTA (Call to Action) Section
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"

interface Props {
    heading: string
    subheading: string
    ctaPrimaryText: string
    ctaPrimaryUrl: string
    ctaSecondaryText: string
    ctaSecondaryUrl: string
    showSecondaryButton: boolean
    bgColor: string
    cardBgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    fontFamily: string
    showGlow: boolean
    style?: React.CSSProperties
}

function CTASection(props: Props) {
    const {
        heading = "Ready to Optimize\nYour Video?",
        subheading = "Join 1,000+ companies already saving millions on video delivery with Beamr's content-adaptive encoding.",
        ctaPrimaryText = "Get Started Free",
        ctaPrimaryUrl = "#contact",
        ctaSecondaryText = "Talk to Sales",
        ctaSecondaryUrl = "#sales",
        showSecondaryButton = true,
        bgColor = "#07071c",
        cardBgColor = "#0f1029",
        textColor = "#ffffff",
        secondaryTextColor = "#8b8ba3",
        accentColor = "#00d46a",
        fontFamily = "'Inter', sans-serif",
        showGlow = true,
        style,
    } = props

    return (
        <section
            style={{
                ...style,
                width: "100%",
                backgroundColor: bgColor,
                padding: "100px 48px",
                boxSizing: "border-box",
                fontFamily,
            }}
        >
            <div
                style={{
                    maxWidth: 900,
                    margin: "0 auto",
                    position: "relative",
                }}
            >
                {/* Glow Effect */}
                {showGlow && (
                    <div
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 600,
                            height: 400,
                            borderRadius: "50%",
                            background: `radial-gradient(circle, ${accentColor}12 0%, transparent 70%)`,
                            pointerEvents: "none",
                            zIndex: 0,
                        }}
                    />
                )}

                {/* Card */}
                <div
                    style={{
                        position: "relative",
                        zIndex: 1,
                        backgroundColor: cardBgColor,
                        borderRadius: 24,
                        border: "1px solid rgba(255,255,255,0.08)",
                        padding: "72px 64px",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 24,
                    }}
                >
                    <h2
                        style={{
                            fontSize: 44,
                            fontWeight: 700,
                            color: textColor,
                            margin: 0,
                            lineHeight: 1.15,
                            fontFamily,
                            letterSpacing: "-0.02em",
                            whiteSpace: "pre-line",
                        }}
                    >
                        {heading}
                    </h2>

                    <p
                        style={{
                            fontSize: 17,
                            color: secondaryTextColor,
                            margin: 0,
                            maxWidth: 520,
                            lineHeight: 1.6,
                            fontFamily,
                        }}
                    >
                        {subheading}
                    </p>

                    {/* Buttons */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                            marginTop: 8,
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
            </div>
        </section>
    )
}

addPropertyControls(CTASection, {
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "Ready to Optimize\nYour Video?",
        displayTextArea: true,
    },
    subheading: {
        type: ControlType.String,
        title: "Subheading",
        defaultValue:
            "Join 1,000+ companies already saving millions on video delivery with Beamr's content-adaptive encoding.",
        displayTextArea: true,
    },
    ctaPrimaryText: {
        type: ControlType.String,
        title: "Primary CTA",
        defaultValue: "Get Started Free",
    },
    ctaPrimaryUrl: {
        type: ControlType.String,
        title: "Primary URL",
        defaultValue: "#contact",
    },
    showSecondaryButton: {
        type: ControlType.Boolean,
        title: "Show Secondary",
        defaultValue: true,
    },
    ctaSecondaryText: {
        type: ControlType.String,
        title: "Secondary CTA",
        defaultValue: "Talk to Sales",
        hidden: (props) => !props.showSecondaryButton,
    },
    ctaSecondaryUrl: {
        type: ControlType.String,
        title: "Secondary URL",
        defaultValue: "#sales",
        hidden: (props) => !props.showSecondaryButton,
    },
    showGlow: {
        type: ControlType.Boolean,
        title: "Show Glow",
        defaultValue: true,
    },
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

export default CTASection
