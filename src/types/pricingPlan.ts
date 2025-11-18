/**
 * Pricing Plan Data Structure
 * Designed for flexible backend integration and efficient rendering
 */

// Plan type categories
export type PlanCategory = 'directories' | 'enrichment';

// Industry vertical categories
export type IndustryVertical =
  | 'capital_markets'
  | 'real_estate_lending'
  | 'business_corporate';

// Billing cycle options
export type BillingCycle = 'monthly' | 'yearly';

// Plan tier levels
export type PlanTier = 'essential' | 'professional' | 'institutional';

// Button action types
export type ButtonAction =
  | 'request_access'
  | 'choose_plan'
  | 'current_plan'
  | 'talk_to_team';

// Button variant styles
export type ButtonVariant = 'primary' | 'secondary' | 'disabled';

/**
 * Feature item in a pricing plan
 */
export interface PricingFeature {
  id: string;
  text: string;
  icon?: string; // URL to icon or icon name
  highlighted?: boolean; // For bold/emphasized features
}

/**
 * Pricing information for a plan
 */
export interface PricingInfo {
  amount?: number; // null for "Request pricing"
  currency: string; // e.g., "USD"
  billingCycle: BillingCycle;
  displayText?: string; // e.g., "per month", "Request pricing"
  yearlyDiscount?: number; // e.g., 17 for 17% off
}

/**
 * Button configuration for a plan
 */
export interface PlanButton {
  action: ButtonAction;
  text: string;
  variant: ButtonVariant;
  disabled?: boolean;
}

/**
 * Individual pricing plan
 */
export interface PricingPlan {
  id: string;
  tier: PlanTier;
  name: string; // e.g., "Capital Markets Research", "Essential"
  subtitle: string; // e.g., "Built for emerging teams", "100 verified records per month"
  pricing: PricingInfo;
  button: PlanButton;
  features: PricingFeature[];
  isHighlighted?: boolean; // For featured/recommended plans
  isCurrentPlan?: boolean; // User's current plan
}

/**
 * Industry vertical with its plans
 */
export interface IndustryPlans {
  vertical: IndustryVertical;
  displayName: string; // e.g., "Capital Markets", "Real Estate & Lending"
  plans: PricingPlan[];
}

/**
 * Complete pricing configuration for a category
 */
export interface PricingCategory {
  category: PlanCategory;
  displayName: string; // e.g., "Directories", "Enrichment"
  industries: IndustryPlans[];
}

/**
 * Root pricing data structure from backend
 */
export interface PricingData {
  categories: PricingCategory[];
  defaultCategory?: PlanCategory;
  defaultIndustry?: IndustryVertical;
  defaultBillingCycle?: BillingCycle;
}

/**
 * API Response wrapper
 */
export interface PricingApiResponse {
  success: boolean;
  data: PricingData;
  message?: string;
}

/**
 * User's current subscription info
 */
export interface UserSubscription {
  planId: string;
  tier: PlanTier;
  category: PlanCategory;
  industry: IndustryVertical;
  billingCycle: BillingCycle;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface PlanPaymentDetail {
  credit: null | number;
  creditType: string;
  planDateTypeName: string;
  price: null | number;
  priceAdditionalInfo: string | null;
  type: null | string;
}

export interface PlanInfo {
  packages: string[];
  paymentDetail: PlanPaymentDetail[];
  planName: string;
  isDefault: boolean;
}

export interface PlanCategoryConfig {
  category: string;
  categoryName: string;
  plans: PlanInfo[];
}

export interface PricingPlanResponse {
  [key: string]: PlanCategoryConfig[];
}
