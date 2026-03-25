// Product Page - Hero Section
// Two-column layout with floating pills and encoder UI preview
// Framer Code Component with full property controls

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
    heroImage: string
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
    fontFamily: string
    headingFontFamily: string
    minHeight: number
    floatIntensity: number
    floatSpeed: number
    style?: React.CSSProperties
}

function ProductHero(props: Props) {
    const {
        heading = "As Seen on a Big\nScreen Near You.",
        headingFontSize = 72,
        subheading = "Beamr 5 is the fastest, best-of-class HEVC encoder trusted by streaming giants",
        ctaText = "Book a Demo",
        ctaUrl = "#",
        heroImage = "",
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
        fontFamily = "'Inter', sans-serif",
        headingFontFamily = "'Poppins', sans-serif",
        minHeight = 500,
        floatIntensity = 8,
        floatSpeed = 5,
        style,
    } = props

    const animId = "prod-hero-float"

    // Pill positions — exact pixel values relative to the 730x410 outer frame
    const pillConfigs = [
        { top: 292, left: 145, delay: 0 },
        { top: 385, left: 209, delay: 1.2 },
        { top: 321, left: 286, delay: 0.6 },
    ]

    return (
        <section
            style={{
                ...style,
                width: "100%",
                minHeight,
                backgroundColor: bgColor,
                padding: "64px 160px",
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
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 48,
                    maxWidth: 1280,
                    margin: "0 auto",
                    minHeight: Math.max(minHeight - 128, 400),
                }}
            >
                {/* Left: Text Content */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: 0,
                        maxWidth: 500,
                        flexShrink: 0,
                    }}
                >
                    {/* Heading */}
                    <h1
                        style={{
                            fontSize: headingFontSize,
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

                    {/* Subheading */}
                    <p
                        style={{
                            fontSize: 18,
                            fontWeight: 500,
                            color: secondaryTextColor,
                            margin: "0 0 32px",
                            lineHeight: "28px",
                            fontFamily: headingFontFamily,
                        }}
                    >
                        {subheading}
                    </p>

                    {/* CTA Button */}
                    <a
                        href={ctaUrl}
                        style={{
                            backgroundColor: ctaBgColor,
                            color: ctaTextColor,
                            padding: "16px 24px",
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

                {/* Right: Floating Cards / Encoder Preview */}
                <div
                    style={{
                        position: "relative",
                        width: 778,
                        height: 458,
                        flexShrink: 0,
                        background: bgColor,
                    }}
                >
                    {/* Small accent card (top-right area) */}
                    <div
                        style={{
                            position: "absolute",
                            width: 172,
                            height: 102,
                            left: 598,
                            top: 239,
                            background: cardBgColor,
                            boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.08)",
                            borderRadius: 8,
                        }}
                    />

                    {/* Outer frame (730x410) — pills & stat card positioned relative to this */}
                    <div
                        style={{
                            position: "absolute",
                            width: 730,
                            height: 410,
                            left: 24,
                            top: 24,
                            borderRadius: 12,
                        }}
                    >
                        {/* Inner card with image/overlay */}
                        <div
                            style={{
                                position: "absolute",
                                width: 578,
                                height: 353,
                                left: 42,
                                top: 14,
                                borderRadius: 12,
                                background: heroImage
                                    ? `url(${heroImage}) center/cover no-repeat`
                                    : cardOverlayColor,
                            }}
                        >
                            {heroImage && (
                                <div
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        background: cardOverlayColor,
                                        borderRadius: 12,
                                    }}
                                />
                            )}
                        </div>

                        {/* Floating Pills — positioned relative to 730x410 frame */}
                        {showPills &&
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
                                            zIndex: 2,
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
                        {showStatCard && (
                            <div
                                style={{
                                    position: "absolute",
                                    left: -55.63,
                                    top: 124,
                                    padding: "14px 18px",
                                    background: "#ECEDF2",
                                    borderRadius: 12,
                                    display: "inline-flex",
                                    flexDirection: "column",
                                    gap: 4,
                                    zIndex: 3,
                                    animation: `${animId}-1 ${floatSpeed + 1.5}s ease-in-out infinite`,
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
                    </div>
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
    heroImage: {
        type: ControlType.Image,
        title: "Hero Image",
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
        title: "Card Background",
        defaultValue: "#EBECF6",
    },
    cardOverlayColor: {
        type: ControlType.String,
        title: "Card Overlay",
        defaultValue: "rgba(196, 198, 214, 0.9)",
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
