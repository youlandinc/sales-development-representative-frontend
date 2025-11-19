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

export const mockData = {
  Enrichment: [
    {
      categoryName: 'Enrichment Credits',
      category: 'ENRICHMENT_CREDITS',
      paymentDetail: [
        {
          type: 'MONTH',
          planDateTypeName: 'pay monthly',
          price: null,
          priceAdditionalInfo: 'Try enrichment for free',
          credit: 50,
          creditType: 'CREDIT',
        },
        {
          type: 'YEAR',
          planDateTypeName: 'pay yearly(17% off)',
          price: null,
          priceAdditionalInfo: 'Try enrichment for free',
          credit: 600,
          creditType: 'CREDIT',
        },
      ],
      plans: [
        {
          planName: 'Free',
          packageTitle: '',
          monthlyPrice: null,
          yearlyPrice: null,
          priceDesc: '50 credits per month',
          priceAdditionalInfo: 'Try enrichment for free',
          packages: [
            'Access to enrichment functions: Find work email, Find personal LinkedIn URL',
            'Up to 50 records per search',
          ],
          isDefault: false,
        },
        {
          planName: 'Basic',
          packageTitle: '',
          monthlyPrice: 129,
          yearlyPrice: 107,
          priceDesc: '1,000 credits per month',
          packages: [
            'Access to enrichment functions: Find work email, Find personal LinkedIn URL, Find personal email, Find phone number',
            'Up to 500 records per search',
          ],
          isDefault: false,
        },
        {
          planName: 'Plus',
          packageTitle: '',
          monthlyPrice: 199,
          yearlyPrice: 167,
          priceDesc: '2,000 credits per month',
          packages: [
            'Access to enrichment functions: Find work email, Find personal LinkedIn URL, Find personal email, Find phone number',
            'Up to 1,000 records per search',
            'Ability to purchase additional credits up to 3 times per month',
          ],
          isDefault: false,
        },
        {
          planName: 'Pro',
          packageTitle: '',
          monthlyPrice: 699,
          yearlyPrice: 583,
          priceDesc: '10,000 credits per month',
          packages: [
            'Access to enrichment functions: Find work email, Find personal LinkedIn URL, Find personal email, Find phone number',
            'Up to 5,000 records per search',
            'Ability to purchase unlimited additional credits',
          ],
          isDefault: true,
        },
      ],
    },
  ],
  Directories: [
    {
      categoryName: 'Capital Markets',
      category: 'CAPITAL_MARKETS',

      plans: [
        {
          planName: 'Capital Markets Research',
          packageTitle: '',
          monthlyPrice: null,
          yearlyPrice: null,
          priceDesc: '',
          priceAdditionalInfo: 'Built for emerging teams',
          packages: [
            'Unlimited searches',
            'Firm info: Name, Description, Type, Location, Website, Phone, AUM (when available)',
            'Contact info: Name, Title, Email, Phone',
            'Up to 100 records per search',
            'Ideal for analysts, advisors, and small funds',
          ],
          isDefault: false,
        },
        {
          planName: 'Capital Markets Intelligence',
          packageTitle: 'Includes everything in Research, plus:',
          monthlyPrice: null,
          yearlyPrice: null,
          priceDesc: '',
          priceAdditionalInfo: 'For institutional investors',
          packages: [
            'Access to Mandates, Investment Sectors, Check Sizes, Commitments,  Investment History, and High-Net-Worth Individuals',
            'Up to 1,000 records per search',
            'Ideal for LPs, GPs, and institutional investors who need the full picture',
          ],
          isDefault: true,
        },
      ],
    },
    {
      categoryName: 'Business & Corporate',
      category: 'BUSINESS_CORPORATE',
      paymentDetail: [
        {
          type: 'MONTH',
          planDateTypeName: 'pay monthly',
          price: '100',
          priceAdditionalInfo: null,
          credit: 200,
          creditType: 'RECORD',
        },
        {
          type: 'YEAR',
          planDateTypeName: 'pay yearly(17% off)',
          price: '996',
          priceAdditionalInfo: null,
          credit: 2400,
          creditType: 'RECORD',
        },
      ],
      plans: [
        {
          planName: 'Starter',
          packageTitle: '',
          monthlyPrice: 100,
          yearlyPrice: 200,
          priceDesc: '200 verified records per month',
          packages: [
            'Access to core fields: Contact type, Contact location',
            'Up to 100 records per search',
            'Designed for independent brokers, smaller lenders, and analysts evaluating data quality before scaling.',
          ],
          isDefault: false,
        },
        {
          planName: 'Business',
          packageTitle: '',
          monthlyPrice: 299,
          yearlyPrice: 249,
          priceDesc: '1,000 verified records per month',
          packages: [
            'Access to search by project types',
            'Advanced fields, including past projects/lenders, upcoming maturities, and additional contact methods',
            'Up to 400 records per search',
            'Built for active originators and small to mid-size lenders',
          ],
          isDefault: false,
        },
        {
          planName: 'Enterprise',
          packageTitle: '',
          monthlyPrice: null,
          yearlyPrice: null,
          priceDesc: 'Unlimited verified records',
          priceAdditionalInfo: 'Request pricing',
          packages: [
            'Full data coverage',
            'Exports and bulk access enabled',
            'Up to 1,000 records per search',
            'Suitable for institutional lenders, REITs, private equity funds, and family offices managing large portfolios or nationwide deal pipelines',
          ],
          isDefault: true,
          isRequestPricing: true,
        },
      ],
    },
    {
      categoryName: 'Real Estate & Lending',
      category: 'REAL_ESTATE_LENDING',
      paymentDetail: [
        {
          type: 'MONTH',
          planDateTypeName: 'pay monthly',
          price: '100',
          priceAdditionalInfo: null,
          credit: 200,
          creditType: 'RECORD',
        },
        {
          type: 'YEAR',
          planDateTypeName: 'pay yearly(17% off)',
          price: '996',
          priceAdditionalInfo: null,
          credit: 2400,
          creditType: 'RECORD',
        },
      ],
      plans: [
        {
          planName: 'Essential',
          packageTitle: '',
          monthlyPrice: 299,
          yearlyPrice: 249,
          priceDesc: '100 verified records per month',
          packages: [
            'Access to core fields: Contact type, Contact location',
            'Up to 100 records per search',
            'Designed for independent brokers, smaller lenders, and analysts evaluating data quality before scaling.',
          ],
          isDefault: false,
        },
        {
          planName: 'Professional',
          packageTitle: '',
          monthlyPrice: 999,
          yearlyPrice: 849,
          priceDesc: '400 verified records per month',

          packages: [
            'Access to search by project types',
            'Advanced fields, including past projects/lenders, upcoming maturities, and additional contact methods',
            'Up to 400 records per search',
            'Built for active originators and small to mid-size lenders',
          ],
          isDefault: false,
        },
        {
          planName: 'Institutional',
          packageTitle: '',
          monthlyPrice: null,
          yearlyPrice: null,
          priceDesc: 'Unlimited verified records',
          priceAdditionalInfo: 'Request pricing',
          packages: [
            'Full data coverage',
            'Exports and bulk access enabled',
            'Up to 1,000 records per search',
            'For high-volume lenders and large real-estate organizations with complex portfolios',
          ],
          isDefault: true,
          isRequestPricing: true,
        },
      ],
    },
  ],
};
