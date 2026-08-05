// Beamr 5 HEVC Page - Footer Section
// Dark footer with brand, nav columns, newsletter and legal bar
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"

interface LinkItem {
    text: string
    url: string
}

interface FooterColumn {
    title: string
    links: LinkItem[]
}

interface SocialLink {
    platform: string
    url: string
}

interface Props {
    logoText: string
    logoIconColor: string
    tagline: string
    columns: FooterColumn[]
    socialLinks: SocialLink[]
    newsletterTitle: string
    newsletterNote: string
    subscribeText: string
    copyright: string
    bottomLinks: LinkItem[]
    bgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    borderColor: string
    headingFont: string
    fontFamily: string
    style?: React.CSSProperties
}

const socialIcons: Record<string, string> = {
    linkedin: "in",
    facebook: "f",
    twitter: "𝕏",
    youtube: "▶",
}

function Beamr5Footer(props: Props) {
    const {
        logoText = "beamr",
        logoIconColor = "#2f73ff",
        tagline = "Emmy® Award-winning technology. Smaller files, better video. For human eyes and machine vision.",
        columns = [
            {
                title: "Solutions",
                links: [
                    { text: "Media & Entertainment", url: "#" },
                    { text: "Autonomous Vehicles", url: "#" },
                ],
            },
            {
                title: "Products",
                links: [
                    { text: "Beamr 5 (HEVC)", url: "#" },
                    { text: "Beamr VISTA", url: "#" },
                    { text: "JPEGmini", url: "#" },
                ],
            },
            {
                title: "Company",
                links: [
                    { text: "News", url: "#" },
                    { text: "Blog", url: "#" },
                    { text: "Investor Relations", url: "#" },
                ],
            },
        ],
        socialLinks = [{ platform: "linkedin", url: "#" }],
        newsletterTitle = "Stay Updated",
        newsletterNote = "No spam. Unsubscribe anytime.",
        subscribeText = "Subscribe",
        copyright = "© 2026 Beamr Imaging Ltd. All rights reserved.",
        bottomLinks = [{ text: "Privacy Policy", url: "#" }],
        bgColor = "#050516",
        textColor = "#ffffff",
        secondaryTextColor = "#8b8ba3",
        accentColor = "#2f73ff",
        borderColor = "rgba(255,255,255,0.08)",
        headingFont = "'Poppins', sans-serif",
        fontFamily = "'Inter', sans-serif",
        style,
    } = props

    const cls = "beamr5-footer"

    return (
        <footer
            style={{
                ...style,
                width: "100%",
                backgroundColor: bgColor,
                padding: "72px 48px 36px",
                boxSizing: "border-box",
                fontFamily,
            }}
        >
            <style>{`
                .${cls}-grid {
                    display: grid;
                    grid-template-columns: 1.6fr repeat(3, 1fr) 1.4fr;
                    gap: 40px;
                }
                @media (max-width: 900px) {
                    .${cls}-grid { grid-template-columns: 1fr 1fr; }
                }
                @media (max-width: 560px) {
                    .${cls}-grid { grid-template-columns: 1fr; }
                }
            `}</style>

            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
                <div
                    className={`${cls}-grid`}
                    style={{ paddingBottom: 56 }}
                >
                    {/* Brand */}
                    <div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 9,
                                marginBottom: 18,
                            }}
                        >
                            <div
                                style={{
                                    width: 26,
                                    height: 26,
                                    borderRadius: 6,
                                    background: logoIconColor,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <div
                                    style={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: 3,
                                        background: "#ffffff",
                                    }}
                                />
                            </div>
                            <span
                                style={{
                                    fontSize: 20,
                                    fontWeight: 700,
                                    color: textColor,
                                    letterSpacing: "-0.02em",
                                    fontFamily: headingFont,
                                }}
                            >
                                {logoText}
                            </span>
                        </div>
                        <p
                            style={{
                                fontSize: 14,
                                color: secondaryTextColor,
                                margin: "0 0 22px",
                                lineHeight: 1.6,
                                maxWidth: 280,
                                fontFamily,
                            }}
                        >
                            {tagline}
                        </p>
                        <div style={{ display: "flex", gap: 10 }}>
                            {socialLinks.map((social, i) => (
                                <a
                                    key={i}
                                    href={social.url}
                                    aria-label={social.platform}
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 8,
                                        backgroundColor: "rgba(255,255,255,0.06)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        textDecoration: "none",
                                        color: secondaryTextColor,
                                        fontSize: 14,
                                        fontWeight: 700,
                                        fontFamily,
                                    }}
                                >
                                    {socialIcons[social.platform] ||
                                        social.platform[0]?.toUpperCase()}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Nav columns */}
                    {columns.map((col, i) => (
                        <div key={i}>
                            <div
                                style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: textColor,
                                    marginBottom: 18,
                                    fontFamily: headingFont,
                                }}
                            >
                                {col.title}
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 12,
                                }}
                            >
                                {col.links.map((link, j) => (
                                    <a
                                        key={j}
                                        href={link.url}
                                        style={{
                                            fontSize: 14,
                                            color: secondaryTextColor,
                                            textDecoration: "none",
                                            fontFamily,
                                        }}
                                    >
                                        {link.text}
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Newsletter */}
                    <div>
                        <div
                            style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: textColor,
                                marginBottom: 18,
                                fontFamily: headingFont,
                            }}
                        >
                            {newsletterTitle}
                        </div>
                        <div
                            style={{
                                display: "flex",
                                gap: 8,
                                marginBottom: 12,
                            }}
                        >
                            <input
                                type="email"
                                placeholder="Your email"
                                style={{
                                    flex: 1,
                                    minWidth: 0,
                                    padding: "10px 14px",
                                    borderRadius: 8,
                                    border: "1px solid rgba(255,255,255,0.12)",
                                    backgroundColor: "rgba(255,255,255,0.04)",
                                    color: textColor,
                                    fontSize: 14,
                                    fontFamily,
                                    outline: "none",
                                }}
                            />
                            <button
                                style={{
                                    backgroundColor: accentColor,
                                    color: "#ffffff",
                                    border: "none",
                                    padding: "10px 18px",
                                    borderRadius: 8,
                                    fontSize: 14,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    fontFamily,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {subscribeText}
                            </button>
                        </div>
                        <div
                            style={{
                                fontSize: 12.5,
                                color: secondaryTextColor,
                                fontFamily,
                            }}
                        >
                            {newsletterNote}
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div
                    style={{
                        borderTop: `1px solid ${borderColor}`,
                        paddingTop: 24,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 14,
                    }}
                >
                    <span
                        style={{
                            fontSize: 13,
                            color: secondaryTextColor,
                            fontFamily,
                        }}
                    >
                        {copyright}
                    </span>
                    <div style={{ display: "flex", gap: 22 }}>
                        {bottomLinks.map((link, i) => (
                            <a
                                key={i}
                                href={link.url}
                                style={{
                                    fontSize: 13,
                                    color: secondaryTextColor,
                                    textDecoration: "none",
                                    fontFamily,
                                }}
                            >
                                {link.text}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}

addPropertyControls(Beamr5Footer, {
    logoText: {
        type: ControlType.String,
        title: "Logo Text",
        defaultValue: "beamr",
    },
    logoIconColor: {
        type: ControlType.Color,
        title: "Logo Icon",
        defaultValue: "#2f73ff",
    },
    tagline: {
        type: ControlType.String,
        title: "Tagline",
        defaultValue:
            "Emmy® Award-winning technology. Smaller files, better video. For human eyes and machine vision.",
        displayTextArea: true,
    },
    columns: {
        type: ControlType.Array,
        title: "Nav Columns",
        maxCount: 5,
        control: {
            type: ControlType.Object,
            controls: {
                title: {
                    type: ControlType.String,
                    title: "Column Title",
                    defaultValue: "Column",
                },
                links: {
                    type: ControlType.Array,
                    title: "Links",
                    maxCount: 8,
                    control: {
                        type: ControlType.Object,
                        controls: {
                            text: {
                                type: ControlType.String,
                                title: "Text",
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
                        { text: "Link 1", url: "#" },
                        { text: "Link 2", url: "#" },
                    ],
                },
            },
        },
        defaultValue: [
            {
                title: "Solutions",
                links: [
                    { text: "Media & Entertainment", url: "#" },
                    { text: "Autonomous Vehicles", url: "#" },
                ],
            },
            {
                title: "Products",
                links: [
                    { text: "Beamr 5 (HEVC)", url: "#" },
                    { text: "Beamr VISTA", url: "#" },
                    { text: "JPEGmini", url: "#" },
                ],
            },
            {
                title: "Company",
                links: [
                    { text: "News", url: "#" },
                    { text: "Blog", url: "#" },
                    { text: "Investor Relations", url: "#" },
                ],
            },
        ],
    },
    socialLinks: {
        type: ControlType.Array,
        title: "Social Links",
        maxCount: 5,
        control: {
            type: ControlType.Object,
            controls: {
                platform: {
                    type: ControlType.Enum,
                    title: "Platform",
                    options: ["linkedin", "facebook", "twitter", "youtube"],
                    optionTitles: ["LinkedIn", "Facebook", "Twitter/X", "YouTube"],
                    defaultValue: "linkedin",
                },
                url: {
                    type: ControlType.String,
                    title: "URL",
                    defaultValue: "#",
                },
            },
        },
        defaultValue: [
            { platform: "linkedin", url: "#" },
            { platform: "facebook", url: "#" },
            { platform: "twitter", url: "#" },
        ],
    },
    newsletterTitle: {
        type: ControlType.String,
        title: "Newsletter Title",
        defaultValue: "Stay Updated",
    },
    subscribeText: {
        type: ControlType.String,
        title: "Subscribe Button",
        defaultValue: "Subscribe",
    },
    newsletterNote: {
        type: ControlType.String,
        title: "Newsletter Note",
        defaultValue: "No spam. Unsubscribe anytime.",
    },
    copyright: {
        type: ControlType.String,
        title: "Copyright",
        defaultValue: "© 2026 Beamr Imaging Ltd. All rights reserved.",
    },
    bottomLinks: {
        type: ControlType.Array,
        title: "Bottom Links",
        maxCount: 5,
        control: {
            type: ControlType.Object,
            controls: {
                text: {
                    type: ControlType.String,
                    title: "Text",
                    defaultValue: "Link",
                },
                url: {
                    type: ControlType.String,
                    title: "URL",
                    defaultValue: "#",
                },
            },
        },
        defaultValue: [{ text: "Privacy Policy", url: "#" }],
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
        defaultValue: "#2f73ff",
    },
    borderColor: {
        type: ControlType.Color,
        title: "Border Color",
        defaultValue: "rgba(255,255,255,0.08)",
    },
    headingFont: {
        type: ControlType.String,
        title: "Heading Font",
        defaultValue: "'Poppins', sans-serif",
    },
    fontFamily: {
        type: ControlType.String,
        title: "Body Font",
        defaultValue: "'Inter', sans-serif",
    },
})

export default Beamr5Footer
