// Industry Page - Full Page Wrapper
// Combines all industry sections into a single scrollable page
// Framer Code Component with full property controls

import { addPropertyControls, ControlType } from "framer"
import Navigation from "../Navigation"
import IndustryHero from "./IndustryHero"
import IndustryUseCases from "./IndustryUseCases"
import IndustryTechnology from "./IndustryTechnology"
import IndustrySocialProof from "./IndustrySocialProof"
import IndustryPartnership from "./IndustryPartnership"
import IndustryNews from "./IndustryNews"
import IndustryFAQ from "./IndustryFAQ"
import IndustryCTA from "./IndustryCTA"
import IndustryFooter from "./IndustryFooter"

interface Props {
    bgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    fontFamily: string
    showNavigation: boolean
    showHero: boolean
    showUseCases: boolean
    showTechnology: boolean
    showSocialProof: boolean
    showPartnership: boolean
    showNews: boolean
    showFAQ: boolean
    showCTA: boolean
    showFooter: boolean
    style?: React.CSSProperties
}

function IndustryPage(props: Props) {
    const {
        bgColor = "#07071c",
        textColor = "#ffffff",
        secondaryTextColor = "#8b8ba3",
        accentColor = "#00d46a",
        fontFamily = "'Inter', sans-serif",
        showNavigation = true,
        showHero = true,
        showUseCases = true,
        showTechnology = true,
        showSocialProof = true,
        showPartnership = true,
        showNews = true,
        showFAQ = true,
        showCTA = true,
        showFooter = true,
        style,
    } = props

    const shared = {
        bgColor,
        textColor,
        secondaryTextColor,
        accentColor,
        fontFamily,
    }

    return (
        <div
            style={{
                ...style,
                width: "100%",
                backgroundColor: bgColor,
                fontFamily,
            }}
        >
            {showNavigation && <Navigation overlayMode={true} />}
            {showHero && <IndustryHero {...shared} />}
            {showUseCases && <IndustryUseCases {...shared} />}
            {showTechnology && (
                <IndustryTechnology {...shared} bgColor="#0a0b1e" />
            )}
            {showSocialProof && <IndustrySocialProof {...shared} />}
            {showPartnership && (
                <IndustryPartnership {...shared} bgColor="#0a0b1e" />
            )}
            {showNews && <IndustryNews {...shared} />}
            {showFAQ && <IndustryFAQ {...shared} />}
            {showCTA && <IndustryCTA {...shared} />}
            {showFooter && (
                <IndustryFooter {...shared} bgColor="#050516" />
            )}
        </div>
    )
}

addPropertyControls(IndustryPage, {
    showNavigation: {
        type: ControlType.Boolean,
        title: "Show Navigation",
        defaultValue: true,
    },
    showHero: {
        type: ControlType.Boolean,
        title: "Show Hero",
        defaultValue: true,
    },
    showUseCases: {
        type: ControlType.Boolean,
        title: "Show Use Cases",
        defaultValue: true,
    },
    showTechnology: {
        type: ControlType.Boolean,
        title: "Show Technology",
        defaultValue: true,
    },
    showSocialProof: {
        type: ControlType.Boolean,
        title: "Show Social Proof",
        defaultValue: true,
    },
    showPartnership: {
        type: ControlType.Boolean,
        title: "Show Partnership",
        defaultValue: true,
    },
    showNews: {
        type: ControlType.Boolean,
        title: "Show News",
        defaultValue: true,
    },
    showFAQ: {
        type: ControlType.Boolean,
        title: "Show FAQ",
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
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#07071c",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#ffffff",
    },
    secondaryTextColor: {
        type: ControlType.Color,
        title: "Secondary Text",
        defaultValue: "#8b8ba3",
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "#00d46a",
    },
    fontFamily: {
        type: ControlType.String,
        title: "Font Family",
        defaultValue: "'Inter', sans-serif",
    },
})

export default IndustryPage
