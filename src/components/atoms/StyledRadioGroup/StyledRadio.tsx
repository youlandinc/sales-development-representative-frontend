import { FC } from 'react';
import { FormControlLabel, Icon, Radio, RadioProps } from '@mui/material';

import { StyledRadioProps } from './index';

import RADIO_CHECKED from './checked.svg';
import RADIO_STATIC from './static.svg';

export const StyledRadio: FC<RadioProps> = ({ ...rest }) => {
  return (
    <Radio
      checkedIcon={
        <Icon component={RADIO_CHECKED} sx={{ width: 16, height: 16 }} />
      }
      icon={<Icon component={RADIO_STATIC} sx={{ width: 16, height: 16 }} />}
      sx={{
        height: 16,
        width: 24,
        p: 0,
        justifyContent: 'flex-start',
      }}
      {...rest}
    />
  );
};

export const StyledRadioWithLabel: FC<StyledRadioProps> = ({
  label,
  value,
  disabled,
  ...rest
}) => {
  return (
    <FormControlLabel
      control={<StyledRadio {...rest} />}
      disabled={disabled}
      label={label}
      sx={{
        m: 0,
        alignItems: 'flex-start',
        '& .MuiFormControlLabel-label': { fontSize: '12px' },
      }}
      value={value}
    />
  );
};
