import { addPropertyControls, ControlType } from "framer"
import { useRef, useState, useEffect } from "react"

// ─────────────────────────────────────────────────────────────
// DESIGN TOKENS (INLINED)
// ─────────────────────────────────────────────────────────────

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
}

const R = {
  sm: 8,
  lg: 16,
  xl: 24,
  pill: 9999,
}

// ─────────────────────────────────────────────────────────────
// SHARED HOOKS & UTILITIES
// ─────────────────────────────────────────────────────────────

function useSectionWidth() {
  const ref = useRef(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (!ref.current) return

    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setWidth(entries[0].contentRect.width)
      }
    })

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return [ref, width]
}

function useReveal() {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return [ref, isVisible]
}

// ─────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────

function RevealDiv({ children, delay = 0 }) {
  const [ref, isVisible] = useReveal()

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

function ImgSlot({ image, alt = "Section image", aspectRatio = "16/10", borderRadius = 16, boxShadow = "0 8px 24px rgba(0, 0, 0, 0.08)", fontBody = F.b, imageFrame = true }) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: imageFrame ? aspectRatio : undefined,
        borderRadius: imageFrame ? borderRadius : 0,
        overflow: imageFrame ? "hidden" : "visible",
        backgroundColor: imageFrame ? C.lightGray : "transparent",
        boxShadow: imageFrame ? boxShadow : "none",
      }}
    >
      {image ? (
        <img
          src={image}
          alt={alt}
          style={{
            width: "100%",
            height: imageFrame ? "100%" : "auto",
            objectFit: imageFrame ? "cover" : "contain",
            objectPosition: "center",
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
            backgroundColor: C.offWhite,
            fontSize: "14px",
            fontFamily: fontBody,
            color: C.gray400,
            fontWeight: 500,
            padding: "24px",
            textAlign: "center",
          }}
        >
          {alt}
        </div>
      )}
    </div>
  )
}

function SectionTag({ text = "How it works", fontBody = F.b }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "16px",
      }}
    >
      <div
        style={{
          width: "32px",
          height: "2px",
          backgroundColor: C.primary,
        }}
      />
      <span
        style={{
          fontSize: "12px",
          fontFamily: fontBody,
          fontWeight: 600,
          color: C.primary,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {text}
      </span>
    </div>
  )
}

function CheckItem({ text, fontBody = F.b }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          backgroundColor: C.success,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "2px",
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          style={{
            stroke: C.white,
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
          }}
        >
          <path d="M2 7.5L5.5 11L12 2" />
        </svg>
      </div>
      <p
        style={{
          fontSize: "15px",
          fontFamily: fontBody,
          lineHeight: "1.6",
          color: C.text,
          margin: 0,
        }}
      >
        {text}
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

export default function MLSafeHowItWorks({
  image = null,
  video = null,
  tagText = "How it works",
  title = "Compress smarter, not harder",
  description = "Beamr's CABR compression uses dual encoding passes to preserve the video quality metrics that matter most to machine learning models. While other codecs optimize for human perception, CABR preserves temporal consistency and spatial detail that AI systems depend on for accurate inference.",
  bullets = [
    "Works on already-encoded video — no re-ingest",
    "Standard output: H.264, HEVC, AV1",
    "Runs on NVIDIA GPUs already in your stack",
    "Deploy via Docker, API, FFmpeg, or managed cloud",
  ],
  imageFrame = true,
  headingFont = "Poppins",
  bodyFont = "Inter",
  background = "#FFFFFF",
  style,
}) {
  const [sectionRef, sectionWidth] = useSectionWidth()
  const isMobile = sectionWidth < 768
  const fallback = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  const fH = `'${headingFont}', ${fallback}`
  const fB = `'${bodyFont}', ${fallback}`

  return (
    <section
      ref={sectionRef}
      style={{
        width: "100%",
        backgroundColor: background,
        padding: isMobile ? "40px 20px" : "80px 40px",
        ...style,
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? "32px" : "64px",
          alignItems: "center",
        }}
      >
        {/* LEFT COLUMN - MEDIA */}
        <RevealDiv delay={0}>
          {video ? (
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: imageFrame ? "16/10" : undefined,
                borderRadius: imageFrame ? 16 : 0,
                overflow: imageFrame ? "hidden" : "visible",
                backgroundColor: imageFrame ? C.lightGray : "transparent",
                boxShadow: imageFrame ? "0 8px 24px rgba(0, 0, 0, 0.08)" : "none",
              }}
            >
              <video
                src={video}
                autoPlay
                muted
                loop
                playsInline
                style={{
                  width: "100%",
                  height: imageFrame ? "100%" : "auto",
                  objectFit: imageFrame ? "cover" : "contain",
                }}
              />
            </div>
          ) : (
            <ImgSlot image={image} alt="How CABR preserves ML-critical detail" fontBody={fB} imageFrame={imageFrame} />
          )}
        </RevealDiv>

        {/* RIGHT COLUMN - CONTENT */}
        <RevealDiv delay={100}>
          <div>
            {/* TAG */}
            <SectionTag text={tagText} fontBody={fB} />

            {/* TITLE */}
            <h2
              style={{
                fontSize: isMobile ? "28px" : "40px",
                fontFamily: fH,
                fontWeight: 700,
                lineHeight: "1.2",
                color: C.text,
                margin: "0 0 16px 0",
              }}
            >
              {title}
            </h2>

            {/* DESCRIPTION */}
            <p
              style={{
                fontSize: "16px",
                fontFamily: fB,
                lineHeight: "1.7",
                color: C.textSec,
                margin: "0 0 32px 0",
              }}
            >
              {description}
            </p>

            {/* CHECK ITEMS */}
            {bullets && bullets.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {bullets.map((text, idx) => (
                  <CheckItem key={idx} text={text} fontBody={fB} />
                ))}
              </div>
            )}
          </div>
        </RevealDiv>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// PROPERTY CONTROLS
// ─────────────────────────────────────────────────────────────

addPropertyControls(MLSafeHowItWorks, {
  video: {
    type: ControlType.File,
    title: "Video",
    allowedFileTypes: ["mp4", "webm", "mov"],
  },
  image: {
    type: ControlType.Image,
    title: "Image (fallback)",
  },
  tagText: {
    type: ControlType.String,
    title: "Section Tag",
    defaultValue: "How it works",
  },
  title: {
    type: ControlType.String,
    title: "Title",
    defaultValue: "Compress smarter, not harder",
  },
  description: {
    type: ControlType.String,
    title: "Description",
    displayTextArea: true,
    defaultValue:
      "Beamr's CABR compression uses dual encoding passes to preserve the video quality metrics that matter most to machine learning models. While other codecs optimize for human perception, CABR preserves temporal consistency and spatial detail that AI systems depend on for accurate inference.",
  },
  bullets: {
    type: ControlType.Array,
    title: "Bullets",
    control: {
      type: ControlType.String,
    },
    defaultValue: [
      "Works on already-encoded video — no re-ingest",
      "Standard output: H.264, HEVC, AV1",
      "Runs on NVIDIA GPUs already in your stack",
      "Deploy via Docker, API, FFmpeg, or managed cloud",
    ],
    maxCount: 10,
  },
  imageFrame: {
    type: ControlType.Boolean,
    title: "Image Frame",
    defaultValue: true,
    enabledTitle: "On",
    disabledTitle: "Off",
  },
  headingFont: {
    type: ControlType.String,
    title: "Heading Font",
    defaultValue: "Poppins",
  },
  bodyFont: {
    type: ControlType.String,
    title: "Body Font",
    defaultValue: "Inter",
  },
  background: {
    type: ControlType.Color,
    title: "Background Color",
    defaultValue: "#FFFFFF",
  },
})
