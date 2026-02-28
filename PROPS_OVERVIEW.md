# PROPS — Project Overview & Strategy

## 1. What is PROPS?

**PROPS** is a curated library of **beautiful, theme-agnostic, customizable Shopify Sections**.

Users get ready-made Liquid code files they can **copy-paste directly into their Shopify theme** — no app installs, no dependencies, no animation-library integrations. Each section is self-contained (schema + styles + markup + JS, all in one `.liquid` file) and designed to work with any theme out of the box.

### Value Proposition

| Pillar                     | Detail                                                                                                    |
| -------------------------- | --------------------------------------------------------------------------------------------------------- |
| **Beautiful**              | Polished, modern designs — not basic boilerplate. Each section looks great with zero tweaking.            |
| **Theme-Agnostic**         | Uses `var(--page-width)` fallbacks and `props-` namespaced classes. No Dawn or theme-specific selectors.  |
| **Customizable**           | Granular Shopify section settings — desktop/mobile columns, gaps, padding, font sizes, colors, and more.  |
| **Copy & Paste**           | One file per section. Users add it to `sections/` in their theme and they're done. No npm, no build step. |
| **No Animation Libraries** | Pure CSS transitions where animation is needed. No external JS/CSS dependencies.                          |

### Tagline / Hero Copy (current draft)

> **Customizable, theme-agnostic Shopify Sections.**  
> Ready-to-use sections for your online store, with more coming. No coding skills required.

---

## 2. Website Structure (Framer)

Based on the current Framer design, the site has the following pages/sections:

### Home Page Layout (top → bottom)

1. **Hero Section** — Headline + subhead + CTA ("Get started →")
2. **Section Grid / Showcase** — 3-column card grid showing available sections (thumbnail, name, category tag, arrow link)
3. **Features Section** — (planned)
4. **Blog** — (planned)
5. **Roadmap** - (planned)
6. **Contact / Footer** — (planned)

### Section Detail Page

Each section has its own page showing:

- **Breadcrumb** (Category label)
- **Section Name** (e.g., "Simple Gallery")
- **Gallery** (large visual)
- **Subtitle** (1 sentences about what it does)
- **Features** (4-7 Accordions with Title and Text)
- **Code Block** (syntax-highlighted Liquid code with a "Copy Code" button, truncated with fade + "Show more")
- **File name badge** (e.g., `gallery.liquid`)

---

## 3. Section Development Guidelines

### File Structure

Every section is a single `.liquid` file, blocks ordered as:

```
{%- comment -%} ... {%- endcomment -%}   ← Branding header (only comment allowed)
{% schema %} ... {% endschema %}          ← Settings, blocks, presets
{% style %} ... {% endstyle %}            ← Scoped CSS
<div>...</div>                            ← HTML markup
{% javascript %} ... {% endjavascript %}  ← JS (only when needed)
```

### Branding Header

Every file starts with this exact format — and **no other comments** exist anywhere in the file (not in CSS, HTML, or JS):

```liquid
{%- comment -%}
  Section Name | PROPS — https://getprops.co
{%- endcomment -%}
```

### Naming

- **File:** `props-{name}.liquid`
- **CSS classes:** `props-{name}-` prefix (e.g., `props-gallery-grid`)
- **Root scoping:** `.props-{name}-{{ section.id }}`
- **CSS variables:** `--props-` prefix, with semantic suffixes: `--props-heading-size` for titles, `--props-body-size` for body/description text, `--props-caption-size` for captions.
- **Block types:** Semantic noun. Block names: capitalized noun, no "Block" suffix.

### Container Width

No "Container Width" setting. Always inherit the theme's global page width:

```html
<div class="page-width props-{name}-container"></div>
```

```css
.props-{name}-container {
  max-width: var(--page-width, 1200px);
  margin: 0 auto;
}
```

### Responsive Settings

Provide desktop and mobile variants for layout-affecting settings. Use mobile-first CSS variables in `{% style %}`, overridden at `min-width: 750px`. Standard padding setting IDs:

`padding_vertical_desktop`, `padding_horizontal_desktop`, `padding_vertical_mobile`, `padding_horizontal_mobile`

Horizontal padding uses `--props-pd-h-m` / `--props-pd-h-d` variables with a media query swap.

### Schema Conventions

- **`disabled_on`:** `"groups": ["header", "custom.popups"]`
- **Header ordering:** End every schema with **Section Padding → Colors** as the last two groups. Section-specific groups go before them. A typical order: Layout → Content → Typography → [section-specific] → Spacing → Section Padding → Colors.
- **`bg_color` default:** `"transparent"`
- **`text_color` default:** `"#121212"` for general text. Exception: overlay/caption-specific text may default to `"#FFFFFF"`.
- **Presets:** Provide sensible defaults; avoid inline settings overrides in presets.

### Images & Placeholders

- Always use `image_tag` with `loading`, `class`, `widths`, `sizes`, and `alt` attributes.
- Include an `alt_text` field in every image block. Wire it as: `alt: block.settings.alt_text | default: block.settings.image.alt`.
- Escape text field output with `| escape`.
- For image placeholders, use `https://static.photos/monochrome/1200x630.webp` so nothing gets saved to the store's assets. Logo-type sections may use inline SVG shapes instead.

### HTML & Data Attributes

- **Always** include `data-section-type="props-{name}"` and `data-section-id="{{ section.id }}"` on the outermost container — even if the section has no JS today, for future extensibility.
- Set `color: {{ section.settings.text_color }}` on the root scoping element and use `inherit` / `currentColor` downstream. For element-specific colors (e.g., captions), a dedicated CSS variable is acceptable.

### Hover Interactions

Wrap `:hover` styles in `@media (hover: hover)` to prevent sticky hover states on touch devices:

```css
@media (hover: hover) {
  .props-{name}-item:hover .props-{name}-img {
    transform: scale(1.04);
  }
}
```

### JavaScript

- Use `{% javascript %}` only — never raw `<script>` tags. This deduplicates automatically for multiple section instances.
- Since `{% javascript %}` blocks cannot contain Liquid variables, use the `data-section-type` and `data-section-id` attributes to query elements in JS.
- Always handle `shopify:section:load` for theme editor compatibility.
- Debounce `scroll` event listeners with a ~30ms timeout.
- Follow this pattern:

```js
(function () {
  const init = (container) => {
    const id = container.getAttribute("data-section-id");
    if (!id) return;
    // section logic
  };
  document.querySelectorAll('[data-section-type="props-{name}"]').forEach(init);
  document.addEventListener("shopify:section:load", (e) => {
    const c = e.target.querySelector('[data-section-type="props-{name}"]');
    if (c) init(c);
  });
})();
```

### General

- No external dependencies (no JS libraries, no CDN links).
- No hardcoded colors in CSS — use settings or CSS variables.
- Accessible: `aria-labels` on interactive elements, semantic HTML.

---

## 4. Task List — Phased Roadmap

### Phase 1: Code Finalization 🔧

> Get all existing sections production-ready.

- [ ] **Resolve the duplicate file issue** — Delete `props-features-grid.liquid` (it's an accidental copy of the offset gallery). If a "features grid" section is actually desired, build it properly from `props-features.liquid`.
- [ ] **Fix schema name** in `props-offset-gallery.liquid` — Remove the trailing `1`.
- [ ] **Audit each section** against the Quality Checklist (Section 4).
- [ ] **Standardize placeholder images** across all sections.
- [ ] **Test all sections** in at least 2 themes (Dawn + one third-party like Sense or Craft).
- [ ] **Write descriptions, features, and settings overviews** for each Live/WIP section.

### Phase 2: CMS & Detail Pages 📄

> Build out the Framer CMS and individual section pages.

- [ ] **Create CMS collection** in Framer with the schema from Section 6.
- [ ] **Populate CMS items** for all Live sections (Timeline, Logo Showcase).
- [ ] **Build the Section Detail Page template** in Framer — preview image, description, code block with syntax highlighting + copy button.
- [ ] **Create Section Card component** for the home page grid.
- [ ] **Implement category filtering** on the home page (optional for v1).

### Phase 3: Website Build 🌐

> Complete the Framer website.

- [ ] **Finalize hero section** copy and CTA.
- [ ] **Build Features section** — What makes PROPS different.
- [ ] **Build Benefits section** — Why use PROPS.
- [ ] **Build Pricing section** — Based on chosen pricing model.
- [ ] **Build Contact/Footer** — Social links, support email, newsletter.
- [ ] **Responsive QA** — Test on Desktop, Tablet, Phone breakpoints.
- [ ] **SEO** — Meta titles, descriptions, OG images for each page.

### Phase 4: New Sections 🆕

> Expand the library.

- [ ] **Lightbox Gallery** (WIP → Live)
- [ ] **Split Content Slider** (WIP → Live)
- [ ] **Tabbed Content** (Idea → Build)
- [ ] **Before & After Slider** (Idea → Build)
- [ ] **Marquee / Infinite Tape** — Built as **Ticker** (`props-ticker.liquid`)
- [ ] Remaining sections from the roadmap

### Phase 5: Launch & Marketing 🚀

- [ ] **Soft launch** — Share on X, Reddit, Shopify communities.
- [ ] **Product Hunt launch** (optional).
- [ ] **Create demo store** showing all sections in action.
- [ ] **Write blog/tutorial content** — "How to add custom sections to Shopify."

---

## 5. Design Notes (from Framer)

- **Font:** General Sans
- **Color scheme:** These are the following colors being used at the time.
  -- Accent: #9FE870
  -- Dark Accent: #173401
  -- Text: #000000
  -- White BG: #FFFFFF
  -- Grey BG: #F9F9F9
- **Cards:** Image, Title, Subtitle (with an arrow) and a grey background to the card.
- **Category badges:** Small pill labels with a green outline
- **Code block:** Syntax-highlighted Liquid with file name tab, "Copy Code" button, truncated with gradient fade
- **Responsive:** 3 breakpoints designed — Desktop (1600), Tablet (810–1599), Phone

---

_This document is a living reference. Update it as decisions are made and sections are completed._
