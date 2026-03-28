// VISTA Product Page - Use Cases / Capabilities Section
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"
import React, { useEffect, useRef, useState } from "react"

interface CapabilityCard {
    icon: string
    title: string
    description: string
}

// SVG icon map keyed by identifier
const iconMap: Record<string, (color: string) => React.ReactNode> = {
    compression: (color) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2" />
            <polyline points="7 10 12 15 17 10" />
            <polyline points="7 14 12 9 17 14" />
        </svg>
    ),
    ai: (color) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
    ),
    pipeline: (color) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
    ),
}

// Default icon identifiers for the 3 default cards
const defaultIconKeys = ["compression", "ai", "pipeline"]

function renderCardIcon(icon: string, index: number, accentColor: string) {
    // Check if icon matches a known key
    const key = icon.toLowerCase()
    const renderer = iconMap[key]
    if (renderer) {
        return renderer(accentColor)
    }
    // For default cards using emoji, map by index
    if (index < defaultIconKeys.length) {
        const defaultKey = defaultIconKeys[index]
        const defaultRenderer = iconMap[defaultKey]
        if (defaultRenderer && (icon === "📦" || icon === "✨" || icon === "⚙️" || icon === "\uD83D\uDCE6" || icon === "\u2728" || icon === "\u2699\uFE0F")) {
            return defaultRenderer(accentColor)
        }
    }
    // Fallback: render as text (for custom user icons/emoji)
    return <span style={{ fontSize: 24, lineHeight: 1 }}>{icon}</span>
}

interface SubCard {
    title: string
    description: string
}

interface Props {
    sectionLabel: string
    sectionTitle: string
    subtitle: string
    cards: CapabilityCard[]
    subCards: SubCard[]
    accentColor: string
    bgColor: string
    textColor: string
    secondaryTextColor: string
    cardBgColor: string
    fontFamily: string
    headingFontFamily: string
    headingFontWeight: number
    paddingTop: number
    style?: React.CSSProperties
}

function ProductCapabilities(props: Props) {
    const {
        sectionLabel = "Use cases",
        sectionTitle = "Built for Production Video Teams",
        subtitle = "Whether you're validating compression, testing upscaling, or evaluating AI-generated content \u2014 VISTA gives you the human judgment layer that metrics can't.",
        cards = [
            {
                icon: "compression",
                title: "Compression Validation",
                description:
                    "Validate encoder updates and bitrate changes with real human perception. Ensure every compression decision maintains the quality your viewers expect.",
            },
            {
                icon: "ai",
                title: "AI & Enhancement Testing",
                description:
                    "Test upscaling algorithms, frame interpolation, and AI-generated enhancements against ground truth with statistically rigorous viewer studies.",
            },
            {
                icon: "pipeline",
                title: "Pipeline Change Validation",
                description:
                    "Catch regressions before they ship. Validate any change to your video pipeline \u2014 from color grading to HDR tone mapping \u2014 with crowd-sourced human judgment.",
            },
        ],
        subCards = [
            {
                title: "VistaOps",
                description:
                    "Our operations team manages the full test lifecycle \u2014 from study design to viewer recruitment to final delivery of results.",
            },
            {
                title: "Mobile Viewing",
                description:
                    "Purpose-built for small-screen evaluation. Viewers judge content on real mobile devices in real-world conditions.",
            },
            {
                title: "Your Viewers or Ours",
                description:
                    "Use our crowd-sourced viewer panel for unbiased results, or run tests with your own internal viewers for domain-specific evaluation.",
            },
        ],
        accentColor = "#4f3ef5",
        bgColor = "#fafaff",
        textColor = "#1a1a2e",
        secondaryTextColor = "#666",
        cardBgColor = "#fff",
        fontFamily = "'Inter', sans-serif",
        headingFontFamily = "'Poppins', sans-serif",
        headingFontWeight = 700,
        paddingTop = 100,
        style,
    } = props

    const sectionRef = useRef<HTMLDivElement>(null)
    const [isMobile, setIsMobile] = useState(false)
    const [isTablet, setIsTablet] = useState(false)
    const [hoveredCard, setHoveredCard] = useState<number | null>(null)

    // Responsive detection based on component's own width
    useEffect(() => {
        const el = sectionRef.current
        if (!el) return
        const ro = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const w = entry.contentRect.width
                setIsMobile(w < 480)
                setIsTablet(w >= 480 && w < 900)
            }
        })
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    const gridColumns = isMobile ? "1fr" : isTablet ? "1fr 1fr" : "1fr 1fr 1fr"
    const sectionPadding = isMobile
        ? `${paddingTop}px 16px 80px`
        : isTablet
          ? `${paddingTop}px 32px 80px`
          : `${paddingTop}px 48px 100px`

    return (
        <section
            ref={sectionRef}
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
                {/* Section Header */}
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: isMobile ? 40 : 56,
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
                            fontSize: isMobile ? 28 : isTablet ? 36 : 44,
                            fontWeight: headingFontWeight,
                            color: textColor,
                            margin: "16px 0 0",
                            lineHeight: 1.15,
                            fontFamily: headingFontFamily,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        {sectionTitle}
                    </h2>
                    <p
                        style={{
                            fontSize: isMobile ? 15 : 17,
                            color: secondaryTextColor,
                            margin: "16px auto 0",
                            maxWidth: 640,
                            lineHeight: 1.6,
                            fontFamily,
                        }}
                    >
                        {subtitle}
                    </p>
                </div>

                {/* Main Capability Cards Grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: gridColumns,
                        gap: isMobile ? 16 : 24,
                        marginBottom: isMobile ? 40 : 56,
                    }}
                >
                    {cards.map((card, i) => (
                        <div
                            key={i}
                            onMouseEnter={() => setHoveredCard(i)}
                            onMouseLeave={() => setHoveredCard(null)}
                            style={{
                                backgroundColor: cardBgColor,
                                borderRadius: 14,
                                border: "1px solid #eee",
                                padding: isMobile ? "28px 20px" : "36px 32px",
                                boxSizing: "border-box",
                                display: "flex",
                                flexDirection: "column",
                                gap: 16,
                                transition:
                                    "box-shadow 0.3s ease, transform 0.3s ease",
                                boxShadow:
                                    hoveredCard === i
                                        ? "0 8px 30px rgba(0,0,0,0.10)"
                                        : "0 1px 3px rgba(0,0,0,0.04)",
                                transform:
                                    hoveredCard === i
                                        ? "translateY(-3px)"
                                        : "translateY(0)",
                                cursor: "default",
                            }}
                        >
                            <div
                                style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 12,
                                    backgroundColor: `${accentColor}12`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}
                            >
                                {renderCardIcon(card.icon, i, accentColor)}
                            </div>
                            <h3
                                style={{
                                    fontSize: isMobile ? 18 : 20,
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
                                    fontSize: isMobile ? 14 : 15,
                                    color: secondaryTextColor,
                                    margin: 0,
                                    lineHeight: 1.65,
                                    fontFamily,
                                }}
                            >
                                {card.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Sub-Cards Section */}
                <div
                    style={{
                        borderTop: "1px solid #e0e0e0",
                        paddingTop: isMobile ? 40 : 56,
                    }}
                >
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: gridColumns,
                            gap: isMobile ? 24 : 32,
                        }}
                    >
                        {subCards.map((sub, i) => (
                            <div
                                key={i}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 8,
                                }}
                            >
                                <h4
                                    style={{
                                        fontSize: isMobile ? 16 : 18,
                                        fontWeight: 600,
                                        color: accentColor,
                                        margin: 0,
                                        fontFamily,
                                        lineHeight: 1.3,
                                    }}
                                >
                                    {sub.title}
                                </h4>
                                <p
                                    style={{
                                        fontSize: isMobile ? 14 : 15,
                                        color: secondaryTextColor,
                                        margin: 0,
                                        lineHeight: 1.65,
                                        fontFamily,
                                    }}
                                >
                                    {sub.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

addPropertyControls(ProductCapabilities, {
    sectionLabel: {
        type: ControlType.String,
        title: "Section Label",
        defaultValue: "Use cases",
    },
    sectionTitle: {
        type: ControlType.String,
        title: "Section Title",
        defaultValue: "Built for Production Video Teams",
    },
    subtitle: {
        type: ControlType.String,
        title: "Subtitle",
        defaultValue:
            "Whether you're validating compression, testing upscaling, or evaluating AI-generated content \u2014 VISTA gives you the human judgment layer that metrics can't.",
        displayTextArea: true,
    },
    cards: {
        type: ControlType.Array,
        title: "Capability Cards",
        maxCount: 6,
        control: {
            type: ControlType.Object,
            controls: {
                icon: {
                    type: ControlType.String,
                    title: "Icon",
                    defaultValue: "compression",
                },
                title: {
                    type: ControlType.String,
                    title: "Title",
                    defaultValue: "Capability Title",
                },
                description: {
                    type: ControlType.String,
                    title: "Description",
                    defaultValue: "Description of this capability.",
                    displayTextArea: true,
                },
            },
        },
        defaultValue: [
            {
                icon: "compression",
                title: "Compression Validation",
                description:
                    "Validate encoder updates and bitrate changes with real human perception. Ensure every compression decision maintains the quality your viewers expect.",
            },
            {
                icon: "ai",
                title: "AI & Enhancement Testing",
                description:
                    "Test upscaling algorithms, frame interpolation, and AI-generated enhancements against ground truth with statistically rigorous viewer studies.",
            },
            {
                icon: "pipeline",
                title: "Pipeline Change Validation",
                description:
                    "Catch regressions before they ship. Validate any change to your video pipeline \u2014 from color grading to HDR tone mapping \u2014 with crowd-sourced human judgment.",
            },
        ],
    },
    subCards: {
        type: ControlType.Array,
        title: "Sub Cards",
        maxCount: 6,
        control: {
            type: ControlType.Object,
            controls: {
                title: {
                    type: ControlType.String,
                    title: "Title",
                    defaultValue: "Feature Title",
                },
                description: {
                    type: ControlType.String,
                    title: "Description",
                    defaultValue: "Feature description.",
                    displayTextArea: true,
                },
            },
        },
        defaultValue: [
            {
                title: "VistaOps",
                description:
                    "Our operations team manages the full test lifecycle \u2014 from study design to viewer recruitment to final delivery of results.",
            },
            {
                title: "Mobile Viewing",
                description:
                    "Purpose-built for small-screen evaluation. Viewers judge content on real mobile devices in real-world conditions.",
            },
            {
                title: "Your Viewers or Ours",
                description:
                    "Use our crowd-sourced viewer panel for unbiased results, or run tests with your own internal viewers for domain-specific evaluation.",
            },
        ],
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "#4f3ef5",
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
        defaultValue: "#666",
    },
    cardBgColor: {
        type: ControlType.Color,
        title: "Card BG",
        defaultValue: "#fff",
    },
    fontFamily: {
        type: ControlType.String,
        title: "Font Family",
        defaultValue: "'Inter', sans-serif",
    },
    headingFontFamily: {
        type: ControlType.String,
        title: "Heading Font",
        defaultValue: "'Poppins', sans-serif",
    },
    headingFontWeight: {
        type: ControlType.Number,
        title: "Heading Weight",
        defaultValue: 700,
        min: 100,
        max: 900,
        step: 100,
    },
    paddingTop: {
        type: ControlType.Number,
        title: "Padding Top",
        defaultValue: 100,
        min: 0,
        max: 200,
        step: 10,
    },
})

export default ProductCapabilities
