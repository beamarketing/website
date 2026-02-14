// Industry Page - News & Stories Section
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"

interface Article {
    image: string
    category: string
    date: string
    title: string
    description: string
    linkUrl: string
}

interface Props {
    sectionLabel: string
    heading: string
    showViewAll: boolean
    viewAllText: string
    viewAllUrl: string
    articles: Article[]
    columns: number
    bgColor: string
    cardBgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    fontFamily: string
    style?: React.CSSProperties
}

function IndustryNews(props: Props) {
    const {
        sectionLabel = "BLOG",
        heading = "News and stories",
        showViewAll = true,
        viewAllText = "View all articles",
        viewAllUrl = "#",
        articles = [
            {
                image: "",
                category: "Product",
                date: "Jan 15, 2026",
                title: "How CABR is Transforming Streaming Economics",
                description: "Learn how content-adaptive bitrate reduction is helping the world's largest platforms cut costs.",
                linkUrl: "#",
            },
            {
                image: "",
                category: "Industry",
                date: "Jan 10, 2026",
                title: "The Future of Video Compression in Media",
                description: "Exploring next-generation codec optimization and what it means for media companies.",
                linkUrl: "#",
            },
            {
                image: "",
                category: "Case Study",
                date: "Dec 28, 2025",
                title: "StreamCo Reduces CDN Costs by 40%",
                description: "A deep dive into how one of the largest streaming platforms achieved dramatic savings.",
                linkUrl: "#",
            },
        ],
        columns = 3,
        bgColor = "#07071c",
        cardBgColor = "#0f1029",
        textColor = "#ffffff",
        secondaryTextColor = "#8b8ba3",
        accentColor = "#00d46a",
        fontFamily = "'Inter', sans-serif",
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
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
                {/* Section Header */}
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
                                display: "block",
                                marginBottom: 16,
                            }}
                        >
                            {sectionLabel}
                        </span>
                        <h2
                            style={{
                                fontSize: 44,
                                fontWeight: 700,
                                color: textColor,
                                margin: 0,
                                lineHeight: 1.15,
                                letterSpacing: "-0.02em",
                                fontFamily,
                            }}
                        >
                            {heading}
                        </h2>
                    </div>
                    {showViewAll && (
                        <a
                            href={viewAllUrl}
                            style={{
                                fontSize: 14,
                                fontWeight: 600,
                                color: accentColor,
                                textDecoration: "none",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                fontFamily,
                                whiteSpace: "nowrap",
                            }}
                        >
                            {viewAllText}
                            <span style={{ fontSize: 16 }}>&#8594;</span>
                        </a>
                    )}
                </div>

                {/* Articles Grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${columns}, 1fr)`,
                        gap: 24,
                    }}
                >
                    {articles.map((article, i) => (
                        <a
                            key={i}
                            href={article.linkUrl}
                            style={{
                                textDecoration: "none",
                                display: "flex",
                                flexDirection: "column",
                                backgroundColor: cardBgColor,
                                borderRadius: 16,
                                overflow: "hidden",
                                border: "1px solid rgba(255,255,255,0.06)",
                                transition: "border-color 0.3s",
                            }}
                        >
                            {/* Image */}
                            <div
                                style={{
                                    width: "100%",
                                    aspectRatio: "16/10",
                                    background: article.image
                                        ? `url(${article.image}) center/cover no-repeat`
                                        : "linear-gradient(135deg, #0f1029 0%, #1a1b45 100%)",
                                }}
                            />

                            {/* Content */}
                            <div
                                style={{
                                    padding: 24,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 12,
                                    flex: 1,
                                }}
                            >
                                {/* Category & Date */}
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
                                            backgroundColor: `${accentColor}12`,
                                            padding: "4px 10px",
                                            borderRadius: 6,
                                            fontFamily,
                                        }}
                                    >
                                        {article.category}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: 13,
                                            color: secondaryTextColor,
                                            fontFamily,
                                        }}
                                    >
                                        {article.date}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3
                                    style={{
                                        fontSize: 18,
                                        fontWeight: 600,
                                        color: textColor,
                                        margin: 0,
                                        lineHeight: 1.35,
                                        fontFamily,
                                    }}
                                >
                                    {article.title}
                                </h3>

                                {/* Description */}
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
                                    {article.description}
                                </p>

                                {/* Read more */}
                                <span
                                    style={{
                                        fontSize: 14,
                                        fontWeight: 600,
                                        color: accentColor,
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 6,
                                        fontFamily,
                                        marginTop: 4,
                                    }}
                                >
                                    Read more
                                    <span style={{ fontSize: 16 }}>&#8594;</span>
                                </span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}

addPropertyControls(IndustryNews, {
    sectionLabel: {
        type: ControlType.String,
        title: "Section Label",
        defaultValue: "BLOG",
    },
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "News and stories",
    },
    showViewAll: {
        type: ControlType.Boolean,
        title: "Show View All",
        defaultValue: true,
    },
    viewAllText: {
        type: ControlType.String,
        title: "View All Text",
        defaultValue: "View all articles",
        hidden: (props) => !props.showViewAll,
    },
    viewAllUrl: {
        type: ControlType.String,
        title: "View All URL",
        defaultValue: "#",
        hidden: (props) => !props.showViewAll,
    },
    articles: {
        type: ControlType.Array,
        title: "Articles",
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
                    defaultValue: "Product",
                },
                date: {
                    type: ControlType.String,
                    title: "Date",
                    defaultValue: "Jan 15, 2026",
                },
                title: {
                    type: ControlType.String,
                    title: "Title",
                    defaultValue: "Article Title",
                },
                description: {
                    type: ControlType.String,
                    title: "Description",
                    defaultValue: "Article description goes here.",
                    displayTextArea: true,
                },
                linkUrl: {
                    type: ControlType.String,
                    title: "Link URL",
                    defaultValue: "#",
                },
            },
        },
        defaultValue: [
            {
                image: "",
                category: "Product",
                date: "Jan 15, 2026",
                title: "How CABR is Transforming Streaming Economics",
                description: "Learn how content-adaptive bitrate reduction is helping the world's largest platforms cut costs.",
                linkUrl: "#",
            },
            {
                image: "",
                category: "Industry",
                date: "Jan 10, 2026",
                title: "The Future of Video Compression in Media",
                description: "Exploring next-generation codec optimization and what it means for media companies.",
                linkUrl: "#",
            },
            {
                image: "",
                category: "Case Study",
                date: "Dec 28, 2025",
                title: "StreamCo Reduces CDN Costs by 40%",
                description: "A deep dive into how one of the largest streaming platforms achieved dramatic savings.",
                linkUrl: "#",
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
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#07071c",
    },
    cardBgColor: {
        type: ControlType.Color,
        title: "Card Background",
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

export default IndustryNews
