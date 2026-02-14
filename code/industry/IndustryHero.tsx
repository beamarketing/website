// Industry Page - Hero Section
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"

interface LogoItem {
    image: string
    name: string
    height: number
}

interface Props {
    badge: string
    badgeIcon: string
    showBadge: boolean
    heading: string
    headingFontSize: number
    subheading: string
    ctaPrimaryText: string
    ctaPrimaryUrl: string
    ctaSecondaryText: string
    ctaSecondaryUrl: string
    showSecondaryButton: boolean
    showLogos: boolean
    logoTitle: string
    logos: LogoItem[]
    logoHeight: number
    logoOpacity: number
    useColorOverlay: boolean
    logoColor: string
    heroImage1: string
    heroImage2: string
    bgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    fontFamily: string
    minHeight: number
    style?: React.CSSProperties
}

function IndustryHero(props: Props) {
    const {
        badge = "MEDIA & ENTERTAINMENT",
        badgeIcon = "🎬",
        showBadge = true,
        heading = "Video optimization for\nmedia & entertainment",
        headingFontSize = 64,
        subheading = "Reduce video bitrate by up to 50% while maintaining pristine quality. Purpose-built for the world's most demanding media workflows.",
        ctaPrimaryText = "Start Free Trial",
        ctaPrimaryUrl = "#",
        ctaSecondaryText = "Schedule Demo",
        ctaSecondaryUrl = "#",
        showSecondaryButton = true,
        showLogos = true,
        logoTitle = "Trusted by leading media companies",
        logos = [],
        logoHeight = 28,
        logoOpacity = 0.5,
        useColorOverlay = false,
        logoColor = "#ffffff",
        heroImage1 = "",
        heroImage2 = "",
        bgColor = "#07071c",
        textColor = "#ffffff",
        secondaryTextColor = "#8b8ba3",
        accentColor = "#00d46a",
        fontFamily = "'Inter', sans-serif",
        minHeight = 900,
        style,
    } = props

    const placeholderLogos = ["NVIDIA", "Netflix", "Meta", "Samsung", "Microsoft", "Comcast"]

    return (
        <section
            style={{
                ...style,
                width: "100%",
                minHeight,
                backgroundColor: bgColor,
                padding: "80px 48px 60px",
                boxSizing: "border-box",
                fontFamily,
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Gradient glow */}
            <div
                style={{
                    position: "absolute",
                    top: "-40%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "120%",
                    height: "80%",
                    background: `radial-gradient(ellipse at center, ${accentColor}08 0%, transparent 70%)`,
                    pointerEvents: "none",
                }}
            />

            <div
                style={{
                    maxWidth: 1280,
                    margin: "0 auto",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                {/* Badge */}
                {showBadge && (
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            backgroundColor: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: 100,
                            padding: "8px 20px",
                            marginBottom: 32,
                        }}
                    >
                        <span style={{ fontSize: 14 }}>{badgeIcon}</span>
                        <span
                            style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: accentColor,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                fontFamily,
                            }}
                        >
                            {badge}
                        </span>
                    </div>
                )}

                {/* Heading */}
                <h1
                    style={{
                        fontSize: headingFontSize,
                        fontWeight: 700,
                        color: textColor,
                        textAlign: "center",
                        margin: "0 0 24px",
                        lineHeight: 1.1,
                        letterSpacing: "-0.02em",
                        maxWidth: 900,
                        fontFamily,
                        whiteSpace: "pre-line",
                    }}
                >
                    {heading}
                </h1>

                {/* Subheading */}
                <p
                    style={{
                        fontSize: 18,
                        color: secondaryTextColor,
                        textAlign: "center",
                        margin: "0 0 40px",
                        maxWidth: 640,
                        lineHeight: 1.6,
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
                        marginBottom: 56,
                        flexWrap: "wrap",
                        justifyContent: "center",
                    }}
                >
                    <a
                        href={ctaPrimaryUrl}
                        style={{
                            backgroundColor: accentColor,
                            color: bgColor,
                            padding: "14px 32px",
                            borderRadius: 10,
                            fontSize: 16,
                            fontWeight: 600,
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            fontFamily,
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
                            }}
                        >
                            {ctaSecondaryText}
                        </a>
                    )}
                </div>

                {/* Logo Bar */}
                {showLogos && (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 24,
                            marginBottom: 56,
                            width: "100%",
                        }}
                    >
                        <p
                            style={{
                                fontSize: 13,
                                color: secondaryTextColor,
                                margin: 0,
                                letterSpacing: "0.05em",
                                textTransform: "uppercase",
                                fontWeight: 500,
                                fontFamily,
                            }}
                        >
                            {logoTitle}
                        </p>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 48,
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
                                                      fontSize: (logo.height || logoHeight) * 0.6,
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
                                              fontSize: 16,
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
                    </div>
                )}

                {/* Hero Images */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 24,
                        width: "100%",
                    }}
                >
                    <div
                        style={{
                            aspectRatio: "4/3",
                            borderRadius: 16,
                            overflow: "hidden",
                            background: heroImage1
                                ? `url(${heroImage1}) center/cover no-repeat`
                                : "linear-gradient(135deg, #0f1029 0%, #1a1b45 100%)",
                            border: "1px solid rgba(255,255,255,0.06)",
                        }}
                    />
                    <div
                        style={{
                            aspectRatio: "4/3",
                            borderRadius: 16,
                            overflow: "hidden",
                            background: heroImage2
                                ? `url(${heroImage2}) center/cover no-repeat`
                                : "linear-gradient(135deg, #0f1029 0%, #1a1b45 100%)",
                            border: "1px solid rgba(255,255,255,0.06)",
                        }}
                    />
                </div>
            </div>
        </section>
    )
}

addPropertyControls(IndustryHero, {
    showBadge: {
        type: ControlType.Boolean,
        title: "Show Badge",
        defaultValue: true,
    },
    badgeIcon: {
        type: ControlType.String,
        title: "Badge Icon",
        defaultValue: "🎬",
        hidden: (props) => !props.showBadge,
    },
    badge: {
        type: ControlType.String,
        title: "Badge Text",
        defaultValue: "MEDIA & ENTERTAINMENT",
        hidden: (props) => !props.showBadge,
    },
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "Video optimization for\nmedia & entertainment",
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
            "Reduce video bitrate by up to 50% while maintaining pristine quality. Purpose-built for the world's most demanding media workflows.",
        displayTextArea: true,
    },
    ctaPrimaryText: {
        type: ControlType.String,
        title: "Primary CTA",
        defaultValue: "Start Free Trial",
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
        defaultValue: "Schedule Demo",
        hidden: (props) => !props.showSecondaryButton,
    },
    ctaSecondaryUrl: {
        type: ControlType.String,
        title: "Secondary URL",
        defaultValue: "#",
        hidden: (props) => !props.showSecondaryButton,
    },
    heroImage1: {
        type: ControlType.Image,
        title: "Hero Image 1",
    },
    heroImage2: {
        type: ControlType.Image,
        title: "Hero Image 2",
    },
    showLogos: {
        type: ControlType.Boolean,
        title: "Show Logos",
        defaultValue: true,
    },
    logoTitle: {
        type: ControlType.String,
        title: "Logo Title",
        defaultValue: "Trusted by leading media companies",
        hidden: (props) => !props.showLogos,
    },
    logos: {
        type: ControlType.Array,
        title: "Logos",
        maxCount: 10,
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
                    defaultValue: 28,
                    min: 8,
                    max: 60,
                },
            },
        },
        defaultValue: [
            { name: "NVIDIA", image: "", height: 28 },
            { name: "Netflix", image: "", height: 28 },
            { name: "Meta", image: "", height: 28 },
            { name: "Samsung", image: "", height: 28 },
            { name: "Microsoft", image: "", height: 28 },
            { name: "Comcast", image: "", height: 28 },
        ],
    },
    logoHeight: {
        type: ControlType.Number,
        title: "Logo Height",
        defaultValue: 28,
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
        defaultValue: 900,
        min: 400,
        max: 1400,
        step: 20,
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
