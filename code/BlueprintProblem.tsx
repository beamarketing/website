import { addPropertyControls, ControlType } from "framer"
import { useRef, useState, useEffect } from "react"

// Design tokens
const F = {
    h: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    b: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
}
const C = {
    primary: "#3751FF",
    white: "#FFFFFF",
    offWhite: "#F3F5FF",
    lightGray: "#F7F8FC",
    gray200: "#E5E7EB",
    gray400: "#9CA3AF",
    gray600: "#6B7280",
    text: "#171717",
    textSec: "#555555",
    success: "#10B981",
    accent: "#0098FE",
}
const R = { sm: 8, lg: 16, xl: 24, pill: 9999 }

function useSectionWidth() {
    const [width, setWidth] = useState(1200)
    const ref = useRef(null)

    useEffect(() => {
        if (!ref.current) return
        const observer = new ResizeObserver(() => {
            setWidth(ref.current?.offsetWidth || 1200)
        })
        observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])

    return [ref, width]
}

function useReveal(threshold = 0.1) {
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        if (!ref.current) return
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.unobserve(ref.current)
                }
            },
            { threshold }
        )
        observer.observe(ref.current)
        return () => observer.disconnect()
    }, [threshold])

    return [ref, isVisible]
}

function RevealDiv({ children, threshold = 0.1 }) {
    const [ref, isVisible] = useReveal(threshold)
    return (
        <div
            ref={ref}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
            }}
        >
            {children}
        </div>
    )
}

function ImgSlot({ src, alt = "Benchmark image" }) {
    return (
        <img
            src={src}
            alt={alt}
            style={{
                width: "100%",
                height: "auto",
                display: "block",
            }}
        />
    )
}

function SectionTag({ text, color = C.primary }) {
    return (
        <div
            style={{
                display: "inline-block",
                paddingTop: 6,
                paddingBottom: 6,
                paddingLeft: 12,
                paddingRight: 12,
                backgroundColor:
                    color === C.primary ? C.offWhite : "rgba(0, 0, 0, 0.05)",
                borderRadius: R.pill,
                fontSize: 12,
                fontWeight: 600,
                color: color,
                fontFamily: F.b,
                letterSpacing: 0.5,
                textTransform: "uppercase",
            }}
        >
            {text}
        </div>
    )
}

function BenchmarkTile({ value, label, color }) {
    return (
        <div
            style={{
                backgroundColor: C.lightGray,
                borderRadius: R.lg,
                padding: 20,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
            }}
        >
            <div
                style={{
                    fontSize: 28,
                    fontWeight: 700,
                    fontFamily: F.h,
                    color: color,
                    marginBottom: 8,
                    lineHeight: 1.2,
                }}
            >
                {value}
            </div>
            <div
                style={{
                    fontSize: 13,
                    fontWeight: 500,
                    fontFamily: F.b,
                    color: C.gray600,
                    lineHeight: 1.4,
                }}
            >
                {label}
            </div>
        </div>
    )
}

function BenchmarkGrid() {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
            }}
        >
            <BenchmarkTile
                value="48%"
                label="avg. size reduction"
                color={C.success}
            />
            <BenchmarkTile
                value="< 2%"
                label="mAP difference"
                color={C.primary}
            />
            <BenchmarkTile
                value="41–57%"
                label="Cosmos pipeline"
                color={C.accent}
            />
            <BenchmarkTile
                value="PSNR ✓"
                label="quality confirmed"
                color="#8B5CF6"
            />
        </div>
    )
}

export default function BlueprintProblem(props) {
    const {
        image,
        video,
        title = "Benchmarked on real-world AV data",
        titleColor = C.text,
        titleFontWeight = 700,
        titleFontFamily = F.h,
        titleFontSize = 48,
        titleMobileFontSize = 32,
        description = "We validated MLSafe against PandaSet and standard YOLO-based benchmarks using the Cosmos pipeline. Real-world results prove that aggressive compression maintains object detection accuracy while dramatically reducing file sizes.",
        descriptionColor = C.textSec,
        descriptionFontWeight = 400,
        descriptionFontFamily = F.b,
        descriptionFontSize = 16,
        linkText = "Read the full benchmark results →",
        linkUrl = "https://blog.beamr.com",
        linkColor = C.primary,
        background = C.lightGray,
        style,
    } = props

    const [sectionRef, sectionWidth] = useSectionWidth()
    const isMobile = sectionWidth < 768

    return (
        <section
            ref={sectionRef}
            style={{
                backgroundColor: background,
                padding: isMobile ? "48px 24px" : "80px 40px",
                fontFamily: F.b,
                color: C.text,
                ...style,
            }}
        >
            <div
                style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                    gap: isMobile ? 48 : 64,
                    alignItems: "center",
                }}
            >
                {/* Left column: Text content */}
                <RevealDiv threshold={0.2}>
                    <div>
                        <h2
                            style={{
                                fontSize: isMobile ? titleMobileFontSize : titleFontSize,
                                fontWeight: titleFontWeight,
                                fontFamily: titleFontFamily,
                                lineHeight: 1.2,
                                marginBottom: 20,
                                color: titleColor,
                            }}
                        >
                            {title}
                        </h2>

                        <div
                            style={{
                                fontSize: descriptionFontSize,
                                lineHeight: 1.6,
                                color: descriptionColor,
                                marginBottom: 28,
                                fontFamily: descriptionFontFamily,
                                fontWeight: descriptionFontWeight,
                            }}
                            dangerouslySetInnerHTML={{
                                __html: description,
                            }}
                        />

                        <a
                            href={linkUrl}
                            style={{
                                display: "inline-block",
                                fontSize: 16,
                                fontWeight: 600,
                                color: linkColor,
                                textDecoration: "none",
                                fontFamily: F.b,
                                transition: "opacity 0.3s ease",
                                cursor: "pointer",
                            }}
                            onMouseEnter={(e) =>
                                (e.target.style.opacity = "0.7")
                            }
                            onMouseLeave={(e) => (e.target.style.opacity = "1")}
                        >
                            {linkText}
                        </a>
                    </div>
                </RevealDiv>

                {/* Right column: Benchmark visuals */}
                <RevealDiv threshold={0.2}>
                    {video ? (
                        <video
                            src={video}
                            autoPlay
                            muted
                            loop
                            playsInline
                            style={{
                                width: "100%",
                                height: "auto",
                                display: "block",
                            }}
                        />
                    ) : image ? (
                        <img
                            src={image}
                            alt="Benchmark visualization"
                            style={{
                                width: "100%",
                                height: "auto",
                                display: "block",
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                backgroundColor: C.white,
                                border: `1px solid ${C.gray200}`,
                                borderRadius: 20,
                                padding: 36,
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                            }}
                        >
                            <BenchmarkGrid />
                        </div>
                    )}
                </RevealDiv>
            </div>
        </section>
    )
}

addPropertyControls(BlueprintProblem, {
    video: {
        type: ControlType.File,
        title: "Benchmark Video",
        allowedFileTypes: ["mp4", "webm", "mov"],
    },
    image: {
        type: ControlType.Image,
        title: "Benchmark Image",
    },
    title: {
        type: ControlType.String,
        title: "Title",
        defaultValue: "Benchmarked on real-world AV data",
    },
    titleColor: {
        type: ControlType.Color,
        title: "Title Color",
        defaultValue: C.text,
    },
    titleFontWeight: {
        type: ControlType.Number,
        title: "Title Weight",
        defaultValue: 700,
        min: 100,
        max: 900,
        step: 100,
    },
    titleFontFamily: {
        type: ControlType.String,
        title: "Title Font",
        defaultValue: "'Poppins', sans-serif",
    },
    titleFontSize: {
        type: ControlType.Number,
        title: "Title Size",
        defaultValue: 48,
        min: 16,
        max: 96,
        step: 1,
    },
    titleMobileFontSize: {
        type: ControlType.Number,
        title: "Title Size (Mobile)",
        defaultValue: 32,
        min: 16,
        max: 72,
        step: 1,
    },
    description: {
        type: ControlType.String,
        title: "Description (HTML)",
        displayTextArea: true,
        defaultValue:
            "We validated MLSafe against PandaSet and standard YOLO-based benchmarks using the Cosmos pipeline. Real-world results prove that aggressive compression maintains object detection accuracy while dramatically reducing file sizes.",
    },
    descriptionColor: {
        type: ControlType.Color,
        title: "Description Color",
        defaultValue: C.textSec,
    },
    descriptionFontWeight: {
        type: ControlType.Number,
        title: "Description Weight",
        defaultValue: 400,
        min: 100,
        max: 900,
        step: 100,
    },
    descriptionFontFamily: {
        type: ControlType.String,
        title: "Description Font",
        defaultValue: "'Inter', sans-serif",
    },
    descriptionFontSize: {
        type: ControlType.Number,
        title: "Description Size",
        defaultValue: 16,
        min: 12,
        max: 32,
        step: 1,
    },
    linkText: {
        type: ControlType.String,
        title: "Link Text",
        defaultValue: "Read the full benchmark results →",
    },
    linkUrl: {
        type: ControlType.String,
        title: "Link URL",
        defaultValue: "https://blog.beamr.com",
    },
    linkColor: {
        type: ControlType.Color,
        title: "Link Color",
        defaultValue: C.primary,
    },
    background: {
        type: ControlType.Color,
        title: "Background Color",
        defaultValue: C.lightGray,
    },
})
