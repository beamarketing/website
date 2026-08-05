// Beamr 5 HEVC Page - Hero Section
// Dark cinematic hero with eyebrow tag, large heading, CTA and spec strip
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"

interface SpecItem {
    value: string
    label: string
}

interface Props {
    eyebrow: string
    heading: string
    headingFontSize: number
    subheading: string
    ctaPrimaryText: string
    ctaPrimaryUrl: string
    ctaSecondaryText: string
    ctaSecondaryUrl: string
    showSecondaryButton: boolean
    specs: SpecItem[]
    showSpecs: boolean
    bgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    headingFont: string
    fontFamily: string
    minHeight: number
    style?: React.CSSProperties
}

function Beamr5Hero(props: Props) {
    const {
        eyebrow = "As Seen on a Big Screen Near You",
        heading = "The fastest, best-of-class HEVC encoder trusted by streaming giants",
        headingFontSize = 60,
        subheading = "Beamr 5 delivers real-time performance up to 4Kp60 with superior perceptual quality — the gold standard in HEVC encoding.",
        ctaPrimaryText = "Let's Talk",
        ctaPrimaryUrl = "#",
        ctaSecondaryText = "See the specs",
        ctaSecondaryUrl = "#specs",
        showSecondaryButton = true,
        specs = [
            { value: "4Kp60", label: "Real-time encoding" },
            { value: "10 & 12-bit", label: "HDR color depth" },
            { value: "x86 · ARM", label: "Cross-platform" },
            { value: "CBR · VBR · QP", label: "Advanced rate control" },
        ],
        showSpecs = true,
        bgColor = "#050516",
        textColor = "#ffffff",
        secondaryTextColor = "#9a9ab0",
        accentColor = "#2f73ff",
        headingFont = "'Poppins', sans-serif",
        fontFamily = "'Inter', sans-serif",
        minHeight = 640,
        style,
    } = props

    return (
        <section
            style={{
                ...style,
                width: "100%",
                minHeight,
                backgroundColor: bgColor,
                padding: "120px 48px 90px",
                boxSizing: "border-box",
                fontFamily,
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Ambient glow */}
            <div
                style={{
                    position: "absolute",
                    top: "-30%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "90%",
                    height: "120%",
                    background: `radial-gradient(ellipse at center, ${accentColor}22 0%, transparent 60%)`,
                    pointerEvents: "none",
                }}
            />
            {/* Subtle grid lines */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
                    backgroundSize: "64px 64px",
                    maskImage:
                        "radial-gradient(ellipse at 50% 40%, #000 30%, transparent 75%)",
                    WebkitMaskImage:
                        "radial-gradient(ellipse at 50% 40%, #000 30%, transparent 75%)",
                    pointerEvents: "none",
                }}
            />

            <div
                style={{
                    maxWidth: 920,
                    margin: "0 auto",
                    position: "relative",
                    zIndex: 1,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                {/* Eyebrow pill */}
                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 9,
                        padding: "7px 16px",
                        borderRadius: 999,
                        backgroundColor: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        marginBottom: 28,
                    }}
                >
                    <span
                        style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: accentColor,
                            boxShadow: `0 0 10px ${accentColor}`,
                        }}
                    />
                    <span
                        style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: textColor,
                            letterSpacing: "0.04em",
                            fontFamily,
                        }}
                    >
                        {eyebrow}
                    </span>
                </div>

                {/* Heading */}
                <h1
                    style={{
                        fontSize: headingFontSize,
                        fontWeight: 700,
                        color: textColor,
                        margin: "0 0 22px",
                        lineHeight: 1.08,
                        letterSpacing: "-0.03em",
                        maxWidth: 860,
                        fontFamily: headingFont,
                    }}
                >
                    {heading}
                </h1>

                {/* Subheading */}
                <p
                    style={{
                        fontSize: 18,
                        color: secondaryTextColor,
                        margin: "0 0 40px",
                        maxWidth: 620,
                        lineHeight: 1.6,
                        fontFamily,
                    }}
                >
                    {subheading}
                </p>

                {/* CTAs */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 14,
                        flexWrap: "wrap",
                    }}
                >
                    <a
                        href={ctaPrimaryUrl}
                        style={{
                            backgroundColor: accentColor,
                            color: "#ffffff",
                            padding: "15px 34px",
                            borderRadius: 10,
                            fontSize: 16,
                            fontWeight: 600,
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            fontFamily,
                            boxShadow: `0 10px 30px ${accentColor}44`,
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
                                padding: "15px 30px",
                                borderRadius: 10,
                                fontSize: 16,
                                fontWeight: 500,
                                textDecoration: "none",
                                border: "1px solid rgba(255,255,255,0.14)",
                                fontFamily,
                            }}
                        >
                            {ctaSecondaryText}
                        </a>
                    )}
                </div>

                {/* Spec strip */}
                {showSpecs && specs.length > 0 && (
                    <div
                        style={{
                            marginTop: 64,
                            width: "100%",
                            display: "grid",
                            gridTemplateColumns: `repeat(${specs.length}, 1fr)`,
                            gap: 1,
                            backgroundColor: "rgba(255,255,255,0.08)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: 16,
                            overflow: "hidden",
                        }}
                    >
                        {specs.map((spec, i) => (
                            <div
                                key={i}
                                style={{
                                    backgroundColor: bgColor,
                                    padding: "26px 18px",
                                    textAlign: "center",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: 24,
                                        fontWeight: 700,
                                        color: textColor,
                                        marginBottom: 6,
                                        fontFamily: headingFont,
                                        letterSpacing: "-0.01em",
                                    }}
                                >
                                    {spec.value}
                                </div>
                                <div
                                    style={{
                                        fontSize: 13,
                                        color: secondaryTextColor,
                                        fontFamily,
                                    }}
                                >
                                    {spec.label}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

addPropertyControls(Beamr5Hero, {
    eyebrow: {
        type: ControlType.String,
        title: "Eyebrow",
        defaultValue: "As Seen on a Big Screen Near You",
    },
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue:
            "The fastest, best-of-class HEVC encoder trusted by streaming giants",
        displayTextArea: true,
    },
    headingFontSize: {
        type: ControlType.Number,
        title: "Heading Size",
        defaultValue: 60,
        min: 32,
        max: 96,
        step: 2,
    },
    subheading: {
        type: ControlType.String,
        title: "Subheading",
        defaultValue:
            "Beamr 5 delivers real-time performance up to 4Kp60 with superior perceptual quality — the gold standard in HEVC encoding.",
        displayTextArea: true,
    },
    ctaPrimaryText: {
        type: ControlType.String,
        title: "Primary CTA",
        defaultValue: "Let's Talk",
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
        defaultValue: "See the specs",
        hidden: (props) => !props.showSecondaryButton,
    },
    ctaSecondaryUrl: {
        type: ControlType.String,
        title: "Secondary URL",
        defaultValue: "#specs",
        hidden: (props) => !props.showSecondaryButton,
    },
    showSpecs: {
        type: ControlType.Boolean,
        title: "Show Spec Strip",
        defaultValue: true,
    },
    specs: {
        type: ControlType.Array,
        title: "Specs",
        maxCount: 5,
        hidden: (props) => !props.showSpecs,
        control: {
            type: ControlType.Object,
            controls: {
                value: {
                    type: ControlType.String,
                    title: "Value",
                    defaultValue: "4Kp60",
                },
                label: {
                    type: ControlType.String,
                    title: "Label",
                    defaultValue: "Spec label",
                },
            },
        },
        defaultValue: [
            { value: "4Kp60", label: "Real-time encoding" },
            { value: "10 & 12-bit", label: "HDR color depth" },
            { value: "x86 · ARM", label: "Cross-platform" },
            { value: "CBR · VBR · QP", label: "Advanced rate control" },
        ],
    },
    minHeight: {
        type: ControlType.Number,
        title: "Min Height",
        defaultValue: 640,
        min: 400,
        max: 1000,
        step: 20,
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#050516",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#ffffff",
    },
    secondaryTextColor: {
        type: ControlType.Color,
        title: "Secondary Text",
        defaultValue: "#9a9ab0",
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "#2f73ff",
    },
    headingFont: {
        type: ControlType.String,
        title: "Heading Font",
        defaultValue: "'Poppins', sans-serif",
    },
    fontFamily: {
        type: ControlType.String,
        title: "Body Font",
        defaultValue: "'Inter', sans-serif",
    },
})

export default Beamr5Hero
