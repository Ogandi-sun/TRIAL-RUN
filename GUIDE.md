# JOB PATH – Revision Guide

Your personal reference for how the site is built: folder layout, the libraries, every CSS idea and every piece of JavaScript.

---

## 1. Folder structure

```
jobpath/
├── index.html              Home page
├── jobs.html               Job listings (search, filter, save, apply)
├── about.html              About page
├── contact.html            Contact form
├── login.html              NEW – log in
├── register.html           Job-seeker sign-up
├── register-employer.html  Employer sign-up
├── 404.html                NEW – "page not found"
├── GUIDE.md                This file
└── assets/
    ├── css/
    │   ├── style.css       Theme, layout, header/footer, page styles
    │   └── uiverse.css     Uiverse-style buttons, inputs, cards, loader
    ├── js/
    │   ├── layout.js       Shared header + footer + small page effects
    │   └── main.js         Forms, validation, jobs page logic
    └── img/
        ├── logo.jpeg
        └── favicon.svg     Browser-tab icon
```

**To view the site:** double-click `index.html`. You need internet because the libraries load from CDNs (links to files hosted online).

**Order matters.** In every `<head>` the stylesheets load: Bootstrap → Icons → Font → `style.css` → `uiverse.css`. Later files win when two rules conflict, which is why your CSS comes after Bootstrap.

---

## 2. Libraries used

| Library | What it gives you | How it's loaded |
|---|---|---|
| **Bootstrap 5.3.3** | Grid (`row`, `col-*`), navbar, modal, toast, accordion, dropdown, badges, spacing helpers (`mb-3`, `py-5`), form validation styles | CSS `<link>` in `<head>` + JS `<script>` before `</body>` |
| **Bootstrap Icons 1.11.3** | Icons: `<i class="bi bi-search"></i>` | CSS `<link>` |
| **Google Fonts – Poppins** | The font used everywhere (same as your logo) | CSS `<link>` |
| **Uiverse (style)** | Eye-catching buttons, inputs, cards, checkbox, loader | Copied CSS, stored in `uiverse.css` |

### About Uiverse
Uiverse (uiverse.io) is **not** a library you install. It's a gallery: you find an element, click it, copy its HTML and CSS, and paste them into your project. I wrote the components in `uiverse.css` in that same spirit (pure CSS, no JS). To add more:
1. Open uiverse.io, choose an element, copy the CSS into the bottom of `uiverse.css`.
2. Copy the HTML where you want it.
3. Prefix the class names with `uv-` so they don't clash with Bootstrap.

### Why Bootstrap's JS file?
`bootstrap.bundle.min.js` powers the mobile menu button, dropdown, modal, accordion and toasts. Without it these do nothing. "Bundle" means it already includes Popper (used for dropdown positioning).

### Bootstrap classes you'll see most
- **Grid:** `container` → `row` → `col-md-4` (12 columns; `md` = from tablets up)
- **Spacing:** `m`/`p` + side (`t b s e x y`) + size 0–5. `mb-3` = margin-bottom, `py-5` = padding top and bottom
- **Flex:** `d-flex`, `justify-content-between`, `align-items-center`, `gap-3`
- **Text:** `text-center`, `text-secondary`, `fw-bold`, `lead`, `display-5`, `small`
- **Visibility:** `d-none` (hide), `d-lg-block` (show from large screens)
- **Components:** `navbar`, `modal`, `toast`, `accordion`, `badge`, `dropdown`, `nav nav-pills`

---

## 3. CSS explained

### 3.1 CSS variables (the theme)
```css
:root { --jp-indigo: #4f46e5; }
.hero { background: var(--jp-indigo); }
```
Define a colour once in `:root`, reuse it with `var(--name)`. Change one line and the whole site recolours. Variables starting `--bs-` are Bootstrap's own; we overwrite a few so Bootstrap's blue becomes your indigo.

### 3.2 `style.css` section by section
| Section | Key ideas |
|---|---|
| Theme | Palette from the logo: indigo `#4f46e5`, cyan `#06b6d4`, navy `#0f172a`, gold `#ffb627` |
| Base | `scroll-behavior: smooth`; `:focus-visible` outline for keyboard users; `.skip-link` |
| Header | `sticky-top` keeps the navbar visible; `backdrop-filter: blur()` frosted glass; `.nav-link.active::after` draws the underline on the current page |
| Hero | `linear-gradient(135deg, …)` diagonal gradient; `clip-path: polygon(...)` cuts the slanted bottom edge |
| Sections | `.section` (vertical padding), `.section-alt` (light grey band), `.cta-band` |
| Cards/Steps | `.icon-wrap` uses `display: grid; place-items: center` to centre an icon; `.path-row::before` draws the dashed "road" with `border-top: 4px dashed` |
| Forms | `.auth-wrap` centres the card with `display: grid; place-items: center` |
| Footer | Navy background; `.back-to-top` is `position: fixed` and fades in via a `.show` class |
| Utilities | `.reveal` fades elements in on scroll |
| Responsive | `@media (max-width: 575.98px) { … }` applies only on phones |

### 3.3 Techniques worth memorising
- **`::before` / `::after`**: pseudo-elements add decoration without extra HTML. They need `content: ""`.
- **`position: relative` on a parent + `position: absolute` on a child** places the child inside the parent (used for the password eye, step badges, button shine).
- **`transition`**: smooth change between states (`transition: transform .2s`). Used for hover effects.
- **`transform: translateY(-6px)`**: moves an element without affecting layout. Used for hover lift.
- **`@media (prefers-reduced-motion: reduce)`**: switches animations off for people who are sensitive to motion. Good accessibility habit.
- **Specificity**: `.jp-navbar .nav-link` beats `.nav-link`. Avoid `!important`: your old files used it (e.g. `h1 { color: black !important }`), which made the hero title unreadable.

### 3.4 `uiverse.css` components
| Class | Use | Trick |
|---|---|---|
| `.uv-btn` | Main gradient button | A `::before` strip slides across on hover (`left: -100% → 140%`) |
| `.uv-btn-gold` | Gold variant | Add alongside `.uv-btn` |
| `.uv-btn-outline` | Outline button | `::before` scales from 0 to 1 (`scaleX`) to "fill" |
| `.uv-field` | Input with floating label | `placeholder=" "` + `:not(:placeholder-shown)` detects "has text" so the label floats |
| `.uv-card` | Hover-lift card with glowing border | `::after` gradient with `inset: -2px` shown on hover |
| `.uv-check` | Animated checkbox | Real checkbox hidden; `span` drawn instead; `input:checked + span` styles it |
| `.uv-loader` | Bouncing dots | `@keyframes` + `animation-delay` per dot |

**Floating-label input pattern (copy this):**
```html
<div class="uv-field">
  <input type="text" id="x" placeholder=" " required>
  <label for="x">Label</label>
  <span class="invalid-msg">Error text</span>
</div>
```
The `+` selector means "the element immediately after", which is why the `<label>` must come right after the `<input>`.

---

## 4. HTML structure (same on every page)

```html
<body data-page="jobs">          ← tells layout.js which menu link to highlight
  <div id="site-header"></div>   ← filled by layout.js
  <main id="main"> … </main>     ← the page content
  <div id="site-footer"></div>   ← filled by layout.js
  <script …bootstrap…></script>
  <script src="assets/js/layout.js"></script>
  <script src="assets/js/main.js"></script>
</body>
```
- **Semantic tags** (`header`, `main`, `section`, `footer`, `nav`) help screen readers and search engines.
- **`<label for="id">`** must match the input's `id`. Never reuse an `id` on one page (your old register page used `exampleInputEmail1` twice).
- **`autocomplete`** attributes let browsers autofill (`email`, `name`, `new-password`…).
- **One `<h1>` per page**, then `h2`, `h3` in order.
- **`<meta name="description">`** is the text Google shows under your page title.

---

## 5. JavaScript explained

### `layout.js` – shared header & footer
- Runs immediately in an **IIFE** `(function () { … })();` so its variables stay private.
- Builds the header and footer as strings and sets `element.innerHTML`.
- `document.body.getAttribute("data-page")` reads which page we're on; `.map()` builds the menu and adds `active` to the matching link.
- `window.addEventListener("scroll", …)` shows the back-to-top button after 400px.
- `IntersectionObserver` fires when an element enters the screen, which adds the `in-view` class for the fade-in.
- To change the menu: edit the `links` array at the top. To change the footer: edit `footerHTML`.

### `main.js` – behaviour

**1. `showToast(message, type)`**: creates a Bootstrap Toast. `type` is a Bootstrap colour (`success`, `danger`, `primary`). Uses `textContent` (not `innerHTML`) for the message so user text can't inject HTML.

**2. Form validation**
```html
<form class="needs-validation" novalidate data-success="Saved!" data-redirect="jobs.html">
```
- `novalidate` stops the browser's default pop-ups so we can show our own styling.
- On submit: `e.preventDefault()` → `form.checkValidity()` asks the browser if all `required`, `type="email"`, `minlength` rules pass.
- If invalid: add `was-validated` (CSS then shows red/green), focus the first bad field.
- If valid: show toast, reset form, optionally redirect after 1.5 s.
- `data-*` attributes let HTML pass settings to JS (`form.dataset.success`).

**3. File checks**: `input.files[0].size` is in bytes. `setCustomValidity("message")` marks the field invalid; `setCustomValidity("")` clears it.

**4. Password helpers**
- Eye button toggles `input.type` between `password` and `text`.
- `data-match="#rPassword"` makes the confirm field invalid unless it equals the original.

**5. Jobs page**
- **`JOBS` array**: your data. Add an object to add a job; the page redraws itself. (Before, you copy-pasted ~25 lines of HTML per job.)
- `renderJobs()`: `JOBS.map(...)` turns each object into a card string; `.join("")` glues them together.
- `applyFilters()`: for each card, show it only if it matches the active pill **and** the search text; `classList.toggle("d-none", !show)` hides/shows.
- **Event delegation**: one click listener on the grid handles every bookmark button (`e.target.closest(".save-btn")`). Works even though cards are re-created.
- **localStorage**: saves bookmarked job ids in the browser (`localStorage.setItem` / `getItem`). Data must be strings → `JSON.stringify` / `JSON.parse`. Wrapped in `try/catch` because private windows can block it.
- **Modal**: Bootstrap fires `show.bs.modal`; `event.relatedTarget` is the button that opened it, so we read its `data-job`.

### JavaScript vocabulary
`const/let` (variables) · `function` · `forEach` / `map` (loop over lists) · `querySelector` / `querySelectorAll` (find elements) · `addEventListener` (react to clicks, typing) · `classList.add/remove/toggle` · `dataset` (read `data-*`) · `textContent` vs `innerHTML`.

---

## 6. Bugs fixed from your original files

| File | Problem | Fix |
|---|---|---|
| `about.html` | Git merge-conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`) pasted into the HTML; duplicate `</head>`; unclosed `<p class="lead">` | Cleaned and rebuilt |
| `contact.html` | No `<body>` tag; `type=" text"` (space) so the input wasn't a text input | Added body; fixed type |
| `register.html` | Two `<body>` tags; stray `</p>`; duplicate ids; form never closed; used Bootstrap classes without loading Bootstrap | Rebuilt |
| `register_employer.html` | Form had no Submit button and was never closed; mismatched ids/`for`; `<p>` wrapping `<div>` (invalid) | Rebuilt with validation |
| `jobs-full-1.html` | **Two navbars and two footers** on one page; Bootstrap classes mixed with custom `nav` | One header, one footer |
| `home.html` | Page cut off: missing `</body>`/`</html>`, no script content; register links went to `#`; "Jobs" pointed to a missing page | Merged into `index.html` with real links |
| `index.html` | Empty page (header + footer only) | Added hero, features, steps, CTA |
| `style.css` | Referenced by 4 pages but **did not exist** | Created |
| `style2.css` | Hero title forced black with `!important` on a dark gradient; `.footer` rule never matched (footer had no such class); odd `lch()` colour; unused styles | Replaced by a clean theme |
| All pages | Menu links with `href="#"`; different nav/footer on each page; two CSS files, two icon libraries (Font Awesome + Bootstrap Icons) | One menu, one footer, one icon set |
| `logo.jpeg` | Referenced but not beside the HTML | Moved to `assets/img/` |

---

## 7. What I added that was missing

- **Login page** (the Register menu had nowhere to go back to) and a **404 page**
- **Show/hide password**, **confirm-password** check, minimum password length
- **Real form validation** with friendly error messages on every form
- **Save job (bookmark)** + "Saved" filter + live job count
- **CV file checks** (type and 5 MB limit)
- **Accessibility**: skip link, visible focus outline, `aria-label`s, `aria-current` on the active menu item, reduced-motion support
- **SEO basics**: unique `<title>` and meta description per page, favicon
- **Back-to-top button**, scroll fade-ins, auto-updating copyright year
- **Mobile menu** on every page (before only `home.html` had it)

---

## 8. Next steps (what the site still can't do)

Right now everything is **front-end only**: forms are validated and show a success message, but nothing is sent or stored.

1. **Make the contact form send email**: easiest is a form service such as Formspree or EmailJS. Change `<form>` to post to their URL.
2. **Real accounts and applications** need a back-end (Node/Express, Django, PHP, or a service like Firebase/Supabase). Never store passwords in `localStorage`.
3. **Resume upload + AI matching** (what About promises) needs a server and an AI/matching service.
4. **Employer features**: a "Post a job" page and an employer dashboard.
5. **Placeholders to replace:** the footer social links (`#`), the email `info@jobpath.example`, and the "terms and privacy policy" text (no policy pages exist yet).
6. **Hosting for free:** GitHub Pages, Netlify or Vercel. Upload the `jobpath` folder.
7. **Privacy:** you collect personal data (CVs, emails). Write a privacy policy before going live.

### Practice ideas
- Add a 6th job to the `JOBS` array.
- Change `--jp-gold` and watch where it appears.
- Add a "Location" field to each job and show it on the card.
- Add a dark-mode toggle using Bootstrap's `data-bs-theme="dark"` on `<html>`.
