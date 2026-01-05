import { FC } from 'react';
import {
  Box,
  Checkbox,
  FormControlLabel,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';

import { QUERY_TOOLTIP_SLOT_PROPS, QueryIcon } from './index';

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
              checkedIcon={<QueryIcon.CheckboxChecked />}
              icon={<QueryIcon.CheckboxUnchecked />}
              indeterminate={indeterminate}
              indeterminateIcon={<QueryIcon.CheckboxIndeterminate />}
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
              <QueryIcon.Info />
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
