import { Stack } from '@mui/material';
import { FC, SyntheticEvent, useCallback } from 'react';
import { useShallow } from 'zustand/shallow';

import { useDialogActionsMenu } from '@/components/molecules/EnrichmentDetail/Dialog/DialogActionsMenu/hooks';
import { ConfigActionsList } from './ConfigActionsList';
import { VerticalProviderTabs } from './VerticalProviderTabs';
import { Provider } from './ProviderTabLabel';

import {
  ActiveTypeEnum,
  useEnrichmentTableStore,
  useWorkEmailStore,
} from '@/stores/enrichment';
import { useActionsStore } from '@/stores/enrichment/useActionsStore';
import { EnrichmentCategoryEnum } from '@/types/enrichment/drawerActions';
import {
  DisplayTypeEnum,
  IntegrationAction,
} from '@/types/enrichment/integrations';
import { TableColumnMenuActionEnum } from '@/types/enrichment/table';

interface VerticalTabsContentProps {
  dialogAllEnrichmentsData: any[];
  dialogAllEnrichmentsTabKey: EnrichmentCategoryEnum;
  integrationsTabKey: string;
  taskTabKey: string;
  setIntegrationsTabKey: (value: string) => void;
  setTaskTabKey: (value: string) => void;
  getActionTabValue: (action: { name: string }) => string;
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
}) => {
  const { onClickToAiTemplate } = useDialogActionsMenu();

  const { setDialogAllEnrichmentsVisible } = useActionsStore(
    useShallow((store) => ({
      dialogAllEnrichmentsData: store.dialogAllEnrichmentsData,
      dialogAllEnrichmentsTabKey: store.dialogAllEnrichmentsTabKey,
      setDialogAllEnrichmentsTabKey: store.setDialogAllEnrichmentsTabKey,
      setDialogAllEnrichmentsVisible: store.setDialogAllEnrichmentsVisible,
    })),
  );
  const { setDisplayType, setSelectedIntegrationToConfig, setActiveType } =
    useWorkEmailStore(
      useShallow((state) => ({
        setDisplayType: state.setDisplayType,
        setSelectedIntegrationToConfig: state.setSelectedIntegrationToConfig,
        setActiveType: state.setActiveType,
      })),
    );
  const { openDialog } = useEnrichmentTableStore(
    useShallow((state) => ({
      openDialog: state.openDialog,
    })),
  );
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

  // 处理配置项点击
  const handleConfigItemClick = useCallback(
    (config: IntegrationAction) => {
      if (
        dialogAllEnrichmentsTabKey === EnrichmentCategoryEnum.atlas_task_library
      ) {
        const description = config.description ?? '';
        onClickToAiTemplate(`Name:${config.name},Description:${description}`);
        setDialogAllEnrichmentsVisible(false);
        return;
      }
      openDialog(TableColumnMenuActionEnum.work_email);
      setDisplayType(DisplayTypeEnum.integration);
      setSelectedIntegrationToConfig(config);
      setActiveType(ActiveTypeEnum.add);
      setDialogAllEnrichmentsVisible(false);
    },
    [
      dialogAllEnrichmentsTabKey,
      openDialog,
      setDisplayType,
      setSelectedIntegrationToConfig,
      setActiveType,
      setDialogAllEnrichmentsVisible,
      onClickToAiTemplate,
    ],
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
