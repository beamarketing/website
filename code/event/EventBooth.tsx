// Beamr — "On the Booth" Section — photo-led
// Framer Code Component in Beamr's light brand. A large featured photo for
// the Beamr × NVIDIA joint demo, then a gallery of photo cards for the
// other booth experiences. No icon tiles — real imagery leads.

import { addPropertyControls, ControlType } from "framer"
import { useEffect, useRef, useState } from "react"

interface BoothItem {
    image: string
    title: string
    description: string
}

interface Props {
    kicker: string
    heading: string
    headingSize: number
    headingWeight: number
    subtitle: string
    featuredImage: string
    featuredTag: string
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
    <svg width="28" height="28" viewBox="0 0 30 30" fill="none">
        <rect x="4" y="6" width="22" height="18" rx="2.5" stroke={c} strokeWidth="1.6" />
        <circle cx="10.5" cy="12" r="2" stroke={c} strokeWidth="1.6" />
        <path d="M5 21L11.5 15.5L16 19.5L20 16L25 20.5" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

function Photo({ src, label, ratio, placeholderBg, lightColor, radius = 0 }: { src: string; label: string; ratio: string; placeholderBg: string; lightColor: string; radius?: number }) {
    return (
        <div style={{ position: "relative", width: "100%", aspectRatio: ratio, overflow: "hidden", background: placeholderBg, borderRadius: radius }}>
            {src ? (
                <img src={src} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            ) : (
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 9, background: `linear-gradient(135deg, ${placeholderBg} 0%, ${hexToRgba("#000000", 0.03)} 100%)` }}>
                    {imageGlyph(hexToRgba("#111827", 0.2))}
                    <span style={{ fontSize: 11.5, fontWeight: 500, color: lightColor }}>{label}</span>
                </div>
            )}
        </div>
    )
}

function EventBooth(props: Props) {
    const {
        kicker = "ON THE BOOTH",
        heading = "Everything you'll see at Stand 5.B29",
        headingSize = 42,
        headingWeight = 800,
        subtitle = "Live demos, real footage, and the people who built it.",
        featuredImage = "",
        featuredTag = "JOINT LIVE DEMO",
        featuredTitle = "Real-time AI Video Super Resolution",
        featuredDescription = "See NVIDIA RTX Video Super Resolution and Beamr CABR working together on a live GPU pipeline — upscaling to pristine detail, then cutting bitrate 30–50% with quality guaranteed.",
        partnerA = "beamr",
        partnerB = "NVIDIA",
        featuredBullets = ["Live on NVIDIA RTX GPUs", "Side-by-side quality comparison", "Measured bitrate savings"],
        items = [
            { image: "", title: "CABR encoding, live", description: "Content-adaptive bitrate reduction on real footage — savings measured in front of you." },
            { image: "", title: "Super resolution showcase", description: "SD and HD sources upscaled to HD and 4K." },
            { image: "", title: "Your savings, estimated", description: "Bring your specs; we'll model your CDN and storage savings on the spot." },
            { image: "", title: "Meet the engineers", description: "Talk directly with the team behind CABR — 53 patents and counting." },
        ],
        bgColor = "#ffffff",
        textColor = "#111827",
        secondaryColor = "#6b7280",
        lightColor = "#9ca3af",
        primaryColor = "#4F46E5",
        cardBg = "#f9fafb",
        borderColor = "#e5e7eb",
        placeholderBg = "#f3f4f6",
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
    const cols = isMobile ? 1 : isTablet ? 2 : Math.min(items.length, 4)
    const ease = "cubic-bezier(0.16,1,0.3,1)"
    const rv = (i: number): React.CSSProperties => ({
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ${ease} ${i * 0.07}s, transform 0.7s ${ease} ${i * 0.07}s`,
    })

    useEffect(() => {
        const id = "__event-booth-css2"
        if (document.getElementById(id)) return
        const s = document.createElement("style")
        s.id = id
        s.textContent = `.eb2-card{transition:transform .4s ${ease};} .eb2-card:hover{transform:translateY(-5px);} .eb2-card:hover .eb2-img{transform:scale(1.04);} .eb2-img{transition:transform .6s ${ease};}`
        document.head.appendChild(s)
    }, [])

    const Kicker = (
        <div style={{ display: "flex", alignItems: "center", gap: 12, ...rv(0) }}>
            <span style={{ width: 28, height: 2, background: primaryColor, borderRadius: 2 }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: textColor, textTransform: "uppercase", letterSpacing: "0.14em" }}>{kicker}</span>
        </div>
    )

    return (
        <section ref={ref} id="booth" style={{ ...style, width: "100%", backgroundColor: bgColor, padding: isMobile ? "56px 22px" : "100px 32px", boxSizing: "border-box", fontFamily }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                {/* header */}
                <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "flex-end", gap: 20, marginBottom: isMobile ? 32 : 52 }}>
                    <div style={{ maxWidth: 620 }}>
                        {Kicker}
                        <h2 style={{ fontSize: isMobile ? Math.round(headingSize * 0.72) : headingSize, fontWeight: headingWeight, color: textColor, margin: "18px 0 0", lineHeight: 1.08, letterSpacing: "-0.03em", ...rv(1) }}>{heading}</h2>
                    </div>
                    <p style={{ fontSize: 16, color: secondaryColor, margin: 0, lineHeight: 1.6, maxWidth: 320, ...rv(2) }}>{subtitle}</p>
                </div>

                {/* Featured joint demo — photo led */}
                <div className="eb2-card" style={{ display: "grid", gridTemplateColumns: isMobile || isTablet ? "1fr" : "1.15fr 1fr", gap: isMobile ? 0 : 0, borderRadius: 22, overflow: "hidden", border: `1px solid ${borderColor}`, marginBottom: isMobile ? 40 : 56, ...rv(2) }}>
                    <div style={{ position: "relative", overflow: "hidden" }}>
                        <div className="eb2-img" style={{ width: "100%", height: "100%", minHeight: isMobile ? 220 : 340 }}>
                            <Photo src={featuredImage} label="Joint demo — video wall / GPU rig" ratio={isMobile ? "16/10" : "auto"} placeholderBg={placeholderBg} lightColor={lightColor} />
                        </div>
                        <span style={{ position: "absolute", top: 16, left: 16, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#fff", background: primaryColor, padding: "6px 12px", borderRadius: 999 }}>{featuredTag}</span>
                    </div>
                    <div style={{ padding: isMobile ? "26px 22px" : "40px", background: cardBg, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                            <span style={{ fontSize: 15, fontWeight: 800, color: textColor, letterSpacing: "-0.02em" }}>{partnerA}</span>
                            <span style={{ fontSize: 12, color: lightColor }}>×</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#76b900" }}>{partnerB}</span>
                        </div>
                        <h3 style={{ fontSize: isMobile ? 23 : 27, fontWeight: 700, color: textColor, margin: 0, lineHeight: 1.15, letterSpacing: "-0.02em" }}>{featuredTitle}</h3>
                        <p style={{ fontSize: 15.5, color: secondaryColor, margin: "14px 0 20px", lineHeight: 1.6 }}>{featuredDescription}</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {featuredBullets.map((b, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <svg width="15" height="15" viewBox="0 0 14 14" fill="none"><path d="M2.8 7.2L5.6 10L11.2 4" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    <span style={{ fontSize: 14.5, fontWeight: 500, color: textColor }}>{b}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Gallery of photo cards */}
                <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: isMobile ? 20 : 20 }}>
                    {items.map((item, i) => (
                        <div key={i} className="eb2-card" style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${borderColor}`, background: bgColor, ...rv(3 + i * 0.4) }}>
                            <div style={{ overflow: "hidden" }}>
                                <div className="eb2-img">
                                    <Photo src={item.image} label="Booth photo" ratio="4/3" placeholderBg={placeholderBg} lightColor={lightColor} />
                                </div>
                            </div>
                            <div style={{ padding: "18px 18px 20px" }}>
                                <div style={{ fontSize: 15.5, fontWeight: 700, color: textColor, letterSpacing: "-0.01em" }}>{item.title}</div>
                                <div style={{ fontSize: 13.5, color: secondaryColor, marginTop: 7, lineHeight: 1.55 }}>{item.description}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

addPropertyControls(EventBooth, {
    kicker: { type: ControlType.String, title: "Kicker", defaultValue: "ON THE BOOTH" },
    heading: { type: ControlType.String, title: "Heading", defaultValue: "Everything you'll see at Stand 5.B29", displayTextArea: true },
    headingSize: { type: ControlType.Number, title: "Heading Size", defaultValue: 42, min: 20, max: 72, step: 1 },
    headingWeight: { type: ControlType.Enum, title: "Heading Weight", options: [300, 400, 500, 600, 700, 800, 900], optionTitles: ["300", "400", "500", "600", "700", "800", "900"], defaultValue: 800 },
    subtitle: { type: ControlType.String, title: "Subtitle", defaultValue: "Live demos, real footage, and the people who built it.", displayTextArea: true },
    featuredImage: { type: ControlType.Image, title: "Featured Photo" },
    featuredTag: { type: ControlType.String, title: "Featured Tag", defaultValue: "JOINT LIVE DEMO" },
    featuredTitle: { type: ControlType.String, title: "Featured Title", defaultValue: "Real-time AI Video Super Resolution", displayTextArea: true },
    featuredDescription: { type: ControlType.String, title: "Featured Description", defaultValue: "See NVIDIA RTX Video Super Resolution and Beamr CABR working together on a live GPU pipeline — upscaling to pristine detail, then cutting bitrate 30–50% with quality guaranteed.", displayTextArea: true },
    partnerA: { type: ControlType.String, title: "Partner A", defaultValue: "beamr" },
    partnerB: { type: ControlType.String, title: "Partner B", defaultValue: "NVIDIA" },
    featuredBullets: { type: ControlType.Array, title: "Featured Bullets", control: { type: ControlType.String }, maxCount: 5, defaultValue: ["Live on NVIDIA RTX GPUs", "Side-by-side quality comparison", "Measured bitrate savings"] },
    items: {
        type: ControlType.Array,
        title: "Booth Items",
        maxCount: 8,
        control: {
            type: ControlType.Object,
            controls: {
                image: { type: ControlType.Image, title: "Photo" },
                title: { type: ControlType.String, title: "Title", defaultValue: "Booth item" },
                description: { type: ControlType.String, title: "Description", defaultValue: "What visitors can see or do." },
            },
        },
        defaultValue: [
            { image: "", title: "CABR encoding, live", description: "Content-adaptive bitrate reduction on real footage — savings measured in front of you." },
            { image: "", title: "Super resolution showcase", description: "SD and HD sources upscaled to HD and 4K." },
            { image: "", title: "Your savings, estimated", description: "Bring your specs; we'll model your CDN and storage savings on the spot." },
            { image: "", title: "Meet the engineers", description: "Talk directly with the team behind CABR — 53 patents and counting." },
        ],
    },
    bgColor: { type: ControlType.Color, title: "Background", defaultValue: "#ffffff" },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: "#111827" },
    secondaryColor: { type: ControlType.Color, title: "Secondary Text", defaultValue: "#6b7280" },
    lightColor: { type: ControlType.Color, title: "Light Text", defaultValue: "#9ca3af" },
    primaryColor: { type: ControlType.Color, title: "Primary", defaultValue: "#4F46E5" },
    cardBg: { type: ControlType.Color, title: "Card BG", defaultValue: "#f9fafb" },
    borderColor: { type: ControlType.Color, title: "Border", defaultValue: "#e5e7eb" },
    placeholderBg: { type: ControlType.Color, title: "Placeholder BG", defaultValue: "#f3f4f6" },
    fontFamily: { type: ControlType.String, title: "Font", defaultValue: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" },
})

export default EventBooth
