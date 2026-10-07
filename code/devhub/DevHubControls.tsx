// Beamr Developer Hub - Library controls
// Framer Code Component that adds search, filters and a HubSpot registration
// gate on top of NATIVE Framer card layers, so every card stays editable on
// the canvas. See code/devhub/README.md ("Native cards").
//
// How it finds cards: the children of the layer placed directly after this
// component (the library grid) are searched and filtered. Inside a card it
// reads the text in order: type, title (the heading), description, and on the
// last line date, topic and action. Any card on the page that shows a lock
// badge (🔒) is gated: clicking it opens a registration form, and HubSpot
// emails the document (the file link lives in HubSpot, not on the site).
// Cards without the badge open their own link as usual.

import * as React from "react"
import { createPortal } from "react-dom"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

interface Resource {
    id: string
    title: string
    description: string
    type: string
    topic: string
    href: string
    image: string
}

interface FormField {
    name: string
    label: string
    type: "text" | "email" | "tel"
    required: boolean
    half: boolean
}

interface Labels {
    search: string
    allTopics: string
    allTypes: string
    all: string
    open: string
    registration: string
    clear: string
    empty: string
    count: string
}

const DEFAULT_LABELS: Labels = {
    search: "Search benchmarks, guides, papers, talks…",
    allTopics: "All topics",
    allTypes: "All types",
    all: "All",
    open: "Open",
    registration: "Registration",
    clear: "Clear filters",
    empty: "No resources match these filters.",
    count: "resources",
}

const DEFAULT_FIELDS: FormField[] = [
    { name: "firstname", label: "First name", type: "text", required: true, half: true },
    { name: "lastname", label: "Last name", type: "text", required: true, half: true },
    { name: "email", label: "Work email", type: "email", required: true, half: false },
    { name: "company", label: "Company", type: "text", required: true, half: true },
    { name: "jobtitle", label: "Role", type: "text", required: false, half: true },
]

const PROFILE_KEY = "beamr-devhub-profile"
const ALL = "__all"

// ---------------------------------------------------------------------------
// Reading native card layers
// ---------------------------------------------------------------------------

function slug(s: string): string {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

const LOCK = "🔒"
const TEXT_TAGS = "h1,h2,h3,h4,h5,h6,p"

function clean(s: string | null | undefined): string {
    return (s || "").replace(/\s+/g, " ").trim()
}

// Text leaves of a card in document order, ignoring the lock badge.
function leaves(el: Element): Element[] {
    return Array.from(el.querySelectorAll(TEXT_TAGS)).filter((n) => clean(n.textContent) && !n.querySelector(TEXT_TAGS))
}

function isGatedCard(el: Element): boolean {
    return (el.textContent || "").includes(LOCK)
}

function readCard(el: Element, i: number): Resource {
    const all = leaves(el).filter((n) => !(n.textContent || "").includes(LOCK))
    const texts = all.map((n) => clean(n.textContent))
    let ti = all.findIndex((n) => /^H[1-6]$/.test(n.tagName))
    if (ti < 0) ti = Math.min(1, texts.length - 1)
    const title = texts[ti] || ""
    const tail = texts.slice(ti + 2)
    const a = (el.tagName === "A" ? el : el.closest("a") || el.querySelector("a")) as HTMLAnchorElement | null
    const img = el.querySelector("img") as HTMLImageElement | null
    return {
        id: slug(title) || `card-${i}`,
        title,
        description: texts[ti + 1] || "",
        type: ti > 0 ? texts[0] : "",
        topic: tail.length >= 2 ? tail[tail.length - 2].replace(/^·\s*/, "") : "",
        href: a?.href || "",
        image: img?.currentSrc || img?.src || "",
    }
}

// The card a click landed on: the largest ancestor that holds exactly one heading.
function cardFromTarget(t: Element | null): HTMLElement | null {
    let el = t as HTMLElement | null
    let card: HTMLElement | null = null
    while (el && el !== document.body) {
        const n = el.querySelectorAll("h1,h2,h3,h4,h5,h6").length
        if (n === 1) card = el
        else if (n > 1) break
        el = el.parentElement
    }
    return card
}

// ---------------------------------------------------------------------------
// Remembered details, cookies, analytics, HubSpot
// ---------------------------------------------------------------------------

function readProfile(): Record<string, string> {
    try {
        const v = JSON.parse(window.localStorage.getItem(PROFILE_KEY) || "null")
        if (v && typeof v === "object") return v
    } catch {}
    return {}
}

function writeProfile(v: Record<string, string> | null) {
    try {
        if (v) window.localStorage.setItem(PROFILE_KEY, JSON.stringify(v))
        else window.localStorage.removeItem(PROFILE_KEY)
    } catch {}
}

function fill(template: string, r: Resource, email: string): string {
    return template
        .replace(/\{title\}/g, r.title)
        .replace(/\{email\}/g, email || "your inbox")
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

interface GateConfig {
    portalId: string
    formId: string
    region: string
    formMode: "native" | "embed"
    formFields: FormField[]
    resourceField: string
    gateKicker: string
    gateTitle: string
    gateText: string
    successTitle: string
    successText: string
    submitLabel: string
    quickSendLabel: string
    notYouLabel: string
    rememberDetails: boolean
    privacyText: string
    privacyUrl: string
}

function NativeForm({ cfg, r, formId, onDone }: { cfg: GateConfig; r: Resource; formId: string; onDone: (email: string) => void }) {
    const saved = React.useMemo(() => (cfg.rememberDetails ? readProfile() : {}), [cfg.rememberDetails])
    const complete = !!saved.email && cfg.formFields.every((f) => !f.required || !!saved[f.name])
    const [values, setValues] = React.useState<Record<string, string>>(saved)
    const [quick, setQuick] = React.useState(complete)
    const [status, setStatus] = React.useState<"idle" | "sending" | "error">("idle")
    const [error, setError] = React.useState("")
    const firstRef = React.useRef<HTMLInputElement>(null)

    React.useEffect(() => {
        if (!quick) firstRef.current?.focus()
    }, [quick])

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
            if (cfg.rememberDetails) writeProfile(Object.fromEntries(cfg.formFields.map((f) => [f.name, values[f.name] || ""])))
            onDone(values.email || "")
        } catch (err: any) {
            setStatus("error")
            setError(err?.message || "Something went wrong. Please try again.")
        }
    }

    if (quick) {
        return (
            <form className="bdh-form" onSubmit={submit}>
                {status === "error" && <div className="bdh-error">{error}</div>}
                <button className="bdh-btn bdh-btn-primary bdh-btn-block" type="submit" disabled={status === "sending"}>
                    {status === "sending" ? "Sending…" : fill(cfg.quickSendLabel, r, values.email)}
                </button>
                <button
                    type="button"
                    className="bdh-notyou"
                    onClick={() => {
                        writeProfile(null)
                        setValues({})
                        setQuick(false)
                    }}
                >
                    {cfg.notYouLabel}
                </button>
            </form>
        )
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
                {status === "sending" ? "Sending…" : cfg.submitLabel}
            </button>
        </form>
    )
}

function EmbedForm({ cfg, r, formId, onDone }: { cfg: GateConfig; r: Resource; formId: string; onDone: (email: string) => void }) {
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
                    onFormSubmitted: (_f: any, data: any) => {
                        const email = (data?.submissionValues?.email as string) || ""
                        doneRef.current(email)
                    },
                })
            })
            .catch(() => !cancelled && setFailed(true))
        // Fallback: HubSpot also posts a global message on submission.
        const onMsg = (e: MessageEvent) => {
            const d: any = e.data
            if (d?.type === "hsFormCallback" && d?.eventName === "onFormSubmitted" && (!d.id || d.id === formId)) doneRef.current("")
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

function GateModal({ r, cfg, onClose, onSent }: { r: Resource; cfg: GateConfig; onClose: () => void; onSent: (r: Resource) => void }) {
    const [sentTo, setSentTo] = React.useState<string | null>(null)

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

    const handleDone = (email: string) => {
        setSentTo(email)
        onSent(r)
    }

    return (
        <div className="bdh-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
            <div className="bdh-modal" role="dialog" aria-modal="true" aria-labelledby="bdh-gate-title">
                <button className="bdh-close" onClick={onClose} aria-label="Close">
                    ×
                </button>
                <aside className="bdh-modal-side">
                    {r.image && (
                        <div className="bdh-modal-cover">
                            <img src={r.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        </div>
                    )}
                    {r.type && <div className="bdh-mono bdh-modal-type">{r.type.toUpperCase()}</div>}
                    <div className="bdh-modal-rtitle">{r.title}</div>
                    {r.description && <p className="bdh-modal-rdesc">{r.description}</p>}
                </aside>
                <div className="bdh-modal-main">
                    {sentTo !== null ? (
                        <div className="bdh-success">
                            <div className="bdh-success-mark">✓</div>
                            <h3>{fill(cfg.successTitle, r, sentTo)}</h3>
                            <p>{fill(cfg.successText, r, sentTo)}</p>
                            <button className="bdh-btn bdh-btn-primary bdh-btn-block" onClick={onClose}>
                                Back to the hub
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="bdh-mono bdh-kicker-sm">{cfg.gateKicker}</div>
                            <h3 id="bdh-gate-title">{cfg.gateTitle}</h3>
                            <p className="bdh-gate-text">{cfg.gateText}</p>
                            {cfg.formMode === "embed" ? (
                                <EmbedForm cfg={cfg} r={r} formId={cfg.formId} onDone={handleDone} />
                            ) : (
                                <NativeForm cfg={cfg} r={r} formId={cfg.formId} onDone={handleDone} />
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
// Component
// ---------------------------------------------------------------------------

interface Props {
    labels: Partial<Labels>
    showTopics: boolean
    showType: boolean
    showAccess: boolean
    portalId: string
    formId: string
    region: string
    formMode: "native" | "embed"
    formFields: FormField[]
    resourceField: string
    rememberDetails: boolean
    gateKicker: string
    gateTitle: string
    gateText: string
    privacyText: string
    privacyUrl: string
    successTitle: string
    successText: string
    submitLabel: string
    quickSendLabel: string
    notYouLabel: string
    accent: string
    ink: string
    dark: string
    fontFamily: string
    monoFamily: string
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 140
 */
export default function DevHubControls(props: Props) {
    const {
        labels: labelsProp,
        showTopics = true,
        showType = true,
        showAccess = true,
        portalId = "144465530",
        formId = "",
        region = "na1",
        formMode = "native",
        formFields = DEFAULT_FIELDS,
        resourceField = "devhub_resource",
        rememberDetails = true,
        gateKicker = "GET THE DOCUMENT",
        gateTitle = "Where should we send it?",
        gateText = "Leave your details and we'll email you this document right away.",
        privacyText = "We use this to share relevant technical material. Unsubscribe any time.",
        privacyUrl = "",
        successTitle = "Check your inbox",
        successText = "We've sent “{title}” to {email}. It should arrive within a minute.",
        submitLabel = "Email me the document",
        quickSendLabel = "Send it to {email} →",
        notYouLabel = "Not you? Use different details",
        accent = "#6C5CE7",
        ink = "#12141C",
        dark = "#0B0D14",
        fontFamily = "Inter",
        monoFamily = "JetBrains Mono",
        style,
    } = props
    const L: Labels = { ...DEFAULT_LABELS, ...(labelsProp || {}) }
    const onCanvas = RenderTarget.current() === RenderTarget.canvas

    const [cards, setCards] = React.useState<Resource[]>([])
    const [query, setQuery] = React.useState("")
    const [topic, setTopic] = React.useState(ALL)
    const [type, setType] = React.useState(ALL)
    const [access, setAccess] = React.useState<"all" | "open" | "gated">("all")
    const [visible, setVisible] = React.useState(0)
    const [gateFor, setGateFor] = React.useState<Resource | null>(null)
    const searchRef = React.useRef<HTMLInputElement>(null)
    const rootRef = React.useRef<HTMLDivElement>(null)

    // Library cards: children of the first layer after this component.
    const libraryCards = React.useCallback((): HTMLElement[] => {
        let n: HTMLElement | null = rootRef.current
        for (let i = 0; n && i < 5; i++) {
            const next = n.nextElementSibling as HTMLElement | null
            if (next) return Array.from(next.children) as HTMLElement[]
            n = n.parentElement
        }
        return []
    }, [])

    // Scan the page for card layers. Framer can hydrate after mount, so scan a few times.
    React.useEffect(() => {
        if (onCanvas) return
        const scan = () => {
            document.querySelectorAll(TEXT_TAGS).forEach((t) => {
                if (!(t.textContent || "").includes(LOCK)) return
                const card = cardFromTarget(t)
                if (card && !card.dataset.bdhScanned) {
                    card.dataset.bdhScanned = "1"
                    card.dataset.bdhGated = isGatedCard(card) ? "1" : "0"
                }
            })
            const seen = new Set<string>()
            const list: Resource[] = []
            libraryCards().forEach((el, i) => {
                if (!el.dataset.bdhScanned) el.dataset.bdhGated = isGatedCard(el) ? "1" : "0"
                el.dataset.bdhScanned = "1"
                const r = readCard(el, i)
                if (!r.title || seen.has(r.id)) return
                seen.add(r.id)
                list.push(r)
            })
            setCards(list)
        }
        scan()
        const t1 = window.setTimeout(scan, 300)
        const t2 = window.setTimeout(scan, 1500)
        return () => {
            window.clearTimeout(t1)
            window.clearTimeout(t2)
        }
    }, [libraryCards, onCanvas])


    // Apply filters to the native cards.
    React.useEffect(() => {
        if (onCanvas) return
        const q = query.trim().toLowerCase()
        const shown = new Set<string>()
        libraryCards().forEach((h) => {
            const r = readCard(h, 0)
            if (!r.title) return
            const hay = (h.textContent || "").toLowerCase()
            const ok =
                (!q || hay.includes(q)) &&
                (topic === ALL || r.topic === topic) &&
                (type === ALL || r.type === type) &&
                (access === "all" || (access === "gated") === (h.dataset.bdhGated === "1"))
            h.style.display = ok ? "" : "none"
            if (ok) shown.add(r.id)
        })
        setVisible(shown.size)
    }, [query, topic, type, access, cards, libraryCards, onCanvas])

    // Intercept clicks on gated cards before Framer navigates.
    React.useEffect(() => {
        if (onCanvas) return
        const onClick = (e: MouseEvent) => {
            const card = cardFromTarget(e.target as Element | null)
            if (!card) return
            if (!card.dataset.bdhScanned) {
                card.dataset.bdhScanned = "1"
                card.dataset.bdhGated = isGatedCard(card) ? "1" : "0"
            }
            const r = readCard(card, 0)
            if (card.dataset.bdhGated !== "1") {
                if ((e.target as Element).closest("a")) track("devhub_resource_open", r)
                return
            }
            e.preventDefault()
            e.stopPropagation()
            track("devhub_gate_view", r)
            setGateFor(r)
        }
        document.addEventListener("click", onClick, true)
        return () => document.removeEventListener("click", onClick, true)
    }, [onCanvas])

    // "/" focuses search.
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

    const onSent = (r: Resource) => track("devhub_gate_submit", r)
    const closeGate = React.useCallback(() => setGateFor(null), [])

    const uniq = (key: "topic" | "type") => Array.from(new Set(cards.map((c) => c[key]).filter(Boolean))).sort()
    const topics = onCanvas ? ["Topic A", "Topic B", "Topic C"] : uniq("topic")
    const types = onCanvas ? [] : uniq("type")
    const filtersActive = !!query || topic !== ALL || type !== ALL || access !== "all"
    const reset = () => {
        setQuery("")
        setTopic(ALL)
        setType(ALL)
        setAccess("all")
    }

    const cfg: GateConfig = {
        portalId: portalId.trim(),
        formId: formId.trim(),
        region,
        formMode,
        formFields,
        resourceField: resourceField.trim(),
        gateKicker,
        gateTitle,
        gateText,
        privacyText,
        privacyUrl,
        successTitle,
        successText,
        submitLabel,
        quickSendLabel,
        notYouLabel,
        rememberDetails,
    }

    const vars = {
        "--bdh-accent": accent,
        "--bdh-ink": ink,
        "--bdh-dark": dark,
        "--bdh-font": `"${fontFamily}", Inter, system-ui, sans-serif`,
        "--bdh-mono": `"${monoFamily}", ui-monospace, SFMono-Regular, Menlo, monospace`,
    } as React.CSSProperties

    return (
        <div ref={rootRef} className="bdh bdc" style={{ ...vars, ...style }}>
            <style>{CSS}</style>
            <label className="bdc-search">
                <SearchIcon />
                <input ref={searchRef} aria-label="Search resources" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={L.search} />
                <kbd className="bdh-mono">/</kbd>
            </label>
            <div className="bdc-row">
                {showTopics && (
                    <div className="bdc-chips">
                        <button className={topic === ALL ? "is-on" : ""} onClick={() => setTopic(ALL)}>
                            {L.allTopics}
                        </button>
                        {topics.map((t) => (
                            <button key={t} className={topic === t ? "is-on" : ""} onClick={() => setTopic(topic === t ? ALL : t)}>
                                {t}
                            </button>
                        ))}
                    </div>
                )}
                <div className="bdc-tools">
                    {showType && (
                        <select className="bdc-select" value={type} onChange={(e) => setType(e.target.value)} aria-label="Type">
                            <option value={ALL}>{L.allTypes}</option>
                            {types.map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                    )}
                    {showAccess && (
                        <div className="bdc-seg">
                            {(["all", "open", "gated"] as const).map((a) => (
                                <button key={a} className={access === a ? "is-on" : ""} onClick={() => setAccess(a)}>
                                    {a === "all" ? L.all : a === "open" ? L.open : L.registration}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="bdh-mono bdc-count">
                {onCanvas ? `— ${L.count}` : `${visible} / ${cards.length} ${L.count}`}
                {filtersActive && (
                    <button className="bdc-reset" onClick={reset}>
                        {L.clear}
                    </button>
                )}
            </div>
            {!onCanvas && cards.length > 0 && visible === 0 && <div className="bdc-empty">{L.empty}</div>}
            {gateFor &&
                createPortal(
                    <div className="bdh" style={vars}>
                        <style>{CSS}</style>
                        <GateModal r={gateFor} cfg={cfg} onClose={closeGate} onSent={onSent} />
                    </div>,
                    document.body
                )}
        </div>
    )
}

const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
    </svg>
)

const CSS = `
.bdh{--bdh-line:rgba(18,20,28,.1);--bdh-muted:#5E6472;--bdh-card:#fff;font-family:var(--bdh-font);color:var(--bdh-ink);-webkit-font-smoothing:antialiased;box-sizing:border-box}
.bdh *,.bdh *::before,.bdh *::after{box-sizing:border-box}
.bdh button{font:inherit;cursor:pointer}
:where(.bdh) a{color:inherit}
.bdh-mono{font-family:var(--bdh-mono);letter-spacing:.06em}
.bdc{width:100%;display:flex;flex-direction:column;gap:14px}
.bdc-search{display:flex;align-items:center;gap:12px;background:var(--bdh-card);border:1px solid var(--bdh-line);border-radius:10px;padding:0 14px 0 16px;color:var(--bdh-muted);transition:border-color .15s}
.bdc-search:focus-within{border-color:var(--bdh-accent)}
.bdc-search input{flex:1;min-width:0;background:none;border:0;outline:0;color:var(--bdh-ink);font:inherit;font-size:15px;padding:14px 0}
.bdc-search input::placeholder{color:var(--bdh-muted)}
.bdc-search kbd{font-size:11px;border:1px solid var(--bdh-line);border-radius:4px;padding:2px 7px;color:var(--bdh-muted)}
.bdc-row{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap}
.bdc-chips{display:flex;flex-wrap:wrap;gap:6px;flex:1 1 420px}
.bdc-chips button{border:1px solid var(--bdh-line);background:var(--bdh-card);border-radius:999px;padding:6px 12px;font-size:13px;color:var(--bdh-ink)}
.bdc-chips button:hover{border-color:rgba(18,20,28,.3)}
.bdc-chips button.is-on{background:var(--bdh-ink);border-color:var(--bdh-ink);color:#fff}
.bdc-tools{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.bdc-select{appearance:none;-webkit-appearance:none;border:1px solid var(--bdh-line);background:var(--bdh-card) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' fill='none' stroke='%235E6472' stroke-width='1.5'/%3E%3C/svg%3E") no-repeat right 12px center;border-radius:8px;padding:8px 32px 8px 12px;font:inherit;font-size:13px;color:var(--bdh-ink)}
.bdc-seg{display:inline-flex;border:1px solid var(--bdh-line);border-radius:8px;padding:3px;background:var(--bdh-card);gap:2px}
.bdc-seg button{border:0;background:none;border-radius:5px;padding:6px 10px;font-size:13px;color:var(--bdh-muted)}
.bdc-seg button.is-on{background:var(--bdh-ink);color:#fff}
.bdc-count{font-size:12px;color:var(--bdh-muted);display:flex;align-items:center;gap:14px}
.bdc-reset{background:none;border:0;padding:0;color:var(--bdh-accent);font-size:12px;text-decoration:underline;text-underline-offset:3px}
.bdc-empty{padding:32px 0;text-align:center;color:var(--bdh-muted);font-size:14px}
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

.bdh-success-mark{background:var(--bdh-accent)}
.bdh-notyou{display:block;margin:12px auto 0;background:none;border:0;padding:0;color:var(--bdh-muted);font-size:13px;text-decoration:underline;text-underline-offset:3px}
.bdh-modal-type{color:var(--bdh-accent)}
@media (max-width: 720px){
  .bdh-modal{grid-template-columns:1fr}
  .bdh-modal-side{padding:18px 18px 16px}
  .bdh-modal-cover{display:none}
  .bdh-modal-main{padding:22px 18px}
}
`

addPropertyControls(DevHubControls, {
    showTopics: { type: ControlType.Boolean, title: "Topic chips", defaultValue: true },
    showType: { type: ControlType.Boolean, title: "Type filter", defaultValue: true },
    showAccess: { type: ControlType.Boolean, title: "Access filter", defaultValue: true },
    labels: {
        type: ControlType.Object,
        title: "Labels",
        controls: {
            search: { type: ControlType.String, title: "Search", defaultValue: DEFAULT_LABELS.search },
            allTopics: { type: ControlType.String, title: "All topics", defaultValue: DEFAULT_LABELS.allTopics },
            allTypes: { type: ControlType.String, title: "All types", defaultValue: DEFAULT_LABELS.allTypes },
            all: { type: ControlType.String, title: "All", defaultValue: DEFAULT_LABELS.all },
            open: { type: ControlType.String, title: "Open", defaultValue: DEFAULT_LABELS.open },
            registration: { type: ControlType.String, title: "Registration", defaultValue: DEFAULT_LABELS.registration },
            clear: { type: ControlType.String, title: "Clear", defaultValue: DEFAULT_LABELS.clear },
            empty: { type: ControlType.String, title: "No results", defaultValue: DEFAULT_LABELS.empty },
            count: { type: ControlType.String, title: "Count suffix", defaultValue: DEFAULT_LABELS.count },
        },
    },

    // ---- registration gate
    portalId: { type: ControlType.String, title: "HubSpot portal", defaultValue: "144465530" },
    formId: { type: ControlType.String, title: "HubSpot form", defaultValue: "", placeholder: "Form GUID" },
    region: { type: ControlType.Enum, title: "Region", options: ["na1", "na2", "eu1"], defaultValue: "na1" },
    formMode: {
        type: ControlType.Enum,
        title: "Form",
        options: ["native", "embed"],
        optionTitles: ["Native", "HubSpot embed"],
        displaySegmentedControl: true,
        defaultValue: "native",
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
        defaultValue: "devhub_resource",
        description: "Hidden HubSpot property that receives the document title. The workflow uses it to pick which document to email.",
    },
    rememberDetails: {
        type: ControlType.Boolean,
        title: "Remember details",
        defaultValue: true,
        description: "After the first request, the next document is one click (details are kept in the visitor's browser).",
    },
    gateKicker: { type: ControlType.String, title: "Gate kicker", defaultValue: "GET THE DOCUMENT" },
    gateTitle: { type: ControlType.String, title: "Gate title", defaultValue: "Where should we send it?" },
    gateText: {
        type: ControlType.String,
        title: "Gate text",
        displayTextArea: true,
        defaultValue: "Leave your details and we'll email you this document right away.",
    },
    privacyText: {
        type: ControlType.String,
        title: "Privacy note",
        displayTextArea: true,
        defaultValue: "We use this to share relevant technical material. Unsubscribe any time.",
    },
    privacyUrl: { type: ControlType.Link, title: "Privacy URL" },
    submitLabel: { type: ControlType.String, title: "Submit button", defaultValue: "Email me the document" },
    quickSendLabel: { type: ControlType.String, title: "One-click button", defaultValue: "Send it to {email} →", description: "Shown to returning visitors. {email} and {title} are filled in." },
    notYouLabel: { type: ControlType.String, title: "Not you link", defaultValue: "Not you? Use different details" },
    successTitle: { type: ControlType.String, title: "Success title", defaultValue: "Check your inbox" },
    successText: {
        type: ControlType.String,
        title: "Success text",
        displayTextArea: true,
        defaultValue: "We've sent “{title}” to {email}. It should arrive within a minute.",
    },

    // ---- style
    accent: { type: ControlType.Color, title: "Accent", defaultValue: "#6C5CE7" },
    ink: { type: ControlType.Color, title: "Text", defaultValue: "#12141C" },
    dark: { type: ControlType.Color, title: "Dark", defaultValue: "#0B0D14" },
    fontFamily: { type: ControlType.String, title: "Font", defaultValue: "Inter" },
    monoFamily: { type: ControlType.String, title: "Mono font", defaultValue: "JetBrains Mono" },
})
