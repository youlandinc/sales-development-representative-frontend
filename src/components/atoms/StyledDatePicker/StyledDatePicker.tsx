import { FC } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker, DateTimePickerProps } from '@mui/x-date-pickers';

type StyledDatePickerProps = DateTimePickerProps & {
  onClear?: () => void;
  error?: boolean;
};

export const StyledDatePicker: FC<StyledDatePickerProps> = ({
  onClear,
  slotProps,
  error,
  ...rest
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        enableAccessibleFieldDOMStructure={false}
        slotProps={{
          textField: {
            error,
            sx: {
              '& .MuiInputBase-input': {
                px: 2,
                py: 1.5,
                fontSize: 16,
                lineHeight: 1.5,
                height: 'auto',
              },
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
              '& .MuiInputLabel-root': {
                transform: 'translate(16px, 12px) scale(1)',
              },
              '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
                transform: 'translate(14px, -7px) scale(0.75)',
              },
              '& .Mui-error .MuiOutlinedInput-notchedOutline': {
                borderColor: 'error.main',
              },
              '& .Mui-focused.MuiInputLabel-root': {
                transform: 'translate(16px, -7px) scale(0.75)',
              },
              '& .Mui-focused': {
                '& .MuiOutlinedInput-notchedOutline': {
                  border: '1px solid #6E4EFB !important',
                },
              },
            },
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
