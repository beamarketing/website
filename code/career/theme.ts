// Shared types and constants for the Beamr Careers page

export const COLORS = {
    darkNavy: "#000737",
    fullBlue: "#3751FF",
    accentBlue: "#0099FF",
    lightLavender: "#EAEBFF",
    white: "#FFFFFF",
    darkBg: "#080E1F",
    muted: "#8896AB",
    darkText: "#1E293B",
}

export interface FontConfig {
    heading: string
    body: string
    mono: string
    heroHeadlineSize: number
    heroSubheadlineSize: number
    sectionHeadlineSize: number
    signalHeadlineSize: number
    roleTitleSize: number
    bodySize: number
    statNumberSize: number
    labelSize: number
    ctaButtonSize: number
}

export interface Role {
    title: string
    department: string
    location: string
    url: string
}

export const DEFAULT_ROLES: Role[] = [
    { title: "Senior Video Codec Engineer", department: "Engineering", location: "Tel Aviv", url: "#" },
    { title: "GPU Systems Engineer", department: "Engineering", location: "Tel Aviv", url: "#" },
    { title: "Perceptual Quality Researcher", department: "Research", location: "Tel Aviv", url: "#" },
    { title: "Full-Stack Engineer", department: "Engineering", location: "Tel Aviv", url: "#" },
    { title: "Algorithm Developer — Video", department: "Engineering", location: "Tel Aviv", url: "#" },
    { title: "Data Engineer", department: "Engineering", location: "Tel Aviv", url: "#" },
    { title: "Director of Product", department: "Product", location: "Tel Aviv", url: "#" },
    { title: "Product Manager — AV & ML", department: "Product", location: "Remote", url: "#" },
    { title: "VidOps Engineer", department: "Operations", location: "Remote", url: "#" },
    { title: "Technical Account Manager", department: "Operations", location: "Remote", url: "#" },
]

export const DEFAULT_FONTS: FontConfig = {
    heading: "'Poppins', 'Inter', sans-serif",
    body: "'Inter', 'Poppins', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
    heroHeadlineSize: 130,
    heroSubheadlineSize: 18,
    sectionHeadlineSize: 28,
    signalHeadlineSize: 22,
    roleTitleSize: 16,
    bodySize: 14,
    statNumberSize: 28,
    labelSize: 11,
    ctaButtonSize: 14,
}
