import {
  Drawer,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useWorkEmailStore } from '@/stores/Prospect';
import { DialogHeader } from '../Common/DialogHeader';
import { useState } from 'react';
import {
  DialogWorkEmailFullConfiguration,
  DialogWorkEmailQuickSetup,
} from './index';

export const DialogWorkEmail = () => {
  const { workEmailVisible, setWorkEmailVisible } = useWorkEmailStore(
    (store) => store,
  );

  const [tab, setTab] = useState<'setup' | 'configure'>('setup');

  return (
    <Drawer
      anchor={'right'}
      hideBackdrop
      onClose={() => setWorkEmailVisible(false)}
      open={workEmailVisible}
      slotProps={{
        paper: {
          sx: {
            maxWidth: 500,
            width: '100%',
          },
        },
      }}
      sx={{
        left: 'unset',
      }}
    >
      <DialogHeader
        handleBack={() => setWorkEmailVisible(false)}
        handleClose={() => setWorkEmailVisible(false)}
        title={'Work Email'}
      />
      <Stack gap={4} pt={4} px={3}>
        <Stack gap={1}>
          <Typography fontWeight={600} lineHeight={1.2}>
            Action
          </Typography>
          <Typography fontWeight={600} lineHeight={1.2}>
            Waterfall
          </Typography>
          <Typography variant={'body2'}>
            Find a person&apos;s work email, this waterfall is optimized for
            companies below 5,000 employees.
          </Typography>
        </Stack>

        <Stack gap={1}>
          <ToggleButtonGroup
            color={'primary'}
            exclusive
            onChange={(e, value) => {
              setTab(value);
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
    </Drawer>
  );
};
