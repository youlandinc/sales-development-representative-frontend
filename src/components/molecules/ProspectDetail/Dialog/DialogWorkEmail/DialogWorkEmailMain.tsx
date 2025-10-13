import {
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import {
  DialogWorkEmailFullConfiguration,
  DialogWorkEmailQuickSetup,
} from './index';

import { useWorkEmailStore } from '@/stores/Prospect';

export const DialogWorkEmailMain = () => {
  useWorkEmailStore((store) => store);

  const [tab, setTab] = useState<'setup' | 'configure'>('setup');

  return (
    <Stack>
      <Stack gap={4} pt={4} px={3}>
        <Stack gap={1}>
          <Typography fontWeight={600} lineHeight={1.2}>
            Action
          </Typography>
          <Typography fontWeight={600} lineHeight={1.2} variant={'body2'}>
            Waterfall
          </Typography>
          <Typography variant={'body2'}>
            Find a person&apos;s work email, this waterfall is optimized for
            companies below 5,000 employees.
          </Typography>
        </Stack>

        <Stack gap={3}>
          <ToggleButtonGroup
            color={'primary'}
            exclusive
            onChange={(_, value) => {
              if (value) {
                setTab(value);
              }
            }}
            sx={{
              '& .Mui-selected': {
                borderColor: 'primary.main',
              },
            }}
            translate={'no'}
            value={tab}
          >
            <ToggleButton
              fullWidth
              sx={{
                fontSize: 14,
                textTransform: 'none',
                lineHeight: 1.2,
                py: 1,
                fontWeight: 600,
                borderRadius: '8px 0 0 8px',
              }}
              value={'setup'}
            >
              Quick setup
            </ToggleButton>
            <ToggleButton
              fullWidth
              sx={{
                fontSize: 14,
                textTransform: 'none',
                lineHeight: 1.2,
                py: 1,
                fontWeight: 600,
                borderRadius: '0 8px 8px 0',
              }}
              value={'configure'}
            >
              Full configuration
            </ToggleButton>
          </ToggleButtonGroup>
          {tab === 'setup' && <DialogWorkEmailQuickSetup />}
          {tab === 'configure' && <DialogWorkEmailFullConfiguration />}
        </Stack>
      </Stack>
    </Stack>
  );
};
