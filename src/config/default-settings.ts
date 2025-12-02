/**
 * @file default-settings.ts
 * @description Provides a local, static fallback object for global settings.
 * This is used when the Storyblok story (config/global-settings) cannot be fetched,
 * preventing 404 API errors.
 *
 * @module config/default-settings
 * @remark Updated to strictly match the 'StoryblokLink' type (removed 'fieldtype').
 */

import type { GlobalSettings } from "@/types/storyblok";

/**
 * @constant {GlobalSettings} defaultGlobalSettings
 * @description The concrete default values to be used as a fallback.
 * Conforms strictly to the Storyblok component schema.
 */
export const defaultGlobalSettings: GlobalSettings = {
  component: "global-settings",
  _uid: "default-global-settings-uid",
  _editable: "",

  site_title: "Default Site Title",
  site_description: "A comprehensive digital solution (Fallback).",

  // --- Header Navigation ---
  // Matches 'NavigationItem' type
  header_nav: [
    {
      _uid: "nav-item-1",
      component: "navigation_item",
      name: "Home",
      link: {
        id: "",
        url: "/",
        linktype: "url",
        cached_url: "/",
      },
    },
    {
      _uid: "nav-item-2",
      component: "navigation_item",
      name: "Pricing",
      link: {
        id: "",
        url: "/pricing",
        linktype: "url",
        cached_url: "/pricing",
      },
    },
    {
      _uid: "nav-item-3",
      component: "navigation_item",
      name: "Contact",
      link: {
        id: "",
        url: "/contact",
        linktype: "url",
        cached_url: "/contact",
      },
    },
  ],

  // --- Footer Configuration ---
  // Matches 'FooterColumn' type with nested links
  footer_columns: [
    {
      _uid: "footer-col-1",
      component: "footer_column",
      title: "Company",
      links: [
        {
          _uid: "footer-link-1",
          component: "navigation_item",
          name: "About Us",
          link: {
            id: "",
            url: "/about",
            linktype: "url",
            cached_url: "/about",
          },
        },
        {
          _uid: "footer-link-2",
          component: "navigation_item",
          name: "Careers",
          link: {
            id: "",
            url: "/careers",
            linktype: "url",
            cached_url: "/careers",
          },
        },
      ],
    },
    {
      _uid: "footer-col-2",
      component: "footer_column",
      title: "Resources",
      links: [
        {
          _uid: "footer-link-3",
          component: "navigation_item",
          name: "Support",
          link: {
            id: "",
            url: "/support",
            linktype: "url",
            cached_url: "/support",
          },
        },
      ],
    },
  ],
};
