// Career Hero Section — animated pixel canvas, scan line, bitstream, crop marks
// Standalone Framer component with full property controls

import { addPropertyControls, ControlType } from "framer"
import { useState, useEffect, useRef } from "react"

const COLORS = {
    darkNavy: "#000737",
    fullBlue: "#3751FF",
    accentBlue: "#0099FF",
    white: "#FFFFFF",
}

const DEFAULTS = {
    headingFont: "'Poppins', 'Inter', sans-serif",
    bodyFont: "'Inter', 'Poppins', sans-serif",
    monoFont: "'JetBrains Mono', 'Fira Code', monospace",
    heroHeadlineSize: 130,
    heroSubheadlineSize: 18,
    statNumberSize: 28,
    labelSize: 11,
    ctaButtonSize: 14,
}

// ─── Pixel Canvas ──────────────────────────────────────────────
function PixelCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const mouseRef = useRef({ x: -1000, y: -1000 })
    const pixelsRef = useRef<any[]>([])
    const animRef = useRef<number>(0)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const dpr = Math.min(window.devicePixelRatio || 1, 2)

        function resize() {
            if (!canvas) return
            const rect = canvas.getBoundingClientRect()
            canvas.width = rect.width * dpr
            canvas.height = rect.height * dpr
            ctx!.scale(dpr, dpr)
            initPixels(rect.width, rect.height)
        }

        function initPixels(w: number, h: number) {
            const count = Math.floor((w * h) / 2800)
            const pixels: any[] = []
            for (let i = 0; i < count; i++) {
                const size = 4 + Math.random() * 28
                pixels.push({
                    x: Math.random() * w, y: Math.random() * h, size,
                    baseOpacity: 0.015 + Math.random() * 0.045,
                    color: Math.random() < 0.6 ? "255,255,255" : "55,81,255",
                    phase: Math.random() * Math.PI * 2,
                    speed: 0.3 + Math.random() * 0.7,
                    driftX: (Math.random() - 0.5) * 0.3,
                    driftY: (Math.random() - 0.5) * 0.3,
                    blinker: Math.random() < 0.15,
                    blinkState: true,
                    blinkTimer: Math.random() * 200,
                })
            }
            pixelsRef.current = pixels
        }

        function animate(time: number) {
            if (!canvas || !ctx) return
            const rect = canvas.getBoundingClientRect()
            const w = rect.width
            const h = rect.height
            ctx.clearRect(0, 0, w, h)

            const mx = mouseRef.current.x
            const my = mouseRef.current.y

            for (const p of pixelsRef.current) {
                const breath = Math.sin(time * 0.001 * p.speed + p.phase)
                let opacity = p.baseOpacity + breath * 0.015

                p.x += p.driftX * 0.16
                p.y += p.driftY * 0.16
                if (p.x < -p.size) p.x = w + p.size
                if (p.x > w + p.size) p.x = -p.size
                if (p.y < -p.size) p.y = h + p.size
                if (p.y > h + p.size) p.y = -p.size

                if (p.blinker) {
                    p.blinkTimer -= 16
                    if (p.blinkTimer <= 0) {
                        p.blinkState = !p.blinkState
                        p.blinkTimer = 80 + Math.random() * 300
                    }
                    if (!p.blinkState) opacity *= 0.1
                }

                const dx = p.x - mx
                const dy = p.y - my
                const dist = Math.sqrt(dx * dx + dy * dy)
                if (dist < 180) {
                    const proximity = 1 - dist / 180
                    const glow = proximity * proximity
                    ctx.fillStyle = `rgba(0,153,255,${glow * 0.12})`
                    ctx.fillRect(p.x - p.size * 0.5 - 2, p.y - p.size * 0.5 - 2, p.size + 4, p.size + 4)
                    opacity += glow * 0.04
                }

                ctx.fillStyle = `rgba(${p.color},${Math.max(0, Math.min(1, opacity))})`
                ctx.fillRect(p.x - p.size * 0.5, p.y - p.size * 0.5, p.size, p.size)
            }

            animRef.current = requestAnimationFrame(animate)
        }

        resize()
        animRef.current = requestAnimationFrame(animate)
        window.addEventListener("resize", resize)

        function handleMouse(e: MouseEvent) {
            if (!canvas) return
            const rect = canvas.getBoundingClientRect()
            mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
        }
        canvas.addEventListener("mousemove", handleMouse)

        return () => {
            cancelAnimationFrame(animRef.current)
            window.removeEventListener("resize", resize)
            canvas.removeEventListener("mousemove", handleMouse)
        }
    }, [])

    return (
        <canvas ref={canvasRef} style={{
            position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
            zIndex: 0, pointerEvents: "auto",
        }} />
    )
}

// ─── Scan Line ─────────────────────────────────────────────────
function ScanLine() {
    return (
        <>
            <style>{`
                @keyframes scanSweep {
                    0%, 100% { top: 0%; }
                    50% { top: 100%; }
                }
            `}</style>
            <div style={{
                position: "absolute", left: 0, width: "100%", height: 1,
                background: `linear-gradient(90deg, transparent 0%, ${COLORS.accentBlue}33 20%, ${COLORS.accentBlue}66 50%, ${COLORS.accentBlue}33 80%, transparent 100%)`,
                opacity: 0.4, zIndex: 1, pointerEvents: "none",
                animation: "scanSweep 6s ease-in-out infinite",
            }} />
        </>
    )
}

// ─── BitStream ─────────────────────────────────────────────────
function BitStream({ isMobile, font }: { isMobile: boolean; font: string }) {
    const [bits, setBits] = useState("")
    useEffect(() => {
        const len = isMobile ? 24 : 48
        const interval = setInterval(() => {
            let s = ""
            for (let i = 0; i < len; i++) s += Math.random() < 0.5 ? "0" : "1"
            setBits(s)
        }, 120)
        return () => clearInterval(interval)
    }, [isMobile])

    return (
        <div style={{
            position: "absolute", bottom: isMobile ? 16 : 24, right: isMobile ? 24 : 48,
            fontFamily: font, fontSize: isMobile ? 7 : 9,
            color: COLORS.white, opacity: 0.06, letterSpacing: "1.5px",
            zIndex: 2, pointerEvents: "none",
        }}>
            {bits}
        </div>
    )
}

// ─── Crop Marks ────────────────────────────────────────────────
function CropMarks() {
    const stroke = `1.5px solid rgba(0,153,255,0.2)`
    const base: React.CSSProperties = { position: "absolute", width: 36, height: 36, zIndex: 2, pointerEvents: "none" }
    return (
        <>
            <div style={{ ...base, top: 40, left: 40, borderTop: stroke, borderLeft: stroke }} />
            <div style={{ ...base, top: 40, right: 40, borderTop: stroke, borderRight: stroke }} />
            <div style={{ ...base, bottom: 40, left: 40, borderBottom: stroke, borderLeft: stroke }} />
            <div style={{ ...base, bottom: 40, right: 40, borderBottom: stroke, borderRight: stroke }} />
        </>
    )
}

// ═══════════════════════════════════════════════════════════════
// CAREER HERO — main export
// ═══════════════════════════════════════════════════════════════
interface CareerHeroProps {
    // Fonts
    headingFont: string
    bodyFont: string
    monoFont: string
    heroHeadlineSize: number
    heroSubheadlineSize: number
    statNumberSize: number
    labelSize: number
    ctaButtonSize: number
    // Colors
    headlineColor: string
    subheadlineColor: string
    subheadlineBoldColor: string
    badgeTextColor: string
    badgeBgColor: string
    statNumberColor: string
    statLabelColor: string
    ctaTextColor: string
    ctaBgColor: string
    // Copy
    badge: string
    headline: string
    subheadline1: string
    subheadline2: string
    ctaText: string
    stat1Value: string
    stat1Label: string
    stat2Value: string
    stat2Unit: string
    stat2Label: string
    stat3Value: string
    stat3Label: string
    // Style
    style?: React.CSSProperties
}

function CareerHero(props: CareerHeroProps) {
    const {
        headingFont = DEFAULTS.headingFont,
        bodyFont = DEFAULTS.bodyFont,
        monoFont = DEFAULTS.monoFont,
        heroHeadlineSize = DEFAULTS.heroHeadlineSize,
        heroSubheadlineSize = DEFAULTS.heroSubheadlineSize,
        statNumberSize = DEFAULTS.statNumberSize,
        labelSize = DEFAULTS.labelSize,
        ctaButtonSize = DEFAULTS.ctaButtonSize,
        headlineColor = COLORS.white,
        subheadlineColor = "rgba(255,255,255,0.35)",
        subheadlineBoldColor = "rgba(255,255,255,0.7)",
        badgeTextColor = COLORS.white,
        badgeBgColor = COLORS.fullBlue,
        statNumberColor = COLORS.white,
        statLabelColor = "rgba(255,255,255,0.25)",
        ctaTextColor = COLORS.white,
        ctaBgColor = COLORS.accentBlue,
        badge = "Now Hiring",
        headline = "EVERY\nBIT\nCOUNTS.",
        subheadline1 = "We analyze every bit to find the ones that matter.",
        subheadline2 = "We hire the same way.",
        ctaText = "See Open Roles ↓",
        stat1Value = "53", stat1Label = "Patents",
        stat2Value = "1", stat2Unit = "Emmy", stat2Label = "Technology & Engineering",
        stat3Value = "~50", stat3Label = "People",
        style,
    } = props

    const [isMobile, setIsMobile] = useState(false)
    useEffect(() => {
        function check() { setIsMobile(window.innerWidth <= 900) }
        check()
        window.addEventListener("resize", check)
        return () => window.removeEventListener("resize", check)
    }, [])

    const headlineLines = headline.split("\n")

    return (
        <section
            id="careers-hero"
            style={{
                ...style,
                width: "100%", minHeight: "100vh",
                display: "flex", flexDirection: "column",
                alignItems: isMobile ? "flex-start" : "center", justifyContent: "center",
                position: "relative", overflow: "hidden",
                backgroundColor: COLORS.darkNavy,
                padding: isMobile ? "120px 24px 80px" : "120px 48px 80px",
                boxSizing: "border-box",
            }}
        >
            <PixelCanvas />
            <ScanLine />
            {!isMobile && <CropMarks />}
            <BitStream isMobile={isMobile} font={monoFont} />

            <div style={{
                position: "relative", zIndex: 3, maxWidth: 720,
                display: "flex", flexDirection: "column",
                alignItems: isMobile ? "flex-start" : "center",
                textAlign: isMobile ? "left" : "center", gap: 24,
            }}>
                {/* Badge */}
                <div style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "6px 16px", borderRadius: 12,
                    backgroundColor: badgeBgColor,
                    fontFamily: headingFont, fontSize: 10, fontWeight: 600,
                    color: badgeTextColor, letterSpacing: "1px", textTransform: "uppercase" as const,
                }}>
                    <span style={{
                        width: 6, height: 6, borderRadius: "50%",
                        backgroundColor: COLORS.accentBlue,
                        animation: "pulse 2s ease-in-out infinite",
                    }} />
                    {badge}
                </div>

                {/* Headline */}
                <h1 style={{
                    fontFamily: headingFont,
                    fontSize: isMobile
                        ? `clamp(56px, 14vw, ${heroHeadlineSize * 0.62}px)`
                        : `clamp(72px, 9vw, ${heroHeadlineSize}px)`,
                    fontWeight: 900, color: headlineColor,
                    lineHeight: 0.9, letterSpacing: isMobile ? "-2px" : "-4px", margin: 0,
                }}>
                    {headlineLines.map((line, i) => {
                        const isLast = i === headlineLines.length - 1
                        if (isLast && line.endsWith(".")) {
                            return (
                                <span key={i}>
                                    {i > 0 && <br />}
                                    {line.slice(0, -1)}
                                    <span style={{ color: COLORS.fullBlue }}>.</span>
                                </span>
                            )
                        }
                        return <span key={i}>{i > 0 && <br />}{line}</span>
                    })}
                </h1>

                {/* Subheadline */}
                <p style={{
                    fontFamily: bodyFont, fontSize: heroSubheadlineSize,
                    color: subheadlineColor,
                    lineHeight: 1.6, margin: 0, maxWidth: 480,
                }}>
                    {subheadline1}{" "}
                    <span style={{ color: subheadlineBoldColor, fontWeight: 600 }}>
                        {subheadline2}
                    </span>
                </p>

                {/* CTA */}
                <a
                    href="#open-roles"
                    onClick={(e) => {
                        e.preventDefault()
                        document.getElementById("open-roles")?.scrollIntoView({ behavior: "smooth" })
                    }}
                    style={{
                        backgroundColor: ctaBgColor, color: ctaTextColor,
                        padding: "14px 32px", borderRadius: 8,
                        fontSize: ctaButtonSize, fontWeight: 600, fontFamily: headingFont,
                        textDecoration: "none", display: "inline-flex", alignItems: "center",
                        gap: 8, cursor: "pointer", transition: "all 0.2s ease", border: "none",
                    }}
                    onMouseEnter={(e) => {
                        const el = e.currentTarget
                        el.style.backgroundColor = COLORS.fullBlue
                        el.style.transform = "translateY(-2px)"
                        el.style.boxShadow = `0 8px 24px rgba(0,153,255,0.3)`
                    }}
                    onMouseLeave={(e) => {
                        const el = e.currentTarget
                        el.style.backgroundColor = ctaBgColor
                        el.style.transform = "translateY(0)"
                        el.style.boxShadow = "none"
                    }}
                >
                    {ctaText}
                </a>

                {/* Stats Row */}
                <div style={{
                    display: "flex",
                    alignItems: isMobile ? "flex-start" : "center",
                    justifyContent: isMobile ? "flex-start" : "center",
                    gap: isMobile ? 24 : 48, marginTop: 32, paddingTop: 32,
                    borderTop: "1px solid rgba(255,255,255,0.04)",
                    width: "100%", flexWrap: "wrap" as const,
                }}>
                    {[
                        { value: stat1Value, label: stat1Label },
                        { value: stat2Value, unit: stat2Unit, label: stat2Label },
                        { value: stat3Value, label: stat3Label },
                    ].map((stat, i) => (
                        <div key={i} style={{
                            display: "flex", flexDirection: "column",
                            alignItems: isMobile ? "flex-start" : "center", gap: 2,
                        }}>
                            <span style={{
                                fontFamily: monoFont, fontSize: statNumberSize,
                                fontWeight: 700, color: statNumberColor, letterSpacing: "-1px",
                            }}>
                                {stat.unit ? (
                                    <>{stat.value}{" "}<span style={{ color: COLORS.accentBlue, fontSize: statNumberSize * 0.7 }}>{stat.unit}</span></>
                                ) : stat.value}
                            </span>
                            <span style={{
                                fontFamily: monoFont, fontSize: labelSize,
                                color: statLabelColor,
                                textTransform: "uppercase" as const, letterSpacing: "1.2px",
                            }}>
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }
            `}</style>
        </section>
    )
}

addPropertyControls(CareerHero, {
    headingFont: { type: ControlType.String, title: "Heading Font", defaultValue: DEFAULTS.headingFont },
    bodyFont: { type: ControlType.String, title: "Body Font", defaultValue: DEFAULTS.bodyFont },
    monoFont: { type: ControlType.String, title: "Mono Font", defaultValue: DEFAULTS.monoFont },
    heroHeadlineSize: { type: ControlType.Number, title: "Headline Size", defaultValue: 130, min: 48, max: 200, step: 1, unit: "px" },
    heroSubheadlineSize: { type: ControlType.Number, title: "Subhead Size", defaultValue: 18, min: 12, max: 32, step: 1, unit: "px" },
    statNumberSize: { type: ControlType.Number, title: "Stat Number Size", defaultValue: 28, min: 16, max: 48, step: 1, unit: "px" },
    labelSize: { type: ControlType.Number, title: "Label Size", defaultValue: 11, min: 8, max: 16, step: 1, unit: "px" },
    ctaButtonSize: { type: ControlType.Number, title: "CTA Size", defaultValue: 14, min: 10, max: 20, step: 1, unit: "px" },
    headlineColor: { type: ControlType.Color, title: "Headline Color", defaultValue: "#FFFFFF" },
    subheadlineColor: { type: ControlType.Color, title: "Subhead Color", defaultValue: "rgba(255,255,255,0.35)" },
    subheadlineBoldColor: { type: ControlType.Color, title: "Subhead Bold Color", defaultValue: "rgba(255,255,255,0.7)" },
    badgeTextColor: { type: ControlType.Color, title: "Badge Text Color", defaultValue: "#FFFFFF" },
    badgeBgColor: { type: ControlType.Color, title: "Badge BG Color", defaultValue: "#3751FF" },
    statNumberColor: { type: ControlType.Color, title: "Stat Number Color", defaultValue: "#FFFFFF" },
    statLabelColor: { type: ControlType.Color, title: "Stat Label Color", defaultValue: "rgba(255,255,255,0.25)" },
    ctaTextColor: { type: ControlType.Color, title: "CTA Text Color", defaultValue: "#FFFFFF" },
    ctaBgColor: { type: ControlType.Color, title: "CTA BG Color", defaultValue: "#0099FF" },
    badge: { type: ControlType.String, title: "Badge", defaultValue: "Now Hiring" },
    headline: { type: ControlType.String, title: "Headline", defaultValue: "EVERY\nBIT\nCOUNTS." },
    subheadline1: { type: ControlType.String, title: "Subhead (dim)", defaultValue: "We analyze every bit to find the ones that matter." },
    subheadline2: { type: ControlType.String, title: "Subhead (bold)", defaultValue: "We hire the same way." },
    ctaText: { type: ControlType.String, title: "CTA Text", defaultValue: "See Open Roles ↓" },
    stat1Value: { type: ControlType.String, title: "Stat 1 Value", defaultValue: "53" },
    stat1Label: { type: ControlType.String, title: "Stat 1 Label", defaultValue: "Patents" },
    stat2Value: { type: ControlType.String, title: "Stat 2 Value", defaultValue: "1" },
    stat2Unit: { type: ControlType.String, title: "Stat 2 Unit", defaultValue: "Emmy" },
    stat2Label: { type: ControlType.String, title: "Stat 2 Label", defaultValue: "Technology & Engineering" },
    stat3Value: { type: ControlType.String, title: "Stat 3 Value", defaultValue: "~50" },
    stat3Label: { type: ControlType.String, title: "Stat 3 Label", defaultValue: "People" },
})

export default CareerHero
