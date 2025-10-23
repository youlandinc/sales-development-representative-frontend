import { Stack, Typography } from '@mui/material';

import {
  SettingsEmails,
  SettingsIntegrations,
  SettingsPersonalInfo,
} from '@/components/molecules';
import dynamic from 'next/dynamic';

const StyledTinyEditor = dynamic(
  () =>
    import('@/components/atoms/StyledTinyEditor').then(
      (mod) => mod.StyledTinyEditor,
    ),
  {
    ssr: false,
  },
);

export const Settings = () => {
  return (
    <Stack gap={3} sx={{ '& .tox-promotion': { display: 'none' } }}>
      <Typography variant={'h5'}>Settings</Typography>
      <SettingsEmails />
      <SettingsIntegrations />
      <SettingsPersonalInfo />
      <StyledTinyEditor />
    </Stack>
  );
};
