// Horizontal Card Stack — Scroll-Driven Product Carousel
// Cards slide left as the user scrolls down. Section is sticky.
// Matches VSN "Desktop Card Stack": dark cards, lime CTA, hover glow.
// Paste into Framer: Assets panel → Code → New Component

import { addPropertyControls, ControlType } from "framer"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState, useEffect } from "react"

// ─── Arrow icon (matches the original CTA button icon) ──────────────────────

function ArrowIcon() {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            style={{ flexShrink: 0 }}
        >
            <path
                d="M1 7h12M8.5 2.5L13 7l-4.5 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

// ─── Individual product card ────────────────────────────────────────────────

function ProductCard({
    title,
    description,
    image,
    link,
    buttonLabel,
    cardWidth,
    cardBg,
    borderColor,
    textColor,
    buttonBg,
    buttonTextColor,
    glowColor,
}) {
    const [hovered, setHovered] = useState(false)

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                backgroundColor: cardBg,
                borderRadius: 16,
                border: `1px solid ${borderColor}`,
                boxShadow: "rgba(255,255,255,0.1) 0px 0px 0px 4px",
                display: "flex",
                flexDirection: "column",
                width: cardWidth,
                minWidth: cardWidth,
                flexShrink: 0,
                position: "relative",
                overflow: "hidden",
                height: "100%",
            }}
        >
            {/* Content stack: title + description + CTA */}
            <div
                style={{
                    padding: "28px 24px 20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                    }}
                >
                    <p
                        style={{
                            color: textColor,
                            fontSize: 16,
                            fontWeight: 500,
                            fontFamily: "Inter, system-ui, sans-serif",
                            margin: 0,
                            lineHeight: 1.4,
                        }}
                    >
                        {title}
                    </p>
                    <p
                        style={{
                            color: textColor,
                            fontSize: 14,
                            fontWeight: 400,
                            fontFamily: "Inter, system-ui, sans-serif",
                            margin: 0,
                            lineHeight: 1.6,
                        }}
                    >
                        {description}
                    </p>
                </div>

                {/* CTA button — full width, lime bg, arrow right */}
                <a
                    href={link || "#"}
                    style={{
                        backgroundColor: buttonBg,
                        borderRadius: 12,
                        padding: "16px 22px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        textDecoration: "none",
                        color: buttonTextColor,
                        fontSize: 15,
                        fontWeight: 500,
                        fontFamily: "Inter, system-ui, sans-serif",
                    }}
                >
                    {buttonLabel}
                    <ArrowIcon />
                </a>
            </div>

            {/* Image area */}
            <div
                style={{
                    flex: 1,
                    margin: "0 8px 8px",
                    borderRadius: 9,
                    overflow: "hidden",
                    position: "relative",
                    minHeight: 0,
                    backgroundColor: image
                        ? "transparent"
                        : "rgba(255,255,255,0.05)",
                }}
            >
                {image && (
                    <img
                        src={image}
                        alt={title || ""}
                        loading="lazy"
                        style={{
                            display: "block",
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "center",
                            borderRadius: "inherit",
                        }}
                    />
                )}
            </div>

            {/* Hover glow ellipse */}
            <div
                style={{
                    position: "absolute",
                    bottom: "-20%",
                    left: "10%",
                    width: "80%",
                    height: "60%",
                    backgroundColor: glowColor,
                    filter: "blur(250px)",
                    borderRadius: "100%",
                    opacity: hovered ? 1 : 0,
                    transition: "opacity 0.5s ease",
                    pointerEvents: "none",
                    willChange: "transform",
                }}
            />
        </div>
    )
}

// ─── Main component ─────────────────────────────────────────────────────────

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function HorizontalCardStack(props) {
    const {
        cards,
        backgroundColor,
        cardBackground,
        borderColor,
        textColor,
        buttonColor,
        buttonTextColor,
        glowColor,
        cardWidth,
        cardGap,
        scrollScreens,
        paddingX,
        paddingY,
        style,
    } = props

    const sectionRef = useRef(null)
    const containerRef = useRef(null)
    const [maxScroll, setMaxScroll] = useState(0)

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    })

    // Measure total overflow so we know how far to translate
    useEffect(() => {
        const measure = () => {
            if (!containerRef.current) return
            const viewportW = containerRef.current.offsetWidth
            const contentW =
                cards.length * cardWidth +
                (cards.length - 1) * cardGap +
                paddingX * 2
            setMaxScroll(Math.max(0, contentW - viewportW))
        }
        measure()
        const observer = new ResizeObserver(measure)
        if (containerRef.current) observer.observe(containerRef.current)
        return () => observer.disconnect()
    }, [cards.length, cardWidth, cardGap, paddingX])

    // Map vertical scroll → horizontal translate
    const x = useTransform(scrollYProgress, [0, 1], [0, -maxScroll])

    return (
        <section
            ref={sectionRef}
            style={{
                width: style?.width || "100%",
                height: `${scrollScreens * 100}vh`,
                position: "relative",
                backgroundColor,
            }}
        >
            {/* Sticky viewport — stays pinned while user scrolls through */}
            <div
                ref={containerRef}
                style={{
                    position: "sticky",
                    top: 0,
                    height: "100vh",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "stretch",
                    padding: `${paddingY}px 0`,
                    boxSizing: "border-box",
                }}
            >
                {/* Sliding card track */}
                <motion.div
                    style={{
                        x,
                        display: "flex",
                        gap: cardGap,
                        padding: `0 ${paddingX}px`,
                        alignItems: "stretch",
                    }}
                >
                    {cards.map((card, i) => (
                        <ProductCard
                            key={i}
                            title={card.title}
                            description={card.description}
                            image={card.image}
                            link={card.link}
                            buttonLabel={card.buttonText || "Learn more"}
                            cardWidth={cardWidth}
                            cardBg={cardBackground}
                            borderColor={borderColor}
                            textColor={textColor}
                            buttonBg={buttonColor}
                            buttonTextColor={buttonTextColor}
                            glowColor={glowColor}
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

// ─── Defaults (matching the original VSN product cards) ─────────────────────

HorizontalCardStack.defaultProps = {
    cards: [
        {
            title: "VSNArena (AI-Powered DAM)",
            description:
                "Revolutionize your digital asset management with the next generation. VSN ArenaPro leverages cutting-edge AI to automate workflows, enrich metadata, enable semantic search, and unlock new monetization opportunities for media, sports, and education sectors.",
            image: "",
            link: "/products/vsn-arena",
            buttonText: "Learn more",
        },
        {
            title: "VSNCrea",
            description:
                "VSN Crea is a powerful, 100% web-based traffic and scheduling system that simplifies planning, rights management, scheduling, and reporting for linear and non-linear platforms. Maximize efficiency and ensure seamless programming delivery.",
            image: "",
            link: "/products/vsncrea",
            buttonText: "Learn more",
        },
        {
            title: "VSNOneTV",
            description:
                "VSN OneTV is a versatile Channel-in-a-Box solution combining ingest, professional playout, advanced real-time graphics (CG), IP/NDI/SDI compatibility, and automation features in a single, cost-effective application. Ensure reliable and high-quality broadcasting.",
            image: "",
            link: "/products/vsnone-tv",
            buttonText: "Learn more",
        },
        {
            title: "VSNExplorer (MAM)",
            description:
                "VSNExplorer MAM provides all the necessary tools to manage and orchestrate the entire media lifecycle for any broadcast and media company. From cataloging and advanced search to preview, editing, workflow automation, and archive.",
            image: "",
            link: "/products/vsnexplorer-mam",
            buttonText: "Learn more",
        },
    ],
    backgroundColor: "#0c0e15",
    cardBackground: "#101010",
    borderColor: "#424242",
    textColor: "rgba(255, 255, 255, 0.7)",
    buttonColor: "#c5e33d",
    buttonTextColor: "#000000",
    glowColor: "rgba(253, 192, 25, 0.4)",
    cardWidth: 550,
    cardGap: 16,
    scrollScreens: 3,
    paddingX: 40,
    paddingY: 80,
}

// ─── Property controls ──────────────────────────────────────────────────────

addPropertyControls(HorizontalCardStack, {
    cards: {
        type: ControlType.Array,
        title: "Cards",
        maxCount: 10,
        control: {
            type: ControlType.Object,
            controls: {
                title: {
                    type: ControlType.String,
                    title: "Title",
                    defaultValue: "Product Name",
                },
                description: {
                    type: ControlType.String,
                    title: "Description",
                    displayTextArea: true,
                    defaultValue: "Product description goes here.",
                },
                image: {
                    type: ControlType.Image,
                    title: "Image",
                },
                link: {
                    type: ControlType.Link,
                    title: "Link",
                },
                buttonText: {
                    type: ControlType.String,
                    title: "Button Text",
                    defaultValue: "Learn more",
                },
            },
        },
    },
    scrollScreens: {
        type: ControlType.Number,
        title: "Scroll Length",
        min: 1.5,
        max: 6,
        step: 0.5,
        defaultValue: 3,
        description:
            "Section height in viewports. Higher = slower horizontal scroll.",
    },
    cardWidth: {
        type: ControlType.Number,
        title: "Card Width",
        min: 280,
        max: 600,
        step: 10,
        defaultValue: 550,
        unit: "px",
    },
    cardGap: {
        type: ControlType.Number,
        title: "Card Gap",
        min: 8,
        max: 40,
        step: 4,
        defaultValue: 16,
        unit: "px",
    },
    paddingX: {
        type: ControlType.Number,
        title: "Side Padding",
        min: 0,
        max: 200,
        step: 8,
        defaultValue: 40,
        unit: "px",
    },
    paddingY: {
        type: ControlType.Number,
        title: "Vertical Padding",
        min: 20,
        max: 200,
        step: 8,
        defaultValue: 80,
        unit: "px",
    },
    backgroundColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#0c0e15",
    },
    cardBackground: {
        type: ControlType.Color,
        title: "Card Background",
        defaultValue: "#101010",
    },
    borderColor: {
        type: ControlType.Color,
        title: "Card Border",
        defaultValue: "#424242",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "rgba(255, 255, 255, 0.7)",
    },
    buttonColor: {
        type: ControlType.Color,
        title: "Button Color",
        defaultValue: "#c5e33d",
    },
    buttonTextColor: {
        type: ControlType.Color,
        title: "Button Text",
        defaultValue: "#000000",
    },
    glowColor: {
        type: ControlType.Color,
        title: "Glow Color",
        defaultValue: "rgba(253, 192, 25, 0.4)",
    },
})
