import { FC, ReactNode } from 'react';
import { Box, Tab, Tabs } from '@mui/material';

import {
  DirectoriesEntityTypeEnum,
  DirectoriesQueryItem,
} from '@/types/directories';

import { QueryIcon } from './index';

interface QueryTabProps {
  config: DirectoriesQueryItem;
  value: any;
  onFormChange: (newValue: any) => void;
  renderChild: (child: DirectoriesQueryItem, childIndex: number) => ReactNode;
}

const getIconByValue = (value: string, isActive: boolean) => {
  if (value === DirectoriesEntityTypeEnum.firm) {
    return <QueryIcon.Firm isActive={isActive} />;
  }
  if (value === DirectoriesEntityTypeEnum.executive) {
    return <QueryIcon.Executive isActive={isActive} />;
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

  const currentIndex = Math.max(
    0,
    tabOptions.findIndex((option: any) => option.value === value),
  );

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
          height: 36,
          minHeight: 36,
          borderBottom: '1px solid #F0F0F4',
          '& .MuiTabs-flexContainer': {
            height: 36,
          },
          '& .MuiTabs-indicator': {
            height: '2px',
            backgroundColor: '#363440',
          },
          '& .MuiTab-root': {
            height: 36,
            minHeight: 36,
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
