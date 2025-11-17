import { Box, Stack, SxProps, Tab, Tabs } from '@mui/material';
import React, {
  FC,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useState,
} from 'react';

type TabPanelProps = {
  index: number;
  value: number;
  sx?: SxProps;
};

type StyledTabProps = {
  tabsData: {
    label: string | ReactNode;
    content: ReactNode;
  }[];
  sx?: SxProps;
  startIndex?: number;
  cb?: (index: number) => void;
};

export const TabPanel = (props: PropsWithChildren<TabPanelProps>) => {
  const { children, value, index, ...other } = props;

  return (
    <Box hidden={value !== index} {...other}>
      {value === index && children}
    </Box>
  );
};

export const StyledTab: FC<StyledTabProps> = ({
  tabsData,
  sx,
  startIndex = 0,
  cb,
}) => {
  const [value, setValue] = useState(startIndex);

  useEffect(() => {
    setValue(startIndex);
  }, [startIndex]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    cb?.(newValue);
  };

  return (
    <Stack sx={{ height: '100%' }}>
      <Tabs
        onChange={handleChange}
        scrollButtons={false}
        sx={[
          {
            '& .MuiTab-root': {
              textTransform: 'none',
              p: 1.25,
              fontSize: { xs: 14, lg: 16 },
            },
            '& .MuiTabs-flexContainer .MuiButtonBase-root': {
              p: 0,
              minWidth: 0,
              minHeight: 0,
              mr: { xs: 1, lg: 3 },
              mb: 1.25,
              fontWeight: 600,
              '& .total_number': {
                backgroundColor: 'text.disabled',
              },
              '&.Mui-selected': {
                '& .total_number': {
                  backgroundColor: 'primary.slightly_lighter',
                },
              },
            },
            mb: 3,
            minHeight: 0,
            pl: 0,
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        value={value}
        variant={'scrollable'}
      >
        {tabsData.map((item, index) => (
          <Tab key={index} label={item.label} />
        ))}
      </Tabs>
      {tabsData.map((item, index) => (
        <TabPanel index={index} key={index} sx={{ flex: 1 }} value={value}>
          {item.content}
        </TabPanel>
      ))}
    </Stack>
  );
};
