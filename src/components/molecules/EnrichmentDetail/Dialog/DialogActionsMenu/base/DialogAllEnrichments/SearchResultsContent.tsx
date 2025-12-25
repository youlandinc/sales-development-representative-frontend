import { FC } from 'react';
import { Stack, Typography } from '@mui/material';

import { ConfigActionsList } from './ConfigActionsList';
import { EnrichmentCategoryEnum } from '@/types/enrichment/drawerActions';
import { DisplayTypeEnum } from '@/types/enrichment/integrations';
import { TableColumnMenuActionEnum } from '@/types/enrichment/table';

interface SearchResultsContentProps {
  searchResults: any[];
  resetSearch: () => void;
  onClickToAiTemplate: (template: string) => void;
  setDialogAllEnrichmentsVisible: (visible: boolean) => void;
  openDialog: (action: TableColumnMenuActionEnum) => void;
  setDisplayType: (type: DisplayTypeEnum) => void;
  setSelectedIntegrationToConfig: (config: any) => void;
}

/**
 * 搜索结果内容组件
 * 用于显示搜索条件下的结果列表
 */
export const SearchResultsContent: FC<SearchResultsContentProps> = ({
  searchResults,
  resetSearch,
  onClickToAiTemplate,
  setDialogAllEnrichmentsVisible,
  openDialog,
  setDisplayType,
  setSelectedIntegrationToConfig,
}) => {
  return (
    <Stack sx={{ gap: 1.5, width: '100%' }}>
      <Stack
        alignItems={'center'}
        direction={'row'}
        justifyContent={'space-between'}
        mb={1.5}
      >
        <Typography variant={'subtitle1'} sx={{ fontWeight: 600 }}>
          {'搜索结果'}
        </Typography>
        <Typography
          color={'primary'}
          onClick={resetSearch}
          sx={{ cursor: 'pointer', fontWeight: 500 }}
          variant={'body2'}
        >
          {'返回分类浏览'}
        </Typography>
      </Stack>
      {searchResults.length > 0 ? (
        <Stack sx={{ maxHeight: '60vh', overflow: 'auto', pr: 1 }}>
          <ConfigActionsList
            configs={searchResults}
            onItemClick={(config) => {
              if (
                config.sourceCategory ===
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
      ) : (
        <Stack
          alignItems={'center'}
          justifyContent={'center'}
          sx={{ height: '50vh' }}
        >
          <Typography sx={{ color: '#6F6C7D' }} variant={'body2'}>
            {'未找到匹配的结果'}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};
