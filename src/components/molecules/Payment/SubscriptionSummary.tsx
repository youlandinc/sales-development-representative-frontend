import { Box, Divider, Stack, Typography } from '@mui/material';

interface SubscriptionSummaryProps {
  planName?: string;
  planDescription?: string;
  billingPeriod?: string;
  amount?: number;
  currency?: string;
  logoUrl?: string;
}

export const SubscriptionSummary = ({
  planName = 'Professional Plan Monthly',
  planDescription = 'Professional monthly plan offering 400 records/ month',
  billingPeriod = 'Billed monthly',
  amount = 1000.0,
  currency = 'USD',
  logoUrl = 'http://localhost:3845/assets/4c8ebfc8de5618257344b23a68276113b32bc09e.svg',
}: SubscriptionSummaryProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <Stack gap={3} sx={{ width: '100%', maxWidth: 380 }}>
      {/* Logo */}
      <Box
        alt="Corepass"
        component="img"
        src={logoUrl}
        sx={{
          width: 224,
          height: 32,
        }}
      />

      {/* Main Container */}
      <Stack gap={6}>
        {/* Header Section */}
        <Stack gap={1}>
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 500,
              color: 'rgba(26, 26, 26, 0.65)',
              lineHeight: '20.8px',
            }}
          >
            Subscribe to {planName}
          </Typography>
          <Stack alignItems="center" direction="row" gap={1}>
            <Typography
              sx={{
                fontSize: '30.2px',
                fontWeight: 700,
                color: 'rgba(26, 26, 26, 0.9)',
                lineHeight: 1.5,
                letterSpacing: '-0.48px',
              }}
            >
              {formatCurrency(amount)}
            </Typography>
            <Stack
              sx={{
                fontSize: '13.2px',
                color: 'rgba(26, 26, 26, 0.65)',
                lineHeight: 1.5,
                letterSpacing: '-0.48px',
              }}
            >
              <Typography
                component="span"
                sx={{ fontSize: 'inherit', fontWeight: 700 }}
              >
                per
              </Typography>
              <Typography
                component="span"
                sx={{ fontSize: 'inherit', fontWeight: 700 }}
              >
                month
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        {/* Plan Details */}
        <Stack gap={1.5}>
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="space-between"
          >
            <Typography
              sx={{
                fontSize: '13.2px',
                fontWeight: 500,
                color: 'rgba(26, 26, 26, 0.9)',
                lineHeight: 1.5,
              }}
            >
              {planName}
            </Typography>
            <Typography
              sx={{
                fontSize: '12.3px',
                fontWeight: 500,
                color: 'rgba(26, 26, 26, 0.9)',
                lineHeight: 1.5,
                letterSpacing: '-0.48px',
              }}
            >
              {formatCurrency(amount)}
            </Typography>
          </Stack>
          <Stack gap={0.5}>
            <Typography
              sx={{
                fontSize: '11.1px',
                fontWeight: 400,
                color: 'rgba(26, 26, 26, 0.6)',
                lineHeight: '15.6px',
              }}
            >
              {planDescription}
            </Typography>
            <Typography
              sx={{
                fontSize: '11.1px',
                fontWeight: 400,
                color: 'rgba(26, 26, 26, 0.6)',
                lineHeight: '15.6px',
              }}
            >
              {billingPeriod}
            </Typography>
          </Stack>
        </Stack>

        {/* Pricing Breakdown */}
        <Stack gap={3}>
          <Divider sx={{ borderColor: 'rgba(26, 26, 26, 0.1)' }} />

          {/* Subtotal */}
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="space-between"
          >
            <Typography
              sx={{
                fontSize: '13.2px',
                fontWeight: 500,
                color: 'rgba(26, 26, 26, 0.9)',
                lineHeight: 1.5,
              }}
            >
              Subtotal
            </Typography>
            <Typography
              sx={{
                fontSize: '12.3px',
                fontWeight: 500,
                color: 'rgba(26, 26, 26, 0.9)',
                lineHeight: 1.5,
                letterSpacing: '-0.48px',
              }}
            >
              {formatCurrency(amount)}
            </Typography>
          </Stack>

          <Divider sx={{ borderColor: 'rgba(26, 26, 26, 0.1)' }} />

          {/* Total */}
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="space-between"
          >
            <Typography
              sx={{
                fontSize: '13.2px',
                fontWeight: 500,
                color: 'rgba(26, 26, 26, 0.9)',
                lineHeight: 1.5,
              }}
            >
              Total due today
            </Typography>
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 700,
                color: 'rgba(26, 26, 26, 0.9)',
                lineHeight: 1.5,
                letterSpacing: '-0.48px',
              }}
            >
              {formatCurrency(amount)}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
