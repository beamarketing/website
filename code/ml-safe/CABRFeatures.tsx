// CABR Features Section
// Feature cards with icons, sub-cards, and HTML-compatible descriptions
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"
import React, { useEffect, useRef, useState } from "react"

interface CapabilityCard {
    icon: string
    title: string
    description: string
    link: string
}

const hoverStyleId = "cabr-feat-hover"
function ensureHoverStyles() {
    if (typeof document === "undefined") return
    if (document.getElementById(hoverStyleId)) return
    const s = document.createElement("style")
    s.id = hoverStyleId
    s.textContent = `
        .cabr-feat-card {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .cabr-feat-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 20px rgba(55,81,255,0.10), 0 0 0 1px rgba(55,81,255,0.15) !important;
        }
    `
    document.head.appendChild(s)
}

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
        <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="4" y1="5" x2="20" y2="5" strokeWidth="2" />
            <path d="M8 2.5L12 5L16 2.5" />
            <line x1="4" y1="19" x2="20" y2="19" strokeWidth="2" />
            <path d="M8 21.5L12 19L16 21.5" />
            <rect x="5" y="8" width="9" height="8" rx="1" />
            <polyline points="5 11 8 11 8 8" />
            <line x1="18" y1="8" x2="18" y2="11" />
            <polyline points="16.5 9.5 18 8 19.5 9.5" />
            <line x1="18" y1="16" x2="18" y2="13" />
            <polyline points="16.5 14.5 18 16 19.5 14.5" />
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
        <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
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
    const renderer = iconMap[icon.toLowerCase()]
    if (renderer) return renderer(accentColor)
    if (index < defaultIconKeys.length) {
        return iconMap[defaultIconKeys[index]](accentColor)
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

function CABRFeatures(props: Props) {
    const {
        sectionLabel = "Features",
        sectionTitle = "Built for ML-Safe Video Compression",
        subtitle = "CABR delivers content-adaptive bitrate optimization that preserves the quality metrics ML models depend on — while cutting storage costs by up to 50%.",
        ctaText = "Learn more →",
        ctaUrl = "#",
        cards = [
            {
                icon: "compression",
                title: "Content-Adaptive Encoding",
                description:
                    "CABR analyzes each frame to find the optimal balance between quality and file size, delivering up to <b>50% bitrate reduction</b> without compromising ML model accuracy.",
                link: "#",
            },
            {
                icon: "ai",
                title: "ML-Safe Quality Preservation",
                description:
                    "Unlike traditional codecs that optimize for human perception, CABR preserves <b>temporal consistency</b> and <b>spatial detail</b> that AI systems depend on for accurate inference.",
                link: "#",
            },
            {
                icon: "pipeline",
                title: "Pipeline Integration",
                description:
                    "Deploy via <a href='#' target='_blank'>Docker, API, FFmpeg, or managed cloud</a>. Works on already-encoded H.264, HEVC, and AV1 — no re-ingest required.",
                link: "#",
            },
        ],
        subCards = [
            {
                title: "GPU Accelerated",
                description:
                    "Runs on NVIDIA GPUs already in your stack for high-throughput processing at scale.",
            },
            {
                title: "Codec Flexible",
                description:
                    "Standard output in H.264, HEVC, and AV1. Compatible with existing downstream workflows.",
            },
            {
                title: "Validated Results",
                description:
                    "Benchmarked on PandaSet with < 2% mAP difference. Quality confirmed via PSNR and perceptual metrics.",
            },
        ],
        accentColor = "#3751FF",
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

    useEffect(() => {
        ensureHoverStyles()
    }, [])

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

    const gridColumns = isMobile ? "1fr" : isTablet ? "1fr 1fr" : "1fr 1fr 1fr 1fr"
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
                {/* Header */}
                <div
                    style={{ marginBottom: isMobile ? 36 : 52, maxWidth: 600 }}
                >
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
                        dangerouslySetInnerHTML={{ __html: subtitle }}
                    />
                    {ctaText && ctaUrl && (
                        <a
                            href={ctaUrl}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                marginTop: 20,
                                fontSize: 14,
                                fontWeight: 600,
                                color: accentColor,
                                textDecoration: "none",
                                fontFamily,
                                transition: "opacity 0.2s ease",
                            }}
                            onMouseEnter={(e: any) => e.currentTarget.style.opacity = "0.7"}
                            onMouseLeave={(e: any) => e.currentTarget.style.opacity = "1"}
                        >
                            {ctaText}
                        </a>
                    )}
                </div>

                {/* Feature Cards */}
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
                            className="cabr-feat-card"
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
                                dangerouslySetInnerHTML={{ __html: card.description }}
                            />
                            {card.link && (
                                <a
                                    href={card.link}
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 4,
                                        marginTop: 4,
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: accentColor,
                                        textDecoration: "none",
                                        fontFamily,
                                        transition: "opacity 0.2s ease",
                                    }}
                                    onMouseEnter={(e: any) => e.currentTarget.style.opacity = "0.7"}
                                    onMouseLeave={(e: any) => e.currentTarget.style.opacity = "1"}
                                >
                                    Learn more →
                                </a>
                            )}
                        </div>
                    ))}
                </div>

                {/* Sub-features */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: gridColumns,
                        gap: isMobile ? 20 : 40,
                    }}
                >
                    {subCards.map((sub, i) => (
                        <div
                            key={i}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 6,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                }}
                            >
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
                                dangerouslySetInnerHTML={{ __html: sub.description }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Scoped link styles for HTML descriptions */}
            <style>{`
                .cabr-feat-card p a,
                section p a {
                    color: ${accentColor};
                    text-decoration: underline;
                    text-underline-offset: 2px;
                }
                .cabr-feat-card p a:hover,
                section p a:hover {
                    opacity: 0.75;
                }
            `}</style>
        </section>
    )
}

addPropertyControls(CABRFeatures, {
    sectionLabel: {
        type: ControlType.String,
        title: "Section Label",
        defaultValue: "Features",
    },
    sectionTitle: {
        type: ControlType.String,
        title: "Section Title",
        defaultValue: "Built for ML-Safe Video Compression",
    },
    subtitle: {
        type: ControlType.String,
        title: "Subtitle (HTML)",
        defaultValue:
            "CABR delivers content-adaptive bitrate optimization that preserves the quality metrics ML models depend on — while cutting storage costs by up to 50%.",
        displayTextArea: true,
    },
    ctaText: {
        type: ControlType.String,
        title: "Section CTA Text",
        defaultValue: "Learn more →",
    },
    ctaUrl: {
        type: ControlType.String,
        title: "Section CTA URL",
        defaultValue: "#",
    },
    cards: {
        type: ControlType.Array,
        title: "Feature Cards",
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
                    defaultValue: "Feature Title",
                },
                description: {
                    type: ControlType.String,
                    title: "Description (HTML)",
                    defaultValue: "Feature description. Supports <a>, <br>, <b>, etc.",
                    displayTextArea: true,
                },
                link: {
                    type: ControlType.String,
                    title: "Learn More URL",
                    defaultValue: "#",
                },
            },
        },
        defaultValue: [
            {
                icon: "compression",
                title: "Content-Adaptive Encoding",
                description:
                    "CABR analyzes each frame to find the optimal balance between quality and file size, delivering up to <b>50% bitrate reduction</b> without compromising ML model accuracy.",
                link: "#",
            },
            {
                icon: "ai",
                title: "ML-Safe Quality Preservation",
                description:
                    "Unlike traditional codecs that optimize for human perception, CABR preserves <b>temporal consistency</b> and <b>spatial detail</b> that AI systems depend on for accurate inference.",
                link: "#",
            },
            {
                icon: "pipeline",
                title: "Pipeline Integration",
                description:
                    "Deploy via <a href='#' target='_blank'>Docker, API, FFmpeg, or managed cloud</a>. Works on already-encoded H.264, HEVC, and AV1 — no re-ingest required.",
                link: "#",
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
                    title: "Description (HTML)",
                    defaultValue: "Feature description. Supports <a>, <br>, <b>, etc.",
                    displayTextArea: true,
                },
            },
        },
        defaultValue: [
            {
                title: "GPU Accelerated",
                description:
                    "Runs on NVIDIA GPUs already in your stack for high-throughput processing at scale.",
            },
            {
                title: "Codec Flexible",
                description:
                    "Standard output in H.264, HEVC, and AV1. Compatible with existing downstream workflows.",
            },
            {
                title: "Validated Results",
                description:
                    "Benchmarked on PandaSet with &lt; 2% mAP difference. Quality confirmed via PSNR and perceptual metrics.",
            },
        ],
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "#3751FF",
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

export default CABRFeatures
