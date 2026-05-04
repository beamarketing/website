// Beamr Homepage - Thank You "More From Beamr" Resources Section
// Framer Code Component with full property controls
//
// Mirrors the "More From CES" video grid on ces.tech/thank-you/.
// Uses the same card visual language as NewsSection but with
// optional duration / play overlays for video resources.

import { addPropertyControls, ControlType } from "framer"

interface ResourceCard {
    image: string
    category: string
    duration: string
    title: string
    description: string
    url: string
    isVideo: boolean
}

interface Props {
    sectionLabel: string
    heading: string
    subheading: string
    resources: ResourceCard[]
    columns: number
    bgColor: string
    cardBgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    fontFamily: string
    cardBorderRadius: number
    style?: React.CSSProperties
}

function ThankYouResources(props: Props) {
    const {
        sectionLabel = "MORE FROM BEAMR",
        heading = "While you're here",
        subheading = "A few resources our team picked out for you.",
        resources = [
            {
                image: "",
                category: "Webinar",
                duration: "29:02",
                title: "The Science of Content-Adaptive Encoding",
                description:
                    "How CABR analyzes every frame to cut bitrate without touching perceived quality.",
                url: "#",
                isVideo: true,
            },
            {
                image: "",
                category: "Talk",
                duration: "41:42",
                title: "AI Pipelines That Don't Choke on Video",
                description:
                    "Smarter compression for vision AI training data — guaranteed quality, half the storage.",
                url: "#",
                isVideo: true,
            },
            {
                image: "",
                category: "Case Study",
                duration: "8 min read",
                title: "How a Top Streamer Cut CDN Spend by 42%",
                description:
                    "A look behind the scenes at one of the largest deployments of Beamr CABR to date.",
                url: "#",
                isVideo: false,
            },
        ],
        columns = 3,
        bgColor = "#0a0b1e",
        cardBgColor = "#0f1029",
        textColor = "#ffffff",
        secondaryTextColor = "#8b8ba3",
        accentColor = "#00d46a",
        fontFamily = "'Inter', sans-serif",
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
                {/* Header */}
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: 56,
                    }}
                >
                    <div
                        style={{
                            fontSize: 13,
                            fontWeight: 600,
                            letterSpacing: "0.16em",
                            color: accentColor,
                            marginBottom: 16,
                            fontFamily,
                        }}
                    >
                        {sectionLabel}
                    </div>
                    <h2
                        style={{
                            fontSize: 40,
                            fontWeight: 700,
                            color: textColor,
                            margin: 0,
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
                            margin: "16px auto 0",
                            maxWidth: 580,
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
                        gridTemplateColumns: `repeat(${columns}, 1fr)`,
                        gap: 24,
                    }}
                >
                    {resources.map((card, i) => (
                        <a
                            key={i}
                            href={card.url}
                            style={{
                                backgroundColor: cardBgColor,
                                borderRadius: cardBorderRadius,
                                border: "1px solid rgba(255,255,255,0.06)",
                                overflow: "hidden",
                                textDecoration: "none",
                                display: "flex",
                                flexDirection: "column",
                                fontFamily,
                            }}
                        >
                            {/* Thumbnail */}
                            <div
                                style={{
                                    position: "relative",
                                    width: "100%",
                                    aspectRatio: "16/9",
                                    background: card.image
                                        ? `url(${card.image}) center/cover no-repeat`
                                        : `linear-gradient(135deg, #1a1b45 0%, #0f1029 100%)`,
                                }}
                            >
                                {/* Play button overlay for videos */}
                                {card.isVideo && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: "50%",
                                            left: "50%",
                                            transform: "translate(-50%, -50%)",
                                            width: 56,
                                            height: 56,
                                            borderRadius: "50%",
                                            backgroundColor: accentColor,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: 20,
                                                color: "#07071c",
                                                marginLeft: 3,
                                            }}
                                        >
                                            &#9654;
                                        </span>
                                    </div>
                                )}
                                {/* Duration badge */}
                                {card.duration && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            bottom: 12,
                                            right: 12,
                                            padding: "4px 10px",
                                            borderRadius: 6,
                                            backgroundColor: "rgba(0,0,0,0.7)",
                                            color: textColor,
                                            fontSize: 12,
                                            fontWeight: 500,
                                            fontFamily,
                                        }}
                                    >
                                        {card.duration}
                                    </div>
                                )}
                            </div>

                            {/* Body */}
                            <div
                                style={{
                                    padding: 24,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 12,
                                    flex: 1,
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: 12,
                                        fontWeight: 600,
                                        letterSpacing: "0.12em",
                                        color: accentColor,
                                        textTransform: "uppercase",
                                        fontFamily,
                                    }}
                                >
                                    {card.category}
                                </div>
                                <h3
                                    style={{
                                        fontSize: 18,
                                        fontWeight: 600,
                                        color: textColor,
                                        margin: 0,
                                        lineHeight: 1.35,
                                        fontFamily,
                                    }}
                                >
                                    {card.title}
                                </h3>
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
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}

addPropertyControls(ThankYouResources, {
    sectionLabel: {
        type: ControlType.String,
        title: "Section Label",
        defaultValue: "MORE FROM BEAMR",
    },
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "While you're here",
    },
    subheading: {
        type: ControlType.String,
        title: "Subheading",
        defaultValue: "A few resources our team picked out for you.",
        displayTextArea: true,
    },
    columns: {
        type: ControlType.Number,
        title: "Columns",
        defaultValue: 3,
        min: 1,
        max: 4,
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
    resources: {
        type: ControlType.Array,
        title: "Resources",
        control: {
            type: ControlType.Object,
            controls: {
                image: { type: ControlType.Image, title: "Image" },
                category: {
                    type: ControlType.String,
                    title: "Category",
                    defaultValue: "Webinar",
                },
                duration: {
                    type: ControlType.String,
                    title: "Duration",
                    defaultValue: "29:02",
                },
                title: {
                    type: ControlType.String,
                    title: "Title",
                    defaultValue: "Resource Title",
                },
                description: {
                    type: ControlType.String,
                    title: "Description",
                    defaultValue: "Short description.",
                    displayTextArea: true,
                },
                url: {
                    type: ControlType.String,
                    title: "URL",
                    defaultValue: "#",
                },
                isVideo: {
                    type: ControlType.Boolean,
                    title: "Is Video",
                    defaultValue: true,
                },
            },
        },
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

export default ThankYouResources
