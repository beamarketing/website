// Product Page - How It Works Section
// 3-step process grid with numbered badges, connectors, and closing CTA
// Framer Code Component with full property controls

import React, { useRef, useState, useEffect } from "react"
import { addPropertyControls, ControlType } from "framer"

interface StepItem {
    title: string
    description: string
}

interface Props {
    sectionLabel: string
    sectionTitle: string
    steps: StepItem[]
    closingQuote: string
    ctaText: string
    ctaUrl: string
    accentColor: string
    bgColor: string
    textColor: string
    secondaryTextColor: string
    fontFamily: string
    paddingTop: number
    style?: React.CSSProperties
}

function ProductHowItWorks(props: Props) {
    const {
        sectionLabel = "Simple by design",
        sectionTitle = "How it Works",
        steps = [
            {
                title: "Submit your test",
                description:
                    "Upload two sets of videos and define what you want to compare. VISTA presents them side by side, perfectly synchronized at native resolution. Configure through the portal or submit via API.",
            },
            {
                title: "Test at scale",
                description:
                    "Real viewers evaluate your video quality side by side \u2014 forced choice, no scales, no ambiguity. VISTA manages viewer recruitment, validation, and statistical reliability automatically.",
            },
            {
                title: "Get decision-ready results",
                description:
                    "Receive a structured report with per-pair preference scores, statistical confidence levels, and a clear verdict. Know exactly which version won \u2014 and by how much.",
            },
        ],
        closingQuote = "Run the hard part of subjective testing, easily.",
        ctaText = "Try VISTA \u2192",
        ctaUrl = "#",
        accentColor = "#4f3ef5",
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

    const isCompact = isMobile || isTablet

    // Responsive padding
    const sectionPadding = isMobile
        ? `${paddingTop}px 20px 64px`
        : isTablet
          ? `${paddingTop}px 32px 72px`
          : `${paddingTop}px 48px 100px`

    // Grid columns
    const gridColumns = isMobile ? "1fr" : isTablet ? "1fr 1fr" : "1fr 1fr 1fr"

    // Show connectors only on desktop
    const showConnectors = !isMobile && !isTablet

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
                            fontSize: isMobile ? 32 : isTablet ? 38 : 44,
                            fontWeight: 700,
                            color: textColor,
                            margin: "16px 0 0",
                            lineHeight: 1.15,
                            fontFamily,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        {sectionTitle}
                    </h2>
                </div>

                {/* Steps Grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: gridColumns,
                        gap: isMobile ? 32 : 24,
                    }}
                >
                    {steps.map((step, i) => {
                        const isLast = i === steps.length - 1
                        return (
                            <div
                                key={i}
                                style={{
                                    position: "relative",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: isMobile ? "center" : "flex-start",
                                    textAlign: isMobile ? "center" : "left",
                                }}
                            >
                                {/* Connector line */}
                                {showConnectors && !isLast && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: 22,
                                            left: "calc(50% + 28px)",
                                            right: "-24px",
                                            height: 2,
                                            background: `linear-gradient(90deg, ${accentColor}40, ${accentColor}10)`,
                                            zIndex: 0,
                                        }}
                                    />
                                )}

                                {/* Numbered badge */}
                                <div
                                    style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 12,
                                        backgroundColor: accentColor,
                                        color: "#ffffff",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 18,
                                        fontWeight: 700,
                                        fontFamily,
                                        marginBottom: 20,
                                        position: "relative",
                                        zIndex: 1,
                                        flexShrink: 0,
                                    }}
                                >
                                    {i + 1}
                                </div>

                                {/* Step title */}
                                <h3
                                    style={{
                                        fontSize: isMobile ? 18 : 20,
                                        fontWeight: 600,
                                        color: textColor,
                                        margin: "0 0 12px",
                                        lineHeight: 1.3,
                                        fontFamily,
                                    }}
                                >
                                    {step.title}
                                </h3>

                                {/* Step description */}
                                <p
                                    style={{
                                        fontSize: isMobile ? 14 : 15,
                                        color: secondaryTextColor,
                                        margin: 0,
                                        lineHeight: 1.7,
                                        fontFamily,
                                        maxWidth: 400,
                                    }}
                                >
                                    {step.description}
                                </p>
                            </div>
                        )
                    })}
                </div>

                {/* Closing Area */}
                <div
                    style={{
                        marginTop: isMobile ? 48 : 72,
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 24,
                    }}
                >
                    <p
                        style={{
                            fontSize: isMobile ? 18 : 22,
                            fontStyle: "italic",
                            color: textColor,
                            margin: 0,
                            lineHeight: 1.5,
                            fontFamily,
                            maxWidth: 560,
                            fontWeight: 400,
                        }}
                    >
                        "{closingQuote}"
                    </p>
                    <a
                        href={ctaUrl}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            backgroundColor: accentColor,
                            color: "#ffffff",
                            padding: isMobile ? "14px 24px" : "16px 32px",
                            borderRadius: 10,
                            fontSize: 16,
                            fontWeight: 600,
                            textDecoration: "none",
                            fontFamily,
                            lineHeight: "24px",
                            transition: "opacity 0.2s ease",
                        }}
                    >
                        {ctaText}
                    </a>
                </div>
            </div>
        </section>
    )
}

addPropertyControls(ProductHowItWorks, {
    sectionLabel: {
        type: ControlType.String,
        title: "Section Label",
        defaultValue: "Simple by design",
    },
    sectionTitle: {
        type: ControlType.String,
        title: "Section Title",
        defaultValue: "How it Works",
    },
    steps: {
        type: ControlType.Array,
        title: "Steps",
        maxCount: 6,
        control: {
            type: ControlType.Object,
            controls: {
                title: {
                    type: ControlType.String,
                    title: "Title",
                    defaultValue: "Step title",
                },
                description: {
                    type: ControlType.String,
                    title: "Description",
                    defaultValue: "Step description.",
                    displayTextArea: true,
                },
            },
        },
        defaultValue: [
            {
                title: "Submit your test",
                description:
                    "Upload two sets of videos and define what you want to compare. VISTA presents them side by side, perfectly synchronized at native resolution. Configure through the portal or submit via API.",
            },
            {
                title: "Test at scale",
                description:
                    "Real viewers evaluate your video quality side by side \u2014 forced choice, no scales, no ambiguity. VISTA manages viewer recruitment, validation, and statistical reliability automatically.",
            },
            {
                title: "Get decision-ready results",
                description:
                    "Receive a structured report with per-pair preference scores, statistical confidence levels, and a clear verdict. Know exactly which version won \u2014 and by how much.",
            },
        ],
    },
    closingQuote: {
        type: ControlType.String,
        title: "Closing Quote",
        defaultValue: "Run the hard part of subjective testing, easily.",
        displayTextArea: true,
    },
    ctaText: {
        type: ControlType.String,
        title: "CTA Text",
        defaultValue: "Try VISTA \u2192",
    },
    ctaUrl: {
        type: ControlType.String,
        title: "CTA URL",
        defaultValue: "#",
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
        defaultValue: "#666666",
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
        step: 4,
    },
})

export default ProductHowItWorks
