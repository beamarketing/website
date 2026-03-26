// Product Page - Why Beamr Authority/Trust Section
// Dark section with quote card and proof cards grid
// Framer Code Component with full property controls

import React, { useRef, useState, useEffect } from "react"
import { addPropertyControls, ControlType } from "framer"

interface ProofCard {
    icon: string
    title: string
    description: string
}

interface Props {
    sectionLabel: string
    sectionTitle: string
    bodyText: string
    quote: string
    quoteAttribution: string
    proofCards: ProofCard[]
    accentColor: string
    bgColor: string
    textColor: string
    secondaryTextColor: string
    quoteBgColor: string
    cardBgColor: string
    fontFamily: string
    paddingTop: number
    style?: React.CSSProperties
}

function ProductAuthority(props: Props) {
    const {
        sectionLabel = "Why Beamr",
        sectionTitle = "A Decade of Perceptual Science, Productized",
        bodyText = "VISTA isn't a startup experiment. It's the same subjective testing methodology Beamr has used internally for over 10 years — the foundation behind an Emmy Award, 53 patents, and quality-critical deployments at the world's most demanding video platforms.\n\nNow it's yours.",
        quote = "Viewers don't watch metrics, they watch video. VISTA makes human judgment scalable — giving teams a clear answer on whether their video is good enough before they ship.",
        quoteAttribution = "— Sharon Carmel, Founder & CEO, Beamr",
        proofCards = [
            {
                icon: "🏆",
                title: "Emmy Award-Winning Science",
                description:
                    "Beamr's perceptual quality discipline earned a Technology & Engineering Emmy Award — the gold standard of recognition in the video industry.",
            },
            {
                icon: "🛡️",
                title: "Trusted by the Best",
                description:
                    "Netflix, Paramount, NVIDIA, and other leading platforms rely on Beamr technology for quality-critical video workflows at massive scale.",
            },
            {
                icon: "📈",
                title: "Scales With Your Needs",
                description:
                    "From quick A/B comparisons to complex multi-variant studies with thousands of viewers, VISTA grows with your testing complexity.",
            },
        ],
        accentColor = "#8b7cf5",
        bgColor = "#1a1a2e",
        textColor = "#ffffff",
        secondaryTextColor = "#aaaaaa",
        quoteBgColor = "rgba(79,62,245,0.1)",
        cardBgColor = "rgba(255,255,255,0.04)",
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

    const bodyParagraphs = bodyText.split("\n\n").filter(Boolean)

    return (
        <section
            ref={containerRef}
            style={{
                ...style,
                width: "100%",
                backgroundColor: bgColor,
                padding: isMobile
                    ? `${paddingTop}px 20px 80px`
                    : isTablet
                      ? `${paddingTop}px 32px 80px`
                      : `${paddingTop}px 48px 100px`,
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
                {/* Section Label */}
                <span
                    style={{
                        display: "block",
                        fontSize: 13,
                        fontWeight: 600,
                        color: accentColor,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        marginBottom: 16,
                        fontFamily,
                    }}
                >
                    {sectionLabel}
                </span>

                {/* Section Title */}
                <h2
                    style={{
                        fontSize: isMobile ? 28 : isTablet ? 34 : 44,
                        fontWeight: 700,
                        color: textColor,
                        margin: "0 0 48px",
                        lineHeight: 1.15,
                        letterSpacing: "-0.02em",
                        fontFamily,
                        maxWidth: 700,
                    }}
                >
                    {sectionTitle}
                </h2>

                {/* 2-column: Body Text + Quote Card */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            isMobile || isTablet ? "1fr" : "1fr 1fr",
                        gap: isMobile ? 32 : 40,
                        marginBottom: isMobile ? 48 : 64,
                    }}
                >
                    {/* Left: Body Text */}
                    <div>
                        {bodyParagraphs.map((paragraph, i) => (
                            <p
                                key={i}
                                style={{
                                    fontSize: isMobile ? 15 : 17,
                                    color: secondaryTextColor,
                                    lineHeight: 1.7,
                                    margin:
                                        i < bodyParagraphs.length - 1
                                            ? "0 0 20px"
                                            : "0",
                                    fontFamily,
                                }}
                            >
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    {/* Right: Quote Card */}
                    <div
                        style={{
                            backgroundColor: quoteBgColor,
                            border: `1px solid ${accentColor}33`,
                            borderRadius: 16,
                            padding: isMobile ? "28px 24px" : "36px 40px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                        }}
                    >
                        {/* Quote mark */}
                        <div
                            style={{
                                fontSize: 48,
                                color: accentColor,
                                lineHeight: 1,
                                marginBottom: 12,
                                opacity: 0.6,
                            }}
                        >
                            &ldquo;
                        </div>

                        <p
                            style={{
                                fontSize: isMobile ? 15 : 17,
                                color: textColor,
                                lineHeight: 1.7,
                                margin: "0 0 24px",
                                fontFamily,
                                fontStyle: "italic",
                                opacity: 0.9,
                            }}
                        >
                            {quote}
                        </p>

                        <span
                            style={{
                                fontSize: 14,
                                color: accentColor,
                                fontWeight: 600,
                                fontFamily,
                            }}
                        >
                            {quoteAttribution}
                        </span>
                    </div>
                </div>

                {/* Proof Cards Grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: isMobile
                            ? "1fr"
                            : isTablet
                              ? "1fr 1fr"
                              : "1fr 1fr 1fr",
                        gap: isMobile ? 20 : 24,
                    }}
                >
                    {proofCards.map((card, i) => (
                        <div
                            key={i}
                            style={{
                                backgroundColor: cardBgColor,
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: 14,
                                padding: isMobile
                                    ? "28px 24px"
                                    : "32px 28px",
                                display: "flex",
                                flexDirection: "column",
                                gap: 12,
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 32,
                                    lineHeight: 1,
                                }}
                            >
                                {card.icon}
                            </div>

                            <h3
                                style={{
                                    fontSize: isMobile ? 17 : 19,
                                    fontWeight: 600,
                                    color: textColor,
                                    margin: "4px 0 0",
                                    lineHeight: 1.3,
                                    fontFamily,
                                }}
                            >
                                {card.title}
                            </h3>

                            <p
                                style={{
                                    fontSize: isMobile ? 14 : 15,
                                    color: secondaryTextColor,
                                    lineHeight: 1.65,
                                    margin: 0,
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

addPropertyControls(ProductAuthority, {
    sectionLabel: {
        type: ControlType.String,
        title: "Section Label",
        defaultValue: "Why Beamr",
    },
    sectionTitle: {
        type: ControlType.String,
        title: "Section Title",
        defaultValue: "A Decade of Perceptual Science, Productized",
        displayTextArea: true,
    },
    bodyText: {
        type: ControlType.String,
        title: "Body Text",
        defaultValue:
            "VISTA isn't a startup experiment. It's the same subjective testing methodology Beamr has used internally for over 10 years — the foundation behind an Emmy Award, 53 patents, and quality-critical deployments at the world's most demanding video platforms.\n\nNow it's yours.",
        displayTextArea: true,
    },
    quote: {
        type: ControlType.String,
        title: "Quote",
        defaultValue:
            "Viewers don't watch metrics, they watch video. VISTA makes human judgment scalable — giving teams a clear answer on whether their video is good enough before they ship.",
        displayTextArea: true,
    },
    quoteAttribution: {
        type: ControlType.String,
        title: "Quote Attribution",
        defaultValue: "— Sharon Carmel, Founder & CEO, Beamr",
    },
    proofCards: {
        type: ControlType.Array,
        title: "Proof Cards",
        maxCount: 6,
        control: {
            type: ControlType.Object,
            controls: {
                icon: {
                    type: ControlType.String,
                    title: "Icon",
                    defaultValue: "🏆",
                },
                title: {
                    type: ControlType.String,
                    title: "Title",
                    defaultValue: "Card Title",
                },
                description: {
                    type: ControlType.String,
                    title: "Description",
                    defaultValue: "Card description text.",
                    displayTextArea: true,
                },
            },
        },
        defaultValue: [
            {
                icon: "🏆",
                title: "Emmy Award-Winning Science",
                description:
                    "Beamr's perceptual quality discipline earned a Technology & Engineering Emmy Award — the gold standard of recognition in the video industry.",
            },
            {
                icon: "🛡️",
                title: "Trusted by the Best",
                description:
                    "Netflix, Paramount, NVIDIA, and other leading platforms rely on Beamr technology for quality-critical video workflows at massive scale.",
            },
            {
                icon: "📈",
                title: "Scales With Your Needs",
                description:
                    "From quick A/B comparisons to complex multi-variant studies with thousands of viewers, VISTA grows with your testing complexity.",
            },
        ],
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "#8b7cf5",
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#1a1a2e",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#ffffff",
    },
    secondaryTextColor: {
        type: ControlType.Color,
        title: "Secondary Text",
        defaultValue: "#aaaaaa",
    },
    quoteBgColor: {
        type: ControlType.Color,
        title: "Quote Card BG",
        defaultValue: "rgba(79,62,245,0.1)",
    },
    cardBgColor: {
        type: ControlType.Color,
        title: "Card BG",
        defaultValue: "rgba(255,255,255,0.04)",
    },
    fontFamily: {
        type: ControlType.String,
        title: "Font Family",
        defaultValue: "'Inter', sans-serif",
    },
    paddingTop: {
        type: ControlType.Number,
        title: "Padding Top",
        defaultValue: 100,
        min: 0,
        max: 300,
        step: 10,
    },
})

export default ProductAuthority
