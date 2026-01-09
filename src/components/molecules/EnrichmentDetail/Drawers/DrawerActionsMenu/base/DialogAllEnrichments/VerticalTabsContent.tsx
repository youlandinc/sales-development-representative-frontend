import { Stack } from '@mui/material';
import { FC, SyntheticEvent, useCallback } from 'react';

import { ConfigActionsList } from './ConfigActionsList';
import { Provider } from './ProviderTabLabel';
import { VerticalProviderTabs } from './VerticalProviderTabs';

import { EnrichmentCategoryEnum } from '@/types/enrichment/drawerActions';
import { IntegrationAction } from '@/types/enrichment/integrations';

interface VerticalTabsContentProps {
  dialogAllEnrichmentsData: any[];
  dialogAllEnrichmentsTabKey: EnrichmentCategoryEnum;
  integrationsTabKey: string;
  taskTabKey: string;
  setIntegrationsTabKey: (value: string) => void;
  setTaskTabKey: (value: string) => void;
  getActionTabValue: (action: { name: string }) => string;
  handleConfigItemClick: (config: IntegrationAction) => void;
}

/**
 * 垂直标签内容组件
 * 用于显示非Actions标签时的垂直标签页和配置列表
 */
export const VerticalTabsContent: FC<VerticalTabsContentProps> = ({
  dialogAllEnrichmentsData,
  dialogAllEnrichmentsTabKey,
  integrationsTabKey,
  taskTabKey,
  setIntegrationsTabKey,
  setTaskTabKey,
  getActionTabValue,
  handleConfigItemClick,
}) => {
  // 获取当前类别的动作数组
  const currentActions =
    dialogAllEnrichmentsData.find(
      (item: any) => item.categoryKey === dialogAllEnrichmentsTabKey,
    )?.actions ?? [];

  // 确定当前激活的标签值
  const currentVerticalValue =
    currentActions.length > 0
      ? dialogAllEnrichmentsTabKey === EnrichmentCategoryEnum.integrations
        ? integrationsTabKey || getActionTabValue(currentActions[0])
        : taskTabKey || getActionTabValue(currentActions[0])
      : undefined;

  // 找到当前选中的action
  const selectedAction = currentActions.find((action: any) => {
    const tabValue = getActionTabValue(action);
    return (
      (dialogAllEnrichmentsTabKey === EnrichmentCategoryEnum.integrations &&
        tabValue === integrationsTabKey) ||
      (dialogAllEnrichmentsTabKey ===
        EnrichmentCategoryEnum.atlas_task_library &&
        tabValue === taskTabKey)
    );
  });

  // 处理标签切换
  const handleTabChange = useCallback(
    (_: SyntheticEvent, value: string) => {
      if (dialogAllEnrichmentsTabKey === EnrichmentCategoryEnum.integrations) {
        setIntegrationsTabKey(value);
      } else if (
        dialogAllEnrichmentsTabKey === EnrichmentCategoryEnum.atlas_task_library
      ) {
        setTaskTabKey(value);
      }
    },
    [dialogAllEnrichmentsTabKey, setIntegrationsTabKey, setTaskTabKey],
  );

  return (
    <Stack flexDirection={'row'} gap={1.5} overflow={'hidden'} pb={3}>
      {/* 垂直标签栏 */}
      <VerticalProviderTabs
        activeValue={currentVerticalValue}
        onChange={handleTabChange}
        providers={currentActions as Provider[]}
      />

      {/* 选中动作的配置列表 */}
      <ConfigActionsList
        configs={selectedAction?.waterfallConfigs || []}
        onItemClick={handleConfigItemClick}
      />
    </Stack>
  );
};
