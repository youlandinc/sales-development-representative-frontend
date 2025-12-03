import {
  Box,
  Icon,
  MenuItem,
  Popover,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import type { MouseEvent } from 'react';
import { FC, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { StyledCost, StyledSelect, StyledSwitch } from '@/components/atoms';
import { DialogWorkEmailCollapseCard } from './index';

import { useWorkEmailStore } from '@/stores/enrichment/useWorkEmailStore';
import { IntegrationActionValidation } from '@/types/enrichment/integrations';

import ICON_GEAR from '@/components/molecules/EnrichmentDetail/assets/dialog/dialogWorkEmail/icon_gear.svg';
import ICON_DELETE from '@/components/molecules/EnrichmentDetail/assets/dialog/icon_delete.svg';
import ICON_WARNING from '@/components/molecules/EnrichmentDetail/assets/dialog/icon_warning.svg';

const WARNING_ICON_SX = {
  width: 12,
  height: 12,
  transform: 'rotate(180deg)',
  '& path': { fill: '#363440' },
  cursor: 'help',
} as const;

const DELETE_ICON_SX = {
  width: 20,
  height: 20,
  '& path': { fill: '#E26E6E' },
} as const;

interface ValidationProviderLabelProps {
  option: IntegrationActionValidation;
}

const ValidationProviderLabel: FC<ValidationProviderLabelProps> = ({
  option,
}) => (
  <Stack alignItems="center" flexDirection="row" fontSize={12} gap={0.5}>
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
  <Stack alignItems="center" flexDirection="row" justifyContent="space-between">
    <Stack alignItems="center" flexDirection="row" gap={0.5}>
      <Typography fontWeight={600} lineHeight={1.5} variant="body3">
        {label}
        {optionalText && (
          <Box color="text.secondary" component="span">
            {' '}
            {optionalText}
          </Box>
        )}
      </Typography>
      <Tooltip arrow placement="top" title={tooltip}>
        <Icon component={ICON_WARNING} sx={WARNING_ICON_SX} />
      </Tooltip>
    </Stack>
    <StyledSwitch
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      size="small"
    />
  </Stack>
);

export const DialogWorkEmailValidation: FC = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isSettingsOpen = Boolean(anchorEl);

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

  const onClickToOpenSettings = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onClickToCloseSettings = () => {
    setAnchorEl(null);
  };

  const onClickToRemoveProvider = () => {
    setSelectedValidationOption(null);
    onClickToCloseSettings();
  };

  return (
    <DialogWorkEmailCollapseCard title={'Validation'}>
      <Stack gap={1.5}>
        {/* Validation provider label */}
        <Typography variant={'body2'}>
          <Box component="span" fontWeight={600}>
            Validation provider
          </Box>
          <Box
            color={'text.secondary'}
            component="span"
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
                    sx={{ opacity: 0.5 }}
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
            <Tooltip placement="top" title="Settings">
              <Icon
                component={ICON_GEAR}
                onClick={onClickToOpenSettings}
                sx={{
                  width: 18,
                  height: 18,
                  cursor: 'pointer',
                  color: '#363440',
                  '&:hover': {
                    opacity: 0.7,
                  },
                }}
              />
            </Tooltip>

            {/* Settings Popover */}
            <Popover
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              onClose={onClickToCloseSettings}
              open={isSettingsOpen}
              slotProps={{
                paper: {
                  sx: {
                    mt: 1,
                    borderRadius: 2,
                  },
                },
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <Stack
                alignItems="center"
                borderRadius={1}
                flexDirection="row"
                gap={1}
                onClick={onClickToRemoveProvider}
                p={0.5}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: '#F0F0F4',
                  },
                }}
              >
                <Icon component={ICON_DELETE} sx={DELETE_ICON_SX} />
                <Typography color="#E26E6E" variant="body2">
                  Remove provider
                </Typography>
              </Stack>
            </Popover>
          </Stack>

          {/* Helper text */}
          <Typography color={'text.secondary'} variant={'body3'}>
            A validation column will be added after each provider
          </Typography>
        </Stack>

        {/* Require validation success toggle */}
        <ToggleRow
          checked={safeToSend}
          label='Only mark "Safe to Send" emails as valid?'
          onChange={setSafeToSend}
          optionalText="- Optional"
          tooltip='By default, catch-all emails will be returned as valid. Turn this setting on to mark catch-all emails as invalid. Only "Safe to Send" emails will be marked as valid.'
        />
        <ToggleRow
          checked={requireValidationSuccess}
          label="Require validation success?"
          onChange={setRequireValidationSuccess}
          tooltip="By default, the waterfall will return data even if there is an error with validation."
        />
      </Stack>
    </DialogWorkEmailCollapseCard>
  );
};
