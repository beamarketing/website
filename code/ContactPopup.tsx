// Beamr - Fullscreen Contact Popup
// Listens for "open-contact-popup" custom events on window
// Any link with href="#contact" is intercepted globally

import { addPropertyControls, ControlType } from "framer"
import { useState, useEffect, useRef, useCallback } from "react"
import { createPortal } from "react-dom"

interface Props {
    heading: string
    subheading: string
    accentColor: string
    bgColor: string
    textColor: string
    fontFamily: string
    style?: React.CSSProperties
}

function ContactPopup(props: Props) {
    const {
        heading = "Let's Talk",
        subheading = "Tell us about your video encoding needs and we'll get back to you within 24 hours.",
        accentColor = "#00d46a",
        bgColor = "#07071c",
        textColor = "#ffffff",
        fontFamily = "'Inter', sans-serif",
    } = props

    const [open, setOpen] = useState(false)
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        company: "",
        message: "",
    })
    const [submitted, setSubmitted] = useState(false)
    const overlayRef = useRef<HTMLDivElement>(null)

    // Listen for custom event
    useEffect(() => {
        const handler = () => setOpen(true)
        window.addEventListener("open-contact-popup", handler)
        return () => window.removeEventListener("open-contact-popup", handler)
    }, [])

    // Intercept all clicks on href="#contact" links
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            const target = (e.target as HTMLElement).closest("a")
            if (target && target.getAttribute("href") === "#contact") {
                e.preventDefault()
                setOpen(true)
            }
        }
        document.addEventListener("click", handler, true)
        return () => document.removeEventListener("click", handler, true)
    }, [])

    // Lock body scroll when open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }
        return () => {
            document.body.style.overflow = ""
        }
    }, [open])

    // Close on Escape
    useEffect(() => {
        if (!open) return
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false)
        }
        window.addEventListener("keydown", handler)
        return () => window.removeEventListener("keydown", handler)
    }, [open])

    const close = useCallback(() => {
        setOpen(false)
        setSubmitted(false)
        setFormState({ name: "", email: "", company: "", message: "" })
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: wire to actual endpoint
        setSubmitted(true)
    }

    const handleChange = (field: string, value: string) => {
        setFormState((prev) => ({ ...prev, [field]: value }))
    }

    if (!open) return null

    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "14px 16px",
        borderRadius: 8,
        border: "1px solid rgba(255,255,255,0.15)",
        backgroundColor: "rgba(255,255,255,0.06)",
        color: textColor,
        fontSize: 15,
        fontFamily,
        outline: "none",
        boxSizing: "border-box",
        transition: "border-color 0.2s ease",
    }

    return createPortal(
        <div
            ref={overlayRef}
            onClick={(e) => {
                if (e.target === overlayRef.current) close()
            }}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 100000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.85)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                animation: "contactPopupFadeIn 0.3s ease",
            }}
        >
            <style>{`
                @keyframes contactPopupFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes contactPopupSlideUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .contact-popup-input:focus {
                    border-color: ${accentColor} !important;
                }
            `}</style>

            {/* Close button */}
            <button
                onClick={close}
                style={{
                    position: "fixed",
                    top: 24,
                    right: 24,
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.15)",
                    backgroundColor: "rgba(255,255,255,0.06)",
                    color: textColor,
                    fontSize: 24,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 100001,
                    fontFamily,
                }}
            >
                &#10005;
            </button>

            {/* Form card */}
            <div
                style={{
                    width: "100%",
                    maxWidth: 520,
                    margin: "0 24px",
                    backgroundColor: bgColor,
                    borderRadius: 16,
                    border: "1px solid rgba(255,255,255,0.1)",
                    padding: "48px 40px",
                    animation: "contactPopupSlideUp 0.35s ease",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    boxSizing: "border-box",
                }}
            >
                {submitted ? (
                    <div style={{ textAlign: "center" }}>
                        <div
                            style={{
                                width: 64,
                                height: 64,
                                borderRadius: "50%",
                                backgroundColor: accentColor,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 24px",
                                fontSize: 32,
                            }}
                        >
                            &#10003;
                        </div>
                        <h2
                            style={{
                                color: textColor,
                                fontSize: 28,
                                fontWeight: 700,
                                fontFamily,
                                margin: "0 0 12px",
                            }}
                        >
                            Thank you!
                        </h2>
                        <p
                            style={{
                                color: "rgba(255,255,255,0.6)",
                                fontSize: 16,
                                fontFamily,
                                margin: "0 0 32px",
                                lineHeight: 1.6,
                            }}
                        >
                            We've received your message and will get back to you shortly.
                        </p>
                        <button
                            onClick={close}
                            style={{
                                backgroundColor: accentColor,
                                color: "#07071c",
                                border: "none",
                                padding: "14px 32px",
                                borderRadius: 10,
                                fontSize: 16,
                                fontWeight: 600,
                                cursor: "pointer",
                                fontFamily,
                            }}
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <>
                        <h2
                            style={{
                                color: textColor,
                                fontSize: 28,
                                fontWeight: 700,
                                fontFamily,
                                margin: "0 0 8px",
                            }}
                        >
                            {heading}
                        </h2>
                        <p
                            style={{
                                color: "rgba(255,255,255,0.6)",
                                fontSize: 15,
                                fontFamily,
                                margin: "0 0 32px",
                                lineHeight: 1.6,
                            }}
                        >
                            {subheading}
                        </p>

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                <div style={{ display: "flex", gap: 16 }}>
                                    <input
                                        className="contact-popup-input"
                                        type="text"
                                        placeholder="Name"
                                        required
                                        value={formState.name}
                                        onChange={(e) => handleChange("name", e.target.value)}
                                        style={inputStyle}
                                    />
                                    <input
                                        className="contact-popup-input"
                                        type="email"
                                        placeholder="Work Email"
                                        required
                                        value={formState.email}
                                        onChange={(e) => handleChange("email", e.target.value)}
                                        style={inputStyle}
                                    />
                                </div>
                                <input
                                    className="contact-popup-input"
                                    type="text"
                                    placeholder="Company"
                                    value={formState.company}
                                    onChange={(e) => handleChange("company", e.target.value)}
                                    style={inputStyle}
                                />
                                <textarea
                                    className="contact-popup-input"
                                    placeholder="How can we help?"
                                    rows={4}
                                    required
                                    value={formState.message}
                                    onChange={(e) => handleChange("message", e.target.value)}
                                    style={{
                                        ...inputStyle,
                                        resize: "vertical",
                                        minHeight: 100,
                                    }}
                                />
                                <button
                                    type="submit"
                                    style={{
                                        width: "100%",
                                        backgroundColor: accentColor,
                                        color: "#07071c",
                                        border: "none",
                                        padding: "16px 32px",
                                        borderRadius: 10,
                                        fontSize: 16,
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        fontFamily,
                                        marginTop: 8,
                                        transition: "opacity 0.2s ease",
                                    }}
                                >
                                    Send Message
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>,
        document.body
    )
}

addPropertyControls(ContactPopup, {
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "Let's Talk",
    },
    subheading: {
        type: ControlType.String,
        title: "Subheading",
        defaultValue:
            "Tell us about your video encoding needs and we'll get back to you within 24 hours.",
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "#00d46a",
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#07071c",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#ffffff",
    },
    fontFamily: {
        type: ControlType.String,
        title: "Font Family",
        defaultValue: "'Inter', sans-serif",
    },
})

export default ContactPopup
