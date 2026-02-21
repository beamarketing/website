// Beamr Homepage - Solutions Section
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"
import { useEffect } from "react"

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
    headingSize: number
    subheading: string
    subheadingSize: number
    cardTitleSize: number
    cardDescSize: number
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
        headingSize = 44,
        subheading = "Tailored video optimization across industries — from streaming to autonomous vehicles.",
        subheadingSize = 17,
        cardTitleSize = 20,
        cardDescSize = 15,
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

    // Inject hover CSS for cards
    useEffect(() => {
        const id = "__solutions-hover-css"
        if (document.getElementById(id)) return
        const s = document.createElement("style")
        s.id = id
        s.textContent = `
            .sol-card {
                transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
            }
            .sol-card:hover {
                transform: translateY(-4px) scale(1.015);
                border-color: rgba(255,255,255,0.14) !important;
                box-shadow: 0 12px 32px rgba(0,0,0,0.25);
            }
            .sol-card .sol-arrow {
                transition: transform 0.25s ease;
            }
            .sol-card:hover .sol-arrow {
                transform: translateX(2px);
            }
            .sol-card .sol-link {
                transition: border-color 0.25s ease, background 0.25s ease;
            }
            .sol-card:hover .sol-link {
                border-color: currentColor;
                background: rgba(255,255,255,0.06);
            }
        `
        document.head.appendChild(s)
    }, [])

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
                            fontSize: headingSize,
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
                            fontSize: subheadingSize,
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
                            className="sol-card"
                            style={{
                                backgroundColor: cardBgColor,
                                borderRadius: cardBorderRadius,
                                border: "1px solid rgba(255,255,255,0.06)",
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column",
                                cursor: "pointer",
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
                                        fontSize: cardTitleSize,
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
                                        fontSize: cardDescSize,
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
                                    className="sol-link"
                                    style={{
                                        fontSize: 14,
                                        fontWeight: 600,
                                        color: accentColor,
                                        textDecoration: "none",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 10,
                                        fontFamily,
                                        marginTop: 8,
                                        padding: "8px 6px 8px 16px",
                                        borderRadius: 100,
                                        border: `1px solid ${accentColor}30`,
                                        background: `${accentColor}08`,
                                        letterSpacing: "0.02em",
                                        width: "fit-content",
                                    }}
                                >
                                    {card.linkText}
                                    <span
                                        className="sol-arrow"
                                        style={{
                                            width: 28,
                                            height: 28,
                                            borderRadius: "50%",
                                            backgroundColor: accentColor,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                            <path d="M2.5 6H9.5M9.5 6L6.5 3M9.5 6L6.5 9" stroke={cardBgColor === "#0f1029" ? "#0f1029" : "#ffffff"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </span>
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
    headingSize: {
        type: ControlType.Number,
        title: "Heading Size",
        defaultValue: 44,
        min: 24,
        max: 72,
        step: 2,
    },
    subheading: {
        type: ControlType.String,
        title: "Subheading",
        defaultValue:
            "Tailored video optimization across industries — from streaming to autonomous vehicles.",
        displayTextArea: true,
    },
    subheadingSize: {
        type: ControlType.Number,
        title: "Subheading Size",
        defaultValue: 17,
        min: 12,
        max: 28,
        step: 1,
    },
    cardTitleSize: {
        type: ControlType.Number,
        title: "Card Title Size",
        defaultValue: 20,
        min: 14,
        max: 32,
        step: 1,
    },
    cardDescSize: {
        type: ControlType.Number,
        title: "Card Desc Size",
        defaultValue: 15,
        min: 12,
        max: 22,
        step: 1,
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
