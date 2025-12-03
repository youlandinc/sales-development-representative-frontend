import { Stack, Typography } from '@mui/material';
import { FC } from 'react';

import {
  DialogWorkEmailCollapseCard,
  DialogWorkEmailCustomSelect,
} from './index';

import { useWorkEmailStore } from '@/stores/enrichment';

export const DialogWorkEmailIntegrationColumnMapping: FC = () => {
  const { selectedIntegrationToConfig, setAllIntegrations, allIntegrations } =
    useWorkEmailStore();

  return (
    <DialogWorkEmailCollapseCard title={'Column mapping'}>
      <Stack gap={2}>
        <Typography color={'text.secondary'} variant={'body3'}>
          SETUP INPUTS
        </Typography>
        {(
          allIntegrations.find(
            (i) => i.actionKey === selectedIntegrationToConfig?.actionKey,
          )?.inputParams || []
        ).map((i, key) => (
          <DialogWorkEmailCustomSelect
            key={key}
            onChange={(_, newValue) => {
              const updatedIntegrations = allIntegrations.map((item) => {
                if (item.actionKey === selectedIntegrationToConfig?.actionKey) {
                  return {
                    ...item,
                    inputParams: item.inputParams.map((p) => {
                      if (p.columnName === i.columnName) {
                        return {
                          ...p,
                          selectedOption: newValue,
                        };
                      }
                      return p;
                    }),
                  };
                }
                return item;
              });
              setAllIntegrations(updatedIntegrations);
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
