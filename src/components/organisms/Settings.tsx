'use client';
import { Stack, Typography } from '@mui/material';

import {
  SettingsEmails,
  SettingsIntegrations,
  SettingsPersonalInfo,
} from '@/components/molecules';

import dynamic from 'next/dynamic';

const StyledCkEditor = dynamic(
  () => import('@/components/atoms').then((mod) => mod.StyledCkEditor),
  { ssr: false },
);

export const Settings = () => {
  return (
    <Stack gap={3}>
      <Typography variant={'h5'}>Settings</Typography>
      <SettingsEmails />
      <SettingsIntegrations />
      <SettingsPersonalInfo />
      <StyledCkEditor />
    </Stack>
  );
};
