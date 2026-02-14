// Industry Page - Use Cases Section
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"

interface UseCaseCard {
    icon: string
    title: string
    description: string
    linkText: string
    linkUrl: string
}

interface Props {
    sectionLabel: string
    heading: string
    cards: UseCaseCard[]
    columns: number
    bgColor: string
    cardBgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    borderColor: string
    fontFamily: string
    style?: React.CSSProperties
}

function IndustryUseCases(props: Props) {
    const {
        sectionLabel = "USE CASES",
        heading = "How companies use Beamr",
        cards = [
            {
                icon: "📡",
                title: "Streaming Optimization",
                description:
                    "Reduce bandwidth costs by up to 50% while maintaining broadcast-quality video for millions of concurrent viewers.",
                linkText: "Learn more",
                linkUrl: "#",
            },
            {
                icon: "🚀",
                title: "Content Delivery",
                description:
                    "Accelerate content delivery with smaller file sizes, enabling faster start times and reduced buffering across global CDNs.",
                linkText: "Learn more",
                linkUrl: "#",
            },
            {
                icon: "☁️",
                title: "Cloud Storage",
                description:
                    "Cut cloud storage costs dramatically while preserving your entire content library in pristine, visually lossless quality.",
                linkText: "Learn more",
                linkUrl: "#",
            },
        ],
        columns = 3,
        bgColor = "#07071c",
        cardBgColor = "#0f1029",
        textColor = "#ffffff",
        secondaryTextColor = "#8b8ba3",
        accentColor = "#00d46a",
        borderColor = "rgba(255,255,255,0.06)",
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

                {/* Cards Grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${columns}, 1fr)`,
                        gap: 24,
                    }}
                >
                    {cards.map((card, i) => (
                        <div
                            key={i}
                            style={{
                                backgroundColor: cardBgColor,
                                borderRadius: 16,
                                padding: 32,
                                border: `1px solid ${borderColor}`,
                                display: "flex",
                                flexDirection: "column",
                                gap: 20,
                            }}
                        >
                            {/* Icon */}
                            <div
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 12,
                                    backgroundColor: `${accentColor}15`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 22,
                                }}
                            >
                                {card.icon}
                            </div>

                            {/* Title */}
                            <h3
                                style={{
                                    fontSize: 20,
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
                                    fontSize: 15,
                                    color: secondaryTextColor,
                                    margin: 0,
                                    lineHeight: 1.6,
                                    fontFamily,
                                    flex: 1,
                                }}
                            >
                                {card.description}
                            </p>

                            {/* Link */}
                            <a
                                href={card.linkUrl}
                                style={{
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: accentColor,
                                    textDecoration: "none",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 6,
                                    fontFamily,
                                }}
                            >
                                {card.linkText}
                                <span style={{ fontSize: 16 }}>&#8594;</span>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

addPropertyControls(IndustryUseCases, {
    sectionLabel: {
        type: ControlType.String,
        title: "Section Label",
        defaultValue: "USE CASES",
    },
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "How companies use Beamr",
    },
    cards: {
        type: ControlType.Array,
        title: "Use Case Cards",
        maxCount: 6,
        control: {
            type: ControlType.Object,
            controls: {
                icon: {
                    type: ControlType.String,
                    title: "Icon",
                    defaultValue: "📡",
                },
                title: {
                    type: ControlType.String,
                    title: "Title",
                    defaultValue: "Use Case",
                },
                description: {
                    type: ControlType.String,
                    title: "Description",
                    defaultValue: "Description of this use case.",
                    displayTextArea: true,
                },
                linkText: {
                    type: ControlType.String,
                    title: "Link Text",
                    defaultValue: "Learn more",
                },
                linkUrl: {
                    type: ControlType.String,
                    title: "Link URL",
                    defaultValue: "#",
                },
            },
        },
        defaultValue: [
            {
                icon: "📡",
                title: "Streaming Optimization",
                description:
                    "Reduce bandwidth costs by up to 50% while maintaining broadcast-quality video for millions of concurrent viewers.",
                linkText: "Learn more",
                linkUrl: "#",
            },
            {
                icon: "🚀",
                title: "Content Delivery",
                description:
                    "Accelerate content delivery with smaller file sizes, enabling faster start times and reduced buffering across global CDNs.",
                linkText: "Learn more",
                linkUrl: "#",
            },
            {
                icon: "☁️",
                title: "Cloud Storage",
                description:
                    "Cut cloud storage costs dramatically while preserving your entire content library in pristine, visually lossless quality.",
                linkText: "Learn more",
                linkUrl: "#",
            },
        ],
    },
    columns: {
        type: ControlType.Number,
        title: "Columns",
        defaultValue: 3,
        min: 1,
        max: 4,
        step: 1,
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
    borderColor: {
        type: ControlType.Color,
        title: "Border Color",
        defaultValue: "rgba(255,255,255,0.06)",
    },
    fontFamily: {
        type: ControlType.String,
        title: "Font Family",
        defaultValue: "'Inter', sans-serif",
    },
})

export default IndustryUseCases
