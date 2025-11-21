# Astro 5 Enterprise Boilerplate

**Version:** 1.0.0
**Status:** Stable
**License:** MIT

## 📖 Overview

This repository hosts a high-performance, enterprise-grade web application boilerplate built with **Astro 5**. It is architected for scalability, utilizing **Svelte 5** for reactive components, **Tailwind CSS v4** for styling, and **Storyblok** as a Headless CMS.

### Key Features
* [cite_start]**Astro 5:** Server-side rendering (SSR) with static site generation (SSG) capabilities via Vercel Adapter[cite: 75].
* [cite_start]**Svelte 5:** Next-generation reactivity for interactive UI components[cite: 82].
* [cite_start]**Tailwind CSS v4:** Modern, zero-runtime utility-first CSS[cite: 49].
* [cite_start]**Storyblok CMS:** Integrated dynamic content fetching and visual editing[cite: 32, 74].
* [cite_start]**TypeScript:** Strict type safety enabled for enterprise robustness[cite: 82].

---

## 🛠 Prerequisites

Ensure your development environment meets the following requirements:

* [cite_start]**Node.js:** v18.17.0 or higher[cite: 79, 208].
* **Package Manager:** pnpm (recommended), npm, or yarn.
* **Storyblok Account:** Required for content management.

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/astroJS-template.git](https://github.com/your-username/astroJS-template.git)
cd astroJS-template
````

### 2\. Install Dependencies

Install project dependencies using `pnpm` to ensure lockfile consistency.

```bash
pnpm install
```

### 3\. Environment Configuration

Create a `.env` file in the root directory. This file is excluded from version control for security.

```env
# .env
# Base URL for the site (used for sitemap generation)
SITE_URL="http://localhost:4321"

# Storyblok Access Token (Get this from your Storyblok Space Settings)
STORYBLOK_TOKEN="your_private_preview_token"
```

> **Note:** Never commit your `.env` file. [cite\_start]It contains sensitive API keys[cite: 66, 67].

### 4\. Start Development Server

Launch the local development server with hot module replacement (HMR).

```bash
pnpm dev
```

Access the application at `http://localhost:4321`.

-----

## 📂 Project Structure

Conforms to standard Astro architecture with Storyblok integration.

```text
/
├── public/              # Static assets (fonts, icons)
├──src/
[cite_start]│   ├── assets/          # Optimized assets (SVGs, Images) [cite: 1]
[cite_start]│   ├── components/      # Reusable Astro UI components [cite: 10]
[cite_start]│   ├── layouts/         # Global page layouts (Header, Footer) [cite: 29]
[cite_start]│   ├── lib/             # Utility functions (Tailwind merge, etc.) [cite: 31]
[cite_start]│   ├── pages/           # Route definitions & Storyblok entry points [cite: 32]
[cite_start]│   ├── storyblok/       # Svelte components mapped to CMS blocks [cite: 41]
[cite_start]│   └── styles/          # Global CSS and Tailwind configuration [cite: 49]
[cite_start]├── astro.config.mjs     # Astro & Integrations config [cite: 68]
[cite_start]└── package.json         # Dependencies & Scripts [cite: 78]
```

-----

## 🧩 Component Architecture

### Storyblok Integration

This project uses a dynamic routing strategy to fetch content from Storyblok.

  * **Dynamic Route:** `src/pages/[...slug].astro` handles all CMS routes.
  * **Component Mapping:** Storyblok blocks are mapped to local Svelte components in `astro.config.mjs`.

**Example Mapping (`astro.config.mjs`):**

```javascript
components: {
  'page': 'storyblok/Page',
  'feature': 'storyblok/Feature',
  'grid': 'storyblok/Grid',
}
```

### UI Components (Svelte)

Interactive elements are built using Svelte 5.

  * **Location:** `src/storyblok/*.svelte`
  * [cite\_start]**Editable:** Components use the `storyblokEditable` directive for visual editor support[cite: 43].

-----

## 📜 Scripts

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Starts the local development server. |
| `pnpm build` | Builds the project for production (Vercel adapter). |
| `pnpm preview` | Previews the production build locally. |
| `pnpm astro check` | Runs TypeScript and Astro diagnostics. |

-----

## 🔐 Security & Compliance

  * [cite\_start]**Secrets Management:** All API tokens are loaded via `import.meta.env` or `process.env` and are strictly kept out of the client-side bundle unless prefixed with `PUBLIC_` (not used here)[cite: 72].
  * **Strict Mode:** TypeScript strict mode is enabled in `tsconfig.json` to prevent type coercion errors.

-----

## ☁️ Deployment

The project is pre-configured for **Vercel** serverless deployment.

1.  Push code to GitHub.
2.  Import project into Vercel.
3.  Add the Environment Variables (`STORYBLOK_TOKEN`) in the Vercel Project Settings.
4.  Deploy.

-----

## 📄 License

Copyright (c) 2025. Licensed under the MIT License.
