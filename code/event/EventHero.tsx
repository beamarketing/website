// Beamr — Event Hero ("Meet us at IBC 2026") — photo-led
// Framer Code Component in Beamr's light brand. Editorial split: headline +
// CTAs + an inline fact line on the left; a tall photograph on the right
// with a floating caption card for the featured NVIDIA joint demo.

import { addPropertyControls, ControlType } from "framer"
import { useEffect, useRef, useState } from "react"

interface Props {
    tag: string
    heading: string
    headingSize: number
    headingWeight: number
    subtitle: string
    dates: string
    stand: string
    location: string
    primaryText: string
    primaryUrl: string
    secondaryText: string
    secondaryUrl: string
    heroImage: string
    captionLabel: string
    captionTitle: string
    partnerA: string
    partnerB: string
    bgColor: string
    textColor: string
    secondaryColor: string
    lightColor: string
    primaryColor: string
    borderColor: string
    placeholderBg: string
    fontFamily: string
    style?: React.CSSProperties
}

function hexToRgba(hex: string, a: number) {
    const h = hex.replace("#", "")
    const f = h.length === 3 ? h.split("").map((x) => x + x).join("") : h
    const n = parseInt(f, 16)
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`
}

const imageGlyph = (c: string) => (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
        <rect x="4" y="6" width="22" height="18" rx="2.5" stroke={c} strokeWidth="1.6" />
        <circle cx="10.5" cy="12" r="2" stroke={c} strokeWidth="1.6" />
        <path d="M5 21L11.5 15.5L16 19.5L20 16L25 20.5" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

function PhotoFrame({ src, label, ratio, radius, placeholderBg, lightColor }: { src: string; label: string; ratio: string; radius: number; placeholderBg: string; lightColor: string }) {
    return (
        <div style={{ position: "relative", width: "100%", aspectRatio: ratio, borderRadius: radius, overflow: "hidden", background: placeholderBg }}>
            {src ? (
                <img src={src} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            ) : (
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, background: `linear-gradient(135deg, ${placeholderBg} 0%, ${hexToRgba("#000000", 0.03)} 100%)` }}>
                    {imageGlyph(hexToRgba("#111827", 0.22))}
                    <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.02em", color: lightColor }}>{label}</span>
                </div>
            )}
        </div>
    )
}

function EventHero(props: Props) {
    const {
        tag = "IBC 2026 · Amsterdam",
        heading = "Meet Beamr\nat IBC 2026",
        headingSize = 58,
        headingWeight = 800,
        subtitle = "See CABR and AI-driven video optimization running live — including our joint demo with NVIDIA on real-time Video Super Resolution.",
        dates = "11–14 Sep 2026",
        stand = "Hall 5 · Stand 5.B29",
        location = "RAI Amsterdam",
        primaryText = "Schedule a demo",
        primaryUrl = "#schedule",
        secondaryText = "On the booth",
        secondaryUrl = "#booth",
        heroImage = "",
        captionLabel = "FEATURED JOINT DEMO",
        captionTitle = "Real-time AI Video Super Resolution",
        partnerA = "beamr",
        partnerB = "NVIDIA",
        bgColor = "#ffffff",
        textColor = "#111827",
        secondaryColor = "#6b7280",
        lightColor = "#9ca3af",
        primaryColor = "#4F46E5",
        borderColor = "#e5e7eb",
        placeholderBg = "#f3f4f6",
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
            for (const en of e) setIsMobile(en.contentRect.width < 900)
        })
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const obs = new IntersectionObserver(([e]) => e.isIntersecting && (setVisible(true), obs.disconnect()), { threshold: 0.12 })
        obs.observe(el)
        return () => obs.disconnect()
    }, [])

    const ease = "cubic-bezier(0.16,1,0.3,1)"
    const rv = (i: number): React.CSSProperties => ({
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.8s ${ease} ${i * 0.09}s, transform 0.8s ${ease} ${i * 0.09}s`,
    })

    const captionCard = (
        <div style={{ background: bgColor, border: `1px solid ${borderColor}`, borderRadius: 16, padding: "16px 18px", boxShadow: "0 18px 44px rgba(17,24,39,0.14)", maxWidth: 300 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.09em", color: primaryColor }}>{captionLabel}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: textColor, marginTop: 6, letterSpacing: "-0.01em", lineHeight: 1.25 }}>{captionTitle}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: textColor, letterSpacing: "-0.02em" }}>{partnerA}</span>
                <span style={{ fontSize: 12, color: lightColor }}>×</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#76b900" }}>{partnerB}</span>
            </div>
        </div>
    )

    return (
        <section ref={ref} style={{ ...style, width: "100%", backgroundColor: bgColor, padding: isMobile ? "44px 22px 56px" : "72px 32px 84px", boxSizing: "border-box", fontFamily }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 0.82fr", gap: isMobile ? 36 : 72, alignItems: "center" }}>
                {/* Left */}
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    <span style={{ display: "inline-flex", alignSelf: "flex-start", alignItems: "center", fontSize: 12.5, fontWeight: 600, letterSpacing: "0.02em", color: primaryColor, border: `1px solid ${hexToRgba(primaryColor, 0.3)}`, background: hexToRgba(primaryColor, 0.05), padding: "6px 14px", borderRadius: 999, ...rv(0) }}>
                        {tag}
                    </span>
                    <h1 style={{ fontSize: isMobile ? Math.round(headingSize * 0.58) : headingSize, fontWeight: headingWeight, color: textColor, margin: 0, lineHeight: 1.02, letterSpacing: "-0.035em", whiteSpace: "pre-line", ...rv(1) }}>
                        {heading}
                    </h1>
                    <p style={{ fontSize: 18, color: secondaryColor, margin: 0, lineHeight: 1.6, maxWidth: 460, ...rv(2) }}>{subtitle}</p>

                    {/* inline facts */}
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 14, fontSize: 13.5, fontWeight: 500, color: textColor, ...rv(3) }}>
                        <span>{dates}</span>
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: borderColor }} />
                        <span>{stand}</span>
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: borderColor }} />
                        <span>{location}</span>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 4, ...rv(4) }}>
                        <a href={primaryUrl} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: textColor, color: "#fff", padding: "15px 30px", borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
                            {primaryText}
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </a>
                        <a href={secondaryUrl} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: textColor, padding: "15px 30px", borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: "none", border: `1.5px solid ${borderColor}` }}>
                            {secondaryText}
                        </a>
                    </div>
                </div>

                {/* Right: photo with floating caption */}
                <div style={{ position: "relative", marginBottom: isMobile ? 0 : 28, ...rv(2) }}>
                    <PhotoFrame src={heroImage} label="Booth / event photo" ratio={isMobile ? "4/3" : "4/5"} radius={20} placeholderBg={placeholderBg} lightColor={lightColor} />
                    <div style={{ position: isMobile ? "static" : "absolute", left: isMobile ? 0 : 20, bottom: isMobile ? "auto" : -26, marginTop: isMobile ? 16 : 0 }}>
                        {captionCard}
                    </div>
                </div>
            </div>
        </section>
    )
}

addPropertyControls(EventHero, {
    tag: { type: ControlType.String, title: "Tag", defaultValue: "IBC 2026 · Amsterdam" },
    heading: { type: ControlType.String, title: "Heading", defaultValue: "Meet Beamr\nat IBC 2026", displayTextArea: true },
    headingSize: { type: ControlType.Number, title: "Heading Size", defaultValue: 58, min: 24, max: 100, step: 1 },
    headingWeight: { type: ControlType.Enum, title: "Heading Weight", options: [300, 400, 500, 600, 700, 800, 900], optionTitles: ["300", "400", "500", "600", "700", "800", "900"], defaultValue: 800 },
    subtitle: { type: ControlType.String, title: "Subtitle", defaultValue: "See CABR and AI-driven video optimization running live — including our joint demo with NVIDIA on real-time Video Super Resolution.", displayTextArea: true },
    dates: { type: ControlType.String, title: "Dates", defaultValue: "11–14 Sep 2026" },
    stand: { type: ControlType.String, title: "Stand", defaultValue: "Hall 5 · Stand 5.B29" },
    location: { type: ControlType.String, title: "Location", defaultValue: "RAI Amsterdam" },
    primaryText: { type: ControlType.String, title: "Primary Button", defaultValue: "Schedule a demo" },
    primaryUrl: { type: ControlType.String, title: "Primary URL", defaultValue: "#schedule" },
    secondaryText: { type: ControlType.String, title: "Secondary Button", defaultValue: "On the booth" },
    secondaryUrl: { type: ControlType.String, title: "Secondary URL", defaultValue: "#booth" },
    heroImage: { type: ControlType.Image, title: "Hero Photo" },
    captionLabel: { type: ControlType.String, title: "Caption Label", defaultValue: "FEATURED JOINT DEMO" },
    captionTitle: { type: ControlType.String, title: "Caption Title", defaultValue: "Real-time AI Video Super Resolution" },
    partnerA: { type: ControlType.String, title: "Partner A", defaultValue: "beamr" },
    partnerB: { type: ControlType.String, title: "Partner B", defaultValue: "NVIDIA" },
    bgColor: { type: ControlType.Color, title: "Background", defaultValue: "#ffffff" },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: "#111827" },
    secondaryColor: { type: ControlType.Color, title: "Secondary Text", defaultValue: "#6b7280" },
    lightColor: { type: ControlType.Color, title: "Light Text", defaultValue: "#9ca3af" },
    primaryColor: { type: ControlType.Color, title: "Primary", defaultValue: "#4F46E5" },
    borderColor: { type: ControlType.Color, title: "Border", defaultValue: "#e5e7eb" },
    placeholderBg: { type: ControlType.Color, title: "Placeholder BG", defaultValue: "#f3f4f6" },
    fontFamily: { type: ControlType.String, title: "Font", defaultValue: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" },
})

export default EventHero
