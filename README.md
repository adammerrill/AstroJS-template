# Astro 5 Enterprise Boilerplate

![Astro](https://img.shields.io/badge/Astro-5.0-FF5D01?style=flat&logo=astro)
![Svelte](https://img.shields.io/badge/Svelte-5.0-FF3E00?style=flat&logo=svelte)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=flat&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

## 📖 Overview

This repository hosts a high-performance, enterprise-grade web application boilerplate built with **Astro 5**. It is architected for scalability, hybrid rendering, and visual content management.

The project combines the raw performance of Astro's server-side rendering (SSR) with **Svelte 5's** next-generation reactivity for interactive islands. It features a robust UI system based on **Tailwind CSS v4** and **Shadcn/UI** architecture, all powered by **Storyblok** as a Headless CMS.

### ✨ Key Features

* **⚡️ Astro 5 Hybrid Rendering:** Optimized for speed with Server-Side Rendering (SSR) via the Vercel Adapter.
* **🔥 Svelte 5 Reactivity:** Utilizes the latest Svelte runes and reactivity model for interactive UI components.
* **XR Tailwind CSS v4:** Implements the latest zero-runtime CSS engine with native CSS variable theming and dark mode support.
* **CMS Storyblok Integration:** Seamless content fetching with a live Visual Editor and dynamic component mapping.
* **🎨 Shadcn/UI Architecture:** Uses `clsx` and `tailwind-merge` for type-safe, reusable component styling.
* **🧪 Testing & Performance:** Pre-configured with **Playwright** for E2E testing and **Partytown** for third-party script offloading.
* **🗺️ SEO Ready:** Automatic sitemap generation and metadata handling.

---

## 🛠 Prerequisites

Ensure your development environment meets the following requirements:

* **Node.js:** v18.17.0 or higher.
* **Package Manager:** `pnpm` (Preferred, lockfile included).
* **Storyblok Account:** Required for content management.

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone [https://github.com/adammerrill/AstroJS-template.git](https://github.com/adammerrill/AstroJS-template.git)
cd AstroJS-template
```

### 2. Install Dependencies

This project uses `pnpm` to ensure strict dependency management.

```bash
pnpm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory.

```bash
cp .env.example .env
```

Configure the following variables (required for the `astro.config.mjs` loader):

```env
# Base URL used for sitemap generation and canonical URLs
SITE_URL="http://localhost:4321"

# Storyblok Access Token (Settings -> Access Tokens -> Preview)
STORYBLOK_TOKEN="your_storyblok_preview_token"
```

> **Security Note:** The `.env` file is excluded from git via `.gitignore`.

### 4. Start Development Server

Launch the local development server with Hot Module Replacement (HMR).

```bash
pnpm dev
```

Access the application at `http://localhost:4321`.

-----

## 📂 Project Structure

The project follows a strict modular architecture:

```text
/
├── public/              # Static assets (favicons, robots.txt)
├── src/
│   ├── assets/          # Optimized assets (SVGs, Images)
│   ├── components/      # UI Components (Header, Footer, Shadcn primitives)
│   ├── layouts/         # Global layouts (Layout.astro)
│   ├── lib/             # Utilities (cn helper for Tailwind)
│   ├── pages/           # Astro routes & Storyblok [...slug] entry point
│   ├── storyblok/       # Svelte components mapped to CMS blocks
│   └── styles/          # Global CSS, Tailwind directives, & Theme vars
├── astro.config.mjs     # Configuration for Integrations & Vercel Adapter
├── components.json      # Shadcn/UI configuration
└── package.json         # Project dependencies
```

-----

## 🧩 Component Architecture

### 1. Storyblok Mapping (`astro.config.mjs`)

Storyblok blocks are dynamically mapped to local components. When you create a "teaser" block in the CMS, Astro automatically resolves it to `src/storyblok/Teaser.astro` (or Svelte).

```javascript
// astro.config.mjs
components: {
  'page': 'storyblok/Page',
  'feature': 'storyblok/Feature',
  'grid': 'storyblok/Grid',
}
```

### 2. Interactive Islands (Svelte 5)

Standard UI components are static by default. To make a Storyblok component interactive (hydrate on the client), utilize Astro's island directives in your wrapper:

```astro
<FeatureSvelte blok={blok} client:load />
```

### 3. Styling System

The project uses a sophisticated CSS variable system defined in `src/styles/global.css`. It supports:

  * **Dark Mode:** Automatically adapts based on `prefers-color-scheme` or class strategy.
  * **Glassmorphism:** Pre-defined blur and opacity variables.
  * **Animations:** Custom keyframes and transitions.

-----

## 📜 Scripts

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Starts the local development server. |
| `pnpm build` | Builds the project for production (Vercel adapter). |
| `pnpm preview` | Previews the production build locally. |
| `pnpm astro check` | Runs TypeScript and Astro diagnostics. |
| `npx playwright test` | Runs End-to-End tests. |

-----

## ☁️ Deployment

The project is pre-configured for **Vercel** serverless deployment via `@astrojs/vercel`.

1.  Push code to your git repository.
2.  Import the project into Vercel.
3.  **Important:** Add the `STORYBLOK_TOKEN` in the Vercel Project Settings \> Environment Variables.
4.  Deploy.

-----

## 📄 License

Copyright (c) 2025. Licensed under the MIT License.
