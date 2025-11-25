import { FC } from 'react';
import { CircularProgress, Stack } from '@mui/material';
import { useParams } from 'next/navigation';

import { QueryBreadcrumbs } from './base';
import { CreateQueryElement } from './index';
import { TITLE_MAP } from '@/constants/directories';
import { DirectoriesQueryItem } from '@/types/directories';
import { useDirectoriesStore } from '@/stores/directories';

export const DirectoriesIndustryQuery: FC = () => {
  const params = useParams();
  const industrySlug = params.industry as string;

  // 直接从 store 读取状态
  const formValues = useDirectoriesStore((state) => state.formValues);
  const queryConfig = useDirectoriesStore((state) => state.queryConfig);
  const institutionType = useDirectoriesStore((state) => state.institutionType);
  const isLoadingConfig = useDirectoriesStore((state) => state.isLoadingConfig);
  const buttonGroupConfig = useDirectoriesStore(
    (state) => state.buttonGroupConfig,
  );
  const updateFormValues = useDirectoriesStore(
    (state) => state.updateFormValues,
  );
  const updateInstitutionType = useDirectoriesStore(
    (state) => state.updateInstitutionType,
  );

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

  if (!buttonGroupConfig && !isLoadingConfig) {
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
          disabledLoading={isLoadingConfig}
          formData={{ institutionType }}
          key="institutionType-button-group"
          onFormChange={onFormChange}
        />
      )}

      {queryConfig.map((config: DirectoriesQueryItem) => (
        <CreateQueryElement
          config={config}
          disabledLoading={isLoadingConfig}
          formData={{ institutionType, ...formValues }}
          key={config.key || config.label || ''}
          onFormChange={onFormChange}
        />
      ))}
    </Stack>
  );
};
