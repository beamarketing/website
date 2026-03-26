// Product Page - Explore More Products Section
// Grid of product cards with badge tags and hover effects
// Framer Code Component with full property controls

import React, { useRef, useState, useEffect } from "react"
import { addPropertyControls, ControlType } from "framer"

interface CardItem {
    badgeText: string
    badgeColor: string
    badgeBgColor: string
    imageBgColor: string
    title: string
    description: string
    url: string
}

interface Props {
    sectionTitle: string
    cards: CardItem[]
    bgColor: string
    textColor: string
    secondaryTextColor: string
    fontFamily: string
    paddingTop: number
    style?: React.CSSProperties
}

function ProductExplore(props: Props) {
    const {
        sectionTitle = "Explore More Products",
        cards = [
            {
                badgeText: "Video Technology",
                badgeColor: "#4f3ef5",
                badgeBgColor: "#e8e4ff",
                imageBgColor: "#f0edff",
                title: "Beamr Video",
                description:
                    "Content-adaptive bitrate technology with best-in-class HEVC encoding for premium streaming.",
                url: "#",
            },
            {
                badgeText: "Autonomous Vehicles",
                badgeColor: "#16a34a",
                badgeBgColor: "#dcfce7",
                imageBgColor: "#dcfce7",
                title: "AV Suite",
                description:
                    "High-fidelity video compression for ML training data from autonomous vehicle cameras.",
                url: "#",
            },
            {
                badgeText: "Image Compression",
                badgeColor: "#d97706",
                badgeBgColor: "#fef3c7",
                imageBgColor: "#fef3c7",
                title: "JPEGmini",
                description:
                    "Reduce JPEG file sizes by up to 80% with no visible quality loss.",
                url: "#",
            },
        ],
        bgColor = "#fafaff",
        textColor = "#1a1a2e",
        secondaryTextColor = "#666666",
        fontFamily = "'Inter', sans-serif",
        paddingTop = 100,
        style,
    } = props

    // Responsive detection via ResizeObserver
    const containerRef = useRef<HTMLDivElement>(null)
    const [isMobile, setIsMobile] = useState(false)
    const [isTablet, setIsTablet] = useState(false)

    useEffect(() => {
        const el = containerRef.current
        if (!el) return
        const ro = new ResizeObserver((entries) => {
            const w = entries[0]?.contentRect.width ?? 0
            setIsMobile(w < 480)
            setIsTablet(w >= 480 && w < 900)
        })
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    // Hover state per card
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    const columns = isMobile ? 1 : isTablet ? 2 : 3
    const sectionPadding = isMobile
        ? `${paddingTop}px 20px 80px`
        : isTablet
          ? `${paddingTop}px 32px 80px`
          : `${paddingTop}px 48px 100px`

    return (
        <section
            ref={containerRef}
            style={{
                ...style,
                width: "100%",
                backgroundColor: bgColor,
                padding: sectionPadding,
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
                {/* Section Title */}
                <h2
                    style={{
                        fontSize: isMobile ? 28 : isTablet ? 32 : 38,
                        fontWeight: 700,
                        color: textColor,
                        margin: "0 0 48px",
                        lineHeight: 1.2,
                        textAlign: "center",
                        fontFamily,
                        letterSpacing: "-0.02em",
                    }}
                >
                    {sectionTitle}
                </h2>

                {/* Cards Grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${columns}, 1fr)`,
                        gap: 24,
                    }}
                >
                    {cards.map((card, i) => {
                        const isHovered = hoveredIndex === i
                        return (
                            <a
                                key={i}
                                href={card.url}
                                onMouseEnter={() => setHoveredIndex(i)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                style={{
                                    textDecoration: "none",
                                    color: "inherit",
                                    display: "flex",
                                    flexDirection: "column",
                                    backgroundColor: "#ffffff",
                                    border: "1px solid #eeeeee",
                                    borderRadius: 14,
                                    overflow: "hidden",
                                    transition:
                                        "box-shadow 0.3s ease, transform 0.3s ease",
                                    boxShadow: isHovered
                                        ? "0 8px 32px rgba(0, 0, 0, 0.1)"
                                        : "0 1px 4px rgba(0, 0, 0, 0.04)",
                                    transform: isHovered
                                        ? "translateY(-4px)"
                                        : "translateY(0)",
                                    cursor: "pointer",
                                }}
                            >
                                {/* Image Area */}
                                <div
                                    style={{
                                        width: "100%",
                                        padding: "32px 24px 24px",
                                        boxSizing: "border-box",
                                        backgroundColor: card.imageBgColor,
                                        display: "flex",
                                        alignItems: "flex-start",
                                        justifyContent: "flex-start",
                                        minHeight: 160,
                                        position: "relative",
                                    }}
                                >
                                    {/* Badge */}
                                    <span
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            padding: "6px 14px",
                                            borderRadius: 100,
                                            backgroundColor: card.badgeBgColor,
                                            color: card.badgeColor,
                                            fontSize: 13,
                                            fontWeight: 600,
                                            fontFamily,
                                            letterSpacing: "0.01em",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {card.badgeText}
                                    </span>
                                </div>

                                {/* Card Body */}
                                <div
                                    style={{
                                        padding: "24px 24px 28px",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 10,
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
                                            lineHeight: 1.3,
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
                                        }}
                                    >
                                        {card.description}
                                    </p>
                                </div>
                            </a>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

addPropertyControls(ProductExplore, {
    sectionTitle: {
        type: ControlType.String,
        title: "Section Title",
        defaultValue: "Explore More Products",
    },
    cards: {
        type: ControlType.Array,
        title: "Product Cards",
        maxCount: 6,
        control: {
            type: ControlType.Object,
            controls: {
                badgeText: {
                    type: ControlType.String,
                    title: "Badge Text",
                    defaultValue: "Category",
                },
                badgeColor: {
                    type: ControlType.Color,
                    title: "Badge Color",
                    defaultValue: "#4f3ef5",
                },
                badgeBgColor: {
                    type: ControlType.Color,
                    title: "Badge BG",
                    defaultValue: "#e8e4ff",
                },
                imageBgColor: {
                    type: ControlType.Color,
                    title: "Image Area BG",
                    defaultValue: "#f0edff",
                },
                title: {
                    type: ControlType.String,
                    title: "Title",
                    defaultValue: "Product Name",
                },
                description: {
                    type: ControlType.String,
                    title: "Description",
                    defaultValue: "Product description goes here.",
                    displayTextArea: true,
                },
                url: {
                    type: ControlType.String,
                    title: "URL",
                    defaultValue: "#",
                },
            },
        },
        defaultValue: [
            {
                badgeText: "Video Technology",
                badgeColor: "#4f3ef5",
                badgeBgColor: "#e8e4ff",
                imageBgColor: "#f0edff",
                title: "Beamr Video",
                description:
                    "Content-adaptive bitrate technology with best-in-class HEVC encoding for premium streaming.",
                url: "#",
            },
            {
                badgeText: "Autonomous Vehicles",
                badgeColor: "#16a34a",
                badgeBgColor: "#dcfce7",
                imageBgColor: "#dcfce7",
                title: "AV Suite",
                description:
                    "High-fidelity video compression for ML training data from autonomous vehicle cameras.",
                url: "#",
            },
            {
                badgeText: "Image Compression",
                badgeColor: "#d97706",
                badgeBgColor: "#fef3c7",
                imageBgColor: "#fef3c7",
                title: "JPEGmini",
                description:
                    "Reduce JPEG file sizes by up to 80% with no visible quality loss.",
                url: "#",
            },
        ],
    },
    paddingTop: {
        type: ControlType.Number,
        title: "Padding Top",
        defaultValue: 100,
        min: 0,
        max: 300,
        step: 4,
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#fafaff",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#1a1a2e",
    },
    secondaryTextColor: {
        type: ControlType.Color,
        title: "Secondary Text",
        defaultValue: "#666666",
    },
    fontFamily: {
        type: ControlType.String,
        title: "Font Family",
        defaultValue: "'Inter', sans-serif",
    },
})

export default ProductExplore
