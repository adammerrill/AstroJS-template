/**
 * 🤖 AUTO-GENERATED FILE. DO NOT EDIT.
 * Source: Storyblok Management API
 */
import type {
  StoryblokAsset,
  StoryblokLink,
  StoryblokRichText,
} from "@/types/storyblok";

export interface ContactFormBlok {
  _uid: string;
  component: "contact_form";
  _editable?: string;

  headline?: string;

  subheadline?: string;

  submit_label?: string;

  success_message?: string;

  api_endpoint?: string;
}

export interface FeatureBlok {
  _uid: string;
  component: "feature";
  _editable?: string;

  /**
   * Internal name
   */
  name?: string;

  headline?: string;

  description?: string;

  link?: StoryblokLink;

  image?: StoryblokAsset;
}

export interface FeatureAlternatingBlok {
  _uid: string;
  component: "feature_alternating";
  _editable?: string;

  headline?: string;

  subheadline?: string;

  items?: FeatureAlternatingItemBlok[];
}

export interface FeatureAlternatingItemBlok {
  _uid: string;
  component: "feature_alternating_item";
  _editable?: string;

  headline?: string;

  description?: string;

  image?: StoryblokAsset;

  cta_label?: string;

  cta_url?: StoryblokLink;
}

export interface FeatureGridBlok {
  _uid: string;
  component: "feature_grid";
  _editable?: string;

  headline?: string;

  description?: string;

  columns?: FeatureBlok[];
}

export interface GridBlok {
  _uid: string;
  component: "grid";
  _editable?: string;

  columns?: any[];
}

export interface HeroConsultantBlok {
  _uid: string;
  component: "hero_consultant";
  _editable?: string;

  headline: string;

  subheadline?: string;

  headshot?: StoryblokAsset;

  cta_primary_label?: string;

  cta_primary?: StoryblokLink;
}

export interface HeroLocalBlok {
  _uid: string;
  component: "hero_local";
  _editable?: string;

  headline: string;

  subheadline?: string;

  service_area?: string;

  background_image?: StoryblokAsset;

  cta_primary_label?: string;

  form_placeholder_text?: string;
}

export interface HeroSaasBlok {
  _uid: string;
  component: "hero_saas";
  _editable?: string;

  headline: string;

  subheadline?: string;

  badge?: string;

  image?: StoryblokAsset;

  cta_primary_label?: string;

  cta_primary?: StoryblokLink;

  cta_secondary_label?: string;

  cta_secondary?: StoryblokLink;
}

export interface LogoCloudBlok {
  _uid: string;
  component: "logo_cloud";
  _editable?: string;

  headline?: string;

  logos?: LogoItemBlok[];
}

export interface LogoItemBlok {
  _uid: string;
  component: "logo_item";
  _editable?: string;

  name?: string;

  filename?: StoryblokAsset;

  alt?: string;
}

export interface PageBlok {
  _uid: string;
  component: "page";
  _editable?: string;

  body?: any[];

  seo_title?: string;

  seo_description?: string;
}

export interface PricingFeatureBlok {
  _uid: string;
  component: "pricing_feature";
  _editable?: string;

  text?: string;
}

export interface PricingTableBlok {
  _uid: string;
  component: "pricing_table";
  _editable?: string;

  headline?: string;

  subheadline?: string;

  tiers?: PricingTierBlok[];
}

export interface PricingTierBlok {
  _uid: string;
  component: "pricing_tier";
  _editable?: string;

  name?: string;

  description?: string;

  price_monthly?: string;

  price_yearly?: string;

  highlight?: boolean;

  cta_label?: string;

  cta_url?: StoryblokLink;

  features?: PricingFeatureBlok[];
}

export interface RequestQuoteFormBlok {
  _uid: string;
  component: "request_quote_form";
  _editable?: string;

  headline?: string;

  subheadline?: string;

  api_endpoint?: string;
}

export interface TeaserBlok {
  _uid: string;
  component: "teaser";
  _editable?: string;

  headline?: string;
}

export interface TestimonialBlok {
  _uid: string;
  component: "testimonial";
  _editable?: string;

  name?: string;

  title?: string;

  quote?: string;
}

export interface TestimonialSliderBlok {
  _uid: string;
  component: "testimonial_slider";
  _editable?: string;

  headline?: string;

  testimonials?: TestimonialBlok[];
}

export type StoryblokComponent =
  | ContactFormBlok
  | FeatureBlok
  | FeatureAlternatingBlok
  | FeatureAlternatingItemBlok
  | FeatureGridBlok
  | GridBlok
  | HeroConsultantBlok
  | HeroLocalBlok
  | HeroSaasBlok
  | LogoCloudBlok
  | LogoItemBlok
  | PageBlok
  | PricingFeatureBlok
  | PricingTableBlok
  | PricingTierBlok
  | RequestQuoteFormBlok
  | TeaserBlok
  | TestimonialBlok
  | TestimonialSliderBlok;
