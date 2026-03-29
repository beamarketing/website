// Product Page - Trust & Conviction Section
// "Why should I trust the results VISTA gives me?"
// Framer Code Component with full property controls

import React, { useRef, useState, useEffect } from "react"
import { addPropertyControls, ControlType } from "framer"

interface TrustLogo {
    image: string
    name: string
    height: number
}

interface Props {
    // Copy
    sectionLabel: string
    headline: string
    body: string
    boldStatement: string
    quote: string
    quoteAttribution: string
    // Emmy
    emmyTitle: string
    emmyCaption: string
    emmyImage: string
    // Trust logos
    trustTitle: string
    trustLogos: TrustLogo[]
    trustLogoHeight: number
    trustLogoOpacity: number
    // CTA
    showCta: boolean
    ctaText: string
    ctaUrl: string
    // Colors
    accentColor: string
    bgColor: string
    textColor: string
    secondaryTextColor: string
    quoteColor: string
    cardBgColor: string
    fontFamily: string
    headingFontFamily: string
    headingFontWeight: number
    paddingTop: number
    style?: React.CSSProperties
}

function ProductAuthority(props: Props) {
    const {
        sectionLabel = "Why trust VISTA",
        headline = "You\u2019re Not Guessing Anymore",
        body = "Every VISTA result is grounded in the same perceptual science Beamr has refined over a decade \u2014 tested across billions of frames, validated by the video industry\u2019s highest standard of recognition, and deployed where quality failures aren\u2019t an option.\n\nVISTA doesn\u2019t approximate how viewers see your video. It measures it \u2014 with real people, under real conditions, at statistical confidence levels you can defend in any review.",
        boldStatement = "Metrics estimate. Humans decide.",
        quote = "Viewers don\u2019t watch metrics, they watch video. VISTA makes human judgment scalable \u2014 giving teams a clear answer on whether their video is good enough before they ship.",
        quoteAttribution = "\u2014 Sharon Carmel, Founder & CEO, Beamr",
        emmyTitle = "Technology & Engineering Emmy\u00AE Award",
        emmyCaption = "Awarded for pioneering perceptual quality measurement in video compression \u2014 the science that powers every VISTA test.",
        emmyImage = "",
        trustTitle = "Trusted by",
        trustLogos = [],
        trustLogoHeight = 28,
        trustLogoOpacity = 0.7,
        showCta = true,
        ctaText = "Run your first test",
        ctaUrl = "#",
        accentColor = "#8b7cf5",
        bgColor = "#1a1a2e",
        textColor = "#ffffff",
        secondaryTextColor = "#999",
        quoteColor = "rgba(255,255,255,0.8)",
        cardBgColor = "rgba(255,255,255,0.04)",
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

    const isCompact = isMobile || isTablet
    const bodyParagraphs = body.split("\n\n").filter(Boolean)
    const placeholderLogos = ["Netflix", "Paramount+", "NVIDIA", "Dolby"]

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
            <div style={{ maxWidth: 1080, margin: "0 auto" }}>

                {/* ── SECTION LABEL ── */}
                <span
                    style={{
                        display: "block",
                        fontSize: 13,
                        fontWeight: 600,
                        color: accentColor,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        marginBottom: 20,
                        fontFamily,
                    }}
                >
                    {sectionLabel}
                </span>

                {/* ── HEADLINE ── */}
                <h2
                    style={{
                        fontSize: isMobile ? 30 : isTablet ? 38 : 48,
                        fontWeight: headingFontWeight,
                        color: textColor,
                        margin: 0,
                        lineHeight: 1.1,
                        letterSpacing: "-0.025em",
                        fontFamily: headingFontFamily,
                        maxWidth: 700,
                    }}
                >
                    {headline}
                </h2>

                {/* ── BODY TEXT ── */}
                <div style={{ maxWidth: 660, marginTop: isMobile ? 24 : 32 }}>
                    {bodyParagraphs.map((p, i) => (
                        <p
                            key={i}
                            style={{
                                fontSize: isMobile ? 15 : 16,
                                color: secondaryTextColor,
                                lineHeight: 1.75,
                                margin: i < bodyParagraphs.length - 1 ? "0 0 18px" : "0",
                                fontFamily,
                            }}
                        >
                            {p}
                        </p>
                    ))}
                </div>

                {/* ── BOLD STATEMENT — divider line ── */}
                <div
                    style={{
                        marginTop: isMobile ? 36 : 48,
                        marginBottom: isMobile ? 36 : 48,
                        paddingTop: isMobile ? 32 : 40,
                        borderTop: `1px solid rgba(255,255,255,0.1)`,
                    }}
                >
                    <p
                        style={{
                            fontSize: isMobile ? 22 : isTablet ? 26 : 30,
                            fontWeight: 600,
                            color: textColor,
                            fontFamily: headingFontFamily,
                            letterSpacing: "-0.01em",
                            lineHeight: 1.3,
                            margin: 0,
                        }}
                    >
                        {boldStatement}
                    </p>
                </div>

                {/* ── QUOTE ── */}
                <div
                    style={{
                        borderLeft: `3px solid ${accentColor}`,
                        paddingLeft: isMobile ? 20 : 28,
                        marginBottom: isMobile ? 48 : 64,
                    }}
                >
                    <p
                        style={{
                            fontSize: isMobile ? 15 : 17,
                            color: quoteColor,
                            lineHeight: 1.7,
                            margin: "0 0 16px",
                            fontFamily,
                            fontStyle: "italic",
                            maxWidth: 600,
                        }}
                    >
                        {quote}
                    </p>
                    <span
                        style={{
                            fontSize: 13,
                            color: accentColor,
                            fontWeight: 600,
                            fontFamily,
                        }}
                    >
                        {quoteAttribution}
                    </span>
                </div>

                {/* ── PROOF STRIP: Emmy + Logos side by side ── */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: isCompact ? "1fr" : "1fr 1fr",
                        gap: isMobile ? 20 : 24,
                        alignItems: "stretch",
                    }}
                >
                    {/* Emmy Card */}
                    <div
                        style={{
                            backgroundColor: cardBgColor,
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: 12,
                            padding: isMobile ? "24px 20px" : "28px 24px",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "flex-start",
                            gap: 20,
                        }}
                    >
                        <div
                            style={{
                                flexShrink: 0,
                                width: 56,
                                height: 56,
                                borderRadius: 10,
                                background: emmyImage ? "transparent" : `${accentColor}18`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                overflow: "hidden",
                            }}
                        >
                            {emmyImage ? (
                                <img
                                    src={emmyImage}
                                    alt={emmyTitle}
                                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                />
                            ) : (
                                // Fallback: trophy SVG in accent color
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M6 2h12v6a6 6 0 0 1-12 0V2z" />
                                    <path d="M6 4H3a1 1 0 0 0-1 1v1a4 4 0 0 0 4 4" />
                                    <path d="M18 4h3a1 1 0 0 1 1 1v1a4 4 0 0 1-4 4" />
                                    <line x1="12" y1="14" x2="12" y2="18" />
                                    <path d="M8 18h8a1 1 0 0 1 1 1v1H7v-1a1 1 0 0 1 1-1z" />
                                </svg>
                            )}
                        </div>
                        <div style={{ flex: 1 }}>
                            <h4
                                style={{
                                    fontSize: 15,
                                    fontWeight: 600,
                                    color: textColor,
                                    margin: "0 0 6px",
                                    lineHeight: 1.3,
                                    fontFamily,
                                }}
                            >
                                {emmyTitle}
                            </h4>
                            <p
                                style={{
                                    fontSize: 13,
                                    color: secondaryTextColor,
                                    lineHeight: 1.6,
                                    margin: 0,
                                    fontFamily,
                                }}
                            >
                                {emmyCaption}
                            </p>
                        </div>
                    </div>

                    {/* Trust Logos Card */}
                    <div
                        style={{
                            backgroundColor: cardBgColor,
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: 12,
                            padding: isMobile ? "24px 20px" : "28px 24px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                        }}
                    >
                        <span
                            style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: secondaryTextColor,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                marginBottom: 16,
                                fontFamily,
                            }}
                        >
                            {trustTitle}
                        </span>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                flexWrap: "wrap",
                                gap: isMobile ? 20 : 28,
                            }}
                        >
                            {trustLogos.length > 0
                                ? trustLogos.map((logo, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            opacity: trustLogoOpacity,
                                            display: "flex",
                                            alignItems: "center",
                                            flexShrink: 0,
                                        }}
                                    >
                                        {logo.image ? (
                                            <img
                                                src={logo.image}
                                                alt={logo.name}
                                                style={{
                                                    height: logo.height || trustLogoHeight,
                                                    objectFit: "contain",
                                                    filter: "brightness(0) invert(1)",
                                                }}
                                            />
                                        ) : (
                                            <span
                                                style={{
                                                    fontSize: 13,
                                                    fontWeight: 700,
                                                    color: textColor,
                                                    letterSpacing: "0.05em",
                                                    textTransform: "uppercase",
                                                    fontFamily,
                                                }}
                                            >
                                                {logo.name}
                                            </span>
                                        )}
                                    </div>
                                ))
                                : placeholderLogos.map((name, i) => (
                                    <span
                                        key={i}
                                        style={{
                                            fontSize: 13,
                                            fontWeight: 700,
                                            color: textColor,
                                            opacity: trustLogoOpacity,
                                            letterSpacing: "0.05em",
                                            textTransform: "uppercase",
                                            fontFamily,
                                        }}
                                    >
                                        {name}
                                    </span>
                                ))}
                        </div>
                    </div>
                </div>

                {/* ── OPTIONAL CTA ── */}
                {showCta && (
                    <div style={{ marginTop: isMobile ? 48 : 64, textAlign: "center" }}>
                        <a
                            href={ctaUrl}
                            style={{
                                display: "inline-block",
                                fontSize: 15,
                                fontWeight: 600,
                                color: accentColor,
                                fontFamily,
                                textDecoration: "none",
                                letterSpacing: "0.01em",
                                borderBottom: `1px solid ${accentColor}66`,
                                paddingBottom: 2,
                            }}
                        >
                            {ctaText} &rarr;
                        </a>
                    </div>
                )}
            </div>
        </section>
    )
}

addPropertyControls(ProductAuthority, {
    sectionLabel: {
        type: ControlType.String,
        title: "Section Label",
        defaultValue: "Why trust VISTA",
    },
    headline: {
        type: ControlType.String,
        title: "Headline",
        defaultValue: "You\u2019re Not Guessing Anymore",
        displayTextArea: true,
    },
    body: {
        type: ControlType.String,
        title: "Body Text",
        defaultValue:
            "Every VISTA result is grounded in the same perceptual science Beamr has refined over a decade \u2014 tested across billions of frames, validated by the video industry\u2019s highest standard of recognition, and deployed where quality failures aren\u2019t an option.\n\nVISTA doesn\u2019t approximate how viewers see your video. It measures it \u2014 with real people, under real conditions, at statistical confidence levels you can defend in any review.",
        displayTextArea: true,
    },
    boldStatement: {
        type: ControlType.String,
        title: "Bold Statement",
        defaultValue: "Metrics estimate. Humans decide.",
    },
    quote: {
        type: ControlType.String,
        title: "Quote",
        defaultValue:
            "Viewers don\u2019t watch metrics, they watch video. VISTA makes human judgment scalable \u2014 giving teams a clear answer on whether their video is good enough before they ship.",
        displayTextArea: true,
    },
    quoteAttribution: {
        type: ControlType.String,
        title: "Attribution",
        defaultValue: "\u2014 Sharon Carmel, Founder & CEO, Beamr",
    },
    emmyTitle: {
        type: ControlType.String,
        title: "Emmy Title",
        defaultValue: "Technology & Engineering Emmy\u00AE Award",
    },
    emmyCaption: {
        type: ControlType.String,
        title: "Emmy Caption",
        defaultValue:
            "Awarded for pioneering perceptual quality measurement in video compression \u2014 the science that powers every VISTA test.",
        displayTextArea: true,
    },
    emmyImage: {
        type: ControlType.Image,
        title: "Emmy Image",
    },
    trustTitle: {
        type: ControlType.String,
        title: "Trust Title",
        defaultValue: "Trusted by",
    },
    trustLogos: {
        type: ControlType.Array,
        title: "Trust Logos",
        maxCount: 8,
        control: {
            type: ControlType.Object,
            controls: {
                name: {
                    type: ControlType.String,
                    title: "Name",
                    defaultValue: "Company",
                },
                image: {
                    type: ControlType.Image,
                    title: "Logo",
                },
                height: {
                    type: ControlType.Number,
                    title: "Height",
                    defaultValue: 28,
                    min: 12,
                    max: 60,
                },
            },
        },
        defaultValue: [],
    },
    trustLogoHeight: {
        type: ControlType.Number,
        title: "Logo Height",
        defaultValue: 28,
        min: 12,
        max: 60,
        step: 2,
    },
    trustLogoOpacity: {
        type: ControlType.Number,
        title: "Logo Opacity",
        defaultValue: 0.7,
        min: 0.1,
        max: 1,
        step: 0.05,
    },
    showCta: {
        type: ControlType.Boolean,
        title: "Show CTA",
        defaultValue: true,
    },
    ctaText: {
        type: ControlType.String,
        title: "CTA Text",
        defaultValue: "Run your first test",
        hidden: (props) => !props.showCta,
    },
    ctaUrl: {
        type: ControlType.String,
        title: "CTA URL",
        defaultValue: "#",
        hidden: (props) => !props.showCta,
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
        defaultValue: "#999",
    },
    quoteColor: {
        type: ControlType.Color,
        title: "Quote Color",
        defaultValue: "rgba(255,255,255,0.8)",
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
        step: 10,
    },
})

export default ProductAuthority
