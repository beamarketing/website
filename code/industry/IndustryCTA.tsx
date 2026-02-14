// Industry Page - CTA Section
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
    showGlow: boolean
    bgColor: string
    cardBgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    fontFamily: string
    style?: React.CSSProperties
}

function IndustryCTA(props: Props) {
    const {
        heading = "Ready to optimize your video?",
        subheading = "Join hundreds of media companies already saving millions on bandwidth and storage with Beamr's CABR technology.",
        ctaPrimaryText = "Start Free Trial",
        ctaPrimaryUrl = "#",
        ctaSecondaryText = "Contact Sales",
        ctaSecondaryUrl = "#",
        showSecondaryButton = true,
        showGlow = true,
        bgColor = "#07071c",
        cardBgColor = "#0f1029",
        textColor = "#ffffff",
        secondaryTextColor = "#8b8ba3",
        accentColor = "#00d46a",
        fontFamily = "'Inter', sans-serif",
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
                position: "relative",
            }}
        >
            {/* Glow effect */}
            {showGlow && (
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "80%",
                        height: "120%",
                        background: `radial-gradient(circle, ${accentColor}12 0%, transparent 70%)`,
                        pointerEvents: "none",
                    }}
                />
            )}

            <div
                style={{
                    maxWidth: 800,
                    margin: "0 auto",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                <div
                    style={{
                        backgroundColor: cardBgColor,
                        borderRadius: 24,
                        padding: "64px 48px",
                        textAlign: "center",
                        border: "1px solid rgba(255,255,255,0.08)",
                    }}
                >
                    <h2
                        style={{
                            fontSize: 40,
                            fontWeight: 700,
                            color: textColor,
                            margin: "0 0 16px",
                            lineHeight: 1.15,
                            letterSpacing: "-0.02em",
                            fontFamily,
                        }}
                    >
                        {heading}
                    </h2>

                    <p
                        style={{
                            fontSize: 17,
                            color: secondaryTextColor,
                            margin: "0 auto 40px",
                            maxWidth: 520,
                            lineHeight: 1.6,
                            fontFamily,
                        }}
                    >
                        {subheading}
                    </p>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 16,
                            flexWrap: "wrap",
                        }}
                    >
                        <a
                            href={ctaPrimaryUrl}
                            style={{
                                backgroundColor: accentColor,
                                color: bgColor,
                                padding: "14px 32px",
                                borderRadius: 10,
                                fontSize: 16,
                                fontWeight: 600,
                                textDecoration: "none",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                fontFamily,
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

addPropertyControls(IndustryCTA, {
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "Ready to optimize your video?",
    },
    subheading: {
        type: ControlType.String,
        title: "Subheading",
        defaultValue:
            "Join hundreds of media companies already saving millions on bandwidth and storage with Beamr's CABR technology.",
        displayTextArea: true,
    },
    ctaPrimaryText: {
        type: ControlType.String,
        title: "Primary CTA",
        defaultValue: "Start Free Trial",
    },
    ctaPrimaryUrl: {
        type: ControlType.String,
        title: "Primary URL",
        defaultValue: "#",
    },
    showSecondaryButton: {
        type: ControlType.Boolean,
        title: "Show Secondary",
        defaultValue: true,
    },
    ctaSecondaryText: {
        type: ControlType.String,
        title: "Secondary CTA",
        defaultValue: "Contact Sales",
        hidden: (props) => !props.showSecondaryButton,
    },
    ctaSecondaryUrl: {
        type: ControlType.String,
        title: "Secondary URL",
        defaultValue: "#",
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
        title: "Card Background",
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

export default IndustryCTA
