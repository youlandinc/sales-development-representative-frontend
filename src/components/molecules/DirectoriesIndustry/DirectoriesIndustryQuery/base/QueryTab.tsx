import { FC, ReactNode } from 'react';
import { Box, Icon, Tab, Tabs } from '@mui/material';
import { DirectoriesQueryItem } from '@/types/Directories/query';

import ICON_FIRM_DEFAULT from './assets/icon-firm-default.svg';
import ICON_FIRM_ACTIVE from './assets/icon-firm-active.svg';

import ICON_EXECUTIVE_DEFAULT from './assets/icon-executive-default.svg';
import ICON_EXECUTIVE_ACTIVE from './assets/icon-executive-active.svg';

interface QueryTabProps {
  config: DirectoriesQueryItem;
  value: any;
  onFormChange: (newValue: any) => void;
  renderChild: (child: DirectoriesQueryItem, childIndex: number) => ReactNode;
}

const getIconByValue = (value: string, isActive: boolean) => {
  if (value === 'FIRM') {
    return (
      <Icon
        component={isActive ? ICON_FIRM_ACTIVE : ICON_FIRM_DEFAULT}
        sx={{ width: 20, height: 20 }}
      />
    );
  }
  if (value === 'EXECUTIVE') {
    return (
      <Icon
        component={isActive ? ICON_EXECUTIVE_ACTIVE : ICON_EXECUTIVE_DEFAULT}
        sx={{ width: 20, height: 20 }}
      />
    );
  }
  return null;
};

export const QueryTab: FC<QueryTabProps> = ({
  config,
  value,
  onFormChange,
  renderChild,
}) => {
  const tabOptions = config.optionValues || config.children;

  if (!tabOptions || tabOptions.length === 0) {
    return null;
  }

  const currentIndex =
    tabOptions.findIndex((option: any) => option.value === value) ?? 0;

  return (
    <>
      <Tabs
        onChange={(_, newIndex) => {
          const newValue = tabOptions[newIndex]?.value;
          if (newValue) {
            onFormChange(newValue);
          }
        }}
        sx={{
          height: '36px',
          minHeight: '36px',
          borderBottom: '1px solid #EAE9EF',
          '& .MuiTabs-flexContainer': {
            height: '36px',
          },
          '& .MuiTabs-indicator': {
            height: '2px',
            backgroundColor: '#363440',
          },
          '& .MuiTab-root': {
            height: '36px',
            minHeight: '36px',
            fontSize: 14,
            fontWeight: 400,
            textTransform: 'none',
            color: 'text.focus',
            px: 1.5,
            transition: 'border 0.2s',
            flex: 1,
            '&.Mui-selected': {
              fontWeight: 600,
              color: 'text.focus',
            },
            '&:hover': {
              opacity: 0.8,
            },
          },
        }}
        value={currentIndex}
      >
        {tabOptions.map((option: any, index: number) => {
          const isActive = currentIndex === index;
          const icon = getIconByValue(option.value, isActive);

          return (
            <Tab
              key={option.key || option.value || index}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {icon}
                  <span>{option.label || ''}</span>
                </Box>
              }
            />
          );
        })}
      </Tabs>

      <Box sx={{ mt: 1.5 }}>
        {config.children &&
          config.children[currentIndex] &&
          renderChild(config.children[currentIndex], currentIndex)}
      </Box>
    </>
  );
};
