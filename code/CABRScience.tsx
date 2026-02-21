// Beamr Homepage - The Science Behind CABR Section
// Framer Code Component – 2-col layout with tilted media & feature row

import { addPropertyControls, ControlType } from "framer"
import { useEffect, useRef, useState, useMemo } from "react"

interface FeatureItem {
    icon: string
    title: string
    description: string
}

interface Props {
    heading: string
    headingSize: number
    description: string
    linkText: string
    linkUrl: string
    features: FeatureItem[]
    mediaImage: string
    mediaVideo: string
    useVideo: boolean
    bgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    fontFamily: string
    pixelCount: number
    pixelColor: string
    style?: React.CSSProperties
}

// Deterministic pseudo-random from seed
function seededRandom(seed: number) {
    let s = seed
    return () => {
        s = (s * 16807 + 0) % 2147483647
        return (s - 1) / 2147483646
    }
}

// SVG icons for features
const featureIcons: Record<string, (color: string) => React.ReactElement> = {
    plus: (c) => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4V16M4 10H16" stroke={c} strokeWidth="2" strokeLinecap="round" />
        </svg>
    ),
    clock: (c) => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="7" stroke={c} strokeWidth="1.5" />
            <path d="M10 6V10L13 12" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    ),
    star: (c) => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L12.4 7.2L18 7.8L13.8 11.6L15 17L10 14.2L5 17L6.2 11.6L2 7.8L7.6 7.2L10 2Z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    ),
    eye: (c) => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M2 10C2 10 5 4 10 4C15 4 18 10 18 10C18 10 15 16 10 16C5 16 2 10 2 10Z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
            <circle cx="10" cy="10" r="2.5" stroke={c} strokeWidth="1.5" />
        </svg>
    ),
}

function CABRScience(props: Props) {
    const {
        heading = "The Science\nBehind CABR",
        headingSize = 52,
        description = "Content-Adaptive Bitrate (CABR) is Beamr's patented technology that analyzes each frame of your video and intelligently adjusts encoding parameters — dramatically smaller files with proven quality.",
        linkText = "Explore Technology",
        linkUrl = "#cabr",
        features = [
            { icon: "plus", title: "30-50% Smaller", description: "Dramatically reduced file sizes without any visual quality loss" },
            { icon: "clock", title: "Faster Delivery", description: "Reduced bandwidth means faster load times worldwide" },
            { icon: "star", title: "Quality Assured", description: "Mathematically proven to preserve perceptual quality" },
            { icon: "eye", title: "Human & Machine", description: "Optimized for both human perception and AI analysis" },
        ],
        mediaImage = "",
        mediaVideo = "",
        useVideo = false,
        bgColor = "#080b16",
        textColor = "#ffffff",
        secondaryTextColor = "#7a7f96",
        accentColor = "#8b93b3",
        fontFamily = "'Inter', sans-serif",
        pixelCount = 35,
        pixelColor = "#2a3158",
        style,
    } = props

    const sectionRef = useRef<HTMLElement>(null)
    const [visible, setVisible] = useState(false)
    const [scrollY, setScrollY] = useState(0)
    const sectionTopRef = useRef(0)

    // Generate deterministic pixel particles
    const particles = useMemo(() => {
        const rand = seededRandom(77)
        return Array.from({ length: pixelCount }, (_, i) => ({
            id: i,
            x: rand() * 100,
            y: rand() * 100,
            size: 6 + rand() * 6,
            opacity: 0.1 + rand() * 0.22,
            speed: 0.3 + rand() * 0.7,
            delay: rand() * 20,
        }))
    }, [pixelCount])

    // Intersection observer
    useEffect(() => {
        const el = sectionRef.current
        if (!el) return
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true)
                    obs.disconnect()
                }
            },
            { threshold: 0.1 }
        )
        obs.observe(el)
        return () => obs.disconnect()
    }, [])

    // Scroll listener for parallax
    useEffect(() => {
        const onScroll = () => {
            const el = sectionRef.current
            if (!el) return
            sectionTopRef.current = el.getBoundingClientRect().top
            setScrollY(window.scrollY)
        }
        window.addEventListener("scroll", onScroll, { passive: true })
        onScroll()
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    // Inject CSS
    useEffect(() => {
        const id = "__cabr-science-css-v2"
        if (document.getElementById(id)) return
        const s = document.createElement("style")
        s.id = id
        s.textContent = `
            @keyframes cabr-pixel-float {
                0% { transform: translateY(0); }
                100% { transform: translateY(-120vh); }
            }
            .cabr-cta-btn {
                transition: background 0.3s ease, border-color 0.3s ease;
            }
            .cabr-cta-btn:hover {
                background: rgba(255,255,255,0.08) !important;
                border-color: rgba(255,255,255,0.25) !important;
            }
            .cabr-cta-btn .cabr-btn-arrow {
                transition: transform 0.25s ease;
                display: inline-block;
            }
            .cabr-cta-btn:hover .cabr-btn-arrow {
                transform: translateX(3px);
            }
            .cabr-feature-item {
                transition: transform 0.3s ease;
            }
            .cabr-feature-item:hover {
                transform: translateY(-2px);
            }
        `
        document.head.appendChild(s)
    }, [])

    const parallaxOffset = sectionRef.current
        ? (scrollY - (scrollY + sectionTopRef.current)) * 0.15
        : 0

    return (
        <section
            ref={sectionRef}
            style={{
                ...style,
                width: "100%",
                backgroundColor: bgColor,
                padding: "100px 48px",
                boxSizing: "border-box",
                fontFamily,
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Floating pixel particles */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    overflow: "hidden",
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            >
                {particles.map((p) => (
                    <div
                        key={p.id}
                        style={{
                            position: "absolute",
                            left: `${p.x}%`,
                            top: `${p.y}%`,
                            width: p.size,
                            height: p.size,
                            backgroundColor: pixelColor,
                            opacity: p.opacity,
                            borderRadius: 1,
                            animation: `cabr-pixel-float ${20 / p.speed}s linear ${p.delay}s infinite`,
                            transform: `translateY(${-parallaxOffset * p.speed}px)`,
                        }}
                    />
                ))}
            </div>

            <div
                style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                {/* Two-column hero: text left, media right */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1.8fr",
                        gap: 64,
                        alignItems: "center",
                    }}
                >
                    {/* Left: text content */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 24,
                            opacity: visible ? 1 : 0,
                            transform: visible ? "translateY(0)" : "translateY(40px)",
                            transition: "opacity 0.7s ease, transform 0.7s ease",
                        }}
                    >
                        <h2
                            style={{
                                fontSize: headingSize,
                                fontWeight: 700,
                                color: textColor,
                                margin: 0,
                                lineHeight: 1.1,
                                fontFamily,
                                letterSpacing: "-0.03em",
                                whiteSpace: "pre-line",
                            }}
                        >
                            {heading}
                        </h2>
                        <p
                            style={{
                                fontSize: 16,
                                color: secondaryTextColor,
                                margin: 0,
                                lineHeight: 1.7,
                                fontFamily,
                                maxWidth: 440,
                            }}
                        >
                            {description}
                        </p>
                        <div>
                            <a
                                href={linkUrl}
                                className="cabr-cta-btn"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 10,
                                    fontSize: 14,
                                    fontWeight: 500,
                                    color: textColor,
                                    textDecoration: "none",
                                    fontFamily,
                                    padding: "12px 24px",
                                    borderRadius: 100,
                                    border: "1px solid rgba(255,255,255,0.15)",
                                    background: "rgba(255,255,255,0.04)",
                                    letterSpacing: "0.01em",
                                    marginTop: 8,
                                }}
                            >
                                {linkText}
                                <span className="cabr-btn-arrow" style={{ fontSize: 16 }}>&#8594;</span>
                            </a>
                        </div>
                    </div>

                    {/* Right: tilted media */}
                    <div
                        style={{
                            opacity: visible ? 1 : 0,
                            transform: visible
                                ? "perspective(1200px) rotateY(-6deg) rotateX(2deg)"
                                : "perspective(1200px) rotateY(-6deg) rotateX(2deg) translateY(50px)",
                            transition: "opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s",
                        }}
                    >
                        <div
                            style={{
                                width: "100%",
                                aspectRatio: "16/9",
                                borderRadius: 14,
                                overflow: "hidden",
                                backgroundColor: "#0d1025",
                                border: "1px solid rgba(255,255,255,0.08)",
                                boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
                            }}
                        >
                            {useVideo && mediaVideo ? (
                                <video
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    src={mediaVideo}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                            ) : mediaImage ? (
                                <img
                                    src={mediaImage}
                                    alt={heading}
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
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: "linear-gradient(135deg, #0d1025 0%, #151a35 100%)",
                                    }}
                                >
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                                        <div
                                            style={{
                                                width: 64,
                                                height: 64,
                                                borderRadius: "50%",
                                                border: "1.5px solid rgba(255,255,255,0.12)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <span style={{ fontSize: 24, color: "rgba(255,255,255,0.3)", marginLeft: 3 }}>&#9654;</span>
                                        </div>
                                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", fontFamily }}>
                                            Add video or image
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Features row – all 4 in one line */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: 32,
                        marginTop: 56,
                    }}
                >
                    {features.map((feat, i) => {
                        const iconFn = featureIcons[feat.icon] || featureIcons.star
                        return (
                            <div
                                key={i}
                                className="cabr-feature-item"
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 12,
                                    opacity: visible ? 1 : 0,
                                    transform: visible ? "translateY(0)" : "translateY(30px)",
                                    transition: `opacity 0.5s ease ${0.3 + i * 0.1}s, transform 0.5s ease ${0.3 + i * 0.1}s`,
                                }}
                            >
                                <div
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: "50%",
                                        backgroundColor: "rgba(255,255,255,0.04)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    {iconFn(accentColor)}
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                    <span
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 600,
                                            color: textColor,
                                            fontFamily,
                                            letterSpacing: "-0.01em",
                                        }}
                                    >
                                        {feat.title}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: 12,
                                            color: secondaryTextColor,
                                            fontFamily,
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        {feat.description}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

addPropertyControls(CABRScience, {
    heading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "The Science\nBehind CABR",
        displayTextArea: true,
    },
    headingSize: {
        type: ControlType.Number,
        title: "Heading Size",
        defaultValue: 52,
        min: 32,
        max: 72,
        step: 2,
    },
    description: {
        type: ControlType.String,
        title: "Description",
        defaultValue:
            "Content-Adaptive Bitrate (CABR) is Beamr's patented technology that analyzes each frame of your video and intelligently adjusts encoding parameters — dramatically smaller files with proven quality.",
        displayTextArea: true,
    },
    linkText: {
        type: ControlType.String,
        title: "Button Text",
        defaultValue: "Explore Technology",
    },
    linkUrl: {
        type: ControlType.String,
        title: "Button URL",
        defaultValue: "#cabr",
    },
    features: {
        type: ControlType.Array,
        title: "Features",
        maxCount: 6,
        control: {
            type: ControlType.Object,
            controls: {
                icon: {
                    type: ControlType.Enum,
                    title: "Icon",
                    options: ["plus", "clock", "star", "eye"],
                    optionTitles: ["Plus", "Clock", "Star", "Eye"],
                    defaultValue: "star",
                },
                title: {
                    type: ControlType.String,
                    title: "Title",
                    defaultValue: "Feature",
                },
                description: {
                    type: ControlType.String,
                    title: "Description",
                    defaultValue: "Feature description text.",
                },
            },
        },
        defaultValue: [
            { icon: "plus", title: "30-50% Smaller", description: "Dramatically reduced file sizes without any visual quality loss" },
            { icon: "clock", title: "Faster Delivery", description: "Reduced bandwidth means faster load times worldwide" },
            { icon: "star", title: "Quality Assured", description: "Mathematically proven to preserve perceptual quality" },
            { icon: "eye", title: "Human & Machine", description: "Optimized for both human perception and AI analysis" },
        ],
    },
    useVideo: {
        type: ControlType.Boolean,
        title: "Use Video",
        defaultValue: false,
    },
    mediaVideo: {
        type: ControlType.File,
        title: "Video",
        allowedFileTypes: ["mp4", "webm"],
        hidden: (props) => !props.useVideo,
    },
    mediaImage: {
        type: ControlType.Image,
        title: "Image",
        hidden: (props) => props.useVideo,
    },
    pixelCount: {
        type: ControlType.Number,
        title: "Pixel Count",
        defaultValue: 35,
        min: 0,
        max: 120,
        step: 5,
    },
    pixelColor: {
        type: ControlType.Color,
        title: "Pixel Color",
        defaultValue: "#2a3158",
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#080b16",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#ffffff",
    },
    secondaryTextColor: {
        type: ControlType.Color,
        title: "Secondary Text",
        defaultValue: "#7a7f96",
    },
    accentColor: {
        type: ControlType.Color,
        title: "Icon Color",
        defaultValue: "#8b93b3",
    },
    fontFamily: {
        type: ControlType.String,
        title: "Font Family",
        defaultValue: "'Inter', sans-serif",
    },
})

export default CABRScience
