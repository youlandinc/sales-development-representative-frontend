import { FC } from 'react';
import { NumberFormatValues, NumericFormat } from 'react-number-format';
import { InputBaseProps, SxProps } from '@mui/material';

import { StyledTextField } from '@/components/atoms';
import { UTypeOf } from '@/utils';

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
  isPercentage?: boolean;
  error?: boolean | undefined;
  size?: 'small' | 'medium';
  InputProps?: any;
  onBlur?: InputBaseProps['onBlur'];
  isAllowed?: (values: NumberFormatValues) => boolean;
  notAllowZero?: boolean;
  maxLength?: number | null;
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
  isPercentage = false,
  isAllowed,
  notAllowZero = false,
  maxLength,
  ...rest
}) => {
  const isMaxLengthValid = UTypeOf.isNumber(maxLength) && maxLength > 0;

  const validateNumberInput = (values: NumberFormatValues) => {
    // Only block input if current value already equals maxLength
    // This allows first correction, then prevents further input
    if (
      isMaxLengthValid &&
      UTypeOf.isNumber(values.floatValue) &&
      values.floatValue > maxLength &&
      UTypeOf.isNumber(value) &&
      value >= maxLength
    ) {
      return false;
    }
    return isAllowed ? isAllowed(values) : true;
  };

  return (
    <NumericFormat
      {...rest}
      allowNegative={allowNegative}
      autoComplete="off"
      customInput={StyledTextField}
      decimalScale={decimalScale}
      fixedDecimalScale={isPercentage}
      isAllowed={validateNumberInput}
      onValueChange={(v) => {
        if (!notAllowZero) {
          if (
            isMaxLengthValid &&
            UTypeOf.isNumber(v.floatValue) &&
            v.floatValue > maxLength
          ) {
            onValueChange({
              ...v,
              floatValue: maxLength,
              value: String(maxLength),
            });
            return;
          }
          onValueChange(v);
          return;
        }

        const floatValue = v.floatValue;

        if (UTypeOf.isNullish(floatValue)) {
          onValueChange({ ...v, floatValue: undefined });
          return;
        }

        let normalizedValue = floatValue === 0 ? 1 : floatValue;

        if (isMaxLengthValid && normalizedValue > maxLength) {
          normalizedValue = maxLength;
        }

        onValueChange({
          ...v,
          floatValue: normalizedValue,
          value: String(normalizedValue),
        });
      }}
      prefix={prefix}
      suffix={suffix}
      sx={sx}
      thousandSeparator={thousandSeparator}
      value={value ?? ''}
      variant="outlined"
    />
  );
};
