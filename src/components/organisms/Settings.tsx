import { Box, Stack, Tab, Tabs, Typography } from '@mui/material';
import { SyntheticEvent, useState } from 'react';

import {
  CreditUsage,
  CurrentPlan,
  SettingsEmails,
  SettingsIntegrations,
  SettingsPersonalInfo,
} from '@/components/molecules';

enum SettingEnum {
  Email = 'Email',
  Integrations = 'Integrations',
  Account = 'Account',
  Plan = 'Plan',
  Usage = 'Usage',
}

const SettingTabEnumLabel: Record<SettingEnum, string> = {
  [SettingEnum.Email]: 'Email setup',
  [SettingEnum.Integrations]: 'Integrations',
  [SettingEnum.Account]: 'Account',
  [SettingEnum.Plan]: 'Plan & billing',
  [SettingEnum.Usage]: 'Credit usage',
};

export const Settings = () => {
  const [value, setValue] = useState<SettingEnum>(SettingEnum.Email);
  const handleChange = (_: SyntheticEvent, value: SettingEnum) => {
    setValue(value);
  };

  const tabsData = [
    {
      label: SettingTabEnumLabel[SettingEnum.Email],
      value: SettingEnum.Email,
      content: <SettingsEmails />,
    },
    {
      label: SettingTabEnumLabel[SettingEnum.Integrations],
      value: SettingEnum.Integrations,
      content: <SettingsIntegrations />,
    },
    {
      label: SettingTabEnumLabel[SettingEnum.Account],
      value: SettingEnum.Account,
      content: <SettingsPersonalInfo />,
    },
    {
      label: SettingTabEnumLabel[SettingEnum.Plan],
      value: SettingEnum.Plan,
      content: <CurrentPlan />,
    },
    {
      label: SettingTabEnumLabel[SettingEnum.Usage],
      value: SettingEnum.Usage,
      content: <CreditUsage />,
    },
  ];

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
          {tabsData.map((item) => (
            <Tab key={item.value} label={item.label} value={item.value} />
          ))}
        </Tabs>
      </Box>
      {tabsData.map((item) => (
        <Box hidden={value !== item.value} key={item.value} sx={{ flex: 1 }}>
          {item.content}
        </Box>
      ))}
    </Stack>
  );
};
