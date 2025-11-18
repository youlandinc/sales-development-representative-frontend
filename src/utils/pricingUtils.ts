import {
  BillingCycle,
  IndustryPlans,
  IndustryVertical,
  PlanCategory,
  PricingCategory,
  PricingData,
  PricingPlan,
} from '@/types/pricingPlan';

/**
 * Utility functions for working with pricing data
 */

/**
 * Get a specific category from pricing data
 */
export const getCategory = (
  data: PricingData,
  category: PlanCategory,
): PricingCategory | undefined => {
  return data.categories.find((cat) => cat.category === category);
};

/**
 * Get a specific industry from a category
 */
export const getIndustry = (
  category: PricingCategory,
  industry: IndustryVertical,
): IndustryPlans | undefined => {
  return category.industries.find((ind) => ind.vertical === industry);
};

/**
 * Get a specific plan by ID
 */
export const getPlanById = (
  data: PricingData,
  planId: string,
): PricingPlan | undefined => {
  for (const category of data.categories) {
    for (const industry of category.industries) {
      const plan = industry.plans.find((p) => p.id === planId);
      if (plan) {
        return plan;
      }
    }
  }
  return undefined;
};

/**
 * Get all plans for a specific category and industry
 */
export const getPlans = (
  data: PricingData,
  category: PlanCategory,
  industry: IndustryVertical,
): PricingPlan[] => {
  const cat = getCategory(data, category);
  if (!cat) {
    return [];
  }

  const ind = getIndustry(cat, industry);
  if (!ind) {
    return [];
  }

  return ind.plans;
};

/**
 * Format price display
 */
export const formatPrice = (
  amount: number | undefined,
  currency: string,
  displayText?: string,
): string => {
  if (amount === undefined) {
    return displayText || 'Request pricing';
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(amount);
};

/**
 * Calculate yearly price with discount
 */
export const calculateYearlyPrice = (
  monthlyAmount: number,
  discountPercent: number = 17,
): number => {
  const yearlyWithoutDiscount = monthlyAmount * 12;
  const discount = yearlyWithoutDiscount * (discountPercent / 100);
  return yearlyWithoutDiscount - discount;
};

/**
 * Get button style based on variant
 */
export const getButtonStyle = (
  variant: 'primary' | 'secondary' | 'disabled',
  isHighlighted: boolean = false,
) => {
  switch (variant) {
    case 'primary':
      return {
        bgcolor: '#363440',
        color: 'white',
        '&:hover': {
          bgcolor: '#4C4957',
        },
      };
    case 'secondary':
      return {
        bgcolor: 'white',
        color: '#363440',
        border: '1px solid #DFDEE6',
        '&:hover': {
          bgcolor: '#F8F8FA',
        },
      };
    case 'disabled':
      return {
        bgcolor: '#DFDEE6',
        color: '#B0ADBD',
        cursor: 'not-allowed',
        '&:hover': {
          bgcolor: '#DFDEE6',
        },
      };
    default:
      return {};
  }
};

/**
 * Get card style based on highlight status
 */
export const getCardStyle = (isHighlighted: boolean) => {
  if (isHighlighted) {
    return {
      headerBg: '#363440',
      headerColor: 'white',
      borderColor: '#363440',
    };
  }
  return {
    headerBg: '#EAE9EF',
    headerColor: '#363440',
    borderColor: '#DFDEE6',
  };
};

/**
 * Filter plans by billing cycle (if pricing varies)
 */
export const filterPlansByBillingCycle = (
  plans: PricingPlan[],
  billingCycle: BillingCycle,
): PricingPlan[] => {
  return plans.filter((plan) => plan.pricing.billingCycle === billingCycle);
};

/**
 * Get all available industries for a category
 */
export const getAvailableIndustries = (
  data: PricingData,
  category: PlanCategory,
): IndustryVertical[] => {
  const cat = getCategory(data, category);
  if (!cat) {
    return [];
  }

  return cat.industries
    .filter((ind) => ind.plans.length > 0)
    .map((ind) => ind.vertical);
};

/**
 * Check if a plan is the user's current plan
 */
export const isCurrentPlan = (
  plan: PricingPlan,
  currentPlanId?: string,
): boolean => {
  return plan.id === currentPlanId || plan.isCurrentPlan === true;
};

/**
 * Get recommended plan (highlighted plan)
 */
export const getRecommendedPlan = (
  plans: PricingPlan[],
): PricingPlan | undefined => {
  return plans.find((plan) => plan.isHighlighted);
};
