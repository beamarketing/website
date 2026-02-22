// CtaBanner – Scroll-driven CTA with chess-grid pixel animation
//
// Behavior:
//   • A checkerboard grid of pixels sits on the right ~20% of the card,
//     each cell at a random opacity of a single "before" color
//   • When the section is scrolled into full visibility, the chess pixels
//     scatter leftward across the section (staggered by column)
//   • Background transitions from "before" to "after" color
//   • A new chess grid in the "after" color materializes on the right
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
    chessColorBefore: string
    chessColorAfter: string
    cellSize: number
    chessWidthPercent: number
    borderRadius: number
    fontFamily: string
    style?: React.CSSProperties
}

interface ChessCell {
    col: number
    row: number
    homeX: number
    homeY: number
    baseOpacity: number
    size: number
    // Pre-computed scatter trajectory
    scatterDist: number
    scatterVy: number
    // 0-1 normalized delay — left columns scatter first
    scatterDelay: number
}

interface TransitionCell {
    x: number
    y: number
    size: number
    // 0 = appears first (right edge), 1 = appears last (left edge)
    waveDelay: number
}

// ---------------------------------------------------------------------------
// Color utility
// ---------------------------------------------------------------------------

function parseColor(c: string): [number, number, number, number] {
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
    let hex = c.replace("#", "")
    if (hex.length === 3)
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
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

function lerpColor(a: string, b: string, t: number): string {
    const [r1, g1, b1, a1] = parseColor(a)
    const [r2, g2, b2, a2] = parseColor(b)
    const r = Math.round(r1 + (r2 - r1) * t)
    const g = Math.round(g1 + (g2 - g1) * t)
    const bv = Math.round(b1 + (b2 - b1) * t)
    const av = a1 + (a2 - a1) * t
    return `rgba(${r},${g},${bv},${av})`
}

function colorWithAlpha(c: string, alpha: number): string {
    const [r, g, b] = parseColor(c)
    return `rgba(${r},${g},${b},${alpha})`
}

// Ease-out cubic
function easeOut(t: number): number {
    return 1 - Math.pow(1 - t, 3)
}

// ---------------------------------------------------------------------------
// Build a chess grid for the right portion of the canvas.
// Density is structured: rightmost columns are full, then rows start
// losing pixels as we move left — with per-row character variation so
// some rows stay full, some have just a handful of pixels, etc.
// ---------------------------------------------------------------------------

function buildChessGrid(
    w: number,
    h: number,
    cellSize: number,
    chessWidthFrac: number
): ChessCell[] {
    const gap = Math.max(2, Math.round(cellSize * 0.25))
    const stride = cellSize + gap
    const gridStartX = w * (1 - chessWidthFrac)
    const cols = Math.ceil((w * chessWidthFrac) / stride)
    const rows = Math.ceil(h / stride)
    const cells: ChessCell[] = []

    const sizeVariance = cellSize * 0.35

    // ---- Assign each row a "character" for density variation ----
    // Types: "full" = almost every cell, "normal" = density-gradient,
    //        "sparse" = few pixels, "accent" = just 2-5 random pixels
    type RowType = "full" | "normal" | "sparse" | "accent"
    const rowTypes: RowType[] = []
    for (let row = 0; row < rows; row++) {
        const r = Math.random()
        if (r < 0.15) rowTypes.push("full")
        else if (r < 0.30) rowTypes.push("sparse")
        else if (r < 0.42) rowTypes.push("accent")
        else rowTypes.push("normal")
    }

    for (let col = 0; col < cols; col++) {
        // Column density: 1.0 at rightmost → 0.0 at leftmost
        const colNorm = cols > 1 ? col / (cols - 1) : 0
        const colDensity = Math.pow(colNorm, 0.6) // denser on right

        for (let row = 0; row < rows; row++) {
            // Checkerboard: only consider cells where (col + row) is even
            if ((col + row) % 2 !== 0) continue

            const rType = rowTypes[row]
            let keep = false

            if (rType === "full") {
                // Full rows: keep almost everything across the width
                keep = colNorm > 0.15 || Math.random() < 0.7
            } else if (rType === "normal") {
                // Normal: right side dense, fading left
                keep = Math.random() < colDensity
            } else if (rType === "sparse") {
                // Sparse: only keep right quarter + occasional strays
                keep = colNorm > 0.75
                    ? Math.random() < 0.8
                    : Math.random() < colDensity * 0.25
            } else {
                // Accent: just a few scattered pixels in the row
                keep = Math.random() < 0.06
            }

            if (!keep) continue

            const baseX = gridStartX + col * stride
            const baseY = row * stride

            cells.push({
                col,
                row,
                homeX: baseX,
                homeY: baseY,
                baseOpacity: 0.08 + Math.random() * 0.55,
                size: cellSize + (Math.random() - 0.5) * 2 * sizeVariance,
                scatterDist: w * (0.55 + Math.random() * 0.6),
                scatterVy: (Math.random() - 0.5) * h * 0.4,
                scatterDelay: colNorm * 0.35,
            })
        }
    }
    return cells
}

// ---------------------------------------------------------------------------
// Build a full-width transition grid — dense pixel coverage that sweeps
// the new background color from right to left.
// ---------------------------------------------------------------------------

function buildTransitionGrid(
    w: number,
    h: number,
    cellSize: number
): TransitionCell[] {
    const stride = cellSize + 1 // tight packing for near-full coverage
    const cols = Math.ceil(w / stride)
    const rows = Math.ceil(h / stride)
    const cells: TransitionCell[] = []

    for (let col = 0; col < cols; col++) {
        const colNorm = cols > 1 ? col / (cols - 1) : 0

        for (let row = 0; row < rows; row++) {
            // Skip ~5% for organic feel (not perfectly solid)
            if (Math.random() < 0.04) continue

            cells.push({
                x: col * stride,
                y: row * stride,
                size:
                    cellSize +
                    (Math.random() - 0.5) * cellSize * 0.3,
                // Right columns first (low delay), left columns last (high delay)
                // Plus a bit of per-cell randomness for organic wave front
                waveDelay:
                    (1 - colNorm) * 0.75 + Math.random() * 0.2,
            })
        }
    }
    return cells
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
        chessColorBefore = "#ffffff",
        chessColorAfter = "#0a1628",
        cellSize = 16,
        chessWidthPercent = 40,
        borderRadius = 12,
        fontFamily = "'Inter', sans-serif",
        style,
    } = props

    const sectionRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const gridBeforeRef = useRef<ChessCell[]>([])
    const gridAfterRef = useRef<ChessCell[]>([])
    const transitionGridRef = useRef<TransitionCell[]>([])
    const animRef = useRef(0)
    const scrollRef = useRef(0)
    const dimsRef = useRef({ w: 0, h: 0 })

    const [scrollProgress, setScrollProgress] = useState(0)
    const [isMobile, setIsMobile] = useState(false)

    const chessWidthFrac = Math.max(0.05, Math.min(0.5, chessWidthPercent / 100))

    // -----------------------------------------------------------------------
    // Responsive
    // -----------------------------------------------------------------------
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768)
        check()
        window.addEventListener("resize", check)
        return () => window.removeEventListener("resize", check)
    }, [])

    // -----------------------------------------------------------------------
    // Scroll progress
    // -----------------------------------------------------------------------
    useEffect(() => {
        const el = sectionRef.current
        if (!el) return

        const onScroll = () => {
            const rect = el.getBoundingClientRect()
            const vh = window.innerHeight
            // 0 when section bottom enters viewport, 1 when fully in view
            const raw = (vh - rect.top) / (vh + rect.height)
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
    // Canvas animation
    // -----------------------------------------------------------------------

    // Transition timing thresholds
    const SCATTER_START = 0.6 // "before" chess begins scattering
    const WAVE_START = 0.6 // color wave begins sweeping
    const WAVE_END = 0.92 // wave fully covers the card
    const AFTER_CHESS_START = 0.8 // "after" chess pattern starts appearing

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const buildGrids = () => {
            const { w, h } = dimsRef.current
            if (!w || !h) return
            gridBeforeRef.current = buildChessGrid(w, h, cellSize, chessWidthFrac)
            gridAfterRef.current = buildChessGrid(w, h, cellSize, chessWidthFrac)
            transitionGridRef.current = buildTransitionGrid(w, h, cellSize)
        }

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
            buildGrids()
        }

        resize()
        window.addEventListener("resize", resize)

        const animate = () => {
            const { w, h } = dimsRef.current
            if (!w || !h) {
                animRef.current = requestAnimationFrame(animate)
                return
            }

            ctx.clearRect(0, 0, w, h)

            const sp = scrollRef.current
            const gridBefore = gridBeforeRef.current
            const gridAfter = gridAfterRef.current
            const transGrid = transitionGridRef.current

            // Derived progress values
            const scatterP =
                sp <= SCATTER_START
                    ? 0
                    : (sp - SCATTER_START) / (1 - SCATTER_START)
            const waveP =
                sp <= WAVE_START
                    ? 0
                    : Math.min(
                          1,
                          (sp - WAVE_START) / (WAVE_END - WAVE_START)
                      )
            const afterP =
                sp <= AFTER_CHESS_START
                    ? 0
                    : (sp - AFTER_CHESS_START) / (1 - AFTER_CHESS_START)

            // =============================================================
            // 1. "BEFORE" chess — static until SCATTER_START, then scatter
            // =============================================================
            for (let i = 0; i < gridBefore.length; i++) {
                const cell = gridBefore[i]

                // Per-cell staggered scatter (left cols first)
                const raw =
                    cell.scatterDelay < 1
                        ? Math.max(
                              0,
                              (scatterP - cell.scatterDelay) /
                                  (1 - cell.scatterDelay)
                          )
                        : scatterP
                const t = Math.min(1, raw)
                const eased = easeOut(t)

                const x = cell.homeX - cell.scatterDist * eased
                const y = cell.homeY + cell.scatterVy * eased
                const opacity = cell.baseOpacity * (1 - t * 0.95)

                if (x + cell.size < 0 || opacity < 0.005) continue

                ctx.globalAlpha = opacity
                ctx.fillStyle = chessColorBefore
                ctx.fillRect(x, y, cell.size, cell.size)
            }

            // =============================================================
            // 2. TRANSITION WAVE — bgColorAfter pixels sweep right→left
            //    This replaces the background color pixel by pixel.
            // =============================================================
            if (waveP > 0) {
                ctx.fillStyle = bgColorAfter
                for (let i = 0; i < transGrid.length; i++) {
                    const cell = transGrid[i]

                    // Per-cell appearance based on wave delay
                    const cellRaw =
                        cell.waveDelay < 1
                            ? Math.max(
                                  0,
                                  (waveP - cell.waveDelay) /
                                      (1 - cell.waveDelay)
                              )
                            : waveP
                    const cellT = Math.min(1, cellRaw)
                    if (cellT < 0.001) continue

                    const opacity = Math.min(1, easeOut(cellT) * 1.3)
                    ctx.globalAlpha = opacity
                    ctx.fillRect(
                        cell.x,
                        cell.y,
                        cell.size,
                        cell.size
                    )
                }
            }

            // =============================================================
            // 3. "AFTER" chess — materializes on top of the new bg color
            // =============================================================
            if (afterP > 0) {
                for (let i = 0; i < gridAfter.length; i++) {
                    const cell = gridAfter[i]

                    // Right columns appear first
                    const colDelay = 1 - cell.scatterDelay
                    const stagger = Math.max(
                        0,
                        (afterP - colDelay * 0.5) /
                            (1 - colDelay * 0.5)
                    )
                    const opacity =
                        cell.baseOpacity *
                        Math.min(1, easeOut(stagger) * 1.2)

                    if (opacity < 0.005) continue

                    ctx.globalAlpha = opacity
                    ctx.fillStyle = chessColorAfter
                    ctx.fillRect(
                        cell.homeX,
                        cell.homeY,
                        cell.size,
                        cell.size
                    )
                }
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
        cellSize,
        chessWidthFrac,
        chessColorBefore,
        chessColorAfter,
        bgColorAfter,
    ])

    // -----------------------------------------------------------------------
    // Background + text: stay "before" until wave is nearly done, then snap
    // -----------------------------------------------------------------------
    const waveComplete = scrollProgress > 0.9
    const currentBg = waveComplete ? bgColorAfter : bgColorBefore
    const currentText = waveComplete ? textColorAfter : textColorBefore

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
                        transition: "background-color 0.3s ease",
                        minHeight: isMobile ? 320 : 400,
                    }}
                >
                    {/* Chess pixel canvas */}
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

                    {/* Heading */}
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
                            transition: "color 0.3s ease",
                        }}
                    >
                        {heading}
                    </h2>

                    {/* Subheading */}
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
                                transition: "color 0.3s ease",
                            }}
                        >
                            {subheading}
                        </p>
                    )}

                    {/* Button */}
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
    chessColorBefore: {
        type: ControlType.Color,
        title: "Chess Before",
        defaultValue: "#ffffff",
    },
    chessColorAfter: {
        type: ControlType.Color,
        title: "Chess After",
        defaultValue: "#0a1628",
    },
    cellSize: {
        type: ControlType.Number,
        title: "Cell Size",
        defaultValue: 16,
        min: 6,
        max: 32,
        step: 1,
    },
    chessWidthPercent: {
        type: ControlType.Number,
        title: "Chess Width %",
        defaultValue: 40,
        min: 10,
        max: 60,
        step: 1,
        description: "Percentage of the card width covered by the chess grid",
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
