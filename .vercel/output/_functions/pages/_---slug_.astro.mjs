import { n as nt, a as $e, e as et, $ as $$Layout } from '../chunks/Layout_BOO2brNB.mjs';
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, s as spreadAttributes } from '../chunks/astro/server_DACWf_Af.mjs';
import { e as escape_html, a as attr, b as bind_props } from '../chunks/_@astro-renderers_DsNcxPmq.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_DsNcxPmq.mjs';
import 'clsx';

const options = {"componentsDir":"src"};

function Feature($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		// @ts-ignore
		// Storyblok passes the block data via a prop called 'blok'
		let blok = $$props['blok'];

		$$renderer.push(`<!---->---
import GridSvelte from './Grid.svelte';
const ${escape_html(blok)} = Astro.props;
--- <div class="p-6 bg-white shadow-lg rounded-lg text-center"><h3 class="text-xl font-bold text-gray-900">${escape_html(blok.headline)}</h3> <p class="mt-2 text-gray-600">${escape_html(blok.description)}</p> <a${attr('href', blok.link.url)} class="mt-4 inline-block text-blue-600 hover:underline">Learn More →</a></div>`);

		bind_props($$props, { blok });
	});
}

const $$Astro$4 = createAstro("https://localhost:4321");
const $$Feature = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Feature;
  const { blok } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "FeatureSvelte", Feature, { "blok": blok, "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/adammerrill/Projects/astro-js-template/src/storyblok/Feature.svelte", "client:component-export": "default" })}`;
}, "/Users/adammerrill/Projects/astro-js-template/src/storyblok/Feature.astro", void 0);

const $$file$3 = "/Users/adammerrill/Projects/astro-js-template/src/storyblok/Feature.astro";
const $$url$3 = undefined;

const __vite_glob_0_0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Feature,
  file: $$file$3,
  url: $$url$3
}, Symbol.toStringTag, { value: 'Module' }));

function Grid($$renderer) {}

const $$Astro$3 = createAstro("https://localhost:4321");
const $$Grid = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Grid;
  const { blok } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "GridSvelte", Grid, { "blok": blok })}`;
}, "/Users/adammerrill/Projects/astro-js-template/src/storyblok/Grid.astro", void 0);

const $$file$2 = "/Users/adammerrill/Projects/astro-js-template/src/storyblok/Grid.astro";
const $$url$2 = undefined;

const __vite_glob_0_1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Grid,
  file: $$file$2,
  url: $$url$2
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$2 = createAstro("https://localhost:4321");
const $$Page = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Page;
  const { blok } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<main${spreadAttributes(nt(blok))}> ${// Cast body to SbBlokData[] to satisfy the component prop type
  blok.body?.map((nestedBlok) => {
    return renderTemplate`${renderComponent($$result, "StoryblokComponent", $$StoryblokComponent, { "blok": nestedBlok })}`;
  })} </main>`;
}, "/Users/adammerrill/Projects/astro-js-template/src/storyblok/Page.astro", void 0);

const $$file$1 = "/Users/adammerrill/Projects/astro-js-template/src/storyblok/Page.astro";
const $$url$1 = undefined;

const __vite_glob_0_2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Page,
  file: $$file$1,
  url: $$url$1
}, Symbol.toStringTag, { value: 'Module' }));

// Dynamically import all Storyblok components using Vite's glob import
    const modules = /* #__PURE__ */ Object.assign({"/src/storyblok/Feature.astro": __vite_glob_0_0,"/src/storyblok/Grid.astro": __vite_glob_0_1,"/src/storyblok/Page.astro": __vite_glob_0_2});
    // Process imported modules into a components object
    const storyblokComponents = {};
    
    for (const filePath in modules) {
      // Extract component name from file path (remove extension)
      const fileName = filePath.split('/').pop();
      const componentName = fileName?.replace(/\.[^/.]+$/, '');
      
      if (componentName) {
        // Get the component (handle both default and named exports)
        const component = modules[filePath].default || modules[filePath];
        
        // Convert filename to camelCase for Storyblok component naming
        const camelCaseName = $e(componentName);
        storyblokComponents[camelCaseName] = component;
      }
    }
    
    // Manual imports (overwrite auto if same key exists)
    storyblokComponents['page'] = $$Page;
storyblokComponents['feature'] = $$Feature;
storyblokComponents['grid'] = $$Grid;

const $$Astro$1 = createAstro("https://localhost:4321");
const $$StoryblokComponent = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$StoryblokComponent;
  const { blok, ...props } = Astro2.props;
  if (!blok) {
    throw new Error(
      "Cannot render StoryblokComponent. 'blok' prop is undefined."
    );
  }
  let key = $e(blok.component);
  const componentFound = key in storyblokComponents;
  let Component;
  if (!componentFound) {
    throw new Error(
        `No component found for blok "${blok.component}". 
      Make sure the component is:
      \u2022 Registered in your astro.config.mjs, or
      \u2022 Placed in the "/${options.componentsDir}/storyblok" folder, or
      \u2022 Enable the "fallbackComponent" option to handle missing components.`
      );
  } else {
    Component = storyblokComponents[key];
  }
  return renderTemplate`${renderComponent($$result, "Component", Component, { "blok": blok, ...props })}`;
}, "/Users/adammerrill/Projects/astro-js-template/node_modules/.pnpm/@storyblok+astro@7.3.5_astro@5.16.0_@types+node@24.10.1_@vercel+functions@2.2.13_jiti@2_00d40bca9d8c255f5668395d74363cb8/node_modules/@storyblok/astro/dist/components/StoryblokComponent.astro", void 0);

const $$Astro = createAstro("https://localhost:4321");
const prerender = false;
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const storyblokApi = et();
  const slug = Array.isArray(Astro2.params.slug) ? Astro2.params.slug.join("/") : "home";
  const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
    // Use 'draft' version during development for the Visual Editor
    version: "published"
  });
  if (!data.story) {
    return Astro2.redirect("/404");
  }
  const story = data.story;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": story.content.title }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "StoryblokComponent", $$StoryblokComponent, { "blok": story.content })} ` })}`;
}, "/Users/adammerrill/Projects/astro-js-template/src/pages/[...slug].astro", void 0);
const $$file = "/Users/adammerrill/Projects/astro-js-template/src/pages/[...slug].astro";
const $$url = "/[...slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
