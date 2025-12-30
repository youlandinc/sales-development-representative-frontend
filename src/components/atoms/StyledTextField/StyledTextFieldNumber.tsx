import { FC } from 'react';
import { NumberFormatValues, NumericFormat } from 'react-number-format';
import { InputBaseProps, SxProps } from '@mui/material';

import { StyledTextField } from '@/components/atoms';

export interface StyledTextFieldNumberProps {
  allowNegative?: boolean;
  onValueChange: (values: NumberFormatValues) => void;
  thousandSeparator?: boolean;
  prefix?: string;
  suffix?: string;
  label?: string;
  value: number | string | undefined;
  sx?: SxProps;
  required?: boolean;
  placeholder?: string;
  decimalScale?: number;
  disabled?: boolean;
  validate?: undefined | string[];
  percentage?: boolean;
  error?: boolean | undefined;
  size?: 'small' | 'medium';
  InputProps?: any;
  onBlur?: InputBaseProps['onBlur'];
  isAllowed?: (values: NumberFormatValues) => boolean;
}

export const StyledTextFieldNumber: FC<StyledTextFieldNumberProps> = ({
  allowNegative = false,
  onValueChange,
  prefix,
  suffix,
  value,
  sx,
  decimalScale = 2,
  thousandSeparator = true,
  percentage = false,
  isAllowed,
  ...rest
}) => {
  return (
    <NumericFormat
      {...rest}
      allowNegative={allowNegative}
      autoComplete="off"
      customInput={StyledTextField}
      decimalScale={decimalScale}
      fixedDecimalScale={percentage}
      isAllowed={isAllowed}
      onValueChange={onValueChange}
      prefix={prefix}
      suffix={suffix}
      sx={sx}
      thousandSeparator={thousandSeparator}
      value={value}
      variant="outlined"
    />
  );
};
