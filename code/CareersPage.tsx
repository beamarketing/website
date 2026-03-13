// Beamr Careers Page — "Every Bit Counts"
// Five sections: Hero, Open Roles, Signal Test, Open Application CTA, Footer Stats
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"
import { useState, useEffect, useRef, useCallback } from "react"

// ─── Color Constants ───────────────────────────────────────────
const COLORS = {
    darkNavy: "#000737",
    fullBlue: "#3751FF",
    accentBlue: "#0099FF",
    lightLavender: "#EAEBFF",
    white: "#FFFFFF",
    darkBg: "#080E1F",
    muted: "#8896AB",
    darkText: "#1E293B",
}

// ─── Font Stacks ───────────────────────────────────────────────
const FONTS = {
    heading: "'Poppins', 'Inter', sans-serif",
    body: "'Inter', 'Poppins', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
}

// ─── Role Data ─────────────────────────────────────────────────
interface Role {
    title: string
    department: string
    location: string
    url: string
}

const DEFAULT_ROLES: Role[] = [
    { title: "Senior Video Codec Engineer", department: "Engineering", location: "Tel Aviv", url: "#" },
    { title: "GPU Systems Engineer", department: "Engineering", location: "Tel Aviv", url: "#" },
    { title: "Perceptual Quality Researcher", department: "Research", location: "Tel Aviv", url: "#" },
    { title: "Full-Stack Engineer", department: "Engineering", location: "Tel Aviv", url: "#" },
    { title: "Algorithm Developer — Video", department: "Engineering", location: "Tel Aviv", url: "#" },
    { title: "Data Engineer", department: "Engineering", location: "Tel Aviv", url: "#" },
    { title: "Director of Product", department: "Product", location: "Tel Aviv", url: "#" },
    { title: "Product Manager — AV & ML", department: "Product", location: "Remote", url: "#" },
    { title: "VidOps Engineer", department: "Operations", location: "Remote", url: "#" },
    { title: "Technical Account Manager", department: "Operations", location: "Remote", url: "#" },
]

// ─── Signal Test Items ─────────────────────────────────────────
const SIGNAL_ITEMS = [
    "You've gone deep on something and can explain it without dumbing it down.",
    "You've shipped something real users depend on.",
    'You care about "right" vs "good enough" — even when no one notices.',
    "You read this far instead of just scrolling to the titles.",
    "You want problems that don't exist at most companies.",
]

// ═══════════════════════════════════════════════════════════════
// PIXEL CANVAS — animated hero background
// ═══════════════════════════════════════════════════════════════
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
            const area = w * h
            const count = Math.floor(area / 2800)
            const pixels: any[] = []
            for (let i = 0; i < count; i++) {
                const size = 4 + Math.random() * 28
                pixels.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    size,
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
                // Sine-wave breathing
                const breath = Math.sin(time * 0.001 * p.speed + p.phase)
                let opacity = p.baseOpacity + breath * 0.015

                // Drift
                p.x += p.driftX * 0.16
                p.y += p.driftY * 0.16
                if (p.x < -p.size) p.x = w + p.size
                if (p.x > w + p.size) p.x = -p.size
                if (p.y < -p.size) p.y = h + p.size
                if (p.y > h + p.size) p.y = -p.size

                // Blinker
                if (p.blinker) {
                    p.blinkTimer -= 16
                    if (p.blinkTimer <= 0) {
                        p.blinkState = !p.blinkState
                        p.blinkTimer = 80 + Math.random() * 300
                    }
                    if (!p.blinkState) opacity *= 0.1
                }

                // Mouse proximity glow
                const dx = p.x - mx
                const dy = p.y - my
                const dist = Math.sqrt(dx * dx + dy * dy)
                if (dist < 180) {
                    const proximity = 1 - (dist / 180)
                    const glow = proximity * proximity // quadratic falloff
                    // Draw glow halo
                    ctx.fillStyle = `rgba(0,153,255,${glow * 0.12})`
                    ctx.fillRect(
                        p.x - p.size * 0.5 - 2,
                        p.y - p.size * 0.5 - 2,
                        p.size + 4,
                        p.size + 4
                    )
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
        <canvas
            ref={canvasRef}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 0,
                pointerEvents: "auto",
            }}
        />
    )
}

// ═══════════════════════════════════════════════════════════════
// SCAN LINE — sweeping horizontal gradient
// ═══════════════════════════════════════════════════════════════
function ScanLine() {
    return (
        <>
            <style>{`
                @keyframes scanSweep {
                    0%, 100% { top: 0%; }
                    50% { top: 100%; }
                }
            `}</style>
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    width: "100%",
                    height: 1,
                    background: `linear-gradient(90deg, transparent 0%, ${COLORS.accentBlue}33 20%, ${COLORS.accentBlue}66 50%, ${COLORS.accentBlue}33 80%, transparent 100%)`,
                    opacity: 0.4,
                    zIndex: 1,
                    pointerEvents: "none",
                    animation: "scanSweep 6s ease-in-out infinite",
                }}
            />
        </>
    )
}

// ═══════════════════════════════════════════════════════════════
// BITSTREAM — cycling binary in bottom-right
// ═══════════════════════════════════════════════════════════════
function BitStream({ isMobile }: { isMobile: boolean }) {
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
        <div
            style={{
                position: "absolute",
                bottom: isMobile ? 16 : 24,
                right: isMobile ? 24 : 48,
                fontFamily: FONTS.mono,
                fontSize: isMobile ? 7 : 9,
                color: COLORS.white,
                opacity: 0.06,
                letterSpacing: "1.5px",
                zIndex: 2,
                pointerEvents: "none",
            }}
        >
            {bits}
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════
// CROP MARKS — L-brackets at corners
// ═══════════════════════════════════════════════════════════════
function CropMarks() {
    const markStyle = (
        top?: number,
        right?: number,
        bottom?: number,
        left?: number,
        borderTop?: string,
        borderRight?: string,
        borderBottom?: string,
        borderLeft?: string
    ): React.CSSProperties => ({
        position: "absolute",
        width: 36,
        height: 36,
        zIndex: 2,
        pointerEvents: "none",
        ...(top !== undefined && { top }),
        ...(right !== undefined && { right }),
        ...(bottom !== undefined && { bottom }),
        ...(left !== undefined && { left }),
        ...(borderTop && { borderTop }),
        ...(borderRight && { borderRight }),
        ...(borderBottom && { borderBottom }),
        ...(borderLeft && { borderLeft }),
    })

    const stroke = `1.5px solid rgba(0,153,255,0.2)`

    return (
        <>
            <div style={markStyle(40, undefined, undefined, 40, stroke, undefined, undefined, stroke)} />
            <div style={markStyle(40, 40, undefined, undefined, stroke, stroke, undefined, undefined)} />
            <div style={markStyle(undefined, undefined, 40, 40, undefined, undefined, stroke, stroke)} />
            <div style={markStyle(undefined, 40, 40, undefined, undefined, stroke, stroke, undefined)} />
        </>
    )
}

// ═══════════════════════════════════════════════════════════════
// SECTION 1: HERO
// ═══════════════════════════════════════════════════════════════
function HeroSection({ isMobile }: { isMobile: boolean }) {
    return (
        <section
            id="careers-hero"
            style={{
                width: "100%",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: isMobile ? "flex-start" : "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                backgroundColor: COLORS.darkNavy,
                padding: isMobile ? "120px 24px 80px" : "120px 48px 80px",
                boxSizing: "border-box",
            }}
        >
            {/* Dynamic layers */}
            <PixelCanvas />
            <ScanLine />
            {!isMobile && <CropMarks />}
            <BitStream isMobile={isMobile} />

            {/* Content */}
            <div
                style={{
                    position: "relative",
                    zIndex: 3,
                    maxWidth: 720,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isMobile ? "flex-start" : "center",
                    textAlign: isMobile ? "left" : "center",
                    gap: 24,
                }}
            >
                {/* Badge */}
                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 16px",
                        borderRadius: 12,
                        backgroundColor: COLORS.fullBlue,
                        fontFamily: FONTS.heading,
                        fontSize: 10,
                        fontWeight: 600,
                        color: COLORS.white,
                        letterSpacing: "1px",
                        textTransform: "uppercase" as const,
                    }}
                >
                    <span
                        style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            backgroundColor: COLORS.accentBlue,
                            animation: "pulse 2s ease-in-out infinite",
                        }}
                    />
                    Now Hiring
                </div>

                {/* Headline */}
                <h1
                    style={{
                        fontFamily: FONTS.heading,
                        fontSize: isMobile ? "clamp(56px, 14vw, 80px)" : "clamp(72px, 9vw, 130px)",
                        fontWeight: 900,
                        color: COLORS.white,
                        lineHeight: 0.9,
                        letterSpacing: isMobile ? "-2px" : "-4px",
                        margin: 0,
                    }}
                >
                    EVERY
                    <br />
                    BIT
                    <br />
                    COUNTS<span style={{ color: COLORS.fullBlue }}>.</span>
                </h1>

                {/* Subheadline */}
                <p
                    style={{
                        fontFamily: FONTS.body,
                        fontSize: 18,
                        color: COLORS.white,
                        opacity: 0.35,
                        lineHeight: 1.6,
                        margin: 0,
                        maxWidth: 480,
                    }}
                >
                    We analyze every bit to find the ones that matter.{" "}
                    <span style={{ opacity: 1, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
                        We hire the same way.
                    </span>
                </p>

                {/* CTA Button */}
                <a
                    href="#open-roles"
                    onClick={(e) => {
                        e.preventDefault()
                        document.getElementById("open-roles")?.scrollIntoView({ behavior: "smooth" })
                    }}
                    style={{
                        backgroundColor: COLORS.accentBlue,
                        color: COLORS.white,
                        padding: "14px 32px",
                        borderRadius: 8,
                        fontSize: 14,
                        fontWeight: 600,
                        fontFamily: FONTS.heading,
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        border: "none",
                    }}
                    onMouseEnter={(e) => {
                        const el = e.currentTarget
                        el.style.backgroundColor = COLORS.fullBlue
                        el.style.transform = "translateY(-2px)"
                        el.style.boxShadow = `0 8px 24px rgba(0,153,255,0.3)`
                    }}
                    onMouseLeave={(e) => {
                        const el = e.currentTarget
                        el.style.backgroundColor = COLORS.accentBlue
                        el.style.transform = "translateY(0)"
                        el.style.boxShadow = "none"
                    }}
                >
                    See Open Roles ↓
                </a>

                {/* Stats Row */}
                <div
                    style={{
                        display: "flex",
                        alignItems: isMobile ? "flex-start" : "center",
                        justifyContent: isMobile ? "flex-start" : "center",
                        gap: isMobile ? 24 : 48,
                        marginTop: 32,
                        paddingTop: 32,
                        borderTop: "1px solid rgba(255,255,255,0.04)",
                        width: "100%",
                        flexWrap: "wrap" as const,
                    }}
                >
                    {[
                        { value: "53", label: "Patents" },
                        { value: "1 Emmy", label: "Technology & Engineering", accent: true },
                        { value: "~50", label: "People" },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: isMobile ? "flex-start" : "center",
                                gap: 2,
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: FONTS.mono,
                                    fontSize: 28,
                                    fontWeight: 700,
                                    color: COLORS.white,
                                    letterSpacing: "-1px",
                                }}
                            >
                                {stat.value.includes("Emmy") ? (
                                    <>
                                        1{" "}
                                        <span style={{ color: COLORS.accentBlue, fontSize: 20 }}>
                                            Emmy
                                        </span>
                                    </>
                                ) : (
                                    stat.value
                                )}
                            </span>
                            <span
                                style={{
                                    fontFamily: FONTS.mono,
                                    fontSize: 11,
                                    color: COLORS.white,
                                    opacity: 0.25,
                                    textTransform: "uppercase" as const,
                                    letterSpacing: "1.2px",
                                }}
                            >
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pulse animation keyframes */}
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }
            `}</style>
        </section>
    )
}

// ═══════════════════════════════════════════════════════════════
// SECTION 2: OPEN ROLES
// ═══════════════════════════════════════════════════════════════
function RoleRow({ role, isMobile }: { role: Role; isMobile: boolean }) {
    const [hovered, setHovered] = useState(false)

    return (
        <a
            href={role.url}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: hovered ? "16px 16px 16px 28px" : "16px",
                borderBottom: "1px solid rgba(0,0,0,0.04)",
                textDecoration: "none",
                position: "relative",
                transition: "all 0.25s ease",
                cursor: "pointer",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Quality strip */}
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 3,
                    height: hovered ? 28 : 0,
                    background: `linear-gradient(${COLORS.accentBlue}, ${COLORS.fullBlue})`,
                    borderRadius: 2,
                    transition: "height 0.25s ease",
                }}
            />

            <span
                style={{
                    fontFamily: FONTS.heading,
                    fontSize: 16,
                    fontWeight: 600,
                    color: hovered ? COLORS.fullBlue : COLORS.darkText,
                    transition: "color 0.2s ease",
                }}
            >
                {role.title}
            </span>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {/* Department tag — visible on hover */}
                <span
                    style={{
                        fontFamily: FONTS.mono,
                        fontSize: 8,
                        fontWeight: 500,
                        textTransform: "uppercase" as const,
                        letterSpacing: "1.2px",
                        color: COLORS.fullBlue,
                        backgroundColor: COLORS.lightLavender,
                        padding: "4px 8px",
                        borderRadius: 4,
                        opacity: hovered ? 1 : 0,
                        transition: "opacity 0.2s ease",
                    }}
                >
                    {role.department}
                </span>

                {/* Arrow */}
                <span
                    style={{
                        fontFamily: FONTS.body,
                        fontSize: 14,
                        color: COLORS.muted,
                        transition: "transform 0.2s ease",
                        transform: hovered ? "translateX(4px)" : "translateX(0)",
                        display: "inline-block",
                    }}
                >
                    →
                </span>
            </div>
        </a>
    )
}

function OpenRolesSection({ roles, isMobile }: { roles: Role[]; isMobile: boolean }) {
    const [locationFilter, setLocationFilter] = useState("all")
    const [deptFilter, setDeptFilter] = useState("all")

    const locations = Array.from(new Set(roles.map((r) => r.location)))
    const departments = Array.from(new Set(roles.map((r) => r.department)))

    const filtered = roles.filter((r) => {
        if (locationFilter !== "all" && r.location !== locationFilter) return false
        if (deptFilter !== "all" && r.department !== deptFilter) return false
        return true
    })

    // Group by location
    const grouped: Record<string, Role[]> = {}
    for (const r of filtered) {
        if (!grouped[r.location]) grouped[r.location] = []
        grouped[r.location].push(r)
    }

    const selectStyle: React.CSSProperties = {
        fontFamily: FONTS.body,
        fontSize: 13,
        fontWeight: 500,
        padding: "10px 36px 10px 14px",
        border: "1.5px solid rgba(0,0,0,0.07)",
        borderRadius: 8,
        backgroundColor: COLORS.white,
        color: COLORS.darkText,
        appearance: "none" as const,
        cursor: "pointer",
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%238896AB' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 12px center",
        outline: "none",
        minWidth: 160,
    }

    const labelStyle: React.CSSProperties = {
        fontFamily: FONTS.mono,
        fontSize: 9,
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "1.5px",
        color: COLORS.muted,
        opacity: 0.5,
        marginBottom: 6,
    }

    return (
        <section
            id="open-roles"
            style={{
                width: "100%",
                backgroundColor: COLORS.white,
                padding: isMobile ? "64px 24px" : "80px 48px",
                boxSizing: "border-box",
            }}
        >
            <div style={{ maxWidth: 900, margin: "0 auto" }}>
                {/* Headline */}
                <h2
                    style={{
                        fontFamily: FONTS.heading,
                        fontSize: 28,
                        fontWeight: 700,
                        color: COLORS.darkText,
                        letterSpacing: "-0.5px",
                        margin: "0 0 32px 0",
                    }}
                >
                    Find Your Next Career Opportunity
                </h2>

                {/* Filters */}
                <div
                    style={{
                        display: "flex",
                        gap: 24,
                        marginBottom: 32,
                        flexWrap: "wrap" as const,
                    }}
                >
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={labelStyle}>Location</span>
                        <select
                            style={selectStyle}
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                        >
                            <option value="all">All Locations</option>
                            {locations.map((l) => (
                                <option key={l} value={l}>
                                    {l}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={labelStyle}>Department</span>
                        <select
                            style={selectStyle}
                            value={deptFilter}
                            onChange={(e) => setDeptFilter(e.target.value)}
                        >
                            <option value="all">All Departments</option>
                            {departments.map((d) => (
                                <option key={d} value={d}>
                                    {d}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Separator */}
                <div style={{ borderBottom: "1px solid rgba(0,0,0,0.04)", marginBottom: 8 }} />

                {/* Grouped roles */}
                {Object.entries(grouped).map(([location, locationRoles]) => (
                    <div key={location} style={{ marginBottom: 24 }}>
                        <div
                            style={{
                                fontFamily: FONTS.heading,
                                fontSize: 12,
                                fontWeight: 700,
                                textTransform: "uppercase" as const,
                                letterSpacing: "1.5px",
                                color: COLORS.muted,
                                opacity: 0.5,
                                padding: "16px 0 8px",
                            }}
                        >
                            {location}
                        </div>
                        <div style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }} />
                        {locationRoles.map((role, i) => (
                            <RoleRow key={i} role={role} isMobile={isMobile} />
                        ))}
                    </div>
                ))}

                {filtered.length === 0 && (
                    <p
                        style={{
                            fontFamily: FONTS.body,
                            fontSize: 14,
                            color: COLORS.muted,
                            padding: "32px 0",
                            textAlign: "center",
                        }}
                    >
                        No roles match your filters. Try broadening your search.
                    </p>
                )}
            </div>
        </section>
    )
}

// ═══════════════════════════════════════════════════════════════
// SECTION 3: SIGNAL TEST
// ═══════════════════════════════════════════════════════════════
function SignalTestSection({ isMobile }: { isMobile: boolean }) {
    const [checked, setChecked] = useState<boolean[]>(new Array(SIGNAL_ITEMS.length).fill(false))

    const checkedCount = checked.filter(Boolean).length

    const toggle = (index: number) => {
        setChecked((prev) => {
            const next = [...prev]
            next[index] = !next[index]
            return next
        })
    }

    const getResultText = () => {
        if (checkedCount === 0) return "Check what's true."
        if (checkedCount <= 2) return "Signal detected. Below threshold."
        if (checkedCount <= 4) return "High signal. Let's talk."
        return "Zero wasted bits. Talk to us."
    }

    const isHot = checkedCount >= 3

    return (
        <section
            style={{
                width: "100%",
                backgroundColor: COLORS.darkNavy,
                padding: isMobile ? "64px 24px" : "80px 48px",
                boxSizing: "border-box",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Background pixel grid SVG */}
            <svg
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 0,
                    pointerEvents: "none",
                }}
            >
                <rect x="10%" y="15%" width="40" height="40" fill="white" opacity="0.015" />
                <rect x="70%" y="25%" width="44" height="44" fill={COLORS.fullBlue} opacity="0.02" />
                <rect x="30%" y="70%" width="42" height="42" fill={COLORS.fullBlue} opacity="0.015" />
                <rect x="85%" y="75%" width="40" height="40" fill="white" opacity="0.02" />
            </svg>

            <div
                style={{
                    maxWidth: 900,
                    margin: "0 auto",
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: isMobile ? 28 : 48,
                    position: "relative",
                    zIndex: 1,
                }}
            >
                {/* Left: headline */}
                <div style={{ flex: 1, minWidth: 260 }}>
                    <h2
                        style={{
                            fontFamily: FONTS.heading,
                            fontSize: 22,
                            fontWeight: 700,
                            color: COLORS.white,
                            letterSpacing: "-0.3px",
                            margin: "0 0 12px 0",
                            lineHeight: 1.3,
                        }}
                    >
                        Not sure?
                        <br />
                        Run the test.
                    </h2>
                    <p
                        style={{
                            fontFamily: FONTS.body,
                            fontSize: 14,
                            color: COLORS.white,
                            opacity: 0.35,
                            margin: 0,
                            lineHeight: 1.5,
                        }}
                    >
                        Three or more true — we should talk.
                    </p>
                </div>

                {/* Right: checkboxes + meter */}
                <div style={{ flex: 1.3, minWidth: 320 }}>
                    {/* Checkbox items */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {SIGNAL_ITEMS.map((item, i) => {
                            const isChecked = checked[i]
                            return (
                                <div
                                    key={i}
                                    onClick={() => toggle(i)}
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: 12,
                                        padding: "12px 14px",
                                        borderRadius: 10,
                                        backgroundColor: isChecked
                                            ? "rgba(0,153,255,0.05)"
                                            : "rgba(255,255,255,0.015)",
                                        border: `1.5px solid ${
                                            isChecked
                                                ? "rgba(0,153,255,0.18)"
                                                : "rgba(255,255,255,0.04)"
                                        }`,
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                        userSelect: "none" as const,
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isChecked) {
                                            e.currentTarget.style.borderColor = "rgba(0,153,255,0.1)"
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isChecked) {
                                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)"
                                        }
                                    }}
                                >
                                    {/* Checkbox */}
                                    <div
                                        style={{
                                            width: 18,
                                            height: 18,
                                            minWidth: 18,
                                            borderRadius: 5,
                                            border: isChecked
                                                ? "none"
                                                : "1.5px solid rgba(255,255,255,0.08)",
                                            backgroundColor: isChecked
                                                ? COLORS.accentBlue
                                                : "transparent",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            transition: "all 0.2s ease",
                                            marginTop: 1,
                                        }}
                                    >
                                        {isChecked && (
                                            <svg
                                                width="10"
                                                height="8"
                                                viewBox="0 0 10 8"
                                                fill="none"
                                            >
                                                <path
                                                    d="M1 4L3.5 6.5L9 1"
                                                    stroke="white"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        )}
                                    </div>

                                    {/* Text */}
                                    <span
                                        style={{
                                            fontFamily: FONTS.body,
                                            fontSize: 12.5,
                                            color: COLORS.white,
                                            opacity: isChecked ? 0.85 : 0.35,
                                            lineHeight: 1.5,
                                            transition: "opacity 0.2s ease",
                                        }}
                                    >
                                        {item}
                                    </span>
                                </div>
                            )
                        })}
                    </div>

                    {/* Signal meter + result */}
                    <div
                        style={{
                            marginTop: 20,
                            padding: "16px 18px",
                            borderRadius: 10,
                            backgroundColor: isHot
                                ? "rgba(0,153,255,0.07)"
                                : "rgba(0,153,255,0.03)",
                            border: `1.5px solid ${
                                isHot ? "rgba(0,153,255,0.2)" : "rgba(0,153,255,0.06)"
                            }`,
                            boxShadow: isHot
                                ? "0 0 24px rgba(0,153,255,0.15)"
                                : "none",
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                            flexWrap: "wrap" as const,
                            transition: "all 0.3s ease",
                        }}
                    >
                        {/* Signal bars */}
                        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: 32,
                                        height: 4,
                                        borderRadius: 2,
                                        backgroundColor:
                                            i < checkedCount
                                                ? COLORS.accentBlue
                                                : "rgba(255,255,255,0.04)",
                                        boxShadow:
                                            i < checkedCount
                                                ? `0 0 8px ${COLORS.accentBlue}40`
                                                : "none",
                                        transition: "all 0.3s ease",
                                    }}
                                />
                            ))}
                        </div>

                        {/* Result text */}
                        <span
                            style={{
                                fontFamily: FONTS.body,
                                fontSize: 13,
                                fontWeight: 500,
                                color: COLORS.white,
                                opacity: checkedCount === 0 ? 0.3 : 0.8,
                                flex: 1,
                                transition: "opacity 0.3s ease",
                            }}
                        >
                            {getResultText()}
                        </span>

                        {/* CTA button — appears at 3+ */}
                        {isHot && (
                            <a
                                href="#open-roles"
                                onClick={(e) => {
                                    e.preventDefault()
                                    document
                                        .getElementById("open-roles")
                                        ?.scrollIntoView({ behavior: "smooth" })
                                }}
                                style={{
                                    fontFamily: FONTS.heading,
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: COLORS.white,
                                    backgroundColor: COLORS.accentBlue,
                                    padding: "8px 20px",
                                    borderRadius: 6,
                                    textDecoration: "none",
                                    cursor: "pointer",
                                    transition: "background-color 0.2s ease",
                                    whiteSpace: "nowrap" as const,
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = COLORS.fullBlue
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = COLORS.accentBlue
                                }}
                            >
                                Apply
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

// ═══════════════════════════════════════════════════════════════
// SECTION 4: OPEN APPLICATION CTA
// ═══════════════════════════════════════════════════════════════
function OpenAppCTASection({
    isMobile,
    openAppUrl,
    linkedInUrl,
}: {
    isMobile: boolean
    openAppUrl: string
    linkedInUrl: string
}) {
    return (
        <section
            style={{
                width: "100%",
                backgroundColor: COLORS.white,
                borderTop: "1px solid rgba(0,0,0,0.04)",
                padding: isMobile ? "48px 24px" : "56px 48px",
                boxSizing: "border-box",
                textAlign: "center",
            }}
        >
            <h3
                style={{
                    fontFamily: FONTS.heading,
                    fontSize: 20,
                    fontWeight: 700,
                    color: COLORS.darkText,
                    letterSpacing: "-0.3px",
                    margin: 0,
                }}
            >
                Not every bit makes the cut.
            </h3>
            <p
                style={{
                    fontFamily: FONTS.body,
                    fontSize: 14,
                    color: COLORS.muted,
                    margin: "6px 0 0",
                }}
            >
                Don't see your role? Tell us what we're missing.
            </p>

            {/* Buttons */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                    marginTop: 24,
                    flexWrap: "wrap" as const,
                }}
            >
                {/* Primary */}
                <a
                    href={openAppUrl}
                    style={{
                        fontFamily: FONTS.heading,
                        fontSize: 13,
                        fontWeight: 600,
                        color: COLORS.white,
                        backgroundColor: COLORS.fullBlue,
                        padding: "10px 24px",
                        borderRadius: 8,
                        textDecoration: "none",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        border: "none",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = COLORS.accentBlue
                        e.currentTarget.style.transform = "translateY(-1px)"
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = COLORS.fullBlue
                        e.currentTarget.style.transform = "translateY(0)"
                    }}
                >
                    Send Us Your Story
                </a>

                {/* Secondary */}
                <a
                    href={linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        fontFamily: FONTS.heading,
                        fontSize: 13,
                        fontWeight: 600,
                        color: COLORS.fullBlue,
                        backgroundColor: "transparent",
                        padding: "10px 24px",
                        borderRadius: 8,
                        textDecoration: "none",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        border: `1.5px solid rgba(55,81,255,0.12)`,
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = COLORS.fullBlue
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(55,81,255,0.12)"
                    }}
                >
                    Follow on LinkedIn
                </a>
            </div>
        </section>
    )
}

// ═══════════════════════════════════════════════════════════════
// SECTION 5: FOOTER STATS
// ═══════════════════════════════════════════════════════════════
function FooterStatsSection({ isMobile }: { isMobile: boolean }) {
    const stats = [
        { value: "53", label: "Patents" },
        { value: "1", unit: "Emmy", label: "Technology & Engineering" },
        { value: "12", label: "APIs in the GPU driver" },
        { value: "~50", label: "People" },
    ]

    return (
        <section
            style={{
                width: "100%",
                backgroundColor: COLORS.white,
                padding: isMobile ? "24px 24px 48px" : "24px 48px 48px",
                boxSizing: "border-box",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    gap: isMobile ? 24 : 48,
                    flexWrap: "wrap" as const,
                    maxWidth: 900,
                    margin: "0 auto",
                }}
            >
                {stats.map((stat, i) => (
                    <div
                        key={i}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        <span
                            style={{
                                fontFamily: FONTS.mono,
                                fontSize: 26,
                                fontWeight: 700,
                                color: COLORS.darkBg,
                                letterSpacing: "-1px",
                            }}
                        >
                            {stat.value}
                            {stat.unit && (
                                <span
                                    style={{
                                        color: COLORS.accentBlue,
                                        fontSize: 13,
                                        marginLeft: 4,
                                    }}
                                >
                                    {stat.unit}
                                </span>
                            )}
                        </span>
                        <span
                            style={{
                                fontFamily: FONTS.body,
                                fontSize: 10,
                                color: COLORS.muted,
                                letterSpacing: "0.3px",
                                marginTop: 2,
                                textAlign: "center",
                            }}
                        >
                            {stat.label}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    )
}

// ═══════════════════════════════════════════════════════════════
// MAIN: CAREERS PAGE
// ═══════════════════════════════════════════════════════════════
interface CareersPageProps {
    openAppUrl: string
    linkedInUrl: string
    style?: React.CSSProperties
}

function CareersPage(props: CareersPageProps) {
    const {
        openAppUrl = "#open-application",
        linkedInUrl = "#linkedin",
        style,
    } = props

    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        function check() {
            setIsMobile(window.innerWidth <= 900)
        }
        check()
        window.addEventListener("resize", check)
        return () => window.removeEventListener("resize", check)
    }, [])

    // Scroll-triggered fade-in
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        const el = entry.target as HTMLElement
                        el.style.opacity = "1"
                        el.style.transform = "translateY(0)"
                        observer.unobserve(el)
                    }
                }
            },
            { threshold: 0.1 }
        )

        // Observe all sections except hero
        const sections = document.querySelectorAll("[data-careers-reveal]")
        sections.forEach((s) => {
            const el = s as HTMLElement
            el.style.opacity = "0"
            el.style.transform = "translateY(12px)"
            el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
            observer.observe(el)
        })

        return () => observer.disconnect()
    }, [])

    return (
        <div
            style={{
                ...style,
                width: "100%",
                display: "flex",
                flexDirection: "column" as const,
                minHeight: "100vh",
                backgroundColor: COLORS.white,
            }}
        >
            {/* Section 1: Hero (Dark) */}
            <HeroSection isMobile={isMobile} />

            {/* Section 2: Open Roles (White) */}
            <div data-careers-reveal>
                <OpenRolesSection roles={DEFAULT_ROLES} isMobile={isMobile} />
            </div>

            {/* Section 3: Signal Test (Dark) */}
            <div data-careers-reveal>
                <SignalTestSection isMobile={isMobile} />
            </div>

            {/* Section 4: Open Application CTA (White) */}
            <div data-careers-reveal>
                <OpenAppCTASection
                    isMobile={isMobile}
                    openAppUrl={openAppUrl}
                    linkedInUrl={linkedInUrl}
                />
            </div>

            {/* Section 5: Footer Stats (White) */}
            <div data-careers-reveal>
                <FooterStatsSection isMobile={isMobile} />
            </div>
        </div>
    )
}

addPropertyControls(CareersPage, {
    openAppUrl: {
        type: ControlType.String,
        title: "Open App URL",
        defaultValue: "#open-application",
    },
    linkedInUrl: {
        type: ControlType.String,
        title: "LinkedIn URL",
        defaultValue: "#linkedin",
    },
})

export default CareersPage
