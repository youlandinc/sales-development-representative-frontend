import { Icon, Stack, Typography } from '@mui/material';
import { FC } from 'react';
import Image from 'next/image';

import {
  DialogWorkEmailCollapseCard,
  DialogWorkEmailCustomSelect,
} from './index';
import { useComputedInWorkEmailStore } from './hooks';

import ICON_SUCCESS from '@/components/molecules/ProspectDetail/assets/dialog/icon_success.svg';
import ICON_VALIDATE from '@/components/molecules/ProspectDetail/assets/dialog/dialogWorkEmail/icon_validate_false.svg';
import { useWorkEmailStore } from '@/stores/Prospect';

export const DialogWorkEmailQuickSetupInputs: FC<{ title?: string }> = ({
  title = 'Inputs',
}) => {
  const { waterfallAllInputs, integrationsInWaterfall, isMissingConfig } =
    useComputedInWorkEmailStore();
  const { setAllIntegrations, allIntegrations } = useWorkEmailStore();
  const hasConfigCount = integrationsInWaterfall.filter((item) =>
    item.inputParams.every((p) => !!p.selectedOption),
  ).length;

  if (integrationsInWaterfall.length === 0) {
    return null;
  }

  return (
    <DialogWorkEmailCollapseCard title={title}>
      <Stack gap={1.5}>
        <Typography variant={'body3'}>
          We automatically try to map the correct columns for you. If any inputs
          are empty, just select the columns you want to map. Once all inputs
          are filled, you&apos;re ready to save and run!
        </Typography>
        <Stack gap={1}>
          <Typography variant={'subtitle3'}>
            Actions configured ({hasConfigCount}/
            {integrationsInWaterfall.length}) *
          </Typography>
          <Stack flexDirection={'row'} gap={0.5}>
            {integrationsInWaterfall.map((item) => (
              <Image
                alt={item.integrationName}
                height={18}
                key={item.actionKey}
                src={item.logoUrl}
                width={18}
              />
            ))}
          </Stack>
          {isMissingConfig && (
            <Stack alignItems={'center'} flexDirection={'row'} gap={0.5}>
              <Icon component={ICON_VALIDATE} sx={{ width: 18, height: 18 }} />
              <Typography color={'#6F6C7D'} variant={'body3'}>
                Please configure all of the actions
              </Typography>
            </Stack>
          )}
          {hasConfigCount === integrationsInWaterfall.length &&
            hasConfigCount > 0 && (
              <Stack alignItems={'center'} flexDirection={'row'} gap={0.5}>
                <Icon component={ICON_SUCCESS} sx={{ width: 18, height: 18 }} />
                <Typography color={'#6F6C7D'} variant={'body3'}>
                  You&apos;re ready to run the waterfall
                </Typography>
              </Stack>
            )}
        </Stack>
        {waterfallAllInputs.map((input, key) => (
          <DialogWorkEmailCustomSelect
            key={key}
            onChange={(_, newValue) => {
              const updatedIntegrations = allIntegrations.map((item) => {
                return {
                  ...item,
                  inputParams: item.inputParams.map((p) => {
                    if (p.semanticType === input.semanticType) {
                      return {
                        ...p,
                        selectedOption: newValue,
                      };
                    }
                    return p;
                  }),
                };
              });
              setAllIntegrations(updatedIntegrations);
            }}
            required={input.isRequired}
            title={input.displayName}
            value={input.selectedOption}
          />
        ))}
      </Stack>
    </DialogWorkEmailCollapseCard>
  );
};
