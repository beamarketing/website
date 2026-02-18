// Beamr Homepage - Solutions Section
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"

interface SolutionCard {
    icon: string
    title: string
    description: string
    linkText: string
    linkUrl: string
    image: string
}

interface Props {
    sectionLabel: string
    heading: string
    subheading: string
    cards: SolutionCard[]
    bgColor: string
    cardBgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    fontFamily: string
    imageHeight: number
    cardBorderRadius: number
    style?: React.CSSProperties
}

function Solutions(props: Props) {
    const {
        sectionLabel = "SOLUTIONS",
        heading = "Solutions for Your Industry",
        subheading = "Tailored video optimization across industries — from streaming to autonomous vehicles.",
        cards = [
            {
                icon: "🎬",
                title: "Media & Entertainment",
                description:
                    "Reduce CDN and storage costs while maintaining pristine visual quality for streaming content.",
                linkText: "Explore",
                linkUrl: "#media",
                image: "",
            },
            {
                icon: "🚗",
                title: "Autonomous Vehicles",
                description:
                    "Compress video from vehicle cameras without losing critical visual details for AI training.",
                linkText: "Explore",
                linkUrl: "#automotive",
                image: "",
            },
            {
                icon: "🧠",
                title: "AI / Machine Learning",
                description:
                    "Optimize training data pipelines with smaller video files that preserve every detail AI needs.",
                linkText: "Explore",
                linkUrl: "#ai",
                image: "",
            },
        ],
        bgColor = "#07071c",
        cardBgColor = "#0f1029",
        textColor = "#ffffff",
        secondaryTextColor = "#8b8ba3",
        accentColor = "#00d46a",
        fontFamily = "'Inter', sans-serif",
        imageHeight = 200,
        cardBorderRadius = 16,
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
                {/* Section Header */}
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: 56,
                    }}
                >
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

                {/* Cards Grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${Math.min(cards.length, 3)}, 1fr)`,
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
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column",
                                transition: "border-color 0.3s, transform 0.3s",
                            }}
                        >
                            {/* Card Image */}
                            <div
                                style={{
                                    width: "100%",
                                    height: imageHeight,
                                    backgroundColor: "rgba(255,255,255,0.03)",
                                    overflow: "hidden",
                                }}
                            >
                                {card.image ? (
                                    <img
                                        src={card.image}
                                        alt={card.title}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            background: `linear-gradient(135deg, ${cardBgColor} 0%, rgba(255,255,255,0.05) 100%)`,
                                        }}
                                    >
                                        <span style={{ fontSize: 48 }}>
                                            {card.icon}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Card Content */}
                            <div
                                style={{
                                    padding: "28px 24px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 12,
                                    flex: 1,
                                }}
                            >
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
                                <a
                                    href={card.linkUrl}
                                    style={{
                                        fontSize: 15,
                                        fontWeight: 500,
                                        color: accentColor,
                                        textDecoration: "none",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 6,
                                        fontFamily,
                                        marginTop: 4,
                                    }}
                                >
                                    {card.linkText}{" "}
                                    <span style={{ fontSize: 16 }}>&#8594;</span>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

addPropertyControls(Solutions, {
    sectionLabel: {
        type: ControlType.String,
        title: "Label",
        defaultValue: "SOLUTIONS",
    },
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "Solutions for Your Industry",
    },
    subheading: {
        type: ControlType.String,
        title: "Subheading",
        defaultValue:
            "Tailored video optimization across industries — from streaming to autonomous vehicles.",
        displayTextArea: true,
    },
    imageHeight: {
        type: ControlType.Number,
        title: "Image Height",
        defaultValue: 200,
        min: 80,
        max: 500,
        step: 10,
    },
    cards: {
        type: ControlType.Array,
        title: "Solution Cards",
        maxCount: 6,
        control: {
            type: ControlType.Object,
            controls: {
                icon: {
                    type: ControlType.String,
                    title: "Icon/Emoji",
                    defaultValue: "🎬",
                },
                title: {
                    type: ControlType.String,
                    title: "Title",
                    defaultValue: "Solution Title",
                },
                description: {
                    type: ControlType.String,
                    title: "Description",
                    defaultValue: "Description of this solution.",
                    displayTextArea: true,
                },
                linkText: {
                    type: ControlType.String,
                    title: "Link Text",
                    defaultValue: "Explore",
                },
                linkUrl: {
                    type: ControlType.String,
                    title: "Link URL",
                    defaultValue: "#",
                },
                image: {
                    type: ControlType.Image,
                    title: "Card Image",
                },
            },
        },
        defaultValue: [
            {
                icon: "🎬",
                title: "Media & Entertainment",
                description:
                    "Reduce CDN and storage costs while maintaining pristine visual quality for streaming content.",
                linkText: "Explore",
                linkUrl: "#media",
                image: "",
            },
            {
                icon: "🚗",
                title: "Autonomous Vehicles",
                description:
                    "Compress video from vehicle cameras without losing critical visual details for AI training.",
                linkText: "Explore",
                linkUrl: "#automotive",
                image: "",
            },
            {
                icon: "🧠",
                title: "AI / Machine Learning",
                description:
                    "Optimize training data pipelines with smaller video files that preserve every detail AI needs.",
                linkText: "Explore",
                linkUrl: "#ai",
                image: "",
            },
        ],
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

export default Solutions
