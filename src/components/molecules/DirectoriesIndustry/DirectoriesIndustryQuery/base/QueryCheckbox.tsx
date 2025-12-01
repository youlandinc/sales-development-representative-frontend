import { FC } from 'react';
import {
  Checkbox,
  FormControlLabel,
  Icon,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';

import ICON_INFO from './assets/icon-info.svg';
import ICON_STATIC from '@/components/atoms/StyledCheckbox/assets/icon_static.svg';
import ICON_CHECKED from '@/components/atoms/StyledCheckbox/assets/icon_checked.svg';
import ICON_INDETERMINATE from '@/components/atoms/StyledCheckbox/assets/icon_intermediate.svg';

interface QueryCheckboxProps {
  value?: boolean;
  onFormChange: (checked: boolean) => void;
  disabled?: boolean;
  indeterminate?: boolean;
  subLabel?: string | null;
  subDescription?: string | null;
  subTooltip?: string | null;
}

export const QueryCheckbox: FC<QueryCheckboxProps> = ({
  value = false,
  onFormChange,
  disabled = false,
  indeterminate = false,
  subLabel,
  subDescription,
  subTooltip,
}) => {
  return (
    <Stack sx={{ gap: 0.5 }}>
      <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 0.5 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={value}
              checkedIcon={
                <Icon component={ICON_CHECKED} sx={{ width: 20, height: 20 }} />
              }
              icon={
                <Icon component={ICON_STATIC} sx={{ width: 20, height: 20 }} />
              }
              indeterminate={indeterminate}
              indeterminateIcon={
                <Icon
                  component={ICON_INDETERMINATE}
                  sx={{ width: 20, height: 20 }}
                />
              }
              onChange={(_, checked) => onFormChange(checked)}
              sx={{ width: 20, height: 20, padding: 0 }}
            />
          }
          disabled={disabled}
          label={
            <Typography
              sx={{
                fontSize: 12,
                lineHeight: '20px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {subLabel}
            </Typography>
          }
          sx={{
            m: 0,
            gap: 0.5,
            '&.Mui-disabled': {
              '& svg > path': {
                fill: '#BABCBE',
              },
              '& .MuiFormControlLabel-label': {
                color: '#BABCBE',
              },
            },
          }}
        />
        {subTooltip && (
          <Tooltip arrow placement={'top'} title={subTooltip}>
            <Icon component={ICON_INFO} sx={{ width: 12, height: 12 }} />
          </Tooltip>
        )}
      </Stack>
      {subDescription && (
        <Typography sx={{ fontSize: 12, color: '#B0ADBD', ml: 3 }}>
          {subDescription}
        </Typography>
      )}
    </Stack>
  );
};
