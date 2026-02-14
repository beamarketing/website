// Shared navigation menu data
// Edit this file to update the navigation across ALL pages at once.
// Individual page instances can still override via Framer property controls.

export interface DropdownItem {
    title: string
    description: string
    url: string
}

export interface NavLinkData {
    label: string
    url: string
    hasDropdown: boolean
    col1Label: string
    col1Items: DropdownItem[]
    col2Label: string
    col2Items: DropdownItem[]
    showFeatured: boolean
    featuredBadge: string
    featuredTitle: string
    featuredLinkText: string
    featuredLinkUrl: string
    featuredImage: string
}

export const defaultNavLinks: NavLinkData[] = [
    {
        label: "Solutions",
        url: "#solutions",
        hasDropdown: true,
        col1Label: "INDUSTRIES",
        col1Items: [
            {
                title: "Media & Entertainment",
                description:
                    "Cut CDN & storage costs 30-50% while keeping broadcast quality.",
                url: "#media",
            },
            {
                title: "AI / Machine Learning",
                description:
                    "Smarter vision AI pipelines with guaranteed compression.",
                url: "#ai",
            },
            {
                title: "Autonomous Vehicles",
                description:
                    "50% storage reduction with ML-safe compression for training data.",
                url: "#automotive",
            },
            {
                title: "Sports Streaming",
                description:
                    "720p to 4K Super Resolution without doubling file size.",
                url: "#sports",
            },
        ],
        col2Label: "USE CASES",
        col2Items: [
            {
                title: "Reduce CDN Costs",
                description:
                    "Deliver same visual quality at significantly lower bitrates.",
                url: "#cdn",
            },
            {
                title: "Improve Quality",
                description:
                    "Enhance visual quality while maintaining or reducing file size.",
                url: "#quality",
            },
            {
                title: "Optimize Storage",
                description:
                    "Reduce storage requirements by up to 50% without quality loss.",
                url: "#storage",
            },
            {
                title: "4K Upscaling",
                description:
                    "Upscale legacy content to 4K resolution efficiently.",
                url: "#upscaling",
            },
        ],
        showFeatured: true,
        featuredBadge: "CASE STUDY",
        featuredTitle:
            "Netflix Achieves 40% CDN Savings with CABR Technology",
        featuredLinkText: "Read Case Study",
        featuredLinkUrl: "#case-study",
        featuredImage: "",
    },
    {
        label: "Products",
        url: "#products",
        hasDropdown: true,
        col1Label: "PRODUCTS",
        col1Items: [],
        col2Label: "",
        col2Items: [],
        showFeatured: false,
        featuredBadge: "",
        featuredTitle: "",
        featuredLinkText: "",
        featuredLinkUrl: "",
        featuredImage: "",
    },
    {
        label: "Technology",
        url: "#technology",
        hasDropdown: false,
        col1Label: "",
        col1Items: [],
        col2Label: "",
        col2Items: [],
        showFeatured: false,
        featuredBadge: "",
        featuredTitle: "",
        featuredLinkText: "",
        featuredLinkUrl: "",
        featuredImage: "",
    },
    {
        label: "Blog",
        url: "#blog",
        hasDropdown: false,
        col1Label: "",
        col1Items: [],
        col2Label: "",
        col2Items: [],
        showFeatured: false,
        featuredBadge: "",
        featuredTitle: "",
        featuredLinkText: "",
        featuredLinkUrl: "",
        featuredImage: "",
    },
    {
        label: "Company",
        url: "#company",
        hasDropdown: false,
        col1Label: "",
        col1Items: [],
        col2Label: "",
        col2Items: [],
        showFeatured: false,
        featuredBadge: "",
        featuredTitle: "",
        featuredLinkText: "",
        featuredLinkUrl: "",
        featuredImage: "",
    },
]

export const defaultCtaText = "Let's Talk"
export const defaultCtaUrl = "#contact"
