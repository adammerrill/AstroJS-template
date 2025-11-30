# 🚀 Astro 5 Enterprise Boilerplate

![Astro](https://img.shields.io/badge/Astro-5.0-FF5D01?style=flat&logo=astro)
![Svelte](https://img.shields.io/badge/Svelte-5.0-FF3E00?style=flat&logo=svelte)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=flat&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)
![pnpm](https://img.shields.io/badge/pnpm-9.x-F69220?style=flat&logo=pnpm)
![Build Status](https://img.shields.io/github/actions/workflow/status/adammerrill/AstroJS-template/ci.yml?branch=main)

**A high-performance, enterprise-grade web application boilerplate built with Astro 5, Svelte 5, and Tailwind CSS v4.**

## 📖 Overview

This repository hosts a high-performance, enterprise-grade web application boilerplate built with **Astro 5**. It is architected for scalability, hybrid rendering, and visual content management.

The project combines the raw performance of Astro's server-side rendering (SSR) with **Svelte 5's** next-generation reactivity for interactive islands. It features a robust UI system based on **Tailwind CSS v4** and **Shadcn/UI** architecture, all powered by **Storyblok** as a Headless CMS.

### **✨ Key Features**

- **⚡️ Astro 5 Hybrid Rendering:** Optimized for speed with Server-Side Rendering (SSR) via the Vercel Adapter.
- **🔥 Svelte 5 Reactivity:** Utilizes the latest Svelte runes and reactivity model for interactive UI components.
- **🎨 XR Tailwind CSS v4:** Implements the latest zero-runtime CSS engine with native CSS variable theming and dark mode support.
- **🗂️ CMS Storyblok Integration:** Seamless content fetching with a live Visual Editor and dynamic component mapping.
- **🎨 Shadcn/UI Architecture:** Uses clsx and tailwind-merge for type-safe, reusable component styling.
- **🧪 Testing & Performance:** Pre-configured with **Playwright** for E2E testing and **Partytown** for third-party script offloading.
- **🗺️ SEO Ready:** Automatic sitemap generation and metadata handling.
- **📦 Type-Safe:** Full TypeScript support with Storyblok type synchronization

## **Getting Started**

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## 🚀 Quick Start

Get up and running in less than 5 minutes.

### **Prerequisites**

To successfully run this project, you will need the following installed on your development machine:

- **Node.js**: v20.0.0 or higher (LTS recommended).
- **Package Manager**: pnpm v9.x (Strictly enforced via CI).
- **Storyblok Account**: Required for content management and API tokens.

```bash
# Node.js v20.0.0 or higher (LTS recommended)
node -v

# pnpm v9.x (Strictly enforced via CI)
pnpm -v
```

### **Installing**

Follow this step-by-step series of examples to get your development environment running.

**1\. Clone the Repository**

Start by cloning the repository to your local machine.

```bash
git clone \[https://github.com/adammerrill/AstroJS-template.git\](https://github.com/adammerrill/AstroJS-template.git)
cd AstroJS-template
```

**2\. Install Dependencies**

This project uses pnpm to ensure strict dependency management and faster installation.

```bash
pnpm install
```

**3\. Environment Configuration**

Create a .env file in the root directory by copying the example file.

```bash
cp .env.example .env
```

You must configure the following variables in your new .env file. These are required for the astro.config.mjs loader and Storyblok integration:

```bash
\# Base URL used for sitemap generation and canonical URLs
SITE\_URL="http://localhost:4321"

\# Storyblok Access Token (Found in Storyblok: Settings \-\> Access Tokens \-\> Preview)
STORYBLOK\_TOKEN="your\_storyblok\_preview\_token\_here"
```

**4\. Sync Content Types**

Synchronize your local Astro types with your integrations (like Storyblok) to ensure type safety.

```bash
pnpm astro sync
```

**5\. Start the Development Server**

Launch the local development server with Hot Module Replacement (HMR).

```bash
pnpm dev

You can now access the application at http://localhost:4321.
```

## **Optional: Mobile Network Testing**

If you need to test the application on a mobile device connected to the same network, use the host command:

```bash
pnpm dev:host
```

## **Running the tests**

This system employs a robust testing strategy combining End-to-End (E2E) testing with static analysis and coding style checks.

### **Break down into end to end tests**

We use **Playwright** for E2E testing to simulate real user interactions across multiple browsers and device viewports.

To run the full test suite using our custom CI wrapper (which handles server lifecycle and reporting):

```bash
pnpm test
```

This command executes scripts/ci-wrapper.ts, which:

1. Starts the Astro server.
2. Waits for the port to be ready.
3. Runs the Playwright suite.
4. Generates a colored summary in the terminal.
5. Gracefully shuts down the server.

If you want to debug tests with the interactive UI:

pnpm test:e2e:ui

### **And coding style tests**

We use a combination of ESLint, Prettier, TypeScript, and a custom Style Auditor to ensure code quality.

**Linting & Type Checking:**

```bash
\# Run ESLint
pnpm lint

\# Run TypeScript Type Check
pnpm typecheck

\# Run Astro Template Check
pnpm check
```

**Style Risk Audit:**

We include a custom static analysis tool (audit-styles.js) that scans the codebase for high-risk CSS patterns, such as inline styles or excessive use of Tailwind arbitrary values (e.g., w-\[53px\]).

node audit-styles.js

## **📂 Project Structure**

The project follows a strict modular architecture:

```bash
/
├── public/              \# Static assets (favicons, robots.txt)
├── src/
│   ├── assets/          \# Optimized assets (SVGs, Images)
│   ├── components/      \# UI Components (Header, Footer, Shadcn primitives)
│   ├── layouts/         \# Global layouts (Layout.astro)
│   ├── lib/             \# Utilities (cn helper for Tailwind)
│   ├── pages/           \# Astro routes & Storyblok \[...slug\] entry point
│   ├── storyblok/       \# Svelte components mapped to CMS blocks
│   └── styles/          \# Global CSS, Tailwind directives, & Theme vars
├── astro.config.mjs     \# Configuration for Integrations & Vercel Adapter
├── components.json      \# Shadcn/UI configuration
└── package.json         \# Project dependencies
```

## **Deployment**

The project is pre-configured for **Vercel** serverless deployment via the @astrojs/vercel adapter.

1. **Push Code:** Push your code to your git repository.
2. **Import to Vercel:** Import the project into your Vercel dashboard.
3. **Environment Variables:** Add the STORYBLOK_TOKEN in the Vercel Project Settings \> Environment Variables.
4. **Deploy:** Trigger a deployment.

The astro.config.mjs is already set up to use vercel() as the adapter, ensuring SSR functions work correctly in the serverless environment.

## **Built With**

- [Astro 5](https://astro.build/) \- The web framework used for content-focused websites.
- [Svelte 5](https://svelte.dev/) \- Reactive component framework (Runes).
- [Tailwind CSS v4](https://tailwindcss.com/) \- Utility-first CSS framework.
- [Storyblok](https://www.storyblok.com/) \- Headless CMS.
- [Shadcn/UI](https://ui.shadcn.com/) \- Reusable component architecture.
- [Playwright](https://playwright.dev/) \- End-to-End testing framework.
- [Vercel](https://vercel.com/) \- Serverless deployment platform.

## **Contributing**

Please read [CONTRIBUTING.md](https://www.google.com/search?q=CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us. _(Note: File to be created)_.

1. Fork the repository.
2. Create your feature branch (git checkout \-b feature/AmazingFeature).
3. Commit your changes (git commit \-m 'Add some AmazingFeature').
4. Push to the branch (git push origin feature/AmazingFeature).
5. Open a Pull Request.

## **Versioning**

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://www.google.com/search?q=https://github.com/adammerrill/AstroJS-template/tags).

## **Authors**

- **Atom Merrill** \- _Initial work & Architecture_ \- [AdamMerrill](https://www.google.com/search?q=https://github.com/adammerrill)

See also the list of [contributors](https://www.google.com/search?q=https://github.com/adammerrill/AstroJS-template/contributors) who participated in this project.

## **License**

This project is licensed under the MIT License \- see the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.

## **Acknowledgments**

- Hat tip to the [Astro](https://astro.build) team for the v5 release.
- Inspiration from the [Shadcn/UI](https://ui.shadcn.com) community.
- Thanks to [Storyblok](https://www.storyblok.com) for their robust Astro integration.
