import { FC, useState } from 'react';
import { Stack } from '@mui/material';

import { EmailDomainDetails } from '@/types';

import { SettingMailboxes, SettingsEmailDomain } from './index';

export const SettingsEmails: FC = () => {
  const [emailDomainList, setEmailDomainList] = useState<EmailDomainDetails[]>(
    [],
  );

  return (
    <Stack gap={3}>
      <SettingsEmailDomain
        emailDomainList={emailDomainList}
        setEmailDomainList={setEmailDomainList}
      />
      <SettingMailboxes emailDomainList={emailDomainList} />
    </Stack>
  );
};
