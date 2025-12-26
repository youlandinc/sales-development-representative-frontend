import { FC, SyntheticEvent, useCallback } from 'react';
import { Stack } from '@mui/material';
import Image from 'next/image';

import { StyledActionItem } from '@/components/molecules/EnrichmentDetail/Dialog/Common';
import { StyledProviderBadges } from '../StyledProviderBadges';
import { EnrichmentCategoryEnum } from '@/types/enrichment/drawerActions';
import { DisplayTypeEnum } from '@/types/enrichment/integrations';
import { TableColumnMenuActionEnum } from '@/types/enrichment/table';
import { MainCategoryTabs } from './MainCategoryTabs';
import { ConfigActionsList } from './ConfigActionsList';
import { VerticalProviderTabs } from './VerticalProviderTabs';
import { Provider } from './index';

interface CategoryBrowseContentProps {
  dialogAllEnrichmentsData: any[];
  dialogAllEnrichmentsTabKey: EnrichmentCategoryEnum;
  integrationsTabKey: string;
  taskTabKey: string;
  onTabChange: (event: SyntheticEvent, value: EnrichmentCategoryEnum) => void;
  setIntegrationsTabKey: (value: string) => void;
  setTaskTabKey: (value: string) => void;
  onWorkEmailItemClick: (key: string) => void;
  onClickToAiTemplate: (template: string) => void;
  setDialogAllEnrichmentsVisible: (visible: boolean) => void;
  openDialog: (action: TableColumnMenuActionEnum) => void;
  setDisplayType: (type: DisplayTypeEnum) => void;
  setSelectedIntegrationToConfig: (config: any) => void;
}

/**
 * 分类浏览内容组件
 * 用于显示非搜索条件下的分类浏览内容
 */
export const CategoryBrowseContent: FC<CategoryBrowseContentProps> = ({
  dialogAllEnrichmentsData,
  dialogAllEnrichmentsTabKey,
  integrationsTabKey,
  taskTabKey,
  onTabChange,
  setIntegrationsTabKey,
  setTaskTabKey,
  onWorkEmailItemClick,
  onClickToAiTemplate,
  setDialogAllEnrichmentsVisible,
  openDialog,
  setDisplayType,
  setSelectedIntegrationToConfig,
}) => {
  /**
   * 获取动作的标签值
   */
  const getActionTabValue = useCallback(
    (action: { name: string }) => action.name,
    [],
  );

  return (
    <Stack sx={{ width: '100%', gap: 1.5 }}>
      {/* 主分类标签页 */}
      <MainCategoryTabs
        activeKey={dialogAllEnrichmentsTabKey}
        data={dialogAllEnrichmentsData}
        onTabChange={onTabChange}
      />

      {/* Actions标签内容 - 只在Actions标签时显示 */}
      {dialogAllEnrichmentsTabKey === EnrichmentCategoryEnum.actions && (
        <Stack sx={{ gap: 1.5 }}>
          {dialogAllEnrichmentsData
            .find((item) => item.categoryKey === EnrichmentCategoryEnum.actions)
            ?.actions?.map((provider: any, providerIndex: any) => (
              <StyledActionItem
                badges={
                  provider?.waterfallConfigs?.length ? (
                    <StyledProviderBadges
                      maxCount={3}
                      providers={(provider.waterfallConfigs ?? []).map(
                        (config: { logoUrl: string }) => config.logoUrl,
                      )}
                    />
                  ) : undefined
                }
                description={provider?.description ?? ''}
                icon={
                  provider?.logoUrl ? (
                    <Image
                      alt={'Provider'}
                      height={16}
                      src={provider?.logoUrl ?? ''}
                      width={16}
                    />
                  ) : undefined
                }
                key={`action-${provider.key ?? providerIndex}`}
                onClick={() => {
                  onWorkEmailItemClick(provider.key ?? '');
                  setDialogAllEnrichmentsVisible(false);
                }}
                title={provider?.name ?? ''}
              />
            ))}
        </Stack>
      )}

      {/* 垂直标签内容 - 只在非Actions标签时显示 */}
      {dialogAllEnrichmentsTabKey !== EnrichmentCategoryEnum.actions && (
        <Stack flex={1} flexDirection={'row'} gap={1.5} pb={3}>
          {/* 提取当前显示的动作数据 */}
          {(() => {
            // 获取当前类别的动作数组
            const currentActions =
              dialogAllEnrichmentsData.find(
                (item) => item.categoryKey === dialogAllEnrichmentsTabKey,
              )?.actions ?? [];

            // 确定当前激活的标签值
            const currentVerticalValue =
              currentActions.length > 0
                ? dialogAllEnrichmentsTabKey ===
                  EnrichmentCategoryEnum.integrations
                  ? integrationsTabKey || getActionTabValue(currentActions[0])
                  : taskTabKey || getActionTabValue(currentActions[0])
                : undefined;

            // 找到当前选中的action
            const selectedAction = currentActions.find((action: any) => {
              const tabValue = getActionTabValue(action);
              return (
                (dialogAllEnrichmentsTabKey ===
                  EnrichmentCategoryEnum.integrations &&
                  tabValue === integrationsTabKey) ||
                (dialogAllEnrichmentsTabKey ===
                  EnrichmentCategoryEnum.atlas_task_library &&
                  tabValue === taskTabKey)
              );
            });

            // 处理标签切换
            const handleTabChange = (_: SyntheticEvent, value: string) => {
              if (
                dialogAllEnrichmentsTabKey ===
                EnrichmentCategoryEnum.integrations
              ) {
                setIntegrationsTabKey(value);
              } else if (
                dialogAllEnrichmentsTabKey ===
                EnrichmentCategoryEnum.atlas_task_library
              ) {
                setTaskTabKey(value);
              }
            };

            return (
              <>
                {/* 垂直标签栏 */}
                <VerticalProviderTabs
                  activeValue={currentVerticalValue}
                  onChange={handleTabChange}
                  providers={currentActions as Provider[]}
                />

                {/* 选中动作的配置列表 */}
                <Stack flex={1} gap={1.5}>
                  <ConfigActionsList
                    configs={selectedAction?.waterfallConfigs || []}
                    onItemClick={(config) => {
                      if (
                        dialogAllEnrichmentsTabKey ===
                        EnrichmentCategoryEnum.atlas_task_library
                      ) {
                        const description = config.description ?? '';
                        onClickToAiTemplate(
                          `Name:${config.name},Description:${description}`,
                        );
                        setDialogAllEnrichmentsVisible(false);
                        return;
                      }
                      openDialog(TableColumnMenuActionEnum.work_email);
                      setDisplayType(DisplayTypeEnum.integration);
                      setSelectedIntegrationToConfig(config);
                      setDialogAllEnrichmentsVisible(false);
                    }}
                  />
                </Stack>
              </>
            );
          })()}
        </Stack>
      )}
    </Stack>
  );
};
