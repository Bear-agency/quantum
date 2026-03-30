# QUANTUM — landing (static)

This project is plain **HTML**, **CSS**, and **JavaScript** (no framework). It reproduces the previous Next.js landing page: layout, styling, scroll-reveal, mobile nav, FAQ accordion, and testimonial carousel.

## Structure

- `index.html` — page markup
- `css/styles.css` — design tokens, global styles, and component styles (merged from the former `globals.css` + `page.module.scss`)
- `js/main.js` — interactions (smooth scroll, mobile menu, `IntersectionObserver` reveals, FAQ, testimonials, final CTA alert)
- `assets/` — `quantum-logo.png`, `hero-left.png`, `hero-right.png`

## Local preview

Because the page loads Google Fonts and uses normal asset paths, serve the folder over HTTP (opening `index.html` as a `file://` URL may work but is fragile):

```bash
cd european-fintech
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Editing

- **Copy / layout:** edit `index.html`
- **Look & feel:** edit `css/styles.css`
- **Behavior:** edit `js/main.js` (testimonial copy lives in the `testimonials` array there)
