// Beamr — "Why Meet Us" Section
// Framer Code Component in Beamr's light brand. A compact, numbered reasons
// row that answers "why book time with us at the show".

import { addPropertyControls, ControlType } from "framer"
import { useEffect, useRef, useState } from "react"

interface Reason {
    title: string
    description: string
}

interface Props {
    eyebrow: string
    heading: string
    headingSize: number
    headingWeight: number
    reasons: Reason[]
    bgColor: string
    textColor: string
    secondaryColor: string
    lightColor: string
    primaryColor: string
    borderColor: string
    fontFamily: string
    style?: React.CSSProperties
}

function EventWhyMeet(props: Props) {
    const {
        eyebrow = "WHY MEET US",
        heading = "Worth the walk to Hall 5",
        headingSize = 38,
        headingWeight = 800,
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
        const obs = new IntersectionObserver(([e]) => e.isIntersecting && (setVisible(true), obs.disconnect()), { threshold: 0.12 })
        obs.observe(el)
        return () => obs.disconnect()
    }, [])

    const isMobile = w < 620
    const isTablet = w >= 620 && w < 980
    const cols = isMobile ? 1 : isTablet ? 2 : reasons.length <= 3 ? reasons.length : 4
    const ease = "cubic-bezier(0.16,1,0.3,1)"
    const rv = (i: number): React.CSSProperties => ({
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s ${ease} ${i * 0.08}s, transform 0.7s ${ease} ${i * 0.08}s`,
    })

    return (
        <section ref={ref} style={{ ...style, width: "100%", backgroundColor: bgColor, padding: isMobile ? "56px 22px" : "88px 32px", boxSizing: "border-box", fontFamily }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <div style={{ maxWidth: 680, marginBottom: isMobile ? 32 : 48 }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16, ...rv(0) }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: primaryColor }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: primaryColor, textTransform: "uppercase", letterSpacing: "0.06em" }}>{eyebrow}</span>
                    </div>
                    <h2 style={{ fontSize: isMobile ? Math.round(headingSize * 0.76) : headingSize, fontWeight: headingWeight, color: textColor, margin: 0, lineHeight: 1.1, letterSpacing: "-0.03em", ...rv(1) }}>{heading}</h2>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: isMobile ? 8 : 0 }}>
                    {reasons.map((r, i) => (
                        <div
                            key={i}
                            style={{
                                padding: isMobile ? "24px 0" : "8px 28px",
                                borderLeft: isMobile ? "none" : `1px solid ${borderColor}`,
                                borderTop: isMobile ? `1px solid ${borderColor}` : "none",
                                ...rv(2 + i * 0.5),
                            }}
                        >
                            <div style={{ fontSize: 14, fontWeight: 700, color: primaryColor, fontFeatureSettings: "'tnum'", marginBottom: 14, letterSpacing: "0.02em" }}>
                                {String(i + 1).padStart(2, "0")}
                            </div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: textColor, letterSpacing: "-0.01em", lineHeight: 1.25 }}>{r.title}</div>
                            <div style={{ fontSize: 14.5, color: secondaryColor, marginTop: 10, lineHeight: 1.6 }}>{r.description}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

addPropertyControls(EventWhyMeet, {
    eyebrow: { type: ControlType.String, title: "Eyebrow", defaultValue: "WHY MEET US" },
    heading: { type: ControlType.String, title: "Heading", defaultValue: "Worth the walk to Hall 5", displayTextArea: true },
    headingSize: { type: ControlType.Number, title: "Heading Size", defaultValue: 38, min: 20, max: 64, step: 1 },
    headingWeight: { type: ControlType.Enum, title: "Heading Weight", options: [300, 400, 500, 600, 700, 800, 900], optionTitles: ["300", "400", "500", "600", "700", "800", "900"], defaultValue: 800 },
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
    fontFamily: { type: ControlType.String, title: "Font", defaultValue: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" },
})

export default EventWhyMeet
