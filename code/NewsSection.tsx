// Beamr Homepage - News and Stories Section
// Framer Code Component with full property controls
// Responsive layout: sidebar header on desktop, stacked on mobile
// Matches original design: featured card + 2x2 regular cards grid

import { addPropertyControls, ControlType } from "framer"

// ─── Types ───────────────────────────────────────────────────────────────────

interface FeaturedCard {
    image: string
    category: string
    categoryBgColor: string
    categoryTextColor: string
    date: string
    title: string
    buttonText: string
    buttonUrl: string
    overlayBgColor: string
}

interface ArticleCard {
    image: string
    category: string
    categoryBgColor: string
    categoryBorderColor: string
    categoryTextColor: string
    date: string
    title: string
    url: string
    bgColor: string
}

interface Props {
    // Section
    sectionBgColor: string
    sectionPaddingDesktop: number
    sectionPaddingMobile: number

    // Heading
    heading: string
    headingFontSize: number
    headingMobileFontSize: number
    headingFontFamily: string
    headingFontWeight: number
    headingLineHeight: number
    headingColor: string

    // Read More link
    readMoreText: string
    readMoreUrl: string
    readMoreColor: string
    readMoreFontSize: number
    readMoreFontFamily: string
    readMoreFontWeight: number
    readMoreLineHeight: number
    showReadMore: boolean

    // Featured card
    featured: FeaturedCard

    // Featured card title
    featuredTitleFontSize: number
    featuredTitleMobileFontSize: number
    featuredTitleFontFamily: string
    featuredTitleFontWeight: number
    featuredTitleLineHeight: number
    featuredTitleColor: string

    // Featured date
    featuredDateFontSize: number
    featuredDateFontFamily: string
    featuredDateFontWeight: number
    featuredDateLineHeight: number
    featuredDateColor: string
    featuredDateLetterSpacing: number

    // Featured button
    featuredButtonBgColor: string
    featuredButtonTextColor: string
    featuredButtonFontSize: number
    featuredButtonFontFamily: string
    featuredButtonFontWeight: number
    featuredButtonRadius: number

    // Featured image area
    featuredImageHeight: number
    featuredImageMobileHeight: number
    featuredImageRadius: number

    // Regular cards
    cards: ArticleCard[]

    // Regular card title
    cardTitleFontSize: number
    cardTitleMobileFontSize: number
    cardTitleFontFamily: string
    cardTitleFontWeight: number
    cardTitleLineHeight: number
    cardTitleColor: string

    // Card date
    cardDateFontSize: number
    cardDateFontFamily: string
    cardDateFontWeight: number
    cardDateLineHeight: number
    cardDateColor: string
    cardDateLetterSpacing: number

    // Card category badge
    cardCategoryFontSize: number
    cardCategoryFontFamily: string
    cardCategoryFontWeight: number
    cardCategoryLineHeight: number

    // Card image area
    cardImageHeight: number
    cardImageMobileHeight: number
    cardImageRadius: number

    // Grid
    cardGap: number
    cardMobileGap: number
    featuredCardGap: number

    // Mobile breakpoint
    mobileBreakpoint: number

    style?: React.CSSProperties
}

// ─── Component ───────────────────────────────────────────────────────────────

function NewsSection(props: Props) {
    const {
        // Section
        sectionBgColor = "#FFFFFF",
        sectionPaddingDesktop = 96,
        sectionPaddingMobile = 40,

        // Heading
        heading = "News and\nstories",
        headingFontSize = 60,
        headingMobileFontSize = 36,
        headingFontFamily = "Poppins, sans-serif",
        headingFontWeight = 500,
        headingLineHeight = 76,
        headingColor = "#171717",

        // Read more
        readMoreText = "Read more",
        readMoreUrl = "#",
        readMoreColor = "#3751FF",
        readMoreFontSize = 14,
        readMoreFontFamily = "Inter, sans-serif",
        readMoreFontWeight = 500,
        readMoreLineHeight = 20,
        showReadMore = true,

        // Featured card
        featured = {
            image: "https://placehold.co/739x549",
            category: "Technology",
            categoryBgColor: "#E2E4EC",
            categoryTextColor: "#333333",
            date: "February 24-27, 2026 · Las Vegas",
            title: "Beamr Receives Technology & Engineering Emmy® Award",
            buttonText: "Register",
            buttonUrl: "#",
            overlayBgColor: "#010314",
        },

        featuredTitleFontSize = 24,
        featuredTitleMobileFontSize = 20,
        featuredTitleFontFamily = "Poppins, sans-serif",
        featuredTitleFontWeight = 500,
        featuredTitleLineHeight = 32,
        featuredTitleColor = "#171717",

        featuredDateFontSize = 12,
        featuredDateFontFamily = "Poppins, sans-serif",
        featuredDateFontWeight = 600,
        featuredDateLineHeight = 18,
        featuredDateColor = "#666666",
        featuredDateLetterSpacing = 0.5,

        featuredButtonBgColor = "#3751FF",
        featuredButtonTextColor = "#FFFFFF",
        featuredButtonFontSize = 14,
        featuredButtonFontFamily = "Inter, sans-serif",
        featuredButtonFontWeight = 500,
        featuredButtonRadius = 8,

        featuredImageHeight = 336,
        featuredImageMobileHeight = 220,
        featuredImageRadius = 12,

        // Regular cards
        cards = [
            {
                image: "https://placehold.co/364x227",
                category: "Technology",
                categoryBgColor: "#E2E4EC",
                categoryBorderColor: "#666666",
                categoryTextColor: "#333333",
                date: "January 15, 2026",
                title: "Beamr Announces AV1 Support for Next-Gen Video Compression",
                url: "#",
                bgColor: "#E2E4EC",
            },
            {
                image: "https://placehold.co/640x358",
                category: "Company News",
                categoryBgColor: "#FFFFFF",
                categoryBorderColor: "#CCCCCC",
                categoryTextColor: "#666666",
                date: "January 8, 2026",
                title: "How Autonomous Vehicles Benefit from Optimized Video Data",
                url: "#",
                bgColor: "#E5E5E5",
            },
            {
                image: "https://placehold.co/602x336",
                category: "Industry",
                categoryBgColor: "#FFFFFF",
                categoryBorderColor: "#CCCCCC",
                categoryTextColor: "#666666",
                date: "December 20, 2025",
                title: "Netflix Partnership Delivers 40% Bandwidth Savings Across Platform",
                url: "#",
                bgColor: "#E5E5E5",
            },
            {
                image: "https://placehold.co/602x336",
                category: "Company News",
                categoryBgColor: "#FFFFFF",
                categoryBorderColor: "#CCCCCC",
                categoryTextColor: "#666666",
                date: "December 5, 2025",
                title: "Year in Review: Beamr's 2025 Milestones and Achievements",
                url: "#",
                bgColor: "#E5E5E5",
            },
        ],

        cardTitleFontSize = 18,
        cardTitleMobileFontSize = 16,
        cardTitleFontFamily = "Poppins, sans-serif",
        cardTitleFontWeight = 500,
        cardTitleLineHeight = 24,
        cardTitleColor = "#171717",

        cardDateFontSize = 12,
        cardDateFontFamily = "Poppins, sans-serif",
        cardDateFontWeight = 600,
        cardDateLineHeight = 18,
        cardDateColor = "#666666",
        cardDateLetterSpacing = 0.5,

        cardCategoryFontSize = 12,
        cardCategoryFontFamily = "Inter, sans-serif",
        cardCategoryFontWeight = 500,
        cardCategoryLineHeight = 18,

        cardImageHeight = 305,
        cardImageMobileHeight = 200,
        cardImageRadius = 12,

        cardGap = 24,
        cardMobileGap = 16,
        featuredCardGap = 56,

        mobileBreakpoint = 768,

        style,
    } = props

    // Detect container width for responsive behavior
    const containerRef = React.useRef<HTMLDivElement>(null)
    const [containerWidth, setContainerWidth] = React.useState(1200)

    React.useEffect(() => {
        if (!containerRef.current) return
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setContainerWidth(entry.contentRect.width)
            }
        })
        observer.observe(containerRef.current)
        return () => observer.disconnect()
    }, [])

    const isMobile = containerWidth < mobileBreakpoint
    const isTablet = containerWidth >= mobileBreakpoint && containerWidth < 1100
    const padding = isMobile ? sectionPaddingMobile : sectionPaddingDesktop
    const hPadding = isMobile ? 20 : isTablet ? 40 : 150

    // Arrow SVG for "Read more"
    const ArrowIcon = () => (
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            style={{ flexShrink: 0 }}
        >
            <path
                d="M8 2.667L7.06 3.607l3.727 3.726H2.667v1.334h9.12L8.06 12.393 8 13.333l5.333-5.333L8 2.667z"
                fill={readMoreColor}
            />
        </svg>
    )

    return (
        <div
            ref={containerRef}
            style={{
                ...style,
                width: "100%",
                backgroundColor: sectionBgColor,
                paddingLeft: hPadding,
                paddingRight: hPadding,
                paddingTop: padding,
                paddingBottom: padding,
                boxSizing: "border-box",
            }}
        >
            {/* Main container: sidebar left + cards right on desktop, stacked on mobile */}
            <div
                style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: isMobile ? 32 : isTablet ? 32 : 0,
                    width: "100%",
                }}
            >
                {/* ─── Left Header ─────────────────────────────── */}
                <div
                    style={{
                        maxWidth: isMobile ? "100%" : 200,
                        minWidth: isMobile ? "100%" : 200,
                        display: "flex",
                        flexDirection: isMobile ? "row" : "column",
                        justifyContent: isMobile ? "space-between" : "flex-start",
                        alignItems: isMobile ? "flex-end" : "flex-start",
                        gap: 24,
                        flexShrink: 0,
                    }}
                >
                    <h2
                        style={{
                            fontSize: isMobile
                                ? headingMobileFontSize
                                : headingFontSize,
                            fontFamily: headingFontFamily,
                            fontWeight: headingFontWeight,
                            lineHeight: `${isMobile ? headingMobileFontSize + 12 : headingLineHeight}px`,
                            color: headingColor,
                            margin: 0,
                            whiteSpace: "pre-line",
                            wordWrap: "break-word",
                        }}
                    >
                        {heading}
                    </h2>

                    {showReadMore && (
                        <a
                            href={readMoreUrl}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                textDecoration: "none",
                                flexShrink: 0,
                            }}
                        >
                            <span
                                style={{
                                    fontSize: readMoreFontSize,
                                    fontFamily: readMoreFontFamily,
                                    fontWeight: readMoreFontWeight,
                                    lineHeight: `${readMoreLineHeight}px`,
                                    color: readMoreColor,
                                }}
                            >
                                {readMoreText}
                            </span>
                            <ArrowIcon />
                        </a>
                    )}
                </div>

                {/* ─── Right Cards Grid ────────────────────────── */}
                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: isMobile ? 32 : featuredCardGap,
                        maxWidth: isMobile ? "100%" : isTablet ? "100%" : 1000,
                        width: "100%",
                    }}
                >
                    {/* Featured Card */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                        }}
                    >
                        {/* Featured Image */}
                        <div
                            style={{
                                width: "100%",
                                height: isMobile
                                    ? featuredImageMobileHeight
                                    : featuredImageHeight,
                                position: "relative",
                                backgroundColor: featured.overlayBgColor,
                                borderRadius: featuredImageRadius,
                                overflow: "hidden",
                                marginBottom: 16,
                            }}
                        >
                            {/* Gradient overlay */}
                            <div
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    background:
                                        "linear-gradient(90deg, rgba(1,3,20,0) 0%, #010314 100%)",
                                    zIndex: 1,
                                }}
                            />

                            {/* Featured image */}
                            {featured.image && (
                                <img
                                    src={featured.image}
                                    alt={featured.title}
                                    style={{
                                        position: "absolute",
                                        right: 0,
                                        top: 0,
                                        width: isMobile ? "100%" : "70%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                            )}

                            {/* Category badge */}
                            <div
                                style={{
                                    position: "absolute",
                                    left: 16,
                                    top: 16,
                                    zIndex: 2,
                                    backgroundColor: featured.categoryBgColor,
                                    borderRadius: 50,
                                    border: `1px solid #666666`,
                                    paddingLeft: 12,
                                    paddingRight: 12,
                                    paddingTop: 6,
                                    paddingBottom: 6,
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: cardCategoryFontSize,
                                        fontFamily: cardCategoryFontFamily,
                                        fontWeight: cardCategoryFontWeight,
                                        lineHeight: `${cardCategoryLineHeight}px`,
                                        color: featured.categoryTextColor,
                                        textTransform: "uppercase",
                                        letterSpacing: 0.5,
                                    }}
                                >
                                    {featured.category}
                                </span>
                            </div>
                        </div>

                        {/* Featured content row */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: isMobile ? "column" : "row",
                                justifyContent: "space-between",
                                alignItems: isMobile ? "flex-start" : "flex-start",
                                gap: isMobile ? 16 : 24,
                                width: "100%",
                            }}
                        >
                            <div
                                style={{
                                    flex: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 8,
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: featuredDateFontSize,
                                        fontFamily: featuredDateFontFamily,
                                        fontWeight: featuredDateFontWeight,
                                        lineHeight: `${featuredDateLineHeight}px`,
                                        color: featuredDateColor,
                                        textTransform: "uppercase",
                                        letterSpacing: featuredDateLetterSpacing,
                                    }}
                                >
                                    {featured.date}
                                </span>
                                <h3
                                    style={{
                                        fontSize: isMobile
                                            ? featuredTitleMobileFontSize
                                            : featuredTitleFontSize,
                                        fontFamily: featuredTitleFontFamily,
                                        fontWeight: featuredTitleFontWeight,
                                        lineHeight: `${featuredTitleLineHeight}px`,
                                        color: featuredTitleColor,
                                        margin: 0,
                                        maxWidth: isMobile ? "100%" : 602,
                                    }}
                                >
                                    {featured.title}
                                </h3>
                            </div>

                            {featured.buttonText && (
                                <div style={{ paddingTop: isMobile ? 0 : 32 }}>
                                    <a
                                        href={featured.buttonUrl}
                                        style={{
                                            display: "inline-flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            paddingLeft: 24,
                                            paddingRight: 24,
                                            paddingTop: 12,
                                            paddingBottom: 12,
                                            backgroundColor: featuredButtonBgColor,
                                            borderRadius: featuredButtonRadius,
                                            textDecoration: "none",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: featuredButtonFontSize,
                                                fontFamily: featuredButtonFontFamily,
                                                fontWeight: featuredButtonFontWeight,
                                                color: featuredButtonTextColor,
                                                textAlign: "center",
                                            }}
                                        >
                                            {featured.buttonText}
                                        </span>
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ─── Regular Cards 2×2 Grid ──────────────── */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: isMobile
                                ? "1fr"
                                : "repeat(2, 1fr)",
                            gap: isMobile ? cardMobileGap : cardGap,
                            width: "100%",
                        }}
                    >
                        {cards.map((card, i) => (
                            <a
                                key={i}
                                href={card.url}
                                style={{
                                    textDecoration: "none",
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                {/* Card image */}
                                <div
                                    style={{
                                        width: "100%",
                                        height: isMobile
                                            ? cardImageMobileHeight
                                            : cardImageHeight,
                                        position: "relative",
                                        backgroundColor: card.bgColor,
                                        borderRadius: cardImageRadius,
                                        overflow: "hidden",
                                        marginBottom: 16,
                                    }}
                                >
                                    {card.image && (
                                        <img
                                            src={card.image}
                                            alt={card.title}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                            }}
                                        />
                                    )}

                                    {/* Category badge */}
                                    <div
                                        style={{
                                            position: "absolute",
                                            left: 16,
                                            top: 16,
                                            backgroundColor: card.categoryBgColor,
                                            borderRadius: 50,
                                            border: `1px solid ${card.categoryBorderColor}`,
                                            paddingLeft: 12,
                                            paddingRight: 12,
                                            paddingTop: 6,
                                            paddingBottom: 6,
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: cardCategoryFontSize,
                                                fontFamily: cardCategoryFontFamily,
                                                fontWeight: cardCategoryFontWeight,
                                                lineHeight: `${cardCategoryLineHeight}px`,
                                                color: card.categoryTextColor,
                                                textTransform: "uppercase",
                                                letterSpacing: 0.5,
                                            }}
                                        >
                                            {card.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Card content */}
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 8,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: cardDateFontSize,
                                            fontFamily: cardDateFontFamily,
                                            fontWeight: cardDateFontWeight,
                                            lineHeight: `${cardDateLineHeight}px`,
                                            color: cardDateColor,
                                            textTransform: "uppercase",
                                            letterSpacing: cardDateLetterSpacing,
                                        }}
                                    >
                                        {card.date}
                                    </span>
                                    <h4
                                        style={{
                                            fontSize: isMobile
                                                ? cardTitleMobileFontSize
                                                : cardTitleFontSize,
                                            fontFamily: cardTitleFontFamily,
                                            fontWeight: cardTitleFontWeight,
                                            lineHeight: `${cardTitleLineHeight}px`,
                                            color: cardTitleColor,
                                            margin: 0,
                                        }}
                                    >
                                        {card.title}
                                    </h4>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

// ─── Property Controls ───────────────────────────────────────────────────────

addPropertyControls(NewsSection, {
    // Section
    sectionBgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#FFFFFF",
    },
    sectionPaddingDesktop: {
        type: ControlType.Number,
        title: "Padding (Desktop)",
        defaultValue: 96,
        min: 0,
        max: 200,
        step: 4,
    },
    sectionPaddingMobile: {
        type: ControlType.Number,
        title: "Padding (Mobile)",
        defaultValue: 40,
        min: 0,
        max: 100,
        step: 4,
    },
    mobileBreakpoint: {
        type: ControlType.Number,
        title: "Mobile Breakpoint",
        defaultValue: 768,
        min: 320,
        max: 1200,
        step: 1,
    },

    // Heading
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "News and\nstories",
        displayTextArea: true,
    },
    headingFontSize: {
        type: ControlType.Number,
        title: "Heading Size",
        defaultValue: 60,
        min: 16,
        max: 120,
        step: 1,
    },
    headingMobileFontSize: {
        type: ControlType.Number,
        title: "Heading Size (Mobile)",
        defaultValue: 36,
        min: 16,
        max: 80,
        step: 1,
    },
    headingFontFamily: {
        type: ControlType.String,
        title: "Heading Font",
        defaultValue: "Poppins, sans-serif",
    },
    headingFontWeight: {
        type: ControlType.Enum,
        title: "Heading Weight",
        options: [300, 400, 500, 600, 700, 800, 900],
        optionTitles: [
            "Light",
            "Regular",
            "Medium",
            "SemiBold",
            "Bold",
            "ExtraBold",
            "Black",
        ],
        defaultValue: 500,
    },
    headingLineHeight: {
        type: ControlType.Number,
        title: "Heading Line Height",
        defaultValue: 76,
        min: 16,
        max: 150,
        step: 1,
    },
    headingColor: {
        type: ControlType.Color,
        title: "Heading Color",
        defaultValue: "#171717",
    },

    // Read More
    showReadMore: {
        type: ControlType.Boolean,
        title: "Show Read More",
        defaultValue: true,
    },
    readMoreText: {
        type: ControlType.String,
        title: "Read More Text",
        defaultValue: "Read more",
        hidden: (props) => !props.showReadMore,
    },
    readMoreUrl: {
        type: ControlType.String,
        title: "Read More URL",
        defaultValue: "#",
        hidden: (props) => !props.showReadMore,
    },
    readMoreColor: {
        type: ControlType.Color,
        title: "Read More Color",
        defaultValue: "#3751FF",
        hidden: (props) => !props.showReadMore,
    },
    readMoreFontSize: {
        type: ControlType.Number,
        title: "Read More Size",
        defaultValue: 14,
        min: 10,
        max: 24,
        step: 1,
        hidden: (props) => !props.showReadMore,
    },
    readMoreFontFamily: {
        type: ControlType.String,
        title: "Read More Font",
        defaultValue: "Inter, sans-serif",
        hidden: (props) => !props.showReadMore,
    },
    readMoreFontWeight: {
        type: ControlType.Enum,
        title: "Read More Weight",
        options: [400, 500, 600, 700],
        optionTitles: ["Regular", "Medium", "SemiBold", "Bold"],
        defaultValue: 500,
        hidden: (props) => !props.showReadMore,
    },
    readMoreLineHeight: {
        type: ControlType.Number,
        title: "Read More Line Ht",
        defaultValue: 20,
        min: 10,
        max: 40,
        step: 1,
        hidden: (props) => !props.showReadMore,
    },

    // ─── Featured Card ───────────────────────────────
    featured: {
        type: ControlType.Object,
        title: "Featured Card",
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
            categoryBgColor: {
                type: ControlType.Color,
                title: "Badge BG",
                defaultValue: "#E2E4EC",
            },
            categoryTextColor: {
                type: ControlType.Color,
                title: "Badge Text",
                defaultValue: "#333333",
            },
            date: {
                type: ControlType.String,
                title: "Date",
                defaultValue: "February 24-27, 2026 · Las Vegas",
            },
            title: {
                type: ControlType.String,
                title: "Title",
                defaultValue:
                    "Beamr Receives Technology & Engineering Emmy® Award",
            },
            buttonText: {
                type: ControlType.String,
                title: "Button Text",
                defaultValue: "Register",
            },
            buttonUrl: {
                type: ControlType.String,
                title: "Button URL",
                defaultValue: "#",
            },
            overlayBgColor: {
                type: ControlType.Color,
                title: "Overlay BG",
                defaultValue: "#010314",
            },
        },
    },
    featuredTitleFontSize: {
        type: ControlType.Number,
        title: "Feat. Title Size",
        defaultValue: 24,
        min: 14,
        max: 48,
        step: 1,
    },
    featuredTitleMobileFontSize: {
        type: ControlType.Number,
        title: "Feat. Title Mobile",
        defaultValue: 20,
        min: 14,
        max: 36,
        step: 1,
    },
    featuredTitleFontFamily: {
        type: ControlType.String,
        title: "Feat. Title Font",
        defaultValue: "Poppins, sans-serif",
    },
    featuredTitleFontWeight: {
        type: ControlType.Enum,
        title: "Feat. Title Weight",
        options: [400, 500, 600, 700],
        optionTitles: ["Regular", "Medium", "SemiBold", "Bold"],
        defaultValue: 500,
    },
    featuredTitleLineHeight: {
        type: ControlType.Number,
        title: "Feat. Title Line Ht",
        defaultValue: 32,
        min: 16,
        max: 60,
        step: 1,
    },
    featuredTitleColor: {
        type: ControlType.Color,
        title: "Feat. Title Color",
        defaultValue: "#171717",
    },
    featuredDateFontSize: {
        type: ControlType.Number,
        title: "Feat. Date Size",
        defaultValue: 12,
        min: 8,
        max: 20,
        step: 1,
    },
    featuredDateFontFamily: {
        type: ControlType.String,
        title: "Feat. Date Font",
        defaultValue: "Poppins, sans-serif",
    },
    featuredDateFontWeight: {
        type: ControlType.Enum,
        title: "Feat. Date Weight",
        options: [400, 500, 600, 700],
        optionTitles: ["Regular", "Medium", "SemiBold", "Bold"],
        defaultValue: 600,
    },
    featuredDateLineHeight: {
        type: ControlType.Number,
        title: "Feat. Date Line Ht",
        defaultValue: 18,
        min: 10,
        max: 30,
        step: 1,
    },
    featuredDateColor: {
        type: ControlType.Color,
        title: "Feat. Date Color",
        defaultValue: "#666666",
    },
    featuredDateLetterSpacing: {
        type: ControlType.Number,
        title: "Feat. Date Spacing",
        defaultValue: 0.5,
        min: 0,
        max: 3,
        step: 0.1,
    },
    featuredButtonBgColor: {
        type: ControlType.Color,
        title: "Button BG",
        defaultValue: "#3751FF",
    },
    featuredButtonTextColor: {
        type: ControlType.Color,
        title: "Button Text",
        defaultValue: "#FFFFFF",
    },
    featuredButtonFontSize: {
        type: ControlType.Number,
        title: "Button Size",
        defaultValue: 14,
        min: 10,
        max: 24,
        step: 1,
    },
    featuredButtonFontFamily: {
        type: ControlType.String,
        title: "Button Font",
        defaultValue: "Inter, sans-serif",
    },
    featuredButtonFontWeight: {
        type: ControlType.Enum,
        title: "Button Weight",
        options: [400, 500, 600, 700],
        optionTitles: ["Regular", "Medium", "SemiBold", "Bold"],
        defaultValue: 500,
    },
    featuredButtonRadius: {
        type: ControlType.Number,
        title: "Button Radius",
        defaultValue: 8,
        min: 0,
        max: 24,
        step: 1,
    },
    featuredImageHeight: {
        type: ControlType.Number,
        title: "Feat. Image Ht",
        defaultValue: 336,
        min: 150,
        max: 600,
        step: 1,
    },
    featuredImageMobileHeight: {
        type: ControlType.Number,
        title: "Feat. Image Ht (M)",
        defaultValue: 220,
        min: 120,
        max: 400,
        step: 1,
    },
    featuredImageRadius: {
        type: ControlType.Number,
        title: "Feat. Image Radius",
        defaultValue: 12,
        min: 0,
        max: 32,
        step: 1,
    },

    // ─── Regular Cards ───────────────────────────────
    cards: {
        type: ControlType.Array,
        title: "Article Cards",
        maxCount: 8,
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
                categoryBgColor: {
                    type: ControlType.Color,
                    title: "Badge BG",
                    defaultValue: "#E2E4EC",
                },
                categoryBorderColor: {
                    type: ControlType.Color,
                    title: "Badge Border",
                    defaultValue: "#666666",
                },
                categoryTextColor: {
                    type: ControlType.Color,
                    title: "Badge Text",
                    defaultValue: "#333333",
                },
                date: {
                    type: ControlType.String,
                    title: "Date",
                    defaultValue: "January 1, 2026",
                },
                title: {
                    type: ControlType.String,
                    title: "Title",
                    defaultValue: "Article Title",
                },
                url: {
                    type: ControlType.String,
                    title: "URL",
                    defaultValue: "#",
                },
                bgColor: {
                    type: ControlType.Color,
                    title: "Card BG",
                    defaultValue: "#E5E5E5",
                },
            },
        },
        defaultValue: [
            {
                image: "https://placehold.co/364x227",
                category: "Technology",
                categoryBgColor: "#E2E4EC",
                categoryBorderColor: "#666666",
                categoryTextColor: "#333333",
                date: "January 15, 2026",
                title: "Beamr Announces AV1 Support for Next-Gen Video Compression",
                url: "#",
                bgColor: "#E2E4EC",
            },
            {
                image: "https://placehold.co/640x358",
                category: "Company News",
                categoryBgColor: "#FFFFFF",
                categoryBorderColor: "#CCCCCC",
                categoryTextColor: "#666666",
                date: "January 8, 2026",
                title: "How Autonomous Vehicles Benefit from Optimized Video Data",
                url: "#",
                bgColor: "#E5E5E5",
            },
            {
                image: "https://placehold.co/602x336",
                category: "Industry",
                categoryBgColor: "#FFFFFF",
                categoryBorderColor: "#CCCCCC",
                categoryTextColor: "#666666",
                date: "December 20, 2025",
                title: "Netflix Partnership Delivers 40% Bandwidth Savings Across Platform",
                url: "#",
                bgColor: "#E5E5E5",
            },
            {
                image: "https://placehold.co/602x336",
                category: "Company News",
                categoryBgColor: "#FFFFFF",
                categoryBorderColor: "#CCCCCC",
                categoryTextColor: "#666666",
                date: "December 5, 2025",
                title: "Year in Review: Beamr's 2025 Milestones and Achievements",
                url: "#",
                bgColor: "#E5E5E5",
            },
        ],
    },
    cardTitleFontSize: {
        type: ControlType.Number,
        title: "Card Title Size",
        defaultValue: 18,
        min: 12,
        max: 32,
        step: 1,
    },
    cardTitleMobileFontSize: {
        type: ControlType.Number,
        title: "Card Title Mobile",
        defaultValue: 16,
        min: 12,
        max: 28,
        step: 1,
    },
    cardTitleFontFamily: {
        type: ControlType.String,
        title: "Card Title Font",
        defaultValue: "Poppins, sans-serif",
    },
    cardTitleFontWeight: {
        type: ControlType.Enum,
        title: "Card Title Weight",
        options: [400, 500, 600, 700],
        optionTitles: ["Regular", "Medium", "SemiBold", "Bold"],
        defaultValue: 500,
    },
    cardTitleLineHeight: {
        type: ControlType.Number,
        title: "Card Title Line Ht",
        defaultValue: 24,
        min: 14,
        max: 48,
        step: 1,
    },
    cardTitleColor: {
        type: ControlType.Color,
        title: "Card Title Color",
        defaultValue: "#171717",
    },
    cardDateFontSize: {
        type: ControlType.Number,
        title: "Card Date Size",
        defaultValue: 12,
        min: 8,
        max: 20,
        step: 1,
    },
    cardDateFontFamily: {
        type: ControlType.String,
        title: "Card Date Font",
        defaultValue: "Poppins, sans-serif",
    },
    cardDateFontWeight: {
        type: ControlType.Enum,
        title: "Card Date Weight",
        options: [400, 500, 600, 700],
        optionTitles: ["Regular", "Medium", "SemiBold", "Bold"],
        defaultValue: 600,
    },
    cardDateLineHeight: {
        type: ControlType.Number,
        title: "Card Date Line Ht",
        defaultValue: 18,
        min: 10,
        max: 30,
        step: 1,
    },
    cardDateColor: {
        type: ControlType.Color,
        title: "Card Date Color",
        defaultValue: "#666666",
    },
    cardDateLetterSpacing: {
        type: ControlType.Number,
        title: "Card Date Spacing",
        defaultValue: 0.5,
        min: 0,
        max: 3,
        step: 0.1,
    },
    cardCategoryFontSize: {
        type: ControlType.Number,
        title: "Category Size",
        defaultValue: 12,
        min: 8,
        max: 18,
        step: 1,
    },
    cardCategoryFontFamily: {
        type: ControlType.String,
        title: "Category Font",
        defaultValue: "Inter, sans-serif",
    },
    cardCategoryFontWeight: {
        type: ControlType.Enum,
        title: "Category Weight",
        options: [400, 500, 600, 700],
        optionTitles: ["Regular", "Medium", "SemiBold", "Bold"],
        defaultValue: 500,
    },
    cardCategoryLineHeight: {
        type: ControlType.Number,
        title: "Category Line Ht",
        defaultValue: 18,
        min: 10,
        max: 30,
        step: 1,
    },
    cardImageHeight: {
        type: ControlType.Number,
        title: "Card Image Ht",
        defaultValue: 305,
        min: 100,
        max: 500,
        step: 1,
    },
    cardImageMobileHeight: {
        type: ControlType.Number,
        title: "Card Image Ht (M)",
        defaultValue: 200,
        min: 100,
        max: 400,
        step: 1,
    },
    cardImageRadius: {
        type: ControlType.Number,
        title: "Card Image Radius",
        defaultValue: 12,
        min: 0,
        max: 32,
        step: 1,
    },

    // Grid
    cardGap: {
        type: ControlType.Number,
        title: "Card Gap",
        defaultValue: 24,
        min: 0,
        max: 64,
        step: 4,
    },
    cardMobileGap: {
        type: ControlType.Number,
        title: "Card Gap (Mobile)",
        defaultValue: 16,
        min: 0,
        max: 48,
        step: 4,
    },
    featuredCardGap: {
        type: ControlType.Number,
        title: "Featured-Grid Gap",
        defaultValue: 56,
        min: 16,
        max: 120,
        step: 4,
    },
})

export default NewsSection
