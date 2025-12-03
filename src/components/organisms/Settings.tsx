'use client';
import { Box, Stack, Tab, Tabs, Typography } from '@mui/material';
import { SyntheticEvent, useCallback, useEffect, useState } from 'react';

import {
  CreditUsage,
  CurrentPlan,
  SettingsEmails,
  SettingsIntegrations,
  SettingsPersonalInfo,
} from '@/components/molecules';
import { SettingTabEnum } from '@/types/enum';
import { getParamsFromUrl } from '@/utils';

const SettingTabEnumLabel: Record<SettingTabEnum, string> = {
  [SettingTabEnum.Email]: 'Email setup',
  [SettingTabEnum.Integrations]: 'Integrations',
  [SettingTabEnum.Account]: 'Account',
  [SettingTabEnum.Plan]: 'Plan & billing',
  [SettingTabEnum.Usage]: 'Credit usage',
};

export const Settings = () => {
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

  const syncTabFromUrl = useCallback(() => {
    const { tab } = getParamsFromUrl(location.href);
    const validTabs = Object.values(SettingTabEnum);
    if (tab && validTabs.includes(tab as SettingTabEnum)) {
      setValue(tab as SettingTabEnum);
    } else {
      setValue(SettingTabEnum.Email);
    }
  }, []);

  useEffect(() => {
    syncTabFromUrl();
    //TODO
    // // 监听自定义 urlchange 事件 (由 LayoutSide 的 router.push 触发)
    // window.addEventListener('hashchange', syncTabFromUrl);
    // // 监听浏览器前进/后退
    // window.addEventListener('popstate', syncTabFromUrl);

    // return () => {
    //   window.removeEventListener('hashchange', syncTabFromUrl);
    //   window.removeEventListener('popstate', syncTabFromUrl);
    // };
  }, [syncTabFromUrl]);

  return (
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
  );
};
