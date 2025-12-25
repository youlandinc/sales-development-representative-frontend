import { SyntheticEvent } from 'react';
import { Tab, Tabs } from '@mui/material';
import { Provider, ProviderTabLabel } from './ProviderTabLabel';

interface VerticalProviderTabsProps {
  providers: Provider[];
  activeValue: string | undefined;
  onChange: (event: SyntheticEvent, value: string) => void;
}

/**
 * 垂直供应商标签组件
 * 显示左侧垂直选项卡列表
 */
export const VerticalProviderTabs = ({
  providers,
  activeValue,
  onChange,
}: VerticalProviderTabsProps) => {
  return (
    <Tabs
      onChange={onChange}
      orientation={'vertical'}
      sx={{
        borderRight: 1,
        borderColor: 'divider',
        flexShrink: 0,
      }}
      value={activeValue}
    >
      {providers.map((provider) => (
        <Tab
          key={provider.name}
          label={
            <ProviderTabLabel
              isActive={provider.name === activeValue}
              provider={provider}
            />
          }
          sx={{
            textTransform: 'none',
            p: 1,
            m: 0,
            minHeight: 0,
            fontSize: 14,
            lineHeight: 1.4,
            minWidth: 0,
            width: '220px',
            alignItems: 'flex-start',
            color: 'text.primary',
            bgcolor: provider.name === activeValue ? '#F4F5F9' : 'transparent',
            '&:hover': {
              bgcolor: '#F4F5F9',
            },
          }}
          value={provider.name || ''}
        />
      ))}
    </Tabs>
  );
};
