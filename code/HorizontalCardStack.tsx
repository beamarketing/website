// HorizontalCardStack - Scroll-Driven Horizontal Card Carousel
// with "Smarter Pipeline" particle stream visualization
// Framer Code Component with full property controls
//
// Architecture:
//   Background Layer – SVG circuit-trace paths with stroke-dasharray flow
//   Particle Layer   – Canvas-based requestAnimationFrame pixel stream (50-100 particles)
//   Foreground Layer – Horizontal carousel cards with glassmorphism

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
    // Section
    sectionLabel: string
    heading: string
    subheading: string
    // Cards
    cards: CardData[]
    cardWidth: number
    cardHeight: number
    // Colors
    bgColor: string
    headingColor: string
    cardBgColor: string
    cardBorderColor: string
    textColor: string
    secondaryTextColor: string
    buttonBgColor: string
    buttonTextColor: string
    // Particle system
    pixelColorPrimary: string
    pixelColorSecondary: string
    particleCount: number
    showParticles: boolean
    showPaths: boolean
    pathStrokeColor: string
    // Typography
    fontFamily: string
    // Layout
    style?: React.CSSProperties
}

// ---------------------------------------------------------------------------
// Particle type
// ---------------------------------------------------------------------------

interface Particle {
    x: number
    y: number
    pathIndex: number
    progress: number
    speed: number
    size: number
    opacity: number
    color: string
    trail: { x: number; y: number; opacity: number }[]
}

// ---------------------------------------------------------------------------
// Cubic Bézier helpers
// ---------------------------------------------------------------------------

type Point = [number, number]

function bezierPoint(t: number, p0: Point, p1: Point, p2: Point, p3: Point): Point {
    const u = 1 - t
    const uu = u * u
    const uuu = uu * u
    const tt = t * t
    const ttt = tt * t
    return [
        uuu * p0[0] + 3 * uu * t * p1[0] + 3 * u * tt * p2[0] + ttt * p3[0],
        uuu * p0[1] + 3 * uu * t * p1[1] + 3 * u * tt * p2[1] + ttt * p3[1],
    ]
}

// ---------------------------------------------------------------------------
// Path generation — creates fiber-optic-style curves from left → right
// ---------------------------------------------------------------------------

function generatePaths(w: number, h: number, count: number) {
    const paths: { d: string; points: Point[] }[] = []
    const convergeX = w * 0.62
    const convergeY = h * 0.5

    for (let i = 0; i < count; i++) {
        const startY = (h / (count + 1)) * (i + 1)
        const spread = (i - (count - 1) / 2) // -2 .. +2 for 5 paths

        const p0: Point = [-40, startY]
        const p1: Point = [w * 0.18, startY + spread * 18 + (Math.sin(i * 1.7) * 30)]
        const p2: Point = [w * 0.42, convergeY + spread * 22]
        const p3: Point = [convergeX, convergeY + spread * 12]

        const d = `M${p0[0]},${p0[1]} C${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]}`

        // Pre-sample 120 points along curve for particle pathing
        const points: Point[] = []
        for (let t = 0; t <= 1; t += 1 / 120) {
            points.push(bezierPoint(t, p0, p1, p2, p3))
        }
        paths.push({ d, points })
    }
    return paths
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function HorizontalCardStack(props: Props) {
    const {
        sectionLabel = "PRODUCTS",
        heading = "Smarter Pipeline",
        subheading = "Scroll to explore our product ecosystem. Data flows through our intelligent pipeline, powering each solution.",
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
        particleCount = 75,
        showParticles = true,
        showPaths = true,
        pathStrokeColor = "rgba(0, 102, 255, 0.12)",
        fontFamily = "'Inter', sans-serif",
        style,
    } = props

    // Refs
    const sectionRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const scrollRef = useRef<HTMLDivElement>(null)
    const particlesRef = useRef<Particle[]>([])
    const animFrameRef = useRef<number>(0)
    const scrollProgressRef = useRef(0)
    const pathsCacheRef = useRef<ReturnType<typeof generatePaths>>([])
    const dimsRef = useRef({ w: 0, h: 0 })

    // State
    const [scrollProgress, setScrollProgress] = useState(0)
    const [activeCard, setActiveCard] = useState(0)
    const [pulsingCard, setPulsingCard] = useState(-1)

    // -----------------------------------------------------------------------
    // Scroll tracking — viewport intersection drives particle velocity
    // -----------------------------------------------------------------------
    useEffect(() => {
        const el = sectionRef.current
        if (!el) return

        const onScroll = () => {
            const rect = el.getBoundingClientRect()
            const vh = window.innerHeight
            // 0 = section just entering bottom, 1 = section center aligned with viewport center
            const raw = 1 - rect.top / vh
            const clamped = Math.max(0, Math.min(1, raw))
            scrollProgressRef.current = clamped
            setScrollProgress(clamped)
        }

        window.addEventListener("scroll", onScroll, { passive: true })
        onScroll()
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    // -----------------------------------------------------------------------
    // Particle initializer
    // -----------------------------------------------------------------------
    const spawnParticles = useCallback(
        (paths: ReturnType<typeof generatePaths>) => {
            const colors = [pixelColorPrimary, pixelColorSecondary]
            const out: Particle[] = []
            for (let i = 0; i < particleCount; i++) {
                const pathIndex = i % paths.length
                const progress = Math.random()
                const ptIdx = Math.floor(progress * (paths[pathIndex].points.length - 1))
                const pt = paths[pathIndex].points[ptIdx]
                out.push({
                    x: pt[0],
                    y: pt[1],
                    pathIndex,
                    progress,
                    speed: 0.0008 + Math.random() * 0.0028,
                    size: 1.5 + Math.random() * 3,
                    opacity: 0.25 + Math.random() * 0.75,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    trail: [],
                })
            }
            return out
        },
        [pixelColorPrimary, pixelColorSecondary, particleCount]
    )

    // -----------------------------------------------------------------------
    // Canvas animation loop
    // -----------------------------------------------------------------------
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas || !showParticles) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Resize handler
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

            const paths = generatePaths(rect.width, rect.height, 5)
            pathsCacheRef.current = paths
            particlesRef.current = spawnParticles(paths)
        }
        resize()
        window.addEventListener("resize", resize)

        let lastPulse = 0

        const animate = () => {
            const { w, h } = dimsRef.current
            if (!w || !h) {
                animFrameRef.current = requestAnimationFrame(animate)
                return
            }

            ctx.clearRect(0, 0, w, h)

            const sp = scrollProgressRef.current
            const speedMul = 0.4 + sp * 3
            const opaMul = 0.2 + sp * 0.8
            const paths = pathsCacheRef.current
            const particles = particlesRef.current
            const now = performance.now()

            for (const p of particles) {
                p.progress += p.speed * speedMul
                if (p.progress >= 1) {
                    p.progress = 0
                    // Trigger pulse (throttled)
                    if (sp > 0.3 && now - lastPulse > 250) {
                        lastPulse = now
                        setPulsingCard((prev) => {
                            // cycle or use activeCard
                            return prev
                        })
                        // brief pulse on a random visible card
                        const target = Math.floor(Math.random() * Math.min(4, props.cards?.length || 4))
                        setPulsingCard(target)
                        setTimeout(() => setPulsingCard(-1), 280)
                    }
                }

                const path = paths[p.pathIndex]
                if (!path) continue
                const ptIdx = Math.min(
                    Math.floor(p.progress * (path.points.length - 1)),
                    path.points.length - 1
                )
                const pt = path.points[ptIdx]
                if (!pt) continue

                p.x = pt[0]
                p.y = pt[1]

                // Trail
                p.trail.push({ x: p.x, y: p.y, opacity: p.opacity * opaMul })
                if (p.trail.length > 8) p.trail.shift()

                // Draw trail segments
                for (let t = 0; t < p.trail.length; t++) {
                    const tr = p.trail[t]
                    const frac = t / p.trail.length
                    const trailOpa = frac * tr.opacity * 0.35
                    const trailSize = p.size * frac * 0.5
                    ctx.globalAlpha = trailOpa
                    ctx.fillStyle = p.color
                    ctx.fillRect(tr.x - trailSize / 2, tr.y - trailSize / 2, trailSize, trailSize)
                }

                // Draw main pixel
                ctx.globalAlpha = p.opacity * opaMul
                ctx.fillStyle = p.color
                ctx.shadowColor = p.color
                ctx.shadowBlur = 6 + sp * 6
                ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size)
                ctx.shadowBlur = 0
            }

            ctx.globalAlpha = 1
            animFrameRef.current = requestAnimationFrame(animate)
        }

        animFrameRef.current = requestAnimationFrame(animate)

        return () => {
            cancelAnimationFrame(animFrameRef.current)
            window.removeEventListener("resize", resize)
        }
    }, [showParticles, spawnParticles])

    // -----------------------------------------------------------------------
    // Carousel scroll → active card tracking
    // -----------------------------------------------------------------------
    const handleCarouselScroll = useCallback(() => {
        if (!scrollRef.current) return
        const idx = Math.round(scrollRef.current.scrollLeft / (cardWidth + 24))
        setActiveCard(Math.max(0, Math.min((cards?.length || 1) - 1, idx)))
    }, [cardWidth, cards])

    const scrollCarousel = (dir: "left" | "right") => {
        if (!scrollRef.current) return
        scrollRef.current.scrollBy({
            left: dir === "left" ? -(cardWidth + 24) : cardWidth + 24,
            behavior: "smooth",
        })
    }

    // Static SVG paths for the background layer (use a fixed viewBox)
    const svgViewW = 1280
    const svgViewH = 600
    const staticPaths = generatePaths(svgViewW, svgViewH, 5)

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
                overflow: "hidden",
                padding: "100px 0",
                boxSizing: "border-box" as const,
                fontFamily,
            }}
        >
            {/* Scrollbar-hiding CSS */}
            <style>{`
                .hcs-track::-webkit-scrollbar{display:none}
                .hcs-track{-ms-overflow-style:none;scrollbar-width:none}
                @keyframes hcs-dash{to{stroke-dashoffset:-48}}
            `}</style>

            {/* ============================================================ */}
            {/* BACKGROUND LAYER — SVG Pipeline Paths                        */}
            {/* ============================================================ */}
            {showPaths && (
                <svg
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none",
                        zIndex: 1,
                    }}
                    viewBox={`0 0 ${svgViewW} ${svgViewH}`}
                    preserveAspectRatio="xMidYMid slice"
                >
                    <defs>
                        <linearGradient id="hcs-pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={pixelColorPrimary} stopOpacity="0" />
                            <stop offset="25%" stopColor={pixelColorPrimary} stopOpacity="0.25" />
                            <stop offset="75%" stopColor={pixelColorSecondary} stopOpacity="0.2" />
                            <stop offset="100%" stopColor={pixelColorSecondary} stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    {staticPaths.map((p, i) => (
                        <g key={i}>
                            {/* Soft glow base */}
                            <path
                                d={p.d}
                                fill="none"
                                stroke={pathStrokeColor}
                                strokeWidth={3}
                                strokeLinecap="round"
                                opacity={0.25 + scrollProgress * 0.45}
                            />
                            {/* Animated dashed flow */}
                            <path
                                d={p.d}
                                fill="none"
                                stroke="url(#hcs-pathGrad)"
                                strokeWidth={1.5}
                                strokeLinecap="round"
                                strokeDasharray="6 18"
                                opacity={0.4 + scrollProgress * 0.6}
                                style={{ animation: `hcs-dash ${2.5 + i * 0.4}s linear infinite` }}
                            />
                        </g>
                    ))}
                </svg>
            )}

            {/* ============================================================ */}
            {/* PARTICLE LAYER — Canvas                                      */}
            {/* ============================================================ */}
            {showParticles && (
                <canvas
                    ref={canvasRef}
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none",
                        zIndex: 2,
                    }}
                />
            )}

            {/* ============================================================ */}
            {/* FOREGROUND LAYER — Section header + Carousel                  */}
            {/* ============================================================ */}
            <div
                style={{
                    position: "relative",
                    zIndex: 3,
                    maxWidth: 1280,
                    margin: "0 auto",
                    padding: "0 48px",
                }}
            >
                {/* ---------- Header ---------- */}
                <div style={{ marginBottom: 48 }}>
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
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-end",
                        }}
                    >
                        <div>
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
                                        maxWidth: 520,
                                        lineHeight: 1.6,
                                        fontFamily,
                                    }}
                                >
                                    {subheading}
                                </p>
                            )}
                        </div>

                        {/* Arrow controls */}
                        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                            {(["left", "right"] as const).map((dir) => (
                                <button
                                    key={dir}
                                    onClick={() => scrollCarousel(dir)}
                                    style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 10,
                                        border: `1px solid ${cardBorderColor}`,
                                        backgroundColor: "rgba(255,255,255,0.06)",
                                        color: headingColor,
                                        fontSize: 18,
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        transition: "background-color 0.2s",
                                        fontFamily,
                                    }}
                                >
                                    {dir === "left" ? "\u2190" : "\u2192"}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ---------- Carousel Track ---------- */}
                <div
                    ref={scrollRef}
                    className="hcs-track"
                    onScroll={handleCarouselScroll}
                    style={{
                        display: "flex",
                        gap: 24,
                        overflowX: "auto",
                        paddingBottom: 16,
                    }}
                >
                    {(cards || []).map((card, i) => {
                        const isPulsing = pulsingCard === i
                        const isActive = activeCard === i

                        return (
                            <div
                                key={i}
                                style={{
                                    flex: `0 0 ${cardWidth}px`,
                                    height: cardHeight,
                                    borderRadius: 16,
                                    border: `1px solid ${cardBorderColor}`,
                                    backgroundColor: cardBgColor,
                                    boxShadow: isPulsing
                                        ? `${pixelColorPrimary}66 0px 0px 32px 6px, rgba(255,255,255,0.1) 0px 0px 0px 4px`
                                        : "rgba(255,255,255,0.1) 0px 0px 0px 4px",
                                    position: "relative",
                                    overflow: "hidden",
                                    display: "flex",
                                    flexDirection: "column" as const,
                                    transition: "box-shadow 0.3s ease",
                                    // GPU-accelerated
                                    transform: "translate3d(0,0,0)",
                                    willChange: "transform",
                                    // Glassmorphism
                                    backdropFilter: "blur(16px)",
                                    WebkitBackdropFilter: "blur(16px)",
                                }}
                            >
                                {/* --- Card Content --- */}
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
                                            transition: "opacity 0.2s",
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

                                {/* --- Card Image --- */}
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

                                {/* --- Glow Ellipse --- */}
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
                                        opacity: isActive && scrollProgress > 0.35 ? 0.55 : 0,
                                        transition: "opacity 0.6s ease",
                                        zIndex: 1,
                                        pointerEvents: "none",
                                        willChange: "transform",
                                    }}
                                />
                            </div>
                        )
                    })}
                </div>

                {/* ---------- Scroll Progress Bar ---------- */}
                <div
                    style={{
                        marginTop: 28,
                        height: 2,
                        backgroundColor: "rgba(0,0,0,0.06)",
                        borderRadius: 1,
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            height: "100%",
                            width: `${scrollProgress * 100}%`,
                            background: `linear-gradient(90deg, ${pixelColorPrimary}, ${pixelColorSecondary})`,
                            borderRadius: 1,
                            transition: "width 0.1s ease-out",
                            transform: "translate3d(0,0,0)",
                        }}
                    />
                </div>
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
        defaultValue:
            "Scroll to explore our product ecosystem. Data flows through our intelligent pipeline, powering each solution.",
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
    particleCount: {
        type: ControlType.Number,
        title: "Particle Count",
        defaultValue: 75,
        min: 20,
        max: 150,
        step: 5,
    },
    showParticles: {
        type: ControlType.Boolean,
        title: "Show Particles",
        defaultValue: true,
    },
    showPaths: {
        type: ControlType.Boolean,
        title: "Show Paths",
        defaultValue: true,
    },
    pathStrokeColor: {
        type: ControlType.Color,
        title: "Path Stroke",
        defaultValue: "rgba(0, 102, 255, 0.12)",
    },
    fontFamily: {
        type: ControlType.String,
        title: "Font Family",
        defaultValue: "'Inter', sans-serif",
    },
})

export default HorizontalCardStack
