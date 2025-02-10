import { FC, forwardRef, useEffect, useState } from 'react';
import {
  NumberFormatValues,
  NumericFormat,
  NumericFormatProps,
} from 'react-number-format';

import { UFormatDollar, UFormatPercent, UNotUndefined } from '@/utils';

import { StyledTextField } from '@/components/atoms';
import { InputBaseProps, SxProps } from '@mui/material';

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
  ...rest
}) => {
  const [text, setText] = useState(value ?? 0);

  useEffect(() => {
    if (UNotUndefined(value) && value) {
      if (thousandSeparator) {
        setText(
          percentage
            ? UFormatPercent((value as number) / 100)
            : UFormatDollar(value),
        );
      } else {
        setText(value);
      }
    } else {
      setText('');
    }
  }, [percentage, thousandSeparator, value]);

  const handledChange = (e: {
    target: { name: string; value: NumberFormatValues };
  }) => {
    onValueChange(e.target.value);
  };

  return (
    <>
      <StyledTextField
        {...rest}
        id="formatted-numberformat-input"
        name="numberformat"
        onBlur={rest.onBlur}
        //eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        onChange={handledChange}
        slotProps={{
          input: {
            ...rest.InputProps,
            inputComponent: NumericFormatCustom as any,
          },
          htmlInput: {
            allowNegative,
            onValueChange,
            prefix,
            suffix,
            value,
            sx,
            decimalScale,
            thousandSeparator,
            fixedDecimalScale: percentage,
            autoComplete: 'off',
          },
        }}
        sx={{
          ...sx,
        }}
        value={text}
        variant="outlined"
      />
    </>
  );
};

interface CustomProps {
  onChange: (event: {
    target: { name: string; value: NumberFormatValues };
  }) => void;
  name: string;
}

const NumericFormatCustom = forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values,
            },
          });
        }}
        valueIsNumericString
        {...other}
      />
    );
  },
);
