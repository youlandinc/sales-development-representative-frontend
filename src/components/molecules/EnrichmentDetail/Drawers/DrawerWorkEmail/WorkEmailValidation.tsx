import {
  Box,
  IconButton,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { FC } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { StyledCost, StyledSelect, StyledSwitch } from '@/components/atoms';
import { WorkEmailCollapseCard } from './index';

import { useWorkEmailStore } from '@/stores/enrichment/useWorkEmailStore';
import { IntegrationActionValidation } from '@/types/enrichment/integrations';

import { DrawersIconConfig } from '../DrawersIconConfig';

const WARNING_ICON_SX = {
  width: 12,
  height: 12,
  transform: 'rotate(180deg)',
  '& path': { fill: '#363440' },
  cursor: 'help',
} as const;

interface ValidationProviderLabelProps {
  option: IntegrationActionValidation;
}

const ValidationProviderLabel: FC<ValidationProviderLabelProps> = ({
  option,
}) => (
  <Stack alignItems={'center'} flexDirection={'row'} fontSize={12} gap={0.5}>
    <Image alt={option.name} height={18} src={option.logoUrl} width={18} />
    {option.name}
  </Stack>
);

interface ToggleRowProps {
  label: string;
  tooltip: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  optionalText?: string;
}

const ToggleRow: FC<ToggleRowProps> = ({
  label,
  tooltip,
  checked,
  onChange,
  optionalText,
}) => (
  <Stack
    alignItems={'center'}
    flexDirection={'row'}
    justifyContent={'space-between'}
  >
    <Stack alignItems={'center'} flexDirection={'row'} gap={0.5}>
      <Typography fontWeight={600} lineHeight={1.5} variant={'body3'}>
        {label}
        {optionalText && (
          <Box color={'text.secondary'} component={'span'}>
            {' '}
            {optionalText}
          </Box>
        )}
      </Typography>
      <Tooltip arrow placement={'top'} title={tooltip}>
        <DrawersIconConfig.Warning size={12} sx={WARNING_ICON_SX} />
      </Tooltip>
    </Stack>
    <StyledSwitch
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      size={'small'}
    />
  </Stack>
);

export const WorkEmailValidation: FC = () => {
  const {
    validationOptions,
    selectedValidationOption,
    setSelectedValidationOption,
    setSafeToSend,
    setRequireValidationSuccess,
    safeToSend,
    requireValidationSuccess,
  } = useWorkEmailStore(
    useShallow((state) => ({
      validationOptions: state.validationOptions,
      selectedValidationOption: state.selectedValidationOption,
      setSelectedValidationOption: state.setSelectedValidationOption,
      setSafeToSend: state.setSafeToSend,
      setRequireValidationSuccess: state.setRequireValidationSuccess,
      safeToSend: state.safeToSend,
      requireValidationSuccess: state.requireValidationSuccess,
    })),
  );

  const onClickToRemoveProvider = () => {
    setSelectedValidationOption(null);
  };

  return (
    <WorkEmailCollapseCard title={'Validation'}>
      <Stack gap={1.5}>
        {/* Validation provider label */}
        <Typography variant={'body2'}>
          <Box component={'span'} fontWeight={600}>
            Validation provider
          </Box>
          <Box
            color={'text.secondary'}
            component={'span'}
            fontWeight={400}
            ml={0.5}
          >
            - Optional
          </Box>
        </Typography>

        {/* Provider selector with cost and settings */}
        <Stack gap={0.5}>
          <Stack alignItems={'center'} flexDirection={'row'} gap={1.5}>
            <StyledSelect
              fullWidth
              menuPaperSx={{
                p: 1.5,
              }}
              onChange={(e) => {
                setSelectedValidationOption(e.target.value as string);
              }}
              options={(validationOptions || []) as any}
              renderOption={(option: any) => {
                return (
                  <MenuItem
                    key={option.actionKey}
                    sx={{
                      px: '4px !important',
                      py: '4px !important',
                      gap: 1,
                      borderRadius: 1,
                    }}
                    value={option.actionKey}
                  >
                    <ValidationProviderLabel option={option} />
                  </MenuItem>
                );
              }}
              renderValue={(option: any) => {
                const selectedOption = validationOptions?.find(
                  (o) => o.actionKey === option,
                );
                if (selectedOption) {
                  return (
                    <Stack
                      alignItems={'center'}
                      flexDirection={'row'}
                      justifyContent={'space-between'}
                    >
                      <ValidationProviderLabel option={selectedOption} />
                      <StyledCost
                        border={'1px solid #DFDEE6'}
                        borderRadius={2}
                        count={selectedOption.score}
                        // height={24}
                        py={'3px'}
                        textColor={'text.secondary'}
                        textLineHeight={1}
                      />
                    </Stack>
                  );
                }
                return (
                  <Typography
                    color={'text.secondary'}
                    sx={{ opacity: 0.5, lineHeight: '24px' }}
                    variant={'body2'}
                  >
                    Select a provider
                  </Typography>
                );
              }}
              sx={{
                '& .MuiSelect-outlined': {
                  py: '8px',
                },
              }}
              sxList={{ gap: 1.25, flexDirection: 'column', display: 'flex' }}
              value={selectedValidationOption || ''}
            />

            {/* Settings gear icon */}
            <Tooltip arrow placement={'top'} title={'Remove provider'}>
              <Box>
                <IconButton
                  disabled={!selectedValidationOption}
                  onClick={onClickToRemoveProvider}
                  sx={{ p: 0 }}
                >
                  <DrawersIconConfig.Delete
                    size={18}
                    sx={{
                      '& path': {
                        fill: !selectedValidationOption ? '#BABCBE' : '#E26E6E',
                      },
                      '&:hover': {
                        opacity: 0.7,
                      },
                    }}
                  />
                </IconButton>
              </Box>
            </Tooltip>
          </Stack>

          {/* Helper text */}
          <Typography color={'text.secondary'} variant={'body3'}>
            A validation column will be added after each provider
          </Typography>
        </Stack>

        {/* Require validation success toggle */}
        {selectedValidationOption?.includes('leadmagic') && (
          <ToggleRow
            checked={safeToSend}
            label={'Only mark "Safe to Send" emails as valid?'}
            onChange={setSafeToSend}
            optionalText={'- Optional'}
            tooltip={
              'By default, catch-all emails will be returned as valid. Turn this setting on to mark catch-all emails as invalid. Only "Safe to Send" emails will be marked as valid.'
            }
          />
        )}
        <ToggleRow
          checked={requireValidationSuccess}
          label={'Require validation success?'}
          onChange={setRequireValidationSuccess}
          tooltip={
            'By default, the waterfall will return data even if there is an error with validation.'
          }
        />
      </Stack>
    </WorkEmailCollapseCard>
  );
};
