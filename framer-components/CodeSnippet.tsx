import { addPropertyControls, ControlType } from "framer"
import { useState, useRef, useCallback } from "react"

// ─── Per-line Syntax Highlighting (Masking Strategy) ───────

function highlightLine(raw: string): string {
    // 1. Escape HTML special characters first
    let s = raw
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")

    // 2. Generate Structural HTML (Liquid Tags, HTML Tags)
    //    These steps create <span style="..."> tags.

    // Liquid tags: {% ... %}
    s = s.replace(/(\{%-?)(.*?)(-?%\})/g, (_, open, inner, close) => {
        const kw = inner.replace(
            /\b(schema|endschema|section|style|javascript|if|for|assign|echo|render|include|else|elsif|unless|case|when|capture|paginate|form|tablerow|comment|raw|layout)\b/g,
            '<span style="color:#cf222e;font-weight:600">$1</span>'
        )
        return `<span style="color:#1a7f37;font-weight:600">${open}</span>${kw}<span style="color:#1a7f37;font-weight:600">${close}</span>`
    })

    // Liquid output: {{ ... }}
    s = s.replace(/(\{\{-?)(.*?)(-?\}\})/g, (_, open, inner, close) => {
        const filters = inner.replace(
            /\|\s*(\w+)/g,
            '| <span style="color:#953800;font-weight:500">$1</span>'
        )
        return `<span style="color:#1a7f37;font-weight:600">${open}</span><span style="color:#0550ae">${filters}</span><span style="color:#1a7f37;font-weight:600">${close}</span>`
    })

    // HTML tags: <div ...> (Matches escaped &lt;...&gt;)
    s = s.replace(
        /(&lt;\/?)([\w-]+)(.*?)(&gt;)/g,
        (_, open, tag, attrs, close) => {
            const ha = attrs.replace(
                /([\w-]+)(=)(&quot;|")(.*?)(&quot;|")/g,
                '<span style="color:#116329">$1</span>$2<span style="color:#0a3069">$3$4$5</span>'
            )
            return `<span style="color:#6e7781">${open}</span><span style="color:#0550ae">${tag}</span>${ha}<span style="color:#6e7781">${close}</span>`
        }
    )

    // HTML Comments
    s = s.replace(
        /(&lt;!--)(.*?)(--&gt;)/g,
        '<span style="color:#6e7781;font-style:italic">$1$2$3</span>'
    )

    // 3. MASK ALL HTML TAGS
    //    We hide the <span ...> tags we just created so the next steps
    //    don't accidentally try to highlight the CSS inside them.
    const tags: string[] = []
    s = s.replace(/<[^>]*>/g, (match) => {
        tags.push(match)
        return `__HL_TAG_${tags.length - 1}__`
    })

    // 4. Content Highlighting (Safe to run now)

    // JSON Keys "key":
    s = s.replace(
        /"([\w_-]+?)"\s*:/g,
        '<span style="color:#953800">"$1"</span>:'
    )

    // Strings "value"
    s = s.replace(/"([^"]*)"/g, '<span style="color:#0a3069">"$1"</span>')

    // Numbers (This was the culprit!)
    s = s.replace(/\b(\d+\.?\d*)\b/g, '<span style="color:#0550ae">$1</span>')

    // Booleans
    s = s.replace(
        /\b(true|false|nil|null)\b/g,
        '<span style="color:#cf222e;font-weight:500">$1</span>'
    )

    // 5. UNMASK HTML TAGS
    //    Restore the structural HTML tags.
    s = s.replace(/__HL_TAG_(\d+)__/g, (_, index) => tags[parseInt(index)])

    return s
}

// ─── Component ──────────────────────────────────────────────────────────

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function CodeSnippet(props) {
    const {
        fileName,
        code,
        accentColor,
        bgColor,
        headerBgColor,
        borderColor,
        textColor,
        lineNumColor,
        borderRadius,
        fontSize,
        showLineNumbers,
    } = props

    const [copied, setCopied] = useState(false)
    const [copyHover, setCopyHover] = useState(false)

    // Unique ID for scoped CSS
    const scopeId = useRef(`cs-${Math.random().toString(36).slice(2, 8)}`).current

    const handleCopy = useCallback(async () => {
        try {
            // Ensure we copy the raw 'code' prop (CMS value), not the HTML
            await navigator.clipboard.writeText(code || "")
        } catch {
            const ta = document.createElement("textarea")
            ta.value = code || ""
            ta.style.position = "fixed"
            ta.style.opacity = "0"
            document.body.appendChild(ta)
            ta.select()
            document.execCommand("copy")
            document.body.removeChild(ta)
        }
        setCopied(true)
        setTimeout(() => setCopied(false), 2200)
    }, [code])

    const lines = (code || "").split("\n")
    const totalLines = lines.length
    const gutterChars = String(totalLines).length

    // Copy button styles
    const copyBtnStyle: React.CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        height: 30,
        padding: "0 12px",
        borderRadius: 6,
        border: `1px solid ${borderColor}`,
        background: copied ? "#dafbe1" : copyHover ? "#f3f4f6" : "#ffffff",
        color: copied ? "#116329" : copyHover ? "#24292f" : "#57606a",
        cursor: "pointer",
        fontSize: 12,
        fontWeight: 500,
        fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        letterSpacing: "0.01em",
        flexShrink: 0,
        transition: "all 0.2s ease",
        boxShadow: copied
            ? "0 1px 3px rgba(17,99,41,0.1)"
            : copyHover
              ? "0 2px 4px rgba(0,0,0,0.07)"
              : "0 1px 2px rgba(0,0,0,0.04)",
        transform: copied
            ? "scale(1.02)"
            : copyHover
              ? "translateY(-1px)"
              : "none",
        whiteSpace: "nowrap",
        borderColor: copied ? "#a7f3d0" : copyHover ? "#bbc0c7" : borderColor,
    }

    return (
        <div
            data-scope={scopeId}
            style={{
                width: "100%",
                height: "100%",
                fontFamily:
                    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                borderRadius: borderRadius,
                overflow: "hidden",
                border: `1px solid ${borderColor}`,
                background: bgColor,
                boxShadow:
                    "0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)",
                display: "flex",
                flexDirection: "column" as const,
            }}
        >
            {/* ── Scoped responsive CSS ────────────── */}
            <style dangerouslySetInnerHTML={{ __html: `
                @media (max-width: 768px) {
                    [data-scope="${scopeId}"] .cs-copy-label { display: none !important; }
                    [data-scope="${scopeId}"] .cs-copy-btn { padding: 0 8px !important; }
                }
            `}} />

            {/* ── Header ─────────────────────────────── */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto 1fr",
                    alignItems: "center",
                    padding: "0 14px",
                    height: 46,
                    minHeight: 46,
                    flexShrink: 0,
                    background: headerBgColor,
                    borderBottom: `1px solid ${borderColor}`,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                }}
            >
                {/* Left: Liquid tab */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                        justifyContent: "flex-start",
                    }}
                >
                    <div
                        style={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            height: "100%",
                            paddingRight: 4,
                        }}
                    >
                        <span
                            style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: textColor,
                                letterSpacing: "0.01em",
                            }}
                        >
                            Liquid
                        </span>
                        <div
                            style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: 2,
                                borderRadius: "2px 2px 0 0",
                                background: accentColor,
                            }}
                        />
                    </div>
                </div>

                {/* Center: file icon + file name */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        minWidth: 0,
                    }}
                >
                    <svg
                        width="13"
                        height="13"
                        viewBox="0 0 16 16"
                        fill="none"
                        style={{
                            flexShrink: 0,
                            color: "rgba(31,35,40,0.35)",
                        }}
                    >
                        <path
                            d="M4 1.5h5.5L13 5v8.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 13.5v-11A1.5 1.5 0 0 1 4 1.5Z"
                            stroke="currentColor"
                            strokeWidth="1.1"
                            fill="none"
                        />
                        <path
                            d="M9 1.5V5h4"
                            stroke="currentColor"
                            strokeWidth="1.1"
                        />
                    </svg>
                    <span
                        style={{
                            fontSize: 12.5,
                            fontWeight: 500,
                            color: "#000000", // <--- UPDATED: Black Color
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            fontFamily:
                                "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
                            letterSpacing: "-0.01em",
                        }}
                    >
                        {fileName}
                    </span>
                </div>

                {/* Right: Copy Code button */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                    }}
                >
                    <button
                        className="cs-copy-btn"
                        onClick={handleCopy}
                        onMouseEnter={() => setCopyHover(true)}
                        onMouseLeave={() => setCopyHover(false)}
                        style={copyBtnStyle}
                    >
                        {copied ? (
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 16 16"
                                fill="none"
                            >
                                <path
                                    d="M3.5 8.5L6.5 11.5L12.5 4.5"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        ) : (
                            <svg
                                width="13"
                                height="13"
                                viewBox="0 0 16 16"
                                fill="none"
                            >
                                <rect
                                    x="5.5"
                                    y="5.5"
                                    width="7.5"
                                    height="7.5"
                                    rx="1.5"
                                    stroke="currentColor"
                                    strokeWidth="1.2"
                                />
                                <path
                                    d="M10.5 5.5V3.5A1.5 1.5 0 0 0 9 2H3.5A1.5 1.5 0 0 0 2 3.5V9A1.5 1.5 0 0 0 3.5 10.5H5.5"
                                    stroke="currentColor"
                                    strokeWidth="1.2"
                                />
                            </svg>
                        )}
                        <span className="cs-copy-label">{copied ? "Copied!" : "Copy Code"}</span>
                    </button>
                </div>
            </div>

            {/* ── Code Body (scrollable) ────────────── */}
            <div
                style={{
                    position: "relative",
                    flex: 1,
                    minHeight: 0,
                    overflow: "hidden",
                }}
            >
                <pre
                    style={{
                        margin: 0,
                        padding: "16px 20px",
                        fontSize: fontSize,
                        lineHeight: 1.7,
                        color: textColor,
                        fontFamily:
                            "'JetBrains Mono', 'Fira Code', 'Source Code Pro', 'Cascadia Code', 'SF Mono', monospace",
                        overflowX: "auto",
                        overflowY: "auto",
                        height: "100%",
                        tabSize: 2,
                        whiteSpace: "pre",
                        wordBreak: "normal",
                        background: "transparent",
                        scrollbarWidth: "thin" as any,
                        scrollbarColor: `${borderColor} transparent`,
                    }}
                >
                    <code>
                        {lines.map((line, i) => (
                            <div
                                key={i}
                                style={{
                                    display: "flex",
                                    minHeight: "1.7em",
                                }}
                            >
                                {showLineNumbers && (
                                    <span
                                        style={{
                                            display: "inline-block",
                                            width: `${gutterChars}ch`,
                                            minWidth: `${gutterChars}ch`,
                                            textAlign: "right",
                                            marginRight: "1.8em",
                                            color: lineNumColor,
                                            userSelect: "none",
                                            fontSize: "0.92em",
                                            lineHeight: "inherit",
                                            flexShrink: 0,
                                        }}
                                    >
                                        {i + 1}
                                    </span>
                                )}
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: highlightLine(line) || " ",
                                    }}
                                />
                            </div>
                        ))}
                    </code>
                </pre>

                {/* Bottom fade hint — indicates more content below */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 48,
                        background: `linear-gradient(to bottom, transparent, ${bgColor}cc)`,
                        pointerEvents: "none",
                    }}
                />
            </div>


        </div>
    )
}

// ─── Placeholder Liquid Code ────────────────────────────────────────────

const PLACEHOLDER_CODE = `{% comment %}
  Hero section for storefront landing page
{% endcomment %}

<section class="hero-section" data-section-id="{{ section.id }}">
  <div class="hero-section__wrapper page-width">

    {% if section.settings.show_announcement %}
      <div class="hero-section__announcement">
        <span class="badge badge--accent">
          {{ section.settings.announcement_text }}
        </span>
      </div>
    {% endif %}

    <h1 class="hero-section__title h0">
      {{ section.settings.heading | escape }}
    </h1>

    {% if section.settings.subheading != blank %}
      <p class="hero-section__subtitle body-lg">
        {{ section.settings.subheading }}
      </p>
    {% endif %}

    <div class="hero-section__actions">
      {% if section.settings.primary_url != blank %}
        <a href="{{ section.settings.primary_url }}"
           class="btn btn--primary btn--lg">
          {{ section.settings.primary_label | default: "Shop Now" }}
        </a>
      {% endif %}

      {% if section.settings.secondary_url != blank %}
        <a href="{{ section.settings.secondary_url }}"
           class="btn btn--outline btn--lg">
          {{ section.settings.secondary_label | default: "Learn More" }}
        </a>
      {% endif %}
    </div>

    {% if section.settings.featured_image != blank %}
      <div class="hero-section__media">
        {{ section.settings.featured_image
           | image_url: width: 1200
           | image_tag:
               class: "hero-section__img",
               loading: "eager",
               widths: "375, 750, 1100, 1200" }}
      </div>
    {% endif %}

    {% for block in section.blocks %}
      {% case block.type %}
        {% when "social_proof" %}
          <div class="hero-section__social-proof" {{ block.shopify_attributes }}>
            <span class="social-proof__count">
              {{ block.settings.count }}+
            </span>
            <span class="social-proof__label">
              {{ block.settings.label }}
            </span>
          </div>
      {% endcase %}
    {% endfor %}

  </div>
</section>

{% schema %}
{
  "name": "Hero Section",
  "tag": "section",
  "class": "section-hero",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Discover Our Collection"
    },
    {
      "type": "textarea",
      "id": "subheading",
      "label": "Subheading"
    },
    {
      "type": "checkbox",
      "id": "show_announcement",
      "label": "Show announcement badge",
      "default": false
    },
    {
      "type": "text",
      "id": "announcement_text",
      "label": "Announcement text",
      "default": "New Arrivals"
    },
    {
      "type": "image_picker",
      "id": "featured_image",
      "label": "Featured image"
    },
    {
      "type": "url",
      "id": "primary_url",
      "label": "Primary button link"
    },
    {
      "type": "text",
      "id": "primary_label",
      "label": "Primary button label",
      "default": "Shop Now"
    },
    {
      "type": "url",
      "id": "secondary_url",
      "label": "Secondary button link"
    },
    {
      "type": "text",
      "id": "secondary_label",
      "label": "Secondary button label",
      "default": "Learn More"
    }
  ],
  "blocks": [
    {
      "type": "social_proof",
      "name": "Social Proof",
      "settings": [
        {
          "type": "text",
          "id": "count",
          "label": "Count",
          "default": "500"
        },
        {
          "type": "text",
          "id": "label",
          "label": "Label",
          "default": "Happy Customers"
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "Hero Section"
    }
  ]
}
{% endschema %}`

// ─── Defaults & Property Controls ───────────────────────────────────────

CodeSnippet.defaultProps = {
    fileName: "hero-section.liquid",
    code: PLACEHOLDER_CODE,
    accentColor: "#0969da",
    bgColor: "#ffffff",
    headerBgColor: "#f6f8fa",
    borderColor: "#d1d9e0",
    textColor: "#1f2328",
    lineNumColor: "#afb8c1",
    borderRadius: 10,
    fontSize: 13,
    showLineNumbers: true,
}

addPropertyControls(CodeSnippet, {
    fileName: {
        type: ControlType.String,
        title: "File Name",
        defaultValue: "hero-section.liquid",
    },
    code: {
        type: ControlType.String,
        title: "Code",
        defaultValue: PLACEHOLDER_CODE,
        displayTextArea: true,
    },

    showLineNumbers: {
        type: ControlType.Boolean,
        title: "Line Numbers",
        defaultValue: true,
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent",
        defaultValue: "#0969da",
    },
    bgColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#ffffff",
    },
    headerBgColor: {
        type: ControlType.Color,
        title: "Header BG",
        defaultValue: "#f6f8fa",
    },
    borderColor: {
        type: ControlType.Color,
        title: "Border",
        defaultValue: "#d1d9e0",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#1f2328",
    },
    lineNumColor: {
        type: ControlType.Color,
        title: "Line Num Color",
        defaultValue: "#afb8c1",
    },
    borderRadius: {
        type: ControlType.Number,
        title: "Radius",
        defaultValue: 10,
        min: 0,
        max: 24,
        step: 1,
    },
    fontSize: {
        type: ControlType.Number,
        title: "Font Size",
        defaultValue: 13,
        min: 10,
        max: 18,
        step: 1,
    },
})
