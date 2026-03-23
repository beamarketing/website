// Industry Page - Hero Section
// Two-column layout with floating animated cards
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"

interface LogoItem {
    image: string
    name: string
    height: number
}

interface FloatingCard {
    label: string
    image: string
}

interface Props {
    heading: string
    headingFontSize: number
    subheading: string
    ctaPrimaryText: string
    ctaPrimaryUrl: string
    ctaSecondaryText: string
    ctaSecondaryUrl: string
    showSecondaryButton: boolean
    showLogos: boolean
    logos: LogoItem[]
    logoHeight: number
    logoOpacity: number
    useColorOverlay: boolean
    logoColor: string
    floatingCards: FloatingCard[]
    floatIntensity: number
    floatSpeed: number
    bgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    cardBgColor: string
    fontFamily: string
    minHeight: number
    style?: React.CSSProperties
}

function IndustryHero(props: Props) {
    const {
        heading = "Video optimization for\nmedia & entertainment",
        headingFontSize = 56,
        subheading = "Reduce CDN and storage costs by 30-50% while maintaining broadcast quality. Trusted by Netflix, Paramount, and tier-1 platforms.",
        ctaPrimaryText = "See it in Action",
        ctaPrimaryUrl = "#",
        ctaSecondaryText = "Request a Demo",
        ctaSecondaryUrl = "#",
        showSecondaryButton = true,
        showLogos = true,
        logos = [],
        logoHeight = 24,
        logoOpacity = 0.5,
        useColorOverlay = false,
        logoColor = "#ffffff",
        floatingCards = [
            { label: "LIVE STREAM", image: "" },
            { label: "VOD", image: "" },
            { label: "4K CONTENT", image: "" },
        ],
        floatIntensity = 12,
        floatSpeed = 6,
        bgColor = "#07071c",
        textColor = "#ffffff",
        secondaryTextColor = "#8b8ba3",
        accentColor = "#00d46a",
        cardBgColor = "#0f1029",
        fontFamily = "'Inter', sans-serif",
        minHeight = 700,
        style,
    } = props

    const placeholderLogos = ["NVIDIA", "Dolby", "Netflix", "Paramount"]

    // Each floating card gets its own animation timing
    const cardConfigs = [
        { top: "0%", left: "50%", rotate: 3, delay: 0, width: "60%" },
        { top: "20%", left: "5%", rotate: -2, delay: 1.2, width: "62%" },
        { top: "48%", left: "35%", rotate: 1.5, delay: 2.4, width: "58%" },
    ]

    const animId = "ind-hero-float"

    return (
        <section
            style={{
                ...style,
                width: "100%",
                minHeight,
                backgroundColor: bgColor,
                padding: "100px 48px 80px",
                boxSizing: "border-box",
                fontFamily,
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Keyframe animations */}
            <style>{`
                @keyframes ${animId}-0 {
                    0%, 100% { transform: translateY(0px) rotate(${cardConfigs[0].rotate}deg); }
                    50% { transform: translateY(-${floatIntensity}px) rotate(${cardConfigs[0].rotate + 0.5}deg); }
                }
                @keyframes ${animId}-1 {
                    0%, 100% { transform: translateY(0px) rotate(${cardConfigs[1].rotate}deg); }
                    50% { transform: translateY(${floatIntensity}px) rotate(${cardConfigs[1].rotate - 0.5}deg); }
                }
                @keyframes ${animId}-2 {
                    0%, 100% { transform: translateY(0px) rotate(${cardConfigs[2].rotate}deg); }
                    50% { transform: translateY(-${floatIntensity * 0.8}px) rotate(${cardConfigs[2].rotate + 0.4}deg); }
                }
            `}</style>

            {/* Subtle gradient glow */}
            <div
                style={{
                    position: "absolute",
                    top: "-20%",
                    right: "-10%",
                    width: "70%",
                    height: "100%",
                    background: `radial-gradient(ellipse at center, ${accentColor}06 0%, transparent 70%)`,
                    pointerEvents: "none",
                }}
            />

            <div
                style={{
                    maxWidth: 1280,
                    margin: "0 auto",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 64,
                    alignItems: "center",
                    position: "relative",
                    zIndex: 1,
                    minHeight: minHeight - 180,
                }}
            >
                {/* Left: Text content */}
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    <h1
                        style={{
                            fontSize: headingFontSize,
                            fontWeight: 700,
                            color: textColor,
                            margin: "0 0 24px",
                            lineHeight: 1.1,
                            letterSpacing: "-0.02em",
                            fontFamily,
                            whiteSpace: "pre-line",
                        }}
                    >
                        {heading}
                    </h1>

                    <p
                        style={{
                            fontSize: 17,
                            color: secondaryTextColor,
                            margin: "0 0 36px",
                            maxWidth: 480,
                            lineHeight: 1.65,
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
                            gap: 14,
                            marginBottom: 48,
                            flexWrap: "wrap",
                        }}
                    >
                        <a
                            href={ctaPrimaryUrl}
                            style={{
                                backgroundColor: accentColor,
                                color: bgColor,
                                padding: "13px 28px",
                                borderRadius: 10,
                                fontSize: 15,
                                fontWeight: 600,
                                textDecoration: "none",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                fontFamily,
                            }}
                        >
                            {ctaPrimaryText}
                            <span style={{ fontSize: 17 }}>&#8594;</span>
                        </a>
                        {showSecondaryButton && (
                            <a
                                href={ctaSecondaryUrl}
                                style={{
                                    backgroundColor: "rgba(255,255,255,0.06)",
                                    color: textColor,
                                    padding: "13px 28px",
                                    borderRadius: 10,
                                    fontSize: 15,
                                    fontWeight: 500,
                                    textDecoration: "none",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 8,
                                    fontFamily,
                                }}
                            >
                                {ctaSecondaryText}
                                <span style={{ fontSize: 17 }}>&#8594;</span>
                            </a>
                        )}
                    </div>

                    {/* Logo bar */}
                    {showLogos && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 32,
                                flexWrap: "wrap",
                            }}
                        >
                            {logos.length > 0
                                ? logos.map((logo, i) => (
                                      <div
                                          key={i}
                                          style={{
                                              opacity: logoOpacity,
                                              display: "flex",
                                              alignItems: "center",
                                          }}
                                      >
                                          {logo.image ? (
                                              useColorOverlay ? (
                                                  <div
                                                      style={{
                                                          height: logo.height || logoHeight,
                                                          backgroundColor: logoColor,
                                                          WebkitMaskImage: `url(${logo.image})`,
                                                          maskImage: `url(${logo.image})`,
                                                          WebkitMaskSize: "contain",
                                                          maskSize: "contain",
                                                          WebkitMaskRepeat: "no-repeat",
                                                          maskRepeat: "no-repeat",
                                                          WebkitMaskPosition: "center",
                                                          maskPosition: "center",
                                                      }}
                                                  >
                                                      <img
                                                          src={logo.image}
                                                          alt={logo.name}
                                                          style={{
                                                              height: logo.height || logoHeight,
                                                              objectFit: "contain",
                                                              visibility: "hidden",
                                                          }}
                                                      />
                                                  </div>
                                              ) : (
                                                  <img
                                                      src={logo.image}
                                                      alt={logo.name}
                                                      style={{
                                                          height: logo.height || logoHeight,
                                                          objectFit: "contain",
                                                          filter: "brightness(0) invert(1)",
                                                      }}
                                                  />
                                              )
                                          ) : (
                                              <span
                                                  style={{
                                                      fontSize: (logo.height || logoHeight) * 0.65,
                                                      fontWeight: 600,
                                                      color: textColor,
                                                      fontFamily,
                                                      letterSpacing: "0.02em",
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
                                              fontSize: 15,
                                              fontWeight: 600,
                                              color: textColor,
                                              opacity: logoOpacity,
                                              fontFamily,
                                              letterSpacing: "0.02em",
                                          }}
                                      >
                                          {name}
                                      </span>
                                  ))}
                        </div>
                    )}
                </div>

                {/* Right: Floating cards */}
                <div
                    style={{
                        position: "relative",
                        height: "100%",
                        minHeight: 480,
                    }}
                >
                    {floatingCards.map((card, i) => {
                        const config = cardConfigs[i % cardConfigs.length]
                        return (
                            <div
                                key={i}
                                style={{
                                    position: "absolute",
                                    top: config.top,
                                    left: config.left,
                                    width: config.width,
                                    animation: `${animId}-${i % 3} ${floatSpeed + i * 0.8}s ease-in-out infinite`,
                                    animationDelay: `${config.delay}s`,
                                    zIndex: floatingCards.length - i,
                                }}
                            >
                                <div
                                    style={{
                                        backgroundColor: cardBgColor,
                                        borderRadius: 16,
                                        overflow: "hidden",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                                    }}
                                >
                                    {/* Label tag */}
                                    <div
                                        style={{
                                            padding: "12px 16px 0",
                                        }}
                                    >
                                        <span
                                            style={{
                                                display: "inline-block",
                                                fontSize: 10,
                                                fontWeight: 700,
                                                color: accentColor,
                                                letterSpacing: "0.1em",
                                                textTransform: "uppercase",
                                                backgroundColor: `${accentColor}12`,
                                                padding: "5px 10px",
                                                borderRadius: 6,
                                                fontFamily,
                                            }}
                                        >
                                            {card.label}
                                        </span>
                                    </div>

                                    {/* Image area */}
                                    <div
                                        style={{
                                            margin: "10px 12px 12px",
                                            aspectRatio: "16/10",
                                            borderRadius: 10,
                                            background: card.image
                                                ? `url(${card.image}) center/cover no-repeat`
                                                : "linear-gradient(135deg, #161638 0%, #1e1e50 100%)",
                                        }}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

addPropertyControls(IndustryHero, {
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "Video optimization for\nmedia & entertainment",
        displayTextArea: true,
    },
    headingFontSize: {
        type: ControlType.Number,
        title: "Heading Size",
        defaultValue: 56,
        min: 32,
        max: 96,
        step: 2,
    },
    subheading: {
        type: ControlType.String,
        title: "Subheading",
        defaultValue:
            "Reduce CDN and storage costs by 30-50% while maintaining broadcast quality. Trusted by Netflix, Paramount, and tier-1 platforms.",
        displayTextArea: true,
    },
    ctaPrimaryText: {
        type: ControlType.String,
        title: "Primary CTA",
        defaultValue: "See it in Action",
    },
    ctaPrimaryUrl: {
        type: ControlType.String,
        title: "Primary URL",
        defaultValue: "#",
    },
    showSecondaryButton: {
        type: ControlType.Boolean,
        title: "Show Secondary",
        defaultValue: true,
    },
    ctaSecondaryText: {
        type: ControlType.String,
        title: "Secondary CTA",
        defaultValue: "Request a Demo",
        hidden: (props) => !props.showSecondaryButton,
    },
    ctaSecondaryUrl: {
        type: ControlType.String,
        title: "Secondary URL",
        defaultValue: "#",
        hidden: (props) => !props.showSecondaryButton,
    },
    floatingCards: {
        type: ControlType.Array,
        title: "Floating Cards",
        maxCount: 5,
        control: {
            type: ControlType.Object,
            controls: {
                label: {
                    type: ControlType.String,
                    title: "Label",
                    defaultValue: "LABEL",
                },
                image: {
                    type: ControlType.Image,
                    title: "Image",
                },
            },
        },
        defaultValue: [
            { label: "LIVE STREAM", image: "" },
            { label: "VOD", image: "" },
            { label: "4K CONTENT", image: "" },
        ],
    },
    floatIntensity: {
        type: ControlType.Number,
        title: "Float Intensity",
        defaultValue: 12,
        min: 0,
        max: 40,
        step: 2,
    },
    floatSpeed: {
        type: ControlType.Number,
        title: "Float Speed (s)",
        defaultValue: 6,
        min: 2,
        max: 16,
        step: 0.5,
    },
    showLogos: {
        type: ControlType.Boolean,
        title: "Show Logos",
        defaultValue: true,
    },
    logos: {
        type: ControlType.Array,
        title: "Logos",
        maxCount: 8,
        hidden: (props) => !props.showLogos,
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
                    title: "Logo Image",
                },
                height: {
                    type: ControlType.Number,
                    title: "Height",
                    defaultValue: 24,
                    min: 8,
                    max: 60,
                },
            },
        },
        defaultValue: [
            { name: "NVIDIA", image: "", height: 24 },
            { name: "Dolby", image: "", height: 24 },
            { name: "Netflix", image: "", height: 24 },
            { name: "Paramount", image: "", height: 24 },
        ],
    },
    logoHeight: {
        type: ControlType.Number,
        title: "Logo Height",
        defaultValue: 24,
        min: 12,
        max: 60,
        step: 2,
        hidden: (props) => !props.showLogos,
    },
    logoOpacity: {
        type: ControlType.Number,
        title: "Logo Opacity",
        defaultValue: 0.5,
        min: 0.1,
        max: 1,
        step: 0.05,
        hidden: (props) => !props.showLogos,
    },
    useColorOverlay: {
        type: ControlType.Boolean,
        title: "Logo Color Overlay",
        defaultValue: false,
        hidden: (props) => !props.showLogos,
    },
    logoColor: {
        type: ControlType.Color,
        title: "Logo Color",
        defaultValue: "#ffffff",
        hidden: (props) => !props.showLogos || !props.useColorOverlay,
    },
    minHeight: {
        type: ControlType.Number,
        title: "Min Height",
        defaultValue: 700,
        min: 400,
        max: 1200,
        step: 20,
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#07071c",
    },
    cardBgColor: {
        type: ControlType.Color,
        title: "Card Background",
        defaultValue: "#0f1029",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#ffffff",
    },
    secondaryTextColor: {
        type: ControlType.Color,
        title: "Secondary Text",
        defaultValue: "#8b8ba3",
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

export default IndustryHero
