import { FC } from 'react';
import { CircularProgress, Stack } from '@mui/material';
import { useParams } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';

import {
  HIERARCHICAL_CONFIG_BIZ_IDS,
  TITLE_MAP,
} from '@/constants/directories';
import { useDirectoriesStore } from '@/stores/directories';
import { getDirectoriesBizId } from '@/utils/directories';
import { DirectoriesQueryItem } from '@/types/directories';

import { QueryBreadcrumbs } from './base';
import { CreateQueryElement, DirectoriesIndustryQueryFooter } from './index';

export const DirectoriesIndustryQuery: FC = () => {
  const params = useParams();
  const industrySlug = params.industry as string;
  const bizId = getDirectoriesBizId(industrySlug);

  const {
    formValues,
    queryConfig,
    institutionType,
    isLoadingConfig,
    buttonGroupConfig,
    updateFormValues,
    updateInstitutionType,
  } = useDirectoriesStore(
    useShallow((state) => ({
      formValues: state.formValues,
      queryConfig: state.queryConfig,
      institutionType: state.institutionType,
      isLoadingConfig: state.isLoadingConfig,
      buttonGroupConfig: state.buttonGroupConfig,
      updateFormValues: state.updateFormValues,
      updateInstitutionType: state.updateInstitutionType,
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

  if (isLoadingConfig) {
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
        <CircularProgress
          enableTrackSlot
          size="36px"
          sx={{
            color: '#D0CEDA',
            '& .MuiCircularProgress-track': { stroke: '#F0F0F4' },
          }}
        />
      </Stack>
    );
  }

  // Hierarchical config must have buttonGroupConfig
  if (HIERARCHICAL_CONFIG_BIZ_IDS.includes(bizId) && !buttonGroupConfig) {
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
          color: 'text.secondary',
          fontSize: 12,
        }}
      >
        Configuration not available
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

        {/*<QueryDateSelectRange />*/}

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

      <DirectoriesIndustryQueryFooter />
    </Stack>
  );
};
