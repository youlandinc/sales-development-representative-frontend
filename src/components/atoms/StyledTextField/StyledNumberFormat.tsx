import { FC } from 'react';
import { PatternFormat, PatternFormatProps } from 'react-number-format';

import { StyledTextField, StyledTextFieldProps } from '@/components/atoms';

export type StyledNumberFormatProps = PatternFormatProps<
  Omit<StyledTextFieldProps, 'value' | 'defaultValue' | 'type'>
>;

export const StyledNumberFormat: FC<StyledNumberFormatProps> = ({
  label,
  format = '',
  required,
  className,
  ...rest
}) => {
  return (
    <PatternFormat
      className={className}
      customInput={StyledTextField}
      format={format}
      label={label}
      required={required}
      valueIsNumericString
      {...rest}
    />
  );
};
