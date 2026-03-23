// Beamr Homepage - Footer
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"
import { useState, useEffect, useRef } from "react"

interface FooterLink {
    label: string
    url: string
}

interface NavLink {
    column: string
    label: string
    url: string
}

interface SocialLink {
    platform: string
    url: string
}

interface Props {
    logoText: string
    logoImage: string
    useLogoImage: boolean
    tagline: string
    showNavigation: boolean
    navLinks: NavLink[]
    socialLinks: SocialLink[]
    soc2Image: string
    showNewsletter: boolean
    newsletterHeading: string
    newsletterPlaceholder: string
    newsletterButtonText: string
    mailerliteApiKey: string
    mailerliteGroupId: string
    copyrightText: string
    bottomLinks: FooterLink[]
    bgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    borderColor: string
    fontFamily: string
    style?: React.CSSProperties
}

function Footer(props: Props) {
    const {
        logoText = "BEAMR",
        logoImage = "",
        useLogoImage = false,
        tagline = "AI-powered video optimization for the modern enterprise.",
        showNavigation = true,
        navLinks = [
            { column: "Solutions", label: "Media & Entertainment", url: "#" },
            { column: "Solutions", label: "Autonomous Vehicles", url: "#" },
            { column: "Solutions", label: "AI / Machine Learning", url: "#" },
            { column: "Solutions", label: "Cloud Gaming", url: "#" },
            { column: "Company", label: "About Us", url: "#" },
            { column: "Company", label: "Careers", url: "#" },
            { column: "Company", label: "Press", url: "#" },
            { column: "Company", label: "Contact", url: "#" },
            { column: "Resources", label: "Blog", url: "#" },
            { column: "Resources", label: "Documentation", url: "#" },
            { column: "Resources", label: "Case Studies", url: "#" },
            { column: "Resources", label: "Webinars", url: "#" },
        ],
        socialLinks = [
            { platform: "LinkedIn", url: "#" },
            { platform: "Twitter", url: "#" },
            { platform: "YouTube", url: "#" },
        ],
        soc2Image = "",
        showNewsletter = true,
        newsletterHeading = "Stay Updated",
        newsletterPlaceholder = "Enter your email",
        newsletterButtonText = "Subscribe",
        mailerliteApiKey = "84d734a2a44275c3fc53f6c755162285",
        mailerliteGroupId = "106165528",
        copyrightText = "2026 Beamr Imaging Ltd. All rights reserved.",
        bottomLinks = [
            { label: "Privacy Policy", url: "#privacy" },
            { label: "Terms of Service", url: "#terms" },
        ],
        bgColor = "#050516",
        textColor = "#ffffff",
        secondaryTextColor = "#8b8ba3",
        accentColor = "#00d46a",
        borderColor = "rgba(255,255,255,0.06)",
        fontFamily = "'Inter', sans-serif",
        style,
    } = props

    // Responsive detection based on component's own width (not viewport)
    const footerRef = useRef<HTMLElement>(null)
    const [isMobile, setIsMobile] = useState(false)
    const [isTablet, setIsTablet] = useState(false)
    useEffect(() => {
        const el = footerRef.current
        if (!el) return
        const ro = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const w = entry.contentRect.width
                setIsMobile(w < 480)
                setIsTablet(w >= 480 && w < 900)
            }
        })
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    // Group flat navLinks by column name, preserving order
    const columns: { title: string; links: { label: string; url: string }[] }[] = []
    const columnMap = new Map<string, { label: string; url: string }[]>()
    for (const link of navLinks) {
        const col = link.column || "Links"
        if (!columnMap.has(col)) {
            const links: { label: string; url: string }[] = []
            columnMap.set(col, links)
            columns.push({ title: col, links })
        }
        columnMap.get(col)!.push({ label: link.label, url: link.url })
    }

    // Newsletter state
    const [email, setEmail] = useState("")
    const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle")

    const handleNewsletterSubmit = async () => {
        if (!email || !mailerliteApiKey) return

        setSubmitState("loading")
        try {
            const res = await fetch(
                `https://api.mailerlite.com/api/v2/groups/${mailerliteGroupId}/subscribers`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-MailerLite-ApiKey": mailerliteApiKey,
                    },
                    body: JSON.stringify({ email }),
                }
            )
            if (res.ok) {
                setSubmitState("success")
                setEmail("")
            } else {
                setSubmitState("error")
            }
        } catch {
            setSubmitState("error")
        }
    }

    const socialIcons: Record<string, string> = {
        LinkedIn: "in",
        Twitter: "X",
        YouTube: "YT",
        Facebook: "f",
        Instagram: "IG",
        GitHub: "GH",
    }

    return (
        <footer
            ref={footerRef}
            style={{
                ...style,
                width: "100%",
                backgroundColor: bgColor,
                padding: isMobile ? "48px 20px 32px" : isTablet ? "56px 32px 36px" : "80px 48px 40px",
                boxSizing: "border-box",
                fontFamily,
                borderTop: `1px solid ${borderColor}`,
            }}
        >
            <div
                style={{
                    maxWidth: 1280,
                    margin: "0 auto",
                }}
            >
                {/* Top Section */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: isMobile
                            ? "1fr"
                            : isTablet
                              ? "repeat(2, 1fr)"
                              : `1.5fr ${showNavigation ? columns.map(() => "1fr").join(" ") : ""} ${showNewsletter ? "1.5fr" : ""}`,
                        gap: isMobile ? 32 : isTablet ? 32 : 48,
                        paddingBottom: isMobile ? 32 : isTablet ? 36 : 48,
                        borderBottom: `1px solid ${borderColor}`,
                    }}
                >
                    {/* Logo & Tagline */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 16,
                        }}
                    >
                        {useLogoImage && logoImage ? (
                            <img
                                src={logoImage}
                                alt={logoText}
                                style={{
                                    height: 28,
                                    objectFit: "contain",
                                    alignSelf: "flex-start",
                                }}
                            />
                        ) : (
                            <span
                                style={{
                                    fontSize: 22,
                                    fontWeight: 700,
                                    color: textColor,
                                    letterSpacing: "0.05em",
                                    fontFamily,
                                }}
                            >
                                {logoText}
                            </span>
                        )}
                        <p
                            style={{
                                fontSize: 14,
                                color: secondaryTextColor,
                                margin: 0,
                                lineHeight: 1.6,
                                maxWidth: 280,
                                fontFamily,
                            }}
                        >
                            {tagline}
                        </p>

                        {/* SOC 2 Badge */}
                        {soc2Image && (
                            <img
                                src={soc2Image}
                                alt="SOC 2 Certified"
                                style={{
                                    height: 64,
                                    objectFit: "contain",
                                    alignSelf: "flex-start",
                                    marginTop: 8,
                                }}
                            />
                        )}

                        {/* Social Links */}
                        <div
                            style={{
                                display: "flex",
                                gap: 12,
                                marginTop: 8,
                            }}
                        >
                            {socialLinks.map((social, i) => (
                                <a
                                    key={i}
                                    href={social.url}
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 8,
                                        backgroundColor:
                                            "rgba(255,255,255,0.06)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        textDecoration: "none",
                                        color: secondaryTextColor,
                                        fontSize: 12,
                                        fontWeight: 600,
                                        fontFamily,
                                        transition: "background-color 0.2s",
                                    }}
                                >
                                    {socialIcons[social.platform] ||
                                        social.platform[0]}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link Columns */}
                    {showNavigation && columns.map((column, i) => (
                        <div
                            key={i}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 16,
                            }}
                        >
                            <h4
                                style={{
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: textColor,
                                    margin: 0,
                                    fontFamily,
                                }}
                            >
                                {column.title}
                            </h4>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 10,
                                }}
                            >
                                {column.links.map((link, j) => (
                                    <a
                                        key={j}
                                        href={link.url}
                                        style={{
                                            fontSize: 14,
                                            color: secondaryTextColor,
                                            textDecoration: "none",
                                            fontFamily,
                                            transition: "color 0.2s",
                                        }}
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Newsletter */}
                    {showNewsletter && (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 16,
                            }}
                        >
                            <h4
                                style={{
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: textColor,
                                    margin: 0,
                                    fontFamily,
                                }}
                            >
                                {newsletterHeading}
                            </h4>
                            <div
                                style={{
                                    display: "flex",
                                    gap: 8,
                                }}
                            >
                                <input
                                    type="email"
                                    placeholder={newsletterPlaceholder}
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                        if (submitState !== "idle") setSubmitState("idle")
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleNewsletterSubmit()
                                    }}
                                    style={{
                                        flex: 1,
                                        padding: "10px 14px",
                                        borderRadius: 8,
                                        border: `1px solid ${borderColor}`,
                                        backgroundColor:
                                            "rgba(255,255,255,0.04)",
                                        color: textColor,
                                        fontSize: 14,
                                        fontFamily,
                                        outline: "none",
                                    }}
                                />
                                <button
                                    onClick={handleNewsletterSubmit}
                                    disabled={submitState === "loading"}
                                    style={{
                                        padding: "10px 20px",
                                        borderRadius: 8,
                                        border: "none",
                                        backgroundColor:
                                            submitState === "success"
                                                ? "#22c55e"
                                                : submitState === "error"
                                                  ? "#ef4444"
                                                  : accentColor,
                                        color: "#07071c",
                                        fontSize: 14,
                                        fontWeight: 600,
                                        cursor:
                                            submitState === "loading"
                                                ? "wait"
                                                : "pointer",
                                        fontFamily,
                                        whiteSpace: "nowrap",
                                        opacity:
                                            submitState === "loading" ? 0.7 : 1,
                                        transition:
                                            "background-color 0.2s, opacity 0.2s",
                                    }}
                                >
                                    {submitState === "loading"
                                        ? "..."
                                        : submitState === "success"
                                          ? "Subscribed!"
                                          : submitState === "error"
                                            ? "Try Again"
                                            : newsletterButtonText}
                                </button>
                            </div>
                            <p
                                style={{
                                    fontSize: 12,
                                    color: secondaryTextColor,
                                    margin: 0,
                                    opacity: 0.7,
                                    fontFamily,
                                }}
                            >
                                {submitState === "success"
                                    ? "Thank you for subscribing!"
                                    : submitState === "error"
                                      ? "Something went wrong. Please try again."
                                      : "No spam. Unsubscribe anytime."}
                            </p>
                        </div>
                    )}
                </div>

                {/* Bottom Bar */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: isMobile || isTablet ? "column" : "row",
                        justifyContent: "space-between",
                        alignItems: isMobile || isTablet ? "flex-start" : "center",
                        gap: isMobile || isTablet ? 16 : 0,
                        paddingTop: 24,
                    }}
                >
                    <p
                        style={{
                            fontSize: 13,
                            color: secondaryTextColor,
                            margin: 0,
                            fontFamily,
                            opacity: 0.7,
                        }}
                    >
                        &copy; {copyrightText}
                    </p>
                    <div
                        style={{
                            display: "flex",
                            gap: 24,
                        }}
                    >
                        {bottomLinks.map((link, i) => (
                            <a
                                key={i}
                                href={link.url}
                                style={{
                                    fontSize: 13,
                                    color: secondaryTextColor,
                                    textDecoration: "none",
                                    fontFamily,
                                    opacity: 0.7,
                                }}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}

addPropertyControls(Footer, {
    useLogoImage: {
        type: ControlType.Boolean,
        title: "Use Logo Image",
        defaultValue: false,
    },
    logoImage: {
        type: ControlType.Image,
        title: "Logo Image",
        hidden: (props) => !props.useLogoImage,
    },
    logoText: {
        type: ControlType.String,
        title: "Logo Text",
        defaultValue: "BEAMR",
        hidden: (props) => props.useLogoImage,
    },
    tagline: {
        type: ControlType.String,
        title: "Tagline",
        defaultValue:
            "AI-powered video optimization for the modern enterprise.",
        displayTextArea: true,
    },
    showNavigation: {
        type: ControlType.Boolean,
        title: "Show Navigation",
        defaultValue: true,
    },
    navLinks: {
        type: ControlType.Array,
        title: "Navigation Links",
        maxCount: 40,
        control: {
            type: ControlType.Object,
            controls: {
                column: {
                    type: ControlType.String,
                    title: "Column",
                    defaultValue: "Links",
                },
                label: {
                    type: ControlType.String,
                    title: "Label",
                    defaultValue: "Link",
                },
                url: {
                    type: ControlType.String,
                    title: "URL",
                    defaultValue: "#",
                },
            },
        },
        defaultValue: [
            { column: "Solutions", label: "Media & Entertainment", url: "#" },
            { column: "Solutions", label: "Autonomous Vehicles", url: "#" },
            { column: "Solutions", label: "AI / Machine Learning", url: "#" },
            { column: "Solutions", label: "Cloud Gaming", url: "#" },
            { column: "Company", label: "About Us", url: "#" },
            { column: "Company", label: "Careers", url: "#" },
            { column: "Company", label: "Press", url: "#" },
            { column: "Company", label: "Contact", url: "#" },
            { column: "Resources", label: "Blog", url: "#" },
            { column: "Resources", label: "Documentation", url: "#" },
            { column: "Resources", label: "Case Studies", url: "#" },
            { column: "Resources", label: "Webinars", url: "#" },
        ],
        hidden: (props) => !props.showNavigation,
    },
    socialLinks: {
        type: ControlType.Array,
        title: "Social Links",
        maxCount: 6,
        control: {
            type: ControlType.Object,
            controls: {
                platform: {
                    type: ControlType.Enum,
                    title: "Platform",
                    options: [
                        "LinkedIn",
                        "Twitter",
                        "YouTube",
                        "Facebook",
                        "Instagram",
                        "GitHub",
                    ],
                    defaultValue: "LinkedIn",
                },
                url: {
                    type: ControlType.String,
                    title: "URL",
                    defaultValue: "#",
                },
            },
        },
        defaultValue: [
            { platform: "LinkedIn", url: "#" },
            { platform: "Twitter", url: "#" },
            { platform: "YouTube", url: "#" },
        ],
    },
    soc2Image: {
        type: ControlType.Image,
        title: "SOC 2 Badge",
    },
    showNewsletter: {
        type: ControlType.Boolean,
        title: "Show Newsletter",
        defaultValue: true,
    },
    newsletterHeading: {
        type: ControlType.String,
        title: "Newsletter Title",
        defaultValue: "Stay Updated",
        hidden: (props) => !props.showNewsletter,
    },
    newsletterPlaceholder: {
        type: ControlType.String,
        title: "Email Placeholder",
        defaultValue: "Enter your email",
        hidden: (props) => !props.showNewsletter,
    },
    newsletterButtonText: {
        type: ControlType.String,
        title: "Button Text",
        defaultValue: "Subscribe",
        hidden: (props) => !props.showNewsletter,
    },
    mailerliteApiKey: {
        type: ControlType.String,
        title: "MailerLite API Key",
        defaultValue: "84d734a2a44275c3fc53f6c755162285",
        hidden: (props) => !props.showNewsletter,
        description: "Your MailerLite API key (Integrations > API)",
    },
    mailerliteGroupId: {
        type: ControlType.String,
        title: "MailerLite Group ID",
        defaultValue: "106165528",
        hidden: (props) => !props.showNewsletter,
        description: "The group ID subscribers will be added to",
    },
    copyrightText: {
        type: ControlType.String,
        title: "Copyright",
        defaultValue: "2026 Beamr Imaging Ltd. All rights reserved.",
    },
    bottomLinks: {
        type: ControlType.Array,
        title: "Bottom Links",
        maxCount: 10,
        control: {
            type: ControlType.Object,
            controls: {
                label: {
                    type: ControlType.String,
                    title: "Label",
                    defaultValue: "Link",
                },
                url: {
                    type: ControlType.String,
                    title: "URL",
                    defaultValue: "#",
                },
            },
        },
        defaultValue: [
            { label: "Privacy Policy", url: "#privacy" },
            { label: "Terms of Service", url: "#terms" },
        ],
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#050516",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#ffffff",
    },
    secondaryTextColor: {
        type: ControlType.Color,
        title: "Secondary Text",
        defaultValue: "#8b8ba3",
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "#00d46a",
    },
    borderColor: {
        type: ControlType.Color,
        title: "Border Color",
        defaultValue: "rgba(255,255,255,0.06)",
    },
    fontFamily: {
        type: ControlType.String,
        title: "Font Family",
        defaultValue: "'Inter', sans-serif",
    },
})

export default Footer
