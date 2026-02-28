# PROPS — Section Details (CMS Reference)

> This document defines the CMS schema used for each section's detail page on the PROPS website (Framer), and contains the finalized content for all 12 sections.

---

## CMS Schema

Each section in the Framer CMS collection uses the following fields:

| Field           | CMS Type      | Required | Description                                                           |
| --------------- | ------------- | -------- | --------------------------------------------------------------------- |
| **Name**        | Text          | ✅       | Display name of the section                                           |
| **Slug**        | Slug          | ✅       | URL-friendly identifier (auto-generated from name)                    |
| **Category**    | Enum          | ✅       | Hero · Gallery · Social Proof · Interactive · Content                 |
| **Tags**        | Text          | ✅       | Comma-separated tags for search and filtering                         |
| **Sort Order**  | Number        | ✅       | Complexity rating (1 = basic, 5 = advanced)                           |
| **Subtitle**    | Text          | ✅       | One-line description shown on cards and at the top of the detail page |
| **Description** | Rich Text     | ✅       | Full description of the section — what it does, how it works          |
| **Features**    | Rich Text     | ✅       | 5 accordion items: 3 unique + Customizability + Accessibility         |
| **Thumbnail**   | Image         | ✅       | Card image for the home page grid                                     |
| **Gallery**     | Image (multi) | ❌       | Additional screenshots/previews for the detail page                   |
| **File Name**   | Text          | ✅       | The suggested file name (e.g., `props-gallery.liquid`)                |
| **Usage Modal** | Rich Text     | ❌       | Non-obvious usage instructions (only for sections that need them)     |

## Section Categories

| Category         | Description                                                           |
| ---------------- | --------------------------------------------------------------------- |
| **Hero**         | Above-the-fold sections — headlines, CTAs, background media, collages |
| **Gallery**      | Image display — grids, sliders, lightboxes                            |
| **Social Proof** | Trust signals — logos, testimonials, reviews                          |
| **Interactive**  | Motion and interaction — tickers, comparisons, marquees               |
| **Content**      | Information-driven — timelines, features, tabs                        |

---

---

# Hero

---

## Section 1: BG Media Hero

### Meta

| Field          | Value                        |
| -------------- | ---------------------------- |
| **Name**       | BG Media Hero                |
| **File Name**  | `props-bg-media-hero.liquid` |
| **Category**   | Hero                         |
| **Slug**       | `bg-media-hero`              |
| **Sort Order** | 2                            |

### Tags

Hero, Video, Background

### Subtitle

A full-width hero section with a background image or video.

### Description

A full-width hero section where a background image or video fills the entire section behind your content. The text and buttons sit on top of the media, positioned with vertical and horizontal alignment controls. Set overlay color and opacity to darken or tint the background for text readability.

The section supports two media block types — **Image** and **Video**. For video, an autoplay toggle controls playback (muted and looped), and a small play/pause button in the bottom-right corner lets users stop or restart the video. The section also respects `prefers-reduced-motion`, automatically pausing the video for users who prefer reduced motion.

### Features

Full-Width Background Media
Choose between an image or video block that fills the entire section area. The media stretches edge-to-edge with object-fit: cover for a seamless full-bleed appearance.

Video Autoplay & Play/Pause
Toggle autoplay for background video — it loops, plays inline, and stays muted. A subtle play/pause button in the bottom-right corner provides manual control.

Viewport Height Sizing
Section height is set in vh units (50–100vh) with separate desktop and mobile controls, so the hero always fills the right proportion of the screen.

Customizability
Per-block overlay color and opacity, separate heading and description size controls for desktop and mobile, adjustable content width per breakpoint, text alignment (left/center), vertical alignment (top/center/bottom), per-button base and hover color controls, and full section padding.

Accessibility
Autoplaying video is automatically paused for users with prefers-reduced-motion enabled. The play/pause button updates to reflect the current state. Semantic HTML with ARIA labels on all interactive elements.

---

## Section 2: Inline Image Hero

### Meta

| Field          | Value                            |
| -------------- | -------------------------------- |
| **Name**       | Inline Image Hero                |
| **File Name**  | `props-inline-image-hero.liquid` |
| **Category**   | Hero                             |
| **Slug**       | `inline-image-hero`              |
| **Sort Order** | 3                                |

### Tags

Hero, Typography, Images

### Subtitle

A hero section with images embedded directly inside the heading text.

### Description

A bold hero section that lets you place images directly into your headline. Instead of a separate image area, the images sit inline with the text — matching the heading's line height — for a modern editorial look.

The section uses a **placeholder tag system**: type your heading into a standard text field and insert `[img1]`, `[img2]`, etc. wherever you want an image to appear. Each tag is automatically replaced with the corresponding Inline Image block's content. Below the heading, an optional rich text description and CTA buttons complete the section.

### Features

Inline Image System
Type [img1], [img2], etc. in the heading text field. Each tag is replaced with the matching Inline Image block, letting you place images anywhere within the headline.

Auto-Sized Images
Inline images automatically scale to match the heading's font size (0.85em height), so they stay proportional at any heading size and on any breakpoint.

Per-Button Colors
Each button block has its own base and hover color settings — background and text — for both filled and outline styles. Hover transitions smoothly across background, text, and border.

Customizability
Text alignment (left/center), separate heading and description size controls for desktop and mobile, adjustable content width per breakpoint, per-image optional URL links, and full section padding controls.

Accessibility
Semantic HTML with proper image alt attributes and ARIA labels on all interactive elements.

### How to Use

#### How to Use the Inline Image System

1. **Add Inline Image blocks.** In the Theme Customizer, add one or more "Inline Image" blocks to the section. Each block has an image picker, alt text, and an optional link.

2. **Write your heading with tags.** In the section's Heading field, type your text and insert `[img1]`, `[img2]`, etc. where you want each image to appear. The number corresponds to the order of your Inline Image blocks (first block = `[img1]`, second = `[img2]`, and so on).

   **Example input:**

   ```
   Long [img1] heading is what you see here in [img2] this section
   ```

3. **That's it.** The Liquid code scans the heading text for each `[imgN]` tag and replaces it with the rendered image (or a placeholder if no image is uploaded). Images automatically scale to match your heading's font size.

> **Tip:** You can use as many inline images as you want — just keep adding Inline Image blocks and corresponding `[imgN]` tags. If a tag has no matching block, it will simply render as plain text (the literal `[img3]` string).

---

## Section 3: Collage Hero

### Meta

| Field          | Value                       |
| -------------- | --------------------------- |
| **Name**       | Collage Hero                |
| **File Name**  | `props-collage-hero.liquid` |
| **Category**   | Hero                        |
| **Slug**       | `collage-hero`              |
| **Sort Order** | 4                           |

### Tags

Hero, Collage, Images

### Subtitle

A hero section with scattered, edge-anchored images around text and CTA buttons.

### Description

A visually striking hero section that frames your headline with a collage of images anchored to the edges of the section. Images are positioned using an anchor-based system — Left, Right, Top, or Bottom — so they stay locked to their respective edges regardless of viewport width, creating a consistent layout across all screen sizes.

Each image block includes separate width and position controls for desktop and mobile, plus a "Hide on Mobile" toggle for selectively removing images on smaller screens. When enabled, the hover effect scales images up 10% with a smooth ease transition — togglable from the section settings.

### Features

Anchor-Based Positioning
Each image snaps to an edge — Left, Right, Top, or Bottom — with X and Y offsets that control distance from the anchor. Images stay anchored as the viewport changes, keeping the collage balanced.

Separate Mobile Controls
Every image has independent width, X offset, and Y offset settings for mobile, plus a "Hide on Mobile" toggle to remove specific images on smaller screens.

Viewport Height Sizing
Section height is set in vh units (50–100vh) with separate desktop and mobile controls, so the hero always fills the right proportion of the screen.

Customizability
Adjustable border radius across all images, global hover toggle, per-button base and hover color controls, separate heading and description size controls for desktop and mobile, adjustable content width per breakpoint, and full section padding.

Accessibility
Semantic HTML with proper image alt attributes and ARIA labels on all interactive elements.

### How to Use

#### How to Position Images in the Collage

1. **Add Image blocks.** In the Theme Customizer, add one or more "Image" blocks to the section. Each block has an image picker, alt text, and an optional link.

2. **Choose an anchor.** Set the Anchor setting to Left, Right, Top, or Bottom. This locks the image to that edge of the section — it won't drift as the viewport resizes.

3. **Adjust offsets.** Use the X Offset and Y Offset sliders to position the image relative to its anchor. For example, a Left-anchored image with X: 5% and Y: 20% sits 5% from the left edge and 20% from the top.

4. **Configure mobile separately.** Each image has independent Mobile Width, Mobile X Offset, and Mobile Y Offset settings. Use the "Hide on Mobile" toggle to remove images that don't work on small screens.

5. **Layer your collage.** Add multiple images with different anchors to build a scattered, editorial layout around your headline.

> **Tip:** Start with 4–6 images anchored to different edges. Preview on both desktop and mobile, and use "Hide on Mobile" for any images that overlap or clutter the mobile layout.

---

---

# Gallery

---

## Section 4: Gallery Grid

### Meta

| Field          | Value                  |
| -------------- | ---------------------- |
| **Name**       | Gallery Grid           |
| **File Name**  | `props-gallery.liquid` |
| **Category**   | Gallery                |
| **Slug**       | `gallery-grid`         |
| **Sort Order** | 1                      |

### Tags

Gallery, Grid, Images

### Subtitle

A clean, responsive gallery with customizable layouts.

### Description

A responsive image gallery section that displays images in a clean grid format. Works with any Shopify theme — just paste the code into your sections folder and start adding images. The grid adapts between desktop and mobile with separate column and gap controls, and each image block supports an optional link and caption.

Captions can be displayed as a hover overlay or below the image, with independent font size and alignment controls. On mobile, enable swipe mode to convert the grid into a horizontal slider with pagination dots — perfect for product showcases or lookbooks.

The section loads with placeholder images so it looks polished out of the box. Add your own images and they replace the placeholders automatically.

### Features

Responsive Grid
Set 2–6 columns on desktop, 1–3 on mobile with separate column and gap controls for each breakpoint.

Aspect Ratio Control
Choose from Auto, Square (1:1), Portrait (2:3), Landscape (3:2), or Widescreen (16:9) for consistent image sizing across the grid.

Mobile Swipe Mode
Converts the grid into a horizontal carousel on mobile with pagination dots — great for product showcases and lookbooks.

Customizability
Independent grid gap and section padding for desktop and mobile. Caption display mode (hover overlay or below image), font size, alignment, background color, caption color, overlay color with opacity, and per-image links.

Accessibility
Semantic HTML with proper image alt attributes and ARIA labels on all interactive elements.

---

## Section 5: Slider Gallery

### Meta

| Field          | Value                         |
| -------------- | ----------------------------- |
| **Name**       | Slider Gallery                |
| **File Name**  | `props-slider-gallery.liquid` |
| **Category**   | Gallery                       |
| **Slug**       | `slider-gallery`              |
| **Sort Order** | 2                             |

### Tags

Gallery, Slider, Editorial

### Subtitle

A two-column section with a horizontal image slider.

### Description

A split-layout gallery section with a text panel on the left and a horizontal image slider on the right. Control the text column width, slide count (including fractional values like 1.5 for peek effects), slide gap, and typography. The text column supports rich text, so you can add paragraphs, bold text, or links.

On mobile, the text stacks above the slider and navigation arrows hide — users swipe naturally through images with touch. Optional pagination dots keep orientation clear. Each image block can optionally link to any URL.

### Features

Sticky Text Column
The text panel stays fixed on desktop while users scroll through slides, creating an editorial reading experience.

Fractional Slide Count
Show 1, 1.5, or 2 slides at once. Fractional values let the next image peek into view, hinting there's more to explore.

Responsive Layout
On mobile, text stacks above the slider and arrow buttons hide. Users swipe naturally and pagination dots keep orientation clear.

Customizability
Adjustable column split (30–70%), per-image links, slide gap, full desktop/mobile padding controls, and independent typography settings for heading and description.

Accessibility
Semantic HTML with ARIA labels on navigation elements and proper image alt attributes.

---

---

# Social Proof

---

## Section 6: Logo Showcase

### Meta

| Field          | Value                |
| -------------- | -------------------- |
| **Name**       | Logo Showcase        |
| **File Name**  | `props-logos.liquid` |
| **Category**   | Social Proof         |
| **Slug**       | `logo-showcase`      |
| **Sort Order** | 1                    |

### Tags

Logos, Grid

### Subtitle

Display logos in a responsive grid, in two layouts.

### Description

A flexible logo showcase section for displaying partner, client, or brand logos in a responsive grid. Features two layout modes — **Stacked** (heading above the grid) and **Inline** (heading beside the grid on desktop) — so it fits any page context.

Each logo block supports an optional image, alt text, link, and text label. When no image is uploaded, a unique SVG placeholder is displayed so the section always looks polished. The grayscale filter toggle applies a desaturated look to all logos, with logos transitioning smoothly back to full color on hover.

### Features

Two Layout Modes
Stacked (text above grid) or Inline (text beside grid on desktop) for flexible section positioning.

Responsive Grid
Set 2–8 columns on desktop and 1–3 on mobile with independent control over grid gaps and layout density.

Grayscale & Hover Effects
Apply a global grayscale toggle to all logos that returns to full color on hover for a sleek, interactive feel.

Customizability
Per-logo links and text labels, configurable logo size for desktop and mobile, section heading with rich text description, full padding, background, and text color controls.

Accessibility
Semantic HTML with proper image alt attributes and ARIA labels on linked elements.

---

## Section 7: Logo Ticker

### Meta

| Field          | Value                      |
| -------------- | -------------------------- |
| **Name**       | Logo Ticker                |
| **File Name**  | `props-logo-ticker.liquid` |
| **Category**   | Social Proof               |
| **Slug**       | `logo-ticker`              |
| **Sort Order** | 3                          |

### Tags

Logos, Ticker, Animated

### Subtitle

Display partner, client, or brand logos in a continuously scrolling ticker.

### Description

Logos scroll continuously in a horizontal ticker instead of sitting in a static grid — perfect for "trusted by" strips, partner bars, or client logo tapes that feel alive. The section retains both layout modes from Logo Showcase — **Stacked** (heading above the ticker) and **Inline** (heading beside the ticker on desktop).

Each logo block supports an optional image, alt text, link, and text label, with unique SVG placeholders when no image is uploaded. Ticker speed is set in pixels per second with separate desktop and mobile controls. Direction can be Left or Right, with an optional "Reverse on Mobile" toggle.

The grayscale filter toggle applies a desaturated look to all logos on both desktop and mobile. On desktop, logos smoothly transition back to full color on hover. The section respects `prefers-reduced-motion` and disables the animation for users who prefer reduced motion.

### Features

Two Layout Modes
Stacked (text above ticker) or Inline (text beside ticker on desktop) for flexible section positioning.

Ticker Controls
Configurable speed in pixels per second with separate desktop and mobile sliders, direction (left/right), optional mobile direction reversal, Pause on Hover, and draggable interaction.

Grayscale & Hover Effects
Apply a global grayscale toggle to all logos that returns to full color on hover for a sleek, interactive feel.

Customizability
Per-logo links and text labels, uniform logo height with separate desktop/mobile controls, gap slider, section heading and rich text description, full padding, background, and text color controls.

Accessibility
prefers-reduced-motion disables the ticker animation. Semantic HTML with ARIA labels on all interactive elements.

---

## Section 8: Testimonials Slider

### Meta

| Field          | Value                              |
| -------------- | ---------------------------------- |
| **Name**       | Testimonials Slider                |
| **File Name**  | `props-testimonials-slider.liquid` |
| **Category**   | Social Proof                       |
| **Slug**       | `testimonials-slider`              |
| **Sort Order** | 2                                  |

### Tags

Testimonials, Slider, Quotes

### Subtitle

A testimonial slider with image, quote, author info, and logo.

### Description

A polished testimonial section that displays one slide at a time in a two-column layout — a large image on the left and the quote, author, and logo on the right. On mobile, the layout stacks with navigation controls below the content area.

Each testimonial block includes an image, rich text quote, author name, position/company, and an optional logo with alt text. When no image is uploaded, a placeholder is displayed so the section always looks complete. Logos fall back to a unique SVG placeholder when empty.

Navigate between testimonials with arrow buttons, pagination dots, or swipe gestures on touch. Slides transition with a smooth fade effect. Arrow and dot visibility are togglable, and arrow button size is adjustable.

### Features

Split Image + Text Layout
A two-column desktop layout with the image on the left and content on the right. The image column width is adjustable (30–60%). On mobile, the columns stack vertically.

Arrow, Dot & Swipe Navigation
Toggle arrow buttons and pagination dots independently. Arrow button size is adjustable via a range slider. Swipe left or right on touch devices to navigate between testimonials.

Per-Slide Logo & Placeholder
Each slide supports an optional logo image with alt text. When no logo is uploaded, a unique SVG placeholder keeps the layout polished.

Customizability
Full desktop/mobile padding controls, column gap slider, image aspect ratio and border radius, independent font size sliders for quote (desktop/mobile), author name, and position text, color pickers for background, text, and the divider line between author info and logo.

Accessibility
Semantic HTML with ARIA labels on navigation elements and proper image alt attributes.

---

## Section 9: Looping Testimonials

### Meta

| Field          | Value                               |
| -------------- | ----------------------------------- |
| **Name**       | Looping Testimonials                |
| **File Name**  | `props-looping-testimonials.liquid` |
| **Category**   | Social Proof                        |
| **Slug**       | `looping-testimonials-ticker`       |
| **Sort Order** | 4                                   |

### Tags

Testimonials, Ticker, Animated

### Subtitle

An infinite-scrolling horizontal ticker of testimonial cards.

### Description

A continuously scrolling testimonial section that displays review cards in an infinite horizontal loop — similar to a logo ticker, but for full testimonial cards. Each card includes a logo/image at the top, a rich text quote, and an author area with an optional photo, name, and position.

The section supports a header area with a subtitle, heading, and description — all with independent desktop/mobile font sizes and alignment controls. Below the header, the testimonial cards scroll automatically with configurable speed and direction.

When no logo image is uploaded, a unique SVG placeholder keeps each card looking polished. Author photos are displayed as small circular avatars beside the name and position. The ticker uses the same infinite-loop engine as the Ticker and Logo Ticker sections — with Pause on Hover and draggable interaction.

### Features

Infinite Card Ticker
Testimonial cards scroll continuously in a horizontal loop with configurable speed (px/s), direction (left/right), and optional mobile direction reversal.

Header Section
An optional header area with subtitle, heading, and rich text description. Alignment (left/center) and font sizes are independently controllable for desktop and mobile.

Pause on Hover & Draggable
Stops the ticker when a desktop user's cursor enters the testimonials area, resuming on mouse leave. Enable manual dragging and swiping on touch and desktop.

Customizability
Card width (desktop/mobile), border radius, gap between cards (desktop/mobile), logo image height, card colors (background, border), background and text color pickers, and subtitle color control.

Accessibility
prefers-reduced-motion disables the ticker animation. Semantic HTML throughout with proper image alt attributes.

---

---

# Interactive

---

## Section 10: Ticker

### Meta

| Field          | Value                 |
| -------------- | --------------------- |
| **Name**       | Ticker                |
| **File Name**  | `props-ticker.liquid` |
| **Category**   | Interactive           |
| **Slug**       | `ticker`              |
| **Sort Order** | 3                     |

### Tags

Ticker, Marquee, Animated

### Subtitle

Infinite-scrolling horizontal ticker for images, text, or a mix of both.

### Description

A full-width infinite-loop ticker that continuously scrolls content horizontally. Supports two block types — **Image** and **Text** — so you can build image-only logo tapes, text marquees, or mixed layouts in any combination.

Speed is set in pixels per second with separate desktop and mobile controls. Direction can be Left or Right, with an optional "Reverse on Mobile" toggle. Image blocks support optional alt text and links; text blocks support optional links and a separator character (e.g., `·` or `—`) between items.

### Features

Image & Text Blocks
Add image blocks with optional alt text and links, text blocks with optional links, or mix both types in any order for maximum flexibility.

Speed & Direction Control
Set scroll speed in pixels per second with separate desktop and mobile sliders. Choose Left or Right direction with an optional mobile reversal toggle.

Pause on Hover & Draggable
Stops the infinite scroll when a desktop user's cursor enters the section, resuming on mouse leave. Enable manual dragging and swiping — the cursor changes to a grab icon automatically.

Customizability
Uniform item height with separate desktop/mobile controls, configurable gap between items, text size (desktop/mobile), text separator character, background color, and text color.

Accessibility
prefers-reduced-motion disables the ticker animation. ARIA labels on all interactive elements and semantic HTML throughout.

---

## Section 11: Before/After Slider

### Meta

| Field          | Value                       |
| -------------- | --------------------------- |
| **Name**       | Before/After Slider         |
| **File Name**  | `props-before-after.liquid` |
| **Category**   | Interactive                 |
| **Slug**       | `before-after-slider`       |
| **Sort Order** | 2                           |

### Tags

Comparison, Slider, Interactive

### Subtitle

An interactive image comparison slider with draggable handle.

### Description

A side-by-side image comparison section that lets users drag a handle to reveal the difference between two images. Upload a "Before" image (left) and an "After" image (right), and the slider handle controls how much of each is visible.

The handle features a circular grip with directional arrows and a vertical divider line — all colored via a single Handle Color setting. On first scroll into view, the handle animates from the left edge to its configured starting position with a smooth cubic-bezier transition, drawing attention to the interactive element.

Optional "Before" and "After" labels appear at the bottom of their respective sides with a subtle fade-in. Labels hide while the user is actively dragging the handle, reappearing when the interaction ends. Label text color and background color are independently controllable.

### Features

Draggable Comparison Handle
A vertical handle with a circular grip and directional arrows. Drag with mouse or touch to reveal the before/after difference. Includes keyboard arrow key support.

Entrance Animation
On first scroll into view, the handle smoothly animates from the edge to its starting position using an IntersectionObserver, creating a polished reveal moment.

Customizable Labels
Toggle "Before" and "After" labels with custom text, independent desktop/mobile font sizes, and separate text and background color controls. Labels fade out during interaction.

Customizability
Set the initial slider position (10–90%), choose from multiple aspect ratios (Auto, Square, Portrait, Landscape, Widescreen, Standard), adjustable border radius, full desktop/mobile padding controls, background color, and handle color.

Accessibility
Semantic ARIA slider role with aria-valuenow, aria-valuetext, and keyboard navigation with arrow keys. prefers-reduced-motion disables the entrance animation.

---

---

# Content

---

## Section 12: Timeline

### Meta

| Field          | Value                   |
| -------------- | ----------------------- |
| **Name**       | Timeline                |
| **File Name**  | `props-timeline.liquid` |
| **Category**   | Content                 |
| **Slug**       | `timeline`              |
| **Sort Order** | 4                       |

### Tags

Timeline, Milestones, Scroll

### Subtitle

A vertical timeline with event blocks — perfect for brand stories, project milestones, or company history.

### Description

A vertical timeline section for telling your brand's story, showcasing project milestones, or mapping out company history. Each event block includes a date label, heading, description, and an optional image — arranged along a central vertical line with dot markers.

As the user scrolls, a progress bar fills downward to highlight the current position in the timeline. The first event supports a full-width image for visual emphasis, while subsequent events use a compact image layout. The section loads with placeholder content so it looks polished out of the box.

### Features

Scroll-Driven Progress Bar
A vertical progress line fills smoothly as the user scrolls through the timeline, with dot markers highlighting each event. Uses requestAnimationFrame for lag-free performance.

Event Blocks
Each event includes a date/label, heading, rich text description, and optional image. The first event supports a full-width image; subsequent events use a smaller format.

Responsive Layout
Events stack cleanly on mobile with adjusted spacing and image sizing. The progress bar and dots adapt proportionally to the mobile viewport.

Customizability
Independent heading and description font sizes for desktop and mobile, adjustable progress bar and dot colors, background and text color pickers, and full section padding controls.

Accessibility
Semantic HTML with proper heading hierarchy and image alt attributes. prefers-reduced-motion support for the scroll-driven progress animation.

---
