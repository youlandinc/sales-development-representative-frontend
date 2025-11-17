'use client';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box, Stack, Tab, Tabs, Typography } from '@mui/material';
import { SyntheticEvent, useState } from 'react';

import { StyledButton, StyledButtonGroup } from '@/components/atoms';

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

export const PricingPlan = () => {
  const [planType, setPlanType] = useState<PlanType>('directories');
  const [category, setCategory] = useState<CategoryType>('capital-markets');

  const handlePlanTypeChange = (
    _: React.MouseEvent<HTMLElement>,
    newValue: PlanType | null,
  ) => {
    if (newValue !== null) {
      setPlanType(newValue);
    }
  };

  const handleCategoryChange = (_: SyntheticEvent, newValue: number) => {
    const categories: CategoryType[] = [
      'capital-markets',
      'real-estate-lending',
      'business-corporate',
      'enrichment-credits',
    ];
    setCategory(categories[newValue]);
  };

  const currentCards = PRICING_DATA[planType][category].cards;

  const categories = [
    'Capital Markets',
    'Real Estate & Lending',
    'Business & Corporate',
    'Enrichment credits',
  ];

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
            // bgcolor: '#EAE9EF',
            borderRadius: 2,
            p: 0.25,
            display: 'inline-flex',
            width: 'auto',
          }}
        >
          <StyledButtonGroup
            onChange={handlePlanTypeChange}
            options={[
              { label: 'Directories', value: 'directories' },
              { label: 'Enrichment', value: 'enrichment' },
            ]}
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
      <Box
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
              color: '#6F6C7D',
              minHeight: 32,
              height: 32,
              px: 1.5,
              py: 1.5,
              lineHeight: 1.2,
              '&.Mui-selected': {
                color: '#363440',
                fontWeight: 600,
              },
            },
            '& .MuiTabs-indicator': {
              display: 'none',
            },
            '& .MuiTabs-flexContainer': {
              gap: 0,
              '& .MuiButtonBase-root': {
                position: 'relative',
                '&.Mui-selected::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  bgcolor: '#363440',
                },
              },
            },
          }}
          value={
            categories.findIndex((_, idx) => {
              const categoriesList: CategoryType[] = [
                'capital-markets',
                'real-estate-lending',
                'business-corporate',
                'enrichment-credits',
              ];
              return categoriesList[idx] === category;
            }) || 0
          }
        >
          {categories.map((cat) => (
            <Tab key={cat} label={cat} />
          ))}
        </Tabs>
      </Box>

      {/* Pricing Cards */}
      {currentCards.length > 0 && (
        <Stack
          direction="row"
          gap={3}
          sx={{
            px: { xs: 0, lg: 27.5 },
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
          {currentCards.map((card, index) => (
            <PricingCardComponent card={card} key={index} />
          ))}
        </Stack>
      )}
    </Stack>
  );
};

interface PricingCardComponentProps {
  card: PricingCard;
}

const PricingCardComponent = ({ card }: PricingCardComponentProps) => {
  const isHighlighted = card.isHighlighted;

  return (
    <Stack
      sx={{
        width: 384,
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {/* Card Header */}
      <Box
        sx={{
          bgcolor: isHighlighted ? '#363440' : '#EAE9EF',
          p: 3,
          borderRadius: '24px 24px 0 0',
        }}
      >
        <Typography
          sx={{
            color: isHighlighted ? 'white' : 'text.primary',
            lineHeight: 1.2,
          }}
          variant="h4"
        >
          {card.title}
        </Typography>
      </Box>

      {/* Card Body */}
      <Box
        sx={{
          bgcolor: isHighlighted ? '#363440' : '#EAE9EF',
          borderRadius: '0 0 24px 24px',
          // p: 1.25,
        }}
      >
        <Stack
          sx={{
            bgcolor: 'background.default',
            border: `1px solid ${isHighlighted ? '#363440' : '#DFDEE6'}`,
            borderRadius: 6,
            p: 3,
            gap: 3,
            minHeight: 496,
          }}
        >
          {/* Subtitle */}
          <Stack gap={1} sx={{ height: 36, justifyContent: 'flex-end' }}>
            <Typography
              sx={{
                fontSize: 24,
                fontWeight: 400,
                color: 'text.secondary',
                lineHeight: 'none',
              }}
            >
              {card.subtitle}
            </Typography>
          </Stack>

          {/* Button */}
          <StyledButton
            fullWidth
            size="medium"
            sx={{
              bgcolor:
                card.buttonVariant === 'contained' ? '#363440' : 'transparent',
              color:
                card.buttonVariant === 'contained' ? 'white' : 'text.primary',
              borderColor:
                card.buttonVariant === 'outlined' ? '#DFDEE6' : 'transparent',
              '&:hover': {
                bgcolor:
                  card.buttonVariant === 'contained'
                    ? '#363440'
                    : 'transparent',
              },
            }}
            variant={card.buttonVariant}
          >
            {card.buttonText}
          </StyledButton>

          {/* Divider */}
          <Box
            sx={{
              height: 1,
              bgcolor: '#EFE9FB',
              width: '100%',
            }}
          />

          {/* Features List */}
          <Stack gap={1.5}>
            {card.features.map((feature, idx) => (
              <Stack alignItems="flex-start" direction="row" gap={1} key={idx}>
                {idx > 0 ? (
                  <CheckCircleIcon
                    sx={{
                      width: 24,
                      height: 24,
                      color: '#363440',
                      flexShrink: 0,
                      mt: 0.25,
                    }}
                  />
                ) : (
                  <Box sx={{ width: 24, flexShrink: 0 }} />
                )}
                <Typography
                  sx={{
                    color: 'text.primary',
                    lineHeight: 1.71,
                    fontSize: 14,
                  }}
                  variant="body2"
                >
                  {feature.text}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
};
