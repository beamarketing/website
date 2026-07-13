import { addPropertyControls, ControlType } from "framer"
import AVADASHero from "./AVADASHero"
import AVADASProblem from "./AVADASProblem"
import AVADASThirdOption from "./AVADASThirdOption"
import AVADASPhases from "./AVADASPhases"
import AVADASDeliverables from "./AVADASDeliverables"
import AVADASWalkaway from "./AVADASWalkaway"
import AVADASRules from "./AVADASRules"
import AVADASCredibility from "./AVADASCredibility"
import AVADASCTA from "./AVADASCTA"

interface Props {
    bgColor: string
    textColor: string
    secondaryTextColor: string
    accentColor: string
    fontFamily: string
    showHero: boolean
    showProblem: boolean
    showThirdOption: boolean
    showPhases: boolean
    showDeliverables: boolean
    showWalkaway: boolean
    showRules: boolean
    showCredibility: boolean
    showCTA: boolean
    style?: React.CSSProperties
}

function AVADASPage(props: Props) {
    const {
        bgColor = "#07071c",
        textColor = "#ffffff",
        secondaryTextColor = "#8b8ba3",
        accentColor = "#00d46a",
        fontFamily = "'Inter', sans-serif",
        showHero = true,
        showProblem = true,
        showThirdOption = true,
        showPhases = true,
        showDeliverables = true,
        showWalkaway = true,
        showRules = true,
        showCredibility = true,
        showCTA = true,
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
            {showHero && <AVADASHero {...shared} />}
            {showProblem && <AVADASProblem {...shared} />}
            {showThirdOption && <AVADASThirdOption {...shared} bgColor="#0a0b1e" />}
            {showPhases && <AVADASPhases {...shared} />}
            {showDeliverables && <AVADASDeliverables {...shared} bgColor="#0a0b1e" />}
            {showWalkaway && <AVADASWalkaway {...shared} />}
            {showRules && <AVADASRules {...shared} bgColor="#0a0b1e" />}
            {showCredibility && <AVADASCredibility {...shared} />}
            {showCTA && <AVADASCTA {...shared} />}
        </div>
    )
}

addPropertyControls(AVADASPage, {
    showHero: {
        type: ControlType.Boolean,
        title: "Show Hero",
        defaultValue: true,
    },
    showProblem: {
        type: ControlType.Boolean,
        title: "Show Problem",
        defaultValue: true,
    },
    showThirdOption: {
        type: ControlType.Boolean,
        title: "Show Third Option",
        defaultValue: true,
    },
    showPhases: {
        type: ControlType.Boolean,
        title: "Show Phases",
        defaultValue: true,
    },
    showDeliverables: {
        type: ControlType.Boolean,
        title: "Show Deliverables",
        defaultValue: true,
    },
    showWalkaway: {
        type: ControlType.Boolean,
        title: "Show Walkaway",
        defaultValue: true,
    },
    showRules: {
        type: ControlType.Boolean,
        title: "Show Rules",
        defaultValue: true,
    },
    showCredibility: {
        type: ControlType.Boolean,
        title: "Show Credibility",
        defaultValue: true,
    },
    showCTA: {
        type: ControlType.Boolean,
        title: "Show CTA",
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

export default AVADASPage
