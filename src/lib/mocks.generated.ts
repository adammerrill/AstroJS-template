/**
 * 🤖 AUTO-GENERATED MOCK FACTORY. DO NOT EDIT.
 */
import { faker } from "@faker-js/faker";
import type * as Types from "../types/generated/storyblok";

export const MockFactory = {
  contact_form: (
    overrides?: Partial<Types.ContactFormBlok>,
  ): Types.ContactFormBlok => {
    const defaults = {
      _uid: faker.string.uuid(),
      component: "contact_form" as const,
      _editable: "<!--#storyblok#-->",
      headline: faker.company.catchPhrase(),
      subheadline: faker.company.catchPhrase(),
      submit_label: faker.lorem.sentence(),
      success_message: faker.lorem.sentence(),
      api_endpoint: faker.lorem.sentence(),
    };
    return { ...defaults, ...overrides } as Types.ContactFormBlok;
  },

  feature: (overrides?: Partial<Types.FeatureBlok>): Types.FeatureBlok => {
    const defaults = {
      _uid: faker.string.uuid(),
      component: "feature" as const,
      _editable: "<!--#storyblok#-->",
      name: faker.person.fullName(),
      headline: faker.company.catchPhrase(),
      description: faker.lorem.sentence(),
      link: {
        url: faker.internet.url(),
        cached_url: faker.internet.domainWord(),
        linktype: "url",
        id: "",
        target: "_self",
      },
      image: {
        filename: faker.image.url(),
        alt: faker.lorem.words(3),
        id: faker.number.int(),
        copyright: "",
        fieldtype: "asset",
      },
    };
    return { ...defaults, ...overrides } as Types.FeatureBlok;
  },

  feature_alternating: (
    overrides?: Partial<Types.FeatureAlternatingBlok>,
  ): Types.FeatureAlternatingBlok => {
    const defaults = {
      _uid: faker.string.uuid(),
      component: "feature_alternating" as const,
      _editable: "<!--#storyblok#-->",
      headline: faker.company.catchPhrase(),
      subheadline: faker.company.catchPhrase(),
      items: [],
    };
    return { ...defaults, ...overrides } as Types.FeatureAlternatingBlok;
  },

  feature_alternating_item: (
    overrides?: Partial<Types.FeatureAlternatingItemBlok>,
  ): Types.FeatureAlternatingItemBlok => {
    const defaults = {
      _uid: faker.string.uuid(),
      component: "feature_alternating_item" as const,
      _editable: "<!--#storyblok#-->",
      headline: faker.company.catchPhrase(),
      description: faker.lorem.sentence(),
      image: {
        filename: faker.image.url(),
        alt: faker.lorem.words(3),
        id: faker.number.int(),
        copyright: "",
        fieldtype: "asset",
      },
      cta_label: faker.lorem.sentence(),
      cta_url: {
        url: faker.internet.url(),
        cached_url: faker.internet.domainWord(),
        linktype: "url",
        id: "",
        target: "_self",
      },
    };
    return { ...defaults, ...overrides } as Types.FeatureAlternatingItemBlok;
  },

  feature_grid: (
    overrides?: Partial<Types.FeatureGridBlok>,
  ): Types.FeatureGridBlok => {
    const defaults = {
      _uid: faker.string.uuid(),
      component: "feature_grid" as const,
      _editable: "<!--#storyblok#-->",
      headline: faker.company.catchPhrase(),
      description: faker.lorem.sentence(),
      columns: [],
    };
    return { ...defaults, ...overrides } as Types.FeatureGridBlok;
  },

  grid: (overrides?: Partial<Types.GridBlok>): Types.GridBlok => {
    const defaults = {
      _uid: faker.string.uuid(),
      component: "grid" as const,
      _editable: "<!--#storyblok#-->",
      columns: [],
    };
    return { ...defaults, ...overrides } as Types.GridBlok;
  },

  hero_consultant: (
    overrides?: Partial<Types.HeroConsultantBlok>,
  ): Types.HeroConsultantBlok => {
    const defaults = {
      _uid: faker.string.uuid(),
      component: "hero_consultant" as const,
      _editable: "<!--#storyblok#-->",
      headline: faker.company.catchPhrase(),
      subheadline: faker.company.catchPhrase(),
      headshot: {
        filename: faker.image.url(),
        alt: faker.lorem.words(3),
        id: faker.number.int(),
        copyright: "",
        fieldtype: "asset",
      },
      cta_primary_label: faker.lorem.sentence(),
      cta_primary: {
        url: faker.internet.url(),
        cached_url: faker.internet.domainWord(),
        linktype: "url",
        id: "",
        target: "_self",
      },
    };
    return { ...defaults, ...overrides } as Types.HeroConsultantBlok;
  },

  hero_local: (
    overrides?: Partial<Types.HeroLocalBlok>,
  ): Types.HeroLocalBlok => {
    const defaults = {
      _uid: faker.string.uuid(),
      component: "hero_local" as const,
      _editable: "<!--#storyblok#-->",
      headline: faker.company.catchPhrase(),
      subheadline: faker.company.catchPhrase(),
      service_area: faker.lorem.sentence(),
      background_image: {
        filename: faker.image.url(),
        alt: faker.lorem.words(3),
        id: faker.number.int(),
        copyright: "",
        fieldtype: "asset",
      },
      cta_primary_label: faker.lorem.sentence(),
      form_placeholder_text: faker.lorem.sentence(),
    };
    return { ...defaults, ...overrides } as Types.HeroLocalBlok;
  },

  hero_saas: (overrides?: Partial<Types.HeroSaasBlok>): Types.HeroSaasBlok => {
    const defaults = {
      _uid: faker.string.uuid(),
      component: "hero_saas" as const,
      _editable: "<!--#storyblok#-->",
      headline: faker.company.catchPhrase(),
      subheadline: faker.company.catchPhrase(),
      badge: faker.lorem.sentence(),
      image: {
        filename: faker.image.url(),
        alt: faker.lorem.words(3),
        id: faker.number.int(),
        copyright: "",
        fieldtype: "asset",
      },
      cta_primary_label: faker.lorem.sentence(),
      cta_primary: {
        url: faker.internet.url(),
        cached_url: faker.internet.domainWord(),
        linktype: "url",
        id: "",
        target: "_self",
      },
      cta_secondary_label: faker.lorem.sentence(),
      cta_secondary: {
        url: faker.internet.url(),
        cached_url: faker.internet.domainWord(),
        linktype: "url",
        id: "",
        target: "_self",
      },
    };
    return { ...defaults, ...overrides } as Types.HeroSaasBlok;
  },

  logo_cloud: (
    overrides?: Partial<Types.LogoCloudBlok>,
  ): Types.LogoCloudBlok => {
    const defaults = {
      _uid: faker.string.uuid(),
      component: "logo_cloud" as const,
      _editable: "<!--#storyblok#-->",
      headline: faker.company.catchPhrase(),
      logos: [],
    };
    return { ...defaults, ...overrides } as Types.LogoCloudBlok;
  },

  logo_item: (overrides?: Partial<Types.LogoItemBlok>): Types.LogoItemBlok => {
    const defaults = {
      _uid: faker.string.uuid(),
      component: "logo_item" as const,
      _editable: "<!--#storyblok#-->",
      name: faker.person.fullName(),
      filename: {
        filename: faker.image.url(),
        alt: faker.lorem.words(3),
        id: faker.number.int(),
        copyright: "",
        fieldtype: "asset",
      },
      alt: faker.lorem.sentence(),
    };
    return { ...defaults, ...overrides } as Types.LogoItemBlok;
  },

  page: (overrides?: Partial<Types.PageBlok>): Types.PageBlok => {
    const defaults = {
      _uid: faker.string.uuid(),
      component: "page" as const,
      _editable: "<!--#storyblok#-->",
      body: [],
      seo_title: faker.person.fullName(),
      seo_description: faker.lorem.sentence(),
    };
    return { ...defaults, ...overrides } as Types.PageBlok;
  },

  pricing_feature: (
    overrides?: Partial<Types.PricingFeatureBlok>,
  ): Types.PricingFeatureBlok => {
    const defaults = {
      _uid: faker.string.uuid(),
      component: "pricing_feature" as const,
      _editable: "<!--#storyblok#-->",
      text: faker.lorem.sentence(),
    };
    return { ...defaults, ...overrides } as Types.PricingFeatureBlok;
  },

  pricing_table: (
    overrides?: Partial<Types.PricingTableBlok>,
  ): Types.PricingTableBlok => {
    const defaults = {
      _uid: faker.string.uuid(),
      component: "pricing_table" as const,
      _editable: "<!--#storyblok#-->",
      headline: faker.company.catchPhrase(),
      subheadline: faker.company.catchPhrase(),
      tiers: [],
    };
    return { ...defaults, ...overrides } as Types.PricingTableBlok;
  },

  pricing_tier: (
    overrides?: Partial<Types.PricingTierBlok>,
  ): Types.PricingTierBlok => {
    const defaults = {
      _uid: faker.string.uuid(),
      component: "pricing_tier" as const,
      _editable: "<!--#storyblok#-->",
      name: faker.person.fullName(),
      description: faker.lorem.sentence(),
      price_monthly: faker.commerce.price({ symbol: "$" }),
      price_yearly: faker.commerce.price({ symbol: "$" }),
      highlight: faker.datatype.boolean(),
      cta_label: faker.lorem.sentence(),
      cta_url: {
        url: faker.internet.url(),
        cached_url: faker.internet.domainWord(),
        linktype: "url",
        id: "",
        target: "_self",
      },
      features: [],
    };
    return { ...defaults, ...overrides } as Types.PricingTierBlok;
  },

  request_quote_form: (
    overrides?: Partial<Types.RequestQuoteFormBlok>,
  ): Types.RequestQuoteFormBlok => {
    const defaults = {
      _uid: faker.string.uuid(),
      component: "request_quote_form" as const,
      _editable: "<!--#storyblok#-->",
      headline: faker.company.catchPhrase(),
      subheadline: faker.company.catchPhrase(),
      api_endpoint: faker.lorem.sentence(),
    };
    return { ...defaults, ...overrides } as Types.RequestQuoteFormBlok;
  },

  teaser: (overrides?: Partial<Types.TeaserBlok>): Types.TeaserBlok => {
    const defaults = {
      _uid: faker.string.uuid(),
      component: "teaser" as const,
      _editable: "<!--#storyblok#-->",
      headline: faker.company.catchPhrase(),
    };
    return { ...defaults, ...overrides } as Types.TeaserBlok;
  },

  testimonial: (
    overrides?: Partial<Types.TestimonialBlok>,
  ): Types.TestimonialBlok => {
    const defaults = {
      _uid: faker.string.uuid(),
      component: "testimonial" as const,
      _editable: "<!--#storyblok#-->",
      name: faker.person.fullName(),
      title: faker.person.fullName(),
      quote: faker.lorem.sentence(),
    };
    return { ...defaults, ...overrides } as Types.TestimonialBlok;
  },

  testimonial_slider: (
    overrides?: Partial<Types.TestimonialSliderBlok>,
  ): Types.TestimonialSliderBlok => {
    const defaults = {
      _uid: faker.string.uuid(),
      component: "testimonial_slider" as const,
      _editable: "<!--#storyblok#-->",
      headline: faker.company.catchPhrase(),
      testimonials: [],
    };
    return { ...defaults, ...overrides } as Types.TestimonialSliderBlok;
  },
};
