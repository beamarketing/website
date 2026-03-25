// Product Page - Hero Section
// Two-column layout with side-by-side A/B video comparison and floating pills
// Framer Code Component with full property controls

import React, { useRef, useState, useEffect } from "react"
import { addPropertyControls, ControlType } from "framer"

interface PillItem {
    label: string
}

interface Props {
    heading: string
    headingFontSize: number
    subheading: string
    ctaText: string
    ctaUrl: string
    videoA: string
    videoB: string
    imageA: string
    imageB: string
    useVideo: boolean
    labelA: string
    labelB: string
    bitrateA: string
    bitrateB: string
    pills: PillItem[]
    showPills: boolean
    showStatCard: boolean
    statCardValue: string
    statCardLabel: string
    bgColor: string
    textColor: string
    secondaryTextColor: string
    ctaBgColor: string
    ctaTextColor: string
    cardBgColor: string
    cardOverlayColor: string
    pillBgColor: string
    pillTextColor: string
    labelBgColor: string
    fontFamily: string
    headingFontFamily: string
    minHeight: number
    floatIntensity: number
    floatSpeed: number
    comparisonGap: number
    comparisonRadius: number
    style?: React.CSSProperties
}

function ProductHero(props: Props) {
    const {
        heading = "As Seen on a Big\nScreen Near You.",
        headingFontSize = 72,
        subheading = "Beamr 5 is the fastest, best-of-class HEVC encoder trusted by streaming giants",
        ctaText = "Book a Demo",
        ctaUrl = "#",
        videoA = "",
        videoB = "",
        imageA = "",
        imageB = "",
        useVideo = false,
        labelA = "Original",
        labelB = "Beamr Optimized",
        bitrateA = "15 Mbps",
        bitrateB = "7.5 Mbps",
        pills = [
            { label: "Frame Analysis" },
            { label: "CABR\u2122 Active" },
            { label: "Codec: HEVC" },
        ],
        showPills = true,
        showStatCard = true,
        statCardValue = "50%",
        statCardLabel = "Bitrate Savings",
        bgColor = "#ffffff",
        textColor = "#171717",
        secondaryTextColor = "#666666",
        ctaBgColor = "#141414",
        ctaTextColor = "#ffffff",
        cardBgColor = "#EBECF6",
        cardOverlayColor = "rgba(196, 198, 214, 0.9)",
        pillBgColor = "#C3C5D4",
        pillTextColor = "#F5F5F5",
        labelBgColor = "rgba(0, 0, 0, 0.6)",
        fontFamily = "'Inter', sans-serif",
        headingFontFamily = "'Poppins', sans-serif",
        minHeight = 500,
        floatIntensity = 8,
        floatSpeed = 5,
        comparisonGap = 4,
        comparisonRadius = 12,
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
    const animId = "prod-hero-float"

    // Pill positions — percentage-based for responsiveness
    const pillConfigs = [
        { top: "71%", left: "20%", delay: 0 },
        { top: "94%", left: "29%", delay: 1.2 },
        { top: "78%", left: "39%", delay: 0.6 },
    ]

    // Responsive values
    const sectionPadding = isMobile
        ? "48px 20px"
        : isTablet
          ? "56px 32px"
          : "64px 80px"

    const headingSizeResp = isMobile
        ? Math.min(headingFontSize, 40)
        : isTablet
          ? Math.min(headingFontSize, 52)
          : headingFontSize

    // Renders one side of the A/B comparison
    const renderPanel = (
        side: "a" | "b",
        video: string,
        image: string,
        label: string,
        bitrate: string
    ) => {
        const hasVideo = useVideo && !!video
        const hasImage = !useVideo && !!image

        return (
            <div
                style={{
                    flex: 1,
                    borderRadius: comparisonRadius,
                    overflow: "hidden",
                    position: "relative",
                    background: cardOverlayColor,
                    aspectRatio: "16 / 10",
                }}
            >
                {/* Media */}
                {hasVideo ? (
                    <video
                        src={video}
                        autoPlay
                        muted
                        loop
                        playsInline
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                        }}
                    />
                ) : hasImage ? (
                    <img
                        src={image}
                        alt={label}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                        }}
                    />
                ) : (
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            background:
                                side === "a"
                                    ? "linear-gradient(135deg, #c4c6d6 0%, #aaacbf 100%)"
                                    : "linear-gradient(135deg, #d0d1de 0%, #b8bad0 100%)",
                        }}
                    />
                )}

                {/* Label badge */}
                <div
                    style={{
                        position: "absolute",
                        top: isMobile ? 8 : 12,
                        left: isMobile ? 8 : 12,
                        padding: isMobile ? "3px 8px" : "4px 10px",
                        background: labelBgColor,
                        borderRadius: 6,
                        fontSize: isMobile ? 9 : 11,
                        fontWeight: 600,
                        color: "#fff",
                        fontFamily,
                        letterSpacing: "0.3px",
                    }}
                >
                    {label}
                </div>

                {/* Bitrate badge */}
                {bitrate && (
                    <div
                        style={{
                            position: "absolute",
                            bottom: isMobile ? 8 : 12,
                            left: isMobile ? 8 : 12,
                            padding: isMobile ? "3px 8px" : "4px 10px",
                            background: labelBgColor,
                            borderRadius: 6,
                            fontSize: isMobile ? 9 : 10,
                            fontWeight: 500,
                            color: "rgba(255,255,255,0.85)",
                            fontFamily,
                            fontVariantNumeric: "tabular-nums",
                        }}
                    >
                        {bitrate}
                    </div>
                )}
            </div>
        )
    }

    return (
        <section
            ref={containerRef}
            style={{
                ...style,
                width: "100%",
                minHeight: isCompact ? "auto" : minHeight,
                backgroundColor: bgColor,
                padding: sectionPadding,
                boxSizing: "border-box",
                fontFamily,
                overflow: "hidden",
            }}
        >
            {/* Float animations */}
            <style>{`
                @keyframes ${animId}-0 {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-${floatIntensity}px); }
                }
                @keyframes ${animId}-1 {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(${floatIntensity * 0.7}px); }
                }
                @keyframes ${animId}-2 {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-${floatIntensity * 0.5}px); }
                }
            `}</style>

            <div
                style={{
                    display: "flex",
                    flexDirection: isCompact ? "column" : "row",
                    alignItems: isCompact ? "stretch" : "center",
                    justifyContent: "space-between",
                    gap: isMobile ? 32 : isTablet ? 40 : 48,
                    maxWidth: 1280,
                    margin: "0 auto",
                }}
            >
                {/* Left: Text Content */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        maxWidth: isCompact ? "100%" : 500,
                        flexShrink: 0,
                    }}
                >
                    <h1
                        style={{
                            fontSize: headingSizeResp,
                            fontWeight: 500,
                            color: textColor,
                            margin: "0 0 20px",
                            lineHeight: 1.04,
                            fontFamily: headingFontFamily,
                            whiteSpace: "pre-line",
                        }}
                    >
                        {heading}
                    </h1>

                    <p
                        style={{
                            fontSize: isMobile ? 16 : 18,
                            fontWeight: 500,
                            color: secondaryTextColor,
                            margin: "0 0 32px",
                            lineHeight: "28px",
                            fontFamily: headingFontFamily,
                            maxWidth: isCompact ? 520 : undefined,
                        }}
                    >
                        {subheading}
                    </p>

                    <a
                        href={ctaUrl}
                        style={{
                            backgroundColor: ctaBgColor,
                            color: ctaTextColor,
                            padding: isMobile ? "14px 20px" : "16px 24px",
                            borderRadius: 8,
                            fontSize: 16,
                            fontWeight: 400,
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            fontFamily,
                            lineHeight: "24px",
                        }}
                    >
                        {ctaText}
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            style={{ flexShrink: 0 }}
                        >
                            <path
                                d="M6 3.33L10.67 8L6 12.67"
                                stroke={ctaTextColor}
                                strokeWidth="1.33"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </a>
                </div>

                {/* Right: Side-by-side A/B comparison with floating elements */}
                <div
                    style={{
                        position: "relative",
                        width: isCompact ? "100%" : "55%",
                        flexShrink: 1,
                        flexGrow: 1,
                    }}
                >
                    {/* Small accent card (behind, offset) */}
                    {!isMobile && (
                        <div
                            style={{
                                position: "absolute",
                                width: "23%",
                                height: "22%",
                                right: 0,
                                bottom: "-4%",
                                background: cardBgColor,
                                boxShadow:
                                    "0px 4px 24px rgba(0, 0, 0, 0.08)",
                                borderRadius: 8,
                                zIndex: 0,
                            }}
                        />
                    )}

                    {/* A/B panels wrapper */}
                    <div
                        style={{
                            position: "relative",
                            display: "flex",
                            gap: comparisonGap,
                            borderRadius: comparisonRadius,
                            overflow: "hidden",
                            background: cardBgColor,
                            padding: comparisonGap,
                            zIndex: 1,
                        }}
                    >
                        {renderPanel("a", videoA, imageA, labelA, bitrateA)}
                        {renderPanel("b", videoB, imageB, labelB, bitrateB)}
                    </div>

                    {/* Floating Pills — positioned over comparison area */}
                    {showPills &&
                        !isMobile &&
                        pills.map((pill, i) => {
                            const config =
                                pillConfigs[i % pillConfigs.length]
                            return (
                                <div
                                    key={i}
                                    style={{
                                        position: "absolute",
                                        top: config.top,
                                        left: config.left,
                                        height: 24,
                                        paddingLeft: 12,
                                        paddingRight: 12,
                                        paddingTop: 5,
                                        paddingBottom: 5,
                                        background: pillBgColor,
                                        borderRadius: 50,
                                        backdropFilter: "blur(20px)",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        animation: `${animId}-${i % 3} ${floatSpeed + i * 0.8}s ease-in-out infinite`,
                                        animationDelay: `${config.delay}s`,
                                        zIndex: 6,
                                        pointerEvents: "none",
                                    }}
                                >
                                    <span
                                        style={{
                                            color: pillTextColor,
                                            fontSize: 10,
                                            fontWeight: 600,
                                            letterSpacing: "0.3px",
                                            fontFamily,
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {pill.label}
                                    </span>
                                </div>
                            )
                        })}

                    {/* Stat card (overlapping left edge) */}
                    {showStatCard && !isMobile && (
                        <div
                            style={{
                                position: "absolute",
                                left: isTablet ? -20 : -40,
                                top: "27%",
                                padding: "14px 18px",
                                background: "#ECEDF2",
                                borderRadius: 12,
                                display: "inline-flex",
                                flexDirection: "column",
                                gap: 4,
                                zIndex: 7,
                                animation: `${animId}-1 ${floatSpeed + 1.5}s ease-in-out infinite`,
                                pointerEvents: "none",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: 24,
                                    fontWeight: 700,
                                    color: textColor,
                                    fontFamily,
                                    lineHeight: 1.2,
                                }}
                            >
                                {statCardValue}
                            </span>
                            <span
                                style={{
                                    fontSize: 11,
                                    fontWeight: 500,
                                    color: secondaryTextColor,
                                    fontFamily,
                                }}
                            >
                                {statCardLabel}
                            </span>
                        </div>
                    )}

                    {/* Mobile: inline pills row */}
                    {showPills && isMobile && (
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 8,
                                marginTop: 12,
                            }}
                        >
                            {pills.map((pill, i) => (
                                <div
                                    key={i}
                                    style={{
                                        height: 24,
                                        paddingLeft: 12,
                                        paddingRight: 12,
                                        paddingTop: 5,
                                        paddingBottom: 5,
                                        background: pillBgColor,
                                        borderRadius: 50,
                                        display: "inline-flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <span
                                        style={{
                                            color: pillTextColor,
                                            fontSize: 10,
                                            fontWeight: 600,
                                            letterSpacing: "0.3px",
                                            fontFamily,
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {pill.label}
                                    </span>
                                </div>
                            ))}
                            {showStatCard && (
                                <div
                                    style={{
                                        padding: "5px 12px",
                                        background: "#ECEDF2",
                                        borderRadius: 50,
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 6,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: 12,
                                            fontWeight: 700,
                                            color: textColor,
                                            fontFamily,
                                        }}
                                    >
                                        {statCardValue}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: 10,
                                            fontWeight: 500,
                                            color: secondaryTextColor,
                                            fontFamily,
                                        }}
                                    >
                                        {statCardLabel}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

addPropertyControls(ProductHero, {
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "As Seen on a Big\nScreen Near You.",
        displayTextArea: true,
    },
    headingFontSize: {
        type: ControlType.Number,
        title: "Heading Size",
        defaultValue: 72,
        min: 32,
        max: 120,
        step: 2,
    },
    subheading: {
        type: ControlType.String,
        title: "Subheading",
        defaultValue:
            "Beamr 5 is the fastest, best-of-class HEVC encoder trusted by streaming giants",
        displayTextArea: true,
    },
    ctaText: {
        type: ControlType.String,
        title: "CTA Text",
        defaultValue: "Book a Demo",
    },
    ctaUrl: {
        type: ControlType.String,
        title: "CTA URL",
        defaultValue: "#",
    },
    useVideo: {
        type: ControlType.Boolean,
        title: "Use Video",
        defaultValue: false,
    },
    videoA: {
        type: ControlType.File,
        title: "Video A (Original)",
        allowedFileTypes: ["mp4", "webm"],
        hidden: (props) => !props.useVideo,
    },
    videoB: {
        type: ControlType.File,
        title: "Video B (Optimized)",
        allowedFileTypes: ["mp4", "webm"],
        hidden: (props) => !props.useVideo,
    },
    imageA: {
        type: ControlType.Image,
        title: "Image A (Original)",
        hidden: (props) => props.useVideo,
    },
    imageB: {
        type: ControlType.Image,
        title: "Image B (Optimized)",
        hidden: (props) => props.useVideo,
    },
    labelA: {
        type: ControlType.String,
        title: "Label A",
        defaultValue: "Original",
    },
    labelB: {
        type: ControlType.String,
        title: "Label B",
        defaultValue: "Beamr Optimized",
    },
    bitrateA: {
        type: ControlType.String,
        title: "Bitrate A",
        defaultValue: "15 Mbps",
    },
    bitrateB: {
        type: ControlType.String,
        title: "Bitrate B",
        defaultValue: "7.5 Mbps",
    },
    showPills: {
        type: ControlType.Boolean,
        title: "Show Pills",
        defaultValue: true,
    },
    pills: {
        type: ControlType.Array,
        title: "Pills",
        maxCount: 6,
        hidden: (props) => !props.showPills,
        control: {
            type: ControlType.Object,
            controls: {
                label: {
                    type: ControlType.String,
                    title: "Label",
                    defaultValue: "Label",
                },
            },
        },
        defaultValue: [
            { label: "Frame Analysis" },
            { label: "CABR\u2122 Active" },
            { label: "Codec: HEVC" },
        ],
    },
    showStatCard: {
        type: ControlType.Boolean,
        title: "Show Stat Card",
        defaultValue: true,
    },
    statCardValue: {
        type: ControlType.String,
        title: "Stat Value",
        defaultValue: "50%",
        hidden: (props) => !props.showStatCard,
    },
    statCardLabel: {
        type: ControlType.String,
        title: "Stat Label",
        defaultValue: "Bitrate Savings",
        hidden: (props) => !props.showStatCard,
    },
    floatIntensity: {
        type: ControlType.Number,
        title: "Float Intensity",
        defaultValue: 8,
        min: 0,
        max: 30,
        step: 1,
    },
    floatSpeed: {
        type: ControlType.Number,
        title: "Float Speed (s)",
        defaultValue: 5,
        min: 2,
        max: 16,
        step: 0.5,
    },
    comparisonGap: {
        type: ControlType.Number,
        title: "Panel Gap",
        defaultValue: 4,
        min: 0,
        max: 16,
        step: 1,
    },
    comparisonRadius: {
        type: ControlType.Number,
        title: "Panel Radius",
        defaultValue: 12,
        min: 0,
        max: 24,
        step: 2,
    },
    minHeight: {
        type: ControlType.Number,
        title: "Min Height",
        defaultValue: 500,
        min: 300,
        max: 1000,
        step: 20,
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#ffffff",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#171717",
    },
    secondaryTextColor: {
        type: ControlType.Color,
        title: "Secondary Text",
        defaultValue: "#666666",
    },
    ctaBgColor: {
        type: ControlType.Color,
        title: "CTA Background",
        defaultValue: "#141414",
    },
    ctaTextColor: {
        type: ControlType.Color,
        title: "CTA Text Color",
        defaultValue: "#ffffff",
    },
    cardBgColor: {
        type: ControlType.Color,
        title: "Panel Frame BG",
        defaultValue: "#EBECF6",
    },
    cardOverlayColor: {
        type: ControlType.String,
        title: "Panel Placeholder BG",
        defaultValue: "rgba(196, 198, 214, 0.9)",
    },
    labelBgColor: {
        type: ControlType.String,
        title: "Label BG",
        defaultValue: "rgba(0, 0, 0, 0.6)",
    },
    pillBgColor: {
        type: ControlType.Color,
        title: "Pill Background",
        defaultValue: "#C3C5D4",
    },
    pillTextColor: {
        type: ControlType.Color,
        title: "Pill Text Color",
        defaultValue: "#F5F5F5",
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
})

export default ProductHero
