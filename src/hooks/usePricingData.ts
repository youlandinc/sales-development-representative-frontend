import { useEffect, useMemo, useState } from 'react';
import {
  BillingCycle,
  IndustryVertical,
  PlanCategory,
  PricingData,
  PricingPlan,
} from '@/types/pricingPlan';
import { getAvailableIndustries, getPlans } from '@/utils/pricingUtils';

interface UsePricingDataOptions {
  initialCategory?: PlanCategory;
  initialIndustry?: IndustryVertical;
  initialBillingCycle?: BillingCycle;
}

interface UsePricingDataReturn {
  // Data
  pricingData: PricingData | null;
  currentPlans: PricingPlan[];
  availableIndustries: IndustryVertical[];

  // State
  category: PlanCategory;
  industry: IndustryVertical;
  billingCycle: BillingCycle;

  // Actions
  setCategory: (category: PlanCategory) => void;
  setIndustry: (industry: IndustryVertical) => void;
  setBillingCycle: (cycle: BillingCycle) => void;

  // Status
  loading: boolean;
  error: Error | null;
}

/**
 * Custom hook for managing pricing data and state
 * Provides easy access to filtered plans and state management
 */
export const usePricingData = (
  fetchFn: () => Promise<PricingData>,
  options: UsePricingDataOptions = {},
): UsePricingDataReturn => {
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [category, setCategory] = useState<PlanCategory>(
    options.initialCategory || 'directories',
  );
  const [industry, setIndustry] = useState<IndustryVertical>(
    options.initialIndustry || 'capital_markets',
  );
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(
    options.initialBillingCycle || 'monthly',
  );

  // Fetch pricing data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchFn();
        setPricingData(data);

        // Set defaults from data if not provided in options
        if (!options.initialCategory && data.defaultCategory) {
          setCategory(data.defaultCategory);
        }
        if (!options.initialIndustry && data.defaultIndustry) {
          setIndustry(data.defaultIndustry);
        }
        if (!options.initialBillingCycle && data.defaultBillingCycle) {
          setBillingCycle(data.defaultBillingCycle);
        }

        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to fetch pricing data'),
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchFn]);

  // Get current plans based on selected category and industry
  const currentPlans = useMemo(() => {
    if (!pricingData) {
      return [];
    }
    return getPlans(pricingData, category, industry);
  }, [pricingData, category, industry]);

  // Get available industries for current category
  const availableIndustries = useMemo(() => {
    if (!pricingData) {
      return [];
    }
    return getAvailableIndustries(pricingData, category);
  }, [pricingData, category]);

  return {
    pricingData,
    currentPlans,
    availableIndustries,
    category,
    industry,
    billingCycle,
    setCategory,
    setIndustry,
    setBillingCycle,
    loading,
    error,
  };
};
