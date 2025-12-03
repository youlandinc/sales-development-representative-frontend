import { Box, Icon, Stack, Tooltip, Typography } from '@mui/material';
import Image from 'next/image';
import { FC, useCallback } from 'react';

import {
  DialogWorkEmailCollapseCard,
  DialogWorkEmailCustomSelect,
} from './index';

import { useWorkEmailStore } from '@/stores/enrichment';
import { useComputedInWorkEmailStore } from './hooks';

import ICON_CHECK_CIRCLE from '@/components/molecules/EnrichmentDetail/assets/dialog/dialogWorkEmail/icon_check_circle.svg';
import ICON_CHECK_SQUARE_OUTLINE from '@/components/molecules/EnrichmentDetail/assets/dialog/dialogWorkEmail/icon_check_square_outline.svg';
import ICON_NO_CHECK_SQUARE_OUTLINE from '@/components/molecules/EnrichmentDetail/assets/dialog/dialogWorkEmail/icon_no_check_square_outline.svg';
import ICON_VALIDATE from '@/components/molecules/EnrichmentDetail/assets/dialog/dialogWorkEmail/icon_validate_false.svg';
import ICON_SUCCESS from '@/components/molecules/EnrichmentDetail/assets/dialog/icon_success.svg';
import { IntegrationActionInputParams } from '@/types';

export const DialogWorkEmailQuickSetupInputs: FC<{ title?: string }> = ({
  title = 'Inputs',
}) => {
  const {
    waterfallAllInputs,
    integrationsInWaterfall,
    isMissingConfig,
    hasConfigCount,
  } = useComputedInWorkEmailStore();
  const { setAllIntegrations, allIntegrations } = useWorkEmailStore();

  const handleInputChange = useCallback(
    (newValue: TOption | null, input: IntegrationActionInputParams) => {
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
    },
    [setAllIntegrations, allIntegrations],
  );

  if (integrationsInWaterfall.length === 0) {
    return null;
  }

  return (
    <DialogWorkEmailCollapseCard title={title}>
      <Stack gap={2}>
        <Typography variant={'body3'}>
          We automatically try to map the correct columns for you. If any inputs
          are empty, just select the columns you want to map. Once all inputs
          are filled, you&apos;re ready to save and run!
        </Typography>
        <Stack gap={1}>
          <Typography variant={'subtitle3'}>
            Actions configured ({hasConfigCount}/
            {integrationsInWaterfall.length}){' '}
            <Box color={'error.main'} component={'span'}>
              *
            </Box>
          </Typography>
          <Stack flexDirection={'row'} gap={0.5}>
            {integrationsInWaterfall.map((item) => (
              <Tooltip
                key={item.actionKey}
                placement={'bottom-start'}
                slotProps={{
                  tooltip: {
                    sx: {
                      bgcolor: '#FFF',
                      p: 0,
                    },
                  },
                }}
                title={
                  <Stack
                    border={'1px solid #D0CEDA'}
                    borderRadius={2}
                    gap={1.25}
                    p={1.5}
                  >
                    <Typography
                      color={'text.primary'}
                      fontWeight={600}
                      variant={'body2'}
                    >
                      {item.integrationName}
                    </Typography>
                    <Stack
                      bgcolor={
                        item.isMissingRequired ? 'transparent' : '#F0FEF4'
                      }
                      border={
                        item.isMissingRequired
                          ? '1px solid #DFDEE6'
                          : '1px solid rgba(54, 155, 124, 0.10)'
                      }
                      borderRadius={2}
                      gap={1.5}
                      p={1.5}
                      position={'relative'}
                    >
                      {item.inputParams.map((i, index) => (
                        <Stack
                          alignItems={'center'}
                          flexDirection={'row'}
                          gap={1}
                          key={index}
                        >
                          <Icon
                            component={
                              i.selectedOption
                                ? ICON_CHECK_SQUARE_OUTLINE
                                : ICON_NO_CHECK_SQUARE_OUTLINE
                            }
                            sx={{
                              width: 16,
                              height: 16,
                              '& path': {
                                fill: item.isMissingRequired
                                  ? '#6F6C7D'
                                  : '#369B7C',
                              },
                            }}
                          />
                          <Typography
                            color={
                              item.isMissingRequired
                                ? 'text.primary'
                                : '#369B7C'
                            }
                            variant={'body2'}
                          >
                            {i.displayName}
                          </Typography>
                        </Stack>
                      ))}
                      <Icon
                        component={ICON_CHECK_CIRCLE}
                        sx={{
                          width: 16,
                          height: 16,
                          position: 'absolute',
                          right: '-4px',
                          top: '-8px',
                          opacity: item.isMissingRequired ? 0 : 1,
                        }}
                      />
                    </Stack>
                  </Stack>
                }
              >
                <Image
                  alt={item.integrationName}
                  height={18}
                  key={item.actionKey}
                  src={item.logoUrl}
                  style={{
                    opacity: item.isMissingRequired ? 0.33 : 1,
                    mixBlendMode: item.isMissingRequired
                      ? ('luminosity' as const)
                      : ('normal' as const),
                  }}
                  width={18}
                />
              </Tooltip>
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
              handleInputChange(newValue, input);
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
