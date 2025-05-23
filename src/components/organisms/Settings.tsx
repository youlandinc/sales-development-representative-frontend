import { Stack, Typography } from '@mui/material';

import {
  SettingsEmails,
  SettingsIntegrations,
  SettingsPersonalInfo,
} from '@/components/molecules';

export const Settings = () => {
  return (
    <Stack gap={3}>
      <Typography lineHeight={1.2} variant={'h6'}>
        Settings
      </Typography>
      <SettingsEmails />
      <SettingsIntegrations />
      <SettingsPersonalInfo />
    </Stack>
  );
};
