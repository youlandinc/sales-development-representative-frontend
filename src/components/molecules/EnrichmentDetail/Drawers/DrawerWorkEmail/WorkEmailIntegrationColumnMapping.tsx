import { Stack, Typography } from '@mui/material';
import { FC } from 'react';
import { useShallow } from 'zustand/react/shallow';

import {
  WorkEmailCollapseCard,
  WorkEmailCustomSelect,
} from './index';

import { useWorkEmailStore } from '@/stores/enrichment';
import { IntegrationAction } from '@/types';

export const WorkEmailIntegrationColumnMapping: FC = () => {
  const { selectedIntegrationToConfig, setSelectedIntegrationToConfig } =
    useWorkEmailStore(
      useShallow((state) => ({
        selectedIntegrationToConfig: state.selectedIntegrationToConfig,
        setSelectedIntegrationToConfig: state.setSelectedIntegrationToConfig,
      })),
    );

  return (
    <WorkEmailCollapseCard title={'Column mapping'}>
      <Stack gap={2}>
        <Typography color={'text.secondary'} variant={'body3'}>
          SETUP INPUTS
        </Typography>
        {(selectedIntegrationToConfig?.inputParams || []).map((i, index) => (
          <WorkEmailCustomSelect
            key={i.columnName || index}
            onChange={(_, newValue) => {
              setSelectedIntegrationToConfig({
                ...selectedIntegrationToConfig!,
                inputParams: selectedIntegrationToConfig!.inputParams.map(
                  (p) =>
                    i.columnName === p.columnName
                      ? { ...p, selectedOption: newValue }
                      : p,
                ),
              } as IntegrationAction);
            }}
            required={i.isRequired}
            title={i.displayName}
            value={i.selectedOption}
          />
        ))}
      </Stack>
    </WorkEmailCollapseCard>
  );
};
