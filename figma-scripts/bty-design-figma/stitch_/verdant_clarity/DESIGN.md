---
name: Verdant Clarity
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#3d4947'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#6d7a77'
  outline-variant: '#bcc9c6'
  surface-tint: '#006a62'
  primary: '#006860'
  on-primary: '#ffffff'
  primary-container: '#008379'
  on-primary-container: '#f3fffc'
  inverse-primary: '#68d8cc'
  secondary: '#006d32'
  on-secondary: '#ffffff'
  secondary-container: '#4dfe8a'
  on-secondary-container: '#007235'
  tertiary: '#2a655f'
  on-tertiary: '#ffffff'
  tertiary-container: '#457e77'
  on-tertiary-container: '#f4fffc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#86f5e8'
  primary-fixed-dim: '#68d8cc'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#00504a'
  secondary-fixed: '#64ff92'
  secondary-fixed-dim: '#23e373'
  on-secondary-fixed: '#00210b'
  on-secondary-fixed-variant: '#005224'
  tertiary-fixed: '#b3eee5'
  tertiary-fixed-dim: '#97d2c9'
  on-tertiary-fixed: '#00201d'
  on-tertiary-fixed-variant: '#0e4f49'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.05em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 4px
  container-padding-mobile: 20px
  container-padding-desktop: 40px
  gutter: 16px
  stack-sm: 8px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

The design system is anchored in a philosophy of "Organic Precision." It balances the technical reliability of a health-tracking utility with the vibrant, refreshing energy of hydration. The aesthetic is **Modern Minimalism** infused with **Glassmorphism**, creating a sense of airiness and depth.

The target audience seeks a professional yet motivating tool to manage their wellness. To evoke an emotional response of clarity and vitality, the UI utilizes expansive whitespace, high-quality typography, and tactile, soft-edged components. Every interaction should feel as fluid and effortless as water.

## Colors

The palette is dominated by a lush green gradient, symbolizing growth and health. 

- **Primary & Secondary**: Used for high-impact actions, progress indicators, and brand moments. The transition from `#11998e` to `#38ef7d` provides a dynamic energy that guides the eye.
- **Neutral**: The background is strictly `#fafafa`, providing a clean, "clinical-fresh" canvas that allows the greens to pop without causing eye strain.
- **Functional Colors**: Use subtle tints of the primary green for success states. For warnings or alerts, use a soft coral to maintain the naturalistic feel without breaking the harmony.

## Typography

This design system utilizes **Plus Jakarta Sans** for its modern, friendly, and geometric proportions. The typeface offers excellent legibility at small sizes while remaining expressive in large headlines.

- **Hierarchy**: Use tight tracking for large displays to create a "locked-in" editorial look. Increase line heights for body text to ensure the interface feels breathable.
- **Contrast**: High visual hierarchy is achieved by pairing `display-lg` headings in semi-bold or bold weights with `body-md` in regular weights.
- **Usage**: Use `label-sm` in all-caps for category headers or small metadata to distinguish them from interactive body text.

## Layout & Spacing

The layout follows a **Fluid Grid** model with generous margins to reinforce the minimalist aesthetic.

- **Breakpoints**: 
    - Mobile: 0 - 599px (4 columns, 20px margins)
    - Tablet: 600px - 1023px (8 columns, 32px margins)
    - Desktop: 1024px+ (12 columns, max-width 1280px)
- **Spacing Rhythm**: A 4px baseline grid ensures consistent vertical rhythm. Use `stack-md` (24px) for most component spacing to maintain a light, airy feel.
- **Safe Areas**: Elements should never touch the edge of the screen; the 20px mobile padding is a hard minimum.

## Elevation & Depth

Visual hierarchy is managed through a combination of **Tonal Layers** and **Glassmorphism**.

1.  **Surfaces**: The base is `#fafafa`. Primary cards sit on top in pure white `#ffffff`.
2.  **Shadows**: Use "Verdant Shadows"—soft, highly diffused shadows with a subtle green tint (`rgba(17, 153, 142, 0.08)`). These should feel like ambient light passing through liquid.
3.  **Glassmorphism**: Navigation bars and floating action buttons use a backdrop-blur (20px) with a semi-transparent white fill (opacity 70%). This maintains context of the content scrolling underneath.
4.  **Interaction**: On tap/hover, shadows should expand slightly and shift downward to simulate physical lift.

## Shapes

The shape language is defined by **Large Rounded Corners**, echoing the organic curves of droplets and vessels.

- **Cards & Containers**: Use a radius between 20px and 28px. 24px is the standard for main content blocks.
- **Interactive Elements**: Buttons and input fields should utilize a 24px radius to match the cards.
- **Small Elements**: Chips and tags should use the `pill` (999px) shape for maximum softness and distinction from structural containers.

## Components

- **Buttons**: Primary buttons use the `gradient_primary`. Text is white for high contrast. Secondary buttons use a subtle green border with a transparent fill. All buttons have a minimum height of 56px for touch accessibility.
- **Cards**: Pure white backgrounds with the 24px corner radius and soft green shadows. Content within cards should have at least 24px of internal padding.
- **Glass Navigation**: The bottom navigation bar uses a 20px backdrop blur with a 1px top border in `rgba(255, 255, 255, 0.3)`. Icons use the primary green for active states.
- **Input Fields**: Soft grey backgrounds (`#f0f0f0`) that transition to a 1.5px primary green border on focus. Large 24px corner radius.
- **Progress Indicators**: Circular or bar-based indicators must use the primary-to-secondary gradient to represent "fullness" or "completion."
- **Chips**: Small, pill-shaped markers used for beverage types (e.g., Water, Tea, Coffee). Use low-opacity primary green backgrounds with dark green text.