// AV Landing Page - Hero Section
// Two-column layout with sonar-animated rings around a car image
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"

interface Props {
    heading: string
    headingFontSize: number
    subheading: string
    ctaText: string
    ctaUrl: string
    carImage: string
    ringCount: number
    ringColor: string
    ringSpeed: number
    bgColor: string
    textColor: string
    secondaryTextColor: string
    ctaBgColor: string
    ctaTextColor: string
    fontFamily: string
    textColumnWidth: number
    minHeight: number
    style?: React.CSSProperties
}

const generateKeyframes = (id: string, ringCount: number, ringSpeed: number) => {
    let css = ""
    for (let i = 0; i < ringCount; i++) {
        const name = `${id}-sonar-${i}`
        css += `
@keyframes ${name} {
    0% {
        transform: translate(-50%, -50%) scale(0.6);
        opacity: 0.7;
    }
    100% {
        transform: translate(-50%, -50%) scale(${1 + i * 0.35});
        opacity: 0;
    }
}
`
    }

    css += `
@keyframes ${id}-sonar-pulse {
    0% {
        transform: translate(-50%, -50%) scale(0.5);
        opacity: 0;
    }
    10% {
        opacity: 0.6;
    }
    100% {
        transform: translate(-50%, -50%) scale(2.8);
        opacity: 0;
    }
}
`

    css += `
@keyframes ${id}-glow {
    0%, 100% {
        opacity: 0.3;
    }
    50% {
        opacity: 0.6;
    }
}
`
    return css
}

function AVHero(props: Props) {
    const {
        heading = "Steering AV\nData Flood",
        headingFontSize = 64,
        subheading = "Cut Costs by up to 50% and Accelerate Video\nAnalysis to Unlock Hidden Value in Your AV Model",
        ctaText = "Schedule 1 on 1 Meeting",
        ctaUrl = "#",
        carImage = "",
        ringCount = 5,
        ringColor = "#2E7CF6",
        ringSpeed = 3,
        bgColor = "#07071c",
        textColor = "#ffffff",
        secondaryTextColor = "#c2c2d6",
        ctaBgColor = "#2E7CF6",
        ctaTextColor = "#ffffff",
        fontFamily = "'Inter', sans-serif",
        textColumnWidth = 50,
        minHeight = 600,
        style,
    } = props

    const animId = "av-hero"
    const totalDuration = ringSpeed

    const rings = Array.from({ length: ringCount }, (_, i) => i)

    const placeholderCar = "data:image/svg+xml," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" fill="none">
  <rect x="80" y="60" width="140" height="280" rx="40" fill="#e0e0e0"/>
  <rect x="95" y="80" width="110" height="100" rx="10" fill="#555"/>
  <rect x="95" y="220" width="110" height="80" rx="10" fill="#bbb"/>
  <circle cx="110" cy="340" r="18" fill="#333"/>
  <circle cx="190" cy="340" r="18" fill="#333"/>
  <circle cx="110" cy="70" r="18" fill="#333"/>
  <circle cx="190" cy="70" r="18" fill="#333"/>
  <rect x="70" y="150" width="20" height="40" rx="5" fill="#ccc"/>
  <rect x="210" y="150" width="20" height="40" rx="5" fill="#ccc"/>
</svg>
`)

    return (
        <section
            style={{
                ...style,
                width: "100%",
                minHeight,
                backgroundColor: bgColor,
                padding: "80px 48px",
                boxSizing: "border-box",
                fontFamily,
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <style>{generateKeyframes(animId, ringCount, ringSpeed)}</style>

            {/* Subtle grid background */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
                    `,
                    backgroundSize: "60px 60px",
                    pointerEvents: "none",
                }}
            />

            {/* Left column - Text */}
            <div
                style={{
                    position: "relative",
                    zIndex: 2,
                    width: "100%",
                    maxWidth: 1280,
                    margin: "0 auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 24,
                    paddingRight: `${100 - textColumnWidth}%`,
                }}
            >
                <h1
                    style={{
                        fontSize: headingFontSize,
                        fontWeight: 800,
                        lineHeight: 1.05,
                        color: textColor,
                        margin: 0,
                        letterSpacing: "-0.02em",
                        whiteSpace: "pre-line",
                    }}
                >
                    {heading}
                </h1>

                <p
                    style={{
                        fontSize: 18,
                        lineHeight: 1.6,
                        color: secondaryTextColor,
                        margin: 0,
                        maxWidth: 440,
                        whiteSpace: "pre-line",
                    }}
                >
                    {subheading}
                </p>

                <div style={{ marginTop: 8 }}>
                    <a
                        href={ctaUrl}
                        style={{
                            display: "inline-block",
                            padding: "16px 32px",
                            backgroundColor: ctaBgColor,
                            color: ctaTextColor,
                            fontSize: 16,
                            fontWeight: 600,
                            fontFamily,
                            textDecoration: "none",
                            borderRadius: 6,
                            border: "none",
                            cursor: "pointer",
                            transition: "opacity 0.2s ease",
                        }}
                    >
                        {ctaText}
                    </a>
                </div>
            </div>

            {/* Right side - Car with sonar rings, anchored to right edge and cropped */}
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    right: 0,
                    transform: "translateY(-50%)",
                    width: 600,
                    height: 600,
                    zIndex: 1,
                }}
            >
                {/* Static rings (always visible, subtle) */}
                {rings.map((i) => {
                    const size = 200 + i * 100
                    return (
                        <div
                            key={`static-${i}`}
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                width: size,
                                height: size,
                                borderRadius: "50%",
                                border: `1.5px solid ${ringColor}`,
                                opacity: 0.12 - i * 0.015,
                                transform: "translate(-50%, -50%)",
                                pointerEvents: "none",
                            }}
                        />
                    )
                })}

                {/* Animated sonar pulses */}
                {[0, 1, 2].map((i) => (
                    <div
                        key={`pulse-${i}`}
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            width: 200,
                            height: 200,
                            borderRadius: "50%",
                            border: `2px solid ${ringColor}`,
                            opacity: 0,
                            animation: `${animId}-sonar-pulse ${totalDuration}s ease-out ${i * (totalDuration / 3)}s infinite`,
                            pointerEvents: "none",
                        }}
                    />
                ))}

                {/* Center glow */}
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        width: 300,
                        height: 300,
                        borderRadius: "50%",
                        background: `radial-gradient(circle, ${ringColor}22 0%, transparent 70%)`,
                        transform: "translate(-50%, -50%)",
                        animation: `${animId}-glow 4s ease-in-out infinite`,
                        pointerEvents: "none",
                    }}
                />

                {/* Car image */}
                <img
                    src={carImage || placeholderCar}
                    alt="Autonomous vehicle"
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 2,
                        width: "auto",
                        maxWidth: 280,
                        maxHeight: 400,
                        objectFit: "contain",
                        filter: "drop-shadow(0 0 40px rgba(46, 124, 246, 0.3))",
                    }}
                />
            </div>
        </section>
    )
}

AVHero.defaultProps = {
    heading: "Steering AV\nData Flood",
    headingFontSize: 64,
    subheading: "Cut Costs by up to 50% and Accelerate Video\nAnalysis to Unlock Hidden Value in Your AV Model",
    ctaText: "Schedule 1 on 1 Meeting",
    ctaUrl: "#",
    carImage: "",
    ringCount: 5,
    ringColor: "#2E7CF6",
    ringSpeed: 3,
    bgColor: "#07071c",
    textColor: "#ffffff",
    secondaryTextColor: "#c2c2d6",
    ctaBgColor: "#2E7CF6",
    ctaTextColor: "#ffffff",
    fontFamily: "'Inter', sans-serif",
    textColumnWidth: 50,
    minHeight: 600,
}

addPropertyControls(AVHero, {
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "Steering AV\nData Flood",
        displayTextArea: true,
    },
    headingFontSize: {
        type: ControlType.Number,
        title: "Heading Size",
        defaultValue: 64,
        min: 32,
        max: 120,
        step: 2,
    },
    subheading: {
        type: ControlType.String,
        title: "Subheading",
        defaultValue:
            "Cut Costs by up to 50% and Accelerate Video\nAnalysis to Unlock Hidden Value in Your AV Model",
        displayTextArea: true,
    },
    ctaText: {
        type: ControlType.String,
        title: "Button Text",
        defaultValue: "Schedule 1 on 1 Meeting",
    },
    ctaUrl: {
        type: ControlType.String,
        title: "Button URL",
        defaultValue: "#",
    },
    carImage: {
        type: ControlType.Image,
        title: "Car Image",
    },
    ringCount: {
        type: ControlType.Number,
        title: "Ring Count",
        defaultValue: 5,
        min: 3,
        max: 8,
        step: 1,
    },
    ringColor: {
        type: ControlType.Color,
        title: "Ring Color",
        defaultValue: "#2E7CF6",
    },
    ringSpeed: {
        type: ControlType.Number,
        title: "Sonar Speed (s)",
        defaultValue: 3,
        min: 1,
        max: 8,
        step: 0.5,
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
    secondaryTextColor: {
        type: ControlType.Color,
        title: "Subtitle Color",
        defaultValue: "#c2c2d6",
    },
    ctaBgColor: {
        type: ControlType.Color,
        title: "Button Background",
        defaultValue: "#2E7CF6",
    },
    ctaTextColor: {
        type: ControlType.Color,
        title: "Button Text Color",
        defaultValue: "#ffffff",
    },
    fontFamily: {
        type: ControlType.String,
        title: "Font Family",
        defaultValue: "'Inter', sans-serif",
    },
    textColumnWidth: {
        type: ControlType.Number,
        title: "Text Width (%)",
        defaultValue: 50,
        min: 30,
        max: 70,
        step: 5,
        unit: "%",
    },
    minHeight: {
        type: ControlType.Number,
        title: "Min Height",
        defaultValue: 600,
        min: 400,
        max: 1000,
        step: 50,
    },
})

export default AVHero
