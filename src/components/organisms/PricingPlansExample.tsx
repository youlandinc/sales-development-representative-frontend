import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { StyledButton, StyledButtonGroup } from '@/components/atoms';
import { usePricingData } from '@/hooks/usePricingData';
import { fetchPricingData } from '@/data/mockPricingData';
import { PricingPlan } from '@/types/pricingPlan';
import {
  formatPrice,
  getButtonStyle,
  getCardStyle,
} from '@/utils/pricingUtils';

/**
 * Example component demonstrating how to use the pricing data structure
 * This shows the efficient rendering pattern for the Figma designs
 */

// Reusable PricingCard component
const PricingCard = ({ plan }: { plan: PricingPlan }) => {
  const cardStyle = getCardStyle(plan.isHighlighted || false);
  const buttonStyle = getButtonStyle(
    plan.button.variant,
    plan.isHighlighted || false,
  );
  const priceDisplay = formatPrice(
    plan.pricing.amount,
    plan.pricing.currency,
    plan.pricing.displayText,
  );

  return (
    <Stack
      sx={{
        width: 384,
        overflow: 'hidden',
        borderRadius: 3,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: cardStyle.headerBg,
          color: cardStyle.headerColor,
          p: 3,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}
      >
        <Typography sx={{ fontWeight: 600 }} variant="h4">
          {plan.name}
        </Typography>
      </Box>

      {/* Content */}
      <Box
        sx={{
          bgcolor: cardStyle.headerBg,
          p: 1.25,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
        }}
      >
        <Box
          sx={{
            bgcolor: 'white',
            border: `1px solid ${cardStyle.borderColor}`,
            borderRadius: 3,
            p: 3,
          }}
        >
          <Stack spacing={3}>
            {/* Subtitle or Price */}
            {plan.pricing.amount !== undefined ? (
              <Stack alignItems="flex-end" direction="row" spacing={1}>
                <Typography sx={{ fontSize: 36, fontWeight: 400 }} variant="h2">
                  {priceDisplay}
                </Typography>
                <Typography
                  sx={{ fontSize: 15, color: 'text.primary', pb: 0.5 }}
                  variant="body1"
                >
                  {plan.pricing.displayText}
                </Typography>
              </Stack>
            ) : (
              <Typography
                sx={{ fontSize: 24, fontWeight: 400, color: 'text.secondary' }}
                variant="h5"
              >
                {plan.subtitle}
              </Typography>
            )}

            {/* Button */}
            <StyledButton
              disabled={plan.button.disabled}
              fullWidth
              size="medium"
              sx={{
                ...buttonStyle,
                height: 40,
                fontSize: 14,
                fontWeight: 400,
                textTransform: 'none',
              }}
            >
              {plan.button.text}
            </StyledButton>

            {/* Subtitle (if price is shown) */}
            {plan.pricing.amount !== undefined && (
              <Typography sx={{ color: 'text.primary' }} variant="body1">
                {plan.subtitle}
              </Typography>
            )}

            {/* Divider */}
            <Box sx={{ height: 1, bgcolor: 'border.default' }} />

            {/* Features */}
            <Stack spacing={1.5}>
              {plan.features.map((feature) => (
                <Stack
                  alignItems="flex-start"
                  direction="row"
                  key={feature.id}
                  spacing={1}
                >
                  {feature.icon && (
                    <Box
                      component="img"
                      src={feature.icon}
                      sx={{ width: 24, height: 24 }}
                    />
                  )}
                  <Typography
                    sx={{
                      color: 'text.primary',
                      lineHeight: '24px',
                      fontWeight: feature.highlighted ? 600 : 400,
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
      </Box>
    </Stack>
  );
};

// Main component
export const PricingPlansExample = () => {
  const {
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
  } = usePricingData(fetchPricingData);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error loading pricing data</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: 'white',
        borderRadius: 3,
        p: 3,
      }}
    >
      <Stack spacing={3}>
        {/* Title */}
        <Typography sx={{ fontWeight: 600, textAlign: 'center' }} variant="h4">
          Choose your plan
        </Typography>

        {/* Category Toggle */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ bgcolor: '#F8F8FA', borderRadius: 1, p: 0.25 }}>
            <StyledButtonGroup>
              <StyledButton
                onClick={() => setCategory('directories')}
                size="medium"
                sx={{ width: 128 }}
                variant={category === 'directories' ? 'contained' : 'text'}
              >
                Directories
              </StyledButton>
              <StyledButton
                onClick={() => setCategory('enrichment')}
                size="medium"
                sx={{ width: 128 }}
                variant={category === 'enrichment' ? 'contained' : 'text'}
              >
                Enrichment
              </StyledButton>
            </StyledButtonGroup>
          </Box>
        </Box>

        {/* Industry Tabs */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            borderBottom: '1px solid #DFDEE6',
          }}
        >
          <Stack direction="row" spacing={0}>
            {availableIndustries.map((ind) => (
              <Box
                key={ind}
                onClick={() => setIndustry(ind)}
                sx={{
                  px: 1.5,
                  py: 1.5,
                  cursor: 'pointer',
                  borderBottom:
                    industry === ind
                      ? '2px solid #363440'
                      : '2px solid transparent',
                  fontWeight: industry === ind ? 600 : 400,
                  color: industry === ind ? 'text.primary' : 'text.secondary',
                  fontSize: 14,
                }}
              >
                {ind === 'capital_markets' && 'Capital Markets'}
                {ind === 'real_estate_lending' && 'Real Estate & Lending'}
                {ind === 'business_corporate' && 'Business & Corporate'}
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Billing Cycle Toggle (if needed) */}
        {currentPlans.some((p) => p.pricing.amount !== undefined) && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Box
              sx={{
                border: '1px solid #DFDEE6',
                borderRadius: 50,
                p: 0.25,
                pl: 1.5,
              }}
            >
              <Stack alignItems="center" direction="row" spacing={0}>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'text.secondary',
                    width: 118,
                    textAlign: 'center',
                  }}
                  variant="body3"
                >
                  Pay yearly (17% off)
                </Typography>
                <Box
                  onClick={() =>
                    setBillingCycle(
                      billingCycle === 'monthly' ? 'yearly' : 'monthly',
                    )
                  }
                  sx={{
                    bgcolor:
                      billingCycle === 'monthly' ? '#363440' : 'transparent',
                    color:
                      billingCycle === 'monthly' ? 'white' : 'text.secondary',
                    borderRadius: 20,
                    px: 1,
                    py: 1,
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600,
                    width: 118,
                    textAlign: 'center',
                  }}
                >
                  Pay monthly
                </Box>
              </Stack>
            </Box>
          </Box>
        )}

        {/* Pricing Cards */}
        <Stack
          direction="row"
          spacing={3}
          sx={{ justifyContent: 'center', flexWrap: 'wrap' }}
        >
          {currentPlans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};
