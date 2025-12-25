import { FC } from 'react';
import {
  Box,
  Checkbox,
  FormControlLabel,
  Icon,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';

import { StyledImage } from '@/components/atoms';
import { QUERY_TOOLTIP_SLOT_PROPS } from './index';

import ICON_INFO from './assets/icon-info.svg';

const CHECKBOX_ICON_SX = { width: 20, height: 20, position: 'relative' };

const CHECKBOX_CHECKED_ICON = (
  <StyledImage sx={CHECKBOX_ICON_SX} url="/images/icon-checkbox-check.svg" />
);

const CHECKBOX_UNCHECKED_ICON = (
  <StyledImage sx={CHECKBOX_ICON_SX} url="/images/icon-checkbox-static.svg" />
);

const CHECKBOX_INDETERMINATE_ICON = (
  <StyledImage
    sx={CHECKBOX_ICON_SX}
    url="/images/icon-checkbox-intermediate.svg"
  />
);

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
              checkedIcon={CHECKBOX_CHECKED_ICON}
              icon={CHECKBOX_UNCHECKED_ICON}
              indeterminate={indeterminate}
              indeterminateIcon={CHECKBOX_INDETERMINATE_ICON}
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
          <Tooltip
            arrow
            placement={'top'}
            slotProps={QUERY_TOOLTIP_SLOT_PROPS}
            title={subTooltip}
          >
            <Box>
              <Icon component={ICON_INFO} sx={{ width: 12, height: 12 }} />
            </Box>
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
