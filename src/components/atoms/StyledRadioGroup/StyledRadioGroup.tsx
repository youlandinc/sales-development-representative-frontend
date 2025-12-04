import { FC } from 'react';

import { FormControl, FormLabel, RadioGroup } from '@mui/material';

import { StyledRadioWithLabel, StyledStyledRadioProps } from './index';

export const StyledRadioGroup: FC<StyledStyledRadioProps> = ({
  sx,
  value,
  label,
  options,
  ...rest
}) => {
  return (
    <FormControl>
      {label && <FormLabel>{label}</FormLabel>}
      <RadioGroup
        sx={[
          {
            display: 'flex',
            gap: 1.5,
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        value={value}
        {...rest}
      >
        {options?.map((item, index) => (
          <StyledRadioWithLabel
            disabled={item.disabled}
            key={index}
            label={item.label}
            value={item.value}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};
