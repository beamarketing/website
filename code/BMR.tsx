import React, { useRef, useState, useEffect } from "react"
import { addPropertyControls, ControlType } from "framer"

interface TrustLogo {
    image: string
    name: string
    height: number
}

interface Props {
    sectionLabel: string
    headline: string
    body: string
    boldStatement: string
    quote: string
    quoteAttribution: string
    emmyTitle: string
    emmyCaption: string
    emmyImage: string
    trustTitle: string
    trustLogos: TrustLogo[]
    trustLogoHeight: number
    trustLogoOpacity: number
    showCta: boolean
    ctaText: string
    ctaUrl: string
    accentColor: string
    bgColor: string
    textColor: string
    secondaryTextColor: string
    quoteColor: string
    cardBgColor: string
    paddingTop: number
    // Section Label font
    sectionLabelFontFamily: string
    sectionLabelFontSize: number
    sectionLabelFontWeight: number
    // Headline font
    headlineFontFamily: string
    headlineFontSize: number
    headlineFontWeight: number
    // Body font
    bodyFontFamily: string
    bodyFontSize: number
    bodyFontWeight: number
    // Bold Statement font
    boldStatementFontFamily: string
    boldStatementFontSize: number
    boldStatementFontWeight: number
    // Quote font
    quoteFontFamily: string
    quoteFontSize: number
    quoteFontWeight: number
    // Quote Attribution font
    quoteAttributionFontFamily: string
    quoteAttributionFontSize: number
    quoteAttributionFontWeight: number
    // Emmy Title font
    emmyTitleFontFamily: string
    emmyTitleFontSize: number
    emmyTitleFontWeight: number
    // Emmy Caption font
    emmyCaptionFontFamily: string
    emmyCaptionFontSize: number
    emmyCaptionFontWeight: number
    // Trust Title font
    trustTitleFontFamily: string
    trustTitleFontSize: number
    trustTitleFontWeight: number
    // Trust Logo Text font
    trustLogoTextFontFamily: string
    trustLogoTextFontSize: number
    trustLogoTextFontWeight: number
    // CTA font
    ctaFontFamily: string
    ctaFontSize: number
    ctaFontWeight: number
    style?: React.CSSProperties
}

function BMR(props: Props) {
    const {
        sectionLabel = "Why trust VISTA",
        headline = "You’re Not Guessing Anymore",
        body = "Every VISTA result is grounded in the same perceptual science Beamr has refined over a decade — tested across billions of frames, validated by the video industry’s highest standard of recognition, and deployed where quality failures aren’t an option.\n\nVISTA doesn’t approximate how viewers see your video. It measures it — with real people, under real conditions, at statistical confidence levels you can defend in any review.",
        boldStatement = "Metrics estimate. Humans decide.",
        quote = "Viewers don’t watch metrics, they watch video. VISTA makes human judgment scalable — giving teams a clear answer on whether their video is good enough before they ship.",
        quoteAttribution = "— Sharon Carmel, Founder & CEO, Beamr",
        emmyTitle = "Technology & Engineering Emmy® Award",
        emmyCaption = "Awarded for pioneering perceptual quality measurement in video compression — the science that powers every VISTA test.",
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
        paddingTop = 100,
        sectionLabelFontFamily = "'Inter', sans-serif",
        sectionLabelFontSize = 13,
        sectionLabelFontWeight = 600,
        headlineFontFamily = "'Poppins', sans-serif",
        headlineFontSize = 48,
        headlineFontWeight = 700,
        bodyFontFamily = "'Inter', sans-serif",
        bodyFontSize = 16,
        bodyFontWeight = 400,
        boldStatementFontFamily = "'Poppins', sans-serif",
        boldStatementFontSize = 22,
        boldStatementFontWeight = 700,
        quoteFontFamily = "'Inter', sans-serif",
        quoteFontSize = 18,
        quoteFontWeight = 400,
        quoteAttributionFontFamily = "'Inter', sans-serif",
        quoteAttributionFontSize = 14,
        quoteAttributionFontWeight = 500,
        emmyTitleFontFamily = "'Inter', sans-serif",
        emmyTitleFontSize = 15,
        emmyTitleFontWeight = 600,
        emmyCaptionFontFamily = "'Inter', sans-serif",
        emmyCaptionFontSize = 13,
        emmyCaptionFontWeight = 400,
        trustTitleFontFamily = "'Inter', sans-serif",
        trustTitleFontSize = 12,
        trustTitleFontWeight = 600,
        trustLogoTextFontFamily = "'Inter', sans-serif",
        trustLogoTextFontSize = 13,
        trustLogoTextFontWeight = 700,
        ctaFontFamily = "'Inter', sans-serif",
        ctaFontSize = 15,
        ctaFontWeight = 600,
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

    const responsiveHeadlineSize = isMobile
        ? headlineFontSize * 0.625
        : isTablet
          ? headlineFontSize * 0.79
          : headlineFontSize

    const responsiveBodySize = isMobile
        ? bodyFontSize - 1
        : bodyFontSize

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
                fontFamily: bodyFontFamily,
            }}
        >
            <div style={{ maxWidth: 1080, margin: "0 auto" }}>
                {/* Section Label */}
                <span
                    style={{
                        display: "block",
                        fontSize: sectionLabelFontSize,
                        fontWeight: sectionLabelFontWeight,
                        fontFamily: sectionLabelFontFamily,
                        color: accentColor,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        marginBottom: 20,
                    }}
                >
                    {sectionLabel}
                </span>

                {/* Headline */}
                <h2
                    style={{
                        fontSize: responsiveHeadlineSize,
                        fontWeight: headlineFontWeight,
                        fontFamily: headlineFontFamily,
                        color: textColor,
                        margin: 0,
                        lineHeight: 1.1,
                        letterSpacing: "-0.025em",
                        maxWidth: 700,
                    }}
                >
                    {headline}
                </h2>

                {/* Body Text */}
                <div style={{ maxWidth: 660, marginTop: isMobile ? 24 : 32 }}>
                    {bodyParagraphs.map((p, i) => (
                        <p
                            key={i}
                            style={{
                                fontSize: responsiveBodySize,
                                fontWeight: bodyFontWeight,
                                fontFamily: bodyFontFamily,
                                color: secondaryTextColor,
                                lineHeight: 1.75,
                                margin:
                                    i < bodyParagraphs.length - 1
                                        ? "0 0 18px"
                                        : "0",
                            }}
                        >
                            {p}
                        </p>
                    ))}
                </div>

                {/* Bold Statement */}
                <div
                    style={{
                        marginTop: isMobile ? 36 : 48,
                        marginBottom: isMobile ? 36 : 48,
                        paddingTop: isMobile ? 32 : 40,
                    }}
                >
                    <p
                        style={{
                            fontSize: isMobile
                                ? boldStatementFontSize * 0.82
                                : boldStatementFontSize,
                            fontWeight: boldStatementFontWeight,
                            fontFamily: boldStatementFontFamily,
                            color: textColor,
                            lineHeight: 1.3,
                            margin: 0,
                        }}
                    >
                        {boldStatement}
                    </p>
                </div>

                {/* Quote */}
                <blockquote
                    style={{
                        borderLeft: `3px solid ${accentColor}`,
                        paddingLeft: isMobile ? 16 : 24,
                        marginLeft: 0,
                        marginRight: 0,
                        marginTop: 0,
                        marginBottom: isMobile ? 36 : 48,
                        maxWidth: 660,
                    }}
                >
                    <p
                        style={{
                            fontSize: isMobile
                                ? quoteFontSize - 2
                                : quoteFontSize,
                            fontWeight: quoteFontWeight,
                            fontFamily: quoteFontFamily,
                            color: quoteColor,
                            lineHeight: 1.7,
                            margin: "0 0 12px",
                            fontStyle: "italic",
                        }}
                    >
                        {quote}
                    </p>
                    <cite
                        style={{
                            fontSize: quoteAttributionFontSize,
                            fontWeight: quoteAttributionFontWeight,
                            fontFamily: quoteAttributionFontFamily,
                            color: secondaryTextColor,
                            fontStyle: "normal",
                        }}
                    >
                        {quoteAttribution}
                    </cite>
                </blockquote>

                {/* Proof Strip: Emmy + Logos */}
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
                                background: emmyImage
                                    ? "transparent"
                                    : `${accentColor}18`,
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
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                    }}
                                />
                            ) : (
                                <svg
                                    width="28"
                                    height="28"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke={accentColor}
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
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
                                    fontSize: emmyTitleFontSize,
                                    fontWeight: emmyTitleFontWeight,
                                    fontFamily: emmyTitleFontFamily,
                                    color: textColor,
                                    margin: "0 0 6px",
                                    lineHeight: 1.3,
                                }}
                            >
                                {emmyTitle}
                            </h4>
                            <p
                                style={{
                                    fontSize: emmyCaptionFontSize,
                                    fontWeight: emmyCaptionFontWeight,
                                    fontFamily: emmyCaptionFontFamily,
                                    color: secondaryTextColor,
                                    lineHeight: 1.6,
                                    margin: 0,
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
                                fontSize: trustTitleFontSize,
                                fontWeight: trustTitleFontWeight,
                                fontFamily: trustTitleFontFamily,
                                color: secondaryTextColor,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                marginBottom: 16,
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
                                                      fontSize:
                                                          trustLogoTextFontSize,
                                                      fontWeight:
                                                          trustLogoTextFontWeight,
                                                      fontFamily:
                                                          trustLogoTextFontFamily,
                                                      color: textColor,
                                                      letterSpacing: "0.05em",
                                                      textTransform:
                                                          "uppercase",
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
                                              fontSize:
                                                  trustLogoTextFontSize,
                                              fontWeight:
                                                  trustLogoTextFontWeight,
                                              fontFamily:
                                                  trustLogoTextFontFamily,
                                              color: textColor,
                                              opacity: trustLogoOpacity,
                                              letterSpacing: "0.05em",
                                              textTransform: "uppercase",
                                          }}
                                      >
                                          {name}
                                      </span>
                                  ))}
                        </div>
                    </div>
                </div>

                {/* CTA */}
                {showCta && (
                    <div
                        style={{
                            marginTop: isMobile ? 40 : 56,
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <a
                            href={ctaUrl}
                            style={{
                                display: "inline-block",
                                padding: "14px 32px",
                                fontSize: ctaFontSize,
                                fontWeight: ctaFontWeight,
                                fontFamily: ctaFontFamily,
                                color: "#fff",
                                backgroundColor: accentColor,
                                borderRadius: 8,
                                textDecoration: "none",
                                letterSpacing: "0.01em",
                                transition: "opacity 0.2s",
                            }}
                        >
                            {ctaText}
                        </a>
                    </div>
                )}
            </div>
        </section>
    )
}

addPropertyControls(BMR, {
    sectionLabel: {
        type: ControlType.String,
        title: "Section Label",
        defaultValue: "Why trust VISTA",
    },
    headline: {
        type: ControlType.String,
        title: "Headline",
        defaultValue: "You’re Not Guessing Anymore",
        displayTextArea: true,
    },
    body: {
        type: ControlType.String,
        title: "Body Text",
        defaultValue:
            "Every VISTA result is grounded in the same perceptual science Beamr has refined over a decade — tested across billions of frames, validated by the video industry’s highest standard of recognition, and deployed where quality failures aren’t an option.\n\nVISTA doesn’t approximate how viewers see your video. It measures it — with real people, under real conditions, at statistical confidence levels you can defend in any review.",
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
            "Viewers don’t watch metrics, they watch video. VISTA makes human judgment scalable — giving teams a clear answer on whether their video is good enough before they ship.",
        displayTextArea: true,
    },
    quoteAttribution: {
        type: ControlType.String,
        title: "Attribution",
        defaultValue: "— Sharon Carmel, Founder & CEO, Beamr",
    },
    emmyTitle: {
        type: ControlType.String,
        title: "Emmy Title",
        defaultValue: "Technology & Engineering Emmy® Award",
    },
    emmyCaption: {
        type: ControlType.String,
        title: "Emmy Caption",
        defaultValue:
            "Awarded for pioneering perceptual quality measurement in video compression — the science that powers every VISTA test.",
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
    paddingTop: {
        type: ControlType.Number,
        title: "Padding Top",
        defaultValue: 100,
        min: 0,
        max: 300,
        step: 10,
    },
    // Section Label Typography
    sectionLabelFontFamily: {
        type: ControlType.String,
        title: "Label Font",
        defaultValue: "'Inter', sans-serif",
    },
    sectionLabelFontSize: {
        type: ControlType.Number,
        title: "Label Size",
        defaultValue: 13,
        min: 8,
        max: 32,
        step: 1,
    },
    sectionLabelFontWeight: {
        type: ControlType.Number,
        title: "Label Weight",
        defaultValue: 600,
        min: 100,
        max: 900,
        step: 100,
    },
    // Headline Typography
    headlineFontFamily: {
        type: ControlType.String,
        title: "Headline Font",
        defaultValue: "'Poppins', sans-serif",
    },
    headlineFontSize: {
        type: ControlType.Number,
        title: "Headline Size",
        defaultValue: 48,
        min: 16,
        max: 120,
        step: 1,
    },
    headlineFontWeight: {
        type: ControlType.Number,
        title: "Headline Weight",
        defaultValue: 700,
        min: 100,
        max: 900,
        step: 100,
    },
    // Body Typography
    bodyFontFamily: {
        type: ControlType.String,
        title: "Body Font",
        defaultValue: "'Inter', sans-serif",
    },
    bodyFontSize: {
        type: ControlType.Number,
        title: "Body Size",
        defaultValue: 16,
        min: 10,
        max: 32,
        step: 1,
    },
    bodyFontWeight: {
        type: ControlType.Number,
        title: "Body Weight",
        defaultValue: 400,
        min: 100,
        max: 900,
        step: 100,
    },
    // Bold Statement Typography
    boldStatementFontFamily: {
        type: ControlType.String,
        title: "Bold Font",
        defaultValue: "'Poppins', sans-serif",
    },
    boldStatementFontSize: {
        type: ControlType.Number,
        title: "Bold Size",
        defaultValue: 22,
        min: 12,
        max: 60,
        step: 1,
    },
    boldStatementFontWeight: {
        type: ControlType.Number,
        title: "Bold Weight",
        defaultValue: 700,
        min: 100,
        max: 900,
        step: 100,
    },
    // Quote Typography
    quoteFontFamily: {
        type: ControlType.String,
        title: "Quote Font",
        defaultValue: "'Inter', sans-serif",
    },
    quoteFontSize: {
        type: ControlType.Number,
        title: "Quote Size",
        defaultValue: 18,
        min: 10,
        max: 40,
        step: 1,
    },
    quoteFontWeight: {
        type: ControlType.Number,
        title: "Quote Weight",
        defaultValue: 400,
        min: 100,
        max: 900,
        step: 100,
    },
    // Quote Attribution Typography
    quoteAttributionFontFamily: {
        type: ControlType.String,
        title: "Attrib Font",
        defaultValue: "'Inter', sans-serif",
    },
    quoteAttributionFontSize: {
        type: ControlType.Number,
        title: "Attrib Size",
        defaultValue: 14,
        min: 8,
        max: 28,
        step: 1,
    },
    quoteAttributionFontWeight: {
        type: ControlType.Number,
        title: "Attrib Weight",
        defaultValue: 500,
        min: 100,
        max: 900,
        step: 100,
    },
    // Emmy Title Typography
    emmyTitleFontFamily: {
        type: ControlType.String,
        title: "Emmy Title Font",
        defaultValue: "'Inter', sans-serif",
    },
    emmyTitleFontSize: {
        type: ControlType.Number,
        title: "Emmy Title Size",
        defaultValue: 15,
        min: 10,
        max: 32,
        step: 1,
    },
    emmyTitleFontWeight: {
        type: ControlType.Number,
        title: "Emmy Title Weight",
        defaultValue: 600,
        min: 100,
        max: 900,
        step: 100,
    },
    // Emmy Caption Typography
    emmyCaptionFontFamily: {
        type: ControlType.String,
        title: "Emmy Cap Font",
        defaultValue: "'Inter', sans-serif",
    },
    emmyCaptionFontSize: {
        type: ControlType.Number,
        title: "Emmy Cap Size",
        defaultValue: 13,
        min: 8,
        max: 28,
        step: 1,
    },
    emmyCaptionFontWeight: {
        type: ControlType.Number,
        title: "Emmy Cap Weight",
        defaultValue: 400,
        min: 100,
        max: 900,
        step: 100,
    },
    // Trust Title Typography
    trustTitleFontFamily: {
        type: ControlType.String,
        title: "Trust Title Font",
        defaultValue: "'Inter', sans-serif",
    },
    trustTitleFontSize: {
        type: ControlType.Number,
        title: "Trust Title Size",
        defaultValue: 12,
        min: 8,
        max: 28,
        step: 1,
    },
    trustTitleFontWeight: {
        type: ControlType.Number,
        title: "Trust Title Weight",
        defaultValue: 600,
        min: 100,
        max: 900,
        step: 100,
    },
    // Trust Logo Text Typography
    trustLogoTextFontFamily: {
        type: ControlType.String,
        title: "Logo Text Font",
        defaultValue: "'Inter', sans-serif",
    },
    trustLogoTextFontSize: {
        type: ControlType.Number,
        title: "Logo Text Size",
        defaultValue: 13,
        min: 8,
        max: 28,
        step: 1,
    },
    trustLogoTextFontWeight: {
        type: ControlType.Number,
        title: "Logo Text Weight",
        defaultValue: 700,
        min: 100,
        max: 900,
        step: 100,
    },
    // CTA Typography
    ctaFontFamily: {
        type: ControlType.String,
        title: "CTA Font",
        defaultValue: "'Inter', sans-serif",
    },
    ctaFontSize: {
        type: ControlType.Number,
        title: "CTA Size",
        defaultValue: 15,
        min: 10,
        max: 28,
        step: 1,
    },
    ctaFontWeight: {
        type: ControlType.Number,
        title: "CTA Weight",
        defaultValue: 600,
        min: 100,
        max: 900,
        step: 100,
    },
})

export default BMR
