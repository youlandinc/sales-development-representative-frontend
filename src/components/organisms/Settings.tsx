import { Stack, Typography } from '@mui/material';

import {
  SettingsEmails,
  SettingsIntegrations,
  SettingsPersonalInfo,
} from '@/components/molecules';

export const Settings = () => {
  return (
    <Stack gap={3} sx={{ '& .tox-promotion': { display: 'none' } }}>
      <Typography variant={'h5'}>Settings</Typography>
      <SettingsEmails />
      <SettingsIntegrations />
      <SettingsPersonalInfo />
    </Stack>
  );
};
