# Pricing Data Structure Documentation

## Overview

This document describes the data structure design for the pricing plans feature, based on the Figma designs. The structure is designed to be:

- **Flexible**: Supports multiple categories, industries, and plan tiers
- **Efficient**: Normalized structure for easy querying and rendering
- **Type-safe**: Full TypeScript support
- **Backend-ready**: Designed for API integration

## Design Analysis

### Figma Design 1 (node-id=14516-2168)
- **Category**: Directories (Capital Markets)
- **Plans**: Research, Intelligence
- **Features**: No pricing shown, "Request access" buttons
- **Layout**: 2 cards side-by-side

### Figma Design 2 (node-id=14516-2531)
- **Category**: Directories (Real Estate & Lending)
- **Plans**: Essential ($299), Professional ($999), Institutional (Request pricing)
- **Features**: Pricing displayed, billing cycle toggle (monthly/yearly)
- **Layout**: 3 cards side-by-side

## Data Structure

### Hierarchy

```
PricingData
├── categories[]
│   ├── category: "directories" | "enrichment"
│   ├── displayName: string
│   └── industries[]
│       ├── vertical: "capital_markets" | "real_estate_lending" | "business_corporate"
│       ├── displayName: string
│       └── plans[]
│           ├── id: string
│           ├── tier: "essential" | "professional" | "institutional"
│           ├── name: string
│           ├── subtitle: string
│           ├── pricing
│           │   ├── amount?: number
│           │   ├── currency: string
│           │   ├── billingCycle: "monthly" | "yearly"
│           │   └── displayText?: string
│           ├── button
│           │   ├── action: "request_access" | "choose_plan" | "current_plan" | "talk_to_team"
│           │   ├── text: string
│           │   └── variant: "primary" | "secondary" | "disabled"
│           ├── features[]
│           │   ├── id: string
│           │   ├── text: string
│           │   ├── icon?: string
│           │   └── highlighted?: boolean
│           ├── isHighlighted?: boolean
│           └── isCurrentPlan?: boolean
```

## Key Design Decisions

### 1. Three-Level Hierarchy
- **Category** (Directories/Enrichment) → **Industry** (Capital Markets/Real Estate) → **Plans**
- Allows flexible organization and easy filtering
- Supports future expansion to new categories and industries

### 2. Flexible Pricing
- `amount` is optional (undefined for "Request pricing")
- `displayText` allows custom text like "Request pricing"
- Supports both monthly and yearly billing cycles

### 3. Dynamic Button Configuration
- Button action, text, and variant are data-driven
- Supports different states: request access, choose plan, current plan, talk to team
- Variant determines styling (primary/secondary/disabled)

### 4. Feature Flexibility
- Features are array of objects with optional highlighting
- Supports icons (for checkmarks, etc.)
- Can emphasize specific features with `highlighted` flag

### 5. Plan States
- `isHighlighted`: For featured/recommended plans (dark background)
- `isCurrentPlan`: Marks user's active subscription

## Backend API Design

### Endpoint: GET /api/pricing

**Response:**
```typescript
{
  "success": true,
  "data": {
    "categories": [
      {
        "category": "directories",
        "displayName": "Directories",
        "industries": [
          {
            "vertical": "capital_markets",
            "displayName": "Capital Markets",
            "plans": [
              {
                "id": "cm_research",
                "tier": "essential",
                "name": "Capital Markets Research",
                "subtitle": "Built for emerging teams",
                "pricing": {
                  "currency": "USD",
                  "billingCycle": "monthly",
                  "displayText": "Request access"
                },
                "button": {
                  "action": "request_access",
                  "text": "Request access",
                  "variant": "secondary"
                },
                "features": [
                  {
                    "id": "f1",
                    "text": "Unlimited searches"
                  }
                ],
                "isHighlighted": false
              }
            ]
          }
        ]
      }
    ],
    "defaultCategory": "directories",
    "defaultIndustry": "capital_markets",
    "defaultBillingCycle": "monthly"
  }
}
```

### Endpoint: GET /api/user/subscription

**Response:**
```typescript
{
  "success": true,
  "data": {
    "planId": "re_essential",
    "tier": "essential",
    "category": "directories",
    "industry": "real_estate_lending",
    "billingCycle": "monthly",
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2025-01-01T00:00:00Z",
    "isActive": true
  }
}
```

## Usage Examples

### 1. Fetching Pricing Data

```typescript
import { fetchPricingData } from '@/data/mockPricingData';
import { getPlans } from '@/utils/pricingUtils';

const data = await fetchPricingData();
const plans = getPlans(data, 'directories', 'capital_markets');
```

### 2. Rendering Plans

```typescript
import { PricingPlan } from '@/types/pricing';
import { formatPrice, getButtonStyle, getCardStyle } from '@/utils/pricingUtils';

const renderPlan = (plan: PricingPlan) => {
  const cardStyle = getCardStyle(plan.isHighlighted);
  const buttonStyle = getButtonStyle(plan.button.variant, plan.isHighlighted);
  const priceDisplay = formatPrice(
    plan.pricing.amount,
    plan.pricing.currency,
    plan.pricing.displayText
  );

  return (
    <Box sx={{ bgcolor: cardStyle.headerBg }}>
      <Typography>{plan.name}</Typography>
      <Typography>{priceDisplay}</Typography>
      <Button sx={buttonStyle}>{plan.button.text}</Button>
      {plan.features.map(feature => (
        <Typography key={feature.id}>{feature.text}</Typography>
      ))}
    </Box>
  );
};
```

### 3. Filtering by Category and Industry

```typescript
const [category, setCategory] = useState<PlanCategory>('directories');
const [industry, setIndustry] = useState<IndustryVertical>('capital_markets');

const currentPlans = getPlans(pricingData, category, industry);
```

### 4. Handling Billing Cycle Toggle

```typescript
const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

// If plans have different pricing for monthly/yearly
const filteredPlans = filterPlansByBillingCycle(plans, billingCycle);

// Calculate yearly price with discount
const yearlyPrice = calculateYearlyPrice(299, 17); // $2,970.96
```

## Rendering Strategy

### Efficient Rendering Approach

1. **Single Source of Truth**: All data comes from backend API
2. **Memoization**: Use `useMemo` for filtered/computed data
3. **Component Reusability**: Single `PricingCard` component for all plans
4. **Conditional Styling**: Data-driven styles based on plan properties

### Component Structure

```
PricingPlansPage
├── CategoryToggle (Directories/Enrichment)
├── IndustryTabs (Capital Markets, Real Estate, etc.)
├── BillingCycleToggle (Monthly/Yearly) - if applicable
└── PricingCardsGrid
    └── PricingCard (repeated for each plan)
        ├── CardHeader (name, highlighted style)
        ├── CardPrice (amount or custom text)
        ├── CardButton (dynamic action)
        └── CardFeatures (list of features)
```

## Benefits of This Structure

1. **Scalability**: Easy to add new categories, industries, or plans
2. **Maintainability**: Centralized data structure, easy to update
3. **Performance**: Efficient querying with utility functions
4. **Flexibility**: Supports various pricing models and features
5. **Type Safety**: Full TypeScript support prevents errors
6. **Backend Integration**: Designed for seamless API integration

## Migration Path

### Phase 1: Mock Data (Current)
- Use `mockPricingData.ts` for development
- Test UI with various data scenarios

### Phase 2: API Integration
- Replace mock data with API calls
- Add loading states and error handling
- Implement caching strategy

### Phase 3: Dynamic Features
- Add user subscription tracking
- Implement plan comparison
- Add upgrade/downgrade flows

## Future Enhancements

1. **Plan Comparison**: Side-by-side feature comparison
2. **Custom Pricing**: Enterprise plans with custom quotes
3. **Add-ons**: Additional features/credits
4. **Discounts**: Promotional codes, volume discounts
5. **Localization**: Multi-currency, multi-language support
