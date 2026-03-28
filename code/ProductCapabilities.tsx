// VISTA Product Page - Use Cases / Capabilities Section
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"
import React, { useEffect, useRef, useState } from "react"

interface CapabilityCard {
    icon: string
    title: string
    description: string
}

// Inject card hover styles once
const hoverStyleId = "cap-hover"
function ensureHoverStyles() {
    if (typeof document === "undefined") return
    if (document.getElementById(hoverStyleId)) return
    const s = document.createElement("style")
    s.id = hoverStyleId
    s.textContent = `
        .cap-card {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .cap-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 20px rgba(79,62,245,0.10), 0 0 0 1px rgba(79,62,245,0.15) !important;
        }
    `
    document.head.appendChild(s)
}

// 4-pointed star path
function star4(cx: number, cy: number, outer: number, inner: number) {
    const p = []
    for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4 - Math.PI / 2
        const r = i % 2 === 0 ? outer : inner
        p.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`)
    }
    return `M${p.join("L")}Z`
}

const iconMap: Record<string, (color: string) => React.ReactNode> = {
    compression: (color) => (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="1" y1="12" x2="8" y2="12" />
            <polyline points="6 9.5 8 12 6 14.5" />
            <line x1="23" y1="12" x2="16" y2="12" />
            <polyline points="18 9.5 16 12 18 14.5" />
            <path d="M10 4C8 4 8 8 8 12C8 16 8 20 10 20" fill="none" />
            <path d="M14 4C16 4 16 8 16 12C16 16 16 20 14 20" fill="none" />
        </svg>
    ),
    ai: (color) => (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <path d={star4(11, 13, 9.5, 3.2)} fill={color} />
            <path d={star4(19, 5.5, 3.2, 1.1)} fill={color} opacity="0.65" />
            <path d={star4(4.5, 6, 2.4, 0.8)} fill={color} opacity="0.4" />
        </svg>
    ),
    pipeline: (color) => (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {/* Three horizontal lines with adjustment dots — representing pipeline tuning/validation */}
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
            <circle cx="9" cy="6" r="2.2" fill={color} stroke={color} />
            <circle cx="15" cy="12" r="2.2" fill={color} stroke={color} />
            <circle cx="11" cy="18" r="2.2" fill={color} stroke={color} />
        </svg>
    ),
}

const defaultIconKeys = ["compression", "ai", "pipeline"]

function renderCardIcon(icon: string, index: number, accentColor: string) {
    const key = icon.toLowerCase()
    const renderer = iconMap[key]
    if (renderer) return renderer(accentColor)
    // Fallback: any emoji or unknown string — map by card index if within range
    if (index < defaultIconKeys.length && icon !== key) {
        const fallback = iconMap[defaultIconKeys[index]]
        if (fallback) return fallback(accentColor)
    }
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
        bgColor = "#ffffff",
        textColor = "#1a1a2e",
        secondaryTextColor = "#555",
        cardBgColor = "#f8f7ff",
        fontFamily = "'Inter', sans-serif",
        headingFontFamily = "'Poppins', sans-serif",
        headingFontWeight = 700,
        paddingTop = 100,
        style,
    } = props

    const sectionRef = useRef<HTMLDivElement>(null)
    const [isMobile, setIsMobile] = useState(false)
    const [isTablet, setIsTablet] = useState(false)

    useEffect(() => { ensureHoverStyles() }, [])

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
        ? `${paddingTop}px 20px 64px`
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
            <div style={{ maxWidth: 1180, margin: "0 auto" }}>
                {/* Header — left-aligned for a less template look */}
                <div style={{ marginBottom: isMobile ? 36 : 52, maxWidth: 600 }}>
                    <span
                        style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: accentColor,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            fontFamily,
                            display: "block",
                            marginBottom: 14,
                        }}
                    >
                        {sectionLabel}
                    </span>
                    <h2
                        style={{
                            fontSize: isMobile ? 28 : isTablet ? 34 : 40,
                            fontWeight: headingFontWeight,
                            color: textColor,
                            margin: 0,
                            lineHeight: 1.2,
                            fontFamily: headingFontFamily,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        {sectionTitle}
                    </h2>
                    <p
                        style={{
                            fontSize: isMobile ? 15 : 16,
                            color: secondaryTextColor,
                            margin: "14px 0 0",
                            lineHeight: 1.6,
                            fontFamily,
                        }}
                    >
                        {subtitle}
                    </p>
                </div>

                {/* Capability Cards — accent top border, tinted bg */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: gridColumns,
                        gap: isMobile ? 16 : 20,
                        marginBottom: isMobile ? 40 : 56,
                    }}
                >
                    {cards.map((card, i) => (
                        <div
                            key={i}
                            className="cap-card"
                            style={{
                                backgroundColor: cardBgColor,
                                borderRadius: 12,
                                border: `1px solid ${accentColor}1A`,
                                borderTop: `3px solid ${accentColor}`,
                                padding: isMobile ? "24px 20px" : "28px 24px",
                                boxSizing: "border-box",
                                display: "flex",
                                flexDirection: "column",
                                gap: 12,
                                cursor: "default",
                            }}
                        >
                            <div style={{ marginBottom: 2 }}>
                                {renderCardIcon(card.icon, i, accentColor)}
                            </div>
                            <h3
                                style={{
                                    fontSize: isMobile ? 17 : 18,
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
                                    fontSize: 14,
                                    color: secondaryTextColor,
                                    margin: 0,
                                    lineHeight: 1.7,
                                    fontFamily,
                                }}
                            >
                                {card.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Sub-features — inline with accent dot */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: gridColumns,
                        gap: isMobile ? 20 : 40,
                    }}
                >
                    {subCards.map((sub, i) => (
                        <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span
                                    style={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: "50%",
                                        backgroundColor: accentColor,
                                        flexShrink: 0,
                                    }}
                                />
                                <h4
                                    style={{
                                        fontSize: isMobile ? 14 : 15,
                                        fontWeight: 600,
                                        color: textColor,
                                        margin: 0,
                                        fontFamily,
                                        lineHeight: 1.3,
                                    }}
                                >
                                    {sub.title}
                                </h4>
                            </div>
                            <p
                                style={{
                                    fontSize: 13,
                                    color: secondaryTextColor,
                                    margin: 0,
                                    lineHeight: 1.65,
                                    fontFamily,
                                    paddingLeft: 14,
                                }}
                            >
                                {sub.description}
                            </p>
                        </div>
                    ))}
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
        defaultValue: "#ffffff",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#1a1a2e",
    },
    secondaryTextColor: {
        type: ControlType.Color,
        title: "Secondary Text",
        defaultValue: "#555",
    },
    cardBgColor: {
        type: ControlType.Color,
        title: "Card BG",
        defaultValue: "#f8f7ff",
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
