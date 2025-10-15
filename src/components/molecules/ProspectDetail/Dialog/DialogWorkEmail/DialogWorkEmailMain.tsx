import {
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';

import { DialogHeader } from '../Common';
import {
  DialogWorkEmailFullConfiguration,
  DialogWorkEmailQuickSetup,
} from './index';

import { useWorkEmailStore } from '@/stores/Prospect';
import { WaterfallConfigTypeEnum } from '@/types/Prospect/tableActions';

export const DialogWorkEmailMain = () => {
  const {
    setWorkEmailVisible,
    allIntegrations,
    setWaterfallConfigType,
    waterfallConfigType,
  } = useWorkEmailStore((store) => store);

  return (
    <Stack flex={1} overflow={'hidden'}>
      <DialogHeader
        handleBack={() => setWorkEmailVisible(false)}
        handleClose={() => setWorkEmailVisible(false)}
        title={'Work Email'}
      />
      <Stack flex={1} gap={4} minHeight={0} overflow={'auto'} p={3}>
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
          {allIntegrations.length > 0 && (
            <ToggleButtonGroup
              color={'primary'}
              exclusive
              onChange={(_, value) => {
                if (value) {
                  setWaterfallConfigType(value);
                }
              }}
              sx={{
                '& .Mui-selected': {
                  borderColor: 'primary.main',
                },
              }}
              translate={'no'}
              value={waterfallConfigType}
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
                value={WaterfallConfigTypeEnum.setup}
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
                value={WaterfallConfigTypeEnum.configure}
              >
                Full configuration
              </ToggleButton>
            </ToggleButtonGroup>
          )}
          {waterfallConfigType === 'setup' && <DialogWorkEmailQuickSetup />}
          {waterfallConfigType === 'configure' && (
            <DialogWorkEmailFullConfiguration />
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};
