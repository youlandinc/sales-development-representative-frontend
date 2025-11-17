import { FC } from 'react';
import { Link, Stack, Typography } from '@mui/material';

import { CreditCategory } from './CreditCategory';

export const TokensCreditsTooltipPanel: FC = () => {
  // TODO: Replace with actual data from API/store
  const lastCalculated = 'November 12, 2025 at 3:05 PM';

  const handleUpdate = () => {
    // TODO: Implement update logic
    // Update credits from API
  };

  return (
    <Stack
      bgcolor="#f9eedc"
      gap={1.5}
      minWidth={280}
      p={3}
      sx={{
        borderRadius: 2,
      }}
    >
      {/* Title */}
      <Typography
        color="#363440"
        fontSize={14}
        fontWeight={600}
        variant="subtitle2"
      >
        Account credits
      </Typography>

      {/* Account Credits Panel */}
      <Stack
        bgcolor="#363440"
        borderRadius={2}
        gap={3}
        p={3}
        sx={{
          width: '100%',
        }}
      >
        <CreditCategory title="Capital Markets" unlimited />
        <CreditCategory title="Real Estate & Lending" total={100} used={15} />
        <CreditCategory title="Business & Corporate" total={1000} used={550} />
      </Stack>

      {/* Enrichment Credits Panel */}
      <Stack
        bgcolor="#363440"
        borderRadius={2}
        gap={3}
        p={3}
        sx={{
          width: '100%',
        }}
      >
        <CreditCategory title="Enrichment credits" total={2000} used={640} />
      </Stack>

      {/* Footer */}
      <Stack flexDirection="row" justifyContent="space-between">
        <Typography color="#363440" fontSize={12} variant="body3">
          Last calculated: {lastCalculated}
        </Typography>
        <Link
          component="button"
          fontSize={12}
          onClick={handleUpdate}
          sx={{
            color: '#3d63de',
            cursor: 'pointer',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
          variant="body3"
        >
          Update
        </Link>
      </Stack>
    </Stack>
  );
};

