// Beamr Website - 404 Not Found Page
// Framer Code Component with full property controls
// "We Compressed This Page a Bit Too Hard."

import { addPropertyControls, ControlType } from "framer"
interface Props {
    heading: string
    body: string
    subBody: string
    ctaPrimaryText: string
    ctaPrimaryUrl: string
    ctaSecondaryText: string
    ctaSecondaryUrl: string
    showDiagnostics: boolean
    // Text sizes
    headingFontSize: number
    bodyFontSize: number
    subBodyFontSize: number
    // Text colors
    headingColor: string
    bodyColor: string
    subBodyColor: string
    // Button sizes & colors
    ctaFontSize: number
    ctaPrimaryBgColor: string
    ctaPrimaryTextColor: string
    ctaSecondaryBgColor: string
    ctaSecondaryTextColor: string
    ctaSecondaryBorderColor: string
    // Hero image
    heroImage: string
    heroMaxWidth: number
    // General
    bgColor: string
    accentColor: string
    showLogo: boolean
    logoImage: string
    logoText: string
    logoUrl: string
    logoHeight: number
    paddingTop: number
    headingFontFamily: string
    bodyFontFamily: string
    style?: React.CSSProperties
}

function NotFound(props: Props) {
    const {
        heading = "We Compressed This Page a Bit Too Hard.",
        body = "We analyze every bit. This one had zero worth keeping.",
        subBody = "Don't worry \u2014 the rest of the site survived compression just fine.",
        ctaPrimaryText = "Back to Safe Bits",
        ctaPrimaryUrl = "/",
        ctaSecondaryText = "Explore Use Cases",
        ctaSecondaryUrl = "/use-cases",
        showDiagnostics = true,
        headingFontSize = 44,
        bodyFontSize = 18,
        subBodyFontSize = 15,
        headingColor = "#ffffff",
        bodyColor = "#ffffff",
        subBodyColor = "#8b8ba3",
        ctaFontSize = 16,
        ctaPrimaryBgColor = "#4A7BF7",
        ctaPrimaryTextColor = "#ffffff",
        ctaSecondaryBgColor = "rgba(255,255,255,0.06)",
        ctaSecondaryTextColor = "#ffffff",
        ctaSecondaryBorderColor = "rgba(255,255,255,0.1)",
        heroImage = "",
        heroMaxWidth = 720,
        showLogo = true,
        logoImage = "",
        logoText = "beamr",
        logoUrl = "/",
        logoHeight = 28,
        paddingTop = 120,
        bgColor = "#000737",
        accentColor = "#4A7BF7",
        headingFontFamily = "'Poppins', 'Inter', sans-serif",
        bodyFontFamily = "'Inter', sans-serif",
        style,
    } = props

    return (
        <section
            style={{
                ...style,
                width: "100%",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: bgColor,
                padding: `${paddingTop}px 48px 80px`,
                boxSizing: "border-box",
                fontFamily: bodyFontFamily,
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Logo — top right corner */}
            {showLogo && (
                <a
                    href={logoUrl}
                    style={{
                        position: "absolute",
                        top: 32,
                        left: 48,
                        zIndex: 2,
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                    }}
                >
                    {logoImage ? (
                        <img
                            src={logoImage}
                            alt={logoText}
                            style={{
                                height: logoHeight,
                                objectFit: "contain",
                            }}
                        />
                    ) : (
                        <span
                            style={{
                                fontSize: logoHeight,
                                fontWeight: 700,
                                color: headingColor,
                                fontFamily: headingFontFamily,
                                letterSpacing: "-0.02em",
                                lineHeight: 1,
                            }}
                        >
                            {logoText}
                        </span>
                    )}
                </a>
            )}

            {/* Subtle glow */}
            <div
                style={{
                    position: "absolute",
                    top: "40%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 700,
                    height: 500,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${accentColor}10 0%, transparent 70%)`,
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            />

            {/* Content */}
            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    maxWidth: 800,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 24,
                }}
            >
                {/* Hero image */}
                {heroImage && (
                    <img
                        src={heroImage}
                        alt="404"
                        style={{
                            width: "100%",
                            maxWidth: heroMaxWidth,
                            height: "auto",
                            objectFit: "contain",
                        }}
                    />
                )}

                {/* Heading */}
                <h1
                    style={{
                        fontSize: headingFontSize,
                        fontWeight: 700,
                        color: headingColor,
                        margin: 0,
                        marginTop: 16,
                        lineHeight: 1.15,
                        fontFamily: headingFontFamily,
                        letterSpacing: "-0.02em",
                    }}
                >
                    {heading}
                </h1>

                {/* Body */}
                <p
                    style={{
                        fontSize: bodyFontSize,
                        color: bodyColor,
                        opacity: 0.5,
                        margin: 0,
                        maxWidth: 520,
                        lineHeight: 1.6,
                        fontFamily: bodyFontFamily,
                    }}
                >
                    {body}
                </p>

                {/* Sub-body */}
                <p
                    style={{
                        fontSize: subBodyFontSize,
                        color: subBodyColor,
                        margin: 0,
                        maxWidth: 480,
                        lineHeight: 1.6,
                        fontFamily: bodyFontFamily,
                    }}
                >
                    {subBody}
                </p>

                {/* CTAs — side by side */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        marginTop: 16,
                    }}
                >
                    {/* Primary: blue badge style */}
                    <a
                        href={ctaPrimaryUrl}
                        style={{
                            backgroundColor: ctaPrimaryBgColor,
                            color: ctaPrimaryTextColor,
                            padding: "14px 32px",
                            borderRadius: 10,
                            fontSize: ctaFontSize,
                            fontWeight: 600,
                            textDecoration: "none",
                            fontFamily: bodyFontFamily,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        {ctaPrimaryText}
                        <span style={{ fontSize: ctaFontSize + 2 }}>&#8594;</span>
                    </a>

                    {/* Secondary: ghost pill style */}
                    <a
                        href={ctaSecondaryUrl}
                        style={{
                            backgroundColor: ctaSecondaryBgColor,
                            color: ctaSecondaryTextColor,
                            padding: "14px 32px",
                            borderRadius: 100,
                            fontSize: ctaFontSize,
                            fontWeight: 500,
                            textDecoration: "none",
                            border: `1px solid ${ctaSecondaryBorderColor}`,
                            fontFamily: bodyFontFamily,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        {ctaSecondaryText}
                        <span style={{ fontSize: ctaFontSize + 2 }}>&#8594;</span>
                    </a>
                </div>

                {/* Diagnostic footer text — analysis card feel */}
                {showDiagnostics && (
                    <div
                        style={{
                            marginTop: 48,
                            padding: "12px 24px",
                            borderRadius: 8,
                            border: "1px solid rgba(255,255,255,0.06)",
                            backgroundColor: "rgba(255,255,255,0.02)",
                        }}
                    >
                        <span
                            style={{
                                fontFamily:
                                    "'SF Mono', 'Fira Code', 'Courier New', monospace",
                                fontSize: 11,
                                color: headingColor,
                                opacity: 0.2,
                                letterSpacing: "0.05em",
                            }}
                        >
                            COMPRESS_RATIO: &#8734; &nbsp;/&nbsp;
                            QUALITY_DELTA: N/A &nbsp;/&nbsp; OUTPUT: 0 bytes
                        </span>
                    </div>
                )}
            </div>
        </section>
    )
}

addPropertyControls(NotFound, {
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "We Compressed This Page a Bit Too Hard.",
        displayTextArea: true,
    },
    body: {
        type: ControlType.String,
        title: "Body",
        defaultValue:
            "We analyze every bit. This one had zero worth keeping.",
        displayTextArea: true,
    },
    subBody: {
        type: ControlType.String,
        title: "Sub-body",
        defaultValue:
            "Don't worry \u2014 the rest of the site survived compression just fine.",
        displayTextArea: true,
    },
    ctaPrimaryText: {
        type: ControlType.String,
        title: "Primary CTA",
        defaultValue: "Back to Safe Bits",
    },
    ctaPrimaryUrl: {
        type: ControlType.String,
        title: "Primary URL",
        defaultValue: "/",
    },
    ctaSecondaryText: {
        type: ControlType.String,
        title: "Secondary CTA",
        defaultValue: "Explore Use Cases",
    },
    ctaSecondaryUrl: {
        type: ControlType.String,
        title: "Secondary URL",
        defaultValue: "/use-cases",
    },
    showDiagnostics: {
        type: ControlType.Boolean,
        title: "Show Diagnostics",
        defaultValue: true,
    },
    headingFontSize: {
        type: ControlType.Number,
        title: "Heading Size",
        defaultValue: 44,
        min: 24,
        max: 72,
        step: 2,
    },
    headingColor: {
        type: ControlType.Color,
        title: "Heading Color",
        defaultValue: "#ffffff",
    },
    bodyFontSize: {
        type: ControlType.Number,
        title: "Body Size",
        defaultValue: 18,
        min: 12,
        max: 28,
        step: 1,
    },
    bodyColor: {
        type: ControlType.Color,
        title: "Body Color",
        defaultValue: "#ffffff",
    },
    subBodyFontSize: {
        type: ControlType.Number,
        title: "Sub-body Size",
        defaultValue: 15,
        min: 10,
        max: 24,
        step: 1,
    },
    subBodyColor: {
        type: ControlType.Color,
        title: "Sub-body Color",
        defaultValue: "#8b8ba3",
    },
    ctaFontSize: {
        type: ControlType.Number,
        title: "CTA Font Size",
        defaultValue: 16,
        min: 12,
        max: 24,
        step: 1,
    },
    ctaPrimaryBgColor: {
        type: ControlType.Color,
        title: "Primary CTA BG",
        defaultValue: "#4A7BF7",
    },
    ctaPrimaryTextColor: {
        type: ControlType.Color,
        title: "Primary CTA Text",
        defaultValue: "#ffffff",
    },
    ctaSecondaryBgColor: {
        type: ControlType.Color,
        title: "Secondary CTA BG",
        defaultValue: "rgba(255,255,255,0.06)",
    },
    ctaSecondaryTextColor: {
        type: ControlType.Color,
        title: "Secondary CTA Text",
        defaultValue: "#ffffff",
    },
    ctaSecondaryBorderColor: {
        type: ControlType.Color,
        title: "Secondary CTA Border",
        defaultValue: "rgba(255,255,255,0.1)",
    },
    paddingTop: {
        type: ControlType.Number,
        title: "Padding Top",
        defaultValue: 120,
        min: 40,
        max: 240,
        step: 8,
    },
    showLogo: {
        type: ControlType.Boolean,
        title: "Show Logo",
        defaultValue: true,
    },
    logoImage: {
        type: ControlType.Image,
        title: "Logo Image",
        hidden: (props) => !props.showLogo,
    },
    logoText: {
        type: ControlType.String,
        title: "Logo Text",
        defaultValue: "beamr",
        hidden: (props) => !props.showLogo,
    },
    logoUrl: {
        type: ControlType.String,
        title: "Logo URL",
        defaultValue: "/",
        hidden: (props) => !props.showLogo,
    },
    logoHeight: {
        type: ControlType.Number,
        title: "Logo Height",
        defaultValue: 28,
        min: 16,
        max: 60,
        step: 2,
        hidden: (props) => !props.showLogo,
    },
    heroImage: {
        type: ControlType.Image,
        title: "Hero Image",
    },
    heroMaxWidth: {
        type: ControlType.Number,
        title: "Hero Max Width",
        defaultValue: 720,
        min: 200,
        max: 1200,
        step: 10,
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#000737",
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "#4A7BF7",
    },
    headingFontFamily: {
        type: ControlType.String,
        title: "Heading Font",
        defaultValue: "'Poppins', 'Inter', sans-serif",
    },
    bodyFontFamily: {
        type: ControlType.String,
        title: "Body Font",
        defaultValue: "'Inter', sans-serif",
    },
})

export default NotFound
