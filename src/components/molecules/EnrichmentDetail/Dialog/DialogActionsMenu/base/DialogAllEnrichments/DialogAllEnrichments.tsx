import { Icon, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import {
  FC,
  memo,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useShallow } from 'zustand/shallow';

import { StyledTextField } from '@/components/atoms';
import { StyledDialog } from '@/components/atoms/StyledDialog';
import { StyledActionItem } from '@/components/molecules/EnrichmentDetail/Dialog/Common';
import { StyledProviderBadges } from '../StyledProviderBadges';
import {
  MainCategoryTabs,
  SearchPart,
  SearchResultItem,
  VerticalTabsContent,
} from './index';

import { useDialogActionsMenu } from '@/components/molecules/EnrichmentDetail/Dialog/DialogActionsMenu/hooks';
import { useLocalSearch } from '@/hooks';
import { useActionsStore } from '@/stores/enrichment/useActionsStore';
import {
  IntegrationTypeEnum,
  useWorkEmailStore,
} from '@/stores/enrichment/useWorkEmailStore';
import { EnrichmentCategoryEnum } from '@/types/enrichment/drawerActions';
// 导入拆分的子组件
import { ActiveTypeEnum, useEnrichmentTableStore } from '@/stores/enrichment';

import ICON_SEARCH from '@/components/molecules/EnrichmentDetail/assets/dialog/DialogActionsMenu/icon_search.svg';
import ICON_CLOSE from '@/components/molecules/EnrichmentDetail/assets/dialog/icon_close.svg';
import {
  DisplayTypeEnum,
  IntegrationAction,
} from '@/types/enrichment/integrations';
import { TableColumnMenuActionEnum } from '@/types/enrichment/table';

/**
 * 弹窗属性接口
 */
export interface DialogAllEnrichments {
  open: boolean;
  onClose: () => void;
}

export const DialogAllEnrichments: FC<DialogAllEnrichments> = memo(
  ({ open, onClose }) => {
    const {
      dialogAllEnrichmentsData,
      dialogAllEnrichmentsTabKey,
      setDialogAllEnrichmentsTabKey,
      setDialogAllEnrichmentsVisible,
    } = useActionsStore(
      useShallow((store) => ({
        dialogAllEnrichmentsData: store.dialogAllEnrichmentsData,
        dialogAllEnrichmentsTabKey: store.dialogAllEnrichmentsTabKey,
        setDialogAllEnrichmentsTabKey: store.setDialogAllEnrichmentsTabKey,
        setDialogAllEnrichmentsVisible: store.setDialogAllEnrichmentsVisible,
      })),
    );
    const { onWorkEmailItemClick, onClickToAiTemplate } =
      useDialogActionsMenu();
    const {
      setDisplayType,
      setSelectedIntegrationToConfig,
      setActiveType,
      setIntegrationType,
    } = useWorkEmailStore(
      useShallow((state) => ({
        setDisplayType: state.setDisplayType,
        setSelectedIntegrationToConfig: state.setSelectedIntegrationToConfig,
        setActiveType: state.setActiveType,
        setIntegrationType: state.setIntegrationType,
      })),
    );
    const { openDialog } = useEnrichmentTableStore(
      useShallow((state) => ({
        openDialog: state.openDialog,
      })),
    );

    const handleConfigItemClick = useCallback(
      (config: IntegrationAction) => {
        setActiveType(ActiveTypeEnum.add);
        setDialogAllEnrichmentsVisible(false);
        if (
          dialogAllEnrichmentsTabKey ===
          EnrichmentCategoryEnum.atlas_task_library
        ) {
          const description = config.description ?? '';
          onClickToAiTemplate(`Name:${config.name},Description:${description}`);
          setIntegrationType(IntegrationTypeEnum.collectionIntegrated);
          setDisplayType(DisplayTypeEnum.main);
          return;
        }
        setIntegrationType(IntegrationTypeEnum.singleIntegrated);
        openDialog(TableColumnMenuActionEnum.work_email);
        setDisplayType(DisplayTypeEnum.integration);
        setSelectedIntegrationToConfig(config);
      },
      [
        dialogAllEnrichmentsTabKey,
        setIntegrationType,
        openDialog,
        setDisplayType,
        setSelectedIntegrationToConfig,
        setActiveType,
        setDialogAllEnrichmentsVisible,
        onClickToAiTemplate,
      ],
    );

    // 纵向标签页状态管理 - 默认空字符串会导致 MUI Tabs 错误
    const [taskTabKey, setTaskTabKey] = useState<string>('');
    const [integrationsTabKey, setIntegrationsTabKey] = useState<string>('');

    /**
     * 从动作对象获取Tab值（优先使用name，然后是key，最后使用索引）
     */
    const getActionTabValue = useCallback(
      (action: { name: string }) => action.name,
      [],
    );

    /**
     * 获取指定类别的第一个动作的值
     */
    const getFirstActionTabValue = useCallback(
      (category: EnrichmentCategoryEnum) => {
        const actions =
          dialogAllEnrichmentsData.find((item) => item.categoryKey === category)
            ?.actions ?? [];
        return actions.length ? getActionTabValue(actions[0]) : '';
      },
      [dialogAllEnrichmentsData, getActionTabValue],
    );

    /**
     * 设置垂直标签的初始值
     * 这个函数解决了"MUI: The value provided to the Tabs component is invalid"错误
     */
    const setInitialVerticalTabKey = useCallback(
      (category: EnrichmentCategoryEnum) => {
        const firstAction = getFirstActionTabValue(category);
        if (category === EnrichmentCategoryEnum.integrations) {
          setIntegrationsTabKey((prev) => prev || firstAction);
        }
        if (category === EnrichmentCategoryEnum.atlas_task_library) {
          setTaskTabKey((prev) => prev || firstAction);
        }
      },
      [getFirstActionTabValue],
    );

    useEffect(() => {
      setInitialVerticalTabKey(dialogAllEnrichmentsTabKey);
    }, [
      dialogAllEnrichmentsData,
      dialogAllEnrichmentsTabKey,
      setInitialVerticalTabKey,
    ]);

    /**
     * 主分类标签切换处理
     */
    const onTabChange = (
      _event: SyntheticEvent,
      value: EnrichmentCategoryEnum,
    ) => {
      setDialogAllEnrichmentsTabKey(value);
      setInitialVerticalTabKey(value);
    };

    // 创建用于搜索的扁平化waterfallConfig数据
    const allWaterfallConfigs = useMemo(() => {
      const result: SearchResultItem[] = [];
      dialogAllEnrichmentsData.forEach((category) => {
        category.actions?.forEach((action) => {
          if (category.categoryKey !== EnrichmentCategoryEnum.actions) {
            action.waterfallConfigs?.forEach((config) => {
              if (config.name && config.description) {
                result.push({
                  ...config,
                  sourceCategory: category.categoryKey,
                } as SearchResultItem);
              }
            });
            return;
          }
          result.push({
            ...action,
            sourceCategory: category.categoryKey,
          } as SearchResultItem);
        });
      });
      return result;
    }, [dialogAllEnrichmentsData]);

    // 使用本地搜索Hook - 保持原始顺序
    const {
      text: searchText,
      searchResults,
      hasSearchValue,
      resetSearch,
      onTextChange,
    } = useLocalSearch(allWaterfallConfigs, { preserveOriginalOrder: true });

    const searchAdornment = useMemo(
      () => (
        <Icon
          component={ICON_SEARCH}
          sx={{ width: 20, height: 20, mr: '4px ' }}
        />
      ),
      [],
    );
    const clearEndAdornment = useMemo(
      () => (
        <Icon
          className={'icon_clear'}
          component={ICON_CLOSE}
          onClick={resetSearch}
          sx={{ height: 16, width: 0, cursor: 'pointer' }}
        />
      ),
      [resetSearch],
    );

    // Header content
    const headerContent = (
      <Stack
        alignItems={'center'}
        flexDirection={'row'}
        justifyContent={'space-between'}
      >
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 600,
            lineHeight: 1.2,
            color: '#363440',
            fontFamily: 'Inter',
          }}
        >
          Enrichments
        </Typography>

        <Icon
          component={ICON_CLOSE}
          onClick={() => {
            onTextChange('');
            onClose?.();
          }}
          sx={{ width: 20, height: 20, color: '#363440', cursor: 'pointer' }}
        />
      </Stack>
    );

    // Main content
    const mainContent = (
      <Stack
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          width: '100%',
          flex: 1,
        }}
      >
        {/* Search Bar */}
        <StyledTextField
          onChange={(e) => {
            onTextChange(e.target.value);
          }}
          placeholder={'Search...'}
          size={'small'}
          slotProps={{
            input: {
              startAdornment: searchAdornment,
              endAdornment: clearEndAdornment,
            },
          }}
          sx={{
            '&:hover .icon_clear': {
              width: 20,
            },
          }}
          value={searchText}
        />
        {/* 主分类标签页 - 在非搜索状态下显示 */}
        {!hasSearchValue && (
          <MainCategoryTabs
            activeKey={dialogAllEnrichmentsTabKey}
            data={dialogAllEnrichmentsData}
            onTabChange={onTabChange}
          />
        )}

        {/* 内容区域 - 三种可能的内容：搜索结果、Actions标签内容、或垂直标签内容 */}

        {/* 1. 搜索结果显示区域 - 全屏显示，无左侧标签页 */}
        {hasSearchValue && (
          <SearchPart
            onClickToAiTemplate={onClickToAiTemplate}
            onConfigItemClick={handleConfigItemClick}
            onWorkEmailItemClick={onWorkEmailItemClick}
            openDialog={openDialog}
            searchResults={searchResults}
            setDialogAllEnrichmentsVisible={setDialogAllEnrichmentsVisible}
            setDisplayType={setDisplayType}
            setSelectedIntegrationToConfig={setSelectedIntegrationToConfig}
          />
        )}

        {/* 2. Actions标签内容 - 只在非搜索状态且是Actions标签时显示 */}
        {!hasSearchValue &&
          dialogAllEnrichmentsTabKey === EnrichmentCategoryEnum.actions && (
            <Stack sx={{ gap: 1.5, height: 574, overflow: 'auto' }}>
              {dialogAllEnrichmentsData
                .find(
                  (item) => item.categoryKey === EnrichmentCategoryEnum.actions,
                )
                ?.actions?.map((provider, providerIndex) => (
                  <StyledActionItem
                    badges={
                      ((provider?.waterfallConfigs || [])?.length ?? 0) > 0 ? (
                        <StyledProviderBadges
                          maxCount={3}
                          providers={(provider.waterfallConfigs ?? []).map(
                            (i) => i.logoUrl,
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
                      setDisplayType(DisplayTypeEnum.main);
                      onWorkEmailItemClick(provider.key ?? '');
                      setDialogAllEnrichmentsVisible(false);
                    }}
                    title={provider?.name ?? ''}
                  />
                ))}
            </Stack>
          )}

        {/* 3. 垂直标签内容 - 只在非搜索状态且不是Actions标签时显示 */}
        {!hasSearchValue &&
          dialogAllEnrichmentsTabKey !== EnrichmentCategoryEnum.actions && (
            <VerticalTabsContent
              dialogAllEnrichmentsData={dialogAllEnrichmentsData}
              dialogAllEnrichmentsTabKey={dialogAllEnrichmentsTabKey}
              getActionTabValue={getActionTabValue}
              handleConfigItemClick={handleConfigItemClick}
              integrationsTabKey={integrationsTabKey}
              setIntegrationsTabKey={setIntegrationsTabKey}
              setTaskTabKey={setTaskTabKey}
              taskTabKey={taskTabKey}
            />
          )}
      </Stack>
    );

    return (
      <StyledDialog
        content={mainContent}
        contentSx={{
          px: 3,
          pt: 0,
          pb: 3,
          minHeight: 0,
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
        }}
        header={headerContent}
        headerSx={{
          px: 3,
          pt: 3,
          pb: 1.5,
        }}
        onClose={() => {
          onTextChange('');
          onClose?.();
        }}
        open={open}
        paperWidth={800}
        slotProps={{
          paper: {
            sx: {
              overflow: 'hidden',
            },
          },
        }}
      />
    );
  },
);
