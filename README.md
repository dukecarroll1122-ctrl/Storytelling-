# Storytelling

A creative writing platform for novelists, screenwriters, comic writers and game designers. One app, every kind of story.

**Live app: https://storytelling-production.up.railway.app**

![Storytelling landing page](docs/screenshots/landing-desktop.png)

## Features

- **Every kind of story** — Novel (chapters, acts, scenes), Comic (issues, pages, panels), TV Show (seasons, episodes), Movie (acts, sequences) and Game (quests, dialogue) project types.
- **Rich text editor** — Tiptap-based writing environment with full formatting, focus mode and typewriter scrolling.
- **Cloud sync** — projects and documents are saved to a backend and available on every device.
- **AI writing assistant** — brainstorm, improve scenes and find plot holes.
- **Export anywhere** — compile your manuscript to PDF, DOCX or EPUB.
- **Desktop app** — packaged with Tauri alongside the web build.

### Pricing tiers

| Plan | Price | Includes |
| --- | --- | --- |
| Free | $0 | 3 projects, all project types, PDF/DOCX/EPUB export |
| Pro | $10 / month | Unlimited projects, cloud sync, AI assistant |
| Outright | $20 one time | Unlimited projects, cloud sync, no subscription |

## Inside the app

Pick a project type or reopen a recent project from the home screen:

![Storytelling home screen with project types and recent projects](docs/screenshots/app-home.jpg)

Then write in the editor, with the binder on the left and synopsis, notes and history on the right:

![Storytelling editor with binder, toolbar and synopsis panel](docs/screenshots/app-editor.jpg)

## Responsive landing page

The landing page is fully responsive, with accessible focus states and reduced-motion support.

<img src="docs/screenshots/landing-mobile.png" alt="Storytelling landing page on a phone-width screen" width="300" />

## Recent improvements

- **Landing page refactor** — moved inline styles into `Landing.css`, replaced emoji icons with SVG icons, and fixed a bug where the global `overflow: hidden` stopped the page from scrolling.
- **Responsive layout** — breakpoints at 768px and 420px; the features grid collapses to one column and the hero buttons stack on small phones.
- **Accessibility** — visible hover and `:focus-visible` states, improved text contrast, and `prefers-reduced-motion` support.
- **Rest of the app** — the home screen uses CSS classes with keyboard-navigable controls, SVG icons across the remaining screens, and the editor shell is responsive on tablet and mobile.
- **Dev-only demo mode** — `?demo` bypasses sign-in locally (see above), used to capture the screenshots in this README.

## Tech stack

- [React 19](https://react.dev) + [Vite](https://vite.dev)
- [Clerk](https://clerk.com) for authentication
- [Stripe](https://stripe.com) for payments
- [Tiptap](https://tiptap.dev) for the editor
- `jspdf`, `docx` and `epub-gen-memory` for export
- [Tauri](https://tauri.app) for the desktop build

## Getting started

```bash
npm install
```

Create a `.env` file in the project root:

```bash
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

Then start the dev server at http://localhost:5173:

```bash
npm run dev
```

### Demo mode (development only)

To explore the app without signing in, open `http://localhost:5173/?demo` while running `npm run dev`. It skips Clerk with a fake `demo-user` and **never writes to the backend**, so nothing you do reaches the real database. It is gated on `import.meta.env.DEV`, so production builds strip it out. The bypass lives in `src/useAppUser.js`.

Demo mode reads projects from `localStorage`, so seed a few sample projects there if the home screen is empty.

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## Project structure

```
src/
  Landing.jsx      Landing page for signed-out visitors
  Home.jsx         Project dashboard
  Editor.jsx       Writing editor
  Sidebar.jsx      Project navigation
  Outline.jsx      Outline view
  Corkboard.jsx    Corkboard view
  CharacterSheet.jsx
  AIAssistant.jsx  AI writing assistant
  Compile.jsx      PDF / DOCX / EPUB export
  Pricing.jsx      Plans and checkout
  api.js           Backend API client
src-tauri/         Tauri desktop shell
docs/screenshots/  README images
```

## Author

Built by Randy Carroll.
