import { Stack, Typography } from '@mui/material';
import { FC } from 'react';
import { useShallow } from 'zustand/shallow';

import {
  DialogWorkEmailCollapseCard,
  DialogWorkEmailCustomSelect,
} from './index';

import { useWorkEmailStore } from '@/stores/enrichment';

export const DialogWorkEmailIntegrationColumnMapping: FC = () => {
  const {
    selectedIntegrationToConfig,
    allIntegrations,
    setSelectedIntegrationToConfig,
  } = useWorkEmailStore(
    useShallow((state) => ({
      selectedIntegrationToConfig: state.selectedIntegrationToConfig,
      setAllIntegrations: state.setAllIntegrations,
      allIntegrations: state.allIntegrations,
      setSelectedIntegrationToConfig: state.setSelectedIntegrationToConfig,
    })),
  );
  return (
    <DialogWorkEmailCollapseCard title={'Column mapping'}>
      <Stack gap={2}>
        <Typography color={'text.secondary'} variant={'body3'}>
          SETUP INPUTS
        </Typography>
        {(selectedIntegrationToConfig?.inputParams || []).map((i, key) => (
          <DialogWorkEmailCustomSelect
            key={key}
            onChange={(_, newValue) => {
              const updatedIntegration = {
                ...selectedIntegrationToConfig,
                inputParams: (
                  selectedIntegrationToConfig?.inputParams || []
                ).map((p) => {
                  if (i.columnName === p.columnName) {
                    return {
                      ...p,
                      selectedOption: newValue,
                    };
                  }
                  return p;
                }),
              } as any;
              console.log(updatedIntegration);
              setSelectedIntegrationToConfig(updatedIntegration);
            }}
            required={i.isRequired}
            title={i.displayName}
            value={i.selectedOption}
          />
        ))}
      </Stack>
    </DialogWorkEmailCollapseCard>
  );
};
