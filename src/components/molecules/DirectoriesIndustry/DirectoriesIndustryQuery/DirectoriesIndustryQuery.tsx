import { FC } from 'react';
import { CircularProgress, Stack } from '@mui/material';
import { useParams } from 'next/navigation';

import { QueryBreadcrumbs } from './base';
import { getBizIdFromSlug } from './data';
import { CreateQueryElement } from './index';
import { TITLE_MAP } from '@/constants/directories';
import { DirectoriesQueryItem } from '@/types/Directories';
import { useDirectoriesDataFlow } from '@/hooks';
import { useDirectoriesStore } from '@/stores/directories';

export const DirectoriesIndustryQuery: FC = () => {
  const params = useParams();
  const industrySlug = params.industry as string;

  const bizId = getBizIdFromSlug(industrySlug);

  // ✅ 使用新的 RxJS 数据流 Hook（自动处理 debounce + 请求）
  const {
    formValues,
    queryConfig,
    institutionType,
    loadingConfig,
    loadingAdditional,
    updateFormValues,
    additionalDetails, // B: Additional details（预留）
    finalData, // C: 最终数据（预留）
  } = useDirectoriesDataFlow(bizId);

  console.log(finalData);

  // 保留 institutionType 更新逻辑（不走 RxJS）
  const { buttonGroupConfig, updateInstitutionType } = useDirectoriesStore();

  const onFormChange = (
    key: string | undefined | null,
    value: any,
    groupPath?: string,
  ) => {
    if (!key) {
      return;
    }

    if (key === 'institutionType') {
      updateInstitutionType(value);
      return;
    }

    // ✅ 自动触发 RxJS 流程（debounce + 请求 additionalDetails）
    updateFormValues(key, value, groupPath);
  };

  if (!buttonGroupConfig && !loadingConfig) {
    return (
      <Stack
        sx={{
          width: 420,
          gap: 3,
          p: 3,
          height: 'auto',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 400,
        }}
      >
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Stack
      sx={{
        width: 420,
        gap: 1.5,
        p: 3,
        height: 'auto',
        overflowY: 'auto',
      }}
    >
      <QueryBreadcrumbs current={TITLE_MAP[industrySlug] || 'Directory'} />

      {buttonGroupConfig && (
        <CreateQueryElement
          config={buttonGroupConfig}
          disabledLoading={loadingConfig}
          disabledPermission={false}
          formData={{ institutionType }}
          key="institutionType-button-group"
          onFormChange={onFormChange}
        />
      )}

      {queryConfig.map((config: DirectoriesQueryItem) => (
        <CreateQueryElement
          config={config}
          disabledLoading={loadingConfig}
          disabledPermission={false}
          formData={{ institutionType, ...formValues }}
          key={config.key || config.label || ''}
          onFormChange={onFormChange}
        />
      ))}
    </Stack>
  );
};
