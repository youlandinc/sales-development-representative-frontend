import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { FC } from 'react';

import { StyledButtonGroupProps, StyledButtonGroupStyles } from './index';

export const StyledButtonGroup: FC<StyledButtonGroupProps> = ({
  color = 'primary',
  sx,
  value,
  options,
  ...rest
}) => {
  return (
    <ToggleButtonGroup
      color={color}
      exclusive
      sx={[
        {
          ...StyledButtonGroupStyles,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      value={value}
      {...rest}
    >
      {options?.map((item, index) => (
        <ToggleButton
          disableRipple
          key={index}
          size={'medium'}
          sx={{
            '&.MuiToggleButtonGroup-grouped': {
              borderRadius: '8px',
            },
          }}
          value={item.value}
        >
          {item.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};
