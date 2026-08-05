// Beamr — "Why Meet Us" Section — photo + reasons
// Framer Code Component in Beamr's light brand. A tall photo on one side,
// a numbered reasons list on the other.

import { addPropertyControls, ControlType } from "framer"
import { useEffect, useRef, useState } from "react"

interface Reason {
    title: string
    description: string
}

interface Props {
    kicker: string
    heading: string
    headingSize: number
    headingWeight: number
    photo: string
    reasons: Reason[]
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

function EventWhyMeet(props: Props) {
    const {
        kicker = "WHY MEET US",
        heading = "Worth the walk to Hall 5",
        headingSize = 40,
        headingWeight = 800,
        photo = "",
        reasons = [
            { title: "See it, don't imagine it", description: "Live CABR and AI super resolution on real footage — not slides. Judge the quality with your own eyes." },
            { title: "A first with NVIDIA", description: "The joint Beamr × NVIDIA demo runs only at the booth. See real-time Video Super Resolution before anyone else." },
            { title: "Numbers for your workflow", description: "Bring your bitrates and volumes — we'll estimate your exact CDN and storage savings while you're there." },
            { title: "Straight to the source", description: "No sales layer. Talk directly with the engineers who hold 53 patents in video optimization." },
        ],
        bgColor = "#f9fafb",
        textColor = "#111827",
        secondaryColor = "#6b7280",
        lightColor = "#9ca3af",
        primaryColor = "#4F46E5",
        borderColor = "#e5e7eb",
        placeholderBg = "#e9eaee",
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
        transition: `opacity 0.7s ${ease} ${i * 0.08}s, transform 0.7s ${ease} ${i * 0.08}s`,
    })

    return (
        <section ref={ref} style={{ ...style, width: "100%", backgroundColor: bgColor, padding: isMobile ? "56px 22px" : "100px 32px", boxSizing: "border-box", fontFamily }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "0.85fr 1fr", gap: isMobile ? 36 : 72, alignItems: "center" }}>
                {/* photo */}
                <div style={{ position: "relative", width: "100%", aspectRatio: isMobile ? "16/10" : "4/5", borderRadius: 20, overflow: "hidden", background: placeholderBg, ...rv(0) }}>
                    {photo ? (
                        <img src={photo} alt={heading} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    ) : (
                        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                            {imageGlyph(hexToRgba("#111827", 0.2))}
                            <span style={{ fontSize: 12, fontWeight: 500, color: lightColor }}>Team / booth candid</span>
                        </div>
                    )}
                </div>

                {/* reasons */}
                <div>
                    <div style={{ ...rv(0) }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: primaryColor, textTransform: "uppercase", letterSpacing: "0.14em" }}>{kicker}</span>
                    </div>
                    <h2 style={{ fontSize: isMobile ? Math.round(headingSize * 0.76) : headingSize, fontWeight: headingWeight, color: textColor, margin: "16px 0 28px", lineHeight: 1.1, letterSpacing: "-0.03em", ...rv(1) }}>{heading}</h2>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        {reasons.map((r, i) => (
                            <div key={i} style={{ display: "flex", gap: 18, padding: "20px 0", borderTop: i === 0 ? "none" : `1px solid ${borderColor}`, ...rv(2 + i * 0.5) }}>
                                <span style={{ flexShrink: 0, fontSize: 13, fontWeight: 700, color: primaryColor, fontVariantNumeric: "tabular-nums", paddingTop: 3, width: 24 }}>{String(i + 1).padStart(2, "0")}</span>
                                <div>
                                    <div style={{ fontSize: 17.5, fontWeight: 700, color: textColor, letterSpacing: "-0.01em", lineHeight: 1.3 }}>{r.title}</div>
                                    <div style={{ fontSize: 14.5, color: secondaryColor, marginTop: 6, lineHeight: 1.6 }}>{r.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

addPropertyControls(EventWhyMeet, {
    kicker: { type: ControlType.String, title: "Kicker", defaultValue: "WHY MEET US" },
    heading: { type: ControlType.String, title: "Heading", defaultValue: "Worth the walk to Hall 5", displayTextArea: true },
    headingSize: { type: ControlType.Number, title: "Heading Size", defaultValue: 40, min: 20, max: 64, step: 1 },
    headingWeight: { type: ControlType.Enum, title: "Heading Weight", options: [300, 400, 500, 600, 700, 800, 900], optionTitles: ["300", "400", "500", "600", "700", "800", "900"], defaultValue: 800 },
    photo: { type: ControlType.Image, title: "Photo" },
    reasons: {
        type: ControlType.Array,
        title: "Reasons",
        maxCount: 6,
        control: {
            type: ControlType.Object,
            controls: {
                title: { type: ControlType.String, title: "Title", defaultValue: "Reason" },
                description: { type: ControlType.String, title: "Description", defaultValue: "Why this matters." },
            },
        },
        defaultValue: [
            { title: "See it, don't imagine it", description: "Live CABR and AI super resolution on real footage — not slides. Judge the quality with your own eyes." },
            { title: "A first with NVIDIA", description: "The joint Beamr × NVIDIA demo runs only at the booth. See real-time Video Super Resolution before anyone else." },
            { title: "Numbers for your workflow", description: "Bring your bitrates and volumes — we'll estimate your exact CDN and storage savings while you're there." },
            { title: "Straight to the source", description: "No sales layer. Talk directly with the engineers who hold 53 patents in video optimization." },
        ],
    },
    bgColor: { type: ControlType.Color, title: "Background", defaultValue: "#f9fafb" },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: "#111827" },
    secondaryColor: { type: ControlType.Color, title: "Secondary Text", defaultValue: "#6b7280" },
    lightColor: { type: ControlType.Color, title: "Light Text", defaultValue: "#9ca3af" },
    primaryColor: { type: ControlType.Color, title: "Primary", defaultValue: "#4F46E5" },
    borderColor: { type: ControlType.Color, title: "Border", defaultValue: "#e5e7eb" },
    placeholderBg: { type: ControlType.Color, title: "Placeholder BG", defaultValue: "#e9eaee" },
    fontFamily: { type: ControlType.String, title: "Font", defaultValue: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" },
})

export default EventWhyMeet
