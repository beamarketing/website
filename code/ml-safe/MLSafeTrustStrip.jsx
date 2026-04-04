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
  gray600: "#6B7280",
}

const R = { pill: 9999 }

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

export default function MLSafeTrustStrip(props) {
  const {
    item1 = "🏆 Emmy Award-winning technology",
    item2 = "🔧 Co-developed with NVIDIA",
    item3 = "📑 53+ granted patents",
    item4 = "🎬 Netflix · BMW · Wayve · Bosch",
  } = props

  const { width, ref: containerRef } = useSectionWidth()
  const isMobile = width < 640

  const items = [item1, item2, item3, item4]
  const delays = [0, 0.1, 0.2, 0.3]

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        background: C.white,
        padding: isMobile ? "40px 24px" : "52px 60px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: isMobile ? "16px" : "48px",
          alignItems: "center",
        }}
      >
        {items.map((item, index) => (
          <TrustBadge
            key={index}
            text={item}
            delay={delays[index]}
          />
        ))}
      </div>
    </div>
  )
}

function TrustBadge({ text, delay }) {
  const { isVisible, ref } = useReveal(delay * 1000)

  return (
    <div
      ref={ref}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        background: C.lightGray,
        border: `1px solid rgba(0, 0, 0, 0.03)`,
        borderRadius: R.pill,
        padding: "10px 20px",
        fontFamily: F.b,
        fontSize: "13px",
        fontWeight: 500,
        color: C.gray600,
        whiteSpace: "nowrap",
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0px)" : "translateY(20px)",
        transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
      }}
    >
      <span style={{ fontSize: "16px" }}>
        {text.split(" ")[0]}
      </span>
      <span>{text.substring(2)}</span>
    </div>
  )
}

addPropertyControls(MLSafeTrustStrip, {
  item1: {
    type: ControlType.String,
    title: "Trust Item 1",
    defaultValue: "🏆 Emmy Award-winning technology",
  },
  item2: {
    type: ControlType.String,
    title: "Trust Item 2",
    defaultValue: "🔧 Co-developed with NVIDIA",
  },
  item3: {
    type: ControlType.String,
    title: "Trust Item 3",
    defaultValue: "📑 53+ granted patents",
  },
  item4: {
    type: ControlType.String,
    title: "Trust Item 4",
    defaultValue: "🎬 Netflix · BMW · Wayve · Bosch",
  },
})
