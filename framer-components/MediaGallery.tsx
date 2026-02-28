// Media Gallery — Framer Code Component for PROPS
// Responsive gallery with main display + sidebar (thumbs + metadata).
// Desktop/Tablet: 70% main / 30% sidebar. Mobile: stacked.
// Supports images and videos via direct URLs in a plain text field.

import {
    useState,
    useEffect,
    useRef,
    useCallback,
    type CSSProperties,
} from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { motion, AnimatePresence } from "framer-motion"

// ─── Types ──────────────────────────────────────────────────────────────────

interface MediaItem {
    url: string
    type: "image" | "video"
}

interface MediaGalleryProps {
    mediaUrls: string
    tags: string
    category: string
    lastUpdated: string
    addedOn: string
    contactLink: string
    shareUrl: string
    mobileBreakpoint: number
    transitionDuration: number
    thumbActiveBorderColor: string
    thumbInactiveBorderColor: string
    gap: number
    mobileGap: number
    thumbGap: number
    mainShadow: string
    thumbShadow: string
    thumbPosition: "Left" | "Right"
    metaFontFamily: string
    metaFontColor: string
    metaLabelColor: string
    tagBg: string
    tagColor: string
    accentColor: string
    style?: CSSProperties
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const VIDEO_EXTENSIONS = [
    ".mp4",
    ".webm",
    ".ogg",
    ".mov",
    ".m4v",
    ".avi",
    ".mkv",
]

function detectMediaType(url: string): "image" | "video" {
    try {
        const pathname = new URL(url).pathname.toLowerCase()
        if (VIDEO_EXTENSIONS.some((ext) => pathname.endsWith(ext)))
            return "video"
    } catch {
        const lower = url.toLowerCase()
        if (VIDEO_EXTENSIONS.some((ext) => lower.includes(ext))) return "video"
    }
    return "image"
}

function parseMediaUrls(raw: string): MediaItem[] {
    if (!raw || !raw.trim()) return []
    return raw
        .replace(/\r\n/g, "\n")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(0, 5)
        .map((url) => ({
            url,
            type: detectMediaType(url),
        }))
}

function parseCommaSeparated(raw: string): string[] {
    if (!raw || !raw.trim()) return []
    return raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
}

function formatDate(raw: string): string {
    if (!raw || !raw.trim()) return ""
    try {
        const d = new Date(raw)
        if (isNaN(d.getTime())) return raw
        return d.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
    } catch {
        return raw
    }
}

// ─── Placeholder Data ───────────────────────────────────────────────────────

const PLACEHOLDER_URLS = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80",
    "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1200&q=80",
    "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1200&q=80",
].join("\n")

// ─── SVG Icons ──────────────────────────────────────────────────────────────

function TwitterIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    )
}

function FacebookIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    )
}

function LinkedInIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    )
}

function FlagIcon() {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <line x1="4" y1="22" x2="4" y2="15" />
        </svg>
    )
}

// ─── Divider ────────────────────────────────────────────────────────────────

function Divider({ color }: { color: string }) {
    return (
        <div
            style={{
                width: "100%",
                height: 1,
                background: `${color}22`,
                flexShrink: 0,
            }}
        />
    )
}

// ─── Metadata Panel ─────────────────────────────────────────────────────────

function MetadataPanel({
    tags,
    category,
    lastUpdated,
    addedOn,
    contactLink,
    shareUrl,
    fontFamily,
    fontColor,
    labelColor,
    tagBg,
    tagColor,
    accentColor,
}: {
    tags: string[]
    category: string
    lastUpdated: string
    addedOn: string
    contactLink: string
    shareUrl: string
    fontFamily: string
    fontColor: string
    labelColor: string
    tagBg: string
    tagColor: string
    accentColor: string
}) {
    const encodedUrl = encodeURIComponent(shareUrl)
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}`
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`

    const labelStyle: CSSProperties = {
        fontSize: 11,
        fontWeight: 600,
        color: labelColor,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        marginBottom: 6,
        fontFamily,
    }

    const valueStyle: CSSProperties = {
        fontSize: 13,
        color: fontColor,
        fontFamily,
        lineHeight: 1.4,
    }

    const tagStyle: CSSProperties = {
        display: "inline-block",
        padding: "6px 12px",
        fontSize: 11,
        fontWeight: 500,
        fontFamily,
        color: tagColor,
        background: tagBg,
        borderRadius: 4,
    }

    const iconBtnStyle: CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 36,
        height: 36,
        borderRadius: 8,
        border: `1px solid ${labelColor}33`,
        background: `${labelColor}08`,
        color: fontColor,
        cursor: "pointer",
        padding: 0,
        transition: "all 0.2s ease",
    }

    const hasAnyMeta =
        lastUpdated || addedOn || tags.length > 0 || category

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
            }}
        >
            {/* Date fields row */}
            {(lastUpdated || addedOn) && (
                <div
                    style={{
                        display: "flex",
                        gap: 20,
                    }}
                >
                    {lastUpdated && (
                        <div style={{ flex: 1 }}>
                            <div style={labelStyle}>Last Updated</div>
                            <div style={valueStyle}>
                                {formatDate(lastUpdated)}
                            </div>
                        </div>
                    )}
                    {addedOn && (
                        <div style={{ flex: 1 }}>
                            <div style={labelStyle}>Added</div>
                            <div style={valueStyle}>
                                {formatDate(addedOn)}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Category */}
            {category && (
                <div>
                    <div style={labelStyle}>Category</div>
                    <div style={valueStyle}>{category}</div>
                </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
                <div>
                    <div style={labelStyle}>Tags</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {tags.map((tag, i) => (
                            <span key={`tag-${i}`} style={tagStyle}>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Divider before report + share */}
            <Divider color={labelColor} />

            {/* Report + Share row */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                }}
            >
                {/* Report an Issue */}
                <a
                    href={contactLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 12,
                        fontWeight: 500,
                        fontFamily,
                        color: fontColor,
                        textDecoration: "none",
                        opacity: 0.7,
                        transition: "opacity 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                        ;(e.currentTarget as HTMLElement).style.opacity = "1"
                    }}
                    onMouseLeave={(e) => {
                        ;(e.currentTarget as HTMLElement).style.opacity = "0.7"
                    }}
                >
                    <FlagIcon />
                    Report an Issue
                </a>

                {/* Share icons */}
                <div style={{ display: "flex", gap: 8 }}>
                    <a
                        href={twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={iconBtnStyle}
                        aria-label="Share on Twitter"
                        onMouseEnter={(e) => {
                            const el = e.currentTarget as HTMLElement
                            el.style.background = accentColor
                            el.style.borderColor = accentColor
                            el.style.color = "#ffffff"
                        }}
                        onMouseLeave={(e) => {
                            const el = e.currentTarget as HTMLElement
                            el.style.background = `${labelColor}08`
                            el.style.borderColor = `${labelColor}33`
                            el.style.color = fontColor
                        }}
                    >
                        <TwitterIcon />
                    </a>
                    <a
                        href={facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={iconBtnStyle}
                        aria-label="Share on Facebook"
                        onMouseEnter={(e) => {
                            const el = e.currentTarget as HTMLElement
                            el.style.background = accentColor
                            el.style.borderColor = accentColor
                            el.style.color = "#ffffff"
                        }}
                        onMouseLeave={(e) => {
                            const el = e.currentTarget as HTMLElement
                            el.style.background = `${labelColor}08`
                            el.style.borderColor = `${labelColor}33`
                            el.style.color = fontColor
                        }}
                    >
                        <FacebookIcon />
                    </a>
                    <a
                        href={linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={iconBtnStyle}
                        aria-label="Share on LinkedIn"
                        onMouseEnter={(e) => {
                            const el = e.currentTarget as HTMLElement
                            el.style.background = accentColor
                            el.style.borderColor = accentColor
                            el.style.color = "#ffffff"
                        }}
                        onMouseLeave={(e) => {
                            const el = e.currentTarget as HTMLElement
                            el.style.background = `${labelColor}08`
                            el.style.borderColor = `${labelColor}33`
                            el.style.color = fontColor
                        }}
                    >
                        <LinkedInIcon />
                    </a>
                </div>
            </div>
        </div>
    )
}

// ─── Component ──────────────────────────────────────────────────────────────

/**
 * Media Gallery
 *
 * Responsive image/video gallery with thumbnail grid + metadata sidebar.
 * Desktop/Tablet: 70% main / 30% sidebar (thumbs grid + meta).
 * Mobile: stacked — main on top, thumbs row, then meta below.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function MediaGallery(props: MediaGalleryProps) {
    const {
        mediaUrls = PLACEHOLDER_URLS,
        tags = "Gallery, Grid, Images",
        category = "Gallery",
        lastUpdated = "",
        addedOn = "",
        contactLink = "/contact",
        shareUrl = "",
        mobileBreakpoint = 810,
        transitionDuration = 0.4,
        thumbActiveBorderColor = "#000000",
        thumbInactiveBorderColor = "transparent",
        gap = 12,
        mobileGap = 8,
        thumbGap = 8,
        mainShadow = "none",
        thumbShadow = "none",
        thumbPosition = "Right" as const,
        metaFontFamily = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        metaFontColor = "#1a1a1a",
        metaLabelColor = "#888888",
        tagBg = "#f0f0f0",
        tagColor = "#333333",
        accentColor = "#9FE870",
        style,
    } = props

    const [activeIndex, setActiveIndex] = useState(0)
    const [isMobile, setIsMobile] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const items = parseMediaUrls(mediaUrls)
    const parsedTags = parseCommaSeparated(tags)

    // Resolve share URL — use provided or fall back to current page
    const resolvedShareUrl =
        shareUrl || (typeof window !== "undefined" ? window.location.href : "")

    // Clamp active index when items change
    useEffect(() => {
        if (activeIndex >= items.length && items.length > 0) {
            setActiveIndex(0)
        }
    }, [items.length, activeIndex])

    // Responsive detection
    useEffect(() => {
        if (RenderTarget.current() !== RenderTarget.preview) {
            setIsMobile(false)
            return
        }
        const check = () => setIsMobile(window.innerWidth < mobileBreakpoint)
        check()
        window.addEventListener("resize", check)
        return () => window.removeEventListener("resize", check)
    }, [mobileBreakpoint])

    // Keyboard navigation
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (items.length === 0) return
            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                e.preventDefault()
                setActiveIndex((prev) => (prev + 1) % items.length)
            } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                e.preventDefault()
                setActiveIndex((prev) =>
                    prev === 0 ? items.length - 1 : prev - 1
                )
            }
        },
        [items.length]
    )

    // ── Empty State ─────────────────────────────────────────────────────

    if (items.length === 0) {
        return (
            <div
                style={{
                    width: "100%",
                    minHeight: 300,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#fafafa",
                    color: "#999",
                    fontFamily: metaFontFamily,
                    fontSize: 14,
                    padding: 32,
                    textAlign: "center",
                    ...style,
                }}
            >
                <div>
                    <div
                        style={{ fontSize: 32, marginBottom: 12, opacity: 0.5 }}
                    >
                        🖼️
                    </div>
                    <div style={{ fontWeight: 500, marginBottom: 4 }}>
                        No media added
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>
                        Paste image or video URLs, one per line
                    </div>
                </div>
            </div>
        )
    }

    const activeItem = items[activeIndex]
    const currentGap = isMobile ? mobileGap : gap

    // ── Main Image Element ──────────────────────────────────────────────

    const mainDisplay = (
        <AnimatePresence mode="wait">
            <motion.div
                key={`main-${activeIndex}-${activeItem.url}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                    duration: transitionDuration,
                    ease: [0.4, 0, 0.2, 1],
                }}
                style={{
                    width: "100%",
                    display: "block",
                }}
            >
                {activeItem.type === "image" ? (
                    <img
                        src={activeItem.url}
                        alt={`Media ${activeIndex + 1}`}
                        draggable={false}
                        style={{
                            width: "100%",
                            height: "auto",
                            display: "block",
                            objectFit: "cover",
                        }}
                    />
                ) : (
                    <video
                        src={activeItem.url}
                        controls
                        autoPlay
                        muted
                        loop
                        playsInline
                        style={{
                            width: "100%",
                            height: "auto",
                            display: "block",
                            objectFit: "cover",
                            background: "#000",
                        }}
                    />
                )}
            </motion.div>
        </AnimatePresence>
    )

    // ── Thumbnail Grid (desktop: 3-col grid, mobile: horizontal row) ──

    const thumbGrid = isMobile ? (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                gap: thumbGap,
                width: "100%",
                overflowX: "auto",
                overflowY: "hidden",
                scrollbarWidth: "none",
            }}
        >
            {items.map((item, i) => (
                <ThumbButton
                    key={`thumb-${i}-${item.url}`}
                    item={item}
                    index={i}
                    isActive={activeIndex === i}
                    onClick={() => setActiveIndex(i)}
                    activeBorderColor={thumbActiveBorderColor}
                    inactiveBorderColor={thumbInactiveBorderColor}
                    shadow={thumbShadow}
                    layout="horizontal"
                />
            ))}
        </div>
    ) : (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: thumbGap,
                width: "100%",
            }}
        >
            {items.map((item, i) => (
                <ThumbButton
                    key={`thumb-${i}-${item.url}`}
                    item={item}
                    index={i}
                    isActive={activeIndex === i}
                    onClick={() => setActiveIndex(i)}
                    activeBorderColor={thumbActiveBorderColor}
                    inactiveBorderColor={thumbInactiveBorderColor}
                    shadow={thumbShadow}
                    layout="grid"
                />
            ))}
        </div>
    )

    // ── Metadata element ────────────────────────────────────────────────

    const metaPanel = (
        <MetadataPanel
            tags={parsedTags}
            category={category}
            lastUpdated={lastUpdated}
            addedOn={addedOn}
            contactLink={contactLink}
            shareUrl={resolvedShareUrl}
            fontFamily={metaFontFamily}
            fontColor={metaFontColor}
            labelColor={metaLabelColor}
            tagBg={tagBg}
            tagColor={tagColor}
            accentColor={accentColor}
        />
    )

    // ── Desktop / Tablet Layout ─────────────────────────────────────────
    // 70% main image | 30% sidebar (thumb grid + divider + metadata)

    if (!isMobile) {
        const sidebarContent = (
            <div
                style={{
                    width: "30%",
                    flexShrink: 0,
                    display: "flex",
                    padding: "32px",
                    flexDirection: "column",
                    gap: 20,
                    alignSelf: "flex-start",
                    order: thumbPosition === "Left" ? 0 : 1,
                }}
            >
                {thumbGrid}
                <Divider color={metaLabelColor} />
                {metaPanel}
            </div>
        )

        return (
            <div
                ref={containerRef}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="region"
                aria-label="Media gallery"
                style={{
                    position: "relative",
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    gap: currentGap,
                    outline: "none",
                    ...style,
                }}
            >
                {/* Main Display — 70% */}
                <div
                    style={{
                        width: "70%",
                        minWidth: 0,
                        position: "relative",
                        overflow: "hidden",
                        boxShadow: mainShadow,
                        order: thumbPosition === "Left" ? 1 : 0,
                    }}
                >
                    {mainDisplay}
                </div>

                {sidebarContent}
            </div>
        )
    }

    // ── Mobile Layout ───────────────────────────────────────────────────
    // Stacked: main image → thumbs row → divider → metadata

    return (
        <div
            ref={containerRef}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="region"
            aria-label="Media gallery"
            style={{
                position: "relative",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: currentGap,
                outline: "none",
                ...style,
            }}
        >
            {/* Main Display */}
            <div
                style={{
                    width: "100%",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: mainShadow,
                }}
            >
                {mainDisplay}
            </div>

            {thumbGrid}
            <Divider color={metaLabelColor} />
            {metaPanel}
        </div>
    )
}

// ─── Thumbnail Button ───────────────────────────────────────────────────────

interface ThumbButtonProps {
    item: MediaItem
    index: number
    isActive: boolean
    onClick: () => void
    activeBorderColor: string
    inactiveBorderColor: string
    shadow: string
    layout: "grid" | "horizontal"
}

function ThumbButton(props: ThumbButtonProps) {
    const {
        item,
        index,
        isActive,
        onClick,
        activeBorderColor,
        inactiveBorderColor,
        shadow,
        layout,
    } = props
    const [isHovered, setIsHovered] = useState(false)

    const sizeStyle: CSSProperties =
        layout === "grid"
            ? { width: "100%" }
            : { flex: "1 1 0", minWidth: 0, height: 64 }

    return (
        <motion.button
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocus={() => setIsHovered(true)}
            onBlur={() => setIsHovered(false)}
            aria-label={`View media ${index + 1}`}
            aria-pressed={isActive}
            animate={{
                opacity: isActive ? 1 : isHovered ? 0.9 : 0.65,
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
                ...sizeStyle,
                position: "relative",
                display: "block",
                border: "none",
                padding: 0,
                margin: 0,
                cursor: "pointer",
                overflow: "hidden",
                background: "transparent",
                borderRadius: 0,
                outline: "none",
                WebkitTapHighlightColor: "transparent",
                boxShadow: shadow,
            }}
        >
            {item.type === "image" ? (
                <img
                    src={item.url}
                    alt={`Thumbnail ${index + 1}`}
                    loading="lazy"
                    draggable={false}
                    style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                    }}
                />
            ) : (
                <video
                    src={item.url}
                    muted
                    playsInline
                    preload="metadata"
                    style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                    }}
                />
            )}

            {/* Active border indicator */}
            <motion.div
                animate={{ opacity: isActive ? 1 : isHovered ? 0.5 : 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{
                    position: "absolute",
                    inset: 0,
                    boxShadow: `inset 0 0 0 2px ${activeBorderColor}`,
                    pointerEvents: "none",
                }}
            />
        </motion.button>
    )
}

// ─── Property Controls ──────────────────────────────────────────────────────

addPropertyControls(MediaGallery, {
    // ── Media ────────────────────────────
    mediaUrls: {
        type: ControlType.String,
        title: "Media URLs",
        displayTextArea: true,
        defaultValue: PLACEHOLDER_URLS,
    },

    // ── Metadata Fields ─────────────────
    tags: {
        type: ControlType.String,
        title: "Tags",
        defaultValue: "Gallery, Grid, Images",
    },
    category: {
        type: ControlType.String,
        title: "Category",
        defaultValue: "Gallery",
    },
    lastUpdated: {
        type: ControlType.String,
        title: "Last Updated",
        defaultValue: "",
        description: "Bind to the CMS Edited field",
    },
    addedOn: {
        type: ControlType.String,
        title: "Added On",
        defaultValue: "",
        description: "Bind to the CMS Created field",
    },
    contactLink: {
        type: ControlType.Link,
        title: "Report Link",
        defaultValue: "/contact",
    },
    shareUrl: {
        type: ControlType.String,
        title: "Share URL",
        defaultValue: "",
    },

    // ── Layout ──────────────────────────
    thumbPosition: {
        type: ControlType.Enum,
        title: "Thumb Position",
        options: ["Left", "Right"],
        optionTitles: ["Left", "Right"],
        defaultValue: "Right",
    },
    gap: {
        type: ControlType.Number,
        title: "Gap",
        defaultValue: 12,
        min: 0,
        max: 64,
        step: 1,
        unit: "px",
    },
    mobileGap: {
        type: ControlType.Number,
        title: "Gap (Mobile)",
        defaultValue: 8,
        min: 0,
        max: 48,
        step: 1,
        unit: "px",
    },
    thumbGap: {
        type: ControlType.Number,
        title: "Thumb Gap",
        defaultValue: 8,
        min: 0,
        max: 24,
        step: 1,
        unit: "px",
    },

    // ── Shadows ──────────────────────────
    mainShadow: {
        type: ControlType.BoxShadow,
        title: "Main Shadow",
        defaultValue: "0px 0px 0px 0px rgba(0,0,0,0)",
    },
    thumbShadow: {
        type: ControlType.BoxShadow,
        title: "Thumb Shadow",
        defaultValue: "0px 0px 0px 0px rgba(0,0,0,0)",
    },

    // ── Transition ──────────────────────
    transitionDuration: {
        type: ControlType.Number,
        title: "Transition",
        defaultValue: 0.4,
        min: 0.1,
        max: 1.5,
        step: 0.05,
        unit: "s",
    },

    // ── Thumbnail Colors ────────────────
    thumbActiveBorderColor: {
        type: ControlType.Color,
        title: "Active Border",
        defaultValue: "#000000",
    },
    thumbInactiveBorderColor: {
        type: ControlType.Color,
        title: "Inactive Border",
        defaultValue: "transparent",
    },

    // ── Meta Styling ────────────────────
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "#9FE870",
    },
    metaFontColor: {
        type: ControlType.Color,
        title: "Meta Text",
        defaultValue: "#1a1a1a",
    },
    metaLabelColor: {
        type: ControlType.Color,
        title: "Meta Label",
        defaultValue: "#888888",
    },
    tagBg: {
        type: ControlType.Color,
        title: "Tag BG",
        defaultValue: "#f0f0f0",
    },
    tagColor: {
        type: ControlType.Color,
        title: "Tag Text",
        defaultValue: "#333333",
    },

    // ── Responsive ──────────────────────
    mobileBreakpoint: {
        type: ControlType.Number,
        title: "Mobile BP",
        defaultValue: 810,
        min: 320,
        max: 1200,
        step: 10,
        unit: "px",
    },
})
