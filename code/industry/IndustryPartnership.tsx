// Industry Page - Partnership / Features Section
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"

interface Feature {
    icon: string
    title: string
    description: string
}

interface Props {
    sectionLabel: string
    heading: string
    image: string
    layoutDirection: "left" | "right"
    features: Feature[]
    bgColor: string
    cardBgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    fontFamily: string
    style?: React.CSSProperties
}

function IndustryPartnership(props: Props) {
    const {
        sectionLabel = "PARTNERSHIP",
        heading = "Your video efficiency partner",
        image = "",
        layoutDirection = "left",
        features = [
            {
                icon: "⚡",
                title: "Seamless Integration",
                description: "Drop-in API that works with your existing encoding pipeline. No workflow changes required.",
            },
            {
                icon: "🔒",
                title: "Enterprise Security",
                description: "SOC 2 Type II certified with end-to-end encryption and full compliance with industry standards.",
            },
            {
                icon: "📊",
                title: "Real-Time Analytics",
                description: "Comprehensive dashboard with per-title analytics, quality metrics, and savings reports.",
            },
        ],
        bgColor = "#0a0b1e",
        cardBgColor = "#0f1029",
        textColor = "#ffffff",
        secondaryTextColor = "#8b8ba3",
        accentColor = "#00d46a",
        fontFamily = "'Inter', sans-serif",
        style,
    } = props

    const imageBlock = (
        <div
            style={{
                width: "100%",
                aspectRatio: "4/3",
                borderRadius: 16,
                overflow: "hidden",
                background: image
                    ? `url(${image}) center/cover no-repeat`
                    : "linear-gradient(135deg, #0f1029 0%, #1a1b45 100%)",
                border: "1px solid rgba(255,255,255,0.06)",
            }}
        />
    )

    const featuresBlock = (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {features.map((feature, i) => (
                <div
                    key={i}
                    style={{
                        backgroundColor: cardBgColor,
                        borderRadius: 14,
                        padding: 24,
                        border: "1px solid rgba(255,255,255,0.06)",
                        display: "flex",
                        gap: 16,
                        alignItems: "flex-start",
                    }}
                >
                    {/* Icon */}
                    <div
                        style={{
                            width: 42,
                            height: 42,
                            borderRadius: 10,
                            backgroundColor: `${accentColor}15`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 20,
                            flexShrink: 0,
                        }}
                    >
                        {feature.icon}
                    </div>

                    <div>
                        <h4
                            style={{
                                fontSize: 16,
                                fontWeight: 600,
                                color: textColor,
                                margin: "0 0 6px",
                                fontFamily,
                            }}
                        >
                            {feature.title}
                        </h4>
                        <p
                            style={{
                                fontSize: 14,
                                color: secondaryTextColor,
                                margin: 0,
                                lineHeight: 1.6,
                                fontFamily,
                            }}
                        >
                            {feature.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )

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
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
                {/* Section Header */}
                <div style={{ textAlign: "center", marginBottom: 56 }}>
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
                    <h2
                        style={{
                            fontSize: 44,
                            fontWeight: 700,
                            color: textColor,
                            margin: "16px 0 0",
                            lineHeight: 1.15,
                            letterSpacing: "-0.02em",
                            fontFamily,
                        }}
                    >
                        {heading}
                    </h2>
                </div>

                {/* Two-column layout */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 48,
                        alignItems: "center",
                    }}
                >
                    {layoutDirection === "left" ? (
                        <>
                            {imageBlock}
                            {featuresBlock}
                        </>
                    ) : (
                        <>
                            {featuresBlock}
                            {imageBlock}
                        </>
                    )}
                </div>
            </div>
        </section>
    )
}

addPropertyControls(IndustryPartnership, {
    sectionLabel: {
        type: ControlType.String,
        title: "Section Label",
        defaultValue: "PARTNERSHIP",
    },
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "Your video efficiency partner",
    },
    image: {
        type: ControlType.Image,
        title: "Image",
    },
    layoutDirection: {
        type: ControlType.Enum,
        title: "Layout",
        options: ["left", "right"],
        optionTitles: ["Image Left", "Image Right"],
        defaultValue: "left",
    },
    features: {
        type: ControlType.Array,
        title: "Features",
        maxCount: 6,
        control: {
            type: ControlType.Object,
            controls: {
                icon: {
                    type: ControlType.String,
                    title: "Icon",
                    defaultValue: "⚡",
                },
                title: {
                    type: ControlType.String,
                    title: "Title",
                    defaultValue: "Feature Title",
                },
                description: {
                    type: ControlType.String,
                    title: "Description",
                    defaultValue: "Feature description goes here.",
                    displayTextArea: true,
                },
            },
        },
        defaultValue: [
            {
                icon: "⚡",
                title: "Seamless Integration",
                description: "Drop-in API that works with your existing encoding pipeline. No workflow changes required.",
            },
            {
                icon: "🔒",
                title: "Enterprise Security",
                description: "SOC 2 Type II certified with end-to-end encryption and full compliance with industry standards.",
            },
            {
                icon: "📊",
                title: "Real-Time Analytics",
                description: "Comprehensive dashboard with per-title analytics, quality metrics, and savings reports.",
            },
        ],
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#0a0b1e",
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

export default IndustryPartnership
