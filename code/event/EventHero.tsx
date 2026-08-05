// Beamr — Event Hero ("Meet us at IBC 2026")
// Framer Code Component in Beamr's light brand (see index.html).
// Left: editorial headline + CTAs + inline event facts.
// Right: an event "pass" card that surfaces the key details and the
// featured joint demo with NVIDIA.

import { addPropertyControls, ControlType } from "framer"
import { useEffect, useRef, useState } from "react"

interface Props {
    eyebrow: string
    heading: string
    headingSize: number
    headingWeight: number
    subtitle: string
    primaryText: string
    primaryUrl: string
    secondaryText: string
    secondaryUrl: string
    eventName: string
    dates: string
    location: string
    stand: string
    passLabel: string
    featuredLabel: string
    featuredTitle: string
    partnerA: string
    partnerB: string
    bgColor: string
    textColor: string
    secondaryColor: string
    lightColor: string
    primaryColor: string
    cardBg: string
    borderColor: string
    fontFamily: string
    style?: React.CSSProperties
}

function hexToRgba(hex: string, a: number) {
    const h = hex.replace("#", "")
    const f = h.length === 3 ? h.split("").map((x) => x + x).join("") : h
    const n = parseInt(f, 16)
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`
}

const ic = {
    calendar: (c: string) => (
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <rect x="3" y="4.5" width="14" height="12" rx="2" stroke={c} strokeWidth="1.5" />
            <path d="M3 8H17M7 3V6M13 3V6" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    ),
    pin: (c: string) => (
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M10 17.5C10 17.5 15.5 12.9 15.5 8.5C15.5 5.46 13 3 10 3C7 3 4.5 5.46 4.5 8.5C4.5 12.9 10 17.5 10 17.5Z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
            <circle cx="10" cy="8.5" r="2" stroke={c} strokeWidth="1.5" />
        </svg>
    ),
    booth: (c: string) => (
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M4 8V16H16V8" stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M3 5H17L16 8H4L3 5Z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M8.5 16V12H11.5V16" stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    ),
    arrow: (c: string) => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
}

function EventHero(props: Props) {
    const {
        eyebrow = "IBC 2026 · RAI AMSTERDAM",
        heading = "Meet Beamr at IBC 2026",
        headingSize = 54,
        headingWeight = 800,
        subtitle = "See CABR and AI-driven video optimization running live — including our joint demo with NVIDIA on real-time Video Super Resolution. Come find out which bits actually matter.",
        primaryText = "Schedule a demo",
        primaryUrl = "#schedule",
        secondaryText = "See what's on the booth",
        secondaryUrl = "#booth",
        eventName = "IBC 2026",
        dates = "11–14 September 2026",
        location = "RAI Amsterdam, Netherlands",
        stand = "Hall 5 · Stand 5.B29",
        passLabel = "YOUR INVITE",
        featuredLabel = "FEATURED JOINT DEMO",
        featuredTitle = "AI Video Super Resolution",
        partnerA = "beamr",
        partnerB = "NVIDIA",
        bgColor = "#ffffff",
        textColor = "#111827",
        secondaryColor = "#6b7280",
        lightColor = "#9ca3af",
        primaryColor = "#4F46E5",
        cardBg = "#f9fafb",
        borderColor = "#e5e7eb",
        fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        style,
    } = props

    const ref = useRef<HTMLElement>(null)
    const [visible, setVisible] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const ro = new ResizeObserver((e) => {
            for (const en of e) setIsMobile(en.contentRect.width < 860)
        })
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const obs = new IntersectionObserver(([e]) => e.isIntersecting && (setVisible(true), obs.disconnect()), { threshold: 0.15 })
        obs.observe(el)
        return () => obs.disconnect()
    }, [])

    const ease = "cubic-bezier(0.16,1,0.3,1)"
    const rv = (i: number, x = 0): React.CSSProperties => ({
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0,0)" : `translate(${x}px, 24px)`,
        transition: `opacity 0.8s ${ease} ${i * 0.1}s, transform 0.8s ${ease} ${i * 0.1}s`,
    })

    const factRow = (icon: keyof typeof ic, label: string, value: string) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ display: "flex", flexShrink: 0 }}>{ic[icon](primaryColor)}</span>
            <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: lightColor, width: 66, flexShrink: 0 }}>{label}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: textColor, letterSpacing: "-0.01em" }}>{value}</span>
        </div>
    )

    return (
        <section
            ref={ref}
            style={{
                ...style,
                width: "100%",
                backgroundColor: bgColor,
                padding: isMobile ? "48px 22px 56px" : "80px 32px 72px",
                boxSizing: "border-box",
                fontFamily,
            }}
        >
            <div
                style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1.1fr 0.9fr",
                    gap: isMobile ? 40 : 64,
                    alignItems: "center",
                }}
            >
                {/* Left */}
                <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, ...rv(0) }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: primaryColor }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: primaryColor, textTransform: "uppercase", letterSpacing: "0.06em" }}>{eyebrow}</span>
                    </div>
                    <h1 style={{ fontSize: isMobile ? Math.round(headingSize * 0.62) : headingSize, fontWeight: headingWeight, color: textColor, margin: 0, lineHeight: 1.06, letterSpacing: "-0.03em", ...rv(1) }}>
                        {heading}
                    </h1>
                    <p style={{ fontSize: 17, color: secondaryColor, margin: 0, lineHeight: 1.65, maxWidth: 500, ...rv(2) }}>{subtitle}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 4, ...rv(3) }}>
                        <a href={primaryUrl} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: textColor, color: "#fff", padding: "14px 28px", borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
                            {primaryText}
                            {ic.arrow("#ffffff")}
                        </a>
                        <a href={secondaryUrl} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: textColor, padding: "14px 28px", borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: "none", border: `1.5px solid ${borderColor}` }}>
                            {secondaryText}
                        </a>
                    </div>
                </div>

                {/* Right: event pass card */}
                <div style={{ ...rv(2, isMobile ? 0 : 24) }}>
                    <div
                        style={{
                            background: bgColor,
                            border: `1px solid ${borderColor}`,
                            borderRadius: 22,
                            overflow: "hidden",
                            boxShadow: "0 24px 60px rgba(17,24,39,0.10)",
                        }}
                    >
                        {/* pass header */}
                        <div style={{ background: primaryColor, padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                                <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.12em", color: hexToRgba("#ffffff", 0.75) }}>{passLabel}</div>
                                <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginTop: 2 }}>{eventName}</div>
                            </div>
                            <div style={{ display: "flex", gap: 5 }}>
                                {[0, 1, 2].map((k) => (
                                    <span key={k} style={{ width: 7, height: 22, borderRadius: 2, background: hexToRgba("#ffffff", 0.28 + k * 0.16) }} />
                                ))}
                            </div>
                        </div>
                        {/* facts */}
                        <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
                            {factRow("calendar", "Dates", dates)}
                            {factRow("pin", "Where", location)}
                            {factRow("booth", "Stand", stand)}
                        </div>
                        {/* featured demo strip */}
                        <div style={{ margin: "0 24px", borderTop: `1px dashed ${borderColor}` }} />
                        <div style={{ padding: "20px 24px 24px", background: cardBg }}>
                            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.08em", color: primaryColor, textTransform: "uppercase" }}>{featuredLabel}</div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: textColor, marginTop: 6, letterSpacing: "-0.01em" }}>{featuredTitle}</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
                                <span style={{ fontSize: 17, fontWeight: 800, color: textColor, letterSpacing: "-0.02em" }}>{partnerA}</span>
                                <span style={{ fontSize: 14, color: lightColor }}>×</span>
                                <span style={{ fontSize: 15, fontWeight: 700, color: "#76b900", letterSpacing: "0.02em" }}>{partnerB}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

addPropertyControls(EventHero, {
    eyebrow: { type: ControlType.String, title: "Eyebrow", defaultValue: "IBC 2026 · RAI AMSTERDAM" },
    heading: { type: ControlType.String, title: "Heading", defaultValue: "Meet Beamr at IBC 2026", displayTextArea: true },
    headingSize: { type: ControlType.Number, title: "Heading Size", defaultValue: 54, min: 24, max: 96, step: 1 },
    headingWeight: { type: ControlType.Enum, title: "Heading Weight", options: [300, 400, 500, 600, 700, 800, 900], optionTitles: ["300", "400", "500", "600", "700", "800", "900"], defaultValue: 800 },
    subtitle: { type: ControlType.String, title: "Subtitle", defaultValue: "See CABR and AI-driven video optimization running live — including our joint demo with NVIDIA on real-time Video Super Resolution. Come find out which bits actually matter.", displayTextArea: true },
    primaryText: { type: ControlType.String, title: "Primary Button", defaultValue: "Schedule a demo" },
    primaryUrl: { type: ControlType.String, title: "Primary URL", defaultValue: "#schedule" },
    secondaryText: { type: ControlType.String, title: "Secondary Button", defaultValue: "See what's on the booth" },
    secondaryUrl: { type: ControlType.String, title: "Secondary URL", defaultValue: "#booth" },
    eventName: { type: ControlType.String, title: "Event Name", defaultValue: "IBC 2026" },
    dates: { type: ControlType.String, title: "Dates", defaultValue: "11–14 September 2026" },
    location: { type: ControlType.String, title: "Location", defaultValue: "RAI Amsterdam, Netherlands" },
    stand: { type: ControlType.String, title: "Stand", defaultValue: "Hall 5 · Stand 5.B29" },
    passLabel: { type: ControlType.String, title: "Pass Label", defaultValue: "YOUR INVITE" },
    featuredLabel: { type: ControlType.String, title: "Featured Label", defaultValue: "FEATURED JOINT DEMO" },
    featuredTitle: { type: ControlType.String, title: "Featured Title", defaultValue: "AI Video Super Resolution" },
    partnerA: { type: ControlType.String, title: "Partner A", defaultValue: "beamr" },
    partnerB: { type: ControlType.String, title: "Partner B", defaultValue: "NVIDIA" },
    bgColor: { type: ControlType.Color, title: "Background", defaultValue: "#ffffff" },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: "#111827" },
    secondaryColor: { type: ControlType.Color, title: "Secondary Text", defaultValue: "#6b7280" },
    lightColor: { type: ControlType.Color, title: "Light Text", defaultValue: "#9ca3af" },
    primaryColor: { type: ControlType.Color, title: "Primary", defaultValue: "#4F46E5" },
    cardBg: { type: ControlType.Color, title: "Card BG", defaultValue: "#f9fafb" },
    borderColor: { type: ControlType.Color, title: "Border", defaultValue: "#e5e7eb" },
    fontFamily: { type: ControlType.String, title: "Font", defaultValue: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" },
})

export default EventHero
