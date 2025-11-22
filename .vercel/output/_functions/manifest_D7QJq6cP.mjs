import { p as decodeKey } from './chunks/astro/server_TTVb4xIe.mjs';
import 'clsx';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_DRr-_G7J.mjs';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/adammerrill/Projects/astro-js-template/","cacheDir":"file:///Users/adammerrill/Projects/astro-js-template/node_modules/.astro/","outDir":"file:///Users/adammerrill/Projects/astro-js-template/dist/","srcDir":"file:///Users/adammerrill/Projects/astro-js-template/src/","publicDir":"file:///Users/adammerrill/Projects/astro-js-template/public/","buildClientDir":"file:///Users/adammerrill/Projects/astro-js-template/dist/client/","buildServerDir":"file:///Users/adammerrill/Projects/astro-js-template/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/page.B5mYSlhR.js"},{"stage":"head-inline","children":"!(function(w,p,f,c){if(!window.crossOriginIsolated && !navigator.serviceWorker) return;c=w[p]=Object.assign(w[p]||{},{\"lib\":\"/~partytown/\",\"debug\":false});c[f]=(c[f]||[])})(window,'partytown','forward');/* Partytown 0.11.2 - MIT QwikDev */\nconst t={preserveBehavior:!1},e=e=>{if(\"string\"==typeof e)return[e,t];const[n,r=t]=e;return[n,{...t,...r}]},n=Object.freeze((t=>{const e=new Set;let n=[];do{Object.getOwnPropertyNames(n).forEach((t=>{\"function\"==typeof n[t]&&e.add(t)}))}while((n=Object.getPrototypeOf(n))!==Object.prototype);return Array.from(e)})());!function(t,r,o,i,a,s,c,l,d,p,u=t,f){function h(){f||(f=1,\"/\"==(c=(s.lib||\"/~partytown/\")+(s.debug?\"debug/\":\"\"))[0]&&(d=r.querySelectorAll('script[type=\"text/partytown\"]'),i!=t?i.dispatchEvent(new CustomEvent(\"pt1\",{detail:t})):(l=setTimeout(v,(null==s?void 0:s.fallbackTimeout)||1e4),r.addEventListener(\"pt0\",w),a?y(1):o.serviceWorker?o.serviceWorker.register(c+(s.swPath||\"partytown-sw.js\"),{scope:c}).then((function(t){t.active?y():t.installing&&t.installing.addEventListener(\"statechange\",(function(t){\"activated\"==t.target.state&&y()}))}),console.error):v())))}function y(e){p=r.createElement(e?\"script\":\"iframe\"),t._pttab=Date.now(),e||(p.style.display=\"block\",p.style.width=\"0\",p.style.height=\"0\",p.style.border=\"0\",p.style.visibility=\"hidden\",p.setAttribute(\"aria-hidden\",!0)),p.src=c+\"partytown-\"+(e?\"atomics.js?v=0.11.2\":\"sandbox-sw.html?\"+t._pttab),r.querySelector(s.sandboxParent||\"body\").appendChild(p)}function v(n,o){for(w(),i==t&&(s.forward||[]).map((function(n){const[r]=e(n);delete t[r.split(\".\")[0]]})),n=0;n<d.length;n++)(o=r.createElement(\"script\")).innerHTML=d[n].innerHTML,o.nonce=s.nonce,r.head.appendChild(o);p&&p.parentNode.removeChild(p)}function w(){clearTimeout(l)}s=t.partytown||{},i==t&&(s.forward||[]).map((function(r){const[o,{preserveBehavior:i}]=e(r);u=t,o.split(\".\").map((function(e,r,o){var a;u=u[o[r]]=r+1<o.length?u[o[r]]||(a=o[r+1],n.includes(a)?[]:{}):(()=>{let e=null;if(i){const{methodOrProperty:n,thisObject:r}=((t,e)=>{let n=t;for(let t=0;t<e.length-1;t+=1)n=n[e[t]];return{thisObject:n,methodOrProperty:e.length>0?n[e[e.length-1]]:void 0}})(t,o);\"function\"==typeof n&&(e=(...t)=>n.apply(r,...t))}return function(){let n;return e&&(n=e(arguments)),(t._ptf=t._ptf||[]).push(o,arguments),n}})()}))})),\"complete\"==r.readyState?h():(t.addEventListener(\"DOMContentLoaded\",h),t.addEventListener(\"load\",h))}(window,document,navigator,top,window.crossOriginIsolated);;(e=>{e.addEventListener(\"astro:before-swap\",e=>{let r=document.body.querySelector(\"iframe[src*='/~partytown/']\");if(r)e.newDocument.body.append(r)})})(document);"}],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/.pnpm/astro@5.16.0_@types+node@24.10.1_@vercel+functions@2.2.13_jiti@2.6.1_lightningcss@1.30._2be79f4d69771352e35fee436c64a848/node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/page.B5mYSlhR.js"},{"stage":"head-inline","children":"!(function(w,p,f,c){if(!window.crossOriginIsolated && !navigator.serviceWorker) return;c=w[p]=Object.assign(w[p]||{},{\"lib\":\"/~partytown/\",\"debug\":false});c[f]=(c[f]||[])})(window,'partytown','forward');/* Partytown 0.11.2 - MIT QwikDev */\nconst t={preserveBehavior:!1},e=e=>{if(\"string\"==typeof e)return[e,t];const[n,r=t]=e;return[n,{...t,...r}]},n=Object.freeze((t=>{const e=new Set;let n=[];do{Object.getOwnPropertyNames(n).forEach((t=>{\"function\"==typeof n[t]&&e.add(t)}))}while((n=Object.getPrototypeOf(n))!==Object.prototype);return Array.from(e)})());!function(t,r,o,i,a,s,c,l,d,p,u=t,f){function h(){f||(f=1,\"/\"==(c=(s.lib||\"/~partytown/\")+(s.debug?\"debug/\":\"\"))[0]&&(d=r.querySelectorAll('script[type=\"text/partytown\"]'),i!=t?i.dispatchEvent(new CustomEvent(\"pt1\",{detail:t})):(l=setTimeout(v,(null==s?void 0:s.fallbackTimeout)||1e4),r.addEventListener(\"pt0\",w),a?y(1):o.serviceWorker?o.serviceWorker.register(c+(s.swPath||\"partytown-sw.js\"),{scope:c}).then((function(t){t.active?y():t.installing&&t.installing.addEventListener(\"statechange\",(function(t){\"activated\"==t.target.state&&y()}))}),console.error):v())))}function y(e){p=r.createElement(e?\"script\":\"iframe\"),t._pttab=Date.now(),e||(p.style.display=\"block\",p.style.width=\"0\",p.style.height=\"0\",p.style.border=\"0\",p.style.visibility=\"hidden\",p.setAttribute(\"aria-hidden\",!0)),p.src=c+\"partytown-\"+(e?\"atomics.js?v=0.11.2\":\"sandbox-sw.html?\"+t._pttab),r.querySelector(s.sandboxParent||\"body\").appendChild(p)}function v(n,o){for(w(),i==t&&(s.forward||[]).map((function(n){const[r]=e(n);delete t[r.split(\".\")[0]]})),n=0;n<d.length;n++)(o=r.createElement(\"script\")).innerHTML=d[n].innerHTML,o.nonce=s.nonce,r.head.appendChild(o);p&&p.parentNode.removeChild(p)}function w(){clearTimeout(l)}s=t.partytown||{},i==t&&(s.forward||[]).map((function(r){const[o,{preserveBehavior:i}]=e(r);u=t,o.split(\".\").map((function(e,r,o){var a;u=u[o[r]]=r+1<o.length?u[o[r]]||(a=o[r+1],n.includes(a)?[]:{}):(()=>{let e=null;if(i){const{methodOrProperty:n,thisObject:r}=((t,e)=>{let n=t;for(let t=0;t<e.length-1;t+=1)n=n[e[t]];return{thisObject:n,methodOrProperty:e.length>0?n[e[e.length-1]]:void 0}})(t,o);\"function\"==typeof n&&(e=(...t)=>n.apply(r,...t))}return function(){let n;return e&&(n=e(arguments)),(t._ptf=t._ptf||[]).push(o,arguments),n}})()}))})),\"complete\"==r.readyState?h():(t.addEventListener(\"DOMContentLoaded\",h),t.addEventListener(\"load\",h))}(window,document,navigator,top,window.crossOriginIsolated);;(e=>{e.addEventListener(\"astro:before-swap\",e=>{let r=document.body.querySelector(\"iframe[src*='/~partytown/']\");if(r)e.newDocument.body.append(r)})})(document);"}],"styles":[{"type":"external","src":"/_astro/_slug_.CgW4LBlG.css"}],"routeData":{"route":"/[...slug]","isIndex":false,"type":"page","pattern":"^(?:\\/(.*?))?\\/?$","segments":[[{"content":"...slug","dynamic":true,"spread":true}]],"params":["...slug"],"component":"src/pages/[...slug].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"site":"https://localhost:4321","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/adammerrill/Projects/astro-js-template/src/pages/[...slug].astro",{"propagation":"none","containsHead":true}],["/Users/adammerrill/Projects/astro-js-template/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astro-page:src/pages/[...slug]@_@astro":"pages/_---slug_.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-page:node_modules/.pnpm/astro@5.16.0_@types+node@24.10.1_@vercel+functions@2.2.13_jiti@2.6.1_lightningcss@1.30._2be79f4d69771352e35fee436c64a848/node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_D7QJq6cP.mjs","/Users/adammerrill/Projects/astro-js-template/node_modules/.pnpm/astro@5.16.0_@types+node@24.10.1_@vercel+functions@2.2.13_jiti@2.6.1_lightningcss@1.30._2be79f4d69771352e35fee436c64a848/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_DNUoMRET.mjs","/Users/adammerrill/Projects/astro-js-template/src/storyblok/Feature.svelte":"_astro/Feature.1zfJ-lJF.js","@astrojs/svelte/client.js":"_astro/client.svelte.D0uiw3L2.js","/Users/adammerrill/Projects/astro-js-template/src/components/ui/Header.astro?astro&type=script&index=0&lang.ts":"_astro/Header.astro_astro_type_script_index_0_lang.D2bEjEoq.js","astro:scripts/page.js":"_astro/page.B5mYSlhR.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/Users/adammerrill/Projects/astro-js-template/src/components/ui/Header.astro?astro&type=script&index=0&lang.ts","const e=document.getElementById(\"main-header\"),s=()=>{e&&(window.scrollY>10?(e.classList.remove(\"bg-transparent\",\"border-transparent\"),e.classList.add(\"header-glass\")):(e.classList.remove(\"header-glass\"),e.classList.add(\"bg-transparent\",\"border-transparent\")))};window.addEventListener(\"scroll\",s);s();"]],"assets":["/_astro/astro.Dm8K3lV8.svg","/_astro/background.BPKAcmfN.svg","/_astro/_slug_.CgW4LBlG.css","/favicon.svg","/_astro/Feature.1zfJ-lJF.js","/_astro/client.svelte.D0uiw3L2.js","/_astro/page.B5mYSlhR.js","/_astro/render.CQNP0Kkv.js","/_astro/page.B5mYSlhR.js","/index.html","/~partytown/partytown-atomics.js","/~partytown/partytown-media.js","/~partytown/partytown-sw.js","/~partytown/partytown.js"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"serverIslandNameMap":[],"key":"S3qdovZ5vFsVHy2XDlur0T6OsQ3ND1dSLKOwaq1L7SY="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
