// Beamr — "On the Booth" Section
// Framer Code Component in Beamr's light brand. A bento-style grid: one
// large featured card for the Beamr × NVIDIA joint demo, plus a grid of
// the other things visitors can see and do at the stand.

import { addPropertyControls, ControlType } from "framer"
import { useEffect, useRef, useState } from "react"

interface BoothItem {
    icon: string
    title: string
    description: string
}

interface Props {
    eyebrow: string
    heading: string
    headingSize: number
    headingWeight: number
    subtitle: string
    featuredLabel: string
    featuredTitle: string
    featuredDescription: string
    partnerA: string
    partnerB: string
    featuredBullets: string[]
    items: BoothItem[]
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

const icons: Record<string, (c: string) => React.ReactElement> = {
    sparkle: (c) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3L13.8 9L19.5 10.8L13.8 12.6L12 18.5L10.2 12.6L4.5 10.8L10.2 9L12 3Z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" /><path d="M19 16L19.7 18L21.5 18.7L19.7 19.4L19 21.3L18.3 19.4L16.5 18.7L18.3 18L19 16Z" fill={c} /></svg>
    ),
    compress: (c) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3V6.5M12 3L10 5M12 3L14 5" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 21V17.5M12 21L10 19M12 21L14 19" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><rect x="4.5" y="9.5" width="15" height="5" rx="1.4" stroke={c} strokeWidth="1.6" /></svg>
    ),
    calculator: (c) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="5" y="3" width="14" height="18" rx="2" stroke={c} strokeWidth="1.6" /><rect x="8" y="6" width="8" height="3.5" rx="1" stroke={c} strokeWidth="1.6" /><path d="M9 14H9.01M12 14H12.01M15 14H15.01M9 17H9.01M12 17H12.01M15 17H15.01" stroke={c} strokeWidth="2" strokeLinecap="round" /></svg>
    ),
    chip: (c) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="6" y="6" width="12" height="12" rx="2" stroke={c} strokeWidth="1.6" /><path d="M9.5 9.5H14.5V14.5H9.5V9.5Z" stroke={c} strokeWidth="1.6" /><path d="M9 3V6M15 3V6M9 18V21M15 18V21M3 9H6M3 15H6M18 9H21M18 15H21" stroke={c} strokeWidth="1.6" strokeLinecap="round" /></svg>
    ),
    play: (c) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke={c} strokeWidth="1.6" /><path d="M10 9.5L14.5 12L10 14.5V9.5Z" fill={c} /></svg>
    ),
    people: (c) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3" stroke={c} strokeWidth="1.6" /><path d="M4 19C4 15.7 6.2 14 9 14C11.8 14 14 15.7 14 19" stroke={c} strokeWidth="1.6" strokeLinecap="round" /><path d="M16 5.2C17.5 5.7 18.5 7 18.5 8.5C18.5 10 17.5 11.3 16 11.8M17 14.3C19 14.9 20.5 16.3 20.5 19" stroke={c} strokeWidth="1.6" strokeLinecap="round" /></svg>
    ),
}

function EventBooth(props: Props) {
    const {
        eyebrow = "ON THE BOOTH",
        heading = "Everything you'll see at Stand 5.B29",
        headingSize = 40,
        headingWeight = 800,
        subtitle = "Live demos, real footage, and the people who built it. Here's what's waiting for you at the Beamr stand.",
        featuredLabel = "JOINT LIVE DEMO",
        featuredTitle = "Real-time AI Video Super Resolution",
        featuredDescription = "See NVIDIA RTX Video Super Resolution and Beamr CABR working together on a live GPU pipeline — upscaling to pristine detail, then cutting bitrate 30–50% with quality guaranteed. One workflow, running in real time.",
        partnerA = "beamr",
        partnerB = "NVIDIA",
        featuredBullets = ["Live on NVIDIA RTX GPUs", "Side-by-side quality comparison", "Measured bitrate savings"],
        items = [
            { icon: "compress", title: "CABR encoding, live", description: "Watch content-adaptive bitrate reduction on real footage, with the savings measured in front of you." },
            { icon: "play", title: "Super resolution showcase", description: "SD and HD sources upscaled to HD and 4K — see the detail AI recovers." },
            { icon: "calculator", title: "Your savings, estimated", description: "Bring your specs and we'll model your CDN and storage savings on the spot." },
            { icon: "chip", title: "Optimized for machines", description: "Encoding tuned for both human perception and AI vision pipelines." },
            { icon: "people", title: "Meet the engineers", description: "Talk directly with the team behind CABR — 53 patents and counting." },
            { icon: "sparkle", title: "What's next", description: "A first look at where Beamr and NVIDIA are taking video optimization." },
        ],
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
    const [w, setW] = useState(1200)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const ro = new ResizeObserver((e) => {
            for (const en of e) setW(en.contentRect.width)
        })
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const obs = new IntersectionObserver(([e]) => e.isIntersecting && (setVisible(true), obs.disconnect()), { threshold: 0.1 })
        obs.observe(el)
        return () => obs.disconnect()
    }, [])

    const isMobile = w < 640
    const isTablet = w >= 640 && w < 980
    const cols = isMobile ? 1 : isTablet ? 2 : 3
    const ease = "cubic-bezier(0.16,1,0.3,1)"
    const rv = (i: number): React.CSSProperties => ({
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ${ease} ${i * 0.07}s, transform 0.7s ${ease} ${i * 0.07}s`,
    })

    useEffect(() => {
        const id = "__event-booth-css"
        if (document.getElementById(id)) return
        const s = document.createElement("style")
        s.id = id
        s.textContent = `.eb-card{transition:transform .35s ${ease}, box-shadow .35s ease, border-color .35s ease;} .eb-card:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(17,24,39,0.07);}`
        document.head.appendChild(s)
    }, [])

    return (
        <section ref={ref} id="booth" style={{ ...style, width: "100%", backgroundColor: bgColor, padding: isMobile ? "56px 22px" : "96px 32px", boxSizing: "border-box", fontFamily }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                {/* header */}
                <div style={{ maxWidth: 680, marginBottom: isMobile ? 32 : 48 }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16, ...rv(0) }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: primaryColor }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: primaryColor, textTransform: "uppercase", letterSpacing: "0.06em" }}>{eyebrow}</span>
                    </div>
                    <h2 style={{ fontSize: isMobile ? Math.round(headingSize * 0.75) : headingSize, fontWeight: headingWeight, color: textColor, margin: 0, lineHeight: 1.1, letterSpacing: "-0.03em", ...rv(1) }}>{heading}</h2>
                    <p style={{ fontSize: 17, color: secondaryColor, margin: "16px 0 0", lineHeight: 1.65, ...rv(2) }}>{subtitle}</p>
                </div>

                {/* Featured joint demo */}
                <div
                    className="eb-card"
                    style={{
                        borderRadius: 22,
                        border: `1px solid ${hexToRgba(primaryColor, 0.25)}`,
                        background: `linear-gradient(135deg, ${hexToRgba(primaryColor, 0.05)} 0%, ${hexToRgba(primaryColor, 0.02)} 100%)`,
                        padding: isMobile ? "28px 24px" : "40px",
                        display: "grid",
                        gridTemplateColumns: isMobile || isTablet ? "1fr" : "1.3fr 1fr",
                        gap: isMobile ? 24 : 40,
                        alignItems: "center",
                        marginBottom: 20,
                        ...rv(2),
                    }}
                >
                    <div>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                            <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: primaryColor, background: hexToRgba(primaryColor, 0.1), padding: "5px 10px", borderRadius: 999 }}>{featuredLabel}</span>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                                <span style={{ fontSize: 15, fontWeight: 800, color: textColor, letterSpacing: "-0.02em" }}>{partnerA}</span>
                                <span style={{ fontSize: 12, color: lightColor }}>×</span>
                                <span style={{ fontSize: 13, fontWeight: 700, color: "#76b900" }}>{partnerB}</span>
                            </span>
                        </div>
                        <h3 style={{ fontSize: isMobile ? 24 : 30, fontWeight: 700, color: textColor, margin: 0, lineHeight: 1.15, letterSpacing: "-0.02em" }}>{featuredTitle}</h3>
                        <p style={{ fontSize: 16, color: secondaryColor, margin: "14px 0 0", lineHeight: 1.65, maxWidth: 520 }}>{featuredDescription}</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {featuredBullets.map((b, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: bgColor, border: `1px solid ${borderColor}`, borderRadius: 12, padding: "14px 16px" }}>
                                <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: "50%", background: hexToRgba(primaryColor, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M2.8 7.2L5.6 10L11.2 4" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </span>
                                <span style={{ fontSize: 14.5, fontWeight: 600, color: textColor, letterSpacing: "-0.01em" }}>{b}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Grid of other booth items */}
                <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16 }}>
                    {items.map((item, i) => (
                        <div key={i} className="eb-card" style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 16, padding: 24, ...rv(3 + i * 0.4) }}>
                            <div style={{ width: 44, height: 44, borderRadius: 12, background: hexToRgba(primaryColor, 0.08), display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                                {(icons[item.icon] || icons.sparkle)(primaryColor)}
                            </div>
                            <div style={{ fontSize: 16.5, fontWeight: 700, color: textColor, letterSpacing: "-0.01em" }}>{item.title}</div>
                            <div style={{ fontSize: 14, color: secondaryColor, marginTop: 8, lineHeight: 1.6 }}>{item.description}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

addPropertyControls(EventBooth, {
    eyebrow: { type: ControlType.String, title: "Eyebrow", defaultValue: "ON THE BOOTH" },
    heading: { type: ControlType.String, title: "Heading", defaultValue: "Everything you'll see at Stand 5.B29", displayTextArea: true },
    headingSize: { type: ControlType.Number, title: "Heading Size", defaultValue: 40, min: 20, max: 72, step: 1 },
    headingWeight: { type: ControlType.Enum, title: "Heading Weight", options: [300, 400, 500, 600, 700, 800, 900], optionTitles: ["300", "400", "500", "600", "700", "800", "900"], defaultValue: 800 },
    subtitle: { type: ControlType.String, title: "Subtitle", defaultValue: "Live demos, real footage, and the people who built it. Here's what's waiting for you at the Beamr stand.", displayTextArea: true },
    featuredLabel: { type: ControlType.String, title: "Featured Label", defaultValue: "JOINT LIVE DEMO" },
    featuredTitle: { type: ControlType.String, title: "Featured Title", defaultValue: "Real-time AI Video Super Resolution", displayTextArea: true },
    featuredDescription: { type: ControlType.String, title: "Featured Description", defaultValue: "See NVIDIA RTX Video Super Resolution and Beamr CABR working together on a live GPU pipeline — upscaling to pristine detail, then cutting bitrate 30–50% with quality guaranteed. One workflow, running in real time.", displayTextArea: true },
    partnerA: { type: ControlType.String, title: "Partner A", defaultValue: "beamr" },
    partnerB: { type: ControlType.String, title: "Partner B", defaultValue: "NVIDIA" },
    featuredBullets: { type: ControlType.Array, title: "Featured Bullets", control: { type: ControlType.String }, maxCount: 5, defaultValue: ["Live on NVIDIA RTX GPUs", "Side-by-side quality comparison", "Measured bitrate savings"] },
    items: {
        type: ControlType.Array,
        title: "Booth Items",
        maxCount: 9,
        control: {
            type: ControlType.Object,
            controls: {
                icon: { type: ControlType.Enum, title: "Icon", options: ["sparkle", "compress", "calculator", "chip", "play", "people"], optionTitles: ["Sparkle", "Compress", "Calculator", "Chip", "Play", "People"], defaultValue: "sparkle" },
                title: { type: ControlType.String, title: "Title", defaultValue: "Booth item" },
                description: { type: ControlType.String, title: "Description", defaultValue: "Description of what visitors can see or do." },
            },
        },
        defaultValue: [
            { icon: "compress", title: "CABR encoding, live", description: "Watch content-adaptive bitrate reduction on real footage, with the savings measured in front of you." },
            { icon: "play", title: "Super resolution showcase", description: "SD and HD sources upscaled to HD and 4K — see the detail AI recovers." },
            { icon: "calculator", title: "Your savings, estimated", description: "Bring your specs and we'll model your CDN and storage savings on the spot." },
            { icon: "chip", title: "Optimized for machines", description: "Encoding tuned for both human perception and AI vision pipelines." },
            { icon: "people", title: "Meet the engineers", description: "Talk directly with the team behind CABR — 53 patents and counting." },
            { icon: "sparkle", title: "What's next", description: "A first look at where Beamr and NVIDIA are taking video optimization." },
        ],
    },
    bgColor: { type: ControlType.Color, title: "Background", defaultValue: "#ffffff" },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: "#111827" },
    secondaryColor: { type: ControlType.Color, title: "Secondary Text", defaultValue: "#6b7280" },
    lightColor: { type: ControlType.Color, title: "Light Text", defaultValue: "#9ca3af" },
    primaryColor: { type: ControlType.Color, title: "Primary", defaultValue: "#4F46E5" },
    cardBg: { type: ControlType.Color, title: "Card BG", defaultValue: "#f9fafb" },
    borderColor: { type: ControlType.Color, title: "Border", defaultValue: "#e5e7eb" },
    fontFamily: { type: ControlType.String, title: "Font", defaultValue: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" },
})

export default EventBooth
