import { FC, ReactNode, useEffect, useState } from 'react';
import { Box, Stack } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import { DirectoriesQueryItem } from '@/types/Directories/query';

interface QueryTabProps {
  config: DirectoriesQueryItem;
  value: any;
  onFormChange: (newValue: any) => void;
  renderChild: (child: DirectoriesQueryItem, childIndex: number) => ReactNode;
}

const getIconByLabel = (label: string) => {
  const lowerLabel = label?.toLowerCase() || '';
  if (lowerLabel.includes('firm')) {
    return <BusinessIcon sx={{ fontSize: 20 }} />;
  }
  if (lowerLabel.includes('executive')) {
    return <PeopleIcon sx={{ fontSize: 20 }} />;
  }
  return null;
};

export const QueryTab: FC<QueryTabProps> = ({
  config,
  value,
  onFormChange,
  renderChild,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabOptions = config.optionValues || config.children;

  useEffect(() => {
    if (value && tabOptions) {
      const index = tabOptions.findIndex(
        (option: any) => option.value === value,
      );
      if (index !== -1) {
        setActiveTab(index);
      }
    }
  }, [value, tabOptions]);

  if (!tabOptions || tabOptions.length === 0) {
    return null;
  }

  return (
    <Box>
      <Stack
        direction="row"
        sx={{
          borderBottom: '1px solid #efe9fb',
        }}
      >
        {tabOptions.map((option: any, index: number) => {
          const label = option.label || '';
          const isActive = activeTab === index;
          const icon = getIconByLabel(label);

          return (
            <Box
              key={option.key || option.value || index}
              onClick={() => {
                setActiveTab(index);
                onFormChange(option.value);
              }}
              sx={{
                flex: 1,
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5,
                px: 1.5,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                color: 'text.focus',
                borderBottom: isActive
                  ? '2px solid #363440'
                  : '2px solid transparent',
                transition: 'all 0.2s',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
            >
              {icon}
              <span>{label}</span>
            </Box>
          );
        })}
      </Stack>

      <Box sx={{ mt: 1.5 }}>
        {config.children &&
          config.children[activeTab] &&
          renderChild(config.children[activeTab], activeTab)}
      </Box>
    </Box>
  );
};
