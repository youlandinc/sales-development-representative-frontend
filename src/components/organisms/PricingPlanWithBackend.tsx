'use client';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box, Stack, Tab, Tabs, Typography } from '@mui/material';
import { SyntheticEvent, useEffect, useState } from 'react';

import { StyledButton, StyledButtonGroup } from '@/components/atoms';

// ============================================
// 类型定义
// ============================================

type PlanType = 'directories' | 'enrichment';
type CategoryType =
  | 'capital-markets'
  | 'real-estate-lending'
  | 'business-corporate'
  | 'enrichment-credits';
type BillingPeriod = 'monthly' | 'yearly';

interface FeatureItem {
  text: string;
}

interface PricingCard {
  id: string;
  title: string;
  subtitle: string;
  price?: number; // 价格（美分）
  priceDisplay?: string; // "$249" 或 "Request pricing"
  periodDisplay?: string; // "per month"
  buttonText: string;
  buttonVariant: 'contained' | 'outlined';
  features: FeatureItem[];
  isHighlighted?: boolean;
}

// 后端返回的完整数据结构
interface BackendPricingData {
  directories: {
    'capital-markets': {
      monthly: PricingCard[];
      yearly: PricingCard[];
    };
    'real-estate-lending': {
      monthly: PricingCard[];
      yearly: PricingCard[];
    };
    'business-corporate': {
      monthly: PricingCard[];
      yearly: PricingCard[];
    };
  };
  enrichment: {
    'enrichment-credits': {
      monthly: PricingCard[];
      yearly: PricingCard[];
    };
  };
}

// ============================================
// API 调用函数（模拟）
// ============================================

const fetchPricingData = async (): Promise<BackendPricingData> => {
  // 实际项目中替换为真实的 API 调用
  // const response = await fetch('/api/pricing');
  // return response.json();

  // 模拟 API 延迟
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 返回模拟数据
  return {
    directories: {
      'capital-markets': {
        monthly: [
          {
            id: 'cm-essential-monthly',
            title: 'Essential',
            subtitle: '$299 per month',
            priceDisplay: '$299',
            periodDisplay: 'per month',
            buttonText: 'Choose plan',
            buttonVariant: 'outlined',
            features: [
              { text: 'Up to 100 records per search' },
              { text: 'Basic contact information' },
            ],
          },
          {
            id: 'cm-professional-monthly',
            title: 'Professional',
            subtitle: '$899 per month',
            priceDisplay: '$899',
            periodDisplay: 'per month',
            buttonText: 'Choose plan',
            buttonVariant: 'outlined',
            features: [
              { text: 'Up to 400 records per search' },
              { text: 'Advanced fields' },
            ],
            isHighlighted: true,
          },
        ],
        yearly: [
          {
            id: 'cm-essential-yearly',
            title: 'Essential',
            subtitle: '$249 per month',
            priceDisplay: '$249',
            periodDisplay: 'per month',
            buttonText: 'Choose plan',
            buttonVariant: 'outlined',
            features: [
              { text: 'Up to 100 records per search' },
              { text: 'Basic contact information' },
              { text: 'Billed yearly - Save 17%' },
            ],
          },
          {
            id: 'cm-professional-yearly',
            title: 'Professional',
            subtitle: '$749 per month',
            priceDisplay: '$749',
            periodDisplay: 'per month',
            buttonText: 'Choose plan',
            buttonVariant: 'outlined',
            features: [
              { text: 'Up to 400 records per search' },
              { text: 'Advanced fields' },
              { text: 'Billed yearly - Save 17%' },
            ],
            isHighlighted: true,
          },
        ],
      },
      'real-estate-lending': {
        monthly: [
          {
            id: 're-essential-monthly',
            title: 'Essential',
            subtitle: '$349 per month',
            priceDisplay: '$349',
            periodDisplay: 'per month',
            buttonText: 'Choose plan',
            buttonVariant: 'outlined',
            features: [
              { text: '1,200 verified records' },
              { text: 'Core fields access' },
            ],
          },
        ],
        yearly: [
          {
            id: 're-essential-yearly',
            title: 'Essential',
            subtitle: '$289 per month',
            priceDisplay: '$289',
            periodDisplay: 'per month',
            buttonText: 'Choose plan',
            buttonVariant: 'outlined',
            features: [
              { text: '1,200 verified records' },
              { text: 'Core fields access' },
              { text: 'Billed yearly - Save 17%' },
            ],
          },
        ],
      },
      'business-corporate': {
        monthly: [
          {
            id: 'bc-essential-monthly',
            title: 'Essential',
            subtitle: '$399 per month',
            priceDisplay: '$399',
            periodDisplay: 'per month',
            buttonText: 'Choose plan',
            buttonVariant: 'outlined',
            features: [{ text: 'Business & Corporate data' }],
          },
        ],
        yearly: [
          {
            id: 'bc-essential-yearly',
            title: 'Essential',
            subtitle: '$329 per month',
            priceDisplay: '$329',
            periodDisplay: 'per month',
            buttonText: 'Choose plan',
            buttonVariant: 'outlined',
            features: [
              { text: 'Business & Corporate data' },
              { text: 'Billed yearly - Save 17%' },
            ],
          },
        ],
      },
    },
    enrichment: {
      'enrichment-credits': {
        monthly: [
          {
            id: 'enrich-basic-monthly',
            title: 'Basic',
            subtitle: '$199 per month',
            priceDisplay: '$199',
            periodDisplay: 'per month',
            buttonText: 'Choose plan',
            buttonVariant: 'outlined',
            features: [{ text: '1,000 enrichment credits' }],
          },
        ],
        yearly: [
          {
            id: 'enrich-basic-yearly',
            title: 'Basic',
            subtitle: '$165 per month',
            priceDisplay: '$165',
            periodDisplay: 'per month',
            buttonText: 'Choose plan',
            buttonVariant: 'outlined',
            features: [
              { text: '1,000 enrichment credits' },
              { text: 'Billed yearly - Save 17%' },
            ],
          },
        ],
      },
    },
  };
};

// ============================================
// 主组件
// ============================================

export const PricingPlanWithBackend = () => {
  // 状态管理
  const [planType, setPlanType] = useState<PlanType>('directories');
  const [category, setCategory] = useState<CategoryType>('capital-markets');
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('yearly');

  // 数据状态
  const [allData, setAllData] = useState<BackendPricingData | null>(null);
  const [loading, setLoading] = useState(true);

  // 初始化：从后端获取所有数据
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchPricingData();
        setAllData(data);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to load pricing data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); // 只在组件挂载时调用一次

  // 切换处理函数
  const handlePlanTypeChange = (
    _: React.MouseEvent<HTMLElement>,
    newValue: PlanType | null,
  ) => {
    if (newValue !== null) {
      setPlanType(newValue);
      // 切换 planType 时，重置 category
      if (newValue === 'enrichment') {
        setCategory('enrichment-credits');
      } else {
        setCategory('capital-markets');
      }
    }
  };

  const handleCategoryChange = (_: SyntheticEvent, newValue: number) => {
    const directoriesCategories: CategoryType[] = [
      'capital-markets',
      'real-estate-lending',
      'business-corporate',
    ];
    const enrichmentCategories: CategoryType[] = ['enrichment-credits'];

    const categories =
      planType === 'directories' ? directoriesCategories : enrichmentCategories;
    setCategory(categories[newValue]);
  };

  const handleBillingPeriodChange = (
    _: React.MouseEvent<HTMLElement>,
    newValue: BillingPeriod | null,
  ) => {
    if (newValue !== null) {
      setBillingPeriod(newValue);
    }
  };

  // 根据当前状态过滤数据
  const getCurrentCards = (): PricingCard[] => {
    if (!allData) {
      return [];
    }

    try {
      return allData[planType][category][billingPeriod];
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Invalid data structure:', error);
      return [];
    }
  };

  const currentCards = getCurrentCards();

  // 获取当前可用的 categories
  const getAvailableCategories = () => {
    if (planType === 'directories') {
      return [
        'Capital Markets',
        'Real Estate & Lending',
        'Business & Corporate',
      ];
    }
    return ['Enrichment credits'];
  };

  const categories = getAvailableCategories();

  // Loading 状态
  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ p: 10 }}>
        <Typography>Loading pricing data...</Typography>
      </Stack>
    );
  }

  // 无数据状态
  if (!allData) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ p: 10 }}>
        <Typography>Failed to load pricing data</Typography>
      </Stack>
    );
  }

  return (
    <Stack
      sx={{
        bgcolor: 'background.default',
        borderRadius: 6,
        p: 3,
        gap: 3,
        width: '100%',
      }}
    >
      {/* Header Section */}
      <Stack gap={3} width="100%">
        <Typography color="text.primary" variant="h4">
          Choose your plan
        </Typography>

        {/* Plan Type Toggle */}
        <StyledButtonGroup
          exclusive
          onChange={handlePlanTypeChange}
          value={planType}
        >
          <StyledButton value="directories">Directories</StyledButton>
          <StyledButton value="enrichment">Enrichment</StyledButton>
        </StyledButtonGroup>
      </Stack>

      {/* Filters Section */}
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        sx={{ minHeight: 32 }}
      >
        {/* Category Tabs */}
        <Tabs
          onChange={handleCategoryChange}
          value={categories.indexOf(category)}
        >
          {categories.map((cat) => (
            <Tab key={cat} label={cat} />
          ))}
        </Tabs>

        {/* Billing Period Toggle */}
        <StyledButtonGroup
          exclusive
          onChange={handleBillingPeriodChange}
          value={billingPeriod}
        >
          <StyledButton value="yearly">Pay yearly (17% off)</StyledButton>
          <StyledButton value="monthly">Pay monthly</StyledButton>
        </StyledButtonGroup>
      </Stack>

      {/* Pricing Cards */}
      <Stack direction="row" gap={3} justifyContent="center">
        {currentCards.map((card) => (
          <Stack
            key={card.id}
            sx={{
              width: 384,
              bgcolor: card.isHighlighted ? 'primary.main' : 'background.paper',
              borderRadius: 3,
              p: 3,
              gap: 3,
            }}
          >
            <Typography variant="h5">{card.title}</Typography>
            <Typography variant="body1">{card.subtitle}</Typography>

            <StyledButton fullWidth variant={card.buttonVariant}>
              {card.buttonText}
            </StyledButton>

            <Stack gap={1.5}>
              {card.features.map((feature, idx) => (
                <Stack alignItems="center" direction="row" gap={1} key={idx}>
                  <CheckCircleIcon sx={{ fontSize: 20 }} />
                  <Typography variant="body2">{feature.text}</Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        ))}
      </Stack>

      {/* Debug Info (可选，用于开发调试) */}
      {process.env.NODE_ENV === 'development' && (
        <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="caption">
            Current State: planType={planType}, category={category},
            billingPeriod={billingPeriod}, cards={currentCards.length}
          </Typography>
        </Box>
      )}
    </Stack>
  );
};
