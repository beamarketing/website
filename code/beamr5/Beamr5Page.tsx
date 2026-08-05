// Beamr 5 HEVC Page - Full Page Wrapper
// Combines all Beamr 5 sections into a single scrollable page
// Rebuild of beamr.com/beamr5-hevc in the new beamr.com design language,
// following the beamr.com/blueprint_av page template.
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"
import Beamr5Nav from "./Beamr5Nav"
import Beamr5Hero from "./Beamr5Hero"
import Beamr5Trust from "./Beamr5Trust"
import Beamr5Features from "./Beamr5Features"
import Beamr5Technical from "./Beamr5Technical"
import Beamr5Testimonial from "./Beamr5Testimonial"
import Beamr5CTA from "./Beamr5CTA"
import Beamr5Footer from "./Beamr5Footer"

interface Props {
    accentColor: string
    headingFont: string
    fontFamily: string
    showNav: boolean
    showHero: boolean
    showTrust: boolean
    showFeatures: boolean
    showTechnical: boolean
    showTestimonial: boolean
    showCTA: boolean
    showFooter: boolean
    style?: React.CSSProperties
}

function Beamr5Page(props: Props) {
    const {
        accentColor = "#2f73ff",
        headingFont = "'Poppins', sans-serif",
        fontFamily = "'Inter', sans-serif",
        showNav = true,
        showHero = true,
        showTrust = true,
        showFeatures = true,
        showTechnical = true,
        showTestimonial = true,
        showCTA = true,
        showFooter = true,
        style,
    } = props

    const fonts = { accentColor, headingFont, fontFamily }

    return (
        <div
            style={{
                ...style,
                width: "100%",
                backgroundColor: "#ffffff",
                fontFamily,
            }}
        >
            {showNav && <Beamr5Nav {...fonts} />}
            {showHero && <Beamr5Hero {...fonts} />}
            {showTrust && <Beamr5Trust {...fonts} />}
            {showFeatures && <Beamr5Features {...fonts} />}
            {showTechnical && <Beamr5Technical {...fonts} />}
            {showTestimonial && <Beamr5Testimonial {...fonts} />}
            {showCTA && <Beamr5CTA {...fonts} />}
            {showFooter && <Beamr5Footer {...fonts} />}
        </div>
    )
}

addPropertyControls(Beamr5Page, {
    showNav: {
        type: ControlType.Boolean,
        title: "Show Nav",
        defaultValue: true,
    },
    showHero: {
        type: ControlType.Boolean,
        title: "Show Hero",
        defaultValue: true,
    },
    showTrust: {
        type: ControlType.Boolean,
        title: "Show Trust",
        defaultValue: true,
    },
    showFeatures: {
        type: ControlType.Boolean,
        title: "Show Features",
        defaultValue: true,
    },
    showTechnical: {
        type: ControlType.Boolean,
        title: "Show Technical",
        defaultValue: true,
    },
    showTestimonial: {
        type: ControlType.Boolean,
        title: "Show Testimonial",
        defaultValue: true,
    },
    showCTA: {
        type: ControlType.Boolean,
        title: "Show CTA",
        defaultValue: true,
    },
    showFooter: {
        type: ControlType.Boolean,
        title: "Show Footer",
        defaultValue: true,
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "#2f73ff",
    },
    headingFont: {
        type: ControlType.String,
        title: "Heading Font",
        defaultValue: "'Poppins', sans-serif",
    },
    fontFamily: {
        type: ControlType.String,
        title: "Body Font",
        defaultValue: "'Inter', sans-serif",
    },
})

export default Beamr5Page
