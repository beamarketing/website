import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function BeamrIBCSection(p) {
    const {
        eyebrow,
        eventHeadline,
        eventBody,
        eventMeta,
        eventCta,
        ctaHref,
        beamrLogo,
        guideText,
        amsterdamIllustration,
        illustrationOpacity,
        illustrationWidth,
        illustrationBottom,
        illustrationRight,
        bg,
        cardBg,
        navy,
        white,
        fontFamily,
        eyebrowColor,
        eyebrowSize,
        eyebrowWeight,
        headlineColor,
        headlineSize,
        headlineWeight,
        bodyColor,
        bodySize,
        bodyWeight,
        metaColor,
        metaSize,
        metaWeight,
        ctaColor,
        ctaBg,
        ctaSize,
        ctaWeight,
        guideColor,
        guideSize,
        guideWeight,
        // --- "Can't make it" guide track + lead form ---
        guideEnabled,
        guideCardBg,
        guideTextColor,
        guideKicker,
        guideTitle,
        guideBody,
        namePlaceholder,
        emailPlaceholder,
        companyPlaceholder,
        rolePlaceholder,
        showRole,
        consentText,
        consentRequired,
        submitLabel,
        guideBtnBg,
        guideBtnColor,
        successTitle,
        successBody,
        guideFileUrl,
        guideDownloadLabel,
        errorText,
        portalId,
        formGuid,
        hsEmailField,
        hsNameField,
        hsCompanyField,
        hsRoleField,
    } = p

    const [form, setForm] = React.useState({ name: "", email: "", company: "", role: "" })
    const [consent, setConsent] = React.useState(false)
    const [status, setStatus] = React.useState("idle") // idle | submitting | success | error
    const [message, setMessage] = React.useState("")

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

    async function submit(e) {
        e.preventDefault()
        if (!EMAIL_RE.test(form.email)) {
            setStatus("error")
            setMessage("Please enter a valid work email.")
            return
        }
        if (consentRequired && !consent) {
            setStatus("error")
            setMessage("Please accept to continue.")
            return
        }
        // Lets the success state be previewed on the canvas before wiring IDs.
        if (!portalId || !formGuid) {
            setStatus("success")
            return
        }
        setStatus("submitting")
        setMessage("")
        try {
            const fields = [
                { name: hsEmailField, value: form.email },
                { name: hsNameField, value: form.name },
                { name: hsCompanyField, value: form.company },
            ]
            if (showRole && form.role) fields.push({ name: hsRoleField, value: form.role })
            const payload: any = { fields }
            if (consentText) {
                payload.legalConsentOptions = {
                    consent: { consentToProcess: true, text: consentText },
                }
            }
            const res = await fetch(
                `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            )
            if (!res.ok) throw new Error(String(res.status))
            setStatus("success")
        } catch (err) {
            setStatus("error")
            setMessage(errorText)
        }
    }

    const css = `
      .eroot{width:100%;background:${bg};padding:110px 0 80px;font-family:${fontFamily};box-sizing:border-box}
      .ewrap{width:min(1180px,calc(100% - 48px));margin:0 auto}
      .egrid{display:grid;grid-template-columns:1fr;gap:20px}
      .egrid.two{grid-template-columns:1.12fr .88fr}
      .ecard{background:${cardBg};color:${navy};border-radius:34px;padding:clamp(34px,6vw,78px);position:relative;overflow:hidden;min-height:500px;box-sizing:border-box}
      .egrid.two .ecard{padding:clamp(30px,4vw,54px)}
      .econtent{position:relative;z-index:3;width:min(54%,650px)}
      .egrid.two .econtent{width:100%;max-width:none}
      .eeye{font-size:${eyebrowSize}px;font-weight:${eyebrowWeight};color:${eyebrowColor};letter-spacing:.12em;text-transform:uppercase;margin-bottom:12px}
      .ecard h2{font-size:${headlineSize}px;line-height:.86;letter-spacing:-.055em;text-transform:uppercase;margin:0 0 26px;max-width:900px;font-weight:${headlineWeight};color:${headlineColor}}
      .egrid.two .ecard h2{font-size:clamp(48px,5.4vw,${headlineSize}px)}
      .ecard p{font-size:${bodySize}px;max-width:700px;line-height:1.25;font-weight:${bodyWeight};color:${bodyColor};margin:0}
      .emeta{margin-top:28px;font-size:${metaSize}px;letter-spacing:.12em;font-weight:${metaWeight};text-transform:uppercase;color:${metaColor}}
      .ecta{display:inline-flex;align-items:center;gap:12px;background:${ctaBg};color:${ctaColor};text-decoration:none;padding:16px 24px;border-radius:999px;font-weight:${ctaWeight};margin-top:30px;font-size:${ctaSize}px}
      .eamsterdam{position:absolute;width:${illustrationWidth}%;max-width:none;height:auto;right:${illustrationRight}px;bottom:${illustrationBottom}px;opacity:${illustrationOpacity};z-index:1;pointer-events:none;user-select:none}
      .efallbackScene{position:absolute;width:${illustrationWidth}%;right:${illustrationRight}px;bottom:${illustrationBottom}px;opacity:${illustrationOpacity};z-index:1;pointer-events:none}
      .efallbackScene svg{width:100%;height:auto;display:block}
      .efooter{display:flex;justify-content:space-between;align-items:center;gap:24px;padding-top:38px}
      .elogo{display:block;width:auto;max-width:190px;max-height:44px;object-fit:contain}
      .efallback{color:${white};font-size:24px;font-weight:900}
      .eguide{font-size:${guideSize}px;letter-spacing:.08em;text-transform:uppercase;text-align:right;font-weight:${guideWeight};color:${guideColor}}

      .gcard{background:${guideCardBg};color:${guideTextColor};border-radius:34px;padding:clamp(30px,4vw,54px);position:relative;box-sizing:border-box;display:flex;flex-direction:column;min-height:500px}
      .gk{font-size:13px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;opacity:.55;margin:0 0 12px}
      .gt{font-size:clamp(30px,3.4vw,42px);line-height:.94;letter-spacing:-.03em;text-transform:uppercase;font-weight:900;margin:0}
      .gb{font-size:16px;line-height:1.4;opacity:.9;margin:14px 0 0}
      .gform{display:flex;flex-direction:column;gap:10px;margin-top:auto;padding-top:22px}
      .gform input[type=text],.gform input[type=email]{width:100%;box-sizing:border-box;font-family:inherit;font-size:15px;padding:13px 15px;border-radius:12px;border:1.5px solid rgba(0,0,0,.14);background:#fff;color:#14213D;outline:none}
      .gform input:focus{border-color:${guideBtnBg}}
      .grow{display:flex;gap:10px}.grow input{flex:1}
      .gconsent{display:flex;gap:9px;align-items:flex-start;font-size:12px;line-height:1.4;opacity:.85;margin-top:2px}
      .gconsent input{width:15px;height:15px;margin-top:2px;flex:0 0 auto}
      .gconsent a{color:inherit}
      .gmsg{font-size:12.5px;font-weight:600;margin-top:4px}
      .gsubmit{display:inline-flex;align-items:center;justify-content:center;gap:10px;border:none;cursor:pointer;font-family:inherit;background:${guideBtnBg};color:${guideBtnColor};padding:16px 24px;border-radius:999px;font-weight:800;font-size:15px;margin-top:8px}
      .gok{display:flex;flex-direction:column;gap:14px;justify-content:center;height:100%}
      .gok h4{font-size:clamp(26px,3vw,34px);font-weight:900;letter-spacing:-.02em;text-transform:uppercase;margin:0}
      .gok p{font-size:16px;line-height:1.4;margin:0;opacity:.9}
      .gdl{display:inline-flex;align-items:center;justify-content:center;gap:10px;text-decoration:none;background:${guideBtnBg};color:${guideBtnColor};padding:16px 24px;border-radius:999px;font-weight:800;font-size:15px;align-self:flex-start}

      @media(max-width:900px){.egrid.two{grid-template-columns:1fr}.ecard{min-height:620px}.egrid.two .ecard{min-height:0}.gcard{min-height:0}.econtent{width:100%;max-width:680px}.eamsterdam,.efallbackScene{width:90%;right:-10%;bottom:-2%;opacity:.68}}
      @media(max-width:760px){.eroot{padding:78px 0 82px}.ewrap{width:min(100% - 28px,1180px)}.ecard,.gcard{border-radius:24px}.ecard{min-height:660px}.egrid.two .ecard{min-height:0}.ecard h2{font-size:min(${headlineSize}px,18vw)}.ecard p{font-size:min(${bodySize}px,6vw)}.eamsterdam,.efallbackScene{width:120%;right:-34%;bottom:-1%;opacity:.55}.efooter{flex-direction:column;align-items:flex-start}.eguide{text-align:left}.grow{flex-direction:column}}
    `

    const fallback = (
        <div className="efallbackScene" aria-hidden="true">
            <svg viewBox="0 0 1200 520" fill="none">
                <g
                    stroke={white}
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M0 430H1200" />
                    <path d="M0 458c30-16 60-16 90 0s60 16 90 0 60-16 90 0 60 16 90 0 60-16 90 0 60 16 90 0 60-16 90 0 60 16 90 0 60-16 90 0 60 16 90 0 60-16 90 0 60 16 90 0" />
                    <path d="M0 486c30-16 60-16 90 0s60 16 90 0 60-16 90 0 60 16 90 0 60-16 90 0 60 16 90 0 60-16 90 0 60 16 90 0 60-16 90 0 60 16 90 0 60-16 90 0 60 16 90 0" />
                    <path d="M75 405V235h78v170M65 235h98M112 235l14-58h21l15 58" />
                    <path d="M123 177L60 112M136 177l66-65M123 177L60 239M136 177l66 62" />
                    <path d="M190 405V285h72v120M190 285l18-30h36l18 30" />
                    <path d="M276 405V245h78v160M276 245l18-34h42l18 34" />
                    <path d="M368 405V268h74v137M368 268l16-28h42l16 28" />
                    <path d="M470 405c70-65 166-65 236 0M462 405h260M495 405c18-65 78-65 96 0M598 405c18-65 78-65 96 0" />
                    <path d="M760 405V282h72v123M760 282l18-30h36l18 30" />
                    <path d="M846 405V255h80v150M846 255l20-38h40l20 38" />
                    <path d="M940 405V292h72v113M940 292l18-32h36l18 32" />
                    <path d="M1040 405V210h52v195M1048 210v-62h36v62M1054 148V96h24v52M1061 96V55h10v41M1066 55V34" />
                </g>
            </svg>
        </div>
    )

    const eventCard = (
        <div className="ecard">
            <div className="econtent">
                <div className="eeye">{eyebrow}</div>
                <h2>{eventHeadline}</h2>
                <p>{eventBody}</p>
                <div className="emeta">{eventMeta}</div>
                <a className="ecta" href={ctaHref}>
                    {eventCta} <span>↗</span>
                </a>
            </div>
            {amsterdamIllustration ? (
                <img
                    className="eamsterdam"
                    src={amsterdamIllustration}
                    alt=""
                    aria-hidden="true"
                />
            ) : (
                fallback
            )}
        </div>
    )

    const guideCard = (
        <div className="gcard">
            {status === "success" ? (
                <div className="gok">
                    <h4>{successTitle}</h4>
                    <p>{successBody}</p>
                    {guideFileUrl ? (
                        <a
                            className="gdl"
                            href={guideFileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {guideDownloadLabel} <span>↗</span>
                        </a>
                    ) : null}
                </div>
            ) : (
                <>
                    <div className="gk">{guideKicker}</div>
                    <h3 className="gt">{guideTitle}</h3>
                    <p className="gb">{guideBody}</p>
                    <form className="gform" onSubmit={submit}>
                        <div className="grow">
                            <input
                                type="text"
                                placeholder={namePlaceholder}
                                value={form.name}
                                onChange={set("name")}
                                required
                            />
                            <input
                                type="text"
                                placeholder={companyPlaceholder}
                                value={form.company}
                                onChange={set("company")}
                            />
                        </div>
                        <input
                            type="email"
                            placeholder={emailPlaceholder}
                            value={form.email}
                            onChange={set("email")}
                            required
                        />
                        {showRole ? (
                            <input
                                type="text"
                                placeholder={rolePlaceholder}
                                value={form.role}
                                onChange={set("role")}
                            />
                        ) : null}
                        {consentText ? (
                            <label className="gconsent">
                                <input
                                    type="checkbox"
                                    checked={consent}
                                    onChange={(e) => setConsent(e.target.checked)}
                                />
                                <span dangerouslySetInnerHTML={{ __html: consentText }} />
                            </label>
                        ) : null}
                        {status === "error" && message ? (
                            <div className="gmsg" style={{ color: "#C0392B" }}>
                                {message}
                            </div>
                        ) : null}
                        <button
                            className="gsubmit"
                            type="submit"
                            disabled={status === "submitting"}
                            style={{ opacity: status === "submitting" ? 0.7 : 1 }}
                        >
                            {status === "submitting" ? "Sending…" : (
                                <>
                                    {submitLabel} <span>↗</span>
                                </>
                            )}
                        </button>
                    </form>
                </>
            )}
        </div>
    )

    return (
        <section className="eroot">
            <style>{css}</style>
            <div className="ewrap">
                <div className={guideEnabled ? "egrid two" : "egrid"}>
                    {eventCard}
                    {guideEnabled ? guideCard : null}
                </div>
                <div className="efooter">
                    {beamrLogo ? (
                        <img src={beamrLogo} className="elogo" alt="Beamr" />
                    ) : (
                        <div className="efallback">BEAMR</div>
                    )}
                    <div className="eguide">{guideText}</div>
                </div>
            </div>
        </section>
    )
}

BeamrIBCSection.defaultProps = {
    eyebrow: "YOUR NEXT STOP:",
    eventHeadline: "IBC 2026.",
    eventBody: "See Beamr + NVIDIA Video Super Resolution live in Amsterdam.",
    eventMeta: "SEPTEMBER 11–14 · STAND 1.D22",
    eventCta: "BOOK A DEMO",
    ctaHref: "#",
    beamrLogo: "",
    guideText: "THE VIDEO PIPELINE GUIDE®",
    amsterdamIllustration: "",
    illustrationOpacity: 0.9,
    illustrationWidth: 62,
    illustrationBottom: -8,
    illustrationRight: -30,
    bg: "#3475F5",
    cardBg: "#EA8DBB",
    navy: "#2F58A5",
    white: "#FFFFFF",
    fontFamily: "Poppins, Arial, sans-serif",
    eyebrowColor: "#2F58A5",
    eyebrowSize: 13,
    eyebrowWeight: 800,
    headlineColor: "#2F58A5",
    headlineSize: 104,
    headlineWeight: 900,
    bodyColor: "#2F58A5",
    bodySize: 26,
    bodyWeight: 400,
    metaColor: "#2F58A5",
    metaSize: 14,
    metaWeight: 800,
    ctaColor: "#FFFFFF",
    ctaBg: "#2F58A5",
    ctaSize: 15,
    ctaWeight: 800,
    guideColor: "#FFFFFF",
    guideSize: 14,
    guideWeight: 800,

    guideEnabled: true,
    guideCardBg: "#FFFFFF",
    guideTextColor: "#14213D",
    guideKicker: "CAN'T MAKE THE TRIP?",
    guideTitle: "GET THE VIDEO PIPELINE GUIDE",
    guideBody: "We'll send the full breakdown of taking HD to 4K with NVIDIA VSR and Beamr — no flight to Amsterdam required.",
    namePlaceholder: "Full name",
    emailPlaceholder: "Work email",
    companyPlaceholder: "Company",
    rolePlaceholder: "Role / interest (optional)",
    showRole: true,
    consentText: "I agree to receive the guide and occasional updates from Beamr. You can unsubscribe anytime.",
    consentRequired: true,
    submitLabel: "GET THE GUIDE",
    guideBtnBg: "#2F58A5",
    guideBtnColor: "#FFFFFF",
    successTitle: "YOU'RE ON THE LINE.",
    successBody: "Check your inbox — the Video Pipeline Guide is on its way.",
    guideFileUrl: "",
    guideDownloadLabel: "DOWNLOAD NOW",
    errorText: "Something went wrong. Please try again.",
    portalId: "",
    formGuid: "",
    hsEmailField: "email",
    hsNameField: "firstname",
    hsCompanyField: "company",
    hsRoleField: "jobtitle",
}

addPropertyControls(BeamrIBCSection, {
    eyebrow: { type: ControlType.String, title: "Eyebrow" },
    eventHeadline: {
        type: ControlType.String,
        title: "Headline",
        displayTextArea: true,
    },
    eventBody: {
        type: ControlType.String,
        title: "Body",
        displayTextArea: true,
    },
    eventMeta: { type: ControlType.String, title: "Meta" },
    eventCta: { type: ControlType.String, title: "CTA Text" },
    ctaHref: { type: ControlType.Link, title: "CTA Link" },
    beamrLogo: { type: ControlType.Image, title: "Beamr Logo" },
    guideText: { type: ControlType.String, title: "Guide Text" },
    amsterdamIllustration: { type: ControlType.Image, title: "Amsterdam Art" },
    illustrationOpacity: {
        type: ControlType.Number,
        title: "Art Opacity",
        min: 0,
        max: 1,
        step: 0.05,
    },
    illustrationWidth: {
        type: ControlType.Number,
        title: "Art Width %",
        min: 25,
        max: 140,
        step: 1,
    },
    illustrationBottom: {
        type: ControlType.Number,
        title: "Art Bottom",
        min: -200,
        max: 200,
        step: 1,
    },
    illustrationRight: {
        type: ControlType.Number,
        title: "Art Right",
        min: -300,
        max: 300,
        step: 1,
    },
    fontFamily: { type: ControlType.String, title: "Font Family" },
    bg: { type: ControlType.Color, title: "Section Background" },
    cardBg: { type: ControlType.Color, title: "Card Background" },
    eyebrowColor: { type: ControlType.Color, title: "Eyebrow Color" },
    eyebrowSize: {
        type: ControlType.Number,
        title: "Eyebrow Size",
        min: 8,
        max: 60,
        step: 1,
    },
    eyebrowWeight: {
        type: ControlType.Number,
        title: "Eyebrow Weight",
        min: 100,
        max: 900,
        step: 100,
    },
    headlineColor: { type: ControlType.Color, title: "Headline Color" },
    headlineSize: {
        type: ControlType.Number,
        title: "Headline Size",
        min: 20,
        max: 180,
        step: 1,
    },
    headlineWeight: {
        type: ControlType.Number,
        title: "Headline Weight",
        min: 100,
        max: 900,
        step: 100,
    },
    bodyColor: { type: ControlType.Color, title: "Body Color" },
    bodySize: {
        type: ControlType.Number,
        title: "Body Size",
        min: 10,
        max: 80,
        step: 1,
    },
    bodyWeight: {
        type: ControlType.Number,
        title: "Body Weight",
        min: 100,
        max: 900,
        step: 100,
    },
    metaColor: { type: ControlType.Color, title: "Meta Color" },
    metaSize: {
        type: ControlType.Number,
        title: "Meta Size",
        min: 8,
        max: 50,
        step: 1,
    },
    metaWeight: {
        type: ControlType.Number,
        title: "Meta Weight",
        min: 100,
        max: 900,
        step: 100,
    },
    ctaColor: { type: ControlType.Color, title: "CTA Text Color" },
    ctaBg: { type: ControlType.Color, title: "CTA Background" },
    ctaSize: {
        type: ControlType.Number,
        title: "CTA Text Size",
        min: 8,
        max: 50,
        step: 1,
    },
    ctaWeight: {
        type: ControlType.Number,
        title: "CTA Weight",
        min: 100,
        max: 900,
        step: 100,
    },
    guideColor: { type: ControlType.Color, title: "Guide Color" },
    guideSize: {
        type: ControlType.Number,
        title: "Guide Size",
        min: 8,
        max: 50,
        step: 1,
    },
    guideWeight: {
        type: ControlType.Number,
        title: "Guide Weight",
        min: 100,
        max: 900,
        step: 100,
    },

    // --- Guide track + lead form ---
    guideEnabled: {
        type: ControlType.Boolean,
        title: "Guide Track",
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    guideCardBg: { type: ControlType.Color, title: "Guide · Card BG", hidden: (x) => !x.guideEnabled },
    guideTextColor: { type: ControlType.Color, title: "Guide · Text", hidden: (x) => !x.guideEnabled },
    guideKicker: { type: ControlType.String, title: "Guide · Kicker", hidden: (x) => !x.guideEnabled },
    guideTitle: { type: ControlType.String, title: "Guide · Title", hidden: (x) => !x.guideEnabled },
    guideBody: { type: ControlType.String, title: "Guide · Body", displayTextArea: true, hidden: (x) => !x.guideEnabled },
    namePlaceholder: { type: ControlType.String, title: "Field · Name", hidden: (x) => !x.guideEnabled },
    emailPlaceholder: { type: ControlType.String, title: "Field · Email", hidden: (x) => !x.guideEnabled },
    companyPlaceholder: { type: ControlType.String, title: "Field · Company", hidden: (x) => !x.guideEnabled },
    showRole: {
        type: ControlType.Boolean,
        title: "Role Field",
        enabledTitle: "On",
        disabledTitle: "Off",
        hidden: (x) => !x.guideEnabled,
    },
    rolePlaceholder: { type: ControlType.String, title: "Field · Role", hidden: (x) => !x.guideEnabled || !x.showRole },
    consentText: { type: ControlType.String, title: "Consent Text", displayTextArea: true, hidden: (x) => !x.guideEnabled },
    consentRequired: {
        type: ControlType.Boolean,
        title: "Consent Required",
        enabledTitle: "Yes",
        disabledTitle: "No",
        hidden: (x) => !x.guideEnabled,
    },
    submitLabel: { type: ControlType.String, title: "Submit Label", hidden: (x) => !x.guideEnabled },
    guideBtnBg: { type: ControlType.Color, title: "Guide · Btn BG", hidden: (x) => !x.guideEnabled },
    guideBtnColor: { type: ControlType.Color, title: "Guide · Btn Text", hidden: (x) => !x.guideEnabled },
    successTitle: { type: ControlType.String, title: "Success · Title", hidden: (x) => !x.guideEnabled },
    successBody: { type: ControlType.String, title: "Success · Body", displayTextArea: true, hidden: (x) => !x.guideEnabled },
    guideFileUrl: { type: ControlType.Link, title: "Guide File URL", hidden: (x) => !x.guideEnabled },
    guideDownloadLabel: { type: ControlType.String, title: "Download Label", hidden: (x) => !x.guideEnabled || !x.guideFileUrl },
    errorText: { type: ControlType.String, title: "Error Text", hidden: (x) => !x.guideEnabled },
    portalId: { type: ControlType.String, title: "HubSpot Portal ID", hidden: (x) => !x.guideEnabled },
    formGuid: { type: ControlType.String, title: "HubSpot Form GUID", hidden: (x) => !x.guideEnabled },
    hsEmailField: { type: ControlType.String, title: "HS · Email Field", hidden: (x) => !x.guideEnabled },
    hsNameField: { type: ControlType.String, title: "HS · Name Field", hidden: (x) => !x.guideEnabled },
    hsCompanyField: { type: ControlType.String, title: "HS · Company Field", hidden: (x) => !x.guideEnabled },
    hsRoleField: { type: ControlType.String, title: "HS · Role Field", hidden: (x) => !x.guideEnabled || !x.showRole },
})
