// Beamr — IBC 2026 Split CTA (final section)
// Two tracks: "Attending IBC → Book a demo" and "Not attending → Get the
// Video Pipeline Guide" (gated lead form).
//
// The lead form submits to HubSpot's public Forms API
// (https://api.hsforms.com/submissions/v3/integration/submit/:portalId/:formGuid),
// which accepts CORS browser submissions with no auth token — just set the
// Portal ID and Form GUID in the property controls. If you're on Marketo
// instead, this submit path needs to be swapped for the forms2 embed.

import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function BeamrIBCSplitCTA(p: any) {
    const {
        sectionBg, fontFamily, eyebrow,
        // Attending track
        attendBg, attendText, attendKicker, attendTitle, attendMeta, attendBody,
        attendCtaLabel, attendCtaHref, attendBtnBg, attendBtnText,
        // Guide track
        guideBg, guideText, guideKicker, guideTitle, guideBody,
        namePlaceholder, emailPlaceholder, companyPlaceholder, rolePlaceholder,
        showRole, consentText, consentRequired,
        submitLabel, guideBtnBg, guideBtnText,
        successTitle, successBody, guideUrl, guideDownloadLabel, errorText,
        // HubSpot
        portalId, formGuid,
        hsEmailField, hsNameField, hsCompanyField, hsRoleField,
    } = p

    const [form, setForm] = React.useState({ name: "", email: "", company: "", role: "" })
    const [consent, setConsent] = React.useState(false)
    const [status, setStatus] = React.useState<"idle" | "submitting" | "success" | "error">("idle")
    const [message, setMessage] = React.useState("")

    const set = (k: string) => (e: any) => setForm((f: any) => ({ ...f, [k]: e.target.value }))

    async function submit(e: any) {
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
        if (!portalId || !formGuid) {
            // Lets the success state be previewed on the Framer canvas before
            // the HubSpot IDs are wired in.
            setStatus("success")
            return
        }

        setStatus("submitting")
        setMessage("")
        try {
            const fields: { name: string; value: string }[] = [
                { name: hsEmailField, value: form.email },
                { name: hsNameField, value: form.name },
                { name: hsCompanyField, value: form.company },
            ]
            if (showRole && form.role) fields.push({ name: hsRoleField, value: form.role })

            const body: any = { fields }
            if (consentText) {
                body.legalConsentOptions = {
                    consent: { consentToProcess: true, text: consentText },
                }
            }

            const res = await fetch(
                `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                }
            )
            if (!res.ok) throw new Error(String(res.status))
            setStatus("success")
        } catch (err) {
            setStatus("error")
            setMessage(errorText)
        }
    }

    const css = `.x{width:100%;background:${sectionBg};font-family:${fontFamily};box-sizing:border-box;padding:72px 0}
    .xw{width:min(1180px,calc(100% - 48px));margin:auto;display:grid;grid-template-columns:1fr 1fr;gap:20px}
    .xe{grid-column:1 / -1;font-size:13px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#FFFFFF;opacity:.7;margin:0 0 6px}
    .p{border-radius:28px;padding:44px;display:flex;flex-direction:column;box-sizing:border-box}
    .pk{font-size:13px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;margin:0 0 14px}
    .pt{font-size:40px;font-weight:900;line-height:.98;letter-spacing:-.03em;text-transform:uppercase;margin:0}
    .pm{font-size:14px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;margin:18px 0 0;opacity:.8}
    .pb{font-size:17px;line-height:1.4;margin:16px 0 0;opacity:.9}
    .btn{display:inline-flex;gap:10px;align-items:center;justify-content:center;border:none;cursor:pointer;font-family:inherit;font-size:15px;font-weight:800;letter-spacing:.02em;text-decoration:none;padding:16px 26px;border-radius:999px;margin-top:auto}
    .attend .sp{flex:1}
    .frm{display:flex;flex-direction:column;gap:10px;margin-top:22px}
    .frm input{width:100%;box-sizing:border-box;font-family:inherit;font-size:15px;padding:14px 16px;border-radius:12px;border:1.5px solid rgba(20,33,61,.15);background:#fff;color:#14213D;outline:none}
    .frm input:focus{border-color:${guideBtnBg}}
    .row{display:flex;gap:10px}
    .row input{flex:1}
    .cs{display:flex;gap:10px;align-items:flex-start;font-size:12.5px;line-height:1.4;margin-top:2px;opacity:.85}
    .cs input{width:16px;height:16px;margin-top:2px;flex:0 0 auto}
    .cs a{color:inherit;text-decoration:underline}
    .msg{font-size:13px;font-weight:600;margin-top:6px}
    .ok{display:flex;flex-direction:column;gap:14px;justify-content:center;height:100%}
    .ok h4{font-size:26px;font-weight:900;letter-spacing:-.02em;text-transform:uppercase;margin:0}
    .ok p{font-size:16px;line-height:1.4;margin:0;opacity:.9}
    @media(max-width:860px){.xw{grid-template-columns:1fr}.p{padding:34px}.pt{font-size:32px}.row{flex-direction:column}}`

    return (
        <section className="x">
            <style>{css}</style>
            <div className="xw">
                <div className="xe">{eyebrow}</div>

                {/* Track A — attending */}
                <div className="p attend" style={{ background: attendBg, color: attendText }}>
                    <div className="pk" style={{ color: attendText, opacity: 0.7 }}>{attendKicker}</div>
                    <h3 className="pt">{attendTitle}</h3>
                    <div className="pm">{attendMeta}</div>
                    <p className="pb">{attendBody}</p>
                    <span className="sp" />
                    <a
                        className="btn"
                        href={attendCtaHref}
                        style={{ background: attendBtnBg, color: attendBtnText }}
                    >
                        {attendCtaLabel} ↗
                    </a>
                </div>

                {/* Track B — not attending → gated guide form */}
                <div className="p guide" style={{ background: guideBg, color: guideText }}>
                    {status === "success" ? (
                        <div className="ok">
                            <h4>{successTitle}</h4>
                            <p>{successBody}</p>
                            {guideUrl ? (
                                <a
                                    className="btn"
                                    href={guideUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ background: guideBtnBg, color: guideBtnText, marginTop: 6 }}
                                >
                                    {guideDownloadLabel} ↗
                                </a>
                            ) : null}
                        </div>
                    ) : (
                        <>
                            <div className="pk" style={{ color: guideText, opacity: 0.6 }}>{guideKicker}</div>
                            <h3 className="pt">{guideTitle}</h3>
                            <p className="pb">{guideBody}</p>
                            <form className="frm" onSubmit={submit}>
                                <div className="row">
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
                                    <label className="cs">
                                        <input
                                            type="checkbox"
                                            checked={consent}
                                            onChange={(e: any) => setConsent(e.target.checked)}
                                        />
                                        <span dangerouslySetInnerHTML={{ __html: consentText }} />
                                    </label>
                                ) : null}
                                {status === "error" && message ? (
                                    <div className="msg" style={{ color: "#C0392B" }}>{message}</div>
                                ) : null}
                                <button
                                    className="btn"
                                    type="submit"
                                    disabled={status === "submitting"}
                                    style={{ background: guideBtnBg, color: guideBtnText, marginTop: 8, opacity: status === "submitting" ? 0.7 : 1 }}
                                >
                                    {status === "submitting" ? "Sending…" : `${submitLabel} ↗`}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </section>
    )
}

BeamrIBCSplitCTA.defaultProps = {
    sectionBg: "#20347C",
    fontFamily: "Poppins, Arial, sans-serif",
    eyebrow: "YOUR NEXT STOP — TWO WAYS TO RIDE",

    attendBg: "#FFBE00",
    attendText: "#1A2A6B",
    attendKicker: "ATTENDING?",
    attendTitle: "SEE IT LIVE AT IBC 2026",
    attendMeta: "SEPTEMBER 11–14 · AMSTERDAM · STAND 1.D22",
    attendBody: "Catch Beamr + NVIDIA Video Super Resolution running on the show floor. Book a slot and we'll walk you through it.",
    attendCtaLabel: "BOOK A DEMO",
    attendCtaHref: "#",
    attendBtnBg: "#1A2A6B",
    attendBtnText: "#FFFFFF",

    guideBg: "#FFFFFF",
    guideText: "#14213D",
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
    guideBtnBg: "#3475F5",
    guideBtnText: "#FFFFFF",
    successTitle: "YOU'RE ON THE LINE.",
    successBody: "Check your inbox — the Video Pipeline Guide is on its way.",
    guideUrl: "",
    guideDownloadLabel: "DOWNLOAD NOW",
    errorText: "Something went wrong. Please try again.",

    portalId: "",
    formGuid: "",
    hsEmailField: "email",
    hsNameField: "firstname",
    hsCompanyField: "company",
    hsRoleField: "jobtitle",
}

addPropertyControls(BeamrIBCSplitCTA, {
    sectionBg: { type: ControlType.Color, title: "Section BG" },
    fontFamily: { type: ControlType.String, title: "Font Family" },
    eyebrow: { type: ControlType.String, title: "Eyebrow" },

    attendBg: { type: ControlType.Color, title: "Attend · BG" },
    attendText: { type: ControlType.Color, title: "Attend · Text" },
    attendKicker: { type: ControlType.String, title: "Attend · Kicker" },
    attendTitle: { type: ControlType.String, title: "Attend · Title" },
    attendMeta: { type: ControlType.String, title: "Attend · Meta" },
    attendBody: { type: ControlType.String, title: "Attend · Body", displayTextArea: true },
    attendCtaLabel: { type: ControlType.String, title: "Attend · Button" },
    attendCtaHref: { type: ControlType.Link, title: "Attend · Link" },
    attendBtnBg: { type: ControlType.Color, title: "Attend · Btn BG" },
    attendBtnText: { type: ControlType.Color, title: "Attend · Btn Text" },

    guideBg: { type: ControlType.Color, title: "Guide · BG" },
    guideText: { type: ControlType.Color, title: "Guide · Text" },
    guideKicker: { type: ControlType.String, title: "Guide · Kicker" },
    guideTitle: { type: ControlType.String, title: "Guide · Title" },
    guideBody: { type: ControlType.String, title: "Guide · Body", displayTextArea: true },
    namePlaceholder: { type: ControlType.String, title: "Field · Name" },
    emailPlaceholder: { type: ControlType.String, title: "Field · Email" },
    companyPlaceholder: { type: ControlType.String, title: "Field · Company" },
    showRole: { type: ControlType.Boolean, title: "Role Field", enabledTitle: "On", disabledTitle: "Off" },
    rolePlaceholder: { type: ControlType.String, title: "Field · Role", hidden: (x: any) => !x.showRole },
    consentText: { type: ControlType.String, title: "Consent Text", displayTextArea: true },
    consentRequired: { type: ControlType.Boolean, title: "Consent Required", enabledTitle: "Yes", disabledTitle: "No" },
    submitLabel: { type: ControlType.String, title: "Submit Label" },
    guideBtnBg: { type: ControlType.Color, title: "Guide · Btn BG" },
    guideBtnText: { type: ControlType.Color, title: "Guide · Btn Text" },
    successTitle: { type: ControlType.String, title: "Success · Title" },
    successBody: { type: ControlType.String, title: "Success · Body", displayTextArea: true },
    guideUrl: { type: ControlType.Link, title: "Guide File URL" },
    guideDownloadLabel: { type: ControlType.String, title: "Download Label", hidden: (x: any) => !x.guideUrl },
    errorText: { type: ControlType.String, title: "Error Text" },

    portalId: { type: ControlType.String, title: "HubSpot Portal ID" },
    formGuid: { type: ControlType.String, title: "HubSpot Form GUID" },
    hsEmailField: { type: ControlType.String, title: "HS · Email Field" },
    hsNameField: { type: ControlType.String, title: "HS · Name Field" },
    hsCompanyField: { type: ControlType.String, title: "HS · Company Field" },
    hsRoleField: { type: ControlType.String, title: "HS · Role Field", hidden: (x: any) => !x.showRole },
})
