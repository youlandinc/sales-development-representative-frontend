import { FC, useState } from 'react';
import { CircularProgress, Stack } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';

import { TITLE_MAP } from '@/constants/directories';
import { useDirectoriesStore } from '@/stores/directories';
import { buildSearchRequestParams } from '@/utils/directories';
import { _importDirectoriesDataToTable } from '@/request/directories';
import { DirectoriesQueryItem } from '@/types/directories';

import { QueryBreadcrumbs } from './base';
import { CreateQueryElement } from './index';
import { SDRToast, StyledButton } from '@/components/atoms';
import { HttpError } from '@/types';

export const DirectoriesIndustryQuery: FC = () => {
  const router = useRouter();
  const params = useParams();
  const industrySlug = params.industry as string;

  const [isImporting, setIsImporting] = useState(false);

  const {
    formValues,
    queryConfig,
    institutionType,
    isLoadingConfig,
    buttonGroupConfig,
    updateFormValues,
    updateInstitutionType,
    isLoadingPreview,
    hasSubmittedSearch,
    previewBody,
    lastSearchParams,
  } = useDirectoriesStore(
    useShallow((state) => ({
      formValues: state.formValues,
      queryConfig: state.queryConfig,
      institutionType: state.institutionType,
      isLoadingConfig: state.isLoadingConfig,
      buttonGroupConfig: state.buttonGroupConfig,
      updateFormValues: state.updateFormValues,
      updateInstitutionType: state.updateInstitutionType,
      isLoadingPreview: state.isLoadingPreview,
      hasSubmittedSearch: state.hasSubmittedSearch,
      previewBody: state.previewBody,
      lastSearchParams: state.lastSearchParams,
    })),
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

    updateFormValues(key, value, groupPath);
  };

  const onContinueToImport = async () => {
    if (isImporting || !lastSearchParams) {
      return;
    }

    try {
      setIsImporting(true);

      const requestParams = buildSearchRequestParams(lastSearchParams);
      const { data } = await _importDirectoriesDataToTable(requestParams);

      if (data.tableId) {
        router.push(`/prospect-enrich/${data.tableId}`);
      }

      // TODO: access not enough show dialog
    } catch (err) {
      const { message, header, variant } = err as HttpError;
      SDRToast({ message, header, variant });
    } finally {
      setIsImporting(false);
    }
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
        height: '100%',
        flexShrink: 0,
      }}
    >
      <Stack
        sx={{
          flex: 1,
          gap: 1.5,
          p: 3,
          pb: 3,
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

      <Stack
        sx={{
          px: 3,
          py: 1.5,
          borderTop: '1px solid #DFDEE6',
          alignItems: 'flex-end',
        }}
      >
        <StyledButton
          disabled={
            isImporting ||
            isLoadingConfig ||
            isLoadingPreview ||
            !hasSubmittedSearch ||
            previewBody.findCount === 0
          }
          loading={isImporting}
          onClick={onContinueToImport}
          size={'medium'}
        >
          Continue
        </StyledButton>
      </Stack>
    </Stack>
  );
};
