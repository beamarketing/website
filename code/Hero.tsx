// Beamr Homepage - Hero Section
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"

interface Props {
    badge: string
    showBadge: boolean
    heading: string
    subheading: string
    ctaPrimaryText: string
    ctaPrimaryUrl: string
    ctaSecondaryText: string
    ctaSecondaryUrl: string
    showSecondaryButton: boolean
    backgroundImage: string
    backgroundVideo: string
    useBackgroundVideo: boolean
    overlayOpacity: number
    bgColor: string
    textColor: string
    accentColor: string
    fontFamily: string
    headingFontSize: number
    minHeight: number
    style?: React.CSSProperties
}

function Hero(props: Props) {
    const {
        badge = "Trusted by 1,000+ companies worldwide",
        showBadge = true,
        heading = "Break the Video\nQuality-Cost-Time\nTrade-Off",
        subheading = "Beamr's AI-powered content-adaptive encoding optimizes your video quality while cutting costs by up to 50%. No compromises.",
        ctaPrimaryText = "Get Started",
        ctaPrimaryUrl = "#contact",
        ctaSecondaryText = "Watch Demo",
        ctaSecondaryUrl = "#demo",
        showSecondaryButton = true,
        backgroundImage = "",
        backgroundVideo = "",
        useBackgroundVideo = false,
        overlayOpacity = 0.7,
        bgColor = "#07071c",
        textColor = "#ffffff",
        accentColor = "#00d46a",
        fontFamily = "'Inter', sans-serif",
        headingFontSize = 64,
        minHeight = 720,
        style,
    } = props

    return (
        <section
            style={{
                ...style,
                width: "100%",
                minHeight,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                backgroundColor: bgColor,
                padding: "120px 48px 80px",
                boxSizing: "border-box",
                fontFamily,
                textAlign: "center",
            }}
        >
            {/* Background Media */}
            {useBackgroundVideo && backgroundVideo ? (
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    src={backgroundVideo}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        zIndex: 0,
                    }}
                />
            ) : backgroundImage ? (
                <img
                    src={backgroundImage}
                    alt=""
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        zIndex: 0,
                    }}
                />
            ) : null}

            {/* Overlay */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: bgColor,
                    opacity: backgroundImage || backgroundVideo ? overlayOpacity : 1,
                    zIndex: 1,
                }}
            />

            {/* Gradient Glow Effect */}
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 800,
                    height: 800,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${accentColor}08 0%, transparent 70%)`,
                    zIndex: 1,
                    pointerEvents: "none",
                }}
            />

            {/* Content */}
            <div
                style={{
                    position: "relative",
                    zIndex: 2,
                    maxWidth: 900,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 24,
                }}
            >
                {/* Badge */}
                {showBadge && (
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "8px 20px",
                            borderRadius: 100,
                            border: "1px solid rgba(255,255,255,0.1)",
                            backgroundColor: "rgba(255,255,255,0.04)",
                            fontSize: 14,
                            color: textColor,
                            opacity: 0.8,
                            fontFamily,
                            marginBottom: 8,
                        }}
                    >
                        <span
                            style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                backgroundColor: accentColor,
                            }}
                        />
                        {badge}
                    </div>
                )}

                {/* Heading */}
                <h1
                    style={{
                        fontSize: headingFontSize,
                        fontWeight: 700,
                        color: textColor,
                        lineHeight: 1.1,
                        margin: 0,
                        fontFamily,
                        whiteSpace: "pre-line",
                        letterSpacing: "-0.02em",
                    }}
                >
                    {heading}
                </h1>

                {/* Subheading */}
                <p
                    style={{
                        fontSize: 18,
                        color: textColor,
                        opacity: 0.65,
                        lineHeight: 1.6,
                        margin: 0,
                        maxWidth: 640,
                        fontFamily,
                    }}
                >
                    {subheading}
                </p>

                {/* CTA Buttons */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        marginTop: 16,
                    }}
                >
                    <a
                        href={ctaPrimaryUrl}
                        style={{
                            backgroundColor: accentColor,
                            color: "#07071c",
                            padding: "14px 32px",
                            borderRadius: 10,
                            fontSize: 16,
                            fontWeight: 600,
                            textDecoration: "none",
                            fontFamily,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        {ctaPrimaryText}
                        <span style={{ fontSize: 18 }}>&#8594;</span>
                    </a>
                    {showSecondaryButton && (
                        <a
                            href={ctaSecondaryUrl}
                            style={{
                                backgroundColor: "rgba(255,255,255,0.06)",
                                color: textColor,
                                padding: "14px 32px",
                                borderRadius: 10,
                                fontSize: 16,
                                fontWeight: 500,
                                textDecoration: "none",
                                border: "1px solid rgba(255,255,255,0.1)",
                                fontFamily,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            <span>&#9654;</span>
                            {ctaSecondaryText}
                        </a>
                    )}
                </div>
            </div>

            {/* Hero Visual / Preview */}
            <div
                style={{
                    position: "relative",
                    zIndex: 2,
                    marginTop: 56,
                    width: "100%",
                    maxWidth: 1000,
                    aspectRatio: "16/9",
                    borderRadius: 16,
                    border: "1px solid rgba(255,255,255,0.08)",
                    backgroundColor: "rgba(15,16,41,0.8)",
                    overflow: "hidden",
                    boxShadow: `0 40px 80px rgba(0,0,0,0.5), 0 0 120px ${accentColor}10`,
                }}
            >
                {/* Video Preview Placeholder */}
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: `linear-gradient(135deg, #0f1029 0%, #1a1b45 100%)`,
                    }}
                >
                    {/* Play Button */}
                    <div
                        style={{
                            width: 72,
                            height: 72,
                            borderRadius: "50%",
                            backgroundColor: accentColor,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                        }}
                    >
                        <span
                            style={{
                                fontSize: 28,
                                color: "#07071c",
                                marginLeft: 4,
                            }}
                        >
                            &#9654;
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}

addPropertyControls(Hero, {
    showBadge: {
        type: ControlType.Boolean,
        title: "Show Badge",
        defaultValue: true,
    },
    badge: {
        type: ControlType.String,
        title: "Badge Text",
        defaultValue: "Trusted by 1,000+ companies worldwide",
        hidden: (props) => !props.showBadge,
    },
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "Break the Video\nQuality-Cost-Time\nTrade-Off",
        displayTextArea: true,
    },
    headingFontSize: {
        type: ControlType.Number,
        title: "Heading Size",
        defaultValue: 64,
        min: 32,
        max: 96,
        step: 2,
    },
    subheading: {
        type: ControlType.String,
        title: "Subheading",
        defaultValue:
            "Beamr's AI-powered content-adaptive encoding optimizes your video quality while cutting costs by up to 50%. No compromises.",
        displayTextArea: true,
    },
    ctaPrimaryText: {
        type: ControlType.String,
        title: "Primary CTA",
        defaultValue: "Get Started",
    },
    ctaPrimaryUrl: {
        type: ControlType.String,
        title: "Primary URL",
        defaultValue: "#contact",
    },
    showSecondaryButton: {
        type: ControlType.Boolean,
        title: "Show Secondary",
        defaultValue: true,
    },
    ctaSecondaryText: {
        type: ControlType.String,
        title: "Secondary CTA",
        defaultValue: "Watch Demo",
        hidden: (props) => !props.showSecondaryButton,
    },
    ctaSecondaryUrl: {
        type: ControlType.String,
        title: "Secondary URL",
        defaultValue: "#demo",
        hidden: (props) => !props.showSecondaryButton,
    },
    useBackgroundVideo: {
        type: ControlType.Boolean,
        title: "Use Video BG",
        defaultValue: false,
    },
    backgroundVideo: {
        type: ControlType.File,
        title: "BG Video",
        allowedFileTypes: ["mp4", "webm"],
        hidden: (props) => !props.useBackgroundVideo,
    },
    backgroundImage: {
        type: ControlType.Image,
        title: "BG Image",
        hidden: (props) => props.useBackgroundVideo,
    },
    overlayOpacity: {
        type: ControlType.Number,
        title: "Overlay Opacity",
        defaultValue: 0.7,
        min: 0,
        max: 1,
        step: 0.05,
    },
    minHeight: {
        type: ControlType.Number,
        title: "Min Height",
        defaultValue: 720,
        min: 400,
        max: 1200,
        step: 10,
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#07071c",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#ffffff",
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "#00d46a",
    },
    fontFamily: {
        type: ControlType.String,
        title: "Font Family",
        defaultValue: "'Inter', sans-serif",
    },
})

export default Hero
