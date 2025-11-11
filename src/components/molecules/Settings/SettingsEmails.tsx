import { FC } from 'react';
import { Stack } from '@mui/material';

import { SettingMailboxes, SettingsEmailDomain } from './index';

export const SettingsEmails: FC = () => {
  return (
    <Stack gap={3}>
      <SettingsEmailDomain />
      <SettingMailboxes />
    </Stack>
  );
};
