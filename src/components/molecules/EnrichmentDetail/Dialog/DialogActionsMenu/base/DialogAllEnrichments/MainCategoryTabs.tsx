import { Box, Icon, Stack, Tab, Tabs } from '@mui/material';
import { SyntheticEvent } from 'react';

import { EnrichmentCategoryEnum } from '@/types/enrichment/drawerActions';

import ICON_ATLAS_TASK_LIBRARY from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogAllEnrichments/icon_ai.svg';
import ICON_INTEGRATIONS from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogAllEnrichments/icon_integrations.svg';
import ICON_ACTION from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogAllEnrichments/icon_action.svg';

interface MainCategoryTabsProps {
  data: Array<{
    categoryKey: EnrichmentCategoryEnum;
    categoryName: string;
  }>;
  activeKey: EnrichmentCategoryEnum;
  onTabChange: (event: SyntheticEvent, value: EnrichmentCategoryEnum) => void;
}

const iconMap: Record<string, any> = {
  [EnrichmentCategoryEnum.integrations]: ICON_INTEGRATIONS,
  [EnrichmentCategoryEnum.atlas_task_library]: ICON_ATLAS_TASK_LIBRARY,
  [EnrichmentCategoryEnum.actions]: ICON_ACTION,
};

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
            icon={
              iconMap[item.categoryKey] ? (
                <Icon
                  component={iconMap[item.categoryKey]}
                  sx={{ width: 16, height: 16, m: '0px !important' }}
                />
              ) : undefined
            }
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
              flexDirection: 'row',
              alignItems: 'center',
              gap: 0.5,
            }}
            value={item.categoryKey}
          />
        ))}
      </Tabs>
      <Box sx={{ height: '1px', bgcolor: '#DFDEE6' }} />
    </Stack>
  );
};
