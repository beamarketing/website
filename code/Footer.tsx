// Beamr Homepage - Footer
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"

interface FooterLink {
    label: string
    url: string
}

interface FooterColumn {
    title: string
    links: FooterLink[]
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
    columns: FooterColumn[]
    socialLinks: SocialLink[]
    showNewsletter: boolean
    newsletterHeading: string
    newsletterPlaceholder: string
    newsletterButtonText: string
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
        columns = [
            {
                title: "Solutions",
                links: [
                    { label: "Media & Entertainment", url: "#" },
                    { label: "Autonomous Vehicles", url: "#" },
                    { label: "AI / Machine Learning", url: "#" },
                    { label: "Cloud Gaming", url: "#" },
                ],
            },
            {
                title: "Company",
                links: [
                    { label: "About Us", url: "#" },
                    { label: "Careers", url: "#" },
                    { label: "Press", url: "#" },
                    { label: "Contact", url: "#" },
                ],
            },
            {
                title: "Resources",
                links: [
                    { label: "Blog", url: "#" },
                    { label: "Documentation", url: "#" },
                    { label: "Case Studies", url: "#" },
                    { label: "Webinars", url: "#" },
                ],
            },
        ],
        socialLinks = [
            { platform: "LinkedIn", url: "#" },
            { platform: "Twitter", url: "#" },
            { platform: "YouTube", url: "#" },
        ],
        showNewsletter = true,
        newsletterHeading = "Stay Updated",
        newsletterPlaceholder = "Enter your email",
        newsletterButtonText = "Subscribe",
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
            style={{
                ...style,
                width: "100%",
                backgroundColor: bgColor,
                padding: "80px 48px 40px",
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
                        gridTemplateColumns: `1.5fr ${columns.map(() => "1fr").join(" ")} ${showNewsletter ? "1.5fr" : ""}`,
                        gap: 48,
                        paddingBottom: 48,
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
                    {columns.map((column, i) => (
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
                                    style={{
                                        padding: "10px 20px",
                                        borderRadius: 8,
                                        border: "none",
                                        backgroundColor: accentColor,
                                        color: "#07071c",
                                        fontSize: 14,
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        fontFamily,
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {newsletterButtonText}
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
                                No spam. Unsubscribe anytime.
                            </p>
                        </div>
                    )}
                </div>

                {/* Bottom Bar */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
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
    columns: {
        type: ControlType.Array,
        title: "Link Columns",
        maxCount: 5,
        control: {
            type: ControlType.Object,
            controls: {
                title: {
                    type: ControlType.String,
                    title: "Column Title",
                    defaultValue: "Links",
                },
                links: {
                    type: ControlType.Array,
                    title: "Links",
                    maxCount: 20,
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
                    defaultValue: [{ label: "Link 1", url: "#" }],
                },
            },
        },
        defaultValue: [
            {
                title: "Solutions",
                links: [
                    { label: "Media & Entertainment", url: "#" },
                    { label: "Autonomous Vehicles", url: "#" },
                    { label: "AI / Machine Learning", url: "#" },
                    { label: "Cloud Gaming", url: "#" },
                ],
            },
            {
                title: "Company",
                links: [
                    { label: "About Us", url: "#" },
                    { label: "Careers", url: "#" },
                    { label: "Press", url: "#" },
                    { label: "Contact", url: "#" },
                ],
            },
            {
                title: "Resources",
                links: [
                    { label: "Blog", url: "#" },
                    { label: "Documentation", url: "#" },
                    { label: "Case Studies", url: "#" },
                    { label: "Webinars", url: "#" },
                ],
            },
        ],
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
