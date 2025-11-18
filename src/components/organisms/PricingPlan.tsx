'use client';

import { Box, Stack, Tab, Tabs, Typography } from '@mui/material';
import { SyntheticEvent, useState } from 'react';
import useSWR from 'swr';

import { SDRToast, StyledButtonGroup } from '@/components/atoms';
import { PricingPlanCard } from '@/components/molecules';

import { _fetchAllPlan } from '@/request/pricingPlan';

type PlanType = 'directories' | 'enrichment';

type CategoryType =
  | 'capital-markets'
  | 'real-estate-lending'
  | 'business-corporate'
  | 'enrichment-credits';

interface FeatureItem {
  text: string;
}

interface PricingCard {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonVariant: 'contained' | 'outlined';
  features: FeatureItem[];
  isHighlighted?: boolean;
  // Additional fields from mockData
  paymentDetails?: Array<{
    type: string | null;
    planDateTypeName: string;
    price: number | null;
    priceAdditionalInfo: string;
    credit: number | null;
    creditType: string;
  }>;
  credit?: number | null;
  creditType?: string;
  price?: number | null;
}

const PRICING_DATA: Record<
  PlanType,
  Record<CategoryType, { cards: PricingCard[] }>
> = {
  directories: {
    'capital-markets': {
      cards: [
        {
          title: 'Capital Markets Research',
          subtitle: 'Built for emerging teams',
          buttonText: 'Request access',
          buttonVariant: 'outlined',
          features: [
            { text: 'Unlimited searches' },
            {
              text: 'Firm info: Name, Description, Type, Location, Website, Phone, AUM (when available)',
            },
            { text: 'Contact info: Name, Title, Email, Phone' },
            { text: 'Up to 100 records per search' },
            { text: 'Ideal for analysts, advisors, and small funds' },
          ],
        },
        {
          title: 'Capital Markets Intelligence',
          subtitle: 'For Institutional Investors',
          buttonText: 'Request access',
          buttonVariant: 'contained',
          features: [
            {
              text: 'Includes everything in Research, plus:',
            },
            {
              text: 'Access to Mandates, Investment Sectors, Check Sizes, Commitments, Investment History, and High-Net-Worth Individuals',
            },
            { text: 'Up to 1,000 records per search' },
            {
              text: 'Ideal for LPs, GPs, and institutional investors who need the full picture',
            },
          ],
          isHighlighted: true,
        },
      ],
    },
    'real-estate-lending': {
      cards: [],
    },
    'business-corporate': {
      cards: [],
    },
    'enrichment-credits': {
      cards: [],
    },
  },
  enrichment: {
    'capital-markets': {
      cards: [],
    },
    'real-estate-lending': {
      cards: [],
    },
    'business-corporate': {
      cards: [],
    },
    'enrichment-credits': {
      cards: [],
    },
  },
};

// 定义 mockData 的类型
interface MockPlanData {
  categoryName: string;
  category: string;
  planName: string;
  paymentDetail: Array<{
    type: string | null;
    planDateTypeName: string;
    price: number | null;
    priceAdditionalInfo: string;
    credit: number | null;
    creditType: string;
  }>;
  packages: string[];
  isDefault: boolean;
}

export const PricingPlan = () => {
  const [planType, setPlanType] = useState<string>('');
  const [category, setCategory] = useState<string>('');

  const { data } = useSWR(
    'pricing-plan',
    async () => {
      try {
        const res = await _fetchAllPlan();
        if (res.data) {
          const defaultKey = Object.keys(res.data)[0];
          const defaultCategory = res.data[defaultKey][0].category;
          setPlanType(Object.keys(res.data)[0]);
          setCategory(defaultCategory);
        }
        return res;
      } catch (err) {
        const { message, header, variant } = err as HttpError;
        SDRToast({ message, header, variant });
      }
    },
    { revalidateOnFocus: false },
  );

  const handlePlanTypeChange = (
    _: React.MouseEvent<HTMLElement>,
    newValue: string,
  ) => {
    setPlanType(newValue);
    setCategory(data?.data?.[newValue]?.[0]?.category || '');
  };

  const handleCategoryChange = (_: SyntheticEvent, newValue: string) => {
    setCategory(newValue);
  };

  // 直接获取和过滤 mockData，不转换
  const getCurrentPlans = () => {
    return (
      data?.data?.[planType]?.find((item) => item.category === category)
        ?.plans || []
    );
  };

  const currentPlans = getCurrentPlans();

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
        <Box
          sx={{
            borderRadius: 2,
            p: 0.25,
            display: 'inline-flex',
            width: 'auto',
          }}
        >
          <StyledButtonGroup
            onChange={handlePlanTypeChange}
            options={Object.keys(data?.data || {}).map((item) => ({
              label: item,
              value: item,
            }))}
            sx={{
              bgcolor: 'transparent',
              '& .MuiToggleButton-root': {
                width: 144,
                height: 40,
                fontSize: 16,
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                border: 'none',
                bgcolor: 'transparent',
                color: '#363440',
                px: 1,
                py: 1,
                '&.Mui-selected': {
                  bgcolor: '#363440',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#363440',
                  },
                },
                '&:hover': {
                  bgcolor: 'transparent',
                },
              },
              '& .MuiToggleButtonGroup-grouped:not(:first-of-type)': {
                marginLeft: 0,
                borderLeft: 'none',
              },
              '& .MuiToggleButtonGroup-grouped.Mui-selected': {
                borderRadius: 2,
              },
            }}
            value={planType}
          />
        </Box>
      </Stack>

      {/* Category Tabs */}
      <Stack
        flexDirection={'row'}
        sx={{
          borderBottom: '1px solid #EFE9FB',
          width: '100%',
          px: { xs: 0, lg: 27.5 },
        }}
      >
        <Tabs
          onChange={handleCategoryChange}
          sx={{
            minHeight: 32,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: 14,
              fontWeight: 400,
              color: 'text.secondary',
              minHeight: 'auto',
              height: 'auto',
              px: 1.5,
              py: 1.5,
              lineHeight: 1.2,
              '&.Mui-selected': {
                color: '#363440',
                fontWeight: 600,
              },
            },
            // '& .MuiTabs-indicator': {
            //   display: 'none',
            // },
            // '& .MuiTabs-flexContainer': {
            //   gap: 0,
            //   '& .MuiButtonBase-root': {
            //     position: 'relative',
            //     '&.Mui-selected::after': {
            //       content: '""',
            //       position: 'absolute',
            //       bottom: 0,
            //       left: 0,
            //       right: 0,
            //       height: '2px',
            //       bgcolor: '#363440',
            //     },
            //   },
            // },
          }}
          value={category}
        >
          {(data?.data?.[planType] || []).map((cat) => (
            <Tab
              key={cat.category}
              label={cat.categoryName}
              value={cat.category}
            />
          ))}
        </Tabs>
      </Stack>

      {/* Pricing Cards - 直接传递 mockData */}
      {currentPlans.length > 0 && (
        <Stack
          direction="row"
          gap={3}
          sx={{
            px: { xs: 0, lg: 27.5 },
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
          {currentPlans.map((plan, index) => (
            <PricingPlanCard key={index} plan={plan} />
          ))}
        </Stack>
      )}
    </Stack>
  );
};

const temp = {
  categoryName: 'Real Estate & Lending',
  category: 'REAL_ESTATE_LENDING',
  paymentDetail: [
    {
      type: 'MONTH',
      planDateTypeName: 'pay monthly',
      price: '999',
      priceAdditionalInfo: null,
      credit: 400,
      creditType: 'RECORD',
    },
    {
      type: 'YEAR',
      planDateTypeName: 'pay yearly(17% off)',
      price: '10008',
      priceAdditionalInfo: null,
      credit: 4800,
      creditType: 'RECORD',
    },
  ],
  plans: [
    {
      perMonth: 299,
      perMonthDiscount: 200,
      costDesc: '100 verified records per month',
      descTitle: 'Includes everything in Research, plus:',
      planName: 'Essential',
      packages: [
        'Access to core fields: Contact type, Contact location',
        'Up to 100 records per search',
        'Designed for independent brokers, smaller lenders, and analysts evaluating data quality before scaling.',
      ],
      isDefault: false,
    },
    {
      perMonth: 299,
      perMonthDiscount: 200,
      costDesc: '100 verified records per month',
      descTitle: 'Includes everything in Research, plus:',
      planName: 'Professional',
      packages: [
        'Access to search by project types',
        'Advanced fields, including past projects/lenders, upcoming maturities, and additional contact methods',
        'Up to 400 records per search',
        'Built for active originators and small to mid-size lenders',
      ],
      isDefault: false,
    },
    {
      perMonth: 299,
      perMonthDiscount: 200,
      costDesc: '100 verified records per month',
      descTitle: 'Includes everything in Research, plus:',
      planName: 'Institutional',
      packages: [
        'Full data coverage',
        'Exports and bulk access enabled',
        'Up to 1,000 records per search',
        'For high-volume lenders and large real-estate organizations with complex portfolios',
      ],
      isDefault: true,
    },
  ],
};
