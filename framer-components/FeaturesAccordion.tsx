// Features Accordion — Framer Code Component for PROPS
// Parses a single plain-text CMS field into accordion items.
// Format: Each feature separated by double newlines.
// First line of each block = title, remaining lines = description.

import {
    useState,
    useMemo,
    useCallback,
    startTransition,
    type CSSProperties,
} from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { motion, AnimatePresence } from "framer-motion"

// ─── Types ──────────────────────────────────────────────────────────────────

interface ParsedFeature {
    title: string
    description: string
}

interface FeaturesAccordionProps {
    // CMS
    featuresText: string
    sectionTitle: string
    // Behavior
    allowMultiple: boolean
    defaultOpenIndex: number
    // Style
    backgroundColor: string
    titleColor: string
    descriptionColor: string
    borderColor: string
    iconColor: string
    headingFont: Record<string, any>
    titleFont: Record<string, any>
    descriptionFont: Record<string, any>
    borderRadius: string
    itemPadding: string
    // Layout
    style?: CSSProperties
}

// ─── Parser ─────────────────────────────────────────────────────────────────

function parseFeatures(raw: string): ParsedFeature[] {
    if (!raw || !raw.trim()) return []

    // Split on double newlines (handles \r\n and \n)
    const blocks = raw
        .replace(/\r\n/g, "\n")
        .split(/\n\s*\n/)
        .map((b) => b.trim())
        .filter(Boolean)

    return blocks.map((block) => {
        const lines = block.split("\n").map((l) => l.trim())
        const title = lines[0] || "Untitled"
        const description = lines.slice(1).join("\n").trim()
        return { title, description }
    })
}

// ─── Accordion Item ─────────────────────────────────────────────────────────

interface AccordionItemProps {
    feature: ParsedFeature
    isOpen: boolean
    onToggle: () => void
    titleColor: string
    descriptionColor: string
    borderColor: string
    iconColor: string
    titleFont: Record<string, any>
    descriptionFont: Record<string, any>
    itemPadding: string
    isLast: boolean
}

function AccordionItem({
    feature,
    isOpen,
    onToggle,
    titleColor,
    descriptionColor,
    borderColor,
    iconColor,
    titleFont,
    descriptionFont,
    itemPadding,
    isLast,
}: AccordionItemProps) {
    return (
        <div
            style={{
                borderBottom: isLast ? "none" : `1px solid ${borderColor}`,
                overflow: "hidden",
            }}
        >
            <button
                onClick={onToggle}
                aria-expanded={isOpen}
                style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: itemPadding,
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    outline: "none",
                    WebkitTapHighlightColor: "transparent",
                }}
            >
                <span
                    style={{
                        color: titleColor,
                        margin: 0,
                        flex: 1,
                        ...titleFont,
                    }}
                >
                    {feature.title}
                </span>

                {/* Icon: + / × */}
                <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 28,
                        height: 28,
                        flexShrink: 0,
                        color: iconColor,
                        fontSize: 22,
                        fontWeight: 300,
                        lineHeight: 1,
                        userSelect: "none",
                    }}
                >
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M9 1V17M1 9H17"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                    </svg>
                </motion.span>
            </button>

            {/* Expandable content */}
            <AnimatePresence initial={false}>
                {isOpen && feature.description && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                            height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                            opacity: { duration: 0.25, ease: "easeOut" },
                        }}
                        style={{ overflow: "hidden" }}
                    >
                        <div
                            style={{
                                padding: `0 ${itemPadding.split(" ").pop()} 20px`,
                                paddingLeft: itemPadding.split(" ").length > 1
                                    ? itemPadding.split(" ")[itemPadding.split(" ").length > 3 ? 3 : 1]
                                    : itemPadding.split(" ")[0],
                            }}
                        >
                            <p
                                style={{
                                    margin: 0,
                                    color: descriptionColor,
                                    whiteSpace: "pre-wrap",
                                    ...descriptionFont,
                                }}
                            >
                                {feature.description}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// ─── Main Component ─────────────────────────────────────────────────────────

/**
 * Features Accordion
 *
 * Parses a single plain-text field into accordion items.
 * Separate each feature with a blank line.
 * First line = title, remaining lines = description.
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function FeaturesAccordion(props: FeaturesAccordionProps) {
    const {
        featuresText = DEFAULT_FEATURES,
        sectionTitle = "Features",
        allowMultiple = false,
        defaultOpenIndex = 0,
        backgroundColor = "#FFFFFF",
        titleColor = "#111111",
        descriptionColor = "#555555",
        borderColor = "#E5E5E5",
        iconColor = "#888888",
        headingFont,
        titleFont,
        descriptionFont,
        borderRadius = "0px",
        itemPadding = "18px 4px",
        style,
    } = props

    const features = useMemo(
        () => parseFeatures(featuresText),
        [featuresText]
    )

    const [openIndices, setOpenIndices] = useState<Set<number>>(() => {
        const initial = new Set<number>()
        if (defaultOpenIndex >= 0 && defaultOpenIndex < 100) {
            initial.add(defaultOpenIndex)
        }
        return initial
    })

    const handleToggle = useCallback(
        (index: number) => {
            startTransition(() => {
                setOpenIndices((prev) => {
                    const next = new Set(prev)
                    if (next.has(index)) {
                        next.delete(index)
                    } else {
                        if (!allowMultiple) {
                            next.clear()
                        }
                        next.add(index)
                    }
                    return next
                })
            })
        },
        [allowMultiple]
    )

    const isFixedWidth = style && style.width === "100%"

    if (!features.length) {
        return (
            <div
                style={{
                    ...style,
                    padding: 40,
                    color: descriptionColor,
                    textAlign: "center",
                    ...descriptionFont,
                }}
            >
                No features found. Add text in the format:
                <br />
                <code style={{ fontSize: 12, opacity: 0.6 }}>
                    Title\n Description\n\n Title\n Description
                </code>
            </div>
        )
    }

    return (
        <div
            style={{
                position: "relative",
                width: isFixedWidth ? "100%" : "auto",
                backgroundColor,
                borderRadius,
                overflow: "hidden",
                ...style,
            }}
        >
            {/* Section heading */}
            {sectionTitle && (
                <h3
                    style={{
                        margin: 0,
                        marginBottom: 12,
                        color: titleColor,
                        ...headingFont,
                    }}
                >
                    {sectionTitle}
                </h3>
            )}

            {/* Accordion list */}
            <div
                style={{
                    borderTop: `1px solid ${borderColor}`,
                }}
            >
                {features.map((feature, i) => (
                    <AccordionItem
                        key={`${feature.title}-${i}`}
                        feature={feature}
                        isOpen={openIndices.has(i)}
                        onToggle={() => handleToggle(i)}
                        titleColor={titleColor}
                        descriptionColor={descriptionColor}
                        borderColor={borderColor}
                        iconColor={iconColor}
                        titleFont={titleFont}
                        descriptionFont={descriptionFont}
                        itemPadding={itemPadding}
                        isLast={i === features.length - 1}
                    />
                ))}
            </div>
        </div>
    )
}

// ─── Default content ────────────────────────────────────────────────────────

const DEFAULT_FEATURES = `Responsive Grid
Set 2–6 columns on desktop, 1–3 on mobile with separate column and gap controls for each breakpoint.

Aspect Ratio Control
Choose from Auto, Square (1:1), Portrait (2:3), Landscape (3:2), or Widescreen (16:9) for consistent image sizing.

Caption Options
Display captions as a hover overlay or below the image, with independent font size and alignment controls.

Mobile Swipe Mode
Converts the grid into a horizontal carousel on mobile with pagination dots — perfect for product showcases.

Customizable Spacing
Independent grid gap and section padding for desktop and mobile, giving you full control over layout density.

Color Controls
Background color, caption color, and overlay color with opacity — match any theme without editing code.

Link Support
Each image block can link to any URL. Includes a subtle hover zoom for visual feedback.

Theme-Agnostic
Uses CSS custom properties for max-width. No theme-specific selectors — works with Dawn, Sense, Craft, and more.

No Dependencies
Pure CSS and minimal vanilla JavaScript for swipe dots. No external libraries or app installs required.

Accessible
Semantic HTML with proper image attributes and ARIA labels on all interactive elements.`

// ─── Property Controls ──────────────────────────────────────────────────────

addPropertyControls(FeaturesAccordion, {
    featuresText: {
        type: ControlType.String,
        title: "Features Text",
        displayTextArea: true,
        defaultValue: DEFAULT_FEATURES,
        description:
            "One feature per block. Separate blocks with a blank line. First line = title, rest = description.",
    },
    sectionTitle: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "Features",
    },
    allowMultiple: {
        type: ControlType.Boolean,
        title: "Multi-open",
        defaultValue: false,
        enabledTitle: "Yes",
        disabledTitle: "No",
    },
    defaultOpenIndex: {
        type: ControlType.Number,
        title: "Default Open",
        defaultValue: 0,
        min: -1,
        max: 30,
        step: 1,
        description: "Index of the item open by default (-1 for none).",
    },
    backgroundColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#FFFFFF",
    },
    titleColor: {
        type: ControlType.Color,
        title: "Title Color",
        defaultValue: "#111111",
    },
    descriptionColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#555555",
    },
    borderColor: {
        type: ControlType.Color,
        title: "Border Color",
        defaultValue: "#E5E5E5",
    },
    iconColor: {
        type: ControlType.Color,
        title: "Icon Color",
        defaultValue: "#888888",
    },
    headingFont: {
        type: ControlType.Font,
        title: "Heading Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: {
            fontSize: "28px",
            variant: "Bold",
            letterSpacing: "-0.03em",
            lineHeight: "1.2em",
        },
    },
    titleFont: {
        type: ControlType.Font,
        title: "Title Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: {
            fontSize: "16px",
            variant: "Semibold",
            letterSpacing: "-0.01em",
            lineHeight: "1.3em",
        },
    },
    descriptionFont: {
        type: ControlType.Font,
        title: "Body Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: {
            fontSize: "14px",
            variant: "Regular",
            letterSpacing: "0em",
            lineHeight: "1.6em",
        },
    },
    borderRadius: {
        type: ControlType.BorderRadius,
        title: "Radius",
        defaultValue: "0px",
    },
    itemPadding: {
        type: ControlType.Padding,
        title: "Item Padding",
        defaultValue: "18px 4px",
    },
})
