// CtaBanner – Scroll-driven CTA with pixel particle animation
//
// Behavior:
//   • Starts with a "before" color scheme (dark bg, cool-toned pixels)
//   • As user scrolls and the section becomes fully visible, background
//     transitions to an "after" color (e.g. lime-green) and pixels shift
//     to a new palette with increased energy
//   • Pill button with stripe-reveal hover animation
//
// Framer Code Component with full property controls

import { useState, useRef, useEffect, useCallback } from "react"
import { addPropertyControls, ControlType } from "framer"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Props {
    heading: string
    subheading: string
    buttonText: string
    buttonUrl: string
    bgColorBefore: string
    bgColorAfter: string
    textColorBefore: string
    textColorAfter: string
    buttonBgColor: string
    buttonTextColor: string
    buttonHoverBgColor: string
    pixelColor1Before: string
    pixelColor2Before: string
    pixelColor3Before: string
    pixelColor1After: string
    pixelColor2After: string
    pixelColor3After: string
    particleCount: number
    borderRadius: number
    fontFamily: string
    style?: React.CSSProperties
}

interface Pixel {
    x: number
    y: number
    vx: number
    vy: number
    size: number
    opacity: number
    maxOpacity: number
    colorIndex: number // 0, 1, or 2 — picks from the trio
    life: number
    maxLife: number
}

// ---------------------------------------------------------------------------
// Color utility — parse any CSS color to [r,g,b,a] & lerp
// ---------------------------------------------------------------------------

function parseColor(c: string): [number, number, number, number] {
    // Handle rgb()/rgba()
    const rgbaMatch = c.match(
        /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/
    )
    if (rgbaMatch) {
        return [
            +rgbaMatch[1],
            +rgbaMatch[2],
            +rgbaMatch[3],
            rgbaMatch[4] !== undefined ? +rgbaMatch[4] : 1,
        ]
    }
    // Handle hex
    let hex = c.replace("#", "")
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
    if (hex.length === 8) {
        return [
            parseInt(hex.slice(0, 2), 16),
            parseInt(hex.slice(2, 4), 16),
            parseInt(hex.slice(4, 6), 16),
            parseInt(hex.slice(6, 8), 16) / 255,
        ]
    }
    return [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16),
        1,
    ]
}

function lerpColor(
    a: string,
    b: string,
    t: number
): string {
    const [r1, g1, b1, a1] = parseColor(a)
    const [r2, g2, b2, a2] = parseColor(b)
    const r = Math.round(r1 + (r2 - r1) * t)
    const g = Math.round(g1 + (g2 - g1) * t)
    const bv = Math.round(b1 + (b2 - b1) * t)
    const av = a1 + (a2 - a1) * t
    return `rgba(${r},${g},${bv},${av})`
}

// ---------------------------------------------------------------------------
// Animated button with stripe-reveal hover
// ---------------------------------------------------------------------------

function StripeButton({
    text,
    href,
    bgColor,
    textColor,
    hoverBgColor,
    fontFamily,
}: {
    text: string
    href: string
    bgColor: string
    textColor: string
    hoverBgColor: string
    fontFamily: string
}) {
    const [hovered, setHovered] = useState(false)
    const STRIPE_COUNT = 4

    return (
        <a
            href={href}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: "inline-block",
                textDecoration: "none",
                borderRadius: 9999,
                position: "relative",
                overflow: "hidden",
                backgroundColor: bgColor,
                cursor: "pointer",
            }}
        >
            {/* Stripe overlay */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    borderRadius: "inherit",
                    pointerEvents: "none",
                }}
            >
                {Array.from({ length: STRIPE_COUNT }, (_, i) => {
                    const fromLeft = i % 2 === 0
                    return (
                        <div
                            key={i}
                            style={{
                                flex: 1,
                                backgroundColor: hoverBgColor,
                                transform: hovered
                                    ? "translateX(0)"
                                    : `translateX(${fromLeft ? "-101%" : "101%"})`,
                                transition: `transform 0.45s cubic-bezier(0.76, 0, 0.24, 1) ${i * 0.03}s`,
                                willChange: "transform",
                            }}
                        />
                    )
                })}
            </div>

            {/* Text */}
            <span
                style={{
                    position: "relative",
                    zIndex: 10,
                    display: "block",
                    padding: "15px 36px",
                    fontSize: 17,
                    fontWeight: 600,
                    color: textColor,
                    fontFamily,
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    lineHeight: 1.35,
                }}
            >
                {text}
            </span>
        </a>
    )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

function CtaBanner(props: Props) {
    const {
        heading = "Discover the \nfuture of play",
        subheading = "Ready to start? \nGet in touch to see how we can help.",
        buttonText = "Start Now",
        buttonUrl = "/contact-sales/",
        bgColorBefore = "#0a1628",
        bgColorAfter = "rgb(225, 255, 103)",
        textColorBefore = "#ffffff",
        textColorAfter = "#0a1628",
        buttonBgColor = "#0a1628",
        buttonTextColor = "#ffffff",
        buttonHoverBgColor = "#2563eb",
        pixelColor1Before = "#0066FF",
        pixelColor2Before = "#00E5FF",
        pixelColor3Before = "#4D8FFF",
        pixelColor1After = "#0a1628",
        pixelColor2After = "#1a3a1a",
        pixelColor3After = "#2d5a0e",
        particleCount = 90,
        borderRadius = 12,
        fontFamily = "'Inter', sans-serif",
        style,
    } = props

    const sectionRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const pixelsRef = useRef<Pixel[]>([])
    const animRef = useRef(0)
    const scrollRef = useRef(0)
    const dimsRef = useRef({ w: 0, h: 0 })

    const [scrollProgress, setScrollProgress] = useState(0)
    const [isMobile, setIsMobile] = useState(false)

    // -----------------------------------------------------------------------
    // Responsive check
    // -----------------------------------------------------------------------
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768)
        check()
        window.addEventListener("resize", check)
        return () => window.removeEventListener("resize", check)
    }, [])

    // -----------------------------------------------------------------------
    // Scroll → progress (0 = section entering, 1 = fully visible)
    // -----------------------------------------------------------------------
    useEffect(() => {
        const el = sectionRef.current
        if (!el) return

        const onScroll = () => {
            const rect = el.getBoundingClientRect()
            const vh = window.innerHeight
            // 0 when section bottom just enters viewport, 1 when section top
            // reaches the viewport top (fully visible)
            const raw = (vh - rect.top) / (vh + rect.height)
            // Remap so we reach 1.0 earlier — when the card is mostly visible
            const boosted = Math.pow(Math.max(0, Math.min(1, raw * 1.8)), 0.7)
            const clamped = Math.max(0, Math.min(1, boosted))
            scrollRef.current = clamped
            setScrollProgress(clamped)
        }

        window.addEventListener("scroll", onScroll, { passive: true })
        onScroll()
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    // -----------------------------------------------------------------------
    // Spawn a pixel
    // -----------------------------------------------------------------------
    const spawnPixel = useCallback(
        (w: number, h: number): Pixel => {
            const spawnX = Math.random() * w
            const spawnY = Math.random() * h
            const angle = Math.random() * Math.PI * 2
            const speed = 0.3 + Math.random() * 1.2

            return {
                x: spawnX,
                y: spawnY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 1.5 + Math.random() * 3.5,
                opacity: 0,
                maxOpacity: 0.2 + Math.random() * 0.6,
                colorIndex: Math.floor(Math.random() * 3),
                life: 0,
                maxLife: 150 + Math.random() * 250,
            }
        },
        []
    )

    // -----------------------------------------------------------------------
    // Canvas particle animation
    // -----------------------------------------------------------------------
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const resize = () => {
            const parent = canvas.parentElement
            if (!parent) return
            const rect = parent.getBoundingClientRect()
            const dpr = window.devicePixelRatio || 1
            canvas.width = rect.width * dpr
            canvas.height = rect.height * dpr
            canvas.style.width = `${rect.width}px`
            canvas.style.height = `${rect.height}px`
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            dimsRef.current = { w: rect.width, h: rect.height }
        }
        resize()
        window.addEventListener("resize", resize)

        // Seed initial pixels
        const { w, h } = dimsRef.current
        if (w && h) {
            pixelsRef.current = Array.from(
                { length: Math.floor(particleCount * 0.5) },
                () => {
                    const p = spawnPixel(w, h)
                    p.life = Math.random() * p.maxLife
                    p.x += p.vx * p.life
                    p.y += p.vy * p.life
                    return p
                }
            )
        }

        // Color arrays for lerping in the loop
        const colorsBefore = [pixelColor1Before, pixelColor2Before, pixelColor3Before]
        const colorsAfter = [pixelColor1After, pixelColor2After, pixelColor3After]

        const animate = () => {
            const { w, h } = dimsRef.current
            if (!w || !h) {
                animRef.current = requestAnimationFrame(animate)
                return
            }

            ctx.clearRect(0, 0, w, h)

            const sp = scrollRef.current
            // Pixel energy ramps up with scroll
            const speedMul = 0.6 + sp * 1.5
            const spawnRate = Math.max(1, Math.floor(sp * particleCount * 0.06) + 1)
            const pixels = pixelsRef.current

            // Spawn
            for (let s = 0; s < spawnRate; s++) {
                if (pixels.length < particleCount * 1.4) {
                    pixels.push(spawnPixel(w, h))
                }
            }

            // Update + draw
            for (let i = pixels.length - 1; i >= 0; i--) {
                const p = pixels[i]
                p.life += 1
                p.x += p.vx * speedMul
                p.y += p.vy * speedMul

                // Lifecycle opacity
                const lifeFrac = p.life / p.maxLife
                if (lifeFrac < 0.15) {
                    p.opacity = (lifeFrac / 0.15) * p.maxOpacity
                } else if (lifeFrac > 0.7) {
                    p.opacity = ((1 - lifeFrac) / 0.3) * p.maxOpacity
                } else {
                    p.opacity = p.maxOpacity
                }

                // Remove dead / off-screen
                if (
                    p.life >= p.maxLife ||
                    p.x < -20 || p.x > w + 20 ||
                    p.y < -20 || p.y > h + 20
                ) {
                    pixels.splice(i, 1)
                    continue
                }

                // Lerp color based on scroll progress
                const color = lerpColor(
                    colorsBefore[p.colorIndex],
                    colorsAfter[p.colorIndex],
                    sp
                )

                // Glow
                const glowR = p.size * 3
                const gradient = ctx.createRadialGradient(
                    p.x, p.y, 0,
                    p.x, p.y, glowR
                )
                gradient.addColorStop(0, color)
                gradient.addColorStop(1, "transparent")
                ctx.globalAlpha = p.opacity * 0.3
                ctx.fillStyle = gradient
                ctx.fillRect(
                    p.x - glowR, p.y - glowR,
                    glowR * 2, glowR * 2
                )

                // Pixel square
                ctx.globalAlpha = p.opacity
                ctx.fillStyle = color
                ctx.fillRect(
                    p.x - p.size / 2,
                    p.y - p.size / 2,
                    p.size,
                    p.size
                )
            }

            ctx.globalAlpha = 1
            animRef.current = requestAnimationFrame(animate)
        }

        animRef.current = requestAnimationFrame(animate)

        return () => {
            cancelAnimationFrame(animRef.current)
            window.removeEventListener("resize", resize)
        }
    }, [
        spawnPixel,
        particleCount,
        pixelColor1Before, pixelColor2Before, pixelColor3Before,
        pixelColor1After, pixelColor2After, pixelColor3After,
    ])

    // -----------------------------------------------------------------------
    // Interpolated colors for this frame
    // -----------------------------------------------------------------------
    const currentBg = lerpColor(bgColorBefore, bgColorAfter, scrollProgress)
    const currentText = lerpColor(textColorBefore, textColorAfter, scrollProgress)

    // -----------------------------------------------------------------------
    // Render
    // -----------------------------------------------------------------------
    return (
        <section
            ref={sectionRef}
            style={{
                ...style,
                width: "100%",
                boxSizing: "border-box",
                fontFamily,
            }}
        >
            {/* Outer wrapper */}
            <div
                style={{
                    maxWidth: 1376,
                    margin: "0 auto",
                    padding: isMobile ? "24px 0 72px" : "24px 16px 96px",
                    boxSizing: "border-box",
                }}
            >
                {/* Card */}
                <div
                    style={{
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        borderRadius: isMobile ? 0 : borderRadius,
                        backgroundColor: currentBg,
                        padding: isMobile ? "72px 24px 48px" : "76px 80px",
                        boxSizing: "border-box",
                        transition: "background-color 0.05s linear",
                    }}
                >
                    {/* ===================================================== */}
                    {/* PIXEL CANVAS — behind content                          */}
                    {/* ===================================================== */}
                    <canvas
                        ref={canvasRef}
                        style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            pointerEvents: "none",
                            zIndex: 0,
                        }}
                    />

                    {/* ===================================================== */}
                    {/* Heading                                                */}
                    {/* ===================================================== */}
                    <h2
                        style={{
                            position: "relative",
                            zIndex: 1,
                            fontSize: isMobile ? 40 : 72,
                            fontWeight: 700,
                            color: currentText,
                            margin: 0,
                            lineHeight: 1.08,
                            letterSpacing: "-0.02em",
                            fontFamily,
                            textAlign: isMobile ? "center" : "left",
                            maxWidth: isMobile ? "100%" : "50%",
                            whiteSpace: "pre-line",
                            boxSizing: "border-box",
                            transition: "color 0.05s linear",
                        }}
                    >
                        {heading}
                    </h2>

                    {/* ===================================================== */}
                    {/* Subheading                                             */}
                    {/* ===================================================== */}
                    {subheading && (
                        <p
                            style={{
                                position: "relative",
                                zIndex: 1,
                                fontSize: 20,
                                color: currentText,
                                margin: 0,
                                marginTop: 20,
                                lineHeight: 1.5,
                                fontFamily,
                                textAlign: isMobile ? "center" : "left",
                                whiteSpace: "pre-line",
                                transition: "color 0.05s linear",
                            }}
                        >
                            {subheading}
                        </p>
                    )}

                    {/* ===================================================== */}
                    {/* Button                                                 */}
                    {/* ===================================================== */}
                    <div
                        style={{
                            position: "relative",
                            zIndex: 1,
                            marginTop: isMobile ? 32 : 56,
                            display: "flex",
                            justifyContent: isMobile ? "center" : "flex-start",
                        }}
                    >
                        <StripeButton
                            text={buttonText}
                            href={buttonUrl}
                            bgColor={buttonBgColor}
                            textColor={buttonTextColor}
                            hoverBgColor={buttonHoverBgColor}
                            fontFamily={fontFamily}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

// ---------------------------------------------------------------------------
// Framer Property Controls
// ---------------------------------------------------------------------------

addPropertyControls(CtaBanner, {
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "Discover the \nfuture of play",
        displayTextArea: true,
    },
    subheading: {
        type: ControlType.String,
        title: "Subheading",
        defaultValue: "Ready to start? \nGet in touch to see how we can help.",
        displayTextArea: true,
    },
    buttonText: {
        type: ControlType.String,
        title: "Button Text",
        defaultValue: "Start Now",
    },
    buttonUrl: {
        type: ControlType.String,
        title: "Button URL",
        defaultValue: "/contact-sales/",
    },
    bgColorBefore: {
        type: ControlType.Color,
        title: "BG Before",
        defaultValue: "#0a1628",
    },
    bgColorAfter: {
        type: ControlType.Color,
        title: "BG After",
        defaultValue: "rgb(225, 255, 103)",
    },
    textColorBefore: {
        type: ControlType.Color,
        title: "Text Before",
        defaultValue: "#ffffff",
    },
    textColorAfter: {
        type: ControlType.Color,
        title: "Text After",
        defaultValue: "#0a1628",
    },
    buttonBgColor: {
        type: ControlType.Color,
        title: "Button BG",
        defaultValue: "#0a1628",
    },
    buttonTextColor: {
        type: ControlType.Color,
        title: "Button Text",
        defaultValue: "#ffffff",
    },
    buttonHoverBgColor: {
        type: ControlType.Color,
        title: "Button Hover",
        defaultValue: "#2563eb",
    },
    pixelColor1Before: {
        type: ControlType.Color,
        title: "Pixel 1 Before",
        defaultValue: "#0066FF",
    },
    pixelColor2Before: {
        type: ControlType.Color,
        title: "Pixel 2 Before",
        defaultValue: "#00E5FF",
    },
    pixelColor3Before: {
        type: ControlType.Color,
        title: "Pixel 3 Before",
        defaultValue: "#4D8FFF",
    },
    pixelColor1After: {
        type: ControlType.Color,
        title: "Pixel 1 After",
        defaultValue: "#0a1628",
    },
    pixelColor2After: {
        type: ControlType.Color,
        title: "Pixel 2 After",
        defaultValue: "#1a3a1a",
    },
    pixelColor3After: {
        type: ControlType.Color,
        title: "Pixel 3 After",
        defaultValue: "#2d5a0e",
    },
    particleCount: {
        type: ControlType.Number,
        title: "Particle Count",
        defaultValue: 90,
        min: 20,
        max: 200,
        step: 5,
    },
    borderRadius: {
        type: ControlType.Number,
        title: "Border Radius",
        defaultValue: 12,
        min: 0,
        max: 32,
        step: 2,
    },
    fontFamily: {
        type: ControlType.String,
        title: "Font Family",
        defaultValue: "'Inter', sans-serif",
    },
})

export default CtaBanner
