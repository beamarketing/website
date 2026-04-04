import { addPropertyControls, ControlType } from "framer"
import { useRef, useState, useEffect } from "react"

// Design tokens
const F = { h: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", b: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }
const C = { primary: "#3751FF", dark: "#000737", white: "#FFFFFF", gray200: "#E5E7EB", gray600: "#6B7280", text: "#171717", success: "#10B981", accent: "#0098FE" }
const R = { sm: 8, pill: 9999 }

// Hook: Detect section width for responsive behavior
function useSectionWidth() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024)
  const containerRef = useRef(null)

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setWidth(rect.width || window.innerWidth)
      } else {
        setWidth(window.innerWidth)
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize()
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return { width, ref: containerRef }
}

// Hook: Scroll reveal animation
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

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return { isVisible, ref }
}

// Main component
export default function MLSafeStatStrip(props) {
  const {
    stat1Value = "Up to 50%",
    stat1Label = "Processing Efficiency",
    stat2Value = "< 2%",
    stat2Label = "Quality Loss",
    stat3Value = "10×",
    stat3Label = "Faster Encoding",
    stat4Value = "53+",
    stat4Label = "Format Support",
    floatingOffset = -48,
  } = props

  const { width, ref: containerRef } = useSectionWidth()
  const { isVisible, ref: revealRef } = useReveal()
  const isMobile = width < 640

  // Stat color mapping
  const statColors = [C.primary, C.success, C.text, C.accent]
  const stats = [
    { value: stat1Value, label: stat1Label },
    { value: stat2Value, label: stat2Label },
    { value: stat3Value, label: stat3Label },
    { value: stat4Value, label: stat4Label },
  ]

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        position: "relative",
        zIndex: 3,
        marginTop: isMobile ? `-28px` : `${floatingOffset}px`,
      }}
    >
      <div
        ref={revealRef}
        style={{
          width: "100%",
          maxWidth: "1200px",
          padding: `0 ${isMobile ? "20px" : "60px"}`,
          opacity: isVisible ? 1 : 0.8,
          transform: isVisible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
        }}
      >
        <div
          style={{
            backgroundColor: C.white,
            borderRadius: "20px",
            boxShadow: "0 4px 32px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.04)",
            border: "1px solid rgba(0,0,0,.04)",
            overflow: "hidden",
          }}
        >
          {isMobile ? (
            // Mobile: 2-column grid, no dividers
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "24px",
                padding: "32px 20px",
              }}
            >
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      fontFamily: F.h,
                      fontSize: "26px",
                      fontWeight: 700,
                      color: statColors[idx],
                      lineHeight: 1.2,
                      marginBottom: "8px",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontFamily: F.b,
                      fontSize: "11px",
                      fontWeight: 400,
                      color: C.gray600,
                      textAlign: "center",
                      lineHeight: 1.3,
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Desktop: single row with dividers
            <div
              style={{
                display: "flex",
                alignItems: "stretch",
                padding: "40px 20px",
              }}
            >
              {stats.map((stat, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "stretch", flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: F.h,
                        fontSize: "32px",
                        fontWeight: 700,
                        color: statColors[idx],
                        lineHeight: 1.2,
                        marginBottom: "8px",
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        fontFamily: F.b,
                        fontSize: "12px",
                        fontWeight: 400,
                        color: C.gray600,
                        textAlign: "center",
                        lineHeight: 1.3,
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>

                  {/* Divider between stats (except after last) */}
                  {idx < stats.length - 1 && (
                    <div
                      style={{
                        width: "1px",
                        height: "40px",
                        backgroundColor: C.gray200,
                        margin: "0 20px",
                        flexShrink: 0,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Property controls
addPropertyControls(MLSafeStatStrip, {
  stat1Value: {
    type: ControlType.String,
    title: "Stat 1 Value",
    defaultValue: "Up to 50%",
  },
  stat1Label: {
    type: ControlType.String,
    title: "Stat 1 Label",
    defaultValue: "Processing Efficiency",
  },
  stat2Value: {
    type: ControlType.String,
    title: "Stat 2 Value",
    defaultValue: "< 2%",
  },
  stat2Label: {
    type: ControlType.String,
    title: "Stat 2 Label",
    defaultValue: "Quality Loss",
  },
  stat3Value: {
    type: ControlType.String,
    title: "Stat 3 Value",
    defaultValue: "10×",
  },
  stat3Label: {
    type: ControlType.String,
    title: "Stat 3 Label",
    defaultValue: "Faster Encoding",
  },
  stat4Value: {
    type: ControlType.String,
    title: "Stat 4 Value",
    defaultValue: "53+",
  },
  stat4Label: {
    type: ControlType.String,
    title: "Stat 4 Label",
    defaultValue: "Format Support",
  },
  floatingOffset: {
    type: ControlType.Number,
    title: "Floating Offset",
    defaultValue: -48,
    min: -100,
    max: 0,
    step: 4,
    displayStepper: true,
    description: "Negative margin to overlap above section",
  },
})
