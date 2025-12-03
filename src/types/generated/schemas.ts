/**
 * 🤖 AUTO-GENERATED ZOD SCHEMAS. DO NOT EDIT.
 */
import { z } from "zod";

export const ContactFormBlokSchema: z.ZodType<any> = z.object({
  _uid: z.string(),
  component: z.literal("contact_form"),
  _editable: z.string().optional(),
  headline: z.string().optional(),
  subheadline: z.string().optional(),
  submit_label: z.string().optional(),
  success_message: z.string().optional(),
  api_endpoint: z.string().optional(),
});

export const FeatureBlokSchema: z.ZodType<any> = z.object({
  _uid: z.string(),
  component: z.literal("feature"),
  _editable: z.string().optional(),
  name: z.string().optional(),
  headline: z.string().optional(),
  description: z.string().optional(),
  link: z
    .object({
      cached_url: z.string().optional(),
      url: z.string().optional(),
      linktype: z.string().optional(),
    })
    .optional(),
  image: z
    .object({
      filename: z.string(),
      alt: z.string().optional(),
      id: z.number().optional(),
    })
    .optional(),
});

export const FeatureAlternatingBlokSchema: z.ZodType<any> = z.object({
  _uid: z.string(),
  component: z.literal("feature_alternating"),
  _editable: z.string().optional(),
  headline: z.string().optional(),
  subheadline: z.string().optional(),
  items: z.array(z.lazy(() => StoryblokComponentSchema)).optional(),
});

export const FeatureAlternatingItemBlokSchema: z.ZodType<any> = z.object({
  _uid: z.string(),
  component: z.literal("feature_alternating_item"),
  _editable: z.string().optional(),
  headline: z.string().optional(),
  description: z.string().optional(),
  image: z
    .object({
      filename: z.string(),
      alt: z.string().optional(),
      id: z.number().optional(),
    })
    .optional(),
  cta_label: z.string().optional(),
  cta_url: z
    .object({
      cached_url: z.string().optional(),
      url: z.string().optional(),
      linktype: z.string().optional(),
    })
    .optional(),
});

export const FeatureGridBlokSchema: z.ZodType<any> = z.object({
  _uid: z.string(),
  component: z.literal("feature_grid"),
  _editable: z.string().optional(),
  headline: z.string().optional(),
  description: z.string().optional(),
  columns: z.array(z.lazy(() => StoryblokComponentSchema)).optional(),
});

export const GridBlokSchema: z.ZodType<any> = z.object({
  _uid: z.string(),
  component: z.literal("grid"),
  _editable: z.string().optional(),
  columns: z.array(z.lazy(() => StoryblokComponentSchema)).optional(),
});

export const HeroConsultantBlokSchema: z.ZodType<any> = z.object({
  _uid: z.string(),
  component: z.literal("hero_consultant"),
  _editable: z.string().optional(),
  headline: z.string(),
  subheadline: z.string().optional(),
  headshot: z
    .object({
      filename: z.string(),
      alt: z.string().optional(),
      id: z.number().optional(),
    })
    .optional(),
  cta_primary_label: z.string().optional(),
  cta_primary: z
    .object({
      cached_url: z.string().optional(),
      url: z.string().optional(),
      linktype: z.string().optional(),
    })
    .optional(),
});

export const HeroLocalBlokSchema: z.ZodType<any> = z.object({
  _uid: z.string(),
  component: z.literal("hero_local"),
  _editable: z.string().optional(),
  headline: z.string(),
  subheadline: z.string().optional(),
  service_area: z.string().optional(),
  background_image: z
    .object({
      filename: z.string(),
      alt: z.string().optional(),
      id: z.number().optional(),
    })
    .optional(),
  cta_primary_label: z.string().optional(),
  form_placeholder_text: z.string().optional(),
});

export const HeroSaasBlokSchema: z.ZodType<any> = z.object({
  _uid: z.string(),
  component: z.literal("hero_saas"),
  _editable: z.string().optional(),
  headline: z.string(),
  subheadline: z.string().optional(),
  badge: z.string().optional(),
  image: z
    .object({
      filename: z.string(),
      alt: z.string().optional(),
      id: z.number().optional(),
    })
    .optional(),
  cta_primary_label: z.string().optional(),
  cta_primary: z
    .object({
      cached_url: z.string().optional(),
      url: z.string().optional(),
      linktype: z.string().optional(),
    })
    .optional(),
  cta_secondary_label: z.string().optional(),
  cta_secondary: z
    .object({
      cached_url: z.string().optional(),
      url: z.string().optional(),
      linktype: z.string().optional(),
    })
    .optional(),
});

export const LogoCloudBlokSchema: z.ZodType<any> = z.object({
  _uid: z.string(),
  component: z.literal("logo_cloud"),
  _editable: z.string().optional(),
  headline: z.string().optional(),
  logos: z.array(z.lazy(() => StoryblokComponentSchema)).optional(),
});

export const LogoItemBlokSchema: z.ZodType<any> = z.object({
  _uid: z.string(),
  component: z.literal("logo_item"),
  _editable: z.string().optional(),
  name: z.string().optional(),
  filename: z
    .object({
      filename: z.string(),
      alt: z.string().optional(),
      id: z.number().optional(),
    })
    .optional(),
  alt: z.string().optional(),
});

export const PageBlokSchema: z.ZodType<any> = z.object({
  _uid: z.string(),
  component: z.literal("page"),
  _editable: z.string().optional(),
  body: z.array(z.lazy(() => StoryblokComponentSchema)).optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
});

export const PricingFeatureBlokSchema: z.ZodType<any> = z.object({
  _uid: z.string(),
  component: z.literal("pricing_feature"),
  _editable: z.string().optional(),
  text: z.string().optional(),
});

export const PricingTableBlokSchema: z.ZodType<any> = z.object({
  _uid: z.string(),
  component: z.literal("pricing_table"),
  _editable: z.string().optional(),
  headline: z.string().optional(),
  subheadline: z.string().optional(),
  tiers: z.array(z.lazy(() => StoryblokComponentSchema)).optional(),
});

export const PricingTierBlokSchema: z.ZodType<any> = z.object({
  _uid: z.string(),
  component: z.literal("pricing_tier"),
  _editable: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  price_monthly: z.string().optional(),
  price_yearly: z.string().optional(),
  highlight: z
    .union([
      z.boolean(),
      z.string().transform((v) => v === "true" || v === "1"),
    ])
    .optional(),
  cta_label: z.string().optional(),
  cta_url: z
    .object({
      cached_url: z.string().optional(),
      url: z.string().optional(),
      linktype: z.string().optional(),
    })
    .optional(),
  features: z.array(z.lazy(() => StoryblokComponentSchema)).optional(),
});

export const RequestQuoteFormBlokSchema: z.ZodType<any> = z.object({
  _uid: z.string(),
  component: z.literal("request_quote_form"),
  _editable: z.string().optional(),
  headline: z.string().optional(),
  subheadline: z.string().optional(),
  api_endpoint: z.string().optional(),
});

export const TeaserBlokSchema: z.ZodType<any> = z.object({
  _uid: z.string(),
  component: z.literal("teaser"),
  _editable: z.string().optional(),
  headline: z.string().optional(),
});

export const TestimonialBlokSchema: z.ZodType<any> = z.object({
  _uid: z.string(),
  component: z.literal("testimonial"),
  _editable: z.string().optional(),
  name: z.string().optional(),
  title: z.string().optional(),
  quote: z.string().optional(),
});

export const TestimonialSliderBlokSchema: z.ZodType<any> = z.object({
  _uid: z.string(),
  component: z.literal("testimonial_slider"),
  _editable: z.string().optional(),
  headline: z.string().optional(),
  testimonials: z.array(z.lazy(() => StoryblokComponentSchema)).optional(),
});

export const StoryblokComponentSchema: z.ZodType<any> = z.union([
  ContactFormBlokSchema,
  FeatureBlokSchema,
  FeatureAlternatingBlokSchema,
  FeatureAlternatingItemBlokSchema,
  FeatureGridBlokSchema,
  GridBlokSchema,
  HeroConsultantBlokSchema,
  HeroLocalBlokSchema,
  HeroSaasBlokSchema,
  LogoCloudBlokSchema,
  LogoItemBlokSchema,
  PageBlokSchema,
  PricingFeatureBlokSchema,
  PricingTableBlokSchema,
  PricingTierBlokSchema,
  RequestQuoteFormBlokSchema,
  TeaserBlokSchema,
  TestimonialBlokSchema,
  TestimonialSliderBlokSchema,
]);
