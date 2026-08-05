// Beamr 5 HEVC Page - Final CTA Section
// Dark gradient card call-to-action
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
    showSubheading: boolean
    bgColor: string
    cardBgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    headingFont: string
    fontFamily: string
    style?: React.CSSProperties
}

function Beamr5CTA(props: Props) {
    const {
        heading = "Ready to try the world's best HEVC encoder?",
        subheading = "Talk to our team about integrating Beamr 5 into your streaming, broadcast or real-time pipeline.",
        ctaPrimaryText = "Let's Talk",
        ctaPrimaryUrl = "#",
        ctaSecondaryText = "Read the docs",
        ctaSecondaryUrl = "#",
        showSecondaryButton = false,
        showSubheading = true,
        bgColor = "#ffffff",
        cardBgColor = "#050516",
        textColor = "#ffffff",
        secondaryTextColor = "#9a9ab0",
        accentColor = "#2f73ff",
        headingFont = "'Poppins', sans-serif",
        fontFamily = "'Inter', sans-serif",
        style,
    } = props

    return (
        <section
            style={{
                ...style,
                width: "100%",
                backgroundColor: bgColor,
                padding: "72px 48px 104px",
                boxSizing: "border-box",
                fontFamily,
            }}
        >
            <div
                style={{
                    maxWidth: 1080,
                    margin: "0 auto",
                    backgroundColor: cardBgColor,
                    borderRadius: 28,
                    padding: "80px 56px",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Glow */}
                <div
                    style={{
                        position: "absolute",
                        top: "-40%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "80%",
                        height: "140%",
                        background: `radial-gradient(ellipse at center, ${accentColor}33 0%, transparent 60%)`,
                        pointerEvents: "none",
                    }}
                />

                <div style={{ position: "relative", zIndex: 1 }}>
                    <h2
                        style={{
                            fontSize: 40,
                            fontWeight: 700,
                            color: textColor,
                            margin: "0 0 16px",
                            lineHeight: 1.14,
                            letterSpacing: "-0.025em",
                            maxWidth: 640,
                            marginLeft: "auto",
                            marginRight: "auto",
                            fontFamily: headingFont,
                        }}
                    >
                        {heading}
                    </h2>

                    {showSubheading && (
                        <p
                            style={{
                                fontSize: 17,
                                color: secondaryTextColor,
                                margin: "0 auto 36px",
                                maxWidth: 520,
                                lineHeight: 1.6,
                                fontFamily,
                            }}
                        >
                            {subheading}
                        </p>
                    )}

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 14,
                            flexWrap: "wrap",
                            marginTop: showSubheading ? 0 : 32,
                        }}
                    >
                        <a
                            href={ctaPrimaryUrl}
                            style={{
                                backgroundColor: accentColor,
                                color: "#ffffff",
                                padding: "15px 36px",
                                borderRadius: 10,
                                fontSize: 16,
                                fontWeight: 600,
                                textDecoration: "none",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                fontFamily,
                                boxShadow: `0 10px 30px ${accentColor}44`,
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
                                    padding: "15px 32px",
                                    borderRadius: 10,
                                    fontSize: 16,
                                    fontWeight: 500,
                                    textDecoration: "none",
                                    border: "1px solid rgba(255,255,255,0.14)",
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

addPropertyControls(Beamr5CTA, {
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "Ready to try the world's best HEVC encoder?",
        displayTextArea: true,
    },
    showSubheading: {
        type: ControlType.Boolean,
        title: "Show Subheading",
        defaultValue: true,
    },
    subheading: {
        type: ControlType.String,
        title: "Subheading",
        defaultValue:
            "Talk to our team about integrating Beamr 5 into your streaming, broadcast or real-time pipeline.",
        displayTextArea: true,
        hidden: (props) => !props.showSubheading,
    },
    ctaPrimaryText: {
        type: ControlType.String,
        title: "Primary CTA",
        defaultValue: "Let's Talk",
    },
    ctaPrimaryUrl: {
        type: ControlType.String,
        title: "Primary URL",
        defaultValue: "#",
    },
    showSecondaryButton: {
        type: ControlType.Boolean,
        title: "Show Secondary",
        defaultValue: false,
    },
    ctaSecondaryText: {
        type: ControlType.String,
        title: "Secondary CTA",
        defaultValue: "Read the docs",
        hidden: (props) => !props.showSecondaryButton,
    },
    ctaSecondaryUrl: {
        type: ControlType.String,
        title: "Secondary URL",
        defaultValue: "#",
        hidden: (props) => !props.showSecondaryButton,
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#ffffff",
    },
    cardBgColor: {
        type: ControlType.Color,
        title: "Card Background",
        defaultValue: "#050516",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#ffffff",
    },
    secondaryTextColor: {
        type: ControlType.Color,
        title: "Secondary Text",
        defaultValue: "#9a9ab0",
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "#2f73ff",
    },
    headingFont: {
        type: ControlType.String,
        title: "Heading Font",
        defaultValue: "'Poppins', sans-serif",
    },
    fontFamily: {
        type: ControlType.String,
        title: "Body Font",
        defaultValue: "'Inter', sans-serif",
    },
})

export default Beamr5CTA
