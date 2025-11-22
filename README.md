# Astro 5 Enterprise Boilerplate

**Version:** 1.0.0
**Status:** Stable
**License:** MIT

## 📖 Overview

This repository hosts a high-performance, enterprise-grade web application boilerplate built with **Astro 5**. It is architected for scalability, utilizing **Svelte 5** for reactive components, **Tailwind CSS v4** for styling, and **Storyblok** as a Headless CMS.

### Key Features
* **Astro 5:** Server-side rendering (SSR) with static site generation (SSG) capabilities via Vercel Adapter.
* **Svelte 5:** Next-generation reactivity for interactive UI components.
* **Tailwind CSS v4:** Modern, zero-runtime utility-first CSS.
* **Storyblok CMS:** Integrated dynamic content fetching and visual editing.
* **TypeScript:** Strict type safety enabled for enterprise robustness.

---

## 🛠 Prerequisites

Ensure your development environment meets the following requirements:

* **Node.js:** v18.17.0 or higher.
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

> **Note:** Never commit your `.env` file. It contains sensitive API keys.


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
│   ├── assets/          # Optimized assets (SVGs, Images) 
│   ├── components/      # Reusable Astro UI components 
│   ├── layouts/         # Global page layouts (Header, Footer) 
│   ├── lib/             # Utility functions (Tailwind merge, etc.) 
│   ├── pages/           # Route definitions & Storyblok entry points 
│   ├── storyblok/       # Svelte components mapped to CMS blocks 
│   └── styles/          # Global CSS and Tailwind configuration
├── astro.config.mjs     # Astro & Integrations config 
└── package.json         # Dependencies & Scripts
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
  * **Editable:** Components use the `storyblokEditable` directive for visual editor support.

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

  * **Secrets Management:** All API tokens are loaded via `import.meta.env` or `process.env` and are strictly kept out of the client-side bundle unless prefixed with `PUBLIC_` (not used here).
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
