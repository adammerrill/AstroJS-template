# Astro 5 Enterprise Boilerplate

![Astro](https://img.shields.io/badge/Astro-5.0-FF5D01?style=flat&logo=astro)
![Svelte](https://img.shields.io/badge/Svelte-5.0-FF3E00?style=flat&logo=svelte)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=flat&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

## 📖 Overview

This repository hosts a high-performance, enterprise-grade web application boilerplate built with **Astro 5**. It is architected for scalability, hybrid rendering, and visual content management.

The project combines the raw performance of Astro's server-side rendering (SSR) with **Svelte 5's** next-generation reactivity for interactive islands. It features a robust UI system based on **Tailwind CSS v4** and **Shadcn/UI** architecture, all powered by **Storyblok** as a Headless CMS.

### ✨ Key Features

* ⚡️ **Astro 5 Hybrid Rendering:** Optimized for speed with Server-Side Rendering (SSR) via the Vercel Adapter.
* 🔥 **Svelte 5 Reactivity:** Utilizes the latest Svelte runes and reactivity model for interactive UI components.
* 🎨 **Tailwind CSS v4:** Implements the latest zero-runtime CSS engine with native CSS variable theming and dark mode support.
* 📚 **Storyblok Integration:** Seamless content fetching with a live Visual Editor and dynamic component mapping.
* 🧩 **Shadcn/UI Architecture:** Uses clsx and tailwind-merge for type-safe, reusable component styling.
* 🧪 **Testing & Performance:** Pre-configured with **Playwright** for E2E testing and **Partytown** for third-party script offloading.
* 🗺️ **SEO Ready:** Automatic sitemap generation and metadata handling.

## 🚀 Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

    - Node.js: v20.0.0 or higher (LTS recommended)
    - Package Manager: pnpm v9.x (strictly enforced via CI)
    - Storyblok Account: Required for content management and API tokens

Verify your installations:

    ```shell
    node -v
    pnpm -v
    ```

### Installing

#### 1. Clone the Repository

    ```shell
    git clone https://github.com/adammerrill/AstroJS-template.git
    cd AstroJS-template
    ```

#### 2. Install Dependencies

    ```shell
    pnpm install
    ```

#### 3. Environment Configuration

Create a `.env` file in the root directory:

    ```shell
    cp .env.example .env
    ```

Configure the following required variables:

    ```shell
    # Base URL for sitemap generation and canonical URLs
    SITE_URL="http://localhost:4321"

    # Storyblok Access Token (Settings → Access Tokens → Preview)
    STORYBLOK_TOKEN="your_storyblok_preview_token_here"
    ```

#### 4. Sync Content Types

    ```shell
    pnpm astro sync
    ```

#### 5. Start the Development Server

    ```shell
    pnpm dev
    ```

Access the application at [http://localhost:4321](http://localhost:4321).

#### Optional: Mobile Network Testing

    ```shell
    pnpm dev:host
    ```

## ⚙️ Running Tests

### End-to-End Tests

We use **Playwright** for E2E testing. Run the full test suite:

    ```shell
    pnpm test
    ```

This executes `scripts/ci-wrapper.ts`, which:
    1. Starts the Astro server
    2. Waits for the port to be ready
    3. Runs the Playwright suite
    4. Generates a colored summary
    5. Gracefully shuts down the server

Debug tests with interactive UI:

    ```shell
    pnpm test:e2e:ui
    ```

### Static Analysis & Style

**Linting & Type Checking:**

    ```shell
    # Run ESLint
    pnpm lint

    # Run TypeScript type check
    pnpm typecheck

    # Run Astro template check
    pnpm check
    ```

**Style Risk Audit:**

    ```shell
    node audit-styles.js
    ```

## 📂 Project Structure

    ```text
    /
    ├── public/              # Static assets (favicons, robots.txt)
    ├── src/
    │   ├── assets/          # Optimized assets (SVGs, images)
    │   ├── components/      # UI components (Header, Footer, Shadcn primitives)
    │   ├── layouts/         # Global layouts (Layout.astro)
    │   ├── lib/             # Utilities (cn helper for Tailwind)
    │   ├── pages/           # Astro routes & Storyblok [...slug] entry point
    │   ├── storyblok/       # Svelte components mapped to CMS blocks
    │   └── styles/          # Global CSS, Tailwind directives, & theme vars
    ├── astro.config.mjs     # Configuration for integrations & Vercel adapter
    ├── components.json      # Shadcn/UI configuration
    └── package.json         # Project dependencies
    ```

## 📦 Deployment

Pre-configured for **Vercel** serverless deployment.

1. Push code to your Git repository
2. Import project into Vercel dashboard
3. Add `STORYBLOK_TOKEN` in Vercel Project Settings → Environment Variables
4. Trigger deployment

The `astro.config.mjs` is already configured with the Vercel adapter.

## 🛠️ Built With

* [Astro 5](https://astro.build) - The web framework for content-focused websites
* [Svelte 5](https://svelte.dev) - Reactive component framework (Runes)
* [Tailwind CSS v4](https://tailwindcss.com) - Utility-first CSS framework
* [Storyblok](https://www.storyblok.com) - Headless CMS
* [Shadcn/UI](https://ui.shadcn.com) - Reusable component architecture
* [Playwright](https://playwright.dev) - End-to-End testing framework
* [Vercel](https://vercel.com) - Serverless deployment platform

## 🤝 Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and pull request process.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes following conventional commits
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request against the `develop` branch

## 🏷️ Versioning

We use [SemVer](http://semver.org) for versioning. See [SEMVER_GUIDE.md](./SEMVER_GUIDE.md) for project-specific instructions.

Available versions are tracked via [GitHub Releases](https://github.com/adammerrill/AstroJS-template/releases).

## ✍️ Authors

* **Adam Merrill** - *Initial work & Architecture* - [AdamMerrill](https://github.com/adammerrill)

See also the list of [contributors](https://github.com/adammerrill/AstroJS-template/contributors) who participated.

## 📄 License

This project is licensed under the MIT License - see [LICENSE.md](./LICENSE.md) for details.

## 🎉 Acknowledgments

* Hat tip to the [Astro](https://astro.build) team for v5
* Inspiration from the [Shadcn/UI](https://ui.shadcn.com) community
* Thanks to [Storyblok](https://www.storyblok.com) for robust Astro integration
