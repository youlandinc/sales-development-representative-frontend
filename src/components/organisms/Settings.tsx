'use client';
import { Box, Stack, Tab, Tabs, Typography } from '@mui/material';
import { Suspense, SyntheticEvent, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import {
  CreditUsage,
  CurrentPlan,
  SettingsEmails,
  SettingsIntegrations,
  SettingsPersonalInfo,
} from '@/components/molecules';
import { SettingTabEnum } from '@/types/enum';

const SettingTabEnumLabel: Record<SettingTabEnum, string> = {
  [SettingTabEnum.Email]: 'Email setup',
  [SettingTabEnum.Integrations]: 'Integrations',
  [SettingTabEnum.Account]: 'Account',
  [SettingTabEnum.Plan]: 'Plan & billing',
  [SettingTabEnum.Usage]: 'Credit usage',
};

export const Settings = () => {
  const tabParams = useSearchParams().get('tab');
  const [value, setValue] = useState<SettingTabEnum>(SettingTabEnum.Email);
  const onTabChange = (_: SyntheticEvent, newValue: SettingTabEnum) => {
    setValue(newValue);
  };

  const tabsData = [
    {
      label: SettingTabEnumLabel[SettingTabEnum.Email],
      value: SettingTabEnum.Email,
      content: <SettingsEmails />,
    },
    {
      label: SettingTabEnumLabel[SettingTabEnum.Integrations],
      value: SettingTabEnum.Integrations,
      content: <SettingsIntegrations />,
    },
    {
      label: SettingTabEnumLabel[SettingTabEnum.Account],
      value: SettingTabEnum.Account,
      content: <SettingsPersonalInfo />,
    },
    {
      label: SettingTabEnumLabel[SettingTabEnum.Plan],
      value: SettingTabEnum.Plan,
      content: <CurrentPlan />,
    },
    {
      label: SettingTabEnumLabel[SettingTabEnum.Usage],
      value: SettingTabEnum.Usage,
      content: <CreditUsage />,
    },
  ];

  useEffect(() => {
    const validTabs = Object.values(SettingTabEnum);
    if (tabParams && validTabs.includes(tabParams as SettingTabEnum)) {
      setValue(tabParams as SettingTabEnum);
    }
  }, [tabParams]);

  return (
    <Suspense>
      <Stack sx={{ '& .tox-promotion': { display: 'none' }, height: '100%' }}>
        <Typography pb={3} variant={'h5'}>
          Settings
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            onChange={onTabChange}
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
          <Box
            hidden={value !== item.value}
            key={item.value}
            sx={{ flex: 1, minHeight: 0, overflow: 'auto', pt: 3 }}
          >
            {item.content}
          </Box>
        ))}
      </Stack>
    </Suspense>
  );
};
