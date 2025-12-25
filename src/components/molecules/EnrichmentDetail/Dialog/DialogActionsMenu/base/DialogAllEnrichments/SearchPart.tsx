import { FC } from 'react';
import { Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { StyledActionItem } from '@/components/molecules/EnrichmentDetail/Dialog/Common';
import { StyledProviderBadges } from '../StyledProviderBadges';
import { EnrichmentCategoryEnum } from '@/types/enrichment/drawerActions';
import { DisplayTypeEnum } from '@/types/enrichment/integrations';
import { TableColumnMenuActionEnum } from '@/types/enrichment/table';
import { ConfigItem } from './index';

// 定义搜索结果的基础类型
interface BaseSearchItem {
  name: string;
  description: string;
  logoUrl?: string;
  sourceCategory: EnrichmentCategoryEnum;
}

// 配置类型的搜索结果
type ConfigSearchItem = BaseSearchItem;

// 动作类型的搜索结果
interface ActionSearchItem extends BaseSearchItem {
  key?: string;
  waterfallConfigs?: Array<{ logoUrl: string }>;
}

// 搜索结果联合类型
export type SearchResultItem = ConfigSearchItem | ActionSearchItem;

// 类型保护函数，用于区分不同类型的搜索结果
export const isActionItem = (
  item: SearchResultItem,
): item is ActionSearchItem => {
  return item.sourceCategory === EnrichmentCategoryEnum.actions;
};

interface SearchPartProps {
  searchResults: SearchResultItem[];
  onWorkEmailItemClick: (key: string) => void;
  onClickToAiTemplate: (template: string) => void;
  setDialogAllEnrichmentsVisible: (visible: boolean) => void;
  openDialog: (action: TableColumnMenuActionEnum) => void;
  setDisplayType: (type: DisplayTypeEnum) => void;
  setSelectedIntegrationToConfig: (config: any) => void;
}

/**
 * 搜索结果渲染组件
 */
export const SearchPart: FC<SearchPartProps> = ({
  searchResults,
  onWorkEmailItemClick,
  onClickToAiTemplate,
  setDialogAllEnrichmentsVisible,
  openDialog,
  setDisplayType,
  setSelectedIntegrationToConfig,
}) => {
  if (searchResults.length === 0) {
    return (
      <Stack
        alignItems={'center'}
        justifyContent={'center'}
        sx={{ height: '50vh' }}
      >
        <Typography sx={{ color: '#6F6C7D' }} variant={'body2'}>
          {'未找到匹配的结果'}
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={1.5} width={'100%'}>
      {searchResults.map((result, index) => {
        // 处理动作类型的搜索结果
        if (isActionItem(result)) {
          return (
            <StyledActionItem
              badges={
                ((result?.waterfallConfigs || [])?.length ?? 0) > 0 ? (
                  <StyledProviderBadges
                    maxCount={3}
                    providers={(result.waterfallConfigs ?? []).map(
                      (i) => i.logoUrl,
                    )}
                  />
                ) : undefined
              }
              description={result?.description ?? ''}
              icon={
                result?.logoUrl ? (
                  <Image
                    alt={'Provider'}
                    height={16}
                    src={result?.logoUrl ?? ''}
                    width={16}
                  />
                ) : undefined
              }
              key={`action-${result.name ?? index}`}
              onClick={() => {
                onWorkEmailItemClick(result.key ?? '');
                setDialogAllEnrichmentsVisible(false);
              }}
              title={result?.name ?? ''}
            />
          );
        }

        // 处理配置类型的搜索结果
        return (
          <StyledActionItem
            description={result?.description ?? ''}
            icon={
              result?.logoUrl ? (
                <Image
                  alt={'Provider'}
                  height={16}
                  src={result?.logoUrl}
                  width={16}
                />
              ) : undefined
            }
            key={`config${result?.name}-${index}`}
            onClick={() => {
              if (
                result.sourceCategory ===
                EnrichmentCategoryEnum.atlas_task_library
              ) {
                const description = result.description ?? '';
                onClickToAiTemplate(
                  `Name:${result.name},Description:${description}`,
                );
                setDialogAllEnrichmentsVisible(false);
                return;
              }
              openDialog(TableColumnMenuActionEnum.work_email);
              setDisplayType(DisplayTypeEnum.integration);
              // 使用类型断言处理类型兼容性问题
              setSelectedIntegrationToConfig(result as unknown as ConfigItem);
              setDialogAllEnrichmentsVisible(false);
            }}
            title={result?.name ?? ''}
          />
        );
      })}
    </Stack>
  );
};
