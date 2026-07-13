import { addPropertyControls, ControlType } from "framer"

interface Props {
    eyebrow: string
    heading: string
    headingFontSize: number
    subheading: string
    ctaPrimaryText: string
    ctaPrimaryUrl: string
    ctaSecondaryText: string
    ctaSecondaryUrl: string
    showSecondaryButton: boolean
    trustItems: string[]
    showTrustStrip: boolean
    bgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    fontFamily: string
    minHeight: number
    style?: React.CSSProperties
}

function AVADASHero(props: Props) {
    const {
        eyebrow = "BEAMR BLUEPRINT · FOR AV / ADAS",
        heading = "Your AV/ADAS pipeline,\nevaluated end to end\nby video data experts",
        headingFontSize = 56,
        subheading = "On your models, your data, your KPIs — all the way to a plan you can act on.",
        ctaPrimaryText = "Request a demo",
        ctaPrimaryUrl = "#demo",
        ctaSecondaryText = "Book a Pre-Discovery call",
        ctaSecondaryUrl = "#pre-discovery",
        showSecondaryButton = true,
        trustItems = [
            "Nasdaq: BMR",
            "15 years of video & image compression",
            "Joint testing with the NVIDIA AV team",
        ],
        showTrustStrip = true,
        bgColor = "#07071c",
        textColor = "#ffffff",
        secondaryTextColor = "#8b8ba3",
        accentColor = "#00d46a",
        fontFamily = "'Inter', sans-serif",
        minHeight = 700,
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
                padding: "120px 48px 80px",
                boxSizing: "border-box",
                fontFamily,
                textAlign: "center",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 800,
                    height: 800,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${accentColor}08 0%, transparent 70%)`,
                    zIndex: 0,
                    pointerEvents: "none",
                }}
            />

            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    maxWidth: 900,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 24,
                }}
            >
                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 20px",
                        borderRadius: 100,
                        border: "1px solid rgba(255,255,255,0.1)",
                        backgroundColor: "rgba(255,255,255,0.04)",
                        fontSize: 13,
                        color: accentColor,
                        fontFamily,
                        letterSpacing: "0.08em",
                        fontWeight: 600,
                        textTransform: "uppercase" as const,
                    }}
                >
                    {eyebrow}
                </div>

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

                <p
                    style={{
                        fontSize: 19,
                        color: secondaryTextColor,
                        lineHeight: 1.6,
                        margin: 0,
                        maxWidth: 640,
                        fontFamily,
                    }}
                >
                    {subheading}
                </p>

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
                            color: bgColor,
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
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            {ctaSecondaryText}
                        </a>
                    )}
                </div>

                {showTrustStrip && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 24,
                            marginTop: 40,
                            flexWrap: "wrap",
                            justifyContent: "center",
                        }}
                    >
                        {trustItems.map((item, i) => (
                            <div
                                key={i}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 24,
                                }}
                            >
                                {i > 0 && (
                                    <span
                                        style={{
                                            width: 4,
                                            height: 4,
                                            borderRadius: "50%",
                                            backgroundColor: secondaryTextColor,
                                            opacity: 0.4,
                                        }}
                                    />
                                )}
                                <span
                                    style={{
                                        fontSize: 14,
                                        color: secondaryTextColor,
                                        fontFamily,
                                        fontWeight: 500,
                                    }}
                                >
                                    {item}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

addPropertyControls(AVADASHero, {
    eyebrow: {
        type: ControlType.String,
        title: "Eyebrow",
        defaultValue: "BEAMR BLUEPRINT · FOR AV / ADAS",
    },
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "Your AV/ADAS pipeline,\nevaluated end to end\nby video data experts",
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
        defaultValue: "On your models, your data, your KPIs — all the way to a plan you can act on.",
        displayTextArea: true,
    },
    ctaPrimaryText: {
        type: ControlType.String,
        title: "Primary CTA",
        defaultValue: "Request a demo",
    },
    ctaPrimaryUrl: {
        type: ControlType.String,
        title: "Primary URL",
        defaultValue: "#demo",
    },
    showSecondaryButton: {
        type: ControlType.Boolean,
        title: "Show Secondary",
        defaultValue: true,
    },
    ctaSecondaryText: {
        type: ControlType.String,
        title: "Secondary CTA",
        defaultValue: "Book a Pre-Discovery call",
        hidden: (props) => !props.showSecondaryButton,
    },
    ctaSecondaryUrl: {
        type: ControlType.String,
        title: "Secondary URL",
        defaultValue: "#pre-discovery",
        hidden: (props) => !props.showSecondaryButton,
    },
    showTrustStrip: {
        type: ControlType.Boolean,
        title: "Show Trust Strip",
        defaultValue: true,
    },
    trustItems: {
        type: ControlType.Array,
        title: "Trust Items",
        maxCount: 6,
        control: {
            type: ControlType.String,
            defaultValue: "Trust item",
        },
        defaultValue: [
            "Nasdaq: BMR",
            "15 years of video & image compression",
            "Joint testing with the NVIDIA AV team",
        ],
        hidden: (props) => !props.showTrustStrip,
    },
    minHeight: {
        type: ControlType.Number,
        title: "Min Height",
        defaultValue: 700,
        min: 400,
        max: 1200,
        step: 20,
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

export default AVADASHero
