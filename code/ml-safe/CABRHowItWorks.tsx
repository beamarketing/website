// CABR - How It Works Section
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
    showClosingQuote: boolean
    ctaText: string
    ctaUrl: string
    accentColor: string
    bgColor: string
    textColor: string
    secondaryTextColor: string
    fontFamily: string
    headingFontFamily: string
    headingFontWeight: number
    paddingTop: number
    style?: React.CSSProperties
}

function CABRHowItWorks(props: Props) {
    const {
        sectionLabel = "Simple by design",
        sectionTitle = "How it Works",
        steps = [
            {
                title: "Ingest your encoded video",
                description:
                    "CABR works on already-encoded H.264, HEVC, or AV1 files. No re-ingest, no pipeline changes — just point it at your existing output.",
            },
            {
                title: "Optimize with content-adaptive encoding",
                description:
                    "CABR analyzes each frame and applies content-adaptive bitrate optimization, removing redundant data while preserving the quality metrics that matter to ML models.",
            },
            {
                title: "Deploy smaller files, same accuracy",
                description:
                    "Output files are up to 50% smaller with <a href='https://blog.beamr.com' target='_blank' rel='noopener'>< 2% mAP difference</a>. Store less, transfer faster, and keep your ML pipelines performing at full accuracy.",
            },
        ],
        closingQuote = "Cut storage costs without compromising model accuracy.",
        showClosingQuote = false,
        ctaText = "Talk to our team →",
        ctaUrl = "#contact",
        accentColor = "#3751FF",
        bgColor = "#fafaff",
        textColor = "#1a1a2e",
        secondaryTextColor = "#666666",
        fontFamily = "'Inter', sans-serif",
        headingFontFamily = "'Poppins', sans-serif",
        headingFontWeight = 700,
        paddingTop = 100,
        style,
    } = props

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

    const sectionPadding = isMobile
        ? `${paddingTop}px 20px 64px`
        : isTablet
          ? `${paddingTop}px 32px 72px`
          : `${paddingTop}px 48px 100px`

    const gridColumns = isMobile ? "1fr" : isTablet ? "1fr 1fr" : "1fr 1fr 1fr"

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
                                    alignItems: isMobile
                                        ? "center"
                                        : "flex-start",
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

                                {/* Step description - supports HTML */}
                                <p
                                    style={{
                                        fontSize: isMobile ? 14 : 15,
                                        color: secondaryTextColor,
                                        margin: 0,
                                        lineHeight: 1.7,
                                        fontFamily,
                                        maxWidth: 400,
                                    }}
                                    dangerouslySetInnerHTML={{ __html: step.description }}
                                />
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
                    {showClosingQuote && (
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
                    )}
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

            {/* Scope link styles inside descriptions */}
            <style>{`
                section p a {
                    color: ${accentColor};
                    text-decoration: underline;
                    text-underline-offset: 2px;
                }
                section p a:hover {
                    opacity: 0.75;
                }
            `}</style>
        </section>
    )
}

addPropertyControls(CABRHowItWorks, {
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
                    title: "Description (HTML)",
                    defaultValue: "Step description. Supports <a>, <br>, <b>, etc.",
                    displayTextArea: true,
                },
            },
        },
        defaultValue: [
            {
                title: "Ingest your encoded video",
                description:
                    "CABR works on already-encoded H.264, HEVC, or AV1 files. No re-ingest, no pipeline changes — just point it at your existing output.",
            },
            {
                title: "Optimize with content-adaptive encoding",
                description:
                    "CABR analyzes each frame and applies content-adaptive bitrate optimization, removing redundant data while preserving the quality metrics that matter to ML models.",
            },
            {
                title: "Deploy smaller files, same accuracy",
                description:
                    "Output files are up to 50% smaller with <a href='https://blog.beamr.com' target='_blank' rel='noopener'>&lt; 2% mAP difference</a>. Store less, transfer faster, and keep your ML pipelines performing at full accuracy.",
            },
        ],
    },
    showClosingQuote: {
        type: ControlType.Boolean,
        title: "Show Quote",
        defaultValue: false,
    },
    closingQuote: {
        type: ControlType.String,
        title: "Closing Quote",
        defaultValue: "Cut storage costs without compromising model accuracy.",
        displayTextArea: true,
        hidden: (props: any) => !props.showClosingQuote,
    },
    ctaText: {
        type: ControlType.String,
        title: "CTA Text",
        defaultValue: "Talk to our team →",
    },
    ctaUrl: {
        type: ControlType.String,
        title: "CTA URL",
        defaultValue: "#contact",
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "#3751FF",
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
        max: 300,
        step: 4,
    },
})

export default CABRHowItWorks
