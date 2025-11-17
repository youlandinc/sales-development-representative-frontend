import { Box, Stack, Tab, Tabs, Typography } from '@mui/material';
import { SyntheticEvent, useState } from 'react';

import {
  SettingsEmails,
  SettingsIntegrations,
  SettingsPersonalInfo,
} from '@/components/molecules';

enum SettingEnum {
  Email = 'Email',
  Integrations = 'Integrations',
  Account = 'Account',
}

const SettingTabEnumLabel: Record<SettingEnum, string> = {
  [SettingEnum.Email]: 'Email setup',
  [SettingEnum.Integrations]: 'Integrations',
  [SettingEnum.Account]: 'Account',
};

export const Settings = () => {
  const [value, setValue] = useState<SettingEnum>(SettingEnum.Email);
  const handleChange = (_: SyntheticEvent, value: SettingEnum) => {
    setValue(value);
  };

  return (
    <Stack gap={3} sx={{ '& .tox-promotion': { display: 'none' } }}>
      <Typography variant={'h5'}>Settings</Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          onChange={handleChange}
          sx={{
            '& .MuiTab-root': {
              padding: '12px',
              fontSize: '16px',
              textTransform: 'none',
            },
            '& .MuiTab-root.Mui-selected': {
              fontWeight: '600',
            },
          }}
          value={value}
        >
          <Tab
            label={SettingTabEnumLabel[SettingEnum.Email]}
            value={SettingEnum.Email}
          />
          <Tab
            label={SettingTabEnumLabel[SettingEnum.Integrations]}
            value={SettingEnum.Integrations}
          />
          <Tab
            label={SettingTabEnumLabel[SettingEnum.Account]}
            value={SettingEnum.Account}
          />
        </Tabs>
      </Box>
      {value === SettingEnum.Email ? (
        <SettingsEmails />
      ) : value === SettingEnum.Integrations ? (
        <SettingsIntegrations />
      ) : (
        <SettingsPersonalInfo />
      )}
    </Stack>
  );
};
