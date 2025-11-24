# **Astro 5 Enterprise Template**

## **📖 Executive Summary**

This is a production-grade, enterprise-ready boilerplate architected for high-performance web applications. It leverages the bleeding edge of the JavaScript ecosystem, combining **Astro 5's** server-first rendering with **Svelte 5's** runes-based reactivity and **Tailwind CSS v4's** zero-runtime styling engine.

Beyond a simple starter, this repository includes a custom CI/CD orchestration layer, a static analysis risk auditing tool, and a pre-configured design system based on Shadcn/UI and Glassmorphism principles.

### **✨ Key Capabilities**

* **Hybrid Rendering Engine:** Optimized SSR via @astrojs/vercel with intelligent caching strategies.  
* **Reactive Islands:** Uses Svelte 5 (Runes) for complex interactive components like the Mobile Drawer and Announcement bars.  
* **Headless CMS:** Deep integration with Storyblok, featuring a dynamic \[...slug\] catch-all route that handles Visual Editor previews automatically.  
* **Advanced Testing Pipeline:** Custom TypeScript orchestrator (ci-wrapper.ts) that manages server lifecycle, parses Playwright JSON results, and provides human-readable CI logs.  
* **Static Risk Analysis:** Includes a custom parser (audit-styles.js) that scans codebase for high-risk CSS patterns (inline styles, excessive arbitrary values).  
* **Design System:** Tailwind v4 native CSS variables, dark mode support, and custom "Glass" utility classes.

## **🛠️ Prerequisites & Installation**

### **System Requirements**

* **Node.js:** v20.x (LTS recommended)  
* **Package Manager:** pnpm v9.x (Strictly enforced via CI)  
* **Storyblok Space:** You need a Storyblok account and a Space ID.

### **Setup Guide**

1. **Clone & Install**  
   git clone \[https://github.com/your-org/astro-enterprise-template.git\](https://github.com/your-org/astro-enterprise-template.git)  
   cd astro-enterprise-template  
   pnpm install

2. Environment Configuration  
   Create a .env file in the root. This file is guarded by .gitignore.  
   cp .env.example .env

   **Required Variables:**  
   \# The public URL of the site (used for Sitemap generation)  
   SITE\_URL="http://localhost:4321"

   \# Storyblok Preview Token (Settings \-\> Access Tokens)  
   STORYBLOK\_TOKEN="your\_storyblok\_token\_here"

3. Sync Content Types  
   Ensure your local Astro types match your integrations:  
   pnpm astro sync

4. **Launch Development Server**  
   pnpm dev

## **📂 Architecture & File Structure**

This project follows a strict modular architecture designed for scalability.

/  
├── .github/workflows/   \# CI Pipeline configurations  
├── scripts/             \# Custom CI orchestration & utilities  
│   ├── ci-wrapper.ts    \# Main entry point for CI testing  
│   └── start-and-test.ts\# Server lifecycle manager  
├── src/  
│   ├── components/      \# UI Atoms & Molecules (Header, Footer)  
│   ├── layouts/         \# Page wrappers (Global CSS injection)  
│   ├── lib/             \# Utilities (clsx/tailwind-merge)  
│   ├── pages/           \# Route definitions  
│   │   ├── \[...slug\].astro \# Dynamic Storyblok entry point  
│   │   └── index.astro     \# Dashboard / Home  
│   ├── storyblok/       \# CMS Component Mappings (Svelte/Astro)  
│   └── styles/          \# Tailwind v4 Theme & CSS Variables  
├── audit-styles.js      \# Static Analysis Tool  
├── astro.config.mjs     \# Integrations Config  
└── playwright.config.ts \# E2E Configuration

## **🔌 CMS Integration (Storyblok)**

### **Component Mapping**

The mapping between Storyblok "Technical Names" and local code lives in astro.config.mjs.

storyblok({  
  components: {  
    page: "storyblok/Page",       // Root layout  
    feature: "storyblok/Feature", // Svelte interactive component  
    grid: "storyblok/Grid",       // Layout component  
  },  
})

### **Dynamic Routing Strategy**

The file src/pages/\[...slug\].astro acts as the gateway.

1. **Dev Mode:** Automatically fetches the draft version of content to enable the Visual Editor.  
2. **Production:** Fetches published content for performance.  
3. **Preview Handling:** The Storyblok Bridge is automatically initialized to allow click-to-edit functionality.

## **🎨 Design System & Styling**

This project uses **Tailwind CSS v4**. Configuration is primarily handled via CSS variables in src/styles/global.css rather than a JavaScript config file.

### **Glassmorphism Utilities**

We employ a custom "Glass" system utilizing CSS variables for alpha channels and blur.

| Class | Description |
| :---- | :---- |
| .glass | Applies background blur, border transparency, and shadow. |
| .header-glass | Specialized variant for the sticky header with bottom border. |

### **Theming**

Colors are defined as HSL values to support native CSS variable manipulation.

* **Usage:** bg-primary, text-muted-foreground  
* **Dark Mode:** Automatically handled via @media (prefers-color-scheme: dark) in global.css.

## **🧪 Advanced Testing Architecture**

This repository uses a custom testing harness (scripts/ci-wrapper.ts) rather than standard CLI commands.

### **Why a custom wrapper?**

1. **Reliability:** It ensures the dev server (pnpm dev) is fully ready (port 4321 accessible) before triggering Playwright.  
2. **Cleanup:** It guarantees zombie processes are killed, even if tests fail or time out.  
3. **Reporting:** It parses the raw JSON output from Playwright into a human-readable, color-coded summary in the terminal.

### **Running Tests**

| Command | Description |
| :---- | :---- |
| pnpm test | Runs the full E2E suite via the wrapper. |
| pnpm test:e2e:ui | Opens the interactive Playwright UI for debugging. |
| pnpm test:ci | The command used by GitHub Actions (includes build \+ check). |

### **Included Test Suites**

* **Header:** Validates responsive behavior, hamburger menu toggling, and focus trapping.  
* **Announcement:** Tests local storage persistence (dismissing the banner).  
* **Layout:** Verifies max-width constraints and vertical centering.

## **🛠️ Developer Tooling**

### **1\. Style Risk Auditor**

We include a static analysis tool to prevent CSS technical debt.

node audit-styles.js

**What it checks:**

* **Inline Styles:** Flags usage of style="..." which breaks CSP.  
* **Arbitrary Values:** Flags excessive use of w-\[53px\] (Tailwind arbitrary values).  
* **Risk Score:** Assigns a High/Medium/Low risk score to files based on heuristic analysis.

### **2\. Knowledge Base Generator**

Useful for generating context for LLMs/AI coding assistants.

pnpm kb:gen

This script aggregates all non-ignored source files into knowledge\_base.txt.

### **3\. Mobile Network Testing**

To test the site on a physical mobile device (iPhone/Android) on the same network:

pnpm dev:host

This exposes the server on 0.0.0.0, allowing you to access it via your local IP address.

## **🚀 CI/CD Pipeline**

The GitHub Actions workflow (.github/workflows/ci.yml) enforces quality gates.

1. **Validation Job (Parallelized):**  
   * eslint: Code quality checks.  
   * tsc \--noEmit: Strict type checking.  
   * astro check: Template validation.  
2. **E2E Job (Dependent):**  
   * Only runs if Validation passes.  
   * Installs Playwright browsers.  
   * Builds the application.  
   * Runs the custom ci-wrapper.ts.  
   * Uploads Playwright traces/reports on failure.

## **© License**

Licensed under the MIT License.