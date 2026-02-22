// HorizontalCardStack – Scroll-driven horizontal card carousel
// with right-to-left pixel stream animation
//
// Behavior:
//   • Cards start roughly centered on screen
//   • As the user scrolls the PAGE, the card row translates LEFT (scroll-jacked translateX)
//   • A stream of glowing pixel-squares flows from the carousel area toward the left edge
//   • Pixel velocity + density ramp up with scroll progress
//   • Full-width, edge-to-edge layout
//
// Framer Code Component with full property controls

import { useRef, useEffect, useState, useCallback } from "react"
import { addPropertyControls, ControlType } from "framer"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CardData {
    title: string
    description: string
    buttonText: string
    buttonUrl: string
    image: string
    glowColor: string
}

interface Props {
    sectionLabel: string
    heading: string
    subheading: string
    cards: CardData[]
    cardWidth: number
    cardHeight: number
    scrollDistance: number
    bgColor: string
    headingColor: string
    cardBgColor: string
    cardBorderColor: string
    textColor: string
    secondaryTextColor: string
    buttonBgColor: string
    buttonTextColor: string
    pixelColorPrimary: string
    pixelColorSecondary: string
    pixelColorTertiary: string
    particleCount: number
    showParticles: boolean
    fontFamily: string
    style?: React.CSSProperties
}

// ---------------------------------------------------------------------------
// Particle
// ---------------------------------------------------------------------------

interface Pixel {
    x: number
    y: number
    vx: number
    vy: number
    size: number
    opacity: number
    maxOpacity: number
    color: string
    life: number
    maxLife: number
    lane: number
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function HorizontalCardStack(props: Props) {
    const {
        sectionLabel = "PRODUCTS",
        heading = "Smarter Pipeline",
        subheading = "",
        cards = [
            {
                title: "VSNArena (AI-Powered DAM)",
                description:
                    "Revolutionize your digital asset management with the next generation. VSN ArenaPro leverages cutting-edge AI to automate workflows, enrich metadata, enable semantic search, and unlock new monetization opportunities for media, sports, and education sectors.",
                buttonText: "Learn more",
                buttonUrl: "./products/vsn-arena",
                image: "",
                glowColor: "rgba(253, 192, 25, 0.4)",
            },
            {
                title: "VSNCrea",
                description:
                    "VSN Crea is a powerful, 100% web-based traffic and scheduling system that simplifies planning, rights management, scheduling, and reporting for linear and non-linear platforms. Maximize efficiency and ensure seamless programming delivery.",
                buttonText: "Learn more",
                buttonUrl: "./products/vsncrea",
                image: "",
                glowColor: "rgba(253, 192, 25, 0.4)",
            },
            {
                title: "VSNOneTV",
                description:
                    "VSN OneTV is a versatile Channel-in-a-Box solution combining ingest, professional playout, advanced real-time graphics (CG), IP/NDI/SDI compatibility, and automation features in a single, cost-effective application.",
                buttonText: "Learn more",
                buttonUrl: "./products/vsnone-tv",
                image: "",
                glowColor: "rgba(253, 192, 25, 0.4)",
            },
            {
                title: "VSNExplorer (MAM)",
                description:
                    "VSNExplorer MAM provides all the necessary tools to manage and orchestrate the entire media lifecycle for any broadcast and media company. From cataloging and advanced search to preview, editing, workflow automation, and archive.",
                buttonText: "Learn more",
                buttonUrl: "./products/vsnexplorer-mam",
                image: "",
                glowColor: "rgba(253, 192, 25, 0.4)",
            },
        ],
        cardWidth = 420,
        cardHeight = 520,
        scrollDistance = 1200,
        bgColor = "#ffffff",
        headingColor = "#0a0a0a",
        cardBgColor = "rgb(16, 16, 16)",
        cardBorderColor = "rgb(66, 66, 66)",
        textColor = "rgba(255, 255, 255, 0.7)",
        secondaryTextColor = "rgba(255, 255, 255, 0.7)",
        buttonBgColor = "rgb(197, 227, 61)",
        buttonTextColor = "rgb(0, 0, 0)",
        pixelColorPrimary = "#0066FF",
        pixelColorSecondary = "#00E5FF",
        pixelColorTertiary = "#4D8FFF",
        particleCount = 80,
        showParticles = true,
        fontFamily = "'Inter', sans-serif",
        style,
    } = props

    const sectionRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const pixelsRef = useRef<Pixel[]>([])
    const animRef = useRef(0)
    const scrollRef = useRef(0)
    const dimsRef = useRef({ w: 0, h: 0 })

    const [translateX, setTranslateX] = useState(0)
    const [scrollProgress, setScrollProgress] = useState(0)
    const [hoveredCard, setHoveredCard] = useState(-1)

    // Total width of all cards
    const gap = 24
    const totalCardsWidth = (cards?.length || 0) * cardWidth + ((cards?.length || 1) - 1) * gap

    // -----------------------------------------------------------------------
    // Scroll → translateX + progress
    // Movement starts ONLY after the full section is visible in the viewport.
    // -----------------------------------------------------------------------
    useEffect(() => {
        const el = sectionRef.current
        if (!el) return

        const onScroll = () => {
            const rect = el.getBoundingClientRect()
            const vh = window.innerHeight

            // The section is fully visible when rect.top <= 0
            // (its top edge has reached or passed the viewport top).
            // Only then do we start horizontal movement.
            if (rect.top > 0) {
                // Section not fully scrolled into view yet — no movement
                scrollRef.current = 0
                setScrollProgress(0)
                setTranslateX(0)
                return
            }

            // How far past the "locked" point we've scrolled
            // rect.top goes from 0 → -(sectionHeight - vh)
            const scrollableRange = rect.height - vh
            const scrolled = Math.abs(rect.top)
            const raw = scrollableRange > 0 ? scrolled / scrollableRange : 0
            const clamped = Math.max(0, Math.min(1, raw))
            scrollRef.current = clamped
            setScrollProgress(clamped)

            // Map to horizontal shift
            const vw = typeof window !== "undefined" ? window.innerWidth : 1280
            const maxShift = totalCardsWidth - vw + 200
            const shift = clamped * Math.max(scrollDistance, maxShift)
            setTranslateX(-Math.max(0, shift))
        }

        window.addEventListener("scroll", onScroll, { passive: true })
        onScroll()
        return () => window.removeEventListener("scroll", onScroll)
    }, [totalCardsWidth, scrollDistance])

    // -----------------------------------------------------------------------
    // Spawn a pixel
    // -----------------------------------------------------------------------
    const spawnPixel = useCallback(
        (w: number, h: number): Pixel => {
            const colors = [pixelColorPrimary, pixelColorSecondary, pixelColorTertiary]
            // Originate from right half of canvas (where cards are)
            const spawnX = w * (0.45 + Math.random() * 0.55)
            // Vertical position — concentrated in card band (middle 60%) with some scatter
            const bandCenter = h * 0.5
            const bandSpread = h * 0.35
            const spawnY = bandCenter + (Math.random() - 0.5) * 2 * bandSpread

            const maxLife = 120 + Math.random() * 200
            const maxOpa = 0.15 + Math.random() * 0.65

            return {
                x: spawnX,
                y: spawnY,
                vx: -(1.5 + Math.random() * 3.5), // always move LEFT
                vy: (Math.random() - 0.5) * 0.6,   // slight vertical drift
                size: 1.5 + Math.random() * 3,
                opacity: 0,
                maxOpacity: maxOpa,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 0,
                maxLife,
                lane: Math.floor(Math.random() * 8),
            }
        },
        [pixelColorPrimary, pixelColorSecondary, pixelColorTertiary]
    )

    // -----------------------------------------------------------------------
    // Canvas particle animation
    // -----------------------------------------------------------------------
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas || !showParticles) return
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
            pixelsRef.current = Array.from({ length: Math.floor(particleCount * 0.4) }, () => {
                const p = spawnPixel(w, h)
                p.life = Math.random() * p.maxLife // stagger initial positions
                p.x += p.vx * p.life // advance position to match life
                return p
            })
        }

        const animate = () => {
            const { w, h } = dimsRef.current
            if (!w || !h) {
                animRef.current = requestAnimationFrame(animate)
                return
            }

            ctx.clearRect(0, 0, w, h)

            const sp = scrollRef.current
            const intensity = Math.max(0, (sp - 0.1) / 0.9) // ramp: 0 at 10% scroll, 1 at 100%
            const speedMul = 0.3 + intensity * 2.2
            const spawnRate = Math.floor(intensity * particleCount * 0.08) + 1

            const pixels = pixelsRef.current

            // Spawn new pixels
            if (intensity > 0.02) {
                for (let s = 0; s < spawnRate; s++) {
                    if (pixels.length < particleCount * 1.5) {
                        pixels.push(spawnPixel(w, h))
                    }
                }
            }

            // Update + draw
            for (let i = pixels.length - 1; i >= 0; i--) {
                const p = pixels[i]
                p.life += 1
                p.x += p.vx * speedMul
                p.y += p.vy

                // Fade in / fade out lifecycle
                const lifeFrac = p.life / p.maxLife
                if (lifeFrac < 0.15) {
                    p.opacity = (lifeFrac / 0.15) * p.maxOpacity * intensity
                } else if (lifeFrac > 0.7) {
                    p.opacity = ((1 - lifeFrac) / 0.3) * p.maxOpacity * intensity
                } else {
                    p.opacity = p.maxOpacity * intensity
                }

                // Remove dead or off-screen pixels
                if (p.life >= p.maxLife || p.x < -20 || p.x > w + 20) {
                    pixels.splice(i, 1)
                    continue
                }

                // Draw glow
                const glowRadius = p.size * 3
                const gradient = ctx.createRadialGradient(
                    p.x, p.y, 0,
                    p.x, p.y, glowRadius
                )
                gradient.addColorStop(0, p.color)
                gradient.addColorStop(1, "transparent")
                ctx.globalAlpha = p.opacity * 0.25
                ctx.fillStyle = gradient
                ctx.fillRect(
                    p.x - glowRadius,
                    p.y - glowRadius,
                    glowRadius * 2,
                    glowRadius * 2
                )

                // Draw pixel square
                ctx.globalAlpha = p.opacity
                ctx.fillStyle = p.color
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
    }, [showParticles, spawnPixel, particleCount])

    // -----------------------------------------------------------------------
    // Render
    // -----------------------------------------------------------------------
    return (
        <section
            ref={sectionRef}
            style={{
                ...style,
                width: "100%",
                backgroundColor: bgColor,
                position: "relative",
                // Use clip instead of hidden so sticky positioning still works
                overflowX: "clip" as any,
                overflowY: "visible",
                // Extra height creates the scroll runway for the horizontal movement.
                // The sticky inner keeps content pinned while the outer section scrolls.
                padding: "0",
                boxSizing: "border-box" as const,
                fontFamily,
                // Section height = viewport + scrollDistance so there's room to scroll
                // after the section is fully visible
                height: `calc(100vh + ${scrollDistance}px)`,
            }}
        >
            {/* Hide scrollbar */}
            <style>{`
                .hcs-track::-webkit-scrollbar{display:none}
                .hcs-track{-ms-overflow-style:none;scrollbar-width:none}
            `}</style>

            {/* ============================================================= */}
            {/* STICKY CONTAINER — pins content while outer section scrolls    */}
            {/* ============================================================= */}
            <div
                style={{
                    position: "sticky",
                    top: 0,
                    height: "100vh",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column" as const,
                    justifyContent: "center",
                }}
            >

            {/* PARTICLE LAYER */}
            {showParticles && (
                <canvas
                    ref={canvasRef}
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none",
                        zIndex: 1,
                    }}
                />
            )}

            {/* HEADER */}
            <div
                style={{
                    position: "relative",
                    zIndex: 3,
                    maxWidth: 1280,
                    margin: "0 auto",
                    padding: "0 48px",
                    marginBottom: 56,
                    width: "100%",
                    boxSizing: "border-box" as const,
                }}
            >
                {sectionLabel && (
                    <span
                        style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: pixelColorPrimary,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase" as const,
                            display: "block",
                            marginBottom: 16,
                            fontFamily,
                        }}
                    >
                        {sectionLabel}
                    </span>
                )}
                <h2
                    style={{
                        fontSize: 44,
                        fontWeight: 700,
                        color: headingColor,
                        margin: 0,
                        lineHeight: 1.15,
                        letterSpacing: "-0.02em",
                        fontFamily,
                    }}
                >
                    {heading}
                </h2>
                {subheading && (
                    <p
                        style={{
                            fontSize: 16,
                            color: secondaryTextColor,
                            margin: "12px 0 0",
                            maxWidth: 480,
                            lineHeight: 1.6,
                            fontFamily,
                        }}
                    >
                        {subheading}
                    </p>
                )}
            </div>

            {/* CAROUSEL — full-width, scroll-driven translateX */}
            <div
                style={{
                    position: "relative",
                    zIndex: 2,
                    width: "100%",
                    overflow: "visible",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        gap,
                        paddingLeft: "calc(50vw - " + cardWidth / 2 + "px)",
                        paddingRight: 80,
                        transform: `translate3d(${translateX}px, 0, 0)`,
                        willChange: "transform",
                        transition: "transform 0.08s linear",
                    }}
                >
                    {(cards || []).map((card, i) => {
                        const isHovered = hoveredCard === i
                        return (
                        <div
                            key={i}
                            onMouseEnter={() => setHoveredCard(i)}
                            onMouseLeave={() => setHoveredCard(-1)}
                            style={{
                                flex: `0 0 ${cardWidth}px`,
                                height: cardHeight,
                                borderRadius: 16,
                                border: `1px solid ${isHovered ? "rgba(255,255,255,0.25)" : cardBorderColor}`,
                                backgroundColor: cardBgColor,
                                boxShadow: isHovered
                                    ? `rgba(255,255,255,0.15) 0px 0px 0px 4px, ${card.glowColor || "rgba(253,192,25,0.15)"} 0px 8px 40px 0px`
                                    : "rgba(255, 255, 255, 0.1) 0px 0px 0px 4px",
                                position: "relative",
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column" as const,
                                transform: isHovered
                                    ? "translate3d(0,-6px,0) scale(1.02)"
                                    : "translate3d(0,0,0)",
                                willChange: "transform",
                                backdropFilter: "blur(16px)",
                                WebkitBackdropFilter: "blur(16px)",
                                transition: "transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.3s ease, border-color 0.3s ease",
                                cursor: "pointer",
                            }}
                        >
                            {/* Content */}
                            <div
                                style={{
                                    padding: 28,
                                    display: "flex",
                                    flexDirection: "column" as const,
                                    gap: 14,
                                    flex: "0 0 auto",
                                    zIndex: 2,
                                }}
                            >
                                <h3
                                    style={{
                                        fontSize: 17,
                                        fontWeight: 600,
                                        color: textColor,
                                        margin: 0,
                                        lineHeight: 1.35,
                                        fontFamily,
                                    }}
                                >
                                    {card.title}
                                </h3>
                                <p
                                    style={{
                                        fontSize: 14,
                                        color: secondaryTextColor,
                                        margin: 0,
                                        lineHeight: 1.6,
                                        fontFamily,
                                    }}
                                >
                                    {card.description}
                                </p>
                                <a
                                    href={card.buttonUrl}
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 8,
                                        padding: "12px 20px",
                                        backgroundColor: buttonBgColor,
                                        color: buttonTextColor,
                                        borderRadius: 12,
                                        fontSize: 14,
                                        fontWeight: 600,
                                        textDecoration: "none",
                                        fontFamily,
                                        width: "fit-content",
                                        border: "none",
                                        cursor: "pointer",
                                    }}
                                >
                                    {card.buttonText}
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </a>
                            </div>

                            {/* Image */}
                            <div
                                style={{
                                    flex: 1,
                                    margin: "0 6px 6px",
                                    borderRadius: 9,
                                    overflow: "hidden",
                                    position: "relative",
                                    zIndex: 2,
                                }}
                            >
                                {card.image ? (
                                    <img
                                        src={card.image}
                                        alt={card.title}
                                        loading="lazy"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            display: "block",
                                            borderRadius: "inherit",
                                        }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            background:
                                                "linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: 13,
                                                color: "rgba(255,255,255,0.15)",
                                                fontFamily,
                                                fontWeight: 500,
                                            }}
                                        >
                                            Product Visual
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Glow */}
                            <div
                                style={{
                                    position: "absolute",
                                    bottom: -80,
                                    left: "50%",
                                    transform: "translate3d(-50%, 0, 0)",
                                    width: 280,
                                    height: 280,
                                    borderRadius: "50%",
                                    backgroundColor:
                                        card.glowColor || "rgba(253, 192, 25, 0.4)",
                                    filter: "blur(120px)",
                                    opacity: isHovered ? 0.7 : scrollProgress > 0.25 ? 0.5 : 0,
                                    transition: "opacity 0.4s ease",
                                    zIndex: 1,
                                    pointerEvents: "none",
                                    willChange: "transform",
                                }}
                            />
                        </div>
                        )
                    })}
                </div>
            </div>

            {/* Close sticky container */}
            </div>
        </section>
    )
}

// ---------------------------------------------------------------------------
// Framer Property Controls
// ---------------------------------------------------------------------------

addPropertyControls(HorizontalCardStack, {
    sectionLabel: {
        type: ControlType.String,
        title: "Section Label",
        defaultValue: "PRODUCTS",
    },
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "Smarter Pipeline",
    },
    subheading: {
        type: ControlType.String,
        title: "Subheading",
        defaultValue: "",
    },
    cardWidth: {
        type: ControlType.Number,
        title: "Card Width",
        defaultValue: 420,
        min: 280,
        max: 600,
        step: 10,
    },
    cardHeight: {
        type: ControlType.Number,
        title: "Card Height",
        defaultValue: 520,
        min: 380,
        max: 750,
        step: 10,
    },
    scrollDistance: {
        type: ControlType.Number,
        title: "Scroll Distance",
        defaultValue: 1200,
        min: 400,
        max: 3000,
        step: 50,
        description: "How many px of page scroll maps to the full carousel shift",
    },
    cards: {
        type: ControlType.Array,
        title: "Cards",
        maxCount: 8,
        control: {
            type: ControlType.Object,
            controls: {
                title: {
                    type: ControlType.String,
                    title: "Title",
                    defaultValue: "Product Name",
                },
                description: {
                    type: ControlType.String,
                    title: "Description",
                    defaultValue: "Product description goes here.",
                },
                buttonText: {
                    type: ControlType.String,
                    title: "Button Text",
                    defaultValue: "Learn more",
                },
                buttonUrl: {
                    type: ControlType.String,
                    title: "Button URL",
                    defaultValue: "#",
                },
                image: {
                    type: ControlType.Image,
                    title: "Image",
                },
                glowColor: {
                    type: ControlType.Color,
                    title: "Glow Color",
                    defaultValue: "rgba(253, 192, 25, 0.4)",
                },
            },
        },
        defaultValue: [
            {
                title: "VSNArena (AI-Powered DAM)",
                description:
                    "Revolutionize your digital asset management with the next generation. VSN ArenaPro leverages cutting-edge AI to automate workflows, enrich metadata, enable semantic search, and unlock new monetization opportunities for media, sports, and education sectors.",
                buttonText: "Learn more",
                buttonUrl: "./products/vsn-arena",
                image: "",
                glowColor: "rgba(253, 192, 25, 0.4)",
            },
            {
                title: "VSNCrea",
                description:
                    "VSN Crea is a powerful, 100% web-based traffic and scheduling system that simplifies planning, rights management, scheduling, and reporting for linear and non-linear platforms. Maximize efficiency and ensure seamless programming delivery.",
                buttonText: "Learn more",
                buttonUrl: "./products/vsncrea",
                image: "",
                glowColor: "rgba(253, 192, 25, 0.4)",
            },
            {
                title: "VSNOneTV",
                description:
                    "VSN OneTV is a versatile Channel-in-a-Box solution combining ingest, professional playout, advanced real-time graphics (CG), IP/NDI/SDI compatibility, and automation features in a single, cost-effective application.",
                buttonText: "Learn more",
                buttonUrl: "./products/vsnone-tv",
                image: "",
                glowColor: "rgba(253, 192, 25, 0.4)",
            },
            {
                title: "VSNExplorer (MAM)",
                description:
                    "VSNExplorer MAM provides all the necessary tools to manage and orchestrate the entire media lifecycle for any broadcast and media company. From cataloging and advanced search to preview, editing, workflow automation, and archive.",
                buttonText: "Learn more",
                buttonUrl: "./products/vsnexplorer-mam",
                image: "",
                glowColor: "rgba(253, 192, 25, 0.4)",
            },
        ],
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#ffffff",
    },
    headingColor: {
        type: ControlType.Color,
        title: "Heading Color",
        defaultValue: "#0a0a0a",
    },
    cardBgColor: {
        type: ControlType.Color,
        title: "Card Background",
        defaultValue: "rgb(16, 16, 16)",
    },
    cardBorderColor: {
        type: ControlType.Color,
        title: "Card Border",
        defaultValue: "rgb(66, 66, 66)",
    },
    textColor: {
        type: ControlType.Color,
        title: "Card Text",
        defaultValue: "rgba(255, 255, 255, 0.7)",
    },
    secondaryTextColor: {
        type: ControlType.Color,
        title: "Secondary Text",
        defaultValue: "rgba(255, 255, 255, 0.7)",
    },
    buttonBgColor: {
        type: ControlType.Color,
        title: "Button Background",
        defaultValue: "rgb(197, 227, 61)",
    },
    buttonTextColor: {
        type: ControlType.Color,
        title: "Button Text",
        defaultValue: "rgb(0, 0, 0)",
    },
    pixelColorPrimary: {
        type: ControlType.Color,
        title: "Pixel Primary",
        defaultValue: "#0066FF",
    },
    pixelColorSecondary: {
        type: ControlType.Color,
        title: "Pixel Secondary",
        defaultValue: "#00E5FF",
    },
    pixelColorTertiary: {
        type: ControlType.Color,
        title: "Pixel Tertiary",
        defaultValue: "#4D8FFF",
    },
    particleCount: {
        type: ControlType.Number,
        title: "Particle Count",
        defaultValue: 80,
        min: 20,
        max: 150,
        step: 5,
    },
    showParticles: {
        type: ControlType.Boolean,
        title: "Show Particles",
        defaultValue: true,
    },
    fontFamily: {
        type: ControlType.String,
        title: "Font Family",
        defaultValue: "'Inter', sans-serif",
    },
})

export default HorizontalCardStack
