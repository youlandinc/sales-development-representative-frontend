import { FC, useEffect, useMemo } from 'react';
import { CircularProgress, Stack } from '@mui/material';
import { useParams } from 'next/navigation';
import { debounce } from 'lodash-es';

import { QueryBreadcrumbs } from './base';
import { getBizIdFromSlug } from './data';
import { CreateQueryElement } from './index';
import { TITLE_MAP } from '@/constants/directories';
import { DirectoriesQueryItem } from '@/types/Directories';
import { useDirectoriesStore } from '@/stores/directories';

export const DirectoriesIndustryQuery: FC = () => {
  const params = useParams();
  const industrySlug = params.industry as string;

  const bizId = getBizIdFromSlug(industrySlug);

  const {
    institutionType,
    buttonGroupConfig,
    queryConfig,
    formValues,
    loadingConfig,
    updateInstitutionType,
    updateFormValues,
    fetchResults,
    fetchDefaultViaBiz,
  } = useDirectoriesStore();

  useEffect(() => {
    if (queryConfig.length === 0 && !loadingConfig && bizId) {
      fetchDefaultViaBiz(bizId);
    }
  }, [bizId]);

  const debouncedFetchResults = useMemo(
    () => debounce(() => fetchResults(), 500),
    [fetchResults],
  );

  useEffect(() => {
    if (Object.keys(formValues).length > 0) {
      debouncedFetchResults();
    }

    return () => debouncedFetchResults.cancel();
  }, [formValues, debouncedFetchResults]);

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

    updateFormValues(key, value, groupPath);

    if (key === 'entityType') {
      debouncedFetchResults();
    }
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
