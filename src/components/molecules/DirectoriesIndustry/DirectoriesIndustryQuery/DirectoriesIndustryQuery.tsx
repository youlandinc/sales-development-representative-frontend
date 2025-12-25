import { FC } from 'react';
import { CircularProgress, Stack } from '@mui/material';
import { useParams } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';

import { TITLE_MAP } from '@/constants/directories';
import { useDirectoriesStore } from '@/stores/directories';
import { DirectoriesQueryItem } from '@/types/directories';

import { QueryBreadcrumbs } from './base';
import { CreateQueryElement, DirectoriesIndustryQueryFooter } from './index';

export const DirectoriesIndustryQuery: FC = () => {
  const params = useParams();
  const industrySlug = params.industry as string;

  const {
    formValues,
    queryConfig,
    buttonGroupKey,
    buttonGroupValue,
    isLoadingConfig,
    buttonGroupConfig,
    updateFormValues,
    updateButtonGroupValue,
  } = useDirectoriesStore(
    useShallow((state) => ({
      formValues: state.formValues,
      queryConfig: state.queryConfig,
      buttonGroupKey: state.buttonGroupKey,
      buttonGroupValue: state.buttonGroupValue,
      isLoadingConfig: state.isLoadingConfig,
      buttonGroupConfig: state.buttonGroupConfig,
      updateFormValues: state.updateFormValues,
      updateButtonGroupValue: state.updateButtonGroupValue,
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

    // Handle buttonGroup key change (e.g., 'institutionType')
    if (buttonGroupKey && key === buttonGroupKey) {
      updateButtonGroupValue(value);
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

  // Hierarchical config (has BUTTON_GROUP) must have buttonGroupConfig
  // This check handles config loading failure for hierarchical configs
  if (buttonGroupConfig === null && queryConfig.length === 0) {
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

        {buttonGroupConfig && buttonGroupKey && (
          <CreateQueryElement
            config={buttonGroupConfig}
            disabledLoading={isLoadingConfig}
            formData={{ [buttonGroupKey]: buttonGroupValue }}
            key={`${buttonGroupKey}-button-group`}
            onFormChange={onFormChange}
          />
        )}

        {queryConfig.map((config: DirectoriesQueryItem) => (
          <CreateQueryElement
            config={config}
            disabledLoading={isLoadingConfig}
            formData={
              buttonGroupKey
                ? { [buttonGroupKey]: buttonGroupValue, ...formValues }
                : formValues
            }
            key={config.key || config.label || ''}
            onFormChange={onFormChange}
          />
        ))}
      </Stack>

      <DirectoriesIndustryQueryFooter />
    </Stack>
  );
};
