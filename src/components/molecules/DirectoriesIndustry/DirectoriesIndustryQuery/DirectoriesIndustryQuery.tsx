import { FC, useState } from 'react';
import { CircularProgress, Stack } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';

import { QueryBreadcrumbs } from './base';
import { CreateQueryElement } from './index';
import { TITLE_MAP } from '@/constants/directories';
import { DirectoriesQueryItem } from '@/types/directories';
import { useDirectoriesStore } from '@/stores/directories';
import { useShallow } from 'zustand/react/shallow';
import { StyledButton } from '@/components/atoms';

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
    if (isImporting) {
      return;
    }

    try {
      setIsImporting(true);
      // TODO: 调用导入 API
      // await importAPI(lastSearchParams);
      // router.push('/leads'); // 跳转到 table 页面
    } catch (error) {
      console.error('Import failed:', error);
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
