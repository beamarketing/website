// Beamr Homepage - Broadcast Architecture / Signal-Path Schematic
// Framer Code Component. A broadcast-engineering block diagram that shows
// where Beamr slots into an existing signal chain. The bus runs THICK
// through existing gear and steps THIN right after the Beamr CABR block —
// the bitrate reduction is drawn into the diagram itself. Existing gear is
// ghosted hairline; the two added stages are solid, live, and green.

import { addPropertyControls, ControlType } from "framer"
import { useEffect, useRef, useState } from "react"

interface Stage {
    icon: string
    code: string
    name: string
    highlighted: boolean
}

interface Reassurance {
    text: string
    emphasis: boolean
}

interface Props {
    figLabel: string
    heading: string
    headingSize: number
    description: string
    stages: Stage[]
    reassurances: Reassurance[]
    thinNote: string
    thickNote: string
    insertLabel: string
    animate: boolean
    bgColor: string
    textColor: string
    mutedColor: string
    slateColor: string
    accentColor: string
    fontFamily: string
    monoFamily: string
    style?: React.CSSProperties
}

// ---- Technical line-icon set (18x18, single weight) ---------------------
const stageIcons: Record<string, (c: string) => React.ReactElement> = {
    camera: (c) => (
        <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
            <rect x="2" y="6" width="12" height="10" rx="1.5" stroke={c} strokeWidth="1.5" />
            <path d="M14 9.5L20 6.5V15.5L14 12.5V9.5Z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    ),
    sliders: (c) => (
        <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
            <path d="M4 6H18M4 11H18M4 16H18" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
            <rect x="6" y="4" width="4" height="4" rx="1" fill="currentColor" stroke={c} strokeWidth="1.5" />
            <rect x="12" y="9" width="4" height="4" rx="1" fill="currentColor" stroke={c} strokeWidth="1.5" />
            <rect x="5" y="14" width="4" height="4" rx="1" fill="currentColor" stroke={c} strokeWidth="1.5" />
        </svg>
    ),
    sparkle: (c) => (
        <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
            <path d="M11 2.5L12.6 8.2L18 10L12.6 11.8L11 17.5L9.4 11.8L4 10L9.4 8.2L11 2.5Z" stroke={c} strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M17.5 15L18.2 17L20 17.7L18.2 18.4L17.5 20.4L16.8 18.4L15 17.7L16.8 17L17.5 15Z" fill={c} />
        </svg>
    ),
    compress: (c) => (
        <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
            <path d="M11 2.5V6M11 2.5L9 4.5M11 2.5L13 4.5" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11 19.5V16M11 19.5L9 17.5M11 19.5L13 17.5" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="4" y="8.5" width="14" height="5" rx="1" stroke={c} strokeWidth="1.5" />
        </svg>
    ),
    cloud: (c) => (
        <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
            <path d="M6.5 16C4 16 2.5 14.3 2.5 12.2C2.5 10.3 3.9 8.7 5.8 8.5C6.3 6 8.4 4.2 11 4.2C13.9 4.2 16.2 6.4 16.4 9.2C18.1 9.5 19.3 10.9 19.3 12.6C19.3 14.5 17.8 16 15.9 16H6.5Z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    ),
    viewers: (c) => (
        <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
            <rect x="2.5" y="4" width="17" height="11" rx="1.5" stroke={c} strokeWidth="1.5" />
            <path d="M9.5 7.7L13 9.5L9.5 11.3V7.7Z" fill={c} />
            <path d="M7.5 18.5H14.5" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
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
        figLabel = "FIG.01 — SIGNAL PATH",
        heading = "Fits into your existing broadcast infrastructure",
        headingSize = 40,
        description = "Two intelligent steps drop into production. Everything upstream and downstream stays exactly as it is — the same signal chain you run today, now carrying far less bitrate.",
        stages = [
            { icon: "camera", code: "12G-SDI", name: "HD Camera Feed", highlighted: false },
            { icon: "sliders", code: "SWITCH", name: "Production Switching", highlighted: false },
            { icon: "sparkle", code: "RTX-VSR", name: "NVIDIA RTX Video Super Resolution", highlighted: true },
            { icon: "compress", code: "CABR", name: "Beamr CABR Encoding", highlighted: true },
            { icon: "cloud", code: "HLS/DASH", name: "Packaging & CDN", highlighted: false },
            { icon: "viewers", code: "PLAYOUT", name: "Viewers", highlighted: false },
        ],
        reassurances = [
            { text: "No new cameras", emphasis: false },
            { text: "No new delivery infrastructure", emphasis: false },
            { text: "No player changes", emphasis: false },
            { text: "Just a smarter production pipeline", emphasis: true },
        ],
        thickNote = "FULL BITRATE",
        thinNote = "BITRATE ↓ 50% · QUALITY 100%",
        insertLabel = "SMART PRODUCTION LAYER — the only thing you add",
        animate = true,
        bgColor = "#07071c",
        textColor = "#ffffff",
        mutedColor = "#8b8ba3",
        slateColor = "#4a5578",
        accentColor = "#00d46a",
        fontFamily = "'Inter', sans-serif",
        monoFamily = "ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, monospace",
        style,
    } = props

    const sectionRef = useRef<HTMLElement>(null)
    const [visible, setVisible] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const el = sectionRef.current
        if (!el) return
        const ro = new ResizeObserver((entries) => {
            for (const entry of entries) setIsMobile(entry.contentRect.width < 720)
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
            { threshold: 0.12 }
        )
        obs.observe(el)
        return () => obs.disconnect()
    }, [])

    useEffect(() => {
        const id = "__bcast-schematic-css-v1"
        if (document.getElementById(id)) return
        const s = document.createElement("style")
        s.id = id
        s.textContent = `
            @keyframes bcast-run-h {
                0%   { left: 0%;   opacity: 0; transform: translate(-50%,-50%) scaleX(1); }
                6%   { opacity: 1; }
                58%  { transform: translate(-50%,-50%) scaleX(1); }
                66%  { transform: translate(-50%,-50%) scaleX(0.4); }
                94%  { opacity: 1; }
                100% { left: 100%; opacity: 0; transform: translate(-50%,-50%) scaleX(0.4); }
            }
            @keyframes bcast-run-v {
                0%   { top: 0%;   opacity: 0; transform: translate(-50%,-50%) scaleY(1); }
                6%   { opacity: 1; }
                58%  { transform: translate(-50%,-50%) scaleY(1); }
                66%  { transform: translate(-50%,-50%) scaleY(0.4); }
                94%  { opacity: 1; }
                100% { top: 100%; opacity: 0; transform: translate(-50%,-50%) scaleY(0.4); }
            }
            @keyframes bcast-livepulse {
                0%,100% { box-shadow: 0 0 0 0 rgba(0,212,106,0.0); }
                50%     { box-shadow: 0 0 20px 0 rgba(0,212,106,0.35); }
            }
            .bcast-node { transition: transform 0.25s ease; }
            .bcast-node:hover { transform: translateY(-2px); }
            @media (prefers-reduced-motion: reduce) {
                .bcast-packet, .bcast-live { animation: none !important; }
            }
        `
        document.head.appendChild(s)
    }, [])

    const n = stages.length
    const centers = stages.map((_, i) => ((i + 0.5) / n) * 100)
    const hiIdx = stages.map((s, i) => (s.highlighted ? i : -1)).filter((i) => i >= 0)
    const firstHi = hiIdx.length ? hiIdx[0] : Math.floor(n / 2) - 1
    const lastHi = hiIdx.length ? hiIdx[hiIdx.length - 1] : Math.floor(n / 2)

    const hairline = hexToRgba(slateColor, 0.55)
    const busBase = hexToRgba(slateColor, 0.65)

    // ---- Header ---------------------------------------------------------
    const Header = (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 18,
                maxWidth: 720,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
        >
            <span
                style={{
                    fontSize: 11.5,
                    fontWeight: 500,
                    color: slateColor,
                    fontFamily: monoFamily,
                    letterSpacing: "0.18em",
                }}
            >
                {figLabel}
            </span>
            <h2
                style={{
                    fontSize: isMobile ? Math.round(headingSize * 0.78) : headingSize,
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
            <p
                style={{
                    fontSize: 15.5,
                    color: mutedColor,
                    margin: 0,
                    lineHeight: 1.7,
                    fontFamily,
                    maxWidth: 560,
                }}
            >
                {description}
            </p>
        </div>
    )

    // ---- Horizontal schematic module ------------------------------------
    const moduleBlock = (stage: Stage, i: number, vertical: boolean) => {
        const hi = stage.highlighted
        const size = 52
        return (
            <div
                style={{
                    width: size,
                    height: size,
                    borderRadius: 9,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    // opaque bg masks the bus running behind
                    background: hi ? hexToRgba(accentColor, 0.14) : bgColor,
                    border: `1px solid ${hi ? hexToRgba(accentColor, 0.6) : hairline}`,
                    boxShadow: hi ? `0 0 20px ${hexToRgba(accentColor, 0.22)}` : "none",
                    position: "relative",
                    animation: hi && animate ? `bcast-livepulse 2.6s ease-in-out ${i * 0.2}s infinite` : "none",
                    flexShrink: 0,
                }}
            >
                {(stageIcons[stage.icon] || stageIcons.camera)(hi ? accentColor : slateColor)}
                {/* corner index tick */}
                <span
                    style={{
                        position: "absolute",
                        top: -1,
                        left: 6,
                        fontSize: 8.5,
                        fontFamily: monoFamily,
                        color: hi ? accentColor : slateColor,
                        opacity: 0.85,
                        transform: "translateY(-100%)",
                        paddingBottom: 2,
                    }}
                >
                    {String(i + 1).padStart(2, "0")}
                </span>
            </div>
        )
    }

    const HorizontalSchematic = (
        <div
            style={{
                position: "relative",
                minWidth: 760,
                height: 232,
                margin: "0 auto",
            }}
        >
            {/* measurement ruler */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 16 }}>
                <div style={{ position: "absolute", top: 8, left: 0, right: 0, height: 1, background: hexToRgba(slateColor, 0.18) }} />
                {Array.from({ length: 25 }).map((_, i) => (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            top: i % 4 === 0 ? 3 : 5,
                            left: `${(i / 24) * 100}%`,
                            width: 1,
                            height: i % 4 === 0 ? 6 : 4,
                            background: hexToRgba(slateColor, 0.3),
                        }}
                    />
                ))}
            </div>

            {/* insert bracket over highlighted stages */}
            <div
                style={{
                    position: "absolute",
                    top: 34,
                    left: `${centers[firstHi]}%`,
                    width: `${centers[lastHi] - centers[firstHi]}%`,
                    height: 16,
                    borderLeft: `1px solid ${hexToRgba(accentColor, 0.5)}`,
                    borderRight: `1px solid ${hexToRgba(accentColor, 0.5)}`,
                    borderTop: `1px solid ${hexToRgba(accentColor, 0.5)}`,
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 4,
                    opacity: visible ? 1 : 0,
                    transition: "opacity 0.6s ease 0.5s",
                }}
            >
                <span
                    style={{
                        position: "absolute",
                        top: -8,
                        left: "50%",
                        transform: "translate(-50%,-100%)",
                        whiteSpace: "nowrap",
                        fontSize: 10,
                        fontFamily: monoFamily,
                        letterSpacing: "0.1em",
                        color: accentColor,
                        background: bgColor,
                        padding: "0 8px",
                    }}
                >
                    {insertLabel}
                </span>
            </div>

            {/* BUS — thick segment (existing → through CABR) */}
            <div
                style={{
                    position: "absolute",
                    top: 108,
                    left: `${centers[0]}%`,
                    width: `${centers[lastHi] - centers[0]}%`,
                    height: 5,
                    marginTop: -2.5,
                    borderRadius: 3,
                    background: `linear-gradient(90deg, ${busBase}, ${hexToRgba(accentColor, 0.5)})`,
                    transform: visible ? "scaleX(1)" : "scaleX(0)",
                    transformOrigin: "left center",
                    transition: "transform 0.9s cubic-bezier(0.4,0,0.2,1) 0.2s",
                }}
            />
            {/* BUS — thin segment (after CABR: reduced bitrate) */}
            <div
                style={{
                    position: "absolute",
                    top: 108,
                    left: `${centers[lastHi]}%`,
                    width: `${centers[n - 1] - centers[lastHi]}%`,
                    height: 2,
                    marginTop: -1,
                    borderRadius: 2,
                    background: `linear-gradient(90deg, ${hexToRgba(accentColor, 0.5)}, ${busBase})`,
                    transform: visible ? "scaleX(1)" : "scaleX(0)",
                    transformOrigin: "left center",
                    transition: "transform 0.7s cubic-bezier(0.4,0,0.2,1) 0.9s",
                }}
            />

            {/* bitrate annotations under the bus */}
            <div
                style={{
                    position: "absolute",
                    top: 118,
                    left: `${(centers[0] + centers[lastHi]) / 2}%`,
                    transform: "translateX(-50%)",
                    fontSize: 9.5,
                    fontFamily: monoFamily,
                    letterSpacing: "0.14em",
                    color: hexToRgba(slateColor, 0.9),
                    whiteSpace: "nowrap",
                    opacity: visible ? 1 : 0,
                    transition: "opacity 0.5s ease 0.8s",
                }}
            >
                {thickNote}
            </div>
            <div
                style={{
                    position: "absolute",
                    top: 118,
                    left: `${(centers[lastHi] + centers[n - 1]) / 2}%`,
                    transform: "translateX(-50%)",
                    fontSize: 9.5,
                    fontFamily: monoFamily,
                    letterSpacing: "0.1em",
                    color: accentColor,
                    whiteSpace: "nowrap",
                    opacity: visible ? 1 : 0,
                    transition: "opacity 0.5s ease 1.1s",
                }}
            >
                {thinNote}
            </div>

            {/* traveling signal packet */}
            {animate ? (
                <div
                    className="bcast-packet"
                    style={{
                        position: "absolute",
                        top: 108,
                        width: 26,
                        height: 8,
                        borderRadius: 4,
                        background: accentColor,
                        boxShadow: `0 0 14px ${hexToRgba(accentColor, 0.8)}`,
                        transform: "translate(-50%,-50%)",
                        animation: "bcast-run-h 4.2s cubic-bezier(0.45,0,0.55,1) infinite",
                    }}
                />
            ) : null}

            {/* nodes */}
            {stages.map((stage, i) => (
                <div
                    key={i}
                    className="bcast-node"
                    style={{
                        position: "absolute",
                        top: 82,
                        left: `${centers[i]}%`,
                        transform: "translateX(-50%)",
                        width: 150,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        opacity: visible ? 1 : 0,
                        transition: `opacity 0.5s ease ${0.3 + i * 0.09}s`,
                    }}
                >
                    {moduleBlock(stage, i, false)}
                    <span
                        style={{
                            marginTop: 16,
                            fontSize: 10.5,
                            fontFamily: monoFamily,
                            letterSpacing: "0.08em",
                            color: stage.highlighted ? accentColor : slateColor,
                        }}
                    >
                        {stage.code}
                    </span>
                    <span
                        style={{
                            marginTop: 6,
                            fontSize: 12.5,
                            fontWeight: 500,
                            fontFamily,
                            color: stage.highlighted ? textColor : mutedColor,
                            textAlign: "center",
                            lineHeight: 1.35,
                            letterSpacing: "-0.01em",
                        }}
                    >
                        {stage.name}
                    </span>
                </div>
            ))}
        </div>
    )

    // ---- Vertical schematic (mobile) ------------------------------------
    const railX = 26
    const rowH = 92
    const VerticalSchematic = (
        <div style={{ position: "relative", height: rowH * n }}>
            {/* thick bus (down through CABR) */}
            <div
                style={{
                    position: "absolute",
                    left: railX,
                    top: rowH * 0.5,
                    width: 5,
                    marginLeft: -2.5,
                    height: rowH * (lastHi - 0) ,
                    borderRadius: 3,
                    background: `linear-gradient(180deg, ${busBase}, ${hexToRgba(accentColor, 0.5)})`,
                }}
            />
            {/* thin bus (after CABR) */}
            <div
                style={{
                    position: "absolute",
                    left: railX,
                    top: rowH * (lastHi + 0.5),
                    width: 2,
                    marginLeft: -1,
                    height: rowH * (n - 1 - lastHi),
                    borderRadius: 2,
                    background: `linear-gradient(180deg, ${hexToRgba(accentColor, 0.5)}, ${busBase})`,
                }}
            />
            {/* packet */}
            {animate ? (
                <div
                    className="bcast-packet"
                    style={{
                        position: "absolute",
                        left: railX,
                        top: rowH * 0.5,
                        height: 26,
                        width: 8,
                        marginLeft: -4,
                        borderRadius: 4,
                        background: accentColor,
                        boxShadow: `0 0 14px ${hexToRgba(accentColor, 0.8)}`,
                        transform: "translate(-50%,-50%)",
                        // reuse vertical keyframe scaled to the rail height range
                        animation: "bcast-run-v 4.2s cubic-bezier(0.45,0,0.55,1) infinite",
                    }}
                />
            ) : null}

            {stages.map((stage, i) => (
                <div
                    key={i}
                    style={{
                        position: "absolute",
                        top: rowH * i + rowH * 0.5,
                        left: 0,
                        right: 0,
                        transform: "translateY(-50%)",
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        opacity: visible ? 1 : 0,
                        transition: `opacity 0.5s ease ${0.2 + i * 0.08}s`,
                    }}
                >
                    <div style={{ width: 52, display: "flex", justifyContent: "center", flexShrink: 0 }}>
                        {moduleBlock(stage, i, true)}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <span
                            style={{
                                fontSize: 10,
                                fontFamily: monoFamily,
                                letterSpacing: "0.08em",
                                color: stage.highlighted ? accentColor : slateColor,
                            }}
                        >
                            {stage.code}
                            {stage.highlighted && i === lastHi ? `  ·  ${thinNote}` : ""}
                        </span>
                        <span
                            style={{
                                fontSize: 14.5,
                                fontWeight: 600,
                                fontFamily,
                                color: stage.highlighted ? textColor : mutedColor,
                                letterSpacing: "-0.01em",
                                lineHeight: 1.3,
                            }}
                        >
                            {stage.name}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    )

    // ---- Legend / reassurance key ---------------------------------------
    const Legend = (
        <div
            style={{
                marginTop: isMobile ? 36 : 44,
                paddingTop: 22,
                borderTop: `1px solid ${hexToRgba(slateColor, 0.25)}`,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: isMobile ? 14 : 28,
            }}
        >
            {reassurances.map((r, i) => (
                <div
                    key={i}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        opacity: visible ? 1 : 0,
                        transform: visible ? "translateY(0)" : "translateY(10px)",
                        transition: `opacity 0.5s ease ${0.5 + i * 0.08}s, transform 0.5s ease ${0.5 + i * 0.08}s`,
                    }}
                >
                    <span
                        style={{
                            width: 12,
                            height: 12,
                            borderRadius: 3,
                            flexShrink: 0,
                            background: r.emphasis ? accentColor : "transparent",
                            border: r.emphasis ? "none" : `1px solid ${hairline}`,
                            boxShadow: r.emphasis ? `0 0 10px ${hexToRgba(accentColor, 0.5)}` : "none",
                        }}
                    />
                    <span
                        style={{
                            fontSize: 13.5,
                            fontWeight: r.emphasis ? 600 : 500,
                            fontFamily,
                            color: r.emphasis ? textColor : mutedColor,
                            letterSpacing: "-0.01em",
                        }}
                    >
                        {r.text}
                    </span>
                </div>
            ))}
        </div>
    )

    return (
        <section
            ref={sectionRef}
            style={{
                ...style,
                width: "100%",
                backgroundColor: bgColor,
                padding: isMobile ? "56px 22px" : "100px 48px",
                boxSizing: "border-box",
                fontFamily,
            }}
        >
            <div style={{ maxWidth: 1120, margin: "0 auto" }}>
                {Header}
                <div style={{ marginTop: isMobile ? 40 : 64 }}>
                    {isMobile ? (
                        VerticalSchematic
                    ) : (
                        <div style={{ width: "100%", overflowX: "auto", paddingBottom: 4 }}>
                            {HorizontalSchematic}
                        </div>
                    )}
                </div>
                {Legend}
            </div>
        </section>
    )
}

addPropertyControls(BroadcastArchitecture, {
    figLabel: {
        type: ControlType.String,
        title: "Figure Label",
        defaultValue: "FIG.01 — SIGNAL PATH",
    },
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "Fits into your existing broadcast infrastructure",
        displayTextArea: true,
    },
    headingSize: {
        type: ControlType.Number,
        title: "Heading Size",
        defaultValue: 40,
        min: 26,
        max: 60,
        step: 2,
    },
    description: {
        type: ControlType.String,
        title: "Description",
        defaultValue:
            "Two intelligent steps drop into production. Everything upstream and downstream stays exactly as it is — the same signal chain you run today, now carrying far less bitrate.",
        displayTextArea: true,
    },
    stages: {
        type: ControlType.Array,
        title: "Signal Chain",
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
                code: { type: ControlType.String, title: "Spec Code", defaultValue: "SDI" },
                name: { type: ControlType.String, title: "Name", defaultValue: "Stage" },
                highlighted: { type: ControlType.Boolean, title: "Added / Live", defaultValue: false },
            },
        },
        defaultValue: [
            { icon: "camera", code: "12G-SDI", name: "HD Camera Feed", highlighted: false },
            { icon: "sliders", code: "SWITCH", name: "Production Switching", highlighted: false },
            { icon: "sparkle", code: "RTX-VSR", name: "NVIDIA RTX Video Super Resolution", highlighted: true },
            { icon: "compress", code: "CABR", name: "Beamr CABR Encoding", highlighted: true },
            { icon: "cloud", code: "HLS/DASH", name: "Packaging & CDN", highlighted: false },
            { icon: "viewers", code: "PLAYOUT", name: "Viewers", highlighted: false },
        ],
    },
    insertLabel: {
        type: ControlType.String,
        title: "Insert Label",
        defaultValue: "SMART PRODUCTION LAYER — the only thing you add",
    },
    thickNote: {
        type: ControlType.String,
        title: "Bus Note (before)",
        defaultValue: "FULL BITRATE",
    },
    thinNote: {
        type: ControlType.String,
        title: "Bus Note (after)",
        defaultValue: "BITRATE ↓ 50% · QUALITY 100%",
    },
    reassurances: {
        type: ControlType.Array,
        title: "Legend / Reassurances",
        maxCount: 6,
        control: {
            type: ControlType.Object,
            controls: {
                text: { type: ControlType.String, title: "Text", defaultValue: "No new hardware" },
                emphasis: { type: ControlType.Boolean, title: "Emphasize", defaultValue: false },
            },
        },
        defaultValue: [
            { text: "No new cameras", emphasis: false },
            { text: "No new delivery infrastructure", emphasis: false },
            { text: "No player changes", emphasis: false },
            { text: "Just a smarter production pipeline", emphasis: true },
        ],
    },
    animate: { type: ControlType.Boolean, title: "Animate Signal", defaultValue: true },
    bgColor: { type: ControlType.Color, title: "Background", defaultValue: "#07071c" },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: "#ffffff" },
    mutedColor: { type: ControlType.Color, title: "Muted Text", defaultValue: "#8b8ba3" },
    slateColor: { type: ControlType.Color, title: "Schematic Slate", defaultValue: "#4a5578" },
    accentColor: { type: ControlType.Color, title: "Signal / Accent", defaultValue: "#00d46a" },
    fontFamily: { type: ControlType.String, title: "Font", defaultValue: "'Inter', sans-serif" },
    monoFamily: {
        type: ControlType.String,
        title: "Mono Font",
        defaultValue: "ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, monospace",
    },
})

export default BroadcastArchitecture
