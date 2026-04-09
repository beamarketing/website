// Beamr - Gated Content Landing Page
// Lead magnet for benchmark research
// Framer Code Component with HubSpot form integration

import { addPropertyControls, ControlType } from "framer"
import { useState, useEffect, useRef } from "react"

interface Props {
    beamrLogo: string
    eyebrow: string
    heading: string

    stat1Value: string
    stat1Label: string
    stat2Value: string
    stat2Label: string
    stat3Value: string
    stat3Label: string

    backgroundImage: string
    bannerImage: string
    showBanner: boolean

    formHeading: string
    submitButtonText: string
    hubspotPortalId: string
    hubspotFormId: string
    useEmbeddedHubspot: boolean
    showCompanyField: boolean

    reportPdf: string
    reportUrl: string
    reportFileName: string
    downloadButtonText: string

    thankYouHeading: string
    thankYouMessage: string
    thankYouCtaText: string
    thankYouCtaUrl: string

    headingFontSize: number
    headingFontWeight: number
    statFontSize: number
    statFontWeight: number

    bgColor: string
    textColor: string
    accentColor: string
    fontFamily: string
    style?: React.CSSProperties
}

function GatedContentPage(props: Props) {
    const {
        beamrLogo = "",
        eyebrow = "INSIDE THE BENCHMARK",
        heading = "How Beamr Validated\nCompression on Cosmos Curator",

        stat1Value = "41–57%",
        stat1Label = "Video Size Reduced",
        stat2Value = "93–98%",
        stat2Label = "Visual Realism Index",
        stat3Value = ">0.98",
        stat3Label = "Clustering Accuracy",

        backgroundImage = "",
        bannerImage = "",
        showBanner = true,
        formHeading = "Get the Full Research",
        submitButtonText = "Read the Full Methodology",
        hubspotPortalId = "",
        hubspotFormId = "",
        useEmbeddedHubspot = false,
        showCompanyField = true,
        reportPdf = "",
        reportUrl = "",
        reportFileName = "beamr-cosmos-curator-benchmark.pdf",
        downloadButtonText = "Download Full Report (PDF)",
        thankYouHeading = "Check Your Inbox",
        thankYouMessage = "The full benchmark report is on its way to your email.",
        thankYouCtaText = "Visit Beamr.com",
        thankYouCtaUrl = "/",
        headingFontSize = 52,
        headingFontWeight = 800,
        statFontSize = 44,
        statFontWeight = 900,
        bgColor = "#1a2478",
        textColor = "#ffffff",
        accentColor = "#4a8eff",
        fontFamily = "'Inter', sans-serif",
        style,
    } = props

    const [submitted, setSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formError, setFormError] = useState("")
    const [isMobile, setIsMobile] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const hubspotRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 860)
        check()
        window.addEventListener("resize", check)
        return () => window.removeEventListener("resize", check)
    }, [])

    useEffect(() => {
        if (!useEmbeddedHubspot || !hubspotPortalId || !hubspotFormId || submitted) return
        const script = document.createElement("script")
        script.src = "https://js.hsforms.net/forms/v2.js"
        script.async = true
        script.onload = () => {
            if ((window as any).hbspt && hubspotRef.current) {
                hubspotRef.current.innerHTML = ""
                ;(window as any).hbspt.forms.create({
                    portalId: hubspotPortalId,
                    formId: hubspotFormId,
                    target: hubspotRef.current,
                    onFormSubmitted: () => setSubmitted(true),
                })
            }
        }
        document.head.appendChild(script)
        return () => { if (script.parentNode) script.parentNode.removeChild(script) }
    }, [useEmbeddedHubspot, hubspotPortalId, hubspotFormId, submitted])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setFormError("")
        setIsSubmitting(true)
        const fd = new FormData(e.currentTarget)
        const fields: { name: string; value: string }[] = [
            { name: "firstname", value: fd.get("firstname") as string },
            { name: "lastname", value: fd.get("lastname") as string },
            { name: "email", value: fd.get("email") as string },
        ]
        if (showCompanyField) fields.push({ name: "company", value: fd.get("company") as string })
        if (!hubspotPortalId || !hubspotFormId) {
            setTimeout(() => { setIsSubmitting(false); setSubmitted(true) }, 800)
            return
        }
        try {
            const payload = {
                fields,
                context: {
                    hutk: document.cookie.match(/hubspotutk=([^;]*)/)?.[1] || undefined,
                    pageUri: window.location.href,
                    pageName: document.title,
                },
            }
            const res = await fetch(
                `https://api.hsforms.com/submissions/v3/integration/submit/${hubspotPortalId}/${hubspotFormId}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            )
            if (!res.ok) console.warn("HubSpot submission failed:", res.status)
            setSubmitted(true)
        } catch (err) {
            console.warn("HubSpot submission failed:", err)
            setSubmitted(true)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDownload = async () => {
        const url = reportUrl || reportPdf
        if (!url) return
        setIsDownloading(true)
        try {
            const res = await fetch(url)
            const blob = await res.blob()
            const blobUrl = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = blobUrl
            a.download = reportFileName || "beamr-report.pdf"
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(blobUrl)
        } catch {
            window.open(url, "_blank")
        } finally {
            setIsDownloading(false)
        }
    }

    const inputCss: React.CSSProperties = {
        width: "100%",
        padding: "13px 16px",
        backgroundColor: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 10,
        color: textColor,
        fontSize: 15,
        fontFamily,
        outline: "none",
        boxSizing: "border-box",
        transition: "border-color 0.2s",
    }

    const statItems = [
        { value: stat1Value, label: stat1Label },
        { value: stat2Value, label: stat2Label },
        { value: stat3Value, label: stat3Label },
    ]

    return (
        <section
            style={{
                ...style,
                width: "100%",
                minHeight: "100vh",
                backgroundColor: bgColor,
                fontFamily,
                boxSizing: "border-box",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {backgroundImage && (
                <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.25, pointerEvents: "none" }} />
            )}

            {/* Blueprint grid */}
            <div style={{
                position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.035,
                backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                backgroundSize: "60px 60px",
            }} />

            <style>{`
                .gc-input:focus { border-color: ${accentColor} !important; }
                .gc-input::placeholder { color: rgba(255,255,255,0.35); }
                .gc-submit:hover { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,0,0,0.25); }
                .gc-submit:active { transform: translateY(0); }
                .gc-hs-embed .hs-form input[type="text"],
                .gc-hs-embed .hs-form input[type="email"],
                .gc-hs-embed .hs-form select,
                .gc-hs-embed .hs-form textarea {
                    width: 100% !important; padding: 13px 16px !important;
                    background: rgba(255,255,255,0.08) !important;
                    border: 1px solid rgba(255,255,255,0.15) !important;
                    border-radius: 10px !important; color: ${textColor} !important;
                    font-size: 15px !important; font-family: ${fontFamily} !important;
                    box-sizing: border-box !important;
                }
                .gc-hs-embed .hs-form input:focus { border-color: ${accentColor} !important; outline: none !important; }
                .gc-hs-embed .hs-form .hs-button {
                    width: 100% !important; padding: 16px !important;
                    background: ${textColor} !important; color: ${bgColor} !important;
                    border: none !important; border-radius: 10px !important;
                    font-size: 16px !important; font-weight: 600 !important;
                    cursor: pointer !important;
                }
                .gc-hs-embed .hs-form label { color: rgba(255,255,255,0.6) !important; font-size: 13px !important; }
            `}</style>

            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    width: "100%",
                    maxWidth: 900,
                    padding: isMobile ? "70px 20px 50px" : "60px 32px",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                {/* ── Beamr logo (author) ── */}
                <div style={{ marginBottom: 28 }}>
                    {beamrLogo ? (
                        <img src={beamrLogo} alt="Beamr" style={{ height: isMobile ? 22 : 28, objectFit: "contain" }} />
                    ) : (
                        <span style={{ fontSize: isMobile ? 17 : 20, fontWeight: 800, color: textColor, fontFamily, letterSpacing: "0.03em" }}>BEAMR</span>
                    )}
                </div>

                {/* ── Eyebrow ── */}
                <div
                    style={{
                        fontSize: isMobile ? 11 : 13,
                        fontWeight: 600,
                        color: textColor,
                        opacity: 0.45,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        fontFamily,
                        marginBottom: 14,
                    }}
                >
                    {eyebrow}
                </div>

                {/* ── Heading ── */}
                <h1
                    style={{
                        fontSize: isMobile ? Math.round(headingFontSize * 0.65) : headingFontSize,
                        fontWeight: headingFontWeight,
                        color: textColor,
                        margin: 0,
                        lineHeight: 1.06,
                        letterSpacing: "-0.03em",
                        fontFamily,
                        whiteSpace: "pre-line",
                        textAlign: "center",
                    }}
                >
                    {heading}
                </h1>

                {/* ── Road signs banner ── */}
                {showBanner && bannerImage && (
                    <div
                        style={{
                            width: "calc(100% + 64px)",
                            margin: `${isMobile ? 24 : 36}px -32px 0`,
                            overflow: "hidden",
                            position: "relative",
                            height: isMobile ? 60 : 90,
                            maskImage: "linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%)",
                            WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%)",
                        }}
                    >
                        <img
                            src={bannerImage}
                            alt=""
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                objectPosition: "center",
                                display: "block",
                            }}
                        />
                    </div>
                )}

                {/* ── Stats row ── */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: isMobile ? "column" : "row",
                        width: "100%",
                        marginTop: showBanner && bannerImage ? (isMobile ? 24 : 32) : (isMobile ? 32 : 44),
                        borderTop: "1px solid rgba(255,255,255,0.12)",
                        borderBottom: "1px solid rgba(255,255,255,0.12)",
                    }}
                >
                    {statItems.map((s, i) => (
                        <div
                            key={i}
                            style={{
                                flex: 1,
                                padding: isMobile ? "24px 0" : "28px 16px",
                                textAlign: "center",
                                borderLeft: !isMobile && i > 0 ? "1px solid rgba(255,255,255,0.12)" : "none",
                                borderTop: isMobile && i > 0 ? "1px solid rgba(255,255,255,0.12)" : "none",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: isMobile ? Math.round(statFontSize * 0.82) : statFontSize,
                                    fontWeight: statFontWeight,
                                    color: textColor,
                                    fontFamily,
                                    lineHeight: 1,
                                    letterSpacing: "-0.02em",
                                }}
                            >
                                {s.value}
                            </div>
                            <div
                                style={{
                                    fontSize: 13,
                                    color: textColor,
                                    opacity: 0.5,
                                    fontFamily,
                                    marginTop: 8,
                                    fontWeight: 500,
                                    letterSpacing: "0.02em",
                                }}
                            >
                                {s.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Form ── */}
                <div style={{ width: "100%", maxWidth: 440, marginTop: isMobile ? 32 : 44 }}>
                    <div
                        style={{
                            backgroundColor: "rgba(255,255,255,0.07)",
                            backdropFilter: "blur(24px)",
                            WebkitBackdropFilter: "blur(24px)",
                            borderRadius: 20,
                            border: "1px solid rgba(255,255,255,0.12)",
                            padding: isMobile ? "28px 22px" : "32px 28px",
                            boxSizing: "border-box",
                        }}
                    >
                        {submitted ? (
                            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "8px 0" }}>
                                <div style={{ width: 52, height: 52, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: textColor }}>
                                    &#10003;
                                </div>
                                <h3 style={{ fontSize: 20, fontWeight: 700, color: textColor, margin: 0, fontFamily }}>{thankYouHeading}</h3>
                                <p style={{ fontSize: 14, color: textColor, opacity: 0.6, margin: 0, lineHeight: 1.5, fontFamily }}>{thankYouMessage}</p>
                                {(reportUrl || reportPdf) && (
                                    <button
                                        onClick={handleDownload}
                                        disabled={isDownloading}
                                        style={{
                                            display: "inline-flex", alignItems: "center", gap: 8,
                                            marginTop: 6, padding: "14px 28px",
                                            backgroundColor: textColor, color: bgColor,
                                            borderRadius: 10, fontSize: 15, fontWeight: 700,
                                            fontFamily, border: "none",
                                            cursor: isDownloading ? "wait" : "pointer",
                                            transition: "opacity 0.2s",
                                        }}
                                    >
                                        <span style={{ fontSize: 16 }}>&#8595;</span> {isDownloading ? "Downloading..." : downloadButtonText}
                                    </button>
                                )}
                                <a
                                    href={thankYouCtaUrl}
                                    style={{
                                        display: "inline-flex", alignItems: "center", gap: 8,
                                        marginTop: (reportUrl || reportPdf) ? 2 : 6, padding: "13px 28px",
                                        backgroundColor: (reportUrl || reportPdf) ? "rgba(255,255,255,0.08)" : textColor,
                                        color: (reportUrl || reportPdf) ? textColor : bgColor,
                                        borderRadius: 10, fontSize: 15, fontWeight: 600,
                                        textDecoration: "none", fontFamily,
                                        border: (reportUrl || reportPdf) ? "1px solid rgba(255,255,255,0.15)" : "none",
                                    }}
                                >
                                    {thankYouCtaText} <span style={{ fontSize: 17 }}>&#8594;</span>
                                </a>
                            </div>
                        ) : useEmbeddedHubspot && hubspotPortalId && hubspotFormId ? (
                            <div>
                                <h3 style={{ fontSize: 18, fontWeight: 700, color: textColor, margin: "0 0 16px", fontFamily, textAlign: "center" }}>{formHeading}</h3>
                                <div ref={hubspotRef} className="gc-hs-embed" />
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                <h3 style={{ fontSize: 18, fontWeight: 700, color: textColor, margin: "0 0 4px", fontFamily, textAlign: "center" }}>{formHeading}</h3>

                                <div style={{ display: "flex", gap: 10 }}>
                                    <input className="gc-input" type="text" name="firstname" required placeholder="First name" style={inputCss} />
                                    <input className="gc-input" type="text" name="lastname" required placeholder="Last name" style={inputCss} />
                                </div>

                                <input className="gc-input" type="email" name="email" required placeholder="Work email *" style={inputCss} />

                                {showCompanyField && (
                                    <input className="gc-input" type="text" name="company" placeholder="Company" style={inputCss} />
                                )}

                                {formError && <p style={{ fontSize: 12, color: "#ff6b6b", margin: 0, fontFamily }}>{formError}</p>}

                                <button
                                    type="submit"
                                    className="gc-submit"
                                    disabled={isSubmitting}
                                    style={{
                                        width: "100%",
                                        padding: "15px 24px",
                                        backgroundColor: isSubmitting ? "rgba(255,255,255,0.5)" : textColor,
                                        color: bgColor,
                                        border: "none",
                                        borderRadius: 10,
                                        fontSize: 15,
                                        fontWeight: 700,
                                        fontFamily,
                                        cursor: isSubmitting ? "not-allowed" : "pointer",
                                        transition: "all 0.2s",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 8,
                                        marginTop: 2,
                                    }}
                                >
                                    {isSubmitting ? "Sending..." : submitButtonText}
                                    {!isSubmitting && <span style={{ fontSize: 17 }}>&#8594;</span>}
                                </button>

                                <p style={{ fontSize: 11, color: textColor, margin: 0, textAlign: "center", fontFamily, opacity: 0.3, lineHeight: 1.4 }}>
                                    Free PDF &middot; By downloading you agree to receive updates from Beamr
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

addPropertyControls(GatedContentPage, {
    beamrLogo: { type: ControlType.Image, title: "Beamr Logo" },
    eyebrow: { type: ControlType.String, title: "Eyebrow", defaultValue: "INSIDE THE BENCHMARK" },
    heading: { type: ControlType.String, title: "Heading", defaultValue: "How Beamr Validated\nCompression on Cosmos Curator", displayTextArea: true },
    backgroundImage: { type: ControlType.Image, title: "BG Image" },
    showBanner: { type: ControlType.Boolean, title: "Show Banner", defaultValue: true },
    bannerImage: { type: ControlType.Image, title: "Banner Image", hidden: (props) => !props.showBanner },

    stat1Value: { type: ControlType.String, title: "Stat 1 Value", defaultValue: "41–57%" },
    stat1Label: { type: ControlType.String, title: "Stat 1 Label", defaultValue: "Video Size Reduced" },
    stat2Value: { type: ControlType.String, title: "Stat 2 Value", defaultValue: "93–98%" },
    stat2Label: { type: ControlType.String, title: "Stat 2 Label", defaultValue: "Visual Realism Index" },
    stat3Value: { type: ControlType.String, title: "Stat 3 Value", defaultValue: ">0.98" },
    stat3Label: { type: ControlType.String, title: "Stat 3 Label", defaultValue: "Clustering Accuracy" },

    formHeading: { type: ControlType.String, title: "Form Heading", defaultValue: "Get the Full Research" },
    submitButtonText: { type: ControlType.String, title: "Submit Text", defaultValue: "Read the Full Methodology", hidden: (props) => props.useEmbeddedHubspot },
    useEmbeddedHubspot: { type: ControlType.Boolean, title: "Embed HubSpot", defaultValue: false },
    hubspotPortalId: { type: ControlType.String, title: "Portal ID", defaultValue: "" },
    hubspotFormId: { type: ControlType.String, title: "Form ID", defaultValue: "" },
    showCompanyField: { type: ControlType.Boolean, title: "Company Field", defaultValue: true, hidden: (props) => props.useEmbeddedHubspot },

    reportPdf: { type: ControlType.File, title: "Report PDF", allowedFileTypes: ["pdf"] },
    reportUrl: { type: ControlType.String, title: "Report URL", defaultValue: "", description: "Manual URL (takes priority over uploaded PDF)" },
    reportFileName: { type: ControlType.String, title: "Download Filename", defaultValue: "beamr-cosmos-curator-benchmark.pdf" },
    downloadButtonText: { type: ControlType.String, title: "Download Text", defaultValue: "Download Full Report (PDF)" },

    thankYouHeading: { type: ControlType.String, title: "TY Heading", defaultValue: "Check Your Inbox" },
    thankYouMessage: { type: ControlType.String, title: "TY Message", defaultValue: "The full benchmark report is on its way to your email.", displayTextArea: true },
    thankYouCtaText: { type: ControlType.String, title: "TY CTA", defaultValue: "Visit Beamr.com" },
    thankYouCtaUrl: { type: ControlType.String, title: "TY URL", defaultValue: "/" },

    headingFontSize: { type: ControlType.Number, title: "Heading Size", defaultValue: 52, min: 24, max: 80, step: 1 },
    headingFontWeight: { type: ControlType.Enum, title: "Heading Weight", options: [400, 500, 600, 700, 800, 900], optionTitles: ["400", "500", "600", "700", "800", "900"], defaultValue: 800 },
    statFontSize: { type: ControlType.Number, title: "Stat Size", defaultValue: 44, min: 20, max: 80, step: 1 },
    statFontWeight: { type: ControlType.Enum, title: "Stat Weight", options: [400, 500, 600, 700, 800, 900], optionTitles: ["400", "500", "600", "700", "800", "900"], defaultValue: 900 },

    bgColor: { type: ControlType.Color, title: "Background", defaultValue: "#1a2478" },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: "#ffffff" },
    accentColor: { type: ControlType.Color, title: "Accent", defaultValue: "#4a8eff" },
    fontFamily: { type: ControlType.String, title: "Font", defaultValue: "'Inter', sans-serif" },
})

export default GatedContentPage
