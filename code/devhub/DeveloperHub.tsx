// Beamr Developer Hub
// Framer Code Component: searchable library of technical resources with
// generated cover art, optional HubSpot registration gate, and three content
// sources (Framer panel, JSON / HubSpot HubDB feed, or both).
// See code/devhub/README.md for setup.

import * as React from "react"
import { createPortal } from "react-dom"
import { addPropertyControls, ControlType } from "framer"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Resource {
    id: string
    title: string
    description: string
    type: string
    topic: string
    audience: string
    format: string
    date: string
    size: string
    href: string
    image: string
    featured: boolean
    gated: boolean
    metric: string
    metricLabel: string
    formId: string
}

interface FormField {
    name: string
    label: string
    type: "text" | "email" | "tel"
    required: boolean
    half: boolean
}

interface Fact {
    label: string
    value: string
}

interface QuickLink {
    label: string
    description: string
    href: string
}

interface TopicColor {
    topic: string
    color: string
}

interface Props {
    // Content
    kicker: string
    heading: string
    intro: string
    searchPlaceholder: string
    facts: Fact[]
    items: any[]
    source: "panel" | "feed" | "both"
    feedUrl: string
    // Gate
    portalId: string
    formId: string
    region: string
    formMode: "native" | "embed"
    formFields: FormField[]
    resourceField: string
    unlockScope: "all" | "item"
    gateTitle: string
    gateText: string
    privacyText: string
    privacyUrl: string
    // Sections
    showFeatured: boolean
    showQuickLinks: boolean
    quickLinksTitle: string
    quickLinks: QuickLink[]
    showCta: boolean
    ctaTitle: string
    ctaText: string
    ctaLabel: string
    ctaHref: string
    // Style
    accent: string
    ink: string
    dark: string
    background: string
    topicColors: TopicColor[]
    fontFamily: string
    monoFamily: string
    loadFonts: boolean
    maxWidth: number
    style?: React.CSSProperties
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const DEFAULT_ITEMS = [
    {
        id: "ml-safe-3d",
        title: "ML-Safe Compression for 3D Object Detection",
        description:
            "How much AV video can be removed before a 3D detector notices? Measured model-behavior deltas across bitrate targets, with the full test protocol.",
        type: "Benchmark",
        topic: "ML-Safe Compression",
        audience: "AV / Physical AI",
        format: "PDF",
        date: "2026-09-01",
        size: "",
        href: "#",
        featured: true,
        gated: true,
        metric: "Up to 50%",
        metricLabel: "less video data",
    },
    {
        id: "av-blueprint",
        title: "AV Video Data Blueprint",
        description:
            "Reference architecture for cutting the storage and movement cost of autonomous-vehicle video, from vehicle logger to training cluster.",
        type: "Guide",
        topic: "AV Data Infrastructure",
        audience: "AV / Physical AI",
        format: "Web",
        date: "2026-07-01",
        size: "",
        href: "https://beamr.com/blueprint_av",
        featured: true,
        gated: false,
        metric: "End-to-end",
        metricLabel: "AV video workflow",
    },
    {
        id: "gpu-video",
        title: "GPU-Accelerated Video Optimization",
        description:
            "Combining GPU encode pipelines with content-adaptive bitrate optimization for high-throughput workloads.",
        type: "Technical Paper",
        topic: "GPU Video",
        audience: "Developers",
        format: "PDF",
        date: "2026-08-01",
        size: "",
        href: "#",
        featured: true,
        gated: false,
        metric: "GPU",
        metricLabel: "native pipeline",
    },
    {
        id: "lossless-av",
        title: "Lossless Compression for Sensor & AV Video",
        description:
            "Reduce footprint without changing a single decoded pixel, for archives, validation, replay and regulated workflows.",
        type: "One-Pager",
        topic: "Lossless Compression",
        audience: "AV / Physical AI",
        format: "PDF",
        date: "2026-09-01",
        size: "",
        href: "#",
        featured: false,
        gated: true,
        metric: "",
        metricLabel: "",
    },
    {
        id: "pixel-webinar",
        title: "What If the Pixel You Removed Was the One Your Model Needed?",
        description:
            "Beamr's AI team walks through experiments that evaluate compression by model behavior, not only visual quality.",
        type: "Webinar",
        topic: "ML-Safe Compression",
        audience: "AV / Physical AI",
        format: "Video",
        date: "2026-09-15",
        size: "",
        href: "#",
        featured: false,
        gated: false,
        metric: "",
        metricLabel: "",
    },
    {
        id: "vsr",
        title: "AI Video Super Resolution + Beamr CABR",
        description:
            "Upscale HD libraries to 4K with NVIDIA AI while controlling the bitrate cost of higher-resolution output.",
        type: "One-Pager",
        topic: "Video Super Resolution",
        audience: "Media & Entertainment",
        format: "PDF",
        date: "2026-09-08",
        size: "",
        href: "#",
        featured: false,
        gated: false,
        metric: "",
        metricLabel: "",
    },
    {
        id: "vast",
        title: "Modernizing Video Archives on AI Infrastructure",
        description:
            "Architecture for AI-powered archive modernization on high-performance data infrastructure and GPU processing.",
        type: "Presentation",
        topic: "Cloud & Storage",
        audience: "Media & Entertainment",
        format: "Slides",
        date: "2026-09-20",
        size: "",
        href: "#",
        featured: false,
        gated: true,
        metric: "",
        metricLabel: "",
    },
    {
        id: "rtmaps",
        title: "Beamr in RTMaps: Reduce AV Video at the Data Pipeline",
        description:
            "Where Beamr sits inside real-time automotive data workflows for lossless and ML-aware video reduction.",
        type: "Integration Guide",
        topic: "AV Data Infrastructure",
        audience: "AV / Physical AI",
        format: "Web",
        date: "2026-07-20",
        size: "",
        href: "#",
        featured: false,
        gated: false,
        metric: "",
        metricLabel: "",
    },
]

const DEFAULT_FIELDS: FormField[] = [
    { name: "firstname", label: "First name", type: "text", required: true, half: true },
    { name: "lastname", label: "Last name", type: "text", required: true, half: true },
    { name: "email", label: "Work email", type: "email", required: true, half: false },
    { name: "company", label: "Company", type: "text", required: true, half: true },
    { name: "jobtitle", label: "Role", type: "text", required: false, half: true },
]

const DEFAULT_FACTS: Fact[] = [
    { label: "Company", value: "Beamr Imaging Ltd." },
    { label: "Listed", value: "NASDAQ: BMR" },
    { label: "Core tech", value: "CABR · GPU encoding" },
    { label: "Focus", value: "AV / ML video data" },
]

const DEFAULT_LINKS: QuickLink[] = [
    { label: "Investor relations", description: "Filings, results and shareholder information", href: "#" },
    { label: "Press releases", description: "Announcements and company news", href: "#" },
    { label: "Brand & media kit", description: "Logos, product imagery and boilerplate", href: "#" },
    { label: "Talk to an engineer", description: "Technical questions about your pipeline", href: "#" },
]

// Topic colors are assigned in order of first appearance unless overridden.
const PALETTE = ["#6C5CE7", "#0E9F9A", "#E07A2E", "#2F6FED", "#D2457F", "#3E9B4F", "#B88A12", "#7A5AF8"]

const UNLOCK_KEY = "beamr-devhub-unlocked"
const ALL = "__all"

// ---------------------------------------------------------------------------
// Data normalization (panel items, JSON feeds and HubDB rows share one shape)
// ---------------------------------------------------------------------------

function str(x: any): string {
    if (x == null) return ""
    if (typeof x === "object") return String(x.label ?? x.name ?? x.url ?? x.src ?? "")
    return String(x)
}

function bool(x: any): boolean {
    return x === true || x === 1 || x === "1" || x === "true" || x === "yes"
}

function slug(s: string): string {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]

function parseDate(x: any): number {
    if (typeof x === "number") return x
    const s = str(x).trim()
    if (!s) return 0
    const m = s.match(/^([a-z]{3})[a-z]*\.?\s+(\d{4})$/i)
    if (m) {
        const mi = MONTHS.indexOf(m[1].toLowerCase())
        if (mi >= 0) return Date.UTC(Number(m[2]), mi, 1)
    }
    const t = Date.parse(s)
    return isNaN(t) ? 0 : t
}

function formatDate(x: string): string {
    const t = parseDate(x)
    if (!t) return x
    const d = new Date(t)
    return `${MONTHS[d.getUTCMonth()].toUpperCase()} ${d.getUTCFullYear()}`
}

function normalize(raw: any, i: number): Resource | null {
    if (!raw) return null
    const v = raw.values ? { ...raw.values, id: raw.values.id ?? raw.id } : raw
    const title = str(v.title || v.name)
    if (!title) return null
    const image = v.image && typeof v.image === "object" ? v.image.src || v.image.url || "" : str(v.image)
    return {
        id: str(v.id) || slug(title) || `item-${i}`,
        title,
        description: str(v.description),
        type: str(v.type) || "Resource",
        topic: str(v.topic) || "General",
        audience: str(v.audience),
        format: str(v.format) || "Web",
        date: typeof v.date === "number" ? new Date(v.date).toISOString() : str(v.date),
        size: str(v.size),
        href: str(v.file) || str(v.href || v.url) || "#",
        image,
        featured: bool(v.featured),
        gated: bool(v.gated),
        metric: str(v.metric),
        metricLabel: str(v.metricLabel || v.metric_label),
        formId: str(v.formId || v.form_id),
    }
}

function feedRows(json: any): any[] {
    if (Array.isArray(json)) return json
    return json?.results || json?.items || json?.resources || []
}

function useFeed(url: string, enabled: boolean) {
    const [state, setState] = React.useState<{ rows: any[]; status: "idle" | "loading" | "ready" | "error" }>({
        rows: [],
        status: "idle",
    })
    React.useEffect(() => {
        if (!enabled || !url) {
            setState({ rows: [], status: "idle" })
            return
        }
        const ctrl = new AbortController()
        setState((s) => ({ ...s, status: "loading" }))
        fetch(url, { signal: ctrl.signal })
            .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
            .then((json) => setState({ rows: feedRows(json), status: "ready" }))
            .catch(() => {
                if (!ctrl.signal.aborted) setState({ rows: [], status: "error" })
            })
        return () => ctrl.abort()
    }, [url, enabled])
    return state
}

// ---------------------------------------------------------------------------
// Unlock state, cookies, analytics
// ---------------------------------------------------------------------------

function readUnlocked(): { all: boolean; ids: string[] } {
    try {
        const v = JSON.parse(window.localStorage.getItem(UNLOCK_KEY) || "null")
        if (v && typeof v === "object") return { all: !!v.all, ids: Array.isArray(v.ids) ? v.ids : [] }
    } catch {}
    return { all: false, ids: [] }
}

function writeUnlocked(v: { all: boolean; ids: string[] }) {
    try {
        window.localStorage.setItem(UNLOCK_KEY, JSON.stringify(v))
    } catch {}
}

function cookie(name: string): string {
    if (typeof document === "undefined") return ""
    const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
    return m ? decodeURIComponent(m[1]) : ""
}

function track(event: string, r: Resource) {
    if (typeof window === "undefined") return
    const w = window as any
    w.dataLayer = w.dataLayer || []
    w.dataLayer.push({ event, resource_id: r.id, resource_title: r.title, resource_type: r.type })
}

let hsScript: Promise<void> | null = null

function loadHubSpot(): Promise<void> {
    if ((window as any).hbspt?.forms) return Promise.resolve()
    if (!hsScript) {
        hsScript = new Promise((resolve, reject) => {
            const s = document.createElement("script")
            s.src = "https://js.hsforms.net/forms/embed/v2.js"
            s.async = true
            s.onload = () => resolve()
            s.onerror = () => {
                hsScript = null
                reject(new Error("HubSpot script failed to load"))
            }
            document.head.appendChild(s)
        })
    }
    return hsScript
}

// ---------------------------------------------------------------------------
// Generated cover art
// ---------------------------------------------------------------------------

function hash(s: string): number {
    let h = 2166136261
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i)
        h = Math.imul(h, 16777619)
    }
    return h >>> 0
}

function rng(seed: number) {
    let a = seed
    return () => {
        a = (a + 0x6d2b79f5) | 0
        let t = Math.imul(a ^ (a >>> 15), 1 | a)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

type ArtKind = "bars" | "blocks" | "wave" | "frames" | "flow" | "slides"

function artFor(r: Resource): ArtKind {
    const t = r.type.toLowerCase()
    if (t.includes("bench")) return "bars"
    if (t.includes("webinar") || t.includes("video") || r.format.toLowerCase() === "video") return "frames"
    if (t.includes("present") || r.format.toLowerCase() === "slides") return "slides"
    if (t.includes("guide") || t.includes("blueprint") || t.includes("integration")) return "flow"
    if (t.includes("paper") || t.includes("report")) return "wave"
    return "blocks"
}

const W = 400
const H = 225

function Blocks({ rand, c }: { rand: () => number; c: string }) {
    const cells: React.ReactNode[] = []
    const split = (x: number, y: number, s: number, depth: number) => {
        if (depth < 2 && rand() < 0.42 - depth * 0.1) {
            const h = s / 2
            split(x, y, h, depth + 1)
            split(x + h, y, h, depth + 1)
            split(x, y + h, h, depth + 1)
            split(x + h, y + h, h, depth + 1)
            return
        }
        const o = rand()
        cells.push(
            <rect
                key={`${x}-${y}-${s}`}
                x={x + 0.5}
                y={y + 0.5}
                width={s - 1}
                height={s - 1}
                fill={c}
                fillOpacity={depth === 0 ? o * 0.12 : 0.1 + o * 0.35}
                stroke={c}
                strokeOpacity={depth === 2 ? 0.7 : 0.18}
            />
        )
    }
    for (let y = 0; y < H; y += 50) for (let x = 0; x < W; x += 50) split(x, y, 50, 0)
    return <g>{cells}</g>
}

function Bars({ rand, c }: { rand: () => number; c: string }) {
    const groups = 6
    const gw = (W - 80) / groups
    return (
        <g>
            {[0, 1, 2, 3].map((i) => (
                <line key={i} x1={40} x2={W - 30} y1={50 + i * 40} y2={50 + i * 40} stroke="#fff" strokeOpacity={0.07} />
            ))}
            {Array.from({ length: groups }).map((_, i) => {
                const base = 70 + rand() * 80
                const opt = base * (0.45 + rand() * 0.25)
                const x = 48 + i * gw
                return (
                    <g key={i}>
                        <rect x={x} y={170 - base} width={gw * 0.32} height={base} fill="#fff" fillOpacity={0.14} />
                        <rect x={x + gw * 0.36} y={170 - opt} width={gw * 0.32} height={opt} fill={c} />
                    </g>
                )
            })}
            <line x1={40} x2={W - 30} y1={170.5} y2={170.5} stroke="#fff" strokeOpacity={0.35} />
        </g>
    )
}

function Wave({ rand, c, id }: { rand: () => number; c: string; id: string }) {
    const pts: [number, number][] = []
    let y = 110
    for (let i = 0; i <= 50; i++) {
        y = Math.max(40, Math.min(170, y + (rand() - 0.5) * 34))
        pts.push([30 + (i * (W - 60)) / 50, y])
    }
    const line = pts.map(([x, yy]) => `${x},${yy}`).join(" ")
    const opt = pts.map(([x, yy]) => `${x},${170 - (170 - yy) * 0.55}`).join(" ")
    return (
        <g>
            <defs>
                <linearGradient id={`g-${id}`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor={c} stopOpacity={0.45} />
                    <stop offset="1" stopColor={c} stopOpacity={0} />
                </linearGradient>
            </defs>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <line key={i} x1={30 + i * 48} x2={30 + i * 48} y1={30} y2={175} stroke="#fff" strokeOpacity={0.06} />
            ))}
            <polyline points={line} fill="none" stroke="#fff" strokeOpacity={0.35} strokeWidth={1.5} strokeDasharray="3 4" />
            <polygon points={`30,175 ${opt} ${W - 30},175`} fill={`url(#g-${id})`} />
            <polyline points={opt} fill="none" stroke={c} strokeWidth={2} />
        </g>
    )
}

function Frames({ rand, c }: { rand: () => number; c: string }) {
    const fw = 92
    return (
        <g>
            <rect x={0} y={42} width={W} height={142} fill="#000" fillOpacity={0.35} />
            {Array.from({ length: 22 }).map((_, i) => (
                <g key={i}>
                    <rect x={6 + i * 18} y={48} width={9} height={7} rx={1.5} fill="#fff" fillOpacity={0.18} />
                    <rect x={6 + i * 18} y={171} width={9} height={7} rx={1.5} fill="#fff" fillOpacity={0.18} />
                </g>
            ))}
            {[0, 1, 2, 3].map((i) => {
                const x = 10 + i * (fw + 6)
                return (
                    <g key={i}>
                        <rect x={x} y={62} width={fw} height={102} fill={c} fillOpacity={0.12 + rand() * 0.25} />
                        <rect x={x + 10} y={130 - rand() * 40} width={fw * 0.45} height={24} fill={c} fillOpacity={0.5} />
                        <line x1={x} x2={x + fw} y1={140} y2={110 + rand() * 30} stroke="#fff" strokeOpacity={0.15} />
                    </g>
                )
            })}
            <circle cx={W / 2} cy={113} r={24} fill="#fff" />
            <path d={`M ${W / 2 - 7} ${101} L ${W / 2 + 11} ${113} L ${W / 2 - 7} ${125} Z`} fill={c} />
        </g>
    )
}

function Flow({ c }: { c: string }) {
    const labels = ["SOURCE", "BEAMR", "STORE", "CONSUME"]
    const bw = 74
    const gap = (W - 40 - bw * 4) / 3
    return (
        <g fontFamily="var(--bdh-mono)" fontSize={9} letterSpacing={1}>
            {labels.map((l, i) => {
                const x = 20 + i * (bw + gap)
                const hot = i === 1
                return (
                    <g key={l}>
                        {i < 3 && (
                            <g>
                                <line x1={x + bw} x2={x + bw + gap - 6} y1={112} y2={112} stroke={c} strokeWidth={1.5} />
                                <path d={`M ${x + bw + gap - 7} 108 L ${x + bw + gap - 1} 112 L ${x + bw + gap - 7} 116 Z`} fill={c} />
                            </g>
                        )}
                        <rect
                            x={x}
                            y={88}
                            width={bw}
                            height={48}
                            rx={4}
                            fill={hot ? c : "#fff"}
                            fillOpacity={hot ? 1 : 0.06}
                            stroke={hot ? c : "#fff"}
                            strokeOpacity={hot ? 1 : 0.25}
                        />
                        <text x={x + bw / 2} y={116} textAnchor="middle" fill="#fff" fillOpacity={hot ? 1 : 0.75}>
                            {l}
                        </text>
                    </g>
                )
            })}
            <path d={`M 57 136 V 168 H ${W - 57} V 136`} fill="none" stroke="#fff" strokeOpacity={0.15} strokeDasharray="3 4" />
        </g>
    )
}

function Slides({ c }: { c: string }) {
    return (
        <g>
            {[2, 1, 0].map((i) => (
                <g key={i} transform={`translate(${90 + i * 18} ${40 + i * 14})`}>
                    <rect width={190} height={110} rx={4} fill={i === 0 ? "#151826" : "#fff"} fillOpacity={i === 0 ? 1 : 0.06} stroke="#fff" strokeOpacity={0.2} />
                    {i === 0 && (
                        <g>
                            <rect x={14} y={16} width={90} height={8} fill="#fff" fillOpacity={0.8} />
                            <rect x={14} y={30} width={60} height={5} fill="#fff" fillOpacity={0.3} />
                            {[0, 1, 2, 3, 4].map((b) => (
                                <rect key={b} x={20 + b * 30} y={96 - (b + 2) * 8} width={18} height={(b + 2) * 8} fill={c} fillOpacity={0.4 + b * 0.12} />
                            ))}
                        </g>
                    )}
                </g>
            ))}
        </g>
    )
}

function Cover({ r, color, compact }: { r: Resource; color: string; compact?: boolean }) {
    if (r.image) {
        return <img className="bdh-cover-img" src={r.image} alt="" loading="lazy" />
    }
    const kind = artFor(r)
    const rand = rng(hash(r.id))
    const uid = `${r.id}-${compact ? "s" : "l"}`
    return (
        <svg className="bdh-cover-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <defs>
                <radialGradient id={`bg-${uid}`} cx="0.85" cy="0" r="1.1">
                    <stop offset="0" stopColor={color} stopOpacity={0.55} />
                    <stop offset="0.6" stopColor={color} stopOpacity={0.08} />
                    <stop offset="1" stopColor={color} stopOpacity={0} />
                </radialGradient>
            </defs>
            <rect width={W} height={H} fill="#0D0F17" />
            <rect width={W} height={H} fill={`url(#bg-${uid})`} />
            {kind === "blocks" && <Blocks rand={rand} c={color} />}
            {kind === "bars" && <Bars rand={rand} c={color} />}
            {kind === "wave" && <Wave rand={rand} c={color} id={uid} />}
            {kind === "frames" && <Frames rand={rand} c={color} />}
            {kind === "flow" && <Flow c={color} />}
            {kind === "slides" && <Slides c={color} />}
            {!compact && (
                <text x={16} y={H - 14} fill="#fff" fillOpacity={0.55} fontSize={10} fontFamily="var(--bdh-mono)" letterSpacing={1.2}>
                    {`FIG.${String((hash(r.id) % 90) + 10)} · ${r.format.toUpperCase()}`}
                </text>
            )}
        </svg>
    )
}

// Hero visual: a frame overlaid with a content-adaptive block map.
function HeroFrame({ accent }: { accent: string }) {
    const rand = rng(7)
    const cells: React.ReactNode[] = []
    const detail = (x: number, y: number) => {
        const dx = (x - 300) / 260
        const dy = (y - 190) / 150
        return Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy))
    }
    const split = (x: number, y: number, s: number) => {
        if (s > 15 && rand() < detail(x + s / 2, y + s / 2) * 1.6) {
            const h = s / 2
            split(x, y, h)
            split(x + h, y, h)
            split(x, y + h, h)
            split(x + h, y + h, h)
            return
        }
        cells.push(
            <rect
                key={`${x}-${y}-${s}`}
                x={x}
                y={y}
                width={s}
                height={s}
                fill={accent}
                fillOpacity={s <= 15 ? 0.32 : s <= 30 ? 0.16 : 0.04}
                stroke="#fff"
                strokeOpacity={0.12}
                strokeWidth={0.75}
            />
        )
    }
    for (let y = 0; y < 300; y += 60) for (let x = 0; x < 540; x += 60) split(x, y, 60)
    return (
        <svg className="bdh-hero-svg" viewBox="0 0 540 340" aria-hidden="true">
            <defs>
                <linearGradient id="bdh-sky" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#1A1F35" />
                    <stop offset="1" stopColor="#0B0D14" />
                </linearGradient>
                <clipPath id="bdh-clip">
                    <rect width={540} height={300} rx={6} />
                </clipPath>
            </defs>
            <g clipPath="url(#bdh-clip)">
                <rect width={540} height={300} fill="url(#bdh-sky)" />
                <path d="M0 300 L250 165 L290 165 L540 300 Z" fill="#fff" fillOpacity={0.05} />
                <path d="M268 300 L270 168" stroke="#fff" strokeOpacity={0.25} strokeDasharray="10 12" />
                <rect x={232} y={160} width={78} height={52} fill="none" stroke={accent} strokeWidth={1.5} />
                <rect x={350} y={178} width={56} height={40} fill="none" stroke="#fff" strokeOpacity={0.6} strokeWidth={1} />
                {cells}
            </g>
            <rect width={540} height={300} rx={6} fill="none" stroke="#fff" strokeOpacity={0.15} />
            <g fontFamily="var(--bdh-mono)" fontSize={10} fill="#fff" letterSpacing={1}>
                <text x={232} y={153} fill={accent}>
                    VEHICLE 0.94
                </text>
                <text x={0} y={322} fillOpacity={0.5}>
                    FRAME 018427 · 1920×1080
                </text>
                <text x={540} y={322} fillOpacity={0.5} textAnchor="end">
                    PER-BLOCK BIT ALLOCATION
                </text>
            </g>
        </svg>
    )
}

// ---------------------------------------------------------------------------
// Registration gate
// ---------------------------------------------------------------------------

interface GateConfig {
    portalId: string
    formId: string
    region: string
    formMode: "native" | "embed"
    formFields: FormField[]
    resourceField: string
    gateTitle: string
    gateText: string
    privacyText: string
    privacyUrl: string
    unlockScope: "all" | "item"
}

function NativeForm({ cfg, r, formId, onDone }: { cfg: GateConfig; r: Resource; formId: string; onDone: () => void }) {
    const [values, setValues] = React.useState<Record<string, string>>({})
    const [status, setStatus] = React.useState<"idle" | "sending" | "error">("idle")
    const [error, setError] = React.useState("")
    const firstRef = React.useRef<HTMLInputElement>(null)

    React.useEffect(() => {
        firstRef.current?.focus()
    }, [])

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!cfg.portalId || !formId) {
            setStatus("error")
            setError("Form is not configured yet. Set the HubSpot portal and form IDs in Framer.")
            return
        }
        setStatus("sending")
        const fields = cfg.formFields
            .filter((f) => values[f.name])
            .map((f) => ({ objectTypeId: "0-1", name: f.name, value: values[f.name] }))
        if (cfg.resourceField) fields.push({ objectTypeId: "0-1", name: cfg.resourceField, value: r.title })
        const context: Record<string, string> = { pageUri: window.location.href, pageName: document.title }
        const hutk = cookie("hubspotutk")
        if (hutk) context.hutk = hutk
        try {
            const res = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${cfg.portalId}/${formId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fields, context }),
            })
            if (!res.ok) {
                const body = await res.json().catch(() => null)
                const msg = body?.errors?.[0]?.message || body?.message
                throw new Error(msg || `Submission failed (${res.status})`)
            }
            onDone()
        } catch (err: any) {
            setStatus("error")
            setError(err?.message || "Something went wrong. Please try again.")
        }
    }

    return (
        <form className="bdh-form" onSubmit={submit} noValidate={false}>
            <div className="bdh-form-grid">
                {cfg.formFields.map((f, i) => (
                    <label key={f.name} className={f.half ? "bdh-field bdh-half" : "bdh-field"}>
                        <span>
                            {f.label}
                            {f.required && <em>*</em>}
                        </span>
                        <input
                            ref={i === 0 ? firstRef : undefined}
                            type={f.type}
                            name={f.name}
                            required={f.required}
                            autoComplete={f.type === "email" ? "email" : f.name === "firstname" ? "given-name" : f.name === "lastname" ? "family-name" : f.name === "company" ? "organization" : "on"}
                            value={values[f.name] || ""}
                            onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                        />
                    </label>
                ))}
            </div>
            {status === "error" && <div className="bdh-error">{error}</div>}
            <button className="bdh-btn bdh-btn-primary bdh-btn-block" type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Get access"}
            </button>
        </form>
    )
}

function EmbedForm({ cfg, r, formId, onDone }: { cfg: GateConfig; r: Resource; formId: string; onDone: () => void }) {
    const target = React.useMemo(() => `bdh-hs-${Math.random().toString(36).slice(2, 9)}`, [])
    const [failed, setFailed] = React.useState(false)
    const doneRef = React.useRef(onDone)
    doneRef.current = onDone

    React.useEffect(() => {
        let cancelled = false
        if (!cfg.portalId || !formId) {
            setFailed(true)
            return
        }
        loadHubSpot()
            .then(() => {
                if (cancelled) return
                ;(window as any).hbspt.forms.create({
                    region: cfg.region || "na1",
                    portalId: cfg.portalId,
                    formId,
                    target: `#${target}`,
                    onFormReady: (form: any) => {
                        if (!cfg.resourceField) return
                        const el: HTMLFormElement = form?.[0] || form
                        const input = el?.querySelector?.(`input[name="${cfg.resourceField}"]`) as HTMLInputElement | null
                        if (input) {
                            input.value = r.title
                            input.dispatchEvent(new Event("input", { bubbles: true }))
                        }
                    },
                    onFormSubmitted: () => doneRef.current(),
                })
            })
            .catch(() => !cancelled && setFailed(true))
        // Fallback: HubSpot also posts a global message on submission.
        const onMsg = (e: MessageEvent) => {
            const d: any = e.data
            if (d?.type === "hsFormCallback" && d?.eventName === "onFormSubmitted" && (!d.id || d.id === formId)) doneRef.current()
        }
        window.addEventListener("message", onMsg)
        return () => {
            cancelled = true
            window.removeEventListener("message", onMsg)
        }
    }, [cfg.portalId, formId, cfg.region, target])

    if (failed) {
        return <div className="bdh-error">The registration form could not load. Check the HubSpot portal and form IDs.</div>
    }
    return <div id={target} className="bdh-hs-embed" />
}

function GateModal({
    r,
    color,
    cfg,
    onClose,
    onUnlocked,
}: {
    r: Resource
    color: string
    cfg: GateConfig
    onClose: () => void
    onUnlocked: (r: Resource) => void
}) {
    const [done, setDone] = React.useState(false)
    const formId = r.formId || cfg.formId

    React.useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
        window.addEventListener("keydown", onKey)
        const prev = document.body.style.overflow
        document.body.style.overflow = "hidden"
        return () => {
            window.removeEventListener("keydown", onKey)
            document.body.style.overflow = prev
        }
    }, [onClose])

    const handleDone = () => {
        setDone(true)
        onUnlocked(r)
    }

    return (
        <div className="bdh-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
            <div className="bdh-modal" role="dialog" aria-modal="true" aria-labelledby="bdh-gate-title">
                <button className="bdh-close" onClick={onClose} aria-label="Close">
                    ×
                </button>
                <aside className="bdh-modal-side">
                    <div className="bdh-modal-cover">
                        <Cover r={r} color={color} />
                    </div>
                    <div className="bdh-mono bdh-modal-type" style={{ color }}>
                        {r.type.toUpperCase()} · {r.format.toUpperCase()}
                    </div>
                    <div className="bdh-modal-rtitle">{r.title}</div>
                    <p className="bdh-modal-rdesc">{r.description}</p>
                </aside>
                <div className="bdh-modal-main">
                    {done ? (
                        <div className="bdh-success">
                            <div className="bdh-success-mark" style={{ background: color }}>
                                ✓
                            </div>
                            <h3>You're in.</h3>
                            <p>
                                {cfg.unlockScope === "all"
                                    ? "This and every other registration resource in the hub are now unlocked on this browser."
                                    : "This resource is now unlocked on this browser."}
                            </p>
                            <a
                                className="bdh-btn bdh-btn-primary bdh-btn-block"
                                href={r.href}
                                target="_blank"
                                rel="noopener"
                                onClick={() => {
                                    track("devhub_resource_open", r)
                                    onClose()
                                }}
                            >
                                Open {r.format.toLowerCase() === "web" ? "resource" : r.format} →
                            </a>
                        </div>
                    ) : (
                        <>
                            <div className="bdh-mono bdh-kicker-sm">REGISTRATION</div>
                            <h3 id="bdh-gate-title">{cfg.gateTitle}</h3>
                            <p className="bdh-gate-text">{cfg.gateText}</p>
                            {cfg.formMode === "embed" ? (
                                <EmbedForm cfg={cfg} r={r} formId={formId} onDone={handleDone} />
                            ) : (
                                <NativeForm cfg={cfg} r={r} formId={formId} onDone={handleDone} />
                            )}
                            {cfg.privacyText && (
                                <p className="bdh-privacy">
                                    {cfg.privacyText}{" "}
                                    {cfg.privacyUrl && (
                                        <a href={cfg.privacyUrl} target="_blank" rel="noopener">
                                            Privacy policy
                                        </a>
                                    )}
                                </p>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

type SortKey = "newest" | "oldest" | "az"

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1280
 * @framerIntrinsicHeight 2400
 */
export default function DeveloperHub(props: Props) {
    const {
        kicker = "BEAMR / DEVELOPER HUB",
        heading = "The technical side of Beamr.",
        intro = "Benchmarks, reference architectures, integration guides and talks from Beamr's engineering and AI teams, for data engineers, ML teams and analysts working with video at scale.",
        searchPlaceholder = "Search benchmarks, guides, papers, talks…",
        facts = DEFAULT_FACTS,
        items = DEFAULT_ITEMS,
        source = "panel",
        feedUrl = "",
        portalId = "144465530",
        formId = "",
        region = "na1",
        formMode = "native",
        formFields = DEFAULT_FIELDS,
        resourceField = "",
        unlockScope = "all",
        gateTitle = "Register to access",
        gateText = "Tell us who you are and we'll unlock the full document. One registration covers every gated resource in the hub.",
        privacyText = "We use this to share relevant technical material. Unsubscribe any time.",
        privacyUrl = "",
        showFeatured = true,
        showQuickLinks = true,
        quickLinksTitle = "Public information",
        quickLinks = DEFAULT_LINKS,
        showCta = true,
        ctaTitle = "Run Beamr on your own video.",
        ctaText = "Bring a real workload. We'll measure storage reduction, throughput and model behavior on the content your pipeline actually sees.",
        ctaLabel = "Start an evaluation",
        ctaHref = "#",
        accent = "#6C5CE7",
        ink = "#12141C",
        dark = "#0B0D14",
        background = "#F6F6F3",
        topicColors = [],
        fontFamily = "Inter",
        monoFamily = "JetBrains Mono",
        loadFonts = true,
        maxWidth = 1280,
        style,
    } = props

    // ---- data
    const feed = useFeed(feedUrl, source !== "panel")
    const resources = React.useMemo(() => {
        const rows = source === "feed" ? feed.rows : source === "both" ? [...items, ...feed.rows] : items
        const seen = new Set<string>()
        const out: Resource[] = []
        rows.forEach((raw, i) => {
            const r = normalize(raw, i)
            if (!r || seen.has(r.id)) return
            seen.add(r.id)
            out.push(r)
        })
        return out
    }, [items, feed.rows, source])

    const colorOf = React.useMemo(() => {
        const map = new Map<string, string>()
        topicColors.forEach((t) => t.topic && map.set(t.topic.toLowerCase(), t.color))
        let n = 0
        resources.forEach((r) => {
            const k = r.topic.toLowerCase()
            if (!map.has(k)) map.set(k, PALETTE[n++ % PALETTE.length])
        })
        return (r: Resource) => map.get(r.topic.toLowerCase()) || accent
    }, [resources, topicColors, accent])

    const count = (key: keyof Resource) => {
        const m = new Map<string, number>()
        resources.forEach((r) => {
            const v = r[key] as string
            if (v) m.set(v, (m.get(v) || 0) + 1)
        })
        return Array.from(m.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    }
    const topics = count("topic")
    const types = count("type")
    const audiences = count("audience")
    const latest = resources.reduce((m, r) => Math.max(m, parseDate(r.date)), 0)

    // ---- filters
    const [query, setQuery] = React.useState("")
    const [topic, setTopic] = React.useState(ALL)
    const [type, setType] = React.useState(ALL)
    const [audience, setAudience] = React.useState(ALL)
    const [access, setAccess] = React.useState<"all" | "open" | "gated">("all")
    const [sort, setSort] = React.useState<SortKey>("newest")
    const [view, setView] = React.useState<"grid" | "list">("grid")
    const searchRef = React.useRef<HTMLInputElement>(null)

    const filtered = React.useMemo(() => {
        const q = query.trim().toLowerCase()
        const list = resources.filter((r) => {
            if (q && ![r.title, r.description, r.topic, r.type, r.audience, r.format].join(" ").toLowerCase().includes(q)) return false
            if (topic !== ALL && r.topic !== topic) return false
            if (type !== ALL && r.type !== type) return false
            if (audience !== ALL && r.audience !== audience) return false
            if (access === "open" && r.gated) return false
            if (access === "gated" && !r.gated) return false
            return true
        })
        return list.sort((a, b) =>
            sort === "az" ? a.title.localeCompare(b.title) : sort === "oldest" ? parseDate(a.date) - parseDate(b.date) : parseDate(b.date) - parseDate(a.date)
        )
    }, [resources, query, topic, type, audience, access, sort])

    const featured = resources.filter((r) => r.featured).slice(0, 3)
    const filtersActive = !!query || topic !== ALL || type !== ALL || audience !== ALL || access !== "all"
    const reset = () => {
        setQuery("")
        setTopic(ALL)
        setType(ALL)
        setAudience(ALL)
        setAccess("all")
    }

    // "/" focuses search, like most developer docs.
    React.useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const t = e.target as HTMLElement
            if (e.key !== "/" || t?.closest?.("input, textarea, select, [contenteditable]")) return
            e.preventDefault()
            searchRef.current?.focus()
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [])

    // ---- fonts
    React.useEffect(() => {
        if (!loadFonts || typeof document === "undefined") return
        const id = "bdh-fonts"
        if (document.getElementById(id)) return
        const fams = [fontFamily, monoFamily]
            .filter(Boolean)
            .map((f) => `family=${f.trim().replace(/ /g, "+")}:wght@400;500;600;700`)
            .join("&")
        const link = document.createElement("link")
        link.id = id
        link.rel = "stylesheet"
        link.href = `https://fonts.googleapis.com/css2?${fams}&display=swap`
        document.head.appendChild(link)
    }, [loadFonts, fontFamily, monoFamily])

    // ---- gate
    const [unlocked, setUnlocked] = React.useState<{ all: boolean; ids: string[] }>({ all: false, ids: [] })
    const [gateFor, setGateFor] = React.useState<Resource | null>(null)
    const [mounted, setMounted] = React.useState(false)
    React.useEffect(() => {
        setUnlocked(readUnlocked())
        setMounted(true)
    }, [])

    const isLocked = (r: Resource) => r.gated && !unlocked.all && !unlocked.ids.includes(r.id)
    const open = (e: React.MouseEvent, r: Resource) => {
        if (isLocked(r)) {
            e.preventDefault()
            track("devhub_gate_view", r)
            setGateFor(r)
            return
        }
        track("devhub_resource_open", r)
    }
    const onUnlocked = (r: Resource) => {
        const next = unlockScope === "all" ? { all: true, ids: unlocked.ids } : { all: unlocked.all, ids: [...unlocked.ids, r.id] }
        setUnlocked(next)
        writeUnlocked(next)
        track("devhub_gate_submit", r)
    }
    const closeGate = React.useCallback(() => setGateFor(null), [])

    const cfg: GateConfig = {
        portalId: portalId.trim(),
        formId: formId.trim(),
        region,
        formMode,
        formFields,
        resourceField: resourceField.trim(),
        gateTitle,
        gateText,
        privacyText,
        privacyUrl,
        unlockScope,
    }

    const vars = {
        "--bdh-accent": accent,
        "--bdh-ink": ink,
        "--bdh-dark": dark,
        "--bdh-bg": background,
        "--bdh-font": `"${fontFamily}", Inter, system-ui, sans-serif`,
        "--bdh-mono": `"${monoFamily}", ui-monospace, SFMono-Regular, Menlo, monospace`,
        "--bdh-max": `${maxWidth}px`,
    } as React.CSSProperties

    const action = (r: Resource) => {
        if (isLocked(r)) return "Register"
        const f = r.format.toLowerCase()
        if (f === "video") return "Watch"
        if (f === "web") return "Read"
        return "Download"
    }
    const actionIcon = (r: Resource) => {
        if (isLocked(r)) return <LockIcon />
        const f = r.format.toLowerCase()
        if (f === "video") return "▶"
        if (f === "web") return "↗"
        return "↓"
    }
    const target = (r: Resource) => (r.href.startsWith("http") ? "_blank" : undefined)

    const filterGroup = (title: string, value: string, onChange: (v: string) => void, entries: [string, number][], dots?: boolean) =>
        entries.length ? (
            <div className="bdh-fgroup">
                <div className="bdh-mono bdh-fgroup-title">{title}</div>
                <button className={`bdh-fopt ${value === ALL ? "is-on" : ""}`} onClick={() => onChange(ALL)}>
                    <span>All</span>
                    <span className="bdh-mono bdh-count">{resources.length}</span>
                </button>
                {entries.map(([name, n]) => (
                    <button key={name} className={`bdh-fopt ${value === name ? "is-on" : ""}`} onClick={() => onChange(value === name ? ALL : name)}>
                        <span>
                            {dots && <i className="bdh-dot" style={{ background: colorOf({ topic: name } as Resource) }} />}
                            {name}
                        </span>
                        <span className="bdh-mono bdh-count">{n}</span>
                    </button>
                ))}
            </div>
        ) : null

    return (
        <div className="bdh" style={{ ...vars, ...style }}>
            <style>{CSS}</style>

            {/* Header */}
            <header className="bdh-hero">
                <div className="bdh-hero-grid-bg" />
                <div className="bdh-wrap bdh-hero-inner">
                    <div className="bdh-hero-copy">
                        <div className="bdh-mono bdh-kicker">
                            <i className="bdh-pulse" />
                            {kicker}
                        </div>
                        <h1 className="bdh-h1">{heading}</h1>
                        <p className="bdh-intro">{intro}</p>
                        <label className="bdh-search">
                            <SearchIcon />
                            <input
                                ref={searchRef}
                                aria-label="Search resources"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder={searchPlaceholder}
                            />
                            <kbd className="bdh-mono">/</kbd>
                        </label>
                        <div className="bdh-mono bdh-hero-meta">
                            <span>{resources.length} RESOURCES</span>
                            <span>{topics.length} TOPICS</span>
                            {latest > 0 && <span>UPDATED {formatDate(new Date(latest).toISOString())}</span>}
                            {source !== "panel" && feed.status === "loading" && <span>SYNCING…</span>}
                        </div>
                    </div>
                    <div className="bdh-hero-visual">
                        <HeroFrame accent={accent} />
                    </div>
                </div>
                {facts.length > 0 && (
                    <div className="bdh-wrap">
                        <dl className="bdh-facts">
                            {facts.map((f, i) => (
                                <div key={i} className="bdh-fact">
                                    <dt className="bdh-mono">{f.label}</dt>
                                    <dd>{f.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                )}
            </header>

            {/* Featured */}
            {showFeatured && featured.length > 0 && !filtersActive && (
                <section className="bdh-section">
                    <div className="bdh-wrap">
                        <SectionHead n="01" title="Featured" note="Start here for current AV and AI video work." />
                        <div className="bdh-featured">
                            {featured.map((r, i) => {
                                const c = colorOf(r)
                                return (
                                    <a key={r.id} id={`resource-${r.id}`} className={`bdh-feat ${i === 0 ? "is-lead" : ""}`} href={r.href} target={target(r)} rel="noopener" onClick={(e) => open(e, r)}>
                                        <div className="bdh-feat-cover">
                                            <Cover r={r} color={c} />
                                        </div>
                                        <div className="bdh-feat-body">
                                            <div className="bdh-mono bdh-feat-type" style={{ color: c }}>
                                                {r.type.toUpperCase()}
                                                {isLocked(r) && (
                                                    <span className="bdh-lock-tag">
                                                        <LockIcon /> REGISTRATION
                                                    </span>
                                                )}
                                            </div>
                                            <div className="bdh-feat-title">{r.title}</div>
                                            <p className="bdh-feat-desc">{r.description}</p>
                                            <div className="bdh-feat-foot">
                                                {r.metric ? (
                                                    <div>
                                                        <div className="bdh-metric">{r.metric}</div>
                                                        <div className="bdh-mono bdh-metric-label">{r.metricLabel}</div>
                                                    </div>
                                                ) : (
                                                    <span />
                                                )}
                                                <span className="bdh-go">
                                                    {action(r)} {actionIcon(r)}
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                )
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Library */}
            <section className="bdh-section">
                <div className="bdh-wrap">
                    <SectionHead n={showFeatured && featured.length > 0 && !filtersActive ? "02" : "01"} title="Library" note="Everything we publish for technical evaluation." />
                    <div className="bdh-lib">
                        <aside className="bdh-side">
                            {filterGroup("TOPIC", topic, setTopic, topics, true)}
                            {filterGroup("TYPE", type, setType, types)}
                            {filterGroup("AUDIENCE", audience, setAudience, audiences)}
                            <div className="bdh-fgroup">
                                <div className="bdh-mono bdh-fgroup-title">ACCESS</div>
                                <div className="bdh-seg">
                                    {(["all", "open", "gated"] as const).map((a) => (
                                        <button key={a} className={access === a ? "is-on" : ""} onClick={() => setAccess(a)}>
                                            {a === "all" ? "All" : a === "open" ? "Open" : "Registration"}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        <div className="bdh-results">
                            <div className="bdh-toolbar">
                                <div className="bdh-mono bdh-result-count">
                                    {filtered.length} / {resources.length}
                                    {filtersActive && (
                                        <button className="bdh-reset" onClick={reset}>
                                            Clear filters
                                        </button>
                                    )}
                                </div>
                                <div className="bdh-tools">
                                    <select className="bdh-select" value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label="Sort">
                                        <option value="newest">Newest</option>
                                        <option value="oldest">Oldest</option>
                                        <option value="az">A–Z</option>
                                    </select>
                                    <div className="bdh-seg bdh-view">
                                        <button className={view === "grid" ? "is-on" : ""} onClick={() => setView("grid")} aria-label="Grid view">
                                            <GridIcon />
                                        </button>
                                        <button className={view === "list" ? "is-on" : ""} onClick={() => setView("list")} aria-label="List view">
                                            <ListIcon />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {source !== "panel" && feed.status === "error" && resources.length === 0 && (
                                <div className="bdh-empty">Couldn't load the resource feed. Check the feed URL in Framer.</div>
                            )}

                            <div className={view === "grid" ? "bdh-grid" : "bdh-list"}>
                                {filtered.map((r) => {
                                    const c = colorOf(r)
                                    return (
                                        <a key={r.id} id={`resource-${r.id}`} className="bdh-card" href={r.href} target={target(r)} rel="noopener" onClick={(e) => open(e, r)}>
                                            <div className="bdh-card-cover">
                                                <Cover r={r} color={c} compact={view === "list"} />
                                            </div>
                                            <div className="bdh-card-body">
                                                <div className="bdh-mono bdh-card-type">
                                                    <i className="bdh-dot" style={{ background: c }} />
                                                    {r.type.toUpperCase()}
                                                    {isLocked(r) && (
                                                        <span className="bdh-lock-tag">
                                                            <LockIcon />
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="bdh-card-title">{r.title}</div>
                                                <p className="bdh-card-desc">{r.description}</p>
                                                <div className="bdh-mono bdh-card-meta">
                                                    <span>
                                                        {[r.date && formatDate(r.date), r.size, r.topic].filter(Boolean).join(" · ")}
                                                    </span>
                                                    <span className="bdh-go">
                                                        {action(r)} {actionIcon(r)}
                                                    </span>
                                                </div>
                                            </div>
                                        </a>
                                    )
                                })}
                            </div>

                            {filtered.length === 0 && resources.length > 0 && (
                                <div className="bdh-empty">
                                    No resources match these filters.{" "}
                                    <button className="bdh-reset" onClick={reset}>
                                        Clear filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Public information */}
            {showQuickLinks && quickLinks.length > 0 && (
                <section className="bdh-section">
                    <div className="bdh-wrap">
                        <SectionHead n={showFeatured && featured.length > 0 && !filtersActive ? "03" : "02"} title={quickLinksTitle} note="Company information for analysts, press and partners." />
                        <div className="bdh-links">
                            {quickLinks.map((l, i) => (
                                <a key={i} className="bdh-link" href={l.href || "#"} target={l.href?.startsWith("http") ? "_blank" : undefined} rel="noopener">
                                    <div className="bdh-link-label">
                                        {l.label}
                                        <span>→</span>
                                    </div>
                                    <div className="bdh-link-desc">{l.description}</div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Evaluation CTA */}
            {showCta && (
                <section className="bdh-section bdh-section-last">
                    <div className="bdh-wrap">
                        <div className="bdh-cta">
                            <div className="bdh-cta-term bdh-mono" aria-hidden="true">
                                <div>
                                    <span className="bdh-dim">$</span> beamr eval --input ./my_dataset
                                </div>
                                <div className="bdh-dim">→ measuring storage, throughput, model Δ…</div>
                            </div>
                            <div className="bdh-cta-copy">
                                <h3>{ctaTitle}</h3>
                                <p>{ctaText}</p>
                            </div>
                            <a className="bdh-btn bdh-btn-light" href={ctaHref}>
                                {ctaLabel} →
                            </a>
                        </div>
                    </div>
                </section>
            )}

            {mounted && gateFor && createPortal(
                <div className="bdh" style={vars}>
                    <style>{CSS}</style>
                    <GateModal r={gateFor} color={colorOf(gateFor)} cfg={cfg} onClose={closeGate} onUnlocked={onUnlocked} />
                </div>,
                document.body
            )}
        </div>
    )
}

function SectionHead({ n, title, note }: { n: string; title: string; note: string }) {
    return (
        <div className="bdh-shead">
            <div className="bdh-mono bdh-shead-n">{n}</div>
            <h2>{title}</h2>
            <div className="bdh-shead-note">{note}</div>
        </div>
    )
}

const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
    </svg>
)
const LockIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true" style={{ verticalAlign: "-1px" }}>
        <rect x="4" y="11" width="16" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
)
const GridIcon = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <rect x="1" y="1" width="6" height="6" rx="1" />
        <rect x="9" y="1" width="6" height="6" rx="1" />
        <rect x="1" y="9" width="6" height="6" rx="1" />
        <rect x="9" y="9" width="6" height="6" rx="1" />
    </svg>
)
const ListIcon = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <rect x="1" y="2" width="14" height="2.5" rx="1" />
        <rect x="1" y="6.75" width="14" height="2.5" rx="1" />
        <rect x="1" y="11.5" width="14" height="2.5" rx="1" />
    </svg>
)

// ---------------------------------------------------------------------------
// Styles (container queries so Framer breakpoints work regardless of viewport)
// ---------------------------------------------------------------------------

const CSS = `
.bdh{--bdh-line:rgba(18,20,28,.1);--bdh-muted:#5E6472;--bdh-card:#fff;container-type:inline-size;width:100%;background:var(--bdh-bg);color:var(--bdh-ink);font-family:var(--bdh-font);-webkit-font-smoothing:antialiased;box-sizing:border-box}
.bdh *,.bdh *::before,.bdh *::after{box-sizing:border-box}
.bdh button{font:inherit;cursor:pointer}
:where(.bdh) a{color:inherit}
.bdh-mono{font-family:var(--bdh-mono);letter-spacing:.06em}
.bdh-wrap{max-width:var(--bdh-max);margin:0 auto;padding:0 32px}
.bdh-dot{display:inline-block;width:8px;height:8px;border-radius:2px;margin-right:8px;flex:none}

/* hero */
.bdh-hero{position:relative;background:var(--bdh-dark);color:#fff;overflow:hidden;padding:72px 0 0}
.bdh-hero-grid-bg{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px);background-size:40px 40px;mask-image:linear-gradient(180deg,#000 30%,transparent);-webkit-mask-image:linear-gradient(180deg,#000 30%,transparent);pointer-events:none}
.bdh-hero-inner{position:relative;display:grid;grid-template-columns:1.05fr .95fr;gap:56px;align-items:center}
.bdh-kicker{display:flex;align-items:center;gap:10px;font-size:12px;color:rgba(255,255,255,.7);margin-bottom:22px}
.bdh-pulse{width:8px;height:8px;border-radius:50%;background:var(--bdh-accent);box-shadow:0 0 0 4px color-mix(in srgb,var(--bdh-accent) 30%,transparent)}
.bdh-h1{font-size:clamp(40px,5.4cqi,68px);line-height:1.02;letter-spacing:-.035em;font-weight:650;margin:0;max-width:640px}
.bdh-intro{font-size:17px;line-height:1.6;color:rgba(255,255,255,.66);max-width:560px;margin:22px 0 0}
.bdh-search{display:flex;align-items:center;gap:12px;margin-top:34px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);border-radius:10px;padding:0 14px 0 16px;color:rgba(255,255,255,.55);max-width:560px;transition:border-color .15s,background .15s}
.bdh-search:focus-within{border-color:var(--bdh-accent);background:rgba(255,255,255,.09)}
.bdh-search input{flex:1;min-width:0;background:none;border:0;outline:0;color:#fff;font:inherit;font-size:15px;padding:16px 0}
.bdh-search input::placeholder{color:rgba(255,255,255,.4)}
.bdh-search kbd{font-size:11px;border:1px solid rgba(255,255,255,.2);border-radius:4px;padding:2px 7px;color:rgba(255,255,255,.55)}
.bdh-hero-meta{display:flex;flex-wrap:wrap;gap:8px 22px;margin-top:18px;font-size:11px;color:rgba(255,255,255,.42)}
.bdh-hero-visual{position:relative}
.bdh-hero-svg{display:block;width:100%;height:auto}
.bdh-facts{position:relative;display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));margin:56px 0 0;border-top:1px solid rgba(255,255,255,.1)}
.bdh-fact{padding:20px 20px 24px 0;margin:0}
.bdh-fact+.bdh-fact{padding-left:20px;border-left:1px solid rgba(255,255,255,.1)}
.bdh-fact dt{font-size:10.5px;color:rgba(255,255,255,.42);text-transform:uppercase;margin-bottom:6px}
.bdh-fact dd{margin:0;font-size:15px;font-weight:550;color:rgba(255,255,255,.92)}

/* sections */
.bdh-section{padding:72px 0 0}
.bdh-section-last{padding-bottom:88px}
.bdh-shead{display:grid;grid-template-columns:auto auto 1fr;align-items:baseline;gap:14px;padding-bottom:16px;margin-bottom:28px;border-bottom:1px solid var(--bdh-line)}
.bdh-shead-n{font-size:12px;color:var(--bdh-accent)}
.bdh-shead h2{margin:0;font-size:26px;letter-spacing:-.025em;font-weight:650}
.bdh-shead-note{justify-self:end;font-size:14px;color:var(--bdh-muted)}

/* featured */
.bdh-featured{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:18px}
.bdh-feat{display:flex;flex-direction:column;text-decoration:none;background:var(--bdh-card);border:1px solid var(--bdh-line);border-radius:12px;overflow:hidden;transition:transform .18s,box-shadow .18s,border-color .18s}
.bdh-feat:hover{transform:translateY(-3px);box-shadow:0 14px 34px rgba(18,20,28,.1);border-color:rgba(18,20,28,.2)}
.bdh-feat-cover{aspect-ratio:16/9;overflow:hidden;background:#0D0F17}
.bdh-feat.is-lead .bdh-feat-cover{aspect-ratio:16/8}
.bdh-feat-body{display:flex;flex-direction:column;flex:1;padding:20px 22px 22px}
.bdh-feat-type{display:flex;align-items:center;gap:10px;font-size:11px;font-weight:600}
.bdh-feat-title{font-size:20px;line-height:1.22;letter-spacing:-.02em;font-weight:620;margin:10px 0 8px}
.bdh-feat.is-lead .bdh-feat-title{font-size:24px}
.bdh-feat-desc{margin:0;color:var(--bdh-muted);font-size:14px;line-height:1.55}
.bdh-feat-foot{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;margin-top:auto;padding-top:20px}
.bdh-metric{font-size:28px;font-weight:650;letter-spacing:-.03em;line-height:1}
.bdh-metric-label{font-size:10.5px;color:var(--bdh-muted);margin-top:6px;text-transform:uppercase}
.bdh-go{font-size:13px;font-weight:600;white-space:nowrap;display:inline-flex;align-items:center;gap:6px}
.bdh-lock-tag{display:inline-flex;align-items:center;gap:5px;color:var(--bdh-muted);font-weight:500}

/* covers */
.bdh-cover-svg,.bdh-cover-img{display:block;width:100%;height:100%;object-fit:cover}

/* library */
.bdh-lib{display:grid;grid-template-columns:220px 1fr;gap:40px;align-items:start}
.bdh-side{position:sticky;top:24px;display:flex;flex-direction:column;gap:26px}
.bdh-fgroup{display:flex;flex-direction:column;gap:2px}
.bdh-fgroup-title{font-size:10.5px;color:var(--bdh-muted);margin-bottom:8px}
.bdh-fopt{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;text-align:left;background:none;border:0;border-radius:6px;padding:7px 10px;margin-left:-10px;width:calc(100% + 10px);font-size:14px;color:var(--bdh-ink)}
.bdh-fopt>span:first-child{display:flex;align-items:center;min-width:0}
.bdh-fopt:hover{background:rgba(18,20,28,.05)}
.bdh-fopt.is-on{background:var(--bdh-ink);color:#fff}
.bdh-fopt.is-on .bdh-count{color:rgba(255,255,255,.6)}
.bdh-count{font-size:11px;color:var(--bdh-muted)}
.bdh-seg{display:inline-flex;border:1px solid var(--bdh-line);border-radius:8px;padding:3px;background:var(--bdh-card);gap:2px}
.bdh-seg button{border:0;background:none;border-radius:5px;padding:6px 10px;font-size:13px;color:var(--bdh-muted);display:inline-flex;align-items:center}
.bdh-seg button.is-on{background:var(--bdh-ink);color:#fff}
.bdh-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:18px}
.bdh-result-count{font-size:12px;color:var(--bdh-muted);display:flex;align-items:center;gap:14px}
.bdh-tools{display:flex;align-items:center;gap:8px}
.bdh-select{appearance:none;-webkit-appearance:none;border:1px solid var(--bdh-line);background:var(--bdh-card) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' fill='none' stroke='%235E6472' stroke-width='1.5'/%3E%3C/svg%3E") no-repeat right 12px center;border-radius:8px;padding:8px 32px 8px 12px;font:inherit;font-size:13px;color:var(--bdh-ink)}
.bdh-reset{background:none;border:0;padding:0;color:var(--bdh-accent);font-size:12px;text-decoration:underline;text-underline-offset:3px}
.bdh-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}
.bdh-card{display:flex;flex-direction:column;text-decoration:none;background:var(--bdh-card);border:1px solid var(--bdh-line);border-radius:10px;overflow:hidden;transition:transform .18s,box-shadow .18s,border-color .18s}
.bdh-card:hover{transform:translateY(-2px);box-shadow:0 10px 26px rgba(18,20,28,.08);border-color:rgba(18,20,28,.2)}
.bdh-card-cover{aspect-ratio:16/8;overflow:hidden;background:#0D0F17}
.bdh-card-body{display:flex;flex-direction:column;flex:1;padding:16px 18px 16px}
.bdh-card-type{display:flex;align-items:center;font-size:10.5px;font-weight:600;color:var(--bdh-muted)}
.bdh-card-type .bdh-lock-tag{margin-left:auto}
.bdh-card-title{font-size:17px;line-height:1.28;letter-spacing:-.015em;font-weight:620;margin:10px 0 6px}
.bdh-card-desc{margin:0;color:var(--bdh-muted);font-size:13.5px;line-height:1.55}
.bdh-card-meta{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:auto;padding-top:16px;font-size:10.5px;color:var(--bdh-muted)}
.bdh-card-meta>span:first-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.bdh-card-meta .bdh-go{font-family:var(--bdh-font);letter-spacing:0;font-size:12.5px;color:var(--bdh-ink)}
.bdh-list{display:flex;flex-direction:column;border:1px solid var(--bdh-line);border-radius:10px;overflow:hidden;background:var(--bdh-card)}
.bdh-list .bdh-card{flex-direction:row;align-items:stretch;border:0;border-radius:0;transform:none;box-shadow:none}
.bdh-list .bdh-card+.bdh-card{border-top:1px solid var(--bdh-line)}
.bdh-list .bdh-card:hover{background:rgba(18,20,28,.025)}
.bdh-list .bdh-card-cover{flex:none;width:150px;aspect-ratio:auto}
.bdh-list .bdh-card-body{padding:14px 18px}
.bdh-list .bdh-card-title{margin:6px 0 4px;font-size:16px}
.bdh-list .bdh-card-meta{padding-top:10px}
.bdh-empty{padding:48px 0;text-align:center;color:var(--bdh-muted);font-size:14px}

/* quick links */
.bdh-links{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));border:1px solid var(--bdh-line);border-radius:10px;overflow:hidden;background:var(--bdh-card)}
.bdh-link{padding:20px 22px;text-decoration:none;border-right:1px solid var(--bdh-line);margin-right:-1px;transition:background .15s}
.bdh-link:hover{background:rgba(18,20,28,.03)}
.bdh-link-label{display:flex;justify-content:space-between;font-weight:600;font-size:15px}
.bdh-link-label span{color:var(--bdh-accent);transition:transform .15s}
.bdh-link:hover .bdh-link-label span{transform:translateX(3px)}
.bdh-link-desc{margin-top:6px;color:var(--bdh-muted);font-size:13px;line-height:1.5}

/* cta */
.bdh-cta{display:grid;grid-template-columns:1fr auto;gap:12px 32px;align-items:center;background:var(--bdh-dark);color:#fff;border-radius:14px;padding:32px 36px;position:relative;overflow:hidden}
.bdh-cta::after{content:"";position:absolute;right:-80px;top:-120px;width:340px;height:340px;background:radial-gradient(circle,color-mix(in srgb,var(--bdh-accent) 45%,transparent),transparent 65%);pointer-events:none}
.bdh-cta-term{grid-column:1/-1;font-size:12.5px;color:rgba(255,255,255,.85);display:flex;flex-direction:column;gap:4px;padding-bottom:18px;border-bottom:1px solid rgba(255,255,255,.1);letter-spacing:.02em}
.bdh-dim{color:rgba(255,255,255,.4)}
.bdh-cta-copy h3{margin:0;font-size:24px;letter-spacing:-.02em;font-weight:620}
.bdh-cta-copy p{margin:8px 0 0;color:rgba(255,255,255,.62);font-size:15px;line-height:1.55;max-width:620px}
.bdh-btn{position:relative;z-index:1;display:inline-flex;align-items:center;justify-content:center;gap:8px;border:0;border-radius:8px;padding:13px 20px;font-weight:600;font-size:14px;text-decoration:none;white-space:nowrap;transition:filter .15s,transform .15s}
.bdh-btn:hover{filter:brightness(1.08)}
.bdh-btn:disabled{opacity:.6;cursor:default}
.bdh-btn-light{background:#fff;color:var(--bdh-dark)}
.bdh-btn-primary{background:var(--bdh-accent);color:#fff}
.bdh-btn-block{width:100%}

/* modal */
.bdh-overlay{position:fixed;inset:0;z-index:2147483000;background:rgba(8,9,14,.62);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px;animation:bdh-fade .18s ease-out}
.bdh-modal{position:relative;display:grid;grid-template-columns:320px 1fr;width:100%;max-width:820px;max-height:calc(100vh - 40px);overflow:auto;background:var(--bdh-card);border-radius:14px;box-shadow:0 30px 80px rgba(0,0,0,.35);animation:bdh-rise .22s ease-out}
.bdh-close{position:absolute;top:12px;right:12px;z-index:2;width:32px;height:32px;border-radius:8px;border:0;background:rgba(18,20,28,.06);font-size:20px;line-height:1;color:var(--bdh-ink)}
.bdh-modal-side{background:var(--bdh-dark);color:#fff;padding:22px;display:flex;flex-direction:column}
.bdh-modal-cover{aspect-ratio:16/9;border-radius:8px;overflow:hidden;margin-bottom:18px}
.bdh-modal-type{font-size:10.5px;font-weight:600}
.bdh-modal-rtitle{font-size:19px;line-height:1.25;font-weight:620;letter-spacing:-.015em;margin:8px 0}
.bdh-modal-rdesc{margin:0;font-size:13.5px;line-height:1.55;color:rgba(255,255,255,.6)}
.bdh-modal-main{padding:30px 30px 26px}
.bdh-kicker-sm{font-size:10.5px;color:var(--bdh-accent);margin-bottom:8px}
.bdh-modal-main h3{margin:0;font-size:22px;letter-spacing:-.02em;font-weight:650}
.bdh-gate-text{margin:8px 0 20px;color:var(--bdh-muted);font-size:14px;line-height:1.55}
.bdh-form-grid{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:16px}
.bdh-field{flex:1 1 100%;display:flex;flex-direction:column;gap:6px;font-size:12.5px;font-weight:550}
.bdh-field.bdh-half{flex:1 1 calc(50% - 6px)}
.bdh-field em{color:var(--bdh-accent);font-style:normal;margin-left:2px}
.bdh-field input{border:1px solid rgba(18,20,28,.16);border-radius:8px;padding:11px 12px;font:inherit;font-size:14px;font-weight:400;color:var(--bdh-ink);background:#fff;outline:0;transition:border-color .15s,box-shadow .15s}
.bdh-field input:focus{border-color:var(--bdh-accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--bdh-accent) 18%,transparent)}
.bdh-error{background:#FDECEC;color:#A12828;border-radius:8px;padding:10px 12px;font-size:13px;margin-bottom:14px}
.bdh-privacy{margin:14px 0 0;font-size:12px;line-height:1.5;color:var(--bdh-muted)}
.bdh-hs-embed{min-height:220px}
.bdh-success{display:flex;flex-direction:column;align-items:flex-start;gap:4px;padding-top:24px}
.bdh-success-mark{width:40px;height:40px;border-radius:10px;color:#fff;display:flex;align-items:center;justify-content:center;font-size:20px;margin-bottom:12px}
.bdh-success p{margin:4px 0 22px;color:var(--bdh-muted);font-size:14px;line-height:1.55}
@keyframes bdh-fade{from{opacity:0}}
@keyframes bdh-rise{from{opacity:0;transform:translateY(12px)}}

/* responsive (container width, not viewport) */
@container (max-width: 1000px){
  .bdh-hero-inner{grid-template-columns:1fr}
  .bdh-hero-visual{max-width:620px}
  .bdh-featured{grid-template-columns:1fr 1fr}
  .bdh-feat.is-lead{grid-column:1/-1}
  .bdh-lib{grid-template-columns:1fr;gap:20px}
  .bdh-side{position:static;flex-direction:row;flex-wrap:wrap;gap:16px 24px}
  .bdh-side .bdh-fgroup{flex-direction:row;flex-wrap:wrap;align-items:center;gap:6px}
  .bdh-side .bdh-fgroup-title{width:100%;margin-bottom:2px}
  .bdh-side .bdh-fopt{width:auto;margin:0;border:1px solid var(--bdh-line);background:var(--bdh-card);padding:6px 10px;font-size:13px}
  .bdh-side .bdh-fopt.is-on{background:var(--bdh-ink)}
}
@container (max-width: 680px){
  .bdh-wrap{padding:0 16px}
  .bdh-hero{padding-top:48px}
  .bdh-hero-visual{display:none}
  .bdh-shead{grid-template-columns:auto 1fr}
  .bdh-shead-note{grid-column:1/-1;justify-self:start}
  .bdh-featured{grid-template-columns:1fr}
  .bdh-fact+.bdh-fact{padding-left:0;border-left:0}
  .bdh-facts{grid-template-columns:1fr 1fr;gap:0 16px}
  .bdh-list .bdh-card-cover{width:96px}
  .bdh-cta{grid-template-columns:1fr;padding:26px 22px}
  .bdh-side .bdh-fgroup:nth-child(3){display:none}
}
@media (max-width: 720px){
  .bdh-modal{grid-template-columns:1fr}
  .bdh-modal-side{padding:18px 18px 16px}
  .bdh-modal-cover{display:none}
  .bdh-modal-main{padding:22px 18px}
}
`

// ---------------------------------------------------------------------------
// Property controls
// ---------------------------------------------------------------------------

addPropertyControls(DeveloperHub, {
    // ---- content source
    source: {
        type: ControlType.Enum,
        title: "Content",
        options: ["panel", "feed", "both"],
        optionTitles: ["Framer panel", "Feed / HubDB", "Both"],
        defaultValue: "panel",
    },
    feedUrl: {
        type: ControlType.String,
        title: "Feed URL",
        defaultValue: "",
        placeholder: "https://api.hubapi.com/cms/v3/hubdb/tables/…/rows?portalId=…",
        description: "JSON array, or a HubSpot HubDB rows endpoint. See README.",
        hidden: (p: any) => p.source === "panel",
    },
    items: {
        type: ControlType.Array,
        title: "Resources",
        hidden: (p: any) => p.source === "feed",
        control: {
            type: ControlType.Object,
            controls: {
                title: { type: ControlType.String, title: "Title", defaultValue: "New resource" },
                description: { type: ControlType.String, title: "Description", displayTextArea: true, defaultValue: "" },
                type: { type: ControlType.String, title: "Type", defaultValue: "Guide", placeholder: "Benchmark, Guide, Webinar…" },
                topic: { type: ControlType.String, title: "Topic", defaultValue: "General" },
                audience: { type: ControlType.String, title: "Audience", defaultValue: "Developers" },
                format: {
                    type: ControlType.Enum,
                    title: "Format",
                    options: ["PDF", "Web", "Video", "Slides", "Code", "Dataset"],
                    defaultValue: "PDF",
                },
                date: { type: ControlType.Date, title: "Date" },
                file: {
                    type: ControlType.File,
                    title: "Upload",
                    allowedFileTypes: ["pdf", "pptx", "zip", "mp4", "csv", "json"],
                },
                href: { type: ControlType.Link, title: "Or link" },
                image: { type: ControlType.ResponsiveImage, title: "Cover" },
                size: { type: ControlType.String, title: "Size", placeholder: "2.4 MB" },
                featured: { type: ControlType.Boolean, title: "Featured", defaultValue: false },
                gated: { type: ControlType.Boolean, title: "Gate", enabledTitle: "Register", disabledTitle: "Open", defaultValue: false },
                formId: { type: ControlType.String, title: "Form ID", placeholder: "Override default form" },
                metric: { type: ControlType.String, title: "Metric", placeholder: "Up to 50%" },
                metricLabel: { type: ControlType.String, title: "Metric label" },
                id: { type: ControlType.String, title: "Slug", placeholder: "auto from title" },
            },
        },
        defaultValue: DEFAULT_ITEMS,
    },

    // ---- registration gate
    portalId: {
        type: ControlType.String,
        title: "HubSpot portal",
        defaultValue: "144465530",
        placeholder: "12345678",
    },
    formId: {
        type: ControlType.String,
        title: "HubSpot form",
        defaultValue: "",
        placeholder: "Form GUID",
    },
    region: {
        type: ControlType.Enum,
        title: "Region",
        options: ["na1", "na2", "eu1"],
        defaultValue: "na1",
    },
    formMode: {
        type: ControlType.Enum,
        title: "Form",
        options: ["native", "embed"],
        optionTitles: ["Native", "HubSpot embed"],
        displaySegmentedControl: true,
        defaultValue: "native",
        description: "Native matches the hub's design. Embed renders the HubSpot form as configured in HubSpot.",
    },
    formFields: {
        type: ControlType.Array,
        title: "Fields",
        hidden: (p: any) => p.formMode === "embed",
        control: {
            type: ControlType.Object,
            controls: {
                name: { type: ControlType.String, title: "HubSpot name", defaultValue: "email" },
                label: { type: ControlType.String, title: "Label", defaultValue: "Work email" },
                type: { type: ControlType.Enum, title: "Type", options: ["text", "email", "tel"], defaultValue: "text" },
                required: { type: ControlType.Boolean, title: "Required", defaultValue: true },
                half: { type: ControlType.Boolean, title: "Half width", defaultValue: false },
            },
        },
        defaultValue: DEFAULT_FIELDS,
    },
    resourceField: {
        type: ControlType.String,
        title: "Resource field",
        defaultValue: "",
        placeholder: "e.g. devhub_resource",
        description: "Optional hidden HubSpot property that receives the resource title.",
    },
    unlockScope: {
        type: ControlType.Enum,
        title: "Unlocks",
        options: ["all", "item"],
        optionTitles: ["All gated", "That item"],
        displaySegmentedControl: true,
        defaultValue: "all",
    },
    gateTitle: { type: ControlType.String, title: "Gate title", defaultValue: "Register to access" },
    gateText: {
        type: ControlType.String,
        title: "Gate text",
        displayTextArea: true,
        defaultValue:
            "Tell us who you are and we'll unlock the full document. One registration covers every gated resource in the hub.",
    },
    privacyText: {
        type: ControlType.String,
        title: "Privacy note",
        displayTextArea: true,
        defaultValue: "We use this to share relevant technical material. Unsubscribe any time.",
    },
    privacyUrl: { type: ControlType.Link, title: "Privacy URL" },

    // ---- header
    kicker: { type: ControlType.String, title: "Kicker", defaultValue: "BEAMR / DEVELOPER HUB" },
    heading: { type: ControlType.String, title: "Heading", defaultValue: "The technical side of Beamr." },
    intro: {
        type: ControlType.String,
        title: "Intro",
        displayTextArea: true,
        defaultValue:
            "Benchmarks, reference architectures, integration guides and talks from Beamr's engineering and AI teams, for data engineers, ML teams and analysts working with video at scale.",
    },
    searchPlaceholder: { type: ControlType.String, title: "Search hint", defaultValue: "Search benchmarks, guides, papers, talks…" },
    facts: {
        type: ControlType.Array,
        title: "Facts",
        control: {
            type: ControlType.Object,
            controls: {
                label: { type: ControlType.String, title: "Label", defaultValue: "Label" },
                value: { type: ControlType.String, title: "Value", defaultValue: "Value" },
            },
        },
        defaultValue: DEFAULT_FACTS,
    },

    // ---- sections
    showFeatured: { type: ControlType.Boolean, title: "Featured", defaultValue: true },
    showQuickLinks: { type: ControlType.Boolean, title: "Public info", defaultValue: true },
    quickLinksTitle: {
        type: ControlType.String,
        title: "Info title",
        defaultValue: "Public information",
        hidden: (p: any) => !p.showQuickLinks,
    },
    quickLinks: {
        type: ControlType.Array,
        title: "Info links",
        hidden: (p: any) => !p.showQuickLinks,
        control: {
            type: ControlType.Object,
            controls: {
                label: { type: ControlType.String, title: "Label", defaultValue: "Link" },
                description: { type: ControlType.String, title: "Description", defaultValue: "" },
                href: { type: ControlType.Link, title: "URL" },
            },
        },
        defaultValue: DEFAULT_LINKS,
    },
    showCta: { type: ControlType.Boolean, title: "Evaluation CTA", defaultValue: true },
    ctaTitle: { type: ControlType.String, title: "CTA title", defaultValue: "Run Beamr on your own video.", hidden: (p: any) => !p.showCta },
    ctaText: {
        type: ControlType.String,
        title: "CTA text",
        displayTextArea: true,
        defaultValue:
            "Bring a real workload. We'll measure storage reduction, throughput and model behavior on the content your pipeline actually sees.",
        hidden: (p: any) => !p.showCta,
    },
    ctaLabel: { type: ControlType.String, title: "CTA button", defaultValue: "Start an evaluation", hidden: (p: any) => !p.showCta },
    ctaHref: { type: ControlType.Link, title: "CTA URL", hidden: (p: any) => !p.showCta },

    // ---- style
    accent: { type: ControlType.Color, title: "Accent", defaultValue: "#6C5CE7" },
    ink: { type: ControlType.Color, title: "Text", defaultValue: "#12141C" },
    dark: { type: ControlType.Color, title: "Dark", defaultValue: "#0B0D14" },
    background: { type: ControlType.Color, title: "Background", defaultValue: "#F6F6F3" },
    topicColors: {
        type: ControlType.Array,
        title: "Topic colors",
        control: {
            type: ControlType.Object,
            controls: {
                topic: { type: ControlType.String, title: "Topic", defaultValue: "" },
                color: { type: ControlType.Color, title: "Color", defaultValue: "#6C5CE7" },
            },
        },
        defaultValue: [],
    },
    fontFamily: { type: ControlType.String, title: "Font", defaultValue: "Inter" },
    monoFamily: { type: ControlType.String, title: "Mono font", defaultValue: "JetBrains Mono" },
    loadFonts: { type: ControlType.Boolean, title: "Load fonts", defaultValue: true, description: "Loads both fonts from Google Fonts. Turn off if the project already provides them." },
    maxWidth: { type: ControlType.Number, title: "Max width", min: 960, max: 1600, step: 10, defaultValue: 1280 },
})
