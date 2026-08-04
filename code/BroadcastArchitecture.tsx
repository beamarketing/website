// Beamr Homepage - Broadcast Architecture / Integration Pipeline
// Framer Code Component – editorial 2-col layout with an animated
// production-pipeline timeline that shows where Beamr slots into an
// existing broadcast workflow.

import { addPropertyControls, ControlType } from "framer"
import { useEffect, useRef, useState } from "react"

interface Stage {
    icon: string
    title: string
    subtitle: string
    tag: string
    highlighted: boolean
}

interface Reassurance {
    text: string
    emphasis: boolean
}

interface Props {
    eyebrow: string
    heading: string
    headingSize: number
    description: string
    stages: Stage[]
    reassurances: Reassurance[]
    panelTitle: string
    animate: boolean
    bgColor: string
    cardColor: string
    panelColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    borderColor: string
    fontFamily: string
    style?: React.CSSProperties
}

// ---- Inline icon set (line style, 22x22) --------------------------------
const stageIcons: Record<string, (c: string) => React.ReactElement> = {
    camera: (c) => (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect x="2" y="6" width="12" height="10" rx="2" stroke={c} strokeWidth="1.6" />
            <path d="M14 9.5L20 6.5V15.5L14 12.5V9.5Z" stroke={c} strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
    ),
    sliders: (c) => (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M4 6H18M4 11H18M4 16H18" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="8" cy="6" r="2" fill="#0b0d1c" stroke={c} strokeWidth="1.6" />
            <circle cx="14" cy="11" r="2" fill="#0b0d1c" stroke={c} strokeWidth="1.6" />
            <circle cx="7" cy="16" r="2" fill="#0b0d1c" stroke={c} strokeWidth="1.6" />
        </svg>
    ),
    sparkle: (c) => (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M11 2.5L12.6 8.2L18 10L12.6 11.8L11 17.5L9.4 11.8L4 10L9.4 8.2L11 2.5Z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M17.5 15L18.2 17L20 17.7L18.2 18.4L17.5 20.4L16.8 18.4L15 17.7L16.8 17L17.5 15Z" fill={c} />
        </svg>
    ),
    compress: (c) => (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M11 3V6M11 3L9 5M11 3L13 5" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11 19V16M11 19L9 17M11 19L13 17" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="4" y="8.5" width="14" height="5" rx="1.4" stroke={c} strokeWidth="1.6" />
        </svg>
    ),
    cloud: (c) => (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M6.5 16C4 16 2.5 14.3 2.5 12.2C2.5 10.3 3.9 8.7 5.8 8.5C6.3 6 8.4 4.2 11 4.2C13.9 4.2 16.2 6.4 16.4 9.2C18.1 9.5 19.3 10.9 19.3 12.6C19.3 14.5 17.8 16 15.9 16H6.5Z" stroke={c} strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
    ),
    viewers: (c) => (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect x="2.5" y="4" width="17" height="11" rx="2" stroke={c} strokeWidth="1.6" />
            <path d="M9.5 7.7L13 9.5L9.5 11.3V7.7Z" fill={c} />
            <path d="M7.5 18.5H14.5" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    ),
}

const CheckIcon = (c: string) => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2.8 7.2L5.6 10L11.2 4" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

const SparkIcon = (c: string) => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 1.5L8 5L11.5 6L8 7L7 10.5L6 7L2.5 6L6 5L7 1.5Z" fill={c} />
    </svg>
)

function hexToRgba(hex: string, alpha: number) {
    const h = hex.replace("#", "")
    const full = h.length === 3 ? h.split("").map((x) => x + x).join("") : h
    const n = parseInt(full, 16)
    const r = (n >> 16) & 255
    const g = (n >> 8) & 255
    const b = n & 255
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function BroadcastArchitecture(props: Props) {
    const {
        eyebrow = "SEAMLESS INTEGRATION",
        heading = "Fits Into Your Existing Broadcast Infrastructure",
        headingSize = 42,
        description = "Beamr slots into the workflow you already run. Two intelligent steps in production do the work — everything upstream and downstream stays exactly as it is.",
        stages = [
            { icon: "camera", title: "HD Camera Feed", subtitle: "Your existing capture", tag: "", highlighted: false },
            { icon: "sliders", title: "Production Switching", subtitle: "Live gallery & vision mixing", tag: "", highlighted: false },
            { icon: "sparkle", title: "NVIDIA RTX Video Super Resolution", subtitle: "AI upscaling to pristine detail", tag: "Enhance", highlighted: true },
            { icon: "compress", title: "Beamr CABR Encoding", subtitle: "Content-adaptive bitrate reduction", tag: "Optimize", highlighted: true },
            { icon: "cloud", title: "Packaging & CDN", subtitle: "Your current delivery stack", tag: "", highlighted: false },
            { icon: "viewers", title: "Viewers", subtitle: "No player changes required", tag: "", highlighted: false },
        ],
        reassurances = [
            { text: "No new cameras", emphasis: false },
            { text: "No new delivery infrastructure", emphasis: false },
            { text: "No player changes", emphasis: false },
            { text: "Just a smarter production pipeline", emphasis: true },
        ],
        panelTitle = "Production Pipeline",
        animate = true,
        bgColor = "#07071c",
        cardColor = "#0f1029",
        panelColor = "#0a0a20",
        textColor = "#ffffff",
        secondaryTextColor = "#8b8ba3",
        accentColor = "#00d46a",
        borderColor = "rgba(255,255,255,0.08)",
        fontFamily = "'Inter', sans-serif",
        style,
    } = props

    const sectionRef = useRef<HTMLElement>(null)
    const [visible, setVisible] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [isTablet, setIsTablet] = useState(false)

    // Responsive detection based on component's own width
    useEffect(() => {
        const el = sectionRef.current
        if (!el) return
        const ro = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const w = entry.contentRect.width
                setIsMobile(w < 560)
                setIsTablet(w >= 560 && w < 960)
            }
        })
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    // Reveal on scroll
    useEffect(() => {
        const el = sectionRef.current
        if (!el) return
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true)
                    obs.disconnect()
                }
            },
            { threshold: 0.12 }
        )
        obs.observe(el)
        return () => obs.disconnect()
    }, [])

    // Inject CSS (keyframes + hover) once
    useEffect(() => {
        const id = "__bcast-arch-css-v1"
        if (document.getElementById(id)) return
        const s = document.createElement("style")
        s.id = id
        s.textContent = `
            @keyframes bcast-flow {
                0%   { transform: translateY(-110%); opacity: 0; }
                20%  { opacity: 1; }
                80%  { opacity: 1; }
                100% { transform: translateY(210%); opacity: 0; }
            }
            @keyframes bcast-ring {
                0%, 100% { opacity: 0.18; transform: scale(1); }
                50%      { opacity: 0.55; transform: scale(1.08); }
            }
            .bcast-stage {
                transition: transform 0.3s ease, border-color 0.3s ease, background 0.3s ease;
            }
            .bcast-stage:hover {
                transform: translateX(3px);
            }
        `
        document.head.appendChild(s)
    }, [])

    const isNarrow = isMobile || isTablet
    const iconSize = isMobile ? 42 : 46
    const gapBelow = isMobile ? 22 : 26

    // ---- Reassurance checklist -----------------------------------------
    const Checklist = (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                marginTop: isNarrow ? 28 : 12,
            }}
        >
            {reassurances.map((r, i) => (
                <div
                    key={i}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: r.emphasis ? "14px 16px" : "4px 0",
                        borderRadius: r.emphasis ? 12 : 0,
                        background: r.emphasis ? hexToRgba(accentColor, 0.08) : "transparent",
                        border: r.emphasis ? `1px solid ${hexToRgba(accentColor, 0.28)}` : "none",
                        opacity: visible ? 1 : 0,
                        transform: visible ? "translateY(0)" : "translateY(14px)",
                        transition: `opacity 0.5s ease ${0.35 + i * 0.08}s, transform 0.5s ease ${0.35 + i * 0.08}s`,
                    }}
                >
                    <span
                        style={{
                            flexShrink: 0,
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: hexToRgba(accentColor, r.emphasis ? 0.18 : 0.1),
                        }}
                    >
                        {r.emphasis ? SparkIcon(accentColor) : CheckIcon(accentColor)}
                    </span>
                    <span
                        style={{
                            fontSize: 15,
                            fontWeight: r.emphasis ? 600 : 500,
                            color: r.emphasis ? textColor : secondaryTextColor,
                            fontFamily,
                            letterSpacing: "-0.01em",
                        }}
                    >
                        {r.text}
                    </span>
                </div>
            ))}
        </div>
    )

    // ---- Pipeline panel -------------------------------------------------
    const Pipeline = (
        <div
            style={{
                background: `linear-gradient(180deg, ${panelColor} 0%, ${cardColor} 100%)`,
                border: `1px solid ${borderColor}`,
                borderRadius: 20,
                padding: isMobile ? "24px 20px" : "30px 28px",
                boxShadow: "0 24px 70px rgba(0,0,0,0.45)",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(30px)",
                transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
            }}
        >
            {panelTitle ? (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 22,
                    }}
                >
                    <span style={{ display: "flex", gap: 5 }}>
                        {["#ff5f56", "#ffbd2e", "#27c93f"].map((c) => (
                            <span key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c, opacity: 0.85 }} />
                        ))}
                    </span>
                    <span
                        style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: secondaryTextColor,
                            fontFamily,
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                            marginLeft: 4,
                        }}
                    >
                        {panelTitle}
                    </span>
                </div>
            ) : null}

            <div style={{ display: "flex", flexDirection: "column" }}>
                {stages.map((stage, i) => {
                    const isLast = i === stages.length - 1
                    const iconFn = stageIcons[stage.icon] || stageIcons.camera
                    const hi = stage.highlighted
                    return (
                        <div
                            key={i}
                            style={{
                                position: "relative",
                                display: "flex",
                                gap: 16,
                                paddingBottom: isLast ? 0 : gapBelow,
                                opacity: visible ? 1 : 0,
                                transform: visible ? "translateX(0)" : "translateX(-16px)",
                                transition: `opacity 0.5s ease ${0.15 + i * 0.09}s, transform 0.5s ease ${0.15 + i * 0.09}s`,
                            }}
                        >
                            {/* Rail: icon + connector */}
                            <div
                                style={{
                                    position: "relative",
                                    flexShrink: 0,
                                    width: iconSize,
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                {/* Connector line into the next stage */}
                                {!isLast ? (
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: iconSize,
                                            bottom: 0,
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                            width: 2,
                                            borderRadius: 2,
                                            background: hexToRgba("#ffffff", 0.09),
                                            overflow: "hidden",
                                        }}
                                    >
                                        {animate ? (
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    left: 0,
                                                    right: 0,
                                                    height: "55%",
                                                    background: `linear-gradient(180deg, transparent, ${accentColor}, transparent)`,
                                                    animation: `bcast-flow 2.6s linear ${i * 0.35}s infinite`,
                                                }}
                                            />
                                        ) : null}
                                    </div>
                                ) : null}

                                {/* Pulsing ring on highlighted nodes */}
                                {hi && animate ? (
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            width: iconSize,
                                            height: iconSize,
                                            borderRadius: 14,
                                            border: `1px solid ${accentColor}`,
                                            animation: `bcast-ring 2.6s ease-in-out ${i * 0.2}s infinite`,
                                            pointerEvents: "none",
                                        }}
                                    />
                                ) : null}

                                {/* Icon box */}
                                <div
                                    style={{
                                        position: "relative",
                                        zIndex: 1,
                                        width: iconSize,
                                        height: iconSize,
                                        borderRadius: 14,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: hi ? hexToRgba(accentColor, 0.12) : hexToRgba("#ffffff", 0.04),
                                        border: `1px solid ${hi ? hexToRgba(accentColor, 0.5) : borderColor}`,
                                        boxShadow: hi ? `0 0 22px ${hexToRgba(accentColor, 0.25)}` : "none",
                                    }}
                                >
                                    {iconFn(hi ? accentColor : "#c2c2d6")}
                                </div>
                            </div>

                            {/* Card content */}
                            <div
                                className="bcast-stage"
                                style={{
                                    flex: 1,
                                    minWidth: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 12,
                                    padding: isMobile ? "12px 14px" : "13px 18px",
                                    borderRadius: 14,
                                    background: hi ? hexToRgba(accentColor, 0.06) : hexToRgba("#ffffff", 0.02),
                                    border: `1px solid ${hi ? hexToRgba(accentColor, 0.22) : borderColor}`,
                                }}
                            >
                                <div style={{ minWidth: 0 }}>
                                    <div
                                        style={{
                                            fontSize: isMobile ? 14 : 15,
                                            fontWeight: 600,
                                            color: textColor,
                                            fontFamily,
                                            letterSpacing: "-0.01em",
                                            lineHeight: 1.3,
                                        }}
                                    >
                                        {stage.title}
                                    </div>
                                    {stage.subtitle ? (
                                        <div
                                            style={{
                                                fontSize: 12.5,
                                                color: secondaryTextColor,
                                                fontFamily,
                                                marginTop: 3,
                                                lineHeight: 1.4,
                                            }}
                                        >
                                            {stage.subtitle}
                                        </div>
                                    ) : null}
                                </div>
                                {stage.tag ? (
                                    <span
                                        style={{
                                            flexShrink: 0,
                                            fontSize: 10.5,
                                            fontWeight: 700,
                                            letterSpacing: "0.06em",
                                            textTransform: "uppercase",
                                            color: hi ? accentColor : secondaryTextColor,
                                            fontFamily,
                                            padding: "4px 9px",
                                            borderRadius: 999,
                                            background: hi ? hexToRgba(accentColor, 0.12) : hexToRgba("#ffffff", 0.04),
                                            border: `1px solid ${hi ? hexToRgba(accentColor, 0.35) : borderColor}`,
                                        }}
                                    >
                                        {stage.tag}
                                    </span>
                                ) : null}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )

    // ---- Header block ---------------------------------------------------
    const Header = (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 20,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
        >
            {eyebrow ? (
                <span
                    style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: accentColor,
                        fontFamily,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                    }}
                >
                    {eyebrow}
                </span>
            ) : null}
            <h2
                style={{
                    fontSize: isMobile ? Math.round(headingSize * 0.72) : isTablet ? Math.round(headingSize * 0.86) : headingSize,
                    fontWeight: 700,
                    color: textColor,
                    margin: 0,
                    lineHeight: 1.12,
                    fontFamily,
                    letterSpacing: "-0.03em",
                }}
            >
                {heading}
            </h2>
            {description ? (
                <p
                    style={{
                        fontSize: 16,
                        color: secondaryTextColor,
                        margin: 0,
                        lineHeight: 1.7,
                        fontFamily,
                        maxWidth: 460,
                    }}
                >
                    {description}
                </p>
            ) : null}
            {!isNarrow ? Checklist : null}
        </div>
    )

    return (
        <section
            ref={sectionRef}
            style={{
                ...style,
                width: "100%",
                backgroundColor: bgColor,
                padding: isMobile ? "56px 20px" : isTablet ? "72px 32px" : "100px 48px",
                boxSizing: "border-box",
                fontFamily,
            }}
        >
            <div style={{ maxWidth: 1160, margin: "0 auto" }}>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: isNarrow ? "1fr" : "0.95fr 1.05fr",
                        gap: isMobile ? 8 : isTablet ? 40 : 72,
                        alignItems: "center",
                    }}
                >
                    <div>{Header}</div>
                    <div>{Pipeline}</div>
                </div>
                {/* On narrow screens the checklist reads best under the pipeline */}
                {isNarrow ? Checklist : null}
            </div>
        </section>
    )
}

addPropertyControls(BroadcastArchitecture, {
    eyebrow: {
        type: ControlType.String,
        title: "Eyebrow",
        defaultValue: "SEAMLESS INTEGRATION",
    },
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "Fits Into Your Existing Broadcast Infrastructure",
        displayTextArea: true,
    },
    headingSize: {
        type: ControlType.Number,
        title: "Heading Size",
        defaultValue: 42,
        min: 28,
        max: 64,
        step: 2,
    },
    description: {
        type: ControlType.String,
        title: "Description",
        defaultValue:
            "Beamr slots into the workflow you already run. Two intelligent steps in production do the work — everything upstream and downstream stays exactly as it is.",
        displayTextArea: true,
    },
    panelTitle: {
        type: ControlType.String,
        title: "Panel Label",
        defaultValue: "Production Pipeline",
    },
    stages: {
        type: ControlType.Array,
        title: "Pipeline Stages",
        maxCount: 10,
        control: {
            type: ControlType.Object,
            controls: {
                icon: {
                    type: ControlType.Enum,
                    title: "Icon",
                    options: ["camera", "sliders", "sparkle", "compress", "cloud", "viewers"],
                    optionTitles: ["Camera", "Switcher", "Sparkle (AI)", "Compress", "Cloud/CDN", "Viewers"],
                    defaultValue: "camera",
                },
                title: {
                    type: ControlType.String,
                    title: "Title",
                    defaultValue: "Stage",
                },
                subtitle: {
                    type: ControlType.String,
                    title: "Subtitle",
                    defaultValue: "",
                },
                tag: {
                    type: ControlType.String,
                    title: "Tag",
                    defaultValue: "",
                },
                highlighted: {
                    type: ControlType.Boolean,
                    title: "Highlight",
                    defaultValue: false,
                },
            },
        },
        defaultValue: [
            { icon: "camera", title: "HD Camera Feed", subtitle: "Your existing capture", tag: "", highlighted: false },
            { icon: "sliders", title: "Production Switching", subtitle: "Live gallery & vision mixing", tag: "", highlighted: false },
            { icon: "sparkle", title: "NVIDIA RTX Video Super Resolution", subtitle: "AI upscaling to pristine detail", tag: "Enhance", highlighted: true },
            { icon: "compress", title: "Beamr CABR Encoding", subtitle: "Content-adaptive bitrate reduction", tag: "Optimize", highlighted: true },
            { icon: "cloud", title: "Packaging & CDN", subtitle: "Your current delivery stack", tag: "", highlighted: false },
            { icon: "viewers", title: "Viewers", subtitle: "No player changes required", tag: "", highlighted: false },
        ],
    },
    reassurances: {
        type: ControlType.Array,
        title: "Reassurances",
        maxCount: 6,
        control: {
            type: ControlType.Object,
            controls: {
                text: {
                    type: ControlType.String,
                    title: "Text",
                    defaultValue: "No new hardware",
                },
                emphasis: {
                    type: ControlType.Boolean,
                    title: "Emphasize",
                    defaultValue: false,
                },
            },
        },
        defaultValue: [
            { text: "No new cameras", emphasis: false },
            { text: "No new delivery infrastructure", emphasis: false },
            { text: "No player changes", emphasis: false },
            { text: "Just a smarter production pipeline", emphasis: true },
        ],
    },
    animate: {
        type: ControlType.Boolean,
        title: "Animate Flow",
        defaultValue: true,
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#07071c",
    },
    cardColor: {
        type: ControlType.Color,
        title: "Card / Panel Base",
        defaultValue: "#0f1029",
    },
    panelColor: {
        type: ControlType.Color,
        title: "Panel Top",
        defaultValue: "#0a0a20",
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
        title: "Accent",
        defaultValue: "#00d46a",
    },
    borderColor: {
        type: ControlType.Color,
        title: "Border",
        defaultValue: "rgba(255,255,255,0.08)",
    },
    fontFamily: {
        type: ControlType.String,
        title: "Font Family",
        defaultValue: "'Inter', sans-serif",
    },
})

export default BroadcastArchitecture
