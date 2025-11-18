import {
  IndustryPlans,
  PricingCategory,
  PricingData,
  PricingPlan,
} from '@/types/pricingPlan';

/**
 * Mock pricing data matching the Figma designs
 * This demonstrates the data structure for backend implementation
 */

// Capital Markets - Directories Plans
const capitalMarketsDirectoriesPlans: PricingPlan[] = [
  {
    id: 'cm_research',
    tier: 'essential',
    name: 'Capital Markets Research',
    subtitle: 'Built for emerging teams',
    pricing: {
      currency: 'USD',
      billingCycle: 'monthly',
      displayText: 'Request access',
    },
    button: {
      action: 'request_access',
      text: 'Request access',
      variant: 'secondary',
    },
    features: [
      { id: 'f1', text: 'Unlimited searches' },
      {
        id: 'f2',
        text: 'Firm info: Name, Description, Type, Location, Website, Phone, AUM (when available)',
      },
      { id: 'f3', text: 'Contact info: Name, Title, Email, Phone' },
      { id: 'f4', text: 'Up to 100 records per search' },
      {
        id: 'f5',
        text: 'Ideal for analysts, advisors, and small funds',
      },
    ],
    isHighlighted: false,
  },
  {
    id: 'cm_intelligence',
    tier: 'institutional',
    name: 'Capital Markets Intelligence',
    subtitle: 'For institutional investors',
    pricing: {
      currency: 'USD',
      billingCycle: 'monthly',
      displayText: 'Request access',
    },
    button: {
      action: 'request_access',
      text: 'Request access',
      variant: 'primary',
    },
    features: [
      {
        id: 'f1',
        text: 'Includes everything in Research, plus:',
        highlighted: true,
      },
      {
        id: 'f2',
        text: 'Access to Mandates, Investment Sectors, Check Sizes, Commitments, Investment History, and High-Net-Worth Individuals',
      },
      { id: 'f3', text: 'Up to 1,000 records per search' },
      {
        id: 'f4',
        text: 'Ideal for LPs, GPs, and institutional investors who need the full picture',
      },
    ],
    isHighlighted: true,
  },
];

// Real Estate & Lending - Directories Plans
const realEstateDirectoriesPlans: PricingPlan[] = [
  {
    id: 're_essential',
    tier: 'essential',
    name: 'Essential',
    subtitle: '100 verified records per month',
    pricing: {
      amount: 299,
      currency: 'USD',
      billingCycle: 'monthly',
      displayText: 'per month',
    },
    button: {
      action: 'current_plan',
      text: 'Current plan',
      variant: 'disabled',
      disabled: true,
    },
    features: [
      {
        id: 'f1',
        text: 'Access to core fields: Contact type, Contact location',
      },
      { id: 'f2', text: 'Up to 100 records per search' },
      {
        id: 'f3',
        text: 'Designed for independent brokers, smaller lenders, and analysts evaluating data quality before scaling',
      },
    ],
    isHighlighted: false,
    isCurrentPlan: true,
  },
  {
    id: 're_professional',
    tier: 'professional',
    name: 'Professional',
    subtitle: '400 verified records per month',
    pricing: {
      amount: 999,
      currency: 'USD',
      billingCycle: 'monthly',
      displayText: 'per month',
    },
    button: {
      action: 'choose_plan',
      text: 'Choose plan',
      variant: 'secondary',
    },
    features: [
      { id: 'f1', text: 'Access to search by project types' },
      {
        id: 'f2',
        text: 'Advanced fields, including past projects/lenders, upcoming maturities, and additional contact methods',
      },
      { id: 'f3', text: 'Up to 400 records per search' },
      {
        id: 'f4',
        text: 'Built for active originators and small to mid-size lenders',
      },
    ],
    isHighlighted: false,
  },
  {
    id: 're_institutional',
    tier: 'institutional',
    name: 'Institutional',
    subtitle: 'Unlimited verified records',
    pricing: {
      currency: 'USD',
      billingCycle: 'monthly',
      displayText: 'Request pricing',
    },
    button: {
      action: 'talk_to_team',
      text: 'Talk to our team',
      variant: 'primary',
    },
    features: [
      { id: 'f1', text: 'Full data coverage' },
      { id: 'f2', text: 'Exports and bulk access enabled' },
      { id: 'f3', text: 'Up to 1,000 records per search' },
      {
        id: 'f4',
        text: 'For high-volume lenders and large real-estate organizations with complex portfolios',
      },
    ],
    isHighlighted: true,
  },
];

// Organize by industry
const directoriesIndustries: IndustryPlans[] = [
  {
    vertical: 'capital_markets',
    displayName: 'Capital Markets',
    plans: capitalMarketsDirectoriesPlans,
  },
  {
    vertical: 'real_estate_lending',
    displayName: 'Real Estate & Lending',
    plans: realEstateDirectoriesPlans,
  },
  {
    vertical: 'business_corporate',
    displayName: 'Business & Corporate',
    plans: [], // Add plans as needed
  },
];

// Organize by category
const pricingCategories: PricingCategory[] = [
  {
    category: 'directories',
    displayName: 'Directories',
    industries: directoriesIndustries,
  },
  {
    category: 'enrichment',
    displayName: 'Enrichment',
    industries: [], // Add enrichment plans as needed
  },
];

// Complete pricing data
export const mockPricingData: PricingData = {
  categories: pricingCategories,
  defaultCategory: 'directories',
  defaultIndustry: 'capital_markets',
  defaultBillingCycle: 'monthly',
};

/**
 * Simulated API call to fetch pricing data
 */
export const fetchPricingData = async (): Promise<PricingData> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockPricingData;
};
