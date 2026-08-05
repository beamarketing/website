// Beamr Homepage - Broadcast Architecture / Integration Figure
// Framer Code Component in Beamr's real light brand (see index.html):
// white ground, indigo #4F46E5 used sparingly, Inter, subtle borders,
// flat surfaces, generous whitespace. The argument is carried by one calm
// idea: your existing pipeline sits on plain white; the two steps you add
// sit inside a soft indigo "layer". No glow, no neon, no perpetual motion.

import { addPropertyControls, ControlType } from "framer"
import { useEffect, useRef, useState } from "react"

interface Stage {
    icon: string
    name: string
    kicker: string
    highlighted: boolean
}

interface Props {
    heading: string
    headingSize: number
    headingWeight: number
    subtitle: string
    subtitleSize: number
    subtitleWeight: number
    cardNameSize: number
    cardNameWeight: number
    kickerSize: number
    kickerWeight: number
    reassureSize: number
    reassureWeight: number
    closerSize: number
    closerWeight: number
    stages: Stage[]
    layerTag: string
    layerCaption: string
    reassurances: string[]
    closer: string
    bgColor: string
    textColor: string
    secondaryColor: string
    lightColor: string
    primaryColor: string
    borderColor: string
    fontFamily: string
    style?: React.CSSProperties
}

// ---- Monoline icons (1.6 stroke, currentColor via passed color) ---------
const stageIcons: Record<string, (c: string) => React.ReactElement> = {
    camera: (c) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="2.5" y="7" width="13" height="10" rx="2" stroke={c} strokeWidth="1.6" />
            <path d="M15.5 10.5L21.5 7.5V16.5L15.5 13.5V10.5Z" stroke={c} strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
    ),
    sliders: (c) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M4 7H20M4 12H20M4 17H20" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="9" cy="7" r="2.4" stroke={c} strokeWidth="1.6" fill="none" />
            <circle cx="15" cy="12" r="2.4" stroke={c} strokeWidth="1.6" fill="none" />
            <circle cx="8" cy="17" r="2.4" stroke={c} strokeWidth="1.6" fill="none" />
        </svg>
    ),
    sparkle: (c) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 3L13.8 9L19.5 10.8L13.8 12.6L12 18.5L10.2 12.6L4.5 10.8L10.2 9L12 3Z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M19 16L19.7 18L21.5 18.7L19.7 19.4L19 21.3L18.3 19.4L16.5 18.7L18.3 18L19 16Z" fill={c} />
        </svg>
    ),
    compress: (c) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 3V6.5M12 3L10 5M12 3L14 5" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 21V17.5M12 21L10 19M12 21L14 19" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="4.5" y="9.5" width="15" height="5" rx="1.4" stroke={c} strokeWidth="1.6" />
        </svg>
    ),
    cloud: (c) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M7 17.5C4.5 17.5 3 15.8 3 13.7C3 11.8 4.4 10.2 6.3 10C6.8 7.5 8.9 5.7 11.5 5.7C14.4 5.7 16.7 7.9 16.9 10.7C18.6 11 19.8 12.4 19.8 14.1C19.8 16 18.3 17.5 16.4 17.5H7Z" stroke={c} strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
    ),
    viewers: (c) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4.5" width="18" height="12" rx="2" stroke={c} strokeWidth="1.6" />
            <path d="M10.5 8.5L14 10.5L10.5 12.5V8.5Z" fill={c} />
            <path d="M8.5 20H15.5" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    ),
}

function hexToRgba(hex: string, alpha: number) {
    const h = hex.replace("#", "")
    const full = h.length === 3 ? h.split("").map((x) => x + x).join("") : h
    const n = parseInt(full, 16)
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
}

function BroadcastArchitecture(props: Props) {
    const {
        heading = "Fits into your existing broadcast infrastructure",
        headingSize = 42,
        headingWeight = 800,
        subtitle = "Two intelligent steps drop into production. Everything upstream and downstream stays exactly as it is — the same signal chain you already run.",
        subtitleSize = 17,
        subtitleWeight = 400,
        cardNameSize = 14.5,
        cardNameWeight = 600,
        kickerSize = 10.5,
        kickerWeight = 600,
        reassureSize = 18,
        reassureWeight = 500,
        closerSize = 22,
        closerWeight = 700,
        stages = [
            { icon: "camera", name: "HD Camera Feed", kicker: "Capture", highlighted: false },
            { icon: "sliders", name: "Production Switching", kicker: "Live mix", highlighted: false },
            { icon: "sparkle", name: "NVIDIA RTX Video Super Resolution", kicker: "AI upscale", highlighted: true },
            { icon: "compress", name: "Beamr CABR Encoding", kicker: "Optimize bitrate", highlighted: true },
            { icon: "cloud", name: "Packaging & CDN", kicker: "Deliver", highlighted: false },
            { icon: "viewers", name: "Viewers", kicker: "Playback", highlighted: false },
        ],
        layerTag = "Added by Beamr",
        layerCaption = "The smart production layer — the only two steps you add",
        reassurances = ["No new cameras", "No new delivery infrastructure", "No player changes"],
        closer = "Just a smarter production pipeline.",
        bgColor = "#ffffff",
        textColor = "#111827",
        secondaryColor = "#6b7280",
        lightColor = "#9ca3af",
        primaryColor = "#4F46E5",
        borderColor = "#e5e7eb",
        fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        style,
    } = props

    const sectionRef = useRef<HTMLElement>(null)
    const [visible, setVisible] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const el = sectionRef.current
        if (!el) return
        const ro = new ResizeObserver((entries) => {
            for (const entry of entries) setIsMobile(entry.contentRect.width < 860)
        })
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    useEffect(() => {
        const el = sectionRef.current
        if (!el) return
        const obs = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    setVisible(true)
                    obs.disconnect()
                }
            },
            { threshold: 0.15 }
        )
        obs.observe(el)
        return () => obs.disconnect()
    }, [])

    useEffect(() => {
        const id = "__bcast-fig-css-v1"
        if (document.getElementById(id)) return
        const s = document.createElement("style")
        s.id = id
        s.textContent = `
            .bcast-card { transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s ease, border-color 0.35s ease; }
            .bcast-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.06); }
        `
        document.head.appendChild(s)
    }, [])

    const ease = "cubic-bezier(0.16,1,0.3,1)"
    const revealBase = (i: number): React.CSSProperties => ({
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s ${ease} ${i * 0.08}s, transform 0.7s ${ease} ${i * 0.08}s`,
    })

    const n = stages.length
    const hiIdx = stages.map((s, i) => (s.highlighted ? i : -1)).filter((i) => i >= 0)
    const firstHi = hiIdx.length ? hiIdx[0] : -1
    const lastHi = hiIdx.length ? hiIdx[hiIdx.length - 1] : -1

    // ---- One stage card -------------------------------------------------
    const Card = (stage: Stage, i: number) => {
        const hi = stage.highlighted
        const iconColor = hi ? primaryColor : secondaryColor
        return (
            <div
                key={i}
                className="bcast-card"
                style={{
                    flex: isMobile ? "none" : "1 1 0",
                    minWidth: 0,
                    background: bgColor,
                    border: `1px solid ${hi ? hexToRgba(primaryColor, 0.35) : borderColor}`,
                    borderRadius: 14,
                    padding: isMobile ? "16px 18px" : "20px 18px",
                    display: "flex",
                    flexDirection: isMobile ? "row" : "column",
                    alignItems: isMobile ? "center" : "flex-start",
                    gap: isMobile ? 14 : 14,
                    ...revealBase(i + 1),
                }}
            >
                <div
                    style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: hi ? hexToRgba(primaryColor, 0.08) : hexToRgba(textColor, 0.04),
                    }}
                >
                    {(stageIcons[stage.icon] || stageIcons.camera)(iconColor)}
                </div>
                <div style={{ minWidth: 0 }}>
                    <div
                        style={{
                            fontSize: kickerSize,
                            fontWeight: kickerWeight,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: hi ? primaryColor : lightColor,
                            fontFamily,
                            marginBottom: 5,
                        }}
                    >
                        {String(i + 1).padStart(2, "0")} · {stage.kicker}
                    </div>
                    <div
                        style={{
                            fontSize: cardNameSize,
                            fontWeight: cardNameWeight,
                            color: textColor,
                            fontFamily,
                            lineHeight: 1.35,
                            letterSpacing: "-0.01em",
                        }}
                    >
                        {stage.name}
                    </div>
                </div>
            </div>
        )
    }

    // ---- Connector between top-level items ------------------------------
    const Connector = (key: string) => (
        <div
            key={key}
            style={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: isMobile ? "100%" : 34,
                height: isMobile ? 24 : "auto",
                alignSelf: isMobile ? "flex-start" : "center",
                marginLeft: isMobile ? 22 : 0,
                color: lightColor,
                opacity: visible ? 1 : 0,
                transition: `opacity 0.6s ${ease} 0.3s`,
            }}
        >
            <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                style={{ transform: isMobile ? "rotate(90deg)" : "none" }}
            >
                <path d="M4 2L10 8L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
    )

    // ---- The indigo "layer" panel wrapping highlighted stages -----------
    const LayerPanel = (
        <div
            style={{
                flex: isMobile ? "none" : `${lastHi - firstHi + 1} 1 0`,
                minWidth: 0,
                position: "relative",
                background: hexToRgba(primaryColor, 0.04),
                border: `1px solid ${hexToRgba(primaryColor, 0.14)}`,
                borderRadius: 18,
                padding: isMobile ? "34px 12px 12px" : "14px 14px 16px",
            }}
        >
            <span
                style={{
                    position: "absolute",
                    top: isMobile ? 12 : -10,
                    left: isMobile ? 14 : 16,
                    fontSize: 10.5,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: primaryColor,
                    background: bgColor,
                    padding: isMobile ? 0 : "0 8px",
                    fontFamily,
                    opacity: visible ? 1 : 0,
                    transition: `opacity 0.6s ${ease} 0.5s`,
                }}
            >
                {layerTag}
            </span>
            <div
                style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: "stretch",
                    gap: isMobile ? 12 : 12,
                }}
            >
                {stages.slice(firstHi, lastHi + 1).map((stage, k) => {
                    const globalIdx = firstHi + k
                    const isLastInGroup = k === lastHi - firstHi
                    return isMobile ? (
                        <div key={globalIdx}>{Card(stage, globalIdx)}</div>
                    ) : (
                        [
                            <div key={`c-${globalIdx}`} style={{ display: "flex", flex: "1 1 0", minWidth: 0 }}>
                                {Card(stage, globalIdx)}
                            </div>,
                            !isLastInGroup ? Connector(`gc-${globalIdx}`) : null,
                        ]
                    )
                })}
            </div>
        </div>
    )

    // ---- Assemble the flow ---------------------------------------------
    const flowItems: React.ReactNode[] = []
    let i = 0
    while (i < n) {
        if (i === firstHi && firstHi >= 0) {
            if (flowItems.length) flowItems.push(Connector(`conn-pre-layer`))
            flowItems.push(<div key="layer" style={{ display: "flex", flex: isMobile ? "none" : `${lastHi - firstHi + 1} 1 0`, minWidth: 0 }}>{LayerPanel}</div>)
            i = lastHi + 1
        } else {
            if (flowItems.length) flowItems.push(Connector(`conn-${i}`))
            flowItems.push(
                <div key={`item-${i}`} style={{ display: "flex", flex: isMobile ? "none" : "1 1 0", minWidth: 0 }}>
                    {Card(stages[i], i)}
                </div>
            )
            i += 1
        }
    }

    return (
        <section
            ref={sectionRef}
            style={{
                ...style,
                width: "100%",
                backgroundColor: bgColor,
                padding: isMobile ? "64px 22px" : "100px 32px",
                boxSizing: "border-box",
                fontFamily,
            }}
        >
            <div style={{ maxWidth: 1120, margin: "0 auto" }}>
                {/* Header */}
                <div style={{ maxWidth: 720, marginBottom: isMobile ? 40 : 56, ...revealBase(0) }}>
                    <h2
                        style={{
                            fontSize: isMobile ? Math.round(headingSize * 0.72) : headingSize,
                            fontWeight: headingWeight,
                            color: textColor,
                            margin: 0,
                            lineHeight: 1.1,
                            letterSpacing: "-0.03em",
                        }}
                    >
                        {heading}
                    </h2>
                    <p
                        style={{
                            fontSize: subtitleSize,
                            fontWeight: subtitleWeight,
                            color: secondaryColor,
                            margin: "18px 0 0",
                            lineHeight: 1.65,
                            maxWidth: 580,
                        }}
                    >
                        {subtitle}
                    </p>
                </div>

                {/* Flow figure */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: isMobile ? "column" : "row",
                        alignItems: "stretch",
                        gap: isMobile ? 0 : 0,
                    }}
                >
                    {flowItems}
                </div>

                {/* Layer caption */}
                <p
                    style={{
                        marginTop: 18,
                        fontSize: 13.5,
                        color: lightColor,
                        fontFamily,
                        ...revealBase(n + 1),
                    }}
                >
                    {layerCaption}
                </p>

                {/* Reassurance closer */}
                <div
                    style={{
                        marginTop: isMobile ? 40 : 56,
                        paddingTop: 32,
                        borderTop: `1px solid ${borderColor}`,
                        display: "flex",
                        flexDirection: isMobile ? "column" : "row",
                        alignItems: isMobile ? "flex-start" : "baseline",
                        justifyContent: "space-between",
                        gap: isMobile ? 12 : 40,
                        ...revealBase(n + 2),
                    }}
                >
                    <div
                        style={{
                            fontSize: reassureSize,
                            fontWeight: reassureWeight,
                            color: secondaryColor,
                            lineHeight: 1.5,
                        }}
                    >
                        {reassurances.map((r, k) => (
                            <span key={k}>
                                {r}
                                {k < reassurances.length - 1 ? <span style={{ color: borderColor }}>{"   /   "}</span> : "."}
                            </span>
                        ))}
                    </div>
                    <div
                        style={{
                            flexShrink: 0,
                            fontSize: closerSize,
                            fontWeight: closerWeight,
                            color: textColor,
                            letterSpacing: "-0.02em",
                            lineHeight: 1.3,
                        }}
                    >
                        {closer}
                    </div>
                </div>
            </div>
        </section>
    )
}

const WEIGHT_OPTIONS = [300, 400, 500, 600, 700, 800, 900]
const WEIGHT_TITLES = ["Light 300", "Regular 400", "Medium 500", "SemiBold 600", "Bold 700", "ExtraBold 800", "Black 900"]

addPropertyControls(BroadcastArchitecture, {
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "Fits into your existing broadcast infrastructure",
        displayTextArea: true,
    },
    headingSize: { type: ControlType.Number, title: "Heading Size", defaultValue: 42, min: 16, max: 96, step: 1 },
    headingWeight: {
        type: ControlType.Enum,
        title: "Heading Weight",
        options: WEIGHT_OPTIONS,
        optionTitles: WEIGHT_TITLES,
        defaultValue: 800,
    },
    subtitle: {
        type: ControlType.String,
        title: "Subtitle",
        defaultValue:
            "Two intelligent steps drop into production. Everything upstream and downstream stays exactly as it is — the same signal chain you already run.",
        displayTextArea: true,
    },
    subtitleSize: { type: ControlType.Number, title: "Subtitle Size", defaultValue: 17, min: 12, max: 40, step: 1 },
    subtitleWeight: {
        type: ControlType.Enum,
        title: "Subtitle Weight",
        options: WEIGHT_OPTIONS,
        optionTitles: WEIGHT_TITLES,
        defaultValue: 400,
    },
    cardNameSize: { type: ControlType.Number, title: "Card Name Size", defaultValue: 14.5, min: 10, max: 28, step: 0.5 },
    cardNameWeight: {
        type: ControlType.Enum,
        title: "Card Name Weight",
        options: WEIGHT_OPTIONS,
        optionTitles: WEIGHT_TITLES,
        defaultValue: 600,
    },
    kickerSize: { type: ControlType.Number, title: "Kicker Size", defaultValue: 10.5, min: 8, max: 20, step: 0.5 },
    kickerWeight: {
        type: ControlType.Enum,
        title: "Kicker Weight",
        options: WEIGHT_OPTIONS,
        optionTitles: WEIGHT_TITLES,
        defaultValue: 600,
    },
    reassureSize: { type: ControlType.Number, title: "Reassurance Size", defaultValue: 18, min: 12, max: 36, step: 1 },
    reassureWeight: {
        type: ControlType.Enum,
        title: "Reassurance Weight",
        options: WEIGHT_OPTIONS,
        optionTitles: WEIGHT_TITLES,
        defaultValue: 500,
    },
    closerSize: { type: ControlType.Number, title: "Closer Size", defaultValue: 22, min: 12, max: 48, step: 1 },
    closerWeight: {
        type: ControlType.Enum,
        title: "Closer Weight",
        options: WEIGHT_OPTIONS,
        optionTitles: WEIGHT_TITLES,
        defaultValue: 700,
    },
    stages: {
        type: ControlType.Array,
        title: "Pipeline Stages",
        maxCount: 8,
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
                name: { type: ControlType.String, title: "Name", defaultValue: "Stage" },
                kicker: { type: ControlType.String, title: "Kicker", defaultValue: "Step" },
                highlighted: { type: ControlType.Boolean, title: "Added by Beamr", defaultValue: false },
            },
        },
        defaultValue: [
            { icon: "camera", name: "HD Camera Feed", kicker: "Capture", highlighted: false },
            { icon: "sliders", name: "Production Switching", kicker: "Live mix", highlighted: false },
            { icon: "sparkle", name: "NVIDIA RTX Video Super Resolution", kicker: "AI upscale", highlighted: true },
            { icon: "compress", name: "Beamr CABR Encoding", kicker: "Optimize bitrate", highlighted: true },
            { icon: "cloud", name: "Packaging & CDN", kicker: "Deliver", highlighted: false },
            { icon: "viewers", name: "Viewers", kicker: "Playback", highlighted: false },
        ],
    },
    layerTag: {
        type: ControlType.String,
        title: "Layer Tag",
        defaultValue: "Added by Beamr",
    },
    layerCaption: {
        type: ControlType.String,
        title: "Layer Caption",
        defaultValue: "The smart production layer — the only two steps you add",
    },
    reassurances: {
        type: ControlType.Array,
        title: "Reassurances",
        maxCount: 5,
        control: { type: ControlType.String },
        defaultValue: ["No new cameras", "No new delivery infrastructure", "No player changes"],
    },
    closer: { type: ControlType.String, title: "Closer", defaultValue: "Just a smarter production pipeline." },
    bgColor: { type: ControlType.Color, title: "Background", defaultValue: "#ffffff" },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: "#111827" },
    secondaryColor: { type: ControlType.Color, title: "Secondary Text", defaultValue: "#6b7280" },
    lightColor: { type: ControlType.Color, title: "Light Text", defaultValue: "#9ca3af" },
    primaryColor: { type: ControlType.Color, title: "Primary (Indigo)", defaultValue: "#4F46E5" },
    borderColor: { type: ControlType.Color, title: "Border", defaultValue: "#e5e7eb" },
    fontFamily: {
        type: ControlType.String,
        title: "Font",
        defaultValue: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
})

export default BroadcastArchitecture
