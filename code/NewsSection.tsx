// Beamr Homepage - News and Stories Section
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"

interface BlogPost {
    image: string
    category: string
    date: string
    title: string
    excerpt: string
    url: string
}

interface Props {
    sectionLabel: string
    heading: string
    subheading: string
    posts: BlogPost[]
    viewAllText: string
    viewAllUrl: string
    showViewAll: boolean
    columns: number
    bgColor: string
    cardBgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    fontFamily: string
    cardBorderRadius: number
    style?: React.CSSProperties
}

function NewsSection(props: Props) {
    const {
        sectionLabel = "INSIGHTS",
        heading = "News and Stories",
        subheading = "Stay up to date with the latest in video optimization technology.",
        posts = [
            {
                image: "",
                category: "Technology",
                date: "Jan 15, 2026",
                title: "How CABR Reduces CDN Costs by 50% Without Quality Loss",
                excerpt:
                    "Discover the science behind content-adaptive bitrate encoding and how it's transforming video delivery.",
                url: "#",
            },
            {
                image: "",
                category: "Case Study",
                date: "Jan 10, 2026",
                title: "Netflix Partner Saves $2M in Annual Bandwidth Costs",
                excerpt:
                    "Learn how a major streaming partner leveraged Beamr to dramatically cut infrastructure spending.",
                url: "#",
            },
            {
                image: "",
                category: "Industry",
                date: "Jan 5, 2026",
                title: "The Future of Autonomous Vehicle Video Processing",
                excerpt:
                    "Exploring how efficient video encoding is critical for next-generation self-driving technology.",
                url: "#",
            },
        ],
        viewAllText = "View All Articles",
        viewAllUrl = "/blog",
        showViewAll = true,
        columns = 3,
        bgColor = "#07071c",
        cardBgColor = "#0f1029",
        textColor = "#ffffff",
        secondaryTextColor = "#8b8ba3",
        accentColor = "#00d46a",
        fontFamily = "'Inter', sans-serif",
        cardBorderRadius = 16,
        style,
    } = props

    return (
        <section
            style={{
                ...style,
                width: "100%",
                backgroundColor: bgColor,
                padding: "100px 48px",
                boxSizing: "border-box",
                fontFamily,
            }}
        >
            <div
                style={{
                    maxWidth: 1280,
                    margin: "0 auto",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                        marginBottom: 48,
                    }}
                >
                    <div>
                        <span
                            style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: accentColor,
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                fontFamily,
                            }}
                        >
                            {sectionLabel}
                        </span>
                        <h2
                            style={{
                                fontSize: 44,
                                fontWeight: 700,
                                color: textColor,
                                margin: "16px 0 0",
                                lineHeight: 1.15,
                                fontFamily,
                                letterSpacing: "-0.02em",
                            }}
                        >
                            {heading}
                        </h2>
                        <p
                            style={{
                                fontSize: 17,
                                color: secondaryTextColor,
                                margin: "12px 0 0",
                                lineHeight: 1.6,
                                fontFamily,
                            }}
                        >
                            {subheading}
                        </p>
                    </div>

                    {showViewAll && (
                        <a
                            href={viewAllUrl}
                            style={{
                                fontSize: 15,
                                fontWeight: 500,
                                color: accentColor,
                                textDecoration: "none",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                fontFamily,
                                whiteSpace: "nowrap",
                                flexShrink: 0,
                            }}
                        >
                            {viewAllText}{" "}
                            <span style={{ fontSize: 16 }}>&#8594;</span>
                        </a>
                    )}
                </div>

                {/* Posts Grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${Math.min(columns, posts.length)}, 1fr)`,
                        gap: 24,
                    }}
                >
                    {posts.map((post, i) => (
                        <a
                            key={i}
                            href={post.url}
                            style={{
                                textDecoration: "none",
                                backgroundColor: cardBgColor,
                                borderRadius: cardBorderRadius,
                                border: "1px solid rgba(255,255,255,0.06)",
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column",
                                transition: "border-color 0.3s, transform 0.3s",
                            }}
                        >
                            {/* Image */}
                            <div
                                style={{
                                    width: "100%",
                                    height: 200,
                                    overflow: "hidden",
                                    backgroundColor: "rgba(255,255,255,0.03)",
                                }}
                            >
                                {post.image ? (
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            background: `linear-gradient(135deg, ${cardBgColor} 0%, rgba(0,212,106,0.06) 100%)`,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: 14,
                                                color: secondaryTextColor,
                                                fontFamily,
                                            }}
                                        >
                                            Add image
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div
                                style={{
                                    padding: "24px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 12,
                                    flex: 1,
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: 12,
                                            fontWeight: 600,
                                            color: accentColor,
                                            textTransform: "uppercase",
                                            letterSpacing: "0.05em",
                                            fontFamily,
                                        }}
                                    >
                                        {post.category}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: 12,
                                            color: secondaryTextColor,
                                            fontFamily,
                                        }}
                                    >
                                        {post.date}
                                    </span>
                                </div>

                                <h3
                                    style={{
                                        fontSize: 18,
                                        fontWeight: 600,
                                        color: textColor,
                                        margin: 0,
                                        lineHeight: 1.4,
                                        fontFamily,
                                    }}
                                >
                                    {post.title}
                                </h3>

                                <p
                                    style={{
                                        fontSize: 14,
                                        color: secondaryTextColor,
                                        margin: 0,
                                        lineHeight: 1.6,
                                        fontFamily,
                                        flex: 1,
                                    }}
                                >
                                    {post.excerpt}
                                </p>

                                <span
                                    style={{
                                        fontSize: 14,
                                        fontWeight: 500,
                                        color: accentColor,
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 4,
                                        fontFamily,
                                        marginTop: 4,
                                    }}
                                >
                                    Read More{" "}
                                    <span style={{ fontSize: 14 }}>&#8594;</span>
                                </span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}

addPropertyControls(NewsSection, {
    sectionLabel: {
        type: ControlType.String,
        title: "Label",
        defaultValue: "INSIGHTS",
    },
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "News and Stories",
    },
    subheading: {
        type: ControlType.String,
        title: "Subheading",
        defaultValue:
            "Stay up to date with the latest in video optimization technology.",
        displayTextArea: true,
    },
    showViewAll: {
        type: ControlType.Boolean,
        title: "Show View All",
        defaultValue: true,
    },
    viewAllText: {
        type: ControlType.String,
        title: "View All Text",
        defaultValue: "View All Articles",
        hidden: (props) => !props.showViewAll,
    },
    viewAllUrl: {
        type: ControlType.String,
        title: "View All URL",
        defaultValue: "/blog",
        hidden: (props) => !props.showViewAll,
    },
    posts: {
        type: ControlType.Array,
        title: "Blog Posts",
        maxCount: 9,
        control: {
            type: ControlType.Object,
            controls: {
                image: {
                    type: ControlType.Image,
                    title: "Image",
                },
                category: {
                    type: ControlType.String,
                    title: "Category",
                    defaultValue: "Technology",
                },
                date: {
                    type: ControlType.String,
                    title: "Date",
                    defaultValue: "Jan 1, 2026",
                },
                title: {
                    type: ControlType.String,
                    title: "Title",
                    defaultValue: "Blog Post Title",
                },
                excerpt: {
                    type: ControlType.String,
                    title: "Excerpt",
                    defaultValue: "Brief excerpt of the blog post.",
                    displayTextArea: true,
                },
                url: {
                    type: ControlType.String,
                    title: "URL",
                    defaultValue: "#",
                },
            },
        },
        defaultValue: [
            {
                image: "",
                category: "Technology",
                date: "Jan 15, 2026",
                title: "How CABR Reduces CDN Costs by 50% Without Quality Loss",
                excerpt:
                    "Discover the science behind content-adaptive bitrate encoding and how it's transforming video delivery.",
                url: "#",
            },
            {
                image: "",
                category: "Case Study",
                date: "Jan 10, 2026",
                title: "Netflix Partner Saves $2M in Annual Bandwidth Costs",
                excerpt:
                    "Learn how a major streaming partner leveraged Beamr to dramatically cut infrastructure spending.",
                url: "#",
            },
            {
                image: "",
                category: "Industry",
                date: "Jan 5, 2026",
                title: "The Future of Autonomous Vehicle Video Processing",
                excerpt:
                    "Exploring how efficient video encoding is critical for next-generation self-driving technology.",
                url: "#",
            },
        ],
    },
    columns: {
        type: ControlType.Number,
        title: "Columns",
        defaultValue: 3,
        min: 1,
        max: 4,
        step: 1,
    },
    cardBorderRadius: {
        type: ControlType.Number,
        title: "Card Radius",
        defaultValue: 16,
        min: 0,
        max: 32,
        step: 2,
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#07071c",
    },
    cardBgColor: {
        type: ControlType.Color,
        title: "Card BG",
        defaultValue: "#0f1029",
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
    fontFamily: {
        type: ControlType.String,
        title: "Font Family",
        defaultValue: "'Inter', sans-serif",
    },
})

export default NewsSection
