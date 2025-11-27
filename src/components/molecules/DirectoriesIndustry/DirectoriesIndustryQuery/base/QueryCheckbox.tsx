import { FC, useMemo } from 'react';
import { Icon, Stack, Tooltip, Typography } from '@mui/material';

import { StyledCheckbox } from '@/components/atoms';

import ICON_INFO from './assets/icon-info.svg';

interface QueryCheckboxProps {
  value?: boolean;
  onFormChange: (checked: boolean) => void;
  disabled?: boolean;
  subLabel?: string | null;
  subDescription?: string | null;
  subTooltip?: string | null;
}

export const QueryCheckbox: FC<QueryCheckboxProps> = ({
  value = false,
  onFormChange,
  disabled = false,
  subLabel,
  subDescription,
  subTooltip,
}) => {
  const renderLabel = useMemo(() => {
    if (!subLabel && !subDescription) {
      return null;
    }

    return (
      <Stack>
        {subLabel && (
          <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 0.5 }}>
            <Typography sx={{ fontSize: 12 }}>{subLabel}</Typography>
            {subTooltip && (
              <Tooltip title={subTooltip}>
                <Icon component={ICON_INFO} sx={{ width: 11, height: 11 }} />
              </Tooltip>
            )}
          </Stack>
        )}
        {subDescription && (
          <Typography sx={{ fontSize: 12, color: '#B0ADBD' }}>
            {subDescription}
          </Typography>
        )}
      </Stack>
    );
  }, [subLabel, subDescription, subTooltip]);

  return (
    <Stack>
      <StyledCheckbox
        checked={value}
        disabled={disabled}
        label={renderLabel}
        onChange={(_, checked) => onFormChange(checked)}
      />
    </Stack>
  );
};
