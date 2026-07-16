// 3-step process grid with icon badges, connectors, and closing CTA
// Framer Code Component with full property controls

import React, { useRef, useState, useEffect } from "react"
import { addPropertyControls, ControlType } from "framer"

interface StepItem {
    title: string
    description: string
    icon: string
    iconImage: string
}

interface Props {
    sectionLabel: string
    sectionLabelColor: string
    sectionTitle: string
    sectionSubtitle: string
    subtitleColor: string
    subtitleFontWeight: number
    steps: StepItem[]
    closingQuote: string
    showClosingQuote: boolean
    quoteColor: string
    ctaText: string
    ctaUrl: string
    ctaBgColor: string
    ctaTextColor: string
    iconBadgeBgColor: string
    iconColor: string
    connectorColor: string
    bgColor: string
    headingColor: string
    titleColor: string
    titleFontWeight: number
    descriptionColor: string
    fontFamily: string
    headingFontFamily: string
    headingFontWeight: number
    paddingTop: number
    style?: React.CSSProperties
}

function HowItWorksBlueprint(props: Props) {
    const {
        sectionLabel = "Simple by design",
        sectionLabelColor = "#4f3ef5",
        sectionTitle = "How it Works",
        sectionSubtitle = "",
        subtitleColor = "#666666",
        subtitleFontWeight = 400,
        steps = [
            {
                title: "Submit your test",
                description:
                    "Upload two sets of videos and define what you want to compare. VISTA presents them side by side, perfectly synchronized at native resolution. Configure through the portal or submit via API.",
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
            },
            {
                title: "Test at scale",
                description:
                    "Real viewers evaluate your video quality side by side — forced choice, no scales, no ambiguity. VISTA manages viewer recruitment, validation, and statistical reliability automatically.",
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
            },
            {
                title: "Get decision-ready results",
                description:
                    "Receive a structured report with per-pair preference scores, statistical confidence levels, and a clear verdict. Know exactly which version won — and by how much.",
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
            },
        ],
        closingQuote = "Run the hard part of subjective testing, easily.",
        showClosingQuote = false,
        quoteColor = "#1a1a2e",
        ctaText = "Try VISTA →",
        ctaUrl = "#",
        ctaBgColor = "#4f3ef5",
        ctaTextColor = "#ffffff",
        iconBadgeBgColor = "#4f3ef5",
        iconColor = "#ffffff",
        connectorColor = "#4f3ef5",
        bgColor = "#fafaff",
        headingColor = "#1a1a2e",
        titleColor = "#1a1a2e",
        titleFontWeight = 600,
        descriptionColor = "#666666",
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
                            color: sectionLabelColor,
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
                            color: headingColor,
                            margin: "16px 0 0",
                            lineHeight: 1.15,
                            fontFamily: headingFontFamily,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        {sectionTitle}
                    </h2>
                    {sectionSubtitle && (
                        <p
                            style={{
                                fontSize: isMobile ? 16 : 18,
                                fontWeight: subtitleFontWeight,
                                color: subtitleColor,
                                margin: "12px auto 0",
                                lineHeight: 1.5,
                                fontFamily,
                                maxWidth: 640,
                            }}
                            dangerouslySetInnerHTML={{
                                __html: sectionSubtitle,
                            }}
                        />
                    )}
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
                                    alignItems: "center",
                                    textAlign: "center",
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
                                            background: `linear-gradient(90deg, ${connectorColor}40, ${connectorColor}10)`,
                                            zIndex: 0,
                                        }}
                                    />
                                )}

                                {/* Icon badge */}
                                <div
                                    style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 12,
                                        backgroundColor: iconBadgeBgColor,
                                        color: iconColor,
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
                                    {step.iconImage ? (
                                        <div
                                            style={{
                                                width: 24,
                                                height: 24,
                                                backgroundColor: iconColor,
                                                WebkitMaskImage: `url(${step.iconImage})`,
                                                WebkitMaskSize: "contain",
                                                WebkitMaskRepeat: "no-repeat",
                                                WebkitMaskPosition: "center",
                                                maskImage: `url(${step.iconImage})`,
                                                maskSize: "contain",
                                                maskRepeat: "no-repeat",
                                                maskPosition: "center",
                                            }}
                                        />
                                    ) : step.icon ? (
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: step.icon,
                                            }}
                                        />
                                    ) : (
                                        i + 1
                                    )}
                                </div>

                                {/* Step title */}
                                <h3
                                    style={{
                                        fontSize: isMobile ? 18 : 20,
                                        fontWeight: titleFontWeight,
                                        color: titleColor,
                                        margin: "0 0 12px",
                                        lineHeight: 1.3,
                                        fontFamily,
                                    }}
                                >
                                    {step.title}
                                </h3>

                                {/* Step description (supports HTML) */}
                                <p
                                    style={{
                                        fontSize: isMobile ? 14 : 15,
                                        color: descriptionColor,
                                        margin: 0,
                                        lineHeight: 1.7,
                                        fontFamily,
                                        maxWidth: 400,
                                    }}
                                    dangerouslySetInnerHTML={{
                                        __html: step.description,
                                    }}
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
                                color: quoteColor,
                                margin: 0,
                                lineHeight: 1.5,
                                fontFamily,
                                maxWidth: 560,
                                fontWeight: 400,
                            }}
                            dangerouslySetInnerHTML={{
                                __html: closingQuote,
                            }}
                        />
                    )}
                    <a
                        href={ctaUrl}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            backgroundColor: ctaBgColor,
                            color: ctaTextColor,
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

addPropertyControls(HowItWorksBlueprint, {
    sectionLabel: {
        type: ControlType.String,
        title: "Section Label",
        defaultValue: "Simple by design",
    },
    sectionLabelColor: {
        type: ControlType.Color,
        title: "Label Color",
        defaultValue: "#4f3ef5",
    },
    sectionTitle: {
        type: ControlType.String,
        title: "Section Title",
        defaultValue: "How it Works",
    },
    headingColor: {
        type: ControlType.Color,
        title: "Heading Color",
        defaultValue: "#1a1a2e",
    },
    headingFontWeight: {
        type: ControlType.Number,
        title: "Heading Weight",
        defaultValue: 700,
        min: 100,
        max: 900,
        step: 100,
    },
    headingFontFamily: {
        type: ControlType.String,
        title: "Heading Font",
        defaultValue: "'Poppins', sans-serif",
    },
    sectionSubtitle: {
        type: ControlType.String,
        title: "Subtitle (HTML)",
        defaultValue: "",
        displayTextArea: true,
    },
    subtitleColor: {
        type: ControlType.Color,
        title: "Subtitle Color",
        defaultValue: "#666666",
    },
    subtitleFontWeight: {
        type: ControlType.Number,
        title: "Subtitle Weight",
        defaultValue: 400,
        min: 100,
        max: 900,
        step: 100,
    },
    steps: {
        type: ControlType.Array,
        title: "Steps",
        maxCount: 6,
        control: {
            type: ControlType.Object,
            controls: {
                iconImage: {
                    type: ControlType.Image,
                    title: "Icon Image",
                },
                icon: {
                    type: ControlType.String,
                    title: "Icon (SVG/HTML)",
                    defaultValue: "",
                    displayTextArea: true,
                },
                title: {
                    type: ControlType.String,
                    title: "Title",
                    defaultValue: "Step title",
                },
                description: {
                    type: ControlType.String,
                    title: "Description (HTML)",
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
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
            },
            {
                title: "Test at scale",
                description:
                    "Real viewers evaluate your video quality side by side — forced choice, no scales, no ambiguity. VISTA manages viewer recruitment, validation, and statistical reliability automatically.",
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
            },
            {
                title: "Get decision-ready results",
                description:
                    "Receive a structured report with per-pair preference scores, statistical confidence levels, and a clear verdict. Know exactly which version won — and by how much.",
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
            },
        ],
    },
    titleColor: {
        type: ControlType.Color,
        title: "Step Title Color",
        defaultValue: "#1a1a2e",
    },
    titleFontWeight: {
        type: ControlType.Number,
        title: "Step Title Weight",
        defaultValue: 600,
        min: 100,
        max: 900,
        step: 100,
    },
    descriptionColor: {
        type: ControlType.Color,
        title: "Description Color",
        defaultValue: "#666666",
    },
    iconBadgeBgColor: {
        type: ControlType.Color,
        title: "Icon Badge BG",
        defaultValue: "#4f3ef5",
    },
    iconColor: {
        type: ControlType.Color,
        title: "Icon Color",
        defaultValue: "#ffffff",
    },
    connectorColor: {
        type: ControlType.Color,
        title: "Connector Color",
        defaultValue: "#4f3ef5",
    },
    showClosingQuote: {
        type: ControlType.Boolean,
        title: "Show Quote",
        defaultValue: false,
    },
    closingQuote: {
        type: ControlType.String,
        title: "Closing Quote (HTML)",
        defaultValue: "Run the hard part of subjective testing, easily.",
        displayTextArea: true,
        hidden: (props) => !props.showClosingQuote,
    },
    quoteColor: {
        type: ControlType.Color,
        title: "Quote Color",
        defaultValue: "#1a1a2e",
        hidden: (props) => !props.showClosingQuote,
    },
    ctaText: {
        type: ControlType.String,
        title: "CTA Text",
        defaultValue: "Try VISTA →",
    },
    ctaUrl: {
        type: ControlType.String,
        title: "CTA URL",
        defaultValue: "#",
    },
    ctaBgColor: {
        type: ControlType.Color,
        title: "CTA Background",
        defaultValue: "#4f3ef5",
    },
    ctaTextColor: {
        type: ControlType.Color,
        title: "CTA Text Color",
        defaultValue: "#ffffff",
    },
    bgColor: {
        type: ControlType.Color,
        title: "Section Background",
        defaultValue: "#fafaff",
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

export default HowItWorksBlueprint
