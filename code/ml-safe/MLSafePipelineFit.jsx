import { addPropertyControls, ControlType } from "framer"
import { useRef, useState, useEffect } from "react"

// Design tokens
const F = { h: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", b: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }
const C = { primary: "#3751FF", white: "#FFFFFF", offWhite: "#F3F5FF", lightGray: "#F7F8FC", gray200: "#E5E7EB", gray400: "#9CA3AF", gray600: "#6B7280", text: "#171717", textSec: "#555555" }
const R = { sm: 8, lg: 16, xl: 24, pill: 9999 }

// Custom hooks
function useSectionWidth() {
  const [width, setWidth] = useState(1200)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setWidth(entries[0].contentRect.width)
      }
    })
    if (ref.current) {
      observer.observe(ref.current)
    }
    return () => observer.disconnect()
  }, [])

  return { ref, width }
}

function useReveal() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) {
      observer.observe(ref.current)
    }
    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}

// RevealDiv component
function RevealDiv({ children, ...props }) {
  const { ref, isVisible } = useReveal()
  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
        ...props.style
      }}
      {...props}
    >
      {children}
    </div>
  )
}

// ImgSlot component
function ImgSlot({ image, ...props }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundImage: image ? `url(${image})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: R.lg,
        ...props.style
      }}
      {...props}
    />
  )
}

// SectionTag component
function SectionTag({ text }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        paddingLeft: R.sm,
        paddingRight: R.sm,
        paddingTop: "4px",
        paddingBottom: "4px",
        borderRadius: R.pill,
        backgroundColor: C.offWhite,
        border: `1px solid ${C.gray200}`,
        marginBottom: "16px"
      }}
    >
      <div
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: C.primary
        }}
      />
      <span
        style={{
          fontSize: "13px",
          fontWeight: "600",
          fontFamily: F.b,
          color: C.primary,
          textTransform: "uppercase",
          letterSpacing: "0.5px"
        }}
      >
        {text}
      </span>
    </div>
  )
}

// Pipeline Node component
function PipelineNode({ label, isActive, index }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          width: "280px"
        }}
      >
        {/* Dot */}
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: isActive ? C.offWhite : C.white,
            border: `2px solid ${isActive ? C.primary : C.gray200}`,
            boxShadow: isActive ? `0 0 12px rgba(55, 81, 255, 0.3)` : "0 2px 4px rgba(0, 0, 0, 0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: isActive ? C.primary : C.gray400
            }}
          />
        </div>

        {/* Label */}
        <span
          style={{
            fontSize: "14px",
            fontWeight: isActive ? "700" : "500",
            fontFamily: F.b,
            color: isActive ? C.primary : C.text,
            flex: 1
          }}
        >
          {label}
        </span>
      </div>

      {/* Arrow (not after last node) */}
      {index < 3 && (
        <div
          style={{
            width: "2px",
            height: "20px",
            backgroundColor: C.gray200,
            position: "relative",
            "&::after": {}
          }}
        >
          {/* Arrow triangle */}
          <div
            style={{
              position: "absolute",
              bottom: "-6px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "0",
              height: "0",
              borderLeft: "4px solid transparent",
              borderRight: "4px solid transparent",
              borderTop: `6px solid ${C.gray200}`
            }}
          />
        </div>
      )}
    </div>
  )
}

// Main component
export default function MLSafePipelineFit(props) {
  const { ref: sectionRef, width: sectionWidth } = useSectionWidth()
  const isMobile = sectionWidth < 768

  const {
    image,
    tagText = "Zero disruption",
    title = "Fits your existing pipeline",
    description = "CABR integrates seamlessly into your H.264 or HEVC encoding pipeline without disruption. Sit between encode and storage stages to optimize bitrate while maintaining compatibility with existing workflows."
  } = props

  return (
    <div
      ref={sectionRef}
      style={{
        width: "100%",
        backgroundColor: C.white,
        padding: isMobile ? "48px 20px" : "80px 60px",
        boxSizing: "border-box"
      }}
    >
      {/* Container */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? "48px" : "80px",
          alignItems: "center"
        }}
      >
        {/* Left: Visual */}
        <RevealDiv style={{ width: "100%" }}>
          {image ? (
            <ImgSlot
              image={image}
              style={{
                aspectRatio: "4 / 3",
                borderRadius: R.lg,
                border: `1px solid ${C.gray200}`,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)"
              }}
            />
          ) : (
            /* Pipeline Diagram */
            <div
              style={{
                aspectRatio: isMobile ? "auto" : "4 / 3",
                minHeight: isMobile ? "auto" : undefined,
                borderRadius: R.lg,
                border: `1px solid ${C.gray200}`,
                background: `linear-gradient(135deg, ${C.lightGray} 0%, ${C.offWhite} 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px 20px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)"
              }}
            >
              <div style={{ width: "100%", maxWidth: "280px" }}>
                <PipelineNode label="Camera / Sensor Ingest" isActive={false} index={0} />
                <PipelineNode label="Encode (H.264 / HEVC)" isActive={false} index={1} />
                <PipelineNode label="CABR Optimization" isActive={true} index={2} />
                <PipelineNode label="Storage / ML Training" isActive={false} index={3} />
              </div>
            </div>
          )}
        </RevealDiv>

        {/* Right: Text */}
        <RevealDiv style={{ width: "100%" }}>
          <SectionTag text={tagText} />

          <h2
            style={{
              fontSize: isMobile ? "32px" : "48px",
              fontWeight: "700",
              fontFamily: F.h,
              color: C.text,
              lineHeight: "1.2",
              marginBottom: "24px",
              marginTop: "0"
            }}
          >
            {title}
          </h2>

          <p
            style={{
              fontSize: "16px",
              fontWeight: "400",
              fontFamily: F.b,
              color: C.textSec,
              lineHeight: "1.6",
              marginTop: "0",
              marginBottom: "0"
            }}
          >
            {description}
          </p>
        </RevealDiv>
      </div>
    </div>
  )
}

// Property controls
addPropertyControls(MLSafePipelineFit, {
  image: {
    type: ControlType.Image,
    title: "Pipeline Diagram"
  },
  tagText: {
    type: ControlType.String,
    title: "Tag Text",
    defaultValue: "Zero disruption"
  },
  title: {
    type: ControlType.String,
    title: "Title",
    defaultValue: "Fits your existing pipeline"
  },
  description: {
    type: ControlType.String,
    title: "Description",
    defaultValue: "CABR integrates seamlessly into your H.264 or HEVC encoding pipeline without disruption. Sit between encode and storage stages to optimize bitrate while maintaining compatibility with existing workflows.",
    displayTextArea: true
  }
})
