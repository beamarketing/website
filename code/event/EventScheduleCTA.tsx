// Beamr — "Schedule a Demo" CTA Section
// Framer Code Component in Beamr's light brand. A closing call-to-action
// card with the event facts and a scheduling button. Uses a dark ground
// (#0f1117, from index.html) to give the page a confident close.

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
    dates: string
    location: string
    stand: string
    note: string
    bgColor: string
    textColor: string
    secondaryColor: string
    primaryColor: string
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

function EventScheduleCTA(props: Props) {
    const {
        eyebrow = "SCHEDULE A DEMO",
        heading = "Let's find the bits that don't matter — together",
        headingSize = 40,
        headingWeight = 800,
        subtitle = "Book a slot with the Beamr team at IBC 2026 and see CABR and the NVIDIA joint demo running live. Tell us your workflow and we'll tailor the session to it.",
        primaryText = "Book your demo slot",
        primaryUrl = "#schedule",
        secondaryText = "Email the team",
        secondaryUrl = "mailto:events@beamr.com",
        dates = "11–14 September 2026",
        location = "RAI Amsterdam",
        stand = "Hall 5 · Stand 5.B29",
        note = "Slots fill fast during show hours — book ahead to guarantee time with an engineer.",
        bgColor = "#0f1117",
        textColor = "#ffffff",
        secondaryColor = "#9ca3af",
        primaryColor = "#4F46E5",
        borderColor = "rgba(255,255,255,0.1)",
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
            for (const en of e) setIsMobile(en.contentRect.width < 820)
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
    const rv = (i: number): React.CSSProperties => ({
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s ${ease} ${i * 0.1}s, transform 0.7s ${ease} ${i * 0.1}s`,
    })

    const fact = (label: string, value: string) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: hexToRgba("#ffffff", 0.45) }}>{label}</span>
            <span style={{ fontSize: 15, fontWeight: 600, color: textColor, letterSpacing: "-0.01em" }}>{value}</span>
        </div>
    )

    return (
        <section ref={ref} id="schedule" style={{ ...style, width: "100%", backgroundColor: bgColor, padding: isMobile ? "56px 22px" : "96px 32px", boxSizing: "border-box", fontFamily }}>
            <div
                style={{
                    maxWidth: 1000,
                    margin: "0 auto",
                    background: hexToRgba("#ffffff", 0.03),
                    border: `1px solid ${borderColor}`,
                    borderRadius: 24,
                    padding: isMobile ? "36px 26px" : "56px 56px",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* soft glow */}
                <div style={{ position: "absolute", top: -120, right: -80, width: 340, height: 340, borderRadius: "50%", background: `radial-gradient(circle, ${hexToRgba(primaryColor, 0.22)} 0%, transparent 70%)`, pointerEvents: "none" }} />

                <div style={{ position: "relative" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 18, ...rv(0) }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: primaryColor }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: hexToRgba("#ffffff", 0.7), textTransform: "uppercase", letterSpacing: "0.06em" }}>{eyebrow}</span>
                    </div>
                    <h2 style={{ fontSize: isMobile ? Math.round(headingSize * 0.72) : headingSize, fontWeight: headingWeight, color: textColor, margin: 0, lineHeight: 1.12, letterSpacing: "-0.03em", maxWidth: 620, ...rv(1) }}>{heading}</h2>
                    <p style={{ fontSize: 16.5, color: secondaryColor, margin: "18px 0 0", lineHeight: 1.65, maxWidth: 560, ...rv(2) }}>{subtitle}</p>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28, ...rv(3) }}>
                        <a href={primaryUrl} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: primaryColor, color: "#fff", padding: "15px 30px", borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
                            {primaryText}
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </a>
                        <a href={secondaryUrl} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: textColor, padding: "15px 30px", borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: "none", border: `1.5px solid ${hexToRgba("#ffffff", 0.2)}` }}>
                            {secondaryText}
                        </a>
                    </div>

                    {/* event facts footer */}
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: isMobile ? 20 : 48,
                            marginTop: 36,
                            paddingTop: 28,
                            borderTop: `1px solid ${borderColor}`,
                            ...rv(4),
                        }}
                    >
                        {fact("Dates", dates)}
                        {fact("Location", location)}
                        {fact("Stand", stand)}
                    </div>
                    {note ? <p style={{ fontSize: 13, color: hexToRgba("#ffffff", 0.4), margin: "18px 0 0", ...rv(5) }}>{note}</p> : null}
                </div>
            </div>
        </section>
    )
}

addPropertyControls(EventScheduleCTA, {
    eyebrow: { type: ControlType.String, title: "Eyebrow", defaultValue: "SCHEDULE A DEMO" },
    heading: { type: ControlType.String, title: "Heading", defaultValue: "Let's find the bits that don't matter — together", displayTextArea: true },
    headingSize: { type: ControlType.Number, title: "Heading Size", defaultValue: 40, min: 20, max: 72, step: 1 },
    headingWeight: { type: ControlType.Enum, title: "Heading Weight", options: [300, 400, 500, 600, 700, 800, 900], optionTitles: ["300", "400", "500", "600", "700", "800", "900"], defaultValue: 800 },
    subtitle: { type: ControlType.String, title: "Subtitle", defaultValue: "Book a slot with the Beamr team at IBC 2026 and see CABR and the NVIDIA joint demo running live. Tell us your workflow and we'll tailor the session to it.", displayTextArea: true },
    primaryText: { type: ControlType.String, title: "Primary Button", defaultValue: "Book your demo slot" },
    primaryUrl: { type: ControlType.String, title: "Primary URL", defaultValue: "#schedule" },
    secondaryText: { type: ControlType.String, title: "Secondary Button", defaultValue: "Email the team" },
    secondaryUrl: { type: ControlType.String, title: "Secondary URL", defaultValue: "mailto:events@beamr.com" },
    dates: { type: ControlType.String, title: "Dates", defaultValue: "11–14 September 2026" },
    location: { type: ControlType.String, title: "Location", defaultValue: "RAI Amsterdam" },
    stand: { type: ControlType.String, title: "Stand", defaultValue: "Hall 5 · Stand 5.B29" },
    note: { type: ControlType.String, title: "Note", defaultValue: "Slots fill fast during show hours — book ahead to guarantee time with an engineer.", displayTextArea: true },
    bgColor: { type: ControlType.Color, title: "Background", defaultValue: "#0f1117" },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: "#ffffff" },
    secondaryColor: { type: ControlType.Color, title: "Secondary Text", defaultValue: "#9ca3af" },
    primaryColor: { type: ControlType.Color, title: "Primary", defaultValue: "#4F46E5" },
    borderColor: { type: ControlType.Color, title: "Border", defaultValue: "rgba(255,255,255,0.1)" },
    fontFamily: { type: ControlType.String, title: "Font", defaultValue: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" },
})

export default EventScheduleCTA
