import { Icon, Stack, Tooltip, Typography } from '@mui/material';

import ICON_INFO from './assets/icon-info.svg';

const TOOLTIP_SLOT_PROPS = {
  tooltip: {
    sx: {
      bgcolor: 'rgba(97, 97, 97, 0.92)',
      maxWidth: 240,
      py: 0.375,
      px: 0.75,
    },
  },
  arrow: {
    sx: {
      color: 'rgba(97, 97, 97, 0.92)',
    },
  },
};

const TYPOGRAPHY_NORMAL_SX = {
  fontSize: 12,
  color: '#fff',
  letterSpacing: '0.24px',
};

const TYPOGRAPHY_BOLD_SX = {
  ...TYPOGRAPHY_NORMAL_SX,
  fontWeight: 600,
};

export const QueryTips = () => {
  return (
    <Tooltip
      arrow
      placement="top"
      slotProps={TOOLTIP_SLOT_PROPS}
      title={
        <Stack sx={{ gap: 1.5 }}>
          <Stack>
            <Typography sx={TYPOGRAPHY_BOLD_SX}>Investors & Funds</Typography>
            <Typography sx={TYPOGRAPHY_NORMAL_SX}>
              Firms that actively manage capital and execute direct investments,
              such as Private Equity, REITs, and Debt Funds.
            </Typography>
          </Stack>

          <Stack>
            <Typography sx={TYPOGRAPHY_BOLD_SX}>Limited Partners</Typography>
            <Typography sx={TYPOGRAPHY_NORMAL_SX}>
              The institutions that provide capital to funds, including Pension
              Funds, Family Offices, and Endowments.
            </Typography>
          </Stack>

          <Stack>
            <Typography sx={TYPOGRAPHY_BOLD_SX}>Service Providers</Typography>
            <Typography sx={TYPOGRAPHY_NORMAL_SX}>
              Firms that facilitate the deal process, such as Investment Banks,
              Brokers, and Legal or Advisory firms.
            </Typography>
          </Stack>
        </Stack>
      }
    >
      <Icon
        component={ICON_INFO}
        sx={{
          width: 12,
          height: 12,
          ml: 0.5,
          verticalAlign: 'middle',
        }}
      />
    </Tooltip>
  );
};
