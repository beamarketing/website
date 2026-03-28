// Product Page - Why Beamr Authority/Trust Section
// Dark section with quote, award highlight, trust logos, and scale metric
// Framer Code Component with full property controls

import React, { useRef, useState, useEffect } from "react"
import { addPropertyControls, ControlType } from "framer"

interface TrustLogo {
    image: string
    name: string
    height: number
}

interface Props {
    sectionLabel: string
    sectionTitle: string
    bodyText: string
    quote: string
    quoteAttribution: string
    // Emmy / Award
    awardTitle: string
    awardDescription: string
    awardImage: string
    // Trust logos
    trustTitle: string
    trustLogos: TrustLogo[]
    trustLogoHeight: number
    trustLogoOpacity: number
    // Scale metric
    scaleValue: string
    scaleLabel: string
    scaleDescription: string
    // Colors
    accentColor: string
    bgColor: string
    textColor: string
    secondaryTextColor: string
    quoteBgColor: string
    cardBgColor: string
    fontFamily: string
    headingFontFamily: string
    headingFontWeight: number
    paddingTop: number
    style?: React.CSSProperties
}

function ProductAuthority(props: Props) {
    const {
        sectionLabel = "Why Beamr",
        sectionTitle = "A Decade of Perceptual Science, Productized",
        bodyText = "VISTA isn\u2019t a startup experiment. It\u2019s the same subjective testing methodology Beamr has used internally for over 10 years \u2014 the foundation behind an Emmy Award, 53 patents, and quality-critical deployments at the world\u2019s most demanding video platforms.\n\nNow it\u2019s yours.",
        quote = "Viewers don\u2019t watch metrics, they watch video. VISTA makes human judgment scalable \u2014 giving teams a clear answer on whether their video is good enough before they ship.",
        quoteAttribution = "\u2014 Sharon Carmel, Founder & CEO, Beamr",
        awardTitle = "Emmy Award-Winning Science",
        awardDescription = "Beamr\u2019s perceptual quality discipline earned a Technology & Engineering Emmy Award \u2014 the gold standard of recognition in the video industry.",
        awardImage = "",
        trustTitle = "Trusted by the Best",
        trustLogos = [],
        trustLogoHeight = 28,
        trustLogoOpacity = 0.7,
        scaleValue = "∞",
        scaleLabel = "Scales With Your Needs",
        scaleDescription = "From a single pair comparison to dozens of configurations across hundreds of viewers \u2014 VISTA handles growing test complexity without growing your team.",
        accentColor = "#8b7cf5",
        bgColor = "#1a1a2e",
        textColor = "#ffffff",
        secondaryTextColor = "#aaaaaa",
        quoteBgColor = "rgba(79,62,245,0.1)",
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
    const bodyParagraphs = bodyText.split("\n\n").filter(Boolean)
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
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
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
                        fontWeight: headingFontWeight,
                        color: textColor,
                        margin: "0 0 48px",
                        lineHeight: 1.15,
                        letterSpacing: "-0.02em",
                        fontFamily: headingFontFamily,
                        maxWidth: 700,
                    }}
                >
                    {sectionTitle}
                </h2>

                {/* 2-column: Body Text + Quote Card */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: isCompact ? "1fr" : "1fr 1fr",
                        gap: isMobile ? 32 : 40,
                        marginBottom: isMobile ? 48 : 64,
                    }}
                >
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

                {/* Bottom proof area — 3 distinct sections */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: isCompact ? "1fr" : "1fr 1fr",
                        gap: isMobile ? 20 : 24,
                    }}
                >
                    {/* Emmy Award — horizontal: image + text */}
                    <div
                        style={{
                            backgroundColor: cardBgColor,
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: 14,
                            padding: isMobile ? "28px 24px" : "32px 28px",
                            display: "flex",
                            flexDirection: isMobile ? "column" : "row",
                            alignItems: isMobile ? "flex-start" : "center",
                            gap: isMobile ? 20 : 24,
                        }}
                    >
                        {/* Award image or fallback */}
                        <div
                            style={{
                                flexShrink: 0,
                                width: isMobile ? 64 : 80,
                                height: isMobile ? 64 : 80,
                                borderRadius: 12,
                                background: awardImage
                                    ? "transparent"
                                    : `${accentColor}20`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                overflow: "hidden",
                            }}
                        >
                            {awardImage ? (
                                <img
                                    src={awardImage}
                                    alt={awardTitle}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                    }}
                                />
                            ) : (
                                <span style={{ fontSize: 36 }}>🏆</span>
                            )}
                        </div>

                        <div style={{ flex: 1 }}>
                            <h3
                                style={{
                                    fontSize: isMobile ? 17 : 19,
                                    fontWeight: 600,
                                    color: textColor,
                                    margin: "0 0 8px",
                                    lineHeight: 1.3,
                                    fontFamily,
                                }}
                            >
                                {awardTitle}
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
                                {awardDescription}
                            </p>
                        </div>
                    </div>

                    {/* Scale metric — large number + label */}
                    <div
                        style={{
                            backgroundColor: cardBgColor,
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: 14,
                            padding: isMobile ? "28px 24px" : "32px 28px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "baseline",
                                gap: 12,
                                marginBottom: 12,
                            }}
                        >
                            <span
                                style={{
                                    fontSize: isMobile ? 40 : 52,
                                    fontWeight: 800,
                                    color: accentColor,
                                    lineHeight: 1,
                                    fontFamily: headingFontFamily,
                                    letterSpacing: "-0.02em",
                                }}
                            >
                                {scaleValue}
                            </span>
                            <span
                                style={{
                                    fontSize: isMobile ? 15 : 17,
                                    fontWeight: 600,
                                    color: textColor,
                                    lineHeight: 1.3,
                                    fontFamily,
                                }}
                            >
                                {scaleLabel}
                            </span>
                        </div>
                        <p
                            style={{
                                fontSize: isMobile ? 14 : 15,
                                color: secondaryTextColor,
                                lineHeight: 1.65,
                                margin: 0,
                                fontFamily,
                            }}
                        >
                            {scaleDescription}
                        </p>
                    </div>

                    {/* Trusted by — full-width logo row */}
                    <div
                        style={{
                            gridColumn: isCompact ? "1" : "1 / -1",
                            backgroundColor: cardBgColor,
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: 14,
                            padding: isMobile ? "24px" : "28px 32px",
                            display: "flex",
                            flexDirection: isMobile ? "column" : "row",
                            alignItems: "center",
                            gap: isMobile ? 20 : 40,
                        }}
                    >
                        <h3
                            style={{
                                fontSize: isMobile ? 15 : 16,
                                fontWeight: 600,
                                color: textColor,
                                margin: 0,
                                whiteSpace: "nowrap",
                                fontFamily,
                                flexShrink: 0,
                            }}
                        >
                            {trustTitle}
                        </h3>

                        {/* Separator */}
                        {!isMobile && (
                            <div
                                style={{
                                    width: 1,
                                    height: 32,
                                    backgroundColor: "rgba(255,255,255,0.12)",
                                    flexShrink: 0,
                                }}
                            />
                        )}

                        {/* Logos */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                flexWrap: "wrap",
                                justifyContent: isMobile
                                    ? "center"
                                    : "space-between",
                                flex: 1,
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
                                                      height:
                                                          logo.height ||
                                                          trustLogoHeight,
                                                      objectFit: "contain",
                                                      filter: "brightness(0) invert(1)",
                                                  }}
                                              />
                                          ) : (
                                              <span
                                                  style={{
                                                      fontSize: 14,
                                                      fontWeight: 700,
                                                      color: textColor,
                                                      letterSpacing: "0.05em",
                                                      textTransform:
                                                          "uppercase",
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
                                              fontSize: 14,
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
            "VISTA isn\u2019t a startup experiment. It\u2019s the same subjective testing methodology Beamr has used internally for over 10 years \u2014 the foundation behind an Emmy Award, 53 patents, and quality-critical deployments at the world\u2019s most demanding video platforms.\n\nNow it\u2019s yours.",
        displayTextArea: true,
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
        title: "Quote Attribution",
        defaultValue: "\u2014 Sharon Carmel, Founder & CEO, Beamr",
    },
    awardTitle: {
        type: ControlType.String,
        title: "Award Title",
        defaultValue: "Emmy Award-Winning Science",
    },
    awardDescription: {
        type: ControlType.String,
        title: "Award Description",
        defaultValue:
            "Beamr\u2019s perceptual quality discipline earned a Technology & Engineering Emmy Award \u2014 the gold standard of recognition in the video industry.",
        displayTextArea: true,
    },
    awardImage: {
        type: ControlType.Image,
        title: "Award Image",
    },
    trustTitle: {
        type: ControlType.String,
        title: "Trust Title",
        defaultValue: "Trusted by the Best",
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
    scaleValue: {
        type: ControlType.String,
        title: "Scale Value",
        defaultValue: "\u221e",
    },
    scaleLabel: {
        type: ControlType.String,
        title: "Scale Label",
        defaultValue: "Scales With Your Needs",
    },
    scaleDescription: {
        type: ControlType.String,
        title: "Scale Description",
        defaultValue:
            "From a single pair comparison to dozens of configurations across hundreds of viewers \u2014 VISTA handles growing test complexity without growing your team.",
        displayTextArea: true,
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
