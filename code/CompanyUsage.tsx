// Beamr Homepage - How Companies Use Beamr (Metrics Section)
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"

interface MetricCard {
    icon: string
    metric: string
    title: string
    description: string
}

interface Props {
    sectionLabel: string
    heading: string
    subheading: string
    cards: MetricCard[]
    bgColor: string
    cardBgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    fontFamily: string
    cardBorderRadius: number
    columns: number
    style?: React.CSSProperties
}

function CompanyUsage(props: Props) {
    const {
        sectionLabel = "USE CASES",
        heading = "How Companies Use Beamr",
        subheading = "Real results from real customers using content-adaptive encoding.",
        cards = [
            {
                icon: "📡",
                metric: "50%",
                title: "Cut CDN Costs",
                description:
                    "Reduce bandwidth expenses by up to 50% without any perceptible quality loss.",
            },
            {
                icon: "💾",
                metric: "40%",
                title: "Reduce Storage",
                description:
                    "Shrink video storage footprint by up to 40% with intelligent encoding.",
            },
            {
                icon: "✨",
                metric: "100%",
                title: "Improved Visual Quality",
                description:
                    "Maintain or improve perceived quality with mathematically optimized encoding.",
            },
            {
                icon: "🤖",
                metric: "2x",
                title: "Train AI Without Sacrificing",
                description:
                    "Double your training data throughput without sacrificing visual details.",
            },
        ],
        bgColor = "#0a0b1e",
        cardBgColor = "#0f1029",
        textColor = "#ffffff",
        secondaryTextColor = "#8b8ba3",
        accentColor = "#00d46a",
        fontFamily = "'Inter', sans-serif",
        cardBorderRadius = 16,
        columns = 4,
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
                    maxWidth: 1280,
                    margin: "0 auto",
                }}
            >
                {/* Header */}
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
                            fontFamily,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        {heading}
                    </h2>
                    <p
                        style={{
                            fontSize: 17,
                            color: secondaryTextColor,
                            margin: "16px auto 0",
                            maxWidth: 560,
                            lineHeight: 1.6,
                            fontFamily,
                        }}
                    >
                        {subheading}
                    </p>
                </div>

                {/* Metrics Grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${Math.min(columns, cards.length)}, 1fr)`,
                        gap: 24,
                    }}
                >
                    {cards.map((card, i) => (
                        <div
                            key={i}
                            style={{
                                backgroundColor: cardBgColor,
                                borderRadius: cardBorderRadius,
                                border: "1px solid rgba(255,255,255,0.06)",
                                padding: "32px 28px",
                                display: "flex",
                                flexDirection: "column",
                                gap: 16,
                                transition: "border-color 0.3s",
                            }}
                        >
                            {/* Icon */}
                            <div
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 12,
                                    backgroundColor: `${accentColor}12`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 24,
                                }}
                            >
                                {card.icon}
                            </div>

                            {/* Metric */}
                            <span
                                style={{
                                    fontSize: 36,
                                    fontWeight: 700,
                                    color: accentColor,
                                    fontFamily,
                                    letterSpacing: "-0.02em",
                                    lineHeight: 1,
                                }}
                            >
                                {card.metric}
                            </span>

                            {/* Title */}
                            <h3
                                style={{
                                    fontSize: 18,
                                    fontWeight: 600,
                                    color: textColor,
                                    margin: 0,
                                    fontFamily,
                                }}
                            >
                                {card.title}
                            </h3>

                            {/* Description */}
                            <p
                                style={{
                                    fontSize: 14,
                                    color: secondaryTextColor,
                                    margin: 0,
                                    lineHeight: 1.6,
                                    fontFamily,
                                }}
                            >
                                {card.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

addPropertyControls(CompanyUsage, {
    sectionLabel: {
        type: ControlType.String,
        title: "Label",
        defaultValue: "USE CASES",
    },
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "How Companies Use Beamr",
    },
    subheading: {
        type: ControlType.String,
        title: "Subheading",
        defaultValue:
            "Real results from real customers using content-adaptive encoding.",
        displayTextArea: true,
    },
    cards: {
        type: ControlType.Array,
        title: "Metric Cards",
        maxCount: 8,
        control: {
            type: ControlType.Object,
            controls: {
                icon: {
                    type: ControlType.String,
                    title: "Icon/Emoji",
                    defaultValue: "📊",
                },
                metric: {
                    type: ControlType.String,
                    title: "Metric Value",
                    defaultValue: "50%",
                },
                title: {
                    type: ControlType.String,
                    title: "Title",
                    defaultValue: "Metric Title",
                },
                description: {
                    type: ControlType.String,
                    title: "Description",
                    defaultValue: "Description of this metric.",
                    displayTextArea: true,
                },
            },
        },
        defaultValue: [
            {
                icon: "📡",
                metric: "50%",
                title: "Cut CDN Costs",
                description:
                    "Reduce bandwidth expenses by up to 50% without any perceptible quality loss.",
            },
            {
                icon: "💾",
                metric: "40%",
                title: "Reduce Storage",
                description:
                    "Shrink video storage footprint by up to 40% with intelligent encoding.",
            },
            {
                icon: "✨",
                metric: "100%",
                title: "Improved Visual Quality",
                description:
                    "Maintain or improve perceived quality with mathematically optimized encoding.",
            },
            {
                icon: "🤖",
                metric: "2x",
                title: "Train AI Without Sacrificing",
                description:
                    "Double your training data throughput without sacrificing visual details.",
            },
        ],
    },
    columns: {
        type: ControlType.Number,
        title: "Columns",
        defaultValue: 4,
        min: 1,
        max: 6,
        step: 1,
    },
    cardBorderRadius: {
        type: ControlType.Number,
        title: "Card Radius",
        defaultValue: 16,
        min: 0,
        max: 32,
        step: 2,
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#0a0b1e",
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

export default CompanyUsage
