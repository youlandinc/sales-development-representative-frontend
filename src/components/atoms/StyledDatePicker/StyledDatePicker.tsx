import { TextFieldProps } from '@mui/material';
import { DateTimePicker, DateTimePickerProps } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { FC } from 'react';
import { DEFAULT_TEXTFIELD_STYLE } from '../StyledTextField';

type StyledDatePickerProps = DateTimePickerProps & {
  onClear?: () => void;
  error?: boolean;
  size?: TextFieldProps['size'];
};

export const StyledDatePicker: FC<StyledDatePickerProps> = ({
  onClear,
  slotProps,
  error,
  sx,
  size = 'medium',
  ...rest
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        enableAccessibleFieldDOMStructure={false}
        slotProps={{
          textField: {
            error,
            size,
            sx: [
              DEFAULT_TEXTFIELD_STYLE,
              ...(sx ? (Array.isArray(sx) ? sx : [sx]) : []),
            ],
          },
          field: { clearable: true, onClear: () => onClear?.() },
          openPickerIcon: {
            style: {
              width: 20,
              height: 20,
            },
          },
          ...slotProps,
        }}
        {...rest}
      />
    </LocalizationProvider>
  );
};
