import { e as createAstro, f as createComponent, m as maybeRenderHead, l as renderScript, h as addAttribute, r as renderTemplate, n as renderHead, k as renderComponent, o as renderSlot } from './astro/server_TTVb4xIe.mjs';
/* empty css                          */
import 'clsx';

function et() {
  if (!(globalThis != null && globalThis.storyblokApiInstance))
    throw new Error("storyblokApiInstance has not been initialized correctly");
  return globalThis.storyblokApiInstance;
}
const be = /[\p{Lu}]/u, ge = /[\p{Ll}]/u, z = /^[\p{Lu}](?![\p{Lu}])/gu, te = /([\p{Alpha}\p{N}_]|$)/u, D = /[_.\- ]+/, Ce = new RegExp("^" + D.source), Z = new RegExp(D.source + te.source, "gu"), G = new RegExp("\\d+" + te.source, "gu"), ve = (e, t, r, s) => {
  let o = false, n = false, i = false, l = false;
  for (let c = 0; c < e.length; c++) {
    const u = e[c];
    l = c > 2 ? e[c - 3] === "-" : true, o && be.test(u) ? (e = e.slice(0, c) + "-" + e.slice(c), o = false, i = n, n = true, c++) : n && i && ge.test(u) && (!l || s) ? (e = e.slice(0, c - 1) + "-" + e.slice(c - 1), i = n, n = false, o = true) : (o = t(u) === u && r(u) !== u, i = n, n = r(u) === u && t(u) !== u);
  }
  return e;
}, ke = (e, t) => (z.lastIndex = 0, e.replaceAll(z, (r) => t(r))), we = (e, t) => (Z.lastIndex = 0, G.lastIndex = 0, e.replaceAll(G, (r, s, o) => ["_", "-"].includes(e.charAt(o + r.length)) ? r : t(r)).replaceAll(Z, (r, s) => t(s)));
function Ae(e, t) {
  if (!(typeof e == "string" || Array.isArray(e)))
    throw new TypeError("Expected the input to be `string | string[]`");
  if (t = {
    pascalCase: false,
    preserveConsecutiveUppercase: false,
    ...t
  }, Array.isArray(e) ? e = e.map((n) => n.trim()).filter((n) => n.length).join("-") : e = e.trim(), e.length === 0)
    return "";
  const r = t.locale === false ? (n) => n.toLowerCase() : (n) => n.toLocaleLowerCase(t.locale), s = t.locale === false ? (n) => n.toUpperCase() : (n) => n.toLocaleUpperCase(t.locale);
  return e.length === 1 ? D.test(e) ? "" : t.pascalCase ? s(e) : r(e) : (e !== r(e) && (e = ve(e, r, s, t.preserveConsecutiveUppercase)), e = e.replace(Ce, ""), e = t.preserveConsecutiveUppercase ? ke(e, r) : r(e), t.pascalCase && (e = s(e.charAt(0)) + e.slice(1)), we(e, s));
}
function $e(e) {
  return Ae(e);
}
var Re = Object.defineProperty, Oe = (e, t, r) => t in e ? Re(e, t, { enumerable: true, configurable: true, writable: true, value: r }) : e[t] = r, g = (e, t, r) => Oe(e, typeof t != "symbol" ? t + "" : t, r);
let Y = false;
const K = [], se = (e) => new Promise((t, r) => {
  if (typeof window > "u") {
    r(new Error("Cannot load Storyblok bridge: window is undefined (server-side environment)"));
    return;
  }
  if (window.storyblokRegisterEvent = (o) => {
    if (!window.location.search.includes("_storyblok")) {
      console.warn("You are not in Draft Mode or in the Visual Editor.");
      return;
    }
    Y ? o() : K.push(o);
  }, document.getElementById("storyblok-javascript-bridge")) {
    t(void 0);
    return;
  }
  const s = document.createElement("script");
  s.async = true, s.src = e, s.id = "storyblok-javascript-bridge", s.onerror = (o) => r(o), s.onload = (o) => {
    K.forEach((n) => n()), Y = true, t(o);
  }, document.getElementsByTagName("head")[0].appendChild(s);
});
var Ue = class extends Error {
  constructor(e) {
    super(e), this.name = "AbortError";
  }
};
function Ve(e, t, r) {
  if (!Number.isFinite(t)) throw new TypeError("Expected `limit` to be a finite number");
  if (!Number.isFinite(r)) throw new TypeError("Expected `interval` to be a finite number");
  const s = [];
  let o = [], n = 0, i = false;
  const l = async () => {
    n++;
    const u = s.shift();
    if (u) try {
      const m = await e(...u.args);
      u.resolve(m);
    } catch (m) {
      u.reject(m);
    }
    const f = setTimeout(() => {
      n--, s.length > 0 && l(), o = o.filter((m) => m !== f);
    }, r);
    o.includes(f) || o.push(f);
  }, c = (...u) => i ? Promise.reject(/* @__PURE__ */ new Error("Throttled function is already aborted and not accepting new promises")) : new Promise((f, m) => {
    s.push({
      resolve: f,
      reject: m,
      args: u
    }), n < t && l();
  });
  return c.abort = () => {
    i = true, o.forEach(clearTimeout), o = [], s.forEach((u) => u.reject(() => new Ue("Throttle function aborted"))), s.length = 0;
  }, c;
}
var Be = Ve;
const X = (e = "") => e.includes("/cdn/"), Fe = (e, t = 25, r = 1) => ({
  ...e,
  per_page: t,
  page: r
}), ze = (e) => new Promise((t) => setTimeout(t, e)), Ze = (e = 0, t) => Array.from({ length: e }, t), Ge = (e = 0, t = e) => {
  const r = Math.abs(t - e) || 0, s = e < t ? 1 : -1;
  return Ze(r, (o, n) => n * s + e);
}, qe = async (e, t) => Promise.all(e.map(t)), Je = (e = [], t) => e.map(t).reduce((r, s) => [...r, ...s], []), U = (e, t, r) => {
  const s = [];
  for (const o in e) {
    if (!Object.prototype.hasOwnProperty.call(e, o)) continue;
    const n = e[o];
    if (n == null) continue;
    const i = r ? "" : encodeURIComponent(o);
    let l;
    typeof n == "object" ? l = U(n, t ? t + encodeURIComponent(`[${i}]`) : i, Array.isArray(n)) : l = `${t ? t + encodeURIComponent(`[${i}]`) : i}=${encodeURIComponent(n)}`, s.push(l);
  }
  return s.join("&");
}, Q = (e) => {
  const t = {
    eu: "api.storyblok.com",
    us: "api-us.storyblok.com",
    cn: "app.storyblokchina.cn",
    ap: "api-ap.storyblok.com",
    ca: "api-ca.storyblok.com"
  };
  return t[e] ?? t.eu;
};
var We = class {
  constructor(e) {
    g(this, "baseURL"), g(this, "timeout"), g(this, "headers"), g(this, "responseInterceptor"), g(this, "fetch"), g(this, "ejectInterceptor"), g(this, "url"), g(this, "parameters"), g(this, "fetchOptions"), this.baseURL = e.baseURL, this.headers = e.headers || new Headers(), this.timeout = e != null && e.timeout ? e.timeout * 1e3 : 0, this.responseInterceptor = e.responseInterceptor, this.fetch = (...t) => e.fetch ? e.fetch(...t) : fetch(...t), this.ejectInterceptor = false, this.url = "", this.parameters = {}, this.fetchOptions = {};
  }
  /**
  *
  * @param url string
  * @param params ISbStoriesParams
  * @returns Promise<ISbResponse | Error>
  */
  get(e, t) {
    return this.url = e, this.parameters = t, this._methodHandler("get");
  }
  post(e, t) {
    return this.url = e, this.parameters = t, this._methodHandler("post");
  }
  put(e, t) {
    return this.url = e, this.parameters = t, this._methodHandler("put");
  }
  delete(e, t) {
    return this.url = e, this.parameters = t ?? {}, this._methodHandler("delete");
  }
  async _responseHandler(e) {
    const t = [], r = {
      data: {},
      headers: {},
      status: 0,
      statusText: ""
    };
    e.status !== 204 && await e.json().then((s) => {
      r.data = s;
    });
    for (const s of e.headers.entries()) t[s[0]] = s[1];
    return r.headers = { ...t }, r.status = e.status, r.statusText = e.statusText, r;
  }
  async _methodHandler(e) {
    let t = `${this.baseURL}${this.url}`, r = null;
    e === "get" ? t = `${this.baseURL}${this.url}?${U(this.parameters)}` : r = JSON.stringify(this.parameters);
    const s = new URL(t), o = new AbortController(), { signal: n } = o;
    let i = null;
    this.timeout && (i = setTimeout(() => o.abort(), this.timeout));
    try {
      const l = await this.fetch(`${s}`, {
        method: e,
        headers: this.headers,
        body: r,
        signal: n,
        ...this.fetchOptions
      });
      this.timeout && i && clearTimeout(i);
      const c = await this._responseHandler(l);
      return this.responseInterceptor && !this.ejectInterceptor ? this._statusHandler(this.responseInterceptor(c)) : this._statusHandler(c);
    } catch (l) {
      return { message: l };
    }
  }
  setFetchOptions(e = {}) {
    Object.keys(e).length > 0 && "method" in e && delete e.method, this.fetchOptions = { ...e };
  }
  eject() {
    this.ejectInterceptor = true;
  }
  /**
  * Normalizes error messages from different response structures
  * @param data The response data that might contain error information
  * @returns A normalized error message string
  */
  _normalizeErrorMessage(e) {
    if (Array.isArray(e)) return e[0] || "Unknown error";
    if (e && typeof e == "object") {
      if (e.error) return e.error;
      for (const t in e) {
        if (Array.isArray(e[t])) return `${t}: ${e[t][0]}`;
        if (typeof e[t] == "string") return `${t}: ${e[t]}`;
      }
      if (e.slug) return e.slug;
    }
    return "Unknown error";
  }
  _statusHandler(e) {
    const t = /20[0-6]/g;
    return new Promise((r, s) => {
      if (t.test(`${e.status}`)) return r(e);
      const o = {
        message: this._normalizeErrorMessage(e.data),
        status: e.status,
        response: e
      };
      s(o);
    });
  }
}, Ye = We;
const ee = "SB-Agent", j = {
  defaultAgentName: "SB-JS-CLIENT",
  defaultAgentVersion: "SB-Agent-Version",
  packageVersion: "7.0.0"
}, Ke = {
  PUBLISHED: "published"
};
let x = {};
const E = {};
var Xe = class {
  /**
  *
  * @param config ISbConfig interface
  * @param pEndpoint string, optional
  */
  constructor(e, t) {
    g(this, "client"), g(this, "maxRetries"), g(this, "retriesDelay"), g(this, "throttle"), g(this, "accessToken"), g(this, "cache"), g(this, "resolveCounter"), g(this, "relations"), g(this, "links"), g(this, "version"), g(this, "richTextResolver"), g(this, "resolveNestedRelations"), g(this, "stringifiedStoriesCache"), g(this, "inlineAssets");
    let r = e.endpoint || t;
    if (!r) {
      const n = e.https === false ? "http" : "https";
      e.oauthToken ? r = `${n}://${Q(e.region)}/v1` : r = `${n}://${Q(e.region)}/v2`;
    }
    const s = new Headers();
    s.set("Content-Type", "application/json"), s.set("Accept", "application/json"), e.headers && (e.headers.constructor.name === "Headers" ? e.headers.entries().toArray() : Object.entries(e.headers)).forEach(([n, i]) => {
      s.set(n, i);
    }), s.has(ee) || (s.set(ee, j.defaultAgentName), s.set(j.defaultAgentVersion, j.packageVersion));
    let o = 5;
    e.oauthToken && (s.set("Authorization", e.oauthToken), o = 3), e.rateLimit && (o = e.rateLimit), this.maxRetries = e.maxRetries || 10, this.retriesDelay = 300, this.throttle = Be(this.throttledRequest.bind(this), o, 1e3), this.accessToken = e.accessToken || "", this.relations = {}, this.links = {}, this.cache = e.cache || { clear: "manual" }, this.resolveCounter = 0, this.resolveNestedRelations = e.resolveNestedRelations || true, this.stringifiedStoriesCache = {}, this.version = e.version || Ke.PUBLISHED, this.inlineAssets = e.inlineAssets || false, this.client = new Ye({
      baseURL: r,
      timeout: e.timeout || 0,
      headers: s,
      responseInterceptor: e.responseInterceptor,
      fetch: e.fetch
    });
  }
  parseParams(e) {
    return e.token || (e.token = this.getToken()), e.cv || (e.cv = E[e.token]), Array.isArray(e.resolve_relations) && (e.resolve_relations = e.resolve_relations.join(",")), typeof e.resolve_relations < "u" && (e.resolve_level = 2), e;
  }
  factoryParamOptions(e, t) {
    return X(e) ? this.parseParams(t) : t;
  }
  makeRequest(e, t, r, s, o) {
    const n = this.factoryParamOptions(e, Fe(t, r, s));
    return this.cacheResponse(e, n, void 0, o);
  }
  get(e, t = {}, r) {
    t || (t = {});
    const s = `/${e}`;
    X(s) && (t.version = t.version || this.version);
    const o = this.factoryParamOptions(s, t);
    return this.cacheResponse(s, o, void 0, r);
  }
  async getAll(e, t = {}, r, s) {
    const o = (t == null ? void 0 : t.per_page) || 25, n = `/${e}`.replace(/\/$/, ""), i = r ?? n.substring(n.lastIndexOf("/") + 1);
    t.version = t.version || this.version;
    const l = 1, c = await this.makeRequest(n, t, o, l, s), u = c.total ? Math.ceil(c.total / (c.perPage || o)) : 1, f = await qe(Ge(l, u), (m) => this.makeRequest(n, t, o, m + 1, s));
    return Je([c, ...f], (m) => Object.values(m.data[i]));
  }
  post(e, t = {}, r) {
    const s = `/${e}`;
    return this.throttle("post", s, t, r);
  }
  put(e, t = {}, r) {
    const s = `/${e}`;
    return this.throttle("put", s, t, r);
  }
  delete(e, t = {}, r) {
    t || (t = {});
    const s = `/${e}`;
    return this.throttle("delete", s, t, r);
  }
  getStories(e = {}, t) {
    return this._addResolveLevel(e), this.get("cdn/stories", e, t);
  }
  getStory(e, t = {}, r) {
    return this._addResolveLevel(t), this.get(`cdn/stories/${e}`, t, r);
  }
  getToken() {
    return this.accessToken;
  }
  ejectInterceptor() {
    this.client.eject();
  }
  _addResolveLevel(e) {
    typeof e.resolve_relations < "u" && (e.resolve_level = 2);
  }
  _cleanCopy(e) {
    return JSON.parse(JSON.stringify(e));
  }
  _insertLinks(e, t, r) {
    const s = e[t];
    s && s.fieldtype === "multilink" && s.linktype === "story" && typeof s.id == "string" && this.links[r][s.id] ? s.story = this._cleanCopy(this.links[r][s.id]) : s && s.linktype === "story" && typeof s.uuid == "string" && this.links[r][s.uuid] && (s.story = this._cleanCopy(this.links[r][s.uuid]));
  }
  /**
  *
  * @param resolveId A counter number as a string
  * @param uuid The uuid of the story
  * @returns string | object
  */
  getStoryReference(e, t) {
    return this.relations[e][t] ? JSON.parse(this.stringifiedStoriesCache[t] || JSON.stringify(this.relations[e][t])) : t;
  }
  /**
  * Resolves a field's value by replacing UUIDs with their corresponding story references
  * @param jtree - The JSON tree object containing the field to resolve
  * @param treeItem - The key of the field to resolve
  * @param resolveId - The unique identifier for the current resolution context
  *
  * This method handles both single string UUIDs and arrays of UUIDs:
  * - For single strings: directly replaces the UUID with the story reference
  * - For arrays: maps through each UUID and replaces with corresponding story references
  */
  _resolveField(e, t, r) {
    const s = e[t];
    typeof s == "string" ? e[t] = this.getStoryReference(r, s) : Array.isArray(s) && (e[t] = s.map((o) => this.getStoryReference(r, o)).filter(Boolean));
  }
  /**
  * Inserts relations into the JSON tree by resolving references
  * @param jtree - The JSON tree object to process
  * @param treeItem - The current field being processed
  * @param fields - The relation patterns to resolve (string or array of strings)
  * @param resolveId - The unique identifier for the current resolution context
  *
  * This method handles two types of relation patterns:
  * 1. Nested relations: matches fields that end with the current field name
  *    Example: If treeItem is "event_type", it matches patterns like "*.event_type"
  *
  * 2. Direct component relations: matches exact component.field patterns
  *    Example: "event.event_type" for component "event" and field "event_type"
  *
  * The method supports both string and array formats for the fields parameter,
  * allowing flexible specification of relation patterns.
  */
  _insertRelations(e, t, r, s) {
    if (Array.isArray(r) ? r.find((n) => n.endsWith(`.${t}`)) : r.endsWith(`.${t}`)) {
      this._resolveField(e, t, s);
      return;
    }
    const o = e.component ? `${e.component}.${t}` : t;
    (Array.isArray(r) ? r.includes(o) : r === o) && this._resolveField(e, t, s);
  }
  /**
  * Recursively traverses and resolves relations in the story content tree
  * @param story - The story object containing the content to process
  * @param fields - The relation patterns to resolve
  * @param resolveId - The unique identifier for the current resolution context
  */
  iterateTree(e, t, r) {
    const s = (o, n = "") => {
      if (!(!o || o._stopResolving)) {
        if (Array.isArray(o)) o.forEach((i, l) => s(i, `${n}[${l}]`));
        else if (typeof o == "object") for (const i in o) {
          const l = n ? `${n}.${i}` : i;
          (o.component && o._uid || o.type === "link") && (this._insertRelations(o, i, t, r), this._insertLinks(o, i, r)), s(o[i], l);
        }
      }
    };
    s(e.content);
  }
  async resolveLinks(e, t, r) {
    let s = [];
    if (e.link_uuids) {
      const o = e.link_uuids.length, n = [], i = 50;
      for (let l = 0; l < o; l += i) {
        const c = Math.min(o, l + i);
        n.push(e.link_uuids.slice(l, c));
      }
      for (let l = 0; l < n.length; l++)
        (await this.getStories({
          per_page: i,
          language: t.language,
          version: t.version,
          starts_with: t.starts_with,
          by_uuids: n[l].join(",")
        })).data.stories.forEach((c) => {
          s.push(c);
        });
    } else s = e.links;
    s.forEach((o) => {
      this.links[r][o.uuid] = {
        ...o,
        _stopResolving: true
      };
    });
  }
  async resolveRelations(e, t, r) {
    let s = [];
    if (e.rel_uuids) {
      const o = e.rel_uuids.length, n = [], i = 50;
      for (let l = 0; l < o; l += i) {
        const c = Math.min(o, l + i);
        n.push(e.rel_uuids.slice(l, c));
      }
      for (let l = 0; l < n.length; l++)
        (await this.getStories({
          per_page: i,
          language: t.language,
          version: t.version,
          starts_with: t.starts_with,
          by_uuids: n[l].join(","),
          excluding_fields: t.excluding_fields
        })).data.stories.forEach((c) => {
          s.push(c);
        });
      s.length > 0 && (e.rels = s, delete e.rel_uuids);
    } else s = e.rels;
    s && s.length > 0 && s.forEach((o) => {
      this.relations[r][o.uuid] = {
        ...o,
        _stopResolving: true
      };
    });
  }
  /**
  *
  * @param responseData
  * @param params
  * @param resolveId
  * @description Resolves the relations and links of the stories
  * @returns Promise<void>
  *
  */
  async resolveStories(e, t, r) {
    var s, o;
    let n = [];
    if (this.links[r] = {}, this.relations[r] = {}, typeof t.resolve_relations < "u" && t.resolve_relations.length > 0 && (typeof t.resolve_relations == "string" && (n = t.resolve_relations.split(",")), await this.resolveRelations(e, t, r)), t.resolve_links && [
      "1",
      "story",
      "url",
      "link"
    ].includes(t.resolve_links) && ((s = e.links) != null && s.length || (o = e.link_uuids) != null && o.length) && await this.resolveLinks(e, t, r), this.resolveNestedRelations) for (const i in this.relations[r]) this.iterateTree(this.relations[r][i], n, r);
    e.story ? this.iterateTree(e.story, n, r) : e.stories.forEach((i) => {
      this.iterateTree(i, n, r);
    }), this.stringifiedStoriesCache = {}, delete this.links[r], delete this.relations[r];
  }
  async cacheResponse(e, t, r, s) {
    const o = U({
      url: e,
      params: t
    }), n = this.cacheProvider();
    if (t.version === "published" && e !== "/cdn/spaces/me") {
      const i = await n.get(o);
      if (i) return Promise.resolve(i);
    }
    return new Promise(async (i, l) => {
      var c;
      try {
        const u = await this.throttle("get", e, t, s);
        if (u.status !== 200) return l(u);
        let f = {
          data: u.data,
          headers: u.headers
        };
        if ((c = u.headers) != null && c["per-page"] && (f = Object.assign({}, f, {
          perPage: u.headers["per-page"] ? Number.parseInt(u.headers["per-page"]) : 0,
          total: u.headers["per-page"] ? Number.parseInt(u.headers.total) : 0
        })), f.data.story || f.data.stories) {
          const A = this.resolveCounter = ++this.resolveCounter % 1e3;
          await this.resolveStories(f.data, t, `${A}`), f = await this.processInlineAssets(f);
        }
        t.version === "published" && e !== "/cdn/spaces/me" && await n.set(o, f);
        const m = this.cache.clear === "onpreview" && t.version === "draft" || this.cache.clear === "auto";
        return t.token && f.data.cv && (m && E[t.token] && E[t.token] !== f.data.cv && await this.flushCache(), E[t.token] = f.data.cv), i(f);
      } catch (u) {
        if (u.response && u.status === 429 && (r = typeof r > "u" ? 0 : r + 1, r < this.maxRetries))
          return console.log(`Hit rate limit. Retrying in ${this.retriesDelay / 1e3} seconds.`), await ze(this.retriesDelay), this.cacheResponse(e, t, r).then(i).catch(l);
        l(u);
      }
    });
  }
  throttledRequest(e, t, r, s) {
    return this.client.setFetchOptions(s), this.client[e](t, r);
  }
  cacheVersions() {
    return E;
  }
  cacheVersion() {
    return E[this.accessToken];
  }
  setCacheVersion(e) {
    this.accessToken && (E[this.accessToken] = e);
  }
  clearCacheVersion() {
    this.accessToken && (E[this.accessToken] = 0);
  }
  cacheProvider() {
    switch (this.cache.type) {
      case "memory":
        return {
          get(e) {
            return Promise.resolve(x[e]);
          },
          getAll() {
            return Promise.resolve(x);
          },
          set(e, t) {
            return x[e] = t, Promise.resolve(void 0);
          },
          flush() {
            return x = {}, Promise.resolve(void 0);
          }
        };
      case "custom":
        if (this.cache.custom) return this.cache.custom;
      default:
        return {
          get() {
            return Promise.resolve();
          },
          getAll() {
            return Promise.resolve(void 0);
          },
          set() {
            return Promise.resolve(void 0);
          },
          flush() {
            return Promise.resolve(void 0);
          }
        };
    }
  }
  async flushCache() {
    return await this.cacheProvider().flush(), this.clearCacheVersion(), this;
  }
  async processInlineAssets(e) {
    if (!this.inlineAssets) return e;
    const t = (r) => {
      if (!r || typeof r != "object") return r;
      if (Array.isArray(r)) return r.map((o) => t(o));
      let s = { ...r };
      s.fieldtype === "asset" && Array.isArray(e.data.assets) && (s = {
        ...e.data.assets.find((o) => o.id === s.id),
        ...s
      });
      for (const o in s) typeof s[o] == "object" && (s[o] = t(s[o]));
      return s;
    };
    return e.data.story && (e.data.story.content = t(e.data.story.content)), e.data.stories && (e.data.stories = e.data.stories.map((r) => (r.content = t(r.content), r))), e;
  }
}, Qe = Xe;
const ot = (e = {}) => {
  const { apiOptions: t } = e;
  if (!t || !t.accessToken) {
    console.error(
      "You need to provide an access token to interact with Storyblok API. Read https://www.storyblok.com/docs/api/content-delivery#topics/authentication"
    );
    return;
  }
  return { storyblokApi: new Qe(t) };
}, nt = (e) => {
  if (typeof e != "object" || typeof e._editable > "u")
    return {};
  try {
    const t = JSON.parse(
      e._editable.replace(/^<!--#storyblok#/, "").replace(/-->$/, "")
    );
    return t ? {
      "data-blok-c": JSON.stringify(t),
      "data-blok-uid": `${t.id}-${t.uid}`
    } : {};
  } catch {
    return {};
  }
};
let M = "https://app.storyblok.com/f/storyblok-v2-latest.js";
const it = (e = {}) => {
  var t, r;
  const {
    bridge: s,
    accessToken: o,
    use: n = [],
    apiOptions: i = {},
    bridgeUrl: l
  } = e;
  i.accessToken = i.accessToken || o;
  const c = { bridge: s, apiOptions: i };
  let u = {};
  n.forEach((m) => {
    u = { ...u, ...m(c) };
  }), l && (M = l);
  const f = !(typeof window > "u") && ((r = (t = window.location) == null ? void 0 : t.search) == null ? void 0 : r.includes("_storyblok_tk"));
  return s !== false && f && se(M), u;
};

const { storyblokApi } = it({
            accessToken: "your_storyblok_preview_access_token",
            use: [ot],
            apiOptions: undefined,
          });
          const storyblokApiInstance = storyblokApi;

globalThis.storyblokApiInstance = storyblokApiInstance;

const $$Astro$2 = createAstro("https://localhost:4321");
const $$Header = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Header;
  const links = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" }
  ];
  return renderTemplate`${maybeRenderHead()}<header id="main-header" class="sticky top-0 z-50 w-full border-b border-transparent bg-transparent transition-all duration-300 ease-in-out"> <div class="container flex h-14 max-w-screen-2xl items-center justify-between px-4 md:px-8"> <div class="mr-4 hidden md:flex"> <a href="/" class="mr-6 flex items-center space-x-2"> <span class="hidden font-bold sm:inline-block text-foreground">Astro Template</span> </a> <nav class="flex items-center gap-6 text-sm"> ${links.map((link) => renderTemplate`<a${addAttribute(link.href, "href")} class="transition-colors hover:text-foreground/80 text-foreground/60"> ${link.name} </a>`)} </nav> </div> <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 w-9 px-0 md:hidden"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg> <span class="sr-only">Toggle Menu</span> </button> <div class="flex flex-1 items-center justify-between space-x-2 md:justify-end"> <div class="w-full flex-1 md:w-auto md:flex-none"></div> <nav class="flex items-center"></nav> </div> </div> </header> ${renderScript($$result, "/Users/adammerrill/Projects/astro-js-template/src/components/ui/Header.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/adammerrill/Projects/astro-js-template/src/components/ui/Header.astro", void 0);

const $$Astro$1 = createAstro("https://localhost:4321");
const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Footer;
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  return renderTemplate`${maybeRenderHead()}<footer class="border-t border-border bg-secondary/50 py-6 md:px-8 md:py-0 mt-auto"> <div class="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row"> <p class="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
&copy; ${year} Built with Astro & shadcn/ui.
</p> <div class="flex gap-4"> <a href="#" class="text-sm font-medium underline underline-offset-4 hover:text-primary">Privacy Policy</a> <a href="#" class="text-sm font-medium underline underline-offset-4 hover:text-primary">Terms of Service</a> </div> </div> </footer>`;
}, "/Users/adammerrill/Projects/astro-js-template/src/components/ui/Footer.astro", void 0);

const $$Astro = createAstro("https://localhost:4321");
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title = "Astro Template" } = Astro2.props;
  return renderTemplate`<html lang="en" class="h-full w-full"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title>${renderHead()}</head> <body class="min-h-screen flex flex-col bg-background font-sans text-foreground"> ${renderComponent($$result, "Header", $$Header, {})} <!-- 
            min-h-screen on main ensures it fills the viewport height, 
            pushing the footer below the fold.
        --> <main class="flex-1 min-h-screen flex flex-col relative"> ${renderSlot($$result, $$slots["default"])} </main> ${renderComponent($$result, "Footer", $$Footer, {})} </body></html>`;
}, "/Users/adammerrill/Projects/astro-js-template/src/layouts/Layout.astro", void 0);

export { $$Layout as $, $e as a, et as e, nt as n };
