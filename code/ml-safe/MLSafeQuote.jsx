import { addPropertyControls, ControlType } from "framer"
import { useRef, useState, useEffect } from "react"

const F = {
  h: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  b: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
}

const C = {
  primary: "#3751FF",
  white: "#FFFFFF",
  lightGray: "#F7F8FC",
  gray400: "#9CA3AF",
  gray600: "#6B7280",
  text: "#171717",
}

// useSectionWidth hook
const useSectionWidth = () => {
  const [width, setWidth] = useState(1200)
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new ResizeObserver(() => {
      setWidth(element.offsetWidth)
    })

    observer.observe(element)
    setWidth(element.offsetWidth)

    return () => observer.disconnect()
  }, [])

  return { width, ref }
}

// useReveal hook
const useReveal = (delay = 0) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true)
          }, delay)
          observer.unobserve(element)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [delay])

  return { isVisible, ref }
}

// RevealDiv wrapper component
function RevealDiv({ children, delay = 0 }) {
  const { isVisible, ref } = useReveal(delay)

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0px)" : "translateY(20px)",
        transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
      }}
    >
      {children}
    </div>
  )
}

export default function MLSafeQuote(props) {
  const {
    quote = "We don't ask you to trade quality for cost. We eliminate the trade-off entirely.",
    attribution = "Sharon Carmel, Founder & CEO — Beamr",
    background = "linear-gradient(180deg, #FFFFFF 0%, #F7F8FC 100%)",
  } = props

  const { width, ref: containerRef } = useSectionWidth()
  const isMobile = width < 640

  const padding = isMobile ? "48px 24px" : "88px 60px"
  const quoteFontSize = isMobile ? "21px" : "26px"

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        background: background,
        padding: padding,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <RevealDiv delay={0}>
        <div
          style={{
            maxWidth: "780px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Decorative quotation mark */}
          <div
            style={{
              fontFamily: F.h,
              fontSize: "72px",
              fontWeight: 700,
              color: C.primary,
              opacity: 0.12,
              lineHeight: 1,
              marginBottom: "-20px",
              userSelect: "none",
            }}
          >
            "
          </div>

          {/* Quote text */}
          <p
            style={{
              fontFamily: F.h,
              fontSize: quoteFontSize,
              fontWeight: 300,
              fontStyle: "italic",
              color: C.text,
              lineHeight: 1.55,
              margin: 0,
              marginTop: "24px",
            }}
          >
            {quote}
          </p>

          {/* Attribution */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              marginTop: "24px",
              fontFamily: F.b,
              fontSize: "14px",
              color: C.gray600,
            }}
          >
            <div
              style={{
                height: "1px",
                width: "24px",
                background: C.gray400,
              }}
            />
            <span>{attribution}</span>
          </div>
        </div>
      </RevealDiv>
    </div>
  )
}

addPropertyControls(MLSafeQuote, {
  quote: {
    type: ControlType.String,
    title: "Quote",
    displayTextArea: true,
    defaultValue:
      "We don't ask you to trade quality for cost. We eliminate the trade-off entirely.",
  },
  attribution: {
    type: ControlType.String,
    title: "Attribution",
    defaultValue: "Sharon Carmel, Founder & CEO — Beamr",
  },
  background: {
    type: ControlType.Color,
    title: "Background",
    defaultValue: "#FFFFFF",
  },
})
