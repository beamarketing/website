// Industry Page - Use Cases Carousel
// Horizontal scrollable carousel with arrow navigation
// Framer Code Component with full property controls

import { useRef } from "react"
import { addPropertyControls, ControlType } from "framer"

interface UseCaseCard {
    image: string
    tags: string
    title: string
    linkUrl: string
}

interface Props {
    sectionLabel: string
    heading: string
    cardWidth: number
    cards: UseCaseCard[]
    bgColor: string
    cardBgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    fontFamily: string
    style?: React.CSSProperties
}

function IndustryUseCases(props: Props) {
    const {
        sectionLabel = "USE CASES",
        heading = "How Companies Use Beamr",
        cardWidth = 300,
        cards = [
            {
                image: "",
                tags: "CDN, Cost Savings",
                title: "Cut CDN Costs by 30-50%",
                linkUrl: "#",
            },
            {
                image: "",
                tags: "Storage, Optimization",
                title: "Reduce Storage Requirements by 50%",
                linkUrl: "#",
            },
            {
                image: "",
                tags: "Quality, Enhancement",
                title: "Improve Visual Quality at Same Bitrate",
                linkUrl: "#",
            },
            {
                image: "",
                tags: "4K, Upscaling",
                title: "Enable 4K Streaming at HD Bitrates",
                linkUrl: "#",
            },
            {
                image: "",
                tags: "Encoding, Efficiency",
                title: "Accelerate Encoding Workflows by 3x",
                linkUrl: "#",
            },
        ],
        bgColor = "#07071c",
        cardBgColor = "#0f1029",
        textColor = "#ffffff",
        secondaryTextColor = "#8b8ba3",
        accentColor = "#00d46a",
        fontFamily = "'Inter', sans-serif",
        style,
    } = props

    const scrollRef = useRef<HTMLDivElement>(null)

    const scroll = (direction: "left" | "right") => {
        if (!scrollRef.current) return
        const amount = cardWidth + 20
        scrollRef.current.scrollBy({
            left: direction === "left" ? -amount : amount,
            behavior: "smooth",
        })
    }

    return (
        <section
            style={{
                ...style,
                width: "100%",
                backgroundColor: bgColor,
                padding: "100px 0 100px 48px",
                boxSizing: "border-box",
                fontFamily,
            }}
        >
            {/* Scrollbar-hiding styles */}
            <style>{`
                .ind-carousel-track::-webkit-scrollbar { display: none; }
                .ind-carousel-track { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
                {/* Header row */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                        marginBottom: 40,
                        paddingRight: 48,
                    }}
                >
                    <div>
                        <span
                            style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: accentColor,
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                display: "block",
                                marginBottom: 16,
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
                                margin: 0,
                                lineHeight: 1.15,
                                letterSpacing: "-0.02em",
                                fontFamily,
                            }}
                        >
                            {heading}
                        </h2>
                    </div>

                    {/* Arrow navigation */}
                    <div style={{ display: "flex", gap: 8 }}>
                        <button
                            onClick={() => scroll("left")}
                            style={{
                                width: 44,
                                height: 44,
                                borderRadius: 10,
                                border: "1px solid rgba(255,255,255,0.12)",
                                backgroundColor: "rgba(255,255,255,0.04)",
                                color: textColor,
                                fontSize: 18,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "background-color 0.2s",
                            }}
                        >
                            &#8592;
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            style={{
                                width: 44,
                                height: 44,
                                borderRadius: 10,
                                border: "1px solid rgba(255,255,255,0.12)",
                                backgroundColor: "rgba(255,255,255,0.04)",
                                color: textColor,
                                fontSize: 18,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "background-color 0.2s",
                            }}
                        >
                            &#8594;
                        </button>
                    </div>
                </div>

                {/* Carousel track */}
                <div
                    ref={scrollRef}
                    className="ind-carousel-track"
                    style={{
                        display: "flex",
                        gap: 20,
                        overflowX: "auto",
                        paddingRight: 48,
                        paddingBottom: 8,
                    }}
                >
                    {cards.map((card, i) => {
                        const tagList = card.tags
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean)

                        return (
                            <a
                                key={i}
                                href={card.linkUrl}
                                style={{
                                    flex: `0 0 ${cardWidth}px`,
                                    textDecoration: "none",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 16,
                                }}
                            >
                                {/* Tall image */}
                                <div
                                    style={{
                                        width: "100%",
                                        aspectRatio: "3/4",
                                        borderRadius: 16,
                                        overflow: "hidden",
                                        background: card.image
                                            ? `url(${card.image}) center/cover no-repeat`
                                            : "linear-gradient(160deg, #0f1029 0%, #1a1b4a 50%, #0f1029 100%)",
                                        border: "1px solid rgba(255,255,255,0.06)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    {!card.image && (
                                        <span
                                            style={{
                                                fontSize: 13,
                                                color: "rgba(255,255,255,0.15)",
                                                fontFamily,
                                                fontWeight: 500,
                                            }}
                                        >
                                            Visual / Demo
                                        </span>
                                    )}
                                </div>

                                {/* Tags */}
                                <div
                                    style={{
                                        display: "flex",
                                        gap: 8,
                                        flexWrap: "wrap",
                                    }}
                                >
                                    {tagList.map((tag, j) => (
                                        <span
                                            key={j}
                                            style={{
                                                fontSize: 12,
                                                fontWeight: 600,
                                                color: accentColor,
                                                backgroundColor: `${accentColor}10`,
                                                padding: "4px 12px",
                                                borderRadius: 100,
                                                fontFamily,
                                                letterSpacing: "0.02em",
                                            }}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Title */}
                                <h3
                                    style={{
                                        fontSize: 18,
                                        fontWeight: 600,
                                        color: textColor,
                                        margin: 0,
                                        lineHeight: 1.3,
                                        fontFamily,
                                    }}
                                >
                                    {card.title}
                                </h3>
                            </a>
                        )
                    })}
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
        defaultValue: "How Companies Use Beamr",
    },
    cardWidth: {
        type: ControlType.Number,
        title: "Card Width",
        defaultValue: 300,
        min: 200,
        max: 500,
        step: 10,
    },
    cards: {
        type: ControlType.Array,
        title: "Cards",
        maxCount: 10,
        control: {
            type: ControlType.Object,
            controls: {
                image: {
                    type: ControlType.Image,
                    title: "Image",
                },
                tags: {
                    type: ControlType.String,
                    title: "Tags (comma-sep)",
                    defaultValue: "Tag1, Tag2",
                },
                title: {
                    type: ControlType.String,
                    title: "Title",
                    defaultValue: "Use Case Title",
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
                image: "",
                tags: "CDN, Cost Savings",
                title: "Cut CDN Costs by 30-50%",
                linkUrl: "#",
            },
            {
                image: "",
                tags: "Storage, Optimization",
                title: "Reduce Storage Requirements by 50%",
                linkUrl: "#",
            },
            {
                image: "",
                tags: "Quality, Enhancement",
                title: "Improve Visual Quality at Same Bitrate",
                linkUrl: "#",
            },
            {
                image: "",
                tags: "4K, Upscaling",
                title: "Enable 4K Streaming at HD Bitrates",
                linkUrl: "#",
            },
            {
                image: "",
                tags: "Encoding, Efficiency",
                title: "Accelerate Encoding Workflows by 3x",
                linkUrl: "#",
            },
        ],
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

export default IndustryUseCases
