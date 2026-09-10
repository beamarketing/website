import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { motion } from "framer-motion"

// ============================================================
// IBC 2026 COPY CONFIG
// Swap these strings on September 15 for the post-show version.
// ============================================================
const IBC_COPY = {
    heroNameLine: "Haggai Barel · COO, Beamr · Booth 1.D22 all week",
    heroDateLine: "SEPTEMBER 11–14 · HALL 1 · BOOTH 1.D22 · AMSTERDAM RAI",
    yellowCardHeading: "Come Find Me at IBC",
    yellowCardBody: "See the before-and-afters on a proper screen, and tell me what's sitting in your archive — I'll show you the closest thing I've got to your content.",
    boothNote: "At IBC this week? Hall 1, Booth 1.D22. Walk up any time — no appointment, no badge scan required.",
}

/*
POST-SHOW YELLOW CARD ALTERNATE
Heading: Missed Me at IBC?
Body: Same walkthrough, over a call. Tell me what you're working with and I'll show you the closest comparisons I've got.
*/

// Campaign parameters captured from the landing URL. A metro scan arrives with
// these on the QR link; they are remembered for the session so a reload or a
// shared link further down the funnel still reports where the visit came from.
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]
const TRACKING_STORAGE_KEY = "beamr-landing-tracking"

const readStoredTracking = () => {
    if (typeof window === "undefined") return {}
    try {
        const raw = window.sessionStorage.getItem(TRACKING_STORAGE_KEY)
        const parsed = raw ? JSON.parse(raw) : {}
        return parsed && typeof parsed === "object" ? parsed : {}
    } catch (error) {
        // Private browsing, a blocked storage partition, or corrupt JSON.
        return {}
    }
}

/**
 * Beamr Metro Landing — ultra-short QR conversion edition v29
 * Framer hybrid code component — supports native Text outlets for persistent Canvas editing
 *
 * Story:
 * 1) Pay off the metro scan immediately in the hero
 * 2) Move straight to a low-friction lead form, with the booth details
 *    alongside it for anyone who would rather just walk up
 */

export default function BeamrMetroWhatsNew(props) {
    const {
        heroEyebrowV28,
        heroHeadlineTopV28,
        heroHeadlineAccentV28,
        heroSubheadV28,
        heroCtaLabelV28,
        ctaHref,
        heroImage,
        heroBoothMeta,
        heroNameLine,
        teamMemberName,
        teamMemberTitle,
        teamInfoBottom,
        teamInfoRight,
        teamInfoMaxWidth,
        teamInfoBackground,
        showTrustedBy,
        showReveal,
        showRoute,
        showComparison,
        showVista,
        showAbout,
        trustedByLabelV28,
        trustedLogo1,
        trustedLogo2,
        trustedLogo3,
        trustedLogo4,
        trustedLogo5,
        trustedLogo1Height,
        trustedLogo2Height,
        trustedLogo3Height,
        trustedLogo4Height,
        trustedLogo5Height,
        trustedByGap,

        heroEyebrowSlot,
        heroTitleSlot,
        heroSubheadSlot,
        heroBoothSlot,
        heroCtaSlot,
        trustedLabelSlot,
        teamNameSlot,
        teamTitleSlot,
        revealHeadlineSlot,
        revealBodySlot,
        routeEyebrowSlot,
        stop1TitleSlot,
        stop1BodySlot,
        stop2TitleSlot,
        stop2BodySlot,
        stop3TitleSlot,
        stop3BodySlot,
        proofHeadlineSlot,
        proofBodySlot,
        vistaEyebrowSlot,
        vistaHeadlineSlot,
        vistaBodySlot,
        vistaPoint1Slot,
        vistaPoint2Slot,
        vistaPoint3Slot,
        aboutEyebrowSlot,
        aboutHeadlineSlot,
        aboutBodySlot,
        eventHeadlineSlot,
        eventBodySlot,
        eventMetaSlot,
        eventCtaSlot,
        secondaryCtaSlot,
        leadEyebrowSlot,
        leadHeadlineSlot,
        leadBodySlot,
        leadDisclaimerSlot,

        heroEyebrowWeight,
        heroEyebrowTracking,
        heroTitleWeight,
        heroTitleTracking,
        heroTitleSize,
        mobileHeroTitleSize,
        mobileProofTitleSize,
        mobileEventTitleSize,
        mobileLeadTitleSize,
        revealTitleWeight,
        revealTitleTracking,
        routeEyebrowWeight,
        routeEyebrowTracking,
        stop1TitleWeight,
        stop1TitleTracking,
        stop2TitleWeight,
        stop2TitleTracking,
        stop3TitleWeight,
        stop3TitleTracking,
        proofTitleWeight,
        proofTitleTracking,
        proofTitleSize,
        vistaEyebrowWeight,
        vistaEyebrowTracking,
        vistaTitleWeight,
        vistaTitleTracking,
        eventTitleWeight,
        eventTitleTracking,
        eventTitleSize,
        leadTitleWeight,
        leadTitleTracking,
        leadTitleSize,

        revealHeadline,
        revealBody,

        routeEyebrow,
        stop1Title,
        stop1Body,
        stop2Title,
        stop2Body,
        stop3Title,
        stop3Body,
        stop1Tag,
        stop2Tag,
        stop3Tag,

        proofHeadline,
        proofBody,
        proofEnhance,
        proofOptimize,
        proofProve,
        proofClosingLine,
        proofVistaStat,
        proofEnhanceTitle, proofOptimizeTitle, proofProveTitle, beyondArchiveText,
        metricResolutionLabel, metricBitrateLabel, metricSizeLabel, metricCodecLabel,
        cred1Value, cred1Label, cred2Value, cred2Label, cred3Value, cred3Label,
        firstNameLabel, lastNameLabel, emailLabel, companyLabel, jobTitleLabel,
        beforeVideo,
        afterVideo,
        posterImage,
        sourceLabel,
        outputLabel,
        sourceResolution,
        sourceBitrate,
        sourceSize,
        sourceCodec,
        outputResolution,
        outputBitrate,
        outputSize,
        outputCodec,

        vistaEyebrow,
        vistaHeadline,
        vistaBody,
        vistaPoint1,
        vistaPoint2,
        vistaPoint3,

        aboutEyebrow,
        aboutHeadline,
        aboutBody,
        aboutTitleWeight,
        aboutTitleTracking,
        aboutStat1Value,
        aboutStat1Label,
        aboutStat2Value,
        aboutStat2Label,
        aboutStat3Value,
        aboutStat3Label,
        aboutStat4Value,
        aboutStat4Label,

        eventHeadline,
        eventBody,
        eventMeta,
        eventCta,
        eventCtaHref,
        secondaryCtaLabel,
        secondaryCtaHref,
        showSecondaryCta,

        leadEyebrow,
        leadHeadline,
        leadBody,
        showHubspotForm,
        hubspotPortalId,
        hubspotFormId,
        hubspotRegion,
        formPlaceholderText,
        formSubmitLabel,
        formSuccessMessage,
        formErrorMessage,
        leadDisclaimer,
        boothNote,
        archivePrompt,
        archivePlaceholder,
        formFollowupNote,
        seoTitle,
        seoDescription,
        archiveHubspotField,
        industryHubspotField,
        industryHubspotValue,
        sourceHubspotField,
        sourceHubspotValue,
        subSourceHubspotField,
        subSourceHubspotValue,
        utmSourceHubspotField,
        utmMediumHubspotField,
        utmCampaignHubspotField,
        utmTermHubspotField,
        utmContentHubspotField,

        amsterdamIllustration,
        illustrationOpacity,
        illustrationWidth,
        illustrationBottom,
        illustrationRight,

        beamrLogo,
        footerLogoHeight,
        footerTagline,
        heroEyebrowSize,
        heroNameSize,
        heroSubheadSize,
        heroBoothSize,
        ctaFontSize,
        trustedLabelSize,
        routeEyebrowSize,
        stepNumSize,
        stepTitleSize,
        stepBodySize,
        stepTagSize,
        credValueSize,
        credLabelSize,
        leadEyebrowSize,
        leadBodySize,
        boothNoteSize,
        formLabelSize,
        formInputSize,
        submitSize,
        followupNoteSize,
        disclaimerSize,
        footerTaglineSize,
        blue,
        navy,
        pink,
        yellow,
        mint,
        white,
        black,
        fontFamily,
        enableCanvasTextEditing,
    } = props

    const [split, setSplit] = React.useState(52)
    const compareRef = React.useRef<HTMLDivElement | null>(null)
    const autoSweepDone = React.useRef(false)
    const autoSweepFrame = React.useRef<number | null>(null)
    const beforeRef = React.useRef<HTMLVideoElement | null>(null)
    const afterRef = React.useRef<HTMLVideoElement | null>(null)
    const initialLeadForm = {
        firstname: "",
        lastname: "",
        email: "",
        company: "",
        jobtitle: "",
        archive_content: "",
    }
    const [leadForm, setLeadForm] = React.useState(initialLeadForm)
    const [leadErrors, setLeadErrors] = React.useState<any>({})
    const [submitStatus, setSubmitStatus] = React.useState("idle")
    const [comparisonReady, setComparisonReady] = React.useState(false)
    const [submitMessage, setSubmitMessage] = React.useState("")

    // Framer canvas inline editing. This makes the rendered copy directly editable
    // while preserving the existing Property Controls as the component's source props.
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const editableTextKeys = [
        "heroEyebrowV28", "heroHeadlineTopV28", "heroHeadlineAccentV28", "heroSubheadV28",
        "heroCtaLabelV28", "heroBoothMeta", "heroNameLine", "teamMemberName", "teamMemberTitle",
        "trustedByLabelV28", "revealHeadline", "revealBody", "routeEyebrow",
        "stop1Title", "stop1Body", "stop1Tag", "stop2Title", "stop2Body", "stop2Tag", "stop3Title", "stop3Body", "stop3Tag",
        "proofHeadline", "proofBody", "proofEnhanceTitle", "proofEnhance", "proofOptimizeTitle", "proofOptimize", "proofProveTitle", "proofProve", "proofClosingLine", "proofVistaStat", "beyondArchiveText", "sourceLabel", "outputLabel",
        "sourceResolution", "sourceBitrate", "sourceSize", "sourceCodec",
        "outputResolution", "outputBitrate", "outputSize", "outputCodec",
        "vistaEyebrow", "vistaHeadline", "vistaBody", "vistaPoint1", "vistaPoint2", "vistaPoint3",
        "aboutEyebrow", "aboutHeadline", "aboutBody",
        "aboutStat1Value", "aboutStat1Label", "aboutStat2Value", "aboutStat2Label",
        "aboutStat3Value", "aboutStat3Label", "aboutStat4Value", "aboutStat4Label",
        "eventHeadline", "eventBody", "eventMeta", "eventCta", "secondaryCtaLabel",
        "leadEyebrow", "leadHeadline", "leadBody", "boothNote", "formSubmitLabel", "leadDisclaimer", "archivePrompt", "archivePlaceholder", "formFollowupNote", "firstNameLabel", "lastNameLabel", "emailLabel", "companyLabel", "jobTitleLabel", "footerTagline",
    ]
    const textSignature = editableTextKeys.map((key) => String(props[key] ?? "")).join("␞")
    const [canvasText, setCanvasText] = React.useState(() =>
        Object.fromEntries(editableTextKeys.map((key) => [key, String(props[key] ?? "")]))
    )

    React.useEffect(() => {
        setCanvasText(
            Object.fromEntries(editableTextKeys.map((key) => [key, String(props[key] ?? "")]))
        )
    }, [textSignature])

    const inlineValue = (key) => canvasText[key] ?? String(props[key] ?? "")
    const nativeOr = (slot, fallback) => {
        // Framer ComponentInstance controls can resolve to an empty array when no
        // Canvas layer is connected. An empty array is truthy in JavaScript, so
        // `slot || fallback` incorrectly hid all fallback text on the Canvas.
        if (slot == null || slot === false) return fallback
        if (Array.isArray(slot) && slot.length === 0) return fallback
        if (React.isValidElement(slot)) return slot
        if (Array.isArray(slot)) {
            const visibleChildren = slot.filter(Boolean)
            return visibleChildren.length > 0 ? visibleChildren : fallback
        }
        return slot || fallback
    }

    const editableTextProps = (key, options: any = {}) => {
        const enabled = isCanvas && enableCanvasTextEditing
        const singleLine = options.singleLine === true
        const placeholder = options.placeholder || "Edit text"

        return {
            contentEditable: enabled,
            suppressContentEditableWarning: true,
            spellCheck: enabled,
            "data-beamr-inline-edit": enabled ? "true" : undefined,
            "data-placeholder": enabled ? placeholder : undefined,
            onBlur: enabled
                ? (event) => {
                      const value = event.currentTarget.innerText.replace(/\u00a0/g, " ").trim()
                      setCanvasText((prev) => ({ ...prev, [key]: value }))
                  }
                : undefined,
            onKeyDown: enabled && singleLine
                ? (event) => {
                      if (event.key === "Enter") {
                          event.preventDefault()
                          event.currentTarget.blur()
                      }
                  }
                : undefined,
        }
    }

    React.useEffect(() => {
        const before = beforeRef.current
        const after = afterRef.current
        if (!before || !after) return

        const syncTime = () => {
            if (Math.abs(after.currentTime - before.currentTime) > 0.08) {
                after.currentTime = before.currentTime
            }
        }
        const syncPlay = () => {
            syncTime()
            after.play().catch(() => {})
        }
        const syncPause = () => after.pause()
        const syncSeek = () => {
            after.currentTime = before.currentTime
        }

        before.addEventListener("play", syncPlay)
        before.addEventListener("pause", syncPause)
        before.addEventListener("seeking", syncSeek)
        before.addEventListener("timeupdate", syncTime)

        return () => {
            before.removeEventListener("play", syncPlay)
            before.removeEventListener("pause", syncPause)
            before.removeEventListener("seeking", syncSeek)
            before.removeEventListener("timeupdate", syncTime)
        }
    }, [beforeVideo, afterVideo])

    const handleLeadFieldChange = (event) => {
        const { name, value } = event.target
        setLeadForm((prev) => ({ ...prev, [name]: value }))
        setLeadErrors((prev) => ({ ...prev, [name]: "" }))
        if (submitStatus !== "idle") {
            setSubmitStatus("idle")
            setSubmitMessage("")
        }
    }

    const validateLeadForm = () => {
        const errors: any = {}
        if (!leadForm.firstname.trim()) errors.firstname = "First name is required"
        if (!leadForm.lastname.trim()) errors.lastname = "Last name is required"
        if (!leadForm.email.trim()) {
            errors.email = "Need an email to reply to."
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadForm.email.trim())) {
            errors.email = "That doesn’t look like a working email."
        }
        setLeadErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleLeadSubmit = async (event) => {
        event.preventDefault()
        if (!validateLeadForm()) return

        if (!showHubspotForm || !hubspotPortalId || !hubspotFormId) {
            setSubmitStatus("error")
            setSubmitMessage(
                formPlaceholderText ||
                    "Add your HubSpot Portal ID and Form ID in the Framer properties to enable submission."
            )
            return
        }

        setSubmitStatus("loading")
        setSubmitMessage("")

        try {
            const cleanRegion = String(hubspotRegion || "").trim().toLowerCase()
            const baseUrl = cleanRegion && cleanRegion !== "na1"
                ? `https://api-${cleanRegion}.hsforms.com`
                : "https://api.hsforms.com"

            const visibleFields = (() => {
                return [
                { name: "firstname", value: leadForm.firstname.trim() },
                { name: "lastname", value: leadForm.lastname.trim() },
                { name: "email", value: leadForm.email.trim() },
                ...(leadForm.company.trim() ? [{ name: "company", value: leadForm.company.trim() }] : []),
                ...(leadForm.jobtitle.trim() ? [{ name: "jobtitle", value: leadForm.jobtitle.trim() }] : []),
                ...(archiveHubspotField && leadForm.archive_content.trim() ? [{ name: archiveHubspotField, value: leadForm.archive_content.trim() }] : []),
                ]
            })()

            // Hidden fields — never shown to the visitor, mapped straight onto the
            // HubSpot contact so every lead from this page is tagged consistently.
            const hiddenField = (field, value) => {
                const name = String(field || "").trim()
                const val = String(value || "").trim()
                return name && val ? [{ name, value: val }] : []
            }
            // Whatever this visit knows about its own origin: the parameters on
            // the current URL win, falling back to what was captured on arrival.
            const tracking = (() => {
                const merged = readStoredTracking()
                if (typeof window === "undefined") return merged
                const params = new URLSearchParams(window.location.search)
                UTM_KEYS.forEach((key) => {
                    const value = params.get(key)
                    if (value) merged[key] = value.trim().slice(0, 250)
                })
                return merged
            })()

            const hiddenFields = [
                ...hiddenField(industryHubspotField, industryHubspotValue),
                ...hiddenField(sourceHubspotField, sourceHubspotValue),
                ...hiddenField(subSourceHubspotField, subSourceHubspotValue),
                ...hiddenField(utmSourceHubspotField, tracking.utm_source),
                ...hiddenField(utmMediumHubspotField, tracking.utm_medium),
                ...hiddenField(utmCampaignHubspotField, tracking.utm_campaign),
                ...hiddenField(utmTermHubspotField, tracking.utm_term),
                ...hiddenField(utmContentHubspotField, tracking.utm_content),
            ]

            // The HubSpot tracking cookie stitches this submission onto the
            // visitor's existing analytics session instead of creating an
            // origin-less contact.
            const hubspotUtk = (() => {
                if (typeof document === "undefined") return ""
                const match = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]*)/)
                return match ? decodeURIComponent(match[1]) : ""
            })()

            const submissionContext =
                typeof window !== "undefined"
                    ? {
                          pageUri: window.location.href,
                          pageName: document?.title || "Beamr landing page",
                          ...(hubspotUtk ? { hutk: hubspotUtk } : {}),
                      }
                    : undefined

            const submitTo = (fields) =>
                fetch(
                    `${baseUrl}/submissions/v3/integration/submit/${encodeURIComponent(
                        String(hubspotPortalId).trim()
                    )}/${encodeURIComponent(String(hubspotFormId).trim())}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ fields, context: submissionContext }),
                    }
                )

            let response = await submitTo([...visibleFields, ...hiddenFields])

            // sub_source and lead_source are dropdown properties in HubSpot: a value
            // that isn't one of their options makes HubSpot reject the whole
            // submission. A tagging mistake must never cost us the lead, so fall
            // back to the visitor's own answers and let the tagging be fixed later.
            if (!response.ok && hiddenFields.length > 0) {
                response = await submitTo(visibleFields)
            }

            if (!response.ok) {
                throw new Error("HubSpot submission failed")
            }

            setLeadForm(initialLeadForm)
            setLeadErrors({})
            setSubmitStatus("success")
            setSubmitMessage(formSuccessMessage)
        } catch (error) {
            setSubmitStatus("error")
            setSubmitMessage(formErrorMessage)
        }
    }

    React.useEffect(() => {
        if (typeof window === "undefined") return
        const params = new URLSearchParams(window.location.search)
        const captured = {}
        UTM_KEYS.forEach((key) => {
            const value = params.get(key)
            if (value) captured[key] = value.trim().slice(0, 250)
        })
        if (Object.keys(captured).length === 0) return
        try {
            window.sessionStorage.setItem(
                TRACKING_STORAGE_KEY,
                JSON.stringify({ ...readStoredTracking(), ...captured })
            )
        } catch (error) {
            // Can't remember them for later, but this page load still reports
            // its own parameters straight off the URL at submit time.
        }
    }, [])

    React.useEffect(() => {
        if (typeof document === "undefined") return
        if (seoTitle) document.title = seoTitle
        if (seoDescription) {
            let meta = document.querySelector('meta[name="description"]')
            if (!meta) {
                meta = document.createElement("meta")
                meta.setAttribute("name", "description")
                document.head.appendChild(meta)
            }
            meta.setAttribute("content", seoDescription)
        }
    }, [seoTitle, seoDescription])

    React.useEffect(() => {
        if (typeof window === "undefined" || window.innerWidth >= 768 || !compareRef.current) return
        const node = compareRef.current
        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0]
            if (!entry?.isIntersecting || autoSweepDone.current) return
            autoSweepDone.current = true
            observer.disconnect()
            const sequence = [
                { from: 52, to: 22, duration: 420 },
                { from: 22, to: 78, duration: 900 },
                { from: 78, to: 52, duration: 520 },
            ]
            let index = 0
            const run = () => {
                const step = sequence[index]
                if (!step) return
                const start = performance.now()
                const tick = (now: number) => {
                    const t = Math.min(1, (now - start) / step.duration)
                    const eased = t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t + 2, 2) / 2
                    setSplit(step.from + (step.to - step.from) * eased)
                    if (t < 1) autoSweepFrame.current = requestAnimationFrame(tick)
                    else { index += 1; run() }
                }
                autoSweepFrame.current = requestAnimationFrame(tick)
            }
            run()
        }, { threshold: 0.5 })
        observer.observe(node)
        return () => {
            observer.disconnect()
            if (autoSweepFrame.current) cancelAnimationFrame(autoSweepFrame.current)
        }
    }, [])

    const smoothScrollToForm = (event) => {
        if (isCanvas && enableCanvasTextEditing) { event.preventDefault(); return }
        if (typeof document === "undefined") return
        const target = document.getElementById("lead-form")
        if (target) {
            event.preventDefault()
            target.scrollIntoView({ behavior: "smooth", block: "start" })
        }
    }

    const toggleVideo = () => {
        const before = beforeRef.current
        const after = afterRef.current
        if (!before || !after) return
        if (before.paused) {
            before.play().catch(() => {})
            after.play().catch(() => {})
        } else {
            before.pause()
            after.pause()
        }
    }

    const css = `
      * { box-sizing:border-box; }
      .beamr-page { width:100%; background:${blue}; color:${white}; overflow:hidden; font-family:${fontFamily}; }
      .beamr-wrap { width:min(1180px, calc(100% - 48px)); margin:0 auto; position:relative; z-index:3; }
      [data-beamr-inline-edit="true"] { cursor:text; white-space:pre-wrap; border-radius:3px; }
      [data-beamr-inline-edit="true"]:hover { outline:1px dashed currentColor; outline-offset:3px; }
      [data-beamr-inline-edit="true"]:focus { outline:2px solid currentColor; outline-offset:3px; }
      [data-beamr-inline-edit="true"]:empty:before { content:attr(data-placeholder); opacity:.42; }

      /* HERO */
      .beamr-hero { min-height:82vh; display:flex; align-items:center; position:relative; padding:74px 0 56px; overflow:hidden; }
      .beamr-hero-grid { display:grid; grid-template-columns:1.05fr .95fr; gap:28px; align-items:center; min-height:650px; }
      .beamr-hero-copy { position:relative; z-index:4; padding:40px 0; }
      .beamr-hero-brand { display:flex; align-items:center; min-height:38px; margin-bottom:26px; }
      .beamr-hero-logo { display:block; width:auto; height:auto; max-width:148px; max-height:34px; object-fit:contain; }
      .beamr-hero-brand-fallback { display:flex; align-items:center; gap:9px; font-size:22px; font-weight:850; letter-spacing:-.02em; }
      .beamr-hero-brand-fallback .beamr-icon { width:29px; height:29px; border-width:4px; }
      .beamr-hero-brand-fallback .beamr-icon:after { width:8px; height:8px; border-width:3px; }
      .beamr-hero-name { font-size:${heroNameSize}px; line-height:1.2; letter-spacing:.14em; font-weight:750; opacity:.92; margin-bottom:18px; }
      .beamr-kicker { font-size:${heroEyebrowSize}px; letter-spacing:${heroEyebrowTracking}em; font-weight:${heroEyebrowWeight};  margin-bottom:22px; opacity:.92; }
      .beamr-h1 { font-size:clamp(42px,6vw,${heroTitleSize}px); line-height:.84; letter-spacing:${heroTitleTracking}em; font-weight:${heroTitleWeight};  margin:0; max-width:780px; }
      .beamr-h1 .accent { color:${yellow}; font-style:italic; }
      .beamr-sub { max-width:650px; font-size:clamp(16px,1.55vw,${heroSubheadSize}px); line-height:1.34; margin-top:28px; font-weight:430; }
      .beamr-lead-copy .beamr-personal-note { max-width:500px; margin-top:26px; }
      .beamr-personal-note { max-width:650px; margin-top:24px; padding:18px 20px; border-left:3px solid ${yellow}; background:rgba(255,255,255,.08); border-radius:0 16px 16px 0; }
      .beamr-personal-note p { margin:0; font-size:${boothNoteSize}px; line-height:1.5; font-weight:500; }
      .beamr-personal-byline { display:flex; gap:7px; align-items:baseline; flex-wrap:wrap; margin-top:12px; font-size:12px; line-height:1.3; }
      .beamr-personal-name { font-weight:850; }
      .beamr-personal-title { opacity:.76; }
      .beamr-hero-meta { margin-top:18px; font-size:${heroBoothSize}px; line-height:1.2; letter-spacing:.14em; font-weight:750; opacity:.92; max-width:560px; }
      .beamr-cta { display:inline-flex; align-items:center; justify-content:center; min-height:48px; background:${white}; color:${black}; text-decoration:none; padding:16px 24px; border-radius:999px; font-weight:850; margin-top:30px; font-size:${ctaFontSize}px; transition:transform .2s ease, box-shadow .2s ease; box-shadow:0 12px 34px rgba(0,0,0,.12); }
      .beamr-cta:hover { transform:translateY(-2px); box-shadow:0 16px 42px rgba(0,0,0,.16); }
      .beamr-hero .beamr-cta { background:${navy}; color:${white}; box-shadow:0 12px 24px rgba(47,88,165,.22); position:relative; z-index:5; }
      .beamr-trusted { margin-top:28px; display:flex; flex-direction:column; gap:14px; max-width:100%; }
      .beamr-trusted-label { font-size:${trustedLabelSize}px; line-height:1.2; letter-spacing:.16em;  font-weight:700; opacity:.8; }
      .beamr-trusted-logos { display:flex; flex-wrap:wrap; align-items:center; gap:${trustedByGap}px; }
      .beamr-trusted-logo { display:block; width:auto; object-fit:contain; max-width:150px; filter:brightness(0) invert(1); opacity:.96; }

      .beamr-hero-visual { align-self:stretch; position:relative; min-height:700px; z-index:3; display:flex; align-items:flex-end; justify-content:center; }
      .beamr-person-frame { position:absolute; inset:22px -8vw -56px -20px; display:flex; align-items:flex-end; justify-content:center; }
      .beamr-person { width:100%; height:100%; object-fit:contain; object-position:center bottom; display:block; filter:drop-shadow(0 34px 34px rgba(18,37,86,.22)); }
      .beamr-person-placeholder { width:86%; height:86%; align-self:flex-end; border:3px dashed rgba(255,255,255,.42); border-radius:38px 38px 0 0; background:linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.16)); display:flex; align-items:center; justify-content:center; text-align:center; padding:40px; font-size:15px; letter-spacing:.11em; line-height:1.5;  font-weight:800; }
      .beamr-team-info { position:absolute; right:${teamInfoRight}px; bottom:${teamInfoBottom}px; z-index:5; max-width:${teamInfoMaxWidth}px; text-align:left; color:${white}; padding:13px 16px; border-radius:16px; background:${teamInfoBackground}; backdrop-filter:blur(9px); -webkit-backdrop-filter:blur(9px); box-shadow:0 12px 32px rgba(0,0,0,.18); }
      .beamr-team-name { font-size:13px; line-height:1.15; letter-spacing:.12em;  font-weight:800; }
      .beamr-team-title { margin-top:6px; font-size:12px; line-height:1.3; letter-spacing:.06em; font-weight:500; opacity:.88; }

      .beamr-lines { position:absolute; inset:0; z-index:1; pointer-events:none; overflow:hidden; }
      .beamr-lines svg { width:100%; height:100%; display:block; }

      /* REVEAL */
      .beamr-reveal { background:${white}; color:${black}; padding:112px 0; position:relative; }
      .beamr-reveal-grid { display:grid; grid-template-columns:1.08fr .92fr; gap:72px; align-items:end; }
      .beamr-display { font-size:clamp(50px,7vw,104px); line-height:.88; letter-spacing:${revealTitleTracking}em; font-weight:${revealTitleWeight};  margin:0; }
      .beamr-copy { font-size:clamp(20px,2vw,29px); line-height:1.28; max-width:545px; margin:0 0 8px; }
      .beamr-copy strong { font-weight:850; }

      /* ROUTE */
      .beamr-route { background:${navy}; color:${white}; padding:88px 0 88px; position:relative; }
      .beamr-route-title { font-size:${routeEyebrowSize}px; letter-spacing:${routeEyebrowTracking}em;  opacity:.76; margin-bottom:56px; font-weight:${routeEyebrowWeight}; }
      .beamr-stops { position:relative; display:grid; grid-template-columns:repeat(3,1fr); gap:42px; }
      .beamr-track { position:absolute; left:0; right:0; top:28px; height:10px; background:${pink}; border-radius:999px; }
      .beamr-stop { position:relative; padding-top:80px; }
      .beamr-dot { position:absolute; top:9px; width:48px; height:48px; border-radius:50%; background:${navy}; border:10px solid ${pink}; }
      .beamr-stop:nth-of-type(3) .beamr-dot { border-color:${mint}; }
      .beamr-stop:nth-of-type(4) .beamr-dot { border-color:${yellow}; }
      .beamr-stop-num { opacity:.62; font-size:${stepNumSize}px; letter-spacing:.15em; font-weight:800; margin-bottom:10px; }
      .beamr-stop h3 { font-size:clamp(26px,3.3vw,${stepTitleSize}px); line-height:.94;  margin:0 0 15px; }
      .beamr-stop.stop-0 h3 { font-weight:${stop1TitleWeight}; letter-spacing:${stop1TitleTracking}em; }
      .beamr-stop.stop-1 h3 { font-weight:${stop2TitleWeight}; letter-spacing:${stop2TitleTracking}em; }
      .beamr-stop.stop-2 h3 { font-weight:${stop3TitleWeight}; letter-spacing:${stop3TitleTracking}em; }
      .beamr-stop p { font-size:${stepBodySize}px; line-height:1.42; max-width:310px; margin:0; opacity:.88; }
      .beamr-stop-tag { display:inline-block; margin-top:18px; font-size:${stepTagSize}px; letter-spacing:.12em;  font-weight:850; border:1px solid rgba(255,255,255,.35); padding:7px 10px; border-radius:999px; }

      /* COMPARISON */
      .beamr-proof { background:${pink}; color:${navy}; padding:86px 0 92px; }
      .beamr-proof .beamr-display { font-size:clamp(38px,5.4vw,${proofTitleSize}px); font-weight:${proofTitleWeight}; letter-spacing:${proofTitleTracking}em; }
      .beamr-proof-head { display:grid; grid-template-columns:1.1fr .9fr; gap:60px; align-items:end; margin-bottom:50px; }
      .beamr-proof .beamr-copy { color:${navy}; }
      .beamr-compare { position:relative; aspect-ratio:16/9; width:100%; overflow:hidden; border-radius:28px; background:${navy}; box-shadow:0 25px 80px rgba(0,0,0,.18); }
      .beamr-media { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; display:block; }
      .beamr-poster-layer { position:absolute; inset:0; z-index:3; background-size:cover; background-position:center; pointer-events:none; }
      .beamr-clip { overflow:hidden; position:absolute; inset:0 auto 0 0; height:100%; z-index:2; }
      .beamr-clip video { width:min(1180px, calc(100vw - 48px)); height:100%; max-width:none; object-fit:cover; }
      .beamr-video-placeholder { position:absolute; inset:0; }
      .beamr-divider { position:absolute; top:0; bottom:0; width:3px; background:${white}; transform:translateX(-1px); z-index:4; }
      .beamr-handle { position:absolute; top:50%; width:58px; height:58px; border-radius:50%; background:${white}; transform:translate(-50%,-50%); display:grid; place-items:center; font-weight:700; color:${navy}; box-shadow:0 6px 22px rgba(0,0,0,.24); z-index:5; pointer-events:none; }
      .beamr-range { position:absolute; inset:0; width:100%; height:100%; opacity:0; cursor:ew-resize; z-index:6; }
      .beamr-side-info { position:absolute; top:20px; z-index:7; pointer-events:none; display:flex; flex-direction:column; gap:9px; max-width:min(44%,430px); }
      .beamr-side-info.source { left:20px; align-items:flex-start; }
      .beamr-side-info.output { right:20px; align-items:flex-end; }
      .beamr-label { padding:9px 13px; background:rgba(255,255,255,.94); color:${navy}; font-size:12px; font-weight:850; letter-spacing:.11em;  border-radius:999px; white-space:nowrap; }
      .beamr-metrics { display:grid; gap:5px; min-width:150px; padding:10px 12px; border-radius:12px; background:rgba(17,17,17,.66); color:${white}; backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px); }
      .beamr-side-info.output .beamr-metrics { text-align:right; }
      .beamr-metric { display:grid; grid-template-columns:auto 1fr; align-items:baseline; gap:12px; padding:0; }
      .beamr-side-info.output .beamr-metric { grid-template-columns:1fr auto; }
      .beamr-side-info.output .beamr-metric-key { order:1; }
      .beamr-side-info.output .beamr-metric-value { order:2; }
      .beamr-metric-value { font-size:12px; line-height:1.15; font-weight:800; white-space:nowrap; }
      .beamr-metric-key { font-size:9px; line-height:1.15; letter-spacing:.08em;  opacity:.66; white-space:nowrap; }
      .beamr-video-controls { position:absolute; left:20px; bottom:18px; z-index:8; display:flex; gap:8px; align-items:center; }
      .beamr-video-btn { appearance:none; border:0; border-radius:999px; padding:9px 13px; background:rgba(255,255,255,.94); color:${navy}; font-weight:850; cursor:pointer; font-family:inherit; }


      .beamr-proof-steps { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; margin-top:26px; background:rgba(47,88,165,.22); border:1px solid rgba(47,88,165,.22); border-radius:20px; overflow:hidden; }
      .beamr-proof-step { background:rgba(255,255,255,.22); padding:22px 24px; font-size:15px; line-height:1.42; }
      .beamr-proof-step strong { display:block; font-size:13px; letter-spacing:.08em; margin-bottom:7px; }
      .beamr-beyond-archive { max-width:900px; margin:18px auto 0; text-align:center; font-size:15px; line-height:1.55; opacity:.72; }
      .beamr-proof-vista-stat { margin:16px 0 0; font-size:15px; line-height:1.4; font-weight:800; color:${navy}; }
      .beamr-proof-closing { margin:22px 0 0; font-size:20px; line-height:1.4; font-weight:750; }

      /* VISTA */
      .beamr-vista { background:${white}; color:${black}; padding:112px 0 120px; position:relative; }
      .beamr-vista-grid { display:grid; grid-template-columns:.92fr 1.08fr; gap:72px; align-items:start; }
      .beamr-vista-card { background:${yellow}; color:${navy}; padding:42px; border-radius:30px; position:sticky; top:28px; overflow:hidden; }
      .beamr-vista-card:after { content:"BEAMR VISTA"; position:absolute; right:-12px; bottom:-24px; font-size:110px; line-height:1; font-weight:700; letter-spacing:-.07em; opacity:.08; transform:rotate(-5deg); }
      .beamr-vista-heroEyebrowV28 { font-size:13px; letter-spacing:${vistaEyebrowTracking}em;  font-weight:${vistaEyebrowWeight}; margin-bottom:24px; }
      .beamr-vista-card h2 { font-size:clamp(48px,5.7vw,82px); line-height:.88; letter-spacing:${vistaTitleTracking}em; font-weight:${vistaTitleWeight};  margin:0; position:relative; z-index:1; }
      .beamr-vista-content { padding-top:12px; }
      .beamr-vista-content > p { font-size:clamp(21px,2vw,29px); line-height:1.3; margin:0 0 42px; max-width:600px; }
      .beamr-checks { display:grid; gap:0; border-top:1px solid rgba(17,17,17,.18); }
      .beamr-check { display:grid; grid-template-columns:48px 1fr; gap:16px; padding:23px 0; border-bottom:1px solid rgba(17,17,17,.18); align-items:start; }
      .beamr-check-num { width:36px; height:36px; display:grid; place-items:center; border-radius:50%; background:${navy}; color:${white}; font-size:12px; font-weight:850; }
      .beamr-check p { margin:3px 0 0; font-size:18px; line-height:1.4; }

      /* ABOUT / CREDIBILITY */
      .beamr-about { background:${navy}; color:${white}; padding:74px 0 78px; position:relative; overflow:hidden; }
      .beamr-about:after { content:""; position:absolute; width:420px; height:420px; border:72px solid rgba(255,255,255,.035); border-radius:50%; right:-160px; top:-220px; pointer-events:none; }
      .beamr-about-top { display:grid; grid-template-columns:.72fr 1.28fr; gap:64px; align-items:end; margin-bottom:46px; position:relative; z-index:2; }
      .beamr-about-heroEyebrowV28 { color:${yellow}; font-size:12px; line-height:1.2; letter-spacing:.18em;  font-weight:800; margin-bottom:12px; }
      .beamr-about h2 { margin:0; font-size:clamp(38px,4.7vw,66px); line-height:.92; letter-spacing:${aboutTitleTracking}em; font-weight:${aboutTitleWeight};  max-width:760px; }
      .beamr-about-body { margin:0 0 3px; font-size:18px; line-height:1.45; max-width:520px; opacity:.84; }
      .beamr-about-stats { display:grid; grid-template-columns:repeat(4,1fr); border-top:1px solid rgba(255,255,255,.24); border-bottom:1px solid rgba(255,255,255,.24); position:relative; z-index:2; }
      .beamr-about-stat { padding:24px 26px 25px 0; min-height:122px; }
      .beamr-about-stat + .beamr-about-stat { border-left:1px solid rgba(255,255,255,.18); padding-left:26px; }
      .beamr-about-value { color:${white}; font-size:clamp(26px,3vw,40px); line-height:1; letter-spacing:-.035em; font-weight:700;  margin-bottom:10px; white-space:nowrap; }
      .beamr-about-label { font-size:13px; line-height:1.4; opacity:.72; max-width:205px; }

      /* EVENT */
      .beamr-event { background:${blue}; color:${white}; padding:112px 0 80px; position:relative; }
      .beamr-event-card { background:${yellow}; color:${navy}; border-radius:34px; padding:clamp(36px,6vw,80px); position:relative; overflow:hidden; }
      .beamr-event-card h2 { font-size:clamp(40px,5.7vw,${eventTitleSize}px); line-height:.86; letter-spacing:${eventTitleTracking}em; font-weight:${eventTitleWeight};  margin:0 0 28px; max-width:980px; }
      .beamr-event-card p { font-size:clamp(18px,2vw,27px); max-width:720px; line-height:1.28; margin:0; }
      .beamr-event-meta { margin-top:28px; font-size:14px; letter-spacing:.12em; font-weight:850;  }
      .beamr-event .beamr-cta { background:${navy}; color:${white}; margin-top:0; }
      .beamr-event-actions { display:flex; flex-wrap:wrap; gap:12px; margin-top:30px; }
      .beamr-event .beamr-cta-secondary { background:transparent; color:${navy}; border:2px solid ${navy}; box-shadow:none; }


      .beamr-creds { background:${navy}; color:${white}; }
      .beamr-cred-strip { display:grid; grid-template-columns:repeat(3,1fr); border-top:3px solid ${yellow}; padding:28px 0 32px; }
      .beamr-cred { padding:0 28px 0 0; }
      .beamr-cred + .beamr-cred { border-left:1px solid rgba(255,255,255,.16); padding-left:28px; }
      .beamr-cred-value { color:${yellow}; font-size:${credValueSize}px; font-weight:700; line-height:1; margin-bottom:7px; }
      .beamr-cred-label { color:${white}; font-size:${credLabelSize}px; line-height:1.35; opacity:.62; }
      .beamr-textarea { min-height:84px; resize:vertical; }
      .beamr-followup-note { margin-top:12px; font-size:${followupNoteSize}px; line-height:1.45; opacity:.7; }

      /* LEAD FORM */
      .beamr-lead { background:${navy}; color:${white}; padding:64px 0 104px; position:relative; }
      .beamr-lead-grid { display:grid; grid-template-columns:.88fr 1.12fr; gap:72px; align-items:start; }
      .beamr-lead-copy { position:sticky; top:30px; }
      .beamr-lead-heroEyebrowV28 { font-size:${leadEyebrowSize}px; letter-spacing:.17em; font-weight:800;  opacity:.75; margin-bottom:20px; }
      .beamr-lead h2 { font-size:clamp(36px,5vw,${leadTitleSize}px); line-height:.88; letter-spacing:${leadTitleTracking}em; font-weight:${leadTitleWeight};  margin:0 0 26px; }
      .beamr-lead-copy p { font-size:clamp(17px,1.8vw,${leadBodySize}px); line-height:1.32; margin:0; max-width:500px; opacity:.9; }
      .beamr-form-shell { background:${white}; color:${black}; border-radius:30px; padding:clamp(28px,4vw,48px); min-height:330px; box-shadow:0 25px 80px rgba(0,0,0,.16); position:relative; }
      .beamr-lead-form { display:flex; flex-direction:column; gap:18px; }
      .beamr-field-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
      .beamr-field { display:flex; flex-direction:column; gap:7px; }
      .beamr-field.full { grid-column:1 / -1; }
      .beamr-field label { color:${black}; font-size:${formLabelSize}px; line-height:1.2; font-weight:700; }
      .beamr-required { color:${pink}; margin-left:4px; }
      .beamr-input { width:100%; border:1px solid rgba(17,17,17,.18); border-radius:12px; padding:13px 15px; font-family:${fontFamily}; font-size:${formInputSize}px; background:${white}; color:${black}; outline:none; transition:border-color .2s ease, box-shadow .2s ease; }
      .beamr-input:focus { border-color:${navy}; box-shadow:0 0 0 4px rgba(47,88,165,.12); }
      .beamr-input.error { border-color:#d92d20; box-shadow:0 0 0 4px rgba(217,45,32,.08); }
      .beamr-field-error { font-size:12px; line-height:1.3; color:#b42318; min-height:16px; }
      .beamr-form-actions { display:flex; align-items:center; gap:14px; flex-wrap:wrap; margin-top:2px; }
      .beamr-form-submit { appearance:none; border:0; border-radius:999px; padding:15px 24px; background:${navy}; color:${white}; font-family:${fontFamily}; font-size:${submitSize}px; font-weight:800; cursor:pointer; transition:transform .2s ease, opacity .2s ease, box-shadow .2s ease; box-shadow:0 12px 24px rgba(47,88,165,.18); }
      .beamr-form-submit:hover { transform:translateY(-1px); }
      .beamr-form-submit:disabled { cursor:wait; opacity:.78; transform:none; }
      .beamr-form-status { font-size:13px; line-height:1.45; font-weight:700; }
      .beamr-form-status.loading { color:${navy}; }
      .beamr-form-status.success { color:#067647; }
      .beamr-form-status.error { color:#b42318; }
      .beamr-form-disclaimer { margin-top:4px; font-size:${disclaimerSize}px; line-height:1.5; color:rgba(17,17,17,.68); }
      .beamr-success-state { min-height:250px; display:flex; align-items:center; justify-content:center; text-align:left; font-size:20px; line-height:1.45; font-weight:750; color:${navy}; padding:28px; }

      /* AMSTERDAM BOTTOM */
      .beamr-amsterdam-bottom { background:${pink}; min-height:360px; position:relative; overflow:hidden; }
      .beamr-amsterdam-art { position:absolute; width:${illustrationWidth}%; max-width:none; height:auto; right:${illustrationRight}px; bottom:${illustrationBottom}px; opacity:${illustrationOpacity}; z-index:2; pointer-events:none; user-select:none; }
      .beamr-amsterdam-fallback { position:absolute; width:${illustrationWidth}%; right:${illustrationRight}px; bottom:${illustrationBottom}px; opacity:${illustrationOpacity}; z-index:2; pointer-events:none; }
      .beamr-amsterdam-fallback svg { width:100%; height:auto; display:block; }
      .beamr-amsterdam-lines { position:absolute; inset:0; pointer-events:none; opacity:.95; }
      .beamr-amsterdam-footer { position:absolute; left:0; right:0; bottom:0; z-index:4; background:${navy}; color:${white}; }
      .beamr-amsterdam-footer .beamr-wrap { display:flex; justify-content:space-between; align-items:center; gap:24px; min-height:76px; }

      .beamr-footer-bar { background:${navy}; border-top:1px solid rgba(255,255,255,.16); }
      .beamr-footer { display:flex; justify-content:space-between; align-items:center; gap:24px; padding:26px 0 30px; font-weight:800; }
      .beamr-mark { display:flex; align-items:center; gap:10px; font-size:24px; }
      .beamr-logo { display:block; width:auto; max-width:190px; max-height:${footerLogoHeight}px; object-fit:contain; }
      .beamr-icon { width:34px; height:34px; border-radius:7px; border:5px solid currentColor; display:grid; place-items:center; }
      .beamr-icon:after { content:""; width:10px; height:10px; border-radius:50%; border:4px solid currentColor; }
      .beamr-guide { font-size:${footerTaglineSize}px; letter-spacing:.08em;  text-align:right; }

      @media (max-width: 900px) {
        .beamr-hero-grid { grid-template-columns:1fr; min-height:auto; }
        .beamr-hero-copy { padding-top:10px; }
        .beamr-hero-visual { min-height:610px; margin-top:-35px; }
        .beamr-person-frame { inset:0 -8vw -56px -8vw; }
        .beamr-team-info { right:24px; bottom:32px; max-width:min(${teamInfoMaxWidth}px, 48vw); }
      }

      @media (max-width: 760px) {
        .beamr-wrap { width:min(100% - 28px, 1180px); }
        .beamr-hero { min-height:auto; padding:28px 0 30px; align-items:flex-start; }
        .beamr-hero-grid { gap:4px; }
        .beamr-hero-copy { padding:6px 0 0; }
        .beamr-hero .beamr-lines { display:none; }
        .beamr-hero-brand { margin-bottom:20px; min-height:30px; }
        .beamr-hero-logo { max-width:118px; max-height:28px; }
        .beamr-hero-brand-fallback { font-size:19px; }
        .beamr-kicker { font-size:calc(${heroEyebrowSize}px * .85); letter-spacing:.11em; margin-bottom:14px; }
        .beamr-h1 { font-size:${mobileHeroTitleSize}px; line-height:.93; letter-spacing:-.045em; max-width:100%; }
        .beamr-sub { font-size:calc(${heroSubheadSize}px * .74); line-height:1.4; max-width:100%; margin-top:20px; }
        .beamr-hero-copy > * { position:relative; }
        .beamr-hero .beamr-cta { position:relative; inset:auto; float:none; clear:both; display:flex; width:100%; box-sizing:border-box; margin:24px 0 0; }
        .beamr-personal-note { margin-top:18px; padding:15px 16px; border-radius:0 13px 13px 0; }
        .beamr-personal-note p { font-size:14px; line-height:1.48; }
        .beamr-hero-meta { margin-top:14px; font-size:calc(${heroBoothSize}px * .85); letter-spacing:.08em; clear:both; }
        .beamr-cta { width:100%; min-height:54px; justify-content:center; margin-top:18px; padding:16px 20px; font-size:${ctaFontSize}px; line-height:1.1; border-radius:14px; box-shadow:0 10px 28px rgba(0,0,0,.16); text-align:center; }
        .beamr-cta:active { transform:scale(.985); box-shadow:0 6px 18px rgba(0,0,0,.14); }
        .beamr-event-actions { display:grid; grid-template-columns:1fr; gap:10px; width:100%; }
        .beamr-event .beamr-cta, .beamr-event .beamr-cta-secondary { width:100%; min-height:54px; margin-top:0; border-radius:14px; padding:16px 18px; }
        .beamr-form-actions { display:block; width:100%; margin-top:4px; }
        .beamr-form-submit { width:100%; min-height:54px; border-radius:14px; padding:16px 18px; font-size:${submitSize}px; box-shadow:0 10px 24px rgba(47,88,165,.22); }
        .beamr-form-submit:active { transform:scale(.985); }
        .beamr-form-status { margin-top:10px; }
        .beamr-trusted { margin-top:22px; gap:10px; }
        .beamr-trusted-label { font-size:calc(${trustedLabelSize}px * .84); letter-spacing:.1em; }
        .beamr-trusted-logos { gap:16px; }
        .beamr-trusted-logo { max-width:105px; max-height:22px; }
        .beamr-hero-visual { min-height:330px; margin-top:0; }
        .beamr-person-frame { inset:0 -8vw -26px -8vw; }
        .beamr-team-info { left:14px; right:auto; bottom:14px; max-width:60vw; padding:9px 12px; border-radius:12px; }
        .beamr-team-name, .beamr-team-title { font-size:10px; }
        .beamr-reveal-grid, .beamr-proof-head, .beamr-vista-grid, .beamr-lead-grid { grid-template-columns:1fr; gap:22px; }
        .beamr-proof-head .beamr-display { order:1; }
        .beamr-proof-head .beamr-copy { order:2; }
        .beamr-reveal, .beamr-route, .beamr-proof, .beamr-vista, .beamr-event, .beamr-lead { padding-top:52px; padding-bottom:56px; }
        .beamr-proof .beamr-display { font-size:${mobileProofTitleSize}px; line-height:.96; }
        .beamr-proof-head { margin-bottom:24px; }
        .beamr-proof .beamr-copy { font-size:17px; line-height:1.42; }
        .beamr-event h2 { font-size:${mobileEventTitleSize}px !important; line-height:.98 !important; }
        .beamr-lead h2 { font-size:${mobileLeadTitleSize}px !important; line-height:1 !important; }

        .beamr-stops { grid-template-columns:1fr; gap:0; padding-left:58px; }
        .beamr-track { left:18px; top:0; bottom:0; width:9px; height:auto; right:auto; }
        .beamr-stop { padding:0 0 54px; }
        .beamr-dot { left:-58px; top:0; width:44px; height:44px; }

        .beamr-compare { border-radius:18px; aspect-ratio:16/10; }
        .beamr-clip video { width:calc(100vw - 28px); }
        .beamr-side-info { top:12px; max-width:46%; gap:7px; }
        .beamr-side-info.source { left:12px; }
        .beamr-side-info.output { right:12px; }
        .beamr-label { padding:7px 10px; font-size:10px; }
        .beamr-metrics { gap:4px; min-width:124px; padding:8px 9px; border-radius:9px; }
        .beamr-metric { gap:8px; }
        .beamr-metric-value { font-size:10px; }
        .beamr-metric-key { font-size:7px; }
        .beamr-video-controls { left:12px; bottom:12px; }

        .beamr-vista-card { position:relative; top:auto; border-radius:24px; padding:30px; }
        .beamr-about { padding:66px 0 70px; }
        .beamr-about-top { grid-template-columns:1fr; gap:22px; margin-bottom:34px; }
        .beamr-about-stats { grid-template-columns:1fr 1fr; }
        .beamr-proof-steps { grid-template-columns:1fr; margin-top:18px; }
        .beamr-proof-step { padding:16px 18px; font-size:14px; }
        .beamr-beyond-archive { text-align:left; font-size:14px; margin-top:16px; }
        .beamr-proof-vista-stat { font-size:14px; margin-top:14px; }
        .beamr-proof-closing { font-size:18px; margin-top:18px; }
        .beamr-cred-strip { grid-template-columns:1fr; padding:22px 0 24px; }
        .beamr-cred { padding:14px 0; }
        .beamr-cred + .beamr-cred { border-left:0; border-top:1px solid rgba(255,255,255,.16); padding-left:0; }
        .beamr-about-stat { padding:20px 18px 20px 0; }
        .beamr-about-stat + .beamr-about-stat { padding-left:18px; }
        .beamr-about-stat:nth-child(3) { border-left:0; border-top:1px solid rgba(255,255,255,.18); }
        .beamr-about-stat:nth-child(4) { border-top:1px solid rgba(255,255,255,.18); }
        .beamr-lead-copy { position:relative; top:auto; }
        .beamr-form-shell { border-radius:20px; padding:20px; }
        .beamr-field-grid { grid-template-columns:1fr; }
        .beamr-amsterdam-bottom { min-height:300px; }
        .beamr-amsterdam-art, .beamr-amsterdam-fallback { width:120%; right:-34%; bottom:48px; opacity:.62; }
        .beamr-amsterdam-footer .beamr-wrap { flex-direction:column; align-items:flex-start; justify-content:center; padding:18px 0; }
        .beamr-event-card { border-radius:24px; }
        .beamr-footer { flex-direction:column; align-items:flex-start; }
        .beamr-guide { text-align:left; }
      }
    `

    const stops = [
        ["01", "stop1Title", "stop1Body", "stop1Tag"],
        ["02", "stop2Title", "stop2Body", "stop2Tag"],
        ["03", "stop3Title", "stop3Body", "stop3Tag"],
    ]

    const vistaPoints = ["vistaPoint1", "vistaPoint2", "vistaPoint3"]
    const trustedLogos = [
        { src: trustedLogo1, height: trustedLogo1Height },
        { src: trustedLogo2, height: trustedLogo2Height },
        { src: trustedLogo3, height: trustedLogo3Height },
        { src: trustedLogo4, height: trustedLogo4Height },
        { src: trustedLogo5, height: trustedLogo5Height },
    ].filter((item) => item.src)
    const aboutStats = [
        ["aboutStat1Value", "aboutStat1Label"],
        ["aboutStat2Value", "aboutStat2Label"],
        ["aboutStat3Value", "aboutStat3Label"],
        ["aboutStat4Value", "aboutStat4Label"],
    ]

    return (
        <div className="beamr-page">
            <style>{css}</style>

            <section className="beamr-hero">
                <motion.div
                    className="beamr-lines"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7 }}
                >
                    <svg viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
                        <motion.path
                            d="M-120 92 H470 Q560 92 630 150 L890 325 Q950 365 950 445 V650 Q950 730 1025 790 L1490 965"
                            fill="none"
                            stroke={navy}
                            strokeWidth="62"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.25, ease: "easeInOut" }}
                        />
                        <motion.path
                            d="M1275 -90 V360 Q1275 455 1215 525 L815 1000"
                            fill="none"
                            stroke={pink}
                            strokeWidth="76"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.42, delay: 0.1, ease: "easeInOut" }}
                        />
                    </svg>
                </motion.div>

                <div className="beamr-wrap beamr-hero-grid">
                    <div className="beamr-hero-copy">
                        <div className="beamr-hero-brand">
                            {beamrLogo ? (
                                <img src={beamrLogo} className="beamr-hero-logo" alt="Beamr" />
                            ) : (
                                <div className="beamr-hero-brand-fallback"><span className="beamr-icon" /> Beamr</div>
                            )}
                        </div>
                        <div className="beamr-kicker">{nativeOr(heroEyebrowSlot, <span {...editableTextProps("heroEyebrowV28", { singleLine: true })}>{inlineValue("heroEyebrowV28")}</span>)}</div>
                        <div className="beamr-hero-name"><span {...editableTextProps("heroNameLine", { singleLine: true })}>{inlineValue("heroNameLine")}</span></div>
                        <div className="beamr-h1">{nativeOr(heroTitleSlot, <><span {...editableTextProps("heroHeadlineTopV28", { singleLine: true })}>{inlineValue("heroHeadlineTopV28")}</span><br /><span className="accent" {...editableTextProps("heroHeadlineAccentV28", { singleLine: true })}>{inlineValue("heroHeadlineAccentV28")}</span></>)}</div>
                        <div className="beamr-sub">{nativeOr(heroSubheadSlot, <span {...editableTextProps("heroSubheadV28")}>{inlineValue("heroSubheadV28")}</span>)}</div>
                        <a className="beamr-cta" href="#lead-form" onClick={smoothScrollToForm}>
                            {nativeOr(heroCtaSlot, <span {...editableTextProps("heroCtaLabelV28", { singleLine: true })}>{inlineValue("heroCtaLabelV28")}</span>)}
                        </a>
                        <div className="beamr-hero-meta">{nativeOr(heroBoothSlot, <span {...editableTextProps("heroBoothMeta", { singleLine: true })}>{inlineValue("heroBoothMeta")}</span>)}</div>
                        {showTrustedBy && trustedLogos.length > 0 && (
                            <div className="beamr-trusted">
                                <div className="beamr-trusted-label">{nativeOr(trustedLabelSlot, <span {...editableTextProps("trustedByLabelV28", { singleLine: true })}>{inlineValue("trustedByLabelV28")}</span>)}</div>
                                <div className="beamr-trusted-logos">
                                    {trustedLogos.map((logo, i) => (
                                        <img
                                            key={i}
                                            className="beamr-trusted-logo"
                                            src={logo.src}
                                            alt="Trusted by logo"
                                            style={{ height: `${logo.height}px` }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <motion.div
                        className="beamr-hero-visual"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.22 }}
                    >
                        <div className="beamr-person-frame">
                            {heroImage ? (
                                <img className="beamr-person" src={heroImage} alt="Beamr team member" />
                            ) : (
                                <div className="beamr-person-placeholder">
                                    Add the new team-member creative here
                                </div>
                            )}
                        </div>
                        {(teamNameSlot || teamTitleSlot || inlineValue("teamMemberName") || inlineValue("teamMemberTitle")) && (
                            <div className="beamr-team-info">
                                {(teamNameSlot || inlineValue("teamMemberName")) && (
                                    <div className="beamr-team-name">{nativeOr(teamNameSlot, <span {...editableTextProps("teamMemberName", { singleLine: true })}>{inlineValue("teamMemberName")}</span>)}</div>
                                )}
                                {(teamTitleSlot || inlineValue("teamMemberTitle")) && (
                                    <div className="beamr-team-title">{nativeOr(teamTitleSlot, <span {...editableTextProps("teamMemberTitle", { singleLine: true })}>{inlineValue("teamMemberTitle")}</span>)}</div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>


            {showReveal && (
            <section className="beamr-reveal">
                <div className="beamr-wrap beamr-reveal-grid">
                    {nativeOr(revealHeadlineSlot, <h2 className="beamr-display" {...editableTextProps("revealHeadline")}>{inlineValue("revealHeadline")}</h2>)}
                    {nativeOr(revealBodySlot, <p className="beamr-copy" {...editableTextProps("revealBody")}>{inlineValue("revealBody")}</p>)}
                </div>
            </section>
            )}

            {showRoute && (
            <section className="beamr-route">
                <div className="beamr-wrap">
                    <div className="beamr-route-title">{nativeOr(routeEyebrowSlot, <span {...editableTextProps("routeEyebrow", { singleLine: true })}>{inlineValue("routeEyebrow")}</span>)}</div>
                    <div className="beamr-stops">
                        <div className="beamr-track" />
                        {stops.map(([num, titleKey, bodyKey, tagKey], index) => (
                            <div className={`beamr-stop stop-${index}`} key={titleKey}>
                                <div className="beamr-dot" />
                                <div className="beamr-stop-num">{num}</div>
                                <h3 {...editableTextProps(titleKey, { singleLine: true })}>{inlineValue(titleKey)}</h3>
                                <p {...editableTextProps(bodyKey)}>{inlineValue(bodyKey)}</p>
                                {inlineValue(tagKey) && (
                                    <span className="beamr-stop-tag" {...editableTextProps(tagKey, { singleLine: true })}>{inlineValue(tagKey)}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            )}

            {showComparison && beforeVideo && afterVideo && (
                <section className="beamr-proof">
                    <div className="beamr-wrap">
                        <div className="beamr-proof-head">
                            <h2 className="beamr-display" {...editableTextProps("proofHeadline")}>{inlineValue("proofHeadline")}</h2>
                            <p className="beamr-copy" {...editableTextProps("proofBody")}>{inlineValue("proofBody")}</p>
                        </div>

                        <div className="beamr-compare" ref={compareRef}>
                            {/* The optimized output is the full-width base; the source is
                                clipped over it from the left, so the labels either side of
                                the divider always describe what is actually under them. */}
                            <video
                                className="beamr-media"
                                ref={afterRef}
                                src={afterVideo}
                                poster={posterImage || undefined}
                                muted
                                loop
                                playsInline
                                preload="auto"
                            />
                            <div className="beamr-clip" style={{ width: `${split}%` }}>
                                <video
                                    className="beamr-media"
                                    ref={beforeRef}
                                    src={beforeVideo}
                                    poster={posterImage || undefined}
                                    muted
                                    loop
                                    playsInline
                                    preload="auto"
                                    onCanPlay={() => setComparisonReady(true)}
                                />
                            </div>

                            {posterImage && !comparisonReady && (
                                <div className="beamr-poster-layer" style={{ backgroundImage: `url(${posterImage})` }} />
                            )}

                            <div className="beamr-divider" style={{ left: `${split}%` }} />
                            <div className="beamr-handle" style={{ left: `${split}%` }} aria-hidden="true">⟺</div>

                            <input
                                className="beamr-range"
                                type="range"
                                min={0}
                                max={100}
                                step={0.1}
                                value={split}
                                onChange={(event) => setSplit(Number(event.target.value))}
                                aria-label="Drag to compare the source against the enhanced output"
                            />

                            <div className="beamr-side-info source">
                                <div className="beamr-label" {...editableTextProps("sourceLabel", { singleLine: true })}>{inlineValue("sourceLabel")}</div>
                                <div className="beamr-metrics">
                                    {[
                                        [metricResolutionLabel, "sourceResolution"],
                                        [metricBitrateLabel, "sourceBitrate"],
                                        [metricSizeLabel, "sourceSize"],
                                        [metricCodecLabel, "sourceCodec"],
                                    ].map(([label, key]) => (
                                        <div className="beamr-metric" key={key}>
                                            <div className="beamr-metric-value" {...editableTextProps(key, { singleLine: true })}>{inlineValue(key)}</div>
                                            <div className="beamr-metric-key">{label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="beamr-side-info output">
                                <div className="beamr-label" {...editableTextProps("outputLabel", { singleLine: true })}>{inlineValue("outputLabel")}</div>
                                <div className="beamr-metrics">
                                    {[
                                        [metricResolutionLabel, "outputResolution"],
                                        [metricBitrateLabel, "outputBitrate"],
                                        [metricSizeLabel, "outputSize"],
                                        [metricCodecLabel, "outputCodec"],
                                    ].map(([label, key]) => (
                                        <div className="beamr-metric" key={key}>
                                            <div className="beamr-metric-value" {...editableTextProps(key, { singleLine: true })}>{inlineValue(key)}</div>
                                            <div className="beamr-metric-key">{label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="beamr-video-controls">
                                <button className="beamr-video-btn" type="button" onClick={toggleVideo}>Play / Pause</button>
                            </div>
                        </div>

                        <div className="beamr-proof-steps">
                            {[
                                ["proofEnhanceTitle", "proofEnhance"],
                                ["proofOptimizeTitle", "proofOptimize"],
                                ["proofProveTitle", "proofProve"],
                            ].map(([titleKey, bodyKey]) => (
                                <div className="beamr-proof-step" key={titleKey}>
                                    <strong {...editableTextProps(titleKey, { singleLine: true })}>{inlineValue(titleKey)}</strong>
                                    <span {...editableTextProps(bodyKey)}>{inlineValue(bodyKey)}</span>
                                </div>
                            ))}
                        </div>

                        {inlineValue("proofVistaStat") && (
                            <p className="beamr-proof-vista-stat" {...editableTextProps("proofVistaStat")}>{inlineValue("proofVistaStat")}</p>
                        )}
                        {inlineValue("beyondArchiveText") && (
                            <p className="beamr-beyond-archive" {...editableTextProps("beyondArchiveText")}>{inlineValue("beyondArchiveText")}</p>
                        )}
                        {inlineValue("proofClosingLine") && (
                            <p className="beamr-proof-closing" {...editableTextProps("proofClosingLine")}>{inlineValue("proofClosingLine")}</p>
                        )}
                    </div>
                </section>
            )}

            {showVista && (
            <section className="beamr-vista">
                <div className="beamr-wrap beamr-vista-grid">
                    <div className="beamr-vista-card">
                        <div className="beamr-vista-heroEyebrowV28">{nativeOr(vistaEyebrowSlot, <span {...editableTextProps("vistaEyebrow", { singleLine: true })}>{inlineValue("vistaEyebrow")}</span>)}</div>
                        {nativeOr(vistaHeadlineSlot, <h2 {...editableTextProps("vistaHeadline")}>{inlineValue("vistaHeadline")}</h2>)}
                    </div>
                    <div className="beamr-vista-content">
                        {nativeOr(vistaBodySlot, <p {...editableTextProps("vistaBody")}>{inlineValue("vistaBody")}</p>)}
                        <div className="beamr-checks">
                            {vistaPoints.map((key, index) => (
                                <div className="beamr-check" key={key}>
                                    <div className="beamr-check-num">{String(index + 1).padStart(2, "0")}</div>
                                    <p {...editableTextProps(key)}>{inlineValue(key)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            )}

            {showAbout && (
            <section className="beamr-about">
                <div className="beamr-wrap">
                    <div className="beamr-about-top">
                        <div>
                            <div className="beamr-about-heroEyebrowV28">{nativeOr(aboutEyebrowSlot, <span {...editableTextProps("aboutEyebrow", { singleLine: true })}>{inlineValue("aboutEyebrow")}</span>)}</div>
                            {nativeOr(aboutHeadlineSlot, <h2 {...editableTextProps("aboutHeadline")}>{inlineValue("aboutHeadline")}</h2>)}
                        </div>
                        {nativeOr(aboutBodySlot, <p className="beamr-about-body" {...editableTextProps("aboutBody")}>{inlineValue("aboutBody")}</p>)}
                    </div>
                    <div className="beamr-about-stats">
                        {aboutStats.map(([valueKey, labelKey]) => (
                            <div className="beamr-about-stat" key={valueKey}>
                                <div className="beamr-about-value" {...editableTextProps(valueKey, { singleLine: true })}>{inlineValue(valueKey)}</div>
                                <div className="beamr-about-label" {...editableTextProps(labelKey)}>{inlineValue(labelKey)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            )}

            <section className="beamr-creds">
                <div className="beamr-wrap">
                    <div className="beamr-cred-strip">
                        <div className="beamr-cred"><div className="beamr-cred-value" {...editableTextProps("cred1Value", { singleLine: true })}>{inlineValue("cred1Value")}</div><div className="beamr-cred-label" {...editableTextProps("cred1Label")}>{inlineValue("cred1Label")}</div></div>
                        <div className="beamr-cred"><div className="beamr-cred-value" {...editableTextProps("cred2Value", { singleLine: true })}>{inlineValue("cred2Value")}</div><div className="beamr-cred-label" {...editableTextProps("cred2Label")}>{inlineValue("cred2Label")}</div></div>
                        <div className="beamr-cred"><div className="beamr-cred-value" {...editableTextProps("cred3Value", { singleLine: true })}>{inlineValue("cred3Value")}</div><div className="beamr-cred-label" {...editableTextProps("cred3Label")}>{inlineValue("cred3Label")}</div></div>
                    </div>
                </div>
            </section>

            <section className="beamr-lead" id="lead-form">
                <div className="beamr-wrap beamr-lead-grid">
                    <div className="beamr-lead-copy">
                        <div className="beamr-lead-heroEyebrowV28">{nativeOr(leadEyebrowSlot, <span {...editableTextProps("leadEyebrow", { singleLine: true })}>{inlineValue("leadEyebrow")}</span>)}</div>
                        {nativeOr(leadHeadlineSlot, <h2 {...editableTextProps("leadHeadline")}>{inlineValue("leadHeadline")}</h2>)}
                        {nativeOr(leadBodySlot, <p {...editableTextProps("leadBody")}>{inlineValue("leadBody")}</p>)}
                        {inlineValue("boothNote") && (
                            <div className="beamr-personal-note">
                                <p {...editableTextProps("boothNote")}>{inlineValue("boothNote")}</p>
                            </div>
                        )}
                    </div>

                    <div className="beamr-form-shell">
                        {submitStatus === "success" ? (
                            <div className="beamr-success-state">{submitMessage || formSuccessMessage}</div>
                        ) : (
                        <form className="beamr-lead-form" onSubmit={handleLeadSubmit} noValidate>
                            <div className="beamr-field-grid">
                                <div className="beamr-field">
                                    <label htmlFor="beamr-firstname"><span {...editableTextProps("firstNameLabel", { singleLine: true })}>{inlineValue("firstNameLabel")}</span><span className="beamr-required">*</span></label>
                                    <input id="beamr-firstname" className={`beamr-input ${leadErrors.firstname ? "error" : ""}`} type="text" name="firstname" autoComplete="given-name" value={leadForm.firstname} onChange={handleLeadFieldChange} required />
                                    <div className="beamr-field-error">{leadErrors.firstname || ""}</div>
                                </div>
                                <div className="beamr-field">
                                    <label htmlFor="beamr-lastname"><span {...editableTextProps("lastNameLabel", { singleLine: true })}>{inlineValue("lastNameLabel")}</span><span className="beamr-required">*</span></label>
                                    <input id="beamr-lastname" className={`beamr-input ${leadErrors.lastname ? "error" : ""}`} type="text" name="lastname" autoComplete="family-name" value={leadForm.lastname} onChange={handleLeadFieldChange} required />
                                    <div className="beamr-field-error">{leadErrors.lastname || ""}</div>
                                </div>
                                <div className="beamr-field full">
                                    <label htmlFor="beamr-email"><span {...editableTextProps("emailLabel", { singleLine: true })}>{inlineValue("emailLabel")}</span><span className="beamr-required">*</span></label>
                                    <input id="beamr-email" className={`beamr-input ${leadErrors.email ? "error" : ""}`} type="email" name="email" value={leadForm.email} onChange={handleLeadFieldChange} required />
                                    <div className="beamr-field-error">{leadErrors.email || ""}</div>
                                </div>
                                <div className="beamr-field">
                                    <label htmlFor="beamr-company"><span {...editableTextProps("companyLabel", { singleLine: true })}>{inlineValue("companyLabel")}</span></label>
                                    <input id="beamr-company" className="beamr-input" type="text" name="company" value={leadForm.company} onChange={handleLeadFieldChange} />
                                </div>
                                <div className="beamr-field">
                                    <label htmlFor="beamr-jobtitle"><span {...editableTextProps("jobTitleLabel", { singleLine: true })}>{inlineValue("jobTitleLabel")}</span></label>
                                    <input id="beamr-jobtitle" className="beamr-input" type="text" name="jobtitle" value={leadForm.jobtitle} onChange={handleLeadFieldChange} />
                                </div>
                            </div>

                            <div className="beamr-field full">
                                <label htmlFor="beamr-archive"><span {...editableTextProps("archivePrompt")}>{inlineValue("archivePrompt")}</span></label>
                                <textarea id="beamr-archive" className="beamr-input beamr-textarea" name="archive_content" value={leadForm.archive_content} onChange={handleLeadFieldChange} placeholder={archivePlaceholder} />
                            </div>

                            <div className="beamr-form-actions">
                                <button className="beamr-form-submit" type={isCanvas && enableCanvasTextEditing ? "button" : "submit"} disabled={submitStatus === "loading"}>
                                    {submitStatus === "loading" ? "Submitting…" : <span {...editableTextProps("formSubmitLabel", { singleLine: true })}>{inlineValue("formSubmitLabel")}</span>}
                                </button>
                                {submitMessage && (
                                    <div className={`beamr-form-status ${submitStatus}`}>{submitMessage}</div>
                                )}
                            </div>

                            <div className="beamr-followup-note" {...editableTextProps("formFollowupNote")}>{inlineValue("formFollowupNote")}</div>
                            <div className="beamr-form-disclaimer">{nativeOr(leadDisclaimerSlot, <span {...editableTextProps("leadDisclaimer")}>{inlineValue("leadDisclaimer")}</span>)}</div>
                        </form>
                        )}
                    </div>
                </div>
            </section>

            <footer className="beamr-footer-bar">
                <div className="beamr-wrap beamr-footer">
                    <div className="beamr-mark">
                        {beamrLogo ? (
                            <img src={beamrLogo} className="beamr-logo" alt="Beamr" />
                        ) : (
                            <><span className="beamr-icon" /> Beamr</>
                        )}
                    </div>
                    {inlineValue("footerTagline") && (
                        <div className="beamr-guide" {...editableTextProps("footerTagline", { singleLine: true })}>{inlineValue("footerTagline")}</div>
                    )}
                </div>
            </footer>

        </div>
    )
}

BeamrMetroWhatsNew.defaultProps = {
    heroEyebrowV28: "We Asked What’s New.",
    heroHeadlineTopV28: "Your viewers expect 4K.",
    heroHeadlineAccentV28: "So Give Them 4K.",
    heroSubheadV28:
        "Beamr brings the video you already have — archive, live or VOD — up to 4K with NVIDIA Video Super Resolution, then keeps the result efficient enough to store and deliver. Beamr VISTA validates that viewers actually see the difference.",
    heroCtaLabelV28: "See It On Your Content",
    ctaHref: "#lead-form",
    heroImage: "",
    heroNameLine: IBC_COPY.heroNameLine,
    heroBoothMeta: IBC_COPY.heroDateLine,
    teamMemberName: "Haggai Barel",
    teamMemberTitle: "COO, Beamr",
    teamInfoBottom: 54,
    teamInfoRight: 18,
    teamInfoMaxWidth: 220,
    teamInfoBackground: "rgba(18, 37, 86, 0.55)",
    showTrustedBy: true,
    showReveal: false,
    showRoute: true,
    showComparison: false,
    showVista: false,
    showAbout: false,
    trustedByLabelV28: "Working With",
    trustedLogo1: "",
    trustedLogo2: "",
    trustedLogo3: "",
    trustedLogo4: "",
    trustedLogo5: "",
    trustedLogo1Height: 24,
    trustedLogo2Height: 24,
    trustedLogo3Height: 24,
    trustedLogo4Height: 24,
    trustedLogo5Height: 24,
    trustedByGap: 22,

    heroEyebrowWeight: 800,
    heroEyebrowTracking: 0.18,
    heroTitleWeight: 700,
    heroTitleTracking: -0.06,
    heroTitleSize: 72,
    mobileHeroTitleSize: 46,
    mobileProofTitleSize: 38,
    mobileEventTitleSize: 40,
    mobileLeadTitleSize: 36,
    revealTitleWeight: 700,
    revealTitleTracking: -0.055,
    routeEyebrowWeight: 800,
    routeEyebrowTracking: 0.18,
    stop1TitleWeight: 700,
    stop1TitleTracking: -0.04,
    stop2TitleWeight: 700,
    stop2TitleTracking: -0.04,
    stop3TitleWeight: 700,
    stop3TitleTracking: -0.04,
    proofTitleWeight: 700,
    proofTitleTracking: -0.055,
    proofTitleSize: 62,
    vistaEyebrowWeight: 850,
    vistaEyebrowTracking: 0.17,
    vistaTitleWeight: 700,
    vistaTitleTracking: -0.05,
    eventTitleWeight: 700,
    eventTitleTracking: -0.058,
    eventTitleSize: 64,
    leadTitleWeight: 700,
    leadTitleTracking: -0.05,
    leadTitleSize: 54,

    revealHeadline: "ARCHIVE CONTENT. NEW RESOLUTION.",
    revealBody:
        "Beamr helps modernize archive footage for today's screens — and the same Super Resolution approach is also relevant for live streams and VOD libraries, while keeping the output optimized for storage and delivery.",

    routeEyebrow: "ONE PIPELINE. THREE MOVES.",
    stop1Title: "Enhance it",
    stop1Body:
        "Use AI-powered Super Resolution to reconstruct detail and enhance archive footage, live streams and VOD assets into higher-quality 1080p or 4K.",
    stop2Title: "Optimize it",
    stop2Body:
        "Beamr content-adaptive encoding keeps the enhanced output efficient, so better-looking video doesn't have to mean runaway bitrate.",
    stop3Title: "Validate it",
    stop3Body:
        "Use Beamr VISTA to validate the result with real viewers and confirm the improvement is actually perceived as better.",
    stop1Tag: "NVIDIA VIDEO SUPER RESOLUTION",
    stop2Tag: "BEAMR CABR",
    stop3Tag: "BEAMR VISTA",

    proofHeadline: "Go on. Look closer.",
    proofBody:
        "Most of your library was finished before 4K was the standard. It didn't get worse — the screens got better. Drag the line: same clip, same codec, and the numbers underneath are real. Then Beamr VISTA validates that viewers actually prefer it — real people, not a quality score.",
    proofEnhance: "NVIDIA Video Super Resolution reconstructs detail and takes HD up to 4K.",
    proofOptimize: "Beamr CABR keeps a bigger picture from becoming a bigger bill.",
    proofProve: "Beamr VISTA validates that \"looks better\" holds up with real viewers.",
    proofVistaStat: "",
    proofClosingLine: "This is the comparison I’ll be running at Booth 1.D22 — just on a much bigger screen.",
    proofEnhanceTitle: "Enhance",
    proofOptimizeTitle: "Optimize",
    proofProveTitle: "Validate",
    beyondArchiveText: "",
    metricResolutionLabel: "Resolution",
    metricBitrateLabel: "Bitrate",
    metricSizeLabel: "Size",
    metricCodecLabel: "Codec",

    beforeVideo: "",
    afterVideo: "",
    posterImage: "",
    sourceLabel: "Source",
    outputLabel: "4K Enhanced + Optimized",
    sourceResolution: "720p",
    sourceBitrate: "21.3 Mb/s",
    sourceSize: "55.9 MB",
    sourceCodec: "HEVC",
    outputResolution: "4K",
    outputBitrate: "—",
    outputSize: "—",
    outputCodec: "HEVC",

    vistaEyebrow: "The Proof Stop",
    vistaHeadline: "Don’t Just Call It Better. Prove It With Beamr VISTA.",
    vistaBody:
        "AI enhancement can make a video different. Beamr VISTA validates the thing that matters: did it actually make the viewing experience better — whether you're modernizing archives, improving VOD assets or evaluating live workflows?",
    vistaPoint1: "Test your own archive, live or VOD content instead of relying on generic demos.",
    vistaPoint2: "Collect subjective feedback from real viewers in a structured comparison.",
    vistaPoint3: "Turn 'looks better to us' into evidence you can use to make a production decision.",

    aboutEyebrow: "Why Beamr",
    aboutHeadline: "Deep Video Expertise. Built for What’s Next.",
    aboutBody: "Beamr is a video technology and image science company trusted in demanding media workflows by leading streaming and media companies.",
    aboutTitleWeight: 700,
    aboutTitleTracking: -0.045,
    aboutStat1Value: "EMMY®",
    aboutStat1Label: "Technology & Engineering Emmy® Award-winning technology",
    aboutStat2Value: "53",
    aboutStat2Label: "International granted patents",
    aboutStat3Value: "LIVE + VOD",
    aboutStat3Label: "Video technology built for demanding media workflows",
    aboutStat4Value: "NASDAQ: BMR",
    aboutStat4Label: "Beamr Imaging Ltd. is publicly traded",

    eventHeadline: IBC_COPY.yellowCardHeading,
    eventBody: IBC_COPY.yellowCardBody,
    eventMeta: "",
    eventCta: "Send Me Your Details",
    eventCtaHref: "#lead-form",
    secondaryCtaLabel: "Contact Us",
    secondaryCtaHref: "#lead-form",
    showSecondaryCta: false,

    cred1Value: "EMMY®",
    cred1Label: "Technology & Engineering Emmy® Award-winning technology",
    cred2Value: "53",
    cred2Label: "International granted patents",
    cred3Value: "NASDAQ: BMR",
    cred3Label: "Beamr Imaging Ltd.",
    firstNameLabel: "First name",
    lastNameLabel: "Last name",
    emailLabel: "Work email",
    companyLabel: "Company",
    jobTitleLabel: "Job title",
    leadEyebrow: "Tell me what you’re working with",
    leadHeadline: "Let’s Talk About Your Video.",
    leadBody: "A few quick details. Tell me what you’re working with and I’ll come back with the comparisons closest to your workflow.",
    showHubspotForm: true,
    hubspotPortalId: "",
    hubspotFormId: "",
    hubspotRegion: "",
    formPlaceholderText: "Add your HubSpot Portal ID and Form ID in the Framer properties to enable submission.",
    formSubmitLabel: "Send It Over",
    formSuccessMessage: "Got it — I’ll be in touch. At IBC this week? Come by Hall 1, Booth 1.D22 any time. No appointment needed.",
    formErrorMessage: "Something went wrong. Please try again or contact Beamr directly.",
    leadDisclaimer: "By submitting, you agree to hear from Beamr about this, plus occasional updates on our solutions, events and content. Unsubscribe any time.",
    boothNote: IBC_COPY.boothNote,
    archivePrompt: "What kind of video are you working with?",
    archivePlaceholder: "Sports archive, HD masters, live channels — whatever it is",
    formFollowupNote: "I’ll reply myself — usually the same day during the show.",
    seoTitle: "Your Archive in 4K — Beamr at IBC 2026",
    seoDescription: "Haggai Barel is showing HD-to-4K Super Resolution at Booth 1.D22, Hall 1. Before and after, side by side, September 11–14.",
    archiveHubspotField: "message",
    industryHubspotField: "industry",
    industryHubspotValue: "Media and Entertainment",
    sourceHubspotField: "lead_source",
    sourceHubspotValue: "Website",
    subSourceHubspotField: "sub_source",
    subSourceHubspotValue: "IBC26 Metro",
    utmSourceHubspotField: "utm_source",
    utmMediumHubspotField: "",
    utmCampaignHubspotField: "utm_campaign",
    utmTermHubspotField: "",
    utmContentHubspotField: "",

    amsterdamIllustration: "",
    illustrationOpacity: 0.9,
    illustrationWidth: 72,
    illustrationBottom: 42,
    illustrationRight: -30,

    beamrLogo: "",
    footerLogoHeight: 26,
    footerTagline: "Get More From Your Video",
    heroEyebrowSize: 13,
    heroNameSize: 13,
    heroSubheadSize: 23,
    heroBoothSize: 13,
    ctaFontSize: 15,
    trustedLabelSize: 12,
    routeEyebrowSize: 14,
    stepNumSize: 13,
    stepTitleSize: 49,
    stepBodySize: 18,
    stepTagSize: 11,
    credValueSize: 24,
    credLabelSize: 12,
    leadEyebrowSize: 13,
    leadBodySize: 27,
    boothNoteSize: 16,
    formLabelSize: 13,
    formInputSize: 15,
    submitSize: 15,
    followupNoteSize: 12,
    disclaimerSize: 12,
    footerTaglineSize: 14,

    blue: "#3475F5",
    navy: "#2F58A5",
    pink: "#EA8DBB",
    yellow: "#FFBE00",
    mint: "#28D3C3",
    white: "#FFFFFF",
    black: "#111111",
    fontFamily: "Poppins, Arial, sans-serif",
    enableCanvasTextEditing: false,
}

addPropertyControls(BeamrMetroWhatsNew, {
    // HERO
    heroEyebrowV28: { type: ControlType.String, title: "Hero Eyebrow" },
    heroNameLine: { type: ControlType.String, title: "Haggai Line" },
    heroHeadlineTopV28: { type: ControlType.String, title: "Hero Line 1" },
    heroHeadlineAccentV28: { type: ControlType.String, title: "Hero Line 2" },
    heroSubheadV28: { type: ControlType.String, title: "Hero Body", displayTextArea: true },
    heroCtaLabelV28: { type: ControlType.String, title: "Hero CTA" },
    heroBoothMeta: { type: ControlType.String, title: "Booth Line" },
    heroImage: { type: ControlType.Image, title: "Team Hero" },
    teamMemberName: { type: ControlType.String, title: "Team Name" },
    teamMemberTitle: { type: ControlType.String, title: "Team Title" },
    teamInfoBackground: { type: ControlType.Color, title: "Team Card BG" },
    teamInfoBottom: { type: ControlType.Number, title: "Team Card Y", min: 0, max: 240, step: 1 },
    teamInfoRight: { type: ControlType.Number, title: "Team Card X", min: 0, max: 240, step: 1 },
    teamInfoMaxWidth: { type: ControlType.Number, title: "Team Card W", min: 120, max: 420, step: 1 },
    beamrLogo: { type: ControlType.Image, title: "Beamr Logo" },
    heroTitleWeight: { type: ControlType.Number, title: "Hero Weight", min: 100, max: 900, step: 100 },
    heroTitleSize: { type: ControlType.Number, title: "Hero Size", min: 36, max: 120, step: 1 },
    mobileHeroTitleSize: { type: ControlType.Number, title: "Mobile Hero Size", min: 28, max: 72, step: 1 },
    heroTitleTracking: { type: ControlType.Number, title: "Hero Track", min: -0.2, max: 0.4, step: 0.005 },

    // SECTIONS
    showRoute: { type: ControlType.Boolean, title: "Three Moves", defaultValue: true },
    showReveal: { type: ControlType.Boolean, title: "Reveal", defaultValue: false },
    showComparison: { type: ControlType.Boolean, title: "Comparison", defaultValue: false },
    showVista: { type: ControlType.Boolean, title: "VISTA", defaultValue: false },
    showAbout: { type: ControlType.Boolean, title: "Why Beamr", defaultValue: false },

    // ONE PIPELINE, THREE MOVES
    routeEyebrow: { type: ControlType.String, title: "Pipeline Eyebrow" },
    stop1Title: { type: ControlType.String, title: "Step 1 Title" },
    stop1Body: { type: ControlType.String, title: "Step 1 Body", displayTextArea: true },
    stop1Tag: { type: ControlType.String, title: "Step 1 Tag" },
    stop2Title: { type: ControlType.String, title: "Step 2 Title" },
    stop2Body: { type: ControlType.String, title: "Step 2 Body", displayTextArea: true },
    stop2Tag: { type: ControlType.String, title: "Step 2 Tag" },
    stop3Title: { type: ControlType.String, title: "Step 3 Title" },
    stop3Body: { type: ControlType.String, title: "Step 3 Body", displayTextArea: true },
    stop3Tag: { type: ControlType.String, title: "Step 3 Tag" },

    // LOGOS
    showTrustedBy: { type: ControlType.Boolean, title: "Show Logos", defaultValue: true },
    trustedByLabelV28: { type: ControlType.String, title: "Logo Label" },
    trustedLogo1: { type: ControlType.Image, title: "Logo 1" },
    trustedLogo1Height: { type: ControlType.Number, title: "Logo 1 H", min: 10, max: 80, step: 1 },
    trustedLogo2: { type: ControlType.Image, title: "Logo 2" },
    trustedLogo2Height: { type: ControlType.Number, title: "Logo 2 H", min: 10, max: 80, step: 1 },
    trustedLogo3: { type: ControlType.Image, title: "Logo 3" },
    trustedLogo3Height: { type: ControlType.Number, title: "Logo 3 H", min: 10, max: 80, step: 1 },
    trustedLogo4: { type: ControlType.Image, title: "Logo 4" },
    trustedLogo4Height: { type: ControlType.Number, title: "Logo 4 H", min: 10, max: 80, step: 1 },
    trustedLogo5: { type: ControlType.Image, title: "Logo 5" },
    trustedLogo5Height: { type: ControlType.Number, title: "Logo 5 H", min: 10, max: 80, step: 1 },
    trustedByGap: { type: ControlType.Number, title: "Logo Gap", min: 0, max: 80, step: 1 },

    // FORM / CONVERSION
    leadEyebrow: { type: ControlType.String, title: "Form Eyebrow" },
    leadHeadline: { type: ControlType.String, title: "Form Headline" },
    leadBody: { type: ControlType.String, title: "Form Body", displayTextArea: true },
    mobileLeadTitleSize: { type: ControlType.Number, title: "Mobile Form Size", min: 26, max: 60, step: 1 },
    leadTitleSize: { type: ControlType.Number, title: "Form Title Size", min: 30, max: 90, step: 1 },
    firstNameLabel: { type: ControlType.String, title: "First Name Label" },
    lastNameLabel: { type: ControlType.String, title: "Last Name Label" },
    emailLabel: { type: ControlType.String, title: "Email Label" },
    companyLabel: { type: ControlType.String, title: "Company Label" },
    jobTitleLabel: { type: ControlType.String, title: "Job Title Label" },
    boothNote: { type: ControlType.String, title: "Booth Note", displayTextArea: true },
    archivePrompt: { type: ControlType.String, title: "Video Prompt" },
    archivePlaceholder: { type: ControlType.String, title: "Video Placeholder" },
    formSubmitLabel: { type: ControlType.String, title: "Submit Button" },
    formFollowupNote: { type: ControlType.String, title: "Follow-up Note", displayTextArea: true },
    leadDisclaimer: { type: ControlType.String, title: "Consent", displayTextArea: true },
    formSuccessMessage: { type: ControlType.String, title: "Success Message", displayTextArea: true },
    formErrorMessage: { type: ControlType.String, title: "Error Message", displayTextArea: true },

    // CREDIBILITY ROW
    cred1Value: { type: ControlType.String, title: "Cred 1 Value" },
    cred1Label: { type: ControlType.String, title: "Cred 1 Label" },
    cred2Value: { type: ControlType.String, title: "Cred 2 Value" },
    cred2Label: { type: ControlType.String, title: "Cred 2 Label" },
    cred3Value: { type: ControlType.String, title: "Cred 3 Value" },
    cred3Label: { type: ControlType.String, title: "Cred 3 Label" },

    // HUBSPOT
    showHubspotForm: { type: ControlType.Boolean, title: "Use HubSpot", defaultValue: true },
    hubspotPortalId: { type: ControlType.String, title: "Portal ID" },
    hubspotFormId: { type: ControlType.String, title: "Form ID" },
    hubspotRegion: { type: ControlType.String, title: "HubSpot Region" },
    archiveHubspotField: { type: ControlType.String, title: "Video Field" },
    industryHubspotField: { type: ControlType.String, title: "Industry Field" },
    industryHubspotValue: { type: ControlType.String, title: "Industry Value" },
    sourceHubspotField: { type: ControlType.String, title: "Source Field" },
    sourceHubspotValue: { type: ControlType.String, title: "Source Value" },
    subSourceHubspotField: { type: ControlType.String, title: "Sub Source Field" },
    subSourceHubspotValue: { type: ControlType.String, title: "Sub Source Value" },
    utmSourceHubspotField: { type: ControlType.String, title: "UTM Source Field" },
    utmMediumHubspotField: { type: ControlType.String, title: "UTM Medium Field" },
    utmCampaignHubspotField: { type: ControlType.String, title: "UTM Campaign Field" },
    utmTermHubspotField: { type: ControlType.String, title: "UTM Term Field" },
    utmContentHubspotField: { type: ControlType.String, title: "UTM Content Field" },

    // SEO
    seoTitle: { type: ControlType.String, title: "SEO Title" },
    seoDescription: { type: ControlType.String, title: "SEO Description", displayTextArea: true },

    // FOOTER
    footerTagline: { type: ControlType.String, title: "Footer Tagline" },
    footerTaglineSize: { type: ControlType.Number, title: "Tagline Size", min: 9, max: 40, step: 1 },
    footerLogoHeight: { type: ControlType.Number, title: "Footer Logo H", min: 12, max: 80, step: 1 },

    // TEXT SIZES
    heroEyebrowSize: { type: ControlType.Number, title: "Hero Eyebrow Size", min: 8, max: 40, step: 1 },
    heroNameSize: { type: ControlType.Number, title: "Haggai Line Size", min: 8, max: 40, step: 1 },
    heroSubheadSize: { type: ControlType.Number, title: "Hero Body Size", min: 12, max: 48, step: 1 },
    heroBoothSize: { type: ControlType.Number, title: "Booth Line Size", min: 8, max: 40, step: 1 },
    ctaFontSize: { type: ControlType.Number, title: "CTA Size", min: 10, max: 36, step: 1 },
    trustedLabelSize: { type: ControlType.Number, title: "Logo Label Size", min: 8, max: 32, step: 1 },
    routeEyebrowSize: { type: ControlType.Number, title: "Pipeline Eyebrow Size", min: 8, max: 40, step: 1 },
    stepNumSize: { type: ControlType.Number, title: "Step Number Size", min: 8, max: 32, step: 1 },
    stepTitleSize: { type: ControlType.Number, title: "Step Title Size", min: 18, max: 90, step: 1 },
    stepBodySize: { type: ControlType.Number, title: "Step Body Size", min: 11, max: 40, step: 1 },
    stepTagSize: { type: ControlType.Number, title: "Step Tag Size", min: 8, max: 28, step: 1 },
    credValueSize: { type: ControlType.Number, title: "Cred Value Size", min: 12, max: 60, step: 1 },
    credLabelSize: { type: ControlType.Number, title: "Cred Label Size", min: 8, max: 30, step: 1 },
    leadEyebrowSize: { type: ControlType.Number, title: "Form Eyebrow Size", min: 8, max: 40, step: 1 },
    leadBodySize: { type: ControlType.Number, title: "Form Body Size", min: 12, max: 48, step: 1 },
    boothNoteSize: { type: ControlType.Number, title: "Booth Note Size", min: 10, max: 36, step: 1 },
    formLabelSize: { type: ControlType.Number, title: "Field Label Size", min: 9, max: 28, step: 1 },
    formInputSize: { type: ControlType.Number, title: "Input Text Size", min: 11, max: 30, step: 1 },
    submitSize: { type: ControlType.Number, title: "Submit Text Size", min: 10, max: 30, step: 1 },
    followupNoteSize: { type: ControlType.Number, title: "Follow-up Size", min: 8, max: 26, step: 1 },
    disclaimerSize: { type: ControlType.Number, title: "Consent Size", min: 8, max: 26, step: 1 },

    // BRAND COLORS
    blue: { type: ControlType.Color, title: "Blue" },
    navy: { type: ControlType.Color, title: "Navy" },
    pink: { type: ControlType.Color, title: "Pink" },
    yellow: { type: ControlType.Color, title: "Yellow" },
    mint: { type: ControlType.Color, title: "Mint" },
    white: { type: ControlType.Color, title: "White" },
    black: { type: ControlType.Color, title: "Black" },
    fontFamily: { type: ControlType.String, title: "Font Family" },
})
