// Email Capture Form — Web3Forms backend
// Dark green background, glassmorphic input, lime green CTA button
// Paste your Web3Forms Access Key into the property panel to connect.
// Get a free key at https://web3forms.com

import {
    useState,
    useCallback,
    useMemo,
    startTransition,
    type CSSProperties,
} from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { motion, AnimatePresence } from "framer-motion"

// ─── Types ───────────────────────────────────────────────────────────
interface EmailCaptureProps {
    // Web3Forms
    accessKey: string
    subject: string

    // Content
    placeholder: string
    buttonLabel: string
    successMessage: string
    errorMessage: string

    // Styling
    backgroundColor: string
    inputBackgroundColor: string
    inputBorderColor: string
    inputTextColor: string
    placeholderColor: string
    buttonColor: string
    buttonTextColor: string
    buttonHoverColor: string
    inputBorderRadius: number
    buttonBorderRadius: number
    maxWidth: number
    paddingY: number
    paddingX: number
    gap: number

    // Fonts
    inputFont: CSSProperties
    buttonFont: CSSProperties

    style?: CSSProperties
}

// ─── Helpers ─────────────────────────────────────────────────────────
const WEB3FORMS_URL = "https://api.web3forms.com/submit"

// ─── Arrow Icon ──────────────────────────────────────────────────────
function ArrowRight({ size = 16, color = "#1a2e05" }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
    )
}

// ─── Component ───────────────────────────────────────────────────────

/**
 * Email Capture Form
 *
 * Drop-in email capture powered by Web3Forms (free).
 * Paste your Access Key and you're live.
 *
 * @framerIntrinsicWidth 600
 * @framerIntrinsicHeight 220
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function EmailCapture(props: EmailCaptureProps) {
    const {
        accessKey = "",
        subject = "New Email Signup",
        placeholder = "Your email",
        buttonLabel = "Get notified",
        successMessage = "You're on the list! 🎉",
        errorMessage = "Something went wrong. Try again.",
        backgroundColor = "#1a2e05",
        inputBackgroundColor = "rgba(255,255,255,0.08)",
        inputBorderColor = "rgba(255,255,255,0.15)",
        inputTextColor = "#ffffff",
        placeholderColor = "rgba(255,255,255,0.45)",
        buttonColor = "#a3e635",
        buttonTextColor = "#1a2e05",
        buttonHoverColor = "#bef264",
        inputBorderRadius = 8,
        buttonBorderRadius = 8,
        maxWidth = 480,
        paddingY = 64,
        paddingX = 24,
        gap = 16,
        inputFont,
        buttonFont,
        style,
    } = props

    const [email, setEmail] = useState("")
    const [status, setStatus] = useState<
        "idle" | "loading" | "success" | "error"
    >("idle")
    const [isHovered, setIsHovered] = useState(false)

    // ── Submit handler ───────────────────────────────────────────────
    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault()
            if (!email || !accessKey) return

            startTransition(() => setStatus("loading"))

            try {
                const res = await fetch(WEB3FORMS_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        access_key: accessKey,
                        email,
                        subject,
                        from_name: "Email Capture Form",
                    }),
                })

                const data = await res.json()

                if (data.success) {
                    startTransition(() => {
                        setStatus("success")
                        setEmail("")
                    })
                } else {
                    startTransition(() => setStatus("error"))
                }
            } catch {
                startTransition(() => setStatus("error"))
            }
        },
        [email, accessKey, subject]
    )

    // ── Is preview / canvas? ─────────────────────────────────────────
    const isCanvas =
        RenderTarget.current() === RenderTarget.canvas ||
        RenderTarget.current() === RenderTarget.thumbnail

    // ── Dynamic placeholder CSS injection ────────────────────────────
    const placeholderId = useMemo(
        () => `ec-${Math.random().toString(36).slice(2, 8)}`,
        []
    )

    const placeholderCSS = `
        #${placeholderId}::placeholder {
            color: ${placeholderColor};
            opacity: 1;
        }
    `

    // ── Styles ───────────────────────────────────────────────────────
    const containerStyle: CSSProperties = {
        ...style,
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor,
        paddingTop: paddingY,
        paddingBottom: paddingY,
        paddingLeft: paddingX,
        paddingRight: paddingX,
        boxSizing: "border-box",
        overflow: "hidden",
    }

    const formStyle: CSSProperties = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth,
        gap,
    }

    const inputStyle: CSSProperties = {
        width: "100%",
        padding: "14px 18px",
        backgroundColor: inputBackgroundColor,
        border: `1px solid ${inputBorderColor}`,
        borderRadius: inputBorderRadius,
        color: inputTextColor,
        outline: "none",
        boxSizing: "border-box",
        transition: "border-color 0.2s ease, background-color 0.2s ease",
        ...(inputFont || {}),
        fontSize: inputFont?.fontSize || "15px",
        fontFamily: inputFont?.fontFamily || "inherit",
        letterSpacing: inputFont?.letterSpacing || "-0.01em",
        lineHeight: inputFont?.lineHeight || "1.4em",
    }

    const buttonStyle: CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "12px 28px",
        backgroundColor: isHovered ? buttonHoverColor : buttonColor,
        color: buttonTextColor,
        border: "none",
        borderRadius: buttonBorderRadius,
        cursor: status === "loading" ? "wait" : "pointer",
        transition: "background-color 0.2s ease, transform 0.15s ease",
        transform: isHovered ? "translateY(-1px)" : "translateY(0)",
        ...(buttonFont || {}),
        fontSize: buttonFont?.fontSize || "14px",
        fontWeight: buttonFont?.fontWeight || 600,
        fontFamily: buttonFont?.fontFamily || "inherit",
        letterSpacing: buttonFont?.letterSpacing || "-0.01em",
        lineHeight: buttonFont?.lineHeight || "1em",
    }

    const feedbackStyle: CSSProperties = {
        fontSize: 14,
        fontWeight: 500,
        textAlign: "center",
        padding: "8px 0",
    }

    // ── No access key warning ────────────────────────────────────────
    const showWarning = isCanvas && !accessKey

    return (
        <div style={containerStyle}>
            <style>{placeholderCSS}</style>

            {showWarning && (
                <div
                    style={{
                        position: "absolute",
                        top: 12,
                        right: 16,
                        background: "rgba(255,200,50,0.15)",
                        border: "1px solid rgba(255,200,50,0.4)",
                        borderRadius: 6,
                        padding: "6px 12px",
                        fontSize: 11,
                        color: "#fbbf24",
                        zIndex: 10,
                        fontFamily: "Inter, system-ui, sans-serif",
                    }}
                >
                    ⚠️ Paste your Web3Forms key in props
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                style={formStyle}
                aria-label="Email signup form"
            >
                <input
                    id={placeholderId}
                    type="email"
                    required
                    value={email}
                    placeholder={placeholder}
                    onChange={(e) =>
                        startTransition(() => setEmail(e.target.value))
                    }
                    onFocus={(e) => {
                        e.currentTarget.style.borderColor =
                            "rgba(255,255,255,0.35)"
                        e.currentTarget.style.backgroundColor =
                            "rgba(255,255,255,0.12)"
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.borderColor = inputBorderColor
                        e.currentTarget.style.backgroundColor =
                            inputBackgroundColor
                    }}
                    style={inputStyle}
                    aria-label="Email address"
                    disabled={status === "loading"}
                />

                <motion.button
                    type="submit"
                    style={buttonStyle}
                    onHoverStart={() =>
                        startTransition(() => setIsHovered(true))
                    }
                    onHoverEnd={() =>
                        startTransition(() => setIsHovered(false))
                    }
                    whileTap={{ scale: 0.97 }}
                    disabled={status === "loading"}
                    aria-label={buttonLabel}
                >
                    {status === "loading" ? (
                        <motion.span
                            animate={{ rotate: 360 }}
                            transition={{
                                repeat: Infinity,
                                duration: 0.8,
                                ease: "linear",
                            }}
                            style={{
                                display: "inline-block",
                                width: 16,
                                height: 16,
                                border: `2px solid ${buttonTextColor}`,
                                borderTopColor: "transparent",
                                borderRadius: "50%",
                            }}
                        />
                    ) : (
                        <>
                            {buttonLabel}
                            <ArrowRight size={16} color={buttonTextColor} />
                        </>
                    )}
                </motion.button>
            </form>

            {/* ── Feedback messages ───────────────────────────────────── */}
            <AnimatePresence>
                {status === "success" && (
                    <motion.p
                        key="success"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        style={{
                            ...feedbackStyle,
                            color: buttonColor,
                        }}
                        role="status"
                    >
                        {successMessage}
                    </motion.p>
                )}
                {status === "error" && (
                    <motion.p
                        key="error"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        style={{
                            ...feedbackStyle,
                            color: "#f87171",
                        }}
                        role="alert"
                    >
                        {errorMessage}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    )
}

// ─── Property Controls ───────────────────────────────────────────────
addPropertyControls(EmailCapture, {
    // ── Web3Forms ────────────────────────────────────────────────────
    accessKey: {
        type: ControlType.String,
        title: "🔑 Access Key",
        description:
            "Paste your Web3Forms access key. Get one free at web3forms.com",
        defaultValue: "",
        placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    },
    subject: {
        type: ControlType.String,
        title: "Email Subject",
        defaultValue: "New Email Signup",
        description:
            "Subject line of the notification email you receive.",
    },

    // ── Content ──────────────────────────────────────────────────────
    placeholder: {
        type: ControlType.String,
        title: "Placeholder",
        defaultValue: "Your email",
    },
    buttonLabel: {
        type: ControlType.String,
        title: "Button Label",
        defaultValue: "Get notified",
    },
    successMessage: {
        type: ControlType.String,
        title: "Success Msg",
        defaultValue: "You're on the list! 🎉",
    },
    errorMessage: {
        type: ControlType.String,
        title: "Error Msg",
        defaultValue: "Something went wrong. Try again.",
    },

    // ── Colors ───────────────────────────────────────────────────────
    backgroundColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#1a2e05",
    },
    inputBackgroundColor: {
        type: ControlType.Color,
        title: "Input BG",
        defaultValue: "rgba(255,255,255,0.08)",
    },
    inputBorderColor: {
        type: ControlType.Color,
        title: "Input Border",
        defaultValue: "rgba(255,255,255,0.15)",
    },
    inputTextColor: {
        type: ControlType.Color,
        title: "Input Text",
        defaultValue: "#ffffff",
    },
    placeholderColor: {
        type: ControlType.Color,
        title: "Placeholder",
        defaultValue: "rgba(255,255,255,0.45)",
    },
    buttonColor: {
        type: ControlType.Color,
        title: "Button BG",
        defaultValue: "#a3e635",
    },
    buttonTextColor: {
        type: ControlType.Color,
        title: "Button Text",
        defaultValue: "#1a2e05",
    },
    buttonHoverColor: {
        type: ControlType.Color,
        title: "Button Hover",
        defaultValue: "#bef264",
    },

    // ── Layout ───────────────────────────────────────────────────────
    inputBorderRadius: {
        type: ControlType.Number,
        title: "Input Radius",
        defaultValue: 8,
        min: 0,
        max: 32,
        step: 1,
        unit: "px",
    },
    buttonBorderRadius: {
        type: ControlType.Number,
        title: "Button Radius",
        defaultValue: 8,
        min: 0,
        max: 32,
        step: 1,
        unit: "px",
    },
    maxWidth: {
        type: ControlType.Number,
        title: "Max Width",
        defaultValue: 480,
        min: 200,
        max: 800,
        step: 10,
        unit: "px",
    },
    paddingY: {
        type: ControlType.Number,
        title: "Padding Y",
        defaultValue: 64,
        min: 0,
        max: 200,
        step: 4,
        unit: "px",
    },
    paddingX: {
        type: ControlType.Number,
        title: "Padding X",
        defaultValue: 24,
        min: 0,
        max: 200,
        step: 4,
        unit: "px",
    },
    gap: {
        type: ControlType.Number,
        title: "Gap",
        defaultValue: 16,
        min: 0,
        max: 64,
        step: 4,
        unit: "px",
    },

    // ── Typography ───────────────────────────────────────────────────
    inputFont: {
        type: ControlType.Font,
        title: "Input Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: {
            fontSize: "15px",
            variant: "Regular",
            letterSpacing: "-0.01em",
            lineHeight: "1.4em",
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
})
