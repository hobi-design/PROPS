// Navigation Menu — Framer Code Component for PROPS
// Responsive navbar with editable links, wordmark logo, and CTA buttons.
// Mobile: hamburger menu with slide-down drawer.

import { useState, useCallback, useEffect, useRef, type CSSProperties } from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { motion, AnimatePresence } from "framer-motion"

// ─── Types ──────────────────────────────────────────────────────────────────

interface NavLink {
    label: string
    url: string
}

interface NavigationMenuProps {
    // Logo
    showLogo: boolean
    logoText: string
    logoImage: string
    logoHeight: number
    logoUrl: string
    // Links
    linksText: string
    // Buttons
    sponsorLabel: string
    sponsorUrl: string
    submitLabel: string
    submitUrl: string
    showSponsor: boolean
    showSubmit: boolean
    // Colors
    backgroundColor: string
    textColor: string
    accentColor: string
    accentTextColor: string
    hoverColor: string
    borderColor: string
    // Typography
    linkFont: Record<string, any>
    buttonFont: Record<string, any>
    logoFont: Record<string, any>
    // Spacing
    navHeight: number
    navPadding: string
    linkGap: number
    // Border
    showBottomBorder: boolean
    borderRadius: string
    // Mobile
    mobileBreakpoint: number
    // Layout
    style?: CSSProperties
}

// ─── Link Parser ────────────────────────────────────────────────────────────

function parseLinks(raw: string): NavLink[] {
    if (!raw || !raw.trim()) return []
    return raw
        .replace(/\r\n/g, "\n")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
            const pipeIdx = line.indexOf("|")
            if (pipeIdx === -1) return { label: line, url: "#" }
            return {
                label: line.slice(0, pipeIdx).trim(),
                url: line.slice(pipeIdx + 1).trim() || "#",
            }
        })
}

// ─── Hamburger Icon ─────────────────────────────────────────────────────────

function HamburgerIcon({ isOpen, color }: { isOpen: boolean; color: string }) {
    return (
        <motion.svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "block" }}
        >
            <motion.line
                x1="3"
                y1="6"
                x2="19"
                y2="6"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                animate={isOpen ? { y1: 11, y2: 11, rotate: 45 } : { y1: 6, y2: 6, rotate: 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                style={{ transformOrigin: "center" }}
            />
            <motion.line
                x1="3"
                y1="11"
                x2="19"
                y2="11"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{ transformOrigin: "center" }}
            />
            <motion.line
                x1="3"
                y1="16"
                x2="19"
                y2="16"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                animate={isOpen ? { y1: 11, y2: 11, rotate: -45 } : { y1: 16, y2: 16, rotate: 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                style={{ transformOrigin: "center" }}
            />
        </motion.svg>
    )
}

// ─── Default PROPS Wordmark SVG ─────────────────────────────────────────────

function DefaultWordmark({ height, color }: { height: number; color: string }) {
    const aspectRatio = 3.6
    const w = height * aspectRatio
    return (
        <svg
            width={w}
            height={height}
            viewBox="0 0 360 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "block" }}
        >
            <text
                x="0"
                y="78"
                fill={color}
                fontFamily="'General Sans', 'Inter', system-ui, -apple-system, sans-serif"
                fontWeight="700"
                fontSize="90"
                letterSpacing="-3"
            >
                PROPS.
            </text>
        </svg>
    )
}

// ─── Nav Link Item ──────────────────────────────────────────────────────────

function NavLinkItem({
    link,
    textColor,
    hoverColor,
    linkFont,
    isMobile,
}: {
    link: NavLink
    textColor: string
    hoverColor: string
    linkFont: Record<string, any>
    isMobile: boolean
}) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <motion.a
            href={link.url}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            animate={{
                color: isHovered ? hoverColor : textColor,
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
                textDecoration: "none",
                color: textColor,
                position: "relative",
                padding: isMobile ? "14px 0" : "6px 2px",
                display: "block",
                cursor: "pointer",
                WebkitTapHighlightColor: "transparent",
                ...linkFont,
                ...(isMobile && { fontSize: "18px" }),
            }}
        >
            {link.label}
            {!isMobile && (
                <motion.span
                    style={{
                        position: "absolute",
                        bottom: 2,
                        left: 0,
                        right: 0,
                        height: 1.5,
                        backgroundColor: hoverColor,
                        borderRadius: 1,
                        transformOrigin: "left",
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                />
            )}
        </motion.a>
    )
}

// ─── CTA Button ─────────────────────────────────────────────────────────────

function CTAButton({
    label,
    url,
    variant,
    accentColor,
    accentTextColor,
    textColor,
    borderColor,
    buttonFont,
    isMobile,
}: {
    label: string
    url: string
    variant: "outline" | "filled"
    accentColor: string
    accentTextColor: string
    textColor: string
    borderColor: string
    buttonFont: Record<string, any>
    isMobile: boolean
}) {
    const [isHovered, setIsHovered] = useState(false)

    const isFilled = variant === "filled"

    const baseStyle: CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
        cursor: "pointer",
        borderRadius: 8,
        padding: isMobile ? "12px 24px" : "9px 18px",
        WebkitTapHighlightColor: "transparent",
        whiteSpace: "nowrap",
        transition: "box-shadow 0.2s ease",
        ...buttonFont,
        ...(isMobile && { fontSize: "15px", width: "100%" }),
    }

    return (
        <motion.a
            href={url}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            animate={{
                backgroundColor: isFilled
                    ? isHovered ? textColor : accentColor
                    : isHovered ? `${borderColor}18` : "transparent",
                color: isFilled
                    ? isHovered ? accentColor : accentTextColor
                    : textColor,
                scale: isHovered ? 1.02 : 1,
            }}
            transition={{
                duration: 0.25,
                ease: [0.4, 0, 0.2, 1],
                scale: { duration: 0.15 },
            }}
            style={{
                ...baseStyle,
                border: isFilled ? "none" : `1.5px solid ${borderColor}`,
                backgroundColor: isFilled ? accentColor : "transparent",
                color: isFilled ? accentTextColor : textColor,
            }}
        >
            {label}
        </motion.a>
    )
}

// ─── Main Component ─────────────────────────────────────────────────────────

/**
 * Navigation Menu
 *
 * Responsive navigation bar with editable links, wordmark logo,
 * and Sponsor/Submit CTA buttons.
 * Format for links: One per line, "Label | URL"
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function NavigationMenu(props: NavigationMenuProps) {
    const {
        showLogo = true,
        logoText = "PROPS.",
        logoImage = "",
        logoHeight = 28,
        logoUrl = "/",
        linksText = DEFAULT_LINKS,
        sponsorLabel = "Sponsor",
        sponsorUrl = "#sponsor",
        submitLabel = "Submit",
        submitUrl = "#submit",
        showSponsor = true,
        showSubmit = true,
        backgroundColor = "#FFFFFF",
        textColor = "#000000",
        accentColor = "#9FE870",
        accentTextColor = "#173401",
        hoverColor = "#9FE870",
        borderColor = "#E0E0E0",
        linkFont,
        buttonFont,
        logoFont,
        navHeight = 64,
        navPadding = "0px 28px",
        linkGap = 28,
        showBottomBorder = true,
        borderRadius = "0px",
        mobileBreakpoint = 810,
        style,
    } = props

    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const links = parseLinks(linksText)

    // Responsive detection
    useEffect(() => {
        if (RenderTarget.current() !== RenderTarget.preview) {
            setIsMobile(false)
            return
        }
        const check = () => {
            setIsMobile(window.innerWidth < mobileBreakpoint)
        }
        check()
        window.addEventListener("resize", check)
        return () => window.removeEventListener("resize", check)
    }, [mobileBreakpoint])

    // Close mobile menu on route change / escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsMobileOpen(false)
        }
        window.addEventListener("keydown", handleEsc)
        return () => window.removeEventListener("keydown", handleEsc)
    }, [])

    const toggleMobile = useCallback(() => {
        setIsMobileOpen((prev) => !prev)
    }, [])

    // ── Desktop Layout ──────────────────────────────────────────────────

    const desktopNav = (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: navHeight,
                padding: navPadding,
                width: "100%",
                boxSizing: "border-box",
            }}
        >
            {/* Left: Logo */}
            <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                {showLogo && (
                    <a
                        href={logoUrl}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            textDecoration: "none",
                            cursor: "pointer",
                        }}
                    >
                        {logoImage ? (
                            <img
                                src={logoImage}
                                alt={logoText || "Logo"}
                                style={{
                                    height: logoHeight,
                                    width: "auto",
                                    display: "block",
                                }}
                            />
                        ) : (
                            <span
                                style={{
                                    color: textColor,
                                    fontWeight: 700,
                                    fontSize: logoHeight * 0.82,
                                    letterSpacing: "-0.03em",
                                    lineHeight: 1,
                                    whiteSpace: "nowrap",
                                    ...logoFont,
                                }}
                            >
                                {logoText}
                            </span>
                        )}
                    </a>
                )}
            </div>

            {/* Center: Links */}
            <nav
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: linkGap,
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                }}
            >
                {links.map((link, i) => (
                    <NavLinkItem
                        key={`${link.label}-${i}`}
                        link={link}
                        textColor={textColor}
                        hoverColor={hoverColor}
                        linkFont={linkFont || {}}
                        isMobile={false}
                    />
                ))}
            </nav>

            {/* Right: CTA Buttons */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    flexShrink: 0,
                }}
            >
                {showSponsor && (
                    <CTAButton
                        label={sponsorLabel}
                        url={sponsorUrl}
                        variant="outline"
                        accentColor={accentColor}
                        accentTextColor={accentTextColor}
                        textColor={textColor}
                        borderColor={borderColor}
                        buttonFont={buttonFont || {}}
                        isMobile={false}
                    />
                )}
                {showSubmit && (
                    <CTAButton
                        label={submitLabel}
                        url={submitUrl}
                        variant="filled"
                        accentColor={accentColor}
                        accentTextColor={accentTextColor}
                        textColor={textColor}
                        borderColor={borderColor}
                        buttonFont={buttonFont || {}}
                        isMobile={false}
                    />
                )}
            </div>
        </div>
    )

    // ── Mobile Layout ───────────────────────────────────────────────────

    const mobileNav = (
        <>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: navHeight,
                    padding: navPadding,
                    width: "100%",
                    boxSizing: "border-box",
                }}
            >
                {/* Logo */}
                <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                    {showLogo && (
                        <a
                            href={logoUrl}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                textDecoration: "none",
                                cursor: "pointer",
                            }}
                        >
                            {logoImage ? (
                                <img
                                    src={logoImage}
                                    alt={logoText || "Logo"}
                                    style={{
                                        height: logoHeight * 0.85,
                                        width: "auto",
                                        display: "block",
                                    }}
                                />
                            ) : (
                                <span
                                    style={{
                                        color: textColor,
                                        fontWeight: 700,
                                        fontSize: logoHeight * 0.72,
                                        letterSpacing: "-0.03em",
                                        lineHeight: 1,
                                        whiteSpace: "nowrap",
                                        ...logoFont,
                                    }}
                                >
                                    {logoText}
                                </span>
                            )}
                        </a>
                    )}
                </div>

                {/* Hamburger */}
                <button
                    onClick={toggleMobile}
                    aria-label={isMobileOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isMobileOpen}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 44,
                        height: 44,
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        padding: 0,
                        WebkitTapHighlightColor: "transparent",
                        outline: "none",
                    }}
                >
                    <HamburgerIcon isOpen={isMobileOpen} color={textColor} />
                </button>
            </div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        key="mobile-drawer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                            height: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
                            opacity: { duration: 0.25, ease: "easeOut" },
                        }}
                        style={{
                            overflow: "hidden",
                            borderTop: `1px solid ${borderColor}`,
                        }}
                    >
                        <motion.nav
                            initial={{ y: -8 }}
                            animate={{ y: 0 }}
                            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1], delay: 0.05 }}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                padding: "12px 28px 24px",
                                gap: 0,
                            }}
                        >
                            {links.map((link, i) => (
                                <motion.div
                                    key={`${link.label}-${i}`}
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.25,
                                        ease: "easeOut",
                                        delay: 0.06 * i,
                                    }}
                                    style={{
                                        borderBottom:
                                            i < links.length - 1
                                                ? `1px solid ${borderColor}22`
                                                : "none",
                                    }}
                                >
                                    <NavLinkItem
                                        link={link}
                                        textColor={textColor}
                                        hoverColor={hoverColor}
                                        linkFont={linkFont || {}}
                                        isMobile={true}
                                    />
                                </motion.div>
                            ))}

                            {/* Mobile CTA Buttons */}
                            {(showSponsor || showSubmit) && (
                                <motion.div
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.25,
                                        ease: "easeOut",
                                        delay: 0.06 * links.length,
                                    }}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 10,
                                        marginTop: 16,
                                    }}
                                >
                                    {showSponsor && (
                                        <CTAButton
                                            label={sponsorLabel}
                                            url={sponsorUrl}
                                            variant="outline"
                                            accentColor={accentColor}
                                            accentTextColor={accentTextColor}
                                            textColor={textColor}
                                            borderColor={borderColor}
                                            buttonFont={buttonFont || {}}
                                            isMobile={true}
                                        />
                                    )}
                                    {showSubmit && (
                                        <CTAButton
                                            label={submitLabel}
                                            url={submitUrl}
                                            variant="filled"
                                            accentColor={accentColor}
                                            accentTextColor={accentTextColor}
                                            textColor={textColor}
                                            borderColor={borderColor}
                                            buttonFont={buttonFont || {}}
                                            isMobile={true}
                                        />
                                    )}
                                </motion.div>
                            )}
                        </motion.nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )

    // ── Render ───────────────────────────────────────────────────────────

    return (
        <div
            ref={containerRef}
            style={{
                position: "relative",
                width: "100%",
                backgroundColor,
                borderBottom: showBottomBorder ? `1px solid ${borderColor}` : "none",
                borderRadius,
                ...style,
            }}
        >
            {isMobile ? mobileNav : desktopNav}
        </div>
    )
}

// ─── Default Links ──────────────────────────────────────────────────────────

const DEFAULT_LINKS = `Sections | /sections
Pricing | /pricing
Blog | /blog
Roadmap | /roadmap`

// ─── Property Controls ──────────────────────────────────────────────────────

addPropertyControls(NavigationMenu, {
    // ── Logo ─────────────────────────────
    showLogo: {
        type: ControlType.Boolean,
        title: "Show Logo",
        defaultValue: true,
        enabledTitle: "Yes",
        disabledTitle: "No",
    },
    logoText: {
        type: ControlType.String,
        title: "Logo Text",
        defaultValue: "PROPS.",
        hidden: (props) => !props.showLogo,
    },
    logoImage: {
        type: ControlType.Image,
        title: "Logo Image",
        hidden: (props) => !props.showLogo,
    },
    logoHeight: {
        type: ControlType.Number,
        title: "Logo Height",
        defaultValue: 28,
        min: 16,
        max: 60,
        step: 1,
        hidden: (props) => !props.showLogo,
    },
    logoUrl: {
        type: ControlType.String,
        title: "Logo Link",
        defaultValue: "/",
        hidden: (props) => !props.showLogo,
    },

    // ── Links ────────────────────────────
    linksText: {
        type: ControlType.String,
        title: "Nav Links",
        displayTextArea: true,
        defaultValue: DEFAULT_LINKS,
        description: "One link per line. Format: Label | URL",
    },

    // ── Buttons ──────────────────────────
    showSponsor: {
        type: ControlType.Boolean,
        title: "Sponsor Btn",
        defaultValue: true,
        enabledTitle: "Show",
        disabledTitle: "Hide",
    },
    sponsorLabel: {
        type: ControlType.String,
        title: "Sponsor Text",
        defaultValue: "Sponsor",
        hidden: (props) => !props.showSponsor,
    },
    sponsorUrl: {
        type: ControlType.String,
        title: "Sponsor URL",
        defaultValue: "#sponsor",
        hidden: (props) => !props.showSponsor,
    },
    showSubmit: {
        type: ControlType.Boolean,
        title: "Submit Btn",
        defaultValue: true,
        enabledTitle: "Show",
        disabledTitle: "Hide",
    },
    submitLabel: {
        type: ControlType.String,
        title: "Submit Text",
        defaultValue: "Submit",
        hidden: (props) => !props.showSubmit,
    },
    submitUrl: {
        type: ControlType.String,
        title: "Submit URL",
        defaultValue: "#submit",
        hidden: (props) => !props.showSubmit,
    },

    // ── Colors ───────────────────────────
    backgroundColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#FFFFFF",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#000000",
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "#9FE870",
    },
    accentTextColor: {
        type: ControlType.Color,
        title: "Accent Text",
        defaultValue: "#173401",
    },
    hoverColor: {
        type: ControlType.Color,
        title: "Hover Color",
        defaultValue: "#9FE870",
    },
    borderColor: {
        type: ControlType.Color,
        title: "Border Color",
        defaultValue: "#E0E0E0",
    },

    // ── Typography ───────────────────────
    linkFont: {
        type: ControlType.Font,
        title: "Link Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: {
            fontSize: "14px",
            variant: "Medium",
            letterSpacing: "-0.01em",
            lineHeight: "1em",
        },
    },
    buttonFont: {
        type: ControlType.Font,
        title: "Button Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: {
            fontSize: "14px",
            variant: "Semibold",
            letterSpacing: "-0.01em",
            lineHeight: "1em",
        },
    },
    logoFont: {
        type: ControlType.Font,
        title: "Logo Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: {
            fontSize: "22px",
            variant: "Bold",
            letterSpacing: "-0.03em",
            lineHeight: "1em",
        },
        hidden: (props) => !props.showLogo || !!props.logoImage,
    },

    // ── Layout ───────────────────────────
    navHeight: {
        type: ControlType.Number,
        title: "Nav Height",
        defaultValue: 64,
        min: 40,
        max: 100,
        step: 1,
    },
    navPadding: {
        type: ControlType.Padding,
        title: "Padding",
        defaultValue: "0px 28px",
    },
    linkGap: {
        type: ControlType.Number,
        title: "Link Gap",
        defaultValue: 28,
        min: 8,
        max: 60,
        step: 1,
    },
    showBottomBorder: {
        type: ControlType.Boolean,
        title: "Bottom Border",
        defaultValue: true,
        enabledTitle: "Show",
        disabledTitle: "Hide",
    },
    borderRadius: {
        type: ControlType.BorderRadius,
        title: "Radius",
        defaultValue: "0px",
    },
    mobileBreakpoint: {
        type: ControlType.Number,
        title: "Mobile At",
        defaultValue: 810,
        min: 320,
        max: 1200,
        step: 10,
        description: "Width (px) below which mobile layout activates.",
    },
})
