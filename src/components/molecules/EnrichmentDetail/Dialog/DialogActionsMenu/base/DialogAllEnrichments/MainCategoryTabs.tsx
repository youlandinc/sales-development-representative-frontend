import { Box, Stack, Tab, Tabs } from '@mui/material';
import { SyntheticEvent } from 'react';
import { EnrichmentCategoryEnum } from '@/types/enrichment/drawerActions';

interface MainCategoryTabsProps {
  data: Array<{
    categoryKey: EnrichmentCategoryEnum;
    categoryName: string;
  }>;
  activeKey: EnrichmentCategoryEnum;
  onTabChange: (event: SyntheticEvent, value: EnrichmentCategoryEnum) => void;
}

/**
 * 主分类标签栏组件
 * 渲染主要分类选项卡（Actions/Integrations/Atlas Task Library）
 */
export const MainCategoryTabs = ({
  data,
  activeKey,
  onTabChange,
}: MainCategoryTabsProps) => {
  return (
    <Stack>
      <Tabs
        onChange={onTabChange}
        slotProps={{
          indicator: {
            sx: { backgroundColor: '#363440', height: 2 },
          },
        }}
        sx={{
          minHeight: 'unset',
          '& .MuiTabs-flexContainer': {
            gap: 3,
          },
          ml: 1,
        }}
        textColor={'inherit'}
        value={activeKey}
      >
        {data.map((item) => (
          <Tab
            key={item.categoryKey}
            label={item.categoryName}
            sx={{
              textTransform: 'none',
              fontSize: 14,
              fontWeight: 400,
              lineHeight: 1.2,
              color: '#6F6C7D',
              minHeight: 'unset',
              padding: '10px 0',
              fontFamily: 'Inter',
              '&.Mui-selected': {
                color: '#363440',
              },
            }}
            value={item.categoryKey}
          />
        ))}
      </Tabs>
      <Box sx={{ height: '1px', bgcolor: '#DFDEE6' }} />
    </Stack>
  );
};
